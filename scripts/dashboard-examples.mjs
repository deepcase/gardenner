const escape=value=>JSON.stringify(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export const dashboardOptions={
 'kpi-stat':{label:'本月营业额',value:128650.75,previous:112340.5,format:'currency',currency:'CNY',precision:2,description:'已扣除退款，按订单完成时间统计'},
 'filter-bar':{fields:[{key:'period',label:'统计周期',type:'select',defaultValue:'month',options:[{value:'week',label:'最近 7 天'},{value:'month',label:'本月'},{value:'quarter',label:'本季度'}]},{key:'team',label:'团队',type:'select',defaultValue:'all',options:[{value:'all',label:'全部团队'},{value:'east',label:'华东团队'},{value:'south',label:'华南团队'}]},{key:'keyword',label:'项目检索',type:'search',placeholder:'输入项目名称'}],values:{period:'month',team:'all',keyword:''}},
 'chart-container':{title:'营收与成本趋势',description:'最近六个月营收与成本，单位万元',categories:['1 月','2 月','3 月','4 月','5 月','6 月'],series:[{id:'revenue',label:'营收',values:[42,56,51,73,81,96]},{id:'cost',label:'成本',values:[28,35,32,45,49,57]}],precision:1,filename:'revenue.csv'},
 'kpi-group':{metrics:[{label:'活跃客户',value:2860,previous:2400,unit:'户'},{label:'成交订单',value:1368,previous:1200,unit:'笔'},{label:'转化率',value:.286,previous:.24,format:'percent',precision:1},{label:'响应时间',value:182,previous:240,inverse:true,unit:'ms'}]},
 'dashboard-widget':{title:'团队协作摘要',collapsible:true},
 'goal-tracker':{title:'季度签约目标',value:780000,target:1000000,unit:'元',precision:0},
 'gauge-chart':{title:'服务健康评分',value:82,min:0,max:100,unit:'分',thresholds:[{value:0,tone:'danger'},{value:60,tone:'warning'},{value:80,tone:'success'}]}
};
const classes={'kpi-stat':'g-kpi','filter-bar':'g-filter-bar','chart-container':'g-chart','kpi-group':'g-kpi-group','dashboard-widget':'g-dashboard-widget','goal-tracker':'g-goal-tracker','gauge-chart':'g-gauge-chart'};
export const dashboardExamples=Object.fromEntries(Object.entries(dashboardOptions).map(([name,options])=>[name,`<section class="${classes[name]}" data-demo-component data-g-dashboard data-g-dashboard-options="${escape(options)}" aria-label="${options.title||options.label||name}">${name==='dashboard-widget'?'<p>本周已交付 8 项任务，另有 3 项正在进行。</p><label>交接备注<input class="g-input" value="周五安排验收" /></label><ul><li>设计变量完成评审</li><li>移动端适配进入验收</li></ul>':''}</section>`]));
const linked=(name,key)=>dashboardExamples[name].replace(' data-demo-component',' data-dashboard-linked="'+key+'"');
export const dashboardOverviewExample='<section class="g-dashboard demo-dashboard-overview" data-demo-component style="display:grid;grid-template-columns:minmax(0,1fr);gap:16px">'+linked('filter-bar','filter')+'<div class="demo-dashboard-row">'+linked('kpi-stat','kpi')+linked('chart-container','chart')+'</div></section>';
