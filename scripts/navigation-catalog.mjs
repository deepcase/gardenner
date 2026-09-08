import { navigationEventContracts } from '../packages/css/src/js/navigation.js';
import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const root=new URL('../',import.meta.url);
const catalog=JSON.parse(fs.readFileSync(new URL('packages/css/metadata/components.json',root))).components.filter(x=>x.category==='navigation');
const groups={
 links:['navbar','sidebar','primary-navigation','utility-navigation','sub-navigation','navigation-rail','activity-bar','pill-navigation','bottom-navigation','quick-navigation','command-navigation','collapsible-navigation'],
 tabs:['tabs','vertical-tabs','segmented-control','mobile-tab-bar'],
 menus:['menu-dropdown','context-menu','menu-bar','mega-menu','locale-navigation','account-navigation','command-palette','drawer-navigation'],
 pages:['pagination','cursor-pagination','load-more-navigation'],
 steps:['stepper','wizard-navigation'],
 location:['anchor-navigation','scrollspy-navigation','jump-navigation','skip-navigation','back-to-top'],
 actions:['toolbar','command-bar','back-navigation','mobile-top-navigation','previous-next-navigation'],
 tree:['tree-navigation'],breadcrumb:['breadcrumb'],
};
const extended=JSON.parse(fs.readFileSync(new URL('scripts/navigation-release-parameters.json',root)));
const common=[...extended.map(([key])=>key),'items','value / v-model','size','appearance','orientation','disabled','loading','label'];
const params={links:['actions','brand','collapsed','searchable','sticky','fixed'],tabs:['activation','loop','closable','content','beforeChange'],menus:['open','searchable','closeOnSelect','children','checkable','shortcut'],pages:['total','pageSize','siblingCount','showSizeChanger','showJumper','hasPrevious','hasNext'],steps:['status','beforeChange','content'],location:['href','scrollTarget','scrollOffset','threshold','fixed'],actions:['actions','previous','next','backHref','sticky'],tree:['children','expandedKeys','defaultExpandedKeys','searchable'],breadcrumb:['maxVisibleItems','href']};
const summaries={links:'从网站入口到工作台导航，支持选中、图标、徽标、分组、方向与密度。',tabs:'用受控值切换内容；支持键盘、手动激活、禁用项与可关闭标签。',menus:'支持分组、嵌套、勾选、搜索和焦点恢复；业务动作由事件接入。',pages:'覆盖已知总数、游标与逐批加载，明确边界和异步状态。',steps:'用受控步骤和切换前校验组织流程，可表达完成、错误与待处理状态。',location:'在页面或指定滚动容器中定位，并支持滚动高亮与键盘跳转。',actions:'组织主次命令、上下文操作和返回路径，由调用方处理业务逻辑。',tree:'通过嵌套数据表达层级，支持受控展开、方向键和禁用节点。',breadcrumb:'表达当前位置和层级关系；长路径可折叠，中间路径仍可访问。'};
const base=[{id:'overview',label:'工作台',icon:'◈',content:'项目概览：12 个活跃项目，3 项待处理事项。'},{id:'projects',label:'项目',icon:'▦',badge:12,content:'团队项目：设计系统、移动工作台与文档中心。'},{id:'reports',label:'报表',icon:'▥',content:'月度交付统计与团队活动记录。'},{id:'settings',label:'设置',icon:'⚙',disabled:true,content:'此项需要管理员权限。'}];
const commands=[{id:'new',label:'新建项目',icon:'＋',shortcut:'Ctrl N',group:'项目'},{id:'save',label:'保存',icon:'✓',shortcut:'Ctrl S',group:'项目'},{id:'export',label:'导出',icon:'↗',group:'文件',children:[{id:'pdf',label:'PDF 文档'},{id:'csv',label:'CSV 数据'}]},{id:'sidebar',label:'显示侧栏',checkable:true,checked:true,group:'视图'},{id:'delete',label:'删除项目',disabled:true,group:'危险操作'}];
const examples={};
for(const c of catalog){
 const family=Object.keys(groups).find(k=>groups[k].includes(c.name));if(!family)throw Error('Missing family '+c.name);
 let items=structuredClone(base),extra={};
 if(family==='menus')items=structuredClone(commands);
 if(c.name==='menu-bar')items=[{id:'file',label:'文件',children:structuredClone(commands.slice(0,3))},{id:'edit',label:'编辑',children:[{id:'undo',label:'撤销',shortcut:'Ctrl Z'},{id:'redo',label:'重做',disabled:true}]},{id:'help',label:'帮助',children:[{id:'docs',label:'使用文档'},{id:'about',label:'关于工作区'}]}];
 if(c.name==='locale-navigation')items=[{id:'zh-CN',label:'简体中文',description:'中国大陆'},{id:'en',label:'English',description:'United States'},{id:'ja',label:'日本語',description:'日本'}];
 if(c.name==='account-navigation')items=[{id:'profile',label:'个人资料',icon:'◉',group:'林青 · 团队管理员'},{id:'security',label:'安全设置',icon:'◇'},{id:'billing',label:'订阅与账单',icon:'▤'},{id:'signout',label:'退出登录',group:'会话'}];
 if(c.name==='drawer-navigation')items=structuredClone(base);
 if(family==='steps')items=[{id:'details',label:'基本信息',description:'填写名称与用途',content:'录入项目名称、描述与负责人。'},{id:'members',label:'邀请成员',description:'选择协作者',content:'为团队成员分配角色。'},{id:'review',label:'检查配置',description:'确认发布内容',content:'核对信息并完成项目创建。'}];
 if(family==='tree')items=[{id:'workspace',label:'团队工作区',icon:'▣',children:[{id:'design',label:'设计系统',children:[{id:'tokens',label:'设计变量'},{id:'components',label:'组件规范'}]},{id:'docs',label:'文档中心'},{id:'archive',label:'归档项目',disabled:true}]},{id:'personal',label:'个人空间',children:[{id:'drafts',label:'草稿',badge:3}]}];
 if(family==='breadcrumb')items=['工作区','团队空间','设计系统','组件库','导航','使用指南'].map((label,i)=>({id:`crumb-${i}`,label}));
 if(family==='pages'){items=[];extra={total:248,pageSize:10,showSizeChanger:true,showJumper:true,hasPrevious:true,hasNext:true,description:'已加载 20 条记录 · 继续浏览下一批'};}
 if(family==='location'){items=[{id:'intro',label:'概览',href:'#nav-section-intro'},{id:'usage',label:'使用方式',href:'#nav-section-usage'},{id:'api',label:'参数说明',href:'#nav-section-api'}];extra={scrollTarget:'navigation-scroll-area',scrollOffset:16,threshold:100};}
 if(family==='actions')extra={title:'项目设置',actions:[{id:'help',label:'帮助'},{id:'save',label:'保存',icon:'✓'}],previous:{id:'prev',label:'上一章 · 表单组件',description:'返回前一个主题'},next:{id:'next',label:'下一章 · 数据展示',description:'继续学习'}};
 const initial=c.name==='pagination'?1:items.find(x=>!x.disabled)?.id;
 const options={items,label:`${c.name} 演示`,title:family==='menus'?'打开操作菜单':family==='links'?'团队工作区':undefined,brand:'G / Gardener',defaultValue:initial,...extra};
 const rich={...structuredClone(options),size:'large',appearance:family==='tabs'?'line':'card',searchable:['menus','tree'].includes(family)||c.name==='sidebar',defaultExpandedKeys:family==='tree'?['workspace','design']:[],actions:family==='links'?[{id:'create',label:'新建',icon:'＋'}]:options.actions};
 if(family==='tabs')rich.items=rich.items.map((x,i)=>({...x,closable:i>0&&!x.disabled}));
 if(family==='steps')rich.items[1].status='error';
 const compact={...structuredClone(options),size:'small',appearance:'pill',orientation:['pages','actions'].includes(family)?'horizontal':'vertical',activation:'manual',closeOnSelect:false,maxVisibleItems:3,showSizeChanger:false,showJumper:false};
 examples[c.name]={name:c.name,family,exportName:'G'+c.name.split('-').map(w=>w[0].toUpperCase()+w.slice(1)).join(''),summary:summaries[family],parameters:[...common,...params[family]],scenarios:[
  {id:'basic',title:'基本用法 · 数据与受控值',description:'通过 items 描述内容，选中值和业务回调由应用接管。',options},
  {id:'rich',title:'复杂场景 · 内容与操作',description:'展示描述、徽标、分组、嵌套或业务专用参数。',options:rich},
  {id:'compact',title:'紧凑场景 · 另一种布局',description:'调整尺寸、外观和方向，适应侧栏、工具面板与小屏幕。',options:compact},
 ]};
}
const json=JSON.stringify(examples,null,2)+'\n';
await writeFile(new URL('packages/css/metadata/navigation-examples.json',root),json);
if(fs.existsSync(new URL('../GardenerDemo/src/data/',root)))await writeFile(new URL('../GardenerDemo/src/data/navigation-examples.json',root),json);
const definitions=Object.fromEntries(catalog.map(x=>[x.name,{...x,className:(x.cssSelector||x.selector).match(/\.([\w-]+)/)?.[1]||({tabs:'g-tabs'})[x.name]}]));
await writeFile(new URL('packages/css/src/js/navigation-catalog.js',root),'/** Generated by scripts/navigation-catalog.mjs. */\nexport const navigationDefinitions = '+JSON.stringify(definitions,null,2)+';\n');
fs.mkdirSync(new URL('docs/navigation/',root),{recursive:true});
await writeFile(new URL('docs/navigation/component-matrix.md',root),'# 41 个导航组件参数与场景矩阵\n\n所有组件共享 CSS 运行时实现，Vue、React、AngularJS、Blazor 使用同一数据结构与状态语义。\n\n|组件|分类|参数重点|场景数量|\n|---|---|---|---|\n'+Object.values(examples).map(e=>`|${e.exportName}|${e.family}|${e.parameters.join('、')}|${e.scenarios.length}|`).join('\n')+'\n');
console.log(`Generated ${catalog.length} contracts and ${catalog.length*3} navigation scenarios.`);
const apiPath=new URL('packages/css/metadata/public-api.json',root),api=JSON.parse(fs.readFileSync(apiPath));
for(const contract of [{name:'createNavigation',kind:'function',parameters:['host','options'],returns:'GardenerimNavigationInstance',signature:'createNavigation(host, options) => GardenerimNavigationInstance'},{name:'navigationDefaults',kind:'object',parameters:[],returns:'Readonly<GardenerimNavigationOptions>',signature:'navigationDefaults: Readonly<GardenerimNavigationOptions>'}]){
 if(!api.javascript.moduleExports.includes(contract.name))api.javascript.moduleExports.push(contract.name);
 const index=api.javascript.moduleContracts.findIndex(x=>x.name===contract.name);if(index<0)api.javascript.moduleContracts.push(contract);else api.javascript.moduleContracts[index]=contract;
}
for(const contract of navigationEventContracts){if(!api.javascript.events.includes(contract.name))api.javascript.events.push(contract.name);api.javascript.eventContracts=api.javascript.eventContracts.filter(x=>x.name!==contract.name);api.javascript.eventContracts.push(contract);}
api.javascript.eventContracts.sort((a,b)=>a.name.localeCompare(b.name));
await writeFile(apiPath,JSON.stringify(api,null,2)+'\n');

const changes={links:'数据条目、分组和附加操作；受控选中、禁用与加载；方向、尺寸、折叠和小屏布局',tabs:'真实内容面板；受控选中；自动/手动键盘激活；禁用跳过、可关闭项和单选分段语义',menus:'真实菜单/抽屉/命令对话框；搜索、分组与嵌套；勾选、禁用、Escape、外部点击和焦点恢复',pages:'页码边界及页大小；游标上下页和加载状态；本地异步请求演示',steps:'步骤状态和内容面板；前进后退；异步校验拦截与等待状态',location:'真实目标和滚动容器；定位后焦点管理；滚动选中同步或返回顶部阈值',tree:'层级展开和选中；搜索保留父子路径；键盘遍历与受控展开键',breadcrumb:'真实路径层级、当前位置和中间路径收纳',actions:'返回/前后项与工具操作；值及事件回传；附加操作、禁用与布局'};
await writeFile(new URL('docs/navigation/component-analysis.md',root),'# 41 项逐项问题归类与处理\n\n检查对象是参数化扩展之前的组件结构和演示组织。已有样式或行为不等于未实现；本轮共同缺口是数据 API、状态组合与可调演示。下表分别记录已有能力、组件扩展和演示补充。\n\n|组件|已有能力 / 组件缺口|本轮组件补齐|演示补齐|\n|---|---|---|---|\n'+catalog.map(c=>'|'+examples[c.name].exportName+'|已有 '+(c.variants?.length||0)+' 种样式变体，'+(c.parts?.length||0)+' 个结构部件；缺少统一数据配置入口'+'|'+changes[examples[c.name].family]+'|基础、复杂、紧凑三场景；实时参数、事件反馈、五框架代码|').join('\n')+'\n');
