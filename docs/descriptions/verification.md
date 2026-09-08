# GDescriptions 验证记录

参考 Arco Design Vue Descriptions 2.58.0，新增 GDescriptions，保留现有 GDescriptionList。CSS、Vue、React、AngularJS、Blazor 已同步。

- 11 项 GDescriptions 专项测试通过；连同现有数据展示和日历回归共 66 项通过。
- CSS 的 48 项 Schema、49 项 HTML 及 11 项构建检查通过，包含压缩、可复现构建和实际打包安装。
- Vue 147、React 95、AngularJS 83 项单元测试通过；类型、契约与体积门禁通过。
- Blazor 构建无警告、无错误；560 个 SSR 组件契约、静态资源和体积检查通过。最终复验见 `blazor-final-verification.json`，它记录了静态资源 Schema 同步后的成功结果。
- Chromium、Firefox、WebKit 均验证真实适配器的四种布局、参数更新、对齐、响应式及状态变化；10 组 Demo 覆盖 1440、768、390px 和明暗主题，Axe 未检出违规。
- 与 Arco 的 32 组样例对照涵盖四布局 × 四尺寸 × 两种边框状态；样例整体高度差小于 1px，标签字体尺寸相同。见 `arco-measurements.json`。
- Blazor 页面实际切换布局、尺寸、边框和窄屏列数通过；Website 内嵌示例交互通过，未发生页面脚本错误。
- CSS 与 Blazor 的压缩运行时、样式及数据展示模块、Descriptions 模块逐字节一致。网站 7 种语言、14 个页面、组件目录和文档覆盖检查通过。

本次没有再次运行整库全部运行时测试；回归范围聚焦新组件、共享数据展示控制器和三套前端适配器。此记录也不表示任意业务内容都与 Arco 像素相同。原生模板不编译框架插槽，使用边界和生命周期规则见 [参数文档](../descriptions.md)。

本次新增模块和 CSS 的固定预算调整见 `budget-change.json`；历史 2.0.0 性能基线保留。

[GardenerDemo 演示](http://127.0.0.1:4180/?component=descriptions#catalog)
