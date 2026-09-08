# Website 2.2.0 页面同步

落地页和文档页的页头明确显示 `v2.2.0`。版本标识和资源 URL 从根包版本及 CSS/JS 内容摘要生成，避免浏览器继续复用旧样式。七种语言的 14 个静态页面同步生成。

文档页参考 `GardenerDemo/src/style.css` 的展示方式：浅色画布、Gardenerim 主题令牌、72px 页头、紧凑侧栏、清晰的标题层级、白色示例卡片、统一搜索工具栏、代码面板与 API 卡片。组件预览继续使用组件本身的样式，没有整体缩放演示内容。

手机端使用固定章节跳转入口，并为标题避开固定导航；处理 320px 页头空间、长 API 名称、可滚动代码和表格。目录活动状态同时提供 `aria-current`，所有顶层章节纳入滚动定位。

## 文件

- 专用文档样式：`website/assets/docs-gallery.css`
- 公共导航与目录行为：`website/assets/site.css`、`website/assets/site.js`
- 版本与缓存标识同步：`website/scripts/sync-release.mjs`
- 浏览器回归：`website/scripts/test-gallery.mjs`

## 验证

- `npm run check:website`：版本、资源摘要、多语言页面、链接、575 个组件及关联 API 覆盖。
- `npm run check`：仓库各分类和五端一致性。
- Chromium、Firefox、WebKit；落地页/文档页分别覆盖 1440、1024、768、390、320px；另检查章节跳转、Vue 目录筛选与卡片展开。明细见 [results.json](results.json)。
- 两个页面的完整 WCAG A/AA 自动检查通过，日志：`../website-gallery-a11y.log`。

[文档桌面截图](docs-desktop.png) · [文档手机截图](docs-mobile.png) · [落地页桌面截图](index-desktop.png) · [落地页手机截图](index-mobile.png)

[文档中的实际表单示例](docs-preview.png)

同步命令：

```powershell
node website/scripts/sync-release.mjs
node website/scripts/build-localized-pages.mjs
npm run check:website
node website/scripts/test-gallery.mjs
```

本次只更新官网页面、样式和校验脚本；没有执行外部部署。
