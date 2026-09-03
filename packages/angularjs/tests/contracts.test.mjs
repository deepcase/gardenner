import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import * as components from "../dist/generated/components.js";
import * as rootModule from "../dist/index.js";
import { componentCatalog } from "../dist/generated/catalog.js";

const root = resolve(import.meta.dirname, "..");
const api = JSON.parse(await readFile(resolve(root, "metadata/public-api.json"), "utf8"));
const cssApi = JSON.parse(await readFile(resolve(root, "../css/metadata/public-api.json"), "utf8"));

test("all 506 CSS components have unique AngularJS directive contracts", () => {
  assert.equal(componentCatalog.length, 506);
  for (const key of ["name", "exportName", "directiveName", "elementName"]) assert.equal(new Set(componentCatalog.map((item) => item[key])).size, 506, key);
  assert.equal(Object.keys(components.gardenerimDirectives).length, 506);
  for (const definition of componentCatalog) {
    assert.equal(typeof components[definition.exportName], "function", definition.exportName);
    assert.equal(components.gardenerimDirectives[definition.directiveName], components[definition.exportName]);
    const directive = components[definition.exportName]();
    assert.equal(directive.restrict, "EA");
    assert.equal(directive.require, "?ngModel");
    assert.equal(typeof directive.link, "function");
  }
});

test("component behaviors are covered by the 72-behavior runtime", () => {
  assert.equal(cssApi.javascript.behaviors.length, 72);
  for (const definition of componentCatalog) for (const behavior of definition.behaviors) assert.ok(cssApi.javascript.behaviors.includes(behavior), `${definition.name}/${behavior}`);
});

test("stable metadata records every root runtime and TypeScript contract", () => {
  assert.deepEqual(Object.keys(rootModule).sort(), api.moduleExports);
  assert.equal(api.moduleExports.length, 542);
  assert.equal(api.typeExports.length, 24);
  assert.equal(api.componentAttributes.length, 8);
  assert.equal(api.componentHandleMembers.length, 4);
  assert.equal(api.themeAxes.length, 10);
});

test("package root is SSR-safe and does not require global AngularJS", () => {
  const result = spawnSync(process.execPath, ["--input-type=module", "--eval", `import(${JSON.stringify(new URL("../dist/index.js", import.meta.url).href)}).then((m)=>console.log(m.GARDENERIM_ANGULARJS_MODULE))`], { encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /gardener/u);
});

test("AngularJS 1.8.2 and 1.8.3 execute the same compile contract", () => {
  for (const [packageName, version] of [["angular-1-8-2", "1.8.2"], ["angular", "1.8.3"]]) {
    const result = spawnSync(process.execPath, [resolve(root, "tests/angular-version-runner.mjs"), packageName], { cwd: root, encoding: "utf8", windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
    const output = JSON.parse(result.stdout.trim().split(/\r?\n/u).at(-1));
    assert.equal(output.version, version);
    assert.match(output.buttonClass, /g-btn-primary/u);
    assert.equal(output.value, "ready");
  }
});
