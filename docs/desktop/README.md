# 桌面端组件

桌面端从 35 个组件完善为 38 个组件、152 种变体。新增应用偏好设置、工作区会话管理、问题诊断面板。文件浏览、终端和快捷键清单已存在，继续复用其组件边界。

| 组件 | 变体 | 完善内容 |
| --- | --- | --- |
| 桌面应用框架 · desktop-shell | standard / compact / focus / studio | 工作区容器、文档、侧栏和底部区域开关 |
| 标题栏 · desktop-titlebar | windows / macos / compact / centered | 平台外观、窗口最小化/最大化/还原/关闭的宿主请求 |
| 工作台 · desktop-workbench | editor / split / focus / compact | 编辑/分割/专注布局与文档状态 |
| 原生标题栏 · desktop-native-titlebar | windows / macos / compact / centered | 平台外观和显式原生宿主接口 |
| 窗口控制 · desktop-window-controls-composition | windows / macos / compact / vertical | 窗口控制及禁用能力 |
| 桌面菜单栏 · desktop-menubar-composition | standard / compact / icons / overflow | 分组菜单、键盘方向导航、禁用命令与取消 |
| 活动栏 · desktop-activity-bar-composition | rail / horizontal / compact / labels | 活动选择、横向/轨道布局、命令请求 |
| 停靠面板 · desktop-dock-panel | left / right / floating / compact | 停靠位置、浮动、折叠及内容区域 |
| 分割面板 · desktop-split-pane | horizontal / vertical / balanced / compact | 鼠标/触摸拖动、键盘调整、RTL、方向和最小最大比例 |
| 属性检查器 · desktop-inspector-panel | properties / sections / floating / compact | 可配置字段、校验、只读和异步保存 |
| 状态栏 · desktop-status-bar | standard / compact / segmented / subtle | 可交互状态项、宿主命令和紧凑布局 |
| 命令面板 · desktop-command-palette | commands / grouped / recent / compact | 命令搜索、分组、快捷键提示和键盘执行 |
| 快捷键录制 · shortcut-recorder | standard / compact / macos / inline | 组合键录制、重复/保留键检查及 Escape 取消 |
| 上下文菜单 · desktop-context-menu | standard / grouped / compact / icons | 可访问触发入口、菜单键盘导航和命令请求 |
| 文档标签 · desktop-document-tabs | standard / compact / pills / underline | 激活、键盘导航、固定、排序、脏文档关闭确认 |
| 窗口拖动区域 · desktop-drag-region | standard / compact / toolbar / centered | 原生拖动请求，交互控件不进入系统拖动区 |
| 窗口加载 · window-loading | progress / indeterminate / skeleton / compact | 确定/不确定进度与可取消宿主加载流程 |
| 可用更新 · update-available | banner / card / inline / compact | 版本说明、下载、延后与确认安装 |
| 权限请求 · desktop-permission-request | card / inline / detailed / compact | 授权目的、显式允许/拒绝及已确认状态 |
| 文件选择 · native-file-picker | single / multiple / directory / compact | 单/多/目录浏览器选择、类型/大小/数量校验、显式原生选择请求 |
| 托盘菜单 · tray-menu-shell | standard / grouped / compact / status | 托盘菜单内容、分组和宿主命令 |
| 多窗口起始页 · multi-window-placeholder | empty / cards / inline / compact | 多窗口引导与创建窗口请求 |
| 桌面工作空间 · desktop-workspace-composition | standard / compact / focus / studio | 完整工作空间组合、文档与可配置面板 |
| 窗口切换 · desktop-window-switcher | cards / list / recent / compact | 搜索分页、切换窗口与关闭确认 |
| 最近文档 · recent-documents | list / cards / grouped / compact | 搜索、分组、分页、固定与打开请求 |
| 桌面工具栏 · desktop-toolbar | standard / compact / icons / grouped | 参数化操作项、禁用能力和键盘导航 |
| 底部面板 · desktop-bottom-panel | tabs / terminal / problems / compact | 可折叠终端/输出/问题标签及内容配置 |
| 后台任务 · background-task-center | list / cards / active / compact | 任务筛选、进度、暂停/继续/重试/取消状态约束 |
| 通知中心 · desktop-notification-center | list / unread / grouped / compact | 未读筛选、标记已读、全部已读与移除 |
| 同步状态 · sync-status | inline / card / detailed / compact | 同步阶段、进度与冲突处理请求 |
| 更新进度 · update-progress | linear / steps / detailed / compact | 下载/安装阶段、重试、取消与安装确认 |
| 崩溃恢复 · crash-recovery | card / list / detailed / compact | 恢复快照预览、恢复/放弃请求与放弃确认 |
| 单实例提示 · single-instance-notice | inline / card / detailed / compact | 已有实例说明与切换窗口请求 |
| 深层链接 · deep-link-handler | card / inline / preview / compact | 目标预览、协议白名单与宿主打开请求 |
| 关于应用 · about-dialog | standard / compact / credits / licenses | 产品、版本、致谢与许可证内容配置及信息复制请求 |
| 应用偏好设置 · desktop-preferences | sidebar / tabs / stacked / compact | 编辑器/外观/文件设置、分组、脏状态、校验/保存/重置 |
| 工作区会话 · desktop-session-manager | cards / list / recent / compact | 命名会话、搜索/分页、保存/恢复/删除确认 |
| 问题诊断 · desktop-problems-panel | table / grouped / errors / compact | 按文件/级别筛选、定位行列与可用快速修复请求 |

## 五端一致性

CSS 使用 data-g-desktop 和 data-g-desktop-options；Vue / React 使用 config；AngularJS 使用 gardener-config；Blazor 使用 Config。各框架通过 desktopOptions 的 JSON 字符串配置，desktopValue 字符串开启受控状态。样式和交互由 desktop.js 及桌面 CSS 组合包共享。

原选择器、旧行为、原生绑定和手写 HTML 用法保留。只有提供 desktopOptions 才启用托管渲染；旧行为在该根节点不再重复初始化。移除配置/卸载时销毁监听器、计时器，并恢复原始 DOM 与属性。

## 参数

| 参数 | 默认 / 说明 |
| --- | --- |
| kind / mode | 组件名 / 默认该组件第一变体 |
| title / description / content | 标题、说明和正文，按文本渲染 |
| size / direction / bordered | medium / ltr / true；small/medium/large、RTL；compact 默认 small |
| platform | windows；支持 macos、linux；macos 变体默认 macos |
| items / actions | 唯一 id 的项目/操作，最多 2000 项，支持 disabled；结构依组件而定 |
| fields / sections | 字段类型、必填、只读、数值上下限、枚举值、帮助文案及分组 |
| pageSize / showSearch | 5（1–100）/ true，对当前传入记录进行本地筛选分页 |
| height / orientation | 420px（160–1600）/ horizontal；面板高度、水平/垂直分割 |
| minRatio / maxRatio / step | 15 / 85 / 5；百分比边界与键盘步长 |
| collapsible / closable / reorderable | true；面板收起、文档关闭和标签排序 |
| disabled / readonly / status | false / false / ready；loading/error 与只读浏览 |
| capabilities | open、save、close、window、files、update、permission、sync、tasks、restore、commands；可传空数组 |
| multiple / accept / maxFiles / maxFileSize | false / 空 / 20 / 50 MiB；单选、多选、目录、类型与大小约束 |
| requireModifier / reservedShortcuts / shortcuts | true / 系统保留组合 / 已占用组合；快捷键冲突检查 |
| url / allowedSchemes | 深层链接地址 / 默认 http:、https:；拒绝 URL 用户名密码 |
| appName / panelTitle / output / statusText | 工作空间、面板与输出内容 |
| locale / timeZone / labels | zh-CN / Asia/Shanghai / 自定义界面文案 |
| showFilter / showProgress / showStatus | true；独立显示筛选、进度及就绪提示；隐藏就绪提示不会隐藏加载、失败和服务结果 |
| showReset / showPin | true；偏好重置和文档固定入口，可按场景隐藏 |
| editorRows / outputMaxHeight | 3（1–20）/ 240px（80–2000）；编辑器行数及代码、底部输出最大高度 |
| windowActions | minimize、maximize、restoreWindow、close、drag；同时约束窗口按钮与 API，可传空数组 |
| requestTimeout / maxLength | 30000ms（1–300000）/ 10000 字符 |
| defaultValue | 初始 query、filter、page、active、closed、pinned、order、sidebar、inspector、bottom、collapsed、ratio、fields、section、shortcut、progress、phase、maximized、dialogOpen、name、version |

items 中的 dirty/pinned 控制关闭确认与固定；任务使用 running/paused/failed/completed/cancelled，通知使用 read，诊断使用 severity、path、line、column、fixable。字段使用 text/number/checkbox/select/textarea。宿主可通过 setOptions 更新数据，通过 desktopValue 更新状态。

## 异步与受控状态

getInstance(root,'desktop') 提供 refresh、setOptions、setValue、getState、request、resolve、cancel、takeFiles、setHost 和 destroy。类型见 packages/css/src/types/desktop.d.ts，由 CSS 包提供；各框架共享 getInstance 类型。

beforechange 可取消操作。change 提议 value；受控模式需要宿主回写 desktopValue。action 带 requestId、action、key、value、version；成功 resolve 后才改变已确认状态。宿主返回 items/value 作为权威结果。请求超时、取消、配置变更和卸载会使旧响应失效；version 如提供，必须大于提交版本。

~~~js
const api = getInstance(root, 'desktop');
api.setHost(async ({action, key, value, version, signal}) => {
  const response = await application.execute({action, key, value, version, signal});
  return {status:'success', items:response.items,
    value:response.value, version:response.version};
});
~~~

也可以监听 gardener:action 后调用 api.resolve(requestId, result)。setHost 与事件方式选择一种处理同一请求，避免重复执行。取消信号通过 signal 交给宿主；组件不保证已发生的系统操作能够撤销。

浏览器 File 对象不进入 JSON 状态。处理 chooseFiles 时用 takeFiles(requestId) 一次性取走文件。目录选择取决于浏览器支持；原生文件选择通过 pickNative 请求接入系统对话框。

## Tauri / Electron

现有 bindTauriWindowControls / bindElectronWindowControls 保留，同时返回 execute(action)，支持 await、错误处理以及 minimize/maximize/restore/close/drag 的窄接口。

~~~js
const binding = bindTauriWindowControls(root, injectedWindow);
api.setHost(async ({action}) => {
  await binding.execute(action === 'restoreWindow' ? 'restore' : action);
  return {status:'success'};
});
~~~

应用应根据组件用途接入对应宿主操作，并同步真实窗口状态。Electron 只接收显式、隔离的 preload 桥接对象；不启用 Node integration。窗口、文件、系统权限、更新安装、链接路由、会话持久化和问题修复都由宿主验证与执行。组件不会创建系统托盘、执行终端命令或自动修改用户文件。

## 演示

- GardenerDemo：/?component=desktop#catalog，38 项全部提供 4 个变体与尺寸、方向、平台、能力、只读、状态、模拟成功/失败/超时及受控参数。
- 独立 CSS：packages/css/examples/desktop-lab.html。
- Blazor：/desktop，真实组件、参数变更及 SignalR 受控状态。

演示使用内存数据与模拟宿主，不会关闭真实窗口、安装更新或访问系统目录。检查结果见 verification.md，原始清单见 before.json。

## 发布复查

此次保持 38 个组件、152 个变体，新增 8 个共享参数和 4 个字段选项。现有组件已覆盖窗口、工作空间、文档、命令、偏好、会话、后台任务与系统反馈，新增需求通过参数组合实现，无需重复创建组件。

字段增加 placeholder、minLength、maxLength、rows；rows 为 1–20，优先于 editorRows。字段长度在保存前校验，整体 maxLength 仍是值长度上限；字段值仅允许字符串、有限数值和布尔值。搜索开关 showSearch 现在也适用于命令面板。

~~~js
const desktopOptions = {
  kind:'desktop-inspector-panel', mode:'properties', size:'small',
  editorRows:4, fields:[
    {id:'name',label:'名称',required:true,minLength:2,maxLength:50,placeholder:'输入文件名称'},
    {id:'description',label:'说明',type:'textarea',rows:4,maxLength:200}
  ]
};
// Vue / React config、AngularJS gardener-config、Blazor Config 使用相同的 JSON 配置键。
const config = {desktopOptions:JSON.stringify(desktopOptions)};
~~~

无效响应会结束等待、显示错误并保留原数据。pause/resume/retry/cancelTask 必须返回目标记录的确认状态；markRead/markAllRead 必须确认已读；移除通知、窗口、会话及快速修复必须确认对应记录已移除。授权、同步、更新、取消和恢复须返回相应 phase；异步进行中的有效阶段可以接受。宿主应返回实际业务结果，不能用空 success 假装完成状态变更。纯窗口动作仍通过明确的宿主成功响应确认。

禁用菜单父级会禁止子命令；重复可执行命令 ID 被拒绝。显式 mode 优先于已有类名。分组列表在分页前整理为连续分组，RTL 标签键盘方向与视觉一致。销毁后拒绝配置、宿主和取消调用。setOptions 对无效配置保留原有抛错约定，setValue 对非法字段值返回 false。

标题 16px，正文 14px（small 12px），控件 28/32/36px，容器内边距 12/16/20px；窄容器中工作空间和偏好区域自动单列。代码/输出高度可配置，超长内容在内部滚动。Blazor 显式绑定 Variant，与运行时 mode 一致。增强组件清除旧命名网格位置，编辑或窗口操作后显示状态结果不会挤压组件。

完整逐组件清单见 [release-review/inventory.json](release-review/inventory.json)，发布复查结果见 [verification.md](verification.md)。所有演示使用模拟宿主，不关闭真实窗口，不申请系统权限，不安装更新。
