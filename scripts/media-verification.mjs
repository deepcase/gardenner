import fs from 'node:fs';import assert from 'node:assert/strict';import {writeFile} from './fs-retry.mjs';const read=p=>JSON.parse(fs.readFileSync(p)),engines=['chromium','firefox','webkit'];const browsers=engines.map(engine=>({engine,...read('docs/media/browser-'+engine+'.json'),final:read('docs/media/final-'+engine+'.json'),interactions:read('docs/media/interactions-'+engine+'.json')}));for(const b of browsers){assert.equal(b.layouts,58);assert.deepEqual(b.errors,[]);assert.deepEqual(b.final.errors,[]);assert.deepEqual(b.interactions.errors,[]);}const adapters=read('docs/media/adapters.json');for(const p of adapters)assert.ok(p.checks.every(c=>c.exitCode===0));const data={date:'2026-09-07',scope:'media',components:7,originalComponents:5,newComponents:['responsive-image','image-comparison'],variants:29,frameworks:['css','vue','react','angularjs','blazor'],tests:{runtimeSuite:344,finalMediaUnit:13,cssSchema:48,html:33,buildAndInstall:11,blazorSsr:527,blazorMediaVariants:29},adapters,browsers,limits:['当前 Windows 测试用 WebKit 无法解码示例视频；明确的失败与重试路径通过，音频播放通过。Chromium / Firefox 的真实音视频及字幕通过。','PDF 的渲染与页码 / 缩放行为由浏览器阅读器决定；内置 Markdown 文档分页单独验证。','跨域图片导出要求资源服务器允许 CORS；组件不自动上传媒体。']};await writeFile('docs/media/verification.json',JSON.stringify(data,null,2)+'\n');
await writeFile('docs/media/verification.md',`# 媒体分类验证记录

2026-09-07。7 个组件、29 个变体，包括新增响应式图片和图片对比。

| 检查 | 结果 |
| --- | --- |
| 共用运行时 | 344 项回归通过，最终媒体专项 13 项通过；媒体实例方法合同通过 |
| Vue / React / AngularJS | 129 / 78 / 66 项单元测试通过，遍历全部媒体组件的配置、显式 false、受控值与实例保留；类型及 Schema 通过 |
| CSS Schema / HTML / 类型 | 48 / 33 项通过，TypeScript 声明通过 |
| 构建与安装包 | 11 项通过，包括按需组件打包、产物预算、连续构建一致性及 npm 安装 |
| Blazor | 527 个 SSR 合同通过；7 个组件、29 个变体、受控轮播、灯箱、原生音频、参数更新后继续播放、裁剪预览与下载通过 |
| 三种浏览器 | 每种 58 组尺寸 / 变体检查，共 174 组；每种另有 7 组 RTL、7 组深色窄屏检查 |
| 无障碍 | Chromium Axe 检查全部 7 个默认状态、7 个深色状态及已打开 / 放大的灯箱，无 WCAG 2 A/AA、2.1 AA 违规 |
| 原生媒体 | Chromium / Firefox 的真实音频、视频、倍速与字幕加载通过；WebKit 音频通过，不支持视频编码时的明确错误 / 重试通过 |
| 裁剪与预览 | 三种浏览器均验证真实 PNG 输出、固定比例尺寸、键盘调整、预览和下载；包含只读、禁用、非法输入与未加载图像 |
| 状态与失败 | 空资源、错误资源重试、自动轮播和焦点暂停、受控页码 / 对比位置、灯箱焦点返回通过 |
| CSS 独立演示 | 7 个组件初始化与轮播操作通过；字幕 MIME 类型已校正 |
| GardenerDemo | 7 个目录项、参数控件、受控轮播通过；生产构建完成 |
| 五端一致性 | 全部 7 个合同 / 29 个变体一致；共享 CSS、运行时入口、media.js 和 extended 样式包与 Blazor 的 SHA-256 一致 |
| 文档与网站 | 参数表、逐项修复与接入说明已同步；14 个页面、7 个语言版本，仓库总目录 527 个组件 / 83 个行为校验通过 |

- [逐项修复与参数](README.md)
- [完整机器记录](verification.json)
- [五端一致性](parity.json)
- [适配器测试](adapters.json)
- [Blazor 实例演示](blazor-browser.json)
- [目录控件验证](catalog-browser.json)
- [固定体积预算](budget-review.json)

测试环境的 WebKit 视频解码限制不等于所有 Safari 不支持该格式；真实服务端应提供适合目标浏览器的格式。PDF 使用浏览器内置阅读器，组件同时提供独立打开与下载。跨域 Canvas 导出需要 CORS。此次记录针对媒体分类及其相关回归，不代表其余全部组件的逐项发布认证。
`);
const p='docs/media/budget-review.json',budget=read(p);budget.moduleBytes=fs.statSync('packages/css/dist/media.js').size;budget.packageMeasured=read('packages/css/dist/gardener.performance.json').package;await writeFile(p,JSON.stringify(budget,null,2)+'\n');
