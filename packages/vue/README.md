# Gardenerim Vue

Gardenerim CSS 2.1.0 的官方 Vue 3 适配层，版本 `2.1.0`。它完整映射 CSS 项目的 506 个组件和 72 种 DOM 行为，并提供 Vue 插件、类型安全组件、指令、Composable、主题 Provider、SSR 安全导入和按需加载入口。

## 快速开始

```bash
npm install @gardenerim/vue @gardenerim/css vue
```

```ts
import { createApp } from "vue";
import GardenerimVue from "@gardenerim/vue";
import "@gardenerim/vue/style.css";
import App from "./App.vue";

createApp(App).use(GardenerimVue).mount("#app");
```

```vue
<script setup lang="ts">
import { GButton, GCard, GardenerimProvider } from "@gardenerim/vue";
</script>

<template>
  <GardenerimProvider theme="garden" mode="light" shape="subtle">
    <GCard>
      <GButton variant="primary">保存</GButton>
    </GCard>
  </GardenerimProvider>
</template>
```

## 能力范围

- 506 个自动生成且独立具名的 `G*` 组件导出。
- 默认控件继承 Gardenerim CSS 的 28 / 32 / 36px 高度与 14px 字体；紧凑模式为 24 / 28 / 32px。
- 72 种 Gardenerim 行为的挂载、销毁和实例访问。
- Web、Mobile、Desktop、Tauri、Electron 五种 CSS 平台入口。
- 完整/核心/主题/工具/组件/AI 六种 CSS 入口。
- 全局插件和 `@gardenerim/vue/components` 按需导出。
- 原生表单及 Gardenerim 自定义事件的 `v-model` 桥接。
- 28 个 `@gardenerim/vue/component-css/*` 组件样式包代理入口。
- `v-gardenerim` 指令、六个核心 Composable 和 Tauri/Electron 窗口控制 Composable。
- 十轴主题 Provider，默认不引入深色模式。
- TypeScript、SSR、原生 attributes、事件和 slots 支持。
- Chromium、WebKit、Firefox、移动视口与 WCAG A/AA 自动化门禁。
- 公共 API、稳定兼容基线和性能报告的封闭 JSON Schema。

完整 API 见 [docs/API.md](./docs/API.md)，全部组件逐项清单见 [docs/components.md](./docs/components.md)。

## 质量门禁

```bash
npm run release:verify
```

该命令验证生成覆盖、Vue SFC 类型、DOM 生命周期、真实浏览器、移动端、无障碍、示例构建、真实按需摇树、确定性构建、性能预算、npm 封包和 publint。

## 许可证

MIT

## 运行时国际化

插件和 `GardenerimProvider` 都接受 `locale` 与 `messages`；`useGardenerimLocale()` 可读写同一份 Gardenerim 运行时配置。内置七种语言，不支持的语言回退到英语。
