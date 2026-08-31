import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const budget = JSON.parse(await readFile(resolve(root, "config/performance-budgets.json"), "utf8"));
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("npm_execpath is unavailable");
const packed = spawnSync(process.execPath, [npmCli, "pack", "--dry-run", "--json", "--ignore-scripts"], { cwd: root, encoding: "utf8", windowsHide: true });
if (packed.status !== 0) throw new Error(packed.error?.message || packed.stderr || "npm pack failed");
const [info] = JSON.parse(packed.stdout);
const files = new Set(info.files.map(({ path }) => path));
for (const target of ["dist/index.js", "dist/index.d.ts", "dist/gardener-angularjs.min.js", "dist/gardener-angularjs.min.js.map", "dist/style.css", "dist/generated/components.js", "dist/generated/components.d.ts", "dist/catalog.json", "dist/component-css/forms.css", "metadata/public-api.json", "metadata/public-api.schema.json", "metadata/compatibility.schema.json", "metadata/performance.schema.json", "docs/components.md", "docs/security.md"]) if (!files.has(target)) throw new Error(`package is missing ${target}`);
if (info.version !== pkg.version) throw new Error("packed version mismatch");
if (info.size > budget.package.packed || info.unpackedSize > budget.package.unpacked || info.entryCount > budget.package.files) throw new Error(`package budget exceeded: ${info.size}/${info.unpackedSize}/${info.entryCount}`);
if ([...files].some((file) => /^(src|scripts|tests|examples|node_modules)\//u.test(file))) throw new Error("development files leaked into package");
for (const exportKey of Object.keys(pkg.exports).filter((key) => !key.includes("*"))) {
  const specifier = exportKey === "." ? pkg.name : `${pkg.name}${exportKey.slice(1)}`;
  await access(fileURLToPath(import.meta.resolve(specifier)));
}
const cssTargets = ["@gardenerim/angularjs/component-css/forms", "@gardenerim/angularjs/component-css/forms.css"].map((specifier) => fileURLToPath(import.meta.resolve(specifier)));
for (const target of cssTargets) await access(target);
if (new Set(cssTargets).size !== 1) throw new Error("component CSS aliases do not resolve to the same artifact");
const modules = Object.fromEntries(await Promise.all(["@gardenerim/angularjs", "@gardenerim/angularjs/components", "@gardenerim/angularjs/directives", "@gardenerim/angularjs/services", "@gardenerim/angularjs/module", "@gardenerim/angularjs/adapters", "@gardenerim/angularjs/tauri", "@gardenerim/angularjs/electron", "@gardenerim/angularjs/catalog"].map(async (specifier) => [specifier, await import(specifier)])));
if (Object.keys(modules["@gardenerim/angularjs/components"].gardenerimDirectives).length !== 506) throw new Error("installed components entrypoint is incomplete");
if (modules["@gardenerim/angularjs/catalog"].componentCatalog.length !== 506) throw new Error("installed catalog entrypoint is incomplete");
if (!("createGardenerimAngularJS" in modules["@gardenerim/angularjs/module"]) || !("GardenerimThemeFactory" in modules["@gardenerim/angularjs/services"])) throw new Error("installed module/service entrypoints are incomplete");
if (!("bindTauriWindowControls" in modules["@gardenerim/angularjs/tauri"]) || "bindElectronWindowControls" in modules["@gardenerim/angularjs/tauri"]) throw new Error("Tauri entrypoint is not isolated");
if (!("bindElectronWindowControls" in modules["@gardenerim/angularjs/electron"]) || "bindTauriWindowControls" in modules["@gardenerim/angularjs/electron"]) throw new Error("Electron entrypoint is not isolated");
console.log(`Package verification passed: ${info.entryCount} files, ${info.size} B packed, ${info.unpackedSize} B unpacked.`);
