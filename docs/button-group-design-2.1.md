# Gardenerim 2.1 Button Group 设计与验收

## 结论

旧版独立演示页确实有错误：通用展示器只渲染了一个“默认”占位项，无法体现组合按钮。组件本身也只完成了横向拼接、类型、尺寸、形状、状态和禁用外观，距离完整设计还缺少纵向、等宽、分裂按钮、切换组、工具栏和明确的无障碍语义。

本轮采用四类清晰模型：

1. 普通组合：相关且相互独立的同级命令。
2. 分裂按钮：左侧执行默认动作，右侧打开更多同类动作。
3. 工具栏：多个高频控件或按钮组组成的快捷操作区。
4. 切换组：每个按钮保存独立的开/关状态。

只能选择一个值时，不使用 Button Group 冒充选择控件，应使用 Segmented 或 Radio Group。

## 主流框架对照

| 能力 | Arco Design Vue | Ant Design | Element Plus | Bootstrap | Gardenerim 2.1 |
| --- | --- | --- | --- | --- | --- |
| 横向相邻操作 | 有 | Space.Compact | 有 | 有 | 有 |
| 类型 / 状态 / 尺寸 | 有 | 尺寸 + 子组件类型 | 有 | 有 | 有 |
| 纵向组合 | 未作为 Button Group 重点展示 | 有 | 有 | 有 | 已补齐 |
| 等宽占满 | 长按钮为单按钮能力 | Compact block | 需布局组合 | 可借助布局工具 | 已补齐 `block / justified` |
| 分裂按钮 | 视觉组合示例 | Dropdown 负责 | Dropdown `split-button` | 可嵌套 Dropdown | 已补齐结构与语义，菜单仍由 Dropdown 负责 |
| 切换按钮 | 非重点 | 其他选择组件 | 非重点 | Checkbox / Radio 示例 | 已补齐独立 toggle；单选仍交给 Segmented / Radio |
| 工具栏 | 非重点 | Space / Flex 组合 | 非重点 | 完整示例 | 已补齐布局与键盘示例 |
| 可访问命名 | 示例未突出 | 原生属性透传 | 原生属性透传 | 明确要求 | 已写入元数据和全部演示 |

参考来源：[Arco Design Vue Button](https://arco.design/vue/component/button)、[Ant Design Space.Compact](https://ant.design/components/space/)、[Ant Design Dropdown](https://ant.design/components/dropdown/)、[Element Plus Button Group](https://element-plus.org/en-US/component/button.html)、[Element Plus split-button](https://element-plus.org/en-US/component/dropdown.html)、[Bootstrap Button group](https://getbootstrap.com/docs/5.3/components/button-group/)、[WAI-ARIA Toolbar Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)、[WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)。

## 新增能力

- `vertical`：垂直排列，重新计算上下接缝和首尾圆角。
- `block` / `justified`：容器占满可用宽度，子按钮等宽。
- `split`：主操作自适应，菜单触发区固定为当前按钮高度的正方形。
- `toggle`：支持 `[aria-pressed="true"]`、`.is-active`、`.is-selected` 的一致选中外观。
- `.g-btn-toolbar`：多个按钮组可响应式换行；`.g-btn-toolbar-spread` 支持两端布局。
- 分裂按钮部件：`.g-btn-group-primary-action`、`.g-btn-group-trigger`。
- 组级可访问契约：`group / toolbar` 角色，以及 label、orientation、pressed、haspopup、expanded 属性。
- 接缝细节：相邻边框折叠、焦点和按下状态层级、主色组内部弱分隔线、RTL 逻辑属性、紧凑尺寸的触摸高度保护。

## 使用边界

- `split` 不创建菜单，也不管理展开状态；它负责组合布局，Dropdown / Menu 负责弹层与交互。
- `.g-btn-toolbar` 只有在三个以上控件构成真正工具栏时才应使用 `role="toolbar"`；使用该角色时要实现方向键导航。
- `toggle` 的按钮文本应保持不变，用 `aria-pressed` 表达状态。
- 普通组合默认不换行。窄屏需要换行时，把多个小组放入 toolbar，而不是破坏一个组的接缝。
- 组级 `state="disabled"` 提供整体外观，实际按钮仍应设置原生 `disabled`，从根源上阻止事件和键盘激活。

## 四框架一致性

Vue、React、AngularJS 与 Blazor 均由同一份组件元数据生成，因此新增 variant、parts 和 accessibility 信息保持一致。原生 `role`、`aria-*`、`disabled`、`tabindex` 继续通过各框架的原生属性机制传入，不增加私有交互协议。

## 验收结果

| 检查项 | 结果 |
| --- | --- |
| CSS 构建与 42 项产物预算 | 通过 |
| 元数据 JSON Schema | 48 / 48 通过 |
| Vue / React / AngularJS 生成与运行时契约 | 通过；各 506 个组件保持一致 |
| Blazor 生成、Schema、文档、静态资源与预算 | 通过；本机没有 .NET SDK，因此未重复执行程序集编译 |
| HTML 结构 | 24 / 24 通过 |
| 桌面 Chromium + WebKit | 62 / 62 通过 |
| 桌面 Firefox | 31 / 31 通过 |
| 移动 Chromium + WebKit | 52 / 52 通过 |
| Axe / 键盘 / RTL / 42 主题对比度 | 26 / 26 通过 |
| Vue 演示项目类型检查与生产构建 | 通过 |
| 浏览器实测 | 分裂触发区 32×32；主色文字白色；纵向圆角、三列等宽、toggle pressed、toolbar roving tabindex 均正确 |

## 置信度

- **高**：独立演示页的根因、CSS 接缝与布局、Vue/React/AngularJS 契约、ARIA 属性透传；均有代码、自动化测试和真实浏览器 DOM/计算样式证据。
- **高**：主流框架能力对照；结论只采用各框架当前官方文档和 WAI-ARIA APG。
- **中高**：Blazor API/元数据/静态资源一致性；生成、检查和预算已经通过，但受本机缺少 .NET SDK 限制，本轮没有执行 CLR 编译与运行时测试。
