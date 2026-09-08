# 反馈组件完善与 Arco 比例核对

本轮逐项检查反馈分类全部 9 个入口。参照固定为实际安装的 @arco-design/web-vue@2.58.0，隔离全局样式后在同一字体、宽度环境同时渲染两套组件。

- 完整演示：http://127.0.0.1:4180/?component=feedback#catalog
- 55 组真实组件对照：http://127.0.0.1:4180/feedback.html
- Blazor 实际组件：http://127.0.0.1:5192/feedback
- [逐项问题与修复](component-analysis.md)、[五框架参数](parameters.md)、[验证记录](verification.md)

CSS 是五端尺寸和反馈运行时的共同来源。Vue、React、AngularJS 引用同一包；Blazor 同步生成静态资源，并修复动态绑定时的公共渲染异常。保留 Gardener 主题配色，尺寸以 Arco 默认和对应变体为基准。

55 组核对覆盖 Alert 17、Progress 8、Spin/Skeleton 9、Empty 2、Message 6、ContextBar 2、PageLoading 3、Result 7、StatusBar 的按钮 1。ContextBar 对照 Alert，PageLoading 的指示器/说明对照 Spin，StatusBar 仅其按钮对照 Button；Arco 没有直接对应的状态栏组件。仪表盘、跳点、页面组合等扩展不宣称与 Arco 完整 API 相同。

参考：[Arco Vue 官方源码](https://github.com/arco-design/arco-design-vue/tree/main/packages/web-vue/components)、[Progress 文档](https://arco.design/vue/component/progress)。
