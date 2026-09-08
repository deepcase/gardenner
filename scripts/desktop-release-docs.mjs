import fs from 'node:fs';import {desktopModes} from '../packages/css/src/js/desktop.js';import {desktopNames} from './desktop-examples.mjs';
const rows='| showFilter / showProgress / showStatus | true；独立显示筛选、进度及就绪提示；隐藏就绪提示不会隐藏加载、失败和服务结果 |\n| showReset / showPin | true；偏好重置和文档固定入口，可按场景隐藏 |\n| editorRows / outputMaxHeight | 3（1–20）/ 240px（80–2000）；编辑器行数及代码、底部输出最大高度 |\n| windowActions | minimize、maximize、restoreWindow、close、drag；同时约束窗口按钮与 API，可传空数组 |\n';
const section=`
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
`;
for(const p of ['docs/desktop/README.md','scripts/desktop-docs.mjs']){let s=fs.readFileSync(p,'utf8');if(!s.includes('| showFilter / showProgress / showStatus |'))s=s.replace('| requestTimeout / maxLength |',rows+'| requestTimeout / maxLength |');if(!s.includes('## 发布复查'))s=p.endsWith('.md')?s+section:s.replace('\n`);',section+'\n`);');fs.writeFileSync(p,s);}
const key='桌面端发布复查：38 个组件共享紧凑尺寸与窄容器布局，支持筛选、进度、就绪提示、重置、固定、窗口操作及编辑器配置；宿主响应、禁用菜单和键盘行为已统一校验。';
let html=fs.readFileSync('website/docs.html','utf8');if(!html.includes(key))html=html.replace('<section id="desktop-enhancements" class="docs-section">','<section id="desktop-enhancements" class="docs-section"><p>'+key+'</p>');if(!html.includes(key))throw Error('Missing desktop website section');fs.writeFileSync('website/docs.html',html);
const translations={en:'Desktop release review: 38 components share compact sizing and narrow-container layouts, configurable filters, progress, ready hints, reset, pinning, window actions and editors, with validated host responses, disabled menus and keyboard behavior.',ja:'デスクトップのリリース確認：38 コンポーネントでコンパクトな寸法と狭いコンテナーのレイアウトを共有。フィルター、進捗、準備状態、リセット、固定、ウィンドウ操作、エディターを設定でき、ホスト応答、無効メニュー、キーボード操作を検証しました。',ko:'데스크톱 출시 검토: 38개 구성 요소가 간결한 크기와 좁은 컨테이너 레이아웃을 공유합니다. 필터, 진행률, 준비 표시, 초기화, 고정, 창 작업, 편집기를 설정하고 호스트 응답, 비활성 메뉴, 키보드 동작을 검증했습니다.',es:'Revisión de escritorio: 38 componentes comparten tamaños compactos y contenedores estrechos, con filtros, progreso, avisos, restablecimiento, anclaje, acciones de ventana y editores configurables; se validaron las respuestas del host, los menús deshabilitados y el teclado.',fr:'Vérification du bureau : 38 composants partagent des dimensions compactes et des conteneurs étroits, avec filtres, progression, indication de disponibilité, réinitialisation, épinglage, actions de fenêtre et éditeurs configurables ; réponses de l’hôte, menus désactivés et clavier validés.',de:'Desktop-Freigabeprüfung: 38 Komponenten teilen kompakte Größen und schmale Container; Filter, Fortschritt, Bereitschaftshinweise, Zurücksetzen, Anheften, Fensteraktionen und Editoren sind konfigurierbar. Host-Antworten, deaktivierte Menüs und Tastaturverhalten wurden geprüft.'};for(const[lang,value]of Object.entries(translations)){const p='website/assets/i18n/'+lang+'.json',data=JSON.parse(fs.readFileSync(p,'utf8'));data[key]=value;fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n');}
const changes={'desktop-command-palette':'搜索开关、父级禁用传播、唯一命令 ID','desktop-document-tabs':'固定开关、显式变体、RTL 方向、关闭确认一致性','desktop-preferences':'重置开关、编辑器/字段选项、非法字段值拒绝','background-task-center':'确认状态与请求匹配、进度开关、筛选开关','desktop-notification-center':'已读及移除结果校验、分组连续性','desktop-session-manager':'删除回包校验、分组/分页与显示参数','desktop-problems-panel':'修复回包校验、筛选可配置','recent-documents':'分页前分组、固定开关','desktop-inspector-panel':'字段长度、占位、行数与保存校验'};
const old=fs.readFileSync('docs/desktop/README.md','utf8');fs.writeFileSync('docs/desktop/release-review/inventory.json',JSON.stringify(Object.entries(desktopModes).map(([name,variants])=>({name,title:desktopNames[name],variants,capabilities:old.split('\n').find(l=>l.includes(' · '+name+' |'))?.split('|')[3]?.trim(),frameworks:['css','vue','react','angularjs','blazor'],review:changes[name]||'检查全部变体、参数、键盘、禁用与受控交互，同步共享响应校验、密度、状态提示及容器布局'})),null,2)+'\n');
