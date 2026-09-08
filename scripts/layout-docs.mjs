import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const inventory=JSON.parse(fs.readFileSync('docs/layout/inventory.json','utf8'));
await writeFile('docs/layout/README.md',`# 布局组件

完善原有 10 个组件，新增 responsive-container，共 11 个组件、${inventory.variants} 个模式。既有栅格、区域、基础布局按完整模式扩展，不把同一原语重复登记成多个组件；分割面板继续使用 interaction 分类的 split-pane，分隔线继续使用基础组件。

## 五端接入

CSS 使用 data-g-layout 与 data-g-layout-options；Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 layoutOptions、layoutValue、layoutDisabled。layoutOptions 和 layoutValue 为 JSON 字符串，布尔配置使用 boolean。显式传入 layoutOptions 才启用增强行为，原有 CSS 类用法保持可用。

布局只管理根样式和显式声明的折叠区域，**不生成或替换业务内容**。Vue slots、React children、AngularJS 模板和 Blazor ChildContent 均由应用持有。参数更新和收起不会清空表单或解绑应用事件。

~~~js
const config = {
  layoutOptions: JSON.stringify({kind:'app-shell', gap:16, sidebarWidth:200, breakpoint:640}),
  layoutValue: JSON.stringify({collapsed:false}),
  layoutDisabled: false
};
// Vue: <GAppShell :config="config" @update:model-value="writeBack">…</GAppShell>
// React: <GAppShell config={config} onValueChange={writeBack}>…</GAppShell>
// AngularJS: <div g-app-shell gardener-config="config" gardener-on-value-change="writeBack($value)">…</div>
// Blazor: <GAppShell Config="Config" ValueChanged="WriteBack">…</GAppShell>
function writeBack(value) { config.layoutValue = JSON.stringify(value); }
~~~

样式入口为 @gardenerim/css/component/layouts.css，配合 core.css。复用已有 CSS 原语类时按需增加 grid.css、regions.css、primitives.css 或 page.css。完整 CSS 入口包含全部依赖。显式 options.mode 优先于 variant；未传 mode 时使用 variant 或该组件首个模式。其他显式参数同样优先于模式默认值。

## 参数

| 参数 | 默认 | 作用 |
| --- | --- | --- |
| kind / mode | kind 必需，mode 为首个模式 | 选择组件与下表布局模式 |
| gap / rowGap / columnGap | 16px；后两项继承 gap | 支持独立行列间距 |
| padding | 按模式 | 容器、页头、主要内容区内距默认 16px；compact 为 8/12px，显式 padding 可覆盖 |
| columns | 按模式，栅格 24、仪表布局 3、Bento 12 | 1–24 整数；列数模式提供默认值，显式 columns 可以覆盖 |
| minItemWidth | 220px | 自动网格、切换布局、滚动序列和瀑布流的基准宽度 |
| sidebarWidth / asideWidth | 200px | 起始侧栏与末尾检查器宽度，使用逻辑方向 |
| headerHeight / footerHeight | 48px / 40px | 应用外壳和区域布局的头尾尺寸 |
| minHeight / height | 0 / 按模式 | 最小高度；工作区、滚动区域、移动外壳的指定高度 |
| maxWidth | 1200px | 内容容器最大宽度；reading / wide / narrow 模式分别 70ch / 1440px / 640px |
| ratio | 16/9 | frame / aspect-ratio，范围 (0,20] |
| align / justify | stretch / start | 基础 flex 和栅格对齐；支持 start、center、end 等契约枚举 |
| breakpoint / responsive | 640px / true | 按组件自身宽度收缩；断点 0–4000px，嵌套在窄面板内也生效 |
| direction / wrap | 继承 / true | ltr / rtl；基础布局是否换行 |
| position / offset | contained / 0 | 默认容器内定位；page 显式允许固定页头、侧栏、全屏工作区或移动头尾占据页面 |
| overflow | visible | 应用主内容 visible / auto / hidden |
| collapsed | false | 非受控外壳初始折叠状态；之后用 setValue / toggle |
| layoutValue | 省略 | 受控 JSON 状态 {collapsed:boolean} |
| layoutDisabled / options.disabled | false | 禁止折叠操作；不会擅自禁用应用插槽内的其他业务控件 |

长度参数可为 0–10000 数值（px），或同范围带 px/rem/em/ch/%/vh/vw/dvh 的非负字符串。none 仅允许 maxWidth/maxHeight，auto 仅允许 height/minHeight/headerHeight/footerHeight/autoRows。拒绝任意 CSS 表达式、未知组件/模式、非法枚举和越界数值。样式变量可直接设置在 DOM 上，但启用参数控制后同名变量由控制器管理。

栅格子项通过 --g-layout-span、--g-layout-row-span 定义跨度；宽度不足时转为一列并清除列跨度。子网格需要 data-g-layout-subgrid，使用浏览器 subgrid 支持。Bento 默认使用 12 列，可由 columns 覆盖，保留 DOM 阅读顺序；dense 模式是显式选择，不作为默认无障碍顺序。

## 区域与折叠契约

region-layout-system 的直接子项使用 data-g-layout-region="top|start|main|end|bottom"。模式控制可见区域和排列，不存在的区域无需提供。app-shell 使用 g-app-shell-sidebar、g-app-shell-header、g-app-shell-main、g-app-shell-aside；mobile-shell 使用 g-mobile-header、g-mobile-main、g-mobile-bottom-nav。

外壳侧栏设置 data-g-layout-panel="sidebar"，对应原生 button 设置 data-g-layout-toggle="sidebar"。控制器维护 aria-controls、aria-expanded、hidden 和 inert。收起焦点所在侧栏时将焦点移回按钮；侧栏内 Escape 默认可收起；closeOnEscape、collapsible、focusOnCollapse 可独立设置。嵌套布局只处理自身事件。beforechange 可取消；change.detail.value 返回下一状态，controlled 指示应用是否应回写。error 提供 configuration 原因和消息。

getInstance(root,'layout') 返回 refresh、setOptions、getState、setValue、toggle、destroy；CSS 包导出 GardenerimLayoutOptions、GardenerimLayoutState、GardenerimLayoutInstance 类型。销毁恢复控制器改动的属性和变量。


## 发布复查：参数与修复

本轮检查现有 11 个组件、89 个模式。栅格、页面区域、布局原语、外壳与内容容器已经覆盖布局职责；可拖动分隔继续复用 split-pane，不新增重复组件。

| 新参数 | 默认 / 取值 | 作用 |
| --- | --- | --- |
| paddingBlock / paddingInline | 继承 padding 或模式默认内距 | 页头、页脚、外壳主区和响应容器的逻辑方向内距 |
| maxHeight | 不限，长度或 none | 限制根容器高度；设置后默认内部滚动，overflow 可覆盖 |
| autoRows | 按模式，auto 或长度 | dashboard / Bento 自动行高 |
| narrowColumns | 1；1–24 整数 | 栅格、dashboard、Bento 在自身断点以下的列数；重置旧跨度 |
| alignContent | start | 内容轨道/行整体对齐，支持 center/end/stretch/space-between/space-around/space-evenly |
| justifyItems | stretch | 网格项横向 start/center/end/stretch 对齐 |
| closeOnEscape | true | 是否允许 Escape 收起面板，不拦截已消费的键盘事件和输入法事件 |
| collapsible | true | 禁止折叠按钮与 API 改变状态，外部受控值仍可更新 |
| focusOnCollapse | true | 收起焦点所在面板后是否移回关联按钮；false 由宿主管理焦点 |

共新增 10 项参数。原有 align/justify、columns、maxWidth、padding 现在可可靠覆盖模式默认值；局部内距、独立行列间距不再意外继承父布局。显式 options.mode 优先于各框架 variant。collapsed 仅为初始值，后续用 setValue 或 layoutValue 控制。

| 组件 | 本轮复查结果与修复 |
| --- | --- |
| grid-system | 显式列数、窄屏多列、跨列重置；subgrid 提供普通网格后备 |
| region-layout-system | 保留五区域与容器响应，最大高度/内部滚动和打印上限解除 |
| classic-layout-primitives | Bento 窄屏移除多余轨道与行跨度；支持行高、列数；瀑布流遵循独立行列间距 |
| page-header | compact 默认 8/12px，显式内距/对齐可覆盖；主标题 20px |
| section-header | 16px 次级标题，紧凑、无边框与对齐参数保持一致 |
| subheader | 16px 标题，逻辑内距与换行参数生效 |
| footer-bar | 16px 信息层级，居中/末尾/吸底组合可调整 |
| app-shell | 移除默认零宽第三列及窄屏空行产生的间隙；修复 sidebar 变体误套内部侧栏样式导致的偏移和高度；双侧栏独立模板；保留原始 hidden/inert/disabled；动态关联、焦点与收起策略 |
| dashboard | 默认 3 列，显式列数/对齐/行高优先，窄屏列数可选 |
| mobile-shell | 头尾、安全区、容器/页面定位保留，主内容逻辑内距同步 |
| responsive-container | reading/wide/narrow/fluid 不再覆盖显式 maxWidth；可组合逻辑内距和最大高度 |

校验拒绝原型键、无效 CSS 关键字和越界字符串。无效 setOptions 不污染后续配置；销毁后 API 不再改动节点；事件监听器不能通过修改 beforechange 的 value 绕过状态管理。移出组件的面板恢复其原属性；嵌套组件保持独立配置。

GardenerDemo 参数面板、CSS layout-lab 和 Blazor /layout 同步新增选项。移除演示旧样式对增强外壳侧栏高度和移动头尾定位的覆盖。CSS/Vue/React/AngularJS/Blazor 共享运行时与样式，分别执行框架更新和内容保留验证。具体测试结果见 [发布复查报告](verification.md)。布局源模块固定上限调整为 16 KB，完整 CSS（含 Blazor 副本）原始上限 1,880,000 字节；移动端 raw/Brotli 上限 1,818,000/143,000 字节（Brotli 相对基线 141%）；桌面端 gzip 上限 255,000 字节；layouts 包 raw 上限 31,000 字节（相对基线 880%）。其余预算不变，详见验证报告实测。

## 逐项清单

| 组件 | 模式 | 检查与修复 |
| --- | --- | --- |
${inventory.items.map(c=>`| ${c.name} | ${c.variants.join('、')} | ${c.finding} |`).join('\n')}

## 演示与边界

- [GardenerDemo 布局目录](http://127.0.0.1:4180/?component=layout#catalog)：每个组件都可切换模式、间距、内距、断点、方向和预览宽度，专用组件有侧栏宽度、最大宽度与受控选项。
- [CSS 独立完整演示](../../packages/css/examples/layout-lab.html)：全部组件与模式，组件直接消费应用 DOM。
- Blazor 示例路径 /layout：11 个真实 Razor 组件，包含模式、参数更新和受控侧栏。
- [验证记录](verification.md)。所有模式需要真实内容才能有意义；纯布局不虚构 loading、empty 等业务状态。

24 列栅格、可配置间距与侧栏结构参考 [Arco Design Vue](https://github.com/arco-design/arco-design-vue) 的布局方式；保留 Gardenerim 主题和逻辑方向，不声明像素级复制。分割拖动复用既有 split-pane，region 的 split-view 仅负责比例排列。CSS 原语类提供无 JavaScript 基础；JSON 参数、自身尺寸检测及受控收起需要运行时。打印会解除固定位置和内部滚动；浏览器安全区值取决于设备。
`);
const section=`<section id="layout-enhancements" class="docs-section"><h2>布局扩展：容器、区域与页面骨架</h2><p>11 个组件提供 ${inventory.variants} 个布局模式，覆盖栅格、基础组合、区域、页头页脚、应用外壳与响应式容器。</p><p>五端共享 layoutOptions、layoutValue、layoutDisabled；配置间距、宽度、断点和方向，保留应用子节点，侧栏支持受控收起。</p><p>布局发布复查新增 10 项参数：逻辑内距、最大高度、网格行高、窄屏列数、内容与网格项对齐、Escape 收起、折叠开关及焦点策略。修复参数优先级、窄屏间距和状态保留，11 个组件、89 个模式及五端演示同步。</p><p><a href="../packages/css/examples/layout-lab.html">完整布局演示</a></p><p><a href="../docs/layout/README.md">五端布局参数和逐项检查</a></p></section>`;
const p='website/docs.html';let s=fs.readFileSync(p,'utf8');s=s.includes('id="layout-enhancements"')?s.replace(/<section id="layout-enhancements"[\s\S]*?<\/section>/,section):s.replace('<section class="docs-section" id="layouts">',section+'\n<section class="docs-section" id="layouts">');await writeFile(p,s);
for(const pkg of ['css','vue','react','angularjs','blazor']){const p='packages/'+pkg+'/README.md';let s=fs.readFileSync(p,'utf8');if(!s.includes('docs/layout/README.md'))s+='\n## 布局扩展\n\n11 个组件，'+inventory.variants+' 个模式；五端共享尺寸、间距、响应断点和受控侧栏，保留应用插槽。详见 [布局参数与演示](../../docs/layout/README.md)。\n';await writeFile(p,s);}
