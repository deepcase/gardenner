# Changelog

## 1.0.0 - 2026-08-28

- 发布首个 Stable 公共契约：Web、Mobile、Desktop、Tauri、Electron 五个平台、28 个组件包、506 个组件与 42 个主题全部保持正式公共入口。
- 42 个正式 CSS/JavaScript 压缩产物继续使用 esbuild、外部 Source Map、SHA-256/SRI 与连续构建字节级可复现门禁。
- 压缩 CSS 改用不随版本变化的 MIT banner，未压缩入口与 Runtime 继续暴露精确版本，避免纯版本文本扰动组件 Brotli 基线。
- 性能回归基线滚动到封版的 `0.9.0` 实测结果，42 个产物全部使用直接 raw/gzip/Brotli 基线，并继续约束 npm 包 packed、unpacked 与文件数。
- 性能门禁新增基线反向校验，阻止未使用的陈旧产物或 1.0.0 别名映射悄然留在配置中。
- 兼容基线滚动到 `0.9.0` 的 1,145 项公共契约，完整纳入 47 个包入口并增加 Stable 切点双向闭合门禁；1.x 删除必须先废弃并提供迁移说明，现有兼容别名保留到 `2.0.0`。
- Runtime、类型声明、公共 API、Compatibility、README、Home、完整文档、测试断言与全部生成产物同步推进到 `1.0.0`。

## 0.9.0 - 2026-08-27

- 将 Web、Mobile、Desktop、Tauri、Electron 五个平台、28 个组件包与 42 个正式压缩产物整体推进到 `0.9.0`，继续覆盖 506 个组件的真实包归属。
- 性能回归基线从 `0.7.0` 滚动到已封版的 `0.8.0` 实测结果；42 个产物均拥有直接 raw/gzip/Brotli 历史基线，Tauri/Electron 不再需要基线别名。
- 保持 esbuild 正式压缩、Source Map、SHA-256/SRI、70 文件可复现构建、绝对预算、紧邻版本相对预算和 npm 包确定性保守上界门禁。
- 五个平台的自定义构建和真实 npm tgz 消费继续由 esbuild 打包测试覆盖；公共 API 兼容基线仍固定到 `0.7.0`，持续保护 1,140 项公共契约。
- 版本、Runtime、类型声明、公共 API、Compatibility、README、Home、完整文档、测试断言与全部生成产物同步推进到 `0.9.0`。
- 修正 Home README 将 74 项 Runtime/DOM 生命周期测试误写为 66 项的问题，并把 README 的版本、构建、组件、测试与配方数字纳入自动文档覆盖门禁。

## 0.8.0 - 2026-08-27

- 将 Tauri、Electron 从 Desktop CSS 导出别名提升为独立、可审计的轻量平台入口；五个平台均有正式 CSS 产物，同时通过继承 Desktop 避免重复打包，正式预算与完整性覆盖由 40 项增至 42 项。
- 性能基线支持显式产物别名：0.8.0 新增的 Tauri/Electron CSS 入口分别映射到其在 0.7.0 实际使用的 Desktop 基线，性能报告记录具体基线产物；npm 文件数绝对预算同步调整为 92，仍满足相对 10% 上限。
- 发布包消费测试会安装真实 tgz，并使用 esbuild 分别打包 Web、Mobile、Desktop、Tauri、Electron 与独立账号组件入口，验证嵌套导入展开及平台边界；修正文档中遗漏的正式平台入口 `.css` 扩展名。
- 新增从 `0.7.0` 固化的跨版本兼容基线，覆盖包入口、CSS 层、主题属性、模块导出、Gardener 成员、66 种行为、75 种事件、运行时属性、适配器、506 个组件、52 个配方与 42 个主题；`verify:compatibility` 阻断未声明删除，并要求至少两个次版本的废弃期。
- 构建根据 Public API 自动生成 Runtime、Tauri 和 Electron TypeScript 声明；行为名与事件名使用完整字面量联合类型，`test:types` 在严格模式下编译真实消费者夹具。
- npm 包补齐 `style`、`types`、条件导出、Node/浏览器支持矩阵、公开发布和 Provenance 配置；新增 canonical Runtime、Compatibility、Compatibility Schema 与 `package.json` 导出。
- 修复 Runtime 自动初始化未列入 `sideEffects` 的发布风险，防止打包器在仅依赖自动初始化时错误移除运行时。
- 新增真实发布包门禁，检查 npm 文件白名单、全部导出目标、类型文件、开发目录泄漏与 Publint；`prepublishOnly` 绑定完整 `release:verify`。
- 性能预算改用 `0.7.0` 实测基线，并为性能报告自包含导致的 tgz 压缩循环采用 4 KiB packed / 64 KiB unpacked 的可验证、确定性保守上界，避免非确定性误报同时不低估包体积。
- Compatibility Schema 纳入 Ajv 与契约门禁；标准 Schema 用例增至 48 项、负向契约增至 15 组、构建专项用例增至 10 项。
- 版本、运行时、公共 API、README、Home 落地页、完整文档和全部生成产物同步推进到 `0.8.0`。

## 0.7.0 - 2026-08-27

- 在 0.6.0 的平台/组件构建基础上，为全部 40 个正式压缩产物新增 SHA-256 与 SRI 完整性记录；构建契约会逐文件复算并拒绝过期或被篡改的摘要。
- 新增 `npm run verify:reproducible`，连续重建并比较全部正式生成文件，确保 CSS、JavaScript、Source Map、元数据和构建清单字节级可复现；默认 `npm test` 将其作为发布门禁。
- 自定义平台/组件构建清单新增输出文件完整性映射，CSS、压缩 CSS、Source Map 与桌面适配器均可在交付后独立校验。
- 性能预算新增以 0.6.0 实测数据为基线的相对回归门禁；40 个产物分别限制 raw/gzip/Brotli 增长，npm 包分别限制 packed/unpacked/文件数增长，并继续保留绝对上限。
- Builds、Custom Build、Performance Budgets、Performance Report Schema 与负向契约同步收紧；标准 Schema 用例增至 44 项、负向契约增至 14 组、构建专项用例增至 9 项。
- 版本、运行时、公共 API、README、Home 落地页、完整文档和全部生成产物同步推进到 `0.7.0`。

## 0.6.0 - 2026-08-27

- 新增 5 个平台构建档案：Web、Mobile、Desktop、Tauri、Electron；生成 Web/Mobile/Desktop 三套去除无关平台组件的正式 CSS，Tauri/Electron 复用 Desktop CSS 并绑定各自安全适配器。
- 新增 28 个组件包产物和全部 506 个组件到一个或多个真实所属包的机器可读映射；归属由类选择器与 `data-g-*` 属性精确反查源码，平台组件清单由实际输出包反推。`build:custom` 支持按具体组件名或组件包生成 Core 完整、依赖保守的自定义 CSS、压缩 CSS、Source Map 与闭合构建清单。
- 使用 esbuild 语法级压缩替换正则空白压缩，为完整 CSS、分层 CSS、运行时和桌面适配器生成正式压缩产物；保留 MIT 法律声明，并为主产物与自定义构建生成 Source Map。
- 新增 raw、gzip、Brotli、压缩比例和 npm 包 packed/unpacked/file-count 五类性能预算；预算扩展到全部 40 个正式压缩产物，固定 gzip level 9 与 Brotli quality 11，任一产物或整体发布包超限都会阻断 `npm test`。
- 新增 Builds、Custom Build、Performance Budgets、Performance Report 四套闭合 JSON Schema，标准 Schema 门禁由 29 项扩展到 42 项。
- 新增 8 项构建专项测试，覆盖平台边界、真实选择器归属、自定义构建、非法参数拒绝、压缩产物/Source Map、运行时导入、全部性能预算，以及 npm 包实际安装后的公共入口解析。
- 公共 API、包导出、构建清单、性能报告、README、Home 落地页与完整文档同步推进到 `0.6.0`。

## 0.5.0 - 2026-08-27

- 新增 Playwright 多浏览器测试矩阵：Chromium、Firefox、WebKit 三个桌面项目，默认稳定门禁执行 Chromium 与 WebKit，Firefox 提供独立和三引擎完整命令。
- 新增 Pixel 7 Chromium 与 iPhone 13 WebKit 移动端项目；最终审计将回流范围扩展到全部 21 个示例和 Home 两页，共 52 个用例，并覆盖 320px 窄屏、横屏、44px 触控目标、Bottom Sheet 焦点与关闭生命周期。
- 新增 Axe 真实浏览器无障碍门禁，对全部 21 个示例、Home 落地页和文档执行 WCAG 2 A/AA、2.1 A/AA 与 2.2 AA 规则；最终审计收紧为阻断全部自动检测到的违规，不再按 impact 放行，并补充键盘、焦点恢复、RTL、Reduced Motion、Forced Colors 和回流测试。
- 新增 24 个 parse5 HTML 结构测试，覆盖全部示例、Home 落地页与文档，检查解析错误、重复 ID、ARIA 引用、语言、标题、Viewport 和页面清单完整性。
- 修复移动端图标按钮触控面积不足、多个文本对比度、无效 ARIA 角色/状态、滚动区域无名称、文件浏览器语义、Dropzone 原生 Label 行为与两个示例 HTML 嵌套错误。
- 深度复核 0.3.0 契约目标：Public API Schema 收紧 JavaScript 导出、属性、适配器动作和实例成员命名；Schema 门禁扩展为 29 个用例，覆盖全部对象闭合、六类嵌套未知字段、六类嵌套必填字段与旧 Schema 别名解析。
- 修正 `getInstance` 公共参数清单与签名对可选 `name?` 的不一致，并新增模块种类、源码参数和派生签名三向一致性检查。
- `npm test` 纳入默认 125 个真实浏览器用例与 24 个结构用例；公共契约、构建产物、官网和完整文档同步推进到 `0.5.0`。

## 0.4.0 - 2026-08-27

- 为公共清单中的全部 66 种运行时行为新增逐行为单元测试，逐项验证夹具存在、初始化成功、实例成员完整、重复初始化幂等、销毁及重新初始化。
- 新增 DOM 生命周期测试，覆盖 MutationObserver 动态节点初始化、行为属性增删、移除子树清理、作用域销毁、多行为共存、全局销毁和 `gardener:init` 冒泡契约。
- 使用 Node.js 内置测试运行器与 Happy DOM 建立可重复、无需启动浏览器的 `npm run test:runtime` 门禁，并将其纳入 `npm test`。
- 修复 Pull Refresh 引用局部 `numeric()` 导致首次初始化抛出 `ReferenceError` 的问题，将安全数值解析提升为共享运行时辅助函数。
- 修复行为实例清点器把内部辅助函数返回值误记为公共成员的问题；Password Strength 规范成员调整为 `update` / `destroy`，Cart 调整为 `update` / `summary` / `destroy`。
- 公共契约、构建产物、官网首页和完整文档同步推进到 `0.4.0`。
- 深度回归补充 Ajv JSON Schema 2020-12 独立门禁，标准编译六套 Schema，并验证发布数据、未知根字段与跨 Schema 引用；逐行为测试同时改为双向比对真实实例成员与公共清单。

## 0.3.0 - 2026-08-27

- 完成公共 API 清点，新增 `gardener.public-api.json`，明确 CSS 层、全部包入口、主题属性、9 个 JavaScript 模块导出及参数/返回值、66 种行为的实例成员、75 种事件及其 `detail` 字段、309 个作者可用运行时属性、27 个运行时维护状态属性、Tauri/Electron 适配器和兼容策略。
- 元数据统一使用 `behaviors: string[]` 表达声明式交互，使用 `adapters: string[]` 表达宿主桥接；组件和配方统一使用 `platforms`，移除 `runtime`、`runtimes`、复合适配器字符串和 `targets` 的混用。
- 组件元数据显式登记 `status` 与 `platforms`；Manifest 规范字段改为 `behaviors`，并暂时保留 `runtimeBehaviors` 兼容别名。
- 新增 Components、Recipes、Capabilities、Utilities、Manifest、Public API 六套 JSON Schema，全部采用 JSON Schema 2020-12，并拒绝未知根字段和对象字段。
- 新增 `npm run contracts` 契约门禁，验证 Schema、版本、命名、唯一性、选择器实现、模块参数、行为实例成员、运行时属性、事件载荷、桌面适配器、全部包入口、源码/构建产物一致性及跨清单引用，并加入九组负向契约测试。
- 统一 Card 的部件名为 `g-card-header`、`g-card-body`、`g-card-footer`、`g-card-title`、`g-card-subtitle`，消除组件部件清单中最后一组无前缀名称。
- 新增组件清单、Public API 和全部 Schema 的包导出，同步官网文档与 AI 页面生成协议。

## 0.2.0 - 2026-08-25

- 新增第 16 类“完整页面与行业解决方案”，提供 32 种个人、企业、内容、后台、业务工作台和垂直行业整页契约；同步新增 32 个 `solution.*` 配方，使机器可读配方总数达到 52。
- 新增 32 种 AI 产品与智能交互组件，覆盖工作区/会话/消息、Composer/附件/Prompt、模型/Thinking/Streaming、工具调用与批准、Agent 状态/计划/多 Agent/交接、来源与 Artifact、文件树/版本/生成、上下文记忆、Token/费用/限流、语音、权限、隐私、安全与反馈评估；加入 AI Composer、Prompt Fill、AI Approval 与 AI Feedback 运行时。
- 新增 32 种桌面端特有组件，覆盖原生标题栏/窗口控制、菜单/活动栏、Dock/检查器/分栏、状态栏、命令面板、快捷键录制、右键菜单、未保存标签、拖动区、加载、更新/权限、原生文件选择、托盘、多窗口、完整工作区、窗口切换、最近文档、工具栏/底部面板、后台任务/通知/同步、更新进度、崩溃恢复、单实例、深链与 About；加入 Desktop Tabs、Shortcut Recorder、Native File Picker 与 Window Switcher 运行时。
- 新增 32 种移动端特有组件，覆盖安全区与动态视口、应用栏与底部导航、Bottom/Action/Filter Sheet、下拉刷新、无限加载、滑动操作/标签、移动分类/搜索/选择、粘性购买、滚轮、FAB、全屏任务、键盘避让、移动表单/认证/结算/媒体、选择模式、Snackbar、权限、离线与空错状态；加入 Mobile Sheet、Pull Refresh、Infinite Load、Swipe Actions 与 Wheel Picker 运行时。
- 新增 32 种商业与支付组件，覆盖商品目录、图库、SKU、价格库存、购物车、结算、地址、配送/自提、优惠、发票、支付、订单、订阅、定价、用量、账单、退款和税费；加入 Quantity Stepper、SKU Selector、Cart 与 Coupon 运行时。
- 新增 32 种登录与账号体系组件，覆盖认证外壳、登录注册、恢复与验证、MFA/OTP、Passkey/SSO/二维码、邀请、锁屏与会话、账号/租户/身份、设备审计、安全事件、恢复码、授权同意和认证结果；加入 OTP Input、Password Strength 与 Auth Timer 运行时。
- 新增 32 种文件和内容系统组件，覆盖上传/分片/失败恢复、文件浏览、媒体库、图片处理、文档/PDF/音视频查看、四类编辑器、评论、修订、版本、自动保存和存储；加入 Upload Manager、File Browser、Editor Shell、Revision Compare 与 Autosave 运行时。
- 新增 32 种选择与批量操作组件，覆盖全选、反选、范围选择、批量栏、Transfer/Dual List、层级与实体 Picker、日期时间范围、保存配置、排序/分组构建器、批量确认和进度；加入 Transfer、Picker、Cascader、Saved Choice、Builder List 运行时。
- 新增 48 种数据展示与操作组合，覆盖表格、记录、列表、层级、流、指标、图表、计划、地图、矩阵、状态和数据操作；加入排序、选择、行展开、列显隐、筛选和视图切换运行时。
- 新增 38 种传统导航组合，覆盖全局、局部、层级、选择、页内、结果集、流程、移动、桌面、命令和身份导航；加入 Nav Toggle、Roving Nav、Context Menu、Scrollspy 与 Jump Nav 运行时。
- 新增 37 种表单传统组合，覆盖多种布局、字段结构、业务字段组、验证、选择卡、动态增删、条件显示、进度与审核；加入密码显示、清空、字符计数、条件字段和可重复字段运行时。
- 新增 28 种 Tip 与帮助模式，覆盖行内提示、Tooltip/Popover、Callout、快捷键、FAQ、帮助中心、Coach Mark、Tour/Spotlight、Hotspot、新功能提示、排错与反馈；浮层加入碰撞翻转和 RTL，Tour 加入完整运行时。
- 新增 23 种页面级公共组件，覆盖三类页头、九类公共操作栏、浮动与粘性动作、返回顶部、加载状态，以及 Empty、Error、403、404、500、Offline、Maintenance 页面，并支持容器查询、RTL、安全区与打印。
- 新增 22 个经典布局原语，覆盖内在响应、容器查询、RTL、Masonry、Bento、滚动吸附、安全区、Reduced Motion 与打印展平。
- 新增传统区域布局系统，提供 16 种可直接复用的网页、移动端、Dashboard 与 Tauri/Electron 页面骨架，覆盖容器响应、RTL、固定/粘性区域、Dock、可调分栏与打印展平。
- 新增完整 24 / 12 栅格系统，覆盖五档响应式列宽、偏移、排序、网格线、Gutter、容器查询、Subgrid、RTL 和打印，并加入能力基线清单。
- 修复工具类小数与分数命名冲突，加入变量化间距、定位、容器查询、平台、打印与状态工具类。
- 主题扩展为主色加七类正交主题轴，并为每个主色自动选择通过 WCAG AA 的前景色。
- 新增完整登录、移动分类、超级 CMS、营销、文章、电商和企业后台配方。
- 新增 Tauri/Electron 桌面工作台及安全窗口控制适配器。
- 交互运行时扩展至 66 类行为，支持动态属性初始化、键盘导航、焦点管理、移动弹层/刷新/无限加载/滑动/滚轮、桌面文档标签/快捷键录制/原生文件选择/窗口切换、AI Composer/Prompt/Approval/Feedback、OTP 粘贴与推进、密码强度、认证倒计时、数量/SKU/购物车/优惠、数据排序筛选、上传、文件浏览、内容编辑、修订、自动保存、命令面板、文件拖放、复制、全屏、返回顶部与 Toast API。
- 拆分 AI 专用包，新增组件、工具类和业务配方三类机器可读清单。
- 加强浅色语义色和全部主色前景对比度，补齐 RTL、打印、Reduced Motion 与 Forced Colors 适配。
- 新增深度构建审计、配方/HTML 无障碍校验器与二十一个跨端示例。

## 0.1.0 - 2026-08-25

- 建立 Gardener 单项目构建结构。
- 加入 42 套独立颜色主题和四种显示模式。
- 建立中性、小圆角、低阴影的默认视觉语言。
- 加入生成式响应式工具类。
- 加入 PC、移动端、Dashboard、媒体、商业和 AI 组件基础实现。
- 加入框架无关的交互运行时。
- 加入组件 Manifest、完整性矩阵、示例页和自动检查。
