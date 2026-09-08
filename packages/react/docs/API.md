# Gardenerim React API

## 安装

```bash
npm install @gardenerim/react @gardenerim/css react react-dom
```

React 版本范围为 `>=18.3.0 <20.0.0`。加载 `@gardenerim/react/style.css` 可获得完整样式；按平台可改用 `platform/web.css`、`mobile.css`、`desktop.css`、`tauri.css` 或 `electron.css`。

## 组件公共属性

全部 510 个 `G*` 组件都支持：

- `as`：替换根元素或 React 组件。
- `variant`：字符串或数组，转换为组件变体类。
- `state`：字符串或数组，转换为 `is-*` 状态类。
- `config`：转换为 `data-g-*` 运行时配置。
- `initialize`：是否初始化 Gardenerim DOM 行为，默认 `true`。
- `value` / `defaultValue`：受控值和初始非受控值。
- `valueEvent` / `valueKey`：从 `gardener:*` 自定义事件载荷同步值。
- `onValueChange(value, event)`：统一接收原生表单与 Gardenerim 行为值变更。
- 所有原生 attributes、events 与 `children` 均透传。

组件 Ref 公开 `element`、`getInstance()` 和 `refresh()`：

```tsx
const dialog = createRef<GardenerimComponentHandle>();
<GDialog ref={dialog}><GardenerimPart name="dialog">...</GardenerimPart></GDialog>;
dialog.current?.getInstance("dialog");
```

## Provider 与主题

`GardenerimProvider` 支持 `theme`、`mode`、`neutral`、`typography`、`shape`、`density`、`elevation`、`motion`、`platform` 和 `os` 十条主题轴，并提供 `GardenerimThemeContext` 与 `useGardenerimThemeContext`。

## 受控值

```tsx
<GInput value={keyword} onValueChange={(value) => setKeyword(String(value))} />
<GTreeSelect value={id} valueEvent="pickerchange" valueKey="value" onValueChange={setId} />
```

## 8 个 Hooks

- `useGardenerim`
- `useGardenerimBehavior`
- `useGardenerimEvent`
- `useGardenerimLocale`
- `useGardenerimTheme`
- `useGardenerimToast`
- `useTauriWindowControls`
- `useElectronWindowControls`

## 按需引入

```tsx
import { GButton, GCard, GDialog } from "@gardenerim/react/components";
import { useGardenerimBehavior } from "@gardenerim/react/hooks";
import "@gardenerim/react/component-css/forms.css";
```

包提供 29 个入口，包括根入口、components、component、hooks、provider、adapters、tauri、electron、catalog、catalog.json、六个样式层、五个平台样式、`component-css/*.css` 正式入口与 `component-css/*` 兼容别名、预压缩 bundle、performance、三份 Schema 与 package.json。

## Tauri 与 Electron

`useTauriWindowControls`、`useElectronWindowControls` 随 React 生命周期绑定并销毁桌面窗口按钮；`bindTauriWindowControls` 与 `bindElectronWindowControls` 也可直接使用。`@gardenerim/react/tauri` 与 `@gardenerim/react/electron` 是相互隔离的独立模块，单平台导入不会连带加载另一平台桥接。桥接对象保持显式注入，不向不可信页面暴露 Node 或原生对象。

## SSR、StrictMode 与 Hydration

根入口导入不会访问浏览器全局对象；DOM 行为只在 Effect 中初始化。Effect 清理会销毁行为实例，因此可承受开发环境 StrictMode 的重复挂载检查。服务端输出包含稳定类名和数据属性，可直接 Hydration。

## 机器可读契约

- `@gardenerim/react/schema/public-api`
- `@gardenerim/react/schema/compatibility`
- `@gardenerim/react/schema/performance`
- `@gardenerim/react/catalog.json`
- `@gardenerim/react/performance`

全部 510 个组件见 [components.md](./components.md)。

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
