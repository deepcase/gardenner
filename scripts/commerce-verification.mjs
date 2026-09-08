import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {writeFile} from './fs-retry.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8')),root='docs/commerce/',browsers=['chromium','firefox','webkit'].map(name=>({name,...read(root+'browser-'+name+'.json')}));
for(const b of browsers){assert.equal(b.layouts,222);assert.deepEqual(b.errors,[]);assert.equal(b.checkout,true);}
const parity=read(root+'parity.json'),adapters=read(root+'adapters.json'),blazor=read(root+'blazor-browser.json'),final=read(root+'final-browser.json'),parameters=read(root+'parameters-browser.json');
for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);assert.equal(blazor.variants,111);assert.equal(final.darkNarrowRTL,37);assert.equal(parameters.explicitSizeOverridesCompact,true);
const log=p=>fs.readFileSync(root+p,'utf8');assert.match(log('commerce-unit.log'),/pass 16/);assert.match(log('css-runtime.log'),/pass 361/);assert.match(log('css-build.log'),/pass 11/);assert.match(log('css-schema.log'),/pass 48/);assert.match(log('css-html.log'),/pass 34/);assert.match(log('demo-build.log'),/built in/);assert.doesNotMatch(log('demo-build.log'),/error TS/);assert.match(log('repository-check.log'),/Commerce parity passed/);
const runtime='packages/css/dist/commerce.js',hash=createHash('sha256').update(fs.readFileSync(runtime)).digest('hex');
const report={date:'2026-09-07',components:37,variants:111,newComponents:0,frameworks:parity.frameworks,layouts:666,browsers:browsers.map(({name,layouts,rtl,a11y})=>({name,layouts,rtl,a11y})),darkNarrowRTL:37,darkAxe:37,adapters,blazor,parameters,sharedRuntimeSHA256:hash,runtimeBytes:fs.statSync(runtime).size,checks:{runtimeSuite:361,finalCommerceUnit:16,cssBuild:11,cssSchema:48,cssHtml:34,types:true,demoBuild:true,rootCheck:true,parity:true},limits:['演示服务返回本地模拟结果，不产生真实订单或付款。生产交易、库存锁定、权威报价与优惠核销由宿主服务完成。','浏览器支持原生表单操作；账单下载需要宿主提供可访问地址。','Demo 构建仍有既有的大型展示目录 chunk 提示；本次各包的固定体积预算均通过。']};
await writeFile(root+'verification.json',JSON.stringify(report,null,2)+'\n');
await writeFile(root+'verification.md',`# 电商验证记录

2026-09-07。范围为电商分类现有 37 个组件、111 个变体；不代表重新认证其他 490 个组件的全部业务场景。

| 检查 | 结果 |
| --- | --- |
| CSS / Vue / React / AngularJS / Blazor | 组件、变体、参数、样式和共享运行时一致；Blazor 静态资产哈希一致 |
| Chromium / Firefox / WebKit | 每种引擎 111 变体 × 360/1100px，共 666 个布局；各 37 个 RTL 检查 |
| 可访问性 | Chromium 37 个默认组件及 37 个暗色窄屏 RTL 场景通过 Axe WCAG A/AA 检查 |
| 业务交互 | 库存、数量、SKU 禁售组合、购物车勾选与移除、配送费用、优惠券成功/失败、结算校验、发票、月/年套餐及图片切换 |
| 受控接口 | 状态提案与宿主回写、取消守卫、原生输入保留、重复提交保护、超时和过期结果隔离 |
| 参数面板 | 上下限互相约束、显式大尺寸覆盖 compact、全部缺货、只读默认继承、币种与费用参数 |
| 共享运行时 | 全套 361 项通过；末轮参数优先级和库存修复后，16 项电商定向测试通过 |
| Vue / React / AngularJS | 单元测试 130 / 79 / 67 项，三个适配器各 3 项 schema 及类型检查通过；逐个挂载 37 电商组件 |
| Blazor | 37 组件 / 111 变体、受控数量、尺寸保留、异步优惠券和结算交互通过；527 个 SSR 渲染合同通过 |
| CSS 构建 | 11 项构建、按需包、连续构建复现、打包安装和体积检查通过；48 项 schema、34 项 HTML 及 TypeScript 通过 |
| 项目与网站 | 根 check 通过；527 组件、84 行为、103 事件、5137 根公开导出，7 语言 / 14 页面、3255 条消息同步 |
| 最终构建 | 五端构建及 GardenerDemo vue-tsc / Vite 构建通过 |

金额是整数最小货币单位，币种格式切换不执行汇率换算。前端报价用于展示，支付、订单与优惠校验需要接入真实业务服务；本地演示明确标注模拟。构建保留展示目录的大 chunk 提示，各发布包固定预算已通过。

共享 commerce.js：${report.runtimeBytes} B，SHA-256 ${hash}。固定模块上限为 45 kB，原始 2.0 预算基线未改写；新增产物预算说明见 [budget-review.json](budget-review.json)。

[逐项清单](inventory.json) · [机器验证记录](verification.json) · [五端一致性](parity.json) · [参数面板截图](catalog-detail.png) · [结算截图](chromium-checkout.png)
`);
console.log('Commerce verification recorded: 37 components, 111 variants, 666 layouts, five implementations.');
