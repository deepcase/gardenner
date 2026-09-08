# 五框架反馈参数

五端共用同一 CSS 和运行时。Vue/React 通过 config 对象、AngularJS 通过 gardener-config 表达式、Blazor 通过 Config 字典映射到相同 data-g-* 属性；纯 CSS 用相同 DOM 类与属性，交互需引入 @gardenerim/css 的 init(root)。initialize=false 表示只输出样式，应用自行初始化。

## 公共参数

| config 键 | DOM 属性 | 默认与语义 |
| --- | --- | --- |
| feedbackValue | data-g-feedback-value | 提供后开启进度同步；有限数值截断到范围内；视觉与 ARIA 同步 |
| feedbackMin / feedbackMax | data-g-feedback-min / max | 0 / 100；max 小于 min 时归一为 min；零区间显示 0% |
| feedbackBuffer | data-g-feedback-buffer | 缓冲范围截断，不能小于当前进度 |
| feedbackSuccess | data-g-feedback-success | 成功范围截断，不能超过当前进度 |
| feedback | data-g-feedback | true 开启 Spinner/PageLoading 的受控加载协议；同时显式传加载布尔值 |
| feedbackLoading | data-g-feedback-loading | false；true 时立即 aria-busy 且内容 inert |
| feedbackDelay | data-g-feedback-delay | 0 毫秒；仅延迟视觉显示，快速完成会取消计时器 |
| feedbackControlled | data-g-feedback-controlled | false；true 时关闭仅通知框架，不隐藏或移除其 DOM |

variant/variants 决定形态、尺寸；state/states 决定语义、disabled 和 indeterminate。进度文字可放在空的 data-g-feedback-value-text 节点，由运行时填入百分比；其他模板内容由框架负责。未知进度不提供 aria-valuenow，自动文字显示省略号。

## 五端同一进度示例

Vue：
~~~vue
<GProgressMeter :variant="['line', 'small']" aria-label="任务进度"
  :config="{ feedbackValue: value, feedbackMin: 0, feedbackMax: 100 }">
  <span class="g-progress-bar" />
</GProgressMeter>
~~~

React：
~~~tsx
<GProgressMeter variant={['line', 'small']} aria-label="任务进度"
  config={{ feedbackValue: value, feedbackMin: 0, feedbackMax: 100 }}>
  <span className="g-progress-bar" />
</GProgressMeter>
~~~

AngularJS：
~~~html
<div g-progress-meter gardener-variant="line small" aria-label="任务进度"
  gardener-config="{ feedbackValue: value, feedbackMin: 0, feedbackMax: 100 }">
  <span class="g-progress-bar"></span>
</div>
~~~

Blazor：
~~~razor
<GProgressMeter Variants="@(new[] { "line", "small" })" aria-label="任务进度"
  Config="@(new Dictionary<string, object?> {
    ["feedbackValue"] = value, ["feedbackMin"] = 0, ["feedbackMax"] = 100 })">
  <span class="g-progress-bar"></span>
</GProgressMeter>
~~~

CSS/JavaScript：
~~~html
<div class="g-progress g-progress-line g-progress-small" aria-label="任务进度"
  data-g-feedback-value="60" data-g-feedback-min="0" data-g-feedback-max="100">
  <span class="g-progress-bar"></span>
</div>
~~~
~~~js
import { init } from '@gardenerim/css';
init(root);
root.querySelector('.g-progress').dataset.gFeedbackValue = '75';
~~~

圆形改成 circle，并使用 g-progress-text 子节点；步骤改成 steps，放置多个 g-progress-step；仪表盘 dashboard 是额外扩展。小/中/大 line 厚度 3/4/8，circle 外框 48/64/80；mini circle 16，line mini 2 是 Gardener 扩展。可用 CSS 自定义属性 --g-progress-size、--g-progress-thickness 调整业务尺寸。

## 关闭与框架状态

关闭按钮带 data-g-feedback-dismiss（兼容 data-g-dismiss），发出可取消 gardener:dismiss，detail.reason 为 button。禁止关闭可取消事件；需要框架移除时传 feedbackControlled:true，并在回调修改 visible，由框架条件渲染。

| 框架 | 关闭原因值绑定 |
| --- | --- |
| Vue | v-model="reason"，model-event="dismiss"，model-key="reason"，@update:model-value 修改 visible |
| React | valueEvent="dismiss"，valueKey="reason"，onValueChange 接收 reason 并修改 visible |
| AngularJS | ng-model="reason"，gardener-value-event="dismiss"，gardener-value-key="reason"；监视 reason 或使用事件回调修改 visible |
| Blazor | @bind-Value="Reason"，ValueEvent="dismiss"，ValueKey="reason"；ValueChanged/OnValueChange 更新界面 |
| CSS/JS | addEventListener('gardener:dismiss', handler)；event.preventDefault() 阻止默认关闭 |

默认普通反馈关闭使用 hidden，保留框架子节点；Toast 默认会移除消息。**框架条件渲染的 GToast 应传 feedbackControlled:true，由宿主决定移除。** 服务 toast() 创建的消息由服务管理，支持 id 更新、position、timeout、persistent、maxCount、closable、actionLabel、onAction、onClose 和 toast.clear()。timeout=0 或 persistent=true 持续显示；空布尔属性也有效。示例面板可切换时长、位置、队列上限和相同 id 更新。

## 加载、空状态与页面组合

Spinner overlay 的内容放在 g-spinner-content，传 { feedback:true, feedbackLoading:loading, feedbackDelay:300 }。PageLoading 使用 g-page-loading-host 包围 g-page-loading-container 与 GPageLoading，宿主内容在加载时被设置 inert。取消操作放在被阻断内容区域之外。销毁时恢复原 inert、按钮状态和定时器；加载期间 aria-busy 立即为 true。

Spin 默认 20；--g-spinner-size 可传业务数值。Skeleton 的 --g-skeleton-line-height 默认 20px、--g-skeleton-line-spacing 默认 15px；形状 small/medium/large 为 36/48/60。active/static 控制骨架动画；默认动画保留现有 Gardener 行为。

Empty 可按 simple/compact/card/inline/full-page/no-image 组合，图片、描述、操作由模板提供。Result 的 success/info/warning/error 图标 45，403/404/500 图形 92，操作按钮由模板提供。ContextBar/StatusBar 使用相同进度 config 与 disabled 状态，应用负责实际任务和重试动作。
