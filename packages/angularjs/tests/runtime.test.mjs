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
globalThis.CSS=window.CSS;globalThis.getComputedStyle=window.getComputedStyle.bind(window);globalThis.matchMedia=window.matchMedia.bind(window);

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

test('form config updates disabled and read-only native values through AngularJS',async()=>{const harness=makeHarness('<form g-form gardener-config="{formDisabled:blocked,formReadOnly:readonly}"><input g-input ng-model="name"></form>',['form','input']);harness.scope.blocked=true;harness.scope.$digest();for(let i=0;i<8;i++)await Promise.resolve();assert.ok(harness.element[0].querySelector('input').disabled);harness.scope.blocked=false;harness.scope.readonly=true;harness.scope.$digest();for(let i=0;i<8;i++)await Promise.resolve();assert.equal(harness.element[0].querySelector('input').disabled,false);assert.ok(harness.element[0].querySelector('input').readOnly);harness.destroy();});

test('feedback config reacts to values and controlled dismissal bridges AngularJS ngModel',async()=>{
 const harness=makeHarness('<div><div g-progress-meter gardener-config="{feedbackValue:amount}"><span class="g-progress-bar"></span></div><div g-alert gardener-config="{feedbackControlled:true}" ng-model="reason" gardener-value-event="dismiss" gardener-value-key="reason"><button data-g-feedback-dismiss>Close</button></div></div>',['progress-meter','alert']);harness.scope.amount=35;harness.scope.$digest();for(let i=0;i<6;i++)await Promise.resolve();assert.equal(harness.element[0].querySelector('.g-progress').getAttribute('aria-valuenow'),'35');harness.scope.amount=140;harness.scope.$digest();for(let i=0;i<6;i++)await Promise.resolve();assert.equal(harness.element[0].querySelector('.g-progress').getAttribute('aria-valuenow'),'100');harness.element[0].querySelector('button').click();for(let i=0;i<6;i++)await Promise.resolve();harness.scope.$digest();assert.equal(harness.scope.reason,'button');assert.equal(harness.element[0].querySelector('.g-alert').hidden,false);harness.destroy();
});
test('basic controlled tag bridges ngModel and guards disabled native controls',async()=>{
 const harness=makeHarness('<button g-tag gardener-variant="checkable" gardener-state="{{disabled ? \'disabled\' : \'\'}}" gardener-config="{basicToggle:true,basicControlled:true}" ng-model="selected" ng-attr-aria-pressed="{{selected}}">Tag</button>',['tag']);harness.scope.selected=false;harness.scope.$digest();for(let i=0;i<5;i++)await Promise.resolve();harness.element[0].click();for(let i=0;i<5;i++)await Promise.resolve();harness.scope.$digest();assert.equal(harness.scope.selected,true);harness.scope.disabled=true;harness.scope.$digest();for(let i=0;i<5;i++)await Promise.resolve();assert.ok(harness.element[0].disabled);harness.element[0].click();harness.scope.$digest();assert.equal(harness.scope.selected,true);harness.destroy();
});
test('all 41 AngularJS navigation directives use the shared options contract',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='navigation')){
  const harness=makeHarness(`<${definition.elementName} gardener-navigation="options"></${definition.elementName}>`,[definition.name]);harness.scope.options={items:[{id:'a',label:'Overview'},{id:'b',label:'Settings'}],total:100};harness.scope.$digest();for(let i=0;i<5;i++)await Promise.resolve();
  assert.equal(harness.element[0].querySelector('[data-nav-component]')?.getAttribute('data-nav-component'),definition.name);harness.destroy();
 }
});
test('AngularJS navigation bridges ngModel and options changes',async()=>{
 const harness=makeHarness('<g-tabs gardener-navigation="options" ng-model="selected"></g-tabs>',['tabs']);harness.scope.options={items:[{id:'a',label:'Overview'},{id:'b',label:'Settings'}]};harness.scope.selected='a';harness.scope.$digest();for(let i=0;i<5;i++)await Promise.resolve();harness.element[0].querySelector('[data-nav-key=b]').click();for(let i=0;i<5;i++)await Promise.resolve();harness.scope.$digest();for(let i=0;i<5;i++)await Promise.resolve();assert.equal(harness.scope.selected,'b');harness.scope.options.disabled=true;harness.scope.$digest();for(let i=0;i<5;i++)await Promise.resolve();assert.equal(harness.element[0].querySelector('[data-nav-key=a]').disabled,true);harness.destroy();
});

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
  assert.equal(queue.length, library.componentCatalog.length + 2);
  assert.equal(new Set(queue).size, library.componentCatalog.length + 2);
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

test("component directive applies the complete button type, shape, size, and state contract", () => {
  const harness = makeHarness('<button g-button gardener-variant="primary round mini" gardener-state="success" gardener-config="cfg">Save</button>', ["button"]);
  harness.scope.cfg = { startOpen: true, ignored: false };
  harness.scope.$digest();
  const button = harness.element[0];
  assert.ok(button.classList.contains("g-btn"));
  assert.ok(button.classList.contains("g-btn-primary"));
  assert.ok(button.classList.contains("g-btn-round"));
  assert.ok(button.classList.contains("g-btn-mini"));
  assert.ok(button.classList.contains("is-success"));
  assert.equal(button.getAttribute("data-g-start-open"), "");
  assert.equal(button.type, "button");
  const handle = harness.element.data("$gardenerHandle");
  assert.equal(handle.element, button);
  assert.equal(typeof handle.refresh, "function");
  assert.equal(typeof handle.destroy, "function");
  harness.destroy();
  assert.equal(harness.element.data("$gardenerHandle"), undefined);
});

test("button group directive exposes type, size, shape, layout, split, and semantic states", () => {
  const harness = makeHarness('<div g-button-group gardener-variant="primary small round vertical block split" gardener-state="warning" role="group" aria-label="Pagination"><button g-button>Prev</button><button g-button>Next</button></div>', ["button", "button-group"]);
  const group = harness.element[0];
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
  harness.destroy();
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
  assert.equal(runtime.version, "2.2.0");
  assert.equal(runtime.configure({ locale: "es", refresh: false }).locale, "es");
  assert.equal(runtime.getConfiguration().locale, "es");
  runtime.configure({ locale: "en", refresh: false });
  const target = document.createElement("div");
  theme.apply(target, { theme: "blue", mode: "light" });
  assert.deepEqual(theme.read(target), { theme: "blue", mode: "light" });
  assert.equal(typeof toast.show, "function");
  assert.equal(typeof toast.clear, "function");
  assert.equal(typeof toast.config, "function");
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

test('all six AngularJS overlays update in place and retain explicit false flags',async()=>{
 globalThis.requestAnimationFrame=window.requestAnimationFrame.bind(window);globalThis.cancelAnimationFrame=window.cancelAnimationFrame.bind(window);
 for(const definition of library.componentCatalog.filter(c=>c.category==='overlay')){const floating=['popover','tooltip','popconfirm'].includes(definition.name),type=floating?definition.name==='tooltip'?'tooltip':'popover':definition.name==='drawer'?'drawer':'dialog';const content=floating?'<button data-g-'+type+'-trigger>Open</button><div data-g-'+type+'-content hidden><input></div>':'<section class="g-'+(type==='drawer'?'drawer':'dialog')+'"><input></section>';const harness=makeHarness('<div g-'+definition.name+' gardener-config="{overlayControlled:true,overlayOpen:true,overlayWidth:width,overlayMaxHeight:320,overlayDensity:&quot;compact&quot;,overlayShowClose:false,overlayKeyboard:false}">'+content+'</div>',[definition.name]);const root=harness.element[0],api=library.getInstance(root,type);assert.ok(api,definition.name);assert.equal(root.getAttribute('data-g-overlay-keyboard'),'false');assert.equal(root.getAttribute('data-g-overlay-max-height'),'320');assert.equal(root.getAttribute('data-g-overlay-density'),'compact');assert.equal(root.getAttribute('data-g-overlay-show-close'),'false');root.querySelector('input').value='Edited';harness.scope.width=480;harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,type),api);assert.equal(root.querySelector('input').value,'Edited');assert.equal(api.isOpen(),true);harness.destroy();}
});

test('disclosure parameters preserve AngularJS instances and explicit false attributes',async()=>{const harness=makeHarness('<div g-collapse gardener-config="{disclosureCollapsible:false,disclosureSize:size}"><button class="g-disclosure-trigger" data-g-disclosure-key="a">Details</button><div class="g-disclosure-panel"><input value="draft"></div></div>',['collapse']);await new Promise(r=>setTimeout(r,10));const element=harness.element[0],instance=library.getInstance(element,'accordion');assert.equal(element.getAttribute('data-g-disclosure-collapsible'),'false');assert.deepEqual(instance.value(),['a']);element.querySelector('input').value='edited';harness.scope.size='large';harness.scope.$digest();await new Promise(r=>setTimeout(r,10));assert.equal(library.getInstance(element,'accordion'),instance);assert.equal(element.querySelector('input').value,'edited');harness.destroy();});

test('managed data preserves AngularJS instances and false configuration during digest',async()=>{const harness=makeHarness('<div g-virtual-list gardener-config="{dataOptions:options,dataSize:size,dataValue:keys,dataBordered:true,dataDisabled:false}"></div>',['virtual-list']);harness.scope.options=JSON.stringify({items:[{id:'a',label:'Alpha'}]});harness.scope.keys='[]';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const element=harness.element[0],api=library.getInstance(element,'data-display');assert.ok(api);assert.equal(element.dataset.gDataBordered,'true');assert.equal(element.dataset.gDataDisabled,'false');harness.scope.size='large';harness.scope.keys='["a"]';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(element,'data-display'),api);assert.equal(element.querySelector('[role=option]').getAttribute('aria-selected'),'true');harness.destroy();});
const {dashboardOptions}=await import('../../../scripts/dashboard-examples.mjs');
test('dashboard AngularJS model events ignore changes from nested components',async()=>{const harness=makeHarness('<div g-dashboard-widget gardener-initialize="false" gardener-on-value-change="result=$value"><button>Child</button></div>',['dashboard-widget']);const root=harness.element[0];root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));harness.scope.$digest();assert.equal(harness.scope.result,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));harness.scope.$digest();assert.equal(harness.scope.result,'root');harness.destroy();});
test('all seven AngularJS dashboard directives preserve typed configuration, controlled values and instances',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='dashboard')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{dashboardOptions:options,dashboardSize:size,dashboardValue:value,dashboardDisabled:false,dashboardBordered:true}"><input value="draft"></div>',[definition.name]);harness.scope.options=JSON.stringify({...dashboardOptions[definition.name],maxHeight:480,tableHeight:240,showGrid:false,lineWidth:4,donutWidth:40});harness.scope.value=JSON.stringify({value:82,filters:{},hiddenSeries:[],collapsed:false});harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'dashboard');assert.ok(api,definition.name);assert.equal(root.dataset.gDashboardDisabled,'false');assert.equal(root.dataset.gDashboardBordered,'true');assert.equal(root.style.getPropertyValue('--g-dashboard-max-height'),'480px');assert.equal(typeof api.cancel,'function');assert.ok(root.textContent.length>0);harness.scope.size='large';harness.scope.value=JSON.stringify({value:94,filters:{},hiddenSeries:[],collapsed:true});harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'dashboard'),api);assert.equal(api.getState().value,94);if(definition.name==='dashboard-widget'){assert.ok(root.querySelector('.g-dashboard-body').hidden);assert.equal(root.querySelector('input').value,'draft');}harness.destroy();}
});

const {interactionOptions}=await import('../../../scripts/interaction-examples.mjs');
test('all 35 AngularJS interactions preserve controlled state and controller through digest updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='interaction')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{interactionOptions:options,interactionSize:size,interactionValue:value,interactionDisabled:false,interactionBordered:true}"></div>',[definition.name]);harness.scope.options=JSON.stringify({...interactionOptions[definition.name],showHeader:true,showCount:false,showDescriptions:false,showIcons:false,showAvatars:false,showPresets:false,showReset:false,showResults:false,showSnapshot:false,listHeight:240,maxHeight:480,columns:2,columnWidth:160,splitHeight:240,serviceTimeout:5000,size:'medium',bordered:false});harness.scope.value=JSON.stringify({ratio:50});harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'interaction');assert.ok(api,definition.name);assert.equal(root.dataset.gInteractionDisabled,'false');assert.equal(root.dataset.gInteractionBordered,'true');assert.equal(root.querySelector('.g-interaction-heading').textContent,interactionOptions[definition.name].title);harness.scope.size='large';harness.scope.value=JSON.stringify({ratio:60});harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'interaction'),api);assert.equal(api.getState().ratio,60);assert.equal(root.style.getPropertyValue('--g-interaction-height'),'240px');assert.equal(root.style.getPropertyValue('--g-interaction-columns'),'2');assert.equal(root.style.getPropertyValue('--g-interaction-density-row'),'36px');harness.destroy();}
});

const {contentOptions}=await import('../../../scripts/content-examples.mjs');
test('all 39 AngularJS contents preserve controlled state and controller through digest updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='content')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{contentOptions:options,contentSize:size,contentValue:value,contentDisabled:false,contentBordered:true}"></div>',[definition.name]);harness.scope.options=JSON.stringify({...contentOptions[definition.name],showHeader:true,showToolbar:true,showCount:false,showPagination:true,showMetadata:false,showDescriptions:false,showSort:false,showViewSwitcher:true,showUploadHints:false,showChunkDetails:false,showCopy:true,editorRows:3,maxHeight:360,previewHeight:300,columns:2,thumbnailSize:32,serviceTimeout:5000,resize:'none',size:'medium',bordered:false});harness.scope.value=JSON.stringify({zoom:1});harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'content');assert.ok(api,definition.name);assert.equal(root.dataset.gContentDisabled,'false');assert.equal(root.dataset.gContentBordered,'true');assert.ok(root.textContent.length>8);harness.scope.size='large';harness.scope.value=JSON.stringify({zoom:2});harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'content'),api);assert.equal(api.getState().zoom,2);assert.equal(root.style.getPropertyValue('--g-content-editor-rows'),'3');assert.equal(root.style.getPropertyValue('--g-content-columns'),'2');assert.equal(root.style.getPropertyValue('--g-content-preview-height'),'300px');harness.destroy();}
});

test('all 11 AngularJS layouts retain children and controller through digest updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.behaviors.includes('layout'))){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{layoutOptions:options,layoutValue:value,layoutDisabled:false}"><input aria-label="Draft" value="preserved"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,gap:16});harness.scope.value='{"collapsed":false}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],child=root.firstElementChild,api=library.getInstance(root,'layout');assert.ok(api);assert.equal(root.dataset.gLayoutDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,gap:24,paddingInline:12,paddingBlock:4,maxHeight:400,autoRows:80,narrowColumns:2,alignContent:"center",justifyItems:"end",closeOnEscape:false,collapsible:true,focusOnCollapse:false});harness.scope.value='{"collapsed":true}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'layout'),api);assert.equal(root.firstElementChild,child);assert.equal(child.value,'preserved');assert.equal(api.getState().collapsed,true);assert.equal(root.style.getPropertyValue("--g-layout-padding-inline"),"12px");assert.equal(root.style.getPropertyValue("--g-layout-narrow-columns"),"2");harness.destroy();}
});

test('all 29 AngularJS help components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='help')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{helpOptions:options,helpValue:value,helpDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Help content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'help');assert.ok(api,definition.name);assert.equal(root.dataset.gHelpDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Help content',size:'small'});harness.scope.value='{"query":"new"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'help'),api);assert.equal(api.getState().query,'new');assert.equal(root.dataset.gHelpDensity,'small');harness.destroy();}});

test('all 38 AngularJS ai components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='ai')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{aiOptions:options,aiValue:value,aiDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'AI content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'ai');assert.ok(api,definition.name);assert.equal(root.dataset.gAIDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'AI content',size:'small'});harness.scope.value='{"query":"new"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'ai'),api);assert.equal(api.getState().query,'new');assert.equal(root.dataset.gAIDensity,'small');harness.destroy();}});

test('all 7 AngularJS media components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='media')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{mediaOptions:options,mediaValue:value,mediaDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Media content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'media');assert.ok(api,definition.name);assert.equal(root.dataset.gMediaDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Media content',size:'small'});harness.scope.value='{"position":75}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'media'),api);assert.equal(api.getState().position,75);assert.equal(root.dataset.gMediaDensity,'small');harness.destroy();}});

test('all 37 AngularJS commerce components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='commerce')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{commerceOptions:options,commerceValue:value,commerceDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Commerce content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'commerce');assert.ok(api,definition.name);assert.equal(root.dataset.gCommerceDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Commerce content',size:'small'});harness.scope.value='{"step":2}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'commerce'),api);assert.equal(api.getState().step,2);assert.equal(root.dataset.gCommerceDensity,'small');harness.destroy();}});

test('all 33 AngularJS auth components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='auth')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{authOptions:options,authValue:value,authDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Authentication content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'auth');assert.ok(api,definition.name);assert.equal(root.dataset.gAuthDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Authentication content',size:'small'});harness.scope.value='{"step":2}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'auth'),api);assert.equal(api.getState().step,2);assert.equal(root.dataset.gAuthDensity,'small');harness.destroy();}});

test('all 33 AngularJS mobile components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='mobile')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{mobileOptions:options,mobileValue:value,mobileDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Mobile content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'mobile');assert.ok(api,definition.name);assert.equal(root.dataset.gMobileDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Mobile content',size:'small'});harness.scope.value='{"query":"updated","email":"updated","coupon":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'mobile'),api);assert.equal(api.getState()[definition.name==="mobile-auth"?"email":definition.name==="mobile-checkout"?"coupon":"query"],"updated");assert.equal(root.dataset.gMobileDensity,'small');harness.destroy();}});

test('all 6 AngularJS cms components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='cms')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{cmsOptions:options,cmsValue:value,cmsDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Cms content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'cms');assert.ok(api,definition.name);assert.equal(root.dataset.gCmsDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Cms content',size:'small'});harness.scope.value='{"query":"updated","email":"updated","coupon":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'cms'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gCmsDensity,'small');harness.destroy();}});

test('all 10 AngularJS marketing components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='marketing')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{marketingOptions:options,marketingValue:value,marketingDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Marketing content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'marketing');assert.ok(api,definition.name);assert.equal(root.dataset.gMarketingDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Marketing content',size:'small'});harness.scope.value='{"email":"updated","email":"updated","coupon":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'marketing'),api);assert.equal(api.getState().email,"updated");assert.equal(root.dataset.gMarketingDensity,'small');harness.destroy();}});

test('all 8 AngularJS enterprise components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='enterprise')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{enterpriseOptions:options,enterpriseValue:value,enterpriseDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Enterprise content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'enterprise');assert.ok(api,definition.name);assert.equal(root.dataset.gEnterpriseDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Enterprise content',size:'small'});harness.scope.value='{"query":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'enterprise'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gEnterpriseDensity,'small');harness.destroy();}});

test('all 38 AngularJS desktop components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='desktop')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{desktopOptions:options,desktopValue:value,desktopDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Desktop content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'desktop');assert.ok(api,definition.name);assert.equal(root.dataset.gDesktopDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Desktop content',size:'small'});harness.scope.value='{"query":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'desktop'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gDesktopDensity,'small');harness.destroy();}});

test('all 8 AngularJS workflow components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='workflow')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{workflowOptions:options,workflowValue:value,workflowDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Workflow content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'workflow');assert.ok(api,definition.name);assert.equal(root.dataset.gWorkflowDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Workflow content',size:'small'});harness.scope.value='{"query":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'workflow'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gWorkflowDensity,'small');harness.destroy();}});

test('all 8 AngularJS communication components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='communication')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{communicationOptions:options,communicationValue:value,communicationDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Communication content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'communication');assert.ok(api,definition.name);assert.equal(root.dataset.gCommunicationDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Communication content',size:'small'});harness.scope.value='{"query":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'communication'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gCommunicationDensity,'small');harness.destroy();}});

test('all 8 AngularJS legal components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='legal')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{legalOptions:options,legalValue:value,legalDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({kind:definition.name,title:'Legal content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'legal');assert.ok(api,definition.name);assert.equal(root.dataset.gLegalDisabled,'false');harness.scope.options=JSON.stringify({kind:definition.name,title:'Legal content',size:'small'});harness.scope.value='{"query":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'legal'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gLegalDensity,'small');harness.destroy();}});

test('all 32 AngularJS solution components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='solution')){const harness=makeHarness('<div g-'+definition.name+' gardener-config="{solutionOptions:options,solutionValue:value,solutionDisabled:false}"></div>',[definition.name]);harness.scope.options=JSON.stringify({sections:[{id:'records',title:'Records',type:'cards',items:[{id:'one',title:'One'}]}],title:'Solution content'});harness.scope.value='{}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=harness.element[0],api=library.getInstance(root,'solution');assert.ok(api,definition.name);assert.equal(root.dataset.gSolutionDisabled,'false');harness.scope.options=JSON.stringify({sections:[{id:'records',title:'Records',type:'cards',items:[{id:'one',title:'One'}]}],title:'Solution content',size:'small'});harness.scope.value='{"query":"updated"}';harness.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'solution'),api);assert.equal(api.getState().query,"updated");harness.destroy();}});

test('AngularJS AI release options and timeout use shared runtime',async()=>{const options={kind:'prompt-composer',showHeader:false,showCount:false,composerRows:5,resize:'none',serviceTimeout:10};const harness=makeHarness('<div g-prompt-composer gardener-config="{aiOptions:options}"></div>',['prompt-composer']);harness.scope.options=JSON.stringify(options);harness.scope.$digest();await new Promise(r=>setTimeout(r,20));const root=harness.element[0],api=library.getInstance(root,'ai');assert.equal(root.querySelector('.g-ai-count'),null);assert.equal(Number(root.querySelector('textarea').rows),5);api.setOptions({generate:()=>new Promise(()=>{})});assert.equal(await api.generate('test'),false);assert.match(root.textContent,/timed out/);harness.destroy();});

test('AngularJS help release options and timeout use shared runtime',async()=>{const options={kind:'help-feedback',mode:'reason',defaultValue:{feedback:'yes'},showHeader:false,maxReasonLength:200,serviceTimeout:10};const harness=makeHarness('<div g-help-feedback gardener-config="{helpOptions:options}"></div>',['help-feedback']);harness.scope.options=JSON.stringify(options);harness.scope.$digest();await new Promise(r=>setTimeout(r,20));const root=harness.element[0],api=library.getInstance(root,'help');assert.equal(root.querySelector('.g-help-composition > .g-help-heading'),null);assert.equal(Number(root.querySelector('textarea').maxLength),200);api.setOptions({submit:()=>new Promise(()=>{})});assert.equal(await api.submit(),false);assert.match(root.textContent,/timed out/);harness.destroy();});

const {dataExamples:releaseDataExamples}=await import('../../../scripts/data-examples.mjs');
test('all 55 data directives mount with common parameters and managed extensions',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='data'&&!c.behaviors.includes('foundation'))){const holder=document.createElement('div');holder.innerHTML=releaseDataExamples[definition.name];const source=holder.querySelector('[data-demo-component]');const options=JSON.parse(source.getAttribute('data-g-data-options')||'null');const config={dataSize:'small',dataBordered:true,...(options?{dataOptions:JSON.stringify({...options,maxHeight:480,showDescriptions:false})}:{}),...(source.hasAttribute('data-g-grid-options')?{gridOptions:source.getAttribute('data-g-grid-options')}:{})};const m=makeHarness('<'+source.localName+' g-'+definition.name+' gardener-config="config">'+source.innerHTML+'</'+source.localName+'>',[definition.name]);m.scope.config=config;m.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=m.element[0];assert.equal(root.dataset.gDataSize,'small',definition.name);assert.equal(root.dataset.gDataBordered,'true');if(options){const api=library.getInstance(root,'data-display');assert.ok(api,definition.name);assert.equal(root.style.getPropertyValue('--g-data-max-height'),'480px');assert.equal(typeof api.cancel,'function');api.setOptions({maxHeight:320});assert.equal(root.style.getPropertyValue('--g-data-max-height'),'320px');}m.destroy();}});

test('navigation public controller preserves nodes, display options and cancellation across AngularJS updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='navigation')){const harness=makeHarness('<'+definition.elementName+' gardener-navigation="options"></'+definition.elementName+'>',[definition.name]);harness.scope.options={...{items:[{id:'a',label:'Overview',icon:'A',badge:3,description:'Details'},{id:'b',label:'Settings'}],total:100,showIcons:false,showBadges:false,bordered:false,popupWidth:420,indent:24,maxHeight:240},size:'small'};harness.scope.$digest();for(let i=0;i<8;i++)await Promise.resolve();const host=harness.element[0];const root=host.querySelector('[data-nav-component]');assert.equal(root.dataset.navBordered,'false');assert.equal(root.style.getPropertyValue('--g-nav-popup-width'),'420px');assert.equal(root.style.maxHeight,'240px');assert.equal(root.querySelector('.g-nav-ui-icon'),null);const api=harness.element.data('$gardenerHandle').getInstance('navigation');assert.equal(typeof api.cancel,'function');const node=root.firstElementChild;harness.scope.options.size='large';harness.scope.$digest();for(let i=0;i<8;i++)await Promise.resolve();assert.equal(harness.element.data('$gardenerHandle').getInstance('navigation'),api);assert.equal(root.firstElementChild,node);assert.ok(root.classList.contains('g-nav-size-large'));harness.destroy();}});

test('AngularJS form layout parameters preserve false values and input nodes',async()=>{const harness=makeHarness('<form g-form gardener-config="{formFieldGap:gap,formHelpVisible:visible,formColon:false}"><input g-input value="draft"></form>',['form','input']);harness.scope.gap=12;harness.scope.visible=false;harness.scope.$digest();for(let i=0;i<8;i++)await Promise.resolve();const root=harness.element[0],input=root.querySelector('input');assert.equal(root.dataset.gFormHelpVisible,'false');assert.equal(root.style.getPropertyValue('--g-form-field-gap'),'12px');harness.scope.gap=24;harness.scope.visible=true;harness.scope.$digest();for(let i=0;i<8;i++)await Promise.resolve();assert.equal(root.querySelector('input'),input);assert.equal(root.style.getPropertyValue('--g-form-field-gap'),'24px');assert.equal(root.dataset.gFormHelpVisible,'true');harness.destroy();});

test('AngularJS model writes refresh the counter while preserving its instance',async()=>{const harness=makeHarness('<div g-character-counter gardener-config="{characterCount:5}"><input g-input ng-model="text"><output data-g-character-output></output></div>');harness.scope.text='abc';harness.scope.$digest();const root=harness.element[0],api=library.getInstance(root,'character-count');harness.scope.text='';harness.scope.$digest();assert.equal(root.querySelector('output').textContent,'0 / 5');assert.equal(library.getInstance(root,'character-count'),api);harness.destroy();});

test('popover AngularJS model events ignore changes from nested components',async()=>{const harness=makeHarness('<div g-popover gardener-initialize="false" gardener-on-value-change="result=$value"><button>Child</button></div>',['popover']);const root=harness.element[0];root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));harness.scope.$digest();assert.equal(harness.scope.result,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));harness.scope.$digest();assert.equal(harness.scope.result,'root');harness.destroy();});

test('tabs AngularJS model events ignore changes from nested components',async()=>{const harness=makeHarness('<div g-tabs gardener-initialize="false" gardener-on-value-change="result=$value"><button>Child</button></div>',['tabs']);const root=harness.element[0];root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));harness.scope.$digest();assert.equal(harness.scope.result,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));harness.scope.$digest();assert.equal(harness.scope.result,'root');harness.destroy();});

test('all 12 AngularJS foundation components retain controller across digest updates',async()=>{const defs=library.componentCatalog.filter(c=>c.behaviors.includes('foundation'));assert.equal(defs.length,12);for(const d of defs){const m=makeHarness('<div g-'+d.name+' gardener-config="config"><span>Content</span></div>',[d.name]);m.scope.config={'foundation-options':'{"size":"medium"}'};m.scope.$digest();await new Promise(r=>setTimeout(r,15));const root=m.element[0],api=library.getInstance(root,'foundation');assert.ok(api,d.name);m.scope.config={'foundation-options':'{"size":"small"}'};m.scope.$digest();await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(root,'foundation'),api);assert.equal(root.dataset.foundationSize,'small');m.destroy();}});
