import { readdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { contentIntegrity } from "./lib/build-tools.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

async function outputFiles(directory = dist) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = join(directory, entry.name);
    const path = relative(dist, absolute).replaceAll("\\", "/");
    if (path === "custom" || path.startsWith("custom/") || path === "gardener.performance.json") continue;
    if (entry.isDirectory()) files.push(...await outputFiles(absolute));
    else files.push(path);
  }
  return files.sort();
}

async function snapshot() {
  const files = await outputFiles();
  return Object.fromEntries(await Promise.all(files.map(async (file) => [
    file,
    contentIntegrity(await readFile(join(dist, file))).sha256,
  ])));
}

const before = await snapshot();
const rebuilt = spawnSync(process.execPath, ["scripts/build.mjs"], {
  cwd: root,
  encoding: "utf8",
  windowsHide: true,
});
if (rebuilt.status !== 0) throw new Error(`Reproducibility rebuild failed:\n${rebuilt.stderr || rebuilt.stdout}`);
const after = await snapshot();
const beforeFiles = Object.keys(before);
const afterFiles = Object.keys(after);
const errors = [];
if (JSON.stringify(beforeFiles) !== JSON.stringify(afterFiles)) errors.push("build output inventory changed between consecutive builds");
for (const file of new Set([...beforeFiles, ...afterFiles])) {
  if (before[file] !== after[file]) errors.push(`${file}: ${before[file] || "missing"} != ${after[file] || "missing"}`);
}
if (errors.length) throw new Error(`Build is not reproducible:\n- ${errors.join("\n- ")}`);
console.log(`Reproducible build passed: ${afterFiles.length} generated files are byte-identical.`);
