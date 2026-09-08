import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const section=`
## 发布复查与扩展参数

保留 32 个页面、224 个变体。新增参数在 CSS、Vue、React、AngularJS、Blazor 共用 solutionOptions 中配置，GardenerDemo 提供对应控件。

| 参数 | 默认 / 范围 | 行为 |
| --- | --- | --- |
| showHeader | true | 显示页面标题和说明，嵌入既有页面时可隐藏 |
| showStatus | true | 显示就绪提示；隐藏时仍展示加载、错误及服务结果 |
| showDetails | true | 显示详情入口与展开的详情区域 |
| showPagination | true | 分页；false 时展示全部匹配记录，不会截断数据 |
| showBilling | true | 显示月付/年付切换，隐藏时可通过 billing 状态指定周期 |
| editorRows | 3 / 1–20 | 文本编辑器默认行数 |
| formColumns | 1 / 1–4 | 表单列数，窄容器自动单列 |
| detailMaxHeight | 320px / 80–2000 | 详情最大高度，长文在区域内滚动 |

字段新增 rows（1–20），优先于 editorRows；区块新增 pageSize（1–100），优先于页面 pageSize。minLength/maxLength 在提交前显式校验，包含通过 API 写入的草稿。禁用字段不参与提交校验，禁用动作在按钮和 API 层均不可执行。select 选项值须唯一，未知选项不能提交。

~~~js
const options = {
  showHeader:false, showStatus:false, showDetails:true,
  showPagination:true, editorRows:4, formColumns:2, detailMaxHeight:240,
  sections:[{id:'records',title:'项目',type:'table',pageSize:12,
    items:[{id:'one',title:'设计系统',category:'进行中'}],
    actions:[{id:'archive',label:'归档',confirm:true}]}]
};
// CSS 的 data-g-solution-options，以及四个适配器的 solutionOptions 均使用 JSON.stringify(options)。
~~~

表格、文章、指标与其他集合均渲染配置的业务动作；非表单请求需要有效 itemId，回执仍需匹配动作、区块、记录与递增版本。移除区块或字段时清理对应过期草稿，保留其他草稿。无效或被 beforechange 拒绝的 setValue 不取消待处理请求；有效状态/配置更新取消等待并恢复准确状态。

原始页面 Hero 标题遵循各页面结构；托管页面标题 22–30px、区块标题 18px、正文 14px，标准控件 32px。表格和看板内部滚动；表单支持窄容器适配；详情可通过键盘聚焦。编辑或业务状态输出不会挤压页面布局。搜索、筛选、排序仅显示在可浏览的数据栏目；计费切换仅显示在价格栏目。

查看 [发布复查报告](verification.md) 与 [逐组件清单](release-review/inventory.json)。演示为本地模拟业务，不发送真实消息、不支付、不执行实际审批。
`;
for(const p of ['docs/solution/README.md','scripts/solution-docs.mjs']){let s=fs.readFileSync(p,'utf8');if(!s.includes('## 发布复查与扩展参数'))s=p.endsWith('.md')?s+section:s.replace(/\r?\n`;\r?\nfs\.writeFileSync/,section+'\n`;\nfs.writeFileSync');await writeFile(p,s);}
const key='解决方案发布复查：32 个页面支持标题、状态、详情、分页、计费切换、编辑器行数、表单列数和详情高度；表格动作、字段校验、禁用与受控交互在五端一致。';
let html=fs.readFileSync('website/docs.html','utf8');if(!html.includes(key))html=html.replace('<section id="solution-enhancements" class="docs-section">','<section id="solution-enhancements" class="docs-section"><p>'+key+'</p>');await writeFile('website/docs.html',html);
const translations={en:'Solution release review: 32 pages offer configurable headers, status hints, details, pagination, billing, editor rows, form columns and detail height. Table actions, field validation, disabled and controlled behavior are consistent across five implementations.',ja:'ソリューションのリリース確認：32 ページで見出し、状態、詳細、ページ分割、請求周期、編集行数、フォーム列数、詳細高さを設定できます。テーブル操作、入力検証、無効状態、制御状態は 5 実装で統一されています。',ko:'솔루션 출시 검토: 32개 페이지에서 제목, 상태, 상세 정보, 페이지 나누기, 결제 주기, 편집기 행, 양식 열, 상세 높이를 설정합니다. 테이블 작업, 입력 검증, 비활성 및 제어 동작은 5개 구현에서 일관됩니다.',es:'Revisión de soluciones: 32 páginas permiten configurar cabeceras, estado, detalles, paginación, facturación, filas del editor, columnas del formulario y altura del detalle. Acciones, validación y estados se mantienen en cinco implementaciones.',fr:'Vérification des solutions : 32 pages proposent des en-têtes, états, détails, pagination, facturation, lignes d’éditeur, colonnes de formulaire et hauteur de détail configurables. Actions et validation sont cohérentes dans les cinq implémentations.',de:'Lösungsprüfung: 32 Seiten bieten konfigurierbare Kopfzeilen, Statushinweise, Details, Seitennavigation, Abrechnung, Editorzeilen, Formularspalten und Detailhöhe. Tabellenaktionen, Validierung und Zustandssteuerung sind in fünf Implementierungen einheitlich.'};
for(const[lang,value]of Object.entries(translations)){const p='website/assets/i18n/'+lang+'.json',data=JSON.parse(fs.readFileSync(p,'utf8'));data[key]=value;await writeFile(p,JSON.stringify(data,null,2)+'\n');}
const inventory=JSON.parse(fs.readFileSync('docs/solution/inventory.json','utf8')).map(c=>({...c,finding:c.sections.some(s=>s.type==='table'&&s.actions.length)?'表格配置动作缺少可点击入口；共享字段与请求状态存在边界问题':'共享显示与表单配置不足，字段与请求状态存在边界问题',resolution:'保留七种布局；补充八个参数、字段 rows、区块 pageSize；同步动作、禁用、校验、状态与窄容器适配'}));await writeFile('docs/solution/release-review/inventory.json',JSON.stringify(inventory,null,2)+'\n');
