# 电商组件扩展

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
| product-card | 商品卡片 | default / horizontal / compact |
| cart-item | 购物车条目 | default / compact / readonly |
| price-quantity | 价格与数量 | default / inline / compact |
| product-detail | 商品详情 | default / split / compact |
| checkout | 结算 | default / steps / compact |
| commerce-product-card | 商品营销卡片 | default / horizontal / compact |
| commerce-product-list | 商品列表 | list / grid / compact |
| commerce-product-detail | 商品购买详情 | default / split / compact |
| commerce-product-gallery | 商品图片 | thumbnails / horizontal / compact |
| sku-selector | 商品规格 | buttons / select / compact |
| commerce-quantity-stepper | 购买数量 | default / inline / compact |
| price-display | 价格展示 | default / sale / compact |
| commerce-cart-item | 购物车商品 | default / compact / readonly |
| commerce-cart | 购物车 | default / selectable / compact |
| mini-cart | 迷你购物车 | default / expanded / compact |
| cart-summary | 购物车汇总 | default / detailed / compact |
| commerce-checkout | 订单结算 | default / steps / compact |
| commerce-checkout-steps | 结算步骤 | horizontal / vertical / compact |
| address-selector | 收货地址选择 | cards / list / compact |
| address-card | 收货地址卡片 | default / editable / compact |
| shipping-method | 配送方式 | cards / list / compact |
| pickup-selector | 门店自提 | cards / list / compact |
| coupon | 优惠券 | default / inline / compact |
| promotion-list | 促销活动 | default / cards / compact |
| invoice-information | 发票信息 | personal / business / compact |
| payment-method | 支付方式 | cards / list / compact |
| payment-sheet | 付款确认 | default / summary / compact |
| payment-result | 支付结果 | success / error / pending |
| commerce-order-summary | 订单金额 | default / detailed / compact |
| commerce-order-timeline | 订单时间线 | vertical / horizontal / compact |
| order-detail | 订单详情 | default / split / compact |
| subscription-plan | 订阅方案 | default / featured / compact |
| pricing-comparison | 套餐比较 | table / cards / compact |
| commerce-usage-meter | 订阅用量 | bar / segmented / compact |
| billing-history | 账单历史 | table / list / compact |
| refund-status | 退款进度 | pending / success / error |
| tax-summary | 税费明细 | default / inclusive / compact |

## 演示与验证

- [GardenerDemo 电商目录](http://127.0.0.1:4180/?component=commerce#catalog)：全部 37 组件、111 变体，尺寸、边框、方向、币种、格式、只读、列数、空数据、缺货、加载失败、受控与模拟确认/失败/超时；WELCOME10 本地确认后追加 1000 最小单位折扣，清除恢复原报价。
- [CSS 完整演示](../../packages/css/examples/commerce-lab.html)：真实本地商品图、所有变体。
- Blazor 样例 /commerce：实际 Razor 组件、参数更新、受控回写和模拟异步结果。
- [逐项清单](inventory.json) · [五端一致性](parity.json) · [验证记录](verification.md)。
