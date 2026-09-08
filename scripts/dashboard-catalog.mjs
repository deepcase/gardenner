import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const path='packages/css/metadata/components.json',catalog=JSON.parse(fs.readFileSync(path,'utf8'));
const definitions=[
 ['kpi-stat','g-kpi',['compact','comfortable','borderless','horizontal','centered','accent'],['g-kpi-label','g-kpi-value','g-kpi-change'],'已有静态数字卡，补齐数值格式、趋势语义、前后缀和状态'],
 ['filter-bar','g-filter-bar',['compact','comfortable','borderless','vertical','sticky','inline'],['g-filter-bar-main','g-filter-bar-actions'],'原来只有布局，补齐类型化筛选、应用、重置和受控值'],
 ['chart-container','g-chart',['compact','comfortable','borderless','line','area','bar','donut'],['g-chart-legend','g-chart-legend-item','g-chart-legend-swatch'],'原来只有容器，补齐真实 SVG 图表、系列切换、数据表和导出'],
 ['kpi-group','g-kpi-group',['compact','comfortable','borderless','divided','stacked'],['g-kpi','g-kpi-label','g-kpi-value'],'新增：统一组织多项指标，支持响应式列数和空数据'],
 ['dashboard-widget','g-dashboard-widget',['compact','comfortable','borderless','flat','accent'],['g-dashboard-heading','g-dashboard-body','g-dashboard-actions'],'新增：统一标题、操作、折叠及保留内容的部件容器'],
 ['goal-tracker','g-goal-tracker',['compact','comfortable','borderless','horizontal','centered'],['g-goal-track','g-goal-fill','g-dashboard-value'],'新增：目标值、完成率、剩余额、超额及反向目标语义'],
 ['gauge-chart','g-gauge-chart',['compact','comfortable','borderless','semicircle','ring'],['g-dashboard-gauge','g-dashboard-value'],'新增：带上下限、阈值、单位和完整文本替代的刻度图']
];
for(const [name,css,variants,parts]of definitions){let c=catalog.components.find(c=>c.name===name);if(!c){c={name,category:'dashboard',platforms:['web','mobile','desktop']};catalog.components.push(c);}Object.assign(c,{type:'interactive',status:'runtime-ready',selector:'[data-g-dashboard].'+css,cssSelector:'.'+css,behaviors:['dashboard'],variants,parts,states:[...new Set([...(c.states||[]),'loading','empty','error','disabled'])]});}
await writeFile(path,JSON.stringify(catalog,null,2)+'\n');
fs.mkdirSync('docs/dashboard',{recursive:true});await writeFile('docs/dashboard/inventory.json',JSON.stringify({originalComponents:3,newComponents:4,components:7,variants:definitions.reduce((n,c)=>n+c[2].length,0),items:definitions.map(([name,css,variants,parts,finding])=>({name,cssSelector:'.'+css,variants,parts,finding}))},null,2)+'\n');
const rule=(v,body)=>definitions.filter(c=>c[2].includes(v)).map(c=>'.'+c[1]+'-'+v).join(',')+'{'+body+'}';
await writeFile('packages/css/src/components/dashboard-variants.css','@layer gardener.components {\n'+[
rule('compact','--g-dashboard-padding:12px;--g-dashboard-gap:8px;--g-dashboard-value-size:24px'),rule('comfortable','--g-dashboard-padding:20px;--g-dashboard-gap:16px;--g-dashboard-value-size:36px'),rule('borderless','border:0;box-shadow:none'),rule('centered','text-align:center;justify-items:center'),rule('accent','border-block-start:3px solid var(--g-color-primary)'),rule('flat','box-shadow:none;background:var(--g-color-surface-subtle)'),rule('inline','border:0;padding-inline:0'),rule('vertical','align-items:stretch;flex-direction:column'),rule('sticky','position:sticky;inset-block-start:var(--g-filter-bar-offset,0);z-index:10'),rule('horizontal','display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center'),rule('stacked','--g-dashboard-columns:1;--g-dashboard-mobile-columns:1'),rule('divided','gap:0'),rule('line','--g-dashboard-chart-type:line'),rule('area','--g-dashboard-chart-type:area'),rule('bar','--g-dashboard-chart-type:bar'),rule('donut','--g-dashboard-chart-type:donut'),rule('semicircle','--g-dashboard-gauge-arc:180'),rule('ring','--g-dashboard-gauge-arc:360')].join('\n')+'\n}\n');
