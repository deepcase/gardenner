# Gardenerim Vue API

## 安装

```bash
npm install @gardenerim/vue @gardenerim/css vue
```

```ts
import { createApp } from "vue";
import GardenerimVue from "@gardenerim/vue";
import "@gardenerim/vue/style.css";

createApp(App).use(GardenerimVue).mount("#app");
```

## 组件公共属性

全部 510 个 `G*` 组件都接受以下属性：

- `as`：修改根元素或 Vue 组件。
- `variant`：字符串或数组，转换为组件变体类。
- `state`：字符串或数组，转换为 `is-*` 状态类。
- `config`：转换为 `data-g-*` 运行时配置。
- `initialize`：是否初始化 Gardenerim DOM 行为，默认 `true`。
- `locale` / `messages`：设置七语言运行时目录或覆盖消息。
- `modelValue`：支持原生表单 `v-model`；复杂行为可配合 `modelEvent` 和 `modelKey` 从 `gardener:*` 事件同步值。
- 所有原生 attributes、事件和 slots 均透传。

对话框、抽屉等带内层面板的组合组件保留 Gardenerim 的标准 DOM 结构，例如 `GDialog` 作为 `.g-dialog-backdrop` 行为根，插槽内使用 `<GardenerimPart name="dialog" aria-labelledby="title-id">` 创建并命名面板。

组件模板 Ref 公开 `element`、`getInstance()` 和 `refresh()`；`useGardenerimBehavior`、`useGardenerimEvent`、`useGardenerimTheme` 及桌面适配 Composable 均同时接受组件 Ref 与原生 DOM Ref。

## Provider

`GardenerimProvider` 支持 `theme`、`mode`、`neutral`、`typography`、`shape`、`density`、`elevation`、`motion`、`platform` 和 `os` 十条主题轴。

## Composable

- `useGardenerim`
- `useGardenerimBehavior`
- `useGardenerimEvent`
- `useGardenerimLocale`
- `useGardenerimTheme`
- `useGardenerimToast`
- `useTauriWindowControls`
- `useElectronWindowControls`

## 指令

```vue
<div v-gardenerim="{ behavior: 'dialog', config: { startOpen: true } }" />
```

## Tauri 与 Electron

`useTauriWindowControls`、`useElectronWindowControls` 会随 Vue 生命周期绑定并销毁桌面窗口按钮；`bindTauriWindowControls` 与 `bindElectronWindowControls` 也可直接使用。

## 按需引入

```ts
import { GButton, GCard, GDialog } from "@gardenerim/vue/components";
import { useGardenerimBehavior } from "@gardenerim/vue/composables";
```

28 个组件样式包也可通过 `@gardenerim/vue/component-css/*` 引入，例如 `@gardenerim/vue/component-css/forms`。

需要单文件预压缩入口时可导入 `@gardenerim/vue/bundle.min.js`；常规项目仍推荐根入口或 `components` 入口以获得最佳摇树结果。

机器可读契约分别通过 `@gardenerim/vue/schema/public-api`、`@gardenerim/vue/schema/compatibility` 和 `@gardenerim/vue/schema/performance` 提供。

组件的完整逐项目录见 [components.md](./components.md)。

## 参数化导航（41 个组件）

`navigation` / `items`（AngularJS 为 `gardenerNavigation` / `gardener-navigation`）接入共享 CSS 导航控制器。`GardenerimNavigationItem` 描述条目，`GardenerimNavigationOptions` 描述外观和行为，`GardenerimNavigationChange` 描述变更，`GardenerimNavigationInstance` 提供更新和销毁。受控值使用原有框架绑定，未提供数据参数时保持原插槽用法。

完整参数、事件、五框架示例及生命周期边界见 [导航说明](../../../docs/navigation/README.md)。

## GTable 数据表格

`table` 配置整体表格，`columns` 与 `data` 可单独传入 Vue / React。AngularJS 使用 `gardenerTable`（`gardener-table`）和 `gardenerOnChange`（`gardener-on-change`，局部值 `$value` 是完整变更详情）。类型导出：`GardenerimTableOptions`、`GardenerimTableColumn`、`GardenerimTableInstance`、`GardenerimTableState`、`GardenerimTableChange`、`GardenerimTableKey`。

支持四档尺寸、排序筛选、选择、分页、固定/分组表头、树形与详情展开、合并、汇总、编辑、调整列宽、行排序与固定行高虚拟滚动。保留静态表格。完整选项和平台边界见 [GTable 文档](../../../docs/table.md)。

## GTag

使用共享 `tag-options`，支持受控 checked / visible、可取消的选择与关闭、4 档尺寸、13 种预设色、自定义颜色及原生模板。完整参数及事件见 [GTag API](../../../docs/tag.md)。

## GTimeline

使用共享 `data-options` 配置时间线方向、排列、倒序、进行中节点和原生模板。完整参数与事件见 [GTimeline API](../../../docs/timeline.md)。

## GTooltip

通过 overlay-options 配置内容、十二方位、Mini、背景色、受控开关及触发器。完整参数见 [GTooltip API](../../../docs/tooltip.md)。

Arco 对照新增组件：GInputNumber、GInputTag、GColorPicker、GAffix、GResizeBox、GScrollbar、GSpace、GWatermark、GOverflowList、GLink、GTypography、GIcon。共用 foundation-options；参阅 [参数与差异](../../../docs/arco/README.md)。
