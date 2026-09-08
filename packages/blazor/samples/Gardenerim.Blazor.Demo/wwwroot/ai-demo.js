import {init,getInstance} from './_content/Gardenerim.Blazor/gardener.runtime.min.js';
export function installAIDemo(root,api,mode='recorded') {
 if(!api||mode==='none')return;let attempt=0;const original=JSON.parse(root.getAttribute('data-g-ai-options')||'{}');
 const delay=(signal,ms=160)=>new Promise((resolve,reject)=>{if(signal.aborted)return reject(new DOMException('Cancelled','AbortError'));const end=()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',end);resolve();},ms);signal.addEventListener('abort',end,{once:true});});
 const service=async({signal})=>{await delay(signal,300);if(mode==='error'&&attempt++===0)throw Error('本地模拟失败：请重试。');};
 api.setOptions({generate:async function*({signal}){for(const part of ['这是一段预录的演示回复。\n\n','- 已核对组件参数。\n','- 可暂停、继续或取消生成。\n','- 真实模型由应用提供服务回调。']){await delay(signal);if(mode==='error'&&attempt++===0)throw Error('本地模拟中断：请重试。');yield part;}},submitFeedback:service,approve:service,record:service});
 root.addEventListener('gardener:action',event=>{if(event.target!==root)return;const detail=event.detail;if(detail.action==='remove'){original.items=original.items.filter(item=>item.id!==detail.value.id);api.setOptions({items:original.items});}else if(String(detail.action).startsWith('remove:')){original.items=original.items.filter(item=>item.id!==detail.action.slice(7));api.setOptions({items:original.items});}});
}

const installed=new WeakMap();export function install(id,mode){const root=document.getElementById(id);if(!root)return;init(root);const api=getInstance(root,'ai');if(api&&installed.get(root)!==api){installed.set(root,api);installAIDemo(root,api,mode);}}
