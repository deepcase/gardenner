# Gardenerim

[简体中文](README.zh-CN.md)

Gardenerim is a comprehensive, framework-agnostic CSS foundation and component system for human- and AI-authored interfaces. Version 2.2.0 covers public websites, mobile web, dashboards, CMS products, AI workflows, and Tauri/Electron-style desktop shells with a light, restrained, small-radius default visual language.

The repository includes the core CSS/runtime package, 520 documented components, official Vue 3, React, AngularJS 1.x, and Blazor adapters, plus a seven-language documentation website. The system intentionally favors complete reusable contracts over requiring application generators to invent new CSS.

## Packages

| Package | Purpose | Location |
| --- | --- | --- |
| `@gardenerim/css` | Tokens, themes, utilities, layout systems, semantic components, runtime behaviors, platform builds | [`packages/css`](packages/css) |
| `@gardenerim/vue` | Vue 3 components, composables, plugin, desktop adapters | [`packages/vue`](packages/vue) |
| `@gardenerim/react` | React components, hooks, provider, desktop adapters | [`packages/react`](packages/react) |
| `@gardenerim/angularjs` | AngularJS 1.8 directives and services for maintained legacy products | [`packages/angularjs`](packages/angularjs) |
| `Gardenerim.Blazor` | Razor component library targeting .NET 10 with .NET 11 compatibility checks | [`packages/blazor`](packages/blazor) |
| Documentation website | Landing page, complete searchable catalogs, seven locales | [`website`](website) |

AngularJS itself is end-of-life. The adapter exists for deliberate legacy maintenance and migrations; new applications should normally select Vue, React, Blazor, or the framework-agnostic CSS/runtime package.

## Coverage at 2.2.0

- 42 preset color themes with a white/light default and intentionally small default radii.
- Generated utilities and semantic component classes, indexed in the canonical CSS manifests.
- 520 canonical components exposed consistently through every official adapter.
- 76 runtime behaviors, 102 normalized events, and 52 reusable page recipes.
- Component CSS modules and shared design tokens, platform builds for web, mobile, desktop, Tauri, and Electron.
- Responsive and container-aware grids, including a 24-column grid, regions, primitives, page shells, safe areas, RTL, print, forced-colors, and reduced-motion support.
- Full compositions for authentication, navigation, data, selection, content, commerce, mobile, desktop, AI, and solution pages.

The machine-readable schemas and manifests under each package are the canonical public contract; the website renders those contracts instead of maintaining a hand-picked catalog.

## Install

Choose the smallest integration that fits the application:

```sh
npm install @gardenerim/css
```

```js
import "@gardenerim/css";
import { init } from "@gardenerim/css/runtime";

init();
```

Framework adapters use the same CSS and runtime contract:

```sh
npm install @gardenerim/css @gardenerim/vue
npm install @gardenerim/css @gardenerim/react
npm install @gardenerim/css @gardenerim/angularjs angular
```

For Blazor, reference the `Gardenerim.Blazor` NuGet package or the project under `packages/blazor/src/Gardenerim.Blazor` while developing this monorepo.

See each package README for exports, platform-specific builds, browser support, accessibility behavior, and production release gates.

## Repository layout

```text
Gardenerim/
├─ packages/
│  ├─ css/          core framework and runtime
│  ├─ vue/          Vue 3 adapter
│  ├─ react/        React adapter
│  ├─ angularjs/    AngularJS 1.x adapter
│  └─ blazor/       .NET 10/11 Razor component library
├─ website/         landing page and complete documentation
├─ docs/            architecture and release guidance
├─ scripts/         repository-wide validation
└─ .github/         CI, security automation, and contribution templates
```

This is an orchestrated monorepo, not an npm workspace: each publishable package keeps its own lockfile and release boundary. The root package is private and only coordinates common tasks.

## Development

Repository development requires Node.js 20.19+ or 22.12+ (Node.js 24 LTS recommended), npm, and the .NET 10 SDK for Blazor. Published JavaScript packages retain Node.js 18.18+ consumption compatibility; that is not the Vite development requirement.

```sh
npm run bootstrap
npm run build
npm run check
npm test
```

Run the local website after building all packages:

```sh
npm run serve
```

Then open `http://127.0.0.1:4173/website/`. The complete release gate is `npm run release:verify`; it also runs browser, accessibility, schema, package, reproducibility, compatibility, and performance-budget checks defined by the individual packages.

## Documentation and governance

- [Architecture](docs/architecture.md)
- [2.0 migration and breaking export rename](docs/migration-2.0.md)
- [Component capability levels](docs/component-levels.md)
- [Data-driven DataGrid](docs/data-grid.md)
- [Lightweight admin imports](docs/lightweight-admin.md)
- [2.1 migration and security notes](docs/migration-2.1.md)
- [2.2.0 stabilization report](docs/release-2.2/README.md)
- [2.1 historical verification report](docs/release-2.1-verification.md)
- [Release process](docs/releasing.md)
- [Contributing](CONTRIBUTING.md)
- [Security policy](SECURITY.md)
- [Support](SUPPORT.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Changelog](CHANGELOG.md)

Gardenerim is available under the [MIT License](LICENSE). Third-party notices are described in [NOTICE](NOTICE).

数据展示扩展：52 个组件、252 个变体，五端共享尺寸、数据参数和交互。[完整文档](docs/data/README.md)。

仪表盘：7 个组件、39 个变体；五端共享数据配置、受控状态、数字格式、真实图表及筛选联动。详见 [仪表盘指南](docs/dashboard/README.md)。


## 交互组件

35 个交互组件、239 个可组合变体共享数据、受控状态和行为实现，新增撤销／重做。详见 [交互参数与完整演示](docs/interaction/README.md)。


## 内容组件

39 个内容组件、234 个变体采用一致的数据参数、受控状态和共享行为，新增 Markdown 阅读器。详见 [内容参数与完整演示](docs/content/README.md)。

### GPopover

[Arco-inspired Popover: parameters, slots and five-framework usage](docs/popover.md).

### GStatistic

[Numeric precision, animation, dates and countdown in five frameworks](docs/statistic.md).

GTabs: six styles, four sizes, controlled selection, editable requests and panel lifecycle. [Shared parameters and demos](docs/tabs.md).

GTag: [shared options and examples](docs/tag.md) — controlled selection, cancellable close, sizes, colors and templates.

GTimeline: [shared layout options and examples](docs/timeline.md) — direction, alternate, reverse, pending, labels and templates.

GTooltip 参数、五端用法与演示见 [Tooltip API](docs/tooltip.md)。

GTree 参数、受控状态、异步加载、拖拽和虚拟滚动见 [GTree API](docs/tree.md)。

[Arco 对应清单与新增组件](docs/arco/README.md) 覆盖 74 项映射、12 项补充，沿用 Gardenerim 设计语言和五端协议。
