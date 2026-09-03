# 1.0.0 → 2.0.0

2.0.0 包含破坏性导出名更新，不是 1.0.1 补丁，也不是向后兼容的 1.1.0。四个 npm 包与 `Gardenerim.Blazor` 已于 2026-08-31 发布 2.0.0；npm `latest` 指向 2.0.0，旧版本保持不变。产物摘要与公开源验证状态见 [发布记录](release-2.0-publication.json)。

## 名称迁移

所有带品牌的公开导出统一为 Gardenerim，不保留旧别名。例如：

| 1.0.0 | 2.0.0 |
| --- | --- |
| Gardener | Gardenerim |
| GardenerProvider / GardenerComponent | GardenerimProvider / GardenerimComponent |
| createGardenerVue / createGardenerAngularJS | createGardenerimVue / createGardenerimAngularJS |
| useGardener / vGardener | useGardenerim / vGardenerim |
| gardenerComponents / gardenerDirectives | gardenerimComponents / gardenerimDirectives |
| GardenerBehaviorName 等类型 | GardenerimBehaviorName 等类型 |
| GARDENER_ANGULARJS_MODULE | GARDENERIM_ANGULARJS_MODULE |

Vue 插件注册 `v-gardenerim`，AngularJS 行为指令为 `g-gardenerim`，注入服务名为 `GardenerimRuntime`、`GardenerimTheme`、`GardenerimToast`。AngularJS 默认模块字符串仍是 `gardener`。Blazor 命名空间与包 ID 为 `Gardenerim.Blazor`。

`GButton` 等组件短名、`g-*` CSS 类、`data-g-*` 属性、`gardener:*` DOM 事件、样式文件路径保持不变；不要对项目进行无差别 gardener 字符串替换。

## 修复和新增

- Vue radio 使用选项值比较，select multiple 返回完整数组/Set；checkbox 数组、异步选项及中文 IME 使用原生 Vue 模型语义。
- React 多选 select 的 onValueChange 返回字符串数组。
- DataGrid 新增可选数据模式：分页、排序、筛选、跨页选择、编辑、服务端请求取消及固定行高虚拟化。空宿主由 runtime 管理，不能同时让框架渲染其子 DOM。
- Vue/React/AngularJS 新增 `/contracts` 类型入口，提供组件 variant/state 精确联合类型和 DataGrid 泛型。原通用组件属性仍支持扩展。
- Blazor 修正 `data-grid` / `setOptions` 示例，并新增轻量核心样式资源。
- 五套版本统一为 2.0.0；JS 适配器要求 CSS >=2.0.0 <3.0.0。

源码开发使用 Node 24 LTS；最低工具环境为 Node 20.19+ 或 22.12+。已构建包的 Node 18.18 消费兼容性不代表 Vite 开发支持 Node 18。AngularJS 适配器用于存量系统，不承诺消除上游停止维护的风险。

详见 [DataGrid](data-grid.md)、[组件能力层级](component-levels.md)、[轻量后台引入](lightweight-admin.md)。发布前运行 `npm run release:verify`；导出名独立门禁为 `npm run verify:exports`。冻结的 `compatibility/npm-1.0.0.json` 用于核对旧名称到新名称的映射，不应由当前生成输出覆盖。
