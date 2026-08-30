import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = resolve(import.meta.dirname, "..");
const cssRoot = resolve(root, "..", "css");
const readJson = async (...parts) => JSON.parse(await readFile(resolve(root, ...parts), "utf8"));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const api = await readJson("metadata", "public-api.json");
const compatibility = await readJson("metadata", "compatibility.json");
const components = await readJson("metadata", "components.json");
const apiSchema = await readJson("metadata", "public-api.schema.json");
const compatibilitySchema = await readJson("metadata", "compatibility.schema.json");
const componentsSchema = await readJson("metadata", "components.schema.json");
const budgetSchema = await readJson("metadata", "performance-budgets.schema.json");
const budgets = await readJson("config", "performance-budgets.json");
const cssComponents = JSON.parse(await readFile(resolve(cssRoot, "metadata", "components.json"), "utf8"));
const cssApi = JSON.parse(await readFile(resolve(cssRoot, "metadata", "public-api.json"), "utf8"));
const cssPackage = JSON.parse(await readFile(resolve(cssRoot, "package.json"), "utf8"));
const generated = await readFile(resolve(root, "src", "Gardener.Blazor", "Generated", "GardenerComponents.g.cs"), "utf8");
const catalog = await readFile(resolve(root, "src", "Gardener.Blazor", "Generated", "GardenerCatalog.g.cs"), "utf8");
const componentDocs = await readFile(resolve(root, "docs", "components.md"), "utf8");
const behaviorDocs = await readFile(resolve(root, "docs", "behaviors.md"), "utf8");
const eventDocs = await readFile(resolve(root, "docs", "events.md"), "utf8");
const assetDocs = await readFile(resolve(root, "docs", "assets.md"), "utf8");
const apiDocs = await readFile(resolve(root, "docs", "api.md"), "utf8");
const project = await readFile(resolve(root, "src", "Gardener.Blazor", "Gardener.Blazor.csproj"), "utf8");
const consumer = await readFile(resolve(root, "tests", "Gardener.Blazor.Net11Consumer", "Gardener.Blazor.Net11Consumer.csproj"), "utf8");

const ajv = new Ajv2020({ allErrors: true, strict: true });
ajv.addSchema(apiSchema);
ajv.addSchema(componentsSchema);
assert(ajv.validate(apiSchema, api), `public-api.json schema errors: ${ajv.errorsText()}`);
assert(ajv.validate(compatibilitySchema, compatibility), `compatibility.json schema errors: ${ajv.errorsText()}`);
assert(ajv.validate(componentsSchema, components), `components.json schema errors: ${ajv.errorsText()}`);
assert(ajv.validate(budgetSchema, budgets), `performance-budgets.json schema errors: ${ajv.errorsText()}`);
assert(api.version === "1.0.0" && api.status === "stable" && api.cssVersion === "1.0.0", "Versions/status must be stable 1.0.0.");
assert(cssPackage.version === api.cssVersion, "Declared CSS version differs from the source package.");
assert(api.targetFramework === "net10.0" && api.compatibleFrameworks.includes("net11.0"), "net10 base/net11 compatibility contract is missing.");
assert(project.includes("<TargetFramework>net10.0</TargetFramework>") && !project.includes("net11.0"), "Published project must target stable net10.0 only.");
assert(consumer.includes("<TargetFramework>net11.0</TargetFramework>"), "Dedicated net11.0 consumer project is missing.");
assert(consumer.includes("<PackageReference Include=\"Gardener.Blazor\"") && !consumer.includes("ProjectReference"), "net11.0 must validate the packed NuGet rather than a source reference.");
assert(api.components === 506 && api.componentNames.length === 506 && api.componentTypes.length === 506, "Exactly 506 component APIs are required.");
assert(new Set(api.componentNames).size === 506 && new Set(api.componentTypes).size === 506, "Component names/types must be unique.");
assert(cssComponents.components.length === api.components, "Blazor/CSS component counts differ.");
assert(cssComponents.components.every((item) => api.componentNames.includes(item.name)), "A CSS component is missing from Blazor metadata.");
assert(cssApi.javascript.behaviors.length === api.behaviors && api.behaviors === 66 && JSON.stringify(cssApi.javascript.behaviors) === JSON.stringify(api.behaviorNames), "Exactly 66 ordered runtime behaviors are required.");
assert(JSON.stringify(cssApi.javascript.behaviorContracts) === JSON.stringify(api.behaviorContracts), "Behavior member contracts differ from CSS runtime metadata.");
assert(cssApi.javascript.events.length === api.events && api.events === 75 && JSON.stringify(cssApi.javascript.events) === JSON.stringify(api.eventNames), "Exactly 75 ordered runtime events are required.");
assert(JSON.stringify(cssApi.javascript.eventContracts) === JSON.stringify(api.eventContracts) && JSON.stringify(cssApi.javascript.guardEvents) === JSON.stringify(api.guardEvents), "Event/guard contracts differ from CSS runtime metadata.");
assert(components.count === 506 && JSON.stringify(components.components.map((item) => item.name)) === JSON.stringify(api.componentNames), "Full component catalog differs from public API.");
assert(cssComponents.components.every((item, index) => components.components[index].status === (item.status ?? null) && JSON.stringify(components.components[index].accessibility) === JSON.stringify(item.accessibility ? { roles: item.accessibility.roles ?? [], keyboard: item.accessibility.keyboard ?? [], focusTrap: Boolean(item.accessibility.focusTrap), attributes: item.accessibility.attributes ?? [] } : null)), "Component status/accessibility metadata was not preserved.");
assert(api.themeCount === 42 && api.themes.length === 42 && new Set(api.themes).size === 42, "All 42 color themes are required.");
assert((generated.match(/public sealed class G/g) ?? []).length === 506, "Generated source does not contain 506 components.");
assert((catalog.match(/public static readonly GardenerComponentDefinition G/g) ?? []).length === 506, "Generated catalog does not contain 506 definitions.");
assert(api.componentTypes.every((name) => componentDocs.includes(`\`${name}\``)), "The component documentation omits a generated type.");
assert(api.behaviorNames.every((name) => behaviorDocs.includes(`\`${name}\``)), "The behavior documentation omits a runtime behavior.");
assert(api.eventNames.every((name) => eventDocs.includes(`\`${name}\``)), "The event documentation omits a runtime event.");
assert(api.staticAssets.every((name) => assetDocs.includes(`\`${name}\``)), "The asset documentation omits a static asset.");
assert(api.frameworkTypes.every((name) => apiDocs.includes(name.replace("<TValue>", "")) || componentDocs.includes(name)), "The API documentation omits a framework type.");
const requiredDocs = ["getting-started.md", "api.md", "components.md", "behaviors.md", "events.md", "assets.md", "theming.md", "runtime.md", "platforms.md", "accessibility.md", "release.md"];
assert((await Promise.all(requiredDocs.map(async (name) => stat(resolve(root, "docs", name)).then((item) => item.isFile()).catch(() => false)))).every(Boolean), "Required documentation is incomplete.");
assert(JSON.stringify(compatibility.baseline) === JSON.stringify({ targetFramework: api.targetFramework, compatibleFrameworks: api.compatibleFrameworks, behaviorNames: api.behaviorNames, behaviorContracts: api.behaviorContracts, eventNames: api.eventNames, eventContracts: api.eventContracts, guardEvents: api.guardEvents, themeCount: api.themeCount, themes: api.themes, axisValues: api.axisValues, componentNames: api.componentNames, componentTypes: api.componentTypes, frameworkTypes: api.frameworkTypes, services: api.services, componentParameters: api.componentParameters, componentHandleMembers: api.componentHandleMembers, themeAxes: api.themeAxes, staticAssets: api.staticAssets }), "Compatibility baseline differs from public API.");

for (const asset of api.staticAssets) {
  const target = resolve(root, "src", "Gardener.Blazor", "wwwroot", asset);
  try { assert((await stat(target)).isFile(), `Static asset missing: ${asset}`); } catch { failures.push(`Static asset missing: ${asset}`); }
}
for (const minified of ["gardener.min.css", "gardener.runtime.min.js", "gardener.tauri.min.js", "gardener.electron.min.js"]) {
  const content = await readFile(resolve(root, "src", "Gardener.Blazor", "wwwroot", minified), "utf8");
  const map = content.match(/sourceMappingURL=([^\s*]+)/u)?.[1];
  assert(Boolean(map) && api.staticAssets.includes(map), `Referenced source map is not public: ${minified}`);
}

if (failures.length) {
  console.error(`Gardener.Blazor checks failed (${failures.length}):\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}
console.log(`Gardener.Blazor API/schema/docs/assets checks passed: ${api.components} components, ${api.behaviors} behaviors, ${api.events} events, ${api.themeCount} themes, ${api.staticAssets.length} assets.`);
