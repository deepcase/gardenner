# GTable 验证记录

日期：2026-09-07。参考 Arco Design Vue Table 文档及本地安装的 `@arco-design/web-vue@2.58.0`。本次交付为 GTable 数据模式和五端接入，保留原有静态表格。

## 已交付

- CSS 共用控制器 `createTable`，声明式 JSON 初始化、类型化实例及生命周期处理。
- Vue / React `table`、`columns`、`data`；AngularJS `gardener-table` / `gardener-on-change`；Blazor `Table` 和四个配置类型。
- 四档尺寸、边框、斑马纹、排序筛选、选择、分页、固定列/表头、分组、树形与异步展开、详情行、单元格合并、汇总、校验编辑、列宽调整、行重排、固定行高虚拟滚动、服务端请求及错误恢复。
- GardenerDemo 11 个可操作场景，CSS 独立示例，Blazor `/table`，WebSite 嵌入示例和七语言页面同步。

## 验证结果

| 检查 | 结果 |
| --- | --- |
| CSS 完整运行时回归 | 887 / 887 通过，其中 GTable 专项 17 项 |
| CSS 构建、可重复构建、打包安装 | 11 / 11 通过 |
| CSS schema / HTML | 48 / 48、45 / 45 通过 |
| Vue / React / AngularJS 单元测试 | 147 / 147、95 / 95、83 / 83 通过 |
| 五端构建、契约、类型与包体预算 | 通过，详见 `checks.json` |
| Chromium / Firefox / WebKit | 各自验证三种 JS 框架接入、11 场景交互、无障碍和视口 |
| 视口与主题 | 1440 / 768 / 390px 无组件容器横向溢出，明暗主题 Axe 检查通过 |
| CSS / Blazor 实际页面 | 选择、排序、参数更新保留状态、分页及 Axe 通过 |
| WebSite | 多语言页面包含新内容，滚动至懒加载 iframe 后可操作；14 个本地化页面生成校验通过 |
| 静态资源一致性 | CSS 源 / dist / Blazor 的 table.js 一致；两端完整 min.css SHA256 一致 |

三浏览器使用同样的数据和列宽，实际测量普通正文行：large 41px、medium 37px、small 33px、mini 约 23.85px；与 Arco 的差异均小于 0.1px，字体大小一致。这里指普通行测量，不宣称任意自定义渲染或任意控件组合都逐像素相同。

## 适用边界

这是参考 Arco 的 Gardener 实现，不是 Arco 完整 API 的替代品。自定义渲染采用文本/DOM Node；Vue VNode、React JSX、Blazor RenderFragment 不是共享渲染回调的返回类型。Blazor 的函数型扩展通过 JS interop 或 C# 事件响应实现。固定行高虚拟滚动不能与树形、详情展开、合并单元格组合。完整参数与未实现的 Arco 扩展见 [GTable 文档](../table.md)。

没有执行 npm / NuGet 发布。本次包体预算调整保留了历史实测基线，只调整相关产物上限，记录见 `budget-change.json`；AngularJS bundle raw 上限由 630000 调整为 632000，实测 630465。演示整体构建仍有原有的 500kB chunk 提示。

复验入口：`scripts/test-table-browsers.mjs`、`scripts/test-table-demo.mjs`、`scripts/test-table-hosts.mjs`、`scripts/table-release-checks.mjs`。对应日志及 JSON 位于本目录。
