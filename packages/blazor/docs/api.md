# 完整公共 API

## 注册与服务

- `GardenerimServiceCollectionExtensions`
- `AddGardenerimBlazor(Action<GardenerimOptions>?)`
- `GardenerimRuntime`：`InitializeAsync`、`DestroyAsync`、`RefreshAsync`、`EmitAsync`、`FocusAsync`、`GetBehaviorMembersAsync`、`InvokeBehaviorAsync`
- `GardenerimThemeService`：`ApplyAsync`、`ReadAsync`、`ClearAsync`
- `GardenerimToastService.ShowAsync`
- `GardenerimTauriService.BindAsync/UnbindAsync`
- `GardenerimElectronService.BindAsync/UnbindAsync`
- `GardenerimJsModule`：作用域 JS module 生命周期宿主

## 组件基础类型

- `GardenerimComponentBase`：全部 506 个强类型组件的基类
- `GardenerimComponent`：以元数据名称动态选择组件
- `GardenerimBehavior`：为任意元素附加一个或多个行为
- `GardenerimPart`：输出组件内部约定类/part
- `GardenerimProvider`：十轴主题与初始化边界
- `GardenerimField<TValue>`：兼容 `EditForm`、`EditContext` 和 DataAnnotations 的输入/选择/文本域

## 生成组件共同参数

`As`、`Id`、`Class`、`Style`、`Variant`、`Variants`、`State`、`States`、`Config`、`Initialize`、`Value`、`ValueChanged`、`ValueEvent`、`ValueKey`、`OnValueChange`、`EventNames`、`PreventDefaultEvents`、`OnEvent`、`ChildContent`、`AdditionalAttributes`。

## 生成组件实例成员

`Element`、`RefreshAsync`、`DestroyAsync`、`FocusAsync`、`GetBehaviorMembersAsync`、`InvokeBehaviorAsync<T>`。

## 数据与常量

- `GardenerimCatalog.Components/ByName/ByComponentType`
- `GardenerimThemePresets.All/AxisValues`：42 个颜色主题与全部轴预设
- `GardenerimBehaviors.All`：66 个 DOM 行为名称与对应常量
- `GardenerimEvents.All/Guards`：75 个事件与 7 个同步守卫事件
- `GardenerimRuntimeCatalog`、`GardenerimBehaviorDefinition`、`GardenerimEventDefinition`：行为成员、事件 detail、冒泡与取消契约
- `GardenerimAccessibilityDefinition`：组件的 roles、键盘、焦点陷阱与 ARIA 属性契约
- `GardenerimEventArgs`：安全序列化后的通用事件参数
- `GardenerimAssets`：全量 CSS、JS、5 个平台包和 28 个组件域包路径
- `GardenerimComponentDefinition`
- `GardenerimThemeState`
- `GardenerimOptions`
- `GardenerimPlatform`
- `GardenerimConstants`
- `GardenerimValueChangedEventArgs`

全部 506 个具体组件见 [components.md](components.md)。机器可读公共契约见 `metadata/public-api.json`，完整组件定义见 `metadata/components.json`；两者及兼容基线、性能预算都有对应 JSON Schema。
