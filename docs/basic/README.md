# 基础组件完善与 Arco 比例核对

本轮范围是目录中的 10 个基础入口：Button、ButtonGroup、Card、Badge、Tag、Chip、BadgeTagChip、Avatar、AvatarGroup、DividerWithText。参照版本固定为实际安装的 `@arco-design/web-vue@2.58.0`，不是按截图估算。对照页面在同一字体环境中同时渲染两套真实 Vue 组件，并隔离 Arco 的全局样式。

- 完整演示：`http://127.0.0.1:4180/?component=basic#catalog`
- 49 组比例对照：`http://127.0.0.1:4180/basic.html`
- Blazor 实际组件：`http://127.0.0.1:5192/basic`
- [逐项分析](component-analysis.md)、[五框架参数协议](parameters.md)、[验证记录](verification.md)

CSS 是尺寸与基础交互的唯一实现来源。Vue、React、AngularJS 使用同一 CSS 包和运行时；Blazor 生成步骤复制同源静态资源。没有分别维护五份尺寸表。主题保留 Gardener 配色；Chip 对照圆角 Tag，旧 BadgeTagChip 是兼容入口，不将这两项称作 Arco 独立组件。

核心比例：按钮 mini/small/medium/large 为 24/28/32/36px；Tag、Chip 为 20/24/32px；计数徽标 20px、状态点 6px；头像默认 40px，文字基准为头像尺寸的一半；卡片标题区 small/medium 为 40/46px。按钮、标签和卡片默认圆角 2px。窄屏与触屏保持显式指定的尺寸，较大触控目标由应用选择 large 或自定义尺寸。

参考：[Arco Design Vue 官方源码](https://github.com/arco-design/arco-design-vue/tree/main/packages/web-vue/components)。本轮核对尺寸、间距和已提供的基础行为，不宣称所有 Arco API 名称及配色完全兼容。
