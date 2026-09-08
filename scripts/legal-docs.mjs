import fs from 'node:fs';import {legalModes} from '../packages/css/src/js/legal.js';import {legalNames} from './legal-examples.mjs';const features={'cookie-consent':'同等可见的接受/仅必要/自定义入口，顶栏/底栏/文档流位置，回执与撤回确认','consent-preferences':'必要项锁定、可选项默认关闭、用途/提供方/期限、独立选择与精确回执','legal-document':'目录跳转、分节文本、搜索、版本、打印样式、长文本与移动端','legal-agreement':'必选/可选协议、阅读确认、文档内嵌、版本更新重新确认、快照校验','consent-history':'记录筛选、分页、详情、类别快照、JSON 导出','privacy-request':'类型限制、邮箱/说明校验、删除请求确认、分步核对、失败保留与服务回执','privacy-request-status':'服务端进度、阶段列表、筛选分页、手动刷新和取消确认','policy-updates':'前后版本对照、变更摘要、生效时间、分页和逐条确认回执'};const inventory=Object.entries(legalModes).map(([name,variants])=>({name,title:legalNames[name],variants,new:name!=='cookie-consent',diagnosis:name==='cookie-consent'?'原有静态固定横幅，缺少参数、同意状态、服务确认和完整演示；原法律分类包映射也不对应实际 CSS 所属。':'新增独立法律界面场景；不重复表单 consent-group、认证 auth-consent 或 AI privacy-notice。',implemented:features[name]}));fs.writeFileSync('docs/legal/inventory.json',JSON.stringify(inventory,null,2)+'\n');fs.writeFileSync('docs/legal/README.md',`# 法律组件

原有 Cookie 横幅已完善，新增 7 类配套组件，共 **8 个组件、32 种变体**。五端共用 legal 运行时和 catalog CSS 包，保留原 g-cookie-banner 静态使用方式；显式设置 legalOptions 才接管内容。

| 组件 | 变体 | 能力 |
| --- | --- | --- |
${inventory.map(i=>'| '+i.title+' / '+i.name+' | '+i.variants.join(' / ')+' | '+i.implemented+' |').join('\n')}

[完整 GardenerDemo](http://127.0.0.1:4180/?component=legal#catalog) · [独立 CSS 演示](../../packages/css/examples/legal-lab.html) · [Blazor 演示](http://127.0.0.1:5192/legal) · [验证报告](verification.md)

## 配置参数

| 参数 | 默认与范围 | 作用 |
| --- | --- | --- |
| kind / mode | 组件名称 / 首个变体 | 只能使用清单中的有效组合 |
| title / description / summary / labels | 自定义文本 | 文本安全渲染；labels 可替换交互文案 |
| policyVersion | 1 | 当前政策版本；应在实质内容变更时更新 |
| categories | [] | id、name、required、disabled、description、purpose、provider、duration |
| sections | [] | id、title、body；文档目录、搜索及协议内嵌正文 |
| agreements | [] | id、title、required、disabled、description/body；可选项不默认勾选 |
| items | [] | 同意记录或请求列表；唯一 id、title、time、policyVersion、status、choices、steps |
| updates | [] | id、title、summary、before、after、effectiveAt、disabled |
| requestTypes | access/export/correct/delete/restrict/withdraw | 允许的请求类型，可配置子集 |
| size | medium；small / medium / large | 控件 28 / 32 / 36 px，间距 12 / 16 / 20 px；compact 默认 small |
| direction / bordered | ltr / true | RTL 逻辑布局、边框 |
| placement | inline；top / bottom | 仅 Cookie 横幅；固定位置支持安全区域及内部滚动 |
| disabled / readonly / status | false / false / ready | 禁用、仅浏览、ready / loading / error；只读进度仍可刷新 |
| requireReview / requireEmail / requireReason | true / true / false | 阅读确认、必填邮箱、必填请求说明 |
| confirmDelete | true | 删除请求需要独立确认，不直接删除任何数据 |
| allowWithdraw / allowCancel / allowExport | true | 撤回入口、取消请求、导出历史 |
| pageSize / maxLength | 5（1–100）/ 2000（1–100000） | 本地分页和请求说明长度 |
| searchable / filterable | true / true | 独立控制搜索和筛选栏；状态仍可由宿主驱动 |
| dismissible / hideOnConsent | false / false | Cookie 手动关闭 / 有效同意回执后自动收起；关闭不代表同意 |
| exportScope | all / filtered；all | 导出全部已加载记录或全部匹配结果（跨页），只读仍尊重 export 能力 |
| requestTimeout | 30000（1–300000 ms） | 超时错误和解锁 |
| locale / timeZone | zh-CN / Asia/Shanghai | 时间显示；正式内容由宿主配置 |
| capabilities | consent/accept/request/cancel/withdraw/acknowledge/export | 控制交互能力；不能替代后端权限检查 |
| defaultValue | {} | 非受控初始状态 |

标识不能为空、重复、包含冒号或使用原型保留键。时间使用有效日期字符串，建议 ISO 8601。categories、sections、agreements、items、updates 每组最多 2000 项。历史记录的 choices 必须是布尔快照。

## 五端统一接口

CSS：根元素 g-cookie-banner 等，data-g-legal，data-g-legal-options='{"kind":"cookie-consent","categories":[]}'。

Vue / React：GCookieConsent 等具名组件使用 config={legalOptions: JSON.stringify(options), legalValue: JSON.stringify(value), legalDisabled: false}。AngularJS：g-cookie-consent 指令和 gardener-config；Blazor：GCookieConsent 或 GardenerimComponent 的 Config 字典，使用同名键。五端保留 false 参数及运行时实例。

legalValue 开启受控模式。将 gardener:change 的 detail.value 写回该值；未写回时组件不会擅自接受状态提案。输入先发可取消 gardener:beforechange。异步确认后发 change 和 complete，失败发 error。只监听组件自身事件，避免将子元素原生 change 当作组件状态。

value 包含 confirmationVersion、choices、accepted、reviewed、receipt、preferencesOpen、dismissed、items、query、filter、page、active、requestType、name、email、reason、deleteConfirmed、step、acknowledged、version。confirmationVersion 用来在政策版本变化时重置选择与阅读确认，旧 receipt 保留作提示，不充当新版本确认。受控数据结构变更时，宿主应同步配置和对应值。

## 回执与业务接入

getInstance(element,'legal') 提供 refresh、setOptions、setValue、getState、request、resolve、cancel、exportData、setHost、destroy。完整类型位于 packages/css/src/types/legal.d.ts。

setHost(async request => result) 接收 requestId、action、key、version、value、submission 和 AbortSignal；也可监听 gardener:action 后调用 resolve(requestId,result)。submission 是本次 policyVersion、choices、agreements 快照。请求编号可供宿主实现幂等；组件会处理取消、超时、配置变更和过期响应。

结果必须包含 status: success / error，可附 message 及递增 version。以下行为不会仅凭 success 字符串就显示完成：

- acceptAll / rejectOptional / saveConsent / withdraw：必须返回 receipt，包含唯一 id、相同 policyVersion、有效 recordedAt 和完全相同的 choices。必要项保持 true；拒绝或撤回使可选项为 false。
- acceptAgreement：receipt 的 agreements 必须与本次选择集合相同，不能重复或遗漏；提交前检查必选协议及阅读确认。
- acknowledge：receipt 必须包含正确 updateId。
- submit / cancelRequest / refresh：必须返回有效 item。取消结果状态必须为 cancelled；刷新不擅自推进业务状态。

进度状态为 pending / verifying / processing / completed / rejected / cancelled；同意历史使用 accepted / withdrawn。取消入口只用于活动请求。导出生成当前客户端历史的 JSON 文件，并不声称其具备司法证明能力。

组件不自行读取/写入 Cookie、不启用分析脚本、不持久化同意、不发送隐私请求。真实业务需由宿主接入持久化回执、身份核验、权限、数据处理、通知和脚本启停。示例中的用途、期限、文档正文及服务回执均是演示内容，不能直接当作正式法律文本。阅读复选框只记录用户操作，不证明其实际阅读，也不自动保证任何地区的合规性。

## 生命周期与设计

共享设计 token、统一紧凑比例、暗色、RTL、窄屏、键盘焦点及状态播报。非法配置保持先前有效状态；销毁恢复原节点和属性并中止请求。演示提供成功、失败、超时、版本冲突、旧版回执、空数据、只读、禁用及外部受控场景。
`);
