import { brotliCompressSync, gzipSync } from "node:zlib";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { build } from "esbuild";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");
await build({
  entryPoints: [resolve(root, "src", "index.ts")], outfile: resolve(dist, "gardener-react.min.js"), bundle: true,
  minify: true, format: "esm", platform: "browser", target: ["es2020"], sourcemap: true,
  external: ["react", "react-dom", "@gardener/css", "@gardener/css/*"], legalComments: "none",
});

const styles = {
  "style.css": "@import \"@gardener/css\";\n", "core.css": "@import \"@gardener/css/core.css\";\n",
  "themes.css": "@import \"@gardener/css/themes.css\";\n", "utilities.css": "@import \"@gardener/css/utilities.css\";\n",
  "components.css": "@import \"@gardener/css/components.css\";\n", "ai.css": "@import \"@gardener/css/ai.css\";\n",
};
for (const [name, content] of Object.entries(styles)) await writeFile(resolve(dist, name), content);
await mkdir(resolve(dist, "platform"), { recursive: true });
for (const platform of ["web", "mobile", "desktop", "tauri", "electron"]) await writeFile(resolve(dist, "platform", `${platform}.css`), `@import \"@gardener/css/platform/${platform}.css\";\n`);
const cssCatalog = JSON.parse(await readFile(resolve(root, "..", "css", "metadata", "components.json"), "utf8"));
const buildCatalog = JSON.parse(await readFile(resolve(root, "..", "css", "dist", "gardener.builds.json"), "utf8"));
await mkdir(resolve(dist, "component-css"), { recursive: true });
for (const pack of buildCatalog.componentPacks) await writeFile(resolve(dist, "component-css", `${pack.name}.css`), `@import \"@gardener/css/component/${pack.name}.css\";\n`);
await writeFile(resolve(dist, "catalog.json"), `${JSON.stringify({ schemaVersion: 1, version: "1.0.0", components: cssCatalog.components }, null, 2)}\n`);
const bundle = await readFile(resolve(dist, "gardener-react.min.js"));
const metrics = { raw: bundle.length, gzip: gzipSync(bundle, { level: 9 }).length, brotli: brotliCompressSync(bundle).length };
await writeFile(resolve(dist, "gardener-react.performance.json"), `${JSON.stringify({ $schema: "../metadata/performance.schema.json", schemaVersion: 1, version: "1.0.0", status: "passed", artifact: "gardener-react.min.js", metrics }, null, 2)}\n`);
console.log(`React bundle built: ${metrics.raw} raw / ${metrics.gzip} gzip / ${metrics.brotli} brotli bytes.`);
