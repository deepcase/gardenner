var e=`<script setup lang="ts">
import {ref,computed,onBeforeUnmount} from 'vue';
import {GAlert,GButton,GProgressMeter,GSpinnerSkeleton,GStatusBar,GContextBar,GPageStateSystem,toast} from '@gardenerim/vue';
const tone=ref('info'),withTitle=ref(true),closable=ref(true),visible=ref(true),disabled=ref(false),dismissed=ref<unknown>('尚未关闭');
const value=ref(60),min=ref(0),max=ref(100),buffer=ref(80),size=ref('medium'),shape=ref('line'),unknown=ref(false),loading=ref(false),delay=ref(300),clicks=ref(0);
const result=ref('success'),position=ref<'top'|'bottom'>('top'),timeout=ref(3000),maximum=ref(3),framework=ref('Vue'),message=ref('尚未发送消息');
const progressConfig=computed(()=>({feedbackValue:value.value,feedbackMin:min.value,feedbackMax:max.value,feedbackBuffer:buffer.value}));
const snippets:Record<string,string>={
 Vue:\`<GProgressMeter :variant="['line',size]" aria-label="任务进度"
  :config="{feedbackValue:value,feedbackMin:0,feedbackMax:100}">
  <span class="g-progress-bar" />
</GProgressMeter>\`,
 React:\`<GProgressMeter variant={['line',size]} aria-label="任务进度"
  config={{feedbackValue:value,feedbackMin:0,feedbackMax:100}}>
  <span className="g-progress-bar" />
</GProgressMeter>\`,
 AngularJS:\`<div g-progress-meter gardener-variant="line {{size}}" aria-label="任务进度"
  gardener-config="{feedbackValue:value,feedbackMin:0,feedbackMax:100}">
  <span class="g-progress-bar"></span>
</div>\`,
 CSS:\`<div class="g-progress g-progress-line" aria-label="任务进度"
  data-g-feedback-value="60" data-g-feedback-min="0" data-g-feedback-max="100">
  <span class="g-progress-bar"></span>
</div>
// init(root); 修改 data-g-feedback-value 后自动更新样式与 ARIA。\`,
 Blazor:\`<GProgressMeter Variant="line" aria-label="任务进度"
  Config="@(new Dictionary<string,object?> { ["feedbackValue"]=value,
    ["feedbackMin"]=0, ["feedbackMax"]=100 })">
  <span class="g-progress-bar"></span>
</GProgressMeter>\`};
const send=()=>{toast({id:'feedback-live',tone:tone.value as 'info',message:'任务状态已更新',position:position.value,timeout:timeout.value,maxCount:maximum.value,closable:closable.value,onClose:reason=>message.value=\`关闭原因：\${reason}\`});message.value='相同 id 可更新已有消息';};
const queue=()=>{for(let i=1;i<=5;i++)toast({message:\`第 \${i} 条消息\`,position:position.value,timeout:timeout.value,maxCount:maximum.value,closable:true});message.value=\`发送 5 条，队列上限 \${maximum.value}\`;};
onBeforeUnmount(()=>toast.clear());
<\/script>
<template><section class="feedback-contract-panel">
 <h3>反馈参数 · 五框架共享</h3><p>直接切换参数验证视觉、数值和交互。<a href="./feedback.html">打开 55 组 Arco 真实组件对照</a></p>
 <div class="feedback-parameter-row"><label>语义状态<select v-model="tone"><option v-for="s in ['info','success','warning','error','loading','normal']" :key="s">{{s}}</option></select></label><label><input v-model="withTitle" type="checkbox">显示标题</label><label><input v-model="closable" type="checkbox">允许关闭</label><label><input v-model="disabled" type="checkbox">禁用操作</label><GButton @click="visible=true">恢复提示</GButton></div>
 <GAlert v-if="visible" id="feedback-controlled-alert" :variant="withTitle?'with-title':undefined" :state="[tone,disabled?'disabled':''].filter(Boolean)" role="status" model-event="dismiss" model-key="reason" v-model="dismissed" @update:model-value="visible=false" :config="{feedbackControlled:true}"><div class="g-alert-body"><div v-if="withTitle" class="g-alert-title">任务状态</div><div class="g-alert-content">关闭事件通过相同协议传回当前框架，页面决定是否移除提示。</div></div><button v-if="closable" type="button" class="g-alert-close" data-g-feedback-dismiss aria-label="关闭参数提示">×</button></GAlert><output aria-live="polite">关闭结果：{{dismissed}}</output>
 <div class="feedback-parameter-row"><label>进度值<input v-model.number="value" type="number"></label><label>最小值<input v-model.number="min" type="number"></label><label>最大值<input v-model.number="max" type="number"></label><label>缓冲值<input v-model.number="buffer" type="number"></label><label>进度尺寸<select v-model="size"><option v-for="s in ['small','medium','large']" :key="s">{{s}}</option></select></label><label>进度形态<select v-model="shape"><option v-for="s in ['line','circle','dashboard','steps']" :key="s">{{s}}</option></select></label><label><input v-model="unknown" type="checkbox">未知进度</label></div>
 <GProgressMeter id="feedback-progress" :variant="[shape,size,'buffered']" :state="unknown?'indeterminate':undefined" :config="progressConfig" aria-label="参数任务进度"><template v-if="shape==='line'"><span class="g-progress-buffer"/><span class="g-progress-bar"/></template><template v-else-if="shape==='steps'"><span v-for="i in 5" :key="i" class="g-progress-step"/></template><span v-else class="g-progress-text" data-g-feedback-value-text /></GProgressMeter>
 <div class="feedback-parameter-row"><label><input v-model="loading" type="checkbox">加载内容</label><label>显示延迟（毫秒）<input v-model.number="delay" type="number" min="0" max="3000"></label></div>
 <GSpinnerSkeleton id="feedback-loading" variant="overlay" :config="{feedback:true,feedbackLoading:loading,feedbackDelay:delay}" aria-label="区域加载"><div class="g-spinner-content feedback-sample-content"><GButton @click="clicks++">内容操作</GButton><output>操作次数：{{clicks}}</output><p>加载期间内容不可点击或通过键盘操作；完成后恢复。</p></div></GSpinnerSkeleton>
 <div class="feedback-parameter-row"><label>消息位置<select v-model="position"><option>top</option><option>bottom</option></select></label><label>消息时长（毫秒）<input v-model.number="timeout" type="number" min="0"></label><label>队列上限<input v-model.number="maximum" type="number" min="1" max="10"></label><GButton @click="send">发送或更新消息</GButton><GButton @click="queue">连续发送 5 条</GButton><GButton @click="toast.clear()">清空消息</GButton><output aria-live="polite">{{message}}</output></div>
 <GContextBar :state="tone" :config="progressConfig" aria-label="同步上下文"><div class="g-context-bar-body"><div class="g-context-bar-content">上下文进度与主任务同步</div></div><div class="g-context-bar-progress" aria-label="上下文进度"/></GContextBar>
 <GStatusBar variant="responsive" :state="disabled?'disabled':undefined" :config="progressConfig" aria-label="任务状态栏"><span class="g-status-bar-item">当前状态：{{tone}}</span><GButton @click="value=0">重置进度</GButton><span class="g-status-bar-progress" aria-label="状态栏进度"/></GStatusBar>
 <div class="feedback-parameter-row"><label>结果类型<select v-model="result"><option v-for="s in ['success','info','warning','error','403','404','500']" :key="s">{{s}}</option></select></label></div><GPageStateSystem :variant="result"><div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true"/><div class="g-page-state-body"><div class="g-page-state-title">{{result}} · 任务结果</div><div class="g-page-state-description">结果页遵循 Arco Result 的图标、标题与留白比例。</div></div><div class="g-page-state-actions"><GButton @click="result='success'">重新处理</GButton></div></div></GPageStateSystem>
 <label>框架写法<select v-model="framework"><option v-for="name in ['Vue','React','AngularJS','CSS','Blazor']" :key="name">{{name}}</option></select></label><pre>{{snippets[framework]}}</pre>
</section></template>
<style scoped>.feedback-contract-panel{padding:24px;border:1px solid var(--g-color-border);background:var(--g-color-surface);min-width:0}.feedback-contract-panel h3{font-size:22px;margin:0 0 12px}.feedback-parameter-row{display:flex;gap:16px;flex-wrap:wrap;align-items:center;margin:24px 0}.feedback-parameter-row label{display:flex;gap:8px;align-items:center}.feedback-parameter-row input[type=number]{width:84px}.feedback-contract-panel input,.feedback-contract-panel select{font:inherit;color:inherit;background:var(--g-color-surface);border:1px solid var(--g-color-border);padding:4px}.feedback-sample-content{padding:24px;border:1px dashed var(--g-color-border)}.feedback-contract-panel pre{padding:16px;white-space:pre-wrap;overflow-wrap:anywhere;background:var(--g-color-surface-subtle);font-size:13px}.feedback-contract-panel>a,.feedback-contract-panel p>a{color:var(--g-color-primary-text);text-decoration:underline}</style>
`;export{e as default};