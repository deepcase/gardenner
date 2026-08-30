import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
const inventory = async (directory, prefix = "") => {
  const result = {};
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) Object.assign(result, await inventory(resolve(directory, entry.name), relative));
    else result[relative] = createHash("sha256").update(await readFile(resolve(directory, entry.name))).digest("hex");
  }
  return result;
};
const before = await inventory(dist);
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("npm_execpath is unavailable");
const run = spawnSync(process.execPath, [npmCli, "run", "build"], { cwd: root, encoding: "utf8", windowsHide: true });
if (run.status !== 0) throw new Error(run.error?.message || run.stderr || run.stdout || "rebuild failed");
const after = await inventory(dist);
if (JSON.stringify(before) !== JSON.stringify(after)) throw new Error("build output is not reproducible");
console.log(`Reproducible build passed: ${Object.keys(after).length} generated files are byte-identical.`);
