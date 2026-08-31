import { access, readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { componentPacks, platformProfiles } from "../config/builds.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const css = await readFile(join(dist, "gardener.css"), "utf8");
const sourceEntry = await readFile(join(root, "src/gardener.css"), "utf8");
const tokens = await readFile(join(root, "src/tokens/tokens.css"), "utf8");
const axes = await readFile(join(root, "src/themes/axes.css"), "utf8");
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
const componentMetadata = JSON.parse(await readFile(join(root, "metadata/components.json"), "utf8"));
const capabilityMetadata = JSON.parse(await readFile(join(root, "metadata/capabilities.json"), "utf8"));
const publicApiMetadata = JSON.parse(await readFile(join(root, "metadata/public-api.json"), "utf8"));
const builtManifest = JSON.parse(await readFile(join(dist, "gardener.manifest.json"), "utf8"));
const runtimeSource = await readFile(join(root, "src/js/index.js"), "utf8");
const buildCatalog = JSON.parse(await readFile(join(dist, "gardener.builds.json"), "utf8"));
const performanceReport = JSON.parse(await readFile(join(dist, "gardener.performance.json"), "utf8"));
const errors = [];

if (builtManifest.version !== pkg.version || !runtimeSource.includes(`version: "${pkg.version}"`)) errors.push("Package, manifest, and runtime versions are not synchronized");
const runtimeRegistry = runtimeSource.match(/\[\s*\["dialog"[\s\S]*?\]\s*\.forEach\(\(\[name, factory\]\)/)?.[0] || "";
const registeredBehaviors = [...runtimeRegistry.matchAll(/\["([a-z-]+)"\s*,/g)].map((match) => match[1]);
if (!registeredBehaviors.length || JSON.stringify(registeredBehaviors) !== JSON.stringify(builtManifest.behaviors)) errors.push("Runtime behavior manifest is not synchronized with the registry");
if (JSON.stringify(builtManifest.runtimeBehaviors) !== JSON.stringify(builtManifest.behaviors)) errors.push("Deprecated runtimeBehaviors alias is not synchronized with behaviors");
for (const key of ["name", "selector"]) {
  const values = componentMetadata.components.map((component) => component[key]).filter(Boolean);
  if (new Set(values).size !== values.length) errors.push(`Component metadata contains duplicate ${key} values`);
}
for (const environment of ["light", "dark", "system", "high-contrast", "rtl", "reduced-motion", "forced-colors", "print", "mobile", "tablet", "desktop"]) {
  if (!componentMetadata.requiredEnvironmentMatrix.includes(environment)) errors.push(`Required environment matrix is missing ${environment}`);
}
const gridCapability = capabilityMetadata.capabilities.find(({ id }) => id === "layout.grid");
if (!gridCapability || gridCapability.status !== "implemented" || !gridCapability.systems.includes(24) || !gridCapability.systems.includes(12)) errors.push("Complete 24/12 grid capability metadata is missing");

const imports = [...sourceEntry.matchAll(/@import\s+["'](.+?)["'];/g)].map((match) => match[1]);
if (new Set(imports).size !== imports.length) errors.push("src/gardener.css contains duplicate imports");
const componentFiles = (await readdir(join(root, "src/components"))).filter((file) => file.endsWith(".css"));
for (const file of componentFiles) if (!imports.includes(`./components/${file}`)) errors.push(`Component source is not imported: ${file}`);
const packedComponentFiles = Object.values(componentPacks).flat().filter((file) => file.startsWith("components/")).map((file) => file.slice("components/".length));
for (const file of componentFiles) {
  const assignments = packedComponentFiles.filter((candidate) => candidate === file).length;
  if (assignments !== 1) errors.push(`Component source must belong to exactly one build pack: ${file} (${assignments})`);
}
for (const file of packedComponentFiles) if (!componentFiles.includes(file)) errors.push(`Component pack references an unknown source file: ${file}`);
for (const [profileName, profile] of Object.entries(platformProfiles)) {
  if (new Set(profile.packs).size !== profile.packs.length) errors.push(`Platform profile contains duplicate packs: ${profileName}`);
  for (const pack of profile.packs) if (!componentPacks[pack]) errors.push(`Platform profile references an unknown pack: ${profileName}/${pack}`);
}
if (/@import\s/.test(css)) errors.push("Built gardener.css still contains @import rules");
if (!css.includes("@layer gardener.reset, gardener.tokens, gardener.base, gardener.components, gardener.utilities, gardener.overrides;")) errors.push("Canonical CSS layer order is missing");

const definitions = new Set([...css.matchAll(/(--g-[a-z0-9-]+)\s*:/g)].map((match) => match[1]));
for (const match of css.matchAll(/var\(\s*(--g-[a-z0-9-]+)([^)]*)\)/g)) {
  if (!definitions.has(match[1]) && !match[2].trimStart().startsWith(",")) errors.push(`Undefined custom property without fallback: ${match[1]}`);
}

for (const target of Object.values(pkg.exports).flatMap((value) => typeof value === "string" ? [value] : Object.values(value))) {
  if (target.includes("*")) {
    const sample = target.replace("*", buildCatalog.componentPacks[0].name);
    await access(resolve(root, sample)).catch(() => errors.push(`Package pattern export target does not resolve: ${target}`));
  } else await access(resolve(root, target)).catch(() => errors.push(`Package export target does not exist: ${target}`));
}
const declaredEntrypoints = new Set([
  ...publicApiMetadata.css.entrypoints,
  ...publicApiMetadata.metadata.entrypoints,
  ...publicApiMetadata.metadata.schemaEntrypoints,
  ...publicApiMetadata.build.entrypoints,
  ...publicApiMetadata.javascript.adapters.map(({ entrypoint }) => entrypoint),
  publicApiMetadata.build.componentPackPattern,
  publicApiMetadata.compatibility.baselineEntrypoint,
  publicApiMetadata.compatibility.schemaEntrypoint,
]);
const packageEntrypoints = Object.keys(pkg.exports);
for (const entrypoint of packageEntrypoints) if (!declaredEntrypoints.has(entrypoint)) errors.push(`Package export is missing from the Stable public API catalog: ${entrypoint}`);
for (const entrypoint of declaredEntrypoints) if (!packageEntrypoints.includes(entrypoint)) errors.push(`Stable public API catalog references an unknown package export: ${entrypoint}`);

const hex = (block, name) => block.match(new RegExp(`${name}:\\s*(#[0-9a-f]{3,8})`, "i"))?.[1];
const rgb = (value) => {
  const normalized = value.length === 4 ? `#${[...value.slice(1)].map((item) => item + item).join("")}` : value;
  return normalized.slice(1, 7).match(/../g).map((item) => parseInt(item, 16) / 255);
};
const luminance = (value) => rgb(value).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (left, right) => (Math.max(luminance(left), luminance(right)) + 0.05) / (Math.min(luminance(left), luminance(right)) + 0.05);
const rootBlock = tokens.match(/:root\s*\{([\s\S]*?)\n\s*\}/)?.[1] || "";
const darkBlock = tokens.match(/\[data-g-mode="dark"\]\s*\{([\s\S]*?)\n\s*\}/)?.[1] || "";
for (const [label, block] of [["light", rootBlock], ["dark", darkBlock]]) {
  for (const [foreground, background] of [["--g-color-text-muted", "--g-color-canvas"], ["--g-color-text-subtle", "--g-color-canvas"], ["--g-color-success", "--g-color-success-soft"], ["--g-color-warning", "--g-color-warning-soft"], ["--g-color-danger", "--g-color-danger-soft"], ["--g-color-info", "--g-color-info-soft"]]) {
    const left = hex(block, foreground);
    const right = hex(block, background);
    if (left && right && contrast(left, right) < 4.5) errors.push(`${label} contrast below WCAG AA: ${foreground} on ${background} (${contrast(left, right).toFixed(2)})`);
  }
}
for (const match of axes.matchAll(/^  \[data-g-neutral="([^"]+)"\]\s*\{([^}]*)\}/gm)) {
  const canvas = hex(match[2], "--g-color-canvas");
  const subtle = hex(match[2], "--g-color-text-subtle");
  if (canvas && subtle && contrast(canvas, subtle) < 4.5) errors.push(`Neutral axis ${match[1]} has insufficient subtle text contrast`);
}

const bundles = {
  core: await readFile(join(dist, "gardener.core.css"), "utf8"),
  components: await readFile(join(dist, "gardener.components.css"), "utf8"),
  utilities: await readFile(join(dist, "gardener.utilities.css"), "utf8"),
  ai: await readFile(join(dist, "gardener.ai.css"), "utf8")
};
if (/\.g-btn\s*\{/.test(bundles.core)) errors.push("Core bundle leaks component CSS");
if (bundles.components.includes(".g-chat")) errors.push("Generic components bundle leaks AI CSS");
if (/\.g-btn\s*\{/.test(bundles.utilities)) errors.push("Utilities bundle leaks component CSS");
if (!bundles.ai.includes(".g-chat") || bundles.ai.includes(".g-cms-shell")) errors.push("AI bundle boundary is incorrect");
if (!bundles.components.includes(".g-grid-24") || !bundles.components.includes(".g-print-col-24")) errors.push("Components bundle is missing the complete grid system");

if (buildCatalog.version !== pkg.version || buildCatalog.platforms.length !== 5 || buildCatalog.componentPacks.length !== 28) errors.push("2.0.0 targeted build catalog is incomplete");
if (Object.keys(buildCatalog.componentOwnership).length !== componentMetadata.components.length) errors.push("Every component must resolve to an owning build pack");
if (Object.keys(buildCatalog.componentSignatures || {}).length !== componentMetadata.components.length) errors.push("Every component must expose selector signatures for auditable pack ownership");
if (performanceReport.version !== pkg.version || performanceReport.status !== "passed" || !performanceReport.regressions?.pass) errors.push("Published performance report is missing or failed");
const expectedPerformanceArtifacts = Object.keys(buildCatalog.artifacts).sort();
if (JSON.stringify(Object.keys(performanceReport.artifacts).sort()) !== JSON.stringify(expectedPerformanceArtifacts)) errors.push("Performance report does not cover every formal build artifact");
if (JSON.stringify(Object.keys(buildCatalog.artifactIntegrity || {}).sort()) !== JSON.stringify(expectedPerformanceArtifacts)) errors.push("Build integrity does not cover every formal build artifact");
const fullMin = await readFile(join(dist, "gardener.min.css"));
const runtimeMin = await readFile(join(dist, "gardener.runtime.min.js"));
if (fullMin.byteLength >= Buffer.byteLength(css)) errors.push("Formal CSS minification did not reduce the full bundle");
if (runtimeMin.byteLength >= Buffer.byteLength(runtimeSource)) errors.push("Formal JavaScript minification did not reduce the runtime");
for (const profile of ["web", "mobile", "desktop", "tauri", "electron"]) {
  await access(join(dist, `platforms/gardener.${profile}.min.css`)).catch(() => errors.push(`Missing platform build: ${profile}`));
}
for (const pack of buildCatalog.componentPacks) {
  await access(join(dist, pack.minCss)).catch(() => errors.push(`Missing component pack build: ${pack.name}`));
}
for (const sourceMap of ["gardener.min.css.map", "gardener.core.min.css.map", "gardener.themes.min.css.map", "gardener.utilities.min.css.map", "gardener.components.min.css.map", "gardener.ai.min.css.map", "gardener.runtime.min.js.map", "gardener.tauri.min.js.map", "gardener.electron.min.js.map"]) {
  const mapPath = join(dist, sourceMap);
  await access(mapPath).catch(() => errors.push(`Missing primary Source Map: ${sourceMap}`));
  try {
    const parsed = JSON.parse(await readFile(mapPath, "utf8"));
    if (parsed.version !== 3 || !parsed.sources?.length || parsed.sourcesContent?.length !== parsed.sources.length || !parsed.mappings) errors.push(`Incomplete primary Source Map: ${sourceMap}`);
    const artifact = sourceMap.replace(/\.map$/u, "");
    if (!(await readFile(join(dist, artifact), "utf8")).includes(`sourceMappingURL=${sourceMap}`)) errors.push(`Primary artifact does not link its Source Map: ${artifact}`);
  } catch {
    errors.push(`Invalid primary Source Map: ${sourceMap}`);
  }
}

if (errors.length) throw new Error(`Deep audit failed:\n- ${[...new Set(errors)].join("\n- ")}`);
console.log(`Deep audit passed: ${componentFiles.length} component stylesheets, ${definitions.size} tokens/custom properties, ${Object.keys(pkg.exports).length} package exports.`);
