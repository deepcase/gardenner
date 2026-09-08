# Gardenerim React

Gardenerim CSS 2.2.0 的官方 React 适配层，版本 `2.2.0`、状态 Stable。支持 React `>=18.3.0 <20.0.0`，完整映射 CSS 项目的 575 个组件和 96 种 DOM 行为，并提供类型安全组件、Provider、Hooks、受控值桥接、SSR 安全导入、桌面适配与按需样式。

## 快速开始

```bash
npm install @gardenerim/react @gardenerim/css react react-dom
```

```tsx
import { createRoot } from "react-dom/client";
import { GButton, GCard, GardenerimProvider } from "@gardenerim/react";
import "@gardenerim/react/style.css";

createRoot(document.getElementById("root")!).render(
  <GardenerimProvider theme="garden" mode="light" shape="subtle">
    <GCard><GButton variant="primary">保存</GButton></GCard>
  </GardenerimProvider>,
);
```

## 2.2.0 能力范围

- 575 个自动生成、独立具名且支持 `forwardRef` 的 `G*` 组件。
- 默认控件继承 Gardenerim CSS 的 28 / 32 / 36px 高度与 14px 字体；紧凑模式为 24 / 28 / 32px。
- 96 种 Gardenerim 行为的挂载、销毁和实例访问。
- Web、Mobile、Desktop、Tauri、Electron 五种 CSS 平台入口。
- 完整、核心、主题、工具、组件、AI 六种 CSS 入口与 28 个组件样式包代理。
- 30 个公共包入口，同时支持 `component-css/forms` 与 `component-css/forms.css`。
- 10 个组件公共属性、Imperative Handle、原生 attributes/events/children 透传。
- 原生表单与 `gardener:*` 自定义事件的受控值桥接。
- 十轴 `GardenerimProvider`，默认不启用深色模式。
- 8 个 Hooks，包括运行时语言配置，以及相互隔离的 Tauri/Electron 窗口控制入口与 Hooks。
- React 18.3–19.x、TypeScript、SSR、StrictMode 和 Hydration 安全。
- Chromium、WebKit、Firefox、Pixel 7、iPhone 13 及 WCAG A/AA 自动化门禁。
- 公共 API、稳定兼容基线和性能报告的封闭 JSON Schema。

完整 API 见 [docs/API.md](./docs/API.md)，全部组件逐项清单见 [docs/components.md](./docs/components.md)。

## 发布验证

```bash
npm run release:verify
```

该命令覆盖生成完整性、类型、DOM 生命周期、SSR、真实浏览器、移动端、无障碍、示例、摇树、可复现构建、性能预算、npm 封包和 publint。

## 许可证

MIT

## 运行时国际化

`GardenerimProvider` 接受 `locale` 与 `messages`；`useGardenerimLocale()` 可读写同一份 Gardenerim 运行时配置。内置七种语言，不支持的语言回退到英语。

基础组件的 Arco 比例基准与五框架共用参数见 [基础组件协议](../../docs/basic/parameters.md)，逐项分析和真实对照见 [基础组件核对](../../docs/basic/README.md)。

反馈组件的尺寸、加载/进度/关闭共用参数见 [反馈组件协议](../../docs/feedback/parameters.md)，九项分析与 55 组 Arco 实例对照见 [反馈组件核对](../../docs/feedback/README.md)。

表单分类的 51 项分析、64 组 Arco 比例和共用状态/范围参数见 [表单核对](../../docs/form/README.md)与[表单参数协议](../../docs/form/parameters.md)。

表单之外的浮层扩展参见 [六项浮层与五端参数](../../docs/overlay/README.md)。

解决方案的 32 项变体、配置、尺寸变量与五端示例见[解决方案参数](../../docs/solution/README.md)。

展开收起：Accordion / Collapse / ReadMore 的共享参数、受控状态和示例见 [完整文档](../../docs/disclosure/README.md)。

数据展示扩展：52 个组件、252 个变体，五端共享尺寸、数据参数和交互。[完整文档](../../docs/data/README.md)。

仪表盘：7 个组件、39 个变体；五端共享数据配置、受控状态、数字格式、真实图表及筛选联动。详见 [仪表盘指南](../../docs/dashboard/README.md)。


## 交互组件

35 个交互组件、239 个变体，共享受控状态与行为；发布复查新增 17 项显示、尺寸和超时配置。详见 [交互参数与完整演示](../../docs/interaction/README.md)。


## 内容组件

39 个内容组件、234 个变体采用一致的数据参数、受控状态和共享行为，新增 Markdown 阅读器。详见 [内容参数与完整演示](../../docs/content/README.md)。

## 布局扩展

11 个组件，89 个模式；五端共享尺寸、间距、响应断点和受控侧栏，保留应用插槽。详见 [布局参数与演示](../../docs/layout/README.md)。

## 帮助扩展

29 个组件、99 个变体；五端共享检索、受控状态、反馈服务和操作引导。详见 [帮助参数与演示](../../docs/help/README.md)。

## AI 组件扩展

38 个 AI 组件、119 个变体，统一 aiOptions / aiValue 和共享异步运行时。参数、服务接入、逐项修复及演示见 [AI 文档](../../docs/ai/README.md)。

## 媒体组件扩展

7 个组件、29 个变体；统一 mediaOptions / mediaValue、真实音视频、灯箱与裁剪导出。参阅 [五端参数与逐项检查](../../docs/media/README.md)。

## 电商组件扩展

37 个组件、111 个变体，统一 commerceOptions / commerceValue；商品规格与库存、整数金额、购物车、结算、订单和订阅。参阅 [五端参数与逐项清单](../../docs/commerce/README.md)。

## 认证组件扩展

33 个组件、99 个变体，统一 authOptions / authValue；密码、验证码、通行密钥、组织选择、授权及账户安全。参阅 [五端参数与逐项清单](../../docs/auth/README.md)。

## 移动端组件扩展

33 个组件、99 个变体，统一 mobileOptions / mobileValue；触摸与键盘、安全区、面板、选择器、异步状态及认证/结算复用。[参数与逐项清单](../../docs/mobile/README.md)。

## CMS

6 个 CMS 组件、24 种变体，支持结构化编辑、媒体选择、审核发布与多语言；五端共用样式和行为。[完整参数与演示](../../docs/cms/README.md)。

## 营销

10 个组件、40 种变体，包含品牌导航、Hero、定价、功能展示、标识、评价、行动引导、订阅、公告与页脚。[参数与完整演示](../../docs/marketing/README.md)。

企业组件：8 个组件、32 个变体，参阅[五端企业参数与演示](../../docs/enterprise/README.md)。

桌面端组件：38 个组件、152 个变体，参阅[五端参数与完整演示](../../docs/desktop/README.md)。

<!-- solution-managed -->
解决方案：32 个页面 / 224 个布局变体。通过 solutionOptions 配置区块、导航、数据和业务操作，solutionValue 开启受控状态；五端共享运行时、确认回执与样式。参见 [完整参数与逐项清单](../../docs/solution/README.md)。

## GTable 数据模式

GTable 新增统一的数据驱动表格：四档尺寸、排序筛选、受控选择、分页、固定列/表头、树形/展开行、合并、汇总、编辑、列宽调整、行排序与固定行高虚拟滚动。保留原有静态表格用法。入口、参数、异步与跨框架边界见 [GTable 文档](../../docs/table.md)。


## GCalendar

Calendar now supports month/year views, compact panels, controlled selection and visible pages, configurable headers, date restrictions, week/multiple selection and custom event content. All five packages use the same `dataOptions` configuration and `data-display` controller. See [calendar options and framework examples](../../docs/calendar.md) and the [interactive CSS example](../css/examples/calendar.html).


## GCarousel

Arco-inspired slide, fade and card animations, controlled current, autoplay, vertical/RTL navigation, touch gestures, indicators and thumbnails share `mediaOptions` across all five packages. See [options and integration](../../docs/carousel.md) and the [interactive example](../css/examples/carousel.html).


## GCollapse

Shared `disclosureOptions` supports Arco-inspired multiple/accordion panels, controlled keys, icon configuration, extra actions, nested templates and destroy-on-hide. See [API and framework examples](../../docs/collapse.md) and the [interactive example](../css/examples/collapse.html).

### GDescriptions

[参数、四种布局与五端用法](../../docs/descriptions.md)。现有 GDescriptionList 保持兼容。

### GImage

[图片加载、预览与五端用法](../../docs/image.md)。

### GList

[列表、分页、虚拟滚动与五端参数](../../docs/list.md)。

### GPopover

[Arco-inspired Popover: parameters, slots and five-framework usage](../../docs/popover.md).

### GStatistic

[Numeric precision, animation, dates and countdown in five frameworks](../../docs/statistic.md).

GTabs: six styles, four sizes, controlled selection, editable requests and panel lifecycle. [Shared parameters and demos](../../docs/tabs.md).

GTag: [shared options and examples](../../docs/tag.md) — controlled selection, cancellable close, sizes, colors and templates.

GTimeline: [shared layout options and examples](../../docs/timeline.md) — direction, alternate, reverse, pending, labels and templates.

GTooltip 参数、五端用法与演示见 [Tooltip API](../../docs/tooltip.md)。

GTree 参数、受控状态、异步加载、拖拽和虚拟滚动见 [GTree API](../../docs/tree.md)。

Arco 对照新增组件：GInputNumber、GInputTag、GColorPicker、GAffix、GResizeBox、GScrollbar、GSpace、GWatermark、GOverflowList、GLink、GTypography、GIcon。共用 foundation-options；参阅 [参数与差异](../../docs/arco/README.md)。
