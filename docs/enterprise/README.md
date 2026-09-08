# 企业组件

企业分类由 3 个静态组件扩展为 8 个交互组件，共 32 个变体。五端共享 enterprise.js、设计变量、事件及配置；保留原有 CSS 选择器，只有添加 data-g-enterprise-options 才接管 DOM。

| 组件 | 原状 | 变体 |
| --- | --- | --- |
| 企业设置 · enterprise-settings | 原有静态组件 | sidebar / tabs / stacked / compact |
| 权限矩阵 · permission-matrix | 原有静态组件 | matrix / grouped / stacked / compact |
| 审计日志 · audit-log | 原有静态组件 | table / timeline / inspector / compact |
| 成员管理 · member-management | 新增组件 | table / cards / inspector / compact |
| 邀请管理 · invitation-manager | 新增组件 | table / cards / inline / compact |
| 角色管理 · role-manager | 新增组件 | split / cards / list / compact |
| 团队管理 · team-management | 新增组件 | tree / cards / list / compact |
| 集成管理 · enterprise-integrations | 新增组件 | catalog / connected / list / compact |

## 逐项完善

- 企业设置：字段 schema、章节导航、必填/邮箱/地址/数值/枚举校验，脏状态、重置、异步保存及版本冲突。
- 权限矩阵：资源 × 角色，允许/拒绝/继承三态，继承结果、资源分组、批量设置、系统角色与单元格锁定；横向滚动区可键盘聚焦。
- 审计日志：不可变事件、人员/操作搜索、结果及 ISO 日期筛选、时区格式化、变更详情、CSV 导出与公式前缀转义。
- 成员管理：搜索筛选、分页多选、批量启停/移除、角色调整、危险操作确认、当前用户和最后一位所有者保护。
- 邀请管理：多邮箱输入、格式/重复/有效邀请去重/数量上限校验，角色选择，过期状态、重新发送与撤销。
- 角色管理：创建、修改、复制、删除和权限项配置；系统角色不可修改和删除，允许复制为自定义角色。
- 团队管理：层级/卡片/列表视图，创建修改、父级选择、循环检测、成员分配和归档；有成员或子团队时不可归档。
- 集成管理：全部/已连接视图、状态筛选、配置公开地址、连接/断开/测试；通过服务确认改变状态。

组织结构图、组织选择器、租户切换、账单、认证以及审批中心已有独立组件，本次复用其边界，不重复创建。

## 五端接入

| 实现 | 配置 |
| --- | --- |
| CSS / JavaScript | data-g-enterprise、data-g-enterprise-options、可选 data-g-enterprise-value；调用 init(root) |
| Vue | GEnterpriseSettings 等组件的 config={enterpriseOptions, enterpriseValue} |
| React | GEnterpriseSettings 等组件的 config={enterpriseOptions, enterpriseValue} |
| AngularJS | g-enterprise-settings 等指令和 gardener-config |
| Blazor | GEnterpriseSettings 等组件的 Config 字典与 OnEvent |

enterpriseOptions / enterpriseValue 以 JSON 字符串传入各框架配置。CSS 入口为 data-* 字符串。false 原样传递；卸载释放控制器、监听器及定时器。

~~~js
const options = {
  kind: 'member-management', mode: 'cards', size: 'medium',
  pageSize: 5, currentUserId: 'me', ownerRole: 'owner',
  permissions: ['manageMembers'],
  roles: [{id:'owner',name:'所有者',system:true},{id:'editor',name:'编辑者'}],
  items: [{id:'me',name:'当前用户',role:'owner',status:'active'},
          {id:'other',name:'同事',role:'editor',status:'active'}]
};
const config = {enterpriseOptions: JSON.stringify(options), enterpriseDisabled: false};
~~~

## 参数

| 参数 | 默认值 / 用途 |
| --- | --- |
| kind / mode | 必填组件名；mode 默认为该组件第一个变体 |
| size / direction / bordered | medium、ltr、true；small/medium/large 和 rtl；compact 默认 small |
| title / description / labels | 标题、说明及可覆盖的界面文案 |
| disabled / readonly / status | false / false / ready；loading 和 error 展示状态；只读仍可浏览筛选 |
| items | 唯一 id 的记录集合，最多 2000 条；宿主可按服务分页加载当前数据 |
| roles / resources | 唯一 id 的角色与资源；grants、inherited、lockedRoles 配置矩阵 |
| sections / fields | 设置章节和字段；字段 type、required、readonly、disabled、min、max、options、help |
| permissionOptions / members | 角色可配置的权限列表 / 团队可分配的成员列表 |
| permissions | edit、invite、manageMembers、manageRoles、manageTeams、manageIntegrations、export |
| currentUserId / ownerRole | 当前用户 id 与所有者角色 id（默认 owner） |
| pageSize / maxSelected | 5（1–100）/ 100（1–1000），作用于当前传入的记录集合 |
| maxInvitations / maxLength | 20（1–100）/ 2000，邮箱数与文本长度限制 |
| locale / timeZone | zh-CN / Asia/Shanghai；控制日期格式，ISO 日期筛选按记录 at 的日期部分匹配 |
| requestTimeout | 30000ms（1–300000） |
| defaultValue | 初始 query、filter、page、selected、detail、section、fields、grants、rolePermissions、memberIds、name、description、email、role、parent、endpoint、from、to、version |

企业专用 size、bordered、disabled、readonly 属性可在 options 之外单独配置。所有结构化内容用 textContent 呈现。集成地址限制为 HTTP(S)，不接收 URL 用户名和密码。

## 状态与异步服务

getInstance(root,'enterprise') 返回 refresh、setOptions、setValue、getState、request、resolve、cancel、exportCsv 和 destroy。完整类型在 packages/css/src/types/enterprise.d.ts，由 CSS 包提供；各框架共享 getInstance 类型。

enterpriseValue 存在即开启受控状态：change 提议新 value，宿主更新属性后才生效。beforechange 可取消。改变配置/外部值、取消或销毁会作废未完成请求；相同请求只接受一次结果。

~~~js
root.addEventListener('gardener:action', async event => {
  if (event.target !== root || event.detail.behavior !== 'enterprise') return;
  const {requestId, action, key, keys, value, version} = event.detail;
  try {
    const response = await service.execute({action, key, keys, value, version});
    api.resolve(requestId, {status:'success', items:response.items,
      value:response.value, version:response.version});
  } catch {
    api.resolve(requestId, {status:'error', message:'保存失败，请重试'});
  }
});
~~~

服务端必须重新验证身份、授权、所有者约束及版本，并执行持久化。前端 permissions 只控制可用操作。成功时宿主返回权威 items/value；组件不会凭空创建或删除企业数据。version 如提供必须大于提交时的版本。cancel 使 UI 忽略响应，服务端请求取消须宿主自行接入 AbortController。完整审计日志导出、服务分页和访问控制由宿主处理；exportCsv 导出当前传入且符合筛选的记录。

连接流程应在宿主安全界面完成 OAuth 或密钥配置；此组件只保存公开 endpoint。演示使用 example.test 和内存数据，刷新恢复，不发送邀请或连接真实系统。

## 演示与验证

- GardenerDemo：/?component=enterprise#catalog；每个组件有四变体及尺寸、方向、边框、权限、只读、数据/服务状态和受控模式参数。
- CSS：packages/css/examples/enterprise-lab.html。
- Blazor：/enterprise，使用真实组件与 SignalR 受控状态回传。
- 复查：npm run check:enterprise；运行时 node --test packages/css/tests/enterprise.test.mjs。
- 浏览器：node scripts/enterprise-browser-matrix.mjs、node scripts/test-enterprise-static.mjs。

验证结果见 verification.md；逐组件原状见 before.json 和 inventory.json。

## 发布复查与扩展参数

保留 8 个组件、32 个变体。此次新增 8 个共享参数和 6 个字段选项，配置均通过 enterpriseOptions 传入 CSS、Vue、React、AngularJS、Blazor；GardenerDemo 提供对应选择控件。

| 参数 | 默认 / 范围 | 行为 |
| --- | --- | --- |
| showSearch / showFilter | true | 独立显示搜索和状态筛选 |
| showBatch | true | 显示成员多选/批量工具及权限矩阵批量入口；权限仍由 permissions 控制 |
| showReset | true | 显示设置和权限矩阵的重置按钮 |
| showStatus | true | 显示就绪提示；隐藏时保留加载、错误和服务结果 |
| showDetails | true | 显示记录详情入口及检查器 |
| editorRows | 3 / 1–20 | 文本编辑器默认行数 |
| detailMaxHeight | 320px / 1–2000 | 审计差异及检查器高度上限，超出后内部滚动 |

字段新增 placeholder、autocomplete、minLength、maxLength、rows、step。rows 优先于 editorRows；长度与数值步长在提交时验证。字段值只允许字符串、有限数值和布尔值，checkbox 只接受布尔值。配置错误的 setOptions 保留抛错约定；无效 setValue 返回 false。

~~~js
const options = {
  kind:'enterprise-settings', size:'small', showReset:false, editorRows:4,
  fields:[{id:'name',label:'企业名称',value:'Garden',required:true,
    minLength:2,maxLength:50,placeholder:'输入名称',autocomplete:'organization'},
    {id:'description',label:'说明',type:'textarea',rows:4,maxLength:200}]
};
const config = {enterpriseOptions:JSON.stringify(options)};
~~~

无效服务响应会结束等待、显示错误并保留数据。除 save 外，成功响应必须包含权威 items；创建必须包含新记录，启停、移除、邀请撤销/重发、归档、连接/断开及角色变更需返回对应结果。宿主仍负责真实业务执行与权限校验。

成员批量操作会检查整个选择集合，禁止一次移除/停用全部有效所有者；未加载所有者的服务分页仍可操作普通成员。团队同时依据 memberIds、memberCount 和子团队保护归档。分组权限保持连续分组，显式 mode 优先于旧变体类名；销毁后拒绝修改与取消调用。文本输入与原生 change 不再重复产生受控提案，配置变化会清理残留等待提示。

标题统一 16px，正文 14px（small 12px），控件 28/32/36px，容器内边距 12/16/20px。窄容器中的设置、创建表单与检查器自动单列，审计差异和检查器可独立滚动。Blazor 显式绑定 Variant，与五端演示保持一致。

现有组件已覆盖设置、权限、审计、成员、邀请、角色、团队、集成；组织图、认证、账单及审批使用现有独立分类，不重复创建同义组件。查看 [逐组件清单](release-review/inventory.json) 和 [发布报告](verification.md)。演示不发送真实邀请、不连接外部系统。
