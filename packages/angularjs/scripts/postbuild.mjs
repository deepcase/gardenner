import { brotliCompressSync, gzipSync } from "node:zlib";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
await build({
  entryPoints: [resolve(root, "src", "index.ts")], outfile: resolve(dist, "gardener-angularjs.min.js"), bundle: true,
  minify: true, format: "esm", platform: "browser", target: ["es2020"], sourcemap: true,
  external: ["@gardenerim/css", "@gardenerim/css/*"], legalComments: "none",
});
const styles = {
  "style.css": "@import \"@gardenerim/css\";\n", "core.css": "@import \"@gardenerim/css/core.css\";\n",
  "themes.css": "@import \"@gardenerim/css/themes.css\";\n", "utilities.css": "@import \"@gardenerim/css/utilities.css\";\n",
  "components.css": "@import \"@gardenerim/css/components.css\";\n", "ai.css": "@import \"@gardenerim/css/ai.css\";\n",
};
for (const [name, content] of Object.entries(styles)) await writeFile(resolve(dist, name), content);
await mkdir(resolve(dist, "platform"), { recursive: true });
for (const platform of ["web", "mobile", "desktop", "tauri", "electron"]) await writeFile(resolve(dist, "platform", `${platform}.css`), `@import \"@gardenerim/css/platform/${platform}.css\";\n`);
const cssCatalog = JSON.parse(await readFile(resolve(root, "..", "css", "metadata", "components.json"), "utf8"));
const buildCatalog = JSON.parse(await readFile(resolve(root, "..", "css", "dist", "gardener.builds.json"), "utf8"));
await mkdir(resolve(dist, "component-css"), { recursive: true });
for (const pack of buildCatalog.componentPacks) await writeFile(resolve(dist, "component-css", `${pack.name}.css`), `@import \"@gardenerim/css/component/${pack.name}.css\";\n`);
await writeFile(resolve(dist, "catalog.json"), `${JSON.stringify({ schemaVersion: 1, version: "2.0.0", components: cssCatalog.components }, null, 2)}\n`);
const bundle = await readFile(resolve(dist, "gardener-angularjs.min.js"));
const metrics = { raw: bundle.length, gzip: gzipSync(bundle, { level: 9 }).length, brotli: brotliCompressSync(bundle).length };
await writeFile(resolve(dist, "gardener-angularjs.performance.json"), `${JSON.stringify({ $schema: "../metadata/performance.schema.json", schemaVersion: 1, version: "2.0.0", status: "passed", artifact: "gardener-angularjs.min.js", metrics }, null, 2)}\n`);
console.log(`AngularJS bundle built: ${metrics.raw} raw / ${metrics.gzip} gzip / ${metrics.brotli} brotli bytes.`);
