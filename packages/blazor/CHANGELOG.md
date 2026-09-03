# Changelog

## [2.1.0] - 2026-09-01

- Embed the shared Arco-aligned 28/32/36px Gardenerim control scale and 14px control typography in the Razor Class Library assets.
- Add GardenerimLocalizationService and strongly typed localization options/state for the seven-locale runtime catalog.
- Include locales.js in Razor Class Library static assets so the localized runtime resolves in published consumers.
- Keep all 506 components, 72 behaviors, 79 events, .NET 10 target, and .NET 11 consumer compatibility.

## [2.0.0] - 2026-08-31

- Breaking: use Gardenerim-branded public exports only; remove Gardener aliases and update migration examples.
- Fix Vue radio, multiple-select, checkbox-array and IME model semantics, and React multiple-select values.
- Add opt-in DataGrid data mode with paging, filtering, sorting, selection, editing, fixed-height virtualization and cancellable server loading.
- Add generated strict component/DataGrid type contracts, executable Blazor examples and lightweight CSS guidance.
- Expand regression and package checks; keep existing published 1.0.0 artifacts unchanged.

## 1.0.0 - 2026-08-28

- 首次稳定发布，目标框架 `net10.0`，验证 `net11.0` 消费。
- 完整生成 506 个 Gardenerim Razor 组件和 66 个运行时行为绑定。
- 提供十轴主题 Provider、强类型 EditForm 字段、Toast、Tauri 与 Electron 服务。
- 提供全量、5 个平台和 28 个组件域静态资源构建。
- 增加契约、浏览器、可重复构建、NuGet 内容、Schema 与性能预算门禁。
- 深度审计补齐 75 个事件、行为成员、守卫取消、组件状态/无障碍元数据、source map、真实 NuGet 消费以及 Chromium/Firefox/WebKit 验证。
