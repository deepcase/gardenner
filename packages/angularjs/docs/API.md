# Gardenerim AngularJS 2.1.0 API

> AngularJS 1.x 已结束官方支持。本适配层用于经过验证的 AngularJS 1.8.2–1.8.3 遗留系统，并将 `angular` 保持为外部 peer dependency。应用仍需自行执行 CSP、依赖审计、输入净化与迁移计划；Gardenerim 不会掩盖或改写 AngularJS 自身的安全边界。完整要求见 [安全基线](./security.md)。

## 模块安装

`createGardenerimAngularJS(angular, options)` 注册并返回 AngularJS 模块名，默认是 `gardener`。包本身不读取 `window.angular`，因此 ESM 导入不会隐式修改全局 AngularJS 注册表。

AngularJS npm 包不是原生 ESM；在 Vite 等 ESM 构建中应先执行 `import "angular/angular.js"`，再把 `window.angular` 传给模块工厂。不要依赖不稳定的 `import angular from "angular"` 默认导入。

```ts
const moduleName = createGardenerimAngularJS(angular, {
  moduleName: "gardener",
  dependencies: [],
  components: ["button", "input", "GDialogDirective", "gCard"],
  initialize: true,
  registerProvider: true,
  registerBehaviorDirective: true,
});
```

同一个 AngularJS 实例、模块名和同一组选项重复安装会返回已有模块，不会重复注册指令；若同名模块使用不同依赖、组件子集或初始化选项再次安装，会明确抛错，避免应用静默运行在错误的部分注册状态。

## 506 个组件指令

每个 CSS 组件生成三个稳定名称：

- ESM 工厂导出，例如 `GButtonDirective`。
- AngularJS 指令名，例如 `gButton`。
- HTML 元素名，例如 `g-button`。

```html
<g-card gardener-variant="interactive">...</g-card>
<button g-button gardener-variant="primary">保存</button>
```

原生语义敏感的组件推荐属性形式，如 `button`、`input`、`form`、`table`、`nav` 和 `aside`。

全部公共属性：

| 属性 | 作用 |
| --- | --- |
| `gardener-variant` | 空格或逗号分隔的组件变体 |
| `gardener-state` | 转换为一个或多个 `is-*` 状态类 |
| `gardener-config` | AngularJS 表达式对象，映射为 `data-g-*` 配置 |
| `gardener-initialize` | 是否初始化 Gardenerim DOM 行为 |
| `ng-model` | 原生表单或自定义事件的双向值 |
| `gardener-value-event` | 自定义 `gardener:*` 值事件 |
| `gardener-value-key` | 从 `CustomEvent.detail` 中取值的键 |
| `gardener-on-value-change` | 表达式回调，locals 为 `$value`、`$event` |

组件元素通过 `element.data("$gardenerHandle")` 暴露 `element`、`getInstance()`、`refresh()` 和 `destroy()`；`refresh()` 会销毁并按当前 `gardener-config` 重新初始化节点子树。组件筛选项如果不是有效组件名、导出名或指令名会直接抛错，避免拼写错误静默漏注册。

## 通用指令

- `gGardenerim`（模板写作 `g-gardenerim="dialog"`）：为任意节点声明一个 Gardenerim 行为并接入 AngularJS 销毁周期。
- `gardenerProvider`（模板写作 `<gardener-provider>` / `gardener-provider`）：应用十轴主题并初始化其子树。

主题属性是 `gardener-theme`、`gardener-mode`、`gardener-neutral`、`gardener-typography`、`gardener-shape`、`gardener-density`、`gardener-elevation`、`gardener-motion`、`gardener-platform`、`gardener-os`。默认文档示例使用 Light 与小圆角。

AngularJS 归一化后的公共属性名为 `gardenerVariant`、`gardenerState`、`gardenerConfig`、`gardenerInitialize`、`ngModel`、`gardenerValueEvent`、`gardenerValueKey`、`gardenerOnValueChange`。

## 服务

- `GardenerimRuntime`：`init`、`destroy`、`getInstance`、`emit`、`observe`。
- `GardenerimTheme`：`attributes`、`apply`、`read`、`clear`。
- `GardenerimToast`：`show(options)`。

## Tauri 与 Electron

平台入口彼此隔离：

```ts
import { createTauriWindowService } from "@gardenerim/angularjs/tauri";
import { createElectronWindowService } from "@gardenerim/angularjs/electron";
```

两个服务均返回带 `available` 与 `destroy()` 的绑定对象，并复用 Gardenerim CSS 的安全桥接契约。

## 样式与包入口

提供完整、core、themes、utilities、components、AI，Web、Mobile、Desktop、Tauri、Electron 五个平台，以及 28 个 `component-css/*` 功能包代理。`component-css/forms` 与 `component-css/forms.css` 均有效。

公共 API、Compatibility、Performance 均提供关闭未知字段的 JSON Schema。组件目录可从 `@gardenerim/angularjs/catalog` 或 `catalog.json` 读取。

## TypeScript 类型

24 个公共类型完整导出：`GardenerimAngularJSComponentExportName`、`GardenerimAngularJSComponentName`、`GardenerimAngularJSDirectiveFactory`、`GardenerimAngularJSDirectiveName`、`GardenerimAngularJSModule`、`GardenerimAngularJSOptions`、`GardenerimAngularJSStatic`、`GardenerimBehaviorInstance`、`GardenerimBehaviorName`、`GardenerimComponentDefinition`、`GardenerimComponentHandle`、`GardenerimComponentKind`、`GardenerimConfigValue`、`GardenerimElectronBinding`、`GardenerimElectronBridge`、`GardenerimEventName`、`GardenerimPlatform`、`GardenerimRuntimeService`、`GardenerimTauriBinding`、`GardenerimTauriBridge`、`GardenerimThemeAxis`、`GardenerimThemeService`、`GardenerimThemeState`、`GardenerimValueChangeLocals`。

## 生命周期与兼容性

组件在 AngularJS link 阶段配置，在 `$evalAsync` 后初始化，在 `$destroy` 中移除事件并销毁行为。包支持 AngularJS 1.8.2–1.8.3、桌面 Chromium/WebKit/Firefox、Pixel 7、iPhone 13、WCAG A/AA，并对完整 npm 包、摇树、可复现构建和压缩体积设有发布门禁。
