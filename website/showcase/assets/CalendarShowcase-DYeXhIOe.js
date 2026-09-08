var e=`<script setup lang="ts">
import {computed,onMounted,ref} from 'vue';
import {GCalendar} from '@gardenerim/vue';
import type {GardenerimDataDisplayOptions} from '@gardenerim/css/runtime';
const labels={previous:'上一页',next:'下一页',today:'今天',month:'月',year:'年',view:'日历视图',more:'项',retry:'重试',left:'上个月',right:'下个月','double-left':'上一年','double-right':'下一年'};
const common:GardenerimDataDisplayOptions={defaultValue:'2026-09-07',defaultPageShowDate:'2026-09-01',locale:'zh-CN',labels};
const events=[{id:1,date:'2026-09-07',label:'设计评审',status:'info'},{id:2,date:'2026-09-10',label:'版本发布',status:'success'},{id:3,start:'2026-09-14',end:'2026-09-16',label:'产品共创工作坊',status:'warning'},{id:4,date:'2026-09-18',label:'客户访谈'},{id:5,date:'2026-09-18',label:'验收测试',status:'danger'},{id:6,date:'2026-09-18',label:'更新文档'}];
const cfg=(options:GardenerimDataDisplayOptions)=>({'data-options':JSON.stringify({...common,...options})});
const header=ref<'button'|'select'>('button'),first=ref<0|1>(0),size=ref<'medium'|'small'>('medium'),border=ref(true),showEvents=ref(true),last=ref('选择日期或切换视图，观察变更。');
const playground=computed(()=>cfg({label:'项目日历',headerType:header.value,dayStartOfWeek:first.value,size:size.value,bordered:border.value,items:events,showCalendarEvents:showEvents.value}));
function record(event:Event){const detail=(event as CustomEvent).detail;last.value=\`\${detail.reason==='select'?'选择日期':'切换视图'} · \${detail.modelValue??'未选择'} · 当前页 \${detail.pageShowDate} · \${detail.mode}\`;}
const selected=ref<string|null>('2026-09-07'),page=ref('2026-09-01');
function controlled(event:Event){const d=(event as CustomEvent).detail;if(d.reason==='select')selected.value=d.modelValue;if(['panel','month'].includes(d.reason))page.value=d.pageShowDate;}
const custom=ref<any>(),remote=ref<any>(),remoteState=ref('点击加载，获取本月日程。'),fault=ref(false),state=ref<'normal'|'loading'|'error'|'disabled'|'readonly'>('normal');
onMounted(()=>{
 custom.value?.getInstance('data-display')?.setOptions({dateInnerContent:(_date:Date,ctx:{date:string})=>{const day=Number(ctx.date.slice(-2));const node=document.createElement('span');node.textContent=day%5===0?'¥ '+(320+day*12):day%7===0?'已约满':'';node.style.color=day%7===0?'var(--g-color-text-muted)':'var(--g-color-primary-text)';return node;}});
 remote.value?.getInstance('data-display')?.setOptions({load:async({signal,pageShowDate}:{signal:AbortSignal;pageShowDate:string})=>{remoteState.value='正在加载 '+pageShowDate.slice(0,7)+'…';await new Promise(resolve=>setTimeout(resolve,400));if(signal.aborted)return [];if(fault.value)throw new Error('模拟请求失败，请关闭故障开关后重试。');remoteState.value='日程已加载';return [{id:'meeting',date:pageShowDate.slice(0,7)+'-12',label:'项目复盘',status:'success'},{id:'review',date:pageShowDate.slice(0,7)+'-20',label:'设计交付'}];}});
});
<\/script>

<template>
 <div class="calendar-showcase">
  <h2>Calendar <small>GCalendar</small></h2>
  <p>参考 Arco Calendar 的月视图、年视图与卡片比例。日期、展示月份和模式独立配置，适用于日程、预约、排期与数据总览。</p>
  <section data-calendar-demo="playground"><h3>基础与参数实验</h3><p>日期单元格默认 100px，表头控件 28px。可切换下拉表头、周起始日、密度、边框及日程内容。</p>
   <div class="calendar-controls"><label>表头 <select v-model="header"><option value="button">按钮切换</option><option value="select">下拉选择</option></select></label><label>周起始日 <select v-model="first"><option :value="0">周日</option><option :value="1">周一</option></select></label><label>密度 <select v-model="size"><option value="medium">标准</option><option value="small">紧凑</option></select></label><label><input v-model="border" type="checkbox">边框</label><label><input v-model="showEvents" type="checkbox">日程</label></div>
   <GCalendar :config="playground" @gardener:change="record"/><output>{{last}}</output>
  </section>
  <section data-calendar-demo="panel"><h3>卡片日历与月份选择</h3><p>默认宽度 265px；点击卡片标题切换月份选择，支持前后跨年、今天按钮与自定义宽度。</p><div class="calendar-cards"><GCalendar :config="cfg({panel:true,panelTodayBtn:true,label:'紧凑卡片',items:events})"/><GCalendar :config="cfg({panel:true,panelWidth:320,defaultMode:'year',label:'选择月份',panelOperations:['double-left','double-right']})"/></div></section>
  <section data-calendar-demo="controlled"><h3>受控日期与展示月份</h3><p>选中值与当前页独立保存。翻月不会修改选中日期，外部操作可以清空日期或跳转月份。</p><div class="calendar-controls"><button type="button" @click="selected=null">清空选择</button><button type="button" @click="page='2026-12-01'">跳到十二月</button><output>选中：{{selected??'无'}} · 当前页：{{page}}</output></div><GCalendar :config="cfg({modelValue:selected,pageShowDate:page,headerType:'select',calendarDayHeight:72,label:'受控日历'})" @gardener:change="controlled"/></section>
  <section data-calendar-demo="year"><h3>全年总览</h3><p>十二个月份与日期一览。桌面四列，窄屏自动调整为两列或单列；点击月份标题返回该月。</p><GCalendar :config="cfg({defaultMode:'year',label:'年度计划',items:events})"/></section>
  <section data-calendar-demo="limits"><h3>日期范围与不可选日期</h3><p>仅开放 9 月至 10 月的工作日，9 月 15 日不可预约。键盘方向键自动跳过不可选日期，Page Up / Down 翻月。</p><GCalendar :config="cfg({minDate:'2026-09-01',maxDate:'2026-10-31',disabledWeekdays:[0,6],disabledDates:['2026-09-15'],calendarDayHeight:72,dayStartOfWeek:1,label:'工作日预约'})"/></section>
  <section data-calendar-demo="week"><h3>整周选择与多日期选择</h3><p>整周选择以点击的日期作为值，并突出显示所在周；多日期模式适合预约多个时间。</p><div class="calendar-cards"><GCalendar :config="cfg({panel:true,isWeek:true,dayStartOfWeek:1,label:'选择整周'})"/><GCalendar :config="cfg({panel:true,selection:'multiple',selectedKeys:['2026-09-07','2026-09-10'],label:'选择多个日期'})"/></div></section>
  <section data-calendar-demo="custom"><h3>自定义日期内容</h3><p>日期格中显示价格与预约状态。dateRender 可以替换整个日期内容，dateInnerContent 保留原生日期与可访问名称。</p><GCalendar ref="custom" :config="cfg({label:'预约价格',maxEvents:1})"/></section>
  <section data-calendar-demo="states"><h3>加载、错误、禁用与只读</h3><div class="calendar-controls"><label>状态 <select v-model="state"><option value="normal">正常</option><option value="loading">加载</option><option value="error">错误</option><option value="disabled">禁用</option><option value="readonly">只读</option></select></label></div><GCalendar :config="cfg({panel:true,label:'状态演示',loading:state==='loading',error:state==='error'?'暂时无法获取日程，请稍后重试。':'',disabled:state==='disabled',allowSelect:state!=='readonly'})"/></section>
  <section data-calendar-demo="remote"><h3>按月加载与错误恢复</h3><p>共享加载接口带有取消信号；新请求会取消上一次请求，组件卸载后不再写入数据。</p><div class="calendar-controls"><label><input v-model="fault" type="checkbox">模拟故障</label><button type="button" @click="remote?.getInstance('data-display')?.load()">加载当前月</button><output>{{remoteState}}</output></div><GCalendar ref="remote" :config="cfg({label:'远程日程',calendarDayHeight:72})"/></section>
  <section><h3>统一接入</h3><pre><code>&lt;GCalendar :config="{ dataOptions: JSON.stringify({
  defaultValue: '2026-09-07', headerType: 'select',
  dayStartOfWeek: 1, panel: true, panelWidth: 265
}) }" /&gt;</code></pre><p>CSS、Vue、React、AngularJS、Blazor 使用同一 dataOptions 配置和 data-display 实例。函数渲染与加载器通过实例 setOptions 注入。</p><p><a href="https://arco.design/vue/component/calendar" target="_blank" rel="noreferrer">Arco Calendar 参考</a> · <a href="http://127.0.0.1:4187/examples/calendar.html" target="_blank">纯 CSS / JS 演示</a> · <a href="http://127.0.0.1:5192/calendar" target="_blank">Blazor 演示</a></p></section>
 </div>
</template>
<style scoped>
.calendar-showcase{min-width:0;color:var(--g-color-text);font:14px/22px var(--g-font-sans)}.calendar-showcase h2{margin:0 0 12px;font-size:28px;line-height:36px;font-weight:500}.calendar-showcase h2 small{font-size:18px;color:var(--g-color-text-muted)}.calendar-showcase h3{font-size:18px;line-height:26px;margin:0 0 8px;font-weight:500}.calendar-showcase p{color:var(--g-color-text-muted);margin:8px 0 16px}.calendar-showcase section{padding:28px 0;border-top:1px solid var(--g-color-border);margin-top:24px;min-width:0}.calendar-controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:16px 0}.calendar-controls label{display:inline-flex;gap:6px;align-items:center}.calendar-controls select,.calendar-controls button{font:inherit;color:inherit;background:var(--g-color-surface);border:1px solid var(--g-color-border);border-radius:var(--g-radius-sm);padding:4px 8px;min-height:28px}.calendar-cards{display:flex;align-items:start;flex-wrap:wrap;gap:24px}.calendar-showcase output{display:block;font-size:12px;color:var(--g-color-text-muted);margin-top:8px;overflow-wrap:anywhere}.calendar-showcase pre{padding:16px;overflow:auto;background:var(--g-color-surface-subtle);border-radius:var(--g-radius-sm);font:12px/20px var(--g-font-mono)}
</style>
`;export{e as default};