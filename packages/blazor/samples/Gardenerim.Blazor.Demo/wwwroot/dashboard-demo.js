import {getInstance} from "./_content/Gardenerim.Blazor/gardener.runtime.min.js";

function installDashboardDemo(root,api){
 if(!api)return;let attempt=0;const mode=root.dataset.demoDashboardService||'success';
 if(mode!=='none')api.setOptions({...(mode==='timeout'?{serviceTimeout:200}:{}),load:async({signal})=>{attempt++;if(mode==='timeout')await new Promise(()=>{});else await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,150);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(signal.reason);},{once:true});});if(mode==='retry'&&attempt===1)throw Error('本地服务暂不可用，请重试');return {value:94};}});
 const controls=document.createElement('div');controls.className='g-flex g-gap-2';controls.dataset.dashboardServiceControls='';
 for(const [label="",name="load"]of [['加载本地数据','load'],['取消加载','cancel']]){const button=document.createElement('button');button.type='button';button.className='g-btn g-btn-outline';button.textContent=label;button.dataset.dashboardServiceAction=name;button.addEventListener('click',()=>api[name]());controls.append(button);}root.after(controls);
}

const installed=new WeakMap();export function install(id){const root=document.getElementById(id);if(!root)return;const api=getInstance(root,"dashboard");if(api&&installed.get(root)!==api){for(const controls of document.querySelectorAll("[data-dashboard-service-controls]"))controls.remove();installDashboardDemo(root,api);installed.set(root,api);}}