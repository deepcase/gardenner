import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const npmCommand = process.platform === "win32" ? (process.env.ComSpec || process.env.COMSPEC || "cmd.exe") : "npm";
const args = process.platform === "win32" ? ["/d", "/c", "npm pack --dry-run --json --ignore-scripts"] : ["pack", "--dry-run", "--json", "--ignore-scripts"];
const packed = spawnSync(npmCommand, args, { cwd: root, encoding: "utf8", windowsHide: true });
if (packed.status !== 0) throw new Error(packed.stderr || packed.stdout);
const report = JSON.parse(packed.stdout)[0];
const files = new Set(report.files.map(({ path }) => path.replaceAll("\\", "/")));
const errors = [];
const visitTargets = (value) => typeof value === "string" ? [value] : Object.values(value).flatMap(visitTargets);

for (const target of Object.values(pkg.exports).flatMap(visitTargets)) {
  const relative = target.replace(/^\.\//, "");
  if (relative.includes("*")) continue;
  if (!existsSync(join(root, relative))) errors.push(`export target does not exist: ${target}`);
  if (!files.has(relative)) errors.push(`export target is absent from npm package: ${target}`);
}
for (const required of ["dist/gardener.d.ts", "dist/gardener.tauri.d.ts", "dist/gardener.electron.d.ts", "dist/gardener.compatibility.json", "metadata/compatibility.schema.json", "LICENSE", "README.md", "CHANGELOG.md"]) {
  if (!files.has(required)) errors.push(`required release file is missing: ${required}`);
}
for (const forbidden of ["src/", "tests/", "examples/", "config/", ".test-results/"]) {
  if ([...files].some((file) => file.startsWith(forbidden))) errors.push(`development-only path leaked into package: ${forbidden}`);
}
if (pkg.types !== "./dist/gardener.d.ts") errors.push("package types must point to the generated runtime declarations");
if (pkg.style !== "./dist/gardener.css") errors.push("package style must point to the full readable CSS entry");
if (!pkg.sideEffects.includes("dist/gardener.runtime.js") || !pkg.sideEffects.includes("dist/gardener.runtime.min.js")) errors.push("runtime auto-initialization must be marked as a package side effect");
if (pkg.publishConfig?.access !== "public" || pkg.publishConfig?.provenance !== true) errors.push("public provenance-enabled publishing policy is missing");

if (errors.length) {
  console.error(`Package verification failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Package verification passed: ${report.entryCount} files, ${report.size} B packed, ${report.unpackedSize} B unpacked.`);
}
