# Changelog

## [2.1.0] - 2026-09-01

- Consume the shared Arco-aligned 28/32/36px Gardenerim control scale and 14px control typography.
- Mark the adapter as a legacy migration bridge because AngularJS is end-of-life and has unresolved upstream advisories.
- Expose runtime localization through GardenerimRuntime and re-export the complete 2.1 lifecycle API.
- Add a narrow CI exception that fails for every vulnerability outside the upstream angular package or when a fix becomes available.

## [2.0.0] - 2026-08-31

- Breaking: use Gardenerim-branded public exports only; remove Gardener aliases and update migration examples.
- Fix Vue radio, multiple-select, checkbox-array and IME model semantics, and React multiple-select values.
- Add opt-in DataGrid data mode with paging, filtering, sorting, selection, editing, fixed-height virtualization and cancellable server loading.
- Add generated strict component/DataGrid type contracts, executable Blazor examples and lightweight CSS guidance.
- Expand regression and package checks; keep existing published 1.0.0 artifacts unchanged.

## 1.0.0

- 首个 Stable 版本，完整映射 Gardenerim CSS 1.0.0 的 506 个组件与 66 种行为。
- 提供 AngularJS 1.8.x 模块、元素/属性指令、ngModel、主题、服务和桌面桥接。
- 提供 29 个公共包入口、28 个组件 CSS 包代理、Schema、性能和发布门禁。
- 验证 AngularJS 1.8.2–1.8.3，补充严格组件名类型、动态生命周期、原生表单语义与公开安全基线。
