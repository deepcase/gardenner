# 工作流组件

原有新手引导、向导布局已完善；新增任务清单、审批流程、流程编排、运行历史、运行详情、触发配置，共 8 个组件、32 种变体。步骤条、时间线、看板与内容审核继续使用既有分类组件，不重复创建。

| 组件 | 变体 | 能力 |
| --- | --- | --- |
| 新手引导 · onboarding | guided / cards / checklist / compact | 必填与格式校验、可选跳过、条件步骤、返回修改、异步完成及状态恢复 |
| 向导布局 · wizard-layout | sidebar / top / vertical / compact | 顶栏/侧栏/竖向布局，线性或自由导航，键盘及受控步骤 |
| 工作流任务清单 · workflow-checklist | list / grouped / cards / compact | 任务依赖、完成进度、撤销时失效下游任务、分组与卡片 |
| 审批流程 · workflow-approval | timeline / parallel / cards / compact | 顺序/并行审批、通过人数、意见必填、驳回确认及服务端结果 |
| 流程编排 · workflow-builder | canvas / list / split / compact | 节点创建/重命名/删除，连线与分支说明编辑、循环/重复校验、缩放与保存/运行 |
| 运行历史 · workflow-run-history | table / cards / timeline / compact | 状态筛选、搜索、分页、运行详情、失败重试和取消确认 |
| 运行详情 · workflow-run-detail | timeline / steps / logs / compact | 步骤状态、文本日志、失败重试与取消运行 |
| 触发配置 · workflow-trigger | manual / schedule / webhook / compact | 手动/定时/事件触发，Cron 范围校验、时区、启用开关及环境字段 |

## 五端参数

CSS 使用 data-g-workflow 和 data-g-workflow-options；Vue / React 使用 config；AngularJS 使用 gardener-config；Blazor 使用 Config。workflowOptions 为 JSON 字符串，workflowValue 为受控状态 JSON 字符串。五端共享 workflow.js 和 catalog 样式包。原有 CSS 选择器和手写 HTML 继续有效，提供 options 时才启用托管 DOM；卸载恢复原节点并清理计时器/监听器。

| 参数 | 默认与范围 |
| --- | --- |
| kind / mode | 组件名 / 该组件第一变体 |
| title / description / successText | 标题、说明、完成文案，全部按文本呈现 |
| size / direction / bordered | medium / ltr / true；small/medium/large、RTL；compact 默认 small |
| steps | 唯一 id、title、description、content、fields；optional、disabled、hidden；when.field + equals 控制条件显示 |
| fields | text/email/number/select/checkbox/textarea；label、value、required、readonly、disabled、min、max、options、help |
| items | 唯一 id、name、description、group、dependsOn；运行记录支持 status、startedAt、steps、logs |
| nodes / edges | 节点 id、name、type、description；边 id、from、to、condition；拒绝悬空、自环、重复连线和循环 |
| linear / allowSkip / allowBack | true / true / true；线性导航、跳过可选步骤、返回修改 |
| approvalMode / quorum / requireComment | sequential / 1（1–100）/ true；parallel 支持通过人数 |
| pageSize / maxNodes / maxLength | 5（1–100）/ 100（1–500）/ 2000 字符 |
| disabled / readonly / status | false / false / ready；loading/error；只读仍可搜索与查看 |
| capabilities | edit、submit、approve、run、retry、cancel；空数组表示无业务操作能力 |
| searchable / filterable | true / true；独立显示运行历史的搜索和状态筛选 |
| showProgress / showLogs | true / true；显示步骤/任务进度和运行日志，steps 变体仍只显示步骤 |
| showSave / showZoom | true / true；显示保存草稿与流程画布缩放入口 |
| editorRows / logMaxHeight | 3（1–20）/ 240px（80–2000）；文本编辑器行数和日志最大高度 |
| requestTimeout | 30000ms（1–300000） |
| locale / timeZone / labels | zh-CN / Asia/Shanghai / 自定义文案 |
| defaultValue | 初始 active、values、completed、skipped、decisions、comment、nodes、edges、selected、query、filter、page、triggerType、cron、event、enabled、zoom、phase、version |

编辑前序字段会清除该步骤及其后续完成记录；撤销清单任务会同步撤销依赖它的下游任务。禁用和隐藏步骤不阻塞向导。审批结果需服务确认才生效；并行达到 quorum 后关闭余下审批入口，驳回终止本轮。Cron 支持五段数字、星号、范围、列表和步长，检查范围；调度与夏令时策略由服务端实现。

## 状态和服务接口

getInstance(root,'workflow') 提供 refresh、setOptions、setValue、getState、next、previous、validate、request、resolve、cancel、setHost、destroy。类型见 packages/css/src/types/workflow.d.ts。

beforechange 可取消本地状态提议；change 的 value 由受控宿主回写 workflowValue。action 提供 requestId、action、key、value、version；宿主返回 success/error、message、value、items、version。请求取消、超时、配置变更和卸载会使旧响应失效，并中止 AbortSignal。返回版本必须大于提交版本。

~~~js
const api = getInstance(root, 'workflow');
api.setHost(async ({action, key, value, version, signal}) => {
  const result = await workflowService.execute({action, key, value, version, signal});
  return {status:'success', value:result.value, items:result.items, version:result.version};
});
~~~

也可以监听 gardener:action 后 resolve(requestId,result)。事件处理与 setHost 应二选一，避免重复执行。request 的业务操作包括 save、finish、approve、reject、run、retry、cancelRun，按组件和记录状态限制。

这些组件负责编辑、校验和呈现工作流，应用服务负责实际审批权限、原子版本检查、调度、重试幂等性和持久化。分支 condition 是传给宿主的说明/表达式文本，浏览器不会执行代码。Webhook 签名与密钥留在服务端。取消请求不表示已发生的业务操作一定可撤销。

## 完整演示

- GardenerDemo：/?component=workflow#catalog；每个组件四个变体，参数、只读、空/加载/失败、模拟成功/失败/超时及外部受控状态。
- 独立 CSS：packages/css/examples/workflow-lab.html。
- Blazor：/workflow，真实组件和 SignalR 受控更新。

演示使用内存数据和模拟服务，不发送真实审批、不创建调度任务。验证记录见 verification.md。

## 发布复查与扩展

此次保持 8 个组件、32 个变体。引导、向导、任务、审批、编排、运行历史、详情和触发已覆盖本分类；新增需求通过共享参数扩展，不再创建功能重复的组件。

新增 searchable、filterable、showProgress、showLogs、showSave、showZoom、editorRows、logMaxHeight 八个参数。显示开关用于按场景组织界面；业务操作权限继续由 capabilities 与服务端控制。

字段额外支持 placeholder、autocomplete、minLength、maxLength、rows、step。数字 step 可为正数或 any；rows 为 1–20，字段行数优先于 editorRows。空白文本不能通过必填校验；长度和数值步长在提交前校验。maxLength 还受组件整体长度上限约束。

~~~js
const options = {
  kind: 'workflow-trigger', mode: 'schedule', showSave: true,
  editorRows: 4, fields: [
    {id:'name', label:'任务名称', required:true, minLength:2, maxLength:50, placeholder:'例如：每日库存同步'},
    {id:'batch', label:'每批数量', type:'number', min:10, max:100, step:10, value:20},
    {id:'note', label:'说明', type:'textarea', rows:4, maxLength:200}
  ]
};
~~~

重试必须返回包含目标运行记录、且状态为 pending/running/success 的 items；取消运行必须返回目标记录的 cancelled 状态。缺少或矛盾的确认会显示错误，保持此前数据。审批结果不能覆盖当前或已确认的决定，完成结果不能丢失必需步骤；错误保留审批意见。非受控配置更换审批人时清除已移除成员的决定。

复选框每次原生操作只发出一次状态提议；向导切换步骤会聚焦新标题。加载与错误状态准确播报。销毁后拒绝配置、服务和校验调用；禁用运行记录的重试/取消入口与 API 一致。

设计比例统一为正文 14px（small 12px）、标题 16px、控件 28/32/36px、容器内边距 12/16/20px。字体有系统回退；窄容器自动将向导及编排编辑区排成单列。Blazor 演示的 Variant 与运行时 mode 同步。

逐组件复查见 [release-review/inventory.json](release-review/inventory.json)，验证结果见 [verification.md](verification.md)。
