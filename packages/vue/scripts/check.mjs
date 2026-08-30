import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const api = JSON.parse(await readFile(resolve(root, "metadata", "public-api.json"), "utf8"));
const compatibility = JSON.parse(await readFile(resolve(root, "metadata", "compatibility.json"), "utf8"));
const css = JSON.parse(await readFile(resolve(root, "..", "css", "metadata", "components.json"), "utf8"));
const runtime = JSON.parse(await readFile(resolve(root, "..", "css", "metadata", "public-api.json"), "utf8"));
const componentDocs = await readFile(resolve(root, "docs", "components.md"), "utf8");
const catalog = await import(pathToFileURL(resolve(root, "dist", "generated", "catalog.js")).href);
const components = await import(pathToFileURL(resolve(root, "dist", "generated", "components.js")).href);
const module = await import(pathToFileURL(resolve(root, "dist", "index.js")).href);
const errors = [];
if (pkg.version !== "1.0.0" || api.version !== pkg.version || api.status !== "stable") errors.push("version/status is not Stable 1.0.0");
if (catalog.componentCatalog.length !== css.components.length || css.components.length !== 506) errors.push("component catalog is incomplete");
if (Object.keys(components.gardenerComponents).length !== css.components.length) errors.push("generated component registry is incomplete");
if (api.behaviors !== runtime.javascript.behaviors.length || api.behaviors !== 66) errors.push("runtime behavior coverage is incomplete");
if (JSON.stringify(api.packageEntrypoints) !== JSON.stringify(Object.keys(pkg.exports))) errors.push("package exports differ from the public API");
if (JSON.stringify(compatibility.baseline.packageEntrypoints) !== JSON.stringify(Object.keys(pkg.exports))) errors.push("package exports differ from the compatibility baseline");
if (JSON.stringify(api.moduleExports) !== JSON.stringify(Object.keys(module).sort())) errors.push("root module exports differ from the public API");
if (JSON.stringify(compatibility.baseline.moduleExports) !== JSON.stringify(Object.keys(module).sort())) errors.push("root module exports differ from the compatibility baseline");
if (compatibility.baseline.componentNames.length !== 506 || compatibility.baseline.componentExports.length !== 506) errors.push("compatibility baseline is incomplete");
if ((componentDocs.match(/^\| `G[^`]+` \|/gmu) ?? []).length !== 506) errors.push("component documentation is incomplete");
for (const definition of catalog.componentCatalog) {
  if (!components.gardenerComponents[definition.exportName]) errors.push(`missing component export: ${definition.exportName}`);
  for (const behavior of definition.behaviors) if (!runtime.javascript.behaviors.includes(behavior)) errors.push(`unknown component behavior: ${definition.name}/${behavior}`);
}
if (errors.length) throw new Error(`Gardener Vue check failed:\n- ${errors.join("\n- ")}`);
console.log(`Checks passed: ${css.components.length} Vue components, ${api.behaviors} behaviors, ${Object.keys(pkg.exports).length} package entrypoints.`);
