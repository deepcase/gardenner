# Gardener React

Gardener CSS 1.0.0 的官方 React 适配层，版本 `1.0.0`、状态 Stable。支持 React `>=18.3.0 <20.0.0`，完整映射 CSS 项目的 506 个组件和 66 种 DOM 行为，并提供类型安全组件、Provider、Hooks、受控值桥接、SSR 安全导入、桌面适配与按需样式。

## 快速开始

```bash
npm install @gardenerim/react @gardenerim/css react react-dom
```

```tsx
import { createRoot } from "react-dom/client";
import { GButton, GCard, GardenerProvider } from "@gardenerim/react";
import "@gardenerim/react/style.css";

createRoot(document.getElementById("root")!).render(
  <GardenerProvider theme="garden" mode="light" shape="subtle">
    <GCard><GButton variant="primary">保存</GButton></GCard>
  </GardenerProvider>,
);
```

## 1.0.0 能力范围

- 506 个自动生成、独立具名且支持 `forwardRef` 的 `G*` 组件。
- 66 种 Gardener 行为的挂载、销毁和实例访问。
- Web、Mobile、Desktop、Tauri、Electron 五种 CSS 平台入口。
- 完整、核心、主题、工具、组件、AI 六种 CSS 入口与 28 个组件样式包代理。
- 29 个公共包入口，同时支持 `component-css/forms` 与 `component-css/forms.css`。
- 10 个组件公共属性、Imperative Handle、原生 attributes/events/children 透传。
- 原生表单与 `gardener:*` 自定义事件的受控值桥接。
- 十轴 `GardenerProvider`，默认不启用深色模式。
- 7 个 Hooks，包括相互隔离的 Tauri/Electron 窗口控制入口与 Hooks。
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
