export const dataDemoServices=String.raw`
function installDataDemo(root,api){if(!api||root.matches('.g-list,.g-statistic'))return;let attempt=0;const mode=root.dataset.demoDataService||'success';const original=api.getState().items;
if(mode!=='none')api.setOptions({...(mode==='timeout'?{serviceTimeout:200}:{}),load:async({signal})=>{attempt++;if(mode==='timeout')await new Promise(()=>{});else await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,120);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(signal.reason);},{once:true});});if(mode==='retry'&&attempt===1)throw Error('本地数据服务暂不可用，请重试');return original;}});
const controls=document.createElement('div');controls.className='g-flex g-gap-2';controls.dataset.dataServiceControls='';for(const [label='',name='load']of [['加载本地数据','load'],['取消加载','cancel']]){const button=document.createElement('button');button.type='button';button.className='g-btn g-btn-outline';button.textContent=label;button.dataset.dataServiceAction=name;button.addEventListener('click',()=>api[name]());controls.append(button);}root.after(controls);
}
`;
