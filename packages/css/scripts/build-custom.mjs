import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  componentPacks,
  coreFiles,
  platformProfiles,
} from "../config/builds.mjs";
import {
  byteMetrics,
  compression,
  composeCss,
  contentIntegrity,
  minifier,
  minifyCss,
  unique,
  writeMinifiedPair,
} from "./lib/build-tools.mjs";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = resolve(projectRoot, "src");
const distRoot = resolve(projectRoot, "dist");
const pkg = JSON.parse(await readFile(resolve(projectRoot, "package.json"), "utf8"));
const components = JSON.parse(await readFile(resolve(projectRoot, "metadata/components.json"), "utf8")).components;
const builds = JSON.parse(await readFile(resolve(distRoot, "gardener.builds.json"), "utf8"));
const args = process.argv.slice(2);
const valueOptions = new Set(["--platform", "--components", "--packs", "--out"]);
const flagOptions = new Set(["--utilities", "--no-utilities", "--help"]);
const parsedValues = new Map();
const parsedFlags = new Set();

for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (flagOptions.has(argument)) {
    if (parsedFlags.has(argument)) throw new Error(`Duplicate option: ${argument}`);
    parsedFlags.add(argument);
    continue;
  }
  if (!valueOptions.has(argument)) throw new Error(`Unknown option: ${argument}`);
  if (parsedValues.has(argument)) throw new Error(`Duplicate option: ${argument}`);
  const optionValue = args[index + 1];
  if (!optionValue || optionValue.startsWith("--")) throw new Error(`Missing value for ${argument}`);
  parsedValues.set(argument, optionValue);
  index += 1;
}

function value(name) {
  return parsedValues.get(name);
}

function list(name) {
  return unique((value(name) || "").split(",").map((item) => item.trim()).filter(Boolean));
}

if (parsedFlags.has("--help")) {
  console.log(`Gardener custom build

Usage:
  node scripts/build-custom.mjs --platform <web|mobile|desktop|tauri|electron> [--out path]
  node scripts/build-custom.mjs --components <name,...> [--packs <pack,...>] [--out path]
  node scripts/build-custom.mjs --packs <pack,...> [--out path]

Options:
  --utilities       Include all utility classes in a component build
  --no-utilities    Exclude utilities from a platform build
  --out             Output base path without extension
`);
  process.exit(0);
}

const platformName = value("--platform");
const requestedComponents = list("--components");
const requestedPacks = list("--packs");
if (parsedFlags.has("--utilities") && parsedFlags.has("--no-utilities")) throw new Error("Use either --utilities or --no-utilities, not both.");
if (platformName && (requestedComponents.length || requestedPacks.length)) throw new Error("Use either --platform or --components/--packs, not both.");
if (!platformName && !requestedComponents.length && !requestedPacks.length) throw new Error("Provide --platform, --components, or --packs.");

const knownComponents = new Set(components.map(({ name }) => name));
const knownPacks = new Set(Object.keys(componentPacks));
for (const name of requestedComponents) if (!knownComponents.has(name)) throw new Error(`Unknown component: ${name}`);
for (const name of requestedPacks) if (!knownPacks.has(name)) throw new Error(`Unknown component pack: ${name}`);
if (platformName && !platformProfiles[platformName]) throw new Error(`Unknown platform: ${platformName}`);
if (builds.version !== pkg.version || Object.keys(builds.componentOwnership || {}).length !== components.length) {
  throw new Error("dist/gardener.builds.json is stale; run npm run build before creating a custom build.");
}

const profile = platformName ? platformProfiles[platformName] : null;
const ownership = builds.componentOwnership;
const resolvedPacks = profile
  ? profile.packs
  : unique([
      ...requestedPacks,
      ...requestedComponents.flatMap((name) => ownership[name]),
    ]);
const includeUtilities = profile ? !parsedFlags.has("--no-utilities") : parsedFlags.has("--utilities");
const includedComponents = components
  .filter(({ name }) => ownership[name].some((pack) => resolvedPacks.includes(pack)))
  .map(({ name }) => name);
const outputDefault = resolve(distRoot, "custom", `gardener.${platformName || "components"}`);
const rawOutput = resolve(projectRoot, value("--out") || outputDefault);
const outputBase = rawOutput.replace(/(?:\.min)?\.css$/u, "");
const cssPath = `${outputBase}.css`;
const minCssPath = `${outputBase}.min.css`;
const manifestPath = `${outputBase}.json`;
const files = [
  ...coreFiles,
  ...resolvedPacks.flatMap((pack) => componentPacks[pack]),
  ...(includeUtilities ? ["generated/utilities.css"] : []),
];
const banner = `/* Gardener v${pkg.version} | MIT License | gardener.css */\n`;
const css = await composeCss(sourceRoot, files, banner);
const minified = await minifyCss(css, basename(cssPath), pkg.version);
await mkdir(dirname(outputBase), { recursive: true });
await writeFile(cssPath, css);
await writeMinifiedPair(minCssPath, minified, "css");

const adapters = profile?.adapters || [];
for (const adapter of adapters) {
  await copyFile(
    resolve(distRoot, `gardener.${adapter}.min.js`),
    resolve(dirname(outputBase), `gardener.${adapter}.min.js`),
  );
}
const outputFiles = [cssPath, minCssPath, `${minCssPath}.map`, ...adapters.map((adapter) => resolve(dirname(outputBase), `gardener.${adapter}.min.js`))];
const outputIntegrity = Object.fromEntries(await Promise.all(outputFiles.map(async (file) => [basename(file), contentIntegrity(await readFile(file))])));
const customManifest = {
  $schema: "https://gardener.style/schema/custom-build.schema.json",
  schemaVersion: 1,
  gardenerVersion: pkg.version,
  kind: platformName ? "platform" : "components",
  platform: platformName || null,
  requestedComponents,
  requestedPacks,
  resolvedPacks,
  includedComponents,
  includeUtilities,
  files,
  css: basename(cssPath),
  minCss: basename(minCssPath),
  sourceMap: `${basename(minCssPath)}.map`,
  runtime: "@gardener/css",
  adapters: adapters.map((adapter) => `gardener.${adapter}.min.js`),
  minifier,
  compression,
  outputIntegrity,
  metrics: {
    css: byteMetrics(css),
    minCss: byteMetrics(await readFile(minCssPath)),
  },
};
await writeFile(manifestPath, `${JSON.stringify(customManifest, null, 2)}\n`);
console.log(`Gardener custom build: ${resolvedPacks.length} pack(s), ${includedComponents.length} component(s), ${customManifest.metrics.minCss.raw} minified bytes -> ${minCssPath}`);
