import { componentContracts } from "../../../scripts/component-contracts.mjs";
import { mkdir, readFile } from "node:fs/promises";
import { writeFile } from "../../../scripts/fs-retry.mjs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cssRoot = resolve(root, "..", "css");
const source = JSON.parse(await readFile(resolve(cssRoot, "metadata", "components.json"), "utf8"));
const publicApi = JSON.parse(await readFile(resolve(cssRoot, "metadata", "public-api.json"), "utf8"));
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const generated = resolve(root, "src", "generated");
await mkdir(generated, { recursive: true });

const pascal = (name) => `G${name.split(/[^a-zA-Z0-9]+/u).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;
const camel = (value) => value[0].toLowerCase() + value.slice(1);
const tags = new Map([
  ["button", "button"], ["input", "input"], ["textarea", "textarea"], ["select", "select"], ["form", "form"],
  ["table", "table"], ["navbar", "nav"], ["breadcrumb", "nav"], ["sidebar", "aside"], ["main-region", "main"],
  ["header-region", "header"], ["footer-region", "footer"], ["article", "article"], ["section", "section"], ["link", "a"],
]);
const rootClassOverrides = new Map([
  ["combobox", "g-combobox"], ["tabs", "g-tabs"], ["dialog", "g-dialog-backdrop"], ["drawer", "g-drawer-backdrop"],
  ["popover", "g-popover"], ["toast", "g-toast"], ["accordion", "g-accordion"], ["data-grid", "g-data-grid"],
  ["tree", "g-tree"], ["carousel", "g-carousel"], ["split-pane", "g-split-pane"],
]);
const className = (component) => (component.cssSelector || component.selector).match(/\.([_a-zA-Z][\w-]*)/u)?.[1] || rootClassOverrides.get(component.name);
const definitions = source.components.map((component) => {
  const componentName = pascal(component.name);
  return {
    name: component.name,
    exportName: `${componentName}Directive`,
    directiveName: camel(componentName),
    elementName: camel(componentName).replace(/([a-z0-9])([A-Z])/gu, "$1-$2").toLowerCase(),
    category: component.category,
    type: component.type,
    selector: component.selector,
    ...(component.cssSelector ? { cssSelector: component.cssSelector } : {}),
    ...(className(component) ? { className: className(component) } : {}),
    tag: tags.get(component.name) || "div",
    variants: component.variants || [], states: component.states || [], parts: component.parts || [],
    behaviors: component.behaviors || [], platforms: component.platforms || [],
  };
});

for (const key of ["name", "exportName", "directiveName", "elementName"]) {
  if (new Set(definitions.map((item) => item[key])).size !== definitions.length) throw new Error(`Duplicate AngularJS component ${key}`);
}
if (definitions.length !== 506) throw new Error(`Expected 506 CSS components, received ${definitions.length}`);
if (publicApi.javascript.behaviors.length !== 72) throw new Error("Expected 72 Gardenerim behaviors");

const frameworkExports = [
  "GARDENERIM_ANGULARJS_MODULE", "Gardenerim", "GardenerimRuntimeFactory", "GardenerimThemeFactory", "GardenerimToastFactory",
  "behaviorAttributes", "bindElectronWindowControls", "bindTauriWindowControls", "componentByDirectiveName", "componentByExportName",
  "componentByName", "componentCatalog", "configAttributes", "createElectronWindowService", "createGardenerimAngularJS",
  "configure", "createGardenerimComponent", "createTauriWindowService", "destroy", "disconnect", "emit", "gardenerimBehaviorDirective", "gardenerimDirectives",
  "gardenerimProviderDirective", "getConfiguration", "getInstance", "init", "observe", "refresh", "register", "start", "stop", "supportedLocales", "themeAttributes", "themeAxes", "toast",
];
const typeExports = [
  "GardenerimAngularJSComponentExportName", "GardenerimAngularJSComponentName", "GardenerimAngularJSDirectiveFactory", "GardenerimAngularJSDirectiveName", "GardenerimAngularJSModule",
  "GardenerimAngularJSOptions", "GardenerimAngularJSStatic", "GardenerimBehaviorInstance", "GardenerimBehaviorName", "GardenerimComponentDefinition",
  "GardenerimComponentHandle", "GardenerimComponentKind", "GardenerimConfigValue", "GardenerimElectronBinding", "GardenerimElectronBridge",
  "GardenerimEventName", "GardenerimPlatform", "GardenerimRuntimeService", "GardenerimTauriBinding", "GardenerimTauriBridge", "GardenerimThemeAxis",
  "GardenerimThemeService", "GardenerimThemeState", "GardenerimValueChangeLocals",
];
const componentAttributes = ["gardenerVariant", "gardenerState", "gardenerConfig", "gardenerInitialize", "ngModel", "gardenerValueEvent", "gardenerValueKey", "gardenerOnValueChange"];
const componentHandleMembers = ["element", "getInstance", "refresh", "destroy"];
const themeAxes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];
const services = ["GardenerimRuntime", "GardenerimTheme", "GardenerimToast"];
const directives = ["gGardenerim", "gardenerProvider"];
const packageEntrypoints = Object.keys(pkg.exports);
const moduleExports = [...definitions.map(({ exportName }) => exportName), ...frameworkExports].sort();

await writeFile(resolve(generated, "catalog.ts"), `/** Generated from @gardenerim/css 2.1.0 metadata. */\nimport type { GardenerimComponentDefinition } from "../types.js";\n\nexport const componentCatalog: readonly GardenerimComponentDefinition[] = ${JSON.stringify(definitions, null, 2)};\nexport const componentByName = new Map(componentCatalog.map((component) => [component.name, component] as const));\nexport const componentByExportName = new Map(componentCatalog.map((component) => [component.exportName, component] as const));\nexport const componentByDirectiveName = new Map(componentCatalog.map((component) => [component.directiveName, component] as const));\n`);
const exports = definitions.map((definition) => `export const ${definition.exportName} = /* @__PURE__ */ createGardenerimComponent(${JSON.stringify(definition)} as GardenerimComponentDefinition);`).join("\n");
const registry = definitions.map(({ directiveName, exportName }) => `  ${directiveName}: ${exportName},`).join("\n");
const componentUnion = definitions.map(({ name }) => JSON.stringify(name)).join(" | ");
const componentExportUnion = definitions.map(({ exportName }) => JSON.stringify(exportName)).join(" | ");
const directiveUnion = definitions.map(({ directiveName }) => JSON.stringify(directiveName)).join(" | ");
await writeFile(resolve(generated, "components.ts"), `/** Generated AngularJS bindings for all Gardenerim components. */\nimport { createGardenerimComponent } from "../directives.js";\nimport type { GardenerimAngularJSDirectiveFactory, GardenerimComponentDefinition } from "../types.js";\n\n${exports}\n\nexport type GardenerimAngularJSComponentName = ${componentUnion};\nexport type GardenerimAngularJSComponentExportName = ${componentExportUnion};\nexport type GardenerimAngularJSDirectiveName = ${directiveUnion};\nexport const gardenerimDirectives: Readonly<Record<GardenerimAngularJSDirectiveName, GardenerimAngularJSDirectiveFactory>> = {\n${registry}\n};\n`);

await mkdir(resolve(root, "metadata"), { recursive: true });
const metadata = {
  $schema: "./public-api.schema.json", schemaVersion: 1, version: "2.1.0", status: "stable", cssVersion: "2.1.0",
  angularjs: ">=1.8.2 <1.9.0", components: definitions.length, behaviors: publicApi.javascript.behaviors.length,
  componentExports: definitions.map(({ exportName }) => exportName), directiveNames: definitions.map(({ directiveName }) => directiveName),
  elementNames: definitions.map(({ elementName }) => elementName), moduleExports, typeExports, packageEntrypoints, services, directives,
  componentAttributes, componentHandleMembers, themeAxes, moduleFactory: "createGardenerimAngularJS",
};
await writeFile(resolve(root, "metadata", "public-api.json"), `${JSON.stringify(metadata, null, 2)}\n`);
await writeFile(resolve(root, "metadata", "compatibility.json"), `${JSON.stringify({
  $schema: "./compatibility.schema.json", schemaVersion: 1, version: "2.1.0", baselineVersion: "2.1.0",
  policy: { stage: "stable", additions: "allowed", removals: "deprecate-before-removal" },
  baseline: { angularjs: metadata.angularjs, packageEntrypoints, componentNames: definitions.map(({ name }) => name), componentExports: metadata.componentExports, directiveNames: metadata.directiveNames, elementNames: metadata.elementNames, moduleExports, typeExports, behaviors: publicApi.javascript.behaviors, services, directives, componentAttributes, componentHandleMembers, themeAxes },
}, null, 2)}\n`);

await mkdir(resolve(root, "docs"), { recursive: true });
const table = definitions.map((item) => `| \`${item.exportName}\` | \`${item.elementName}\` / \`${item.directiveName}\` | \`${item.name}\` | ${item.category} | ${item.type} | \`${item.className || item.selector}\` | ${item.behaviors.join(", ") || "—"} |`).join("\n");
await writeFile(resolve(root, "docs", "components.md"), `# Gardenerim AngularJS 组件完整目录\n\n本目录由 \`@gardenerim/css@2.1.0\` 元数据自动生成，共 ${definitions.length} 个 AngularJS 组件指令，无省略。每项同时支持元素与属性形式，并支持 \`${componentAttributes.join("\`、\`")}\`。\n\n| ESM 导出 | 元素 / 指令名 | CSS 组件 | 分类 | 类型 | 根选择器/类 | 行为 |\n| --- | --- | --- | --- | --- | --- | --- |\n${table}\n`);
console.log(`Generated ${definitions.length} AngularJS directives and ${publicApi.javascript.behaviors.length} behavior bindings.`);

await writeFile(resolve(generated, "contracts.ts"), componentContracts(source.components));
