# 帮助组件

完善原有 27 个组件，新增 help-search 与 help-glossary，共 29 个组件、99 个变体。搜索可独立嵌入页面，术语表提供概念检索；文章阅读复用内容分类，浮层定位复用既有浮层运行时，避免重复创建同类基础设施。

## 五端接入

CSS 使用 data-g-help 与 data-g-help-options。Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 helpOptions、helpValue、helpDisabled、helpSize、helpBordered。Options 和 Value 是 JSON 字符串，显式布尔 false 在五端保留。只有传入 helpOptions 才启用数据组合模式；不传时保留原有 CSS 类和作者提供的 DOM 用法。

数据模式由运行时生成内容，业务文本、项目和操作均通过参数提供，不应同时把框架插槽当作数据模式的子视图。销毁会恢复初始化前的子节点。样式入口为 @gardenerim/css/component/help.css，搭配 core.css；完整 style.css 已包含。

~~~js
const config = {
  helpOptions: JSON.stringify({kind:'faq', title:'常见问题', searchable:true, multiple:true,
    items:[{id:'export',title:'如何导出？',answer:'在项目菜单选择 CSV 或 JSON。'}]}),
  helpValue: JSON.stringify({expanded:[]}),
  helpDisabled: false
};
// Vue: <GFaq :config="config" @update:model-value="writeBack" />
// React: <GFaq config={config} onValueChange={writeBack} />
// AngularJS: <div g-faq gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GFaq Config="Config" ValueChanged="WriteBack" />
function writeBack(value) { config.helpValue = JSON.stringify(value); }
~~~

## 参数

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| kind / mode | kind 必需；mode 为 default | 组件与下表变体；显式 mode 优先，其次框架 variant 默认值 |
| title / description | 空 | 标题与多行纯文本说明，文本不会作为 HTML 执行 |
| items | [] | 项目 id 必须唯一，按类型提供 title、description、answer、term、keys、category、keywords、date、target、actions、href |
| actions | [] | label、id、href；链接只允许 http、https、mailto、tel，相对链接按文档地址解析 |
| size | medium；small / medium / large | 12 / 14 / 14px 字号和 12 / 16 / 20px 内距；compact 在未显式配置 size 时选择 small |
| bordered / tone | true / neutral | 边框及 info、success、warning、danger 提示色 |
| columns / limit | 1 / 50；1–4 / 1–200 | 列数与结果上限；640px 以下排列为一列 |
| searchable | 帮助中心、搜索、术语表默认 true | FAQ、快捷键等也可以启用检索 |
| multiple | false | FAQ 多项展开 |
| readonly | false | 禁止用户勾选清单 |
| dismissible | 引导默认 true | 提示关闭按钮；引导跳过与 Escape 关闭 |
| width / placement | 320 / bottom-start | 浮层宽度 160–960px，受视口约束；支持四方向及 start/end 对齐 |
| direction | 继承 | ltr / rtl，使用逻辑边距和边框 |
| trigger | tooltip 为 hover focus，其他 click | 触发方式，可用空格组合 hover、focus、click、contextmenu |
| triggerLabel / placeholder | 内置中文 | 浮动提示触发文本与检索占位 |
| keys / do / dont / doLabel / dontLabel | 视组件而定 | 快捷键与正反例内容 |
| labels | 内置中文词典 | 可覆盖 search、empty、loading、retry、clear、close、start、previous、next、finish、skip、yes、no、reason、submit、thanks、pending、error、cancel、missing、progress、all、read、results |
| defaultValue | 空状态 | 非受控初始状态 |
| debounce | 150；0–2000ms | 远程检索防抖 |
| load / submit | 未配置 | 通过实例 setOptions 注入的异步服务回调，JSON 中不支持函数 |

## 状态与事件

helpValue 控制 query、category、expanded、completed、step、open、dismissed、feedback。数组存储项目 ID，步骤从 0 开始；feedback 为 yes、no 或 null。传入该属性后，组件发出下一状态，由应用回写，不会自行冒充已接受的状态。

beforechange 可取消，change.detail 包含 value、previousValue（仅 beforechange）、reason、controlled。action 提供操作 ID 或反馈内容；complete 只在异步服务成功或用户完成步骤时触发；error 提供 configuration、load 或 submit 原因及消息。没有 submit 服务时，只产生反馈操作事件并显示已选择，绝不声称已发送。

getInstance(root,'help') 提供 refresh、setOptions、getState、setValue、search、open、close、go、submit、cancel、destroy。动态更换服务、取消、销毁和输入新查询都会使旧请求失效；回调应尊重 signal，组件也会阻止晚到结果覆盖新状态。

~~~js
const help = getInstance(root, 'help');
help.setOptions({
  load: async ({query, category, signal}) => {
    const response = await fetch('/api/help?' + new URLSearchParams({query, category}), {signal});
    if (!response.ok) throw new Error('帮助内容暂时不可用');
    return response.json(); // [{id, title, description, ...}]
  }
});
// 反馈组件：setOptions({submit: async ({feedback, reason, signal}) => { ... }})
// Vue / React 可通过暴露的根元素取得实例，AngularJS / Blazor 使用相同运行时实例。
~~~

FAQ 使用原生按钮、aria-expanded / aria-controls 和独立回答区域，支持上下箭头、Home / End；清单使用原生 checkbox。富提示随焦点或鼠标进入展示，交互浮层支持 Escape 和外部点击。引导是非模态 dialog，保持目标可操作；缺失、隐藏或非法目标使用居中说明，不会抛出异常。关闭后返回触发位置。固定浮层限制高度并允许内部滚动；打印隐藏引导，展开 FAQ 回答。默认不播放持续动画。

## 逐项清单

| 组件 | 变体 | 检查与修复 |
| --- | --- | --- |
| tip | default、info、success、warning、danger | 原有提示样式缺少可配置内容；补齐标题、说明、五种语义色、尺寸和禁用状态。 |
| inline-hint | default、compact、success、warning | 原有单行文字缺少组合方式；补齐紧凑说明、多行文本、语义色和方向。 |
| help-text | default、success、warning、danger | 原有状态类只能手工拼装；提供成功、警告、危险说明及统一字号与内距。 |
| help-trigger | default、text、icon | 原有问号触发器缺少可阅读内容；补齐文字/图标入口、交互面板与焦点返回。 |
| rich-tooltip | default、top、bottom、start、end | 原有 CSS 与基础 tooltip 行为分离；复用浮层定位，补齐内容、方向、宽度和触发方式。 |
| help-popover | default、top、bottom、start、end | 原有基础弹出面板缺少完整配置；增加操作区、受控打开、外部关闭及焦点管理。 |
| definition-help | default、inline、popover | 原有术语下划线没有完整解释入口；补齐内联释义和可交互解释浮层。 |
| callout | default、info、success、warning、danger、dismissible | 原有语义容器需手写内容；补齐标题说明、状态色、可关闭通知及紧凑尺寸。 |
| note | default、compact、warning | 原有注释块缺少尺寸和警示选择；补齐配置内容、紧凑与警告模式。 |
| guidance-pair | default、stacked、compact | 原有正反例为固定两列；补齐正反例标签与内容参数、堆叠和窄屏排列。 |
| key-hint | default、mac、windows | 原有按键样式需手工组装；增加任意按键数组、Mac/Windows 示例及可读组合标签。 |
| shortcut-list | default、searchable、grouped | 原有静态快捷键行没有查找能力；增加键位数组、说明、分组与可关闭检索。 |
| help-card | default、compact、borderless | 原有卡片仅有样式；补齐真实说明、链接/操作回调、尺寸与无边框模式。 |
| help-panel | default、compact、borderless | 原有侧边说明框缺少结构配置；补齐标题、说明、条目列表、操作区和紧凑比例。 |
| help-center | default、compact、categorized | 原有搜索框仅作装饰；补齐关键词与分类检索、结果上限、远程服务和空/错误状态。 |
| help-topics | default、list、compact | 原有主题入口需静态编排；增加数据条目、网格/列表、可选检索和响应式列数。 |
| faq | default、multiple、searchable、borderless | 原有基础手写 accordion；补齐稳定 ID、单项/多项展开、受控状态、检索与键盘切换。 |
| contextual-help | default、compact、dismissible | 原有行内说明缺少业务操作；增加说明、链接、操作事件及可取消关闭。 |
| coach-mark | default、top、bottom | 原有绝对定位说明卡没有完整引导生命周期；增加步骤、目标定位、关闭及缺失目标回退。 |
| spotlight | default、top、bottom | 原有仅有高亮蒙层样式；增加带说明的目标高亮、步骤参数与窗口滚动时定位。 |
| hotspot | default、quiet、text | 原有装饰热点缺少实际内容和可控入口；增加说明面板、文字模式、安静模式及禁用控制。 |
| feature-hint | default、compact、dismissible | 原有新功能提示需静态拼装；增加说明、操作入口、紧凑与可关闭模式。 |
| whats-new | default、compact、grouped | 原有更新列表没有数据接口；增加发布日期、分类、内容条目及紧凑展示。 |
| help-checklist | default、compact、readonly | 原有状态标记不可操作；改为原生复选框，增加完成进度、稳定 ID、只读与受控模式。 |
| troubleshooting | default、linear、compact | 原有排查步骤仅为静态列表；增加步骤选择、线性前进、前后导航和操作事件。 |
| help-feedback | default、reason、compact | 原有只保存选择；增加原因输入、真实服务回调、等待/成功/失败状态、重试与取消。 |
| tour-spotlight | default、top、bottom | 原有引导缺少受控状态与可靠焦点；补齐受控步骤、定位回退、键盘关闭和焦点返回。 |
| help-search | default、compact、categorized | 新增独立帮助检索组合，供帮助中心外的页面使用；支持分类、关键词、远程服务和取消。 |
| help-glossary | default、compact、grouped | 新增可搜索术语表，补足单条 definition-help 无法承担的多概念检索与分组展示。 |

## 演示和验证

- [GardenerDemo 帮助目录](http://127.0.0.1:4180/?component=help#catalog)：全部组件、变体、尺寸、方向、边框与受控切换。
- [CSS 完整演示](../../packages/css/examples/help-lab.html)：全部组件与真实操作。
- Blazor 示例 /help：使用真实 Razor 组件，切换全部组件、变体及受控状态。
- [验证记录](verification.md)。

演示中的反馈和“联系管理员”仅展示应用事件，不发送消息或伪造服务响应。真实检索、反馈存储和联系方式由应用提供。颜色继续使用 Gardenerim 主题变量，尺寸采用紧凑的 32px 操作高度与 40px FAQ 行高；没有声明跨设计系统像素级一致。

## 发布复查与扩展参数

本轮复查现有 29 个组件、99 个变体。说明、检索、FAQ、快捷键、引导、术语表与反馈已覆盖帮助场景；本轮扩展现有接口，不新增功能重复的组件。

| 新参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| showHeader / showActions | true | 主内容标题说明与自定义操作；浮层与引导保留必要的可访问标题 |
| showProgress / showCount / showClear | true | 清单/引导进度、检索结果数量、清除入口 |
| showPrevious / showStepList | true | 引导和排障上一步入口、排障步骤目录 |
| arrow / closeOnEscape / closeOnOutside | true | 浮层箭头、Escape 关闭（含引导）、外部点击关闭浮层；独立于跳过按钮的 dismissible |
| serviceTimeout | 60000；0–600000ms | 单次检索/反馈等待上限，0 不限时；取消、销毁、超时均结束等待并忽略旧结果 |
| maxReasonLength | 2000；1–10000 | 反馈原因字符上限；输入和受控状态共同校验 |
| minQueryLength | 0；0–100 | 远程检索最低字符数；本地筛选不受此门槛影响 |
| tourPadding / offset | 6 / 8；0–48 / 0–64px | 引导目标周围留白、浮层与目标间距 |
| openDelay / closeDelay | 100 / 120；0–2000ms | 悬停打开/关闭延迟 |
| maxHeight | 不限；80–1200px | 条目列表最大高度，内部滚动区可键盘聚焦 |

新增共 18 项 helpOptions。helpValue 新增 reason，使反馈说明可由 Vue、React、AngularJS、Blazor 或纯 JS 宿主控制。完整类型位于 packages/css/src/types/help.d.ts；五端 Options/Value JSON 合同一致。

显式 mode、size、bordered、placement、animated 优先于变体默认值，helpSize 等根属性仍优先。默认 small/medium/large 使用 12/14/14px 正文、16px 标题、28/32/36px 按钮和检索控件；FAQ 默认行高 40px；触摸目标至少 44px。列表与双列建议在窄容器收为单列。

修复无 href 操作被渲染为错误链接、带凭据 URL、参数原型键和错误字段、无效 setOptions 污染后续配置、异步取消无法结束、服务超时、外观更新中断服务、中文输入法期间重建输入、受控反馈原因缺失、只读反馈仍可提交、排障跳到禁用步骤，以及结束引导重复守卫。检索输入保持节点身份和焦点；已接入的服务在纯外观更新后继续执行。

GardenerDemo 提供按组件适用范围显示的参数面板，以及“仅事件 / 本地成功 / 失败后重试”服务模式。CSS 独立实验室和 Blazor /help 同样可切换本地服务。所有服务示例只操作本地数据，不发送外部消息；真实检索、存储和联系入口由应用接入。

帮助源模块固定上限从 33KB 调整为 38KB，以容纳扩展参数、校验与生命周期处理；实测与其他预算检查见 [验证报告](verification.md)。
