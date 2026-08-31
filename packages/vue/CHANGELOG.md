# Changelog

## [2.0.0] - Unreleased

- Breaking: use Gardenerim-branded public exports only; remove Gardener aliases and update migration examples.
- Fix Vue radio, multiple-select, checkbox-array and IME model semantics, and React multiple-select values.
- Add opt-in DataGrid data mode with paging, filtering, sorting, selection, editing, fixed-height virtualization and cancellable server loading.
- Add generated strict component/DataGrid type contracts, executable Blazor examples and lightweight CSS guidance.
- Expand regression and package checks; keep existing published 1.0.0 artifacts unchanged.

## 1.0.0

- 首个稳定版本。
- 对应 `@gardenerim/css@1.0.0` 的全部 506 个组件和 66 种行为。
- 提供全局插件、具名组件、通用组件、Part、指令和五个 Composable。
- 支持十轴主题、五类平台 CSS、SSR、TypeScript 和按需导入。
- 支持原生表单与 Gardenerim 事件的 `v-model` 桥接、Tauri/Electron 生命周期适配及 28 个组件样式包入口。
- 建立生成覆盖、可复现构建、性能预算、封包及 publint 发布门禁。
- 建立 Chromium、WebKit、Firefox、移动视口、WCAG A/AA、Vue SFC 类型和封闭 JSON Schema 门禁。
