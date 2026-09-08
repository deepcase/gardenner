# GTag 验证记录

本次范围为 GTag 及其 CSS、Vue、React、AngularJS、Blazor 绑定、GardenerDemo、Website 和关联文档。

## 完成的能力

保留静态 CSS 和原始标签内容；托管模式提供 4 档尺寸、13 种预设色、自定义颜色、soft / solid / outline、边框、圆角、选择与关闭、受控状态、同步取消事件、加载 / 禁用、键盘操作、长文本处理和原生模板。演示包含 12 组场景与参数实验室，无需新增与 GTag 职责重复的组件。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| Arco Vue 2.58.0 实测 | 4 档尺寸 × 普通 / 边框 / 关闭，共 12 组；高宽差值均为 0px，字号、字重、行高、内边距、圆角相同 |
| GTag 与基础回归 | 25 项通过，其中 GTag 18 项 |
| CSS 发布检查 | 48 项 Schema、55 项 HTML、11 项构建检查；类型、契约、预算均通过 |
| Vue / React / AngularJS | 构建、类型、Schema、预算通过；分别 149 / 97 / 85 项单元检查通过 |
| 三浏览器 | Chromium、Firefox、WebKit 验证三种 JS 框架的真实挂载、受控更新、键盘、关闭拦截、禁用 / 加载；无页面异常 |
| GardenerDemo | 12 组场景；1440 / 768 / 390px；亮色 / 暗色；动态增删与状态回写；Axe 无自动违规 |
| 预设色矩阵 | Chromium 下 13 色 × 3 变体 × 2 主题，共 78 组对比度检查通过 |
| Blazor | 构建零警告；契约检查通过；真实宿主选中、尺寸更新、关闭、恢复通过 |
| 五端样式一致 | Blazor 分发的全量 CSS、runtime、tag.js、basic.css 与 CSS 产物逐字节一致 |
| Website | iframe 实际操作通过；7 语言、14 页面、3398 条消息；目录及文档覆盖检查通过 |

WebKit 在缩窄后偶尔保留 article 的旧 scrollWidth，但页面与所有实际内容均未溢出。响应式检查同时验证文档宽度、演示区与控件的滚动尺寸、实际边界，避免只用缓存尺寸判断布局。模板文字则使用显式主题色，已修复亮暗切换后的颜色残留。

当前公共清单为 563 个组件、95 个行为、105 个事件，Blazor 分发 73 个静态资源。新增 Tag 行为与 check 事件，未增加重复组件。体积增长及固定预算调整见 [预算记录](budget-review.json)，保留原始 2.0 基线和逐产物上限。

## 可复核材料

- [API 与使用说明](../tag.md)
- [机器可读总报告](verification.json)
- [发布检查结果](checks.json)
- [Arco 几何测量](arco-measurements.json)
- [颜色矩阵](palette.json)
- [Blazor / Website 宿主](hosts.json)
- [Chromium](chromium.json)、[Firefox](firefox.json)、[WebKit](webkit.json)
- [Chromium 截图](chromium-colors.png)、[Firefox 截图](firefox-colors.png)、[WebKit 截图](webkit-colors.png)

运行 `node scripts/tag-release-checks.mjs`、`node scripts/test-tag-reference.mjs`、`node scripts/test-tag-palette.mjs`、`node scripts/test-tag-browsers.mjs` 和 `node scripts/test-tag-hosts.mjs` 可复核。浏览器和宿主检查需要相应本地服务，Firefox 使用项目已安装的浏览器目录。此次未执行包发布。
