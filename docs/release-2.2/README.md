# Gardenerim 2.2.0 稳定性验证

本次把当前组件扩展统一收敛为 **2.2.0 本地发布候选版本**。范围包括 CSS、Vue、React、AngularJS、Blazor、WebSite 和 GardenerDemo；组件清单为 575 个组件、96 个行为、105 个事件。没有执行 npm/NuGet 发布、Git 提交、标签或推送。

## 已修复的问题

- 统一包版本、锁文件、框架依赖范围、运行时与 API 元数据、生成器、NuGet、官网多语言页面及演示版本。生成器和 Demo 页头读取包版本，避免后续升级遗漏。
- 为 15 个组件样式模块及有界布局补足 36 个 CSS 变量回退值，修复初始化前尺寸、颜色、媒体和水印样式失效。五端分发的 CSS 重新生成并校验。
- 修复仪表盘从宽屏切换到窄屏时的横向溢出和图表比例问题，覆盖 Chromium、WebKit 的实际缩放回归。
- 扩大轮播指示器和标签关闭按钮的可点击区域，同时保持图形尺寸；修复轮播、折叠示例导航的点击目标尺寸。
- 修复 CMS 桌面示例第四个标题栏子元素错误换行，避免遮挡窗口按钮；三种浏览器在 1440px / 390px 下验证三个按钮均无遮挡。统一官网文档独立示例链接的最小点击高度。
- 修复动态 API 目录在 Firefox / WebKit 窄屏下被长导入代码撑宽的问题：目录使用可收缩的显式网格列，卡片及摘要内容允许换行；同时修复导入代码引号重复转义。回归等待四个框架的目录全部生成后再测量，覆盖首屏检测遗漏的延迟布局。
- 修复 Demo 专用展示页缺少组件锚点、预览就绪标记、挂载检测和高度同步。组合组件内部委托控制器单独记录，避免错误地宣称每个旧控制器独立初始化。
- 浏览器页面清单改为发现全部 56 个 HTML 示例，补进此前遗漏的 16 个页面。支持实际使用的压缩样式路径；媒体解码失败只在已有可见错误反馈时按精确来源识别取消请求，不屏蔽其他浏览器错误。
- 修复 React、AngularJS 浏览器测试中过时的组件数量；修复 .NET 11 NuGet 消费验证中过时的守卫数量，并让失败输出具体原因。
- 增加与已发布 `v2.1.0` 的 API、包入口兼容性检查，纳入根仓库和 CI 门禁。保留历史 0.9 合同和冻结的 2.0 性能测量基线。
- 明确记录扩展后的包体积预算调整，保留固定上限及文件白名单，没有自动重置性能基线。

## 验证范围与证据

最终状态以 [verification.json](verification.json) 为准；单个门禁的退出码、时间和日志名称保存在各包检查报告中。

CSS 浏览器门禁按桌面、Firefox、移动端、无障碍四个阶段记录。首次完整链路中的桌面和移动端阶段全部通过；修复后重跑完整无障碍阶段，并另行验证 CMS 标题栏的六组浏览器/宽度组合。后续 API 目录修复另加六组浏览器/宽度回归和两个官网整页无障碍检查。原始失败日志及修复前报告保留供追溯，没有将失败项改记为通过。

| 范围 | 检查 |
| --- | --- |
| CSS | 构建、可复现构建、自定义构建、体积预算、48 个 schema 测试、11 个构建测试、1,120 个运行时测试、59 个 HTML 测试、类型、合同、样式审计和包校验 |
| CSS 浏览器 | 桌面 Chromium / Firefox / WebKit 各 86 项，移动 Chromium / WebKit 各 62 项，无障碍 61 项，共 443 项 |
| Vue / React / AngularJS | 生成器、schema、类型、单元测试（150 / 98 / 86）、示例构建、tree shaking、可复现构建、预算、打包和浏览器验证 |
| Blazor | .NET 10 构建、575 项 SSR 目录、合同、浏览器、可复现构建、NuGet 包和预算；另以 .NET 11 Preview 7 隔离 NuGet 消费验证 |
| Arco 基础组件 | 三种浏览器验证 12 个基础组件的受控值、键盘、指针缩放、溢出和无障碍；Demo 48 个场景，桌面/窄屏、明暗主题；CSS、Blazor、WebSite 宿主与资源一致性 |
| GardenerDemo | 575 个组件在 1280px / 390px 下共 1,150 项目录检查，检测锚点、预览初始化、占位内容、页面溢出和 JavaScript 错误 |
| 仓库与官网 | 所有分类五端一致性、导出、官网覆盖、关联文档、发布版本和已发布 API 兼容性 |

Demo 明细：[1,150 项目录检查](demo-catalog.json)。截图复核：[桌面基础组件](screenshots/foundations-desktop.png)、[桌面表格](screenshots/demo-table-desktop.png)、[移动标签](screenshots/demo-tag-mobile.png)。

检查报告：[CSS](css-checks.json)、[Vue](vue-checks.json)、[React](react-checks.json)、[AngularJS](angularjs-checks.json)、[Blazor](blazor-checks.json)、[兼容性](compatibility.json)、[预算变更](budget-review.json)、[样式回退](style-fallbacks.json)。本地构建产物及 SHA-256 见 [artifacts.json](artifacts.json)。

## 尚需明确的边界

- **AngularJS 上游风险仍存在。** npm 审计发现 AngularJS 上游包的 10 条既有安全公告，暂无上游修复版本。CSS、Vue、React、Blazor 的 npm 审计为零，NuGet 未报告易受攻击依赖。现有例外已收紧为精确公告白名单，新增公告会阻止检查通过；这不代表消除了 AngularJS 本身的风险。
- [逐组件结构证据审计](component-quality.md) 的平均分为 93/100：0 个大缺口、268 个中等证据缺口、1 个小缺口。该启发式检查主要提示组件自身选择器未直接表达的状态；共享行为或家族选择器可能承担这些状态。保留这些提示，没有通过改分数宣称所有组件已达到主观最优。
- 1,150 项 Demo 检查证明目录和首个预览在两个宽度下可用，不等同于每个业务场景、全部变体都已人工验收。无障碍自动检查也不能替代辅助技术人工测试。
- .NET 11 验证使用预览 SDK；稳定版主验证仍使用 .NET 10。Demo 构建仍有大分块优化提示，构建成功；没有提高警告阈值掩盖提示。

## 复现

```powershell
node scripts/release-scan.mjs css
node scripts/release-scan.mjs vue
node scripts/release-scan.mjs react
node scripts/release-scan.mjs angularjs
# .NET 11 验证可通过 GARDENER_DOTNET11 指定已安装的 SDK 可执行文件
node scripts/release-scan.mjs blazor
npm run check
```

所有门禁通过并保存根仓库验证结果后，可运行 `node scripts/package-release-candidate.mjs` 生成本地四个 npm 包及 NuGet 包/符号包，不上传注册表。Demo 的目录复测入口为相邻 GardenerDemo 项目的 `npm run audit:release`。
