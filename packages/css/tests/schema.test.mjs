import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) =>
  JSON.parse(readFileSync(resolve(projectRoot, file), "utf8"));
const schemaFiles = [
  "components",
  "recipes",
  "capabilities",
  "utilities",
  "manifest",
  "public-api",
  "builds",
  "custom-build",
  "performance-budgets",
  "performance-report",
  "compatibility",
];
const schemas = Object.fromEntries(
  schemaFiles.map((name) => [name, read(`metadata/${name}.schema.json`)]),
);
const compatibilityAlias = read("metadata/schema.json");
const documents = {
  components: read("metadata/components.json"),
  recipes: read("dist/gardener.recipes.json"),
  capabilities: read("dist/gardener.capabilities.json"),
  utilities: read("dist/gardener.utilities.json"),
  manifest: read("dist/gardener.manifest.json"),
  "public-api": read("dist/gardener.public-api.json"),
  builds: read("dist/gardener.builds.json"),
  "performance-budgets": read("config/performance-budgets.json"),
  "performance-report": read("dist/gardener.performance.json"),
  compatibility: read("dist/gardener.compatibility.json"),
};

const ajv = new Ajv2020({
  allErrors: true,
  strict: true,
  validateSchema: true,
});
for (const schema of Object.values(schemas)) ajv.addSchema(schema);
ajv.addSchema(compatibilityAlias);

const errorText = (validate) =>
  ajv.errorsText(validate.errors, { separator: "\n" });
const compactDocument = (name) =>
  name === "utilities"
    ? {
        ...structuredClone(documents[name]),
        count: 1,
        utilities: [structuredClone(documents[name].utilities[0])],
      }
    : structuredClone(documents[name]);

for (const name of schemaFiles) {
  test(`JSON Schema 2020-12: ${name} schema is valid and compiles`, () => {
    assert.equal(
      ajv.validateSchema(schemas[name]),
      true,
      ajv.errorsText(ajv.errors),
    );
    assert.equal(typeof ajv.getSchema(schemas[name].$id), "function");
  });

}

for (const name of Object.keys(documents)) {
  test(`JSON Schema 2020-12: ${name} accepts its release document and rejects unknown roots`, () => {
    const validate = ajv.getSchema(schemas[name].$id);
    assert.equal(validate(documents[name]), true, errorText(validate));
    const compact = compactDocument(name);
    assert.equal(validate({ ...compact, unexpected: true }), false);
    assert.ok(
      validate.errors?.some(
        (error) => error.keyword === "additionalProperties",
      ),
    );
  });
}

test("JSON Schema 2020-12: every declared object shape is closed or explicitly typed", () => {
  for (const [name, schema] of Object.entries(schemas)) {
    const open = [];
    const walk = (value, path = "#") => {
      if (!value || typeof value !== "object") return;
      if (
        value.type === "object" &&
        !("additionalProperties" in value) &&
        !("patternProperties" in value)
      )
        open.push(path);
      for (const [key, child] of Object.entries(value)) {
        if (Array.isArray(child))
          child.forEach((item, index) => walk(item, `${path}/${key}/${index}`));
        else walk(child, `${path}/${key}`);
      }
    };
    walk(schema);
    assert.deepEqual(open, [], `${name} contains open object shapes`);
  }
});

const nestedContracts = [
  ["components", (value) => value.components[0]],
  ["recipes", (value) => value.recipes[0]],
  ["capabilities", (value) => value.capabilities[0]],
  ["utilities", (value) => value.utilities[0]],
  ["manifest", (value) => value.components[0]],
  ["public-api", (value) => value.javascript.moduleContracts[0]],
  ["builds", (value) => value.platforms[0]],
  ["performance-budgets", (value) => value.artifacts["gardener.min.css"]],
  ["performance-report", (value) => value.artifacts["gardener.min.css"]],
  ["compatibility", (value) => value.support.browsers],
];

for (const [name, select] of nestedContracts) {
  test(`JSON Schema 2020-12: ${name} rejects unknown nested fields`, () => {
    const validate = ajv.getSchema(schemas[name].$id);
    const invalid = compactDocument(name);
    select(invalid).unexpected = true;
    assert.equal(validate(invalid), false);
    assert.ok(
      validate.errors?.some(
        (error) => error.keyword === "additionalProperties",
      ),
      errorText(validate),
    );
  });
}

const requiredContracts = [
  ["components", (value) => delete value.components[0].selector],
  ["recipes", (value) => delete value.recipes[0].parts],
  ["capabilities", (value) => delete value.capabilities[0].documentation],
  ["utilities", (value) => delete value.utilities[0].declarations],
  ["manifest", (value) => delete value.components[0].platforms],
  ["public-api", (value) => delete value.javascript.adapters[0].export],
  ["builds", (value) => delete value.platforms[0].minCss],
  ["performance-budgets", (value) => delete value.artifacts["gardener.min.css"].gzip],
  ["performance-report", (value) => delete value.artifacts["gardener.min.css"].pass],
  ["compatibility", (value) => delete value.policy.removals],
];

for (const [name, mutate] of requiredContracts) {
  test(`JSON Schema 2020-12: ${name} rejects missing nested contract fields`, () => {
    const validate = ajv.getSchema(schemas[name].$id);
    const invalid = compactDocument(name);
    mutate(invalid);
    assert.equal(validate(invalid), false);
    assert.ok(
      validate.errors?.some((error) => error.keyword === "required"),
      errorText(validate),
    );
  });
}

test("JSON Schema 2020-12: public API rejects invalid JavaScript identifiers", () => {
  const validate = ajv.getSchema(schemas["public-api"].$id);
  const invalid = compactDocument("public-api");
  invalid.javascript.moduleExports[0] = "invalid-export-name";
  invalid.javascript.moduleContracts[0].name = "invalid-export-name";
  assert.equal(validate(invalid), false);
  assert.ok(
    validate.errors?.some((error) => error.keyword === "pattern"),
    errorText(validate),
  );
});

test("JSON Schema 2020-12: deprecated component schema alias remains resolvable", () => {
  assert.equal(
    ajv.validateSchema(compatibilityAlias),
    true,
    ajv.errorsText(ajv.errors),
  );
  const validate = ajv.getSchema(compatibilityAlias.$id);
  assert.equal(typeof validate, "function");
  assert.equal(validate(documents.components), true, errorText(validate));
});

test("JSON Schema 2020-12: cross-schema manifest references reject an invalid component", () => {
  const validate = ajv.getSchema(schemas.manifest.$id);
  const invalid = structuredClone(documents.manifest);
  invalid.components[0].parts = ["header"];
  assert.equal(validate(invalid), false);
  assert.ok(
    validate.errors?.some((error) => error.instancePath.endsWith("/parts/0")),
  );
});

test("JSON Schema 2020-12: public API requires event payload contracts", () => {
  const validate = ajv.getSchema(schemas["public-api"].$id);
  const invalid = structuredClone(documents["public-api"]);
  delete invalid.javascript.eventContracts;
  assert.equal(validate(invalid), false);
  assert.ok(
    validate.errors?.some(
      (error) =>
        error.instancePath === "/javascript" && error.keyword === "required",
    ),
  );
});

test("JSON Schema 2020-12: build integrity rejects malformed SHA-256 digests", () => {
  const validate = ajv.getSchema(schemas.builds.$id);
  const invalid = structuredClone(documents.builds);
  invalid.artifactIntegrity["gardener.min.css"].sha256 = "not-a-sha256-digest";
  assert.equal(validate(invalid), false);
  assert.ok(validate.errors?.some((error) => error.keyword === "pattern"), errorText(validate));
});

test("JSON Schema 2020-12: passed reports reject failed baseline regressions", () => {
  const validate = ajv.getSchema(schemas["performance-report"].$id);
  const invalid = structuredClone(documents["performance-report"]);
  invalid.regressions.package.pass = false;
  assert.equal(validate(invalid), false);
  assert.ok(validate.errors?.some((error) => error.keyword === "const"), errorText(validate));
});
