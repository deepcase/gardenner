# DataGrid 2.0 数据模式

`GTable` 是语义表格样式；`GDataGrid` 默认仍是可访问的 DOM 网格行为。2.0 新增 **显式启用的数据模式**，不会接管已有表格插槽。数据模式的宿主是 region，内部语义 table 承担 grid 角色，分页按钮位于 grid 外部。

```ts
import { init, getInstance } from '@gardenerim/css/runtime';
import type { GardenerimDataGridOptions } from '@gardenerim/css/runtime';

type Order = { id: number; customer: string; amount: number };
const options: GardenerimDataGridOptions<Order> = {
  rowKey: 'id',
  columns: [
    { field: 'customer', title: '客户' },
    { field: 'amount', title: '金额', type: 'number', editable: true },
  ],
  rows: [{ id: 1, customer: '林知夏', amount: 120 }],
  pageSize: 20,
  selectable: true,
  onChange(change) {
    if (change.reason === 'edit') console.log(change.row);
  },
};
const host = document.querySelector<HTMLElement>('#orders')!;
init(host);
const grid = getInstance<Order>(host, 'data-grid')!;
grid.setOptions(options);
grid.setFilter('林');
grid.setSort('amount', 'desc');
grid.setPage(1, 10);
```

HTML 主节点：`<div id="orders" data-g-data-grid aria-label="订单列表"></div>`。

## 功能与边界

- 客户端：文本筛选、文本/数值稳定排序、分页、按稳定 key 跨页选择、单元格编辑。
- 服务端：`mode: 'server'`、`load(query)`，query 包含 page/pageSize/sort/filter/AbortSignal。加载器返回 `{ rows, total }`。
- 并发：新请求取消旧请求；即使服务不响应取消，旧响应也不会覆盖新结果。销毁时取消请求。
- `virtual: true`：**固定行高、当前页内**的窗口化渲染。配置 `rowHeight` 和 `height`，例如 40/400。需要跨全部本地数据窗口化时将 pageSize 设为数据长度。
- 不支持可变行高、合并单元格、分组聚合、Excel 公式或树形数据；不要把它描述为这些能力已实现。
- 原始 rows 不会被修改；编辑结果通过 `onChange` / `gardener:change` 提供。应用负责持久化、服务端校验与失败回滚。
- rowKey 默认 `id`，必须为唯一字符串或数值；主键不可编辑。所有单元格按文本渲染，不执行 HTML。
- 虚拟模式滚动区高度受 height 限制，单元格应保持单行；不用虚拟模式时允许自然换行。

## 服务端加载

```ts
grid.setOptions({
  ...options,
  mode: 'server',
  load: async ({ page, pageSize, sort, filter, signal }) => {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize), filter });
    if (sort) { query.set('sort', sort.field); query.set('direction', sort.direction); }
    const response = await fetch(`/api/orders?${query}`, { signal });
    if (!response.ok) throw new Error('订单加载失败');
    return response.json(); // 服务端响应必须为 { rows: Order[], total: number }
  },
});
```

无 JS 函数的宿主（如 Blazor）可以设置 `mode: 'server'`，监听 change 中的 page/sort/filter 原因，自行请求服务端后调用 `setRows(rows, total)`；并在应用服务层做并发控制。运行时的 AbortSignal 保证只适用于上面 `load` 回调模式。

## 框架集成

React/Vue：使用空的 `<GDataGrid ref={...}/>` 或 `<GDataGrid ref="grid" />`，挂载后通过 `getInstance('data-grid')` 调用 setOptions。数据更新时用 setRows，不要在组件 render 中反复调用 setOptions。调用 setOptions 后，**该根节点的内部 DOM 由运行时拥有，不要再同时渲染 children/slots**。

AngularJS：在 link/post-link 或 `$timeout` 后对空的 `g-data-grid` 节点调用 `getInstance`；使用 onChange 回调修改 scope 时进入 `$evalAsync`。

Blazor：见包内 [runtime 文档](../packages/blazor/docs/runtime.md)，行为名称为 `data-grid`，不使用 `dataGrid`。

HTMX：核心运行时已有 MutationObserver 自动管理新增/移除节点，不需要再次初始化所有页面。为新片段的数据网格配置数据时可监听 `htmx:afterSwap` 并仅初始化新目标。移除节点后原有实例不可复用；重新获取新实例。避免在全局和局部事件中重复注册自己的监听器。
