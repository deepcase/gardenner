import test from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window({ url: "https://gardener.test/" });
Object.assign(globalThis, {
  window, document: window.document, Element: window.Element, HTMLElement: window.HTMLElement, HTMLInputElement: window.HTMLInputElement,
  HTMLTextAreaElement: window.HTMLTextAreaElement, HTMLSelectElement: window.HTMLSelectElement, SVGElement: window.SVGElement,
  Document: window.Document, DocumentFragment: window.DocumentFragment, CustomEvent: window.CustomEvent, Event: window.Event,
  MutationObserver: window.MutationObserver, IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(globalThis, "navigator", { value: window.navigator, configurable: true });
Object.defineProperty(globalThis, "requestAnimationFrame", { value: window.requestAnimationFrame.bind(window), configurable: true });
Object.defineProperty(globalThis, "cancelAnimationFrame", { value: window.cancelAnimationFrame.bind(window), configurable: true });
Object.defineProperty(globalThis, "getComputedStyle", { value: window.getComputedStyle.bind(window), configurable: true });
const React = await import("react");
const { createRoot, hydrateRoot } = await import("react-dom/client");
const { renderToString } = await import("react-dom/server");
const library = await import("../dist/index.js");

const mount = async (element) => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await React.act(async () => { root.render(element); });
  return { root, host, unmount: async () => { await React.act(async () => root.unmount()); host.remove(); } };
};

test("generated components render base, variant, state, config, and behavior contracts", async () => {
  const mounted = await mount(React.createElement(library.GButton, { variant: ["primary", "sm"], state: "loading", config: { timeout: 300 } }, "Save"));
  const button = mounted.host.querySelector("button");
  assert.ok(button);
  assert.equal(button.type, "button");
  assert.ok(button.classList.contains("g-btn-primary"));
  assert.ok(button.classList.contains("g-btn-sm"));
  assert.ok(button.classList.contains("is-loading"));
  assert.equal(button.dataset.gTimeout, "300");
  await mounted.unmount();
});

test("explicit behavior attributes win over generated defaults", async () => {
  const mounted = await mount(React.createElement(library.GCopyAction, { "data-g-copy": "release-value", className: "g-btn" }, "Copy"));
  assert.equal(mounted.host.querySelector("[data-g-copy]").getAttribute("data-g-copy"), "release-value");
  await mounted.unmount();
});

test("controlled native inputs and Gardenerim events call onValueChange", async () => {
  const nativeValues = [];
  const runtimeValues = [];
  const mounted = await mount(React.createElement("div", null,
    React.createElement(library.GInput, { value: "before", onValueChange: (value) => nativeValues.push(value) }),
    React.createElement(library.GTreeSelect, { value: "old", valueEvent: "pickerchange", onValueChange: (value) => runtimeValues.push(value) }),
  ));
  const input = mounted.host.querySelector("input");
  input.value = "after";
  await React.act(async () => input.dispatchEvent(new window.Event("input", { bubbles: true })));
  await React.act(async () => mounted.host.querySelector("[data-g-picker]").dispatchEvent(new window.CustomEvent("gardener:pickerchange", { bubbles: true, detail: { value: "new" } })));
  assert.deepEqual(nativeValues, ["after"]);
  assert.deepEqual(runtimeValues, ["new"]);
  await mounted.unmount();
});

test("interactive wrappers initialize and expose behavior handles", async () => {
  const reference = React.createRef();
  const mounted = await mount(React.createElement(library.GDialog, { ref: reference, id: "dialog-test" }, React.createElement("div", { className: "g-dialog" }, "Dialog")));
  assert.ok(mounted.host.querySelector("[data-g-dialog]"));
  assert.ok(reference.current.element);
  assert.ok(reference.current.getInstance("dialog"));
  await mounted.unmount();
});

test("the package entrypoint renders safely during SSR", () => {
  const html = renderToString(React.createElement(library.GCard, { variant: "interactive" }, "SSR"));
  assert.match(html, /class="g-card g-card-interactive"/u);
  assert.match(html, />SSR</u);
});

test("GardenerimProvider applies theme axes and runtime locale", async () => {
  const mounted = await mount(React.createElement(library.GardenerimProvider, { theme: "garden", mode: "light", density: "compact", shape: "subtle", locale: "de", id: "provider", "aria-label": "Application", style: { minHeight: "10px" } }, "Content"));
  const provider = mounted.host.firstElementChild;
  assert.equal(provider.dataset.gTheme, "garden");
  assert.equal(provider.dataset.gMode, "light");
  assert.equal(provider.dataset.gDensity, "compact");
  assert.equal(provider.dataset.gShape, "subtle");
  assert.equal(provider.id, "provider");
  assert.equal(provider.getAttribute("aria-label"), "Application");
  assert.equal(provider.style.minHeight, "10px");
  assert.equal(library.Gardenerim.locale, "de");
  await mounted.unmount();
  library.configure({ locale: "en", refresh: false });
});

test("checkbox and radio controls expose idiomatic values", async () => {
  const values = [];
  const mounted = await mount(React.createElement("div", null,
    React.createElement(library.GInput, { type: "checkbox", value: true, onValueChange: (value) => values.push(value) }),
    React.createElement(library.GInput, { type: "radio", value: "business", checked: true, onValueChange: (value) => values.push(value) }),
  ));
  const [checkbox, radio] = mounted.host.querySelectorAll("input");
  assert.equal(checkbox.checked, true);
  assert.equal(radio.value, "business");
  checkbox.checked = false;
  await React.act(async () => checkbox.dispatchEvent(new window.Event("input", { bubbles: true })));
  await React.act(async () => radio.dispatchEvent(new window.Event("input", { bubbles: true })));
  assert.deepEqual(values, [false, "business"]);
  await mounted.unmount();
});

test("server markup hydrates without recoverable errors", async () => {
  const element = React.createElement(library.GCard, { variant: "interactive" }, React.createElement(library.GButton, null, "Hydrate"));
  const host = document.createElement("div");
  host.innerHTML = renderToString(element);
  document.body.append(host);
  const errors = [];
  let root;
  await React.act(async () => { root = hydrateRoot(host, element, { onRecoverableError: (error) => errors.push(error) }); });
  assert.deepEqual(errors, []);
  assert.equal(host.querySelector("button")?.textContent, "Hydrate");
  await React.act(async () => root.unmount());
  host.remove();
});

test("multiple selects report every selected option as an array", async () => {
  const values = [];
  const mounted = await mount(React.createElement(library.GSelect, { multiple: true, defaultValue: ["a"], initialize: false, onValueChange: value => values.push(value) },
    React.createElement("option", { value: "a" }, "A"), React.createElement("option", { value: "b" }, "B")));
  const select = mounted.host.querySelector("select"); select.options[1].selected = true;
  await React.act(async () => select.dispatchEvent(new window.Event("change", { bubbles: true })));
  assert.deepEqual(values, [["a", "b"]]); await mounted.unmount();
});

test("Tauri and Electron hooks bind isolated desktop bridges", async () => {
  const actions = [];
  const TauriHarness = () => {
    const root = React.useRef(null);
    library.useTauriWindowControls(root, { minimize: () => actions.push("tauri:minimize") });
    return React.createElement("div", { ref: root }, React.createElement("button", { "data-g-window-action": "minimize" }, "Minimize"));
  };
  const ElectronHarness = () => {
    const root = React.useRef(null);
    library.useElectronWindowControls(root, { windowAction: (action) => actions.push(`electron:${action}`) });
    return React.createElement("div", { ref: root }, React.createElement("button", { "data-g-window-action": "minimize" }, "Minimize"));
  };
  const tauri = await mount(React.createElement(TauriHarness));
  await React.act(async () => tauri.host.querySelector("button").dispatchEvent(new window.Event("click", { bubbles: true })));
  await tauri.unmount();
  const electron = await mount(React.createElement(ElectronHarness));
  await React.act(async () => electron.host.querySelector("button").dispatchEvent(new window.Event("click", { bubbles: true })));
  await electron.unmount();
  assert.deepEqual(actions, ["tauri:minimize", "electron:minimize"]);
});
