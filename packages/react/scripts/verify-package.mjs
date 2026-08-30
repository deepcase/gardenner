import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
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
for (const target of ["dist/index.js", "dist/index.d.ts", "dist/gardener-react.min.js", "dist/gardener-react.min.js.map", "dist/style.css", "dist/generated/components.js", "dist/generated/components.d.ts", "dist/catalog.json", "dist/component-css/forms.css", "metadata/public-api.json", "metadata/public-api.schema.json", "metadata/compatibility.schema.json", "metadata/performance.schema.json", "docs/components.md"]) if (!files.has(target)) throw new Error(`package is missing ${target}`);
if (info.version !== pkg.version) throw new Error("packed version mismatch");
if (info.size > budget.package.packed || info.unpackedSize > budget.package.unpacked || info.entryCount > budget.package.files) throw new Error(`package budget exceeded: ${info.size}/${info.unpackedSize}/${info.entryCount}`);
if ([...files].some((file) => /^(src|scripts|tests|examples|node_modules)\//u.test(file))) throw new Error("development files leaked into package");
const componentCssTargets = ["@gardenerim/react/component-css/forms", "@gardenerim/react/component-css/forms.css"].map((specifier) => fileURLToPath(import.meta.resolve(specifier)));
for (const target of componentCssTargets) await access(target);
if (new Set(componentCssTargets).size !== 1) throw new Error("component CSS extension and extensionless exports do not resolve to the same artifact");
const modules = Object.fromEntries(await Promise.all([
  "@gardenerim/react", "@gardenerim/react/components", "@gardenerim/react/component", "@gardenerim/react/hooks", "@gardenerim/react/provider",
  "@gardenerim/react/adapters", "@gardenerim/react/tauri", "@gardenerim/react/electron", "@gardenerim/react/catalog",
].map(async (specifier) => [specifier, await import(specifier)])));
if (Object.keys(modules["@gardenerim/react/components"].gardenerComponents).length !== 506) throw new Error("installed components entrypoint is incomplete");
if (modules["@gardenerim/react/catalog"].componentCatalog.length !== 506) throw new Error("installed catalog entrypoint is incomplete");
if (!("useGardener" in modules["@gardenerim/react/hooks"]) || !("GardenerProvider" in modules["@gardenerim/react/provider"])) throw new Error("installed hook/provider entrypoints are incomplete");
if (!("bindTauriWindowControls" in modules["@gardenerim/react/tauri"]) || "bindElectronWindowControls" in modules["@gardenerim/react/tauri"]) throw new Error("Tauri entrypoint is not isolated");
if (!("bindElectronWindowControls" in modules["@gardenerim/react/electron"]) || "bindTauriWindowControls" in modules["@gardenerim/react/electron"]) throw new Error("Electron entrypoint is not isolated");
console.log(`Package verification passed: ${info.entryCount} files, ${info.size} B packed, ${info.unpackedSize} B unpacked.`);
