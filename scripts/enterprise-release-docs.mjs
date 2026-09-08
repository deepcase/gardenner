import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const section=`
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
`;
for(const p of ['docs/enterprise/README.md','scripts/enterprise-docs.mjs']){let s=fs.readFileSync(p,'utf8');if(!s.includes('## 发布复查与扩展参数'))s=p.endsWith('.md')?s+section:s.replace(/\r?\n`;fs\.writeFileSync/,section+'\n`;fs.writeFileSync');await writeFile(p,s);}
const key='企业组件发布复查：8 个组件共享紧凑尺寸，支持搜索、筛选、批量操作、重置、状态、详情和编辑器参数；批量所有者保护、字段校验、服务回包及五端受控行为已完善。';let html=fs.readFileSync('website/docs.html','utf8');if(!html.includes(key))html=html.replace('<section id="enterprise-enhancements" class="docs-section">','<section id="enterprise-enhancements" class="docs-section"><p>'+key+'</p>');if(!html.includes(key))throw Error('Missing enterprise section');await writeFile('website/docs.html',html);
const translations={en:'Enterprise release review: eight components share compact sizing and configurable search, filters, bulk actions, reset, status, details and editors. Owner protection, field validation, service responses and controlled behavior are consistent across five implementations.',ja:'企業コンポーネントの確認：8 コンポーネントでコンパクトな寸法と検索、フィルター、一括操作、リセット、状態、詳細、編集設定を共有。所有者保護、入力検証、サービス応答、制御状態を 5 実装で統一しました。',ko:'기업 구성 요소 검토: 8개 구성 요소가 간결한 크기와 검색, 필터, 일괄 작업, 초기화, 상태, 상세 및 편집 설정을 공유합니다. 소유자 보호, 입력 검증, 서비스 응답, 제어 동작을 5개 구현에서 개선했습니다.',es:'Revisión empresarial: ocho componentes comparten tamaños compactos y opciones de búsqueda, filtros, acciones masivas, restablecimiento, estado, detalles y editores. Se mejoraron la protección del propietario, la validación y las respuestas en cinco implementaciones.',fr:'Vérification entreprise : huit composants partagent des dimensions compactes et des options de recherche, filtres, actions groupées, réinitialisation, état, détails et édition. Protection des propriétaires, validation et réponses sont cohérentes dans cinq implémentations.',de:'Unternehmensprüfung: Acht Komponenten teilen kompakte Größen und Optionen für Suche, Filter, Sammelaktionen, Zurücksetzen, Status, Details und Editoren. Eigentümerschutz, Validierung und Antworten sind in fünf Implementierungen abgestimmt.'};for(const[lang,value]of Object.entries(translations)){const p='website/assets/i18n/'+lang+'.json',data=JSON.parse(fs.readFileSync(p,'utf8'));data[key]=value;await writeFile(p,JSON.stringify(data,null,2)+'\n');}
const fixes={'enterprise-settings':'字段类型、长度、步长、编辑器行数；准确的等待与重置状态','permission-matrix':'分组连续性、批量显示参数、紧凑表格','audit-log':'详情开关与高度、搜索筛选、错误状态','member-management':'批量所有者保护、状态回执校验、多选与详情显示','invitation-manager':'创建记录及重发/撤销状态确认、编辑器配置','role-manager':'创建回执、受控输入去重、详情与窄容器','team-management':'成员 ID 归档保护、创建与归档回执、窄容器','enterprise-integrations':'连接/断开状态确认、异常回包释放等待'};const inventory=JSON.parse(fs.readFileSync('docs/enterprise/inventory.json','utf8')).map(c=>({...c,review:fixes[c.name],frameworks:['css','vue','react','angularjs','blazor']}));await writeFile('docs/enterprise/release-review/inventory.json',JSON.stringify(inventory,null,2)+'\n');
