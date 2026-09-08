var e=`<script setup lang="ts">
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue';
import { GardenerimComponent, componentByName, type GardenerimNavigationOptions, type GardenerimNavigationItem } from '@gardenerim/vue';
import catalog from '../data/navigation-examples.json';
import parameters from '../data/navigation-release-parameters.json';
const params=new URLSearchParams(location.search),name=params.get('component')||'navbar';
const example=(catalog as Record<string,any>)[name],scenario=example.scenarios.find((s:any)=>s.id===params.get('scenario'))||example.scenarios[0];
const definition=componentByName.get(name)!;
const variant=ref(params.get('variant')||''),instance=ref<any>(),guardMode=ref('default');
const advanced=ref<Record<string,any>>(Object.fromEntries(parameters.map(p=>[p[0],p[3]])));
const setNumeric=(p:any[],input:HTMLInputElement)=>{const n=input.value===''?Number(p[3]):Number(input.value);const value=Math.min(Number(p[5]),Math.max(Number(p[4]),Number.isFinite(n)?n:Number(p[3])));advanced.value[String(p[0])]=value;input.value=String(value);};
const configurable=computed(()=>parameters.filter(p=>!(['popupWidth','popupMaxHeight','closeOnOutside','closeOnEscape'].includes(String(p[0]))&&example.family!=='menus')));
const guard=async (_change:unknown,signal:AbortSignal)=>{if(guardMode.value==='reject')return false;if(guardMode.value==='timeout')return new Promise<boolean>(()=>{});if(guardMode.value==='deferred')return new Promise<boolean>(resolve=>{const timer=setTimeout(()=>resolve(true),600);signal.addEventListener('abort',()=>{clearTimeout(timer);resolve(false);},{once:true});});if(example.family==='steps'&&!allowChange.value){notice.value='请先勾选「校验通过」再继续。';return false;}return true;};
const original=structuredClone(scenario.options),items=ref<GardenerimNavigationItem[]>(original.items),value=ref<string|number>(original.defaultValue??''),size=ref(original.size||'medium'),appearance=ref(original.appearance||'default'),orientation=ref(original.orientation||(['sidebar','navigation-rail','activity-bar','vertical-tabs','tree-navigation','wizard-navigation','anchor-navigation','scrollspy-navigation','jump-navigation'].includes(name)?'vertical':'horizontal'));
const disabled=ref(false),loading=ref(false),empty=ref(false),rtl=ref(false),allowChange=ref(true),notice=ref('尚未操作'),count=ref(20),pageSize=ref(original.pageSize||10),hasNext=ref(true),generation=ref(0);
const timers=new Set<ReturnType<typeof setTimeout>>();const delay=(fn:()=>void)=>{const timer=setTimeout(()=>{timers.delete(timer);fn();},600);timers.add(timer);};
const options=computed<GardenerimNavigationOptions>(()=>({...original,...advanced.value,variant:variant.value||undefined,selectionTimeout:guardMode.value==='timeout'?200:advanced.value.selectionTimeout,items:empty.value?[]:items.value,size:variant.value?undefined:size.value,appearance:variant.value?undefined:appearance.value,orientation:variant.value?undefined:orientation.value,disabled:disabled.value,loading:loading.value,pageSize:pageSize.value,hasPrevious:count.value>20,hasNext:hasNext.value,
 description:example.family==='pages'?\`已加载 \${count.value} 条记录\`:original.description,
 beforeChange:guard,
}));
const event=(label:string,detail?:unknown)=>{notice.value=\`\${label}\${detail===undefined?'':\`：\${typeof detail==='object'?JSON.stringify(detail):detail}\`}\`;};
const load=()=>{loading.value=true;delay(()=>{count.value+=20;hasNext.value=count.value<80;loading.value=false;event('本地数据已加载',count.value);});};
const reset=()=>{variant.value='';guardMode.value='default';advanced.value=Object.fromEntries(parameters.map(p=>[p[0],p[3]]));timers.forEach(clearTimeout);timers.clear();document.getElementById('navigation-scroll-area')?.scrollTo({top:0,behavior:'instant'});size.value=original.size||'medium';appearance.value=original.appearance||'default';orientation.value=original.orientation||(['sidebar','navigation-rail','activity-bar','vertical-tabs','tree-navigation','wizard-navigation','anchor-navigation','scrollspy-navigation','jump-navigation'].includes(name)?'vertical':'horizontal');rtl.value=false;allowChange.value=true;pageSize.value=original.pageSize||10;items.value=structuredClone(original.items);value.value=original.defaultValue??'';disabled.value=false;loading.value=false;empty.value=false;notice.value='已重置';count.value=20;hasNext.value=true;generation.value++;};
let observer:ResizeObserver;
onMounted(()=>{const content=document.getElementById('navigation-preview')!;observer=new ResizeObserver(()=>parent.postMessage({type:'gardener-preview-size',name,height:Math.min(1100,Math.max(['menus'].includes(example.family)?650:420,content.scrollHeight+30))},location.origin));observer.observe(content);nextTick(()=>{(window as any).__demoAudit={name,ready:true,statuses:[],implementation:'shared-navigation'};document.documentElement.dataset.demoReady='true';});});
onBeforeUnmount(()=>{observer?.disconnect();timers.forEach(clearTimeout);});
<\/script>
<template>
 <main id="navigation-preview" class="navigation-preview">
  <div class="navigation-settings">
   <label>变体<select v-model="variant" aria-label="变体"><option value="">自定义参数</option><option v-for="v in definition.variants||[]" :key="v" :value="v">{{v}}</option></select></label>
   <label>尺寸<select v-model="size" aria-label="尺寸" :disabled="!!variant"><option value="small">小</option><option value="medium">中</option><option value="large">大</option></select></label>
   <label>外观<select v-model="appearance" aria-label="外观" :disabled="!!variant"><option value="default">默认</option><option value="line">下划线</option><option value="pill">胶囊</option><option value="card">卡片</option><option value="contained">容器</option></select></label>
   <label>方向<select v-model="orientation" aria-label="方向" :disabled="!!variant"><option value="horizontal">横向</option><option value="vertical">纵向</option></select></label>
   <label><input v-model="disabled" type="checkbox">禁用</label><label><input v-model="loading" type="checkbox">加载</label><label><input v-model="empty" type="checkbox">空数据</label><label><input v-model="rtl" type="checkbox">RTL</label>
   <button type="button" class="g-btn g-btn-outline" @click="reset">重置</button>
  </div>
  <details class="navigation-config"><summary>显示、布局与交互参数</summary><div class="navigation-settings">
   <label v-for="p in configurable" :key="String(p[0])">{{p[1]}}<input v-if="p[2]==='boolean'" v-model="advanced[String(p[0])]" type="checkbox" :aria-label="String(p[1])"><input v-else :value="advanced[String(p[0])]" @change="setNumeric(p,$event.target as HTMLInputElement)" type="number" :min="Number(p[4])" :max="Number(p[5])" :aria-label="String(p[1])"></label>
   <label>选择校验<select v-model="guardMode" aria-label="选择校验"><option value="default">正常通过</option><option value="reject">拒绝切换</option><option value="deferred">延迟通过</option><option value="timeout">超时模拟</option></select></label>
   <button type="button" class="g-btn g-btn-outline" @click="instance?.getInstance('navigation')?.cancel()">取消待处理选择</button>
  </div><p class="navigation-hint">长度单位为像素；超时单位为毫秒，0 表示不限制。变体模式采用预设尺寸和外观；选回自定义参数可逐项调整。</p></details>
  <label v-if="example.family==='steps'" class="navigation-guard"><input v-model="allowChange" type="checkbox">校验通过（取消勾选可验证步骤拦截）</label>
  <p v-if="name==='skip-navigation'" class="navigation-hint">按 Tab 聚焦跳转链接，再按 Enter 进入下方正文。</p>
  <p v-if="name==='back-to-top'" class="navigation-hint">向下滚动下方内容区，返回顶部按钮会在超过阈值后出现。</p>
  <div class="navigation-live" :dir="rtl?'rtl':'ltr'">
   <GardenerimComponent ref="instance" :key="generation" :definition="definition" v-model="value" :navigation="options"
    @change="event('选中值',value)" @select="(item:any)=>event('选择',item.label)" @update:open="(v:boolean)=>event(v?'已打开':'已关闭')"
    @update:collapsed="(v:boolean)=>event('折叠',v)" @update:expanded-keys="(v:string[])=>event('展开节点',v)"
    @update:page-size="(v:number)=>{pageSize=v;event('每页数量',v)}" @load-more="load" @next="load" @previous="count=Math.max(20,count-20)"
    @back="event('返回请求，交给应用路由处理')" @close-item="(item:any)=>{items=items.filter(i=>i.id!==item.id);if(value===item.id)value=items[0]?.id??'';event('已关闭',item.label)}"
    @check="(detail:any)=>event('勾选',detail)" @error="event('校验失败')" />
  </div>
  <section v-if="example.family==='location'" id="navigation-scroll-area" class="navigation-scroll" tabindex="0" aria-label="示例正文滚动区">
   <article v-for="section in [{id:'intro',title:'概览'},{id:'usage',title:'使用方式'},{id:'api',title:'参数说明'}]" :id="\`nav-section-\${section.id}\`" :key="section.id" tabindex="-1"><h3>{{section.title}}</h3><p>独立滚动容器中的真实定位目标。点击导航或滚动正文可以验证位置同步。</p><p>内容区域采用普通语义化 HTML，可直接接入文章、帮助文档和设置页面。</p></article>
  </section>
  <output class="navigation-output" aria-live="polite"><span>当前值：<b>{{value || '未选择'}}</b></span><span>{{notice}}</span></output>
  <details class="navigation-config"><summary>当前参数 JSON</summary><pre>{{JSON.stringify({...options,beforeChange:options.beforeChange?'异步校验回调':undefined},null,2)}}</pre></details>
 </main>
</template>
<style>
.navigation-preview{padding:20px;font-family:var(--g-font-sans);color:var(--g-color-text)}.navigation-settings{display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:12px;margin-bottom:24px;border-radius:8px;background:var(--g-color-surface-subtle);font-size:13px}.navigation-settings label{display:flex;align-items:center;gap:6px}.navigation-settings select{padding:6px 8px;border:1px solid var(--g-color-border);border-radius:4px;background:var(--g-color-surface);color:inherit}.navigation-settings input{accent-color:var(--g-color-primary)}.navigation-settings input[type=number]{width:88px;padding:5px;border:1px solid var(--g-color-border);border-radius:4px}.navigation-live{min-height:100px}.navigation-output{display:flex;gap:16px;flex-wrap:wrap;margin-top:24px;padding:12px;border-left:3px solid var(--g-color-primary);background:var(--g-color-primary-soft);font-size:13px;overflow-wrap:anywhere}.navigation-config{margin-top:18px;font-size:12px}.navigation-config pre{max-height:320px;overflow:auto;white-space:pre-wrap}.navigation-scroll{height:280px;overflow:auto;margin-top:20px;border:1px solid var(--g-color-border);border-radius:6px}.navigation-scroll article{min-height:300px;padding:24px}.navigation-scroll article+article{border-top:1px solid var(--g-color-border)}.navigation-guard{display:block;margin-bottom:20px}.navigation-hint{font-size:13px;color:var(--g-color-text-muted)}
</style>
`;export{e as default};