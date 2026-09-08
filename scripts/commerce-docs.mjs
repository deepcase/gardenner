import fs from 'node:fs';import {writeFile} from './fs-retry.mjs';import {commerceModes} from '../packages/css/src/js/commerce.js';import {commerceNames} from './commerce-examples.mjs';
const groups={
 '商品与规格':['product-card','commerce-product-card','commerce-product-list','product-detail','commerce-product-detail','commerce-product-gallery','sku-selector','price-quantity','commerce-quantity-stepper','price-display'],
 '购物车与报价':['cart-item','commerce-cart-item','commerce-cart','mini-cart','cart-summary','commerce-order-summary','tax-summary'],
 '结算与客户信息':['checkout','commerce-checkout','commerce-checkout-steps','address-selector','address-card','shipping-method','pickup-selector','coupon','promotion-list','invoice-information','payment-method','payment-sheet'],
 '订单与订阅':['payment-result','commerce-order-timeline','order-detail','subscription-plan','pricing-comparison','commerce-usage-meter','billing-history','refund-status']};
const improvements={
 '商品与规格':'真实商品数据、图片失败回退、整数价格格式、数量步长和库存边界、SKU 可售组合、收藏状态、购买请求及图片切换。',
 '购物车与报价':'购物车数量、勾选、移除、空状态、折扣上限、配送费、含税/未税汇总，以及受控回写。',
 '结算与客户信息':'原生地址/配送/支付单选、停用选项、分步校验、企业发票字段、条款确认、优惠券与交易请求，等待/超时/失败及重试。',
 '订单与订阅':'参数驱动支付和退款状态、订单时间线、月付/年付、套餐比较、用量超额展示、真实文件链接与详情请求。'};
const inv=JSON.parse(fs.readFileSync('docs/commerce/inventory.json'));const before=JSON.parse(fs.readFileSync('docs/commerce/before.json'));
for(const c of inv.items){const group=Object.keys(groups).find(k=>groups[k].includes(c.name));c.before=before.find(v=>v.name===c.name);c.finding=(c.before.type==='css'?'原来主要是静态样式，缺少数据与行为合同。':'原来只有局部行为，缺少完整数据状态及参数联动。')+improvements[group];}
await writeFile('docs/commerce/inventory.json',JSON.stringify(inv,null,2)+'\n');
await writeFile('docs/commerce/README.md',`# 电商组件扩展

2026-09 发布复查新增 14 项展示参数；修复异常回包、受控输入/中文合成输入、订阅单套餐报价、缺货商品全选和极大金额小数精度。原有 37 个组件已覆盖商品、购物车、结算、配送、支付、订单和订阅。本次完善全部组件，提供 111 个变体。收藏并入商品状态，分步结算并入 checkout；没有增加重复组件名称。原有静态 DOM 和类名继续可用。

## 五端一致接入

CSS 使用 data-g-commerce 与 data-g-commerce-options；Vue / React 的 config、AngularJS 的 gardener-config、Blazor 的 Config 使用 commerceOptions、commerceValue、commerceSize、commerceBordered、commerceDisabled。Options / Value 是 JSON 字符串，false 会保留。五端共用 commerce.js 和样式，数据模式子树由运行时管理，销毁时恢复作者原有节点。不要同时用框架插槽更新相同子树。

~~~js
const config = {
 commerceOptions: JSON.stringify({kind:'commerce-cart',selectable:true,currency:'CNY',
   items:[{id:'cup',title:'随行杯',price:12900,stock:8,quantity:1}]}),
 commerceValue: JSON.stringify({selected:['cup']}), commerceDisabled:false
};
function writeBack(value) { config.commerceValue = JSON.stringify(value); }
// Vue: <GCommerceCart :config="config" @update:model-value="writeBack" />
// React: <GCommerceCart config={config} onValueChange={writeBack} />
// AngularJS: <div g-commerce-cart gardener-config="config" gardener-on-value-change="writeBack($value)"></div>
// Blazor: <GCommerceCart Config="Config" ValueChanged="WriteBack" />
~~~

完整样式已包含本次扩展。按需样式使用 core.css + component/commerce-compositions.css，交互需要 runtime；旧基础 product-card / cart-item 类保留兼容。类名、变体和参数元数据已同步所有适配器。

## 通用参数

| 参数 | 默认 / 范围 | 用途 |
| --- | --- | --- |
| kind / mode | kind 必需 / 各组件首个变体 | 见组件清单；显式 JSON mode 优先于兼容类名；框架 variant 作为未配置 mode 时的默认值 |
| title / description / message / labels | 空 / 内置中文 labels | 标题、说明、错误信息及全部控件文案覆盖；采用 textContent |
| size / bordered / direction | medium / true / ltr | small、medium、large；12/14/14px 正文、16px 标题、28/32/36px 控件；12/16/20px 内距；RTL |
| disabled / readonly | false | 禁止交互和 API 修改；只读保留输入可读状态 |
| status | idle | loading、error、success、pending；数据加载与服务状态由宿主提供 |
| items / choices / groups / variants | []，各最多 500 条 | 唯一字符串 id；具体结构见下表 |
| currency / locale | CNY / zh-CN | Intl.NumberFormat 格式，币种变更不执行汇率换算 |
| min / max / step | 1 / 999 / 1 | 数量为整数；从 min 按 step 网格取值，受到库存限制 |
| columns | 3，1–6 | 商品网格、套餐卡片列数；窄容器自动折叠 |
| selectable / removable | false / true | 购物车勾选、删除及对应汇总 |
| shipping / tax / discount | 0 | 整数最小货币单位；折扣不超过商品小计，选中配送方式可提供价格 |
| taxIncluded | false | true 时税费已包含在小计中，不重复加税 |
| amount / originalAmount | 0 / 空 | 独立报价、单独价格展示；商品数组优先 |
| requireTerms | false | 结算与付款前必须勾选条款 |
| steps / orderId | 默认三步 / 空 | 步骤名称与订单标识 |
| used / limit | 0 / 100 | 用量；limit 为 0 表示不限量，超额显示实际用量 |
| features | [] | 套餐权益，单个商品 features 优先 |
| requestTimeout | 30000，1–300000ms | 服务请求超时后允许重试，迟到结果不会覆盖新请求 |
| showHeader / showStatus | true | 标题说明；状态文本可视觉隐藏，保留辅助技术播报 |
| showImages / showDescription / showSave | true | 商品和购物车图片、商品说明、收藏入口 |
| showStock / showOriginalPrice | true | SKU 库存提示、划线原价，不影响库存校验和计价 |
| showCoupon / showSummary | true | 结算中的优惠入口、购物车及结算中的汇总；独立 coupon/summary 不受影响 |
| showThumbnails / showCycle | true | 图库缩略图、订阅周期选择；隐藏时仍可通过受控值指定图片索引和周期 |
| imageFit / imageMaxHeight | contain / 320 | contain、cover、fill、none、scale-down；主图高度上限 80–1200px |
| listMaxHeight | null | 商品列表与表格内部滚动高度，100–2400px，null 不限 |
| defaultValue | {} | 非受控初始值；后续状态由 setValue 或 commerceValue 更新 |

## 数据和状态

- 商品 items：id、title、description、subtitle、image/src、alt、price、originalPrice、stock、quantity、disabled、badge。价格必须是安全整数，禁止浮点金额；CNY/USD 使用分，JPY 使用元，KWD 使用千分单位。数量乘积和总计超过安全整数会拒绝更新。
- 选项 choices：id、title、description、price、disabled、group。结算 group 使用 address、shipping、payment；独立选择组件使用 choice 状态。
- 规格 groups：id、title、options:[{id,title,disabled}]；variants:[{id,values:{组id:选项id},price,stock}]。不存在或缺货的组合不可购买，可清除一个选择再改选其他组合。尚未选完规格时购买按钮提示请选择，不误报缺货。
- 账单/订单 items：date、href；href 仅接受 http、https、blob 与安全相对地址。订单时间线通过 index 指定当前节点。没有后台凭证的下载不会伪造链接。
- 订阅 items：price（月付）、yearlyPrice（年度总价）、features；cycle 切换报价；subscribe 事件 totals 只计算 key 指定套餐的一份月付或年度总价，不自动签订订阅。
- 状态 commerceValue：quantities、selected、removed、sku、choice、choices、index、step、coupon、fields、terms、cycle、saved、open。
- fields：type personal/business、name、taxId、email。企业抬头要求税号；通用完整性校验不替代业务所在地的发票规则。

提供 commerceValue 即受控。用户操作产生完整 value 提案；宿主必须写回，未接受时不会自行修改状态。options 更新会校正已删除数据、数量和索引。字段在 input / compositionend 更新，失焦不重复通知；Enter 等待同步受控回写后提交。非法状态更新原子拒绝，未知字段不会保留。纯展示参数更新保留控制器、输入节点和待处理请求；业务数据改变会使旧请求失效。

## 业务接口

getInstance(element,'commerce') 提供 refresh、setOptions、setValue、getState、getTotals、setQuantity、selectSku、request、resolve、cancel、destroy。beforechange 可取消变更或提交；change 包含 value、previousValue、controlled、action；action 包含 component、behavior、action、key、requestId、value、totals。宿主处理 add、coupon、checkout、payment、invoice、subscribe、edit、details、retry 等请求。

~~~js
root.addEventListener('gardener:action', async event => {
 const d = event.detail;
 if (event.target !== root || d.behavior !== 'commerce' || d.phase === 'result' || d.action === 'cancel') return;
 // 使用自己的后端进行权限、库存、优惠、地址、税费和支付校验。
 const result = await submitToYourService(d.action, d.value, d.requestId);
 api.resolve(d.requestId, result); // {status:'success'|'error'|'pending', message:'...'}
});
~~~

这里没有支付网关、实际扣款或订单持久化。getTotals 是界面报价；服务端应重算权威价格。优惠券确认不擅自改变折扣，业务层通过 setOptions 更新后端报价。非法结果释放等待状态并显示错误，resolve 返回 false；正常回包后 setOptions 更新报价保留服务结果。未知操作和已禁用商品购买会被拒绝。resolve 只接受当前请求；重复、已取消、超时、销毁后的结果会被忽略。complete/error 返回业务结果，pending 结果通过 action + phase:'result' 通知，不冒充状态 change。页面不收集完整卡号。

## 全部组件与变体

| 组件 | 中文 | 变体 |
| --- | --- | --- |
${Object.entries(commerceModes).map(([k,v])=>'| '+k+' | '+commerceNames[k]+' | '+v.join(' / ')+' |').join('\n')}

## 演示与验证

- [GardenerDemo 电商目录](http://127.0.0.1:4180/?component=commerce#catalog)：全部 37 组件、111 变体，尺寸、边框、方向、币种、格式、只读、列数、空数据、缺货、加载失败、受控与模拟确认/失败/超时；WELCOME10 本地确认后追加 1000 最小单位折扣，清除恢复原报价。
- [CSS 完整演示](../../packages/css/examples/commerce-lab.html)：真实本地商品图、所有变体。
- Blazor 样例 /commerce：实际 Razor 组件、参数更新、受控回写和模拟异步结果。
- [逐项清单](inventory.json) · [五端一致性](parity.json) · [验证记录](verification.md)。
`);
for(const pkg of ['css','vue','react','angularjs','blazor']){const p='packages/'+pkg+'/README.md';let s=fs.readFileSync(p,'utf8');if(!s.includes('## 电商组件扩展'))s+='\n## 电商组件扩展\n\n37 个组件、111 个变体，统一 commerceOptions / commerceValue；商品规格与库存、整数金额、购物车、结算、订单和订阅。参阅 [五端参数与逐项清单](../../docs/commerce/README.md)。\n';await writeFile(p,s);}
const keys=['电商：商品、结算与订阅','37 个组件提供 111 个变体，覆盖商品规格、购物车、配送、发票、支付、订单和订阅。','五端共用 commerceOptions、commerceValue 与电商运行时，提供精确尺寸、受控状态、库存约束、整数金额及异步结果回传。','完整电商演示','电商五端参数与逐项检查'];
const p='website/docs.html';let s=fs.readFileSync(p,'utf8');if(!s.includes('id="commerce-enhancements"'))s=s.replace('<section id="media-enhancements"',`<section id="commerce-enhancements" class="docs-section"><h2>${keys[0]}</h2><p>${keys[1]}</p><p>${keys[2]}</p><p><a href="../packages/css/examples/commerce-lab.html">${keys[3]}</a></p><p><a href="../docs/commerce/README.md">${keys[4]}</a></p></section>\n<section id="media-enhancements"`);await writeFile(p,s);
const values={
 en:['Commerce: products, checkout and subscriptions','37 components provide 111 variants for product options, carts, shipping, invoices, payments, orders and subscriptions.','All five implementations share commerceOptions, commerceValue and the commerce runtime, with precise sizing, controlled state, stock constraints, integer amounts and asynchronous results.','Complete commerce examples','Commerce parameters and component audit for five implementations'],
 ja:['コマース：商品、購入手続き、サブスクリプション','37 コンポーネントと 111 バリアントで、商品仕様、カート、配送、請求書、支払い、注文、サブスクリプションに対応。','5 実装で commerceOptions、commerceValue と実行機能を共有。サイズ調整、制御状態、在庫制約、整数金額、非同期結果に対応します。','コマースの全サンプル','5 実装のコマースパラメーターと検査'],
 ko:['커머스: 상품, 결제 및 구독','컴포넌트 37개와 변형 111개로 상품 옵션, 장바구니, 배송, 청구서, 결제, 주문 및 구독을 지원합니다.','다섯 구현이 commerceOptions, commerceValue와 런타임을 공유하며 크기 조정, 제어 상태, 재고 제한, 정수 금액 및 비동기 결과를 제공합니다.','전체 커머스 예제','다섯 구현의 커머스 매개변수와 검사'],
 es:['Comercio: productos, compras y suscripciones','37 componentes ofrecen 111 variantes para opciones de productos, carritos, envíos, facturas, pagos, pedidos y suscripciones.','Las cinco implementaciones comparten commerceOptions, commerceValue y el entorno de comercio, con tamaños precisos, estado controlado, límites de existencias, importes enteros y resultados asíncronos.','Ejemplos completos de comercio','Parámetros y revisión de comercio para cinco implementaciones'],
 fr:['Commerce : produits, commandes et abonnements','37 composants proposent 111 variantes pour les options de produits, paniers, livraisons, factures, paiements, commandes et abonnements.','Les cinq implémentations partagent commerceOptions, commerceValue et les fonctions de commerce, avec tailles précises, état contrôlé, limites de stock, montants entiers et résultats asynchrones.','Exemples de commerce complets','Paramètres et audit de commerce pour cinq implémentations'],
 de:['Handel: Produkte, Bestellungen und Abonnements','37 Komponenten bieten 111 Varianten für Produktoptionen, Warenkörbe, Versand, Rechnungen, Zahlungen, Bestellungen und Abonnements.','Alle fünf Implementierungen teilen commerceOptions, commerceValue und die Handelsfunktionen mit präzisen Größen, gesteuertem Zustand, Bestandsgrenzen, ganzzahligen Beträgen und asynchronen Ergebnissen.','Vollständige Handelsbeispiele','Handelsparameter und Komponentenprüfung für fünf Implementierungen']};
for(const [locale,strings]of Object.entries(values)){const p='website/assets/i18n/'+locale+'.json',d=JSON.parse(fs.readFileSync(p));keys.forEach((k,i)=>d[k]=strings[i]);await writeFile(p,JSON.stringify(d,null,2)+'\n');}
const releaseText='电商发布复查新增 14 项展示参数：标题、状态、图片、说明、收藏、库存、划线价、优惠、汇总、缩略图、订阅周期及图片和列表尺寸。统一 28/32/36px 控件，完善受控输入、异常回包、优惠报价、缺货全选和订阅计价。';
await writeFile('website/docs.html',fs.readFileSync('website/docs.html','utf8').replace(/(<section id="commerce-enhancements"[\s\S]*?)(<\/section>)/,(_,body,end)=>body.includes(releaseText)?body+end:body+'<p>'+releaseText+'</p>'+end));
const translations={en:'The commerce release review adds 14 presentation options for headers, status, images, descriptions, saved items, stock, original prices, coupons, summaries, thumbnails, billing cycles, and image and list dimensions. Controls use 28/32/36px sizing. Controlled input, malformed results, coupon quotes, out-of-stock selection and subscription pricing are improved.',ja:'コマースの公開前検査で、見出し、状態、画像、説明、お気に入り、在庫、元価格、クーポン、集計、サムネイル、請求周期、画像と一覧のサイズに対応する14の表示設定を追加。操作部品は28/32/36pxに統一し、制御入力、不正な応答、割引見積もり、在庫切れの選択、購読料金を改善しました。',ko:'커머스 출시 점검에서 제목, 상태, 이미지, 설명, 즐겨찾기, 재고, 원가, 쿠폰, 요약, 썸네일, 구독 주기, 이미지와 목록 크기를 위한 표시 옵션 14개를 추가했습니다. 컨트롤은 28/32/36px로 통일하고 제어 입력, 잘못된 응답, 할인 견적, 품절 선택과 구독 가격을 개선했습니다.',es:'La revisión de comercio añade 14 opciones de presentación para encabezados, estado, imágenes, descripciones, favoritos, existencias, precios originales, cupones, resúmenes, miniaturas, ciclos de facturación y dimensiones de imágenes y listas. Controles de 28/32/36px; mejoras en entradas controladas, respuestas no válidas, descuentos, selección sin existencias y precios de suscripción.',fr:'La revue du commerce ajoute 14 options pour les titres, états, images, descriptions, favoris, stocks, prix initiaux, coupons, récapitulatifs, miniatures, cycles de facturation et dimensions des images et listes. Commandes de 28/32/36px ; saisie contrôlée, réponses invalides, remises, sélection des articles épuisés et tarifs des abonnements améliorés.',de:'Die Handelsprüfung ergänzt 14 Anzeigeoptionen für Titel, Status, Bilder, Beschreibungen, Favoriten, Bestand, Originalpreise, Gutscheine, Zusammenfassungen, Vorschaubilder, Abrechnungszyklen sowie Bild- und Listengrößen. Steuerelemente messen 28/32/36px. Gesteuerte Eingaben, ungültige Antworten, Rabattangebote, Auswahl ausverkaufter Artikel und Abonnementpreise wurden verbessert.'};
for(const [locale,text]of Object.entries(translations)){const p='website/assets/i18n/'+locale+'.json',d=JSON.parse(fs.readFileSync(p));d[releaseText]=text;await writeFile(p,JSON.stringify(d,null,2)+'\n');}
