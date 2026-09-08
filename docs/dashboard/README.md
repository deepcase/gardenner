# 仪表盘

原有 3 个组件仅提供静态外观：指标卡缺少数字和趋势语义，筛选条没有值模型，图表只有容器。现统一使用 `dashboard` 行为，扩展为 7 个组件、39 个变体。新增组件补齐指标组合、内容部件、目标追踪和区间仪表；页面布局继续使用已有 `GDashboard` / `GDashboardGrid`，避免创建重复的布局组件。

| 组件 | 主要能力 | 变体数 |
| --- | --- | --- |
| GKpiStat | 金额、百分比、精度、前后缀、同比和反向趋势 | 6 |
| GFilterBar | 文本、搜索、数字、日期、选择；应用、重置、受控值 | 6 |
| GChartContainer | 折线、面积、柱状、环形；多系列、键盘选点、数据表、CSV | 7 |
| GKpiGroup | 多项指标、1–4 列、自适应、分隔和堆叠 | 5 |
| GDashboardWidget | 标题、折叠、内容插槽，保留输入与子组件 | 5 |
| GGoalTracker | 目标、完成率、剩余量、超额和反向预算 | 5 |
| GGaugeChart | 区间、阈值、单位、半圆和圆环 | 5 |

## 五端参数

五种实现使用同一份 CSS 和运行时。Vue / React 使用 `config`，AngularJS 使用 `gardener-config`，Blazor 使用 `Config` 字典；CSS 使用对应的 `data-g-dashboard-*` 属性。数据配置和受控状态传 JSON 字符串。布尔值 `false` 明确保留，不会被当作缺省值删除。

| config 键 | 值 / 默认 | 用途 |
| --- | --- | --- |
| dashboardOptions | JSON 对象字符串 | 数据、格式、字段、系列、目标、状态 |
| dashboardValue | JSON 状态对象字符串 / 不设置 | 受控模式；应用接收 change.value 并写回 |
| dashboardSize | small / medium / large；默认 medium | 内边距 12 / 16 / 20px，主数字 24 / 30 / 36px |
| dashboardBordered | true / false；默认 true | 显式边框优先于变体 |
| dashboardColumns | 1 / 2 / 3 / 4；默认 4 | 指标组列数；小屏自动收敛 |
| dashboardChartType | line / area / bar / donut；默认 line | 显式类型优先于数据选项、变体 |
| dashboardHeight | 160–640；默认 260 | 图表高度，小屏自动收敛 |
| dashboardDisabled | true / false；默认 false | 阻止用户和 API 状态修改 |

`dashboardOptions` 的数值参数包括 `value`、`previous`、`format`（decimal / currency / percent）、`currency`、`precision`（0–8）、`notation`（standard / compact）、`locale`、`prefix`、`suffix` / `unit`、`inverse`、`description`。百分比使用 0–1 数值；历史值为 0 时显示“无可比较基线”，不显示 Infinity。`loading`、`empty`、`error` 支持明确的内容状态，`labels` 可覆盖文字。

图表：`categories: string[]`，`series: {id,label,values:(number|null)[]}[]`；null 表示缺测，折线不跨过缺测点，负数使用真实零轴。`exportable` 控制导出按钮，`filename` 设置文件名。环形图按系列正值合计展示占比；有负数的财务数据应使用柱状或折线图。可访问的数据表展示当前可见系列的原始数值，CSV 导出当前可见系列，单元格转义并防止公式注入。

筛选：`fields: {key,label,type,defaultValue,required,min,max,options}[]`，选择项为 `{value,label}`；`values` 设置初值，`immediate` 默认 false。默认编辑草稿不会请求数据，点击应用才提交；重置恢复每个字段的 defaultValue。业务请求由应用在 change 回调中接入。示例页面提供周期、团队和图表之间的真实本地联动。

指标组使用 `metrics` 数组，每项接受数值参数。目标使用 `target > 0`；显示真实超额数值，进度条和 ARIA 范围限制在 0–100。仪表使用 `min < max`、`arc: 180|360` 和自动排序的 `thresholds: {value,tone}[]`，tone 为 primary / success / warning / danger。卡片使用 `title`、`collapsed`、`collapsible`，内容通过子节点或框架插槽提供。


## 本轮新增 23 项数据配置

下面的参数均置于 dashboardOptions（JSON）或实例 setOptions 中，五端共用。根属性 dashboardSize / dashboardBordered / dashboardColumns 优先；留空恢复变体默认。

| 参数 | 默认与边界 |
| --- | --- |
| size / bordered / columns | medium / 跟随变体 / 4；尺寸 small、medium、large，列数 1–4 |
| showHeader / showTrend / showDescription / showValue | true；分别控制标题、趋势、指标说明、数值 |
| showLegend / showGrid / showAxisLabels / showMarkers | true；图例、网格线、坐标文字、折线/面积数据点 |
| tableVisible | true；控制数据表入口，showTable 控制初始展开；展开状态在外观更新后保留 |
| showTarget / showRemaining / showRange | true；目标值、剩余量、仪表区间 |
| showApply / showReset | true；筛选操作按钮，隐藏应用时可结合 immediate 使用 |
| maxHeight | 不限；160–2400px，内容可滚动，打印解除限制 |
| tableHeight | 不限；80–1200px，数据表可键盘滚动 |
| pointRadius / lineWidth / donutWidth | 4 / 2 / 28px；范围 2–10 / 1–8 / 8–48 |
| serviceTimeout | 60000ms；0 关闭，最大 600000ms；超时进入错误状态，可再次 load |

所有开关是布尔值。控件高度为 28 / 32 / 36px，内边距 12 / 16 / 20px；粗指针控件至少 44px。指标组按容器宽度收敛到 1–2 列。显式 arc 覆盖半圆变体，阈值无需预排序。隐藏标题仍保留必要操作；组件根节点应提供 aria-label。

外观更新不覆盖筛选草稿和用户状态，中文输入在 compositionend 后才提交。配置验证原子执行，非法日期、数值、重复系列 ID 和不合法状态被拒绝。受控 change.value 仅含 value、filters、hiddenSeries、collapsed、activePoint；getState 另含 draft、loading、error，不能将整个快照回写。环形选点提供 aggregate:true，表示系列正数合计。

load 回调经实例注册，不能放入 JSON。新加载中止旧加载；取消、销毁会结束等待，即使服务忽略 AbortSignal，旧结果也不再写回。示例服务仅返回本地数据；生产数据查询、权限和持久化由宿主负责。

七个现有组件配合 Dashboard / DashboardGrid 足以覆盖当前展示范围，本轮不新增重复组件。图表是轻量 SVG 折线、面积、柱状和环形，不提供完整专业图表引擎的缩放、地理或百万点渲染能力。

## 接入

```html
<!-- CSS：加载 gardener.css 与 gardener.runtime.js -->
<section class="g-kpi" data-g-dashboard
 data-g-dashboard-size="small"
 data-g-dashboard-options='{"label":"营业额","value":128650.75,"previous":112340.5,"format":"currency","currency":"CNY","precision":2}'></section>
```

```vue
<GKpiStat :config="{ dashboardSize: 'small', dashboardOptions: JSON.stringify(options) }" />
```

```jsx
<GKpiStat config={{ dashboardSize: 'small', dashboardOptions: JSON.stringify(options) }} />
```

```html
<div g-kpi-stat gardener-config="{dashboardSize:'small', dashboardOptions:optionsJson}"></div>
```

```razor
<GKpiStat Config="@(new Dictionary<string,object?> {
 ["dashboardSize"]="small", ["dashboardOptions"]=JsonSerializer.Serialize(options)
})" />
```

通过 `getInstance(element, 'dashboard')` 获取实例。`setOptions(patch)` 合并配置；`getState()` 返回副本；`setValue({value,filters,hiddenSeries,collapsed,activePoint})` 请求更新；`setFilter(values)` 提交筛选；`reset()` 恢复字段默认值；`exportCsv()` 返回 CSV；`refresh()` 读取受控属性并渲染；`cancel()` 中止加载并结束等待；`destroy()` 清理并还原内容、样式和 ARIA 属性。

`beforechange` 可取消，`change` 包含 `reason`、`value`、`controlled`。受控模式不会自行提交状态，应用需写回 dashboardValue。图表和筛选事件不替应用访问业务接口。JS 配置可传 `load({filters,signal})` 回调并调用 `load()`，内置中止、过期响应丢弃、加载和错误状态。函数不能放入 JSON 属性，应通过实例 setOptions 传入。

## 演示与验证

- GardenerDemo：`http://127.0.0.1:4180/?component=dashboard#catalog`，分类顶部通过 `preview.html?component=dashboard&dashboardOverview=true` 提供筛选、指标、图表联动总览，与布局分类的同名组件独立；每项均有变体、状态、尺寸和数据参数面板。
- CSS：`packages/css/examples/dashboard-compositions.html`，包含 7 个独立组件与联动经营概览。
- Blazor：示例应用 `/dashboard`，七项组件真实挂载和受控事件。
- `npm run check:dashboard` 检查五端目录、变体、状态及 CSS / 运行时哈希。
- `packages/css/tests/dashboard.test.mjs` 验证格式、异常输入、受控更新、筛选、图表、CSV、异步竞争及销毁。

本轮验收结果另见 [发布复查](verification.md)；不会将共享控制器通过测试等同于所有框架都已实际挂载，框架生命周期另有独立测试。
