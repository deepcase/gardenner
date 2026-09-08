import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const path='packages/css/metadata/components.json',catalog=JSON.parse(fs.readFileSync(path,'utf8'));
const managed=['virtual-list','kanban','calendar','agenda','file-manager','query-builder','filter-builder','pivot-table','map-shell','gantt-shell','export-panel','data-inspector','data-legend'];
const scopes=['table-sort','row-selection','row-disclosure','column-toggle','data-filter','data-view'];
const classes={'data-grid':'g-data-grid',tree:'g-tree','virtual-list':'g-virtual-list',kanban:'g-kanban',calendar:'g-calendar',agenda:'g-agenda','query-builder':'g-query-builder','pivot-table':'g-pivot','gantt-shell':'g-gantt','map-shell':'g-map-shell'};
const extras={timeline:['horizontal','alternate'], 'description-list':['vertical','horizontal'], 'key-value':['horizontal','vertical'], 'metric-card':['flat','centered'], 'stat-list':['flat','centered'], 'status-summary':['flat','centered'], 'media-list':['horizontal'], 'file-manager':['grid','list'], 'data-legend':['horizontal','vertical'], heatmap:['muted','contrast'], sparkline:['muted','contrast'], 'data-matrix':['muted','contrast'], ranking:['ordered'], 'organization-chart':['horizontal','vertical'], 'record-detail':['vertical'], 'data-inspector':['flat'], 'comparison-table':['highlighted']};
const parts={'comparison-table':['g-table'],tree:['g-tree-item','g-tree-label','g-tree-toggle'],timeline:['g-timeline-item','g-timeline-marker','g-timeline-time'],table:['g-table-cell-actions','g-table-summary'],'data-grid':['g-data-grid-toolbar','g-data-grid-body','g-data-grid-footer'],'description-list':['g-description-term','g-description-value'],'list-group':['g-list-item','g-list-item-content','g-list-item-title','g-list-item-meta'],'virtual-list':['g-data-virtual-viewport','g-data-virtual-row'],kanban:['g-data-kanban-board','g-kanban-column','g-kanban-header','g-kanban-card'],calendar:['g-data-calendar-grid','g-data-calendar-day','g-data-calendar-weekday'],agenda:['g-data-agenda-list'],'file-manager':['g-data-files'],'query-builder':['g-data-query-rule'],'gantt-shell':['g-data-gantt','g-gantt-row','g-gantt-label','g-gantt-track','g-gantt-bar'],'pivot-table':['g-data-managed-scroll'],'map-shell':['g-data-map-canvas','g-data-map-world','g-data-map-marker']};
for(const component of catalog.components.filter(c=>c.category==='data')){
  component.cssSelector ||= classes[component.name]?'.'+classes[component.name]:component.selector.startsWith('.')?component.selector.split(/[ ,]/)[0]:'.g-'+component.name;
  if(scopes.includes(component.name)){const original=component.parts?.find(p=>!p.startsWith("g-data-scope-")) || component.cssSelector.slice(1);component.cssSelector='.g-data-scope-'+component.name;component.parts=[...new Set([...(component.parts||[]),original])];}
  component.variants=[...new Set([...(component.variants||[]),'compact','comfortable','bordered','borderless',...(extras[component.name]||[])])];
  component.parts=[...new Set([...(component.parts||[]),...(parts[component.name]||[])])];
  if(managed.includes(component.name)){component.type='interactive';component.behaviors=['data-display'];component.status='runtime-ready';component.selector='[data-g-data-display]'+component.cssSelector;component.parts=[...new Set([...component.parts,'g-data-managed-toolbar','g-data-managed-empty','g-data-managed-actions'])];component.states=[...new Set([...(component.states||[]),'loading','empty','error','disabled'])];}
  if(['tree-table','expandable-table','grouped-table'].includes(component.name)){component.type='interactive';component.behaviors=['row-disclosure'];component.status='runtime-ready';component.selector='[data-g-row-disclosure]'+component.cssSelector;}
}
await writeFile(path,JSON.stringify(catalog,null,2)+'\n');
const components=catalog.components.filter(c=>c.category==='data');
fs.mkdirSync('docs/data',{recursive:true});await writeFile('docs/data/inventory.json',JSON.stringify({components:components.length,variants:components.reduce((n,c)=>n+c.variants.length,0),managed,items:components.map(c=>({name:c.name,selector:c.selector,variants:c.variants,behaviors:c.behaviors||[],finding:managed.includes(c.name)?'已有样式，补齐统一运行时与真实数据演示':c.name==='tree'?'补齐点击、受控选择、动态节点、禁用和键盘':scopes.includes(c.name)?'修复行为容器与内部部件样式混用，统一五端': '完善参数、变体和真实内容演示'}))},null,2)+'\n');
const selectors=components.map(c=>c.cssSelector).join(',');
const variant=(name,rule)=>components.filter(c=>c.variants.includes(name)).map(c=>c.cssSelector+'-'+name).join(',')+'{'+rule+'}';
await writeFile('packages/css/src/components/data-variants.css','@layer gardener.components {\n:is('+selectors+'){--g-data-padding:16px;--g-data-gap:12px;--g-data-row-height:40px;--g-data-label-width:9rem;min-inline-size:0;max-inline-size:100%;font-size:14px;line-height:22px;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}\n'+[
variant('compact','--g-data-padding:12px;--g-data-gap:8px;--g-data-row-height:32px;--g-table-cell-y:5px;--g-table-cell-x:12px'),
variant('comfortable','--g-data-padding:20px;--g-data-gap:16px;--g-data-row-height:48px;--g-table-cell-y:13px;--g-table-cell-x:20px'),
variant('bordered','border:1px solid var(--g-color-border);border-radius:var(--g-radius-sm)'),
variant('borderless','border:0;box-shadow:none'),
variant('flat','border:0;box-shadow:none;background:var(--g-color-surface-subtle)'),
variant('centered','text-align:center'),
variant('muted','--g-chart-color:var(--g-color-text-muted);filter:saturate(.2)'),
variant('contrast','--g-chart-color:var(--g-color-primary);filter:saturate(1.2)')].join('\n')+'\n}\n');
console.log('Data inventory: '+components.length+' components, '+components.reduce((n,c)=>n+c.variants.length,0)+' variants.');
