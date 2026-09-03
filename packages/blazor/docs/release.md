# 发布、兼容性与性能预算

1. `npm run generate` 由 CSS 权威元数据重建 506 个组件、72 个行为、79 个运行时事件与静态资源。
2. `npm run build` 使用固定 .NET 10 SDK 构建库、交互式 SSR 示例和契约测试。
3. `npm test` 执行真实静态 SSR、公共 API/Schema、Chromium/Firefox/WebKit、桌面/移动端、键盘、WCAG A/AA、性能预算、可重复构建和 NuGet 隔离消费验证。
4. `npm run test:net11` 在安装 .NET 11 SDK 后，从 `artifacts` 中的 2.1.0 NuGet 包编译并运行独立 `net11.0` 消费者；它不允许回退为项目引用。

稳定包目标为 `net10.0`。这是 .NET 10/11 应用共同可消费的基础资产；`tests/Gardenerim.Blazor.Net11Consumer` 明确目标 `net11.0`，并验证 506 个组件、72 个行为、79 个事件和包版本，防止未来 SDK/API 变化破坏消费。

预算位于 `config/performance-budgets.json`：程序集、全部静态资源、入口文件原始/压缩体积、生成源码、nupkg 大小和文件数都必须低于硬上限。可重复构建比较两次 Release 输出的 SHA-256。NuGet 检查会清空隔离缓存、从生成的包发布真实消费应用，并检查静态 Web Assets endpoint manifest，确认包内只含约定的 lib、43 个静态资源、文档和 metadata，不夹带源码或临时文件。

CI 中 Firefox 是强制门禁；本地脚本仅在宿主机 Firefox 运行时自身无法启动时给出明确跳过警告，Chromium 与 WebKit 仍必须通过。
