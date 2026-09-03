# Gardenerim React API

## 安装

```bash
npm install @gardenerim/react @gardenerim/css react react-dom
```

React 版本范围为 `>=18.3.0 <20.0.0`。加载 `@gardenerim/react/style.css` 可获得完整样式；按平台可改用 `platform/web.css`、`mobile.css`、`desktop.css`、`tauri.css` 或 `electron.css`。

## 组件公共属性

全部 506 个 `G*` 组件都支持：

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

全部 506 个组件见 [components.md](./components.md)。
