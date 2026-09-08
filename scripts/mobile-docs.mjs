import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';import {mobileModes} from '../packages/css/src/js/mobile.js';import {mobileNames} from './mobile-examples.mjs';
const inv=JSON.parse(fs.readFileSync('docs/mobile/inventory.json')),before=JSON.parse(fs.readFileSync('docs/mobile/before.json'));for(const c of inv.items){c.before=before.find(v=>v.name===c.name);c.finding=(c.before.type==='css'?'原来只有静态样式。':'原来仅有局部行为。')+'完善 '+mobileNames[c.name]+' 的三种变体、数据、参数、受控状态与可操作演示。';}await writeFile('docs/mobile/inventory.json',JSON.stringify(inv,null,2)+'\n');
await writeFile('docs/mobile/README.md',`# 移动端组件扩展

完整检查现有 33 个组件，提供 99 种变体。布局、导航、面板、手势、选择、业务入口与状态提示已覆盖移动应用常见需求。此次补齐缺失能力，没有增加重复名称；移动认证和结算组合复用 auth / commerce 运行时，避免产生第三套密码校验或金额规则。

## 五端接入

CSS 使用 data-g-mobile 和 data-g-mobile-options；Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 mobileOptions、mobileValue、mobileSize、mobileBordered、mobileDisabled。Options / Value 是 JSON 字符串，false 保留。数据模式子树由共享运行时管理，参数改变保留实例，销毁恢复作者原始 DOM；原有静态类与旧行为仍可独立使用。

~~~js
const config = {
 mobileOptions: JSON.stringify({kind:'mobile-picker',multiple:true,maxSelected:2,
   items:[{id:'a',title:'选项 A'},{id:'b',title:'选项 B'},{id:'c',title:'暂不可用',disabled:true}]}),
 mobileValue: JSON.stringify({selected:['a']}),mobileDisabled:false
};
function writeBack(value) { config.mobileValue=JSON.stringify(value); }
// Vue: <GMobilePicker :config="config" @update:model-value="writeBack" />
// React: <GMobilePicker config={config} onValueChange={writeBack} />
// AngularJS: <div g-mobile-picker gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GMobilePicker Config="Config" ValueChanged="WriteBack" />
~~~

完整样式已包含全部扩展。按需使用 core.css + component/mobile-compositions.css；mobile-auth 额外加载 auth-compositions，mobile-checkout 额外加载 commerce-compositions。业务组合的 auth / commerce 参数结构分别见 [认证](../auth/README.md) 与 [电商](../commerce/README.md)。五端使用相同样式、变体、状态与控制器。

## 参数

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| kind / mode | kind 必需 / 第一个变体 | 见完整清单；显式 JSON mode 优先，否则使用 variant |
| title / description / message / actionLabel / labels | 可覆盖 | 标题、说明、提示、操作名与控件本地化；文本安全渲染 |
| size / bordered | medium / true | small、medium、large；12/14/14px 内容字；标题 16px，默认触摸按钮 44px、大尺寸 48px |
| safeArea / direction | true / ltr | CSS env 安全区，RTL；输入 16px 保留移动输入可读性和页面缩放 |
| position | inline | inline、sticky、fixed；固定模式用于独立顶层页面，演示默认在容器内 |
| disabled / readonly | false | 禁止业务交互与状态修改；已经打开的面板仍保留退出操作 |
| items / actions | []，最多 500 项 | 唯一字符串 id，title、description、image、alt、badge、icon、disabled；actions 可 danger 确认；分类项可 children |
| fields | [] | id、title、type、value、required、disabled、readonly、placeholder、minLength、maxLength、min、max、step、rows、autocomplete、inputMode、options；支持 text/email/tel/number/textarea/select；密码用 mobile-auth |
| columns | [] | id、title、items；滚轮/native 两种输入，禁用项跳过；父子联动由宿主替换 columns |
| multiple / maxSelected | false / 100，1–500 | 单/多选，筛选草稿、批量选择与选择上限 |
| allowSwipe / threshold | true / 64px，20–200 | 横向切换与滑动操作；下拉使用 0.55 阻尼后比较阈值，顶部才能刷新 |
| loop | false | 轮播/媒体首尾边界或循环切换 |
| snapPoints / snap | [0.4,0.7,1] / 1 | 底部面板视口比例，1–5 个递增比例；拖动关闭与可访问的高度滑块 |
| dismissible / closeOnBackdrop | true / true | Escape、手势与背景关闭；显式关闭按钮始终可用 |
| hasMore / autoLoad | true / false | 自动模式由交叉观察器加载；同一批数据只自动请求一次，失败后显式重试 |
| status / requestTimeout | idle / 30000ms | loading/error/success；1–300000ms；取消、超时和数据变更使迟到结果失效 |
| duration | 5000ms | 轻提示自动关闭；0 或 persistent 持续展示；焦点、悬停、后台页面暂停 |
| online | auto | auto 监听浏览器 online/offline，也可明确 online/offline；连接状态不代表后端可达 |
| min / max / step / priceLabel | 1 / 99 / 1 / 可选 | 购买栏整数数量与展示价格；实际报价与购买由业务服务确认 |
| auth / commerce | 可选 | 移动认证/结算透传对应完整参数，公开 value 使用对应模块结构 |
| defaultValue / mobileValue | 可选 | 非受控初值 / 受控 JSON，change 是状态提案，由宿主回写 |

普通公开 value：active、selected、fields、columns、query、open、revealed、index、quantity、zoom、rotation、snap。无效/禁用选项清理，数量遵循 min/step 网格，索引与缩放有边界。筛选取消丢弃草稿，确认才修改公开选择。

## 异步与系统能力

~~~js
const api=Gardenerim.getInstance(root,'mobile');
root.addEventListener('gardener:action', async event => {
 const d=event.detail;
 if(event.target!==root || d.behavior!=='mobile' || !d.requestId || d.phase==='result')return;
 const credentials=api.takeCredentials(d.requestId); // 仅 mobile-auth，至多一次
 try {
   const result=await yourService(d.action,d.value,credentials);
   if(api.resolve(d.requestId,{status:'success',message:'完成'})) {
     if(d.action==='load') api.setOptions({items:result.items,hasMore:result.hasMore});
   }
 } catch {api.resolve(d.requestId,{status:'error',message:'操作失败，请重试'});}
 finally {if(credentials)for(const key of Object.keys(credentials))credentials[key]='';}
});
~~~

实例提供 refresh / setOptions / setValue / getState / request / resolve / cancel / open / close / next / previous。mobile-auth 额外通过 takeCredentials / runPasskey 复用认证凭据处理；mobile-checkout 通过 getTotals 返回共享整数金额汇总。beforechange 可取消；重复请求、取消/超时后的旧结果不能更新 UI。外部网络请求的取消与真实授权由宿主负责。

权限提示仅发送 location / camera / notifications 请求，演示不会索取真实系统权限。应用可在用户点击触发的 action 中调用原生能力并回传授权/拒绝结果。购买、删除、导航、消息和认证均由宿主执行业务，不把演示状态当作真实操作。

底部面板与全屏查看器使用 [原生 showModal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)，管理背景不可交互、焦点与关闭返回。键盘避让监听 [VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport)，仅在编辑器聚焦、页面没有缩放时计算布局/可视视口差，不接管全局键盘或阻止页面缩放。不同实体设备的浏览器工具栏和输入法仍应做项目级验收。

## 发布复查扩展参数

| 参数 | 默认 / 范围 | 说明 |
| --- | --- | --- |
| showHeader | true | 原生组件标题与说明；弹层保留可访问名称，认证/结算使用各自嵌套配置 |
| showStatus | true | 原生状态文本；false 仅视觉隐藏，保留辅助技术播报 |
| showClear | true | 搜索清除按钮 |
| showControls | true | 卡片轮播前后按钮；仍可用圆点、手势、实例 API |
| showSelectionCount | true | 选择器、批量选择的计数 |
| editorRows | 3，1–30 | 文本域默认行数，field.rows 可单独覆盖 |
| scrollMaxHeight | 300，80–2000px | 下拉刷新列表内部滚动上限 |
| imageFit | contain | contain / cover / fill / none / scale-down |
| sheetHeight | 0.7，0.1–1 | 普通面板视口比例；full 与 fullscreen 为 1，snap 使用 snapPoints |
| sheetMaxWidth | 640，280–1600px | 弹层最大宽度，不超过可用视口 |
| targetSize | null，28–64px | null 跟随尺寸，默认 44px、大尺寸 48px；较小值用于嵌入环境，应按项目触摸需求选取 |

字段 disabled / readonly 默认 false，minLength 为 0–100000，maxLength 为 1–100000；min/max 是有限数字，step 为正数，rows 为 1–30。提交校验长度、数字范围与步长、有效下拉选项；只读或禁用字段不参与编辑与校验。受控文本通过 input / compositionend 提交，失焦不重复触发。外部状态、业务配置或组件种类切换后，旧请求结果失效。

原生请求仅接受对应的业务操作名。成功或失败回包必须为对象并提供有效 status；异常结构会结束等待、触发错误且 resolve 返回 false，允许重试。认证和结算继续使用各自的完整服务协议。销毁后实例操作不再修改节点。

当前 33 个组合已覆盖移动端结构、导航、面板、手势、输入和业务入口，本次通过参数扩展，不增加重复组件。最新检查证据见 [发布复查](verification.md)。

## 全部组件与变体

| 组件 | 中文 | 变体 |
| --- | --- | --- |
${Object.entries(mobileModes).map(([k,v])=>'| '+k+' | '+mobileNames[k]+' | '+v.join(' / ')+' |').join('\n')}

## 演示与验证

- [GardenerDemo 移动端目录](http://127.0.0.1:4180/?component=mobile#catalog)：全部组件、变体、尺寸、RTL、只读、安全区、多选、手势阈值、循环、空数据和模拟服务结果。
- [CSS 完整演示](../../packages/css/examples/mobile-lab.html)，Blazor 示例 /mobile。
- [逐项清单](inventory.json) · [五端一致性](parity.json) · [验证记录](verification.md)。
`);
for(const pkg of ['css','vue','react','angularjs','blazor']){const p='packages/'+pkg+'/README.md';let s=fs.readFileSync(p,'utf8').replace(/\b85(?=\s*(?:种|个|behaviors))/g,'86').replace(/\b57(?=\s*(?:个静态|static assets))/g,'58');if(!s.includes('## 移动端组件扩展'))s+='\n## 移动端组件扩展\n\n33 个组件、99 个变体，统一 mobileOptions / mobileValue；触摸与键盘、安全区、面板、选择器、异步状态及认证/结算复用。[参数与逐项清单](../../docs/mobile/README.md)。\n';await writeFile(p,s);}
const keys=['移动端：触摸、面板与应用组合','33 个移动端组件提供 99 个变体，覆盖安全区、底部面板、刷新加载、手势、选择器、键盘避让及业务组合。','五端共用 mobileOptions、mobileValue 与移动运行时；支持受控状态、触摸与键盘、异步结果和认证/结算复用。','完整移动端演示','移动端五端参数与逐项检查'];const p='website/docs.html';let s=fs.readFileSync(p,'utf8');if(!s.includes('id="mobile-enhancements"'))s=s.replace('<section id="auth-enhancements"',`<section id="mobile-enhancements" class="docs-section"><h2>${keys[0]}</h2><p>${keys[1]}</p><p>${keys[2]}</p><p><a href="../packages/css/examples/mobile-lab.html">${keys[3]}</a></p><p><a href="../docs/mobile/README.md">${keys[4]}</a></p></section>\n<section id="auth-enhancements"`);await writeFile(p,s);
const t={en:['Mobile: touch, sheets and application views','33 mobile components offer 99 variants for safe areas, bottom sheets, refresh and loading, gestures, pickers, keyboard avoidance and application views.','All five implementations share mobileOptions, mobileValue and the mobile runtime, with controlled state, touch and keyboard input, asynchronous results, and shared authentication and checkout.','Complete mobile examples','Mobile parameters and audit for five implementations'],ja:['モバイル：タッチ、パネルとアプリ画面','33 コンポーネントと 99 バリアントで、セーフエリア、ボトムシート、更新と読み込み、ジェスチャー、選択、キーボード回避、アプリ画面に対応。','5 実装で mobileOptions、mobileValue と実行機能を共有。制御状態、タッチとキーボード、非同期結果、認証と購入手続きの共有に対応します。','モバイルの全サンプル','5 実装のモバイルパラメーターと検査'],ko:['모바일: 터치, 패널 및 앱 화면','모바일 컴포넌트 33개와 변형 99개로 안전 영역, 하단 패널, 새로 고침과 로딩, 제스처, 선택기, 키보드 회피 및 앱 화면을 지원합니다.','다섯 구현이 mobileOptions, mobileValue와 모바일 런타임을 공유하며 제어 상태, 터치와 키보드, 비동기 결과 및 인증과 결제를 지원합니다.','전체 모바일 예제','다섯 구현의 모바일 매개변수와 검사'],es:['Móvil: interacción táctil, paneles y vistas de aplicación','33 componentes móviles ofrecen 99 variantes para áreas seguras, paneles inferiores, actualización y carga, gestos, selectores, adaptación al teclado y vistas de aplicación.','Las cinco implementaciones comparten mobileOptions, mobileValue y las funciones móviles, con estado controlado, entrada táctil y teclado, resultados asíncronos y autenticación y compras compartidas.','Ejemplos móviles completos','Parámetros y revisión móvil para cinco implementaciones'],fr:['Mobile : interaction tactile, panneaux et vues applicatives','33 composants mobiles proposent 99 variantes pour les zones sûres, panneaux inférieurs, actualisation et chargement, gestes, sélecteurs, adaptation au clavier et vues applicatives.','Les cinq implémentations partagent mobileOptions, mobileValue et les fonctions mobiles, avec état contrôlé, saisie tactile et clavier, résultats asynchrones et authentification et commandes partagées.','Exemples mobiles complets','Paramètres et audit mobile pour cinq implémentations'],de:['Mobil: Touch, Bedienfelder und Anwendungsansichten','33 mobile Komponenten bieten 99 Varianten für sichere Bereiche, untere Bedienfelder, Aktualisierung und Laden, Gesten, Auswahlfelder, Tastaturanpassung und Anwendungsansichten.','Alle fünf Implementierungen teilen mobileOptions, mobileValue und die mobilen Funktionen mit gesteuertem Zustand, Touch und Tastatur, asynchronen Ergebnissen sowie gemeinsamer Anmeldung und Kaufabwicklung.','Vollständige mobile Beispiele','Mobile Parameter und Prüfung für fünf Implementierungen']};for(const [locale,values]of Object.entries(t)){const p='website/assets/i18n/'+locale+'.json',d=JSON.parse(fs.readFileSync(p));keys.forEach((k,i)=>d[k]=values[i]);await writeFile(p,JSON.stringify(d,null,2)+'\n');}
await writeFile('scripts/sync-website-inventory.mjs',fs.readFileSync('scripts/sync-website-inventory.mjs','utf8').replace('82|83|84)','82|83|84|85)').replace("g,'85'","g,'86'").replace('54|55|56)','54|55|56|57)').replace("g,'57'","g,'58'"));
