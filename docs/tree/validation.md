# GTree 验收记录

日期：2026-09-08。范围：GTree 数据模式、兼容旧模式、五端共享运行时及演示；不代表全库发布认证。

- 50 项树与导航回归通过：父子与严格勾选、半选、不可勾选分组、独立受控状态、禁用边界、模板、虚拟化、数据校验、取消/重试/超时机制、拖拽防循环、框架延迟初始化与销毁。
- Arco Vue 2.58.0 独立页面对照：4 档尺寸 × 勾选 × 连接线 × 整行，共 32 组；高度、纵向位置、标题缩进/宽度差值小于 1.1 px，字号、行高、内边距相同。详见 arco-measurements.json。
- Chromium / Firefox / WebKit：Vue、React、AngularJS 挂载与状态更新、受控请求、键盘、虚拟 10,000 节点、禁用与 Axe 检查通过。
- GardenerDemo 14 组场景：1440 / 768 / 390 px，明暗两种主题，无容器横向溢出，Axe 无违规；异步加载、原生输入保留、虚拟定位可用。
- 原生鼠标拖拽与 allowDrop 拒绝通过。Blazor 实际服务与 Website iframe 的勾选、半选、尺寸和连接线更新通过；Blazor CSS / runtime / tree.js / data 样式与 CSS 包逐字节一致。
- CSS 契约、schema、类型、58 项 HTML 检查、11 项构建检查通过。Vue 149、React 97、AngularJS 85 项单元测试通过；五包构建、公开 API 与体积预算通过。详见 checks.json。
- 官网 7 种语言、14 页同步通过；目录为 563 个组件、95 个行为，Blazor 75 个静态资源。
- GardenerDemo 全量预生成、vue-tsc 与 Vite 构建通过。Demo 集合包仍有 Vite 的大分块提示，本次未改变演示站的整体拆包策略。

复验命令：node scripts/tree-release-checks.mjs；node scripts/test-tree-reference.mjs；node scripts/test-tree-browsers.mjs（AUDIT_ENGINE 可为 firefox/webkit）；node scripts/test-tree-hosts.mjs；node scripts/check-data.mjs；npm run check:website。

API 差异、虚拟固定行高及模板卸载边界见 [tree.md](../tree.md)。
