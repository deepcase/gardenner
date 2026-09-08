# GImage 图片

参考 [Arco Design Vue Image](https://arco.design/vue/component/image)，提供图片加载、说明、原图预览及图片组。新增 GImage；原 GResponsiveImage 和 GGalleryLightbox 保持兼容。

## 演示

- [GardenerDemo](http://127.0.0.1:4180/?component=image#catalog)：11 组场景，包含参数实验、备用资源、错误恢复、受控预览和自定义工具。
- [CSS 独立示例](../packages/css/examples/image.html)
- Blazor 示例路由：/image。

## 参数

五端使用相同 JSON media-options（DOM 为 data-g-media-options）。TypeScript 类型为 GardenerimImageOptions、GardenerimImagePreviewOptions，从 @gardenerim/css/runtime 导入。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| src / alt | 空字符串 | 图片地址与替代文本；业务应提供有意义的 alt，装饰图可留空 |
| width / height | 自动 | 正数像素或 px、%、rem、em、vw、vh、auto；最大数字尺寸 10000 |
| fit | fill | fill、contain、cover、none、scale-down |
| title / description | 无 | 说明标题及正文，按文本渲染 |
| footerPosition | inner | inner 渐变遮罩，outer 外部说明 |
| hideFooter | false | false 加载成功后显示；true 隐藏；never 加载/错误期间也显示 |
| footerClass | 无 | 额外说明容器类名 |
| preview / disabled | true / false | 允许预览 / 禁止交互；改变后关闭已打开预览 |
| previewVisible | 未设置 | 受控开关；必须由宿主回写 change 的 visible |
| defaultPreviewVisible | false | 初始非受控开关 |
| showLoader | false | 加载期间显示指示器 |
| fallback | 无 | 主图失败后尝试一次备用图片；再次失败显示错误与重试 |
| lazy | false | 原生 loading=lazy；不伪造加载完成 |
| srcset / sizes | 无 | srcset 为 [{src,descriptor:'1x'}]，也支持宽度描述符；不能混入脚本地址 |
| crossOrigin | 未设置 | anonymous / use-credentials |
| bordered | false | 显示边框 |
| items | [] | 预览图片组，最多 500 项；每项 src、id、alt、title、caption，id 必须唯一 |
| zoomMin / zoomMax | 0.1 / 10 | 缩放边界，允许范围 0.05–20 |
| download / filename | false / 无 | 下载开关与文件名；浏览器可能限制跨域 download |
| extraTemplate / loaderTemplate / errorTemplate | 无 | 当前文档原生 template 元素 ID；内容克隆后初始化 Gardener 控件，移除时销毁 |
| labels | 内置英文 | open、close、previous、next、loading、error、retry、zoomIn、zoomOut、rotateLeft、rotateRight、flipX、flipY、reset、originalSize、download、fullScreen 文案 |

变体 default、square、circle、cover、contain，分别提供默认、正方形、圆形及图片适配样式。显式 fit 参数优先。

### previewProps

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| src | 当前缩略图 | 独立高清原图地址；有 items 时使用图片组 |
| current / defaultCurrent | 未设置 / 0 | 图片组受控 / 初始索引，**从 0 开始** |
| infinite | true | 图片组首尾循环 |
| maskClosable / closable / escToClose | true | 遮罩关闭、关闭按钮、Escape 关闭 |
| keyboard / wheelZoom | true | 方向键与加减号 / 滚轮缩放 |
| defaultScale / zoomRate | 1 / 1.2 | 初始缩放、缩放倍率（大于 1，最大 3） |
| actionsLayout | 标准工具 | zoomIn、zoomOut、rotateLeft、rotateRight、flipX、flipY、reset；可添加 originalSize、download、fullScreen 或传 [] 隐藏工具 |

预览使用原生 dialog 顶层，支持焦点约束、关闭后恢复焦点、滚动锁和多预览锁计数；拖动不会触发遮罩关闭。旋转后重新适配显示区域。减少动态效果偏好下停止加载动画。

## 五端接入

共享 options 示例：

```js
const options = {src:'/media-assets/mountain.svg',alt:'山间风景',width:240,height:150,fit:'cover',title:'山间漫步',footerPosition:'outer',showLoader:true};
```

CSS：

```js
import {init,getInstance} from '@gardenerim/css/runtime';
const el=document.querySelector('.g-image'); // <div class="g-image" data-g-media></div>
el.dataset.gMediaOptions=JSON.stringify(options);
init(el);
const image=getInstance(el,'media');
image.setOptions({fit:'contain'});
image.open(); image.close(); image.go(0);
```

Vue：`<GImage :config="{'media-options': JSON.stringify(options)}" />`

React：`<GImage config={{'media-options': JSON.stringify(options)}} />`

AngularJS：`<div g-image gardener-config="config"></div>`，控制器设置 `$scope.config={'media-options':JSON.stringify(options)}`。

Blazor：`<GImage Config="Config" />`，Config 使用 `IReadOnlyDictionary<string,object?>`，键 media-options、值 JsonSerializer.Serialize(options)。完整交互示例见 ImageLab.razor。

## 状态与事件

getState() 返回 index、open、zoom、rotation、flipX、flipY、x、y、loaded、error。setValue(partial)、next()、previous()、retry()、destroy() 可通过 getInstance 获取的实例调用。

- gardener:beforechange 可 preventDefault() 取消；detail 含 reason、value、previousValue、controlled。
- gardener:change 提交状态或提出受控修改；detail 含 component:'image'、reason、value、visible、index、controlled。受控 previewVisible 回写 visible；受控 previewProps.current 回写 index。
- data-g-media-value 可受控管理完整状态；宿主应回写 detail.value，未回写时不改变受控字段。
- gardener:complete 的 action:'load' 只在真实图片加载成功后触发，含 src、fallback、naturalWidth、naturalHeight。
- gardener:error 区分 load、preview、configuration、fullscreen；配置校验失败保留上一次有效内容。

## 兼容边界

这是 Gardener 原生共享实现，并非 Arco Vue 插槽 API 的直接替身。预览使用 dialog 顶层，不提供 popupContainer 或 renderToBody；图片组通过 items 声明，不做跨根组件注册。模板是原生 DOM 模板，不是框架插槽，说明/状态刷新可能重建模板内容，表单值应由业务保存。无需配置外部网络服务；图片地址、资源可用性由业务提供。

设计尺寸参考 Arco：图片圆角 2px、说明标题 16px、正文 14px、外部说明间距 4px、加载标记 32px。内部说明使用更深的渐变以保障文字对比度。
