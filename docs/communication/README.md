# 沟通组件

原有 4 个静态组件已完善，新增消息编辑器、联系人、通知偏好和送达状态，共 **8 个组件、32 个变体**。五端共享 CSS 与 communication 运行时；AI Chat、内容评论组合、桌面通知中心继续保持原职责。

| 组件 | 变体 | 已实现能力 |
| --- | --- | --- |
| 通知中心 / notification-center | list / grouped / cards / compact | 搜索、未读/收藏/归档筛选、批量已读、归档恢复、服务确认 |
| 收件箱 / inbox | split / list / cards / compact | 主从详情、分页筛选、自动选择回复对象、发送确认与失败草稿 |
| 评论讨论 / comment-thread | threaded / flat / cards / compact | 树形/平铺讨论、回复、本人编辑与删除确认、级联删除、点赞、解决与重新打开 |
| 动态流 / activity-feed | timeline / grouped / cards / compact | 时间线、分组、卡片、文本详情、搜索与分页 |
| 消息编辑器 / communication-composer | full / inline / reply / compact | 主题、收件人上限、字数校验、IME、快捷发送、附件限制与移除 |
| 联系人 / communication-contacts | list / grid / grouped / compact | 在线状态、搜索、分组、禁用联系人与异步会话入口 |
| 通知偏好 / notification-preferences | matrix / grouped / cards / compact | 主题×通道、固定策略、实时/每日/每周摘要、免打扰时段与时区 |
| 送达状态 / communication-delivery | table / timeline / cards / compact | 待发送/已发送/送达/已读/失败状态、筛选、分页、确认重试 |

## 演示

- [GardenerDemo](http://127.0.0.1:4180/?component=communication#catalog)：每个组件可切换变体、参数、空内容、加载、失败、只读、权限、异步成功/失败/超时和受控状态。
- [独立 CSS 演示](../../packages/css/examples/communication-lab.html)：8 个组件全部 32 个变体。
- [Blazor 演示](http://127.0.0.1:5192/communication)：实际 SignalR 受控更新与尺寸切换。
- [逐项清单](inventory.json)、[验证报告](verification.md)。

## 公共参数

| 参数 | 默认与范围 | 作用 |
| --- | --- | --- |
| kind / mode | 组件名称 / 该组件首个变体 | 选择视图与变体；非法组合拒绝 |
| title / description / labels | 标题、说明、中文文案 | 自定义文本与本地化，全部按文本渲染 |
| size | medium；small / medium / large | 控件 28 / 32 / 36 px；间距 12 / 16 / 20 px，compact 默认 small |
| direction / bordered | ltr / true | RTL 逻辑布局、边框开关 |
| disabled / readonly / status | false / false / ready | 禁用、仅浏览、ready / loading / error |
| items | []，最多 2000 项 | 通知、消息、评论、动态或送达记录；稳定唯一 id |
| contacts | [] | id、name、email、group、presence、disabled；选择收件人与联系人展示 |
| topics / channels | [] / 站内、邮件、推送 | 通知主题和通道；disabled 表示不可交互策略 |
| pageSize / sort | 5（1–100）/ newest | 本地分页（threaded 按根讨论分页，回复跟随父级）、newest / oldest 时间排序 |
| maxLength / maxRecipients | 2000（1–100000）/ 10（1–100） | 内容与主题长度、收件人数上限 |
| allowReply / allowReactions / allowResolve | true | 评论回复、点赞、解决入口及行为限制 |
| requireRecipient / sendOnEnter | true / false | 必选收件人；默认 Ctrl/⌘+Enter 发送，Shift+Enter 换行，IME 不提前发送 |
| allowAttachments / maxAttachments | true / 3（0–20） | 附件开关与数量 |
| maxFileSize / accept | 5 MiB / PNG、JPEG、PDF、TXT | 单文件大小；精确 MIME、类型通配或扩展名列表 |
| capabilities | read/archive/send/comment/edit/react/resolve/save/retry/contact | 宿主允许的交互；服务端仍需验证真实权限 |
| searchable / filterable | true / true | 独立控制检索与筛选栏 |
| showRecipients / showSubject | true / null | 收件人选择器与主题字段；必选收件人时保持选择器可见；null 让主题跟随变体 |
| editorRows | 0（0–20） | 0 跟随变体的 3 / 5 行，其他值指定编辑器高度 |
| defaultEnabled | true | 未提供值的通知通道初始状态；提交始终包含完整布尔矩阵 |
| requestTimeout | 30000（1–300000 ms） | 超时解锁与错误反馈 |
| locale / timeZone | zh-CN / Asia/Shanghai | 显示时间及通知时区 |
| defaultValue | {} | 非受控初始状态 |

items 支持 title、name、author、senderId、body、description、time、group、read、archived、starred、parentId、reactions、editable、resolved、disabled、status。parentId 必须存在且不得形成循环。状态为 pending / sent / delivered / read / failed。id 不得为空、重复、包含冒号或为原型保留键。

## 五端接入

CSS：根元素 g-inbox，data-g-communication，data-g-communication-options='{"kind":"inbox","items":[]}'。保留静态 CSS 使用方式，只有显式 options 才启用托管内容。

Vue / React：GInbox 等具名组件的 config={communicationOptions: JSON.stringify(options), communicationValue: JSON.stringify(value), communicationDisabled: false}。

AngularJS：g-inbox 指令和 gardener-config 使用同名键。Blazor：GInbox 或 GardenerimComponent 的 Config 字典使用同名键。false 值在五端保留；更新参数保留控制器实例。

communicationValue 开启外部受控模式。监听 gardener:change 的 detail.value 后更新该属性；未回写时内部不擅自接受提案。普通输入先发可取消 gardener:beforechange，服务确认后发 change、complete；错误发 error。子元素原生 change 不冒充组件事件。

受控值含 items、query、filter、page、active、draft、subject、replyTo、editId、recipients、reacted、preferences、quiet、quietStart、quietEnd、frequency、version。附件 File 不进入 JSON 状态，避免序列化后误以为文件已上传。

## 服务与生命周期

getInstance(element, 'communication') 提供 refresh、setOptions、setValue、getState、request、resolve、cancel、setHost、destroy。完整类型见 packages/css/src/types/communication.d.ts。

setHost(async request => result) 接收 requestId、action、key、version、value、attachments、files、signal。也可监听 gardener:action 后用 resolve(requestId,result) 完成请求。异步操作不会先修改已读、归档、评论或送达状态；取消、超时、配置变更和销毁会中止请求，过期响应被忽略。

结果必须有 status: success / error，可附 message 和递增 version。send / comment 必须返回含唯一 id、body 的 item，回复评论须返回正确 parentId；saveEdit 返回同 id 与新 body；retry 返回同 id 及 pending/sent/delivered/read 状态。缺少实际确认数据视为失败并保留草稿。服务可通过 items 返回完整权威列表。requestId 供宿主实现幂等与去重。

发送、评论、通知偏好持久化、实时在线状态、附件上传/扫描、实际消息投递、会话路由与消息权限属于宿主业务服务。本地演示仅模拟这些服务，不发送真实消息、不自动执行上传。联系人完成事件携带 key，应用据此打开会话。

运行时校验结构、长度、枚举、唯一标识、评论父子关系与时段；配置更新失败保持先前有效状态。destroy 恢复作者原有节点及属性。使用统一设计 token，支持暗色、RTL、窄屏、键盘和状态播报。

## 本次发布复查

保持 8 个组件、32 个变体，新增 6 个配置参数，覆盖工具栏、编辑器和缺省通知偏好。送达筛选支持 pending、sent、delivered、read、failed；按条件显示实际记录。通知偏好会补齐每个主题×通道的布尔值，确保显示状态与请求快照一致，显式 false 不被覆盖；非受控配置移除主题或通道时清理旧键。

发送、评论、编辑、重试若返回完整 items，列表必须保留本次确认的记录及对应正文/状态，否则保留草稿并显示错误。销毁后拒绝 setOptions、setHost 和 cancel；加载、失败状态不再同时显示“就绪”。

CSS 与五端共用基于容器宽度的排版；窄分栏中收件箱自动单列。正文 14px、标题 16px，small / medium / large 控件为 28 / 32 / 36px。Blazor 演示显式绑定变体类，避免配置模式与样式类脱节。


评论的 threaded 模式按根讨论分页，回复随父级一起呈现，避免同一讨论跨页断开。发送成功后定位到新内容所在页，并清除会隐藏该内容的搜索与筛选条件。编辑回复的部分确认数据会与原记录合并，再与服务返回的完整列表校验。
