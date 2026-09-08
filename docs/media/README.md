# 媒体组件

发布复查覆盖全部 8 个组件、34 个变体，新增 18 项可配置参数并完善播放、裁剪与受控状态边界。音频通过 media-player 的 type / mode 提供；内容分类已经有音视频组合、PDF 和图片编辑组合，不重复创建同类外壳。

## 五端接入

CSS 使用 data-g-media 和 data-g-media-options。Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 mediaOptions、mediaValue、mediaSize、mediaBordered、mediaDisabled。Options 和 Value 为 JSON 字符串，显式 false 保留。提供 mediaOptions 才启用数据模式，既有静态类与手工 DOM 用法继续可用。数据模式由运行时管理子节点，不要同时使用插槽管理相同子树；销毁恢复原有节点。

完整样式已包含媒体扩展。按需使用 core.css + component/extended.css 以及 runtime。五端加载同一份 CSS 和 media.js。

~~~js
const config = {
 mediaOptions: JSON.stringify({kind:'carousel',loop:false,mode:'thumbnails',
   items:[{id:'cover',src:'/images/cover.jpg',alt:'项目封面'}]}),
 mediaValue: JSON.stringify({index:0}), mediaDisabled:false
};
// Vue: <GCarousel :config="config" @update:model-value="writeBack" />
// React: <GCarousel config={config} onValueChange={writeBack} />
// AngularJS: <div g-carousel gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GCarousel Config="Config" ValueChanged="WriteBack" />
function writeBack(value) { config.mediaValue = JSON.stringify(value); }
~~~

## 参数

| 参数 | 默认 / 范围 | 行为 |
| --- | --- | --- |
| kind / mode | kind 必需；首个变体 | 组件类型与下表变体；显式 mode 优先于旧类名；显式 size / fit / ratio 优先于变体默认值 |
| title / description / caption / alt | 空 | 标题、说明、图片说明和替代文本 |
| items | []，最多 500 项 | 唯一 id，src、title、alt、caption、srcset、sizes；支持相对地址、http、https、blob |
| src / sources / poster / tracks | 空 | 原生音视频主地址或候选格式、封面与字幕；tracks 包含 src、kind、srclang、label、default |
| srcset / sizes | 空 | srcset 为 [{src,descriptor:'640w'}]，sizes 为浏览器响应式资源条件 |
| crossOrigin | 不设置 | anonymous / use-credentials；跨域裁剪需要资源服务器许可 |
| size / bordered | medium / true | small、medium、large：12 / 14 / 14px 正文、16px 标题，28 / 32 / 36px 控件，12 / 16 / 20px 内距；粗指针控件至少 44px |
| direction / columns / ratio / fit | 继承 / 3 / 16:9 / contain | ltr、rtl；列数、容器比例和图片适配；fit 支持 cover、contain、fill、none、scale-down |
| loop / autoplay / interval | true / false / 5000ms | 轮播循环与定时播放，间隔 1000–60000ms；页面隐藏、鼠标悬停、焦点进入、减弱动画偏好时暂停；不自动播放音视频 |
| keyboard / controls / thumbnails | true / true / false | 键盘、原生播放控件及轮播 / 文档缩略导航 |
| disabled / readonly | false | disabled 禁止用户操作并暂停播放；readonly 禁止裁剪和对比编辑 |
| download / filename / lazy | true / 空 / true | 原图或文档下载链接、文件名与图片延迟加载 |
| preload / volume / muted / playbackRate | metadata / 1 / false / 1 | 音视频预加载、0–1 音量、静音与 0.25–4 倍速 |
| type / pages / pageCount | 视组件 / [] / 1 | audio、video、pages 或 pdf；内置文档提供 Markdown 字符串数组；PDF 页数由应用提供 |
| zoomMin / zoomMax | 0.5 / 3 | 图片灯箱及文档缩放范围 |
| step / cropRatio | 5 / 自由比例 | 裁剪键盘步长；square、wide 变体为 1:1、16:9；cropRatio 可自定义 |
| outputType / quality / maxPixels | image/png / 0.92 / 16777216 | PNG、JPEG、WebP，导出质量及最大像素数，超限按比例缩小 |
| showHeader / showStatus / showCaption | true | 标题说明、状态提示与图片说明；隐藏状态仍保留辅助技术播报 |
| showNavigation / showPagination / showRotation | true | 前后导航、轮播分页入口、自动轮播开关 |
| showToolbar / showZoom | true | 隐藏页面工具栏/播放器字段，或只隐藏缩放；灯箱保留退出和导航能力 |
| showPlaylist / showCropFields | true | 播放列表选择、裁剪数值字段；隐藏字段仍可拖拽或键盘裁剪 |
| height / maxHeight | null / 560 | 轮播、响应式图片、双图对比与视频视区高度，80–1600px；高度上限也用于灯箱，裁剪保留原图比例 |
| thumbnailSize / documentHeight | 76 / 520 | 缩略图宽度 32–200px；文档视区 160–1600px，长内容内部滚动 |
| playbackRates / playTimeout | [0.5,1,1.5,2] / 15000 | 1–20 个 0.25–4 倍速；播放等待 1–300000ms，超时可重试 |
| autoAdvance / fullscreen | false / true | 播放结束时切换下一曲；全屏入口开关，实际能力由浏览器提供 |
| index | 0 | 非负整数初始图片/播放列表索引，defaultValue.index 优先 |
| labels / defaultValue | 中文词典 / 空 | 覆盖界面文本和非受控初始状态 |

## 状态、事件和真实媒体

mediaValue 控制 index、open、page、zoom、position 和 crop（x、y、width、height 为图片百分比）。未知状态键会被忽略，非法裁剪/数值更新原子拒绝。提供该属性后 change 提议完整下一状态，应用负责回写；beforechange 可取消。播放状态来自 HTMLMediaElement，使用 getPlaybackState 获取 playing、currentTime、duration、volume、muted、playbackRate，通过 action 的 playback 通知观察；不会用定时器伪造进度，也不把未成功的 play() 标记成播放成功。

实例 getInstance(root,'media') 提供 refresh、setOptions、setValue、getState、getPlaybackState、go、next、previous、open、close、start、stop、play、pause、seek、exportCrop、retry、destroy。媒体 DOM 在参数及状态刷新时保留，调整尺寸不会重置播放进度。销毁和切换资源会暂停旧媒体，已取消的 play() 不会恢复旧视频。重复等待中的 play() 返回 false；失败和超时释放等待状态，pause、资源切换及 destroy 立即取消。初始倍速与控件同步，自定义倍速列表保留当前速率。autoAdvance 在受控模式只提出下一索引，由宿主回写并决定是否播放。

裁剪可拖动建立区域，用四个滑杆精确设置；焦点位于裁剪框时，方向键移动、Shift + 方向键调整尺寸。exportCrop 返回 Blob 或 false，并通过 complete 提供 Blob、实际像素宽高和裁剪区域；调用方决定下载或上传。演示提供真实结果预览与下载，文件扩展名跟随 PNG / JPEG / WebP。编辑裁剪区域、切换资源或导出参数会取消旧导出；仅调整标题、尺寸和展示开关保留导出。

~~~js
const media = getInstance(root,'media');
const blob = await media.exportCrop();
if (blob) { /* 由业务应用保存或上传；组件不自动发送文件 */ }
~~~

PDF 使用浏览器内置阅读器；浏览器是否支持嵌入、页码 / 缩放片段、打印和搜索取决于阅读器实现，同时提供独立打开和下载入口。需要完全自定义 PDF 渲染时，可由应用转换为 pages。跨域图片没有 CORS 授权时 Canvas 导出会返回明确错误；不绕过浏览器限制。

## 逐项清单

| 组件 | 变体 | 检查与修复 |
| --- | --- | --- |
| carousel | default、fade、thumbnails、vertical、compact | 原有轮播仅有基础导航。补齐非循环边界、自动轮播暂停、键盘、缩略图、方向与受控索引。 |
| gallery-lightbox | grid、compact、masonry、strip | 原先仅有画廊样式。补齐真实模态灯箱、焦点返回、Escape、缩放、下载和加载失败重试。 |
| media-player | video、audio、playlist、compact | 原先仅有播放器外壳。补齐真实 audio/video、多源、字幕、进度、音量、倍速、播放失败与播放列表。 |
| document-viewer | default、thumbnails、continuous、compact | 原先主要是静态布局。补齐内置 Markdown 文档分页、缩放、连续阅读、页导航与浏览器 PDF 嵌入。 |
| image-crop-shell | default、square、wide、compact | 原先只有裁剪框样式。补齐百分比区域、拖拽与键盘、固定比例、只读、真实 Canvas 导出和像素上限。 |
| responsive-image | default、square、circle、cover、contain | 新增独立图片组件，集中处理 srcset、sizes、适配比例、延迟加载、加载提示和失败重试。 |
| image-comparison | horizontal、vertical、compact | 新增双图对比组件，提供横向 / 纵向裁切、原生范围控制、键盘、只读及受控位置。 |

## 演示与验证

- [GardenerDemo 媒体目录](http://127.0.0.1:4180/?component=media#catalog)
- [CSS 完整演示](../../packages/css/examples/media-lab.html)
- Blazor 示例 /media 使用真实 Razor 组件与受控回写。
- [验证记录](verification.md)，[五端资源一致性](parity.json)。


### GCarousel · Arco reference

The carousel now supports slide/fade/card transitions, controlled current, autoplay, configurable indicators, vertical/RTL navigation and touch gestures. See [full parameters and five-framework examples](../carousel.md) and the [interactive carousel demo](../../packages/css/examples/carousel.html).

## GImage 图片扩展

新增独立图片加载、备用图片、原图缩放旋转与分组预览，支持 5 个变体。参数及兼容边界见 [GImage](../image.md)。GResponsiveImage 与 GGalleryLightbox 保持原有接口。
