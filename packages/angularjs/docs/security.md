# Gardenerim AngularJS 安全基线

## 支持边界

`@gardenerim/angularjs` 是 AngularJS 1.8.2–1.8.3 遗留应用适配层。AngularJS 已结束官方支持；截至 2.0.0，本地完整 `npm audit` 会报告 AngularJS 本体的 XSS、SVG 净化绕过和正则拒绝服务公告，且没有可用的上游修复版本。Gardenerim 将 `angular` 保持为 peer dependency，不会把它打进运行时产物，也不会声称消除这些框架级风险。

## 上线要求

- 不把不可信 HTML 交给 `$sce.trustAsHtml`、`ng-bind-html` 或直接 DOM 注入；富文本必须经过独立、持续维护的净化器。
- 对 URL、图片和 SVG 使用严格来源白名单；不允许用户内容决定模板 URL、资源 URL 或可执行协议。
- 对会进入 AngularJS 解析、复制、URL 校验和正则路径的外部字符串设置长度与结构上限。
- 部署严格 CSP，避免 `unsafe-eval` 和内联脚本；若遗留代码暂时无法做到，应记录例外并设置迁移期限。
- Tauri/Electron 桥仅暴露最小能力，校验每个参数，不把 Node、shell 或任意 IPC 直接暴露给渲染进程。
- 锁定依赖和完整性，持续审计最终应用，而不只审计本适配包；制定迁离 AngularJS 的时间表。

## 审计解释

`npm audit --omit=dev` 用于确认 Gardenerim 自有发布负载没有额外生产依赖漏洞。完整 `npm audit` 仍应运行并保留结果；其中 AngularJS 本体的已知公告属于明确接受、隔离或迁移的遗留风险，不能被忽略或标记成已修复。

如发现 Gardenerim 适配层自身的安全问题，报告中应包含受影响版本、最小复现、运行平台以及是否涉及 Tauri/Electron 桥；公开披露前请先给维护者合理的修复窗口。
