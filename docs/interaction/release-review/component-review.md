# 交互组件逐项发布复查

现有 35 个组件、239 个变体；通过扩展既有组件覆盖配置需求，本轮不新增重复组件。共同支持密度、边框、标题、最大高度和加载/空/错误/禁用/只读状态；类型与参数范围见 [文档](../README.md)。

| 组件 | 数据与专用参数 | 核查及修复覆盖 | 变体 |
| --- | --- | --- | --- |
| saved-views | items、value | 保存与选择本地视图；可编辑模式显式关闭，未提交名称保留 | 7 |
| sort-builder | items、value、fields | 多字段排序；规则添加移除、字段去重、状态更新保留 | 6 |
| selection-controls | items、value、multiple | 全选、部分选择、容量限制、可隐藏统计 | 6 |
| batch-toolbar | items、value、description、multiple、actions | 批量动作、选择数量约束、危险动作标识 | 6 |
| dual-list | items、value | 搜索勾选移入移出、禁用项目、方向与列表高度 | 6 |
| tree-select | items、value、multiple、cascade | 动态树、展开、独立/级联选择、父或叶子回传与显式优先级 | 22 |
| cascader | items、value、leafOnly | 分级路径选择、搜索叶子、可变列宽与内部滚动 | 6 |
| mention-picker | items、value、placeholder | 人员检索与选择，头像和描述可独立关闭 | 6 |
| user-picker | items、value | 单选/多选人员、头像描述、列数及只读状态 | 6 |
| organization-picker | items、value | 组织树导航、分支选择、禁用祖先约束 | 6 |
| resource-picker | items、value | 资源数据、过滤与选择，显示密度和列数 | 6 |
| media-picker | items、value | 媒体条目选择，图标、描述与列表高度 | 6 |
| icon-picker | items、value | 图标选择与文本标签，图标显隐和网格列数 | 6 |
| color-picker-composition | items、value | 颜色样本、文字标签、受控选择；仅接受合法十六进制颜色 | 6 |
| date-range-picker-composition | items、value、min、max、presets | 真实日期、单端边界、顺序校验、预设和重置开关 | 6 |
| time-range-picker-composition | items、value、min、max、presets | 时间格式、单端边界、范围顺序与预设开关 | 6 |
| saved-filters | items、value、multiple | 已保存筛选的多选、清空、状态保留 | 7 |
| group-builder | items、value、fields | 分组规则、字段和方向选择、容量限制 | 6 |
| entity-picker | items、value | 实体关联、搜索节点保留与中文组合输入 | 6 |
| tag-picker | items、value、multiple | 多选标签、容量、清空和药丸样式 | 6 |
| relation-picker | items、value、multiple | 多实体关联、选择统计、禁用及只读 | 6 |
| bulk-confirmation | items、value、description、multiple | 范围说明、确认勾选、可取消确认事件 | 6 |
| bulk-progress | items、value、concurrency | 并发、真实错误、超时、取消与重试保留成功记录 | 6 |
| action-bar | items、value、description、multiple、actions | 配置动作、禁用条件与业务 action 事件 | 8 |
| bulk-action-bar | items、value、description、multiple、actions | 选择依赖动作与批量意图事件 | 6 |
| floating-action-bar | items、value、description、multiple、actions | 悬浮/容器动作变体、窄屏排版、统一密度 | 8 |
| sticky-actions | items、value、description、multiple、actions | 操作区动作、边框与状态契约 | 6 |
| transfer-list | items、value | 成员权限穿梭、禁用项、容量和受控目标列表 | 6 |
| split-pane | items、value、panels、minRatio、maxRatio、step | 横纵方向、比例边界、尺寸、稳定分隔条和按轴键盘调整 | 7 |
| drag-sort | items、value | 拖动/键盘等效移动、边界和禁用项目 | 6 |
| infinite-scroll | items、value、hasMore | 手动/自动加载、超时、取消、停止失败后的自动重试循环 | 8 |
| pull-refresh | items、value | 按钮/手势刷新、阈值、替换数据、超时和取消 | 6 |
| copy-action | items、value、text | 真实 Clipboard API 成功/失败，复制文本可配置 | 8 |
| fullscreen-action | items、value、description | 真实 Fullscreen API 与事件隔离，权限失败反馈 | 8 |
| undo-history | items、value | 快照提交、撤销重做、分支截断、游标及未提交草稿保留 | 6 |

五端目录、真实装配和全部变体分别核查。最终通过状态与证据见 [发布验证](../verification.md)。加载和批处理不包含业务后端；复制和全屏遵循浏览器权限；本地撤销不撤销已提交网络操作。
