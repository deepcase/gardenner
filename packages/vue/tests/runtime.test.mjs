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
  Event: window.Event,
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

test("native controls and Gardenerim events support Vue model updates", async () => {
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

test("interactive wrappers initialize and expose Gardenerim behavior instances", async () => {
  const component = ref();
  const { app, host } = mount(() => h(library.GDialog, { ref: component, id: "dialog-test" }, () => h("div", { class: "g-dialog" }, [h("button", { "data-g-close": "" }, "Close")])));
  await nextTick();
  const dialog = host.querySelector("[data-g-dialog]");
  assert.ok(dialog);
  assert.ok(component.value.getInstance("dialog"));
  app.unmount();
  host.remove();
});

test("radio models compare and emit option values, not truthiness", async () => {
  const model = ref("personal"); const updates = [];
  const { app, host } = mount(() => h("div", ["personal", "business"].map(value => h(library.GInput, {
    type: "radio", name: "plan", value, modelValue: model.value, initialize: false,
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
  }))));
  await nextTick(); const [personal, business] = host.querySelectorAll("input");
  assert.equal(personal.checked, true); assert.equal(business.checked, false);
  business.checked = true; business.dispatchEvent(new window.Event("change", { bubbles: true }));
  await nextTick(); assert.deepEqual(updates, ["business"]); assert.equal(personal.checked, false);
  model.value = "personal"; await nextTick(); assert.equal(personal.checked, true); assert.equal(business.checked, false);
  app.unmount(); host.remove();
});

test("dynamic component forwards an explicitly undefined initial model", async () => {
  const model=ref(undefined);
  const {app,host}=mount(()=>h(library.GardenerimComponent,{definition:library.componentByName.get('input'),modelValue:model.value,initialize:false,'onUpdate:modelValue':value=>model.value=value}));
  const input=host.querySelector('input'); input.value='青禾'; input.dispatchEvent(new window.Event('input',{bubbles:true}));
  await nextTick(); assert.equal(model.value,'青禾'); app.unmount(); host.remove();
});

test("multiple selects preserve Set models", async () => {
  const model=ref(new Set(['a']));
  const {app,host}=mount(()=>h(library.GSelect,{multiple:true,modelValue:model.value,initialize:false,'onUpdate:modelValue':value=>model.value=value},()=>['a','b'].map(value=>h('option',{value},value))));
  const select=host.querySelector('select'); select.options[1].selected=true; select.dispatchEvent(new window.Event('change',{bubbles:true}));
  await nextTick(); assert.ok(model.value instanceof Set); assert.deepEqual([...model.value],['a','b']); app.unmount(); host.remove();
});

test("multiple selects emit arrays and update after async options and model reset", async () => {
  const model = ref(["a", "b"]); const options = ref([]); const updates = [];
  const { app, host } = mount(() => h(library.GSelect, { multiple: true, modelValue: model.value, initialize: false,
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
  }, () => options.value.map(value => h("option", { value }, value))));
  await nextTick(); options.value = ["a", "b", "c"]; await nextTick();
  const select = host.querySelector("select");
  assert.deepEqual(Array.from(select.selectedOptions, option => option.value), ["a", "b"]);
  select.options[0].selected = false; select.options[2].selected = true;
  select.dispatchEvent(new window.Event("change", { bubbles: true })); await nextTick();
  assert.deepEqual(updates, [["b", "c"]]);
  model.value = []; await nextTick(); assert.equal(select.selectedOptions.length, 0);
  model.value = ["a"]; await nextTick(); assert.equal(select.options[0].selected, true);
  app.unmount(); host.remove();
});

test("checkbox arrays and undefined initial text models retain Vue semantics", async () => {
  const selected = ref(["a"]); const text = ref(undefined);
  const { app, host } = mount(() => h("div", [h(library.GInput, {
    type: "checkbox", value: "a", modelValue: selected.value, initialize: false,
    "onUpdate:modelValue": value => selected.value = value,
  }), h(library.GInput, { modelValue: text.value, initialize: false, "onUpdate:modelValue": value => text.value = value })]));
  await nextTick(); const [checkbox, input] = host.querySelectorAll("input");
  assert.equal(checkbox.checked, true); checkbox.checked = false;
  checkbox.dispatchEvent(new window.Event("change", { bubbles: true })); await nextTick(); assert.deepEqual(selected.value, []);
  input.value = "中文"; input.dispatchEvent(new window.Event("input", { bubbles: true })); await nextTick();
  assert.equal(text.value, "中文");
  app.unmount(); host.remove();
});

test("IME input waits for composition to end and emits once per input", async () => {
  const updates = []; const model = ref("");
  const { app, host } = mount(() => h(library.GInput, { modelValue: model.value, initialize: false,
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
  }));
  const input = host.querySelector("input"); input.dispatchEvent(new window.Event("compositionstart"));
  input.value = "中"; input.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.equal(updates.length, 0);
  input.dispatchEvent(new window.Event("compositionend")); await nextTick();
  assert.deepEqual(updates, ["中"]);
  app.unmount(); host.remove();
});

test("the package entrypoint is safe to render during SSR", async () => {
  const { renderToString } = await import("@vue/server-renderer");
  const html = await renderToString(h(library.GCard, { variant: "interactive" }, () => "SSR"));
  assert.match(html, /class="g-card g-card-interactive"/u);
  assert.match(html, />SSR</u);
});

test("GardenerimProvider applies all supplied theme axes", async () => {
  const { app, host } = mount(() => h(library.GardenerimProvider, { theme: "garden", mode: "light", density: "compact", shape: "subtle" }, () => "Content"));
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
  library.GardenerimVue.install(app, { initialize: false });
  assert.equal(registered.length, 509);
  assert.ok(registered.includes("GButton"));
  assert.ok(registered.includes("GProvider"));
  assert.deepEqual(directives, ["gardenerim"]);
});
