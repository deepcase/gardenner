import { mkdir, readFile, readdir } from "node:fs/promises";
import { writeFile } from "../../scripts/fs-retry.mjs";
import { createHash } from "node:crypto";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const home = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = resolve(home, "..");
const sourceRoot = resolve(project, "packages/css/src");
const output = resolve(home, "assets/css-catalog.json");
const utilityManifestPath = resolve(project, "packages/css/dist/gardener.utilities.json");

async function listCss(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listCss(path));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(path);
  }
  return files.sort();
}

function matchingBrace(css, opening) {
  let depth = 0;
  let quote = "";
  for (let index = opening; index < css.length; index += 1) {
    const character = css[index];
    if (quote) {
      if (character === "\\") index += 1;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === "{") depth += 1;
    else if (character === "}" && --depth === 0) return index;
  }
  return css.length - 1;
}

function parseRules(css, source) {
  const rules = [];
  const keyframes = [];
  const walk = (start, end, contexts = []) => {
    let cursor = start;
    while (cursor < end) {
      while (cursor < end && /\s|;/.test(css[cursor])) cursor += 1;
      if (cursor >= end) break;
      const opening = css.indexOf("{", cursor);
      if (opening < 0 || opening >= end) break;
      const prelude = css.slice(cursor, opening).trim();
      const closing = matchingBrace(css, opening);
      if (!prelude) { cursor = closing + 1; continue; }
      if (/^@(layer|media|supports|container|scope|starting-style)\b/i.test(prelude)) walk(opening + 1, closing, [...contexts, prelude]);
      else if (/^@(?:-\w+-)?keyframes\b/i.test(prelude)) keyframes.push(prelude.replace(/^@(?:-\w+-)?keyframes\s+/i, "").trim());
      else if (!prelude.startsWith("@")) rules.push({ selector: prelude.replace(/\s+/g, " "), source, contexts });
      cursor = closing + 1;
    }
  };
  walk(0, css.length);
  return { rules, keyframes };
}

const files = await listCss(sourceRoot);
const utilityManifest = JSON.parse(await readFile(utilityManifestPath, "utf8"));
const utilityClassSet = new Set(utilityManifest.utilities.map((utility) => utility.class));
const modules = [];
const selectorMap = new Map();
const classMap = new Map();
const stateMap = new Map();
const tokenMap = new Map();
const dataMap = new Map();
const keyframeMap = new Map();

const add = (map, key, source, extra) => {
  if (!map.has(key)) map.set(key, { name: key, sources: new Set(), extras: new Set() });
  const item = map.get(key);
  item.sources.add(source);
  if (extra) item.extras.add(extra);
};

for (const file of files) {
  const source = relative(resolve(project, "packages/css"), file).replaceAll("\\", "/");
  const isUtilityModule = source === "src/generated/utilities.css";
  const raw = await readFile(file, "utf8");
  const css = raw.replace(/\/\*[\s\S]*?\*\//g, "");
  const { rules, keyframes } = parseRules(css, source);
  const moduleClasses = new Set();
  const moduleStates = new Set();
  for (const rule of rules) {
    if (!isUtilityModule) add(selectorMap, rule.selector, source, rule.contexts.join(" → "));
    for (const match of rule.selector.matchAll(/\.((?:\\.|[\w-])+)/g)) {
      const name = match[1].replaceAll("\\/", "/").replaceAll("\\:", ":");
      if (name.startsWith("g-")) {
        if (!isUtilityModule && !utilityClassSet.has(name)) add(classMap, name, source, rule.selector);
        moduleClasses.add(name);
      }
      else if (name.startsWith("is-") || name.startsWith("has-")) { add(stateMap, name, source, rule.selector); moduleStates.add(name); }
    }
  }
  for (const match of css.matchAll(/(--g-[a-z0-9-]+)\s*:\s*([^;}]+)/gi)) add(tokenMap, match[1], source, match[2].trim());
  for (const match of css.matchAll(/\[(data-g-[a-z0-9-]+)/gi)) add(dataMap, match[1], source);
  for (const name of keyframes) add(keyframeMap, name, source);
  modules.push({
    file: source,
    bytes: Buffer.byteLength(raw),
    sha256: createHash("sha256").update(raw).digest("hex"),
    rules: rules.length,
    classCount: moduleClasses.size,
    classes: isUtilityModule ? [] : [...moduleClasses].filter((name) => !utilityClassSet.has(name)).sort(),
    ...(isUtilityModule ? { externalCatalog: "packages/css/dist/gardener.utilities.json" } : {}),
    stateHooks: [...moduleStates].sort(),
    customProperties: [...new Set([...css.matchAll(/(--g-[a-z0-9-]+)\s*:/gi)].map((match) => match[1]))].sort(),
    dataAttributes: [...new Set([...css.matchAll(/\[(data-g-[a-z0-9-]+)/gi)].map((match) => match[1]))].sort(),
    keyframes: [...new Set(keyframes)].sort()
  });
}

const serialize = (map, extraName) => [...map.values()].map((item) => ({
  name: item.name,
  sources: [...item.sources].sort(),
  ...(item.extras.size ? { [extraName]: [...item.extras].sort() } : {})
})).sort((left, right) => left.name.localeCompare(right.name));

const catalog = {
  schemaVersion: 1,
  generatedFrom: "packages/css/src/**/*.css",
  totals: {
    modules: modules.length,
    rules: selectorMap.size,
    classes: classMap.size + utilityClassSet.size,
    semanticClasses: classMap.size,
    utilityClasses: utilityClassSet.size,
    stateHooks: stateMap.size,
    customProperties: tokenMap.size,
    dataAttributes: dataMap.size,
    keyframes: keyframeMap.size
  },
  modules,
  classes: serialize(classMap, "selectors"),
  stateHooks: serialize(stateMap, "selectors"),
  selectors: serialize(selectorMap, "contexts"),
  customProperties: serialize(tokenMap, "values"),
  dataAttributes: serialize(dataMap, "contexts"),
  keyframes: serialize(keyframeMap, "contexts")
};

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`CSS catalog built: ${catalog.totals.modules} modules, ${catalog.totals.classes} classes, ${catalog.totals.customProperties} custom properties, ${catalog.totals.rules} selectors.`);
