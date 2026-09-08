import assert from 'node:assert/strict';
import { test, after } from 'node:test';
import { browserWindow } from './runtime-fixtures.mjs';
const runtime = await import('../src/js/index.js');
const mount = (html) => { const root=document.createElement('div');root.innerHTML=html;document.body.append(root);runtime.init(root);return root; };
const cleanup = (root) => { runtime.destroy(root);root.remove(); };

test('nested accordions toggle only their own panels and support header keyboard navigation',()=>{
 const root=mount(`<div data-g-accordion id="outer-accordion"><button class="g-accordion-trigger" aria-expanded="true" aria-controls="outer-panel">Outer</button><div id="outer-panel"><div data-g-accordion><button class="g-accordion-trigger" aria-controls="inner-panel">Inner</button><div id="inner-panel" hidden>Nested answer</div></div></div><button class="g-accordion-trigger" aria-controls="other-panel">Other</button><div id="other-panel" hidden>Other answer</div></div>`);
 const triggers=root.querySelectorAll('.g-accordion-trigger');
 triggers[1].click();assert.equal(root.querySelector('#inner-panel').hidden,false);assert.equal(root.querySelector('#outer-panel').hidden,false);
 triggers[0].focus();triggers[0].dispatchEvent(new browserWindow.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true}));assert.equal(document.activeElement,triggers[2]);
 triggers[2].click();assert.equal(root.querySelector('#outer-panel').hidden,true);assert.equal(triggers[1].getAttribute('aria-expanded'),'true');
 cleanup(root);
});

test('nested carousels own their slides, keyboard events and arbitrary API indices',()=>{
 const root=mount(`<div data-g-carousel id="outer-carousel"><div class="g-carousel-slide"><div data-g-carousel id="inner-carousel"><div class="g-carousel-slide">A</div><div class="g-carousel-slide">B</div><button data-g-carousel-next>Next inner</button></div></div><div class="g-carousel-slide">Second outer</div><button data-g-carousel-next>Next outer</button></div>`);
 const outer=root.querySelector('#outer-carousel'),inner=root.querySelector('#inner-carousel');
 inner.querySelector('button').click();assert.equal(inner.style.getPropertyValue('--g-slide-index'),'1');assert.equal(outer.style.getPropertyValue('--g-slide-index'),'0');
 inner.dispatchEvent(new browserWindow.KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));assert.equal(inner.style.getPropertyValue('--g-slide-index'),'0');assert.equal(outer.style.getPropertyValue('--g-slide-index'),'0');
 const instance=runtime.getInstance(outer,'carousel');instance.go(-5);assert.equal(outer.style.getPropertyValue('--g-slide-index'),'1');instance.go(NaN);assert.equal(outer.style.getPropertyValue('--g-slide-index'),'1');
 outer.dispatchEvent(new browserWindow.KeyboardEvent('keydown',{key:'Home',bubbles:true}));assert.equal(outer.style.getPropertyValue('--g-slide-index'),'0');
 cleanup(root);
});

test('desktop panel root behavior toggles the body and restores focus on Escape',()=>{
 for(const className of ['g-desktop-dock-panel','g-desktop-inspector-panel','g-desktop-bottom-panel']){
  const root=mount(`<aside class="${className}" data-g-nav-toggle><header class="g-desktop-panel-header"><button data-g-panel-toggle>Toggle</button></header><div class="g-desktop-panel-body"><input aria-label="Title"></div></aside>`);
  const panel=root.firstElementChild,button=panel.querySelector('button'),body=panel.querySelector('.g-desktop-panel-body');
  assert.ok(runtime.getInstance(panel,'nav-toggle'));button.click();assert.equal(body.hidden,true);assert.equal(button.getAttribute('aria-expanded'),'false');button.click();panel.querySelector('input').focus();body.dispatchEvent(new browserWindow.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(body.hidden,true);assert.equal(document.activeElement,button);
  cleanup(root);
 }
});
test('pull refresh leaves button pointer events intact so refresh controls remain clickable',()=>{
 const root=mount('<section data-g-pull-refresh><button data-g-refresh>Refresh</button><div>Pull here</div></section>');
 const scope=root.firstElementChild;let captures=0;scope.setPointerCapture=()=>captures++;
 const button=scope.querySelector('button');button.dispatchEvent(new browserWindow.PointerEvent('pointerdown',{bubbles:true,pointerType:'mouse',button:0}));assert.equal(captures,0);
 button.click();const instance=runtime.getInstance(scope,'pull-refresh');assert.equal(instance.isRefreshing(),true);instance.complete();assert.equal(instance.isRefreshing(),false);
 scope.querySelector('div').dispatchEvent(new browserWindow.PointerEvent('pointerdown',{bubbles:true,pointerType:'mouse',button:0}));assert.equal(captures,1);cleanup(root);
});
after(async()=>{runtime.destroy(document);runtime.disconnect?.();await browserWindow.happyDOM.abort();browserWindow.close();});
