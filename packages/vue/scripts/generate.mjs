import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cssRoot = resolve(root, "..", "css");
const source = JSON.parse(await readFile(resolve(cssRoot, "metadata", "components.json"), "utf8"));
const publicApi = JSON.parse(await readFile(resolve(cssRoot, "metadata", "public-api.json"), "utf8"));
const generated = resolve(root, "src", "generated");
await mkdir(generated, { recursive: true });

const pascal = (name) => `G${name.split(/[^a-zA-Z0-9]+/u).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;
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
const definitions = source.components.map((component) => ({
  name: component.name,
  exportName: pascal(component.name),
  category: component.category,
  type: component.type,
  selector: component.selector,
  ...(component.cssSelector ? { cssSelector: component.cssSelector } : {}),
  ...(className(component) ? { className: className(component) } : {}),
  tag: tags.get(component.name) || "div",
  variants: component.variants || [],
  states: component.states || [],
  parts: component.parts || [],
  behaviors: component.behaviors || [],
  platforms: component.platforms || [],
}));

const exports = new Set();
for (const definition of definitions) {
  if (exports.has(definition.exportName)) throw new Error(`Duplicate Vue component export: ${definition.exportName}`);
  exports.add(definition.exportName);
}
if (definitions.length !== 506) throw new Error(`Expected 506 CSS components, received ${definitions.length}`);
if (publicApi.javascript.behaviors.length !== 66) throw new Error("Expected 66 Gardener behaviors");
const frameworkExports = [
  "Gardener", "GardenerComponent", "GardenerPart", "GardenerProvider", "GardenerVue", "behaviorAttributes",
  "bindElectronWindowControls", "bindTauriWindowControls", "componentByExportName", "componentByName", "componentCatalog",
  "configAttributes", "createGardenerComponent", "createGardenerVue", "default", "destroy", "emit", "gardenerComponents",
  "getInstance", "init", "observe", "register", "themeAttributes", "toast", "useElectronWindowControls", "useGardener",
  "useGardenerBehavior", "useGardenerEvent", "useGardenerTheme", "useGardenerToast", "useTauriWindowControls", "vGardener",
];
const typeExports = [
  "GardenerAs", "GardenerBehaviorInstance", "GardenerBehaviorName", "GardenerComponentDefinition", "GardenerComponentKind",
  "GardenerComponentPublicInstance", "GardenerConfigValue", "GardenerDirectiveOptions", "GardenerDirectiveValue", "GardenerElectronBinding",
  "GardenerElectronBridge", "GardenerElementTarget", "GardenerEventHandler", "GardenerEventName", "GardenerPlatform", "GardenerTargetValue",
  "GardenerTauriBinding", "GardenerTauriBridge", "GardenerThemeState", "GardenerVueComponentName", "GardenerVueOptions",
];
const componentProps = ["as", "variant", "state", "config", "initialize", "modelValue", "modelEvent", "modelKey"];
const themeAxes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];

const catalog = `/** Generated from @gardenerim/css 1.0.0 metadata. */\nimport type { GardenerComponentDefinition } from "../types.js";\n\nexport const componentCatalog: readonly GardenerComponentDefinition[] = ${JSON.stringify(definitions, null, 2)};\nexport const componentByName = new Map(componentCatalog.map((component) => [component.name, component] as const));\nexport const componentByExportName = new Map(componentCatalog.map((component) => [component.exportName, component] as const));\n`;
await writeFile(resolve(generated, "catalog.ts"), catalog);

const componentLines = definitions.map((definition) => `export const ${definition.exportName} = /* @__PURE__ */ createGardenerComponent(${JSON.stringify(definition)} as GardenerComponentDefinition);`);
const registryLines = definitions.map((definition) => `  ${definition.exportName},`);
const componentNameUnion = definitions.map(({ exportName }) => JSON.stringify(exportName)).join(" | ");
await writeFile(resolve(generated, "components.ts"), `/** Generated Vue bindings for all Gardener components. */\nimport { createGardenerComponent } from "../component.js";\nimport type { GardenerComponentDefinition } from "../types.js";\n\n${componentLines.join("\n")}\n\nexport type GardenerVueComponentName = ${componentNameUnion};\nexport const gardenerComponents: Readonly<Record<GardenerVueComponentName, ReturnType<typeof createGardenerComponent>>> = {\n${registryLines.join("\n")}\n};\n`);

const globalLines = definitions.map((definition) => `    ${definition.exportName}: typeof import("./components.js")["${definition.exportName}"];`);
await writeFile(resolve(generated, "global-components.ts"), `/** Generated global component type augmentation. */\ndeclare module "vue" {\n  export interface GlobalComponents {\n${globalLines.join("\n")}\n  }\n}\nexport {};\n`);

await mkdir(resolve(root, "metadata"), { recursive: true });
await writeFile(resolve(root, "metadata", "public-api.json"), `${JSON.stringify({
  $schema: "./public-api.schema.json",
  schemaVersion: 1,
  version: "1.0.0",
  status: "stable",
  cssVersion: "1.0.0",
  vue: ">=3.4.0 <4.0.0",
  components: definitions.length,
  behaviors: publicApi.javascript.behaviors.length,
  componentExports: definitions.map(({ exportName }) => exportName),
  moduleExports: [...definitions.map(({ exportName }) => exportName), ...frameworkExports].sort(),
  typeExports,
  packageEntrypoints: [".", "./components", "./component", "./composables", "./directives", "./plugin", "./adapters", "./tauri", "./electron", "./catalog", "./catalog.json", "./style.css", "./core.css", "./themes.css", "./utilities.css", "./components.css", "./ai.css", "./platform/web.css", "./platform/mobile.css", "./platform/desktop.css", "./platform/tauri.css", "./platform/electron.css", "./component-css/*", "./bundle.min.js", "./performance", "./schema/public-api", "./schema/compatibility", "./schema/performance", "./package.json"],
  composables: ["useGardener", "useGardenerBehavior", "useGardenerEvent", "useGardenerTheme", "useGardenerToast", "useTauriWindowControls", "useElectronWindowControls"],
  componentProps,
  componentInstanceMembers: ["element", "getInstance", "refresh"],
  themeAxes,
  pluginOptions: ["prefix", "components", "directive", "initialize"],
  directive: "vGardener",
  provider: "GardenerProvider",
}, null, 2)}\n`);

await writeFile(resolve(root, "metadata", "compatibility.json"), `${JSON.stringify({
  $schema: "./compatibility.schema.json",
  schemaVersion: 1,
  version: "1.0.0",
  baselineVersion: "1.0.0",
  policy: { stage: "stable", additions: "allowed", removals: "deprecate-before-removal" },
  baseline: {
    packageEntrypoints: [".", "./components", "./component", "./composables", "./directives", "./plugin", "./adapters", "./tauri", "./electron", "./catalog", "./catalog.json", "./style.css", "./core.css", "./themes.css", "./utilities.css", "./components.css", "./ai.css", "./platform/web.css", "./platform/mobile.css", "./platform/desktop.css", "./platform/tauri.css", "./platform/electron.css", "./component-css/*", "./bundle.min.js", "./performance", "./schema/public-api", "./schema/compatibility", "./schema/performance", "./package.json"],
    componentNames: definitions.map(({ name }) => name),
    componentExports: definitions.map(({ exportName }) => exportName),
    moduleExports: [...definitions.map(({ exportName }) => exportName), ...frameworkExports].sort(),
    typeExports,
    behaviors: publicApi.javascript.behaviors,
    composables: ["useGardener", "useGardenerBehavior", "useGardenerEvent", "useGardenerTheme", "useGardenerToast", "useTauriWindowControls", "useElectronWindowControls"],
    componentProps,
    componentInstanceMembers: ["element", "getInstance", "refresh"],
    themeAxes,
    pluginOptions: ["prefix", "components", "directive", "initialize"],
  },
}, null, 2)}\n`);

await mkdir(resolve(root, "docs"), { recursive: true });
const table = definitions.map((item) => `| \`${item.exportName}\` | \`${item.name}\` | ${item.category} | ${item.type} | \`${item.className || item.selector}\` | ${item.behaviors.join(", ") || "—"} |`).join("\n");
await writeFile(resolve(root, "docs", "components.md"), `# Gardener Vue 组件完整目录\n\n本目录由 \`@gardenerim/css@1.0.0\` 元数据自动生成，共 ${definitions.length} 个 Vue 组件，无省略。所有组件支持 \`as\`、\`variant\`、\`state\`、\`config\`、\`initialize\`、\`modelValue\`、\`modelEvent\`、\`modelKey\` 和原生 attributes/events/slots。\n\n| Vue 导出 | CSS 组件 | 分类 | 类型 | 根选择器/类 | 行为 |\n| --- | --- | --- | --- | --- | --- |\n${table}\n`);
console.log(`Generated ${definitions.length} Vue components and ${publicApi.javascript.behaviors.length} behavior bindings.`);
