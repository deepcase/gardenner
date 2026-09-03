# Gardenerim AngularJS

Gardenerim CSS 2.1.0 的官方 AngularJS 1.x 适配层，版本 `2.1.0`、状态 Stable。支持并验证 AngularJS `>=1.8.2 <1.9.0`，完整映射 506 个 CSS 组件和 72 种 DOM 行为。

> AngularJS 1.x 已结束官方支持。本包面向必须维护 AngularJS 1.8.x 的现有系统；AngularJS 作为 peer dependency，不会被打入 Gardenerim 产物。新项目应优先采用 Gardenerim 的 Vue、React 或框架无关 CSS 入口。遗留风险与上线要求见 [安全基线](./docs/security.md)。

```bash
npm install @gardenerim/angularjs @gardenerim/css angular
```

```js
import "angular/angular.js";
import { createGardenerimAngularJS } from "@gardenerim/angularjs";
import "@gardenerim/angularjs/style.css";

const gardenerModule = createGardenerimAngularJS(window.angular);
window.angular.module("app", [gardenerModule]);
```

```html
<gardener-provider gardener-theme="garden" gardener-mode="light" gardener-shape="small">
  <button g-button gardener-variant="primary">保存</button>
  <input g-input ng-model="$ctrl.keyword" aria-label="关键词">
</gardener-provider>
```

每个组件同时支持元素指令（如 `<g-button>`）和属性指令（如 `<button g-button>`）；涉及 table、form、input 等原生语义时优先使用属性形式。完整 API 见 [docs/API.md](./docs/API.md)，全部组件见 [docs/components.md](./docs/components.md)。

默认控件继承 Gardenerim CSS 的 28 / 32 / 36px 高度与 14px 字体；紧凑模式为 24 / 28 / 32px，移动端与触控模式继续保留更大的点击目标。

```bash
npm run release:verify
```

MIT

## 运行时国际化

注入 `GardenerimRuntime` 后调用 `configure({ locale, messages })`，或调用 `getConfiguration()` 读取当前语言。内置七种语言，不支持的语言回退到英语。此能力不改变 AngularJS 已停止维护的安全状态。
