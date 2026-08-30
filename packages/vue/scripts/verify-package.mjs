import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const budget = JSON.parse(await readFile(resolve(root, "config", "performance-budgets.json"), "utf8"));
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("npm_execpath is unavailable");
const packed = spawnSync(process.execPath, [npmCli, "pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: root, encoding: "utf8", windowsHide: true });
if (packed.status !== 0) throw new Error(packed.error?.message || packed.stderr || "npm pack failed");
const [info] = JSON.parse(packed.stdout);
const files = new Set(info.files.map(({ path }) => path));
for (const target of ["dist/index.js", "dist/index.d.ts", "dist/gardener-vue.min.js", "dist/gardener-vue.min.js.map", "dist/style.css", "dist/generated/components.js", "dist/generated/components.d.ts", "dist/catalog.json", "dist/component-css/forms.css", "metadata/public-api.json", "metadata/public-api.schema.json", "metadata/compatibility.schema.json", "metadata/performance.schema.json", "docs/components.md"]) if (!files.has(target)) throw new Error(`package is missing ${target}`);
if (info.version !== pkg.version) throw new Error("packed version mismatch");
if (info.size > budget.package.packed || info.unpackedSize > budget.package.unpacked || info.entryCount > budget.package.files) throw new Error("package budget exceeded");
if ([...files].some((file) => /^(src|scripts|tests|examples|node_modules)\//u.test(file))) throw new Error("development files leaked into package");
console.log(`Package verification passed: ${info.entryCount} files, ${info.size} B packed, ${info.unpackedSize} B unpacked.`);
