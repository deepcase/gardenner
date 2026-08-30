import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve(import.meta.dirname, "..");
const budgets = JSON.parse(await readFile(resolve(root, "config", "performance-budgets.json"), "utf8"));
const files = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map((entry) => entry.isDirectory() ? files(resolve(directory, entry.name)) : [resolve(directory, entry.name)]))).flat();
const total = async (paths) => (await Promise.all(paths.map((path) => stat(path)))).reduce((sum, item) => sum + item.size, 0);
const assemblyPath = resolve(root, "src", "Gardener.Blazor", "bin", "Release", "net10.0", "Gardener.Blazor.dll");
const assetPaths = await files(resolve(root, "src", "Gardener.Blazor", "wwwroot"));
const generatedPaths = await files(resolve(root, "src", "Gardener.Blazor", "Generated"));
const entrypointFiles = {
  css: resolve(root, "src", "Gardener.Blazor", "wwwroot", "gardener.min.css"),
  runtime: resolve(root, "src", "Gardener.Blazor", "wwwroot", "gardener.runtime.min.js"),
  blazor: resolve(root, "src", "Gardener.Blazor", "wwwroot", "gardener.blazor.js")
};
const entrypoints = Object.fromEntries(await Promise.all(Object.entries(entrypointFiles).map(async ([name, path]) => {
  const content = await readFile(path);
  return [name, { bytes: content.length, gzipBytes: gzipSync(content, { level: 9 }).length, budget: budgets.entrypoints[name].bytes, gzipBudget: budgets.entrypoints[name].gzipBytes }];
})));
const report = {
  version: "1.0.0",
  measuredAt: new Date().toISOString(),
  assembly: { bytes: (await stat(assemblyPath)).size, budget: budgets.assembly.bytes },
  staticAssets: { bytes: await total(assetPaths), files: assetPaths.length, budget: budgets.staticAssets.bytes },
  entrypoints,
  generatedSource: { bytes: await total(generatedPaths), files: generatedPaths.length, budget: budgets.generatedSource.bytes }
};
const nupkgs = await readdir(resolve(root, "artifacts")).catch(() => []);
const packageName = nupkgs.find((name) => /^Gardener\.Blazor\.1\.0\.0\.nupkg$/i.test(name));
if (packageName) report.package = { bytes: (await stat(resolve(root, "artifacts", packageName))).size, budget: budgets.package.bytes };
const failures = Object.entries(report).filter(([, value]) => value && typeof value === "object" && "bytes" in value && value.bytes > value.budget).map(([name, value]) => `${name}: ${value.bytes} > ${value.budget}`);
for (const [name, value] of Object.entries(entrypoints)) {
  if (value.bytes > value.budget) failures.push(`${name}: ${value.bytes} > ${value.budget}`);
  if (value.gzipBytes > value.gzipBudget) failures.push(`${name} gzip: ${value.gzipBytes} > ${value.gzipBudget}`);
}
await mkdir(resolve(root, "artifacts"), { recursive: true });
await writeFile(resolve(root, "artifacts", "gardener-blazor.performance.json"), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) { console.error(`Performance budgets failed:\n${failures.join("\n")}`); process.exit(1); }
console.log(`Performance budgets passed: assembly ${report.assembly.bytes} B; static ${report.staticAssets.bytes} B; CSS gzip ${entrypoints.css.gzipBytes} B; runtime gzip ${entrypoints.runtime.gzipBytes} B.`);
