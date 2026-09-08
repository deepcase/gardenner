# 数据展示

55 个组件、268 个变体，CSS / Vue / React / AngularJS / Blazor 使用同一套样式和运行时。当前全库登记 562 个组件；本次新增 GList，原列表组件保持兼容。

[逐项清单](inventory.json) · [五端一致性检查](parity.json) · [CSS 完整演示](../../packages/css/examples/data-compositions.html) · [GardenerDemo](http://127.0.0.1:4180/?component=data#catalog)

## 检查与修复

13 个原有样式组件现在提供 data-display 数据控制器，树表、分组表与展开表接入 row-disclosure。Tree 补齐点击选择、受控值、动态节点和键盘。6 个行为容器使用独立 g-data-scope-* 根类，避免 Vue、React、AngularJS、Blazor 把按钮或表格部件样式误用到整个容器。旧部件类继续用于内部结构。

统一 14px 正文、22px 行高、12 / 16 / 20px 内边距和 32 / 40 / 48px 密度基准。表格紧凑及默认垂直内边距参考 [Arco Design Vue 表格设计变量](https://github.com/arco-design/arco-design-vue/blob/main/packages/web-vue/components/table/style/token.less) 的 5px / 9px；这是比例参照，不宣称所有复杂组合与 Arco 像素一致。支持深色、RTL、触屏、减少动态效果、强制颜色及打印。

## 共同配置

显式参数优先于变体。不同组件只消费适用的参数，不适用的参数不会创建不存在的结构。

| config 键 | CSS 属性 | 值与作用 |
| --- | --- | --- |
| dataSize | data-g-data-size | small / medium / large；正文密度 |
| dataBordered | data-g-data-bordered | true / false；外边框 |
| dataColumns | data-g-data-columns | 1 / 2 / 3 / 4；指标、状态、文件列数 |
| dataLayout | data-g-data-layout | horizontal / vertical 或文件 grid / list |
| dataStriped | data-g-data-striped | true / false；表格斑马纹 |
| dataSticky | data-g-data-sticky | true / false；滚动表头 |
| dataTruncate | data-g-data-truncate | true / false；表格文本截断 |
| dataSelection | data-g-data-selection | single / multiple / none；树、虚拟列表、图例等选择 |
| dataValue | data-g-data-value | JSON key 数组字符串；存在即启用受控选择 |
| dataDisabled | data-g-data-disabled | true / false；托管交互禁用 |
| dataHeight | data-g-data-height | 虚拟列表视口高度 96–1200px |
| dataRowHeight | data-g-data-row-height | 虚拟行高 32–160px |
| dataOptions | data-g-data-options | 13 个托管组件的数据配置 JSON 字符串 |
| gridOptions | data-g-grid-options | DataGrid / EditableGrid 配置 JSON 字符串 |

更细的视觉参数使用 --g-data-padding、--g-data-gap、--g-data-row-height、--g-data-label-width、--g-data-columns、--g-data-max-height。静态组合以语义 HTML 传入内容；框架的 children / slot / ChildContent 与 CSS 示例结构相同。

## 数据控制器

使用 getInstance(root, 'data-display') 获取实例。setOptions(options) 支持对象（含 load 函数）；HTML / Config 的 dataOptions 必须是 JSON 字符串。items 或 rows 为对象数组，rowKey 默认为 id，要求唯一、非空类型的字符串或有限数字，不允许重复 key。columns 为 {field,title} 数组，文本安全输出。labels 可以覆盖本地化文字。

| 组件 | 专用选项 / 能力 |
| --- | --- |
| VirtualList | height、rowHeight、overscan；真实窗口渲染、搜索、scrollTo(index)、键盘首尾与上下移动 |
| Kanban | lanes: [{id,label}]；items.status；拖放和键盘可用的移动按钮；move(key,lane) |
| Calendar / Agenda | date、locale、weekStart、minDate、maxDate、disabledDates；月导航和 setDate(YYYY-MM-DD) |
| FileManager | items 的 parentId、type=folder、name、size；path；目录导航、搜索与文件选择 |
| QueryBuilder / FilterBuilder | fields、rules: [{id,field,operator,value}]、conjunction=and/or；contains / equals / gte / lte；实际筛选结果 |
| PivotTable | rowField、columnField、valueField；aggregate=sum/count/average/min/max；实际计算 |
| GanttShell | startDate、days；items.start/end；日期范围内任务条与选择 |
| MapShell | items.x/y（0–100）、label；缩放、复位、标记选择 |
| ExportPanel | columns、filename、separator（逗号/分号/制表符）、bom；exportCsv() 返回 CSV，下载按钮保存文件 |
| DataInspector | value、indent、expandedDepth、maxDepth；结构展开与原始 JSON 切换 |
| DataLegend | items、selectedKeys、selection；图例切换并返回 keys |

共享方法：setOptions、getState、refresh、select、load、cancel、destroy；专用方法只用于对应组件。loading、error、emptyText、disabled、readOnly 可由应用配置。load({filter,path,signal}) 返回数组或 {items}，较早请求被取消并忽略，销毁时中止请求并移除监听器。cancel 会结束等待并忽略旧结果，即使服务不响应 AbortSignal；destroy 恢复初始化前的内容、样式和 ARIA 属性。getState 返回深拷贝，包含 loading / error。

beforechange 已纳入五端同步守卫目录（共 8 个）。Blazor 通过 PreventDefaultEvents 同步取消守卫，再由业务调用实例方法继续操作；异步 .NET 回调不能直接同步阻止 DOM 事件。beforechange 可以取消选择、移动、目录切换和规则增删。change 返回 reason、keys、value 及相关 date/path/filter/zoom/rules；看板移动还返回 items。dataValue 受控选择时，应用收到 keys 后写回 dataValue；事件本身不直接改变选中值。其余数据更改是实例内部状态，应用按事件持久化。

DataGrid / EditableGrid 继续使用 data-grid 行为：rows、columns、rowKey、page、pageSize、mode（local/server）、load、virtual、rowHeight 等。列可设置 sortable、editable；支持排序、搜索、分页、勾选和编辑验证。使用 setOptions、setRows、setPage、setSort、setFilter、getState 等已公开方法；完整签名见各包生成的 API 文档。

## 新增 24 项托管配置

这些参数放入 dataOptions（JSON）或实例 setOptions。静态组合继续通过子节点/插槽、根 data 属性和 CSS 变量配置；DataGrid 使用 gridOptions。

| 参数 | 默认与边界 |
| --- | --- |
| size / bordered / layout | 默认跟随变体；尺寸 small/medium/large，边框布尔，文件布局 grid/list；dataSize 等根属性优先 |
| showHeader / showSearch | 默认 true；隐藏标题或搜索入口 |
| showDescriptions / showLaneCount / showMoveControls | 默认 true；看板说明、泳道数量、移动按钮；隐藏按钮不禁用拖放 |
| showCalendarEvents / showToday | 默认 true；日历事件和今天按钮 |
| showBreadcrumbs / showFileMeta | 默认 true；目录路径和文件信息 |
| showResults / showPreview | 默认 true；规则查询结果和导出预览，隐藏不影响计算与导出 |
| showModeSwitch / showZoomControls | 默认 true；JSON 视图入口和地图缩放按钮 |
| maxHeight / tableHeight | 默认不限；160–2400 / 80–1600px，内容可滚动，打印解除高度上限 |
| laneWidth / calendarDayHeight / mapHeight | 默认 240 / 按尺寸适配 / 300px；160–480 / 44–160 / 160–1200 |
| maxRules / exportPreviewRows | 默认 100 / 5；1–1000 / 0–1000 |
| serviceTimeout | 默认 60000ms；0 关闭超时，最大 600000ms |

控件 28/32/36px，内边距 12/16/20px，标题 16px。触摸控件至少 44px；虚拟行仍按 rowHeight 的实际几何布局。根控件的数据结构变化经过原子校验。看板移动、规则编辑和搜索不会被不变的初始数据覆盖；中文输入完成后才提交。JSON 子项展开在外观更新后保留，循环引用在原始视图显示 [Circular]。

load 由宿主通过 setOptions 注册，返回数组或 {items}。禁用、只读及 beforechange 取消会阻止加载；失败、超时进入可重试错误状态。过期和取消的响应不再写入。地图、甘特和文件浏览是轻量展示组合，专业地图服务、自动排程、上传和权限由宿主接入。

## 五端接入

下面同一份 options JSON 用于所有框架。Vue / React 用 config，AngularJS 用 gardener-config，Blazor 用 Config 字典；布尔 data 参数保留 true/false 字符串。

~~~js
const options = JSON.stringify({items:[{id:'a',label:'项目 A'},{id:'b',label:'项目 B'}],height:240,rowHeight:40});
const config = {dataOptions:options,dataSize:'small',dataBordered:true,dataDisabled:false,dataSelection:'multiple',dataValue:'[]'};
~~~

~~~html
<!-- CSS：写入转义后的 JSON 属性，然后 init(root) -->
<div class="g-virtual-list" data-g-data-display data-g-data-options='{"items":[{"id":"a","label":"项目 A"}]}' data-g-data-size="small"></div>
<!-- Vue -->
<GVirtualList :config="config" />
<!-- AngularJS -->
<div g-virtual-list gardener-config="config"></div>
~~~

~~~jsx
<GVirtualList config={config} />
~~~

~~~razor
<GVirtualList Config="@(new Dictionary<string,object?> {
  ["dataOptions"] = JsonSerializer.Serialize(new {items = new[]{new {id="a",label="项目 A"}}}),
  ["dataSize"] = "small", ["dataBordered"] = true, ["dataDisabled"] = false
})" />
~~~

Blazor 示例项目 /data 提供全部 13 个托管组件的接入演示，检查事件回传和参数更新；新增 data-display.js 已纳入静态资源清单及传递依赖检查。

## 功能边界

MapShell 是可接入地图提供方的坐标画布，未内置在线瓦片与地理编码。GanttShell 提供时间条展示与选中，未实现依赖排程引擎。FileManager 展示应用传入的文件记录，不操作本机文件系统。筛选构建器生成本地规则，服务端查询、权限和持久化由业务层处理。CSV 会转义引号并中和公式前缀；原数据不会改写。

## 逐个组件

| 组件 | 变体数 | 行为 | 本轮处理 |
| --- | ---: | --- | --- |
| table | 9 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| data-grid | 5 | data-grid | 结构、公共参数与全部变体复查通过 |
| description-list | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| list-group | 5 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| tree | 6 | tree | 补齐点击、受控选择、动态节点、禁用和键盘 |
| timeline | 7 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| responsive-table | 7 | table-scroll | 结构、公共参数与全部变体复查通过 |
| table-sort | 4 | table-sort | 修复行为容器与内部部件样式混用，统一五端 |
| row-selection | 4 | row-select | 修复行为容器与内部部件样式混用，统一五端 |
| row-disclosure | 4 | row-disclosure | 修复行为容器与内部部件样式混用，统一五端 |
| column-toggle | 4 | column-toggle | 修复行为容器与内部部件样式混用，统一五端 |
| data-filter | 4 | data-filter | 修复行为容器与内部部件样式混用，统一五端 |
| data-view | 4 | data-view | 修复行为容器与内部部件样式混用，统一五端 |
| editable-grid | 4 | data-grid | 结构、公共参数与全部变体复查通过 |
| tree-table | 4 | row-disclosure | 结构、公共参数与全部变体复查通过 |
| grouped-table | 4 | row-disclosure | 结构、公共参数与全部变体复查通过 |
| expandable-table | 4 | row-disclosure | 结构、公共参数与全部变体复查通过 |
| comparison-table | 5 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| key-value | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| record-detail | 5 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| media-list | 5 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| dense-list | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| audit-log-composition | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| stat-list | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| metric-card | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| sparkline | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| progress-stats | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| data-legend | 6 | data-display | 托管参数、状态和交互复查通过 |
| ranking | 5 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| status-summary | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| data-matrix | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| heatmap | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| data-toolbar | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| column-chooser | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| export-panel | 4 | data-display | 托管参数、状态和交互复查通过 |
| data-state | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| data-view-switcher | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| selection-summary | 4 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| table-density | 4 | table-density | 结构、公共参数与全部变体复查通过 |
| filter-summary | 4 | filter-summary | 结构、公共参数与全部变体复查通过 |
| data-inspector | 5 | data-display | 托管参数、状态和交互复查通过 |
| virtual-list | 4 | data-display | 托管参数、状态和交互复查通过 |
| kanban | 4 | data-display | 托管参数、状态和交互复查通过 |
| gantt-shell | 4 | data-display | 托管参数、状态和交互复查通过 |
| query-builder | 4 | data-display | 托管参数、状态和交互复查通过 |
| calendar | 4 | data-display | 托管参数、状态和交互复查通过 |
| agenda | 4 | data-display | 托管参数、状态和交互复查通过 |
| file-manager | 6 | data-display | 托管参数、状态和交互复查通过 |
| filter-builder | 6 | data-display | 托管参数、状态和交互复查通过 |
| pivot-table | 4 | data-display | 托管参数、状态和交互复查通过 |
| organization-chart | 6 | 语义 HTML / CSS | 结构、公共参数与全部变体复查通过 |
| map-shell | 4 | data-display | 托管参数、状态和交互复查通过 |

## 验证

运行 npm run check:data 验证 55 个组件的目录、268 个变体、五端行为与样式映射、Blazor 静态资源和传递模块依赖。运行 CSS test:runtime、三框架 test:unit、Blazor test:contracts 与 scripts/test-data.mjs 检查行为。GardenerDemo 的 scripts/data-audit.mjs 检查全部组件在宽屏、窄屏、深色及 RTL 下的演示；scripts/data-interaction-audit.mjs 验证真实操作；scripts/data-catalog-audit.mjs 验证参数面板。实际测试结果见 [验收报告](verification.md) 和 final-verification.json，不把静态检查视为完整浏览器验证。

## GDescriptions

新增数据驱动描述列表，数据分类现有 55 个组件、268 个变体。支持四种布局、响应式跨列、四档尺寸与原生模板。[完整参数与五端用法](../descriptions.md)。

## GList 列表扩展

新增三档尺寸、图文条目、分页、响应式栅格、固定行高虚拟滚动与加载更多请求。[完整参数及五端用法](../list.md)。本次专项验收见 [GList 验收记录](../list/verification.md)。

## GStatistic 数值统计

独立统计组件提供数字精度、地区分组、日期、动画及倒计时。数据分类现有 55 个组件、268 个变体、16 个数据托管组件。[参数与五端用法](../statistic.md)。
