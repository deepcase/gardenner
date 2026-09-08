import {init,getInstance} from '../dist/gardener.runtime.js';
const catalog=(await (await fetch('../metadata/components.json')).json()).components.filter(c=>c.category==='overlay');
const roots=[...document.querySelectorAll('main article')].map((article,index)=>{
 const definition=catalog.find(c=>c.name===['dialog','drawer','popover','tooltip','popconfirm','confirm-dialog'][index]);
 const type=definition.behaviors[0],root=article.querySelector('[data-g-'+type+']');
 root.id ||= 'overlay-css-'+definition.name;
 root.classList.add(definition.cssSelector.slice(1));
 const label=document.createElement('label');label.textContent='组件变体 ';
 const select=document.createElement('select');select.setAttribute('aria-label',definition.name+' 变体');
 for(const value of ['',...definition.variants]){const option=document.createElement('option');option.value=value;option.textContent=value||'默认';select.append(option);}
 label.append(select);article.querySelector('h2').after(label);
 select.addEventListener('change',()=>{root.classList.remove(...definition.variants.map(v=>definition.cssSelector.slice(1)+'-'+v));if(select.value)root.classList.add(definition.cssSelector.slice(1)+'-'+select.value);root.removeAttribute('data-g-overlay-width');});
 const open=document.createElement('button');open.type='button';open.className='g-btn';open.textContent='程序打开';open.dataset.overlayOpen=definition.name;open.addEventListener('click',()=>getInstance(root,type)?.open(open));article.append(open);
 return {root,type};
});
const settings=document.createElement('fieldset');settings.id='overlay-settings';const legend=document.createElement('legend');legend.textContent='共享浮层参数';settings.append(legend);
const parameters={width:['','360','520','80vw'],height:['','320','60vh'], 'max-height':['','320','70vh'],density:['default','compact','comfortable'],'show-close':['true','false'],keyboard:['true','false'],'mask-closable':['true','false'],'outside-closable':['true','false'],modal:['true','false'],'lock-scroll':['true','false'],autofocus:['true','false'],'restore-focus':['true','false'],'top-layer':['true','false'],arrow:['true','false'],trigger:['','click','hover focus','manual','contextmenu'],placement:['','top','top-start','top-end','bottom','bottom-start','bottom-end','left','left-start','left-end','right','right-start','right-end'],offset:['8','0','24'],boundary:['8','24','48'],'open-delay':['100','0','500'],'close-delay':['120','0','500'],disabled:['false','true']};
for(const [key,values] of Object.entries(parameters)){const label=document.createElement('label');label.textContent=key+' ';const select=document.createElement('select');select.dataset.overlayParam=key;for(const value of values){const option=document.createElement('option');option.value=value;option.textContent=value||'默认';select.append(option);}select.addEventListener('change',()=>roots.forEach(({root})=>select.value?root.setAttribute('data-g-overlay-'+key,select.value):root.removeAttribute('data-g-overlay-'+key)));label.append(select);settings.append(label);}
document.querySelector('main').before(settings);
const failure=document.createElement('label');const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id='overlay-failure';failure.append(checkbox,'下次确认失败');settings.append(failure);
init(document);
document.addEventListener('gardener:action',event=>{const root=event.target;if(event.detail.action!=='confirm'||!root.hasAttribute('data-g-overlay-async'))return;const fail=checkbox.checked;checkbox.checked=false;const api=getInstance(root,root.hasAttribute('data-g-dialog')?'dialog':'popover');setTimeout(()=>api?.complete(!fail,fail?'本地模拟失败，请重试。':''),400);});
document.documentElement.dataset.overlayReady='true';
