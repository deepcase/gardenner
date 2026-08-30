# Gardener.Blazor 1.0.0

Gardener CSS 1.0.0 的官方 Blazor Razor Class Library。以 `net10.0` 为稳定基线，可直接由 `net11.0` 应用引用。库完整映射 506 个 CSS/混合组件、66 个 DOM 行为与 75 个事件，并提供主题、Toast、表单、Tauri、Electron 和底层运行时服务。

## 安装

```xml
<PackageReference Include="Gardener.Blazor" Version="1.0.0" />
```

```csharp
builder.Services.AddGardenerBlazor();
```

在应用入口引入全量样式，也可以改用平台包或组件包：

```html
<link rel="stylesheet" href="_content/Gardener.Blazor/gardener.min.css" />
```

组件首次交互渲染时会按需加载 `_content/Gardener.Blazor/gardener.blazor.js`，无需手写 `<script>`。

## 最小示例

```razor
@using Gardener.Blazor.Components

<GardenerProvider Theme="garden" Mode="light" Shape="small" Platform="web">
    <GButton Variant="primary" @onclick="Save">保存</GButton>
</GardenerProvider>
```

所有生成组件共享 `As`、`Class`、`Style`、`Variant(s)`、`State(s)`、`Config`、`Value/ValueChanged`、`ValueEvent`、`ValueKey`、`OnValueChange`、`EventNames`、`PreventDefaultEvents`、`OnEvent`、`ChildContent` 和任意 HTML 属性；通过 `@ref` 可调用刷新、销毁、聚焦和行为实例方法。

## 选择入口

- 全量：`gardener.min.css`
- 平台：`platforms/gardener.{web|mobile|desktop|tauri|electron}.min.css`
- 组件域：`components/*.min.css`，共 28 个构建包
- JS：自动加载 `gardener.blazor.js`；底层 runtime、Tauri、Electron 适配器均随包分发

## 文档

- [安装与架构](docs/getting-started.md)
- [完整公共 API](docs/api.md)
- [506 个组件目录](docs/components.md)
- [66 个 DOM 行为目录](docs/behaviors.md)
- [75 个运行时事件目录](docs/events.md)
- [43 个静态资源入口](docs/assets.md)
- [主题与 36+ 色彩主题](docs/theming.md)
- [表单、生命周期与 JS 互操作](docs/runtime.md)
- [Web、移动、桌面、Tauri、Electron](docs/platforms.md)
- [无障碍与 SSR](docs/accessibility.md)
- [发布、兼容性与性能预算](docs/release.md)

## 兼容性承诺

正式包只以稳定的 `net10.0` 编译，避免把预览版运行时带给生产项目。仓库保留独立 `net11.0` 消费者项目，并在 .NET 11 SDK 验证中构建，以证明向前兼容。公共 API、组件集合、静态资源及兼容基线均为机器可读 JSON，并受 CI 检查。
