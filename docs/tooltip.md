# GTooltip 文字气泡

参考 [Arco Design Vue Tooltip](https://arco.design/vue/component/tooltip)，本地测量版本 2.58.0。CSS、Vue、React、AngularJS、Blazor 共用浮层运行时与样式。

[GardenerDemo](http://127.0.0.1:4180/?component=tooltip#catalog) 提供 12 组场景与参数实验室。[CSS 示例](../packages/css/examples/tooltip.html)、[Blazor 示例](http://127.0.0.1:5192/tooltip)、[验证记录](tooltip/verification.md)。

## 配置

CSS 的 data-g-overlay-options 接收 JSON；Vue / React 使用 config，AngularJS 使用 gardener-config，Blazor 使用 Config，键均为 overlay-options。GardenerimTooltipOptions 可从 @gardenerim/css/runtime 导入。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| content | 未设置 | 纯文本内容；已有子内容优先，支持框架插槽 |
| position | top | top / bottom / left / right，tl / tr / bl / br / lt / lb / rt / rb；兼容 top-start 等长名称 |
| mini | false | 标准上下内边距 8px，Mini 为 4px；左右均 12px |
| backgroundColor | 未设置 | 同时设置面板与箭头背景；默认 #373739，文字白色 |
| popupVisible | 未设置 | 指定布尔值后受控，变更请求通过 gardener:change 发出，由页面写回 |
| defaultPopupVisible | false | 初次配置时打开，仅消费一次 |
| disabled | false | 阻止打开并关闭已有提示 |
| trigger | hover + focus | hover / focus / click / contextMenu 或数组；manual 仅实例控制 |
| mouseEnterDelay / mouseLeaveDelay | 100 / 120 | 悬停开关延迟，毫秒 |
| showArrow | true | 显示箭头 |
| popupOffset / boundary | 10 / 8 | 触发器间距 / 视口安全边距，px |
| width / height / maxHeight | 未设置 | 数字或 CSS 长度；默认自适应，面板最大宽度 350px，窄屏进一步约束 |
| contentClass / arrowClass | 未设置 | 空格分隔的 CSS 类 |
| contentStyle / arrowStyle | 未设置 | CSS 属性对象，支持 camelCase、kebab-case、CSS 变量；长度值带单位 |
| closeOnEscape / closeOnOutside | true / true | Escape / 外部点击请求关闭 |
| topLayer | true | 浏览器原生 Popover 顶层避免裁剪；不支持时固定定位回退 |

标准文字 14px、行高 1.5715、圆角 2px。CSS 变量 --g-tooltip-background / --g-tooltip-color 可统一品牌外观；自定义浅背景时通过 contentStyle.color 配套深色文字。尺寸上限受视口约束。

## 用法

```js
const options = { content: '补充说明', position: 'tr', mini: true };
const config = { 'overlay-options': JSON.stringify(options) };
```

Vue 示例：

```html
<GTooltip :config="config">
  <button type="button" data-g-tooltip-trigger>查看提示</button>
  <div data-g-tooltip-content hidden></div>
</GTooltip>
```

React 使用同样的 GTooltip、config 和子元素；AngularJS 使用带 g-tooltip 与 gardener-config 的 div；Blazor 使用 GTooltip Config 和 ChildContent。CSS 使用 data-g-tooltip 包装器并调用 init。自定义内容放入 data-g-tooltip-content，推荐用 g-tooltip-content 包装长文本。

## 行为与兼容

提示使用 role=tooltip，与触发器已有 aria-describedby 合并。聚焦打开不抢焦点；悬停移入提示可继续阅读。动态更新保留已有内容节点。生成的长文本滚动区域在溢出时进入 Tab 顺序，支持原生键盘滚动；作者自行提供的滚动内容应加 tabindex=0。提示内的可操作表单应使用 GPopover。

getInstance(element, 'tooltip') 提供 open / close / toggle / isOpen / reposition / destroy。发送现有 beforeopen、beforeclose、change、open、close 事件；关闭请求可取消。销毁取消延迟、观察器和监听器，恢复触发器说明及原始面板属性。

保留旧 overlay-* 属性与静态方位变体；options 明确指定的参数优先。旧用法的间距仍为 8px，统一 options 模式为 Arco 的 10px。未新增重复组件。

与 Arco 的区别：默认增加键盘 focus 触发；额外开放多触发器、延迟和边界参数；通过原生顶层保留框架节点归属，没有模拟 Arco 的 popupContainer 传送 API。Arco 的对象 / 数组形式 class 请在应用中转换为空格分隔字符串。
