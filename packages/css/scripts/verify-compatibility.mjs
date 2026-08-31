import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = async (file) => JSON.parse(await readFile(join(root, file), "utf8"));
const [pkg, api, components, recipes, manifest, compatibility] = await Promise.all([
  json("package.json"),
  json("metadata/public-api.json"),
  json("metadata/components.json"),
  json("metadata/recipes.json"),
  json("dist/gardener.manifest.json"),
  json("metadata/compatibility.json"),
]);

const errors = [];
const current = {
  packageEntrypoints: Object.keys(pkg.exports),
  cssLayers: api.css.layers,
  themeAttributes: api.css.themeAttributes,
  moduleExports: api.javascript.moduleExports,
  gardenerProperties: api.javascript.gardenerProperties,
  behaviors: api.javascript.behaviors,
  events: api.javascript.events,
  dataAttributes: Object.values(api.javascript.dataAttributes).flat(),
  adapters: api.javascript.adapters.map(({ name, export: exported }) => `${name}:${exported}`),
  componentNames: components.components.map(({ name }) => name),
  recipeIds: recipes.recipes.map(({ id }) => id),
  themeNames: manifest.themes,
  modes: manifest.modes,
};

if (compatibility.version !== pkg.version) errors.push("compatibility version must equal package version");
if (compatibility.baselineVersion !== "0.9.0") errors.push("2.0.0 compatibility baseline must preserve the complete 0.9.0 contract");
if (compatibility.policy.stage !== "stable") errors.push("2.0.0 compatibility policy must be stable");
if (pkg.engines?.node !== compatibility.support.node) errors.push("package Node engine must match compatibility support policy");
for (const [group, baseline] of Object.entries(compatibility.baseline)) {
  const available = new Set(current[group] || []);
  for (const value of baseline) if (!available.has(value)) errors.push(`${group}: removed 0.9.0 public contract without compatibility coverage (${value})`);
  if (compatibility.policy.stage === "stable" && compatibility.policy.stableTarget === pkg.version) {
    const recorded = new Set(baseline);
    for (const value of available) if (!recorded.has(value)) errors.push(`${group}: 2.0.0 Stable baseline omitted an existing 0.9.0 contract (${value})`);
  }
}
for (const alias of compatibility.deprecatedAliases) {
  if (api.compatibility.deprecatedFields[alias.name] !== alias.replacement) errors.push(`deprecated alias is stale: ${alias.name}`);
}

if (errors.length) {
  console.error(`Compatibility verification failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Compatibility verification passed: ${Object.values(compatibility.baseline).reduce((sum, items) => sum + items.length, 0)} baseline contracts preserved from ${compatibility.baselineVersion}.`);
}
