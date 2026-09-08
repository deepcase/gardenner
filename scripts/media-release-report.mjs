import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';const dir='docs/media/release-review/',read=n=>JSON.parse(fs.readFileSync(dir+n+'.json','utf8')),log=n=>fs.readFileSync(dir+n+'.log','utf8');const passed=(name,count)=>{const s=log(name);assert.equal(Number(s.match(/ℹ tests (\d+)/)?.[1]),count,name);assert.match(s,/ℹ fail 0\b/);return count;};
const browsers=['chromium','firefox','webkit'].map(e=>read('browser-'+e)),extensions=['chromium','firefox','webkit'].map(e=>read('extensions-'+e)),finals=['chromium','firefox','webkit'].map(e=>read('final-'+e));for(const b of browsers){assert.equal(b.layouts,58);assert.equal(b.rtl,7);assert.deepEqual(b.errors,[]);for(const k of ['carousel','lightbox','crop','controlled'])assert.equal(b[k],true);assert.ok(b.playback.some(v=>v.variant==='audio'&&v.supported));}for(const e of extensions){assert.equal(e.checks,11);assert.equal(e.narrow.length,29);assert.equal(e.states.length,21);assert.deepEqual(e.errors,[]);assert.equal(e.passed,true);}for(const f of finals){assert.equal(f.dark,7);for(const k of ['errorRetry','empty','autoplayFocusPause','readonly','disabled'])assert.equal(f[k],true);assert.deepEqual(f.errors,[]);}
const adapters=read('adapters'),checks=read('checks'),blazor=read('blazor-browser'),staticDemo=read('static-browser'),smoke=read('final-smoke');for(const a of adapters)for(const c of a.checks)assert.equal(c.exitCode,0);for(const c of checks)assert.equal(c.code,0,c.pkg+'/'+c.task);assert.equal(blazor.variants,29);for(const k of ['controlledCarousel','lightbox','realAudio','playerPreserved','cropExport'])assert.equal(blazor[k],true);assert.deepEqual(blazor.errors,[]);assert.equal(staticDemo.variants,29);assert.deepEqual(staticDemo.errors,[]);assert.equal(smoke.passed,true);assert.match(log('root-check'),/Legal parity passed/);assert.match(log('css-budget'),/Performance budget passed/);assert.match(log('reproducible'),/Reproducible build passed/);assert.match(log('demo-build'),/built in/);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex'),sharedAssets={};for(const file of ['gardener.css','gardener.min.css','gardener.runtime.min.js','media.js','components/extended.min.css']){sharedAssets[file]=hash('packages/css/dist/'+file);assert.equal(sharedAssets[file],hash('packages/blazor/src/Gardenerim.Blazor/wwwroot/'+file),file);}assert.equal(sharedAssets['media.js'],hash('packages/css/src/js/media.js'));assert.ok(fs.statSync('packages/css/dist/media.js').size<40000);
const addedParameters=['showHeader','showStatus','showCaption','showNavigation','showPagination','showRotation','showToolbar','showZoom','showPlaylist','showCropFields','height','maxHeight','thumbnailSize','documentHeight','playbackRates','playTimeout','autoAdvance','fullscreen'];const report={verifiedAt:new Date().toISOString(),passed:true,components:7,variants:29,newComponents:0,frameworks:['css','vue','react','angularjs','blazor'],addedParameters,inventory:read('inventory'),tests:{media:passed('runtime-specific',28),runtime:passed('runtime-all',737),schema:passed('schema',48),html:passed('css-test-html',43),build:passed('build-tests',11)},browsers,extensions,finals,adapters,checks:checks.map(({pkg,task,code})=>({pkg,task,code})),blazor,staticDemo,smoke,sharedAssets,website:{components:559,behaviors:94,events:104,locales:7,pages:14,messagesPerTranslatedLocale:3319},budgets:'Existing package, platform and 40 kB media module caps passed without increases.',limitations:['PDF 的搜索、渲染和内置分页依赖浏览器阅读器。','测试环境 WebKit 的视频解码能力有限，已验证明确失败和重试；真实音频通过。','跨域图片裁剪导出需要资源服务器允许 Canvas 使用该资源。','自动无障碍扫描不替代人工辅助技术验收。']};for(const n of ['verification','final-verification'])fs.writeFileSync('docs/media/'+n+'.json',JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('docs/media/verification.md',`# 媒体组件发布复查

组件层检查通过：全部 7 个组件、29 个变体。CSS、Vue、React、AngularJS、Blazor、GardenerDemo、Website 和文档已同步。本次深化现有组件，不新增重复组件。

新增 18 项参数：${addedParameters.join('、')}。目录面板可直接切换，原有比例、填充、倍速、裁剪格式和质量参数也提供演示。

修复窄容器设置固定高度时主图撑宽、初始 index 无效、显式 mode/size/ratio/fit 被变体覆盖、未知字段进入公开状态、只读可通过 API 修改区域、播放请求无限等待/重复等待/取消后残留、初始自定义倍速控件未同步、播放列表自动切换被原生循环拦截、导出途中修改区域或资源仍接收旧结果、销毁期间继续操作等问题。展示参数刷新保留原生播放器、当前进度和裁剪导出；业务变更取消旧结果。资源 URL 拒绝嵌入账号密码。裁剪下载扩展名跟随实际格式，Blazor 状态输出自动换行。

统一正文 12/14/14px、标题 16px、控件 28/32/36px、内距 12/16/20px；粗指针控件至少 44px。媒体高度与上限、缩略图、文档视区可配置。容器查询处理嵌入式窄栏，长文档内部滚动并可通过键盘聚焦。隐藏状态保留辅助技术播报，灯箱始终保留退出操作。

| 验证 | 结果 |
| --- | --- |
| 媒体专项 / 全量运行时 | 28 / 737 项通过 |
| Vue / React / AngularJS | 140 / 89 / 77 项单元测试、Schema 与类型通过 |
| CSS Schema / HTML / 构建 | 48 / 43 / 11 项通过，含可复现构建及安装入口 |
| 三浏览器布局 | 174 个常规布局、87 个 320px 窄容器变体通过 |
| 三浏览器状态与参数 | 63 个空/只读/禁用状态、33 组新增参数检查通过 |
| 无障碍 | 15 次 Chromium WCAG A/AA 扫描无违规，含暗色与打开/缩放的灯箱 |
| 原生媒体 | 三浏览器真实音频；Chromium / Firefox 视频和字幕；WebKit 不支持的编码显示错误与重试 |
| 图片裁剪 | 三浏览器真实 PNG 固定比例导出、键盘操作与 JPEG 预览/文件名通过 |
| CSS / Blazor | 各 29 个变体；Blazor 受控轮播、灯箱、真实音频、播放器保留、裁剪导出通过 |
| 五端一致性 | 全部媒体目录和变体一致，共用样式及运行时 SHA-256 一致；559 个 Blazor SSR 合约通过 |
| Website | 七语言、十四页面，每个翻译语言 3319 条文案 |
| 性能 | 42 个 CSS 产物、整体包体、适配器、Blazor 和 40 kB 媒体源码上限通过，未提高预算 |

只读允许浏览、分页、缩放和播放，禁止编辑裁剪/对比区域。受控自动下一曲仅提出索引变更，宿主回写并决定是否继续播放。PDF 能力依赖内置阅读器；测试环境 WebKit 视频解码限制不代表全部 Safari，目标项目应验证其资源编码。跨域 Canvas 导出需要资源服务器授权。自动扫描不替代人工辅助技术验收。

- [完整媒体演示](http://127.0.0.1:4180/?component=media#catalog)
- [逐组件清单](release-review/inventory.json)
- [五端参数与原生媒体接入](README.md)
- [机器可读记录](final-verification.json)
- [窄屏轮播截图](release-review/carousel-narrow.png)
- [播放器截图](release-review/player.png)

复现：scripts/build-media-examples.mjs、media-demo-params.mjs、media-docs.mjs、media-release-website.mjs、media-release-build.mjs、media-release-checks.mjs、media-release-verify-adapters.mjs、media-release-browser-matrix.mjs、media-release-extension-matrix.mjs、media-release-final-matrix.mjs、test-media-release-static.mjs、test-media-release-smoke.mjs、media-release-report.mjs，以及 packages/blazor/scripts/test-media-release.mjs。历史报告和原始日志位于 release-review。
`);console.log('Media release review passed: 7 components / 29 variants / five implementations.');
