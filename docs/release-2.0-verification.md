# 2.0.0 本地验证记录

日期：2026-08-31。源码位置：`D:\develop\Gardener`。本记录表示本地准备完成，不表示已提交、推送、打标签或发布 npm/NuGet。

## 发布阶段复验（2026-08-31）

在上述本地准备之后，发布阶段使用 Node 26.5.1、npm 11.17.0 和 .NET SDK 10.0.400，完整连续运行 `npm run check:repository` 与 `npm run release:verify`，均通过；`GARDENER_REQUIRE_FIREFOX=1`，Firefox 验证为必需项。另使用 .NET SDK 11.0.100-preview.7.26381.103 运行 Blazor `npm run test:net11`，实际消费者编译通过。

`Gardenerim.Blazor` 2.0.0 已发布至 NuGet.org，主包与符号包上传均获接受。公共包通过 NuGet.org 仓库签名验证，76 个原始载荷文件哈希一致，仅新增签名文件；独立缓存从公共源还原并发布的消费者通过 506 组件 SSR、Razor/DI、HTTP 页面以及 44 项静态资源哈希验证。

四个 npm 包均在用户完成逐包 2FA 后发布为 2.0.0，所有 `latest` 标签正确。直接下载的公开 tarball 字节数、SHA-1 和 SHA-512 均与冻结产物一致。独立项目使用新缓存、仅公共 npm 源安装四个精确版本，326 个入口解析、4,864 个导出名、三套 506 组件目录、Vue/React SSR、AngularJS 编译与 ngModel、DataGrid 虚拟化/排序/选择/编辑，以及 TypeScript `/contracts` 正反例全部通过。消费者使用 Vue 3.5.42、React 19.2.8、AngularJS 1.8.3 与 TypeScript 7.0.2；安装时 AngularJS 上游停止维护警告仍然存在。各包发布状态和产物摘要见 [发布记录](release-2.0-publication.json)。

下文保留发布前本地准备阶段的原始结果与当时边界；本节补充的连续发布门禁、.NET 11 Preview 和公开源消费实测更新了当时未执行的项目。本次没有推送 Git、创建标签或部署文档站。

## 本次变更

- 公开品牌导出统一为 Gardenerim，删除旧 Gardener 别名，五套包与 lockfile 统一到 2.0.0。保留 GButton 等组件短名、CSS 类、DOM 事件和资源路径。
- Vue radio、多选数组/Set、checkbox 数组、IME、异步选项、重置和初始 undefined 模型；React multiple select 返回完整选项数组。
- 显式 DataGrid 数据模式：分页、筛选、排序、跨页选择、编辑、定高虚拟化、服务端请求取消与过期响应隔离；键盘操作保持焦点，输出按文本处理。
- 三套 JavaScript 适配器新增 `/contracts` 精确类型入口及编译失败用例。
- Blazor 示例使用真实运行时 API，首页展示 1,000 行虚拟化；新增轻量核心样式，修复 NuGet 检查误读旧版本包的问题。
- 更新能力层级、轻量引入、开发 Node 版本说明、七语言网站和迁移文档。

## 验证结果

以下命令按包分项执行并修正失败项后复测，不冒充一次连续运行的 `npm run release:verify` 或远程 CI。

| 范围 | 已通过 |
| --- | --- |
| 仓库 | 五套版本/peer/lockfile 一致；包/API/七语言文档检查；4,864 个跨入口导出名检查；Windows 文件写入重试测试 |
| CSS | 构建；77 个运行时测试；48 个 Schema 测试；10 个构建测试；24 个 HTML 测试；152 个桌面/Firefox/移动/无障碍浏览器测试；类型、契约、兼容、深度审计、模板验证、体积、可复现构建、npm 包消费与 Publint |
| Vue | 构建；19 个单元/契约测试；3 个 Schema；类型正反例；6 个浏览器/无障碍测试；生产示例；摇树、可复现、体积和打包 |
| React | 构建；15 个单元/契约测试；3 个 Schema；类型正反例；16 个浏览器/无障碍测试；生产示例；摇树、可复现、体积和打包 |
| AngularJS | 构建；17 个单元/契约测试（含 1.8.2/1.8.3）；3 个 Schema；类型正反例；21 个浏览器/无障碍测试；生产示例；摇树、可复现、体积和打包 |
| Blazor | .NET 10 构建零警告；506 组件 SSR/DI/表单/句柄契约；44 静态资源与 Schema；桌面/移动/键盘/无障碍/事件测试；DLL/XML 可复现；本地 2.0.0 NuGet 隔离缓存真实消费与预算 |

## 边界与发布注意事项

- 未重新执行 .NET 11 Preview SDK 的实际编译；保留独立消费者与原有检查，不将 .NET 10 测试冒充为 .NET 11 实测。
- DataGrid 为固定行高、页内虚拟化，不包含可变高度、合并单元格、树形分组或 Excel 引擎。业务认证、权限、保存和校验仍由应用负责。
- AngularJS 上游停止维护的风险无法通过本适配器消除。
- 公共 GitHub 文档地址未能访问；NuGet README 改为说明随包 docs 路径，未部署公开文档站。
- Runtime 因新增 DataGrid 获得单项、有限、说明原因的体积额度；Vue 文件数增加对应 `/contracts` 的四个产物。未整体放宽 CSS 或其他包的字节预算，详见 [发布流程](releasing.md)。
- 用户工作区已有大量改动，本次未回滚这些改动。`VerdantAdmin` 未在本次升级中改动，迁移它时应按照 [2.0 迁移说明](migration-2.0.md) 更新导入名及依赖。
