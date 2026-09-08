# 移动端组件发布复查

组件层检查通过：33 个组件、99 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 与文档已同步。保留现有覆盖面，通过参数扩展，没有新增重复组件。

新增 11 个参数：showHeader、showStatus、showClear、showControls、showSelectionCount、editorRows、scrollMaxHeight、imageFit、sheetHeight、sheetMaxWidth、targetSize。字段新增 7 个选项：disabled、readonly、minLength、min、max、step、rows。

修复受控文本重复提交、中文输入合成中重绘、Enter 请求旧值、缺少长度/数字步长/下拉选项校验、只读字段仍参与编辑、异常回包等待残留、外部状态切换后接收旧结果、业务配置切换保留等待、认证代理忙状态丢失、达到选择上限后不能取消全选、显式变体被旧类覆盖、错误状态仍可发起业务请求、销毁后仍修改节点、轻提示悬停时重新计时等问题。图片 URL 拒绝嵌入账号密码，销毁恢复作者原始样式。

统一原生标题 16px、正文 12/14/14px、内边距 12/16/20px；默认触摸区域 44px，大尺寸 48px，targetSize 可覆盖。输入保持 16px。修复安全区覆盖紧凑留白、旧 grid-area 干扰和徽标拉成整行；面板高度/宽度、图片适配、列表滚动高度、编辑行数及可见内容均可配置。认证/结算继续复用对应完整控制器和服务协议。

| 验证 | 结果 |
| --- | --- |
| 移动端专项 / 全量运行时 | 33 / 694 项通过 |
| Vue / React / AngularJS | 140 / 89 / 77 项单元测试通过，类型与 Schema 通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过，含可复现构建与安装入口 |
| 三浏览器布局 | 594 个常规布局、297 个 320px 窄容器变体通过 |
| 三浏览器状态 | 396 个空/加载/失败/只读场景通过 |
| 新参数与交互回归 | 33 组扩展检查通过；原有选择、筛选、加载、轮播、认证与结算交互通过 |
| 无障碍 | Chromium 66 次 WCAG A/AA 扫描无违规，含暗色 RTL |
| 触摸与原生行为 | 横向切换、保留纵向滚动、滑动操作、下拉刷新、拖动面板关闭、滚轮定位、分段高度与权限请求通过 |
| 独立 CSS / Blazor | 各 99 个变体；Blazor 4 组受控交互通过 |
| 五端一致性 | 目录、Schema、样式、运行时和资源哈希一致，559 个 Blazor SSR 合约通过 |
| Website | 七语言、十四页面、每个翻译语言 3316 条文案通过 |
| 性能 | 42 个 CSS 产物及整体包体、适配器、Blazor 预算通过 |

源码专项上限从 45,000 调整至固定 52,000 字节，当前 mobile.js 为 50,593 字节，用于新增参数、字段校验与交互恢复；单独记录于 [源码预算说明](release-review/budget-review.json)。CSS、整体包体、适配器及 Blazor 性能限制均未提高。

演示仅提供本地服务确认，不连接真实认证、交易或系统权限。浏览器触摸验证不等于实体手机验收；目标项目仍需验证其输入法、工具栏、VisualViewport、安全区和业务后端。

- [完整演示](http://127.0.0.1:4180/?component=mobile#catalog)
- [逐组件检查清单](release-review/inventory.json)
- [参数与服务协议](README.md)
- [机器可读验证](final-verification.json)
- [窄屏表单截图](release-review/form-narrow.png)
- [底部面板截图](release-review/final-sheet.png)

复现：scripts/build-mobile-examples.mjs、mobile-release-build.mjs、mobile-release-verify-adapters.mjs、mobile-release-checks.mjs、mobile-release-browser-matrix.mjs、mobile-release-extension-matrix.mjs、test-mobile-release-final.mjs、test-mobile-release-static.mjs、test-mobile-release-smoke.mjs、mobile-release-report.mjs，以及 packages/blazor/scripts/test-mobile-release.mjs。历史报告与日志保存在 release-review。
