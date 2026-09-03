import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporary = await mkdtemp(join(tmpdir(), "gardenerim-admin-"));
const output = join(temporary, "admin");
const components = "button,card,input,select,table,dialog,data-grid,tabs,menu-dropdown,toast,drawer,tree";

try {
  const result = spawnSync(process.execPath, ["scripts/build-custom.mjs", "--components", components, "--out", output], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const custom = JSON.parse(await readFile(`${output}.json`, "utf8"));
  const full = JSON.parse(await readFile(join(root, "dist", "gardener.performance.json"), "utf8"));
  const customGzip = custom.metrics.minCss.gzip;
  const fullGzip = full.artifacts["gardener.min.css"].actual.gzip;
  assert.ok(customGzip <= 40_000, `Admin custom build is ${customGzip} gzip bytes; limit is 40000`);
  assert.ok(customGzip / fullGzip <= 0.30, `Admin custom build is ${(customGzip / fullGzip * 100).toFixed(1)}% of full CSS; limit is 30%`);
  console.log(`Admin custom build passed: ${customGzip} gzip bytes (${(customGzip / fullGzip * 100).toFixed(1)}% of full CSS).`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
