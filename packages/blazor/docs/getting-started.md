# 安装与架构

Gardener.Blazor 是 Razor Class Library，不强制具体 Blazor 托管模式。Blazor Web App（静态 SSR、Interactive Server、Interactive WebAssembly、Auto）、独立 WebAssembly、Hybrid 以及桌面 WebView 均使用相同组件 API。

1. 引用 `Gardener.Blazor`。
2. 在 `Program.cs` 调用 `builder.Services.AddGardenerBlazor()`。
3. 在页面导入 `Gardener.Blazor.Components`。
4. 引用全量、平台或组件域 CSS。
5. 用 `GardenerProvider` 设置主题作用域。

```razor
<GardenerProvider Theme="ocean" Mode="light" Shape="small" Density="compact">
  <GAppShell>
    <GSidebar>...</GSidebar>
    <GMainRegion>...</GMainRegion>
  </GAppShell>
</GardenerProvider>
```

`G*` 组件由 CSS 组件元数据生成，名称稳定且可在 `GardenerCatalog` 查询。需要运行时才存在的组件在首次交互渲染后初始化；静态 SSR 仍输出完整语义 HTML 和样式，不会因 JS 尚不可用而失败。

