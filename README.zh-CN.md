# Gardenerim

[English](README.md)

Gardenerim 是面向人工开发和 AI 自动生成页面的通用 CSS 基础框架与组件系统。2.0.0 覆盖 PC 网站、移动网页、后台 Dashboard、超级 CMS、AI 交互，以及 Tauri/Electron 类桌面应用外壳；默认采用白色浅色基调、克制的通用风格和小圆角。

仓库包含 CSS/运行时核心、506 个完整组件、Vue 3、React、AngularJS 1.x、Blazor 官方适配器，以及支持七种语言的官网与文档。系统刻意准备足够完整的预设、组合组件和机器可读契约，减少 AI 或业务项目临时组织 CSS 的需要。

## 子项目

| 包 | 用途 | 目录 |
| --- | --- | --- |
| `@gardenerim/css` | Token、主题、工具类、布局、语义组件、运行时行为和平台构建 | [`packages/css`](packages/css) |
| `@gardenerim/vue` | Vue 3 组件、组合式函数、插件和桌面适配 | [`packages/vue`](packages/vue) |
| `@gardenerim/react` | React 组件、Hooks、Provider 和桌面适配 | [`packages/react`](packages/react) |
| `@gardenerim/angularjs` | 用于存量系统的 AngularJS 1.8 指令和服务 | [`packages/angularjs`](packages/angularjs) |
| `Gardenerim.Blazor` | 基于 .NET 10，并持续检查 .NET 11 兼容性的 Razor 组件库 | [`packages/blazor`](packages/blazor) |
| 官网与文档 | 落地页、完整可检索目录和七种语言 | [`website`](website) |

AngularJS 本身已经停止官方维护。该适配器用于明确的存量维护和迁移场景；新项目通常应选择 Vue、React、Blazor，或直接使用无框架的 CSS/运行时包。

## 2.0.0 能力范围

- 42 套预设颜色主题，默认白色浅色、小圆角。
- 14,916 个 CSS 类，其中 11,498 个工具类、3,418 个语义类。
- 506 个标准组件，并由全部官方适配器一致暴露。
- 66 种运行时行为、75 类标准事件和 52 个可复用页面配方。
- 37 个 CSS 模块、160 个设计 Token，以及 Web、Mobile、Desktop、Tauri、Electron 平台构建。
- 响应式与容器响应布局，包括 24 栅格、区域布局、布局原语、页面外壳、安全区、RTL、打印、强制色和减少动态效果。
- 登录认证、导航、数据、选择、内容、交易、移动端、桌面端、AI 和完整解决方案页面组合。

每个包内的 Schema、Manifest 和兼容性清单是公共 API 的标准来源；官网从这些元数据生成全量目录，不维护容易遗漏的精选清单。

## 安装

无框架项目：

```sh
npm install @gardenerim/css
```

```js
import "@gardenerim/css";
import { init } from "@gardenerim/css/runtime";

init();
```

框架适配器共用同一套 CSS 和运行时契约：

```sh
npm install @gardenerim/css @gardenerim/vue
npm install @gardenerim/css @gardenerim/react
npm install @gardenerim/css @gardenerim/angularjs angular
```

Blazor 项目可引用 `Gardenerim.Blazor` NuGet 包；在本仓库开发时，也可直接引用 `packages/blazor/src/Gardenerim.Blazor` 项目。完整导出、平台构建、浏览器范围、无障碍行为和发布门禁见各子包 README。

## 目录结构

```text
Gardenerim/
├─ packages/
│  ├─ css/          CSS 核心与运行时
│  ├─ vue/          Vue 3 适配器
│  ├─ react/        React 适配器
│  ├─ angularjs/    AngularJS 1.x 适配器
│  └─ blazor/       .NET 10/11 Razor 组件库
├─ website/         落地页与完整文档
├─ docs/            架构和发布说明
├─ scripts/         仓库级检查
└─ .github/         CI、依赖更新和协作模板
```

这是一个统一编排的 monorepo，而不是 npm workspace：每个可发布包保留独立 lockfile 和发布边界，根 `package.json` 仅用于统一执行任务。

## 本地开发

仓库开发需要 Node.js 20.19+ 或 22.12+（推荐 CI 使用的 Node.js 24 LTS）、npm；构建 Blazor 还需要 .NET 10 SDK。已构建 JavaScript 包保留 Node.js 18.18+ 消费兼容性，不代表 Vite 开发环境支持 Node.js 18。

```sh
npm run bootstrap
npm run build
npm run check
npm test
```

构建全部包后启动官网：

```sh
npm run serve
```

打开 `http://127.0.0.1:4173/website/`。完整发布门禁为 `npm run release:verify`，它还会执行各包定义的多浏览器、移动端、无障碍、Schema、打包、可复现性、兼容性和性能预算检查。

## 文档与治理

- [架构说明](docs/architecture.md)
- [2.0 破坏性改名与迁移](docs/migration-2.0.md)
- [组件能力层级](docs/component-levels.md)
- [数据驱动 DataGrid](docs/data-grid.md)
- [轻量后台引入](docs/lightweight-admin.md)
- [发布流程](docs/releasing.md)
- [参与贡献](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [支持方式](SUPPORT.md)
- [社区行为准则](CODE_OF_CONDUCT.md)
- [变更记录](CHANGELOG.md)

Gardenerim 使用 [MIT License](LICENSE) 开源，第三方声明见 [NOTICE](NOTICE)。
