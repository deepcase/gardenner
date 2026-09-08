# 9 项逐项分析

原问题同时涉及组件尺寸、共享行为和演示接入，不能只调整演示容器缩放。现有九项专用场景保留，补充公共参数面板、Arco 实例对照和 Blazor 实例。

| 入口 | 根因判断 | 修复与可验证需求 |
| --- | --- | --- |
| Alert / GAlert | 组件内边距、标题/图标/关闭尺寸偏大；关闭交互缺少统一的受控协议 | 普通 padding 8×15、单行高 40；带标题 padding 15、标题 16/24、单行组合高 82；关闭图标 12；语义、标题、关闭、禁用、受控事件均可组合 |
| ProgressMeter / GProgressMeter | 默认厚度与圆环比例不一致；圆环起点偏移；数值、ARIA 和步骤需手工维护 | line small/medium/large 3/4/8；circle mini/small/medium/large 外框 16/48/64/80；圆环前景小/中/大 3/4/4，背景 2，分别与 Arco 对照；范围截断、缓冲、成功区间、步骤、未知进度统一同步 |
| SpinnerSkeleton / GSpinnerSkeleton | 默认圈和 tip 比例不一致；骨架空行被居中布局压到零宽；遮罩只阻挡鼠标 | 默认 Spin 图标框 20，实际绘制直径为框的 5/6、线宽为框的 1/12；tip 14/500、间隔 6；骨架形状 36/48/60、段落行高 20/间距 15；保留完整行宽；延迟加载、内容 inert、结束恢复、计时器清理 |
| EmptyState / GEmptyState | 默认最小高度、插图和描述间距超过 Arco；窄容器 inline 视觉占满整行 | 默认无强制最小高度、上下 padding 10、图标 48、自定义图片高 80、底部间隔 4、描述 14；保留 compact/card/full-page 等明确扩展，修复 inline 宽度 |
| Toast / GToast | 消息框行高/内边距/队列间距不一致；独立 init 关闭依赖全局事件；布尔 persistent 与清理不完整 | 消息框高 43、padding 10×16、图标 20、关闭 12、队列间距 16；独立关闭、持久消息、同 id 更新、操作一次回调、上限/清空、受控宿主 DOM 保留 |
| StatusBar / GStatusBar | 字号和内部控制比例不同；禁用/进度需重复业务代码 | 正文 14，紧凑 12，按钮沿用已校准基础按钮；进度与禁用由共享运行时同步；状态栏整体是 Gardener 扩展 |
| ContextBar / GContextBar | 与同类 Alert 的内边距、图标、标题比例不同；关闭与进度协议缺失 | 正文 14、图标 16、标题 16/24、带标题图标 18，padding 按 Alert；支持进度、禁用和可取消关闭事件 |
| PageLoading / GPageLoading | 默认指示器及说明尺寸偏大；遮罩未覆盖键盘交互 | 默认圈 20、小 16、大 32；简单等待组合按 Spin 的图标和 tip 对齐；可知进度、延迟显示、父容器内容 inert，结束恢复；页面布局变体继续可选 |
| PageStateSystem / GPageStateSystem | 默认页面留白和 Result 的视觉/标题比例不一致 | padding 32/32/24、状态图标 45、HTTP 图形 92、图标下距 16、标题 14/500、描述 14、操作上距 20；success/info/warning/error/403/404/500 均有对照 |

Blazor 另发现底层渲染缺陷：可选 value/config 属性使用累加序号，绑定从 null 变为关闭原因字符串时，ElementReferenceCapture 帧被错误匹配，导致服务端交互断开。改为固定源码位置序号，反馈 null→value、加载/禁用配置切换及原基础/41 个导航浏览器回归通过。

注意：Arco line 的 mini 是 16px 圆形；Gardener 的 line mini 2px 是保留扩展。骨架动画和 Toast 默认时长保留 Gardener 的现有行为。主题色、所有动画像素及全部 API 名称不在本次相同比例声明内。
