# GTimeline 时间线

参考 [Arco Design Vue Timeline](https://arco.design/vue/component/timeline)，使用 Arco Vue 2.58.0 对照测量。五端共享 `data-options` 与同一份 timeline.js，保留不带选项的静态 `.g-timeline` 用法。

[GardenerDemo](http://127.0.0.1:4180/?component=timeline#catalog) 提供 12 组演示。[原生 HTML 示例](../packages/css/examples/timeline.html) 和 [Blazor 示例](../packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/TimelineLab.razor) 可独立运行。验证结果见 [记录](timeline/verification.md)。

```js
const options = {
  items: [
    { key: 'created', content: '创建项目', label: '09:00' },
    { key: 'released', content: '发布版本', label: '12:00', dotType: 'hollow' }
  ],
  direction: 'vertical', mode: 'left', labelPosition: 'same',
  reverse: false, pending: '处理中…'
};
const config = { 'data-options': JSON.stringify(options) };
```

Vue 使用 `<GTimeline :config="config" @gardener:action="handle" />`；React 使用 `<GTimeline config={config} />`，通过组件 ref 的 `element.addEventListener('gardener:action', handle)` 订阅操作；AngularJS 使用 `<div g-timeline gardener-config="config"></div>`；Blazor 使用 `<GTimeline Config="Config" EventNames="@(new[]{"action"})" OnEvent="Handle" />`。普通 HTML 添加 `class="g-timeline" data-g-data-display data-g-data-options='…'` 并调用 `init(element)`。

## 布局与状态

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| items | [] | 事件数组，最多 10000 条；动态更新推荐唯一且稳定的 key / id |
| direction | vertical | vertical / horizontal |
| mode | left | 竖向 left / right / alternate；横向 top / bottom / alternate；方向不匹配时归一化到 left / top |
| labelPosition | same | same 内容下方；relative 时间线另一侧 |
| reverse | false | 同时反转 DOM 阅读顺序与视觉顺序；不改变调用方数组 |
| pending | false | true 或文本；显示独立的进行中节点，倒序时移到首位 |
| pendingText | 未设置 | pending=true 时的文字；不设置则只显示加载节点 |
| pendingTemplate / pendingDotTemplate | 未设置 | 进行中内容与图标的原生 template id |
| responsive / breakpoint | false / 480 | 按组件容器宽度，将窄容器内的横向布局切换为竖向 |
| itemSpacing | 78 | 竖向节点最小高度，24–1000px；长内容自动增高 |
| labelWidth | 100 | 竖向对侧时间标签预留宽度，0–500px |
| dotSize | 6 | 默认节点直径，4–32px；自定义模板控制自己的尺寸 |
| itemMinWidth | 0 | 横向节点最小宽度；大于 0 时启用可聚焦滚动容器，方向键滚动、Home / End 到首尾 |
| maxHeight | 未设置 | 80–10000px，限制高度并提供键盘滚动入口 |
| loading / loadingText / loadingTemplate | false / Loading… / 未设置 | 加载时替换事件列表 |
| error | 空 | 错误文字；清除后恢复列表 |
| emptyText / emptyTemplate | No events / 未设置 | 空状态 |
| disabled | false | 禁用节点操作按钮，保留展示内容 |
| label | 未设置 | 列表的无障碍名称；滚动列表建议提供 |

默认几何沿用 Arco：节点 6px、竖向最小间距 78px、内容 14px / 22.001px、时间 12px / 20.004px、文字与节点间距 16px。颜色使用 Gardener 的亮暗主题 tokens。尺寸参数是 Gardener 扩展，不改变默认比例。

## 单个事件

| 参数 | 说明 |
| --- | --- |
| key / id | 稳定身份，字符串或有限数字；缺省使用索引 |
| content / title | 主内容；content 优先；普通文本不会解释为 HTML |
| label / time | 时间或附加标签；label 优先 |
| datetime | 与标签对应的机器可读时间，输出语义化 time 元素 |
| dotType | solid / hollow |
| dotColor / lineColor | 节点与连线的 CSS 颜色 |
| lineType | solid / dashed / dotted，作用于该节点之后的连线；末尾连线隐藏 |
| position | alternate 模式覆盖该节点位置：left / right 或 top / bottom |
| status | normal / success / warning / danger / error / pending；颜色语义，显式 dotColor 优先 |
| dot | 自定义文字或符号节点 |
| contentTemplate / labelTemplate / dotTemplate | 原生 template id |
| actions | `{ key, label, disabled? }[]`，提供业务详情等可访问操作按钮 |
| disabled | 禁用此节点的 actions |

普通时间线不会模拟按钮或选择控件。操作按钮支持浏览器原生键盘行为，发送 `gardener:action`，detail 为 `{ component:'timeline', key, action, item }`。模板内嵌套的其他组件事件不会误触父时间线操作。

相同 key、相同模板 id 的节点会复用，改变方向、排序或标签不会清空输入。删除节点、进入整体 loading / error 状态会销毁对应内容；恢复时重新创建。动态数组中使用稳定 key，避免索引身份随插入发生变化。

## 实例与兼容

`getInstance(element, 'data-display')` 提供 setOptions(patch)、getState()、refresh()、scrollTo(key)、destroy()。setOptions 的 undefined 字段移除该覆盖，恢复属性 JSON；错误 patch 抛 TypeError，非法属性更新保留上一次有效状态并发出 gardener:error。getState 返回实际 direction、源顺序 items、count、reverse、pending、loading 和 error。共享数据接口中的 select / move 等不适用于展示型 Timeline，返回 false。

模板来自应用内可信的原生 template，文本使用 textContent。控制器销毁时移除观察器和监听器并恢复原始 DOM 与属性。保持原有静态 CSS 变体可用，托管模式的布局参数统一通过 data-options 配置。

几何样式基于 Arco 的 MIT 许可样式调整并保留分发许可，参见 [许可证](timeline/arco-license.txt)。没有创建重复的时间线组件；GTimeline、业务订单时间线和工作流组件继续承担各自职责。
