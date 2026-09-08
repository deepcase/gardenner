import {init,getInstance} from './_content/Gardenerim.Blazor/gardener.runtime.min.js';
export function installMobileDemo(root,getInstance,service='success'){
 const api=getInstance(root,'mobile');if(!api||root.dataset.mobileDemoInstalled)return;root.dataset.mobileDemoInstalled='true';root.__mobileApi=api;const options=JSON.parse(root.getAttribute('data-g-mobile-options')||'{}');let page=1;
 for(const n of root.querySelectorAll('[data-au-field]')){if(['password','confirmPassword'].includes(n.dataset.auField))n.value='Demo passphrase 2026!';else if(n.dataset.auField==='code')n.value='123456';else continue;n.dispatchEvent(new Event('input',{bubbles:true}));}
 root.addEventListener('gardener:action',e=>{const d=e.detail;if(e.target!==root||d.behavior!=='mobile'||!d.requestId||d.phase==='result')return;const credentials=api.takeCredentials(d.requestId);if(credentials)for(const key of Object.keys(credentials))credentials[key]='';if(service==='timeout')return;setTimeout(()=>{if(!root.isConnected)return;const ok=api.resolve(d.requestId,{status:service==='error'?'error':'success',message:service==='error'?'本地模拟服务失败，请重试':'本地模拟服务已确认（未执行真实交易或系统授权）'});if(!ok||service==='error')return;
 if(d.action==='load'){page++;options.items=[...options.items,{id:'page-'+page,title:'第 '+page+' 页的新内容',description:'由演示服务追加，保留已有条目'}];api.setOptions({items:options.items,hasMore:page<3});}
 if(d.action==='refresh'){options.items=options.items.map(i=>({...i,description:'刚刚刷新 · '+i.title}));api.setOptions({items:options.items});}
 if(d.action==='item-action'&&d.key==='remove'){options.items=options.items.filter(i=>!d.value.selected?.length?i.id!==options.items[0]?.id:!d.value.selected.includes(i.id));api.setOptions({items:options.items});}
 },200);});
}
export function install(id){const root=document.getElementById(id);if(root){init(root);installMobileDemo(root,getInstance);}}
