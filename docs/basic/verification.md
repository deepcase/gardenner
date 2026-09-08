# 基础组件验证记录

日期：2026-09-06。参照包锁定 `@arco-design/web-vue@2.58.0`，验证实际 Chromium 渲染。对照页面分别隔离双方的全局重置；标题使用相同行高，测量区域使用相同宽度和字体。主题色仍由 Gardener 控制。

| 检查 | 结果 |
| --- | --- |
| 五项目构建 | CSS、Vue、React、AngularJS、Blazor 全部成功；Blazor 0 警告、0 错误 |
| 五项目 check | 全部通过，各 510 个组件目录；共享 75 behaviors / 101 events |
| Vue / React / AngularJS 类型检查 | 全部通过 |
| CSS 运行时及回归 | 150 / 150，包括新增 7 个基础运行时测试 |
| Vue / React / AngularJS 运行时 | 80 / 80，包括原生按钮类型、受控值和禁用验证 |
| Blazor SSR / 契约 | 510 个 SSR 渲染及事件、DI、表单、元数据检查通过 |
| Blazor 真实浏览器 | 按钮 24/28/32/36、卡片标题 40/46、Tag/Chip 20/24/32；计数、零值、选择、禁用、加载、失败回退、头像 max 通过 |
| Arco 真实对照：桌面 1280px | 49 / 49，无超过容差的测量差异 |
| Arco 真实对照：390px 触屏 | 49 / 49，无超过容差的测量差异 |
| Arco 真实对照：390px 触屏 + RTL + 深色 | 49 / 49，无超过容差的测量差异 |
| 主演示逐组件检查 | 10 个基础入口 × 桌面/窄屏，共 20 个视图；有真实内容，无占位框、横向页面溢出或页面脚本错误 |
| 参数面板 | 计数上限/零值、头像上限 0/5、键盘选择、禁用切换、加载保护通过 |
| 长文字头像 | 40px 头像中 8 个拉丁字符自动缩放至 32px 可用宽度以内 |
| 原导航浏览器回归 | 41 / 41 交互通过 |

测量字段包括组件根节点的宽高、字号、字重、行高、内边距、块方向外边距和圆角，以及 Card 的标题区、标题和正文。数值容差 0.25px；Chip 保留胶囊形，旧入口为迁移示例，圆角不作独立 Arco 组件契约。此结果不是所有像素、全部浏览器或所有 Arco API 的兼容性声明。

同源校验：CSS 包与 Blazor 发布资源的 gardener.css SHA256 均为 `4C45835A6ED5FAC370A2A92885E67B2BD6587F5B5567CD801985E234F0D50FDE`；gardener.runtime.min.js 均为 `10E030B22CDB42377D91A7A5D437DAC945B5B89C40503903371532E9A041C8B7`。Vue、React、AngularJS 的 style.css 均导入同一个 @gardenerim/css 包，运行时也引用该包。

可复验命令（浏览器检查需先启动对应服务器）：

```powershell
# D:\develop\Gardener
npm run build
npm run check:packages
npm --prefix packages/css run test:runtime
node --test --test-concurrency=1 packages/vue/tests/runtime.test.mjs packages/react/tests/runtime.test.mjs packages/angularjs/tests/runtime.test.mjs
npm --prefix packages/blazor run test:basic

# D:\develop\GardenerDemo
$env:DEMO_URL='http://127.0.0.1:4180'
$env:AUDIT_PHASE='final'
npm run audit:basic
$env:AUDIT_WIDTH='390'
$env:AUDIT_TOUCH='true'
npm run audit:basic
$env:AUDIT_RTL='true'
$env:AUDIT_DARK='true'
npm run audit:basic
npm run test:basic
npm run test:navigation
```

详细测量和截图保存在 `D:\develop\GardenerDemo\docs\basic\`，本目录保存 JSON 副本。Blazor 结果位于 `packages/blazor/artifacts/basic-browser.json`。

独立全仓 `packages/css/scripts/contracts.mjs` 仍报告既有的三个表单组件缺项：name-group 3 个部件、date-range-group 2 个部件、time-range-group 12 个部件，共 17 个 CSS selector 未实现。本轮未将其计入基础组件通过结果，也未宣称全仓 npm test 全绿。Demo 构建保留现有大体积 chunk 提示，无构建错误。
