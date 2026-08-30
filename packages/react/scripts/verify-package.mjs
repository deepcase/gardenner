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
const componentCssTargets = ["@gardener/react/component-css/forms", "@gardener/react/component-css/forms.css"].map((specifier) => fileURLToPath(import.meta.resolve(specifier)));
for (const target of componentCssTargets) await access(target);
if (new Set(componentCssTargets).size !== 1) throw new Error("component CSS extension and extensionless exports do not resolve to the same artifact");
const modules = Object.fromEntries(await Promise.all([
  "@gardener/react", "@gardener/react/components", "@gardener/react/component", "@gardener/react/hooks", "@gardener/react/provider",
  "@gardener/react/adapters", "@gardener/react/tauri", "@gardener/react/electron", "@gardener/react/catalog",
].map(async (specifier) => [specifier, await import(specifier)])));
if (Object.keys(modules["@gardener/react/components"].gardenerComponents).length !== 506) throw new Error("installed components entrypoint is incomplete");
if (modules["@gardener/react/catalog"].componentCatalog.length !== 506) throw new Error("installed catalog entrypoint is incomplete");
if (!("useGardener" in modules["@gardener/react/hooks"]) || !("GardenerProvider" in modules["@gardener/react/provider"])) throw new Error("installed hook/provider entrypoints are incomplete");
if (!("bindTauriWindowControls" in modules["@gardener/react/tauri"]) || "bindElectronWindowControls" in modules["@gardener/react/tauri"]) throw new Error("Tauri entrypoint is not isolated");
if (!("bindElectronWindowControls" in modules["@gardener/react/electron"]) || "bindTauriWindowControls" in modules["@gardener/react/electron"]) throw new Error("Electron entrypoint is not isolated");
console.log(`Package verification passed: ${info.entryCount} files, ${info.size} B packed, ${info.unpackedSize} B unpacked.`);
