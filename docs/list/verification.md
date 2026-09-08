# GList 验收记录

日期：2026-09-08。新增 GList，原 GListGroup、GMediaList、GVirtualList 保持兼容。本轮范围为列表能力、五端接入、相关演示和文档。

## 功能

- 三档尺寸、边框/分割线/悬停、标题及页脚、图文和头像、水平/纵向操作、额外内容、原生模板。
- 本地与服务端分页配置、受控页码与每页数量、页码输入 Enter 确认、分页守卫、数据缩减后的越界修正。
- 响应式栅格、固定高度滚动、固定行高虚拟列表、底部到达事件、加载更多请求及加载/空数据/错误状态。
- 保留稳定条目的输入节点与焦点，拒绝无效配置；框架参数延迟写入时正确采用初始分页值。
- GardenerDemo 12 组演示，CSS 独立示例、Blazor /list、Website 内嵌演示及相关文档同步。

## 验证

| 检查 | 结果 |
| --- | --- |
| 列表专项 + 数据展示 + Descriptions 回归 | 61 / 61，其中列表专项 17 项 |
| CSS schema / HTML / build | 48 / 51 / 11 项通过；类型、契约及体积预算通过 |
| Vue / React / AngularJS 单元测试 | 147 / 95 / 83 项通过；构建、schema、类型、契约和预算通过 |
| Blazor | Release 构建通过；562 SSR 渲染、94 行为与 104 事件契约通过；预算通过 |
| Chromium / Firefox / WebKit | 三框架真实挂载、分页、Enter 跳页、受控更新、响应式栅格、10000 条虚拟列表及 Axe 检查通过 |
| GardenerDemo | 12 组演示，1440 / 768 / 390px，明暗主题，模板输入保留、加载更多及受控分页通过 |
| Arco 2.58.0 比例对照 | 12 组：3 尺寸 × 2 边框 × 2 分割线；整体、标题、条目、页脚高度误差均小于 1px，字号与内边距相同 |
| 五端同步 | 数据分类 54 个组件、265 个变体；CSS/运行时与 Blazor 静态资源逐字节一致 |
| Website / Blazor 演示 | 页面参数、分页及条目操作实际通过；网站 14 个页面、7 种语言及公共 API 覆盖检查通过 |

虚拟列表为固定行高，栅格与虚拟滚动不可同时启用；远程分页和加载更多由业务提供数据。原生 template 不等同于框架插槽，翻页或离开虚拟窗口会卸载条目。详见 [参数与边界](../list.md)。

新增运行时模块为 20565 字节；体积预算按新增组件实测增量调整，保留 2.0.0 原始基准，见 [预算调整](budget-change.json)。Demo 仍有既有共享包超过 500kB 的构建提示，本轮未进行全站分包改造。

## 证据与复跑

- [完整演示](http://127.0.0.1:4180/?component=list#catalog)
- [结构化验收](verification.json)
- [Arco 尺寸测量](arco-measurements.json)
- [浏览器截图](chromium-playground.png)
- [宿主页检查](hosts.json)

运行 scripts/list-release-checks.mjs、scripts/test-list-browsers.mjs（AUDIT_ENGINE 指定浏览器）、scripts/test-list-reference.mjs、scripts/test-list-hosts.mjs、scripts/check-data.mjs 与 npm run check:website。浏览器检查使用本地 4180、4187、4188、5192 服务。
