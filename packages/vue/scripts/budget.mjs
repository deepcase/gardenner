import { brotliCompressSync, gzipSync } from "node:zlib";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const budget = JSON.parse(await readFile(resolve(root, "config", "performance-budgets.json"), "utf8"));
const report = JSON.parse(await readFile(resolve(root, "dist", "gardener-vue.performance.json"), "utf8"));
const bundle = await readFile(resolve(root, "dist", report.artifact));
const actual = { raw: bundle.length, gzip: gzipSync(bundle, { level: 9 }).length, brotli: brotliCompressSync(bundle).length };
for (const metric of ["raw", "gzip", "brotli"]) if (actual[metric] > budget.bundle[metric]) throw new Error(`${metric} budget exceeded: ${actual[metric]} > ${budget.bundle[metric]}`);
if (JSON.stringify(actual) !== JSON.stringify(report.metrics)) throw new Error("performance report is stale");
console.log(`Performance budget passed: ${actual.raw} raw / ${actual.gzip} gzip / ${actual.brotli} brotli bytes.`);
