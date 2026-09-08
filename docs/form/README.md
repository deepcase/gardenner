# 表单组件发布复查

本轮覆盖51个组件、550个命名变体，增加9项可组合的间距、宽度与标签参数。修复字数计数重置与输入法、只读指针操作、移出容器后的状态恢复、范围关闭清理、自动增高约束与动态校验摘要。补齐程序改值同步、文本降级日期/时间解析、选择器和上传区语义，修复全部演示的标签及对比度问题。完整结果见 [发布验证](verification.md)与[51项发布清单](release-components.md)。

- [CSS 参数实验室](../../packages/css/examples/form-compositions.html#form-config-lab)
- [新增参数](parameters.md#发布复查布局与标签扩展)

- 全部 51 项与参数面板：http://127.0.0.1:4180/?component=forms#catalog
- 64 组真实 Arco 对照：http://127.0.0.1:4180/form.html
- Blazor 真实参数演示：http://127.0.0.1:5192/form
- [逐项分析](component-analysis.md)、[五端参数协议](parameters.md)、[验证记录](verification.md)

固定实际安装的 @arco-design/web-vue@2.58.0，同一字体、测量宽度，隔离全局 CSS 并保留 SVG 呈现属性。五端共用 CSS 和 JS，Blazor 同步复制静态资源。保留 Gardener 的主题配色和业务组合。原先姓名、日期范围、时间范围缺失的 17 个 CSS 选择器已补齐，全仓公共组件契约检查通过。

参考：[Arco Vue 官方组件源码](https://github.com/arco-design/arco-design-vue/tree/main/packages/web-vue/components)。
