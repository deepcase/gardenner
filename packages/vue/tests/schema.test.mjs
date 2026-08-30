import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import Ajv2020 from "ajv/dist/2020.js";

const read = async (url) => JSON.parse(await readFile(url, "utf8"));
const cases = [
  ["public API", new URL("../metadata/public-api.schema.json", import.meta.url), new URL("../metadata/public-api.json", import.meta.url)],
  ["compatibility", new URL("../metadata/compatibility.schema.json", import.meta.url), new URL("../metadata/compatibility.json", import.meta.url)],
  ["performance", new URL("../metadata/performance.schema.json", import.meta.url), new URL("../dist/gardener-vue.performance.json", import.meta.url)],
];

for (const [name, schemaUrl, documentUrl] of cases) test(`${name} metadata conforms to a closed JSON Schema 2020-12 contract`, async () => {
  const schema = await read(schemaUrl);
  const document = await read(documentUrl);
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema);
  assert.equal(validate(document), true, JSON.stringify(validate.errors));
  assert.equal(validate({ ...document, unknownReleaseField: true }), false);
  const missing = structuredClone(document);
  delete missing.version;
  assert.equal(validate(missing), false);
});
