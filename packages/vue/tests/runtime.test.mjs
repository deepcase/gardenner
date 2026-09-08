import test from "node:test";
import assert from "node:assert/strict";
import { Window } from "happy-dom";

const window = new Window({ url: "https://gardener.test/" });
Object.assign(globalThis, {
  window,
  document: window.document,
  Element: window.Element, ShadowRoot: window.ShadowRoot,
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
const {dashboardOptions}=await import('../../../scripts/dashboard-examples.mjs');
test('dashboard model events belong to the Vue root, not nested widgets',async()=>{let value;const {app,host}=mount(()=>h(library.GDashboardWidget,{initialize:false,modelEvent:'change','onUpdate:modelValue':v=>value=v},()=>h('button','Child')));await nextTick();const root=host.firstElementChild;root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));assert.equal(value,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));assert.equal(value,'root');app.unmount();host.remove();});

test('all seven Vue dashboard components share data rendering and preserve runtime on parameter updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='dashboard')){const size=ref('small'),value=ref(JSON.stringify({value:82,filters:{},hiddenSeries:[],collapsed:false}));const {app,host}=mount(()=>h(library[definition.exportName],{config:{dashboardOptions:JSON.stringify({...dashboardOptions[definition.name],maxHeight:480,tableHeight:240,showGrid:false,lineWidth:4,donutWidth:40}),dashboardSize:size.value,dashboardValue:value.value,dashboardDisabled:false,dashboardBordered:true}},()=>h('input',{value:'draft'})));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'dashboard');assert.ok(api,definition.name);assert.equal(root.dataset.gDashboardDisabled,'false');assert.equal(root.dataset.gDashboardBordered,'true');assert.equal(root.style.getPropertyValue('--g-dashboard-max-height'),'480px');assert.equal(typeof api.cancel,'function');assert.ok(root.textContent.length>0);size.value='large';value.value=JSON.stringify({value:94,filters:{},hiddenSeries:[],collapsed:true});await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'dashboard'),api);assert.equal(api.getState().value,94);if(definition.name==='dashboard-widget'){assert.ok(root.querySelector('.g-dashboard-body').hidden);assert.equal(root.querySelector('input').value,'draft');}app.unmount();host.remove();}
});
globalThis.CSS=window.CSS;globalThis.matchMedia=window.matchMedia.bind(window);

const mount = (render) => {
  const host = document.createElement("div");
  document.body.append(host);
  const app = createApp({ render });
  app.mount(host);
  return { app, host };
};

test('form config updates disabled and read-only native values through Vue',async()=>{const blocked=ref(true),read=ref(false);const {app,host}=mount(()=>h(library.GForm,{config:{formDisabled:blocked.value,formReadOnly:read.value}},()=>h(library.GInput,{modelValue:'Example',name:'name'})));await nextTick();assert.ok(host.querySelector('input').disabled);blocked.value=false;read.value=true;for(let i=0;i<6;i++)await nextTick();assert.equal(host.querySelector('input').disabled,false);assert.ok(host.querySelector('input').readOnly);app.unmount();host.remove();});

test('feedback config reacts to values and controlled dismissal bridges the Vue model',async()=>{
 const value=ref(35),reason=ref('');const {app,host}=mount(()=>h('div',[h(library.GProgressMeter,{config:{feedbackValue:value.value}},()=>[h('span',{class:'g-progress-bar'}),h('span',{'data-g-feedback-value-text':''})]),h(library.GAlert,{modelValue:reason.value,'onUpdate:modelValue':v=>reason.value=v,modelEvent:'dismiss',modelKey:'reason',config:{feedbackControlled:true}},()=>h('button',{'data-g-feedback-dismiss':''},'Close'))]));await nextTick();assert.equal(host.querySelector('.g-progress').getAttribute('aria-valuenow'),'35');value.value=140;for(let i=0;i<6;i++)await nextTick();assert.equal(host.querySelector('.g-progress').getAttribute('aria-valuenow'),'100');host.querySelector('button').click();await nextTick();assert.equal(reason.value,'button');assert.equal(host.querySelector('.g-alert').hidden,false);app.unmount();host.remove();
});
test('basic controlled tag bridges v-model and guards disabled native controls',async()=>{
 const value=ref(false),disabled=ref(false);const {app,host}=mount(()=>h(library.GTag,{as:'button',variant:'checkable',modelValue:value.value,'onUpdate:modelValue':v=>value.value=v,'aria-pressed':value.value,state:disabled.value?'disabled':undefined,config:{basicToggle:true,basicControlled:true}},()=> 'Tag'));
 assert.equal(host.firstElementChild.type,'button');host.firstElementChild.click();for(let i=0;i<5;i++)await nextTick();assert.equal(value.value,true);assert.equal(host.firstElementChild.getAttribute('aria-pressed'),'true');disabled.value=true;for(let i=0;i<5;i++)await nextTick();assert.ok(host.firstElementChild.disabled);host.firstElementChild.click();assert.equal(value.value,true);app.unmount();host.remove();
});
test('all 41 navigation exports accept the shared data contract',async()=>{
 const items=[{id:'a',label:'Overview'},{id:'b',label:'Settings'}];
 for(const definition of library.componentCatalog.filter(c=>c.category==='navigation')){
  const {app,host}=mount(()=>h(library[definition.exportName],{navigation:{items,total:100}}));await nextTick();
  assert.equal(host.querySelector('[data-nav-component]')?.getAttribute('data-nav-component'),definition.name);
  app.unmount();host.remove();
 }
});
test('navigation v-model and reactive options stay in sync',async()=>{
 const value=ref('a'),disabled=ref(false);const {app,host}=mount(()=>h(library.GTabs,{modelValue:value.value,'onUpdate:modelValue':v=>value.value=v,navigation:{items:[{id:'a',label:'Overview'},{id:'b',label:'Settings'}],disabled:disabled.value}}));
 host.querySelector('[data-nav-key=b]').click();for(let i=0;i<8;i++)await nextTick();assert.equal(value.value,'b');assert.equal(host.querySelector('[data-nav-key=b]').getAttribute('aria-selected'),'true');
 disabled.value=true;for(let i=0;i<8;i++)await nextTick();assert.equal(host.querySelector('[data-nav-key=a]').disabled,true);app.unmount();host.remove();
});

test("tooltip and popover surface classes never style their trigger wrappers", async () => {
  for (const [component, behavior] of [[library.GTooltip, 'tooltip'], [library.GPopover, 'popover']]) {
    const state = ref('info');
    const { app, host } = mount(() => h(component, { state: state.value, initialize: false }, () => [
      h('button', { [`data-g-${behavior}-trigger`]: '' }, 'Open'),
      h('span', { [`data-g-${behavior}-content`]: '', hidden: true }, 'Content'),
    ]));
    await nextTick();
    const wrapper = host.firstElementChild;
    const content = wrapper.querySelector(`[data-g-${behavior}-content]`);
    assert.equal(wrapper.classList.contains(`g-${behavior}`), false);
    assert.equal(content.classList.contains(`g-${behavior}`), true);
    assert.equal(content.classList.contains('is-info'), true);
    state.value = 'warning'; await nextTick();
    assert.equal(content.classList.contains('is-info'), false);
    assert.equal(content.classList.contains('is-warning'), true);
    app.unmount(); host.remove();
  }
});

test("data behavior wrappers do not inherit the dimensions and layout of their child controls", async () => {
  for (const name of ['table-sort','row-selection','row-disclosure','column-toggle','data-filter','data-view']) {
    const definition = library.componentByName.get(name);
    const { app, host } = mount(() => h(library.GardenerimComponent, { definition, initialize: false, class: 'data-region' }, () => [
      h('button', { class: definition.className }, 'Control'), h('table', null, h('tbody', null, h('tr', null, h('td', null, 'Record')))),
    ]));
    await nextTick();
    const root = host.firstElementChild;
    assert.equal(root.classList.contains(definition.className), true, name);
    assert.ok(definition.className.startsWith('g-data-scope-'));
    assert.equal(root.matches('.g-sort-button,.g-selection-summary,.g-row-disclosure,.g-column-chooser,.g-data-toolbar,.g-data-view-switcher'),false);
    assert.equal(root.classList.contains('data-region'), true);
    assert.ok(root.querySelector(`button.${definition.className}`));
    assert.ok(root.querySelector('table'));
    app.unmount(); host.remove();
  }
});

test("generated components render the complete button type, shape, size, and state contract", async () => {
  const { app, host } = mount(() => h(library.GButton, { variant: ["primary", "round", "mini"], state: "success", config: { timeout: 300 } }, () => "Save"));
  await nextTick();
  const button = host.querySelector("button");
  assert.ok(button);
  assert.equal(button.type, "button");
  assert.ok(button.classList.contains("g-btn"));
  assert.ok(button.classList.contains("g-btn-primary"));
  assert.ok(button.classList.contains("g-btn-round"));
  assert.ok(button.classList.contains("g-btn-mini"));
  assert.ok(button.classList.contains("is-success"));
  assert.equal(button.dataset.gTimeout, "300");
  app.unmount();
  host.remove();
});

test("button groups expose group-level type, size, shape, layout, split, and semantic states", async () => {
  const { app, host } = mount(() => h(library.GButtonGroup, { variant: ["primary", "small", "round", "vertical", "block", "split"], state: "warning", role: "group", "aria-label": "Pagination" }, () => [h(library.GButton, null, () => "Prev"), h(library.GButton, null, () => "Next")]));
  await nextTick();
  const group = host.firstElementChild;
  assert.ok(group.classList.contains("g-btn-group-primary"));
  assert.ok(group.classList.contains("g-btn-group-small"));
  assert.ok(group.classList.contains("g-btn-group-round"));
  assert.ok(group.classList.contains("g-btn-group-vertical"));
  assert.ok(group.classList.contains("g-btn-group-block"));
  assert.ok(group.classList.contains("g-btn-group-split"));
  assert.ok(group.classList.contains("is-warning"));
  assert.equal(group.getAttribute("role"), "group");
  assert.equal(group.getAttribute("aria-label"), "Pagination");
  assert.equal(group.querySelectorAll("button").length, 2);
  app.unmount(); host.remove();
});

test("explicit behavior attributes win over generated empty defaults", async () => {
  const { app, host } = mount(() => h(library.GCopyAction, { "data-g-copy": "release-value", class: "g-btn" }, () => "Copy"));
  await nextTick();
  assert.equal(host.querySelector("[data-g-copy]").getAttribute("data-g-copy"), "release-value");
  app.unmount();
  host.remove();
});

test("overlay config changes preserve behavior instances and initialize=false tears them down", async () => {
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
  assert.equal(second, first);
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

test("GConditionalField renders a real controller-driven form region", async () => {
  const method = ref("shipping");
  const config = Object.freeze({ controller: "#vue-condition-controller", showWhen: "shipping" });
  const { app, host } = mount(() => h("form", { "data-g-conditional-scope": "" }, [
    h(library.GSelect, {
      id: "vue-condition-controller",
      name: "deliveryMethod",
      modelValue: method.value,
      "onUpdate:modelValue": (value) => { method.value = value; },
    }, () => [h("option", { value: "pickup" }, "Pickup"), h("option", { value: "shipping" }, "Shipping")]),
    h(library.GConditionalField, { variant: "panel", config }, () => h(library.GInput, { name: "shippingAddress", required: true })),
  ]));
  await nextTick();
  const controller = host.querySelector("select");
  const field = host.querySelector("[data-g-conditional-field]");
  const input = field.querySelector("input");
  assert.ok(field.classList.contains("g-conditional-field-panel"));
  assert.equal(field.dataset.gState, "visible");
  assert.equal(field.hidden, false);
  assert.equal(input.disabled, false);
  assert.match(controller.getAttribute("aria-controls"), /g-conditional-field-/u);

  controller.value = "pickup";
  controller.dispatchEvent(new window.Event("change", { bubbles: true }));
  await nextTick();
  assert.equal(method.value, "pickup");
  assert.equal(field.dataset.gState, "hidden");
  assert.equal(field.hidden, true);
  assert.equal(input.disabled, true);

  controller.value = "shipping";
  controller.dispatchEvent(new window.Event("change", { bubbles: true }));
  await nextTick();
  assert.equal(field.hidden, false);
  assert.equal(input.disabled, false);
  app.unmount();
  host.remove();
});

test("GFormActions renders semantic command groups and canonical variants", async () => {
  const { app, host } = mount(() => h(library.GFormActions, {
    variant: ["between", "bordered", "sticky"],
    state: "busy",
    role: "group",
    "aria-label": "Editor actions",
    "aria-busy": "true",
  }, () => [
    h("div", { class: "g-form-actions-secondary" }, h(library.GButton, { variant: "ghost" }, () => "Cancel")),
    h("div", { class: "g-form-actions-meta" }, h("span", { class: "g-form-actions-status", role: "status", "aria-live": "polite" }, "Saving")),
    h("div", { class: "g-form-actions-main" }, [
      h(library.GButton, { variant: "outline" }, () => "Draft"),
      h(library.GButton, { variant: "primary", type: "submit" }, () => "Submit"),
    ]),
  ]));
  await nextTick();
  const actions = host.querySelector(".g-form-actions");
  assert.ok(actions.classList.contains("g-form-actions-between"));
  assert.ok(actions.classList.contains("g-form-actions-bordered"));
  assert.ok(actions.classList.contains("g-form-actions-sticky"));
  assert.ok(actions.classList.contains("is-busy"));
  assert.equal(actions.getAttribute("role"), "group");
  assert.equal(actions.getAttribute("aria-busy"), "true");
  assert.equal(actions.querySelectorAll("button").length, 3);
  assert.equal(actions.querySelector("button[type=submit]").textContent, "Submit");
  assert.equal(actions.querySelector(".g-form-actions-status").getAttribute("aria-live"), "polite");
  app.unmount();
  host.remove();
});

test("GAutosaveStatus initializes the shared autosave lifecycle and exposes recovery", async () => {
  const { app, host } = mount(() => h("form", { id: "vue-autosave-test" }, [
    h(library.GInput, { name: "title", value: "Draft" }),
    h(library.GAutosaveStatus, {
      variant: ["badge", "block"],
      config: { autosaveScope: "#vue-autosave-test", autosaveState: "saved" },
    }, () => [
      h("span", { class: "g-autosave-status-indicator", "aria-hidden": "true" }),
      h("span", { class: "g-autosave-status-label", "data-g-autosave-label": "" }),
      h("time", { class: "g-autosave-status-time", "data-g-autosave-time": "" }),
      h(library.GButton, { class: "g-autosave-status-retry", "data-g-autosave-retry": "" }, () => "Retry"),
    ]),
  ]));
  await nextTick();
  const status = host.querySelector(".g-autosave-status");
  const label = status.querySelector(".g-autosave-status-label");
  const time = status.querySelector("time");
  const instance = library.getInstance(status, "autosave");
  assert.ok(status.classList.contains("g-autosave-status-badge"));
  assert.ok(status.classList.contains("g-autosave-status-block"));
  assert.equal(status.dataset.gAutosaveState, "saved");
  assert.equal(status.getAttribute("aria-busy"), "false");
  assert.equal(label.getAttribute("role"), "status");
  assert.equal(label.getAttribute("aria-live"), "polite");
  assert.ok(time.getAttribute("datetime"));
  assert.equal(typeof instance.dirty, "function");
  assert.equal(typeof instance.complete, "function");
  assert.equal(typeof instance.fail, "function");
  instance.fail();
  assert.equal(status.dataset.gAutosaveState, "error");
  assert.ok(status.classList.contains("is-error"));
  assert.equal(status.querySelector("button").disabled, false);
  app.unmount();
  host.remove();
});

test("GFormProgress renders a semantic determinate summary with step state", async () => {
  const { app, host } = mount(() => h(library.GFormProgress, {
    variant: ["card", "with-steps"],
    state: "active",
  }, () => [
    h("div", { class: "g-form-progress-header" }, [
      h("strong", { id: "runtime-progress-label", class: "g-form-progress-label" }, "Profile"),
      h("span", { class: "g-form-progress-count" }, "2 / 3"),
      h("strong", { class: "g-form-progress-percentage" }, "67%"),
    ]),
    h("div", {
      class: "g-form-progress-track",
      role: "progressbar",
      "aria-labelledby": "runtime-progress-label",
      "aria-valuemin": "0",
      "aria-valuemax": "3",
      "aria-valuenow": "2",
      "aria-valuetext": "2 of 3 complete",
    }, h("div", { class: "g-form-progress-value", style: "--g-form-progress: 67%" })),
    h("ol", { class: "g-form-progress-steps", "aria-label": "Profile steps" }, [
      h("li", { class: "g-form-progress-step is-complete" }, "Account"),
      h("li", { class: "g-form-progress-step is-active", "aria-current": "step" }, "Profile"),
      h("li", { class: "g-form-progress-step" }, "Review"),
    ]),
    h("span", { class: "g-form-progress-status", role: "status" }, "One item remaining"),
  ]));
  await nextTick();
  const progress = host.querySelector(".g-form-progress");
  const track = progress.querySelector("[role=progressbar]");
  assert.ok(progress.classList.contains("g-form-progress-card"));
  assert.ok(progress.classList.contains("g-form-progress-with-steps"));
  assert.ok(progress.classList.contains("is-active"));
  assert.equal(track.getAttribute("aria-valuenow"), "2");
  assert.equal(track.getAttribute("aria-valuetext"), "2 of 3 complete");
  assert.equal(progress.querySelectorAll(".g-form-progress-step").length, 3);
  assert.equal(progress.querySelector("[aria-current=step]").textContent, "Profile");
  assert.equal(progress.querySelector("[role=status]").textContent, "One item remaining");
  app.unmount();
  host.remove();
});

test("GFormReview renders grouped definition rows, edit controls, and review status", async () => {
  const { app, host } = mount(() => h(library.GFormReview, {
    variant: ["bordered", "editable"],
    state: "warning",
    "aria-labelledby": "runtime-review-title",
  }, () => [
    h("header", { class: "g-form-review-header" }, [
      h("h3", { id: "runtime-review-title", class: "g-form-review-title" }, "Review submission"),
      h("span", { class: "g-form-review-summary" }, "2 / 3 complete"),
    ]),
    h("section", { class: "g-form-review-section", "aria-labelledby": "runtime-review-section" }, [
      h("h4", { id: "runtime-review-section", class: "g-form-review-section-title" }, "Project"),
      h("dl", { class: "g-form-review-list" }, [
        h("div", { class: "g-form-review-row is-changed" }, [
          h("dt", { class: "g-form-review-label" }, "Name"),
          h("dd", { class: "g-form-review-value" }, [
            h("strong", { class: "g-form-review-value-primary" }, "Gardenerim"),
            h("span", { class: "g-form-review-value-secondary" }, "Changed in this session"),
          ]),
          h("dd", { class: "g-form-review-action" }, h(library.GButton, { variant: "link", "aria-label": "Edit name" }, () => "Edit")),
        ]),
        h("div", { class: "g-form-review-row is-warning" }, [
          h("dt", { class: "g-form-review-label" }, "Owner"),
          h("dd", { class: "g-form-review-value" }, h("span", { class: "g-form-review-empty" }, "Not provided")),
          h("dd", { class: "g-form-review-action" }, h(library.GButton, { variant: "link", "aria-label": "Edit owner" }, () => "Edit")),
        ]),
      ]),
    ]),
    h("footer", { class: "g-form-review-footer" }, h("span", { class: "g-form-review-status", role: "alert" }, "One required value is missing")),
  ]));
  await nextTick();
  const review = host.querySelector(".g-form-review");
  assert.ok(review.classList.contains("g-form-review-bordered"));
  assert.ok(review.classList.contains("g-form-review-editable"));
  assert.ok(review.classList.contains("is-warning"));
  assert.equal(review.getAttribute("aria-labelledby"), "runtime-review-title");
  assert.equal(review.querySelectorAll(".g-form-review-row").length, 2);
  assert.equal(review.querySelectorAll("dt").length, 2);
  assert.equal(review.querySelectorAll("dd").length, 4);
  assert.equal(review.querySelectorAll("button").length, 2);
  assert.equal(review.querySelector("[role=alert]").textContent, "One required value is missing");
  app.unmount();
  host.remove();
});

test("GConsentGroup renders explicit required opt-ins and updates aggregate submission state", async () => {
  const terms = ref(false);
  const privacy = ref(false);
  const { app, host } = mount(() => {
    const accepted = Number(terms.value) + Number(privacy.value);
    const complete = accepted === 2;
    return h("form", [
      h(library.GConsentGroup, {
        as: "fieldset",
        variant: ["legal", "divided"],
        state: complete ? "accepted" : accepted ? "partial" : "unchecked",
        "aria-describedby": complete ? "runtime-consent-status" : "runtime-consent-feedback",
        "aria-invalid": complete ? undefined : "true",
      }, () => [
        h("legend", { class: "g-consent-group-title" }, ["Confirm and authorize", h("span", { class: "g-consent-group-required" }, "Required")]),
        h("p", { class: "g-consent-group-description" }, "Each consent is independent and starts unchecked."),
        h("span", { class: "g-consent-group-summary" }, `${accepted} / 2 required`),
        h("div", { class: "g-consent-group-items" }, [
          h("div", { class: "g-consent-group-item g-check" }, [
            h("input", { id: "runtime-consent-terms", class: "g-consent-group-control", type: "checkbox", required: true, checked: terms.value, onChange: event => { terms.value = event.target.checked; } }),
            h("div", { class: "g-consent-group-content" }, [
              h("label", { class: "g-consent-group-label", for: "runtime-consent-terms" }, "Accept terms"),
              h("a", { class: "g-consent-group-link", href: "#terms" }, "Read terms"),
            ]),
            h("span", { class: "g-consent-group-version" }, "Version 2.1"),
          ]),
          h("div", { class: "g-consent-group-item g-check" }, [
            h("input", { id: "runtime-consent-privacy", class: "g-consent-group-control", type: "checkbox", required: true, checked: privacy.value, onChange: event => { privacy.value = event.target.checked; } }),
            h("div", { class: "g-consent-group-content" }, h("label", { class: "g-consent-group-label", for: "runtime-consent-privacy" }, "Accept privacy policy")),
          ]),
        ]),
        complete
          ? h("span", { id: "runtime-consent-status", class: "g-consent-group-status", role: "status" }, "Required consent complete")
          : h("p", { id: "runtime-consent-feedback", class: "g-consent-group-feedback", role: "alert" }, `${2 - accepted} required remaining`),
      ]),
      h("button", { type: "submit", disabled: !complete }, "Submit"),
    ]);
  });
  await nextTick();
  const consent = host.querySelector(".g-consent-group");
  const checkboxes = host.querySelectorAll("input[type=checkbox]");
  assert.equal(consent.tagName, "FIELDSET");
  assert.ok(consent.classList.contains("g-consent-group-legal"));
  assert.ok(consent.classList.contains("g-consent-group-divided"));
  assert.ok(consent.classList.contains("is-unchecked"));
  assert.equal(checkboxes.length, 2);
  assert.ok([...checkboxes].every(input => input.required && !input.checked));
  assert.equal(host.querySelectorAll(".g-consent-group-link").length, 1);
  assert.equal(host.querySelector("button[type=submit]").disabled, true);
  assert.equal(host.querySelector("[role=alert]").textContent, "2 required remaining");
  checkboxes[0].click();
  await nextTick();
  assert.ok(consent.classList.contains("is-partial"));
  assert.equal(host.querySelector(".g-consent-group-summary").textContent, "1 / 2 required");
  host.querySelectorAll("input[type=checkbox]")[1].click();
  await nextTick();
  assert.ok(consent.classList.contains("is-accepted"));
  assert.equal(consent.hasAttribute("aria-invalid"), false);
  assert.equal(host.querySelector("button[type=submit]").disabled, false);
  assert.equal(host.querySelector("[role=status]").textContent, "Required consent complete");
  app.unmount();
  host.remove();
});

test("GDatePicker initializes the shared picker runtime and bridges selected dates to v-model", async () => {
  const model = ref(["2026-09-12"]);
  const updates = [];
  const config = Object.freeze({ datePickerValue: "2026-09-12", datePickerMin: "2026-09-01", datePickerMax: "2026-10-31", datePickerFirstDay: 1 });
  const { app, host } = mount(() => h(library.GDatePicker, {
    variant: ["inline", "with-presets", "with-footer"],
    config,
    modelValue: model.value,
    modelEvent: "pickerchange",
    modelKey: "values",
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
    "aria-label": "Choose publish date",
  }, () => [
    h("header", { class: "g-date-picker-header" }, [
      h("button", { type: "button", class: "g-date-picker-previous", "data-g-date-picker-previous": "", "aria-label": "Previous month" }),
      h("h3", { id: "runtime-date-title", class: "g-date-picker-title", "data-g-date-picker-title": "" }, "Month"),
      h("button", { type: "button", class: "g-date-picker-next", "data-g-date-picker-next": "", "aria-label": "Next month" }),
    ]),
    h("div", { class: "g-calendar-grid", "data-g-date-picker-grid": "", "aria-labelledby": "runtime-date-title" }),
    h("input", { type: "hidden", class: "g-date-picker-output", "data-g-date-picker-output": "" }),
    h("footer", { class: "g-date-picker-footer" }, [
      h("span", { class: "g-date-picker-status", "data-g-date-picker-status": "", role: "status" }, "Empty"),
      h("button", { type: "button", "data-g-date-picker-clear": "" }, "Clear"),
    ]),
  ]));
  await nextTick();
  const picker = host.querySelector(".g-date-picker");
  assert.equal(picker.hasAttribute("data-g-picker"), true);
  assert.ok(picker.classList.contains("g-date-picker-inline"));
  assert.equal(picker.querySelectorAll(".g-calendar-day").length, 42);
  assert.equal(picker.querySelector('[aria-selected="true"]').dataset.gDate, "2026-09-12");
  picker.querySelector('[data-g-date="2026-09-15"]').click();
  await nextTick();
  assert.deepEqual(updates.at(-1), ["2026-09-15"]);
  assert.deepEqual(model.value, ["2026-09-15"]);
  assert.equal(picker.querySelector("[data-g-date-picker-output]").value, "2026-09-15");
  host.querySelector(".g-date-picker [data-g-date-picker-clear]").click();
  await nextTick();
  assert.deepEqual(model.value, []);
  app.unmount();
  host.remove();
});

test("GTimePicker initializes constrained time columns and bridges canonical values to v-model", async () => {
  const model = ref("13:30");
  const updates = [];
  const config = Object.freeze({ timePickerValue: "13:30", timePickerMin: "09:00", timePickerMax: "18:00", timePickerMinuteStep: 5 });
  const { app, host } = mount(() => h(library.GTimePicker, {
    variant: ["inline", "with-presets", "with-footer"],
    config,
    modelValue: model.value,
    modelEvent: "wheelchange",
    modelKey: "value",
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
    "aria-label": "Choose publish time",
  }, () => [
    h("div", { class: "g-time-picker-control", "data-g-time-picker-trigger": "" }, [
      h("input", { class: "g-time-picker-input", "data-g-time-picker-input": "" }),
      h("button", { type: "button", "data-g-time-picker-clear": "" }, "Clear"),
    ]),
    h("div", { class: "g-time-picker-panel", "data-g-time-picker-panel": "" }, [
      h("div", { class: "g-time-picker-columns", "data-g-time-picker-columns": "" }),
      h("footer", { class: "g-time-picker-footer" }, [
        h("span", { class: "g-time-picker-status", "data-g-time-picker-status": "", role: "status" }, "Empty"),
      ]),
    ]),
    h("input", { type: "hidden", class: "g-time-picker-output", "data-g-time-picker-output": "" }),
  ]));
  await nextTick();
  const picker = host.querySelector(".g-time-picker");
  assert.equal(picker.hasAttribute("data-g-wheel-picker"), true);
  assert.ok(picker.classList.contains("g-time-picker-inline"));
  assert.equal(picker.querySelectorAll("[data-g-wheel-column]").length, 2);
  assert.equal(picker.querySelector("[data-g-time-picker-input]").value, "13:30");
  picker.querySelector('[data-g-time-part="hour"][data-g-value="14"]').click();
  await nextTick();
  assert.equal(updates.at(-1), "14:30");
  assert.equal(model.value, "14:30");
  const input = host.querySelector(".g-time-picker [data-g-time-picker-input]");
  input.value = "16:45";
  input.dispatchEvent(new window.Event("change", { bubbles: true }));
  await nextTick();
  assert.equal(model.value, "16:45");
  host.querySelector(".g-time-picker [data-g-time-picker-clear]").click();
  await nextTick();
  assert.equal(model.value, "");
  assert.ok(host.querySelector(".g-time-picker").classList.contains("is-empty"));
  app.unmount();
  host.remove();
});

test("GPinInput initializes OTP behavior and bridges the canonical code to v-model", async () => {
  const model = ref("");
  const updates = [];
  const config = Object.freeze({ pinInputMode: "numeric", pinInputCompleteLabel: "Code complete" });
  const { app, host } = mount(() => h(library.GPinInput, {
    variant: "boxed",
    config,
    modelValue: model.value,
    modelEvent: "otpchange",
    modelKey: "value",
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
    "aria-label": "Verification code",
  }, () => [
    h("div", { class: "g-pin-input-cells" }, Array.from({ length: 6 }, (_, index) => h("input", { class: "g-pin-input-cell", "data-g-pin-input-cell": "", value: model.value[index] || "" }))),
    h("input", { type: "hidden", class: "g-pin-input-output", "data-g-pin-input-output": "", value: model.value }),
    h("span", { class: "g-pin-input-status", "data-g-pin-input-status": "", role: "status" }),
    h("button", { type: "button", class: "g-pin-input-clear", "data-g-pin-input-clear": "" }, "Clear"),
  ]));
  await nextTick();
  const root = host.querySelector(".g-pin-input");
  const cells = [...root.querySelectorAll("[data-g-pin-input-cell]")];
  assert.equal(root.hasAttribute("data-g-otp-input"), true);
  assert.ok(root.classList.contains("g-pin-input-boxed"));
  cells[0].value = "1";
  cells[0].dispatchEvent(new window.Event("input", { bubbles: true }));
  await nextTick();
  assert.equal(model.value, "1");
  assert.equal(document.activeElement, cells[1]);
  const paste = new window.Event("paste", { bubbles: true, cancelable: true });
  Object.defineProperty(paste, "clipboardData", { value: { getData: () => "23456" } });
  cells[1].dispatchEvent(paste);
  await nextTick();
  assert.equal(updates.at(-1), "123456");
  assert.equal(model.value, "123456");
  assert.ok(root.classList.contains("is-complete"));
  assert.equal(root.querySelector("[data-g-pin-input-output]").value, "123456");
  assert.equal(root.querySelector("[data-g-pin-input-status]").textContent, "Code complete");
  root.querySelector("[data-g-pin-input-clear]").click();
  await nextTick();
  assert.equal(model.value, "");
  assert.ok(root.classList.contains("is-empty"));
  app.unmount();
  host.remove();
});

test("GRating initializes rating behavior and bridges half-star changes to v-model", async () => {
  const model = ref(2.5);
  const updates = [];
  const config = Object.freeze({ ratingValue: 2.5, ratingMax: 5, ratingStep: 0.5, ratingAllowClear: true });
  const { app, host } = mount(() => h(library.GRating, {
    variant: ["large", "half", "clearable"],
    config,
    modelValue: model.value,
    modelEvent: "ratingchange",
    modelKey: "value",
    "onUpdate:modelValue": value => { updates.push(value); model.value = value; },
    "aria-label": "Experience rating",
  }, () => [
    h("div", { class: "g-rating-items" }, Array.from({ length: 5 }, (_, index) => h("button", { class: "g-rating-item", type: "button", "data-g-rating-item": "", "data-g-value": String(index + 1) }))),
    h("input", { type: "hidden", class: "g-rating-output", "data-g-rating-output": "" }),
    h("span", { class: "g-rating-status", "data-g-rating-status": "", role: "status" }),
    h("span", { class: "g-rating-value", "data-g-rating-value-label": "" }),
    h("button", { type: "button", class: "g-rating-clear", "data-g-rating-clear": "" }, "Clear"),
  ]));
  await nextTick();
  const root = host.querySelector(".g-rating");
  const items = [...root.querySelectorAll("[data-g-rating-item]")];
  items.forEach((item) => { item.getBoundingClientRect = () => ({ left: 0, right: 40, top: 0, bottom: 40, width: 40, height: 40, x: 0, y: 0, toJSON() {} }); });
  assert.equal(root.hasAttribute("data-g-rating"), true);
  assert.ok(root.classList.contains("g-rating-large"));
  assert.ok(root.classList.contains("g-rating-half"));
  assert.equal(items[2].classList.contains("is-half"), true);
  items[3].dispatchEvent(new window.MouseEvent("click", { bubbles: true, clientX: 10 }));
  await nextTick();
  await Promise.resolve();
  assert.equal(updates.at(-1), 3.5);
  assert.equal(model.value, 3.5);
  assert.equal(root.querySelector("[data-g-rating-output]").value, "3.5");
  assert.equal(items[3].classList.contains("is-half"), true);
  items[3].dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  await nextTick();
  assert.equal(model.value, 4);
  root.querySelector("[data-g-rating-clear]").click();
  await nextTick();
  assert.equal(model.value, 0);
  assert.ok(root.classList.contains("is-empty"));
  app.unmount();
  host.remove();
});

test("GValidationSummary renders live errors and navigates to the selected invalid field", async () => {
  const config = Object.freeze({ validationMode: "live", validationFocus: true });
  const { app, host } = mount(() => h("form", null, [
    h(library.GValidationSummary, { variant: ["compact"], config }, () => [
      h("span", { class: "g-validation-summary-icon", "aria-hidden": "true" }),
      h("div", { class: "g-validation-summary-content" }, [
        h("strong", { class: "g-validation-summary-title", "data-g-validation-title-auto": "" }),
        h("span", { class: "g-validation-summary-count", "data-g-validation-count": "" }),
        h("ul", { class: "g-validation-summary-list", "data-g-validation-list": "" }),
        h("span", { class: "g-validation-summary-status", "data-g-validation-status": "" }),
      ]),
    ]),
    h("label", { for: "vue-summary-name" }, "Name"),
    h("input", { id: "vue-summary-name", required: true, "data-g-validation-message": "Enter a name" }),
    h("label", { for: "vue-summary-email" }, "Email"),
    h("input", { id: "vue-summary-email", type: "email", value: "invalid", required: true, "data-g-validation-message": "Enter a valid email" }),
  ]));
  await nextTick();
  await Promise.resolve();
  const root = host.querySelector(".g-validation-summary");
  assert.equal(root.hasAttribute("data-g-validation-summary"), true);
  assert.ok(root.classList.contains("g-validation-summary-compact"));
  assert.equal(root.dataset.gValidationCount, "2");
  assert.equal(root.querySelectorAll(".g-validation-summary-item").length, 2);
  root.querySelector("[data-g-validation-target='vue-summary-email']").click();
  assert.equal(document.activeElement.id, "vue-summary-email");
  const [name, email] = host.querySelectorAll("input");
  name.value = "Garden";
  name.dispatchEvent(new window.Event("input", { bubbles: true }));
  email.value = "hello@gardener.im";
  email.dispatchEvent(new window.Event("input", { bubbles: true }));
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(root.hidden, true);
  assert.equal(root.dataset.gValidationCount, "0");
  app.unmount();
  host.remove();
});

test("GUploadQueue exposes the upload-manager contract and keeps rendered queue state synchronized", async () => {
  const { app, host } = mount(() => h(library.GUploadQueue, {
    variant: ["compact", "bordered"],
    "aria-label": "Release uploads",
  }, () => [
    h("header", { class: "g-upload-queue-header" }, [
      h("strong", { class: "g-upload-queue-title" }, "Upload queue"),
      h("span", { class: "g-upload-summary" }, [h("b", { "data-g-upload-count": "total" })]),
      h("button", { type: "button", "data-g-upload-action": "clear" }, "Clear"),
    ]),
    h("span", { "data-g-upload-live": "" }),
    h("div", { class: "g-upload-list", "data-g-upload-list": "" }, [
      h("div", { class: "g-upload-empty", "data-g-upload-empty": "" }, "Empty"),
      h("div", { class: "g-upload-item", "data-g-upload-item": "", "data-g-status": "uploading", "data-g-progress": "35" }, [
        h("span", { class: "g-file-icon" }, "PDF"),
        h("span", { class: "g-file-main" }, [h("strong", { class: "g-file-name" }, "guide.pdf"), h("span", { "data-g-upload-status": "" })]),
        h("span", { class: "g-upload-progress", "data-g-upload-progress": "" }, h("i", { class: "g-upload-progress-bar" })),
        h("span", { class: "g-upload-actions" }, [h("button", { type: "button", "data-g-upload-action": "pause" }, "Pause")]),
      ]),
    ]),
  ]));
  await nextTick();
  await Promise.resolve();
  const root = host.querySelector(".g-upload-queue");
  assert.equal(root.hasAttribute("data-g-upload-manager"), true);
  assert.ok(root.classList.contains("g-upload-queue-compact"));
  assert.ok(root.classList.contains("g-upload-queue-bordered"));
  assert.equal(root.dataset.gState, "uploading");
  assert.equal(root.querySelector("[data-g-upload-progress]").getAttribute("aria-valuenow"), "35");
  root.querySelector("[data-g-upload-action='pause']").click();
  assert.equal(root.dataset.gState, "paused");
  assert.equal(root.getAttribute("aria-busy"), "false");
  root.dispatchEvent(new window.CustomEvent("gardener:files", { bubbles: true, detail: { acceptedFiles: [{ name: "cover.png", size: 2048 }] } }));
  assert.equal(root.querySelectorAll("[data-g-upload-item]").length, 2);
  assert.equal(root.querySelector("[data-g-upload-count='total']").textContent, "2");
  root.querySelector("[data-g-upload-action='clear']").click();
  assert.equal(root.dataset.gState, "empty");
  assert.equal(root.querySelector("[data-g-upload-empty]").hidden, false);
  app.unmount();
  host.remove();
});

test("GFormBuilder exposes an editable schema instead of a passive layout shell", async () => {
  const { app, host } = mount(() => h(library.GFormBuilder, {
    variant: ["compact", "bordered"],
    "aria-label": "Profile form builder",
    "data-g-builder-status-template": "{count} fields",
  }, () => [
    h("button", { type: "button", "data-g-builder-add": "", "data-g-builder-type": "email", "data-g-builder-label": "Email" }, "Add email"),
    h("span", { "data-g-builder-status": "" }),
    h("div", { "data-g-builder-items": "" }, [
      h("section", { class: "g-form-builder-field", "data-g-builder-item": "", "data-g-builder-id": "name", "data-g-builder-type": "text", "data-g-builder-label": "Name", "data-g-builder-name": "name" }, [
        h("label", { "data-g-builder-bind": "label" }), h("input", { "data-g-builder-control": "" }),
        h("button", { type: "button", "data-g-builder-duplicate": "" }, "Duplicate"), h("button", { type: "button", "data-g-builder-remove": "" }, "Remove"),
      ]),
    ]),
    h("div", { "data-g-builder-inspector-empty": "" }, "Select a field"),
    h("div", { "data-g-builder-inspector-body": "" }, [h("input", { "data-g-builder-property": "label" }), h("input", { type: "checkbox", "data-g-builder-property": "required" })]),
    h("textarea", { "data-g-builder-output": "" }),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-form-builder");
  assert.equal(root.hasAttribute("data-g-builder-list"), true);
  assert.ok(root.classList.contains("g-form-builder-compact"));
  const builder = library.getInstance(root, "builder-list");
  assert.equal(builder.items().length, 1);
  root.querySelector("[data-g-builder-add]").click();
  assert.equal(builder.items().length, 2);
  const label = root.querySelector("[data-g-builder-property='label']");
  label.value = "Work email"; label.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.equal(builder.selected().label, "Work email");
  builder.duplicate();
  assert.equal(builder.schema().fields.length, 3);
  assert.deepEqual(JSON.parse(root.querySelector("[data-g-builder-output]").value), builder.schema());
  builder.remove();
  assert.equal(root.querySelector("[data-g-builder-status]").textContent, "2 fields");
  app.unmount(); host.remove();
});

test("GPrimaryNavigation renders a standalone semantic hierarchy with rich current and disabled items", async () => {
  const { app, host } = mount(() => h(library.GPrimaryNavigation, { as: "nav", variant: ["contained", "responsive", "block"], "aria-label": "Workspace primary" }, () => [
    h("ul", { class: "g-primary-nav-list" }, [
      h("li", { class: "g-primary-nav-item" }, h("a", { class: "g-primary-nav-link", href: "#overview", "aria-current": "page" }, [h("span", { class: "g-primary-nav-icon", "aria-hidden": "true" }, "H"), h("span", { class: "g-primary-nav-content" }, [h("span", { class: "g-primary-nav-label" }, "Overview"), h("span", { class: "g-primary-nav-description" }, "Workspace activity")]), h("span", { class: "g-primary-nav-indicator", "aria-hidden": "true" })])),
      h("li", { class: "g-primary-nav-item" }, h("a", { class: "g-primary-nav-link", href: "#projects" }, [h("span", { class: "g-primary-nav-label" }, "Projects"), h("span", { class: "g-primary-nav-badge", "aria-label": "8 projects" }, "8")])),
      h("li", { class: "g-primary-nav-item" }, h("a", { class: "g-primary-nav-link", href: "#admin", "aria-disabled": "true", tabindex: "-1" }, "Admin")),
    ]),
    h("div", { class: "g-primary-nav-actions" }, h("button", { type: "button" }, "Create")),
  ]));
  await nextTick();
  const root = host.querySelector(".g-primary-nav"); const list = root.querySelector(".g-primary-nav-list"); const current = root.querySelector("[aria-current='page']"); const disabled = root.querySelector("[aria-disabled='true']");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Workspace primary"); assert.equal(list.tagName, "UL"); assert.equal(list.children.length, 3);
  assert.ok(root.classList.contains("g-primary-nav-contained")); assert.ok(root.classList.contains("g-primary-nav-responsive")); assert.ok(root.classList.contains("g-primary-nav-block"));
  assert.equal(current.querySelector(".g-primary-nav-description").textContent, "Workspace activity"); assert.equal(root.querySelector(".g-primary-nav-badge").textContent, "8"); assert.equal(disabled.tabIndex, -1); assert.equal(root.querySelector(".g-primary-nav-actions button").textContent, "Create");
  app.unmount(); host.remove();
});

test("GUtilityNavigation renders a standalone semantic hierarchy with secondary actions and states", async () => {
  const { app, host } = mount(() => h(library.GUtilityNavigation, { as: "nav", variant: ["contained", "divided", "responsive"], "aria-label": "Workspace utilities" }, () => [
    h("ul", { class: "g-utility-nav-list" }, [
      h("li", { class: "g-utility-nav-item" }, h("a", { class: "g-utility-nav-link", href: "#help" }, [h("span", { class: "g-utility-nav-icon", "aria-hidden": "true" }, "?"), h("span", { class: "g-utility-nav-label" }, "Help")])),
      h("li", { class: "g-utility-nav-item" }, h("a", { class: "g-utility-nav-link", href: "#shortcuts", "aria-current": "location" }, [h("span", { class: "g-utility-nav-label" }, "Shortcuts"), h("span", { class: "g-utility-nav-shortcut" }, "?")])),
      h("li", { class: "g-utility-nav-item" }, h("a", { class: "g-utility-nav-link", href: "#notifications" }, [h("span", { class: "g-utility-nav-label" }, "Notifications"), h("span", { class: "g-utility-nav-badge", "aria-label": "3 unread" }, "3")])),
      h("li", { class: "g-utility-nav-item" }, h("a", { class: "g-utility-nav-link", href: "#admin", "aria-disabled": "true", tabindex: "-1" }, "Admin")),
    ]),
    h("span", { class: "g-utility-nav-separator", "aria-hidden": "true" }),
    h("div", { class: "g-utility-nav-actions" }, h("button", { type: "button" }, "Account")),
  ]));
  await nextTick();
  const root = host.querySelector(".g-utility-nav"); const list = root.querySelector(".g-utility-nav-list"); const current = root.querySelector("[aria-current='location']"); const disabled = root.querySelector("[aria-disabled='true']");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Workspace utilities"); assert.equal(list.tagName, "UL"); assert.equal(list.children.length, 4);
  assert.ok(root.classList.contains("g-utility-nav-contained")); assert.ok(root.classList.contains("g-utility-nav-divided")); assert.ok(root.classList.contains("g-utility-nav-responsive"));
  assert.equal(current.querySelector(".g-utility-nav-shortcut").textContent, "?"); assert.equal(root.querySelector(".g-utility-nav-badge").textContent, "3"); assert.equal(disabled.tabIndex, -1); assert.equal(root.querySelector(".g-utility-nav-actions button").textContent, "Account");
  app.unmount(); host.remove();
});

test("GSubNavigation renders contextual navigation with current, badge, disabled, and action content", async () => {
  const { app, host } = mount(() => h(library.GSubNavigation, { as: "nav", variant: ["contained", "underline", "responsive"], "aria-label": "Project sections" }, () => [
    h("ul", { class: "g-subnav-list" }, [
      h("li", { class: "g-subnav-item" }, h("a", { class: "g-subnav-link", href: "#overview", "aria-current": "page" }, [h("span", { class: "g-subnav-icon", "aria-hidden": "true" }, "H"), h("span", { class: "g-subnav-content" }, [h("span", { class: "g-subnav-label" }, "Overview"), h("span", { class: "g-subnav-description" }, "Project health")]), h("span", { class: "g-subnav-indicator", "aria-hidden": "true" })])),
      h("li", { class: "g-subnav-item" }, h("a", { class: "g-subnav-link", href: "#activity" }, [h("span", { class: "g-subnav-label" }, "Activity"), h("span", { class: "g-subnav-badge", "aria-label": "8 updates" }, "8")])),
      h("li", { class: "g-subnav-item" }, h("a", { class: "g-subnav-link", href: "#audit", "aria-disabled": "true", tabindex: "-1" }, "Audit")),
    ]),
    h("div", { class: "g-subnav-actions" }, h("button", { type: "button" }, "Settings")),
  ]));
  await nextTick();
  const root = host.querySelector(".g-subnav"); const list = root.querySelector(".g-subnav-list"); const current = root.querySelector("[aria-current='page']"); const disabled = root.querySelector("[aria-disabled='true']");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Project sections"); assert.equal(list.tagName, "UL"); assert.equal(list.children.length, 3);
  assert.ok(root.classList.contains("g-subnav-contained")); assert.ok(root.classList.contains("g-subnav-underline")); assert.ok(root.classList.contains("g-subnav-responsive"));
  assert.equal(current.querySelector(".g-subnav-description").textContent, "Project health"); assert.equal(root.querySelector(".g-subnav-badge").textContent, "8"); assert.equal(disabled.tabIndex, -1); assert.equal(root.querySelector(".g-subnav-actions button").textContent, "Settings");
  app.unmount(); host.remove();
});

test("GCollapsibleNavigation owns its trigger and panel state, restores focus, and exposes runtime controls", async () => {
  const events = [];
  const { app, host } = mount(() => h(library.GCollapsibleNavigation, { as: "aside", variant: ["bordered", "responsive"], "aria-label": "Project navigation" }, () => [
    h("header", { class: "g-collapsible-nav-header" }, [
      h("div", { class: "g-collapsible-nav-heading" }, [h("strong", { class: "g-collapsible-nav-title" }, "Projects"), h("span", { class: "g-collapsible-nav-description" }, "Recent work")]),
      h("button", { class: "g-collapsible-nav-trigger", type: "button", "data-g-collapsible-trigger": "", "data-g-open-label": "Expand projects", "data-g-close-label": "Collapse projects" }, [h("span", { class: "g-collapsible-nav-trigger-label", "data-g-when-expanded": "" }, "Collapse"), h("span", { class: "g-collapsible-nav-trigger-label", "data-g-when-collapsed": "" }, "Expand"), h("span", { class: "g-collapsible-nav-trigger-icon" }, "^")]),
    ]),
    h("div", { class: "g-collapsible-nav-body" }, [
      h("nav", { class: "g-collapsible-nav-group", "aria-label": "Recent projects" }, h("ul", { class: "g-collapsible-nav-list" }, [
        h("li", { class: "g-collapsible-nav-item" }, h("a", { class: "g-collapsible-nav-link", href: "#garden", "aria-current": "page" }, [h("span", { class: "g-collapsible-nav-label" }, "Garden"), h("span", { class: "g-collapsible-nav-badge" }, "12")])),
        h("li", { class: "g-collapsible-nav-item" }, h("a", { class: "g-collapsible-nav-link", href: "#archive", "aria-disabled": "true", tabindex: "-1" }, "Archive")),
      ])),
      h("footer", { class: "g-collapsible-nav-footer" }, h("button", { type: "button", "data-g-nav-close": "" }, "Done")),
    ]),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-collapsible-nav"); root.addEventListener("gardener:open", () => events.push("open")); const trigger = root.querySelector(".g-collapsible-nav-trigger"); const body = root.querySelector(".g-collapsible-nav-body"); const current = root.querySelector("[aria-current='page']"); const instance = library.getInstance(root, "nav-toggle");
  assert.equal(root.tagName, "ASIDE"); assert.ok(root.classList.contains("g-collapsible-nav-bordered")); assert.ok(root.classList.contains("g-collapsible-nav-responsive")); assert.equal(root.dataset.gNavOpen, "true"); assert.equal(trigger.getAttribute("aria-expanded"), "true"); assert.equal(trigger.getAttribute("aria-controls"), body.id); assert.equal(body.getAttribute("role"), "region"); assert.equal(body.hidden, false); assert.equal(current.querySelector(".g-collapsible-nav-badge").textContent, "12");
  trigger.click(); assert.equal(instance.isOpen(), false); assert.equal(body.hidden, true); assert.ok(root.classList.contains("is-collapsed")); assert.equal(trigger.getAttribute("aria-label"), "Expand projects");
  instance.open(); assert.equal(instance.isOpen(), true); assert.equal(body.hidden, false); assert.ok(root.classList.contains("is-expanded")); assert.equal(events.length, 1);
  current.focus(); current.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(body.hidden, true); assert.equal(document.activeElement, trigger);
  instance.open(); root.querySelector("[data-g-nav-close]").click(); assert.equal(instance.isOpen(), false); assert.equal(document.activeElement, trigger);
  app.unmount(); host.remove();
});

test("GNavigationRail renders a semantic rail and provides vertical roving focus with disabled-item skipping", async () => {
  const { app, host } = mount(() => h(library.GNavigationRail, { variant: ["floating", "responsive"], "aria-label": "Workspace shortcuts" }, () => [
    h("header", { class: "g-nav-rail-header" }, [
      h("a", { class: "g-nav-rail-brand", href: "#home", "aria-label": "Home" }, h("span", { class: "g-nav-rail-brand-mark" }, "G")),
      h("button", { class: "g-nav-rail-primary-action", type: "button", "aria-label": "New project" }, "+"),
    ]),
    h("div", { class: "g-nav-rail-group" }, [
      h("span", { class: "g-nav-rail-group-label" }, "Workspace"),
      h("ul", { class: "g-nav-rail-list" }, [
        h("li", null, h("a", { class: "g-nav-rail-item", href: "#overview", "aria-current": "page" }, [h("span", { class: "g-nav-rail-indicator" }), h("span", { class: "g-nav-rail-icon" }, "O"), h("span", { class: "g-nav-rail-label" }, "Overview")])),
        h("li", null, h("a", { class: "g-nav-rail-item", href: "#projects" }, [h("span", { class: "g-nav-rail-icon" }, "P"), h("span", { class: "g-nav-rail-label" }, "Projects"), h("span", { class: "g-nav-rail-badge" }, "8")])),
        h("li", null, h("a", { class: "g-nav-rail-item", href: "#admin", "aria-disabled": "true", tabindex: "-1" }, "Admin")),
        h("li", null, h("a", { class: "g-nav-rail-item", href: "#reports" }, [h("span", { class: "g-nav-rail-icon" }, "R"), h("span", { class: "g-nav-rail-label" }, "Reports")])),
      ]),
    ]),
    h("footer", { class: "g-nav-rail-footer" }, h("a", { class: "g-nav-rail-action", href: "#account", "aria-label": "Account" }, "A")),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-nav-rail"); const [overview, projects, disabled, reports] = root.querySelectorAll(".g-nav-rail-item"); const instance = library.getInstance(root, "roving-nav");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Workspace shortcuts"); assert.equal(root.hasAttribute("data-g-roving-nav"), true); assert.ok(root.classList.contains("g-nav-rail-floating")); assert.ok(root.classList.contains("g-nav-rail-responsive"));
  assert.equal(root.querySelector(".g-nav-rail-list").tagName, "UL"); assert.equal(root.querySelector(".g-nav-rail-badge").textContent, "8"); assert.equal(overview.tabIndex, 0); assert.equal(disabled.tabIndex, -1);
  overview.focus(); overview.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, projects);
  projects.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, reports);
  assert.equal(instance.select(disabled, true), null); assert.equal(document.activeElement, reports); instance.select(overview, true); assert.equal(document.activeElement, overview);
  app.unmount(); host.remove();
});

test("GActivityBar renders a semantic workbench switcher and roves through enabled primary and utility activities", async () => {
  const { app, host } = mount(() => h(library.GActivityBar, { variant: ["dark", "floating"], "aria-label": "Workbench activities" }, () => [
    h("header", { class: "g-activitybar-header" }, h("a", { class: "g-activitybar-brand", href: "#workbench", "aria-label": "Gardenerim" }, "G")),
    h("div", { class: "g-activitybar-group" }, h("ul", { class: "g-activitybar-list" }, [
      h("li", null, h("a", { class: "g-activitybar-item", href: "#explorer", "aria-current": "page" }, [h("span", { class: "g-activitybar-indicator" }), h("span", { class: "g-activitybar-icon" }, "E"), h("span", { class: "g-activitybar-label" }, "Explorer")])),
      h("li", null, h("a", { class: "g-activitybar-item", href: "#search" }, [h("span", { class: "g-activitybar-icon" }, "S"), h("span", { class: "g-activitybar-label" }, "Search")])),
      h("li", null, h("a", { class: "g-activitybar-item", href: "#source" }, [h("span", { class: "g-activitybar-icon" }, "C"), h("span", { class: "g-activitybar-label" }, "Source control"), h("span", { class: "g-activitybar-badge" }, "3")])),
      h("li", null, h("a", { class: "g-activitybar-item", href: "#remote", "aria-disabled": "true", tabindex: "-1" }, "Remote")),
    ])),
    h("footer", { class: "g-activitybar-footer" }, h("a", { class: "g-activitybar-action", href: "#account" }, [h("span", { class: "g-activitybar-icon" }, "A"), h("span", { class: "g-activitybar-label" }, "Account"), h("span", { class: "g-activitybar-status" })])),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-activitybar"); const [explorer, search, source, disabled, account] = root.querySelectorAll(".g-activitybar-item, .g-activitybar-action"); const instance = library.getInstance(root, "roving-nav");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Workbench activities"); assert.equal(root.hasAttribute("data-g-roving-nav"), true); assert.ok(root.classList.contains("g-activitybar-dark")); assert.ok(root.classList.contains("g-activitybar-floating"));
  assert.equal(root.querySelector(".g-activitybar-list").tagName, "UL"); assert.equal(root.querySelector(".g-activitybar-badge").textContent, "3"); assert.equal(explorer.tabIndex, 0); assert.equal(disabled.tabIndex, -1);
  explorer.focus(); explorer.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, search);
  source.focus(); source.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, account);
  account.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true })); assert.equal(document.activeElement, explorer);
  assert.equal(instance.select(disabled, true), null); assert.equal(document.activeElement, explorer); assert.equal(instance.select(account, true), account); assert.equal(document.activeElement, account);
  app.unmount(); host.remove();
});

test("GMenuBar renders application menus and coordinates top-level roving focus with open dropdowns", async () => {
  const dropdown = (label, commands) => h("li", { role: "none" }, h("div", { class: "g-menubar-menu", "data-g-dropdown": "" }, [
    h("button", { class: "g-menubar-item", type: "button", role: "menuitem", "data-g-dropdown-trigger": "" }, label),
    h("ul", { class: "g-menubar-menu-panel", "data-g-dropdown-menu": "", hidden: true }, commands.map((command) => h("li", { role: "none" }, h("button", { class: "g-menubar-menu-item", type: "button", role: "menuitem" }, command)))),
  ]));
  const { app, host } = mount(() => h(library.GMenuBar, { variant: ["bordered", "compact"], "aria-label": "Application menu" }, () => [
    h("div", { class: "g-menubar-start" }, [h("strong", { class: "g-menubar-brand" }, "Studio"), h("ul", { class: "g-menubar-list", role: "none" }, [dropdown("File", ["New", "Open"]), dropdown("Edit", ["Undo", "Redo"]), h("li", { role: "none" }, h("button", { class: "g-menubar-item", type: "button", role: "menuitem", "aria-disabled": "true" }, "Admin")), h("li", { role: "none" }, h("button", { class: "g-menubar-item", type: "button", role: "menuitem" }, "Help"))])]),
    h("div", { class: "g-menubar-end" }, h("span", { class: "g-menubar-status", role: "status" }, "Saved")),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-menubar"); const [file, edit, disabled, help] = root.querySelectorAll(".g-menubar-item"); const [fileMenu, editMenu] = root.querySelectorAll(".g-menubar-menu-panel");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("role"), "menubar"); assert.equal(root.getAttribute("aria-orientation"), "horizontal"); assert.equal(root.hasAttribute("data-g-roving-nav"), true); assert.ok(root.classList.contains("g-menubar-bordered")); assert.ok(root.classList.contains("g-menubar-compact")); assert.equal(file.tabIndex, 0); assert.equal(disabled.tabIndex, -1);
  file.focus(); file.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); assert.equal(document.activeElement, edit);
  edit.dispatchEvent(new window.KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true })); assert.equal(document.activeElement, help);
  file.focus(); file.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); await Promise.resolve(); assert.equal(fileMenu.hidden, false); assert.equal(document.activeElement.textContent, "New");
  document.activeElement.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); await Promise.resolve(); assert.equal(fileMenu.hidden, true); assert.equal(editMenu.hidden, false); assert.equal(document.activeElement.textContent, "Undo");
  document.activeElement.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(editMenu.hidden, true); assert.equal(document.activeElement, edit);
  app.unmount(); host.remove();
});

test("GContextMenu separates its target and panel while providing keyboard, checked, and focus behavior", async () => {
  const { app, host } = mount(() => h(library.GContextMenu, { variant: ["bordered", "elevated"], "aria-label": "Document actions" }, () => [
    h("div", { class: "g-context-menu-target", "data-g-context-target": "" }, "Document.pdf"),
    h("ul", { class: "g-context-menu-panel", "data-g-context-menu-panel": "", hidden: true }, [
      h("li", null, h("button", { class: "g-context-menu-item", type: "button", "data-g-value": "open" }, "Open")),
      h("li", null, h("button", { class: "g-context-menu-item", type: "button", role: "menuitemcheckbox", "aria-checked": "true", "data-g-value": "favorite", "data-g-keep-open": "true" }, "Favorite")),
      h("li", null, h("button", { class: "g-context-menu-item", type: "button", "aria-disabled": "true" }, "Archive")),
      h("li", null, h("button", { class: "g-context-menu-item is-danger", type: "button", "data-g-value": "remove" }, "Remove")),
    ]),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-context-menu"); const target = root.querySelector("[data-g-context-target]"); const menu = root.querySelector("[data-g-context-menu-panel]"); const [openItem, favorite, disabled, remove] = root.querySelectorAll(".g-context-menu-item");
  assert.equal(root.hasAttribute("data-g-context-menu"), true); assert.ok(root.classList.contains("g-context-menu-bordered")); assert.ok(root.classList.contains("g-context-menu-elevated")); assert.equal(target.tabIndex, 0); assert.equal(target.getAttribute("aria-controls"), menu.id); assert.equal(target.getAttribute("aria-expanded"), "false"); assert.equal(menu.getAttribute("role"), "menu"); assert.equal(openItem.getAttribute("role"), "menuitem"); assert.equal(disabled.tabIndex, -1);
  target.focus(); target.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ContextMenu", bubbles: true, cancelable: true })); assert.equal(menu.hidden, false); assert.equal(target.getAttribute("aria-expanded"), "true"); assert.equal(document.activeElement, openItem);
  openItem.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, favorite); favorite.click(); assert.equal(favorite.getAttribute("aria-checked"), "false"); assert.equal(menu.hidden, false);
  favorite.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); assert.equal(document.activeElement, remove); remove.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(menu.hidden, true); assert.equal(target.getAttribute("aria-expanded"), "false"); assert.equal(document.activeElement, target);
  app.unmount(); host.remove();
});

test("GNavbar renders a complete responsive shell and initializes its mobile disclosure", async () => {
  const { app, host } = mount(() => h(library.GNavbar, {
    as: "header", variant: ["floating", "compact"], "aria-label": "Workspace header",
  }, () => [
    h("div", { class: "g-navbar-inner" }, [
      h("a", { class: "g-navbar-brand", href: "#home" }, [h("span", { class: "g-navbar-brand-mark" }, "G"), h("span", { class: "g-navbar-brand-text" }, "Gardenerim")]),
      h("nav", { class: "g-navbar-nav", "aria-label": "Primary" }, [h("a", { class: "g-nav-link", href: "#home", "aria-current": "page" }, "Home"), h("a", { class: "g-nav-link", href: "#projects" }, "Projects")]),
      h("div", { class: "g-navbar-actions" }, [h("button", { type: "button", class: "g-navbar-toggle", "data-g-nav-toggle": "test-navbar-panel", "data-g-focus-first": "true", "data-g-open-label": "Open navigation", "data-g-close-label": "Close navigation", "aria-label": "Open navigation" }, "Menu")]),
    ]),
    h("div", { id: "test-navbar-panel", class: "g-navbar-mobile-panel", hidden: true }, [h("a", { class: "g-nav-link", href: "#projects", "data-g-nav-close": "" }, "Projects"), h("a", { class: "g-nav-link", href: "#team", "data-g-nav-close": "" }, "Team")]),
  ]));
  await nextTick(); await Promise.resolve();
  const root = host.querySelector(".g-navbar"); const trigger = root.querySelector("[data-g-nav-toggle]"); const panel = root.querySelector(".g-navbar-mobile-panel");
  assert.equal(root.tagName, "HEADER"); assert.ok(root.classList.contains("g-navbar-floating")); assert.ok(root.classList.contains("g-navbar-compact"));
  assert.equal(trigger.getAttribute("aria-controls"), "test-navbar-panel"); assert.equal(trigger.getAttribute("aria-expanded"), "false");
  trigger.click(); await new Promise((resolve) => window.requestAnimationFrame(resolve));
  assert.equal(panel.hidden, false); assert.ok(panel.classList.contains("is-open")); assert.equal(trigger.getAttribute("aria-label"), "Close navigation");
  assert.equal(document.activeElement, panel.querySelector(".g-nav-link"));
  panel.querySelector("[data-g-nav-close]").click();
  assert.equal(panel.dataset.gNavOpen, "false"); assert.equal(trigger.getAttribute("aria-expanded"), "false"); assert.equal(document.activeElement, trigger);
  app.unmount(); host.remove();
});

test("GSidebar renders grouped navigation and composes drawer and roving behavior", async () => {
  const { app, host } = mount(() => h("div", null, [
    h("button", { type: "button", "data-g-nav-toggle": "vue-runtime-sidebar", "data-g-focus-first": "true", "aria-label": "Open sidebar" }, "Menu"),
    h(library.GSidebar, { id: "vue-runtime-sidebar", variant: ["drawer", "compact"], hidden: true, "data-g-roving-nav": "", "data-g-orientation": "vertical", "aria-label": "Workspace" }, () => [
      h("header", { class: "g-sidebar-header" }, [h("a", { class: "g-sidebar-brand", href: "#home" }, [h("span", { class: "g-sidebar-brand-mark" }, "G"), h("span", { class: "g-sidebar-brand-content" }, "Gardenerim")])]),
      h("div", { class: "g-sidebar-body" }, [h("nav", { class: "g-sidebar-nav", "aria-label": "Project" }, [h("div", { class: "g-sidebar-group" }, [h("h3", { class: "g-sidebar-section" }, "Workspace"), h("ul", { class: "g-sidebar-list" }, [
        h("li", { class: "g-sidebar-item" }, h("a", { class: "g-sidebar-link", href: "#overview", "aria-current": "page", "data-g-nav-close": "" }, [h("span", { class: "g-sidebar-icon" }, "O"), h("span", { class: "g-sidebar-label" }, "Overview")])),
        h("li", { class: "g-sidebar-item" }, h("a", { class: "g-sidebar-link", href: "#projects", "data-g-nav-close": "" }, [h("span", { class: "g-sidebar-icon" }, "P"), h("span", { class: "g-sidebar-label" }, "Projects"), h("span", { class: "g-sidebar-badge" }, "4")])),
      ])])])]),
      h("footer", { class: "g-sidebar-footer" }, h("a", { class: "g-sidebar-account", href: "#account" }, [h("span", { class: "g-sidebar-brand-mark" }, "YL"), h("span", { class: "g-sidebar-account-content" }, "Yun Lin")]))
    ])
  ]));
  await nextTick(); library.init(host); await Promise.resolve();
  const trigger = host.querySelector("[data-g-nav-toggle]"); const root = host.querySelector(".g-sidebar");
  assert.equal(root.tagName, "ASIDE"); assert.ok(root.classList.contains("g-sidebar-drawer")); assert.ok(root.classList.contains("g-sidebar-compact"));
  assert.equal(root.querySelectorAll(".g-sidebar-group").length, 1); assert.equal(root.querySelector("[aria-current='page']").textContent.includes("Overview"), true);
  trigger.click(); await new Promise((resolve) => window.requestAnimationFrame(resolve));
  const [overview, projects] = root.querySelectorAll(".g-sidebar-link");
  assert.equal(root.hidden, false); assert.ok(root.classList.contains("is-open")); assert.equal(document.activeElement === root.querySelector(".g-sidebar-brand"), true);
  overview.focus();
  overview.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement === projects, true);
  projects.click(); assert.equal(root.dataset.gNavOpen, "false"); assert.equal(document.activeElement === trigger, true);
  library.destroy(host); app.unmount(); host.remove();
});

test("GBreadcrumb renders an ordered hierarchy with current page and native overflow disclosure", async () => {
  const { app, host } = mount(() => h(library.GBreadcrumb, { variant: ["contained", "chevron"], "aria-label": "Page path" }, () => [
    h("ol", { class: "g-breadcrumb-list" }, [
      h("li", { class: "g-breadcrumb-item" }, h("a", { class: "g-breadcrumb-link", href: "#home" }, [h("span", { class: "g-breadcrumb-icon", "aria-hidden": "true" }, "H"), h("span", { class: "g-breadcrumb-label" }, "Home")])),
      h("li", { class: "g-breadcrumb-item" }, h("details", { class: "g-breadcrumb-overflow" }, [h("summary", { class: "g-breadcrumb-ellipsis", "aria-label": "Show intermediate pages" }, "..."), h("ul", { class: "g-breadcrumb-menu" }, [h("li", h("a", { href: "#archive" }, "Archive")), h("li", h("a", { href: "#library" }, "Library"))])])),
      h("li", { class: "g-breadcrumb-item" }, h("a", { class: "g-breadcrumb-link", href: "#project" }, "Project")),
      h("li", { class: "g-breadcrumb-item" }, h("span", { class: "g-breadcrumb-current", "aria-current": "page" }, "Navigation specification")),
    ])
  ]));
  await nextTick();
  const root = host.querySelector(".g-breadcrumb"); const overflow = root.querySelector("details");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Page path");
  assert.ok(root.classList.contains("g-breadcrumb-contained")); assert.ok(root.classList.contains("g-breadcrumb-chevron"));
  assert.equal(root.querySelector(".g-breadcrumb-list").tagName, "OL"); assert.equal(root.querySelectorAll(".g-breadcrumb-item").length, 4);
  assert.equal(root.querySelector(".g-breadcrumb-current[aria-current='page']").textContent, "Navigation specification");
  assert.equal(overflow.open, false); overflow.open = true; await nextTick(); assert.equal(overflow.open, true); assert.equal(overflow.querySelectorAll(".g-breadcrumb-menu a").length, 2);
  app.unmount(); host.remove();
});

test("GTabs normalizes semantics and synchronizes keyboard, click and programmatic selection", async () => {
  const changes = [];
  const { app, host } = mount(() => h(library.GTabs, { variant: ["contained", "scrollable"], "aria-label": "Project details" }, () => [
    h("div", { class: "g-tabs-header" }, [
      h("div", { class: "g-tab-list", "aria-label": "Project sections" }, [
        h("button", { id: "vue-runtime-overview", class: "g-tab", type: "button", "aria-controls": "vue-runtime-overview-panel", "aria-selected": "true" }, "Overview"),
        h("button", { class: "g-tab", type: "button", "aria-disabled": "true" }, "Audit"),
        h("button", { id: "vue-runtime-activity", class: "g-tab", type: "button", "aria-controls": "vue-runtime-activity-panel" }, ["Activity", h("span", { class: "g-tab-badge" }, "8")]),
      ]),
      h("div", { class: "g-tabs-actions" }, h("button", { type: "button" }, "Manage")),
    ]),
    h("div", { class: "g-tab-panels" }, [
      h("section", { id: "vue-runtime-overview-panel", class: "g-tab-panel" }, "Overview panel"),
      h("section", { class: "g-tab-panel", hidden: true }, "Disabled panel"),
      h("section", { id: "vue-runtime-activity-panel", class: "g-tab-panel", hidden: true }, "Activity panel"),
    ]),
  ]));
  await nextTick(); library.init(host); await Promise.resolve();
  const root = host.querySelector(".g-tabs"); root.addEventListener("gardener:change", event => changes.push(event.detail));
  const list = root.querySelector(".g-tab-list"); const [overview, disabled, activity] = root.querySelectorAll(".g-tab");
  const [overviewPanel, disabledPanel, activityPanel] = root.querySelectorAll(".g-tab-panel");
  assert.ok(root.classList.contains("g-tabs-contained")); assert.ok(root.classList.contains("g-tabs-scrollable"));
  assert.equal(list.getAttribute("role"), "tablist"); assert.equal(overview.getAttribute("role"), "tab"); assert.equal(activityPanel.getAttribute("role"), "tabpanel");
  assert.equal(overview.tabIndex, 0); assert.equal(activity.tabIndex, -1); assert.equal(overviewPanel.hidden, false); assert.equal(disabledPanel.hidden, true); assert.equal(activityPanel.hidden, true);
  overview.focus(); overview.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  assert.equal(document.activeElement, activity); assert.equal(activity.getAttribute("aria-selected"), "true"); assert.equal(activityPanel.hidden, false); assert.equal(overviewPanel.hidden, true);
  overview.click(); assert.equal(overview.getAttribute("aria-selected"), "true"); assert.equal(overviewPanel.hidden, false);
  const instance = library.getInstance(root, "tabs"); instance.select(2);
  assert.equal(activity.getAttribute("aria-selected"), "true"); assert.equal(activityPanel.hidden, false); assert.equal(disabled.getAttribute("aria-selected"), "false"); assert.ok(changes.length >= 3);
  library.destroy(host); app.unmount(); host.remove();
});

test("GSegmentedControl renders rich options and bridges shared view selection to v-model", async () => {
  const model = ref("list");
  const { app, host } = mount(() => h(library.GSegmentedControl, {
    variant: ["outlined", "responsive"], modelValue: model.value, modelEvent: "viewchange", "data-g-current-view": model.value, "aria-label": "Layout",
    "onUpdate:modelValue": value => { model.value = value; },
  }, () => [
    h("button", { class: "g-segmented-item", type: "button", "data-g-view": "list", "aria-checked": "true" }, [h("span", { class: "g-segmented-icon" }, "L"), h("span", { class: "g-segmented-label" }, "List")]),
    h("button", { class: "g-segmented-item", type: "button", "data-g-view": "board", "aria-disabled": "true" }, "Board"),
    h("button", { class: "g-segmented-item", type: "button", "data-g-view": "grid" }, [h("span", { class: "g-segmented-label" }, "Grid"), h("span", { class: "g-segmented-badge" }, "6")]),
    h("input", { class: "g-segmented-input", "data-g-segmented-input": "", name: "layout" }),
  ]));
  await nextTick(); library.init(host); await Promise.resolve();
  const root = host.querySelector(".g-segmented"); const [list, board, grid] = root.querySelectorAll(".g-segmented-item");
  assert.ok(root.classList.contains("g-segmented-outlined")); assert.ok(root.classList.contains("g-segmented-responsive")); assert.equal(root.getAttribute("role"), "radiogroup");
  assert.equal(list.getAttribute("aria-checked"), "true"); grid.click(); await nextTick(); assert.equal(model.value, "grid"); assert.equal(grid.getAttribute("aria-checked"), "true");
  grid.focus(); grid.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); await nextTick();
  assert.equal(document.activeElement, list); assert.equal(model.value, "list"); assert.equal(board.getAttribute("aria-checked"), "false"); assert.equal(root.querySelector("input").value, "list");
  library.destroy(host); app.unmount(); host.remove();
});

test("GPagination renders a semantic native navigation and supports controlled page changes", async () => {
  const current = ref(2);
  const selectPage = (page) => { current.value = page; };
  const { app, host } = mount(() => h(library.GPagination, { variant: ["bordered", "responsive"], "aria-label": "Results pages" }, () => [
    h("span", { class: "g-pagination-total" }, "42 results"),
    h("ol", { class: "g-pagination-list" }, [
      h("li", { class: "g-pagination-item" }, h("button", { class: "g-page-link g-page-previous", type: "button", "aria-label": "Previous page", onClick: () => selectPage(Math.max(1, current.value - 1)) }, "‹")),
      ...[1, 2, 3].map((page) => h("li", { class: "g-pagination-item" }, h("button", { class: "g-page-link g-page-number", type: "button", "aria-label": `Page ${page}`, "aria-current": current.value === page ? "page" : undefined, onClick: () => selectPage(page) }, String(page)))),
      h("li", { class: "g-pagination-item" }, h("button", { class: "g-page-link g-page-next", type: "button", "aria-label": "Next page", onClick: () => selectPage(Math.min(3, current.value + 1)) }, "›")),
    ]),
    h("span", { class: "g-pagination-status", role: "status", "aria-live": "polite" }, `Page ${current.value} of 3`),
  ]));
  await nextTick();
  const root = host.querySelector(".g-pagination");
  assert.equal(root.tagName, "NAV"); assert.equal(root.getAttribute("aria-label"), "Results pages");
  assert.ok(root.classList.contains("g-pagination-bordered")); assert.ok(root.classList.contains("g-pagination-responsive"));
  assert.equal(root.querySelector(".g-pagination-list").tagName, "OL"); assert.equal(root.querySelectorAll(".g-pagination-item").length, 5);
  assert.equal(root.querySelector("[aria-current='page']").textContent, "2");
  root.querySelector(".g-page-next").click(); await nextTick();
  assert.equal(current.value, 3); assert.equal(root.querySelector("[aria-current='page']").textContent, "3"); assert.equal(root.querySelector("[role='status']").textContent, "Page 3 of 3");
  app.unmount(); host.remove();
});

test("GMenuDropdown renders a complete menu and delegates keyboard, checked and focus behavior", async () => {
  const { app, host } = mount(() => h(library.GMenuDropdown, { variant: ["end", "scrollable"] }, () => [
    h("button", { class: "g-btn g-dropdown-trigger", type: "button", "data-g-dropdown-trigger": "" }, ["Actions", h("span", { class: "g-dropdown-trigger-icon" }, "⌄")]),
    h("ul", { class: "g-menu g-dropdown-menu", "data-g-dropdown-menu": "", hidden: true }, [
      h("li", { role: "presentation" }, h("button", { class: "g-menu-item", type: "button", "aria-disabled": "true" }, "Locked")),
      h("li", { role: "presentation" }, h("button", { class: "g-menu-item", type: "button", "data-g-value": "open" }, "Open")),
      h("li", { role: "presentation" }, h("button", { class: "g-menu-item", type: "button", role: "menuitemcheckbox", "aria-checked": "false", "data-g-value": "hidden", "data-g-keep-open": "true" }, "Hidden files")),
    ]),
  ]));
  await nextTick(); library.init(host); await Promise.resolve();
  const root = host.querySelector(".g-dropdown"); const trigger = root.querySelector("[data-g-dropdown-trigger]"); const menu = root.querySelector("[data-g-dropdown-menu]"); const changes = [];
  root.addEventListener("gardener:change", (event) => changes.push(event.detail.value));
  assert.ok(root.classList.contains("g-dropdown-end")); assert.ok(root.classList.contains("g-dropdown-scrollable"));
  trigger.focus(); trigger.dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true })); await Promise.resolve();
  assert.equal(menu.hidden, false); assert.equal(trigger.getAttribute("aria-expanded"), "true"); assert.equal(document.activeElement.textContent, "Open");
  const check = root.querySelector("[role='menuitemcheckbox']"); check.click(); assert.equal(check.getAttribute("aria-checked"), "true"); assert.equal(menu.hidden, false); assert.deepEqual(changes, ["hidden"]);
  check.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true })); assert.equal(menu.hidden, true); assert.equal(document.activeElement, trigger);
  library.destroy(host); app.unmount(); host.remove();
});

test("GCommandPalette renders a searchable dialog and delegates keyboard selection with focus restoration", async () => {
  const { app, host } = mount(() => h("div", [
    h("button", { type: "button", "data-g-command-trigger": "vue-test-command" }, "Open commands"),
    h(library.GCommandPalette, { id: "vue-test-command", variant: ["wide", "responsive"], config: { shortcut: "mod+k" }, hidden: true, "aria-label": "Workspace commands" }, () => [
      h("section", { class: "g-command-palette" }, [
        h("header", { class: "g-command-header" }, h("div", { class: "g-command-search" }, [
          h("span", { class: "g-command-search-icon", "aria-hidden": "true" }, "⌕"),
          h("input", { class: "g-command-input", type: "search", placeholder: "Search commands" }),
          h("button", { class: "g-command-clear", type: "button", "aria-label": "Clear search" }, "×"),
        ])),
        h("div", { class: "g-command-results" }, [
          h("section", { class: "g-command-group" }, [
            h("h3", { class: "g-command-group-label" }, "Create"),
            h("div", { class: "g-command-list" }, [
              h("button", { class: "g-command-item", type: "button", "data-g-value": "new", "data-g-keywords": "create document" }, h("span", { class: "g-command-item-title" }, "New document")),
              h("button", { class: "g-command-item", type: "button", "data-g-value": "locked", "aria-disabled": "true" }, h("span", { class: "g-command-item-title" }, "Locked command")),
              h("button", { class: "g-command-item", type: "button", "data-g-value": "settings", "data-g-keywords": "preferences" }, h("span", { class: "g-command-item-title" }, "Open settings")),
            ]),
          ]),
          h("p", { class: "g-command-empty", hidden: true }, "No matching commands"),
        ]),
        h("footer", { class: "g-command-footer" }, h("span", { class: "g-command-count" }, [h("b", { "data-g-command-count": "" }, "3"), " commands"])),
      ]),
    ]),
  ]));
  await nextTick(); library.init(host); await Promise.resolve();
  const root = host.querySelector(".g-command-palette-overlay"); const trigger = host.querySelector("[data-g-command-trigger]"); const input = root.querySelector(".g-command-input"); const selections = [];
  root.addEventListener("gardener:commandselect", (event) => selections.push(event.detail));
  assert.ok(root.classList.contains("g-command-palette-overlay-wide")); assert.ok(root.classList.contains("g-command-palette-overlay-responsive"));
  trigger.focus(); trigger.click(); assert.equal(root.hidden, false); assert.equal(root.getAttribute("role"), "dialog"); assert.equal(document.activeElement, input); assert.equal(input.getAttribute("role"), "combobox");
  input.value = "preferences"; input.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.equal(root.querySelectorAll(".g-command-item:not([hidden])").length, 1); assert.equal(root.querySelector("[data-g-command-count]").textContent, "1"); assert.match(input.getAttribute("aria-activedescendant"), /g-command-item-/);
  input.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
  assert.equal(root.hidden, true); assert.equal(document.activeElement, trigger); assert.equal(selections.length, 1); assert.equal(selections[0].value, "settings"); assert.equal(selections[0].reason, "keyboard");
  library.destroy(host); app.unmount(); host.remove();
});

test("GStepper renders a semantic process and delegates selection, completion, and keyboard focus", async () => {
  const { app, host } = mount(() => h(library.GStepper, { as: "ol", variant: ["navigation", "responsive", "contained"], config: { autoComplete: true }, "aria-label": "Setup" }, () => [
    h("li", { class: "g-step is-complete", "data-g-value": "account" }, h("button", { class: "g-step-action", type: "button" }, [h("span", { class: "g-step-indicator" }, "✓"), h("span", { class: "g-step-content" }, [h("strong", { class: "g-step-title" }, "Account"), h("span", { class: "g-step-description" }, "Created")])])),
    h("li", { class: "g-step is-active", "data-g-value": "profile" }, h("button", { class: "g-step-action", type: "button" }, [h("span", { class: "g-step-indicator" }, "2"), h("span", { class: "g-step-title" }, "Profile")])),
    h("li", { class: "g-step", "data-g-value": "review" }, h("button", { class: "g-step-action", type: "button" }, [h("span", { class: "g-step-indicator" }, "3"), h("span", { class: "g-step-title" }, "Review")])),
    h("li", { class: "g-step is-disabled", "data-g-value": "publish", "aria-disabled": "true" }, h("button", { class: "g-step-action", type: "button" }, [h("span", { class: "g-step-indicator" }, "4"), h("span", { class: "g-step-title" }, "Publish")])),
    h("li", { class: "g-stepper-summary", role: "status" }, "Step 2 of 4"),
  ]));
  await nextTick(); library.init(host);
  const root = host.querySelector(".g-stepper"); const steps = [...root.querySelectorAll(".g-step")]; const actions = steps.map((step) => step.querySelector(".g-step-action")); const changes = [];
  root.addEventListener("gardener:stepchange", (event) => changes.push(event.detail));
  const instance = library.getInstance(root, "stepper");
  assert.equal(root.tagName, "OL"); assert.equal(instance.current(), steps[1]);
  assert.ok(root.classList.contains("g-stepper-navigation")); assert.ok(root.classList.contains("g-stepper-responsive")); assert.equal(actions[1].tabIndex, 0);
  actions[1].focus(); actions[1].dispatchEvent(new window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true })); assert.equal(document.activeElement, actions[2]); assert.equal(instance.current(), steps[1]);
  actions[2].click(); assert.equal(instance.current(), steps[2]); assert.equal(steps[2].getAttribute("aria-current"), "step"); assert.equal(steps[1].classList.contains("is-complete"), true); assert.equal(changes.at(-1).value, "review");
  actions[3].click(); assert.equal(instance.current(), steps[2]); assert.equal(instance.previous(false), steps[1]); assert.equal(instance.next(false), steps[2]);
  library.destroy(host); app.unmount(); host.remove();
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

test("GardenerimProvider applies theme axes and runtime locale", async () => {
  const { app, host } = mount(() => h(library.GardenerimProvider, { theme: "garden", mode: "light", density: "compact", shape: "subtle", locale: "fr" }, () => "Content"));
  await nextTick();
  const provider = host.firstElementChild;
  assert.equal(provider.dataset.gTheme, "garden");
  assert.equal(provider.dataset.gMode, "light");
  assert.equal(provider.dataset.gDensity, "compact");
  assert.equal(provider.dataset.gShape, "subtle");
  assert.equal(library.Gardenerim.locale, "fr");
  app.unmount();
  host.remove();
  library.configure({ locale: "en", refresh: false });
});

test("the Vue plugin registers the complete component catalog and directive", () => {
  const registered = [];
  const directives = [];
  const app = { component: (name) => registered.push(name), directive: (name) => directives.push(name) };
  library.GardenerimVue.install(app, { initialize: false });
  assert.equal(registered.length, library.componentCatalog.length + 3);
  assert.ok(registered.includes("GButton"));
  assert.ok(registered.includes("GProvider"));
  assert.deepEqual(directives, ["gardenerim"]);
});

test('all six Vue overlays retain instance and edited content across controlled parameter updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='overlay')){const floating=['popover','tooltip','popconfirm'].includes(definition.name),type=floating?definition.name==='tooltip'?'tooltip':'popover':definition.name==='drawer'?'drawer':'dialog',width=ref(300),opened=ref(false);const children=()=>floating?[h('button',{['data-g-'+type+'-trigger']:''},'Open'),h('div',{['data-g-'+type+'-content']:'',hidden:true},[h('input')])]:[h('section',{class:type==='drawer'?'g-drawer':'g-dialog'},[h('input')])];const {app,host}=mount(()=>h(library[definition.exportName],{config:{overlayControlled:true,overlayOpen:opened.value,overlayWidth:width.value,overlayMaxHeight:320,overlayDensity:"compact",overlayShowClose:false,overlayKeyboard:false}},children));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,type);assert.ok(api,definition.name);assert.equal(root.getAttribute('data-g-overlay-keyboard'),'false');assert.equal(root.getAttribute('data-g-overlay-max-height'),'320');assert.equal(root.getAttribute('data-g-overlay-density'),'compact');assert.equal(root.getAttribute('data-g-overlay-show-close'),'false');opened.value=true;await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(api.isOpen(),true);root.querySelector('input').value='Edited';width.value=480;await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,type),api);assert.equal(root.querySelector('input').value,'Edited');app.unmount();host.remove();}
});

test('disclosure controlled keys and false configuration work without remounting Vue content',async()=>{const value=ref('[]'),size=ref('small');const {app,host}=mount(()=>h(library.GCollapse,{config:{disclosureValue:value.value,disclosureCollapsible:false,disclosureSize:size.value}},()=>[h('button',{class:'g-disclosure-trigger','data-g-disclosure-key':'a'},'Details'),h('div',{class:'g-disclosure-panel'},[h('input',{defaultValue:'draft'})])]));await nextTick();const element=host.firstElementChild,instance=library.getInstance(element,'accordion');assert.equal(element.getAttribute('data-g-disclosure-collapsible'),'false');assert.deepEqual(instance.value(),['a']);host.querySelector('input').value='edited';size.value='large';await nextTick();await new Promise(r=>setTimeout(r,10));assert.equal(library.getInstance(element,'accordion'),instance);assert.equal(host.querySelector('input').value,'edited');app.unmount();host.remove();});

test('managed data preserves Vue instances, filtering and controlled keys on config updates',async()=>{const size=ref('small'),keys=ref('[]');const {app,host}=mount(()=>h(library.GVirtualList,{config:{dataOptions:JSON.stringify({items:[{id:'a',label:'Alpha'},{id:'b',label:'Beta'}]}),dataValue:keys.value,dataSize:size.value,dataBordered:true,dataDisabled:false}}));await nextTick();const element=host.firstElementChild,api=library.getInstance(element,'data-display');assert.ok(api);assert.equal(element.dataset.gDataBordered,'true');assert.equal(element.dataset.gDataDisabled,'false');const input=element.querySelector('input');input.value='Alpha';input.dispatchEvent(new window.Event('input',{bubbles:true}));size.value='large';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(element,'data-display'),api);assert.equal(api.getState().filter,'Alpha');keys.value='["a"]';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(element.querySelector('[role=option]').getAttribute('aria-selected'),'true');app.unmount();host.remove();});

const {interactionOptions}=await import('../../../scripts/interaction-examples.mjs');
test('all 35 Vue interactions preserve controlled state, booleans and controller on parameter updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='interaction')){const size=ref('small'),value=ref(JSON.stringify(interactionOptions[definition.name].value||{}));const {app,host}=mount(()=>h(library[definition.exportName],{config:{interactionOptions:JSON.stringify({...interactionOptions[definition.name],showHeader:true,showCount:false,showDescriptions:false,showIcons:false,showAvatars:false,showPresets:false,showReset:false,showResults:false,showSnapshot:false,listHeight:240,maxHeight:480,columns:2,columnWidth:160,splitHeight:240,serviceTimeout:5000,size:'medium',bordered:false}),interactionSize:size.value,interactionValue:value.value,interactionDisabled:false,interactionBordered:true}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'interaction');assert.ok(api,definition.name);assert.equal(root.dataset.gInteractionDisabled,'false');assert.equal(root.dataset.gInteractionBordered,'true');assert.equal(root.querySelector('.g-interaction-heading').textContent,interactionOptions[definition.name].title);size.value='large';value.value=JSON.stringify({ratio:60});await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'interaction'),api);assert.equal(api.getState().ratio,60);assert.equal(root.style.getPropertyValue('--g-interaction-height'),'240px');assert.equal(root.style.getPropertyValue('--g-interaction-columns'),'2');assert.equal(root.style.getPropertyValue('--g-interaction-density-row'),'36px');app.unmount();host.remove();}
});

const {contentOptions}=await import('../../../scripts/content-examples.mjs');
test('all 39 Vue contents preserve controlled state, booleans and controller on parameter updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='content')){const size=ref('small'),value=ref(JSON.stringify(contentOptions[definition.name].value||{}));const {app,host}=mount(()=>h(library[definition.exportName],{config:{contentOptions:JSON.stringify({...contentOptions[definition.name],showHeader:true,showToolbar:true,showCount:false,showPagination:true,showMetadata:false,showDescriptions:false,showSort:false,showViewSwitcher:true,showUploadHints:false,showChunkDetails:false,showCopy:true,editorRows:3,maxHeight:360,previewHeight:300,columns:2,thumbnailSize:32,serviceTimeout:5000,resize:'none',size:'medium',bordered:false}),contentSize:size.value,contentValue:value.value,contentDisabled:false,contentBordered:true}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'content');assert.ok(api,definition.name);assert.equal(root.dataset.gContentDisabled,'false');assert.equal(root.dataset.gContentBordered,'true');assert.ok(root.textContent.length>8);size.value='large';value.value=JSON.stringify({zoom:2});await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'content'),api);assert.equal(api.getState().zoom,2);assert.equal(root.style.getPropertyValue('--g-content-editor-rows'),'3');assert.equal(root.style.getPropertyValue('--g-content-columns'),'2');assert.equal(root.style.getPropertyValue('--g-content-preview-height'),'300px');app.unmount();host.remove();}
});

test('all 11 Vue layouts preserve slots, state and typed booleans',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.behaviors.includes('layout'))){const gap=ref(16),value=ref('{"collapsed":false}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{layoutOptions:JSON.stringify({kind:definition.name,gap:gap.value,paddingInline:12,paddingBlock:4,maxHeight:400,autoRows:80,narrowColumns:2,alignContent:"center",justifyItems:"end",closeOnEscape:false,collapsible:true,focusOnCollapse:false}),layoutValue:value.value,layoutDisabled:false}},{default:()=>h('input',{'aria-label':'Draft',value:'preserved'})}));await nextTick();const root=host.firstElementChild,child=root.firstElementChild,api=library.getInstance(root,'layout');assert.ok(api);assert.equal(root.dataset.gLayoutDisabled,'false');gap.value=24;value.value='{"collapsed":true}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'layout'),api);assert.equal(root.firstElementChild,child);assert.equal(child.value,'preserved');assert.equal(api.getState().collapsed,true);assert.equal(root.style.getPropertyValue("--g-layout-padding-inline"),"12px");assert.equal(root.style.getPropertyValue("--g-layout-narrow-columns"),"2");assert.equal(root.style.getPropertyValue('--g-layout-gap'),'24px');app.unmount();host.remove();}
});

test('all 29 Vue help components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='help')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{helpOptions:JSON.stringify({kind:definition.name,title:'Help content',size:size.value}),helpValue:value.value,helpDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'help');assert.ok(api,definition.name);assert.equal(root.dataset.gHelpDisabled,'false');size.value='small';value.value='{"query":"new"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'help'),api);assert.equal(api.getState().query,'new');assert.equal(root.dataset.gHelpDensity,'small');app.unmount();host.remove();}});

test('all 38 Vue ai components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='ai')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{aiOptions:JSON.stringify({kind:definition.name,title:'AI content',size:size.value}),aiValue:value.value,aiDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'ai');assert.ok(api,definition.name);assert.equal(root.dataset.gAIDisabled,'false');size.value='small';value.value='{"query":"new"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'ai'),api);assert.equal(api.getState().query,'new');assert.equal(root.dataset.gAIDensity,'small');app.unmount();host.remove();}});

test('all 7 Vue media components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='media')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{mediaOptions:JSON.stringify({kind:definition.name,title:'Media content',size:size.value}),mediaValue:value.value,mediaDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'media');assert.ok(api,definition.name);assert.equal(root.dataset.gMediaDisabled,'false');size.value='small';value.value='{"position":75}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'media'),api);assert.equal(api.getState().position,75);assert.equal(root.dataset.gMediaDensity,'small');app.unmount();host.remove();}});

test('all 37 Vue commerce components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='commerce')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{commerceOptions:JSON.stringify({kind:definition.name,title:'Commerce content',size:size.value}),commerceValue:value.value,commerceDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'commerce');assert.ok(api,definition.name);assert.equal(root.dataset.gCommerceDisabled,'false');size.value='small';value.value='{"step":2}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'commerce'),api);assert.equal(api.getState().step,2);assert.equal(root.dataset.gCommerceDensity,'small');app.unmount();host.remove();}});

test('all 33 Vue auth components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='auth')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{authOptions:JSON.stringify({kind:definition.name,title:'Authentication content',size:size.value}),authValue:value.value,authDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'auth');assert.ok(api,definition.name);assert.equal(root.dataset.gAuthDisabled,'false');size.value='small';value.value='{"step":2}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'auth'),api);assert.equal(api.getState().step,2);assert.equal(root.dataset.gAuthDensity,'small');app.unmount();host.remove();}});

test('all 33 Vue mobile components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='mobile')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{mobileOptions:JSON.stringify({kind:definition.name,title:'Mobile content',size:size.value}),mobileValue:value.value,mobileDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'mobile');assert.ok(api,definition.name);assert.equal(root.dataset.gMobileDisabled,'false');size.value='small';value.value='{"query":"updated","email":"updated","coupon":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'mobile'),api);assert.equal(api.getState()[definition.name==="mobile-auth"?"email":definition.name==="mobile-checkout"?"coupon":"query"],"updated");assert.equal(root.dataset.gMobileDensity,'small');app.unmount();host.remove();}});

test('all 6 Vue cms components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='cms')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{cmsOptions:JSON.stringify({kind:definition.name,title:'Cms content',size:size.value}),cmsValue:value.value,cmsDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'cms');assert.ok(api,definition.name);assert.equal(root.dataset.gCmsDisabled,'false');size.value='small';value.value='{"query":"updated","email":"updated","coupon":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'cms'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gCmsDensity,'small');app.unmount();host.remove();}});

test('all 10 Vue marketing components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='marketing')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{marketingOptions:JSON.stringify({kind:definition.name,title:'Marketing content',size:size.value}),marketingValue:value.value,marketingDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'marketing');assert.ok(api,definition.name);assert.equal(root.dataset.gMarketingDisabled,'false');size.value='small';value.value='{"email":"updated","email":"updated","coupon":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'marketing'),api);assert.equal(api.getState().email,"updated");assert.equal(root.dataset.gMarketingDensity,'small');app.unmount();host.remove();}});

test('all 8 Vue enterprise components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='enterprise')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{enterpriseOptions:JSON.stringify({kind:definition.name,title:'Enterprise content',size:size.value}),enterpriseValue:value.value,enterpriseDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'enterprise');assert.ok(api,definition.name);assert.equal(root.dataset.gEnterpriseDisabled,'false');size.value='small';value.value='{"query":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'enterprise'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gEnterpriseDensity,'small');app.unmount();host.remove();}});

test('all 38 Vue desktop components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='desktop')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{desktopOptions:JSON.stringify({kind:definition.name,title:'Desktop content',size:size.value}),desktopValue:value.value,desktopDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'desktop');assert.ok(api,definition.name);assert.equal(root.dataset.gDesktopDisabled,'false');size.value='small';value.value='{"query":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'desktop'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gDesktopDensity,'small');app.unmount();host.remove();}});

test('all 8 Vue workflow components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='workflow')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{workflowOptions:JSON.stringify({kind:definition.name,title:'Workflow content',size:size.value}),workflowValue:value.value,workflowDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'workflow');assert.ok(api,definition.name);assert.equal(root.dataset.gWorkflowDisabled,'false');size.value='small';value.value='{"query":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'workflow'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gWorkflowDensity,'small');app.unmount();host.remove();}});

test('all 8 Vue communication components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='communication')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{communicationOptions:JSON.stringify({kind:definition.name,title:'Communication content',size:size.value}),communicationValue:value.value,communicationDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'communication');assert.ok(api,definition.name);assert.equal(root.dataset.gCommunicationDisabled,'false');size.value='small';value.value='{"query":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'communication'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gCommunicationDensity,'small');app.unmount();host.remove();}});

test('all 8 Vue legal components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='legal')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{legalOptions:JSON.stringify({kind:definition.name,title:'Legal content',size:size.value}),legalValue:value.value,legalDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'legal');assert.ok(api,definition.name);assert.equal(root.dataset.gLegalDisabled,'false');size.value='small';value.value='{"query":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'legal'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gLegalDensity,'small');app.unmount();host.remove();}});

test('all 32 Vue solution components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='solution')){const size=ref('medium'),value=ref('{}');const {app,host}=mount(()=>h(library[definition.exportName],{config:{solutionOptions:JSON.stringify({sections:[{id:'records',title:'Records',type:'cards',items:[{id:'one',title:'One'}]}],title:'Solution content',size:size.value}),solutionValue:value.value,solutionDisabled:false}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'solution');assert.ok(api,definition.name);assert.equal(root.dataset.gSolutionDisabled,'false');size.value='small';value.value='{"query":"updated"}';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'solution'),api);assert.equal(api.getState().query,"updated");app.unmount();host.remove();}});

test('Vue AI release options and timeout use shared runtime',async()=>{const options={kind:'prompt-composer',showHeader:false,showCount:false,composerRows:5,resize:'none',serviceTimeout:10};const {app,host}=mount(()=>h(library.GPromptComposer,{config:{aiOptions:JSON.stringify(options)}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'ai');assert.equal(root.querySelector('.g-ai-count'),null);assert.equal(Number(root.querySelector('textarea').rows),5);api.setOptions({generate:()=>new Promise(()=>{})});assert.equal(await api.generate('test'),false);assert.match(root.textContent,/timed out/);app.unmount();host.remove();});

test('Vue help release options and timeout use shared runtime',async()=>{const options={kind:'help-feedback',mode:'reason',defaultValue:{feedback:'yes'},showHeader:false,maxReasonLength:200,serviceTimeout:10};const {app,host}=mount(()=>h(library.GHelpFeedback,{config:{helpOptions:JSON.stringify(options)}}));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'help');assert.equal(root.querySelector('.g-help-composition > .g-help-heading'),null);assert.equal(Number(root.querySelector('textarea').maxLength),200);api.setOptions({submit:()=>new Promise(()=>{})});assert.equal(await api.submit(),false);assert.match(root.textContent,/timed out/);app.unmount();host.remove();});

const {dataExamples:releaseDataExamples}=await import('../../../scripts/data-examples.mjs');
test('all 55 data components mount with common parameters and managed extensions',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='data'&&!c.behaviors.includes('foundation'))){const holder=document.createElement('div');holder.innerHTML=releaseDataExamples[definition.name];const source=holder.querySelector('[data-demo-component]');const options=JSON.parse(source.getAttribute('data-g-data-options')||'null');const config={dataSize:'small',dataBordered:true,...(options?{dataOptions:JSON.stringify({...options,maxHeight:480,showDescriptions:false})}:{}),...(source.hasAttribute('data-g-grid-options')?{gridOptions:source.getAttribute('data-g-grid-options')}:{})};const {app,host}=mount(()=>h(library[definition.exportName],{as:source.localName,config,innerHTML:source.innerHTML}));await nextTick();const root=host.firstElementChild;assert.equal(root.dataset.gDataSize,'small',definition.name);assert.equal(root.dataset.gDataBordered,'true');if(options){const api=library.getInstance(root,'data-display');assert.ok(api,definition.name);assert.equal(root.style.getPropertyValue('--g-data-max-height'),'480px');assert.equal(typeof api.cancel,'function');api.setOptions({maxHeight:320});assert.equal(root.style.getPropertyValue('--g-data-max-height'),'320px');}app.unmount();host.remove();}});

test('navigation public controller preserves nodes, display options and cancellation across Vue updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='navigation')){const instance=ref(),size=ref('small');const {app,host}=mount(()=>h(library[definition.exportName],{ref:instance,navigation:{...{items:[{id:'a',label:'Overview',icon:'A',badge:3,description:'Details'},{id:'b',label:'Settings'}],total:100,showIcons:false,showBadges:false,bordered:false,popupWidth:420,indent:24,maxHeight:240},size:size.value}}));await nextTick();const root=host.querySelector('[data-nav-component]');assert.equal(root.dataset.navBordered,'false');assert.equal(root.style.getPropertyValue('--g-nav-popup-width'),'420px');assert.equal(root.style.maxHeight,'240px');assert.equal(root.querySelector('.g-nav-ui-icon'),null);const api=instance.value.getInstance('navigation');assert.equal(typeof api.cancel,'function');const node=root.firstElementChild;size.value='large';await nextTick();assert.equal(instance.value.getInstance('navigation'),api);assert.equal(root.firstElementChild,node);assert.ok(root.classList.contains('g-nav-size-large'));app.unmount();host.remove();}});

test('generic Vue component forwards navigation controller cancellation',async()=>{const instance=ref();const {app,host}=mount(()=>h(library.GardenerimComponent,{ref:instance,definition:library.componentByName.get('tabs'),navigation:{items:[{id:'a',label:'A'},{id:'b',label:'B'}],beforeChange:()=>new Promise(()=>{})}}));await nextTick();const api=instance.value.getInstance('navigation');const selection=api.select('b');await Promise.resolve();instance.value.cancel();assert.equal(await selection,false);app.unmount();host.remove();});

test('Vue form layout parameters preserve false values and input nodes',async()=>{const gap=ref(12),help=ref(false);const {app,host}=mount(()=>h(library.GForm,{config:{formLayout:'horizontal',formFieldGap:gap.value,formLabelWidth:120,formHelpVisible:help.value,formColon:false}},()=>h(library.GInput,{value:'draft'})));await nextTick();const root=host.firstElementChild,input=host.querySelector('input');assert.equal(root.dataset.gFormHelpVisible,'false');assert.equal(root.style.getPropertyValue('--g-form-field-gap'),'12px');gap.value=24;help.value=true;await nextTick();await new Promise(r=>setTimeout(r,10));assert.equal(host.querySelector('input'),input);assert.equal(root.style.getPropertyValue('--g-form-field-gap'),'24px');assert.equal(root.dataset.gFormHelpVisible,'true');app.unmount();host.remove();});

test('Vue model writes refresh the counter while preserving its instance',async()=>{const value=ref('abc');const {app,host}=mount(()=>h(library.GCharacterCounter,{config:{characterCount:5}},()=>[h(library.GInput,{modelValue:value.value,'onUpdate:modelValue':v=>value.value=v}),h('output',{'data-g-character-output':''})]));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'character-count');value.value='';await nextTick();assert.equal(host.querySelector('output').textContent,'0 / 5');assert.equal(library.getInstance(root,'character-count'),api);app.unmount();host.remove();});

test('popover model events belong to the Vue root, not nested widgets',async()=>{let value;const {app,host}=mount(()=>h(library.GPopover,{initialize:false,modelEvent:'change','onUpdate:modelValue':v=>value=v},()=>h('button','Child')));await nextTick();const root=host.firstElementChild;root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));assert.equal(value,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));assert.equal(value,'root');app.unmount();host.remove();});

test('tabs model events belong to the Vue root, not nested widgets',async()=>{let value;const {app,host}=mount(()=>h(library.GTabs,{initialize:false,modelEvent:'change','onUpdate:modelValue':v=>value=v},()=>h('button','Child')));await nextTick();const root=host.firstElementChild;root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));assert.equal(value,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));assert.equal(value,'root');app.unmount();host.remove();});

test('all 12 Vue foundation components retain controller across configuration updates',async()=>{const defs=library.componentCatalog.filter(c=>c.behaviors.includes('foundation'));assert.equal(defs.length,12);for(const d of defs){const size=ref('medium');const{app,host}=mount(()=>h(library[d.exportName],{config:{'foundation-options':JSON.stringify({size:size.value})}},()=>h('span',{},'Content')));await nextTick();const root=host.firstElementChild,api=library.getInstance(root,'foundation');assert.ok(api,d.name);size.value='small';await nextTick();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'foundation'),api);assert.equal(root.dataset.foundationSize,'small');app.unmount();host.remove();}});
