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
const {dashboardOptions}=await import('../../../scripts/dashboard-examples.mjs');
test('dashboard model events belong to the React root, not nested widgets',async()=>{let value;const mounted=await mount(React.createElement(library.GDashboardWidget,{initialize:false,valueEvent:'change',onValueChange:v=>value=v},React.createElement('button',null,'Child')));const root=mounted.host.firstElementChild;root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));assert.equal(value,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));assert.equal(value,'root');await mounted.unmount();});

test('all seven React dashboards render real data and preserve their controller across controlled updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='dashboard')){let update;function Example(){const [value,setValue]=React.useState(82);update=setValue;return React.createElement(library[definition.exportName],{config:{dashboardOptions:JSON.stringify({...dashboardOptions[definition.name],maxHeight:480,tableHeight:240,showGrid:false,lineWidth:4,donutWidth:40}),dashboardSize:value===82?'small':'large',dashboardValue:JSON.stringify({value,filters:{},hiddenSeries:[],collapsed:value===94}),dashboardDisabled:false,dashboardBordered:true}},React.createElement('input',{defaultValue:'draft'}));}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'dashboard');assert.ok(api,definition.name);assert.equal(root.dataset.gDashboardDisabled,'false');assert.equal(root.dataset.gDashboardBordered,'true');assert.equal(root.style.getPropertyValue('--g-dashboard-max-height'),'480px');assert.equal(typeof api.cancel,'function');assert.ok(root.textContent.length>0);await React.act(async()=>{update(94);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'dashboard'),api);assert.equal(api.getState().value,94);if(definition.name==='dashboard-widget'){assert.ok(root.querySelector('.g-dashboard-body').hidden);assert.equal(root.querySelector('input').value,'draft');}await mounted.unmount();}
});
globalThis.CSS=window.CSS;globalThis.matchMedia=window.matchMedia.bind(window);

const mount = async (element) => {
  const host = document.createElement("div");
  document.body.append(host);
  const root = createRoot(host);
  await React.act(async () => { root.render(element); });
  return { root, host, unmount: async () => { await React.act(async () => root.unmount()); host.remove(); } };
};

test('form config updates disabled and read-only native values through React',async()=>{let update;function Example(){const [blocked,setBlocked]=React.useState(true);update=setBlocked;return React.createElement(library.GForm,{config:{formDisabled:blocked,formReadOnly:!blocked}},React.createElement(library.GInput,{value:'Example',name:'name'}));}const instance=await mount(React.createElement(Example));assert.ok(instance.host.querySelector('input').disabled);await React.act(async()=>update(false));assert.equal(instance.host.querySelector('input').disabled,false);assert.ok(instance.host.querySelector('input').readOnly);await instance.unmount();});

test('feedback config reacts to values and controlled dismissal bridges React callbacks',async()=>{
 let update,reason;function Example(){const [value,setValue]=React.useState(35);update=setValue;return React.createElement('div',null,React.createElement(library.GProgressMeter,{config:{feedbackValue:value}},React.createElement('span',{className:'g-progress-bar'})),React.createElement(library.GAlert,{valueEvent:'dismiss',valueKey:'reason',onValueChange:v=>reason=v,config:{feedbackControlled:true}},React.createElement('button',{'data-g-feedback-dismiss':''},'Close')));}
 const instance=await mount(React.createElement(Example));assert.equal(instance.host.querySelector('.g-progress').getAttribute('aria-valuenow'),'35');await React.act(async()=>update(140));assert.equal(instance.host.querySelector('.g-progress').getAttribute('aria-valuenow'),'100');await React.act(async()=>instance.host.querySelector('button').click());assert.equal(reason,'button');assert.equal(instance.host.querySelector('.g-alert').hidden,false);await instance.unmount();
});
test('basic controlled tag bridges value changes and guards disabled native controls',async()=>{
 let disable;function Example(){const [value,setValue]=React.useState(false),[disabled,setDisabled]=React.useState(false);disable=setDisabled;return React.createElement(library.GTag,{as:'button',variant:'checkable',value,onValueChange:setValue,'aria-pressed':value,state:disabled?'disabled':undefined,config:{basicToggle:true,basicControlled:true}},'Tag');}
 const instance=await mount(React.createElement(Example));assert.equal(instance.host.firstElementChild.type,'button');await React.act(async()=>instance.host.firstElementChild.click());assert.equal(instance.host.firstElementChild.getAttribute('aria-pressed'),'true');await React.act(async()=>disable(true));assert.ok(instance.host.firstElementChild.disabled);await React.act(async()=>instance.host.firstElementChild.click());assert.equal(instance.host.firstElementChild.getAttribute('aria-pressed'),'true');await instance.unmount();
});
test('all 41 React navigation exports mount the shared data controller',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='navigation')){
  const instance=await mount(React.createElement(library[definition.exportName],{navigation:{items:[{id:'a',label:'Overview'},{id:'b',label:'Settings'}],total:100}}));
  assert.equal(instance.host.querySelector('[data-nav-component]')?.getAttribute('data-nav-component'),definition.name);await instance.unmount();
 }
});
test('controlled navigation value and options update through React',async()=>{
 let setDisabled;function Example(){const [value,setValue]=React.useState('a'),[disabled,updateDisabled]=React.useState(false);setDisabled=updateDisabled;return React.createElement(library.GTabs,{value,onValueChange:setValue,navigation:{items:[{id:'a',label:'Overview'},{id:'b',label:'Settings'}],disabled}});}
 const instance=await mount(React.createElement(Example));await React.act(async()=>{instance.host.querySelector('[data-nav-key=b]').click();await Promise.resolve();});assert.equal(instance.host.querySelector('[data-nav-key=b]').getAttribute('aria-selected'),'true');
 await React.act(async()=>setDisabled(true));assert.equal(instance.host.querySelector('[data-nav-key=a]').disabled,true);await instance.unmount();
});

test("generated components render the complete button type, shape, size, and state contract", async () => {
  const mounted = await mount(React.createElement(library.GButton, { variant: ["primary", "round", "mini"], state: "success", config: { timeout: 300 } }, "Save"));
  const button = mounted.host.querySelector("button");
  assert.ok(button);
  assert.equal(button.type, "button");
  assert.ok(button.classList.contains("g-btn-primary"));
  assert.ok(button.classList.contains("g-btn-round"));
  assert.ok(button.classList.contains("g-btn-mini"));
  assert.ok(button.classList.contains("is-success"));
  assert.equal(button.dataset.gTimeout, "300");
  await mounted.unmount();
});

test("button groups expose group-level type, size, shape, layout, split, and semantic states", async () => {
  const mounted = await mount(React.createElement(library.GButtonGroup, { variant: ["primary", "small", "round", "vertical", "block", "split"], state: "warning", role: "group", "aria-label": "Pagination" },
    React.createElement(library.GButton, null, "Prev"), React.createElement(library.GButton, null, "Next")));
  const group = mounted.host.firstElementChild;
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

test('all six React overlays preserve instance on config changes and serialize false flags',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='overlay')){const floating=['popover','tooltip','popconfirm'].includes(definition.name),type=floating?definition.name==='tooltip'?'tooltip':'popover':definition.name==='drawer'?'drawer':'dialog';let update;function Demo(){const [width,setWidth]=React.useState(300);update=setWidth;return React.createElement(library[definition.exportName],{config:{overlayControlled:true,overlayOpen:true,overlayWidth:width,overlayMaxHeight:320,overlayDensity:"compact",overlayShowClose:false,overlayKeyboard:false}},...(floating?[React.createElement('button',{key:'trigger',['data-g-'+type+'-trigger']:''},'Open'),React.createElement('div',{key:'panel',['data-g-'+type+'-content']:'',hidden:true},React.createElement('input'))]:[React.createElement('section',{key:'panel',className:type==='drawer'?'g-drawer':'g-dialog'},React.createElement('input'))]));}const instance=await mount(React.createElement(Demo));const root=instance.host.firstElementChild,api=library.getInstance(root,type);assert.ok(api,definition.name);assert.equal(root.getAttribute('data-g-overlay-keyboard'),'false');assert.equal(root.getAttribute('data-g-overlay-max-height'),'320');assert.equal(root.getAttribute('data-g-overlay-density'),'compact');assert.equal(root.getAttribute('data-g-overlay-show-close'),'false');assert.equal(api.isOpen(),true);root.querySelector('input').value='Edited';await React.act(async()=>update(480));assert.equal(library.getInstance(root,type),api);assert.equal(root.querySelector('input').value,'Edited');await instance.unmount();}
});

test('disclosure parameters preserve React state and explicit false attributes',async()=>{const content=[React.createElement('button',{key:'t',className:'g-disclosure-trigger','data-g-disclosure-key':'a'},'Details'),React.createElement('div',{key:'p',className:'g-disclosure-panel'},React.createElement('input',{defaultValue:'draft'}))];const make=size=>React.createElement(library.GCollapse,{config:{disclosureCollapsible:false,disclosureSize:size}},content);const {root,host,unmount}=await mount(make('small'));const element=host.firstElementChild,instance=library.getInstance(element,'accordion');assert.equal(element.getAttribute('data-g-disclosure-collapsible'),'false');assert.deepEqual(instance.value(),['a']);host.querySelector('input').value='edited';await React.act(async()=>root.render(make('large')));await new Promise(r=>setTimeout(r,10));assert.equal(library.getInstance(element,'accordion'),instance);assert.equal(host.querySelector('input').value,'edited');await unmount();});

test('managed data preserves React instances and controlled keys across config changes',async()=>{const make=(size,keys)=>React.createElement(library.GVirtualList,{config:{dataOptions:JSON.stringify({items:[{id:'a',label:'Alpha'}]}),dataSize:size,dataValue:keys,dataBordered:true,dataDisabled:false}});const {root,host,unmount}=await mount(make('small','[]'));const element=host.firstElementChild,api=library.getInstance(element,'data-display');assert.ok(api);assert.equal(element.dataset.gDataBordered,'true');assert.equal(element.dataset.gDataDisabled,'false');await React.act(async()=>root.render(make('large','["a"]')));await new Promise(r=>setTimeout(r,15));assert.equal(library.getInstance(element,'data-display'),api);assert.equal(element.querySelector('[role=option]').getAttribute('aria-selected'),'true');await unmount();});

const {interactionOptions}=await import('../../../scripts/interaction-examples.mjs');
test('all 35 React interactions retain the controller and typed attributes across controlled updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='interaction')){let update;function Example(){const [ratio,setRatio]=React.useState(50);update=setRatio;return React.createElement(library[definition.exportName],{config:{interactionOptions:JSON.stringify({...interactionOptions[definition.name],showHeader:true,showCount:false,showDescriptions:false,showIcons:false,showAvatars:false,showPresets:false,showReset:false,showResults:false,showSnapshot:false,listHeight:240,maxHeight:480,columns:2,columnWidth:160,splitHeight:240,serviceTimeout:5000,size:'medium',bordered:false}),interactionSize:ratio===50?'small':'large',interactionValue:JSON.stringify({ratio}),interactionDisabled:false,interactionBordered:true}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'interaction');assert.ok(api,definition.name);assert.equal(root.dataset.gInteractionDisabled,'false');assert.equal(root.dataset.gInteractionBordered,'true');assert.equal(root.querySelector('.g-interaction-heading').textContent,interactionOptions[definition.name].title);await React.act(async()=>{update(60);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'interaction'),api);assert.equal(api.getState().ratio,60);assert.equal(root.style.getPropertyValue('--g-interaction-height'),'240px');assert.equal(root.style.getPropertyValue('--g-interaction-columns'),'2');assert.equal(root.style.getPropertyValue('--g-interaction-density-row'),'36px');await mounted.unmount();}
});

const {contentOptions}=await import('../../../scripts/content-examples.mjs');
test('all 39 React contents retain the controller and typed attributes across controlled updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.category==='content')){let update;function Example(){const [zoom,setRatio]=React.useState(1);update=setRatio;return React.createElement(library[definition.exportName],{config:{contentOptions:JSON.stringify({...contentOptions[definition.name],showHeader:true,showToolbar:true,showCount:false,showPagination:true,showMetadata:false,showDescriptions:false,showSort:false,showViewSwitcher:true,showUploadHints:false,showChunkDetails:false,showCopy:true,editorRows:3,maxHeight:360,previewHeight:300,columns:2,thumbnailSize:32,serviceTimeout:5000,resize:'none',size:'medium',bordered:false}),contentSize:zoom===1?'small':'large',contentValue:JSON.stringify({zoom}),contentDisabled:false,contentBordered:true}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'content');assert.ok(api,definition.name);assert.equal(root.dataset.gContentDisabled,'false');assert.equal(root.dataset.gContentBordered,'true');assert.ok(root.textContent.length>8);await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'content'),api);assert.equal(api.getState().zoom,2);assert.equal(root.style.getPropertyValue('--g-content-editor-rows'),'3');assert.equal(root.style.getPropertyValue('--g-content-columns'),'2');assert.equal(root.style.getPropertyValue('--g-content-preview-height'),'300px');await mounted.unmount();}
});

test('all 11 React layouts retain children and controller through updates',async()=>{
 for(const definition of library.componentCatalog.filter(c=>c.behaviors.includes('layout'))){let update;function Example(){const [collapsed,set]=React.useState(false);update=set;return React.createElement(library[definition.exportName],{config:{layoutOptions:JSON.stringify({kind:definition.name,gap:collapsed?24:16,paddingInline:12,paddingBlock:4,maxHeight:400,autoRows:80,narrowColumns:2,alignContent:"center",justifyItems:"end",closeOnEscape:false,collapsible:true,focusOnCollapse:false}),layoutValue:JSON.stringify({collapsed}),layoutDisabled:false}},React.createElement('input',{'aria-label':'Draft',defaultValue:'preserved'}));}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,child=root.firstElementChild,api=library.getInstance(root,'layout');assert.ok(api);assert.equal(root.dataset.gLayoutDisabled,'false');await React.act(async()=>{update(true);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'layout'),api);assert.equal(root.firstElementChild,child);assert.equal(child.value,'preserved');assert.equal(api.getState().collapsed,true);assert.equal(root.style.getPropertyValue("--g-layout-padding-inline"),"12px");assert.equal(root.style.getPropertyValue("--g-layout-narrow-columns"),"2");await mounted.unmount();}
});

test('all 29 React help components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='help')){let update;function Example(){const [query,set]=React.useState('');update=set;return React.createElement(library[definition.exportName],{config:{helpOptions:JSON.stringify({kind:definition.name,title:'Help content',size:query?'small':'medium'}),helpValue:JSON.stringify({query}),helpDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'help');assert.ok(api,definition.name);assert.equal(root.dataset.gHelpDisabled,'false');await React.act(async()=>{update('new');await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'help'),api);assert.equal(api.getState().query,'new');assert.equal(root.dataset.gHelpDensity,'small');await mounted.unmount();}});

test('all 38 React ai components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='ai')){let update;function Example(){const [query,set]=React.useState('');update=set;return React.createElement(library[definition.exportName],{config:{aiOptions:JSON.stringify({kind:definition.name,title:'AI content',size:query?'small':'medium'}),aiValue:JSON.stringify({query}),aiDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'ai');assert.ok(api,definition.name);assert.equal(root.dataset.gAIDisabled,'false');await React.act(async()=>{update('new');await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'ai'),api);assert.equal(api.getState().query,'new');assert.equal(root.dataset.gAIDensity,'small');await mounted.unmount();}});

test('all 7 React media components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='media')){let update;function Example(){const [position,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{mediaOptions:JSON.stringify({kind:definition.name,title:'Media content',size:position?'small':'medium'}),mediaValue:JSON.stringify({position}),mediaDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'media');assert.ok(api,definition.name);assert.equal(root.dataset.gMediaDisabled,'false');await React.act(async()=>{update(75);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'media'),api);assert.equal(api.getState().position,75);assert.equal(root.dataset.gMediaDensity,'small');await mounted.unmount();}});

test('all 37 React commerce components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='commerce')){let update;function Example(){const [step,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{commerceOptions:JSON.stringify({kind:definition.name,title:'Commerce content',size:step?'small':'medium'}),commerceValue:JSON.stringify({step}),commerceDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'commerce');assert.ok(api,definition.name);assert.equal(root.dataset.gCommerceDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'commerce'),api);assert.equal(api.getState().step,2);assert.equal(root.dataset.gCommerceDensity,'small');await mounted.unmount();}});

test('all 33 React auth components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='auth')){let update;function Example(){const [step,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{authOptions:JSON.stringify({kind:definition.name,title:'Authentication content',size:step?'small':'medium'}),authValue:JSON.stringify({step}),authDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'auth');assert.ok(api,definition.name);assert.equal(root.dataset.gAuthDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'auth'),api);assert.equal(api.getState().step,2);assert.equal(root.dataset.gAuthDensity,'small');await mounted.unmount();}});

test('all 33 React mobile components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='mobile')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{mobileOptions:JSON.stringify({kind:definition.name,title:'Mobile content',size:index?'small':'medium'}),mobileValue:JSON.stringify({query:index?"updated":"",email:index?"updated":"",coupon:index?"updated":""}),mobileDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'mobile');assert.ok(api,definition.name);assert.equal(root.dataset.gMobileDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'mobile'),api);assert.equal(api.getState()[definition.name==="mobile-auth"?"email":definition.name==="mobile-checkout"?"coupon":"query"],"updated");assert.equal(root.dataset.gMobileDensity,'small');await mounted.unmount();}});

test('all 6 React cms components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='cms')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{cmsOptions:JSON.stringify({kind:definition.name,title:'Cms content',size:index?'small':'medium'}),cmsValue:JSON.stringify({query:index?"updated":"",email:index?"updated":"",coupon:index?"updated":""}),cmsDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'cms');assert.ok(api,definition.name);assert.equal(root.dataset.gCmsDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'cms'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gCmsDensity,'small');await mounted.unmount();}});

test('all 10 React marketing components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='marketing')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{marketingOptions:JSON.stringify({kind:definition.name,title:'Marketing content',size:index?'small':'medium'}),marketingValue:JSON.stringify({email:index?"updated":"",email:index?"updated":"",coupon:index?"updated":""}),marketingDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'marketing');assert.ok(api,definition.name);assert.equal(root.dataset.gMarketingDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'marketing'),api);assert.equal(api.getState().email,"updated");assert.equal(root.dataset.gMarketingDensity,'small');await mounted.unmount();}});

test('all 8 React enterprise components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='enterprise')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{enterpriseOptions:JSON.stringify({kind:definition.name,title:'Enterprise content',size:index?'small':'medium'}),enterpriseValue:JSON.stringify({query:index?"updated":""}),enterpriseDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'enterprise');assert.ok(api,definition.name);assert.equal(root.dataset.gEnterpriseDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'enterprise'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gEnterpriseDensity,'small');await mounted.unmount();}});

test('all 38 React desktop components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='desktop')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{desktopOptions:JSON.stringify({kind:definition.name,title:'Desktop content',size:index?'small':'medium'}),desktopValue:JSON.stringify({query:index?"updated":""}),desktopDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'desktop');assert.ok(api,definition.name);assert.equal(root.dataset.gDesktopDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'desktop'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gDesktopDensity,'small');await mounted.unmount();}});

test('all 8 React workflow components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='workflow')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{workflowOptions:JSON.stringify({kind:definition.name,title:'Workflow content',size:index?'small':'medium'}),workflowValue:JSON.stringify({query:index?"updated":""}),workflowDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'workflow');assert.ok(api,definition.name);assert.equal(root.dataset.gWorkflowDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'workflow'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gWorkflowDensity,'small');await mounted.unmount();}});

test('all 8 React communication components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='communication')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{communicationOptions:JSON.stringify({kind:definition.name,title:'Communication content',size:index?'small':'medium'}),communicationValue:JSON.stringify({query:index?"updated":""}),communicationDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'communication');assert.ok(api,definition.name);assert.equal(root.dataset.gCommunicationDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'communication'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gCommunicationDensity,'small');await mounted.unmount();}});

test('all 8 React legal components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='legal')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{legalOptions:JSON.stringify({kind:definition.name,title:'Legal content',size:index?'small':'medium'}),legalValue:JSON.stringify({query:index?"updated":""}),legalDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'legal');assert.ok(api,definition.name);assert.equal(root.dataset.gLegalDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'legal'),api);assert.equal(api.getState().query,"updated");assert.equal(root.dataset.gLegalDensity,'small');await mounted.unmount();}});

test('all 32 React solution components retain controller and support controlled updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='solution')){let update;function Example(){const [index,set]=React.useState(0);update=set;return React.createElement(library[definition.exportName],{config:{solutionOptions:JSON.stringify({sections:[{id:'records',title:'Records',type:'cards',items:[{id:'one',title:'One'}]}],title:'Solution content',size:index?'small':'medium'}),solutionValue:JSON.stringify({query:index?"updated":""}),solutionDisabled:false}});}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'solution');assert.ok(api,definition.name);assert.equal(root.dataset.gSolutionDisabled,'false');await React.act(async()=>{update(2);await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'solution'),api);assert.equal(api.getState().query,"updated");await mounted.unmount();}});

test('React AI release options and timeout use shared runtime',async()=>{const options={kind:'prompt-composer',showHeader:false,showCount:false,composerRows:5,resize:'none',serviceTimeout:10};const mounted=await mount(React.createElement(library.GPromptComposer,{config:{aiOptions:JSON.stringify(options)}}));const root=mounted.host.firstElementChild,api=library.getInstance(root,'ai');assert.equal(root.querySelector('.g-ai-count'),null);assert.equal(Number(root.querySelector('textarea').rows),5);api.setOptions({generate:()=>new Promise(()=>{})});assert.equal(await api.generate('test'),false);assert.match(root.textContent,/timed out/);await mounted.unmount();});

test('React help release options and timeout use shared runtime',async()=>{const options={kind:'help-feedback',mode:'reason',defaultValue:{feedback:'yes'},showHeader:false,maxReasonLength:200,serviceTimeout:10};const mounted=await mount(React.createElement(library.GHelpFeedback,{config:{helpOptions:JSON.stringify(options)}}));const root=mounted.host.firstElementChild,api=library.getInstance(root,'help');assert.equal(root.querySelector('.g-help-composition > .g-help-heading'),null);assert.equal(Number(root.querySelector('textarea').maxLength),200);api.setOptions({submit:()=>new Promise(()=>{})});assert.equal(await api.submit(),false);assert.match(root.textContent,/timed out/);await mounted.unmount();});

const {dataExamples:releaseDataExamples}=await import('../../../scripts/data-examples.mjs');
test('all 55 data components mount with common parameters and managed extensions',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='data'&&!c.behaviors.includes('foundation'))){const holder=document.createElement('div');holder.innerHTML=releaseDataExamples[definition.name];const source=holder.querySelector('[data-demo-component]');const options=JSON.parse(source.getAttribute('data-g-data-options')||'null');const config={dataSize:'small',dataBordered:true,...(options?{dataOptions:JSON.stringify({...options,maxHeight:480,showDescriptions:false})}:{}),...(source.hasAttribute('data-g-grid-options')?{gridOptions:source.getAttribute('data-g-grid-options')}:{})};const m=await mount(React.createElement(library[definition.exportName],{as:source.localName,config,dangerouslySetInnerHTML:{__html:source.innerHTML}}));const root=m.host.firstElementChild;assert.equal(root.dataset.gDataSize,'small',definition.name);assert.equal(root.dataset.gDataBordered,'true');if(options){const api=library.getInstance(root,'data-display');assert.ok(api,definition.name);assert.equal(root.style.getPropertyValue('--g-data-max-height'),'480px');assert.equal(typeof api.cancel,'function');api.setOptions({maxHeight:320});assert.equal(root.style.getPropertyValue('--g-data-max-height'),'320px');}await m.unmount();}});

test('navigation public controller preserves nodes, display options and cancellation across React updates',async()=>{for(const definition of library.componentCatalog.filter(c=>c.category==='navigation')){const ref=React.createRef();let update;function Example(){const [size,setSize]=React.useState('small');update=setSize;return React.createElement(library[definition.exportName],{ref,navigation:{...{items:[{id:'a',label:'Overview',icon:'A',badge:3,description:'Details'},{id:'b',label:'Settings'}],total:100,showIcons:false,showBadges:false,bordered:false,popupWidth:420,indent:24,maxHeight:240},size}});}const mounted=await mount(React.createElement(Example));const host=mounted.host;const root=host.querySelector('[data-nav-component]');assert.equal(root.dataset.navBordered,'false');assert.equal(root.style.getPropertyValue('--g-nav-popup-width'),'420px');assert.equal(root.style.maxHeight,'240px');assert.equal(root.querySelector('.g-nav-ui-icon'),null);const api=ref.current.getInstance('navigation');assert.equal(typeof api.cancel,'function');const node=root.firstElementChild;await React.act(async()=>update('large'));assert.equal(ref.current.getInstance('navigation'),api);assert.equal(root.firstElementChild,node);assert.ok(root.classList.contains('g-nav-size-large'));await mounted.unmount();}});

test('React form layout parameters preserve false values and input nodes',async()=>{let update;function Example(){const [gap,set]=React.useState(12);update=set;return React.createElement(library.GForm,{config:{formLayout:'horizontal',formFieldGap:gap,formLabelWidth:120,formHelpVisible:gap!==12,formColon:false}},React.createElement(library.GInput,{defaultValue:'draft'}));}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,input=root.querySelector('input');assert.equal(root.dataset.gFormHelpVisible,'false');assert.equal(root.style.getPropertyValue('--g-form-field-gap'),'12px');await React.act(async()=>{update(24);await new Promise(r=>setTimeout(r,10));});assert.equal(root.querySelector('input'),input);assert.equal(root.style.getPropertyValue('--g-form-field-gap'),'24px');assert.equal(root.dataset.gFormHelpVisible,'true');await mounted.unmount();});

test('React model writes refresh the counter while preserving its instance',async()=>{let setValue;function Example(){const [value,set]=React.useState('abc');setValue=set;return React.createElement(library.GCharacterCounter,{config:{characterCount:5}},React.createElement(library.GInput,{value,onValueChange:set}),React.createElement('output',{'data-g-character-output':''}));}const mounted=await mount(React.createElement(Example));const root=mounted.host.firstElementChild,api=library.getInstance(root,'character-count');await React.act(async()=>{setValue('');});assert.equal(root.querySelector('output').textContent,'0 / 5');assert.equal(library.getInstance(root,'character-count'),api);await mounted.unmount();});

test('popover model events belong to the React root, not nested widgets',async()=>{let value;const mounted=await mount(React.createElement(library.GPopover,{initialize:false,valueEvent:'change',onValueChange:v=>value=v},React.createElement('button',null,'Child')));const root=mounted.host.firstElementChild;root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));assert.equal(value,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));assert.equal(value,'root');await mounted.unmount();});

test('tabs model events belong to the React root, not nested widgets',async()=>{let value;const mounted=await mount(React.createElement(library.GTabs,{initialize:false,valueEvent:'change',onValueChange:v=>value=v},React.createElement('button',null,'Child')));const root=mounted.host.firstElementChild;root.querySelector('button').dispatchEvent(new window.CustomEvent('gardener:change',{bubbles:true,detail:{value:'child'}}));assert.equal(value,undefined);root.dispatchEvent(new window.CustomEvent('gardener:change',{detail:{value:'root'}}));assert.equal(value,'root');await mounted.unmount();});

test('all 12 React foundation components retain controller across configuration updates',async()=>{const defs=library.componentCatalog.filter(c=>c.behaviors.includes('foundation'));assert.equal(defs.length,12);for(const d of defs){let update;function Example(){const[size,set]=React.useState('medium');update=set;return React.createElement(library[d.exportName],{config:{'foundation-options':JSON.stringify({size})}},React.createElement('span',{},'Content'));}const m=await mount(React.createElement(Example)),root=m.host.firstElementChild,api=library.getInstance(root,'foundation');assert.ok(api,d.name);await React.act(async()=>{update('small');await new Promise(r=>setTimeout(r,15));});assert.equal(library.getInstance(root,'foundation'),api);assert.equal(root.dataset.foundationSize,'small');await m.unmount();}});
