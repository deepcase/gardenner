import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { transform, version as esbuildVersion } from "esbuild";
import { browserTargets } from "../../config/builds.mjs";

export const minifier = {
  name: "esbuild",
  version: esbuildVersion,
  targets: browserTargets,
  legalComments: "inline",
  sourceMaps: true,
  sourceMapPolicy: "primary-and-custom",
};

export const compression = Object.freeze({ gzipLevel: 9, brotliQuality: 11 });

export async function inlineCss(filePath, seen = new Set()) {
  const resolved = resolve(filePath);
  if (seen.has(resolved)) throw new Error(`Circular CSS import: ${resolved}`);
  seen.add(resolved);
  let css = await readFile(resolved, "utf8");
  const matches = [...css.matchAll(/@import\s+["'](.+?)["'];/g)];
  for (const match of matches) {
    const imported = await inlineCss(resolve(dirname(resolved), match[1]), new Set(seen));
    css = css.replace(match[0], imported);
  }
  return css;
}

export async function composeCss(sourceRoot, files, banner) {
  const parts = [];
  for (const file of files) parts.push(await inlineCss(resolve(sourceRoot, file)));
  return `${banner}${parts.join("\n")}`;
}

function withoutGardenerBanner(source) {
  return source.replace(/^\/\* Gardener v[^\n]+\*\/\s*/u, "");
}

export async function minifyCss(source, sourcefile, _version) {
  const result = await transform(withoutGardenerBanner(source), {
    loader: "css",
    minify: true,
    legalComments: "inline",
    sourcemap: "external",
    sourcefile,
    sourcesContent: true,
    target: browserTargets,
    // Keep compressed CSS byte-stable across releases when only package metadata changes.
    // The uncompressed entrypoints and runtime still expose the exact package version.
    banner: "/*! Gardener | MIT License | gardener.css */",
  });
  return { code: result.code, map: result.map };
}

export async function minifyJavaScript(source, sourcefile, version) {
  const result = await transform(source, {
    loader: "js",
    format: "esm",
    minify: true,
    legalComments: "inline",
    sourcemap: "external",
    sourcefile,
    sourcesContent: true,
    target: "es2020",
    banner: `/*! Gardener v${version} | MIT License | gardener.css */`,
  });
  return { code: result.code, map: result.map };
}

export async function writeMinifiedPair(outputPath, result, syntax, { sourceMap = true } = {}) {
  const mapName = `${basename(outputPath)}.map`;
  const link = syntax === "css"
    ? `/*# sourceMappingURL=${mapName} */\n`
    : `//# sourceMappingURL=${mapName}\n`;
  await writeFile(outputPath, `${result.code.trimEnd()}\n${sourceMap ? link : ""}`);
  if (sourceMap) await writeFile(`${outputPath}.map`, result.map);
}

export function byteMetrics(content, settings = compression) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  return {
    raw: buffer.byteLength,
    gzip: gzipSync(buffer, { level: settings.gzipLevel }).byteLength,
    brotli: brotliCompressSync(buffer, {
      params: { [constants.BROTLI_PARAM_QUALITY]: settings.brotliQuality },
    }).byteLength,
  };
}

export function contentIntegrity(content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
  const digest = createHash("sha256").update(buffer).digest();
  return {
    algorithm: "sha256",
    sha256: digest.toString("hex"),
    sri: `sha256-${digest.toString("base64")}`,
  };
}

export function unique(values) {
  return [...new Set(values)];
}
