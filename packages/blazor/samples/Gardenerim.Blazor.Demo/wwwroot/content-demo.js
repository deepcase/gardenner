import {init,getInstance} from "./_content/Gardenerim.Blazor/gardener.runtime.min.js";
function installContentDemo(root,api){
 if(!api)return;
 const options=JSON.parse(root.dataset.gContentOptions||'{}'),mode=root.dataset.demoContentService||'success';
 if(mode==='timeout')api.setOptions({serviceTimeout:options.serviceTimeout??1000});
 const wait=signal=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{signal.removeEventListener('abort',cancel);resolve();},120);const cancel=()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));};signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)cancel();});
 if(['content-file-drop','content-upload-queue','chunk-upload','upload-progress-composition','failed-upload'].includes(options.kind)){
  let fail=options.kind==='failed-upload'||mode==='retry';if(mode!=='none')api.setOptions({upload:async(file,{signal,onProgress})=>{if(mode==='timeout')return new Promise(()=>{});onProgress(.3);await wait(signal);if(fail){fail=false;throw new Error('演示：首次传输失败，请重试');}onProgress(1);}});
  api.addFiles([new File(['Gardenerim content demo.\n'.repeat(100)],'guide.txt',{type:'text/plain'})]);
  if(options.kind==='failed-upload'||root.classList.contains('is-uploading')||root.classList.contains('is-success')||root.classList.contains('is-paused')){api.upload();if(root.classList.contains('is-paused'))setTimeout(()=>api.pauseUpload(),140);}
 }
 if(options.kind==='content-autosave-indicator'&&mode!=='none'){let first=mode==='retry';api.setOptions({save:async(text,{signal})=>{if(mode==='timeout')return new Promise(()=>{});await wait(signal);if(first){first=false;throw new Error('演示首次保存失败，请重试');}if(text.includes('[error]'))throw new Error('演示保存失败：移除 [error] 后重试');}});}
 root.addEventListener('gardener:action',event=>{if(event.target!==root||event.detail.reason!=='crop')return;const url=URL.createObjectURL(event.detail.blob);const link=document.createElement('a');link.href=url;link.download='crop.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}
const installed=new WeakMap();export function install(id){const root=document.getElementById(id);if(!root)return;const api=getInstance(root,"content");if(api&&installed.get(root)!==api){installed.set(root,api);installContentDemo(root,api);}}
