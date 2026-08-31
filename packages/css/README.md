# Gardenerim CSS

Gardenerim 是一套面向人类开发者与 AI 页面生成器的通用 CSS 和 Web 组件基础设施。核心代码框架无关，覆盖 PC、移动网页、Dashboard、超级 CMS、营销与电商站、AI 产品以及 Tauri/Electron 桌面应用。

## 当前版本

- 当前包版本：`2.0.0`；公共契约状态为 Stable，1.x 中的删除必须先废弃、提供迁移说明，并延后到新的主版本
- 42 套主色主题，并与中性色、字体、形状、密度、层次、动效、平台七类主题轴正交组合
- Light、Dark、System、High Contrast 模式
- 480、768、1024、1280、1536 五档响应式断点
- 完整 24 栅格与 12 栅格兼容系统，包含列宽、偏移、排序、网格线、Gutter、容器查询、Subgrid、RTL 与打印
- Reset、排版、表单和无障碍基础样式
- 间距、尺寸、布局、文字、颜色、边框等生成式工具类
- 基础、表单、导航、反馈、数据、媒体、商业、Dashboard 和 AI 组件
- 32 种桌面端特有组合，覆盖窗口 Chrome、Dock 工作区、文档/文件、宿主系统状态、更新与恢复
- 32 种完整页面与行业解决方案，覆盖个人、企业、内容、后台、业务工作台及医疗、金融、政务等门户
- 66 类零依赖声明式运行时行为，覆盖浮层、导航、表单、数据、选择、内容、认证、商业、移动端、桌面端与 AI Composer/Prompt/Approval/Feedback
- 66 个逐行为运行时单元测试，以及动态节点、动态属性、子树销毁、多行为共存和事件冒泡的 DOM 生命周期测试
- Chromium、Firefox、WebKit 三引擎桌面项目，Pixel 7 与 iPhone 13 移动设备项目，以及 Axe 无障碍项目
- 125 个默认真实浏览器用例和 24 个 HTML 结构用例，覆盖 21 个示例、Home 落地页与文档、全量移动端回流、交互生命周期、320px 回流、触控目标、键盘焦点、RTL、Reduced Motion 与 Forced Colors
- 登录、移动分类、CMS 构建器、媒体库、营销、文章、电商、企业管理和桌面工作台等成品配方
- Tauri 与安全 Electron preload 桥接适配器
- 面向 AI 的组件、工具类、配方与行业能力 Manifest，以及状态和环境矩阵
- 公共 API 清单、完整 JSON Schema、跨清单引用校验与统一的 `behaviors` / `adapters` 命名
- Web、Mobile、Desktop、Tauri、Electron 五个平台构建档案，28 个独立组件包，以及全部 506 个组件到一个或多个真实所属包的机器可读映射
- esbuild 语法级正式压缩、主入口与自定义构建 Source Map、法律声明保留，以及覆盖全部 42 个正式压缩产物的 raw / gzip / Brotli / 压缩比例 / npm 包体积性能预算
- 全部 42 个正式产物的 SHA-256/SRI 完整性摘要、连续构建字节级可复现门禁，以及相对 0.9.0 基线的体积回归预算
- 从 `0.9.0` 固化的 1,145 项跨版本兼容基线，覆盖全部 47 个包入口、CSS 层、主题、运行时、组件、事件、属性与配方，禁止 1.x 未声明删除
- 自动生成并由 TypeScript 严格模式实测的 Runtime、Tauri、Electron 类型声明，支持 ESM 条件导出与编辑器补全
- npm 发布包白名单、入口存在性、开发文件泄漏、Publint、Node/浏览器支持矩阵、公开发布与 Provenance 发布前门禁
- 零运行时依赖，构建过程仅依赖 Node.js

默认视觉采用中性、克制、小圆角的通用风格。大圆角、胶囊形状、强阴影均为显式选择，不作为普通组件默认值。

## 构建

```bash
cd css
npm install
npx playwright install chromium webkit
npm run build
npm run verify:reproducible
npm run verify:compatibility
npm run budget
npm run test:schema
npm run contracts
npm run test:build
npm run test:types
npm run test:runtime
npm run test:html
npm run test:e2e
npm run check
npm run verify:package
npm run release:verify
npm test
```

## 按平台构建

正式发布包直接提供平台入口：

```css
@import "@gardenerim/css/platform/web.css";
@import "@gardenerim/css/platform/mobile.css";
@import "@gardenerim/css/platform/desktop.css";
@import "@gardenerim/css/platform/tauri.css";
@import "@gardenerim/css/platform/electron.css";
```

Web 不包含移动端和桌面端专属包；Mobile 加入移动组合；Desktop 加入标题栏、Dock、窗口与桌面工作区。Tauri 和 Electron 各有独立正式 CSS 入口，通过轻量 `@import` 继承 Desktop 产物，避免复制近 1 MB 的相同样式，并分别搭配 `@gardenerim/css/tauri.min.js` 与 `@gardenerim/css/electron.min.js`。

在源码项目中生成可检查的独立平台构建：

```bash
npm run build:platform -- --platform mobile --out dist/custom/mobile-app
```

输出 `mobile-app.css`、`mobile-app.min.css`、Source Map 和 `mobile-app.json` 构建清单。

## 按组件构建

28 个稳定组件包可直接按需引入：

```css
@import "@gardenerim/css/core.min.css";
@import "@gardenerim/css/component/basic.css";
@import "@gardenerim/css/component/forms.css";
@import "@gardenerim/css/component/auth-compositions.css";
```

也可以按清单中的具体组件名构建：

```bash
npm run build
npm run build:custom -- --components button,card,dialog --out dist/custom/account-ui
npm run build:custom -- --packs basic,forms,feedback --utilities --out dist/custom/form-ui
```

具体组件会依据其类选择器与 `data-g-*` 属性的真实源码命中，解析到一个或多个拥有其完整样式的组件包。同包中的依赖和相邻状态会被保留，避免伪元素、复合选择器、响应式规则或状态样式被错误裁剪；输出 JSON 会同时列出 `requestedComponents`、`resolvedPacks` 与 `includedComponents`。`.css` 是组件包的规范导出形式，省略扩展名的入口作为兼容别名保留。

组件包为：

```text
layouts, regions, primitives, grid, basic, forms, form-compositions,
navigation, navigation-compositions, feedback, data, data-compositions,
selection-compositions, content-compositions, auth-compositions,
commerce-compositions, mobile-compositions, extended, page, help, recipes,
desktop, desktop-compositions, solution-compositions, catalog,
ai, ai-extended, ai-compositions
```

## 正式压缩与性能预算

`npm run build` 使用 esbuild 对 CSS 与 ESM 运行时进行语法级压缩，目标为 Chrome 100+、Firefox 100+、Safari 15.4+；主产物保留 MIT 法律声明。主压缩入口与每次自定义构建生成外部 Source Map，平台包和组件包保持可独立解析的稳定发布入口。正式入口包括 `min.css`、`core.min.css`、`themes.min.css`、`utilities.min.css`、`components.min.css`、`ai.min.css` 与 `runtime.min.js`。

`npm run budget` 对全部 42 个正式压缩产物执行 raw、gzip、Brotli 绝对预算，范围包括 7 个主入口、2 个桌面适配器、5 个平台 CSS 和 28 个组件包；同时对完整 CSS/运行时检查压缩比例，并通过 `npm pack --dry-run` 阻断发布包 packed、unpacked 和文件数回归。2.0.0 以封版的 0.9.0 实测结果为紧邻基线，对每个产物和 npm 包执行相对增长预算；五个平台产物都拥有自己的直接历史基线，不需要继承别名。包体使用 4 KiB packed、64 KiB unpacked 的确定性保守上界消除性能报告自包含产生的压缩循环；文件数仍受 10% 相对上限和 92 文件绝对上限共同约束。压缩参数固定为 gzip level 9、Brotli quality 11，并同时记录在配置、构建清单和性能报告中。压缩 CSS 使用不随版本变化的稳定 MIT banner，避免纯版本文本扰动 Brotli 基线；未压缩 CSS 与 Runtime 仍提供精确版本信息。

`gardener.builds.json` 为 42 个正式产物登记 SHA-256 和 SRI；`npm run contracts` 会重新读取产物逐项复算。`npm run verify:reproducible` 连续重建并比较全部正式生成文件，发现任意 CSS、JavaScript、Source Map、元数据或构建清单发生非确定性变化即失败。自定义构建清单同样包含 CSS、压缩 CSS、Source Map 与适配器的完整性摘要。

## 发布与跨版本兼容

`metadata/compatibility.json` 固化 `0.9.0` 的 1,145 项公共契约，包括全部 47 个包入口、CSS 层、主题属性、模块导出、Gardenerim 成员、66 种行为、75 种事件、运行时数据属性、桌面适配器、506 个组件、52 个配方、42 个主题和显示模式。`npm run verify:compatibility` 允许后续 1.x 新增能力，但会阻断任何未经过废弃流程的删除；在 2.0.0 稳定切点还会反向检查现有入口是否漏记。废弃入口至少保留两个次版本，并只能在新的主版本移除，现有兼容别名继续保留到 `2.0.0`。

构建会从 Public API 自动生成 `gardener.d.ts`、`gardener.tauri.d.ts` 和 `gardener.electron.d.ts`，其中行为名与事件名都是完整字面量联合类型。`npm run test:types` 使用 TypeScript 严格模式编译真实消费者夹具，覆盖默认/命名导出、Runtime API、Toast、行为工厂以及两种桌面桥接。

包声明 Node.js `>=18.18`，浏览器目标为 Chrome/Edge/Firefox 100+、Safari/iOS 15.4+，采用 ESM 与条件 `types` 导出。Runtime 自动初始化文件已显式登记为 `sideEffects`，避免被打包器错误摇树移除。`npm run verify:package` 对真实 `npm pack` 文件清单、所有导出目标、类型文件、发布白名单、开发文件泄漏和 Publint 结果执行检查；`prepublishOnly` 会调用完整 `release:verify` 门禁，并启用公开包与 npm Provenance 配置。

Firefox 项目也已纳入配置；在具备 Playwright Firefox 系统运行库的开发机或 CI 中执行 `npx playwright install firefox` 和 `npm run test:browser:firefox`。`npm run test:browser:all` 会一次执行 Chromium、Firefox、WebKit 三引擎。

## 快速使用

```html
<link rel="stylesheet" href="gardener.css">

<html data-g-theme="garden" data-g-mode="system">
  <button class="g-btn g-btn-primary">开始使用</button>

  <script type="module" src="gardener.runtime.js"></script>
</html>
```

颜色主题使用 `data-g-theme`，显示模式使用 `data-g-mode`：

```html
<html data-g-theme="ocean" data-g-mode="dark">
```

密度可以单独设置：

```html
<html data-g-density="compact">
```

各主题轴可任意组合，不需要为每个品牌复制组件 CSS：

```html
<html
  data-g-theme="cobalt"
  data-g-mode="system"
  data-g-neutral="warm"
  data-g-typography="editorial"
  data-g-shape="small"
  data-g-density="comfortable"
  data-g-elevation="bordered"
  data-g-motion="calm"
  data-g-platform="electron"
  data-g-os="windows">
```

## 颜色主题

```text
garden, slate, graphite, zinc, stone, red, rose, ruby, crimson, coral,
orange, amber, gold, yellow, lime, olive, green, forest, emerald, mint,
teal, aqua, cyan, sky, blue, cobalt, navy, ocean, indigo, violet,
purple, lavender, plum, fuchsia, magenta, pink, brown, coffee, sand,
sunset, midnight, monochrome
```

## 工具类

统一使用 `g-` 前缀，响应式前缀位于功能名称之前：

```html
<section class="g-grid g-grid-cols-1 g-gap-4 g-md-grid-cols-2 g-xl-grid-cols-4">
  <article class="g-card g-p-4">...</article>
</section>
```

小数阶梯中的小数点使用下划线：

```html
<div class="g-p-2_5 g-mt-1_5"></div>
```

## 24 / 12 栅格

24 栅格使用 `.g-row` 或 `.g-grid-24`，传统 12 栅格使用 `.g-grid-12`。列、偏移、显式网格线、Gutter、显示状态和排序均提供五档响应式版本。

```html
<div class="g-grid-24 g-gutter-4">
  <aside class="g-col-24 g-md-col-6">...</aside>
  <main class="g-col-24 g-md-col-12">...</main>
  <aside class="g-col-24 g-md-col-6">...</aside>
</div>
```

```html
<div class="g-grid-12 g-gutter-3">
  <div class="g-col-12 g-lg-col-3">...</div>
  <div class="g-col-12 g-lg-col-9">...</div>
</div>
```

完整接口、Container Query、RTL、嵌套与打印规则见 `website/docs.html#grid-system`；机器可读范围见 `gardener.capabilities.json`。

## 传统区域布局

16 种成品骨架覆盖普通网页、Dashboard、移动端与桌面 WebView：上下主区、始主末区、五区域 / Holy Grail、单/双侧栏、Master / Detail、列表 / 详情 / 检查器、Sticky Footer、固定页头、固定侧栏、粘性辅助栏、Dock、可调 Split View、全屏工作区和移动安全区。

```html
<main class="g-region-frame">
  <header class="g-region-top">...</header>
  <nav class="g-region-start">...</nav>
  <section class="g-region-main">...</section>
  <aside class="g-region-end">...</aside>
  <footer class="g-region-bottom">...</footer>
</main>
```

所有区域使用逻辑方向，内置 768px 视口与容器折叠、RTL、打印展平和嵌入式 `is-contained` 模式。完整模式矩阵见 `website/docs.html#region-layouts`，独立示例见 `examples/regions.html`。

## 经典布局原语

第 3 类布局能力包含 22 个稳定模式：Stack、Cluster、Center、Sidebar、Switcher、Cover、Reel、Frame、Media Object、Grid Auto Fit/Fill、Bleed、Repel、Imposter、Overlay、Masonry、Bento、Aspect Ratio、Scroll Area/Snap、Safe Area 和 Sticky Region。

```html
<section class="g-stack">
  <header class="g-repel">
    <h2>Title</h2>
    <div class="g-cluster">...actions...</div>
  </header>
  <div class="g-sidebar-layout">
    <aside>...</aside>
    <main class="g-grid-auto-fit">...</main>
  </div>
</section>
```

原语以内容空间驱动响应，另有 `g-layout-container` 的 640px 容器折叠、RTL、Reduced Motion、Safe Area 与打印展平。完整接口见 `website/docs.html#layout-primitives`，独立示例见 `examples/primitives.html`。

## 页面级公共组件

第 4 类能力提供 23 种可直接复用的页面结构：Page / Section / Subheader，Toolbar、Action / Status / Command / Context / Filter / Bulk Action / Footer / Floating Action Bar，Back to Top、带文字 Divider、Sticky Actions、Page Loading，以及 Empty、Error、403、404、500、Offline、Maintenance 完整页面状态。

```html
<header class="g-page-header">
  <div class="g-page-header-main">
    <p class="g-page-header-eyebrow">Workspace</p>
    <h1 class="g-page-header-title">内容管理</h1>
    <p class="g-page-header-description">统一标题、说明和页面操作。</p>
  </div>
  <div class="g-page-header-actions">...</div>
</header>
```

所有横向部件使用逻辑方向属性；`g-page-component-container` 提供 640px 容器响应，视口响应作为兜底。浮动动作支持安全区，Back to Top 复用声明式运行时，打印时交互栏自动隐藏，页面状态保留可恢复信息。完整矩阵见 `website/docs.html#page-components`，独立示例见 `examples/page-components.html`。

## Tip 与帮助系统

第 5 类能力包含 28 种模式：Tip、Inline Hint、Help Text/Trigger、Tooltip、Rich Tooltip、Help Popover、Definition、Callout、Note、Do/Don't、Key Hint、Shortcut List、Help Card/Panel/Center/Topics、FAQ、Contextual Help、Coach Mark、Guided Tour、Spotlight、Hotspot、Feature Hint、What's New、Help Checklist、Troubleshooting 和 Help Feedback。

```html
<span data-g-tooltip data-g-placement="top-center">
  <button class="g-help-trigger" data-g-tooltip-trigger aria-label="了解发布状态">?</button>
  <span class="g-tooltip" data-g-tooltip-content hidden>发布后访客即可看到更改</span>
</span>
```

Tooltip、Popover 与 Tour 共用无依赖运行时。浮层支持八类逻辑位置、碰撞翻转、视口限制和 RTL；Tour 支持步骤进度、Spotlight 定位、前进/后退/跳过/完成、Escape 与焦点恢复。完整矩阵见 `website/docs.html#help-system`，独立示例见 `examples/help-system.html`。

## 表单传统组合

第 6 类能力包含 37 种结构，覆盖 Form/Section/Field/Fieldset、Row/Grid/Horizontal/Inline/Compact 布局、Input Group/Affix、Search/Password/Clear/Character Count、验证、Checkbox/Radio/Switch/Choice Card，以及姓名、地址、电话、金额、日期/时间范围、单位、Range、文件、可重复项、条件字段、提交动作、自动保存、进度、审核和授权确认。

```html
<div class="g-field">
  <div class="g-field-header">
    <label class="g-label" for="company">企业名称</label>
    <span class="g-field-required">必填</span>
  </div>
  <input class="g-input" id="company" required>
  <div class="g-field-meta">显示在企业资料中</div>
</div>
```

五类声明式运行时提供 Password Toggle、Clear Input、Character Count、Conditional Field 和 Repeatable Field。`g-form-container` 支持 640px 容器折叠，Sticky Actions 适配安全区，所有组合支持 RTL、Reduced Motion 与打印。完整矩阵见 `website/docs.html#form-compositions`，独立示例见 `examples/form-compositions.html`。

## 传统导航组合

第 7 类能力包含 38 种模式：Navbar、Primary/Utility/Sub Navigation、Sidebar、Collapsible Nav、Navigation Rail、Activity Bar、Menubar、Mega Menu、Dropdown、Context Menu、Tree Nav、Breadcrumb、Tabs/Vertical Tabs、Segmented、Pill/Anchor/Scrollspy、三类结果集翻页、Stepper/Wizard/Back/Previous-Next/Skip，以及完整移动端、命令、语言和账户导航。

```html
<header class="g-navbar g-nav-container">
  <a class="g-navbar-brand" href="/">Brand</a>
  <nav class="g-primary-nav" aria-label="主导航">
    <a class="g-primary-nav-link" href="/content" aria-current="page">内容</a>
  </nav>
  <button class="g-navbar-toggle" data-g-nav-toggle="mobile-nav">菜单</button>
</header>
<aside class="g-drawer-nav" id="mobile-nav" hidden>...</aside>
```

新增 Nav Toggle、Roving Nav、Context Menu、Scrollspy 与 Jump Nav 五类行为，并复用 Dropdown、Tabs、Tree 与 Command Palette。全部模式支持逻辑方向、小圆角浅色默认、容器/视口响应、键盘、RTL、Safe Area、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#navigation-compositions`，独立示例见 `examples/navigation-compositions.html`。

## 数据展示与操作组合

第 8 类能力包含 48 种模式，覆盖基础/响应式/可编辑/树形/分组/展开/比较/Pivot 表格，Description、Key Value、Record Detail、普通/媒体/高密度/虚拟列表，Tree、Timeline、Activity、Audit，以及 KPI、Stat、Metric、Sparkline、Progress、Chart、Ranking、Calendar、Kanban、Gantt、Org Chart、Map、Matrix、Heatmap 和完整数据操作层。

```html
<div data-g-table-sort data-g-row-select data-g-row-disclosure>
  <table class="g-table">
    <thead><tr>
      <th><input data-g-select-all type="checkbox" aria-label="全选"></th>
      <th><button data-g-sort-key="name">名称</button></th>
    </tr></thead>
    <tbody>
      <tr id="record-1"><td><input data-g-select-row type="checkbox"></td><td>记录</td></tr>
    </tbody>
  </table>
</div>
```

新增 Table Sort、Row Select、Row Disclosure、Column Toggle、Data Filter 和 Data View 六类行为，并复用 Data Grid 与 Tree。`g-data-container` 支持 640px 容器响应，Stacked Table 使用 `data-g-label` 生成移动数据卡；所有模式支持 RTL、Reduced Motion、Forced Colors 与打印展开。完整矩阵见 `website/docs.html#data-compositions`，独立示例见 `examples/data-compositions.html`。

## 选择与批量操作组件

第 9 类能力包含 32 种模式：Selection Control、Select All、Invert、Range、Batch Toolbar、Selection Scope、Transfer、Dual List、Tree Select、Cascader、Mention/User/Organization/Resource/Media/Icon/Color Picker、Date/Time Range、Saved Filters/Views、Column Chooser、Sort/Group Builder、Entity/Tag/Relation Picker、Bulk Confirmation/Progress、Picker Panel/Summary 和 Selection Summary。

```html
<section class="g-selection-scope" data-g-row-select>
  <label><input type="checkbox" data-g-select-all> 全选</label>
  <button data-g-invert-selection>反选</button>
  <label class="g-selection-item"><input type="checkbox" data-g-select-row value="record-1"> 记录 1</label>
  <div class="g-batch-toolbar" data-g-batch-toolbar hidden>已选择 <strong data-g-selection-count>0</strong> 项</div>
</section>
```

扩展后的 Row Select 负责全选、反选、清除、可见项、Shift 区间和批量栏；新增 Transfer、Picker、Cascader、Saved Choice 与 Builder List 五类行为。`g-selection-container` 支持 640px 容器折叠，移动 Picker 使用安全区底部面板；所有模式支持键盘、RTL、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#selection-compositions`，独立示例见 `examples/selection-compositions.html`。

## 文件和内容系统

第 10 类提供 32 种成品模式：File Drop、File List、Upload Queue、Chunk Upload、Upload Progress、Failed Upload、File Card、Folder Tree、File Browser、File Preview、Media Library/Grid/Details、Image Crop/Annotation、Document/PDF Viewer、Video/Audio Player、Code/Rich Text/Markdown/Block Editor、Revision Compare、Autosave、Content Outline、Editor Toolbar、Find & Replace、Comment Thread、Version History、File Properties 与 Storage Meter。

新增 Upload Manager、File Browser、Editor Shell、Revision Compare 与 Autosave 五类运行时，并复用 Dropzone。`g-content-container` 提供 704px 容器折叠，覆盖桌面工作台、移动后台、RTL、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#content-compositions`，独立示例见 `examples/content-compositions.html`。

## 登录与账号体系

第 11 类提供 32 种账号生命周期组合：居中/分栏认证外壳、登录、注册、找回/重置密码、邮箱/手机验证、MFA、OTP、Passkey、SSO、二维码、Magic Link、邀请、首次设置、锁屏、会话过期、账号/租户选择、身份切换、资料完善、安全中心、设备、登录活动、安全事件、恢复码、受信任设备、连接账号、密码强度、授权同意与认证结果。

```html
<main class="g-auth-centered">
  <form class="g-auth-panel g-sign-in">
    <header class="g-auth-header">...</header>
    <div class="g-password-field" data-g-password-toggle>...</div>
    <div class="g-otp-input" data-g-otp-input>...</div>
  </form>
</main>
```

新增 OTP Input、Password Strength、Auth Timer 三类运行时，并复用 Password Toggle、Saved Choice、Dropdown、Copy 与 Dialog。外壳在 704px 折叠，卡片在 384px 重排，支持 Safe Area、键盘、粘贴、RTL、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#auth-compositions`，全模式示例见 `examples/auth-compositions.html`。

## 商业与支付

第 12 类提供 32 种交易全链路组合：Product Card/List/Detail/Gallery、SKU Selector、Quantity Stepper、Price Display、Cart Item/Cart/Mini Cart/Summary、Checkout/Steps、Address Selector/Card、Shipping Method、Pickup Selector、Coupon、Promotion List、Invoice Information、Payment Method/Sheet/Result、Order Summary/Timeline/Detail、Subscription Plan、Pricing Comparison、Usage Meter、Billing History、Refund Status 与 Tax Summary。

```html
<section class="g-cart" data-g-cart data-g-currency="CNY">
  <article class="g-commerce-cart-item" data-g-cart-item data-g-unit-price="69900">
    <div class="g-quantity-stepper" data-g-quantity-stepper>...</div>
    <strong data-g-line-total></strong>
  </article>
  <strong data-g-cart-total></strong>
</section>
```

新增 Quantity Stepper、SKU Selector、Cart 与 Coupon 四类运行时，并复用 Carousel、Dropdown 和 Saved Choice。金额以最小货币单位整数计算；`g-commerce-container` 在 704px/480px 内在响应，覆盖键盘、Safe Area、RTL、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#commerce-compositions`，全模式示例见 `examples/commerce-compositions.html`。

## 移动端特有组件

第 13 类提供 32 种移动应用模式：Safe Area Shell、Top App Bar、Bottom Navigation、Bottom/Action/Filter Sheet、Pull to Refresh、Infinite Load、Swipe Actions/Tabs、Mobile Category/Search/Picker、Sticky Purchase Bar、Wheel Picker、FAB、Fullscreen Dialog、Keyboard Avoidance/Toolbar、Gesture Hint、Offline Banner、Segmented Control、Feed、Card Carousel、Mobile Form/Auth/Checkout、Media Viewer、Selection Mode、Snackbar、Permission Prompt 与 Empty/Error State。

```html
<main class="g-mobile-safe-shell">
  <header class="g-mobile-app-bar">...</header>
  <div class="g-mobile-safe-content">...</div>
  <nav class="g-mobile-bottom-navigation">...</nav>
</main>
```

新增 Mobile Sheet、Pull Refresh、Infinite Load、Swipe Actions 与 Wheel Picker 五类运行时，并复用 Tabs、Saved Choice、Carousel、Dialog、Toast、Row Select、Clear Input、Password Toggle 和其他通用行为。体系覆盖 `svh/dvh`、四边 Safe Area、44px 触控目标、Coarse Pointer、键盘后备、容器响应、RTL、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#mobile-compositions`，全模式示例见 `examples/mobile-compositions.html`。

## 桌面端特有组件

第 14 类提供 32 种桌面应用模式：Native Titlebar、Window Controls、Menu/Activity Bar、Dock/Inspector/Bottom Panel、Resizable Split Pane、Status Bar、Command Palette、Shortcut Recorder、Context Menu、Unsaved Tabs、Drag Region、Window Loading、Update/Permission、Native File Picker、Tray Menu、Multi-window/Workspace/Window Switcher、Recent Documents、Desktop Toolbar、Background Tasks、Notification/Sync、Update Progress、Crash Recovery、Single Instance、Deep Link 与 About Dialog。

```html
<main class="g-desktop-workspace" data-g-platform="electron">
  <header class="g-native-titlebar g-desktop-drag-region">...</header>
  <nav class="g-desktop-activity-bar" data-g-roving-nav>...</nav>
  <section class="g-desktop-workspace-main">
    <div class="g-desktop-document-tabs" data-g-desktop-tabs>...</div>
  </section>
  <aside class="g-desktop-inspector-panel">...</aside>
  <footer class="g-desktop-status-bar">...</footer>
</main>
```

新增 Shortcut Recorder、Desktop Tabs、Native File Picker 与 Window Switcher 四类运行时，并复用 Split Pane、Command Palette、Context Menu、Roving Nav、Nav Toggle、Dropdown、Dialog 和 Tauri/Electron 窗口适配器。工作区以 56rem/40rem 容器宽度折叠 Inspector/Dock，覆盖 macOS/Windows/Linux、RTL、Reduced Motion、Forced Colors 与打印。宿主仍负责真实权限、文件、Updater、Tray、Deep Link、多窗口和恢复结果；完整矩阵见 `website/docs.html#desktop-compositions`，全模式示例见 `examples/desktop-compositions.html`。

## AI 产品与智能交互组件

第 15 类提供 32 种 AI 原生模式：AI Workspace、Conversation List、Chat Thread、Message、Prompt Composer、Attachment、Prompt Starter/Library、Mention/Slash Menu、Model Selector、Thinking、Streaming Response、Tool Call/Approval、Agent Status/Plan/Board/Handoff、Sources/Citations、Artifact Workspace/Panel/File Tree/Version History、Generation Gallery/Placeholder、Context/Memory、Cost/Rate Limit、Voice、Permission、Privacy、Safety 与 Feedback/Evaluation。

```html
<form class="g-composer" data-g-ai-composer>
  <textarea class="g-composer-input" data-g-composer-input></textarea>
  <button data-g-composer-stop hidden>停止</button>
  <button data-g-composer-send>发送</button>
  <span data-g-composer-status></span>
</form>
```

新增 AI Composer、Prompt Fill、AI Approval 与 AI Feedback 四类运行时，并复用 Dropdown、Accordion、Roving Nav、Tabs 与 Tree。体系覆盖 Streaming/Stop、工具权限、人机交接、来源、Artifact、上下文删除、真实用量、安全复核、容器响应、RTL、Safe Area、Reduced Motion、Forced Colors 与打印。完整矩阵见 `website/docs.html#ai-compositions`，全模式示例见 `examples/ai-compositions.html`。

## 完整页面与行业解决方案

第 16 类提供 32 种整页模式：Product Landing、Corporate Home、Personal Home、Portfolio、Blog Index、Article、Docs Portal、Help Center、Search Results、Contact、Pricing、Dashboard、Admin List、Record Detail、Settings、User Center、Notifications、Onboarding、CRM、Project Workspace、Support Center、Approval Center、Knowledge Base、Learning Portal、Event Portal、Booking Portal、Healthcare、Finance、Public Service、Marketplace、Community 与 Status Center。

```html
<main class="g-dashboard-overview">
  <header class="g-solution-header">...</header>
  <div class="g-dashboard-metrics">...</div>
  <div class="g-dashboard-layout">
    <section class="g-dashboard-panel">...</section>
    <aside class="g-dashboard-panel">...</aside>
  </div>
</main>
```

本类同时把 32 种页面登记为 `solution.*` 机器可读配方，使配方总数达到 52。公共 `g-solution-*` 部件保证个人、企业和行业页面共享稳定语法；整页根类负责容器响应、移动折叠、RTL、Forced Colors 与打印，内部继续组合前 15 类组件。完整矩阵见 `website/docs.html#solution-compositions`，全模式示例见 `examples/solution-compositions.html`。

## JavaScript 组件

组件通过 `data-g-*` 自动初始化，也可以调用 API。

```html
<button class="g-btn" data-g-dialog-open="confirm-dialog">打开</button>

<div id="confirm-dialog" class="g-dialog-backdrop" data-g-dialog hidden>
  <section class="g-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <header class="g-dialog-header">
      <h2 id="confirm-title" class="g-dialog-title">确认操作</h2>
      <button class="g-btn g-btn-ghost g-btn-icon" data-g-close aria-label="关闭">×</button>
    </header>
    <div class="g-dialog-body">确认继续吗？</div>
    <footer class="g-dialog-footer">
      <button class="g-btn" data-g-close>取消</button>
      <button class="g-btn g-btn-primary">确认</button>
    </footer>
  </section>
</div>
```

```js
import Gardenerim from "./gardener.runtime.js";

const dialog = Gardenerim.getInstance("#confirm-dialog");
dialog.open();
```

运行时事件统一以 `gardener:` 开头：

```text
gardener:init
gardener:beforeopen
gardener:open
gardener:beforeclose
gardener:close
gardener:change
gardener:dismiss
```

## 公共 API 契约

`metadata/public-api.json` 是 `0.3.0` 起的规范入口，清点 CSS 层、全部包入口、主题属性、9 个 JavaScript 模块导出及参数/返回值、66 种行为的实例成员、75 种事件及其 `detail` 字段、309 个作者可用运行时属性、27 个运行时维护状态属性、桌面适配器、命名约定和兼容字段。构建产物为 `gardener.public-api.json`。

| 范围 | 规范 |
|---|---|
| CSS 类 | `g-` + kebab-case |
| CSS 自定义属性 | `--g-` + kebab-case |
| 声明式行为 | `data-g-{behavior}`，行为名使用 kebab-case |
| 运行时事件 | `gardener:{event}` |
| 组件元数据 | `behaviors: string[]`；宿主桥接使用 `adapters: string[]` |
| 页面配方 | `category.recipe-name`，交互字段同样使用 `behaviors` / `adapters` |
| 平台字段 | 组件与配方统一使用 `platforms` |

完整 Schema 位于 `metadata/`：

- `components.schema.json`
- `recipes.schema.json`
- `capabilities.schema.json`
- `utilities.schema.json`
- `manifest.schema.json`
- `public-api.schema.json`
- `builds.schema.json`
- `custom-build.schema.json`
- `performance-budgets.schema.json`
- `performance-report.schema.json`
- `compatibility.schema.json`

所有对象 Schema 都关闭未知字段或显式声明动态值类型；`npm run test:schema` 使用 Ajv 的 JSON Schema 2020-12 引擎执行 48 个标准验证用例，独立编译 Components、Recipes、Capabilities、Utilities、Manifest、Public API、Builds、Custom Build、Performance Budgets、Performance Report、Compatibility 十一套 Schema，并验证十份发布/配置文档、未知根字段、十类未知嵌套字段、十类缺失嵌套必填字段、跨 Schema 引用、JavaScript 标识符、SHA-256 格式、基线回归状态以及旧组件 Schema 兼容别名。`npm run contracts` 同时检查结构、版本、统一命名、唯一性、CSS 选择器、组件选择器签名与真实包归属、产物完整性、可复现构建命令、模块种类/参数/签名、行为实例成员、全部运行时数据属性、事件载荷、适配器、兼容基线、类型与发布脚本、构建档案、42 个绝对及相对预算产物、性能状态、包导出、源码/构建产物一致性和跨清单引用，并用十五组故意错误的数据证明 Schema 会拒绝旧字段、错误摘要、错误命名、缺失支持策略和伪造的通过报告。旧的 Manifest 字段 `runtimeBehaviors` 暂时作为 `behaviors` 的只读兼容别名保留，并计划贯穿整个 `0.x` 版本线。

## 运行时测试

`npm run test:runtime` 使用 Node.js 内置测试运行器和 Happy DOM。测试会从 21 个示例页面与补充夹具中为公共清单里的全部 66 种行为找到真实 DOM，逐项双向比对实例成员，并验证初始化、重复初始化幂等性、销毁和重新初始化；生命周期套件另外验证 MutationObserver 对新增节点、行为属性增删、子树移除、作用域销毁、多行为共存和 `gardener:init` 冒泡事件的处理。

## 多浏览器、移动端与无障碍测试

0.5.0 建立四层浏览器发布门禁；2.0.0 的构建、兼容与发布专项保持 10 个顶层用例，并扩展五个平台的真实消费断言：

- `npm run test:html`：24 个 parse5 结构测试，检查 21 个示例和 Home 两个页面的解析错误、重复 ID、ARIA 引用、语言、标题、Viewport 与清单完整性。
- `npm run test:browser`：Chromium 与 WebKit 默认执行 48 个桌面用例，逐页检查 21 个示例和 Home 两个页面的控制台、请求失败、样式加载、横向溢出，并验证 Dialog 键盘和焦点生命周期。
- `npm run test:mobile`：Pixel 7 Chromium 与 iPhone 13 WebKit 执行 52 个用例，检查全部 21 个示例及 Home 两页的回流，并覆盖 44px 触控目标、Bottom Sheet 生命周期、320px 窄屏和横屏。
- `npm run test:a11y`：25 个 Chromium + Axe 用例，对 21 个示例和 Home 两页执行 WCAG 2 A/AA 与 2.1/2.2 AA 规则，阻断全部自动检测到的违规（不按 impact 降级放行），并覆盖键盘焦点、焦点恢复、Reduced Motion、Forced Colors、RTL 与 320px 回流。
- `npm run test:build`：10 个构建专项用例，检查 5 个平台档案、28 个组件包、506 个真实组件归属、平台边界、正式压缩、Source Map、完整性摘要、可复现构建、绝对/相对预算、类型声明、支持策略、兼容基线、自定义构建、失败参数，以及实际打包安装后的全部入口解析。
- `npm run test:types`：使用 TypeScript 严格模式编译真实消费者，验证 Runtime、事件/行为联合类型和桌面适配器声明。
- `npm run verify:package`：核对实际 npm 包白名单、所有导出目标、类型文件、开发文件泄漏与 Publint。

默认 `npm run test:e2e` 执行 125 个真实浏览器用例。Firefox 作为独立门禁使用 `npm run test:browser:firefox`；完整三引擎矩阵使用 `npm run test:browser:all`。浏览器项目和断言不是文档约定而已，`npm run contracts` 会检查其脚本、项目、全量移动页面清单、无障碍零违规策略和依赖不可被误删。

## 发布文件

| 文件 | 内容 |
|---|---|
| `gardener.css` | 完整 CSS |
| `gardener.min.css` | 压缩完整版 |
| `gardener.core.css` | Tokens、主题、Reset、Base |
| `gardener.themes.css` | 颜色主题和模式 |
| `gardener.utilities.css` | 工具类 |
| `gardener.components.css` | 通用组件 |
| `gardener.ai.css` | AI 组件 |
| `gardener.runtime.js` | 交互运行时 |
| `gardener.runtime.min.js` | 精简交互运行时 |
| `gardener.manifest.json` | AI 可读取的能力清单 |
| `gardener.utilities.json` | 工具类、声明与响应条件清单 |
| `gardener.recipes.json` | AI 可直接选择的业务页面配方 |
| `gardener.capabilities.json` | 行业能力实现状态与完整接口矩阵 |
| `gardener.public-api.json` | 公共命名、入口、行为、事件、适配器与兼容契约 |
| `gardener.builds.json` | 平台档案、组件包、组件归属、压缩器、产物尺寸、SHA-256/SRI 与可复现构建契约 |
| `gardener.performance.json` | raw/gzip/Brotli、压缩比例、npm 包绝对预算及相对 0.9.0 基线回归结果 |
| `gardener.compatibility.json` | 0.9.0 公共 API 基线、Stable 废弃策略与 Node/浏览器支持矩阵 |
| `gardener.d.ts` | Runtime API、66 种行为与 75 种事件的 TypeScript 声明 |
| `gardener.tauri.d.ts` / `gardener.electron.d.ts` | 桌面窗口桥接类型声明 |
| `platforms/gardener.*.min.css` | Web、Mobile、Desktop 平台正式构建 |
| `components/*.min.css` | 28 个可组合组件包 |
| `gardener.tauri.js` | Tauri 窗口控制桥接 |
| `gardener.electron.js` | Electron 安全 preload 桥接 |

## 成品配方与桌面端

`metadata/recipes.json` 描述每个高频页面的根类、组成部件、适用平台、行为、适配器与用途。AI 应优先从这里选择配方，再使用组件和工具类做有限调整。桌面工作台内置自绘标题栏、窗口按钮、活动栏、侧栏、编辑标签、检查器、底部面板、状态栏及可调整分栏，支持 Tauri 和 Electron。

示例位于 `examples/`：综合展示、完整栅格、区域布局、经典原语、页面公共组件、Tip/帮助系统、表单、导航、数据、选择/批量、文件/内容、登录与账号、商业与支付、移动分类、桌面 CMS 和运行时实验页。`npm run validate` 会检查示例与配方中所有 `g-*` 类是否真实存在，并检查重复 ID、表单可访问名称等基础无障碍结构；`npm run audit` 还会检查包边界、Token 引用、对比度、版本、运行时清单和发布导出。

## 完整性原则

新增组件必须同时具备：

1. CSS 或运行时实现。
2. `metadata/components.json` 登记。
3. 默认、悬停、焦点、激活、禁用、只读、加载、空、错误、成功状态审查。
4. Light、Dark、System、High Contrast、RTL、Reduced Motion、Forced Colors、Print 审查。
5. Mobile、Tablet、Desktop 审查。
6. 键盘和屏幕阅读器语义说明。

`metadata/components.json` 中的 `compositionAliases` 把常见需求名称映射到已实现组件；`metadata/capabilities.json` 记录不能只靠源码反推的行业能力基线。构建检查会拒绝不完整的 24 / 12 栅格类矩阵，避免出现“源码和文档一致，但整个常见概念不存在”的盲区。

## 目录边界

Gardenerim 的核心框架位于 `packages/css/`，Vue、React、AngularJS 与 Blazor 适配器位于相邻的 `packages/` 子目录；根目录的 `website/` 是官网与完整文档站，不参与 npm 核心包的发布内容。
