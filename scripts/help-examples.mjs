import {helpModes} from '../packages/css/src/js/help.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const articles=[{id:'invite',title:'邀请成员',description:'在项目设置中选择成员，通过邀请链接加入工作空间。',category:'协作',href:'#help-intro',keywords:['团队','权限']},{id:'export',title:'导出项目',description:'打开项目菜单，选择 JSON 或 CSV。导出内容受你的访问权限限制。',category:'数据',href:'#help-intro',keywords:['备份','下载']},{id:'restore',title:'恢复历史版本',description:'在版本记录中预览快照，确认内容后恢复。',category:'数据',href:'#help-intro'},{id:'access',title:'管理访问权限',description:'管理员可分配只读、编辑和管理权限。',category:'协作',href:'#help-intro'}];
const content={
 tip:['保存提示','按 Ctrl + S 保存当前修改；离开前可查看保存状态。'],
 'inline-hint':['文件格式','支持 CSV 和 JSON，单个文件不超过 20 MB。'],
 'help-text':['邀请链接有效期','链接在 7 天后失效，你可以随时撤销并重新创建。'],
 'help-trigger':['什么是访问权限？','只读成员可以查看和导出；编辑成员可以修改项目内容。'],
 'rich-tooltip':['自动保存','停止输入后将保存草稿。你仍可手动保存当前版本。'],
 'help-popover':['共享项目','任何持有链接的人都可按你选择的权限访问。请先确认可见范围。'],
 'definition-help':['工作空间','工作空间是一组项目、成员和权限设置的集合。'],
 callout:['操作前请确认','恢复历史版本会生成一个新版本，当前版本仍保留在历史记录中。'],
 note:['使用说明','只读成员无法修改工作空间设置。如需权限，请联系项目管理员。'],
 'guidance-pair':['让说明更容易理解','使用具体的动作和结果，避免无法操作的泛泛建议。'],
 'key-hint':['快速检索','打开全局命令面板'],
 'shortcut-list':['常用快捷键','输入命令名称，查找对应的键盘操作。'],
 'help-card':['快速开始','用几分钟完成项目设置，邀请成员并创建第一项任务。'],
 'help-panel':['当前页面帮助','了解项目状态、数据导出和访问权限的区别。'],
 'help-center':['帮助中心','搜索操作指南，快速找到你需要的答案。'],
 'help-topics':['浏览主题','按主题阅读项目协作和数据管理说明。'],
 faq:['常见问题','找不到答案时，可通过项目帮助入口联系管理员。'],
 'contextual-help':['为什么无法提交？','请先填写项目名称并至少选择一位负责人。'],
 'coach-mark':['创建第一个项目','逐步了解项目工作区。'],
 spotlight:['认识项目操作区','高亮目标并阅读当前操作说明。'],
 hotspot:['版本记录','查看最近修改并比较历史版本。'],
 'feature-hint':['新增版本比较','现在可以比较任意两个历史版本，快速找到变更内容。'],
 'whats-new':['最近更新','查看本次发布新增的能力和调整。'],
 'help-checklist':['项目上线准备','完成以下设置，确保团队能够顺利开始工作。'],
 troubleshooting:['无法同步的排查步骤','按顺序检查网络、权限和项目状态。'],
 'help-feedback':['这篇说明有帮助吗？','你的意见能帮助我们改进文档内容。'],
 'tour-spotlight':['项目入门引导','依次了解创建、协作和导出。'],
 'help-search':['搜索操作指南','支持标题、说明和关键词检索。'],
 'help-glossary':['产品术语表','理解项目中的常见概念。']
};
export function helpFixture(kind,mode=helpModes[kind][0]){
 const [title,description]=content[kind],options={kind,mode,title,description,items:[],size:mode==='compact'?'small':'medium',bordered:mode!=='borderless'};
 if(['help-center','help-search','help-topics','help-panel'].includes(kind))options.items=articles.map(item=>({...item}));
 if(kind==='help-topics'||kind==='help-center')options.columns=2;
 if(kind==='faq')options.items=[{id:'invite',title:'如何邀请新成员？',answer:'打开项目设置 → 成员管理，选择邀请成员。可设置只读或编辑权限。'},{id:'export',title:'支持哪些导出格式？',answer:'支持 CSV 与 JSON。CSV 适合电子表格，JSON 保留完整的数据结构。'},{id:'restore',title:'删除后还能恢复吗？',answer:'在回收站保留期内可以恢复。永久删除后无法恢复。'}];
 if(kind==='shortcut-list')options.items=[{id:'search',title:'搜索命令',description:'查找页面和操作。',keys:mode==='grouped'?['⌘','K']:['Ctrl','K'],category:'导航'},{id:'save',title:'保存草稿',keys:['Ctrl','S'],category:'编辑'},{id:'undo',title:'撤销修改',keys:['Ctrl','Z'],category:'编辑'}];
 if(kind==='help-glossary')options.items=[{id:'workspace',term:'工作空间',description:'一组项目、成员和权限设置的集合。',category:'组织'},{id:'role',term:'角色',description:'一组允许执行的操作，例如查看、编辑或管理。',category:'组织'},{id:'snapshot',term:'快照',description:'某一时刻项目内容的只读副本，可用于比较和恢复。',category:'版本'}];
 if(kind==='help-checklist')options.items=[{id:'name',title:'填写项目信息',description:'添加名称、描述和负责人。'},{id:'team',title:'邀请协作成员',description:'确认每位成员的权限。'},{id:'backup',title:'设置备份计划',description:'选择备份频率与保留时间。'}];
 if(kind==='help-checklist')options.defaultValue={completed:['name']};
 if(kind==='whats-new')options.items=[{id:'compare',title:'版本比较',description:'在同一视图中查看版本之间的内容变化。',date:'2026-09-07',category:'新增'},{id:'search',title:'帮助检索',description:'按主题搜索常见问题和操作指南。',date:'2026-09-07',category:'新增'},{id:'focus',title:'键盘操作',description:'改善焦点提示与引导关闭后的焦点返回。',date:'2026-09-06',category:'改进'}];
 if(['tour-spotlight','coach-mark','spotlight'].includes(kind))options.items=[{id:'create',title:'创建项目',description:'从这里创建项目，填写项目名称和说明。',target:'[data-help-demo-target="'+kind+'-create"]'},{id:'team',title:'邀请成员',description:'选择成员角色并发送邀请链接。',target:'[data-help-demo-target="'+kind+'-team"]'},{id:'export',title:'导出内容',description:'将项目内容下载为 CSV 或 JSON。',target:'[data-help-demo-target="'+kind+'-export"]'}];
 if(kind==='troubleshooting')options.items=[{id:'network',title:'检查网络',description:'确认设备能够访问服务地址，再重新尝试同步。'},{id:'permission',title:'确认权限',description:'检查当前账号是否拥有项目的编辑权限。'},{id:'state',title:'检查项目状态',description:'归档项目不可直接编辑，请先联系管理员恢复项目。'}];
 if(kind==='guidance-pair'){options.do='填写一个可识别的项目名称，例如「官网改版」。';options.dont='使用「新项目」「测试」等无法区分内容的名称。';}
 if(['help-card','help-panel','help-popover','contextual-help','feature-hint'].includes(kind))options.actions=[{id:'guide',label:'阅读操作指南',href:'#help-intro'},{id:'contact',label:'联系管理员'}];
 if(['help-trigger','rich-tooltip','help-popover','definition-help','hotspot'].includes(kind))options.triggerLabel=mode==='icon'?'?':mode==='text'?'查看帮助':kind==='hotspot'?'查看新功能':'了解更多';
 const cls={'rich-tooltip':'g-tooltip-rich','definition-help':'g-definition','tour-spotlight':'g-tour','help-search':'g-help-search-composition'}[kind]||'g-'+kind;
 const targets=['tour-spotlight','coach-mark','spotlight'].includes(kind)?`<div class="help-demo-targets"><button type="button" data-help-demo-target="${kind}-create">创建项目</button><button type="button" data-help-demo-target="${kind}-team">成员管理</button><button type="button" data-help-demo-target="${kind}-export">导出</button></div>`:'';
 const guideText='邀请成员：打开项目设置，选择成员管理，创建邀请链接并分配只读或编辑权限。导出内容：打开项目菜单，选择 CSV 或 JSON；只导出当前账号有权访问的数据。恢复版本：先在版本记录中预览快照，核对内容，再选择恢复。恢复后会生成新版本，原有历史仍保留。';
 const hasGuide=JSON.stringify(options).includes('#help-intro');
 if(hasGuide){for(const item of options.items)if(item.href==='#help-intro')item.href='#help-guide-'+kind;for(const action of options.actions||[])if(action.href==='#help-intro')action.href='#help-guide-'+kind;}
 const guide=hasGuide?`<details class="help-demo-guide"><summary>项目操作指南</summary><p id="help-guide-${kind}">${guideText}</p></details>`:'';
 return {options,html:`<div class="help-demo-host">${targets}<div class="${cls}" data-demo-component data-g-help data-g-help-options="${esc(JSON.stringify(options))}"></div>${guide}<output class="help-demo-result" aria-live="polite"></output></div>`};
}
export const helpVariants=Object.fromEntries(Object.entries(helpModes).map(([kind,modes])=>[kind,Object.fromEntries(modes.map(mode=>[mode,helpFixture(kind,mode)]))]));
export const helpExamples=Object.fromEntries(Object.keys(helpModes).map(kind=>[kind,helpFixture(kind).html]));
export const helpDemoCss='.help-demo-host{padding:16px;min-width:0;max-width:100%;font:14px/1.6 var(--g-font-sans,system-ui);color:var(--g-color-text)}.help-demo-targets{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}.help-demo-targets button{padding:6px 12px;border:1px solid var(--g-color-border);background:var(--g-color-surface);color:var(--g-color-text);border-radius:4px;font:inherit}.help-demo-result{display:block;margin-top:12px;overflow-wrap:anywhere;font-size:12px}';
