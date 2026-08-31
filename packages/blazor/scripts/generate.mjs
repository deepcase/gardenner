import { mkdir, readFile } from "node:fs/promises";
import { writeFile, cp } from "../../../scripts/fs-retry.mjs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const cssRoot = resolve(root, "..", "css");
const source = JSON.parse(await readFile(resolve(cssRoot, "metadata/components.json"), "utf8"));
const cssApi = JSON.parse(await readFile(resolve(cssRoot, "metadata/public-api.json"), "utf8"));
const builds = JSON.parse(await readFile(resolve(cssRoot, "dist/gardener.builds.json"), "utf8"));
const themeSource = await readFile(resolve(cssRoot, "config/themes.mjs"), "utf8");
const generatedRoot = resolve(root, "src/Gardenerim.Blazor/Generated");
const wwwroot = resolve(root, "src/Gardenerim.Blazor/wwwroot");
await mkdir(generatedRoot, { recursive: true });
await mkdir(resolve(wwwroot, "platforms"), { recursive: true });
await mkdir(resolve(wwwroot, "components"), { recursive: true });
await mkdir(resolve(root, "metadata"), { recursive: true });
await mkdir(resolve(root, "docs"), { recursive: true });

const pascal = (name) => `G${name.split(/[^a-zA-Z0-9]+/u).filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join("")}`;
const tags = new Map([
  ["button", "button"], ["input", "input"], ["textarea", "textarea"], ["select", "select"], ["form", "form"], ["fieldset", "fieldset"],
  ["table", "table"], ["navbar", "nav"], ["breadcrumb", "nav"], ["sidebar", "aside"], ["main-region", "main"],
  ["header-region", "header"], ["footer-region", "footer"], ["article", "article"], ["section", "section"], ["link", "a"],
]);
const rootClassOverrides = new Map([
  ["combobox", "g-combobox"], ["tabs", "g-tabs"], ["dialog", "g-dialog-backdrop"], ["drawer", "g-drawer-backdrop"],
  ["popover", "g-popover"], ["toast", "g-toast"], ["accordion", "g-accordion"], ["data-grid", "g-data-grid"],
  ["tree", "g-tree"], ["carousel", "g-carousel"], ["split-pane", "g-split-pane"],
]);
const rootClass = (component) => (component.cssSelector || component.selector).match(/\.([_a-zA-Z][\w-]*)/u)?.[1] || rootClassOverrides.get(component.name) || null;
const definitions = source.components.map((component) => ({
  name: component.name,
  componentType: pascal(component.name),
  category: component.category,
  kind: component.type,
  selector: component.selector,
  cssSelector: component.cssSelector || null,
  className: rootClass(component),
  defaultTag: tags.get(component.name) || "div",
  status: component.status || null,
  variants: component.variants || [],
  states: component.states || [],
  parts: component.parts || [],
  behaviors: component.behaviors || [],
  platforms: component.platforms || [],
  accessibility: component.accessibility ? {
    roles: component.accessibility.roles || [],
    keyboard: component.accessibility.keyboard || [],
    focusTrap: Boolean(component.accessibility.focusTrap),
    attributes: component.accessibility.attributes || [],
  } : null,
}));
const themes = [...themeSource.matchAll(/\["([a-z0-9-]+)",\s*\d+/gu)].map((match) => match[1]);
if (themes.length < 36 || new Set(themes).size !== themes.length) throw new Error(`Expected at least 36 unique themes, received ${themes.length}`);
const axisValues = {
  mode: ["light", "dark", "system", "high-contrast"],
  neutral: ["cool", "warm", "gray", "ink", "cream", "blueprint", "paper"],
  typography: ["system", "corporate", "humanist", "editorial", "technical", "geometric", "rounded", "classic", "compact", "cjk"],
  shape: ["small", "sharp", "medium", "soft", "round"],
  density: ["standard", "compact", "comfortable", "touch"],
  elevation: ["bordered", "flat", "layered", "floating"],
  motion: ["none", "calm", "quick"],
  platform: ["web", "mobile", "desktop", "tauri", "electron", "macos"],
  os: ["windows", "macos", "linux"],
};

for (const key of ["name", "componentType"]) {
  if (new Set(definitions.map((item) => item[key])).size !== definitions.length) throw new Error(`Duplicate Blazor ${key}`);
}
if (definitions.length !== 506) throw new Error(`Expected 506 components, received ${definitions.length}`);
if (cssApi.javascript.behaviors.length !== 66) throw new Error("Expected 66 Gardenerim behaviors");
if (cssApi.javascript.events.length !== 75) throw new Error("Expected 75 Gardenerim events");

const cs = (value) => value == null ? "null" : `\"${String(value).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}\"`;
const csArray = (values) => values.length ? `[${values.map(cs).join(", ")}]` : "[]";
const accessibilityExpression = (value) => value ? `new(${csArray(value.roles)}, ${csArray(value.keyboard)}, ${value.focusTrap ? "true" : "false"}, ${csArray(value.attributes)})` : "null";
const definitionExpression = (item) => `new(${cs(item.name)}, ${cs(item.componentType)}, ${cs(item.category)}, ${cs(item.kind)}, ${cs(item.selector)}, ${cs(item.cssSelector)}, ${cs(item.className)}, ${cs(item.defaultTag)}, ${cs(item.status)}, ${csArray(item.variants)}, ${csArray(item.states)}, ${csArray(item.parts)}, ${csArray(item.behaviors)}, ${csArray(item.platforms)}, ${accessibilityExpression(item.accessibility)})`;
const componentClasses = definitions.map((item) => `/// <summary>Gardenerim ${item.name} component.</summary>\npublic sealed class ${item.componentType} : GardenerimComponentBase\n{\n    protected override GardenerimComponentDefinition Definition => GardenerimCatalog.${item.componentType};\n}`).join("\n\n");
await writeFile(resolve(generatedRoot, "GardenerimComponents.g.cs"), `// <auto-generated />\nusing Gardenerim.Blazor.Generated;\nusing Gardenerim.Blazor.Models;\n\nnamespace Gardenerim.Blazor.Components;\n\n${componentClasses}\n`);

const fields = definitions.map((item) => `    public static readonly GardenerimComponentDefinition ${item.componentType} = ${definitionExpression(item)};`).join("\n");
const list = definitions.map((item) => `        ${item.componentType},`).join("\n");
await writeFile(resolve(generatedRoot, "GardenerimCatalog.g.cs"), `// <auto-generated />\nusing Gardenerim.Blazor.Models;\n\nnamespace Gardenerim.Blazor.Generated;\n\n/// <summary>Complete generated catalog for all 506 Gardenerim Blazor components.</summary>\npublic static class GardenerimCatalog\n{\n${fields}\n\n    public static IReadOnlyList<GardenerimComponentDefinition> Components { get; } =\n    [\n${list}\n    ];\n\n    public static IReadOnlyDictionary<string, GardenerimComponentDefinition> ByName { get; } = Components.ToDictionary(static component => component.Name, StringComparer.Ordinal);\n    public static IReadOnlyDictionary<string, GardenerimComponentDefinition> ByComponentType { get; } = Components.ToDictionary(static component => component.ComponentType, StringComparer.Ordinal);\n}\n`);

const themeConstants = themes.map((name) => `    public const string ${pascal(name).slice(1)} = ${cs(name)};`).join("\n");
const axesExpression = Object.entries(axisValues).map(([axis, values]) => `        [${cs(axis)}] = ${csArray(values)},`).join("\n");
await writeFile(resolve(generatedRoot, "GardenerimThemePresets.g.cs"), `// <auto-generated />
namespace Gardenerim.Blazor.Generated;

/// <summary>Complete Gardenerim theme names and supported axis values.</summary>
public static class GardenerimThemePresets
{
${themeConstants}

    public static IReadOnlyList<string> All { get; } = ${csArray(themes)};
    public static IReadOnlyDictionary<string, IReadOnlyList<string>> AxisValues { get; } = new Dictionary<string, IReadOnlyList<string>>
    {
${axesExpression}
    };
}
`);

const behaviorConstants = cssApi.javascript.behaviors.map((name) => `    public const string ${pascal(name).slice(1)} = ${cs(name)};`).join("\n");
await writeFile(resolve(generatedRoot, "GardenerimBehaviors.g.cs"), `// <auto-generated />
namespace Gardenerim.Blazor.Generated;

/// <summary>Names of all 66 Gardenerim DOM behaviors.</summary>
public static class GardenerimBehaviors
{
${behaviorConstants}
    public static IReadOnlyList<string> All { get; } = ${csArray(cssApi.javascript.behaviors)};
}
`);

const eventConstants = cssApi.javascript.events.map((name) => `    public const string ${pascal(name).slice(1)} = ${cs(name)};`).join("\n");
await writeFile(resolve(generatedRoot, "GardenerimEvents.g.cs"), `// <auto-generated />
namespace Gardenerim.Blazor.Generated;

/// <summary>Names of all 75 Gardenerim custom events.</summary>
public static class GardenerimEvents
{
${eventConstants}
    public static IReadOnlyList<string> All { get; } = ${csArray(cssApi.javascript.events)};
    public static IReadOnlyList<string> Guards { get; } = ${csArray(cssApi.javascript.guardEvents)};
}
`);

const behaviorDefinitions = cssApi.javascript.behaviorContracts.map((item) => `        new(${cs(item.name)}, ${cs(item.attribute)}, ${csArray(item.instanceMembers)}),`).join("\n");
const eventDefinitions = cssApi.javascript.eventContracts.map((item) => `        new(${cs(item.name)}, ${csArray(item.detailKeys)}, ${item.guard ? "true" : "false"}, ${item.bubbles ? "true" : "false"}, ${item.cancelable ? "true" : "false"}),`).join("\n");
await writeFile(resolve(generatedRoot, "GardenerimRuntimeCatalog.g.cs"), `// <auto-generated />
using Gardenerim.Blazor.Models;

namespace Gardenerim.Blazor.Generated;

/// <summary>Complete behavior-member and custom-event contracts for runtime discovery and AI tooling.</summary>
public static class GardenerimRuntimeCatalog
{
    public static IReadOnlyList<GardenerimBehaviorDefinition> Behaviors { get; } =
    [
${behaviorDefinitions}
    ];
    public static IReadOnlyList<GardenerimEventDefinition> Events { get; } =
    [
${eventDefinitions}
    ];
    public static IReadOnlyDictionary<string, GardenerimBehaviorDefinition> BehaviorByName { get; } = Behaviors.ToDictionary(static item => item.Name, StringComparer.Ordinal);
    public static IReadOnlyDictionary<string, GardenerimEventDefinition> EventByName { get; } = Events.ToDictionary(static item => item.Name, StringComparer.Ordinal);
}
`);

const platformAssets = ["web", "mobile", "desktop", "tauri", "electron"].map((name) => `        [${cs(name)}] = ${cs(`platforms/gardener.${name}.min.css`)},`).join("\n");
const componentAssets = builds.componentPacks.map(({ name }) => `        [${cs(name)}] = ${cs(`components/${name}.min.css`)},`).join("\n");
await writeFile(resolve(generatedRoot, "GardenerimAssets.g.cs"), `// <auto-generated />
namespace Gardenerim.Blazor.Generated;

/// <summary>Static web asset paths for full, platform, and component-domain builds.</summary>
public static class GardenerimAssets
{
    public const string BasePath = "_content/Gardenerim.Blazor/";
    public const string Css = BasePath + "gardener.css";
    public const string CoreMinCss = BasePath + "gardener.core.min.css";
    public const string MinCss = BasePath + "gardener.min.css";
    public const string JavaScriptModule = BasePath + "gardener.blazor.js";
    public static IReadOnlyDictionary<string, string> Platforms { get; } = new Dictionary<string, string>
    {
${platformAssets}
    };
    public static IReadOnlyDictionary<string, string> ComponentPacks { get; } = new Dictionary<string, string>
    {
${componentAssets}
    };
}
`);

const frameworkTypes = [
  "GardenerimAccessibilityDefinition", "GardenerimAssets", "GardenerimBehavior", "GardenerimBehaviorDefinition", "GardenerimBehaviors", "GardenerimComponent", "GardenerimComponentBase", "GardenerimConstants", "GardenerimElectronService", "GardenerimEventArgs", "GardenerimEventDefinition", "GardenerimEvents", "GardenerimField<TValue>",
  "GardenerimJsModule", "GardenerimOptions", "GardenerimPart", "GardenerimPlatform", "GardenerimProvider", "GardenerimRuntime", "GardenerimServiceCollectionExtensions", "GardenerimThemePresets",
  "GardenerimRuntimeCatalog", "GardenerimTauriService", "GardenerimThemeService", "GardenerimThemeState", "GardenerimToastService", "GardenerimValueChangedEventArgs", "GardenerimComponentDefinition",
];
const componentParameters = ["As", "Id", "Class", "Style", "Variant", "Variants", "State", "States", "Config", "Initialize", "Value", "ValueChanged", "ValueEvent", "ValueKey", "OnValueChange", "EventNames", "PreventDefaultEvents", "OnEvent", "ChildContent", "AdditionalAttributes"];
const componentHandleMembers = ["Element", "RefreshAsync", "DestroyAsync", "FocusAsync", "GetBehaviorMembersAsync", "InvokeBehaviorAsync"];
const themeAxes = ["Theme", "Mode", "Neutral", "Typography", "Shape", "Density", "Elevation", "Motion", "Platform", "Os"];
const services = ["GardenerimRuntime", "GardenerimThemeService", "GardenerimToastService", "GardenerimTauriService", "GardenerimElectronService"];
const staticAssets = ["gardener.core.min.css", "gardener.css", "gardener.min.css", "gardener.min.css.map", "gardener.runtime.min.js", "gardener.runtime.min.js.map", "gardener.blazor.js", "gardener.tauri.min.js", "gardener.tauri.min.js.map", "gardener.electron.min.js", "gardener.electron.min.js.map", ...["web", "mobile", "desktop", "tauri", "electron"].map((name) => `platforms/gardener.${name}.min.css`), ...builds.componentPacks.map(({ name }) => `components/${name}.min.css`)];
const publicApi = {
  $schema: "./public-api.schema.json", schemaVersion: 1, version: "2.0.0", status: "stable", cssVersion: "2.0.0",
  targetFramework: "net10.0", compatibleFrameworks: ["net10.0", "net11.0"], dotnet11Status: "preview-compatible",
  packageId: "Gardenerim.Blazor", components: definitions.length,
  behaviors: cssApi.javascript.behaviors.length, behaviorNames: cssApi.javascript.behaviors, behaviorContracts: cssApi.javascript.behaviorContracts,
  events: cssApi.javascript.events.length, eventNames: cssApi.javascript.events, eventContracts: cssApi.javascript.eventContracts, guardEvents: cssApi.javascript.guardEvents,
  themeCount: themes.length, themes, axisValues,
  componentNames: definitions.map(({ name }) => name), componentTypes: definitions.map(({ componentType }) => componentType),
  frameworkTypes, services, componentParameters, componentHandleMembers, themeAxes, staticAssets,
};
await writeFile(resolve(root, "metadata/public-api.json"), `${JSON.stringify(publicApi, null, 2)}\n`);
await writeFile(resolve(root, "metadata/components.json"), `${JSON.stringify({ $schema: "./components.schema.json", schemaVersion: 1, version: "2.0.0", count: definitions.length, components: definitions }, null, 2)}\n`);
await writeFile(resolve(root, "metadata/compatibility.json"), `${JSON.stringify({
  $schema: "./compatibility.schema.json", schemaVersion: 1, version: "2.0.0", baselineVersion: "2.0.0",
  policy: { stage: "stable", additions: "allowed", removals: "deprecate-before-removal" },
  baseline: { targetFramework: publicApi.targetFramework, compatibleFrameworks: publicApi.compatibleFrameworks, behaviorNames: publicApi.behaviorNames, behaviorContracts: publicApi.behaviorContracts, eventNames: publicApi.eventNames, eventContracts: publicApi.eventContracts, guardEvents: publicApi.guardEvents, themeCount: publicApi.themeCount, themes: publicApi.themes, axisValues: publicApi.axisValues, componentNames: publicApi.componentNames, componentTypes: publicApi.componentTypes, frameworkTypes, services, componentParameters, componentHandleMembers, themeAxes, staticAssets },
}, null, 2)}\n`);

const accessibilitySummary = (item) => item.accessibility ? [...item.accessibility.roles.map((value) => `role:${value}`), ...item.accessibility.keyboard.map((value) => `key:${value}`), ...item.accessibility.attributes, ...(item.accessibility.focusTrap ? ["focus-trap"] : [])].join(", ") : "—";
const componentRows = definitions.map((item) => `| \`${item.componentType}\` | \`${item.name}\` | ${item.category} | ${item.kind} | ${item.status || "—"} | \`${item.defaultTag}\` | \`${item.className || item.selector}\` | ${item.behaviors.join(", ") || "—"} | ${accessibilitySummary(item)} |`).join("\n");
await writeFile(resolve(root, "docs/components.md"), `# Gardenerim Blazor 组件完整目录\n\n由 \`@gardenerim/css@2.0.0\` 元数据生成，共 506 个 Razor 组件，无省略。全部组件继承 \`GardenerimComponentBase\`，共享 20 个参数与 6 个实例成员；状态与无障碍契约原样保留。\n\n| Razor 组件 | CSS 组件 | 分类 | 类型 | 状态 | 默认标签 | 根类/选择器 | 行为 | 无障碍契约 |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- |\n${componentRows}\n`);
const behaviorRows = cssApi.javascript.behaviorContracts.map((item) => `| \`${item.name}\` | \`${item.attribute}\` | ${item.instanceMembers.map((member) => `\`${member}\``).join(", ")} | \`GardenerimBehaviors.${pascal(item.name).slice(1)}\` |`).join("\n");
await writeFile(resolve(root, "docs/behaviors.md"), `# Gardenerim DOM 行为完整目录\n\n共 66 个行为，无省略。生成组件按元数据自动初始化；任意元素可使用 \`GardenerimBehavior\`；\`GardenerimRuntimeCatalog\` 提供机器可读成员契约。\n\n| 行为名 | 属性 | 实例成员 | C# 常量 |\n| --- | --- | --- | --- |\n${behaviorRows}\n`);
const eventRows = cssApi.javascript.eventContracts.map((item) => `| \`${item.name}\` | ${item.detailKeys.map((key) => `\`${key}\``).join(", ") || "—"} | ${item.guard ? "是" : "否"} | ${item.bubbles ? "是" : "否"} | ${item.cancelable ? "是" : "否"} |`).join("\n");
await writeFile(resolve(root, "docs/events.md"), `# Gardenerim 事件完整目录\n\n共 75 个 \`gardener:*\` 自定义事件，无省略。使用 \`EventNames\` 订阅、\`OnEvent\` 接收安全序列化 detail；守卫事件需要在 \`PreventDefaultEvents\` 中声明，以便浏览器同步执行 \`preventDefault()\`。\n\n| 事件名 | detail 键 | 守卫 | 冒泡 | 可取消 |\n| --- | --- | --- | --- | --- |\n${eventRows}\n`);
const assetRows = staticAssets.map((name) => `| \`${name}\` | \`_content/Gardenerim.Blazor/${name}\` |`).join("\n");
await writeFile(resolve(root, "docs/assets.md"), `# 静态资源完整目录\n\n共 ${staticAssets.length} 个公开静态资源：全量 CSS、Blazor/runtime/桌面适配 JS、对应 source map、5 个平台包与 28 个组件域包，无省略。C# 应用也可通过 \`GardenerimAssets\` 查询路径。\n\n| 包内路径 | 应用 URL |\n| --- | --- |\n${assetRows}\n`);

const copies = [
  ["dist/gardener.core.min.css", "gardener.core.min.css"],
  ["dist/gardener.css", "gardener.css"], ["dist/gardener.min.css", "gardener.min.css"], ["dist/gardener.min.css.map", "gardener.min.css.map"],
  ["dist/gardener.runtime.min.js", "gardener.runtime.min.js"], ["dist/gardener.runtime.min.js.map", "gardener.runtime.min.js.map"],
  ["dist/gardener.tauri.min.js", "gardener.tauri.min.js"], ["dist/gardener.tauri.min.js.map", "gardener.tauri.min.js.map"],
  ["dist/gardener.electron.min.js", "gardener.electron.min.js"], ["dist/gardener.electron.min.js.map", "gardener.electron.min.js.map"],
  ...["web", "mobile", "desktop", "tauri", "electron"].map((name) => [`dist/platforms/gardener.${name}.min.css`, `platforms/gardener.${name}.min.css`]),
  ...builds.componentPacks.map(({ name }) => [`dist/components/${name}.min.css`, `components/${name}.min.css`]),
];
for (const [sourcePath, targetPath] of copies) await cp(resolve(cssRoot, sourcePath), resolve(wwwroot, targetPath));
console.log(`Generated ${definitions.length} Blazor components, ${frameworkTypes.length} framework types, and ${staticAssets.length} static assets.`);
