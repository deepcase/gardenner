# 企业组件发布复查

组件层检查通过：8 个组件、32 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。此次保留既有组件，通过参数扩展场景，未新增重复组件。

新增 8 个参数：showSearch、showFilter、showBatch、showReset、showStatus、showDetails、editorRows、detailMaxHeight。字段新增 placeholder、autocomplete、minLength、maxLength、rows、step。

修复异常服务回包导致等待残留、状态操作缺少确认、新建记录缺失仍显示成功、成员批量操作可能同时移除全部所有者、仅有 memberIds 的团队可被归档、无效字段值进入状态、受控文本重复提案、显式变体被旧类名覆盖、权限分组不连续、错误/加载提示不准确及销毁后仍接受调用。

统一标题 16px、正文 14px（small 12px）、控件 28/32/36px、内边距 12/16/20px；窄容器自动调整设置、创建表单和检查器布局，详情高度可配置并内部滚动。Blazor 显式绑定变体；演示生成脚本保留相邻分类配置。

| 验证 | 结果 |
| --- | --- |
| 企业专项 / 全量运行时 | 31 / 649 项通过 |
| Vue / React / AngularJS 单元测试 | 140 / 89 / 77 项通过，类型与 Schema 同时通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过 |
| 三浏览器布局与状态 | 192 个布局、96 个状态场景通过 |
| 三浏览器交互与扩展参数 | 33 组既有交互、24 组参数/回归检查通过 |
| Chromium 无障碍 | 40 次 WCAG A/AA 扫描无违规，含暗色 RTL |
| Blazor / 独立 CSS | 各 32 个变体；Blazor 8 组受控交互通过 |
| 五端一致性 | 目录、样式、运行时、资源哈希及 559 个 Blazor SSR 合约通过 |
| 网站 | 七语言、十四页面、每个翻译语言 3313 条文案同步通过 |
| 包与性能 | 可复现构建、npm 安装入口、CSS 42 个产物及五端预算通过，未提高限制 |

演示使用本地模拟服务。真实身份与权限、完整所有者约束、并发版本控制、邀请发送、系统集成和持久化需由宿主服务实现并在业务环境验收。

- [完整演示](http://127.0.0.1:4180/?component=enterprise#catalog)
- [逐组件清单](release-review/inventory.json)
- [参数说明](README.md)
- [机器可读验证](final-verification.json)
- [窄容器角色管理截图](release-review/role-narrow.png)

复现入口：scripts/enterprise-release-build.mjs、enterprise-release-verify-adapters.mjs、enterprise-release-checks.mjs、enterprise-release-browser-matrix.mjs、test-enterprise-release-extensions.mjs、test-enterprise-release-static.mjs，以及 packages/blazor/scripts/test-enterprise-release.mjs。原始日志、截图与历史报告保存在 release-review。
