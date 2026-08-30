import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { componentPacks, platformProfiles } from "../config/builds.mjs";
import { compression, contentIntegrity } from "./lib/build-tools.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const schemaCache = new Map();
const json = (path) => JSON.parse(readFileSync(path, "utf8"));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const kind = (value) => Array.isArray(value) ? "array" : value === null ? "null" : Number.isInteger(value) ? "integer" : typeof value;

function schemaAt(path) {
  const absolute = resolve(path);
  if (!schemaCache.has(absolute)) schemaCache.set(absolute, json(absolute));
  return schemaCache.get(absolute);
}

function pointer(value, fragment) {
  if (!fragment || fragment === "#") return value;
  return fragment.replace(/^#\//, "").split("/").reduce((node, part) => node?.[part.replaceAll("~1", "/").replaceAll("~0", "~")], value);
}

function dereference(ref, schemaPath) {
  const [filePart, fragment = ""] = ref.split("#");
  const targetPath = filePart ? resolve(dirname(schemaPath), filePart) : schemaPath;
  return { schema: pointer(schemaAt(targetPath), fragment ? `#${fragment}` : "#"), schemaPath: targetPath };
}

function validates(value, schema, dataPath, schemaPath, quiet = false) {
  const local = [];
  const fail = (message) => local.push(`${dataPath}: ${message}`);
  if (schema.$ref) {
    const target = dereference(schema.$ref, schemaPath);
    local.push(...validate(value, target.schema, dataPath, target.schemaPath, true));
  }
  if (schema.const !== undefined && !same(value, schema.const)) fail(`must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some((candidate) => same(candidate, value))) fail(`must be one of ${schema.enum.join(", ")}`);
  if (schema.type) {
    const allowed = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!allowed.includes(kind(value)) && !(allowed.includes("number") && typeof value === "number")) fail(`must be ${allowed.join(" or ")}, found ${kind(value)}`);
  }
  if (typeof value === "string") {
    if (schema.minLength != null && value.length < schema.minLength) fail(`must have at least ${schema.minLength} characters`);
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(value)) fail(`does not match ${schema.pattern}`);
  }
  if (typeof value === "number" && schema.minimum != null && value < schema.minimum) fail(`must be at least ${schema.minimum}`);
  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) fail(`must contain at least ${schema.minItems} items`);
    if (schema.maxItems != null && value.length > schema.maxItems) fail(`must contain at most ${schema.maxItems} items`);
    if (schema.uniqueItems && new Set(value.map((item) => JSON.stringify(item))).size !== value.length) fail("must contain unique items");
    (schema.prefixItems || []).forEach((itemSchema, index) => {
      if (index < value.length) local.push(...validate(value[index], itemSchema, `${dataPath}[${index}]`, schemaPath, true));
    });
    if (schema.items && typeof schema.items === "object") {
      value.forEach((item, index) => local.push(...validate(item, schema.items, `${dataPath}[${index}]`, schemaPath, true)));
    }
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (schema.minProperties != null && Object.keys(value).length < schema.minProperties) fail(`must contain at least ${schema.minProperties} properties`);
    for (const key of schema.required || []) if (!(key in value)) fail(`missing required property ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.propertyNames) local.push(...validate(key, schema.propertyNames, `${dataPath}.{property:${key}}`, schemaPath, true));
      if (schema.properties?.[key]) local.push(...validate(item, schema.properties[key], `${dataPath}.${key}`, schemaPath, true));
      else if (schema.additionalProperties === false) fail(`unknown property ${key}`);
      else if (schema.additionalProperties && typeof schema.additionalProperties === "object") local.push(...validate(item, schema.additionalProperties, `${dataPath}.${key}`, schemaPath, true));
    }
  }
  for (const branch of schema.allOf || []) local.push(...validate(value, branch, dataPath, schemaPath, true));
  if (schema.anyOf) {
    const branches = schema.anyOf.map((branch) => validate(value, branch, dataPath, schemaPath, true));
    if (!branches.some((branch) => branch.length === 0)) fail("must satisfy at least one allowed shape");
  }
  if (schema.if && validate(value, schema.if, dataPath, schemaPath, true).length === 0 && schema.then) local.push(...validate(value, schema.then, dataPath, schemaPath, true));
  if (!quiet) errors.push(...local);
  return local;
}

function validate(value, schema, dataPath, schemaPath, quiet = false) {
  return validates(value, schema, dataPath, schemaPath, quiet);
}

function matchingDelimiter(text, opening, opener, closer) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = opening; index < text.length; index += 1) {
    const character = text[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") { quote = character; continue; }
    if (character === opener) depth += 1;
    else if (character === closer && --depth === 0) return index;
  }
  return -1;
}

const matchingBrace = (text, opening) => matchingDelimiter(text, opening, "{", "}");

function splitTopLevel(text) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = 0; index <= text.length; index += 1) {
    const character = text[index] ?? ",";
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") { quote = character; continue; }
    if ("({[".includes(character)) depth += 1;
    else if (")} ]".replace(" ", "").includes(character)) depth -= 1;
    else if (character === "," && depth === 0) { parts.push(text.slice(start, index).trim()); start = index + 1; }
  }
  return parts;
}

function functionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return "";
  const opening = source.indexOf("{", start);
  return source.slice(opening + 1, matchingBrace(source, opening));
}

function returnedObjectKeys(text) {
  const keys = [];
  for (const part of splitTopLevel(text)) {
    const match = part.match(/^(?:get\s+)?([A-Za-z_$][\w$]*)\s*(?::|\(|$)/);
    if (match) keys.push(match[1]);
  }
  return keys;
}

function emittedEventContracts(source) {
  const contracts = new Map();
  for (const match of source.matchAll(/\bemit\s*\(/g)) {
    const opening = match.index + match[0].lastIndexOf("(");
    const closing = matchingDelimiter(source, opening, "(", ")");
    if (closing < 0) continue;
    const args = splitTopLevel(source.slice(opening + 1, closing));
    const name = args[1]?.match(/^["']([a-z0-9-]+)["']$/)?.[1];
    if (!name) continue;
    const detail = args[2]?.trim() || "{}";
    if (!/^\{[\s\S]*\}$/.test(detail)) throw new Error(`Event ${name} uses a non-literal detail payload; update the public contract parser.`);
    const detailKeys = returnedObjectKeys(detail.slice(1, -1));
    const current = contracts.get(name) || [];
    contracts.set(name, [...new Set([...current, ...detailKeys])]);
  }
  return [...contracts.entries()].sort(([left], [right]) => left.localeCompare(right)).map(([name, detailKeys]) => ({
    name,
    detailKeys,
    guard: name.startsWith("before"),
    bubbles: true,
    cancelable: true
  }));
}

function functionParameters(source, name) {
  const match = source.match(new RegExp(`function\\s+${name}\\s*\\(([^)]*)\\)`));
  return match ? splitTopLevel(match[1]).filter(Boolean) : [];
}

function runtimeContract(source) {
  const registry = source.match(/\[\s*\["dialog"[\s\S]*?\]\s*\.forEach\(\(\[name, factory\]\)/)?.[0] || "";
  const registrations = [...registry.matchAll(/\["([a-z-]+)"\s*,\s*(?:\(element\)\s*=>\s*)?([A-Za-z0-9]+)/g)]
    .map((match) => ({ name: match[1], factory: match[2] }));
  const behaviorContracts = registrations.map(({ name, factory }) => {
    const body = functionBody(source, factory);
    const instanceMembers = [];
    for (const match of body.matchAll(/return\s*\{/g)) {
      const opening = match.index + match[0].lastIndexOf("{");
      const closing = matchingBrace(body, opening);
      if (closing > opening) instanceMembers.splice(0, instanceMembers.length, ...returnedObjectKeys(body.slice(opening + 1, closing)));
    }
    return { name, attribute: `data-g-${name}`, instanceMembers: [...new Set(instanceMembers)] };
  });
  const kebabDataset = (name) => name.replace(/^g/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const behaviorAttributes = behaviorContracts.map(({ attribute }) => attribute);
  const behaviorAttributeSet = new Set(behaviorAttributes);
  const selectors = [...new Set([...source.matchAll(/data-g-[a-z0-9-]+/g)].map((match) => match[0]))].filter((name) => !behaviorAttributeSet.has(name)).sort();
  const reads = new Set();
  const managedState = new Set();
  for (const match of source.matchAll(/\.dataset\.([A-Za-z][A-Za-z0-9]*)/g)) {
    const name = `data-g-${kebabDataset(match[1])}`;
    const after = source.slice(match.index + match[0].length, match.index + match[0].length + 8);
    if (/^\s*=/.test(after) && !/^\s*==/.test(after)) managedState.add(name);
    else reads.add(name);
  }
  return {
    behaviorContracts,
    dataAttributes: {
      behaviors: behaviorAttributes,
      selectors,
      configuration: [...reads].filter((name) => !selectors.includes(name) && !behaviorAttributeSet.has(name)).sort(),
      managedState: [...managedState].sort()
    }
  };
}

const contracts = [
  ["metadata/components.json", "metadata/components.schema.json"],
  ["metadata/recipes.json", "metadata/recipes.schema.json"],
  ["metadata/capabilities.json", "metadata/capabilities.schema.json"],
  ["metadata/public-api.json", "metadata/public-api.schema.json"],
  ["dist/gardener.utilities.json", "metadata/utilities.schema.json"],
  ["dist/gardener.manifest.json", "metadata/manifest.schema.json"],
  ["dist/gardener.recipes.json", "metadata/recipes.schema.json"],
  ["dist/gardener.capabilities.json", "metadata/capabilities.schema.json"],
  ["dist/gardener.public-api.json", "metadata/public-api.schema.json"],
  ["dist/gardener.builds.json", "metadata/builds.schema.json"],
  ["config/performance-budgets.json", "metadata/performance-budgets.schema.json"],
  ["dist/gardener.performance.json", "metadata/performance-report.schema.json"],
  ["dist/gardener.compatibility.json", "metadata/compatibility.schema.json"]
];
for (const [dataFile, schemaFile] of contracts) {
  const dataPath = join(root, dataFile);
  const schemaPath = join(root, schemaFile);
  if (!existsSync(dataPath)) errors.push(`${dataFile}: missing contract document`);
  else validate(json(dataPath), schemaAt(schemaPath), dataFile, schemaPath);
}

const pkg = json(join(root, "package.json"));
const components = json(join(root, "metadata/components.json"));
const recipes = json(join(root, "metadata/recipes.json"));
const capabilities = json(join(root, "metadata/capabilities.json"));
const publicApi = json(join(root, "metadata/public-api.json"));
const manifest = json(join(root, "dist/gardener.manifest.json"));
const utilities = json(join(root, "dist/gardener.utilities.json"));
const builds = json(join(root, "dist/gardener.builds.json"));
const budgets = json(join(root, "config/performance-budgets.json"));
const performance = json(join(root, "dist/gardener.performance.json"));
const compatibility = json(join(root, "metadata/compatibility.json"));
const css = readFileSync(join(root, "dist/gardener.css"), "utf8");
const runtime = readFileSync(join(root, "src/js/index.js"), "utf8");
const runtimeTests = readFileSync(join(root, "tests/runtime.test.mjs"), "utf8");
const runtimeFixtures = readFileSync(join(root, "tests/runtime-fixtures.mjs"), "utf8");
const websiteDocs = readFileSync(join(root, "../../website/docs.html"), "utf8");
const playwrightConfig = readFileSync(join(root, "playwright.config.mjs"), "utf8");
const browserTests = readFileSync(join(root, "tests/browser/cross-browser.spec.mjs"), "utf8");
const browserHarness = readFileSync(join(root, "tests/browser/pages.mjs"), "utf8");
const mobileTests = readFileSync(join(root, "tests/browser/mobile.spec.mjs"), "utf8");
const accessibilityTests = readFileSync(join(root, "tests/browser/accessibility.spec.mjs"), "utf8");
const htmlTests = readFileSync(join(root, "tests/html.test.mjs"), "utf8");
const registryBlock = runtime.match(/\[\s*\["dialog"[\s\S]*?\]\s*\.forEach\(\(\[name, factory\]\)/)?.[0] || "";
const registeredBehaviors = [...registryBlock.matchAll(/\["([a-z-]+)"\s*,/g)].map((match) => match[1]);
const emittedEvents = [...new Set([...runtime.matchAll(/emit\([^,]+,\s*["']([a-z0-9-]+)["']/g)].map((match) => match[1]))].sort();
const declaredEvents = [...publicApi.javascript.events].sort();
const namedExports = runtime.match(/export \{([^}]+)\}/)?.[1].split(",").map((name) => name.trim()) || [];
const moduleExports = ["default", ...namedExports];
const gardenerOpening = runtime.indexOf("Object.freeze({") + "Object.freeze(".length;
const gardenerProperties = returnedObjectKeys(runtime.slice(gardenerOpening + 1, matchingBrace(runtime, gardenerOpening)));
const runtimeInventory = runtimeContract(runtime);
const eventContracts = emittedEventContracts(runtime);
const kebab = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
const jsIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
const adapters = new Set(publicApi.javascript.adapters.map(({ name }) => name));

if (publicApi.contractVersion !== pkg.version) errors.push("public-api contractVersion must equal package version");
if (!runtime.includes(`version: "${pkg.version}"`)) errors.push("runtime version must equal package version");
if (Object.keys(pkg.dependencies || {}).length) errors.push("the published CSS package must keep zero runtime dependencies");
if (pkg.main) errors.push("package must use the explicit exports map instead of a stale main fallback");
if (!pkg.scripts?.["test:runtime"]?.includes("tests/runtime.test.mjs")) errors.push("package must expose the runtime unit test command");
if (!pkg.scripts?.["test:schema"]?.includes("tests/schema.test.mjs")) errors.push("package must expose standards-based JSON Schema tests");
if (!pkg.scripts?.["test:html"]?.includes("tests/html.test.mjs")) errors.push("package must expose structural HTML tests");
if (!pkg.scripts?.["test:build"]?.includes("tests/build.test.mjs")) errors.push("package must expose targeted-build tests");
if (!pkg.scripts?.["test:types"]?.includes("tsconfig.types.json")) errors.push("package must expose TypeScript declaration tests");
if (!pkg.scripts?.["verify:compatibility"]?.includes("scripts/verify-compatibility.mjs")) errors.push("package must expose cross-version compatibility verification");
if (!pkg.scripts?.["verify:package"]?.includes("scripts/verify-package.mjs")) errors.push("package must expose packed artifact verification");
if (!pkg.scripts?.["prepublishOnly"]?.includes("release:verify")) errors.push("publishing must run the complete release verification gate");
if (!pkg.scripts?.budget?.includes("scripts/budget.mjs")) errors.push("package must expose the performance budget gate");
if (!pkg.scripts?.["build:custom"]?.includes("scripts/build-custom.mjs")) errors.push("package must expose custom component builds");
if (!pkg.scripts?.["build:custom"]?.includes("npm run build")) errors.push("custom component builds must refresh generated ownership before selection");
if (!pkg.scripts?.["test:browser"]?.includes("desktop-chromium") || !pkg.scripts?.["test:browser"]?.includes("desktop-webkit")) errors.push("the default browser gate must cover Chromium and WebKit");
if (!pkg.scripts?.["test:browser:firefox"]?.includes("test-firefox.mjs")) errors.push("package must expose the Firefox browser gate through its cross-platform launcher");
if (!pkg.scripts?.["test:browser:all"]?.includes("desktop-chromium") || !pkg.scripts?.["test:browser:all"]?.includes("desktop-firefox") || !pkg.scripts?.["test:browser:all"]?.includes("desktop-webkit")) errors.push("the complete browser gate must cover Chromium, Firefox, and WebKit");
if (!pkg.scripts?.["test:mobile"]?.includes("mobile-chromium") || !pkg.scripts?.["test:mobile"]?.includes("mobile-webkit")) errors.push("the mobile gate must cover Chromium and WebKit device profiles");
if (!pkg.scripts?.["test:a11y"]?.includes("accessibility-chromium")) errors.push("package must expose the real-browser accessibility gate");
if (!["test:browser", "test:browser:firefox", "test:mobile", "test:a11y"].every((script) => pkg.scripts?.["test:e2e"]?.includes(`npm run ${script}`))) errors.push("the end-to-end gate must include Chromium, Firefox, WebKit, mobile, and accessibility suites");
if (!pkg.scripts?.test?.includes("npm run test:runtime")) errors.push("the full test command must include runtime lifecycle tests");
if (!pkg.scripts?.test?.includes("npm run test:schema")) errors.push("the full test command must include standards-based JSON Schema tests");
if (!pkg.scripts?.test?.includes("npm run test:html")) errors.push("the full test command must include structural HTML tests");
if (!pkg.scripts?.test?.includes("npm run test:build")) errors.push("the full test command must include targeted-build tests");
if (!pkg.scripts?.test?.includes("npm run budget")) errors.push("the full test command must include performance budgets");
if (!pkg.scripts?.test?.includes("npm run test:e2e")) errors.push("the full test command must include real-browser end-to-end tests");
if (!pkg.devDependencies?.["happy-dom"]) errors.push("runtime tests require the declared Happy DOM development dependency");
if (!pkg.devDependencies?.ajv) errors.push("schema tests require the declared Ajv development dependency");
if (!pkg.devDependencies?.["@playwright/test"]) errors.push("browser tests require the declared Playwright development dependency");
if (!pkg.devDependencies?.["@axe-core/playwright"]) errors.push("accessibility tests require the declared Axe Playwright development dependency");
if (!pkg.devDependencies?.parse5) errors.push("structural HTML tests require the declared parse5 development dependency");
if (!pkg.devDependencies?.esbuild) errors.push("formal minification requires the declared esbuild development dependency");
if (!pkg.devDependencies?.typescript) errors.push("runtime declarations require the declared TypeScript development dependency");
if (!pkg.devDependencies?.publint) errors.push("package publication requires the declared publint development dependency");
if (pkg.types !== "./dist/gardener.d.ts" || pkg.style !== "./dist/gardener.css") errors.push("package must expose canonical types and style fields");
if (!pkg.sideEffects?.includes("dist/gardener.runtime.js") || !pkg.sideEffects?.includes("dist/gardener.runtime.min.js")) errors.push("runtime auto-initialization must be marked as a package side effect");
for (const project of ["desktop-chromium", "desktop-firefox", "desktop-webkit", "mobile-chromium", "mobile-webkit", "accessibility-chromium"]) {
  if (!playwrightConfig.includes(`name: "${project}"`)) errors.push(`Playwright configuration is missing project: ${project}`);
}
for (const marker of ["console", "requestfailed", "scrollWidth", "dialog keyboard lifecycle", "releasePages"]) {
  if (!`${browserHarness}\n${browserTests}`.includes(marker)) errors.push(`cross-browser suite is missing coverage marker: ${marker}`);
}
for (const marker of ["44", "mobile sheet", "320", "landscape", "mobilePages", "websitePages"]) {
  if (!mobileTests.includes(marker)) errors.push(`mobile suite is missing coverage marker: ${marker}`);
}
if (!browserHarness.includes("export const mobilePages = [...examplePages]")) errors.push("mobile suite must cover every release example, not a curated subset");
for (const marker of ["AxeBuilder", "wcag22aa", "results.violations.map", "reducedMotion", "forcedColors", "rtl", "focus returns", "releasePages"]) {
  if (!accessibilityTests.includes(marker)) errors.push(`accessibility suite is missing coverage marker: ${marker}`);
}
if (accessibilityTests.includes(".filter(({ impact })")) errors.push("accessibility gate must not ignore WCAG violations based on Axe impact");
for (const marker of ["parse5", "Duplicate IDs", "ARIA reference", "viewport", "release inventory"]) {
  if (!htmlTests.includes(marker)) errors.push(`HTML structure suite is missing coverage marker: ${marker}`);
}
if (!runtimeTests.includes("for (const contract of publicApi.javascript.behaviorContracts)")) errors.push("runtime tests must enumerate every public behavior contract");
for (const marker of ["added behavior roots", "adding and removing a behavior attribute", "removing a subtree", "scoped destroy", "multiple behavior instances", "bubbling contract event", "public destroy"]) {
  if (!runtimeTests.includes(marker)) errors.push(`runtime lifecycle suite is missing: ${marker}`);
}
for (const behavior of ["drawer", "pull-refresh", "wheel-picker", "toast"]) {
  if (!runtimeFixtures.includes(`data-g-${behavior}`)) errors.push(`runtime fixtures are missing supplemental ${behavior} markup`);
}
if (!same(registeredBehaviors, publicApi.javascript.behaviors)) errors.push("public-api behaviors must exactly match runtime registration order");
if (!same(emittedEvents, declaredEvents)) errors.push("public-api events must exactly match emitted runtime events");
if (!same(eventContracts, publicApi.javascript.eventContracts)) errors.push("public-api eventContracts must exactly match runtime event names and detail payload keys");
if (!same(publicApi.javascript.guardEvents, publicApi.javascript.events.filter((name) => name.startsWith("before")))) errors.push("public-api guardEvents must list every and only before* event");
if (!same(moduleExports, publicApi.javascript.moduleExports)) errors.push("public-api moduleExports must exactly match runtime module exports");
if (!same(publicApi.javascript.moduleContracts.map(({ name }) => name), moduleExports)) errors.push("public-api moduleContracts must cover every module export in order");
for (const contract of publicApi.javascript.moduleContracts) {
  const expectedKind = ["default", "Gardener"].includes(contract.name) ? "object" : "function";
  if (contract.kind !== expectedKind) errors.push(`module contract ${contract.name}: kind must be ${expectedKind}`);
  if (!jsIdentifier.test(contract.name)) errors.push(`module contract ${contract.name}: name must be a valid JavaScript identifier`);
  const sourceParameters = contract.parameters.map((parameter) => parameter.endsWith("?") ? parameter.slice(0, -1) : parameter);
  if (contract.kind === "function" && !same(sourceParameters, functionParameters(runtime, contract.name))) errors.push(`module contract ${contract.name}: parameters do not match runtime source`);
  const expectedSignature = contract.kind === "function"
    ? `${contract.name}(${contract.parameters.join(", ")}) => ${contract.returns}`
    : `${contract.name}: ${contract.returns}`;
  if (contract.signature !== expectedSignature) errors.push(`module contract ${contract.name}: signature must be derived from name, parameters, and return type`);
}
if (!same(gardenerProperties, publicApi.javascript.gardenerProperties)) errors.push("public-api gardenerProperties must exactly match the Gardener object");
for (const name of [...publicApi.javascript.moduleExports, ...publicApi.javascript.gardenerProperties]) if (!jsIdentifier.test(name)) errors.push(`public-api JavaScript name must be a valid identifier: ${name}`);
if (!same(runtimeInventory.behaviorContracts, publicApi.javascript.behaviorContracts)) errors.push("public-api behaviorContracts must exactly match runtime instance members");
if (!same(runtimeInventory.dataAttributes, publicApi.javascript.dataAttributes)) errors.push("public-api dataAttributes must exactly match runtime selectors, configuration reads, and managed state writes");
if (!same(manifest.behaviors, registeredBehaviors) || !same(manifest.runtimeBehaviors, manifest.behaviors)) errors.push("manifest behaviors and deprecated runtimeBehaviors alias must match the runtime registry");
if (!same(manifest.components, components.components)) errors.push("built manifest components must exactly match source component metadata");
if (!same(manifest.recipes, recipes.recipes)) errors.push("built manifest recipes must exactly match source recipe metadata");
const withoutSchema = ({ $schema, ...value }) => value;
for (const [label, sourceValue, builtFile] of [
  ["recipes", recipes, "gardener.recipes.json"],
  ["capabilities", capabilities, "gardener.capabilities.json"],
  ["public-api", publicApi, "gardener.public-api.json"],
  ["compatibility", compatibility, "gardener.compatibility.json"]
]) {
  if (!same(withoutSchema(json(join(root, "dist", builtFile))), withoutSchema(sourceValue))) errors.push(`built ${label} metadata is stale relative to its source`);
}
const layerOrder = css.match(/@layer\s+([^;]+);/)?.[1].split(",").map((name) => name.trim()) || [];
if (!same(layerOrder, publicApi.css.layers)) errors.push("public-api CSS layers must exactly match the built layer order");
const themeAttributes = ["data-g-theme", "data-g-mode", ...Object.keys(manifest.axes).map((name) => `data-g-${name}`)];
if (!same(themeAttributes, publicApi.css.themeAttributes)) errors.push("public-api themeAttributes must exactly match manifest modes and theme axes");
if (!same(publicApi.javascript.adapters.map(({ name }) => name), ["tauri", "electron"])) errors.push("public-api must declare the canonical tauri and electron adapters in order");
for (const contract of publicApi.javascript.behaviorContracts) if (!contract.instanceMembers.includes("destroy")) errors.push(`behavior contract ${contract.name}: every runtime instance must expose destroy`);

const assertUnique = (items, label) => {
  if (new Set(items).size !== items.length) errors.push(`${label} must be unique`);
};
assertUnique(components.components.map(({ name }) => name), "component names");
assertUnique(recipes.recipes.map(({ id }) => id), "recipe ids");
assertUnique(capabilities.capabilities.map(({ id }) => id), "capability ids");
const componentNames = new Set(components.components.map(({ name }) => name));
for (const [alias, target] of Object.entries(components.compositionAliases)) if (!componentNames.has(target)) errors.push(`composition alias ${alias}: unknown component target ${target}`);

for (const component of components.components) {
  if (!kebab.test(component.name)) errors.push(`component ${component.name}: name must be kebab-case`);
  if (["runtime", "runtimes", "targets"].some((field) => field in component)) errors.push(`component ${component.name}: uses a deprecated metadata field`);
  if (component.type === "interactive" && !component.behaviors?.length && !component.adapters?.length) errors.push(`component ${component.name}: interactive entries require behaviors or adapters`);
  if (component.type === "css" && (component.behaviors?.length || component.adapters?.length)) errors.push(`component ${component.name}: CSS-only entries cannot declare behaviors or adapters`);
  const expectedStatus = component.type === "interactive" ? "runtime-ready" : "css-ready";
  if (component.status !== expectedStatus) errors.push(`component ${component.name}: status must be ${expectedStatus}`);
  for (const behavior of component.behaviors || []) if (!registeredBehaviors.includes(behavior)) errors.push(`component ${component.name}: unknown behavior ${behavior}`);
  for (const adapter of component.adapters || []) if (!adapters.has(adapter)) errors.push(`component ${component.name}: unknown adapter ${adapter}`);
  const selector = component.cssSelector || (component.selector.startsWith(".") ? component.selector : null);
  if (selector && !css.includes(selector)) errors.push(`component ${component.name}: CSS selector is not implemented (${selector})`);
  for (const part of component.parts || []) if (!css.includes(`.${part.replace("*", "")}`)) errors.push(`component ${component.name}: part is not implemented (.${part})`);
}

for (const recipe of recipes.recipes) {
  if (["runtime", "runtimes"].some((field) => field in recipe)) errors.push(`recipe ${recipe.id}: uses a deprecated metadata field`);
  for (const behavior of recipe.behaviors || []) if (!registeredBehaviors.includes(behavior)) errors.push(`recipe ${recipe.id}: unknown behavior ${behavior}`);
  for (const adapter of recipe.adapters || []) if (!adapters.has(adapter)) errors.push(`recipe ${recipe.id}: unknown adapter ${adapter}`);
  if (!css.includes(recipe.root)) errors.push(`recipe ${recipe.id}: root selector is not implemented (${recipe.root})`);
  for (const part of recipe.parts) if (!css.includes(`.${part}`)) errors.push(`recipe ${recipe.id}: part is not implemented (.${part})`);
}

for (const capability of capabilities.capabilities) {
  assertUnique((capability.patterns || []).map(({ id }) => id), `capability ${capability.id} pattern ids`);
  for (const selector of capability.rootSelectors) if (!css.includes(selector)) errors.push(`capability ${capability.id}: root selector is not implemented (${selector})`);
  const documentationAnchor = capability.documentation.split("#")[1];
  if (!documentationAnchor || !websiteDocs.includes(`id="${documentationAnchor}"`)) errors.push(`capability ${capability.id}: documentation anchor is missing (${capability.documentation})`);
  for (const pattern of capability.patterns || []) {
    if ("runtime" in pattern || "runtimes" in pattern) errors.push(`capability ${capability.id}/${pattern.id}: uses a deprecated metadata field`);
    for (const behavior of pattern.behaviors || []) if (!registeredBehaviors.includes(behavior)) errors.push(`capability ${capability.id}/${pattern.id}: unknown behavior ${behavior}`);
    for (const adapter of pattern.adapters || []) if (!adapters.has(adapter)) errors.push(`capability ${capability.id}/${pattern.id}: unknown adapter ${adapter}`);
    if (!css.includes(pattern.selector)) errors.push(`capability ${capability.id}/${pattern.id}: selector is not implemented (${pattern.selector})`);
  }
}

const declaredEntrypoints = [...publicApi.css.entrypoints, ...publicApi.metadata.entrypoints, ...publicApi.metadata.schemaEntrypoints, ...publicApi.build.entrypoints, ...publicApi.javascript.adapters.map(({ entrypoint }) => entrypoint)];
for (const entrypoint of declaredEntrypoints) {
  if (!(entrypoint in pkg.exports)) errors.push(`public-api entrypoint is not exported by package.json: ${entrypoint}`);
}
if (!same([...declaredEntrypoints].sort(), Object.keys(pkg.exports).sort())) errors.push("public-api entrypoints must exactly cover every package.json export");
for (const adapter of publicApi.javascript.adapters) {
  const file = adapter.name === "tauri" ? "src/js/tauri-adapter.js" : "src/js/electron-adapter.js";
  const adapterSource = readFileSync(join(root, file), "utf8");
  if (!adapterSource.includes(`export function ${adapter.export}`)) errors.push(`adapter export is missing: ${adapter.export}`);
  for (const action of adapter.actions) if (!adapterSource.includes(action)) errors.push(`adapter ${adapter.name}: declared action is missing from source (${action})`);
  for (const member of adapter.instanceMembers) if (!adapterSource.includes(member)) errors.push(`adapter ${adapter.name}: declared instance member is missing from source (${member})`);
}
if (builds.version !== pkg.version || performance.version !== pkg.version) errors.push("build and performance contracts must equal package version");
if (performance.status !== "passed" || !performance.regressions?.pass) errors.push("published performance report must pass absolute and baseline regression budgets");
if (!same(builds.platforms.map(({ name }) => name), publicApi.build.platformProfiles)) errors.push("public build profiles must match the build catalog");
if (builds.componentPacks.length !== 28 || Object.keys(builds.componentOwnership).length !== components.components.length) errors.push("build catalog must cover 28 packs and every component");
if (!same(builds.compression, compression) || !same(budgets.compression, compression) || !same(performance.compression, compression)) errors.push("build, budget, and report compression settings must be identical");
if (!same(Object.keys(builds.componentSignatures), components.components.map(({ name }) => name))) errors.push("build catalog signatures must cover every component in metadata order");
if (!same(builds.reproducibility, { deterministic: true, integrityAlgorithm: "sha256", verificationCommand: "npm run verify:reproducible" })) errors.push("build catalog reproducibility contract is incomplete");
if (!same(Object.keys(builds.artifactIntegrity), Object.keys(builds.artifacts))) errors.push("build integrity inventory must exactly match formal artifacts");
for (const [file, integrity] of Object.entries(builds.artifactIntegrity)) {
  const expected = contentIntegrity(readFileSync(join(root, "dist", file)));
  if (!same(integrity, expected)) errors.push(`build integrity is stale: ${file}`);
}
const knownPacks = new Set(Object.keys(componentPacks));
for (const [component, packs] of Object.entries(builds.componentOwnership)) {
  if (!components.components.some(({ name }) => name === component)) errors.push(`build ownership references unknown component: ${component}`);
  for (const pack of packs) if (!knownPacks.has(pack)) errors.push(`build ownership ${component}: unknown pack ${pack}`);
}
for (const pack of builds.componentPacks) {
  const expected = Object.entries(builds.componentOwnership).filter(([, packs]) => packs.includes(pack.name)).map(([name]) => name);
  if (!same(pack.components, expected)) errors.push(`component pack ${pack.name}: reverse ownership inventory is stale`);
}
for (const profile of builds.platforms) {
  const source = platformProfiles[profile.name];
  if (!source || !same(profile.packs, source.packs)) errors.push(`platform ${profile.name}: pack inventory differs from build configuration`);
  if (profile.minCss !== `platforms/gardener.${profile.name}.min.css`) errors.push(`platform ${profile.name}: must expose its own formal CSS artifact`);
  const expectedDependencies = source?.baseCssProfile ? [`platforms/gardener.${source.baseCssProfile}.min.css`] : [];
  if (!same(profile.cssDependencies, expectedDependencies)) errors.push(`platform ${profile.name}: CSS dependency inventory differs from build configuration`);
  const expected = components.components.filter(({ name }) => builds.componentOwnership[name].some((pack) => profile.packs.includes(pack))).map(({ name }) => name);
  if (!same(profile.components, expected)) errors.push(`platform ${profile.name}: component inventory differs from emitted packs`);
}
const expectedBudgetArtifacts = Object.keys(builds.artifacts).sort();
if (!same(Object.keys(budgets.artifacts).sort(), expectedBudgetArtifacts)) errors.push("performance budgets must cover every formal minified build artifact");
for (const file of expectedBudgetArtifacts) {
  const baselineFile = budgets.baseline.artifactAliases[file] || file;
  if (!budgets.baseline.artifacts[baselineFile]) errors.push(`performance baseline must cover formal artifact ${file}`);
}
if (!same(Object.keys(performance.artifacts).sort(), expectedBudgetArtifacts)) errors.push("performance report must contain every formal minified build artifact");
if (!same(Object.keys(performance.regressions.artifacts).sort(), expectedBudgetArtifacts)) errors.push("performance regression report must contain every formal minified build artifact");
for (const script of publicApi.build.scripts) if (!(script in pkg.scripts)) errors.push(`public build script is missing: ${script}`);
for (const file of ["components", "recipes", "capabilities", "utilities", "manifest", "public-api", "builds", "custom-build", "performance-budgets", "performance-report", "compatibility"].map((name) => join(root, `metadata/${name}.schema.json`))) {
  const schema = schemaAt(file);
  if (schema.$schema !== "https://json-schema.org/draft/2020-12/schema") errors.push(`${file}: must declare JSON Schema 2020-12`);
  if (schema.type === "object" && schema.additionalProperties !== false) errors.push(`${file}: root schema must reject unknown properties`);
}

const negativeContracts = [
  ["components reject unknown root fields", { ...structuredClone(components), unexpected: true }, "components.schema.json"],
  ["components reject legacy runtime fields", { ...structuredClone(components), components: [{ ...components.components[0], runtime: "dialog" }] }, "components.schema.json"],
  ["components reject unprefixed parts", { ...structuredClone(components), components: [{ ...components.components[0], parts: ["header"] }] }, "components.schema.json"],
  ["recipes reject empty platform lists", { ...structuredClone(recipes), recipes: [{ ...recipes.recipes[0], platforms: [] }] }, "recipes.schema.json"],
  ["capabilities reject camelCase breakpoint names", { ...structuredClone(capabilities), capabilities: [{ ...capabilities.capabilities[0], breakpoints: { compactCard: 384 } }] }, "capabilities.schema.json"],
  ["utilities reject unknown fields", { ...utilities, unexpected: true }, "utilities.schema.json"],
  ["manifest requires every capability group", (() => { const value = structuredClone(manifest); delete value.aiCompositions; return value; })(), "manifest.schema.json"],
  ["public-api requires behavior contracts", (() => { const value = structuredClone(publicApi); delete value.javascript.behaviorContracts; return value; })(), "public-api.schema.json"],
  ["public-api requires event payload contracts", (() => { const value = structuredClone(publicApi); delete value.javascript.eventContracts; return value; })(), "public-api.schema.json"],
  ["build catalog rejects unknown platform fields", (() => { const value = structuredClone(builds); value.platforms[0].unexpected = true; return value; })(), "builds.schema.json"],
  ["build catalog requires artifact integrity", (() => { const value = structuredClone(builds); delete value.artifactIntegrity["gardener.min.css"].sri; return value; })(), "builds.schema.json"],
  ["performance report requires passing artifacts", (() => { const value = structuredClone(performance); delete value.artifacts["gardener.min.css"].pass; return value; })(), "performance-report.schema.json"],
  ["passed performance report rejects failed artifact results", (() => { const value = structuredClone(performance); value.artifacts["gardener.min.css"].pass = false; return value; })(), "performance-report.schema.json"],
  ["passed performance report rejects failed baseline regression", (() => { const value = structuredClone(performance); value.regressions.artifacts["gardener.min.css"].pass = false; return value; })(), "performance-report.schema.json"],
  ["compatibility baseline rejects an incomplete browser support policy", (() => { const value = structuredClone(compatibility); delete value.support.browsers.safari; return value; })(), "compatibility.schema.json"]
];
for (const [label, value, schemaFile] of negativeContracts) {
  const schemaPath = join(root, "metadata", schemaFile);
  if (validate(value, schemaAt(schemaPath), label, schemaPath, true).length === 0) errors.push(`Negative contract fixture unexpectedly passed: ${label}`);
}

if (errors.length) throw new Error(`Public contract validation failed:\n- ${[...new Set(errors)].join("\n- ")}`);
console.log(`Contracts passed: ${components.components.length} components, ${registeredBehaviors.length} behavior instances, ${eventContracts.length} event payload contracts, ${runtimeInventory.dataAttributes.behaviors.length + runtimeInventory.dataAttributes.selectors.length + runtimeInventory.dataAttributes.configuration.length} author-facing data attributes, ${recipes.recipes.length} recipes, ${capabilities.capabilities.length} capability groups, ${negativeContracts.length} negative fixtures.`);
