# GTable 数据表格

GTable 现在支持两种明确的用法：原有的静态 HTML 表格，以及提供 `columns`、`data` 的数据驱动表格。数据模式由 CSS 包内的 `createTable` 控制器实现，Vue、React、AngularJS、Blazor 均使用它。颜色继承 Gardener 主题，尺寸参考 [Arco Design Vue Table](https://arco.design/vue/component/table)。

## 基本使用

```ts
const options = {
  columns: [
    { dataIndex: 'name', title: '姓名', width: 180, sortable: true },
    { dataIndex: 'budget', title: '预算', type: 'number', align: 'right', sortable: true },
  ],
  data: [{ key: 1, name: '林晓', budget: 4800 }],
  size: 'small', rowSelection: true,
  pagination: { defaultPageSize: 10, pageSizeOptions: [10, 20, 50] },
};
```

| 入口 | 使用方式 |
| --- | --- |
| CSS + JavaScript | `import { createTable } from '@gardenerim/css/runtime'; const table = createTable(div, options)` |
| CSS 声明式 | `<div data-g-table-options='{"columns":[...],"data":[...]}'></div>`，调用 `init`；JSON 不包含函数 |
| Vue | `<GTable :table="options" @selection-change="handleSelection" />`；也可单独传 `:columns`、`:data` |
| React | `<GTable table={options} ref={tableRef} />`；也可单独传 `columns`、`data` |
| AngularJS | `<div g-table gardener-table="options" gardener-on-change="changed($value)"></div>` |
| Blazor | `<GTable Table="Options" EventNames="Events" OnEvent="Changed" />`，`Options` 类型为 `GardenerimTableOptions` |

数据模式需要容器节点。Vue/React/Blazor 自动使用 `div`，AngularJS 应使用 `div g-table` 或 `g-table` 自定义元素。静态 `<GTable><thead>…</thead><tbody>…</tbody></GTable>` 仍然可用。数据模式由控制器管理表格内容，不同时传入静态子节点。

## 参数与组合

| 能力 | 参数 | 默认或语义 |
| --- | --- | --- |
| 列/数据 | `columns`, `data`, `rowKey`, `childrenKey` | `rowKey: 'key'`；键必须唯一，支持字符串和数字；`dataIndex` 支持安全的点路径 |
| 密度 | `size` | `large / medium / small / mini`；正文 14px，mini 12px；横向内边距 16px |
| 边框 | `bordered` | `true / false / {wrapper, cell, headerCell, bodyCell}`，外框与内部边框可独立设置 |
| 外观 | `stripe`, `hoverable`, `showHeader`, `tableLayoutFixed`, `rowClass` | 斑马纹、悬停、高密度固定布局、行类名 |
| 列显示 | `width`, `minWidth`, `maxWidth`, `align`, `ellipsis`, `tooltip`, `cellClass` | 省略显示应同时配置宽度与固定布局；tooltip 为原生 title |
| 排序 | 列 `sortable`, `sorter`；表 `sorter` | 三态排序，稳定比较；`type: 'number'` 数值排序；`sortDirections`、`defaultSortOrder`、受控 `sortOrder` |
| 筛选 | 列 `filterable`；表 `filters` | `filters: [{text,value}]`、`multiple`、`filter(values,row)`、`defaultFilteredValue`、受控 `filteredValue` |
| 选择 | `rowSelection` | 布尔或对象：`type: 'checkbox' / 'radio'`，禁用判断 `disabled(row)`、列宽/固定、`showCheckedAll`、`onlyCurrent`、`checkStrictly` |
| 受控选择 | `selectedKeys` / `defaultSelectedKeys` | 受控模式只发出新键值，等待外部更新；可跨页保留；`undefined` 释放控制 |
| 树形 | 行 `children`、`indentSize`, `defaultExpandAllRows`, `loadMore(row,{signal})` | 关联选择支持父子联动与半选；异步子节点防重复加载和过期响应 |
| 展开详情 | `expandable`, `expandedKeys`, `defaultExpandedKeys` | 行 `expand` 文本或 `expandedRowRender(row)`；受控/默认展开；展开列宽与固定 |
| 分页 | `pagination` | `false` 关闭，或 `current/pageSize` 受控、`defaultCurrent/defaultPageSize` 非受控、`pageSizeOptions/showPageSize` |
| 分页位置 | `pagePosition` | `tl / top / tr / bl / bottom / br`，默认右下 |
| 固定/滚动 | `scroll: {x,y,minWidth,maxHeight}`, `stickyHeader`, 列 `fixed` | 左右固定列、分组表头、横纵滚动；`stickyHeader` 可为顶部偏移值 |
| 合并 | `spanMethod({record,column,rowIndex,columnIndex,value})` | 返回 `{rowspan,colspan}`；0 隐藏单元格；列也可提供固定 `rowSpan/colSpan`；索引只计算数据列 |
| 汇总 | `summary`, `summaryText` | `true` 对当前页可见记录的 number 列求和；函数可返回自定义汇总行 |
| 列宽 | `columnResizable`, 列 `resizable/minWidth/maxWidth` | 指针拖动或分隔线键盘方向键/Home/End |
| 编辑 | 列 `editable`, `validate(value,row)` | 校验失败保留输入并标记错误；成功回传新数据，不修改调用方原记录；键字段及嵌套路径不支持直接编辑 |
| 行排序 | `draggable` | 手柄拖放及上下按钮；排序、筛选、服务端模式下禁用重排；仅根级行 |
| 虚拟滚动 | `virtualListProps: {height,itemHeight,overscan}` | 固定行高窗口，适用于大量平铺记录；禁用分页时覆盖完整数据 |
| 异步 | `mode: 'server'`, `load(query)`, `requestTimeout`, `total` | query 包含分页、排序、筛选与 AbortSignal；返回 `{data,total}`；新请求使旧请求失效 |
| 状态/语言 | `loading`, `disabled`, `labels`, `locale`, `caption`, `ariaLabel` | 空数据、请求错误及重试；可替换按钮、状态文案和比较器语言 |

`onChange` 和 `gardener:change` 提供 `component: 'table'`、`reason`、分页、排序、筛选、选择、展开、加载状态，以及本次操作的数据。细分回调包括 `onSelectionChange/onExpandedChange/onSorterChange/onFilterChange/onPageChange/onPageSizeChange/onColumnResize/onRowReorder/onEdit/onError` 和行、单元格鼠标事件。Vue 另外提供 `change/selection-change/expand/sorter-change/filter-change/page-change/page-size-change/edit/error` 事件。

实例可通过 Vue/React ref 的 `getInstance()`、AngularJS `$gardenerHandle.getInstance()`、CSS `getInstance(host,'table')` 获取。方法包括 `update/setOptions/setData/getState/select/selectAll/expand/expandAll/setSort/setFilter/setPage/clearFilters/resetFilters/clearSorters/resetSorters/resizeColumn/moveRow/editCell/reload/cancel/scrollTo/destroy`。Blazor 可使用现有 `InvokeBehaviorAsync` 调用 table 实例，或响应事件后更新 `Table` 参数。

## 异步与受控用法

```ts
const options = {
  columns, data: [], mode: 'server',
  load: async ({ page, pageSize, sorter, filters, signal }) => {
    const response = await fetch('/api/members/query', {
      method: 'POST', signal, headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ page, pageSize, sorter, filters }),
    });
    if (!response.ok) throw new Error('加载失败');
    return response.json(); // { data: [...], total: 120 }
  },
};
```

后端必须自行实现校验、筛选、排序和权限控制。Blazor 的 JSON 参数不能传递 JavaScript 函数：服务端查询通过 `OnEvent` 获取页码和筛选条件，在 C# 服务加载后更新 `Data/Total`；自定义比较、渲染、合并回调需要显式 JS interop 扩展。各框架共享可序列化参数及基础行为。

## 与 Arco 的边界

这是参考 Arco 的 Gardener 表格，不是 Arco API 的逐项替代。Gardener 保留自己的主题、事件结构及静态表格用法。`render`/`expandedRowRender` 接受安全文本或 DOM Node，不直接接受 Vue VNode、React JSX 或 Blazor RenderFragment；不解析 HTML 字符串。筛选器使用原生选择控件，分页是紧凑的页码控件。虚拟滚动要求固定行高，不能与树形、展开详情和合并单元格组合。未实现 Arco 的任意组件插槽、自动测量可变行高、汇总行合并与自定义 scrollbar 插件。不要把两套库的属性对象不加检查地互换。

独立的 `GDataGrid` 继续承担方向键单元格导航等网格交互，其已有接口见 [Data Grid](data-grid.md)。

## 演示与验证

- GardenerDemo：`?component=table#catalog`，11 个真实场景，可切换尺寸、边框、选择、汇总与加载状态。
- CSS：[table.html](../packages/css/examples/table.html)。Blazor 示例：`/table`。
- 共享回归：`npm --prefix packages/css run test:table`。
- 三端浏览器接入与 Arco 尺寸实测：`node scripts/test-table-browsers.mjs`，可用 `AUDIT_ENGINE=firefox/webkit`。
- 完整演示交互与视口检查：`node scripts/test-table-demo.mjs`。
