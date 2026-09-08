# GTimeline 验证记录

本次范围为 GTimeline 的 CSS、Vue、React、AngularJS、Blazor 实现、GardenerDemo、Website 与关联文档。以 Arco Vue 2.58.0 为布局参考。

## 完成的能力

支持竖向 / 横向、左 / 右 / 顶部 / 底部 / 交错、同侧 / 对侧时间标签、倒序、进行中节点、实心 / 空心 / 自定义图标、节点及连线颜色、虚线 / 点线、内容与标签模板、动态事件和操作按钮。提供节点间距、标签宽度、节点直径、横向最小宽度、最大高度、容器断点参数，以及空 / 加载 / 错误 / 禁用状态。

稳定 key 的模板节点在更新布局或倒序时保留输入与焦点；移除节点和退出状态模板时清理嵌套控制器。滚动容器支持方向键、Home / End。进行中状态保留已有事件的可读性与操作，动作文字使用可读的主题主色。保留原有静态 CSS 用法，无需新增职责重复的时间线组件。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| Arco 布局测量 | 24 组方向、排列、标签位置、倒序组合；实测最大几何差值 0px，字号和行高一致 |
| 自定义节点 | 4 / 6 / 12 / 24 / 32px，横竖两向，共 10 组对齐检查通过 |
| Timeline 与数据回归 | 54 项通过，其中 Timeline 21 项 |
| CSS 检查 | Schema 48 项、HTML 56 项、构建 11 项；类型、契约与预算通过 |
| Vue / React / AngularJS | 构建、Schema、类型、预算通过；单元检查分别 149 / 97 / 85 项通过 |
| 三浏览器 | Chromium、Firefox、WebKit 实际挂载三种 JS 框架，验证倒序、事件、禁用、模板输入 / 焦点保留、进行中动作、响应式、键盘滚动和状态恢复 |
| GardenerDemo | 12 组演示；1440 / 768 / 390px × 亮暗主题；页面与实际内容无溢出，Axe 自动检查无违规，无页面异常 |
| Blazor | 构建、契约、预算通过；真实宿主验证动作回调、方向、倒序和添加事件 |
| 五端一致 | 55 个数据组件 / 268 个静态变体，17 个托管组件；Blazor 的全量 CSS、runtime、Timeline 及数据模块与 CSS 产物逐字节一致 |
| Website | 嵌入示例实际操作通过；7 种语言、14 页面、每语言 3403 条消息，目录与文档覆盖检查通过 |
| 公共导出 | 5465 个 JavaScript 公共导出检查通过 |

当前清单为 563 个组件、95 个行为、105 个事件，Blazor 分发 74 个静态资源。Timeline 复用 data-display 行为和 gardener:action 事件。体积增长使用固定上限并保留原始 2.0 基线，见 [预算记录](budget-review.json)。本次未执行发布，也不把本次验证扩大为全组件库的发布认证。

WebKit 缩窄后可能保留 article 的旧 scrollWidth；检查同时核对文档宽度、演示区、控件和代码块的滚动尺寸及实际边界。自动无障碍检查覆盖本次演示状态，不能替代所有辅助技术的人工验证。

## 复核材料

- [参数与使用说明](../timeline.md)
- [机器可读总报告](verification.json) · [发布检查](checks.json)
- [Arco 测量](arco-measurements.json) · [节点尺寸测量](dot-measurements.json)
- [Blazor / Website 宿主](hosts.json)
- [Chromium](chromium.json) · [Firefox](firefox.json) · [WebKit](webkit.json)
- [Chromium 截图](chromium-playground.png) · [Firefox 截图](firefox-playground.png) · [WebKit 截图](webkit-playground.png)

运行 scripts/timeline-release-checks.mjs、scripts/test-timeline-reference.mjs、scripts/test-timeline-dots.mjs、scripts/test-timeline-browsers.mjs、scripts/test-timeline-hosts.mjs 可复核。浏览器脚本默认 Chromium，AUDIT_ENGINE 可选 firefox / webkit；Firefox 使用项目 .disclosure-firefox 浏览器目录。本地服务分别使用 Demo 4180、CSS 4187、仓库官网 4188、Blazor 5192。
