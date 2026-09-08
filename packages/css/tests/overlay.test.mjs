import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
const window = new Window({url:'http://localhost'});
for(const name of ['document','Element','HTMLElement','Node','MutationObserver','CustomEvent','Event','KeyboardEvent','MouseEvent','PointerEvent'])globalThis[name]=window[name];
globalThis.window=window;globalThis.GardenerimAutoStart=false;globalThis.getComputedStyle=window.getComputedStyle.bind(window);globalThis.requestAnimationFrame=window.requestAnimationFrame.bind(window);globalThis.cancelAnimationFrame=window.cancelAnimationFrame.bind(window);
const {init,destroy,getInstance}=await import('../src/js/index.js');
const tick=()=>new Promise(resolve=>setTimeout(resolve,15));
const mount=html=>{const host=document.createElement('div');host.innerHTML=html;document.body.append(host);init(host);return host;};
const cleanup=host=>{destroy(host);host.remove();};
const modal=(id,attributes='')=>`<div id="${id}" data-g-dialog hidden ${attributes}><section class="g-dialog"><h2 class="g-dialog-title">Title</h2><input value="draft"><button data-g-overlay-confirm>Confirm</button><button data-g-close>Close</button></section></div>`;
const floating=(attributes='')=>`<div data-g-popover ${attributes}><button data-g-popover-trigger>Trigger</button><div data-g-popover-content hidden><input value="Draft"><button data-g-overlay-confirm>Confirm</button><button data-g-overlay-cancel>Cancel</button><p data-g-overlay-error></p></div></div>`;
test('nested overlays consume only the top Escape and restore scroll and authored inert state',async()=>{
 const host=mount('<button id="launch">Launch</button><div inert id="authored"></div>'+modal('outer')+modal('inner'));
 const outer=getInstance(host.querySelector('#outer'),'dialog'),inner=getInstance(host.querySelector('#inner'),'dialog');
 outer.open(host.querySelector('#launch'));inner.open();assert.equal(document.documentElement.dataset.gScrollLocks,'2');
 document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(inner.isOpen(),false);assert.equal(outer.isOpen(),true);assert.equal(document.documentElement.dataset.gScrollLocks,'1');
 outer.close();assert.equal(document.documentElement.style.overflow,'');assert.ok(host.querySelector('#authored').hasAttribute('inert'));assert.equal(host.querySelector('#launch').hasAttribute('inert'),false);cleanup(host);
});
test('controlled modal requests changes without mutation and honors explicit false dismissal parameters',async()=>{
 const host=mount(modal('modal','data-g-overlay-controlled data-g-overlay-open="false" data-g-overlay-keyboard="false" data-g-overlay-mask-closable="false"')),root=host.firstElementChild,api=getInstance(root,'dialog');let requested;
 root.addEventListener('gardener:change',e=>requested=e.detail.value);api.open();assert.equal(requested,true);assert.equal(api.isOpen(),false);root.dataset.gOverlayOpen='true';await tick();assert.equal(api.isOpen(),true);document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));root.click();assert.equal(api.isOpen(),true);root.dataset.gOverlayOpen='false';await tick();assert.equal(api.isOpen(),false);cleanup(host);
});
test('close cancellation retains modal and destroyed pending focus never resurrects it',async()=>{
 const host=mount(modal('modal')),root=host.firstElementChild,api=getInstance(root,'dialog');api.open();const veto=e=>e.preventDefault();root.addEventListener('gardener:beforeclose',veto);api.close();assert.equal(api.isOpen(),true);destroy(host);await tick();assert.equal(root.hidden,true);assert.equal(document.documentElement.style.overflow,'');cleanup(host);
});
test('async confirmation blocks double submission and supports failure then successful completion',()=>{
 const host=mount(floating('class="g-popconfirm" data-g-overlay-async')),root=host.firstElementChild,api=getInstance(root,'popover');let actions=0;root.addEventListener('gardener:action',()=>actions++);api.open();const button=root.querySelector('[data-g-overlay-confirm]');button.click();button.click();assert.equal(actions,1);assert.ok(button.disabled);api.close();assert.equal(api.isOpen(),true);api.complete(false,'Retry');assert.equal(button.disabled,false);assert.equal(root.querySelector('[data-g-overlay-error]').textContent,'Retry');assert.equal(root.querySelector('input').value,'Draft');button.click();api.complete();assert.equal(api.isOpen(),false);cleanup(host);
});
test('floating disabled, controlled updates and nested Escape do not steal unrelated focus',async()=>{
 const host=mount('<input id="outside">'+floating('data-g-overlay-disabled')),root=host.lastElementChild,api=getInstance(root,'popover');api.open();assert.equal(api.isOpen(),false);root.removeAttribute('data-g-overlay-disabled');await tick();api.open();assert.equal(api.isOpen(),true);document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));assert.equal(api.isOpen(),false);host.querySelector('#outside').focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));assert.equal(document.activeElement,host.querySelector('#outside'));cleanup(host);
});
test('tooltip delayed hover cancels on destroy and preserves existing accessible descriptions',async()=>{
 const host=mount('<div data-g-tooltip data-g-overlay-open-delay="30"><button data-g-tooltip-trigger aria-describedby="help">Help</button><div data-g-tooltip-content hidden>Tooltip</div></div>'),root=host.firstElementChild,button=root.querySelector('button');button.dispatchEvent(new PointerEvent('pointerenter'));destroy(host);await new Promise(r=>setTimeout(r,40));assert.equal(root.lastElementChild.hidden,true);assert.equal(button.getAttribute('aria-describedby'),'help');cleanup(host);
});
test('floating parameters update in place while preserving instance and typed values',async()=>{
 const host=mount(floating('data-g-overlay-controlled data-g-overlay-open')),root=host.firstElementChild,api=getInstance(root,'popover');root.querySelector('input').value='Edited';root.dataset.gOverlayWidth='480';root.dataset.gOverlayPlacement='top-end';await tick();assert.equal(getInstance(root,'popover'),api);assert.equal(api.isOpen(),true);assert.equal(root.querySelector('input').value,'Edited');assert.equal(root.querySelector('[data-g-popover-content]').style.width,'480px');cleanup(host);
});
test('controlled floating close restores focus and configuration preserves an async operation',async()=>{
 const host=mount(floating('data-g-overlay-controlled data-g-overlay-open data-g-overlay-async')),root=host.firstElementChild,api=getInstance(root,'popover');root.addEventListener('gardener:change',e=>root.setAttribute('data-g-overlay-open',String(e.detail.value)));root.querySelector('input').focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));await tick();assert.equal(document.activeElement,root.querySelector('button'));api.open();await tick();root.querySelector('[data-g-overlay-confirm]').click();root.dataset.gOverlayWidth='480';await tick();assert.equal(root.querySelector('[data-g-overlay-confirm]').disabled,true);api.complete();await tick();assert.equal(api.isOpen(),false);cleanup(host);
});
test('modal parameter changes release and reacquire background ownership without rebuilding',async()=>{
 const host=mount('<button id="launch">Launch</button>'+modal('modal')),root=host.lastElementChild,api=getInstance(root,'dialog');api.open();root.dataset.gOverlayModal='false';await tick();assert.equal(document.documentElement.style.overflow,'');assert.equal(host.querySelector('#launch').hasAttribute('inert'),false);root.dataset.gOverlayModal='true';await tick();assert.equal(document.documentElement.dataset.gScrollLocks,'1');api.close();cleanup(host);
});
test('standalone floating roots keep authored widths and do not observe their own arrow writes forever',async()=>{
 const host=mount('<button>Open</button><div data-g-popover class="g-popover" hidden style="width:320px">Content</div>'),root=host.lastElementChild,api=getInstance(root,'popover');api.open();await tick();assert.equal(api.isOpen(),true);assert.equal(root.style.width,'320px');api.close();cleanup(host);
});
test('disabling an open modal releases scroll and background even with controlled open',async()=>{
 for(const attrs of ['', 'data-g-overlay-controlled data-g-overlay-open']){const host=mount(modal('disabled',attrs)),root=host.firstElementChild,api=getInstance(root,'dialog');api.open();root.dataset.gOverlayDisabled='true';await tick();assert.equal(api.isOpen(),false);assert.equal(document.documentElement.style.overflow,'');cleanup(host);}
});
test('synchronous async completion does not leave confirmation busy',()=>{
 for(const [html,type] of [[modal('sync','data-g-overlay-async'),'dialog'],[floating('data-g-overlay-async'),'popover']]){const host=mount(html),root=host.firstElementChild,api=getInstance(root,type);api.open();root.addEventListener('gardener:action',()=>api.complete(true));root.querySelector('[data-g-overlay-confirm]').click();assert.equal(api.isOpen(),false);api.open();assert.equal(root.querySelector('[data-g-overlay-confirm]').disabled,false);cleanup(host);}
});
test('cancelled async action clears busy and retains the surface',()=>{
 for(const [html,type] of [[modal('veto','data-g-overlay-async'),'dialog'],[floating('data-g-overlay-async'),'popover']]){const host=mount(html),root=host.firstElementChild,api=getInstance(root,type);api.open();root.addEventListener('gardener:action',e=>e.preventDefault());const button=root.querySelector('[data-g-overlay-confirm]');button.click();assert.equal(api.isOpen(),true);assert.equal(button.disabled,false);cleanup(host);}
});
test('removing busy releases controls while unrelated parameters preserve an operation',async()=>{
 for(const [html,type] of [[modal('busy','data-g-overlay-busy data-g-overlay-async'),'dialog'],[floating('data-g-overlay-busy data-g-overlay-async'),'popover']]){const host=mount(html),root=host.firstElementChild,api=getInstance(root,type);api.open();root.removeAttribute('data-g-overlay-busy');await tick();const button=root.querySelector('[data-g-overlay-confirm]');assert.equal(button.disabled,false);button.click();root.dataset.gOverlayWidth='440';await tick();assert.equal(button.disabled,true);api.complete();cleanup(host);}
});
test('standalone floating surfaces honor their action buttons',()=>{
 const host=mount('<button>Open</button><div data-g-popover class="g-popover" hidden><button data-g-overlay-cancel>Cancel</button></div>'),root=host.lastElementChild,api=getInstance(root,'popover');api.open();root.querySelector('button').click();assert.equal(api.isOpen(),false);cleanup(host);
});
test('trigger disabling closes a controlled floating surface',async()=>{
 const host=mount(floating('data-g-overlay-controlled data-g-overlay-open')),root=host.firstElementChild,api=getInstance(root,'popover');root.firstElementChild.disabled=true;await tick();assert.equal(api.isOpen(),false);cleanup(host);
});
test('hover leave does not dismiss keyboard focused tooltip',async()=>{
 const host=mount('<div data-g-tooltip data-g-overlay-close-delay="0"><button data-g-tooltip-trigger>Help</button><div data-g-tooltip-content hidden>Tip</div></div>'),root=host.firstElementChild,button=root.firstElementChild,api=getInstance(root,'tooltip');button.focus();button.dispatchEvent(new PointerEvent('pointerleave'));await tick();assert.equal(api.isOpen(),true);cleanup(host);
});
test('destroy restores authored semantics and inline dimensions',()=>{
 const host=mount('<button id="owned" aria-haspopup="menu" aria-controls="original">Open</button><div data-g-popover role="region" tabindex="2" style="width:320px" hidden>Content</div>'),root=host.lastElementChild,button=host.firstElementChild,api=getInstance(root,'popover');api.open();cleanup(host);assert.equal(button.getAttribute('aria-haspopup'),'menu');assert.equal(button.getAttribute('aria-controls'),'original');assert.equal(root.getAttribute('role'),'region');assert.equal(root.getAttribute('tabindex'),'2');assert.equal(root.getAttribute('style'),'width:320px');
});
test('modal destroy restores generated title links and dimensions',()=>{
 const host=mount(modal('restore')),root=host.firstElementChild,panel=root.firstElementChild;getInstance(root,'dialog').open();cleanup(host);assert.equal(panel.hasAttribute('aria-labelledby'),false);assert.equal(panel.querySelector('h2').hasAttribute('id'),false);assert.equal(panel.hasAttribute('tabindex'),false);assert.equal(panel.hasAttribute('aria-busy'),false);
});
test.after(()=>window.happyDOM.abort());
