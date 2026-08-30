import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

const root = resolve(import.meta.dirname, "..");
for (const [name, schemaFile, dataFile] of [
  ["public-api", "metadata/public-api.schema.json", "metadata/public-api.json"],
  ["compatibility", "metadata/compatibility.schema.json", "metadata/compatibility.json"],
  ["performance", "metadata/performance.schema.json", "dist/gardener-angularjs.performance.json"],
]) test(`${name} metadata satisfies its closed JSON Schema`, async () => {
  const schema = JSON.parse(await readFile(resolve(root, schemaFile), "utf8"));
  const data = JSON.parse(await readFile(resolve(root, dataFile), "utf8"));
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  assert.equal(validate(data), true, JSON.stringify(validate.errors));
  const unknown = structuredClone(data); unknown.unknownField = true;
  assert.equal(validate(unknown), false, "unknown root fields must fail");
  const missing = structuredClone(data); delete missing.version;
  assert.equal(validate(missing), false, "missing required fields must fail");
  if (name === "compatibility") { const nested = structuredClone(data); nested.policy.unknownField = true; assert.equal(validate(nested), false, "unknown nested fields must fail"); }
  if (name === "performance") { const nested = structuredClone(data); nested.metrics.unknownField = true; assert.equal(validate(nested), false, "unknown metric fields must fail"); }
});
