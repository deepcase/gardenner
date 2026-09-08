# GCarousel 轮播

参考 [Arco Design Vue Carousel](https://arco.design/vue/component/carousel)。CSS、Vue、React、AngularJS、Blazor 共用 `mediaOptions` JSON 配置、媒体控制器和 CSS。Demo 提供 10 个场景；CSS 示例为 `packages/css/examples/carousel.html`，Blazor 示例路由为 `/carousel`。

## 配置

| 参数 | 默认值 | 行为 |
| --- | --- | --- |
| `kind` | 必填 `carousel` | 启用完整的受管轮播 |
| `items` | `[]` | `{id,src,alt?,title?,caption?,srcset?,sizes?}[]`，唯一 ID，最多 500 项；图片地址支持 HTTP(S)/blob |
| `current` / `defaultCurrent` | 未控制 / 1 | 从 1 开始的受控页码 / 初始页码，超出数据范围会截断 |
| `index` / `defaultValue.index` | 0 | 兼容旧版的初始零基索引；`defaultCurrent` 优先于 `index`，`defaultValue.index` 可覆盖初始值 |
| `autoPlay` | 未设置 | Arco 风格布尔值或 `{interval:3000,hoverToPause:true}` |
| `autoplay` / `interval` | false / 5000 | 兼容旧配置；显式 `autoPlay` 优先，间隔 1000–60000ms |
| `hoverToPause` | true | 鼠标悬停暂停；键盘焦点、页面隐藏和减少动态效果偏好也会暂停 |
| `animationName` | slide | `slide`、`fade`、`card` |
| `moveSpeed` | 500 | 过渡时长，0–10000ms |
| `transitionTimingFunction` | cubic-bezier(0.34, 0.69, 0.1, 1) | CSS 缓动函数 |
| `direction` | horizontal | `horizontal`、`vertical`；兼容 `ltr`、`rtl` 阅读方向 |
| `trigger` | click | 指示器 `click` 或 `hover`；键盘激活始终可用 |
| `showArrow` | always | `always`、`hover`、`never`；hover 在键盘焦点和触摸设备仍可见 |
| `arrowClass` / `indicatorClass` | 空 | 追加自定义类，不改变运行时选择器 |
| `indicatorType` | dot | `dot`、`line`、`slider`、`never` |
| `indicatorPosition` | bottom | `bottom`、`top`、`left`、`right`、`outer` |
| `loop` | true | 循环；关闭时首尾箭头禁用，自动播放到末项停止 |
| `keyboard` / `swipe` | true / true | 方向键、Home/End；指针滑动，过滤交叉方向滚动及取消手势 |
| `swipeThreshold` | 40 | 滑动门槛，10–300px |
| `thumbnails` / `thumbnailSize` | false / 76 | 缩略图导航；宽 32–200px，可横向滚动 |
| `ratio` / `height` / `maxHeight` | 16/9 / null / 560 | 比例或固定高度，随容器自适应 |
| `fit` | contain | cover、contain、fill、none、scale-down |
| `size` / `bordered` | medium / true | small、medium、large；统一 28/32/36px 工具栏尺寸 |
| `disabled` | false | 阻止导航、手势、自动播放和 API 值变更 |
| `showHeader` / `showCaption` / `showNavigation` / `showPagination` / `showRotation` / `showToolbar` / `showStatus` | true | 分别控制可选区域；`showNavigation:false` 和 `showPagination:false` 优先隐藏对应导航 |
| `title` / `description` / `labels` | 空 / 空 / 中文默认 | 标题说明、可访问名称和按钮文本；`labels.slide` 支持 `{index}` |
| `mode` | default | 兼容 default、fade、thumbnails、vertical、compact；fade/vertical 对应变体优先于动画/方向参数 |

## 五端接入

共享配置：

```js
const options = {
  kind: 'carousel', animationName: 'slide', indicatorType: 'dot',
  autoPlay: { interval: 3000, hoverToPause: true },
  items: [
    { id: 'one', src: '/images/one.jpg', alt: '山谷日出' },
    { id: 'two', src: '/images/two.jpg', alt: '海边日落' }
  ]
};
```

CSS：

```html
<div id="carousel" class="g-carousel" data-g-carousel data-g-media></div>
```

```js
import { init, getInstance } from '@gardenerim/css/runtime';
const root = document.getElementById('carousel');
root.dataset.gMediaOptions = JSON.stringify(options);
init(root);
getInstance(root, 'media').next();
```

Vue：`<GCarousel :config="{mediaOptions: JSON.stringify(options)}" @gardener:change="onChange" />`

React：`<GCarousel config={{mediaOptions: JSON.stringify(options)}} />`；通过组件 ref 的 DOM 元素监听原生 `gardener:change`，或使用框架事件接入。

AngularJS：`<div g-carousel gardener-config="config"></div>`，设置 `$scope.config={mediaOptions:JSON.stringify(options)}`。

Blazor：`<GCarousel Config="Config" EventNames="Events" OnEvent="Changed" />`，设置 `Config["mediaOptions"] = JsonSerializer.Serialize(options)`，`Events = ["gardener:change"]`。

TypeScript 配置类型为 `GardenerimMediaOptions`，从 `@gardenerim/css/runtime` 导入。

## 受控值与事件

`gardener:beforechange` 可取消。`gardener:change` 提供完整媒体 `value`、零基 `index/previousIndex`、一基 `current/previousCurrent`、`reason`、`isManual` 和 `controlled`。自动播放的 `isManual` 为 false。

提供 `current` 后，交互只发出新页码建议，由父组件更新配置。`data-g-media-value` 的完整媒体受控值优先于 `current`；二者请选择一个使用。`setOptions` 更新参数不重新创建控制器，`defaultCurrent` 只在首次挂载生效。

媒体实例提供 `go(index)`、`next()`、`previous()`、`start()`、`stop()`、`setOptions()`、`getState()`、`destroy()`。`go()` 和状态 `index` 继续使用零基索引。`stop()` 持续停止自动轮播，显式 `start()` 或切换自动播放配置可重新启动。离开键盘焦点或悬停后按间隔重新计时。

## 视觉与兼容边界

箭头基础直径 24px，点 6px，线 12×4px，滑块轨道总宽 48px、高 4px，活动段按项目数等分，过渡默认 500ms，参考 Arco 比例。触摸设备扩大交互控件；深浅主题沿用 Gardener 设计变量。减少动态效果偏好下关闭过渡和自动播放。非活动内容设置 `aria-hidden` 与 `inert`。

这是图片轮播；任意 VNode/JSX/RenderFragment 幻灯片不属于共享 JSON 图片配置。保留原有 authored `.g-carousel-slide` 静态结构及旧 `carousel` 控制器，但完整新增参数通过 `mediaOptions` 启用。加载错误提供真实失败状态和重试，不伪造媒体加载成功。不提供图片托管或自动下载外部图片。
