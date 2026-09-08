import fs from 'node:fs';import {marketingModes} from '../packages/css/src/js/marketing.js';import {marketingNames} from './marketing-examples.mjs';const before=JSON.parse(fs.readFileSync('docs/marketing/before.json')),items=JSON.parse(fs.readFileSync('packages/css/metadata/components.json')).components.filter(c=>c.category==='marketing');const findings={'site-header':'原来只有固定横排导航；补齐移动展开、嵌套导航、Escape 焦点返回、居中/紧凑/吸顶布局。',hero:'原来固定大尺寸区域；补齐分栏、居中、紧凑与媒体优先布局，支持图片、标题、内容与行动参数。',pricing:'原来只有静态网格；新增月/年计费、席位、整数金额、币种、对比表及联系销售。','feature-grid':'新增可独立使用的功能展示，支持分类筛选、卡片、交替布局和紧凑变体。','logo-cloud':'新增品牌标识网格、排列、紧凑、单色变体，可使用图片与链接。',testimonial:'新增评价卡片、精选和轮播，支持键盘、循环、自动播放及暂停。','cta-section':'新增独立行动引导区，支持行内、居中、分栏、柔和色调。',newsletter:'新增可配置订阅表单，支持邮箱、同意项、隐私链接及异步反馈。','announcement-bar':'新增活动公告，支持吸顶、可取消关闭、到期状态及倒计时。','site-footer':'新增分组页脚，支持多列、简洁、居中、紧凑及版权链接。'};fs.writeFileSync('docs/marketing/inventory.json',JSON.stringify({originalComponents:3,newComponents:7,components:10,variants:40,decision:'现有分类仅有三个外壳，缺少功能展示、社会证明、行动引导、订阅、公告和页脚，因此新增七项。FAQ、价格对比、Cookie 同意、统计指标已有独立组件，保留原分类。',items:items.map(c=>({...c,before:before.find(b=>b.name===c.name)??null,finding:findings[c.name]}))},null,2)+'\n');
const table=items.map(c=>'| '+c.name+' | '+marketingNames[c.name]+' | '+c.variants.join(' / ')+' | '+findings[c.name]+' |').join('\n');fs.writeFileSync('docs/marketing/README.md',`# 营销组件

从 3 个静态组件扩展为 10 个组件、40 种变体。新增 7 个组件均同步到 CSS、Vue、React、AngularJS 和 Blazor。FAQ、价格对比、Cookie 同意及统计指标沿用原分类，不重复注册。

| 组件 | 名称 | 变体 | 检查与完善 |
| --- | --- | --- | --- |
${table}

## 五端配置

CSS 根节点提供原类名、data-g-marketing 和 data-g-marketing-options。Vue/React 使用 config.marketingOptions，AngularJS 使用 gardener-config，Blazor 使用 Config 字典，复杂参数使用 JSON 字符串。

~~~js
const options = {
  kind: 'pricing', mode: 'cards', title: '选择方案', currency: 'CNY',
  billingCycles: ['monthly', 'yearly'], maxQuantity: 100,
  items: [{id:'team',title:'团队',monthly:6900,yearly:69000,features:{版本历史:true}}]
};
// Vue: <GPricing :config="{ marketingOptions: JSON.stringify(options) }" />
// React: <GPricing config={{ marketingOptions: JSON.stringify(options) }} />
// AngularJS: <div g-pricing gardener-config="{marketingOptions: optionsJson}"></div>
// Blazor: <GPricing Config="optionsDictionary" />
~~~

## 参数

| 参数 | 默认值与用途 |
| --- | --- |
| kind / mode | 组件名称 / 每行第一个变体 |
| size | small / medium / large；28 / 32 / 36 px 控件；内边距 12 / 16 / 20 px；正文 12 / 14 / 14 px |
| direction / align | ltr / start；支持 rtl 与 center / end |
| tone / bordered | neutral / true；brand / subtle 与无边框 |
| maxWidth / gap / columns | 1120 / 16 / 3；范围 280–2400 / 0–96 / 1–6 |
| title / description / eyebrow / brand | 标题、描述、上方短文案与品牌名 |
| image / imageAlt | Hero 图片与替代文本 |
| items | 导航、定价、功能、品牌、评价条目；唯一 id，支持 disabled |
| actions | 行动项；href 使用原生链接，否则 action 请求由宿主确认 |
| groups / categories | 页脚分组与功能分类 |
| currency / locale | CNY / zh-CN；金额格式与最小货币单位由 Intl 决定 |
| billingCycles / quantity / maxQuantity | monthly + yearly / 1 / 1000 |
| requireConsent / privacyUrl / privacyLabel | true；订阅同意项与隐私链接 |
| autoplay / interval / loop | false / 5000 ms / true；轮播至少 2000 ms |
| dismissible / position / expiresAt | true / inline / 无到期；支持 sticky 和绝对时间戳 |
| readonly / disabled / status | false / false / ready；status 支持 loading、error |
| requestTimeout / labels | 30000 ms；可覆盖全部操作文案 |
| defaultValue / marketingValue | 初始值 / 外部受控值 |

items 可含 title、label、description、href、target、image、alt、children、monthly、yearly、features、badge、featured、quote、author、role、category；groups 使用 items 子列表。展示数量与营销文案完全由应用提供，不产生虚假的评价、倒计时或节省金额。

## 发布复查扩展

| 新参数 | 默认值与用途 |
| --- | --- |
| showBilling / showQuantity | true / true；独立显示计费切换与席位输入，隐藏时保留外部给定的周期和数量 |
| showFeatures | true；控制定价卡片及对比表中的功能列表 |
| showFilters | true；控制功能分类按钮，隐藏时仍可通过 value.filter 筛选 |
| showStatus | true；隐藏可视状态时保留辅助技术的 live region 和错误关联 |
| imageFit / imageMaxHeight | contain / 320；支持 cover、fill、none、scale-down；高度上限 40–2000 px，作用于内容图片，品牌标识与头像保留专用比例 |
| emailPlaceholder / emailMaxLength | 空字符串 / 320；邮箱占位文案与 3–320 字符限制 |

尺寸由 size 精确控制，窄视口和窄容器均自动重排。首屏和金额保留营销展示层级，控件与其它分类一致；不再以 44px 覆盖所有窄屏尺寸。

异常回包会结束等待并触发 error，resolve 返回 false，可重试；不会误报成功。状态更新清除旧反馈，服务失败不会误标邮箱格式错误；未勾选同意项时只标记并聚焦同意框。邮箱使用 input 事件，避免受控模式在失焦时重复提案。状态布尔/数值/文本类型严格校验；非法 setValue 返回 false，非法 setOptions 抛出 TypeError 并保留原配置。明确的 mode 优先于旧变体类名。停用分组、到期链接和错误状态禁止操作；URL 不接受嵌入凭据。销毁后 API 不再修改节点。

现有 10 个组件已覆盖品牌导航、产品展示、定价、功能、社会证明、行动引导、订阅和页脚。本次通过参数完善已有组件，不新增与 FAQ、Cookie 同意、价格对比等既有组件重复的条目。逐组件结果与最新发布证据见 [发布复查](verification.md) 和 release-review/inventory.json。

## 状态与服务协议

marketingValue / data-g-marketing-value 开启受控状态。change 返回候选 value，宿主回写后生效；未提供受控值时由组件管理状态。公开值包含 open、expanded、cycle、quantity、index、filter、email、consent、dismissed、paused。

getInstance(root, 'marketing') 提供 setOptions、setValue、getState、getPrice、next、previous、request、resolve、cancel、refresh、destroy。beforechange 可取消变更与请求。action 的 requestId、action、key、value、price 交给宿主；resolve(requestId,{status:'success'|'error',message}) 确认结果。取消、超时、配置切换或销毁后，过期结果被忽略。导航链接使用安全 URL 与原生浏览器行为，navigate 事件可取消。

pricing.monthly / yearly 是该币种最小单位的整数金额：CNY 6900 表示 ¥69，JPY 6900 表示 ¥6,900。年费是全年账单，明确标注；席位与金额相乘仍限制在安全整数范围。缺少对应周期金额时展示联系销售。演示不会创建订单，实际结算必须使用服务器核准金额。

订阅必须是有效邮箱；requireConsent 为 true 时还需确认同意。默认不预选同意项。组件不会自行发送邮件或保存订阅。宿主应接入自己的订阅接口与退订流程。

评价自动播放在悬停、焦点位于组件内、页面隐藏或减少动态效果设置下暂停，并提供手动暂停按钮。导航 Escape 关闭层级并返回触发按钮；评价支持左右方向键；订阅支持原生表单 Enter 提交。

## 演示

- GardenerDemo：http://127.0.0.1:4180/?component=marketing#catalog
- CSS：http://127.0.0.1:4187/examples/marketing-lab.html
- Blazor：http://127.0.0.1:5192/marketing

目录页支持参数切换、空数据、加载、错误、到期、模拟成功/失败/超时与受控模式。品牌和评价均为明确标注的虚构演示文案；订阅和方案选择只调用本地模拟服务。
`);
for(const name of ['css','vue','react','angularjs','blazor']){const p='packages/'+name+'/README.md';let s=fs.readFileSync(p,'utf8');if(!s.includes('../../docs/marketing/README.md'))s+='\n## 营销\n\n10 个组件、40 种变体，包含品牌导航、Hero、定价、功能展示、标识、评价、行动引导、订阅、公告与页脚。[参数与完整演示](../../docs/marketing/README.md)。\n';fs.writeFileSync(p,s);}
for(const p of ['README.md','README.zh-CN.md']){let s=fs.readFileSync(p,'utf8').replace(/\b527(?=\s*(个|components))/g,'534').replace(/\b87(?=\s*(种|个|behaviors))/g,'88');fs.writeFileSync(p,s);}
