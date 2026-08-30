# Gardener AngularJS

Gardener CSS 1.0.0 的官方 AngularJS 1.x 适配层，版本 `1.0.0`、状态 Stable。支持并验证 AngularJS `>=1.8.2 <1.9.0`，完整映射 506 个 CSS 组件和 66 种 DOM 行为。

> AngularJS 1.x 已结束官方支持。本包面向必须维护 AngularJS 1.8.x 的现有系统；AngularJS 作为 peer dependency，不会被打入 Gardener 产物。新项目应优先采用 Gardener 的 Vue、React 或框架无关 CSS 入口。遗留风险与上线要求见 [安全基线](./docs/security.md)。

```bash
npm install @gardenerim/angularjs @gardenerim/css angular
```

```js
import "angular/angular.js";
import { createGardenerAngularJS } from "@gardenerim/angularjs";
import "@gardenerim/angularjs/style.css";

const gardenerModule = createGardenerAngularJS(window.angular);
window.angular.module("app", [gardenerModule]);
```

```html
<gardener-provider gardener-theme="garden" gardener-mode="light" gardener-shape="small">
  <button g-button gardener-variant="primary">保存</button>
  <input g-input ng-model="$ctrl.keyword" aria-label="关键词">
</gardener-provider>
```

每个组件同时支持元素指令（如 `<g-button>`）和属性指令（如 `<button g-button>`）；涉及 table、form、input 等原生语义时优先使用属性形式。完整 API 见 [docs/API.md](./docs/API.md)，全部组件见 [docs/components.md](./docs/components.md)。

```bash
npm run release:verify
```

MIT
