import fs from 'node:fs';import {solutionScenarios,solutionVariants} from './solution-examples.mjs';const components=JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='solution');const inventory=components.map(c=>({name:c.name,selector:c.selector,title:solutionScenarios[c.name.slice(9)][0],variants:c.variants,sections:solutionScenarios[c.name.slice(9)][1].map(s=>({id:s.id,title:s.title,type:s.type,actions:(s.actions||[]).map(a=>a.id)})),finding:'原版为静态结构，演示操作缺少共享业务状态与参数契约',resolution:'保留原静态结构 API；增加可选 solutionOptions 托管页面、真实浏览与宿主确认操作',frameworks:['css','vue','react','angularjs','blazor']}));fs.writeFileSync('docs/solution/inventory.json',JSON.stringify(inventory,null,2)+'\n');
const text=`# 解决方案组件与页面组合

32 个页面、224 个原有布局变体。五端共享 CSS 与 solution 运行时。当前全库目录为 559 个组件、94 个行为。逐项清单见 [inventory.json](inventory.json)，旧检查记录保存在 previous/。

## 本次范围与扩展判断

原来的页面已经具备专用布局，但演示按钮主要依赖演示脚本提示，缺少统一的数据与业务状态契约。本次保留原有 CSS 子部件与七个变体，增加可选的托管组合模式：文章、卡片、表格、指标、表单、时间线、价格方案、看板。可以自由组合、排序和增减区块，也可继续使用自编写子结构与独立组件。

现有 32 类已覆盖公共站点、个人内容、后台、工作台及行业门户。隐私/数据请求加入设置中心，内容发布加入知识库与社区，任务操作加入项目与审批中心；无需增加同义的页面壳组件。托管模式提供通用页面交互；复杂画布、消息编辑、文件上传等可使用原有专用组件编写页面内容。

示例使用本地模拟服务。账号身份、访问权限、支付、真实消息发送、预约冲突、持久化及业务规则由宿主系统负责；UI 不自动执行这些业务。

## 五端参数

CSS 根节点使用 data-g-solution 和 JSON 字符串 data-g-solution-options；solutionValue（data-g-solution-value）可选，提供时开启受控模式。Vue / React 使用 config；AngularJS 使用 gardener-config；Blazor 使用 Config。JSON 应由序列化器生成，通过属性 API 传入。

| 参数 | 值 / 默认 | 作用 |
| --- | --- | --- |
| title / description | 字符串 | 页面标题与说明，按文本渲染 |
| sections | 区块数组 | id、title、description、type、items、fields、actions；顺序即展示顺序 |
| navigation | tabs / rail / all；tabs | 栏目切换、侧栏、全部展开 |
| pageSize | 1–100；6 | 每个集合区块的分页长度 |
| searchable / filterable / sortable | true | 内容检索、分类与标题排序 |
| readonly / disabled | false | 仅浏览 / 全部交互禁用 |
| status | ready / loading / error | 数据可用、加载、失败 |
| direction | ltr / rtl | 阅读方向 |
| locale / currency | zh-CN / CNY | 文本排序和价格格式 |
| requestTimeout | 10–300000 ms；30000 | 异步请求超时 |
| labels | 文案字典 | 替换公共控件与状态文案 |
| defaultValue | 状态对象 | 非受控模式初始值 |

区块类型：cards、table、article、metrics、form、timeline、pricing、board。items 支持 id、title、description、body、category、value、price、yearlyPrice、disabled；价格以主货币单位表示，yearlyPrice 为完整年度价格，未设置时使用月价 × 12。

fields 支持 text、email、number、date、time、textarea、select、checkbox，以及 required、disabled、defaultValue、min、max、step、minLength、maxLength、placeholder、autocomplete、options。草稿按区块保存；提交验证格式、必填和原生约束。actions 为 id、label、disabled、confirm、confirmText；确认只是请求的前置步骤，服务确认前不会伪造成功。

状态：section、query、filter、sort、page、active、fields、billing、version。查询与栏目切换会重置分页；草稿跨栏目保留。items/sections 由配置提供，可在服务器响应的 sections 中返回更新的数据。

原有样式参数继续有效：solutionDensity=compact/comfortable，solutionWidth=boxed/wide/fluid，solutionSurface=flat/outlined，solutionColumns=auto/1/2/3/4，solutionSidebar=compact/standard/wide，solutionHero=balanced/centered/reversed，solutionSticky=on/off。Hero、Sticky 作用于原有包含相应子部件的页面。托管页的栏目使用 navigation。

精确尺寸继续通过 --g-solution-width、--g-solution-gutter、--g-solution-padding、--g-solution-gap、--g-solution-section-space、--g-solution-sidebar-width、--g-solution-aside-width 等 CSS 变量配置。默认正文 14px / 1.6、控件 32px、页标题 22–30px；卡片内边距跟随密度。窄屏侧栏顺序排列，表格和看板内部滚动。

## 使用与服务接入

\`\`\`js
const options = {
  title: '项目列表', navigation: 'tabs', pageSize: 6,
  sections: [{ id: 'records', title: '项目', type: 'table',
    items: [{ id: 'project-1', title: '设计系统', category: '进行中' }],
    actions: [{ id: 'archive', label: '归档', confirm: true }] }]
};
// CSS
root.setAttribute('data-g-solution', '');
root.setAttribute('data-g-solution-options', JSON.stringify(options));
init(root);
const api = getInstance(root, 'solution');
api.setHost(async request => {
  // 将 requestId、version、sectionId、action、itemId、fields 与 signal 传给业务服务。
  // 返回 {status:'success', version:旧值+1, receipt:{id,sectionId,action,itemId}, sections?}
  // 或 {status:'error', message}。下面的调用由你的应用实现。
  return applicationService.execute(request);
});
\`\`\`

Vue：<GSolutionAdminList :config="{ solutionOptions: JSON.stringify(options) }" />。
React：<GSolutionAdminList config={{ solutionOptions: JSON.stringify(options) }} />。
AngularJS：<div g-solution-admin-list gardener-config="{solutionOptions: optionsJson}"></div>。
Blazor：<GSolutionAdminList Config="Config" />，Config["solutionOptions"] = JsonSerializer.Serialize(options)。

公共方法：refresh、setOptions、setValue、getState、request(sectionId, actionId, itemId?)、resolve(requestId, result)、cancel、setHost、destroy。getState 返回副本。beforechange 可取消本地变更；change 携带候选 value；action 携带请求快照；complete 仅在有效回执后触发。受控宿主收到 change 后更新 solutionValue；后端返回的新 sections 应同步回应用的 options 数据源。

回执必须匹配 sectionId/action/itemId 且 version 严格递增。取消、配置变更、销毁会中止信号；过期回包被忽略。失败保留表单草稿。所有 ID 必须唯一，字符限字母、数字、下划线与连字符，长度不超过 80。

## 演示入口

- GardenerDemo：/?component=solution#catalog，可选全部七变体，并调整布局、数据状态、模拟服务及受控状态。
- CSS：packages/css/examples/solution-compositions.html，可切换全部 32 页面与 224 变体。
- Blazor 示例：/solution，使用同一份配置、样式和模拟服务。

## 逐项场景

| 页面 | 区块 | 业务操作 |
| --- | --- | --- |
${inventory.map(c=>'| '+c.title+' | '+c.sections.map(s=>s.title+'（'+s.type+'）').join('、')+' | '+(c.sections.flatMap(s=>s.actions).join('、')||'栏目、检索与详情浏览')+' |').join('\n')}
## 发布复查与扩展参数

保留 32 个页面、224 个变体。新增参数在 CSS、Vue、React、AngularJS、Blazor 共用 solutionOptions 中配置，GardenerDemo 提供对应控件。

| 参数 | 默认 / 范围 | 行为 |
| --- | --- | --- |
| showHeader | true | 显示页面标题和说明，嵌入既有页面时可隐藏 |
| showStatus | true | 显示就绪提示；隐藏时仍展示加载、错误及服务结果 |
| showDetails | true | 显示详情入口与展开的详情区域 |
| showPagination | true | 分页；false 时展示全部匹配记录，不会截断数据 |
| showBilling | true | 显示月付/年付切换，隐藏时可通过 billing 状态指定周期 |
| editorRows | 3 / 1–20 | 文本编辑器默认行数 |
| formColumns | 1 / 1–4 | 表单列数，窄容器自动单列 |
| detailMaxHeight | 320px / 80–2000 | 详情最大高度，长文在区域内滚动 |

字段新增 rows（1–20），优先于 editorRows；区块新增 pageSize（1–100），优先于页面 pageSize。minLength/maxLength 在提交前显式校验，包含通过 API 写入的草稿。禁用字段不参与提交校验，禁用动作在按钮和 API 层均不可执行。select 选项值须唯一，未知选项不能提交。

~~~js
const options = {
  showHeader:false, showStatus:false, showDetails:true,
  showPagination:true, editorRows:4, formColumns:2, detailMaxHeight:240,
  sections:[{id:'records',title:'项目',type:'table',pageSize:12,
    items:[{id:'one',title:'设计系统',category:'进行中'}],
    actions:[{id:'archive',label:'归档',confirm:true}]}]
};
// CSS 的 data-g-solution-options，以及四个适配器的 solutionOptions 均使用 JSON.stringify(options)。
~~~

表格、文章、指标与其他集合均渲染配置的业务动作；非表单请求需要有效 itemId，回执仍需匹配动作、区块、记录与递增版本。移除区块或字段时清理对应过期草稿，保留其他草稿。无效或被 beforechange 拒绝的 setValue 不取消待处理请求；有效状态/配置更新取消等待并恢复准确状态。

原始页面 Hero 标题遵循各页面结构；托管页面标题 22–30px、区块标题 18px、正文 14px，标准控件 32px。表格和看板内部滚动；表单支持窄容器适配；详情可通过键盘聚焦。编辑或业务状态输出不会挤压页面布局。搜索、筛选、排序仅显示在可浏览的数据栏目；计费切换仅显示在价格栏目。

查看 [发布复查报告](verification.md) 与 [逐组件清单](release-review/inventory.json)。演示为本地模拟业务，不发送真实消息、不支付、不执行实际审批。

`;
fs.writeFileSync('docs/solution/README.md',text);for(const p of ['css','vue','react','angularjs','blazor']){const file='packages/'+p+'/README.md',s=fs.readFileSync(file,'utf8'),marker='<!-- solution-managed -->';if(!s.includes(marker))fs.writeFileSync(file,s+'\n'+marker+'\n解决方案：32 个页面 / 224 个布局变体。通过 solutionOptions 配置区块、导航、数据和业务操作，solutionValue 开启受控状态；五端共享运行时、确认回执与样式。参见 [完整参数与逐项清单](../../docs/solution/README.md)。\n');}
