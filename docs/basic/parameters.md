# 五框架共享基础参数

现有框架参数 `variant` / `state` / `config` 继续使用。Blazor 对应 `Variant`（单字符串）、`Variants`（数组）、`State` / `Config`；AngularJS 对应 `gardener-variant` / `gardener-state` / `gardener-config`。AngularJS variant/state 是文字或插值，config 是表达式。

| config 键 | CSS 属性 | 用途 |
| --- | --- | --- |
| basicCount | data-g-basic-count | Badge 非负计数，开启自动格式化 |
| basicMax | data-g-basic-max | Badge 显示上限（默认 99）；AvatarGroup 可见成员上限 |
| basicShowZero | data-g-basic-show-zero | Badge 显示 0，默认隐藏；附着模式仅隐藏指示器 |
| basicToggle | data-g-basic-toggle | Tag/Chip 主动启用选择，发出 gardener:change，detail.value 为布尔值 |
| basicControlled | data-g-basic-controlled | 状态由应用维护；运行时仅发出选择/关闭事件 |

HTML 布尔属性支持空字符串或 `true`，`false` / `0` 表示关闭。原生 CSS 用法调用 `init(root)`；框架默认自动初始化。组件卸载调用共享清理，禁用与加载保护恢复此前可用的原生按钮，不启用调用方原本禁用的按钮。

Badge 自动计数建议提供 `<span class="g-badge-value"></span>`；附着模式提供 `.g-badge-indicator`，承载内容保持原样。AvatarGroup 提供成员 `.g-avatar` 和一个 `.g-avatar.g-avatar-overflow` 作为 +N 展示槽。自动输出槽由共享运行时管理，其他内容由框架负责。

头像文字使用 `.g-avatar-text`，备用文字使用 `.g-avatar-fallback`；加载失败后展示备用文字。自定义大小使用 `--g-avatar-size: 48px`，组重叠使用 `--g-avatar-group-overlap`。卡片列数使用 `--g-card-grid-columns`。圆角可通过 `--g-basic-radius` 统一调整。

选择标签应使用原生 button 并提供 `aria-pressed`；关闭按钮需有可读名称，并使用 `data-g-basic-close`。关闭事件 `gardener:close` 可 `preventDefault()` 取消；受控模式由应用决定是否移除，无需替换框架维护的节点。

```vue
<GTag as="button" variant="checkable" v-model="selected"
  :aria-pressed="selected" :config="{basicToggle:true,basicControlled:true}">标签</GTag>
```

```jsx
<GTag as="button" variant="checkable" value={selected} onValueChange={setSelected}
  aria-pressed={selected} config={{basicToggle:true,basicControlled:true}}>标签</GTag>
```

```html
<button g-tag gardener-variant="checkable" ng-model="selected"
  ng-attr-aria-pressed="{{selected}}"
  gardener-config="{basicToggle:true,basicControlled:true}">标签</button>
```

```razor
<GTag As="button" Variant="checkable" @bind-Value="selected"
  aria-pressed="@selected?.ToString()?.ToLowerInvariant()"
  Config="@(new Dictionary<string,object?> { ["basicToggle"]=true, ["basicControlled"]=true })">标签</GTag>
```

```html
<button type="button" class="g-tag g-tag-checkable" data-g-basic-toggle aria-pressed="false">标签</button>
```

CSS 示例为非受控模式；若启用 basicControlled，应监听 gardener:change 并自行更新 aria-pressed。Vue 使用 v-model，React 使用 value/onValueChange，AngularJS 使用 ngModel，Blazor 使用 @bind-Value，事件值保持一致。
