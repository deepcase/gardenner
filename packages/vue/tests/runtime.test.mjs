import test from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window({ url: "https://gardener.test/" });
Object.assign(globalThis, {
  window,
  document: window.document,
  Element: window.Element,
  HTMLElement: window.HTMLElement,
  HTMLInputElement: window.HTMLInputElement,
  HTMLTextAreaElement: window.HTMLTextAreaElement,
  HTMLSelectElement: window.HTMLSelectElement,
  SVGElement: window.SVGElement,
  Document: window.Document,
  DocumentFragment: window.DocumentFragment,
  CustomEvent: window.CustomEvent,
  MutationObserver: window.MutationObserver,
});
Object.defineProperty(globalThis, "navigator", { value: window.navigator, configurable: true });
Object.defineProperty(globalThis, "requestAnimationFrame", { value: window.requestAnimationFrame.bind(window), configurable: true });
Object.defineProperty(globalThis, "cancelAnimationFrame", { value: window.cancelAnimationFrame.bind(window), configurable: true });
Object.defineProperty(globalThis, "getComputedStyle", { value: window.getComputedStyle.bind(window), configurable: true });
const { createApp, h, nextTick, ref } = await import("vue");
const library = await import("../dist/index.js");

const mount = (render) => {
  const host = document.createElement("div");
  document.body.append(host);
  const app = createApp({ render });
  app.mount(host);
  return { app, host };
};

test("generated components render base, variant, state, config, and behavior contracts", async () => {
  const { app, host } = mount(() => h(library.GButton, { variant: ["primary", "sm"], state: "loading", config: { timeout: 300 } }, () => "Save"));
  await nextTick();
  const button = host.querySelector("button");
  assert.ok(button);
  assert.equal(button.type, "button");
  assert.ok(button.classList.contains("g-btn"));
  assert.ok(button.classList.contains("g-btn-primary"));
  assert.ok(button.classList.contains("g-btn-sm"));
  assert.ok(button.classList.contains("is-loading"));
  assert.equal(button.dataset.gTimeout, "300");
  app.unmount();
  host.remove();
});

test("explicit behavior attributes win over generated empty defaults", async () => {
  const { app, host } = mount(() => h(library.GCopyAction, { "data-g-copy": "release-value", class: "g-btn" }, () => "Copy"));
  await nextTick();
  assert.equal(host.querySelector("[data-g-copy]").getAttribute("data-g-copy"), "release-value");
  app.unmount();
  host.remove();
});

test("reactive config changes rebuild behavior instances and initialize=false tears them down", async () => {
  const config = ref({ dismissible: true });
  const enabled = ref(true);
  const { app, host } = mount(() => h(library.GDialog, { config: config.value, initialize: enabled.value }, () => h("div", { class: "g-dialog" }, "Dialog")));
  await nextTick();
  const root = host.querySelector("[data-g-dialog]");
  const first = library.getInstance(root, "dialog");
  assert.ok(first);
  config.value = { dismissible: false };
  await nextTick();
  await nextTick();
  assert.equal(root.getAttribute("data-g-dismissible"), null);
  const second = library.getInstance(root, "dialog");
  assert.ok(second);
  assert.notEqual(second, first);
  enabled.value = false;
  await nextTick();
  assert.equal(library.getInstance(root, "dialog"), null);
  app.unmount();
  host.remove();
});

test("native controls and Gardener events support Vue model updates", async () => {
  const nativeValues = [];
  const runtimeValues = [];
  const { app, host } = mount(() => h("div", [
    h(library.GInput, { modelValue: "before", "onUpdate:modelValue": (value) => nativeValues.push(value) }),
    h(library.GTreeSelect, { modelValue: "old", modelEvent: "pickerchange", "onUpdate:modelValue": (value) => runtimeValues.push(value) }),
  ]));
  await nextTick();
  const input = host.querySelector("input");
  input.value = "after";
  input.dispatchEvent(new window.Event("input", { bubbles: true }));
  host.querySelector("[data-g-picker]").dispatchEvent(new window.CustomEvent("gardener:pickerchange", { bubbles: true, detail: { value: "new" } }));
  assert.deepEqual(nativeValues, ["after"]);
  assert.deepEqual(runtimeValues, ["new"]);
  app.unmount();
  host.remove();
});

test("interactive wrappers initialize and expose Gardener behavior instances", async () => {
  const component = ref();
  const { app, host } = mount(() => h(library.GDialog, { ref: component, id: "dialog-test" }, () => h("div", { class: "g-dialog" }, [h("button", { "data-g-close": "" }, "Close")])));
  await nextTick();
  const dialog = host.querySelector("[data-g-dialog]");
  assert.ok(dialog);
  assert.ok(component.value.getInstance("dialog"));
  app.unmount();
  host.remove();
});

test("the package entrypoint is safe to render during SSR", async () => {
  const { renderToString } = await import("@vue/server-renderer");
  const html = await renderToString(h(library.GCard, { variant: "interactive" }, () => "SSR"));
  assert.match(html, /class="g-card g-card-interactive"/u);
  assert.match(html, />SSR</u);
});

test("GardenerProvider applies all supplied theme axes", async () => {
  const { app, host } = mount(() => h(library.GardenerProvider, { theme: "garden", mode: "light", density: "compact", shape: "subtle" }, () => "Content"));
  await nextTick();
  const provider = host.firstElementChild;
  assert.equal(provider.dataset.gTheme, "garden");
  assert.equal(provider.dataset.gMode, "light");
  assert.equal(provider.dataset.gDensity, "compact");
  assert.equal(provider.dataset.gShape, "subtle");
  app.unmount();
  host.remove();
});

test("the Vue plugin registers the complete component catalog and directive", () => {
  const registered = [];
  const directives = [];
  const app = { component: (name) => registered.push(name), directive: (name) => directives.push(name) };
  library.GardenerVue.install(app, { initialize: false });
  assert.equal(registered.length, 509);
  assert.ok(registered.includes("GButton"));
  assert.ok(registered.includes("GProvider"));
  assert.deepEqual(directives, ["gardener"]);
});
