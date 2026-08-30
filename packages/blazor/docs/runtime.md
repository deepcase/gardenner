# 表单、生命周期与 JS 互操作

每个生成组件都在首次可交互渲染后按元数据挂载行为，并在参数签名改变时重新挂载，在释放时注销事件和销毁行为。静态 SSR 阶段不会访问浏览器 DOM。

`Value`/`ValueChanged` 处理原生 input/change；复杂组件通过 `ValueEvent`（默认 `gardener:change`）与 `ValueKey` 从 CustomEvent.detail 中提取值。`OnValueChange` 同时返回事件名和完整 detail。值会规范化为 .NET 字符串、布尔、数字、数组或字典，而不是泄漏 `JsonElement`。

使用 `EventNames` 订阅任意 75 个 Gardener 事件，使用 `OnEvent` 接收事件名、detail 和取消状态。detail 中的 DOM 元素、File、BigInt、函数和循环引用会先转换为安全可序列化结构。对于 `beforeopen` 等同步守卫事件，将事件名放入 `PreventDefaultEvents`，浏览器会在跨越 JS/.NET 异步边界前立即取消默认动作。

`Config` 的键转为 `data-g-*` 属性。复杂行为的高级成员通过组件引用调用：

```razor
<GDataGrid @ref="grid" Config="options" />
@code {
  private GDataGrid? grid;
  private readonly Dictionary<string, object?> options = new() { ["virtual"] = true };
  private ValueTask<object?> Reload() => grid!.InvokeBehaviorAsync<object>("dataGrid", "refresh");
}
```

表单应优先使用 `GardenerField<TValue>`，它继承 `InputBase<TValue>`，因此支持 `EditForm`、验证消息和修改状态 CSS。
