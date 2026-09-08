# GCollapse 验证记录

参考：Arco Design Vue Collapse（本地对照版本 2.58.0）。

## 范围

- CSS、Vue、React、AngularJS、Blazor 使用相同的 `disclosureOptions` 参数及共享运行时。
- GardenerDemo 提供 10 组示例；CSS 示例、Blazor 页面、Website 和参数文档同步。
- 保留既有手写 DOM 模式；配置模式增加可控展开、手风琴、图标、附加操作、模板、嵌套及内容生命周期。

## 结果

- 发布检查中的类型、契约、Schema、HTML、构建及体积预算全部通过，详见 `checks.json` 和对应日志。
- 共享运行时全量回归 926 项通过；之后补充附加模板初始化与销毁处理，最终展开收起专项 19 项通过。926 项结果对应该补充前的全量运行，不表示最终版本再次执行了全部测试。
- 最终 Chromium、Firefox、WebKit 均通过 Vue、React、AngularJS 实际适配器交互及 Axe 检查；Demo 覆盖 1440、768、390 像素视口及明暗主题。
- 普通动画模式验证高度动画、延迟销毁、重新挂载重置表单及快速反向操作保留内容，详见 `motion.json`。
- Blazor 受控展开、附加操作、手风琴及右侧图标验证通过；Website 内嵌示例交互正常。共享压缩运行时和 CSS 与 Blazor 静态产物逐字节一致，详见 `hosts.json`。
- Arco 对照样例中左右图标两种布局的标题高度均为 41px、内容高度均为 38px；单展开双面板总高均为 123px。测量时隔离 Arco 全局 CSS，详见 `arco-measurements.json`。该结果表示这些样例的尺寸对齐，不表示所有内容下像素完全一致。

## 使用边界

JSON 内容为纯文本；复杂内容使用原生模板或既有框架子内容。原生模板不会编译为 Vue、React 或 Blazor 插槽；模板内部应用样式由调用方提供。完整参数及生命周期约定见 `../collapse.md`。

演示：http://127.0.0.1:4180/?component=collapse#catalog
