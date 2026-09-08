# 完整公共 API

## 注册与服务

- `GardenerimServiceCollectionExtensions`
- `AddGardenerimBlazor(Action<GardenerimOptions>?)`
- `GardenerimRuntime`：`InitializeAsync`、`DestroyAsync`、`RefreshAsync`、`EmitAsync`、`FocusAsync`、`GetBehaviorMembersAsync`、`InvokeBehaviorAsync`
- `GardenerimLocalizationService`：`ConfigureAsync`、`GetAsync`
- `GardenerimThemeService`：`ApplyAsync`、`ReadAsync`、`ClearAsync`
- `GardenerimToastService.ShowAsync`
- `GardenerimTauriService.BindAsync/UnbindAsync`
- `GardenerimElectronService.BindAsync/UnbindAsync`
- `GardenerimJsModule`：作用域 JS module 生命周期宿主

## 组件基础类型

- `GardenerimComponentBase`：全部 575 个强类型组件的基类
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
- `GardenerimBehaviors.All`：95 个 DOM 行为名称与对应常量
- `GardenerimEvents.All/Guards`：105 个事件与 8 个同步守卫事件
- `GardenerimRuntimeCatalog`、`GardenerimBehaviorDefinition`、`GardenerimEventDefinition`：行为成员、事件 detail、冒泡与取消契约
- `GardenerimAccessibilityDefinition`：组件的 roles、键盘、焦点陷阱与 ARIA 属性契约
- `GardenerimEventArgs`：安全序列化后的通用事件参数
- `GardenerimAssets`：全量 CSS、JS、5 个平台包和 28 个组件域包路径
- `GardenerimComponentDefinition`
- `GardenerimThemeState`
- `GardenerimOptions`
- `GardenerimLocalizationOptions`
- `GardenerimLocalizationState`
- `GardenerimPlatform`
- `GardenerimConstants`
- `GardenerimValueChangedEventArgs`

全部 510 个具体组件见 [components.md](components.md)。机器可读公共契约见 `metadata/public-api.json`，完整组件定义见 `metadata/components.json`；两者及兼容基线、性能预算都有对应 JSON Schema。

## 参数化导航

41 个导航组件通过 `Navigation` 接受 `GardenerimNavigationOptions`，条目使用 `GardenerimNavigationItem`，选中值使用 `@bind-Value`。`BeforeNavigationChange` 支持异步 .NET 校验，`OnEvent` 接收导航事件。

完整用法与运行边界见 [导航说明](../../../docs/navigation/README.md)。

## GTable 数据表格

`Table` 参数使用 `GardenerimTableOptions`；列类型 `GardenerimTableColumn`、分页类型 `GardenerimTablePagination`、滚动类型 `GardenerimTableScroll`。`EventNames=["gardener:change"]` 与 `OnEvent` 接收选择、排序、筛选、分页及编辑结果。函数类自定义行为通过 JS interop 或 C# 服务响应事件实现。

支持四档尺寸、排序筛选、选择、分页、固定/分组表头、树形与详情展开、合并、汇总、编辑、调整列宽、行排序与固定行高虚拟滚动。保留静态表格。完整选项和平台边界见 [GTable 文档](../../../docs/table.md)。


## GCalendar

Use `Config["dataOptions"]` with the shared calendar JSON options and `OnEvent` for `gardener:change` notifications. `modelValue`, `pageShowDate` and `mode` can be controlled independently. See [the complete options and framework examples](../../../docs/calendar.md); the sample application includes `/calendar`.

## GCarousel

Use `Config["mediaOptions"]` with `kind: "carousel"`, and `OnEvent` for `gardener:change`. `current` is a controlled one-based page; `value.index` remains zero-based. Supports slide/fade/card transitions, autoplay, indicators, vertical/RTL navigation, touch gestures and thumbnails. See [all options](../../../docs/carousel.md) and sample route `/carousel`.

## GCollapse

Use `Config["disclosureOptions"]` with the shared `items`, `activeKey`, `accordion`, icon and content lifecycle settings. Handle `gardener:change` and write back `activeKey` for controlled state. Independent extra actions emit `gardener:action`. See [the complete API](../../../docs/collapse.md) and sample route `/collapse`.

## GDescriptions

通过 Config["data-options"] 传入统一 JSON。[完整参数与示例](../../../docs/descriptions.md)。

## GTag

使用共享 `tag-options`，支持受控 checked / visible、可取消的选择与关闭、4 档尺寸、13 种预设色、自定义颜色及原生模板。完整参数及事件见 [GTag API](../../../docs/tag.md)。

## GTimeline

使用共享 `data-options` 配置时间线方向、排列、倒序、进行中节点和原生模板。完整参数与事件见 [GTimeline API](../../../docs/timeline.md)。

## GTooltip

通过 overlay-options 配置内容、十二方位、Mini、背景色、受控开关及触发器。完整参数见 [GTooltip API](../../../docs/tooltip.md)。

GTree 参数、受控状态、异步加载、拖拽和虚拟滚动见 [GTree API](../../../docs/tree.md)。

[Arco 对照：12 个新增组件的参数、五端用法与差异](../../../docs/arco/README.md)。
