# 表单、生命周期与 JS 互操作

每个生成组件都在首次可交互渲染后按元数据挂载行为，并在参数签名改变时重新挂载，在释放时注销事件和销毁行为。静态 SSR 阶段不会访问浏览器 DOM。

`Value`/`ValueChanged` 处理原生 input/change；复杂组件通过 `ValueEvent`（默认 `gardener:change`）与 `ValueKey` 从 CustomEvent.detail 中提取值。`OnValueChange` 同时返回事件名和完整 detail。值会规范化为 .NET 字符串、布尔、数字、数组或字典，而不是泄漏 `JsonElement`。

使用 `EventNames` 订阅任意 75 个 Gardenerim 事件，使用 `OnEvent` 接收事件名、detail 和取消状态。detail 中的 DOM 元素、File、BigInt、函数和循环引用会先转换为安全可序列化结构。对于 `beforeopen` 等同步守卫事件，将事件名放入 `PreventDefaultEvents`，浏览器会在跨越 JS/.NET 异步边界前立即取消默认动作。

`Config` 的键转为 `data-g-*` 属性。复杂行为的高级成员通过组件引用调用：

```razor
<GDataGrid @ref="grid" aria-label="客户列表" />
@code {
  private GDataGrid? grid;
  protected override async Task OnAfterRenderAsync(bool firstRender) {
    if (!firstRender || grid is null) return;
    await grid.RefreshAsync();
    await grid.InvokeBehaviorAsync<object>("data-grid", "setOptions", [new {
      columns = new[] { new { field = "name", title = "姓名", editable = true } },
      rows = new[] { new { id = 1, name = "林知夏" } },
      rowKey = "id", pageSize = 20, selectable = true,
      @virtual = true, rowHeight = 40, height = 400
    }]);
  }
  private ValueTask<object?> Reload() => grid!.InvokeBehaviorAsync<object>("data-grid", "refresh");
}
```

表单应优先使用 `GardenerimField<TValue>`，它继承 `InputBase<TValue>`，因此支持 `EditForm`、验证消息和修改状态 CSS。

DataGrid 数据模式接管空宿主内部 DOM，不应再同时渲染 ChildContent。`Config` 只映射标量属性，不能代替 setOptions 传入列和行数据。虚拟化为固定行高、页内窗口化，并不支持可变高度或分组聚合。更新数据调用 `setRows`，刷新调用 `refresh`；运行时行为名称始终是 `data-grid`。
