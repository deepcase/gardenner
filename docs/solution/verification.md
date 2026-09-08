# 解决方案发布复查

组件层检查通过：32 个页面、224 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步；保留既有布局，通过参数组合扩展需求。

本次新增 8 个参数：showHeader、showStatus、showDetails、showPagination、showBilling、editorRows、formColumns、detailMaxHeight。字段支持独立 rows，区块支持独立 pageSize。隐藏分页时显示全部匹配记录，隐藏就绪提示仍保留错误和服务结果。

修复表格业务动作未渲染、表单禁用动作仍可点击、复选框重复事件、程序写入草稿绕过长度限制、无效选项提交、禁用必填字段阻塞提交、无效状态更新取消请求、配置变更残留等待状态、移除字段/区块后旧草稿阻塞更新，以及详情键盘焦点问题。搜索、筛选、排序与计费控件现在跟随当前栏目，纯表单不再显示无关工具栏。

托管页面标题 22–30px、区块标题 18px、正文 14px、标准控件 32px。多列表单在窄容器自动单列，详情高度可配置，表格与看板内部滚动；保留原始页面 Hero 的专用比例。

| 验证 | 结果 |
| --- | --- |
| 专项 / 全量运行时 | 32 / 634 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过，类型与 Schema 同时通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与栏目 | 1344 次布局、522 次栏目检查通过 |
| 三浏览器状态与扩展参数 | 384 个状态场景、24 组扩展检查通过 |
| Chromium 无障碍 | 119 次扫描无违规，含各栏目及暗色 RTL |
| CSS / Blazor 演示 | 各 32 页面、224 变体，41 个模拟业务操作、32 个受控状态更新通过 |
| 一致性与构建 | 五端元数据与样式共享、资源哈希、559 个 Blazor SSR 合约、可复现构建及 npm 包入口通过 |
| 网站 | 七种语言、十四个页面、每个翻译语言 3312 条文案检查通过 |
| 性能 | CSS 42 个产物及五端预算通过，未提高限制 |

演示使用本地模拟服务。真实身份、权限、支付、消息、审批、业务校验和持久化由宿主实现，需在实际业务环境验收。

- [完整演示](http://127.0.0.1:4180/?component=solution#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数说明](README.md)
- [机器可读结果](final-verification.json)
- [窄容器表单截图](release-review/form-narrow.png)

复现脚本：scripts/solution-release-build.mjs、solution-release-verify-adapters.mjs、solution-release-checks.mjs、solution-release-browser-matrix.mjs、test-solution-release-extensions.mjs、test-solution-release-static-blazor.mjs、solution-release-report.mjs。原始日志保存在 release-review。
