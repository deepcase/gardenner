import test from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window({ url: "http://localhost/" });
for (const [name, value] of Object.entries({
  window, document: window.document, Node: window.Node, Element: window.Element, HTMLElement: window.HTMLElement,
  HTMLInputElement: window.HTMLInputElement, HTMLTextAreaElement: window.HTMLTextAreaElement, HTMLSelectElement: window.HTMLSelectElement,
  HTMLButtonElement: window.HTMLButtonElement, CustomEvent: window.CustomEvent, Event: window.Event, MutationObserver: window.MutationObserver,
})) Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
await import("angular/angular.js");
const angular = window.angular;
const library = await import("../dist/index.js");

const makeHarness = (markup, selected = undefined) => {
  const suffix = Math.random().toString(36).slice(2);
  const moduleName = library.createGardenerimAngularJS(angular, { moduleName: `gardener.test.${suffix}`, components: selected });
  const injector = angular.injector(["ng", moduleName]);
  const scope = injector.get("$rootScope").$new();
  const element = injector.get("$compile")(markup)(scope);
  document.body.append(element[0]);
  scope.$digest();
  return { injector, scope, element, destroy() { scope.$destroy(); element.remove(); } };
};

test("module installation is idempotent and supports selected components", () => {
  const name = `gardener.selected.${Date.now()}`;
  const options = { moduleName: name, components: ["button", "GInputDirective", "gCard"] };
  const first = library.createGardenerimAngularJS(angular, options);
  const second = library.createGardenerimAngularJS(angular, { ...options, components: ["card", "GButtonDirective", "gInput"] });
  assert.equal(first, second);
  assert.throws(() => library.createGardenerimAngularJS(angular, { moduleName: name }), /different options/u);
  assert.throws(() => library.createGardenerimAngularJS(angular, { moduleName: `${name}.typo`, components: ["not-a-component"] }), /Unknown Gardenerim AngularJS component/u);
  const queue = angular.module(name)._invokeQueue.filter((entry) => entry[1] === "directive").map((entry) => entry[2][0]);
  assert.ok(queue.includes("gButton"));
  assert.ok(queue.includes("gInput"));
  assert.ok(queue.includes("gCard"));
  assert.ok(!queue.includes("gDialog"));
});

test("default module registers every generated directive exactly once", () => {
  const name = `gardener.complete.${Date.now()}`;
  library.createGardenerimAngularJS(angular, { moduleName: name });
  const queue = angular.module(name)._invokeQueue.filter((entry) => entry[1] === "directive").map((entry) => entry[2][0]);
  assert.equal(queue.length, 508);
  assert.equal(new Set(queue).size, 508);
  for (const definition of library.componentCatalog) assert.ok(queue.includes(definition.directiveName), definition.directiveName);
  assert.ok(queue.includes("gGardenerim"));
  assert.ok(queue.includes("gardenerProvider"));
});

test("element and attribute forms both retain content and receive root classes", () => {
  const harness = makeHarness('<div><g-card id="element-card"><span>Element content</span></g-card><article id="attribute-card" g-card>Attribute content</article></div>', ["card"]);
  const elementCard = harness.element[0].querySelector("#element-card");
  const attributeCard = harness.element[0].querySelector("#attribute-card");
  assert.ok(elementCard.classList.contains("g-card"));
  assert.ok(attributeCard.classList.contains("g-card"));
  assert.equal(elementCard.textContent, "Element content");
  assert.equal(attributeCard.textContent, "Attribute content");
  harness.destroy();
});

test("component directive applies class, variant, state, config, defaults, and handle", () => {
  const harness = makeHarness('<button g-button gardener-variant="primary sm" gardener-state="loading" gardener-config="cfg">Save</button>', ["button"]);
  harness.scope.cfg = { startOpen: true, ignored: false };
  harness.scope.$digest();
  const button = harness.element[0];
  assert.ok(button.classList.contains("g-btn"));
  assert.ok(button.classList.contains("g-btn-primary"));
  assert.ok(button.classList.contains("g-btn-sm"));
  assert.ok(button.classList.contains("is-loading"));
  assert.equal(button.getAttribute("data-g-start-open"), "");
  assert.equal(button.type, "button");
  const handle = harness.element.data("$gardenerHandle");
  assert.equal(handle.element, button);
  assert.equal(typeof handle.refresh, "function");
  assert.equal(typeof handle.destroy, "function");
  harness.destroy();
  assert.equal(harness.element.data("$gardenerHandle"), undefined);
});

test("ngModel and native value callback stay synchronized once per edit", () => {
  const harness = makeHarness('<input g-input ng-model="model.value" gardener-on-value-change="changes.push($value)" aria-label="Name">', ["input"]);
  harness.scope.model = { value: "alpha" };
  harness.scope.changes = [];
  harness.scope.$digest();
  const input = harness.element[0];
  assert.equal(input.value, "alpha");
  input.value = "beta";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  harness.scope.$digest();
  assert.equal(harness.scope.model.value, "beta");
  assert.deepEqual(harness.scope.changes, ["beta"]);
  harness.destroy();
});

test("custom Gardenerim value events update ngModel using valueKey", () => {
  const harness = makeHarness('<div g-tree-select ng-model="selected" gardener-value-event="gardener:change" gardener-value-key="nodeId"></div>', ["tree-select"]);
  harness.element[0].dispatchEvent(new window.CustomEvent("gardener:change", { detail: { nodeId: "node-42" }, bubbles: true }));
  harness.scope.$digest();
  assert.equal(harness.scope.selected, "node-42");
  harness.destroy();
});

test("checkbox and radio preserve idiomatic AngularJS model values", () => {
  const checkbox = makeHarness('<input type="checkbox" g-input ng-model="accepted">', ["input"]);
  checkbox.element[0].checked = true;
  checkbox.element[0].dispatchEvent(new window.Event("change", { bubbles: true }));
  checkbox.scope.$digest();
  assert.equal(checkbox.scope.accepted, true);
  checkbox.destroy();

  const radio = makeHarness('<input type="radio" value="business" g-input ng-model="accountType">', ["input"]);
  radio.element[0].checked = true;
  radio.element[0].dispatchEvent(new window.Event("change", { bubbles: true }));
  radio.scope.$digest();
  assert.equal(radio.scope.accountType, "business");
  radio.destroy();
});

test("multiple select keeps AngularJS array semantics and callback values", () => {
  const harness = makeHarness('<select multiple g-select ng-model="selected" gardener-on-value-change="changes.push($value)"><option value="a">A</option><option value="b">B</option></select>', ["select"]);
  harness.scope.selected = ["a"];
  harness.scope.changes = [];
  harness.scope.$digest();
  const select = harness.element[0];
  assert.equal(select.options[0].selected, true);
  select.options[1].selected = true;
  select.dispatchEvent(new window.Event("change", { bubbles: true }));
  harness.scope.$digest();
  assert.deepEqual(harness.scope.selected, ["a", "b"]);
  assert.deepEqual(harness.scope.changes, [["a", "b"]]);
  harness.destroy();
});

test("initialize and generic behavior attributes respond to scope changes", async () => {
  const lifecycle = makeHarness('<button g-copy-action gardener-initialize="enabled" data-g-copy-value="value"></button>', ["copy-action"]);
  lifecycle.scope.enabled = false;
  lifecycle.scope.$digest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(lifecycle.element[0].hasAttribute("data-g-copy"), false);
  assert.equal(library.getInstance(lifecycle.element[0], "copy"), null);
  lifecycle.scope.enabled = true;
  lifecycle.scope.$digest();
  assert.equal(lifecycle.element[0].hasAttribute("data-g-copy"), true);
  assert.ok(library.getInstance(lifecycle.element[0], "copy"));
  lifecycle.scope.enabled = false;
  lifecycle.scope.$digest();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(lifecycle.element[0].hasAttribute("data-g-copy"), false);
  assert.equal(library.getInstance(lifecycle.element[0], "copy"), null);
  lifecycle.destroy();

  const behavior = makeHarness('<button g-gardenerim="{{ behavior }}"></button>', []);
  behavior.scope.behavior = "copy";
  behavior.scope.$digest();
  assert.equal(behavior.element[0].hasAttribute("data-g-copy"), true);
  behavior.scope.behavior = "fullscreen";
  behavior.scope.$digest();
  assert.equal(behavior.element[0].hasAttribute("data-g-copy"), false);
  assert.equal(behavior.element[0].hasAttribute("data-g-fullscreen"), true);
  behavior.destroy();
});

test("provider directive applies all supplied theme axes", () => {
  const harness = makeHarness('<gardener-provider gardener-theme="garden" gardener-mode="light" gardener-shape="small" gardener-density="compact"><span>Child</span></gardener-provider>', []);
  const provider = harness.element[0];
  assert.equal(provider.getAttribute("data-g-theme"), "garden");
  assert.equal(provider.getAttribute("data-g-mode"), "light");
  assert.equal(provider.getAttribute("data-g-shape"), "small");
  assert.equal(provider.getAttribute("data-g-density"), "compact");
  harness.destroy();
});

test("runtime, theme, and toast services are injectable", () => {
  const harness = makeHarness("<div></div>", []);
  const runtime = harness.injector.get("GardenerimRuntime");
  const theme = harness.injector.get("GardenerimTheme");
  const toast = harness.injector.get("GardenerimToast");
  assert.equal(runtime.version, "2.1.0");
  assert.equal(runtime.configure({ locale: "es", refresh: false }).locale, "es");
  assert.equal(runtime.getConfiguration().locale, "es");
  runtime.configure({ locale: "en", refresh: false });
  const target = document.createElement("div");
  theme.apply(target, { theme: "blue", mode: "light" });
  assert.deepEqual(theme.read(target), { theme: "blue", mode: "light" });
  assert.equal(typeof toast.show, "function");
  harness.destroy();
});

test("Tauri and Electron entrypoints bind isolated bridges", async () => {
  const [tauri, electron] = await Promise.all([import("../dist/tauri.js"), import("../dist/electron.js")]);
  assert.ok(!("bindElectronWindowControls" in tauri));
  assert.ok(!("bindTauriWindowControls" in electron));
  const actions = [];
  const tauriRoot = document.createElement("div");
  tauriRoot.innerHTML = '<button data-g-window-action="minimize"></button>';
  const electronRoot = tauriRoot.cloneNode(true);
  document.body.append(tauriRoot, electronRoot);
  const tauriBinding = tauri.createTauriWindowService(tauriRoot, { minimize: () => actions.push("tauri") });
  const electronBinding = electron.createElectronWindowService(electronRoot, { minimize: () => actions.push("electron") });
  tauriRoot.querySelector("button").click();
  electronRoot.querySelector("button").click();
  assert.deepEqual(actions, ["tauri", "electron"]);
  tauriBinding.destroy(); electronBinding.destroy(); tauriRoot.remove(); electronRoot.remove();
});
