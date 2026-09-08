# GPopover 验收记录

本次范围为 GPopover 及其共享浮层行为、五端适配、文档与演示。没有据此声明整个 562 组件库已完成发布验收。

## 完成内容

- 对照 Arco Vue 2.58.0 的标题、正文、内边距、圆角和内容宽度；24 组十二方向 / 有无标题实测，宽高与标题间隔最大差异 0px。
- 24 项共享配置：内容、组合触发、受控开关、十二方向、尺寸、延迟、箭头和关闭策略；保留旧 overlay-* 配置与 compact / wide。
- 修复悬停编辑误关闭、Escape 恢复焦点重新打开、配置变更后残留悬停计时器、默认状态重复应用、箭头中心偏差及嵌套模型事件冒泡问题。
- CSS / Vue / React / AngularJS / Blazor 共用浮层实现；Blazor 与 CSS 的最终样式和运行时文件逐字节相同。
- GardenerDemo 接入 11 组专属演示，CSS 独立演示、Blazor /popover 与 WebSite 内嵌演示已同步；网站 14 页面 / 7 语言通过覆盖检查。

## 验证

| 项目 | 结果 |
| --- | --- |
| Popover + 旧浮层回归 | 33 项通过 |
| Vue / React / AngularJS 单测 | 148 / 96 / 84 项通过，含嵌套事件回归 |
| CSS Schema / HTML / 构建 | 48 / 52 / 11 项通过 |
| 类型、契约、五端预算 | 通过；Blazor Release 构建零警告、零错误 |
| Chromium / Firefox / WebKit | 三个实际框架适配器、组合触发、受控、编辑保留、边界避让通过 |
| GardenerDemo | 11 场景，1440 / 768 / 390px，明暗主题及打开浮层的 Axe 检查通过 |
| Blazor / WebSite | 实际受控开关、输入保存、参数更新、嵌套事件隔离、静态资源一致性通过 |
| RTL / 旧密度配置 | 物理方向短名与 compact 内边距通过 |

[完整机器记录](verification.json) · [检查日志索引](checks.json) · [Arco 原始测量](arco-measurements.json) · [对照截图：左 Arco，右 Gardener](arco-comparison.png) · [预算调整依据](budget-review.json)

## 边界

使用 Gardener 的共享 JSON 配置和事件协议；不提供 popupContainer 传送与 unmountOnClose。默认额外支持键盘 focus，保留原位内容。旧浏览器定位回退、iframe 限制、样式单位和完整 API 差异见 [GPopover 文档](../popover.md)。自动化无障碍检查不能代替辅助技术人工验收。Demo 构建仍有原有的大分块提示。
