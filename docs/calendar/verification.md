# GCalendar 验证记录

日期：2026-09-07。范围：GCalendar、共享数据运行时、五端接入、GardenerDemo、WebSite 和文档。没有发布 npm/NuGet 包。

## 完成内容

空组件默认展示当前月；保留已有手写内容。提供月/年/卡片视图、独立的选中日期与展示页、受控及非受控模式、按钮/下拉/自定义表头、前后月/年导航、今天、整周/多日期选择、只读/禁用、范围/星期/单日禁选、自定义日期与月份内容、跨日事件及异步加载。

保留通用数据 `maxHeight`、配置属性更新和销毁恢复行为。修复闰年、年界、翻页与选中值耦合、受控状态提前修改、被拒绝的下拉选项没有恢复、异步旧结果覆盖、键盘焦点丢失等问题。动态文本通过 textContent 渲染；函数渲染接收 DOM 节点或文字。

CSS、Vue、React、AngularJS、Blazor 沿用 `dataOptions` / `data-display` 接口，共享同一控制器。Vue/React/AngularJS 的生成目录与包已重建；Blazor 静态资源、组件元数据和示例已同步。详细 API 见 [calendar.md](../calendar.md)。

## 验证结果

| 验证 | 结果 |
| --- | --- |
| CSS 运行时回归 | 909 / 909，含 22 项 Calendar 专项测试 |
| CSS Schema / HTML | 48 / 48、46 / 46 |
| CSS 构建、可复现及包安装 | 11 / 11 |
| Vue 单元测试 | 147 / 147；类型、Schema、清单与预算通过 |
| React 单元测试 | 95 / 95；类型、Schema、清单与预算通过 |
| AngularJS 单元测试 | 83 / 83；类型、Schema、清单与预算通过 |
| Blazor | 构建 0 警告、0 错误；契约、清单、预算通过 |
| 浏览器 | Chromium、Firefox、WebKit 三端适配器交互及几何对照通过 |
| GardenerDemo | 三浏览器通过 9 组演示、键盘、受控更新、重试、深浅主题 Axe 检查 |
| 响应式 | 1440、768、390px 视口均无演示内容横向溢出 |
| 本地接入 | CSS 示例、Blazor `/calendar`、Website 默认语言内嵌示例通过 |
| 时区 | Honolulu / Auckland 中原生 Date 输入均保持 2026-09-07 |
| 资源一致性 | CSS 源 data-display.js = dist = Blazor 静态文件；CSS min 文件与 Blazor 相同 |
| 文档 | 7 种语言、14 个本地化页面生成与检查通过 |

日志与结构化结果见 [checks.json](checks.json)、[hosts.json](hosts.json)、各浏览器的 JSON 和截图。Demo 测试以减少动效模式排除页面平滑滚动中的移动点击目标；独立适配器测试使用普通浏览器环境。WebKit 完整 Demo 的移动点击失败已据此定位并复测通过。

## Arco 对照与范围

参考 [Arco Calendar](https://arco.design/vue/component/calendar) 及本地 Arco Vue 2.58.0。完整日历在同一 900px 容器对照；卡片按文档给定宽度显式设置为 265px。完整日历表头 76px、日期行 100px、日期圆高度 28px；卡片表头 45px、日期行 36px、日期圆高度 24px、整体高度 323px，三浏览器均通过。折叠表格边框使星期表头与参考出现不超过 0.5px 的差异。主题颜色和圆形日期标记沿用 Gardener。

不是完整 Arco API 的替代实现：支持实际可用的月/年视图，整周通过 `isWeek` 选择；不提供 day/week 排班视图、拖拽排期、循环事件、时区调度或 VNode/JSX/RenderFragment 的跨框架转换。JSON 入口使用日期字符串；渲染器及加载器通过实例注入。

仅为新增日历样式与运行时扩大相关固定预算，保留 2.0 历史基线。见 [budget-change.json](budget-change.json)。最终 CSS 包预算通过，包大小为 4,096,000 B（压缩）/ 28,704,768 B（解包）；Blazor 静态资源 16,222,388 B。
