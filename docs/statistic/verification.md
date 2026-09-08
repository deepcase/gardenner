# GStatistic 验收记录

2026-09-08 · 通过。本记录仅覆盖 GStatistic 专项及相关构建回归。

## 实现与修复

原仓库没有独立 GStatistic，新增一个数据展示组件并同步 CSS、Vue、React、AngularJS、Blazor 的生成目录、类型、导出及文档。总计 563 个组件，数据分类 55 个 / 268 个变体 / 16 个数据托管组件。

- 数字：精度、地区分组、自定义分隔符、前后缀、负数、大整数字符串保真，修复 1.005 等二进制舍入误差。
- 展示：标题、说明、三种尺寸、语义颜色、对齐、样式和原生模板；加载、失败和占位状态。
- 行为：数字动画、暂停恢复、日期及时区、服务器时间校准倒计时，完成事件同一目标只触发一次；卸载清理计时器与观察器。
- 比例：移除通用数据容器继承的 16px 内边距和容器尺寸约束，默认数字 26px / 500，标题与说明 14px，间隔 8px。
- 浏览器：修复 WebKit 深色代码区对比度以及窗口缩放后的数字滚动区键盘访问。

## 实测结果

| 检查 | 结果 |
| --- | --- |
| Arco Vue 2.58.0 默认数值比例 | 12 组，字号、字重、行高、间距一致；高度差小于 1px |
| Statistic 专项 + 数据行为 | 20 + 33 = 53 项通过 |
| CSS schema / HTML / 构建 | 48 / 53 / 11 项通过，包含可复现构建 |
| Vue / React / AngularJS 回归 | 148 / 96 / 84 项通过；各 3 项 schema 及类型检查通过 |
| Blazor | 构建零警告零错误，563 次 SSR 渲染及契约检查通过 |
| Chromium / Firefox / WebKit | 三框架真实参数更新、数字格式、日期、动画、计时、模板和键盘滚动通过 |
| GardenerDemo | 12 个场景；1440 / 768 / 390px；明暗主题；所测区域 Axe 无违规、无页面错误 |
| Website / Blazor 实际页面 | 精度、分组、增加数值、倒计时完成事件通过 |
| 五端资源与目录 | 数据分类映射一致；Blazor 共享 CSS、runtime、data-display.js、statistic.js 字节一致 |
| Website 文档 | 7 个语言、14 个页面、每个译文目录 3388 条消息同步检查通过 |
| 包体预算 | 全部通过；有限上限调整与原始基线保留见 budget-review.json |

[完整机器记录](verification.json) · [检查日志](checks.json) · [Arco 测量](arco-measurements.json) · [参数说明](../statistic.md) · [演示](http://127.0.0.1:4180/?component=statistic#catalog)

## 边界

GStatistic 使用五端共享 JSON 参数，不能直接替换 Arco props。倒计时通过 mode 提供，不增加独立 GCountdown。模板是静态 HTML / Gardener 行为，日期格式为文档列明的 token。跳过动画的情况不发动画完成事件。Demo 生产构建保留已有大分块提示，组件包固定预算全部通过。此次完成本地实现和验收，未发布 npm 包。
