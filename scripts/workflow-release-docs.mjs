import fs from 'node:fs';
import {workflowModes} from '../packages/css/src/js/workflow.js';
const rows='| searchable / filterable | true / true；独立显示运行历史的搜索和状态筛选 |\n| showProgress / showLogs | true / true；显示步骤/任务进度和运行日志，steps 变体仍只显示步骤 |\n| showSave / showZoom | true / true；显示保存草稿与流程画布缩放入口 |\n| editorRows / logMaxHeight | 3（1–20）/ 240px（80–2000）；文本编辑器行数和日志最大高度 |\n';
const section=`
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
`;
for(const path of ['docs/workflow/README.md','scripts/workflow-docs.mjs']){let s=fs.readFileSync(path,'utf8');if(!s.includes('| searchable / filterable |'))s=s.replace('| requestTimeout |',rows+'| requestTimeout |');if(!s.includes('## 发布复查与扩展'))s=path.endsWith('.md')?s+section:s.replace(/\n`\);\s*$/,section+'\n`);\n');fs.writeFileSync(path,s);}
const key='工作流发布复查：搜索、筛选、进度、日志、保存和缩放可独立配置，支持编辑器行数、日志高度及字段约束；审批和运行结果严格校验，五端共享紧凑尺寸与可访问交互。';
let html=fs.readFileSync('website/docs.html','utf8');if(!html.includes(key))html=html.replace('<section id="workflow-enhancements" class="docs-section">','<section id="workflow-enhancements" class="docs-section"><p>'+key+'</p>');if(!html.includes(key))throw Error('Missing workflow website section');fs.writeFileSync('website/docs.html',html);
const translations={en:'Workflow release review: independent search, filter, progress, log, save and zoom controls; configurable editor rows, log height and field constraints; validated approval and run results, with shared compact sizing and accessible interactions across five frameworks.',ja:'ワークフローのリリース確認：検索、絞り込み、進捗、ログ、保存、ズームの個別設定、入力行数・ログ高さ・フィールド制約に対応。承認と実行結果を検証し、5 つの実装でコンパクトな寸法とアクセシブルな操作を共有します。',ko:'워크플로 출시 검토: 검색, 필터, 진행률, 로그, 저장 및 확대 제어를 개별 설정하고 편집기 행 수, 로그 높이, 필드 제약을 지원합니다. 승인 및 실행 결과를 검증하며 다섯 구현에서 간결한 크기와 접근 가능한 상호작용을 공유합니다.',es:'Revisión del flujo de trabajo: controles independientes de búsqueda, filtros, progreso, registros, guardado y zoom; filas del editor, altura del registro y restricciones de campos configurables; validación de aprobaciones y ejecuciones, con tamaños compactos e interacciones accesibles en cinco implementaciones.',fr:'Vérification des workflows : recherche, filtres, progression, journaux, sauvegarde et zoom indépendants ; lignes de l’éditeur, hauteur des journaux et contraintes des champs configurables ; résultats validés, dimensions compactes et interactions accessibles dans les cinq implémentations.',de:'Workflow-Freigabeprüfung: unabhängige Suche, Filter, Fortschritt, Protokolle, Speichern und Zoom; konfigurierbare Editorzeilen, Protokollhöhe und Feldregeln; validierte Freigaben und Ausführungsergebnisse sowie kompakte Größen und barrierefreie Interaktionen in fünf Implementierungen.'};
for(const[lang,value]of Object.entries(translations)){const path='website/assets/i18n/'+lang+'.json',data=JSON.parse(fs.readFileSync(path,'utf8'));data[key]=value;fs.writeFileSync(path,JSON.stringify(data,null,2)+'\n');}
const notes=['必填与字段约束、条件步骤、跳过和完成一致性、焦点跟随、进度/保存开关','线性/自由导航、受控回写、键盘导航、步骤焦点与窄容器排版','依赖与撤销级联、禁用任务进度计算、进度开关','顺序/并行审批、确认决定不可回退、错误保留意见、审批人动态更新','有向无环图、连线校验、删除选择清理、缩放/保存开关、文案覆盖','搜索/筛选独立开关、分页、重试/取消必须返回实际确认状态','可配置日志高度/显示、步骤与日志视图、禁用运行入口同步','Cron/事件校验、字段长度/步长/占位/行数、复选框单次提案'];
fs.writeFileSync('docs/workflow/release-review/inventory.json',JSON.stringify(Object.entries(workflowModes).map(([name,variants],i)=>({name,variants,frameworks:['css','vue','react','angularjs','blazor'],review:notes[i]})),null,2)+'\n');
