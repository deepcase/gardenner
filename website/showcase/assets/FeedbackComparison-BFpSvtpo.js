var e=`<script setup lang="ts">
import {h,ref,computed,defineComponent,onMounted,nextTick} from 'vue';
import {Alert,Progress,Spin,Empty,SkeletonLine,SkeletonShape,Result,Button} from '@arco-design/web-vue';
// Message's public service teleports into body; its own component keeps the real specimen inside the isolated reference.
import ArcoMessage from '@arco-design/web-vue/es/message/message.js';
import {GAlert,GProgressMeter,GSpinnerSkeleton,GEmptyState,GToast,GContextBar,GPageLoading,GPageStateSystem,GStatusBar,GButton} from '@gardenerim/vue';
type Case={id:string;family:string;kind?:string;size?:string;state?:string};
const families=['alert','progress-meter','spinner-skeleton','empty-state','toast','status-bar','context-bar','page-loading','page-state-system'];
const cases:Case[]=[
 ...['info','success','warning','error','normal'].flatMap(state=>['plain','title','close'].map(kind=>({id:\`alert-\${state}-\${kind}\`,family:'alert',state,kind}))),
 ...['banner','no-icon'].map(kind=>({id:\`alert-\${kind}\`,family:'alert',kind})),
 ...['small','medium','large'].map(size=>({id:\`progress-line-\${size}\`,family:'progress-meter',kind:'line',size})),
 ...['mini','small','medium','large'].map(size=>({id:\`progress-circle-\${size}\`,family:'progress-meter',kind:'circle',size})),
 {id:'progress-steps',family:'progress-meter',kind:'steps'},
 ...['16','20','32','48'].map(size=>({id:\`spin-\${size}\`,family:'spinner-skeleton',kind:'spin',size})),
 {id:'spin-tip',family:'spinner-skeleton',kind:'tip'},
 ...['small','medium','large'].map(size=>({id:\`skeleton-\${size}\`,family:'spinner-skeleton',kind:'shape',size})),
 {id:'skeleton-lines',family:'spinner-skeleton',kind:'lines'},
 ...['icon','image'].map(kind=>({id:\`empty-\${kind}\`,family:'empty-state',kind})),
 ...['info','success','warning','error','loading'].map(state=>({id:\`toast-\${state}\`,family:'toast',state})),
 {id:'toast-close',family:'toast',kind:'close'},
 ...['plain','title'].map(kind=>({id:\`context-\${kind}\`,family:'context-bar',kind})),
 ...['16','20','32'].map(size=>({id:\`page-loading-\${size}\`,family:'page-loading',size})),
 ...['success','info','warning','error','403','404','500'].map(state=>({id:\`result-\${state}\`,family:'page-state-system',state})),
 {id:'status-controls',family:'status-bar'},
];
const filter=ref(new URLSearchParams(location.search).get('component')||'all'),rtl=ref(false),dark=ref(false),value=ref(60),closed=ref<Record<string,boolean>>({});
const shown=computed(()=>cases.filter(c=>filter.value==='all'||c.family===filter.value));
const icon=()=>h('svg',{viewBox:'0 0 48 48',width:'1em',height:'1em','aria-hidden':'true'},[h('rect',{x:8,y:12,width:32,height:26,rx:3,fill:'none',stroke:'currentColor','stroke-width':2}),h('path',{d:'M8 27h10l3 5h6l3-5h10',fill:'none',stroke:'currentColor','stroke-width':2})]);
const image=\`data:image/svg+xml,\${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80"><rect x="8" y="12" width="84" height="60" rx="4" fill="#e5e6eb"/></svg>')}\`;
const Specimen=defineComponent({props:{sample:{type:Object,required:true},reference:Boolean},setup(p){return()=>{
 const c=p.sample as Case,a=p.reference,key=\`\${a?'arco':'gardener'}-\${c.id}\`,state=c.state||'info',title=c.kind==='title',close=c.kind==='close',percent=value.value/100;
 if(closed.value[key])return h('span','已关闭');
 if(c.family==='alert'||c.family==='context-bar'){
  const context=c.family==='context-bar',prefix=context?'g-context-bar':'g-alert';
  if(a)return h(Alert,{type:state as any,banner:c.kind==='banner',showIcon:c.kind!=='no-icon',closable:close,onClose:()=>closed.value[key]=true},{default:()=> 'Feedback message',...(title?{title:()=> 'Feedback title'}:{})});
  return h(context?GContextBar:GAlert,{variant:[title?'with-title':'',c.kind==='banner'?'banner':'',c.kind==='no-icon'||state==='normal'?'no-icon':''].filter(Boolean),state,role:'status'},()=>[c.kind==='no-icon'||state==='normal'?null:h('span',{class:\`\${prefix}-icon\`},'!'),h('div',{class:\`\${prefix}-body\`},[title?h('div',{class:\`\${prefix}-title\`},'Feedback title'):null,h('div',{class:\`\${prefix}-content\`},'Feedback message')]),close?h('button',{class:\`\${prefix}-close\`,type:'button','aria-label':'关闭',onClick:()=>closed.value[key]=true},'×'):null]);
 }
 if(c.family==='progress-meter'){
  if(a)return h(Progress,{type:c.kind==='circle'?'circle':'line',size:(c.size||'medium') as any,steps:c.kind==='steps'?5:0,percent,showText:c.kind==='circle'&&c.size!=='mini'});
  return h(GProgressMeter,{variant:[c.kind||'line',c.size||'medium'],role:'progressbar','aria-label':'任务进度',config:{feedbackValue:value.value}},()=>c.kind==='circle'?c.size==='mini'?[]:[h('span',{class:'g-progress-text'},\`\${value.value}%\`)]:c.kind==='steps'?Array.from({length:5},(_,i)=>h('span',{class:['g-progress-step',i<Math.ceil(percent*5)?'is-complete':'']})):[h('span',{class:'g-progress-bar'})]);
 }
 if(c.family==='spinner-skeleton'){
  if(c.kind==='shape')return a?h(SkeletonShape,{size:c.size as any,shape:'circle'}):h(GSpinnerSkeleton,{variant:['avatar',c.size||'medium','static']});
  if(c.kind==='lines')return a?h('div',{class:'reference-skeleton-lines',style:{width:'100%'}},[h(SkeletonLine,{rows:3,widths:['100%','100%','60%']})]):h(GSpinnerSkeleton,{variant:['skeleton','static']},()=>h('div',{class:'g-skeleton-paragraph'},[h('span',{class:'g-skeleton-row'}),h('span',{class:'g-skeleton-row'}),h('span',{class:'g-skeleton-row',style:{width:'60%'}})]));
  return a?h(Spin,{size:Number(c.size||20),tip:c.kind==='tip'?'Loading':undefined}):h(GSpinnerSkeleton,{variant:c.kind==='tip'?'tip':undefined,role:'status','aria-label':'加载中',style:{'--g-spinner-size':\`\${c.size||20}px\`}},()=>[h('span',{class:'g-spinner-indicator'}),c.kind==='tip'?h('span',{class:'g-spinner-description'},'Loading'):null]);
 }
 if(c.family==='empty-state')return a?h(Empty,{description:'No data',imgSrc:c.kind==='image'?image:undefined},c.kind==='icon'?{image:icon}:undefined):h(GEmptyState,{},()=>[h('div',{class:'g-empty-visual'},c.kind==='image'?h('img',{src:image,alt:''}):icon()),h('div',{class:'g-empty-description'},'No data')]);
 if(c.family==='toast')return a?h(ArcoMessage,{type:state as any,duration:0,closable:close,onClose:()=>closed.value[key]=true},()=> 'Feedback message'):h(GToast,{state,'data-g-persistent':'true'},()=>[h('div',{class:'g-toast-content'},h('div',{class:'g-toast-message'},'Feedback message')),close?h('button',{type:'button',class:'g-toast-close','aria-label':'关闭',onClick:()=>closed.value[key]=true},'×'):null]);
 if(c.family==='page-loading')return a?h(Spin,{size:Number(c.size),tip:'Loading'}):h(GPageLoading,{style:{'--g-page-loading-size':\`\${c.size}px\`}},()=>h('div',{class:'g-page-loading-content'},[h('span',{class:'g-page-loading-indicator'},h('span',{class:'g-page-loading-ring'})),h('span',{class:'g-page-loading-description'},'Loading')]));
 if(c.family==='page-state-system')return a?h(Result,{status:state as any,title:'Result title',subtitle:'Result description'}):h(GPageStateSystem,{variant:state},()=>h('div',{class:'g-page-state-content'},[h('div',{class:'g-page-state-visual'}),h('div',{class:'g-page-state-body'},[h('div',{class:'g-page-state-title'},'Result title'),h('div',{class:'g-page-state-description'},'Result description')])]));
 if(c.family==='status-bar')return a?h(Button,{size:'medium'},()=> 'Ready'):h(GStatusBar,{role:'status'},()=>h(GButton,{},()=> 'Ready'));
 return null;
};}});
onMounted(()=>nextTick(()=>document.documentElement.dataset.feedbackReady='true'));
<\/script>
<template><main class="feedback-reference" :dir="rtl?'rtl':'ltr'" :data-g-mode="dark?'dark':'light'"><header><h1>反馈组件 · Arco 比例对照</h1><p>固定 Arco Design Vue 2.58.0，{{cases.length}} 组真实组件对照。状态栏比较其中的标准控件；上下文栏、页面加载与页面状态分别对照 Alert、Spin 和 Result。</p><a href="/?component=feedback#catalog">查看完整反馈演示与五框架参数</a></header><div class="feedback-controls"><label>组件<select v-model="filter"><option value="all">全部 9 项</option><option v-for="name in families" :key="name">{{name}}</option></select></label><label>进度<input v-model.number="value" type="range" min="0" max="100"></label><label><input v-model="rtl" type="checkbox">RTL</label><label><input v-model="dark" type="checkbox">深色</label><button @click="closed={}">恢复已关闭示例</button></div><section v-for="sample in shown" :key="sample.id" class="feedback-case" :data-case="sample.id" :data-family="sample.family"><h2>{{sample.id}}</h2><div class="feedback-pair"><div class="feedback-cell" data-library="gardener"><h3>Gardener · 五框架共享</h3><div class="feedback-measurement"><Specimen :sample="sample"/></div></div><div class="feedback-cell arco-scope" :arco-theme="dark?'dark':undefined" data-library="arco"><h3>Arco Design Vue · 2.58.0</h3><div class="feedback-measurement"><Specimen :sample="sample" reference/></div></div></div></section></main></template>
<style>body{margin:0}.feedback-reference{font-family:Arial,"Microsoft YaHei",sans-serif;font-size:14px;line-height:1.5715;padding:32px;max-width:1280px;margin:auto;color:var(--g-color-text);background:var(--g-color-canvas)}.feedback-reference h1{font-size:30px}.feedback-controls{display:flex;gap:16px;flex-wrap:wrap;align-items:center;padding:16px;border:1px solid var(--g-color-border);background:var(--g-color-surface);margin:24px 0}.feedback-controls label{display:flex;gap:8px;align-items:center}.feedback-controls select,.feedback-controls button{font:inherit;padding:6px;background:var(--g-color-surface);color:inherit;border:1px solid var(--g-color-border)}.feedback-case{margin:24px 0;border:1px solid var(--g-color-border);background:var(--g-color-surface)}.feedback-case>h2{font-size:16px;padding:12px 20px;margin:0;border-bottom:1px solid var(--g-color-border)}.feedback-pair{display:grid;grid-template-columns:1fr 1fr}.feedback-cell{padding:20px;min-width:0}.feedback-cell+div{border-inline-start:1px solid var(--g-color-border)}.feedback-cell>h3{font-size:12px;line-height:18px;font-weight:400;margin:0 0 20px;color:var(--g-color-text-muted)}.feedback-measurement{display:flex;align-items:center;min-height:48px;width:360px;max-width:100%}.feedback-measurement>.arco-result{width:100%;box-sizing:border-box}@media(max-width:640px){.feedback-reference{padding:16px}.feedback-pair{grid-template-columns:1fr}.feedback-cell+div{border-inline-start:0;border-top:1px solid var(--g-color-border)}}
</style>
`;export{e as default};