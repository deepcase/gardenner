# Gardener Website

Gardener 的白底官网与文档站。该目录只承载展示层，不参与 `packages/css/` 框架构建。

## 多语言

站点当前支持简体中文（`zh-CN`）、English（`en`）、日本語（`ja`）、한국어（`ko`）、Español（`es`）、Français（`fr`）和 Deutsch（`de`）。每种语言都发布为独立静态目录，例如 `en/index.html`、`ko/index.html` 和 `fr/docs.html`；页头语言选择器直接跳转到同一页面类型的目标语言 URL，不再使用 `?lang=`。根目录页面作为兼容入口，并通过 canonical 指向 `zh-CN/` 页面。

翻译词典位于 `assets/i18n/`，以根目录中文 HTML 为唯一内容源；代码、CSS 类名、组件名和 API 标识符不会翻译。`scripts/build-i18n.mjs` 会提取两个源页面的全部可翻译文本并检查六套词典一一闭合，`scripts/build-localized-pages.mjs` 再生成 7 种语言 × 首页/文档页共 14 个静态 HTML。每个生成页在首个 HTML 响应中已经包含对应语言的 `<html lang>`、标题、描述、正文、canonical、七种 `hreflang` 与 `x-default`，搜索引擎无需执行 JavaScript即可索引。浏览器运行时只读取本站 JSON，不向第三方发送内容。

## 页面

- `index.html`：产品落地页、`@gardener/vue 1.0.0`、`@gardener/react 1.0.0`、`@gardener/angularjs 1.0.0` 与 `Gardener.Blazor 1.0.0` 项目介绍、24 / 12 栅格、16 种传统区域布局、22 个经典布局原语、23 种页面级公共组件、28 种 Tip/帮助模式、37 种表单组合、38 种导航组合、48 种数据组合、32 种选择/批量操作模式、32 种文件/内容系统模式、32 种登录/账号模式、32 种商业/支付模式、32 种移动端特有模式、32 种桌面端特有模式、32 种 AI 智能交互模式与 32 种完整页面/行业解决方案，以及 `1.0.0` Stable 公共 API、TypeScript 类型、1,145 项兼容基线、npm/NuGet 发布包门禁、5 个平台档案、28 个组件包、506 个真实组件归属、正式产物预算和 SHA-256/SRI、可复现构建、运行时与 DOM 生命周期测试、真实浏览器、HTML/SSR 结构测试、主题和 52 个配方概览。
- `docs.html`：完整使用文档；Vue 公共 API 与全部 506 个 Vue 组件目录、538 个根运行时导出、21 个类型导出、29 个公共包入口、插件、Provider、v-model、指令和 7 个 Composable；React 公共 API 与全部 506 个 React 组件目录、538 个根运行时导出、22 个类型导出、29 个公共包入口、Provider、受控值、Imperative Handle 和 7 个 Hooks；AngularJS 公共 API 与全部 506 个 AngularJS 组件目录、535 个根运行时导出、24 个类型导出、29 个公共包入口、模块工厂、元素/属性指令、ngModel、3 个服务、动态生命周期和 EOL 安全基线；Blazor 公共 API 与全部 506 个 Razor 组件目录、66 个行为、75 个事件、28 个框架类型、20 个共同参数、6 个组件句柄成员、5 个服务、43 个静态资源、Razor Class Library、表单、SSR、.NET 10/11、Tauri/Electron、NuGet 和性能门禁。四套适配层均覆盖主题、平台/组件 CSS 包、Schema、兼容性、性能及发布门禁。文档同时覆盖 CSS 公共 API 与十一套闭合 Schema、48 个标准 Schema 验证用例、TypeScript 类型、1,145 项跨版本兼容基线、npm 发布包门禁、按平台/组件构建、正式 esbuild 压缩、Source Map、SHA-256/SRI、可复现构建、raw/gzip/Brotli/npm 包绝对与相对性能预算、栅格、区域布局、布局原语、全部组合组件接口、源码级 CSS API、全部组件元数据、工具类、9 个模块导出、66 种行为实例、75 种事件及载荷、全部运行时数据属性、配方目录，以及 Chromium/Firefox/WebKit、Pixel 7/iPhone 13、Axe 和 HTML 结构测试矩阵。

CSS 主框架的发布清单继续精确覆盖 42 个正式产物、74 个运行时与 DOM 生命周期测试、125 个默认真实浏览器用例和 24 个 HTML 结构用例；Vue 适配层继续提供 28 个组件 CSS 包。Blazor 使用同一份 CSS 权威元数据，但通过 NuGet 静态 Web Assets 分发 43 个资源文件。

## 本地预览

从项目根目录启动任意静态服务器，使 `website/` 与 `packages/css/` 保持同一站点根：

```bash
node website/scripts/serve.mjs
```

然后访问：

```text
http://127.0.0.1:4173/website/
http://127.0.0.1:4173/website/docs.html
```

文档目录会读取 `css/dist/gardener.manifest.json`、`gardener.utilities.json`、`gardener.recipes.json`、`gardener.capabilities.json`、`gardener.public-api.json`、`gardener.builds.json`、`gardener.performance.json` 和自动生成的 `website/assets/css-catalog.json`；还会分别合并 Vue、React、AngularJS 与 Blazor 的公共 API 和组件元数据，生成四套可检索的全量组件目录。框架变更后执行：

```bash
npm --prefix css run build
npm --prefix css run budget
npm --prefix vue run build
npm --prefix vue run check
npm --prefix react run build
npm --prefix react run check
npm --prefix angular run build
npm --prefix angular run check
npm --prefix blazor run build
npm --prefix blazor run check
node website/scripts/build-css-catalog.mjs
node website/scripts/build-i18n.mjs
node website/scripts/build-localized-pages.mjs
node website/scripts/check.mjs
node website/scripts/check-coverage.mjs
```

最后一项会逐个核对源码模块哈希，并保证每个 CSS 类、Token、状态钩子、数据属性、关键帧、组件和页面配方都有文档入口；同时核对 Vue、React、AngularJS 与 Blazor 的组件目录、公共 API、主题轴、行为/事件、框架类型、服务、静态资源、性能报告和兼容基线，防止适配层文档与 1.0.0 产物漂移。
