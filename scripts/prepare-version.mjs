// Mechanical release-version synchronization. Does not publish, tag, or touch credentials.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, extname, basename } from "node:path";
const root = resolve(import.meta.dirname, "..");
const next = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(next || "")) throw new Error("Usage: node scripts/prepare-version.mjs 1.1.0");
const manifest = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const previous = manifest.version;
if (previous === next) { console.log(`Already at ${next}`); process.exit(0); }
const ignored = new Set(["node_modules", "dist", ".git", "bin", "obj", "artifacts", "test-results", ".test-results", "playwright-report", "coverage", "compatibility", "generated", "Generated", "wwwroot"]);
let count = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const file = resolve(dir, entry.name), rel = relative(root, file).replaceAll("\\", "/");
    if (entry.isDirectory()) { await walk(file); continue; }
    if (!/\.(json|mjs|js|ts|tsx|vue|css|cs|csproj|razor|md|html|yml|yaml)$/.test(file)) continue;
    if (["CHANGELOG.md", "package-lock.json"].includes(basename(file)) || ["docs/releasing.md", "scripts/verify-legacy.mjs", "scripts/prepare-version.mjs"].includes(rel)) continue;
    const before = await readFile(file, "utf8");
    // Historical baseline versions remain immutable when active metadata advances.
    const protectedText = before.replace(/(baselineVersion["']?\s*:\s*["']|"stableTarget"\s*:\s*")1\.0\.0/g, "$1__BASELINE_1_0_0__");
    const after = protectedText.replaceAll(previous, next).replaceAll("__BASELINE_1_0_0__", "1.0.0");
    if (after !== before) { await writeFile(file, after); count++; }
  }
}
await walk(root);
for (const name of ["css", "vue", "react", "angularjs", "blazor"]) {
  const file = resolve(root, "packages", name, "package-lock.json");
  const lock = JSON.parse(await readFile(file, "utf8"));
  lock.version = next;
  if (lock.packages?.[""]) lock.packages[""].version = next;
  for (const [key, pkg] of Object.entries(lock.packages || {})) {
    if (key === "../css" || pkg.name === "@gardenerim/css") pkg.version = next;
    if ((key === "" || key === "../css") && pkg.peerDependencies?.["@gardenerim/css"]) pkg.peerDependencies["@gardenerim/css"] = `>=${next} <${Number(next.split('.')[0]) + 1}.0.0`;
  }
  await writeFile(file, JSON.stringify(lock, null, 2) + "\n");
}
console.log(`Prepared ${previous} -> ${next}: ${count} active files and 5 lockfile roots; historical changelogs and published baseline retained.`);
