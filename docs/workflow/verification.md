# 工作流发布复查记录

结果：通过。8 个组件、32 种变体；新增 8 个共享参数及 6 个字段选项。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。

| 检查 | 结果 |
| --- | --- |
| 工作流专项 / 全量运行时 | 42 / 605 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过 |
| Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与状态 | 192 个布局、96 个状态场景通过 |
| 三浏览器交互 | 54 组既有交互、33 组新增参数与回归检查通过 |
| Chromium 无障碍 | 40 次 WCAG A/AA 扫描无违规，含暗色与 RTL |
| Blazor | 32 个变体、8 组受控交互、559 个 SSR 合约通过 |
| 独立 CSS / GardenerDemo | 32 个变体 / 8 个组件演示通过 |
| 五端一致性 | 元数据、样式、运行时与 Blazor 静态资源哈希一致 |
| 性能与包 | 42 个产物、五端预算、可复现构建及 npm 安装入口通过；预算未扩限 |
| 网站 | 7 种语言、14 个页面、每个翻译语言 3310 条文案，同步检查通过 |

本次修复：运行重试/取消缺少确认数据仍显示成功；审批回传覆盖已确认决定；空白与字段长度/数值步长校验不足；复选框重复提案；步骤切换焦点丢失；禁用记录 UI 与 API 不一致；跳过和完成记录重叠；移除审批人后残留决定；销毁后仍接受调用；加载/错误状态误报就绪。

设计统一为标题 16px、正文 14px（small 12px）、控件 28/32/36px、内边距 12/16/20px。新增搜索、筛选、进度、日志、保存、缩放开关，编辑器行数和日志高度；保留全部 32 个变体，无需创建功能重复的组件。

演示使用本地模拟服务；真实审批权限、调度、执行和持久化由业务后端接入。本次未发出真实审批或创建调度任务。

- [完整演示](http://127.0.0.1:4180/?component=workflow#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数与字段用法](README.md)
- [机器可读验证结果](final-verification.json)
- [窄容器向导截图](release-review/wizard-narrow.png)

复现入口：scripts/workflow-release-build.mjs、workflow-release-verify-adapters.mjs、workflow-release-checks.mjs、workflow-release-browser-matrix.mjs、test-workflow-release-extensions.mjs、test-workflow-release-static.mjs，以及 packages/blazor/scripts/test-workflow-release.mjs。原始日志与截图保存在 release-review。
