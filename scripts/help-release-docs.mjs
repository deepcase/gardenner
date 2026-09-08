import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const doc=`
## 发布复查与扩展参数

本轮复查现有 29 个组件、99 个变体。说明、检索、FAQ、快捷键、引导、术语表与反馈已覆盖帮助场景；本轮扩展现有接口，不新增功能重复的组件。

| 新参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| showHeader / showActions | true | 主内容标题说明与自定义操作；浮层与引导保留必要的可访问标题 |
| showProgress / showCount / showClear | true | 清单/引导进度、检索结果数量、清除入口 |
| showPrevious / showStepList | true | 引导和排障上一步入口、排障步骤目录 |
| arrow / closeOnEscape / closeOnOutside | true | 浮层箭头、Escape 关闭（含引导）、外部点击关闭浮层；独立于跳过按钮的 dismissible |
| serviceTimeout | 60000；0–600000ms | 单次检索/反馈等待上限，0 不限时；取消、销毁、超时均结束等待并忽略旧结果 |
| maxReasonLength | 2000；1–10000 | 反馈原因字符上限；输入和受控状态共同校验 |
| minQueryLength | 0；0–100 | 远程检索最低字符数；本地筛选不受此门槛影响 |
| tourPadding / offset | 6 / 8；0–48 / 0–64px | 引导目标周围留白、浮层与目标间距 |
| openDelay / closeDelay | 100 / 120；0–2000ms | 悬停打开/关闭延迟 |
| maxHeight | 不限；80–1200px | 条目列表最大高度，内部滚动区可键盘聚焦 |

新增共 18 项 helpOptions。helpValue 新增 reason，使反馈说明可由 Vue、React、AngularJS、Blazor 或纯 JS 宿主控制。完整类型位于 packages/css/src/types/help.d.ts；五端 Options/Value JSON 合同一致。

显式 mode、size、bordered、placement、animated 优先于变体默认值，helpSize 等根属性仍优先。默认 small/medium/large 使用 12/14/14px 正文、16px 标题、28/32/36px 按钮和检索控件；FAQ 默认行高 40px；触摸目标至少 44px。列表与双列建议在窄容器收为单列。

修复无 href 操作被渲染为错误链接、带凭据 URL、参数原型键和错误字段、无效 setOptions 污染后续配置、异步取消无法结束、服务超时、外观更新中断服务、中文输入法期间重建输入、受控反馈原因缺失、只读反馈仍可提交、排障跳到禁用步骤，以及结束引导重复守卫。检索输入保持节点身份和焦点；已接入的服务在纯外观更新后继续执行。

GardenerDemo 提供按组件适用范围显示的参数面板，以及“仅事件 / 本地成功 / 失败后重试”服务模式。CSS 独立实验室和 Blazor /help 同样可切换本地服务。所有服务示例只操作本地数据，不发送外部消息；真实检索、存储和联系入口由应用接入。

帮助源模块固定上限从 33KB 调整为 38KB，以容纳扩展参数、校验与生命周期处理；实测与其他预算检查见 [验证报告](verification.md)。
`;
const p='docs/help/README.md';await writeFile(p,fs.readFileSync(p,'utf8').split('\n## 发布复查与扩展参数')[0]+doc);
const key='帮助发布复查新增 18 项参数，覆盖内容显示、浮层关闭策略、引导间距、服务超时与反馈长度。修复链接、中文输入、异步取消和受控反馈，统一紧凑比例，五端与演示同步。';const page='website/docs.html';await writeFile(page,fs.readFileSync(page,'utf8').replace(/(<section id="help-enhancements"[\s\S]*?)(<\/section>)/,(_,body,end)=>body.includes(key)?body+end:body+'<p>'+key+'</p>'+end));
const texts={en:'The help release review adds 18 options for content visibility, popup dismissal, tour spacing, service timeouts and feedback limits. Links, Chinese input, asynchronous cancellation and controlled feedback are fixed with consistent compact sizing across all five implementations and demos.',ja:'ヘルプの公開前検査で、表示、浮動パネルの終了、ガイドの間隔、サービス時間制限、評価文字数の18設定を追加。リンク、中国語入力、非同期取消、制御された評価を修正し、5実装とデモのコンパクトな寸法を統一しました。',ko:'도움말 출시 점검에서 표시, 팝업 닫기, 안내 간격, 서비스 시간 제한과 피드백 길이를 위한 옵션 18개를 추가했습니다. 링크, 중국어 입력, 비동기 취소와 제어 피드백을 수정하고 다섯 구현 및 데모의 크기를 통일했습니다.',es:'La revisión de ayuda añade 18 opciones de contenido, cierre de ventanas, espacio de guías, tiempos de espera y comentarios. Enlaces, entrada china, cancelación asíncrona y comentarios controlados corregidos con tamaños compactos uniformes en las cinco implementaciones y demos.',fr:'La revue de l’aide ajoute 18 options de contenu, fermeture, espacement des guides, délais et avis. Liens, saisie chinoise, annulation asynchrone et avis contrôlés corrigés avec des dimensions compactes uniformes dans les cinq implémentations et démonstrations.',de:'Die Hilfeprüfung ergänzt 18 Optionen für Inhalte, Schließen von Popups, Abstände, Zeitlimits und Rückmeldungen. Links, chinesische Eingabe, asynchroner Abbruch und kontrollierte Rückmeldungen sind mit einheitlichen kompakten Größen in allen fünf Implementierungen und Demos korrigiert.'};for(const[locale,text]of Object.entries(texts)){const p='website/assets/i18n/'+locale+'.json',d=JSON.parse(fs.readFileSync(p));d[key]=text;await writeFile(p,JSON.stringify(d,null,2)+'\n');}
