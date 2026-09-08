var e=`<script setup lang="ts">
import {h,ref,computed,defineComponent,onMounted,nextTick} from 'vue';
import {Button,ButtonGroup,Tag,Avatar,AvatarGroup,Card,Badge,Divider} from '@arco-design/web-vue';
import {GButton,GButtonGroup,GTag,GChip,GAvatar,GAvatarGroup,GCard,GBadge,GDividerWithText} from '@gardenerim/vue';
const params=new URLSearchParams(location.search),filter=ref(params.get('component')||'all'),disabled=ref(false),loading=ref(false),rtl=ref(false),dark=ref(false),notice=ref('点击组件可检查交互');
const families=['button','button-group','card','badge','tag','chip','badge-tag-chip','avatar','avatar-group','divider-with-text'];
type Case={id:string;family:string;label:string;size?:string;shape?:string;kind?:string;content?:string};
const cases:Case[]=[
 ...['mini','small','medium','large'].flatMap(size=>[{id:\`button-\${size}\`,family:'button',label:\`按钮 / \${size}\`,size},{id:\`button-icon-\${size}\`,family:'button',label:\`图标按钮 / \${size}\`,size,kind:'icon'},{id:\`button-loading-\${size}\`,family:'button',label:\`加载按钮 / \${size}\`,size,kind:'loading'}]),
 ...['square','round','circle'].map(shape=>({id:\`button-\${shape}\`,family:'button',label:\`形状 / \${shape}\`,shape})),
 ...['mini','small','medium','large'].map(size=>({id:\`group-\${size}\`,family:'button-group',label:\`按钮组 / \${size}\`,size})),
 ...['small','medium'].map(size=>({id:\`card-\${size}\`,family:'card',label:\`卡片 / \${size}\`,size})),
 ...['count','dot','status','attached'].map(kind=>({id:\`badge-\${kind}\`,family:'badge',label:\`徽标 / \${kind}\`,kind})),
 ...['tag','chip'].flatMap(family=>['small','default','medium','large'].map(size=>({id:\`\${family}-\${size}\`,family,label:\`\${family} / \${size}\`,size}))),
 {id:'tag-close',family:'tag',label:'可关闭标签',kind:'close'},{id:'tag-check',family:'tag',label:'可选标签',kind:'check'},
 {id:'legacy',family:'badge-tag-chip',label:'旧入口迁移到 Badge / Tag / Chip',kind:'legacy'},
 ...['24','32','40','56','80','120'].map(size=>({id:\`avatar-\${size}\`,family:'avatar',label:\`头像 / \${size}px\`,size})),
 {id:'avatar-square',family:'avatar',label:'方形头像',shape:'square'},
 {id:'avatar-group',family:'avatar-group',label:'头像组重叠'},
 ...['plain','text','start','end','vertical'].map(kind=>({id:\`divider-\${kind}\`,family:'divider-with-text',label:\`分割线 / \${kind}\`,kind})),
];
const shown=computed(()=>cases.filter(c=>filter.value==='all'||c.family===filter.value));
const closed=ref<Record<string,boolean>>({}),checked=ref<Record<string,boolean>>({});
const Specimen=defineComponent({props:{sample:{type:Object,required:true},reference:Boolean},setup(p){return()=>{
 const c=p.sample as Case,a=p.reference,key=\`\${a?'arco':'gardener'}-\${c.id}\`,size=c.size==='default'?'medium':c.size||'medium',text='Button',click=()=>notice.value=\`\${key} 已触发\`,busy=loading.value||c.kind==='loading';
 const icon=()=>h('svg',{width:'1em',height:'1em',viewBox:'0 0 16 16','aria-hidden':'true'},h('path',{d:'M8 2v12M2 8h12',fill:'none',stroke:'currentColor','stroke-width':1.5}));
 if(c.family==='button')return a?h(Button,{size: size as any,type:'primary',shape:c.shape as any,disabled:disabled.value,loading:busy,onClick:click,'aria-label':c.kind==='icon'?'添加':undefined},c.kind==='icon'?{icon}:{default:()=>text}):h(GButton,{variant:['primary',size,c.shape||'',c.kind==='icon'?'icon':''].filter(Boolean),state:busy?'loading':undefined,disabled:disabled.value,'aria-busy':busy||undefined,onClick:click,'aria-label':c.kind==='icon'?'添加':undefined},()=>c.kind==='icon'?icon():text);
 if(c.family==='button-group')return a?h(ButtonGroup,{},()=>['One','Two','Three'].map(t=>h(Button,{size:size as any,type:'primary',disabled:disabled.value,onClick:click},()=>t))):h(GButtonGroup,{variant:['primary',size],role:'group','aria-label':'操作组',state:disabled.value?'disabled':undefined},()=>['One','Two','Three'].map(t=>h(GButton,{onClick:click},()=>t)));
 if(c.family==='card')return a?h(Card,{title:'Card title',size:size==='small'?'small':'medium',loading:loading.value,style:{width:'100%'}},{default:()=> 'Card content',extra:()=>h('span','More')}):h(GCard,{style:{width:'100%'},variant:size,state:[disabled.value?'disabled':'',loading.value?'loading':''].filter(Boolean)},()=>[h('div',{class:'g-card-header'},[h('h3',{class:'g-card-title'},'Card title'),h('span',{class:'g-card-extra'},'More')]),h('div',{class:'g-card-body'},'Card content')]);
 if(c.family==='badge'){
  const content=()=>h('span',{class:'badge-target'},'Inbox');
  if(a)return h(Badge,{count:12,dot:c.kind==='dot',status:c.kind==='status'?'success':undefined,text:c.kind==='status'?'Success':undefined},c.kind==='attached'?{default:content}:undefined);
  if(c.kind==='status')return h(GBadge,{variant:'status',state:'success'},()=>[h('span',{class:'g-badge-dot'}),h('span',{class:'g-badge-status-text'},'Success')]);
  if(c.kind==='dot')return h('span',{class:'g-badge-dot'});
  return h(GBadge,{variant:c.kind==='attached'?'attached':['count','solid'],state:'danger'},()=>c.kind==='attached'?[content(),h('span',{class:'g-badge-indicator'},'12')]:'12');
 }
 if(['tag','chip','badge-tag-chip'].includes(c.family)){
  if(closed.value[key])return h('span',{class:'removed'},'已移除');
  const label=c.kind==='legacy'?'Legacy':'Tag',check=()=>{checked.value[key]=!checked.value[key];notice.value=\`\${key}：\${checked.value[key]}\`;};
  if(a)return h(Tag,{style:c.family==='chip'?{borderRadius:'9999px'}:undefined,size:(c.size||'default') as any,closable:c.kind==='close',checkable:c.kind==='check',checked:!!checked.value[key],disabled:disabled.value,onClose:()=>{closed.value[key]=true;},onCheck:check},()=>label);
  return h(c.family==='chip'?GChip:GTag,{as:c.kind==='check'?'button':'span',variant:[c.size||'default',c.kind==='check'?'checkable':''].filter(Boolean),disabled:c.kind==='check'?disabled.value:undefined,'aria-disabled':disabled.value||undefined,'aria-pressed':c.kind==='check'?!!checked.value[key]:undefined,onClick:c.kind==='check'?check:undefined},()=>[h('span',{class:c.family==='chip'?'g-chip-label':'g-tag-label'},label),c.kind==='close'?h('button',{class:'g-tag-close',type:'button','aria-label':'移除 Tag',onClick:()=>{closed.value[key]=true;}},'×'):null]);
 }
 if(c.family==='avatar')return a?h(Avatar,{size:Number(c.size||40),shape:c.shape as any},()=> 'A'):h(GAvatar,{variant:c.shape||'circle',style:{'--g-avatar-size':\`\${c.size||40}px\`}},()=>h('span',{class:'g-avatar-text'},'A'));
 if(c.family==='avatar-group')return a?h(AvatarGroup,{},()=>['A','B','C'].map(t=>h(Avatar,{},()=>t))):h(GAvatarGroup,{role:'group','aria-label':'成员'},()=>['A','B','C'].map(t=>h(GAvatar,{},()=>h('span',{class:'g-avatar-text'},t))));
 if(c.family==='divider-with-text')return a?h(Divider,{direction:c.kind==='vertical'?'vertical':'horizontal',orientation:c.kind==='start'?'left':c.kind==='end'?'right':'center'},c.kind==='plain'||c.kind==='vertical'?undefined:()=> 'Text'):h(GDividerWithText,{variant:c.kind==='vertical'?'vertical':c.kind,role:'separator','aria-orientation':c.kind==='vertical'?'vertical':'horizontal'},()=>c.kind==='plain'||c.kind==='vertical'?[]:[h('span',{class:'g-divider-text'},'Text')]);
 return null;
};}});
const reset=()=>{disabled.value=false;loading.value=false;rtl.value=false;closed.value={};checked.value={};notice.value='已重置';};
onMounted(()=>nextTick(()=>document.documentElement.dataset.basicReady='true'));
<\/script>
<template>
 <main class="basic-reference" :data-g-mode="dark?'dark':'light'" :arco-theme="dark?'dark':undefined" :dir="rtl?'rtl':'ltr'">
  <header><p>GARDENER / BASIC</p><h1>基础组件 · 比例对照</h1><p>使用 Arco Design Vue 2.58.0 的真实组件对照尺寸、留白和文字比例。Chip 对照圆角 Tag；兼容入口展示迁移目标。</p><a href="/?component=basic#catalog">查看完整基础演示</a> · <a href="https://arco.design/vue/component/button" target="_blank" rel="noreferrer">Arco 官方文档</a></header>
  <div class="reference-controls"><label>组件<select v-model="filter"><option value="all">全部 10 项</option><option v-for="name in families" :key="name">{{name}}</option></select></label><label><input v-model="disabled" type="checkbox">禁用</label><label><input v-model="loading" type="checkbox">加载</label><label><input v-model="rtl" type="checkbox">RTL</label><label><input v-model="dark" type="checkbox">深色</label><button @click="reset">重置</button><output aria-live="polite">{{notice}}</output></div>
  <section v-for="sample in shown" :key="sample.id" class="comparison" :data-case="sample.id" :data-family="sample.family"><h2>{{sample.label}}</h2><div class="comparison-pair"><div class="comparison-cell" data-library="gardener"><h3>Gardener · 五框架共享</h3><div class="measurement"><Specimen :sample="sample" /></div></div><div class="comparison-cell arco-scope" :arco-theme="dark?'dark':undefined" data-library="arco"><h3>Arco Design Vue · 2.58.0</h3><div class="measurement"><Specimen :sample="sample" reference /></div></div></div></section>
 </main>
</template>
<style>
body{margin:0}.basic-reference{padding:32px;max-width:1200px;margin:auto;background:var(--g-color-canvas);color:var(--g-color-text);font-family:Arial,"Microsoft YaHei",sans-serif;font-size:14px;line-height:1.5715}.basic-reference header{margin-bottom:28px}.basic-reference h1{font-size:32px;margin:8px 0}.basic-reference header p{max-width:780px}.reference-controls{display:flex;gap:16px;flex-wrap:wrap;align-items:center;padding:16px;background:var(--g-color-surface);position:sticky;top:0;z-index:20;border:1px solid var(--g-color-border)}.reference-controls label{display:flex;gap:6px;align-items:center}.reference-controls select,.reference-controls button{padding:6px;background:var(--g-color-surface);color:inherit;border:1px solid var(--g-color-border)}.comparison{margin:24px 0;border:1px solid var(--g-color-border);border-radius:4px;background:var(--g-color-surface)}.comparison>h2{margin:0;padding:12px 20px;font-size:16px;border-bottom:1px solid var(--g-color-border)}.comparison-pair{display:grid;grid-template-columns:1fr 1fr}.comparison-cell{min-width:0;padding:20px}.comparison-cell+div{border-inline-start:1px solid var(--g-color-border)}.comparison-cell>h3{line-height:18px;font-size:12px;font-weight:400;color:var(--g-color-text-muted);margin:0 0 20px}.measurement{width:300px;max-width:100%;min-height:48px;display:flex;align-items:center}.measurement>.g-card,.measurement>.arco-card{font-family:inherit}.badge-target{display:inline-flex;padding:10px;background:var(--g-color-surface-subtle);font-size:14px}.removed{font-size:12px;color:var(--g-color-text-muted)}@media(max-width:640px){.basic-reference{padding:16px}.comparison-pair{grid-template-columns:1fr}.comparison-cell+div{border-inline-start:0;border-top:1px solid var(--g-color-border)}.reference-controls{position:static}}
</style>
`;export{e as default};