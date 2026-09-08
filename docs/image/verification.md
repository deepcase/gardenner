# GImage 验收记录

日期：2026-09-08。范围：新增 GImage 及其五端接入、演示与文档。原 GResponsiveImage、GGalleryLightbox 保持兼容。

## 已完成

- CSS、Vue、React、AngularJS、Blazor 注册同一个 GImage，统一加载与预览控制器、样式及参数。
- 5 个变体：default、square、circle、cover、contain；支持尺寸、适配、说明、错误与备用图片、原生模板、受控预览、分组浏览、缩放、旋转、翻转、拖动、原尺寸、下载与全屏工具配置。
- GardenerDemo 11 组演示；独立 HTML、Blazor /image、Website 内嵌演示和 7 种语言页面同步。
- 修复通用媒体容器影响自然图片尺寸、图片编辑器同名样式污染、显式 fit 与变体优先级、WebKit 点击焦点差异、Blazor 示例生成参数重复、网站 iframe 高度溢出。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| 图片专项 + 媒体回归 | 49 / 49（图片专项 14 项） |
| CSS schema / HTML / build | 48 / 50 / 11 项通过；类型、契约、预算通过 |
| Vue / React / AngularJS 单元测试 | 147 / 95 / 83 项通过；各端构建、类型、schema、契约及预算通过 |
| Blazor | Release 构建 0 警告 0 错误；561 SSR 渲染及契约通过；预算通过 |
| Chromium / Firefox / WebKit | 三种框架真实挂载、加载/失败/备用图片、预览、变换、拖动、组导航、受控更新和焦点恢复通过 |
| GardenerDemo | 11 组场景、1440 / 768 / 390px、明暗主题、Axe 检查通过 |
| Arco 2.58.0 对照 | 10 组通过：共同 14px / 1.5715 字体上下文中，5 种 fit × 2 种说明位置；图片及说明尺寸误差小于 1px，字号与内边距相同 |
| 五端同步 | 8 个媒体组件、34 个变体的目录与示例一致；Blazor 的 CSS、runtime、media.js、image.js 与 CSS 发布文件逐字节相同 |
| Website | Blazor 页面和网站 iframe 实际交互通过；14 个本地化页面及公共 API 覆盖检查通过 |

内部说明使用更深的渐变以保持对比度。预览是原生 dialog，图片组通过 items 配置，不提供 Arco 的 popupContainer、跨组件预览组注册或框架插槽替代品。详细参数和边界见 [GImage 文档](../image.md)。

体积上限按新增共享模块、样式和组件的实测增量调整，保留原 2.0.0 基准；见 [预算调整](budget-change.json)。GardenerDemo 构建仍提示既有大体积共享包，未把整个组件库的打包优化纳入本轮验收。

## 入口与证据

- [完整演示](http://127.0.0.1:4180/?component=image#catalog)
- [结构化验收](verification.json)
- [Arco 测量](arco-measurements.json)
- [浏览器截图](chromium-playground.png)
- [Blazor / Website 检查](hosts.json)

可重复运行 scripts/image-release-checks.mjs、scripts/test-image-browsers.mjs（AUDIT_ENGINE 指定浏览器）、scripts/test-image-reference.mjs、scripts/test-image-hosts.mjs 与 npm run check:website。浏览器测试需要本地 4180、4187、4188、5192 服务。
