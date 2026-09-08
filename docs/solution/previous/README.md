# 解决方案组件发布检查

范围：解决方案分类的全部 32 个页面组合；同时核对 512 项全库目录在 CSS、Vue、React、AngularJS、Blazor 的一致性。

这些组件提供页面结构、视觉布局和可组合的交互部件。订单、账号、支付、医疗等业务接口由应用提供；示例中的数据与操作是本地演示。

## 修复与设计规则

- 32 项公开 compact、comfortable、boxed、wide、fluid、flat、outlined 七种可组合变体，共 224 项变体映射。
- 修复容器查询组件在 Grid 中因自动外边距缩成零宽的问题，根节点明确占满可用宽度，并接受最大宽度限制。
- 默认正文 14px / 22px，首屏标题 28–48px；卡片默认 20px 内边距、16px 间隔。紧凑模式 12px，舒适模式 24px 内边距 / 20px 间隔。
- 避免所有页面强制占满一个视口，保留可配置的页面、工作区、首屏和媒体最小高度。
- 在窄屏中将侧栏和辅助信息顺序排列，保留导航与信息入口；卡片降为单列，表格与看板在自身区域滚动。
- 使用语义颜色、逻辑方向和原有主题体系；保留打印、强制颜色和减少动态效果规则。

## 五端共同参数

CSS 使用 `data-g-solution-*`；Vue / React 使用 `config`；AngularJS 使用 `gardener-config`；Blazor 使用 `Config`。对象键如下。未提供参数时使用变体及默认值；显式参数优先于变体。仅影响包含相关部件的组件。

| 对象键 | CSS 属性后缀 | 值 | 用途 |
| --- | --- | --- | --- |
| solutionDensity | density | compact / comfortable | 卡片内边距、网格间隔、区块留白 |
| solutionWidth | width | boxed / wide / fluid | 最大宽度 960px / 1280px / 100% |
| solutionSurface | surface | flat / outlined | 平面或描边卡片 |
| solutionColumns | columns | auto / 1 / 2 / 3 / 4 | 卡片网格；窄容器自动单列 |
| solutionSidebar | sidebar | compact / standard / wide | 176px / 224px / 288px 侧栏 |
| solutionHero | hero | balanced / centered / reversed | 产品、企业、个人、作品页面首屏 |
| solutionSticky | sticky | on / off | 目录、预约摘要、设置导航的吸附 |

精确尺寸通过根节点 `style` / `Style` 配置 CSS 自定义属性，允许 `px`、`rem`、`clamp()` 等合法 CSS 长度。

| 属性 | 用途 |
| --- | --- |
| --g-solution-width | 页面最大宽度 |
| --g-solution-gutter | 页面容器水平留白，默认 16px |
| --g-solution-padding | 卡片内边距 |
| --g-solution-gap | 网格和首屏间隔 |
| --g-solution-section-space | 主要公共页面区块纵向留白 |
| --g-solution-sidebar-width / --g-solution-aside-width | 主侧栏 / 辅助栏宽度 |
| --g-solution-card-min-width | 自动网格的最小卡片宽度 |
| --g-solution-columns | 自定义网格列定义 |
| --g-solution-min-height / --g-solution-workspace-height | 页面 / 工作区最小高度 |
| --g-solution-hero-height / --g-solution-media-height | 首屏 / 媒体最小高度 |
| --g-solution-hero-font-size | 首屏标题字号 |
| --g-solution-card-border / --g-solution-card-shadow | 卡片边线与阴影 |

## 五端示例

保留相同子结构，按需组合多个变体；所有框架都使用 CSS 包的同一份样式。

```html
<article class="g-project-workspace g-project-workspace-compact"
 data-g-solution-sidebar="wide" style="--g-solution-aside-width:260px">
 <div class="g-project-layout">
  <nav class="g-project-nav" aria-label="项目">...</nav>
  <main class="g-project-main">...</main>
  <aside class="g-project-inspector">...</aside>
 </div>
</article>
```

```vue
<GSolutionProjectWorkspace variant="compact"
 :config="{solutionSidebar:'wide'}" style="--g-solution-aside-width:260px">
 <!-- 相同子结构 -->
</GSolutionProjectWorkspace>
```

```tsx
<GSolutionProjectWorkspace variant="compact" config={{solutionSidebar:'wide'}}>
 {/* 相同子结构 */}
</GSolutionProjectWorkspace>
```

```html
<g-solution-project-workspace gardener-variant="compact"
 gardener-config="{solutionSidebar:'wide'}">
 <!-- 相同子结构 -->
</g-solution-project-workspace>
```

```razor
<GSolutionProjectWorkspace Variant="compact" Config="Options">
 @* 相同子结构 *@
</GSolutionProjectWorkspace>
@code {
 private IReadOnlyDictionary<string,object?> Options =
   new Dictionary<string,object?> { ["solutionSidebar"] = "wide" };
}
```

逐项清单见 [inventory.json](inventory.json)。GardenerDemo 的“解决方案”分类提供全部 32 项真实内容、变体、参数、手机／平板宽度、主题同步与独立预览。浏览器矩阵和五端一致性检查记录在本目录。

## 体积预算

历史体积报告未随此前导航、基础、反馈、表单、浮层扩展更新。本次重新测量并保存 `budget-review.json`，保留已发布的 2.0.0 基线，为增加的实现设置固定、约 3% 余量的上限，并同步 Blazor 的同源 CSS / runtime 上限。构建不会自动提高预算。推荐生产项目按组件包导入，避免加载完整工具类集合。

## 验证记录

逐项结果见 [review.json](review.json)，五端目录及样式一致性见 [parity.json](parity.json)，完整验证汇总见 [verification.json](verification.json)。

- 32 项解决方案 × 3 个视口（1280 / 390 / 768px）× Chromium / WebKit：192 项通过，包含变体、参数、溢出、ARIA 引用与本地导航操作。
- 全部 32 项解决方案的 Axe WCAG A/AA 检查：零违规。
- GardenerDemo 目录：32 项全部可见，参数修改实际传入 iframe，手机预览宽度切换生效。
- 共享运行时 180 项、HTML 25 项、Schema 48 项、构建 11 项检查通过。
- CSS / Vue / React / AngularJS / Blazor 构建成功；Blazor 512 项 SSR 契约通过。

以上是可重复执行的本地检查；业务后端接入和应用自身的权限、交易规则仍由使用方验证。
