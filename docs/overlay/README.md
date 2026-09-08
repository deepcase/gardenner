# 浮层组件

六项：Dialog、Drawer、Popover、Tooltip、Popconfirm、ConfirmDialog。后两项复用既有 dialog / popover 运行时。

五端配置统一：CSS `data-g-overlay-*`，Vue / React `config`，AngularJS `gardener-config`，Blazor `Config`。布尔值 false 明确序列化，不再被省略。

| 参数 | 默认 / 值 | 用途 |
| --- | --- | --- |
| overlayControlled / overlayOpen | false / false | 受控时通过 gardener:change 的 detail.value 更新打开状态 |
| overlayWidth / overlayHeight | 组件默认尺寸 | 数字按 px；允许 CSS 长度 |
| overlayMaxHeight | 视口可用高度 | 正文独立滚动，数字按 px；允许 CSS 长度 |
| overlayDensity | default | compact / default / comfortable，内容内边距 12 / 16 / 24px |
| overlayShowClose | true | 显示对话框、抽屉右上角关闭按钮；不改变其他关闭策略 |
| overlayModal / overlayLockScroll | true（对话框、抽屉） | 背景 inert、焦点约束、滚动锁 |
| overlayKeyboard | true | Escape 仅关闭最上层 |
| overlayMaskClosable / overlayOutsideClosable | true | 遮罩 / 外部点击关闭 |
| overlayDisabled / overlayBusy | false | 禁止打开 / 异步处理中 |
| overlayAsync | false | 确认后等待实例 complete(success, error) |
| overlayTrigger | popover: click；tooltip: hover focus | click、hover、focus、manual、contextmenu，可组合 |
| overlayPlacement | bottom-start / top | top / bottom / left / right，各含 start / end |
| overlayOffset / overlayBoundary | 8 / 8 | 锚点间距 / 视口边缘间距 |
| overlayArrow | true | 浮动面板箭头 |
| overlayOpenDelay / overlayCloseDelay | 100 / 120 ms | hover 打开、离开延迟 |
| overlayRestoreFocus | true | 关闭后恢复来源焦点 |
| overlayAutofocus / overlayInitialFocus | 对话框 true；气泡 false，确认气泡 true / [autofocus] | 自动聚焦开关；对话框内初始焦点 CSS 选择器 |
| overlayTopLayer | true | 支持的浏览器使用原生 Popover 顶层，避免 transform / overflow 裁剪 |

共 6 个组件、28 个变体、26 项浮层配置。Dialog：small / medium / large / xl / centered / fullscreen / top；Drawer：small / medium / large / xl，配合 `data-g-side` 的 start / end / top / bottom；Popover：compact / wide；Tooltip：top / bottom / start / end / start-aligned / centered / end-aligned；Popconfirm：compact / wide / danger；ConfirmDialog：small / medium / large / danger / centered。显式 width 和 placement 优先于变体。数据与子内容由框架管理，更新浮层参数保留实例和编辑内容。触发、内容、标题、正文和操作区的完整结构见 [CSS 演示](../../packages/css/examples/overlay-compositions.html)。

关闭按钮的触摸目标至少 44px；正文 14px / 22px，对话框标题 16px / 24px，圆角 4px。密度只控制留白，宽度由变体或 overlayWidth 独立配置。最大高度受视口约束；超长正文滚动时标题和操作区保留。

异步确认：监听 gardener:action，detail.action 为 confirm / cancel；启用 overlayAsync 后确认按钮进入忙碌状态，执行实例 complete(true) 关闭，或 complete(false, '失败说明') 保留内容供重试。beforeopen / beforeclose 可同步取消。卸载或关闭父浮层时回收嵌套层、焦点任务、滚动锁和原本由运行时设置的 inert 状态。

`gardener:action` 的同步取消也会撤销本次忙碌状态。同步调用 complete() 与异步完成遵守同一协议；确认服务和业务超时由宿主处理。移除 overlayBusy 可解除外部忙碌状态，修改宽度等外观不会中断本次操作。动态禁用会关闭已打开的浮层并发出 reason=disabled 的 change，受控父组件应同步状态。Tooltip 的 hover + focus 组合保留键盘焦点对应的提示。销毁恢复原有角色、ARIA 关联、tabindex 和内联样式。

五端同一个配置示例（CSS 将键名转成 `data-g-overlay-*`；其余传 config / gardener-config / Config）：

```js
const options = {
  overlayControlled: true, overlayOpen: false,
  overlayWidth: 520, overlayHeight: '60vh', overlayMaxHeight: '75vh',
  overlayDensity: 'compact', overlayShowClose: true,
  overlayKeyboard: true, overlayMaskClosable: false,
  overlayAsync: true, overlayRestoreFocus: true
};
```

GardenerDemo 六项均提供真实表单、受控状态、尺寸、位置、嵌套、长内容及异步失败重试演示。旧浏览器不支持原生 Popover 顶层时采用固定定位回退；复杂裁剪祖先建议在应用的根层挂载。
