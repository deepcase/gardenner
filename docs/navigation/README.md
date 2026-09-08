# 导航组件发布复查

本轮覆盖导航分类全部 41 个组件、174 个命名变体和 123 个场景。命名变体数量来自现有目录；没有独立命名变体的组件仍支持公共尺寸、外观与显示参数组合。

## 五端接口

CSS 使用 createNavigation(host, { component, ...options })；Vue 使用 navigation 对象与 v-model；React 使用 navigation 与 value/onValueChange；AngularJS 使用 gardener-navigation 与 ngModel；Blazor 使用 GardenerimNavigationOptions、Navigation 与 Value/ValueChanged。五端调用同一个 navigation.js，Blazor 打包相同 CSS 和运行时文件。

选项包含 items（唯一 id、label、href、icon、badge、description、shortcut、group、children、disabled、hidden、checked、closable、content）、actions、value/defaultValue、size、appearance、orientation、variant、state、disabled、loading、activation、loop、open/defaultOpen、collapsed、expandedKeys、searchable、pageSize、pageSizes、total、滚动目标与偏移等。组件专属参数见 [逐项矩阵](component-matrix.md)。

## 新增参数

| 参数 | 类型 | 默认值 | 作用 / 单位 |
| --- | --- | --- | --- |
| showIcons | boolean | true | 显示图标 |
| showBadges | boolean | true | 显示徽标 |
| showDescriptions | boolean | true | 显示说明 |
| showShortcuts | boolean | true | 显示快捷键 |
| showGroups | boolean | true | 显示分组 |
| showHeader | boolean | true | 显示标题 |
| showActions | boolean | true | 显示附加操作 |
| showPanel | boolean | true | 显示内容面板 |
| bordered | boolean | true | 显示边框 |
| maxHeight | number | 0 | 最大高度，0–5000 px |
| popupWidth | number | 360 | 弹出宽度，160–1600 px |
| popupMaxHeight | number | 480 | 弹出最大高度，120–1600 px |
| itemGap | number | 8 | 条目间距，0–48 px |
| indent | number | 16 | 层级缩进，0–64 px |
| selectionTimeout | number | 30000 | 校验超时，0–300000 ms |
| closeOnEscape | boolean | true | Escape 关闭 |
| closeOnOutside | boolean | true | 外部点击关闭 |

maxHeight=0 不限制根容器高度；selectionTimeout=0 关闭超时。弹出参数仅影响菜单、命令面板和抽屉；showPanel 影响标签页与步骤正文；showHeader 保留模态标题的无障碍关联；indent 影响树与子级导航。关闭选项影响弹出导航。隐藏标签、徽标或说明不会删除条目的可访问名称。

size 优先于 compact / spacious 等预设；appearance 和 orientation 也优先于相应命名变体。省略显式参数后恢复变体预设。小、中、大常规条目最小高度为 28/32/36px，正文 14px/22px、圆角4px；触摸设备操作目标至少44px。长文案可换行，因此高度是下限。

## 交互与生命周期

beforeChange(change, signal) 可返回 boolean 或 Promise<boolean>。false 拒绝切换；抛错或超时触发 navigationerror。controller.cancel()、销毁、禁用、替换数据或受控值变化会使等待中的结果失效；不响应 AbortSignal 的回调也不会产生过期选中事件。回调应使用 signal 取消自己的网络请求。Blazor 使用 BeforeNavigationChange；JS 侧取消会忽略迟到结果，应用自身的服务请求取消由业务层负责。

Vue / React 组件引用通过 getInstance('navigation') 获取共享控制器；AngularJS 通过元素的 $gardenerHandle；Blazor Runtime.InvokeBehaviorAsync(element, "navigation", "cancel", ...) 调用控制器。原生 dialog 提供模态背景隔离；弹出菜单使用原生 popover 并限制在视口范围；Escape、外部点击、焦点恢复与滚动锁由同一运行时协调。

更新保留输入 DOM、焦点与选区，支持中文输入法组合输入。页容量切换先执行选择校验，再发出容量变更；步骤前后移动跳过禁用项。非法选项、重复 id、危险 URL 会在修改 DOM 前拒绝。导航地址支持相对路径、片段、http/https/mailto/tel；业务路由通过选择事件接入。

## 演示与验证

- [CSS 参数实验室](../../packages/css/examples/navigation-lab.html)：41 个组件、123 场景、174 变体与17新增参数。
- GardenerDemo：选择导航分类；每个组件有3个真实场景、变体/尺寸/外观/方向、空数据/禁用/加载/RTL和异步校验切换。
- Blazor 示例：/navigation/{component}，支持场景、变体、方向、外观和新增参数。桌面和窄屏使用相同样式。
- [验证结果](verification.md) 与 [逐项清单](component-matrix.md)。

这些是界面组件，不包含真实登录、路由服务或数据后端。没有发布 npm/NuGet 包；本次验证针对当前工作区中的导航改动。
