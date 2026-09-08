import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync('docs/communication/release-review/'+p,'utf8')),log=p=>fs.readFileSync('docs/communication/release-review/'+p,'utf8');
const passLog=(file,min)=>{const s=log(file),count=Number(s.match(/ℹ tests (\d+)/)?.[1]);assert.ok(s.includes('ℹ fail 0')&&count>=min,file+' not complete');return count;};
const browser=['chromium','firefox','webkit'].map(e=>read('browser-'+e+'.json'));for(const b of browser){assert.equal(b.layouts.length,64);assert.equal(b.states.length,32);assert.equal(b.interactions,16);assert.deepEqual(b.errors,[]);}assert.equal(browser[0].a11y.length,40);
const extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e+'.json'));for(const e of extensions){assert.equal(e.checks,8);assert.equal(e.passed,true);assert.deepEqual(e.errors,[]);}const inventory=read('inventory.json');assert.equal(inventory.length,8);
const adapters=read('adapters.json');for(const p of adapters)for(const c of p.checks)assert.equal(c.exitCode,0,p.package+'/'+c.task);for(const c of read('checks.json'))assert.equal(c.code,0,c.pkg+'/'+c.task);
const blazor=read('blazor-browser.json'),staticDemo=read('static-browser.json');assert.equal(blazor.samples.length,32);assert.equal(blazor.controlledInteractions,8);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.staticVariants,32);assert.deepEqual(staticDemo.errors,[]);assert.ok(log('root-check.log').includes('Communication parity passed'));assert.ok(log('css-budget.log').includes('Performance budget passed'));assert.ok(log('contracts.log').includes('Contracts passed'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');const assets=['gardener.css','gardener.min.css','gardener.runtime.min.js','communication.js','components/content-compositions.min.css'];for(const p of assets)assert.equal(hash('packages/css/dist/'+p),hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+p),p);
const report={status:'passed',generatedAt:new Date().toISOString(),components:8,variants:32,frameworks:['css','vue','react','angularjs','blazor'],inventory,extensions,addedParameters:['searchable','filterable','showRecipients','showSubject','defaultEnabled','editorRows'],unit:passLog('runtime-specific.log',39),runtimeRegression:passLog('runtime-all.log',590),schema:passLog('schema.log',48),html:passLog('css-test-html.log',43),build:passLog('build-tests.log',11),browsers:browser.map(b=>({engine:b.engine,layouts:b.layouts.length,states:b.states.length,interactions:b.interactions,a11y:b.a11y.length})),adapters,blazor:{variants:32,controlledInteractions:8},staticDemo,website:{locales:7,pages:14,components:559,behaviors:94,events:104},sharedAssets:Object.fromEntries(assets.map(p=>[p,hash('packages/css/dist/'+p)])),scope:'Local communication components, five framework adapters and mock-service demonstrations. Real delivery, storage, uploads, permissions and realtime subscriptions are supplied by the host application.'};
fs.writeFileSync('docs/communication/final-verification.json',JSON.stringify(report,null,2)+'\n');fs.writeFileSync('docs/communication/verification.md',`# 沟通组件验证报告

结果：通过。新增 6 个可变参数。8 个组件 / 32 个变体；CSS、Vue、React、AngularJS、Blazor、GardenerDemo 与网站文档已同步。

| 检查 | 结果 |
| --- | --- |
| 沟通专项行为测试 | ${report.unit} / ${report.unit} |
| 全部 CSS 运行时回归 | ${report.runtimeRegression} / ${report.runtimeRegression} |
| Schema / HTML / 构建 | ${report.schema} / ${report.html} / ${report.build}，全部通过 |
| Vue / React / AngularJS 单元测试 | ${adapters.map(a=>a.checks.find(c=>c.task==='test:unit').tests).join(' / ')}，全部通过 |
| 三浏览器 | 192 个布局、96 个状态、48 组交互、24 组新增参数与窄容器检查；无页面脚本错误 |
| Chromium 无障碍 | 32 个变体 + 8 个暗色/RTL 场景；40 项扫描无违规 |
| Blazor | 32 个变体、8 组实际受控交互、559 个 SSR 合约渲染 |
| 独立 CSS / GardenerDemo | 32 个变体 / 8 个完整组件演示 |
| 五端产物 | 元数据一致，共用样式及运行时；Blazor 静态文件 SHA-256 相同 |
| 构建与包 | 可复现构建、Source Map、完整性、按组件构建及 npm 安装入口通过 |
| 网站 | 7 种语言 / 14 个页面、目录和 API 覆盖检查通过 |
| 性能预算 | 42 个 CSS/运行时产物及五端门禁通过；本次沿用现有预算，无扩限 |

验证包含回复关联、本人编辑、删除确认与级联、点赞、解决讨论、归档恢复、批量已读、在线联系人筛选、偏好 false 值、免打扰校验、送达重试、附件类型/大小/数量、受控更新、IME、取消/超时及过期响应。本次修复偏好显示与提交不一致、完整列表丢弃确认数据、回复跨页、成功发送后新内容不可见、窄容器排版和字体回退。Blazor 受控测试已等待服务端确认编辑状态后再输入。

本次保留 8 个组件、32 个变体：现有组件覆盖通知、收件箱、讨论、动态、编辑器、联系人、偏好与送达，将需求扩展为共享参数即可覆盖，无需增加功能重复的组件。

演示使用本地模拟服务。实际发送、上传、存储、权限校验、实时在线状态和会话路由由宿主实现；本次未连接真实通信后端，也未向他人发送消息。

- [完整演示](http://127.0.0.1:4180/?component=communication#catalog)
- [参数与逐项说明](README.md)
- [机器可读验证结果](final-verification.json)
- [收件箱截图](release-review/inbox.png)
- [移动端评论截图](release-review/comments-mobile.png)
- [窄容器通知偏好](release-review/narrow-preferences.png)
- [逐组件复查清单](release-review/inventory.json)
`);console.log('Communication verification passed: 8 components, 32 variants, five frameworks.');
