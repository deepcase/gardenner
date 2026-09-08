# Website / GardenerDemo 展示融合 · 2.2.0

文档增加“组件展示与演示”章节，直接复用 GardenerDemo 的实际组件展示。原有 Demo 目录与嵌入页通过 showcaseRegistry.ts / ComponentExample.vue 共用渲染分派，专属示例、通用参数面板和变体均保留。

- 575 个组件可搜索、按类别筛选和切换；支持自适应、768px、390px 预览、重置、独立打开和演示源文件。
- CSS、Vue、React、AngularJS、Blazor 的全部 API 卡片均有对应入口。实际演示明确标记为 Vue，各框架 API 信息独立保留。
- 官网携带 252 个静态演示资产（约 11.4 MiB），包括嵌套预览和媒体资源，运行时无需 GardenerDemo 开发服务器。iframe 按需创建、按内容高度调整，样式不污染文档正文。
- 14 个本地化页面同步；演示内容保留 GardenerDemo 原有中文说明。

## 验证

- Demo 构建：vue-tsc 和 Vite 通过（../demo-embed-build.log）。
- 全部组件：575 × 2（1280 / 390px），1,150 项通过；检查实际内容、占位符、初始化、资源加载和页面溢出。
- 独立目录：覆盖每个专属展示分派、12 个基础扩展及各类别代表，共 97 × 2 = 194 项通过。
- Chromium / Firefox / WebKit：参数、源码、重置、空搜索恢复、分类、图片资源、五类 API 跳转、四档宽度通过。
- 首页与文档：现有完整页面 Axe A/AA 检查 2 项通过。
- 动态演示高度变化后的章节定位、移动端章节跳转通过。
- npm run check:website：版本、内容哈希、252 个演示资产、14 个语言页面和五类 API 覆盖检查通过。

图片组件的“加载失败与备用图片”有意请求 missing-image.svg。审计仅允许该组件的这一个精确 404，并额外验证备用图片已解码显示；其他资源错误仍判失败。catalog.json 保留了该项的复检记录。

## 后续维护

在 Gardener 根目录运行 npm run build:website-demos，构建相邻 GardenerDemo 并更新 website/showcase。可使用 GARDENER_DEMO_DIR 指定源码路径。npm run check:website 验证静态资产完整性；npm run test:website-demos 运行全量展示与浏览器集成检查。WEBSITE_URL 默认为 http://127.0.0.1:4188/website。

本次未发布、推送或创建版本标签。

## 组件、变体、API 与分类复查

复查修正了嵌入入口未继承 Demo 中文字体、默认圆角不同，以及官网分类原先按英文标识排序的问题。App、嵌入页和官网文档现在共享 presentation.json 默认主题配置；Demo 与官网共享 categories.json 的 25 类名称、顺序和别名。组件归属通过五类包目录逐项比较，分类侧栏显示对应数量；保留 form / GForm 组件直达和 forms 分类链接。

最终验证见 style-category-review.json：

- 575 个组件在 1280 / 390px 下共 1,150 项实际样式、初始化、资源和溢出检查通过，包括已加载的嵌套预览。
- 254 个演示资产与 Demo 构建产物/共享配置逐文件哈希相同；组件、变体和演示内 API 使用同一展示源文件。
- 五类目录的 3,034 个变体、状态、分类、平台定义完全一致；官网 2,875 张 API 卡片的声明及字体、字号、颜色、行高一致。
- 25 类中文名称、顺序、数量、归属在六个筛选器及分类侧栏一致，分类深链接、刷新恢复和窄屏通过。
- Chromium、Firefox、WebKit 参数、变体相关控件、源码、重置、搜索和五类 API 跳转通过；官网版本、资产及 14 个本地化页面检查通过。

上述是官网与 Demo 的源文件、目录及展示一致性验证，不将其等同于已经穷举所有业务参数组合的视觉测试。
