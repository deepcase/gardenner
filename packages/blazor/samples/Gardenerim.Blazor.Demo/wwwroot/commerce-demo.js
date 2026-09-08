import {init,getInstance} from './_content/Gardenerim.Blazor/gardener.runtime.min.js';
export function installCommerceDemo(root,getInstance,service='success'){
 if(root.dataset.commerceDemoInstalled)return;root.dataset.commerceDemoInstalled='true';const api=getInstance(root,'commerce');root.__commerceApi=api;
 const baseDiscount=JSON.parse(root.getAttribute('data-g-commerce-options')||'{}').discount||0;let applied=false;
 root.addEventListener('gardener:change',e=>{if(e.target!==root||e.detail.behavior!=='commerce')return;if(applied&&e.detail.value.coupon!=='WELCOME10'){applied=false;queueMicrotask(()=>{if(root.isConnected)api?.setOptions({discount:baseDiscount});});}});
 root.addEventListener('gardener:action',e=>{if(e.target!==root||e.detail.behavior!=='commerce'||e.detail.phase==='result'||e.detail.action==='cancel')return;const {requestId,action,value}=e.detail;if(!requestId||service==='timeout')return;
 setTimeout(()=>{if(!root.isConnected)return;const success=service!=='error'&&(action!=='coupon'||value.coupon==='WELCOME10');const accepted=api?.resolve(requestId,{status:success?'success':'error',message:success?'本地模拟服务已确认：'+action+'（未产生真实交易）':'本地模拟服务拒绝请求，请检查信息后重试'});if(accepted&&success&&action==='coupon'){applied=true;api.setOptions({discount:baseDiscount+1000});}},250);});
}
export function install(id){const root=document.getElementById(id);if(root){init(root);installCommerceDemo(root,getInstance);}}
