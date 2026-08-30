import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const catalog = await import("../dist/generated/catalog.js");
const components = await import("../dist/generated/components.js");
const api = JSON.parse(await readFile(new URL("../metadata/public-api.json", import.meta.url), "utf8"));
const css = JSON.parse(await readFile(new URL("../../css/metadata/components.json", import.meta.url), "utf8"));

test("all 506 Gardener CSS components have unique Vue exports", () => {
  assert.equal(catalog.componentCatalog.length, 506);
  assert.equal(Object.keys(components.gardenerComponents).length, 506);
  assert.equal(new Set(catalog.componentCatalog.map(({ name }) => name)).size, 506);
  assert.equal(new Set(catalog.componentCatalog.map(({ exportName }) => exportName)).size, 506);
  assert.deepEqual(catalog.componentCatalog.map(({ name }) => name), css.components.map(({ name }) => name));
});

test("component behaviors are covered by the 66-behavior runtime", async () => {
  const runtime = JSON.parse(await readFile(new URL("../../css/metadata/public-api.json", import.meta.url), "utf8"));
  const behaviorSet = new Set(runtime.javascript.behaviors);
  for (const component of catalog.componentCatalog) for (const behavior of component.behaviors) assert.ok(behaviorSet.has(behavior), `${component.name}/${behavior}`);
  assert.equal(api.behaviors, 66);
});

test("the stable API contains every component export", () => {
  assert.equal(api.status, "stable");
  assert.deepEqual(api.componentExports, catalog.componentCatalog.map(({ exportName }) => exportName));
});

test("the stable API records every root runtime and TypeScript contract", async () => {
  const module = await import("../dist/index.js");
  assert.deepEqual(api.moduleExports, Object.keys(module).sort());
  assert.equal(api.moduleExports.length, 538);
  assert.equal(api.typeExports.length, 21);
  assert.deepEqual(api.componentProps, ["as", "variant", "state", "config", "initialize", "modelValue", "modelEvent", "modelKey"]);
  assert.equal(api.themeAxes.length, 10);
});

test("behavior-only selectors retain their required visual root classes", () => {
  const expected = {
    combobox: "g-combobox", tabs: "g-tabs", dialog: "g-dialog-backdrop", drawer: "g-drawer-backdrop",
    popover: "g-popover", toast: "g-toast", accordion: "g-accordion", "data-grid": "g-data-grid",
    tree: "g-tree", carousel: "g-carousel", "split-pane": "g-split-pane",
  };
  for (const [name, className] of Object.entries(expected)) assert.equal(catalog.componentByName.get(name).className, className);
  assert.equal(catalog.componentByName.get("copy-action").className, undefined);
  assert.equal(catalog.componentByName.get("fullscreen-action").className, undefined);
});
