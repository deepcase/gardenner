import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const files = [
  ["public-api", "../metadata/public-api.schema.json", "../metadata/public-api.json"],
  ["compatibility", "../metadata/compatibility.schema.json", "../metadata/compatibility.json"],
  ["performance", "../metadata/performance.schema.json", "../dist/gardener-react.performance.json"],
];

for (const [name, schemaPath, dataPath] of files) {
  test(`${name} metadata satisfies its closed JSON Schema`, async () => {
    const schema = JSON.parse(await readFile(new URL(schemaPath, import.meta.url), "utf8"));
    const data = JSON.parse(await readFile(new URL(dataPath, import.meta.url), "utf8"));
    const validate = new Ajv2020({ strict: true }).compile(schema);
    assert.equal(validate(data), true, JSON.stringify(validate.errors));
    const invalid = structuredClone(data);
    invalid.unknownField = true;
    assert.equal(validate(invalid), false);
    const missing = structuredClone(data);
    delete missing.version;
    assert.equal(validate(missing), false);
    if (name === "compatibility") {
      const nested = structuredClone(data);
      nested.policy.unknownField = true;
      assert.equal(validate(nested), false);
      const missingNested = structuredClone(data);
      delete missingNested.baseline.themeAxes;
      assert.equal(validate(missingNested), false);
    }
    if (name === "performance") {
      const nested = structuredClone(data);
      nested.metrics.unknownField = true;
      assert.equal(validate(nested), false);
      const missingNested = structuredClone(data);
      delete missingNested.metrics.gzip;
      assert.equal(validate(missingNested), false);
    }
  });
}
