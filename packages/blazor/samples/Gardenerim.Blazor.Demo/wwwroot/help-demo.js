import {getInstance} from './_content/Gardenerim.Blazor/gardener.runtime.min.js';
export function installHelpDemo(root,api,mode='none'){
 if(!api||mode==='none')return;const options=JSON.parse(root.getAttribute('data-g-help-options')||'{}');let attempts=0;
 const wait=signal=>new Promise((resolve,reject)=>{const stop=()=>{clearTimeout(timer);reject(new Error('Cancelled'));};const timer=setTimeout(()=>{signal.removeEventListener('abort',stop);resolve();},160);if(signal.aborted)stop();else signal.addEventListener('abort',stop,{once:true});});
 const submit=async({signal})=>{await wait(signal);if(mode==='error'&&attempts++===0)throw new Error('本地模拟失败，请重试。');};
 if(options.kind==='help-feedback')api.setOptions({submit});else if(['help-search','help-center','help-glossary'].includes(options.kind))api.setOptions({load:async request=>{await submit(request);return (options.items||[]).filter(item=>(!request.category||item.category===request.category)&&[item.title,item.term,item.description,item.answer,...(item.keywords||[])].join(' ').toLocaleLowerCase().includes(request.query.toLocaleLowerCase()));}});
}
const installed=new WeakMap();export function install(id,mode){const root=document.getElementById(id);if(!root)return;const api=getInstance(root,'help');if(api&&installed.get(root)!==api){installed.set(root,api);installHelpDemo(root,api,mode);}}
