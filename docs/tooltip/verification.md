# GTooltip 验证记录

范围：GTooltip、共享浮层逻辑、CSS / Vue / React / AngularJS / Blazor、GardenerDemo、Website 和相关文档。

## 已完成

增加统一 overlay-options 配置，支持十二方位、标准 / Mini、自定义背景和箭头、受控 / 初始可见、多个触发器、延迟、尺寸限制、禁用和关闭策略。保留既有子内容与静态属性用法。修复尺寸过渡导致的定位偏差，为生成的长文本滚动区提供键盘入口，并在内容中按 Escape 关闭后恢复触发器焦点。

## 检查结果

| 项目 | 结果 |
| --- | --- |
| Arco Vue 2.58.0 比例 | 标准 / Mini × 十二方位共 24 组；宽高最大差 0px；相对触发器位置最大差 0.46875px（Arco 取整）；字号、行高、内边距、圆角一致；间距 10px |
| Arco 长文本 | 同一段文本两者均 350 × 214px |
| Tooltip / Popover / Overlay | 43 项回归通过，其中新增 Tooltip 10 项 |
| CSS | Schema 48、HTML 57、构建 11 项通过；类型、契约与预算通过 |
| Vue / React / AngularJS | 构建、类型、Schema、预算通过；单元检查 149 / 97 / 85 项通过 |
| Chromium / Firefox / WebKit | 三种 JS 框架实际挂载、参数更新、受控、悬停移入提示、聚焦、禁用、长文本键盘滚动通过 |
| GardenerDemo | 12 组场景；1440 / 768 / 390px × 亮暗主题；无页面溢出与页面异常，Axe 自动检查无违规 |
| Blazor | 构建零警告、契约与预算通过；真实宿主开关、Mini、位置切换和事件回调通过 |
| Website | 原生 CSS iframe 实际操作通过；7 语言 / 14 页面 / 每语言 3408 条消息；目录与文档覆盖检查通过 |
| 五端一致 | 浮层 6 个组件 / 28 个已有静态变体；共享全量 CSS 与运行时，Blazor 全量 CSS、runtime 和 feedback pack 逐字节一致 |
| 导出 | 5465 个公共 JavaScript 导出检查通过 |

未新增重复组件、行为或事件。公共清单仍为 563 个组件 / 95 个行为 / 105 个事件，Blazor 74 个静态资源。Tooltip 新增参数通过共享配置提供。

与 Arco 的差异：默认额外支持键盘 focus；class 使用字符串；使用浏览器原生顶层保留框架节点归属，未提供 popupContainer 传送 API。静态旧用法维持原有 8px 间距，options 模式使用 10px。自定义滚动插槽由作者提供键盘入口，自定义浅背景需配置合适的前景色。自动无障碍检查不替代所有辅助技术的人工验证。此次未执行包发布。

## 复核

- [参数文档](../tooltip.md) · [总报告](verification.json) · [检查结果](checks.json)
- [Arco 方位与尺寸测量](arco-measurements.json) · [长文本测量](long-content-measurement.json)
- [Chromium](chromium.json) · [Firefox](firefox.json) · [WebKit](webkit.json)
- [Blazor / Website](hosts.json) · [预算记录](budget-review.json)
- [Chromium 截图](chromium-playground.png) · [Firefox 截图](firefox-playground.png) · [WebKit 截图](webkit-playground.png)

运行 scripts/tooltip-release-checks.mjs、scripts/test-tooltip-reference.mjs、scripts/test-tooltip-browsers.mjs、scripts/test-tooltip-hosts.mjs 可复核。默认 Chromium；AUDIT_ENGINE=firefox / webkit 切换浏览器，Firefox 使用项目 .disclosure-firefox 安装目录。本地服务使用 Demo 4180、CSS 4187、官网 4188、Blazor 5192。
