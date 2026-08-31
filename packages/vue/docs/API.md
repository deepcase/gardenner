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

全部 506 个 `G*` 组件都接受以下属性：

- `as`：修改根元素或 Vue 组件。
- `variant`：字符串或数组，转换为组件变体类。
- `state`：字符串或数组，转换为 `is-*` 状态类。
- `config`：转换为 `data-g-*` 运行时配置。
- `initialize`：是否初始化 Gardenerim DOM 行为，默认 `true`。
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
