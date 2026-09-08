# 移动端验证记录

范围：33 个组件、99 种变体，CSS / Vue / React / AngularJS / Blazor 同步。

| 验证 | 结果 |
| --- | --- |
| 五端构建、GardenerDemo | 通过；Blazor 0 错误、0 警告 |
| 根目录 npm run check | 通过，包含包、网站、导出和各分类一致性检查 |
| CSS 运行时全量 | 399 项通过；最终滚轮修复另经 18 项移动端专项回归通过 |
| CSS 类型 / Schema / HTML / 构建 | 类型检查、48 / 36 / 11 项通过 |
| Vue / React / AngularJS | 132 / 81 / 69 项单元测试通过；每端 3 项 Schema 和类型检查通过 |
| 三浏览器 | Chromium、Firefox、WebKit 各 198 次宽窄屏变体检查，共 594 次；各 33 次 RTL 与主要操作通过 |
| 无障碍 | Chromium 浅色 33 项、暗色 RTL 33 项，含打开的弹层，WCAG 2 A/AA 与 2.1 AA 自动扫描无违规 |
| 原生触摸 | Chromium CDP 触摸事件：横向标签切换、保留纵向滚动、滑动操作、下拉刷新、面板拖动关闭通过 |
| 滚轮 | 真实滚动后的选择、禁用项、键盘和多列初始化竞争回归通过 |
| Blazor | 527 个 SSR 渲染及 86 个行为、103 个事件契约通过；移动端 33 组件、99 变体、受控选择/筛选/认证/结算浏览器验证通过 |
| CSS 独立演示 | 全部 33 组件，桌面和触屏发布检查 2 项通过 |
| 性能与包装 | 五端固定预算通过；CSS 构建测试含 npm 包安装、按需构建和连续构建字节一致性 |

记录：[逐项清单](inventory.json) · [五端一致性](parity.json) · [适配器](adapters.json) · [检查结果](checks.json) · [Chromium](browser-chromium.json) · [Firefox](browser-firefox.json) · [WebKit](browser-webkit.json) · [原生触摸与无障碍](final-browser.json) · [Blazor](blazor-browser.json) · [预算依据](budget-review.json)。

修复了演示层悬浮按钮绝对定位导致的窄屏溢出、WebKit 弹层关闭焦点返回、滚轮实际居中、初始列滚动重复回传覆盖其他列、移动组合重复初始化及 Blazor 媒体查看器示例名称替换问题。

示例使用真实本地图片与模拟业务服务，不执行真实购买、认证、删除或系统权限请求。系统权限与业务结果通过 action / resolve 交给宿主。浏览器验证包含移动视口和触摸模拟；实体 iOS / Android 键盘、系统工具栏和不同安全区尺寸仍需在目标应用上验收。自动无障碍扫描不替代人工辅助技术测试。Demo 仍有既有全量目录 bundle 超过 500 kB 的构建提示，构建成功；库按固定包体预算检查。
