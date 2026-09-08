# GPopover 气泡卡片

参考 [Arco Design Vue Popover](https://arco.design/vue/component/popover)（本地对照版本 2.58.0）。五端共享 CSS 和浮层运行时。组件目录不新增重复组件，GPopover 的 compact / wide 变体继续有效。

- [GardenerDemo](http://127.0.0.1:4180/?component=popover#catalog)
- [CSS 可交互演示](../packages/css/examples/popover.html)
- [Blazor 演示](http://127.0.0.1:5192/popover)
- [验证记录](popover/verification.md)

## 配置

通过 data-g-overlay-options 传入 JSON。Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 均使用键 overlay-options，值为 JSON 字符串。类型 GardenerimPopoverOptions 可从 @gardenerim/css/runtime 导入。

| 参数 | 类型 / 默认 | 说明 |
| --- | --- | --- |
| title / content | string | 标题 / 正文，按纯文本处理；对应已编写的内容插槽优先 |
| popupVisible | boolean / 未设置 | 设置后进入受控模式，开关操作发出 gardener:change 请求，页面写回状态 |
| defaultPopupVisible | boolean / false | 初始打开，仅在首次配置时读取 |
| trigger | string 或数组 / hover + focus | hover、focus、click、contextMenu；manual 仅实例控制；字符串支持空格分隔 |
| position | string / top | top / bottom / left / right，tl / tr / bl / br / lt / lb / rt / rb；也支持 top-start 等长名称 |
| disabled | boolean / false | 阻止打开；更新为禁用时关闭当前浮层 |
| showArrow | boolean / true | 箭头开关 |
| width / height / maxHeight | number 或 CSS 长度 | 数字按 px；默认内容宽度自适应，可限制长内容高度 |
| popupOffset | number / 10 | 与触发器距离，px |
| boundary | number / 8 | 视口安全留白，px |
| mouseEnterDelay / mouseLeaveDelay | number / 100 / 120 | 悬停开关延迟，单位毫秒 |
| closeOnEscape / closeOnOutside | boolean / true | Escape / 外部点击关闭 |
| autoFocus | boolean / false | 打开后聚焦内容首个可聚焦元素 |
| restoreFocus | boolean / true | Escape 和内容关闭按钮关闭后恢复触发器焦点 |
| topLayer | boolean / true | 使用浏览器原生 Popover 顶层；不支持时使用 fixed 定位回退 |
| contentClass / arrowClass | string | 空格分隔的附加 CSS 类，分别用于面板和箭头 |
| contentStyle / arrowStyle | CSS 属性对象 | 支持 camelCase、kebab-case 和 CSS 变量；长度请带单位，例如 320px |

options 中明确给出的参数优先于对应 overlay-* 属性。未使用 overlay-options 的旧用法保留 click / bottom-start / 8px 默认值；原有 overlayControlled、overlayOpen、overlayWidth 等配置仍可使用。尺寸变体和自定义宽度可以组合。

默认采用 Arco 的 12px × 16px 面板内边距、14px 正文、16px / 500 标题、1.5715 行高、4px 标题正文间隔及 4px 圆角。颜色继续使用 Gardener 主题变量，兼容明暗主题。compact 使用 8px × 12px，wide 使用 400px 宽度。

## 五端用法

共享配置：

```js
const options = { title: '项目概览', content: '查看当前迭代进展', trigger: 'click', position: 'tr', width: 280 };
const config = { 'overlay-options': JSON.stringify(options) };
```

CSS：

```html
<div data-g-popover id="project-popover">
  <button type="button" data-g-popover-trigger>项目详情</button>
  <div data-g-popover-content hidden></div>
</div>
<script type="module">
import { init } from '@gardenerim/css/runtime';
const root = document.getElementById('project-popover');
root.setAttribute('data-g-overlay-options', JSON.stringify({title:'项目概览',content:'当前迭代',trigger:'click'}));
init(root);
</script>
```

Vue：

```vue
<GPopover :config="config">
  <button type="button" data-g-popover-trigger>项目详情</button>
  <div data-g-popover-content hidden />
</GPopover>
```

React：

```tsx
<GPopover config={config}>
  <button type="button" data-g-popover-trigger>项目详情</button>
  <div data-g-popover-content hidden />
</GPopover>
```

AngularJS：

```html
<div g-popover gardener-config="config">
  <button type="button" data-g-popover-trigger>项目详情</button>
  <div data-g-popover-content hidden></div>
</div>
```

Blazor：

```razor
<GPopover Config="Config">
  <button type="button" data-g-popover-trigger>项目详情</button>
  <div data-g-popover-content hidden></div>
</GPopover>
@code {
  private IReadOnlyDictionary<string,object?> Config => new Dictionary<string,object?> {
    ["overlay-options"] = System.Text.Json.JsonSerializer.Serialize(new {title="项目概览",content="当前迭代",trigger="click"})
  };
}
```

## 插槽、事件与实例

复杂内容直接放在 data-g-popover-content 面板内：.g-popover-title、.g-popover-content、.g-popover-footer。这三个区域可包含各框架的组件、输入框和业务按钮，更新参数不重建内容。关闭按钮添加 data-g-close；业务保存逻辑由页面处理。

受控模式监听 gardener:change 的 detail.value，将其写回 popupVisible。嵌套时必须忽略 event.target !== 当前根元素的事件。Blazor 使用 EventNames 和 OnEvent，Detail 是已规范化的 IReadOnlyDictionary<string, object?>；从 value 读取 bool 并更新状态。完整实现见 samples 的 PopoverLab.razor。Vue 的 v-model 事件绑定本身不写回 options，必须同步 popupVisible。

getInstance(root, 'popover') 提供 open()、close()、toggle()、isOpen()、reposition()、destroy()。beforeopen / beforeclose / change 事件可以 preventDefault 取消；open / close 是实际状态通知。setBusy / complete 保留给旧有确认工作流，删除确认建议使用 GPopconfirm。

悬停从触发器进入面板不关闭，内容正在编辑时保持打开。Escape 只关闭顶层浮层；嵌套关闭和卸载清理计时器、观察器、顶层及生成的内容。定位在窗口滚动、缩放、内容尺寸改变时更新，空间不足自动翻转和限制视口边界。Arco 短位置名 tl/tr 是物理方向，长名称 start/end 遵循 RTL。

## 与 Arco 的边界

这是一套跨框架共享协议，不是 Arco 的直接替换导入。默认额外启用 focus 以支持键盘；默认延迟和事件命名采用 Gardener 协议。右键浮层锚定触发器，不跟随鼠标坐标。class 接受字符串，JSON 样式长度需要 CSS 单位。

不提供 popupContainer 传送到外部节点，面板保留在框架拥有的 DOM 树内，避免破坏事件、嵌套和卸载。通过原生顶层避开祖先裁剪；旧浏览器 fixed 回退无法穿透所有裁剪祖先，可把整个组件放到未裁剪的应用区域。顶层仍受 iframe 边界限制。面板保持挂载以保存输入状态，不提供 unmountOnClose。
