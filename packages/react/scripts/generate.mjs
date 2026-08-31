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

const names = new Set(definitions.map(({ exportName }) => exportName));
if (names.size !== definitions.length) throw new Error("Duplicate React component export");
if (definitions.length !== 506) throw new Error(`Expected 506 CSS components, received ${definitions.length}`);
if (publicApi.javascript.behaviors.length !== 66) throw new Error("Expected 66 Gardenerim behaviors");

const frameworkExports = [
  "Gardenerim", "GardenerimComponent", "GardenerimPart", "GardenerimProvider", "GardenerimThemeContext", "behaviorAttributes",
  "bindElectronWindowControls", "bindTauriWindowControls", "componentByExportName", "componentByName", "componentCatalog",
  "configAttributes", "createGardenerimComponent", "destroy", "emit", "gardenerimComponents", "getInstance", "init", "observe",
  "register", "resolveGardenerimTarget", "themeAttributes", "themeAxes", "toast", "useElectronWindowControls", "useGardenerim",
  "useGardenerimBehavior", "useGardenerimEvent", "useGardenerimTheme", "useGardenerimThemeContext", "useGardenerimToast", "useTauriWindowControls",
];
const typeExports = [
  "GardenerimAs", "GardenerimBehaviorInstance", "GardenerimBehaviorName", "GardenerimComponentDefinition", "GardenerimComponentHandle",
  "GardenerimComponentKind", "GardenerimComponentProps", "GardenerimConfigValue", "GardenerimElectronBinding", "GardenerimElectronBridge",
  "GardenerimElementTarget", "GardenerimEventHandler", "GardenerimEventName", "GardenerimGeneratedComponent", "GardenerimOwnProps",
  "GardenerimPlatform", "GardenerimReactComponentName", "GardenerimTargetValue", "GardenerimTauriBinding", "GardenerimTauriBridge",
  "GardenerimThemeState", "GardenerimValueChange",
];
const componentProps = ["as", "variant", "state", "config", "initialize", "value", "defaultValue", "valueEvent", "valueKey", "onValueChange"];
const componentHandleMembers = ["element", "getInstance", "refresh"];
const themeAxes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];
const hooks = ["useGardenerim", "useGardenerimBehavior", "useGardenerimEvent", "useGardenerimTheme", "useGardenerimToast", "useTauriWindowControls", "useElectronWindowControls"];
const packageEntrypoints = Object.keys(pkg.exports);
const moduleExports = [...definitions.map(({ exportName }) => exportName), ...frameworkExports].sort();

await writeFile(resolve(generated, "catalog.ts"), `/** Generated from @gardenerim/css 2.0.0 metadata. */\nimport type { GardenerimComponentDefinition } from "../types.js";\n\nexport const componentCatalog: readonly GardenerimComponentDefinition[] = ${JSON.stringify(definitions, null, 2)};\nexport const componentByName = new Map(componentCatalog.map((component) => [component.name, component] as const));\nexport const componentByExportName = new Map(componentCatalog.map((component) => [component.exportName, component] as const));\n`);

const componentLines = definitions.map((definition) => `export const ${definition.exportName} = /* @__PURE__ */ createGardenerimComponent(${JSON.stringify(definition)} as GardenerimComponentDefinition) as GardenerimGeneratedComponent<${JSON.stringify(definition.tag)}>;`);
const registryLines = definitions.map(({ exportName }) => `  ${exportName},`);
const componentNameUnion = definitions.map(({ exportName }) => JSON.stringify(exportName)).join(" | ");
await writeFile(resolve(generated, "components.ts"), `/** Generated React bindings for all Gardenerim components. */\nimport { createGardenerimComponent } from "../component.js";\nimport type { ElementType } from "react";\nimport type { GardenerimComponentDefinition, GardenerimGeneratedComponent } from "../types.js";\n\n${componentLines.join("\n")}\n\nexport type GardenerimReactComponentName = ${componentNameUnion};\nexport const gardenerimComponents: Readonly<Record<GardenerimReactComponentName, GardenerimGeneratedComponent<ElementType>>> = {\n${registryLines.join("\n")}\n};\n`);

await mkdir(resolve(root, "metadata"), { recursive: true });
const metadata = {
  $schema: "./public-api.schema.json", schemaVersion: 1, version: "2.0.0", status: "stable", cssVersion: "2.0.0",
  react: ">=18.3.0 <20.0.0", components: definitions.length, behaviors: publicApi.javascript.behaviors.length,
  componentExports: definitions.map(({ exportName }) => exportName), moduleExports, typeExports, packageEntrypoints, hooks,
  componentProps, componentHandleMembers, themeAxes, provider: "GardenerimProvider",
};
await writeFile(resolve(root, "metadata", "public-api.json"), `${JSON.stringify(metadata, null, 2)}\n`);
await writeFile(resolve(root, "metadata", "compatibility.json"), `${JSON.stringify({
  $schema: "./compatibility.schema.json", schemaVersion: 1, version: "2.0.0", baselineVersion: "2.0.0",
  policy: { stage: "stable", additions: "allowed", removals: "deprecate-before-removal" },
  baseline: { packageEntrypoints, componentNames: definitions.map(({ name }) => name), componentExports: metadata.componentExports, moduleExports, typeExports, behaviors: publicApi.javascript.behaviors, hooks, componentProps, componentHandleMembers, themeAxes },
}, null, 2)}\n`);

await mkdir(resolve(root, "docs"), { recursive: true });
const table = definitions.map((item) => `| \`${item.exportName}\` | \`${item.name}\` | ${item.category} | ${item.type} | \`${item.className || item.selector}\` | ${item.behaviors.join(", ") || "—"} |`).join("\n");
await writeFile(resolve(root, "docs", "components.md"), `# Gardenerim React 组件完整目录\n\n本目录由 \`@gardenerim/css@2.0.0\` 元数据自动生成，共 ${definitions.length} 个 React 组件，无省略。所有组件支持 \`${componentProps.join("\`、\`")}\`、原生 attributes/events、children 和 ref handle。\n\n| React 导出 | CSS 组件 | 分类 | 类型 | 根选择器/类 | 行为 |\n| --- | --- | --- | --- | --- | --- |\n${table}\n`);
console.log(`Generated ${definitions.length} React components and ${publicApi.javascript.behaviors.length} behavior bindings.`);

await writeFile(resolve(generated, "contracts.ts"), componentContracts(source.components));
