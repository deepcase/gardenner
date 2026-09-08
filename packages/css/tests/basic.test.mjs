import test from 'node:test';
import assert from 'node:assert/strict';
import {Window} from 'happy-dom';
const window=new Window({url:'http://localhost/'});
for(const key of ['document','Element','HTMLElement','MutationObserver','CustomEvent','Event','KeyboardEvent'])globalThis[key]=window[key];
globalThis.window=window;globalThis.GardenerimAutoStart=false;
const {init,destroy}=await import('../src/js/index.js');
const tick=async()=>{await new Promise(r=>setTimeout(r,5));};
const mount=html=>{const el=document.createElement('div');el.innerHTML=html;document.body.append(el);init(el);return {el,cleanup(){destroy(el);el.remove();}};};
test('loading and disabled basics block real clicks and restore original native states',async()=>{
 const {el,cleanup}=mount('<div class="g-btn-group is-disabled"><button class="g-btn">One</button><button class="g-btn" disabled>Two</button></div><a href="#target" class="g-btn is-loading">Link</a>');let clicks=0;
 el.addEventListener('click',()=>clicks++);const [one,two]=el.querySelectorAll('button');assert.ok(one.disabled);assert.ok(two.disabled);one.click();el.querySelector('a').click();assert.equal(clicks,0);
 el.firstElementChild.classList.remove('is-disabled');await tick();assert.equal(one.disabled,false);assert.equal(two.disabled,true);one.click();assert.equal(clicks,1);cleanup();
});
test('basic opt-in toggle emits the same value contract and supports controlled state',()=>{
 const {el,cleanup}=mount('<button class="g-tag g-tag-checkable" data-g-basic-toggle aria-pressed="false">Tag</button>');const button=el.firstElementChild;let detail;
 button.addEventListener('gardener:change',e=>detail=e.detail);button.click();assert.equal(button.getAttribute('aria-pressed'),'true');assert.equal(detail.value,true);
 button.setAttribute('data-g-basic-controlled','');button.click();assert.equal(button.getAttribute('aria-pressed'),'true');assert.equal(detail.value,false);button.setAttribute('data-g-basic-toggle','false');detail=null;button.click();assert.equal(detail,null);cleanup();
});
test('close requests are cancelable and never replace framework-owned children',()=>{
 const {el,cleanup}=mount('<span class="g-tag"><span>Tag</span><button data-g-basic-close>Close</button></span>');const tag=el.firstElementChild,button=el.querySelector('button'),cancel=e=>e.preventDefault();
 tag.addEventListener('gardener:close',cancel);button.click();assert.equal(tag.hidden,false);tag.removeEventListener('gardener:close',cancel);button.click();assert.equal(tag.hidden,true);assert.equal(tag.children.length,2);cleanup();
});
test('failed avatar images reveal supplied fallback and reset after a successful source',async()=>{
 const {el,cleanup}=mount('<span class="g-avatar"><img src="bad" alt="Member"><span class="g-avatar-fallback">M</span></span>');const img=el.querySelector('img'),avatar=el.firstElementChild;
 Object.defineProperty(img,'complete',{configurable:true,value:true});Object.defineProperty(img,'naturalWidth',{configurable:true,value:0});img.dispatchEvent(new Event('error'));await tick();assert.ok(avatar.classList.contains('has-image-error'));
 Object.defineProperty(img,'naturalWidth',{configurable:true,value:80});img.dispatchEvent(new Event('load'));await tick();assert.equal(avatar.classList.contains('has-image-error'),false);cleanup();
});
test('destroy restores controls, disconnects enhancement and allows safe reinitialization',()=>{
 const {el,cleanup}=mount('<button class="g-btn is-loading">Save</button>');const button=el.firstElementChild;assert.ok(button.disabled);destroy(el);assert.equal(button.disabled,false);init(el);assert.ok(button.disabled);cleanup();
});
test('badge count handles overflow, zero visibility and reactive limits',async()=>{
 const {el,cleanup}=mount('<span class="g-badge" data-g-basic-count="128"><span class="g-badge-value"></span></span>');const badge=el.firstElementChild,value=el.querySelector('.g-badge-value');assert.equal(value.textContent,'99+');
 badge.dataset.gBasicMax='200';await tick();assert.equal(value.textContent,'128');badge.dataset.gBasicCount='0';await tick();assert.ok(value.hidden);assert.ok(badge.hidden);badge.dataset.gBasicShowZero='';await tick();assert.equal(value.hidden,false);assert.equal(badge.hidden,false);assert.equal(value.textContent,'0');cleanup();
});
test('avatar group max changes reveal members and hide the surplus indicator',async()=>{
 const {el,cleanup}=mount('<div class="g-avatar-group" data-g-basic-max="1"><span class="g-avatar">A</span><span class="g-avatar">B</span><span class="g-avatar">C</span><span class="g-avatar g-avatar-overflow"></span></div>');const group=el.firstElementChild,avatars=[...group.children];assert.equal(avatars[0].hidden,false);assert.ok(avatars[1].hidden);assert.equal(avatars[3].textContent,'+2');group.dataset.gBasicMax='3';await tick();assert.equal(avatars[1].hidden,false);assert.ok(avatars[3].hidden);cleanup();
});
test.after(()=>window.happyDOM.abort());
