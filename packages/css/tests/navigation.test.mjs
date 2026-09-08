import test from 'node:test';
import assert from 'node:assert/strict';
import { Window } from '../node_modules/happy-dom/lib/index.js';
import { createNavigation } from '../src/js/navigation.js';
import { navigationDefinitions } from '../src/js/navigation-catalog.js';
const win=new Window({url:'http://localhost/'});
for(const key of ['document','HTMLElement','Element','CustomEvent','Event','KeyboardEvent','PointerEvent','CSS'])globalThis[key]=win[key];
globalThis.window=win;globalThis.getComputedStyle=win.getComputedStyle.bind(win);globalThis.matchMedia=win.matchMedia.bind(win);
const tick=async()=>{for(let i=0;i<5;i++)await Promise.resolve();};
const items=[{id:'one',label:'Overview',content:'Overview panel'},{id:'disabled',label:'Disabled',disabled:true},{id:'two',label:'Settings',content:'Settings panel'}];
function mount(component,options={}){const host=document.createElement('div');document.body.append(host);const instance=createNavigation(host,{component,items,...options});return {host,instance,cleanup:()=>{instance.destroy();host.remove();}};}
test('all 41 navigation contracts render populated structures and update without leaking nodes',async()=>{
 assert.equal(Object.keys(navigationDefinitions).length,41);
 for(const name of Object.keys(navigationDefinitions)){
  const {host,instance,cleanup}=mount(name,{title:'Navigation',total:120});
  assert.ok(host.querySelector('[data-nav-component]'),name);
  instance.update({size:'large',disabled:true});await tick();assert.ok(host.querySelector('.g-nav-size-large.is-disabled'),name);
  cleanup();assert.equal(host.childNodes.length,0);
 }
});
test('tabs support manual/automatic activation, skip disabled tabs, and controlled updates',async()=>{
 const {host,instance,cleanup}=mount('tabs',{activation:'manual'});const tabs=()=>host.querySelectorAll('[role=tab]');
 tabs()[0].focus();tabs()[0].dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await tick();
 assert.equal(document.activeElement.dataset.navKey,'two');assert.equal(tabs()[0].getAttribute('aria-selected'),'true');
 tabs()[2].click();await tick();assert.equal(tabs()[2].getAttribute('aria-selected'),'true');
 instance.update({value:'one'});await tick();tabs()[2].click();await tick();assert.equal(tabs()[0].getAttribute('aria-selected'),'true');cleanup();
});
test('async selection guards block state and handle rejection',async()=>{
 let complete;const {host,instance,cleanup}=mount('stepper',{beforeChange:()=>new Promise(resolve=>complete=resolve)});
 const pending=instance.select('two');await tick();assert.ok(host.querySelector('[aria-busy=true]'));complete(false);await pending;await tick();assert.equal(host.querySelector('[aria-current=step]').dataset.navKey,'one');
 instance.update({beforeChange:()=>true});await instance.select('two');await tick();assert.equal(host.querySelector('[aria-current=step]').dataset.navKey,'two');cleanup();
});
test('menus restore trigger focus and search without losing focus',async()=>{
 const {host,instance,cleanup}=mount('menu-dropdown',{searchable:true});host.querySelector('[aria-haspopup]').click();await tick();assert.ok(host.querySelector('[role=menu]'));
 const search=host.querySelector('input');search.focus();search.value='Settings';search.dispatchEvent(new Event('input',{bubbles:true}));await tick();assert.equal(document.activeElement.type,'search');assert.equal(host.querySelectorAll('[role=menuitem]').length,1);
 host.querySelector('[role=menuitem]').click();await tick();assert.equal(host.querySelector('[role=menu]'),null);assert.equal(document.activeElement.getAttribute('aria-haspopup'),'menu');cleanup();
});
test('tree expansion and keyboard traversal preserve hierarchy',async()=>{
 const {host,cleanup}=mount('tree-navigation',{items:[{id:'root',label:'Root',children:[{id:'child',label:'Child'}]}]});let root=host.querySelector('[role=treeitem]');root.focus();root.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await tick();assert.equal(host.querySelectorAll('[role=treeitem]').length,2);
 root=host.querySelector('[role=treeitem]');root.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await tick();assert.equal(document.activeElement.dataset.navKey,'child');cleanup();
});
test('pagination clamps huge values and does not create an unbounded page list',async()=>{
 const {host,instance,cleanup}=mount('pagination',{value:999999,total:123,pageSize:10,showJumper:true});assert.ok(host.textContent.includes('第 13 页'));assert.ok(host.querySelectorAll('button').length<12);instance.update({total:0});await tick();assert.ok(host.textContent.includes('第 1 页'));cleanup();
});
test('labels are text, never executable HTML',()=>{const {host,cleanup}=mount('primary-navigation',{items:[{id:'x',label:'<img src=x onerror=alert(1)>'}]});assert.equal(host.querySelector('img'),null);cleanup();});
test('segmented controls use radio semantics and omit panel references',async()=>{
 const {host,cleanup}=mount('segmented-control');assert.ok(host.querySelector('[role=radiogroup]'));assert.equal(host.querySelector('[aria-controls]'),null);host.querySelector('[data-nav-key=two]').click();await tick();assert.equal(host.querySelector('[data-nav-key=two]').getAttribute('aria-checked'),'true');cleanup();
});
test('a searchable tree preserves matching descendants and keyboard access',async()=>{
 const {host,cleanup}=mount('tree-navigation',{searchable:true,items:[{id:'root',label:'Root',children:[{id:'child',label:'Needle'},{id:'hidden',label:'Needle hidden',hidden:true}]}]});
 const input=host.querySelector('input');input.value='Needle';input.dispatchEvent(new Event('input'));await tick();assert.equal(host.querySelectorAll('[role=treeitem]').length,2);const root=host.querySelector('[role=treeitem]');root.focus();root.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));await tick();assert.equal(document.activeElement.dataset.navKey,'child');cleanup();
});
test('menu bars open on click, expose one tab stop and switch menus with arrows',async()=>{
 const {host,cleanup}=mount('menu-bar',{items:[{id:'file',label:'File',children:[{id:'new',label:'New'}]},{id:'edit',label:'Edit',children:[{id:'copy',label:'Copy'}]}]});
 host.querySelector('[role=menubar] button').click();await tick();assert.ok(host.querySelector('[data-nav-popup]'));assert.equal(host.querySelectorAll('[role=menubar] [tabindex="0"]').length,1);
 host.querySelector('[data-nav-key=file]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));await tick();assert.ok(host.querySelector('[data-nav-key=copy]'));cleanup();
});
test('search preserves its DOM node and selection during visual updates',async()=>{
 const {host,instance,cleanup}=mount('sidebar',{searchable:true});const input=host.querySelector('input');input.focus();input.value='Settings';input.dispatchEvent(new Event('input'));await tick();assert.equal(host.querySelector('input'),input);input.setSelectionRange(1,4);instance.update({size:'small'});await tick();assert.equal(host.querySelector('input'),input);assert.equal(input.selectionStart,1);assert.equal(input.selectionEnd,4);input.value='Overview';input.dispatchEvent(new Event('input'));await tick();assert.ok(host.querySelector('[data-nav-key=one]'));cleanup();
});
test('Chinese composition survives configuration changes and filters only after compositionend',async()=>{
 const {host,instance,cleanup}=mount('sidebar',{searchable:true,items:[{id:'one',label:'导航'},{id:'two',label:'设置'}]});const input=host.querySelector('input');input.focus();input.dispatchEvent(new Event('compositionstart'));input.value='导';input.dispatchEvent(new Event('input'));instance.update({size:'large'});await tick();assert.equal(host.querySelector('input'),input);assert.equal(host.querySelectorAll('[data-nav-choice]').length,2);input.value='导航';input.dispatchEvent(new Event('compositionend'));await tick();assert.equal(host.querySelectorAll('[data-nav-choice]').length,1);assert.equal(host.querySelector('input'),input);cleanup();
});
test('invalid configuration is rejected atomically, including URLs, duplicate ids and numeric bounds',async()=>{
 const {host,instance,cleanup}=mount('tabs');for(const value of [{size:'huge'},{total:Infinity},{popupWidth:-1},{disabled:'false'},{items:[{id:'one',label:'A'},{id:'one',label:'B'}]},{items:[{id:'one',label:'A',href:'javascript:alert(1)'}]}]){assert.throws(()=>instance.update(value));await tick();assert.equal(host.querySelectorAll('[role=tab]').length,3);}cleanup();
});
test('caller item mutations cannot change validated navigation data',async()=>{
 const source=[{id:'root',label:'Root',children:[{id:'child',label:'Child'}]}],{host,instance,cleanup}=mount('tree-navigation',{items:source,defaultExpandedKeys:['root']});source[0].children[0].label='Mutated';instance.update({size:'small'});await tick();assert.equal(host.querySelector('[data-nav-key=child]').textContent,'Child');cleanup();
});
test('cancel settles an uncooperative selection guard and ignores late completion',async()=>{
 let resolve;const {host,instance,cleanup}=mount('tabs',{beforeChange:()=>new Promise(r=>resolve=r),selectionTimeout:0});const result=instance.select('two');await tick();instance.cancel();assert.equal(await result,false);resolve(true);await tick();assert.equal(host.querySelector('[aria-selected=true]').dataset.navKey,'one');assert.equal(host.querySelector('[aria-busy=true]'),null);cleanup();
});
test('selection timeout reports an error and restores usable controls',async()=>{
 const {host,instance,cleanup}=mount('tabs',{selectionTimeout:5,beforeChange:()=>new Promise(()=>{})});let errors=0;host.addEventListener('gardener:navigationerror',()=>errors++);assert.equal(await instance.select('two'),false);await tick();assert.equal(errors,1);assert.equal(host.querySelector('[data-nav-key=two]').disabled,false);cleanup();
});
test('destroy settles pending guards and never emits a late selection',async()=>{
 let resolve;const {host,instance,cleanup}=mount('tabs',{beforeChange:()=>new Promise(r=>resolve=r)});let changes=0;host.addEventListener('gardener:navigationchange',()=>changes++);const result=instance.select('two');await tick();instance.destroy();assert.equal(await result,false);resolve(true);await tick();assert.equal(changes,0);assert.equal(host.childNodes.length,0);cleanup();
});
test('visual updates preserve guards, while replacing items invalidates them',async()=>{
 let resolve;const {host,instance,cleanup}=mount('tabs',{beforeChange:()=>new Promise(r=>resolve=r)});const result=instance.select('two');await tick();instance.update({size:'large',items});await tick();assert.ok(host.querySelector('[aria-busy=true]'));resolve(true);assert.equal(await result,true);const another=instance.select('one');await tick();instance.update({items:[{id:'new',label:'New'}]});assert.equal(await another,false);resolve(true);await tick();assert.equal(host.querySelector('[aria-selected=true]').dataset.navKey,'new');cleanup();
});
test('page size changes respect selection guards and work without a controlled pageSize',async()=>{
 const {host,instance,cleanup}=mount('pagination',{total:100,showSizeChanger:true,beforeChange:()=>false});let changes=0;host.addEventListener('gardener:navigationpagesize',()=>changes++);let select=host.querySelector('select');select.value='20';select.dispatchEvent(new Event('change'));await tick();assert.equal(changes,0);assert.equal(select.value,'10');instance.update({beforeChange:()=>true});select.value='20';select.dispatchEvent(new Event('change'));await tick();assert.equal(changes,1);assert.equal(select.value,'20');cleanup();
});
test('step navigation skips disabled adjacent steps',async()=>{
 const {host,cleanup}=mount('stepper');[...host.querySelectorAll('button')].find(n=>n.textContent==='下一步').click();await tick();assert.equal(host.querySelector('[aria-current=step]').dataset.navKey,'two');cleanup();
});
test('native modal ownership preserves root node and releases scroll on disable and destroy',async()=>{
 const {host,instance,cleanup}=mount('command-palette');instance.open();await tick();const dialog=host.querySelector('dialog');assert.ok(dialog.open);assert.equal(document.documentElement.style.overflow,'hidden');instance.update({size:'large'});await tick();assert.equal(host.querySelector('dialog'),dialog);instance.update({disabled:true});await tick();assert.equal(host.querySelector('dialog'),null);assert.equal(document.documentElement.style.overflow,'');cleanup();
});
test('display options hide optional details and panels without breaking tab references',async()=>{
 const {host,instance,cleanup}=mount('tabs',{items:[{id:'one',label:'One',icon:'X',badge:3,description:'Detail',shortcut:'A'}]});instance.update({showIcons:false,showBadges:false,showDescriptions:false,showShortcuts:false,showPanel:false,bordered:false});await tick();assert.equal(host.querySelector('.g-nav-ui-icon,.g-nav-ui-badge,small,kbd'),null);assert.ok(host.querySelector('.g-nav-ui-panels').hidden);assert.ok(document.getElementById(host.querySelector('[role=tab]').getAttribute('aria-controls')));cleanup();
});
test('unknown selection values and component changes cannot corrupt the current component',async()=>{
 const {host,instance,cleanup}=mount('tabs');assert.equal(await instance.select('missing'),false);assert.throws(()=>instance.update({component:'sidebar'}));await tick();assert.equal(host.querySelector('[aria-selected=true]').dataset.navKey,'one');cleanup();
});
test('variant presets apply until an explicit parameter overrides them',async()=>{
 const {host,instance,cleanup}=mount('tabs',{variant:'compact'});assert.ok(host.querySelector('.g-nav-size-small'));instance.update({size:'large'});await tick();assert.ok(host.querySelector('.g-nav-size-large'));instance.update({size:undefined});await tick();assert.ok(host.querySelector('.g-nav-size-small'));cleanup();
});
test('destroy restores authored children and malformed fragment identifiers do not throw',async()=>{
 const host=document.createElement('div'),original=document.createElement('p');original.textContent='Original';host.append(original);document.body.append(host);const instance=createNavigation(host,{component:'anchor-navigation',items:[{id:'bad',label:'Bad',href:'#%invalid'}]});await instance.select('bad');instance.destroy();assert.equal(host.firstElementChild,original);host.remove();
});
test.after(()=>win.happyDOM.abort());
