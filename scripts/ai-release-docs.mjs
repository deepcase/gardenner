import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';
const section=`
## 发布复查：参数与行为

本轮逐项复查现有 38 个组件、119 个变体。组件范围已覆盖输入、会话、运行、授权、产物、上下文和反馈；此次扩展现有接口，不新增功能重复的组件。

新增 18 项 aiOptions，CSS、Vue、React、AngularJS、Blazor 使用同一套运行时和类型合同：

| 参数 | 默认值与范围 | 适用场景 |
| --- | --- | --- |
| showHeader / showStatus | true | 全部组件的标题说明和顶层状态徽标；工具确认的决定状态始终可见 |
| showAuthor | true | 对话、工作区和消息的作者 |
| showCopy / showFeedback | true | 复制入口、对话消息评价；showActions=false 同时隐藏辅助操作 |
| showCount / showPause | true | 输入字数统计、流式回复暂停入口 |
| clearOnSend | true | 发送后清空草稿；false 保留输入；不自动移除附件 |
| composerRows / resize | 2（multiline 为 4）/ vertical | 输入 1–12 行；resize 支持 none、vertical |
| messageGap / sidebarWidth | 16 / 180 | 消息间距 0–48px；工作区侧栏 120–320px |
| treeIndent / codeHeight | 16 / 400 | 文件树每级缩进 8–32px；代码区最大高度 80–1200px |
| imageRatio / imageFit | 16/9 / cover | 生成图片预览支持 16/9、4/3、1/1、auto；cover、contain |
| serviceTimeout | 60000 | 每次服务等待或流读取的无响应上限，0–600000ms；0 关闭超时；暂停期间已发出的读取仍受上限约束 |
| maxReasonLength | 2000 | 反馈说明长度 1–10000；状态写入与输入控件共同校验 |

显式 mode、size、format、status 优先于变体默认值；aiSize 等显式根属性仍优先。small / medium / large 使用 12 / 14 / 14px 正文、28 / 32 / 36px 操作控件，触摸指针下最小 44px。标题为 16px；网格和侧栏按容器宽度收拢，窄屏不覆盖 height 参数。

### 修复的接入边界

- 生成、工具确认、反馈和语音回调都能在取消、销毁、服务替换或超时后结束返回的 Promise；过期结果不会触发完成事件。
- 只读切换取消进行中的任务；被 beforechange 拒绝的会话切换不取消当前任务；被拒绝的最终状态不报告成功。
- 模型选择同时更新 selected 和 model；保留新草稿与消息节点身份，避免流更新丢失焦点。
- 校验消息角色、附件开关、单文件限制、条目字段、孤立/循环目录、反馈长度与显示参数；无效 setOptions 保留此前配置。状态对象仅接收公开字段。
- 未作决定或已过期的工具确认不能借重试调用服务；URL 拒绝凭据和危险协议；只读输入和按钮外观与行为一致。

### 演示与边界

GardenerDemo 提供按组件适用范围显示的参数控件，预览支持 ai-参数名 查询串。CSS 的 ai-lab.html 覆盖全部变体；Blazor /ai 使用真实 Razor 组件、动态参数和受控状态。生成服务播放预录文本，确认、反馈及语音用本地模拟回调；“仅发送事件”展示未接服务状态。应用须注入真实服务、执行权限检查和上传处理；演示不代表后端服务已接通。

本轮扩展使 AI 源模块从约 45.6KB 增至约 49.8KB，固定模块上限从 48KB 调整到 54KB。平台压缩包预算仅增加 Web gzip 和 Desktop Brotli 各 1KB；原始体积和整包上限保持不变。实际产物、测试结果与逐项复查见 [验证报告](verification.md)。
`;
const p='docs/ai/README.md',base=fs.readFileSync(p,'utf8').split('\n## 发布复查：参数与行为')[0];await writeFile(p,base+section);
const inventory=JSON.parse(fs.readFileSync('docs/ai/inventory.json'));for(const item of inventory.items){item.releaseReview={scope:'运行时、参数、变体、CSS、五端、演示和文档',result:'已修复并纳入全部变体浏览器验证',newComponentNeeded:false};}await writeFile('docs/ai/release-review/inventory.json',JSON.stringify(inventory,null,2));
const key='AI 发布复查新增 18 项参数，覆盖消息操作、输入区、布局、图片预览、服务超时和反馈长度。统一 28/32/36px 控件，修复取消、受控切换和模型选择，五端与演示同步。';
const web='website/docs.html';await writeFile(web,fs.readFileSync(web,'utf8').replace(/(<section id="ai-enhancements"[\s\S]*?)(<\/section>)/,(_,body,end)=>body.includes(key)?body+end:body+'<p>'+key+'</p>'+end));
const translations={en:'The AI release review adds 18 options for message actions, composers, layouts, image previews, service timeouts and feedback limits. Controls use 28/32/36px sizing. Cancellation, controlled conversation switching and model selection are fixed across all five implementations and demos.',ja:'AIの公開前検査で、メッセージ操作、入力、レイアウト、画像プレビュー、サービスの時間制限、評価文字数の18設定を追加しました。操作部品は28/32/36pxに統一し、取消、制御された会話切替、モデル選択を5実装とデモで修正しました。',ko:'AI 출시 점검에서 메시지 작업, 입력, 레이아웃, 이미지 미리 보기, 서비스 시간 제한과 피드백 길이를 위한 옵션 18개를 추가했습니다. 28/32/36px 컨트롤을 통일하고 취소, 제어 대화 전환과 모델 선택을 다섯 구현 및 데모에서 수정했습니다.',es:'La revisión de IA añade 18 opciones de mensajes, entrada, diseño, imágenes, tiempos de espera y límites de comentarios. Controles de 28/32/36px. Cancelación, cambio controlado de conversación y selección de modelo corregidos en las cinco implementaciones y demos.',fr:'La revue IA ajoute 18 options pour les messages, la saisie, la disposition, les images, les délais et la longueur des avis. Commandes de 28/32/36px. Annulation, changement de conversation contrôlé et sélection du modèle corrigés dans les cinq implémentations et démonstrations.',de:'Die KI-Prüfung ergänzt 18 Optionen für Nachrichten, Eingabe, Layout, Bildvorschau, Zeitlimits und Rückmeldungslänge. Steuerelemente messen 28/32/36px. Abbruch, kontrollierter Gesprächswechsel und Modellauswahl sind in allen fünf Implementierungen und Demos korrigiert.'};
for(const[locale,value]of Object.entries(translations)){const p='website/assets/i18n/'+locale+'.json',d=JSON.parse(fs.readFileSync(p));d[key]=value;await writeFile(p,JSON.stringify(d,null,2)+'\n');}
