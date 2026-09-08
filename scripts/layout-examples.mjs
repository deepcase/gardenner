import {layoutModes} from '../packages/css/src/js/layout.js';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const cell=(title,text='',style='')=>`<div class="layout-demo-cell"${style?` style="${style}"`:''}><strong>${title}</strong>${text?`<p>${text}</p>`:''}</div>`;
const button='<button class="g-btn g-btn-small" type="button" data-g-layout-toggle="sidebar">侧栏</button>';
const art='<svg viewBox="0 0 600 240" role="img" aria-label="山峦插图"><rect width="600" height="240" fill="#e8f7f2"/><circle cx="450" cy="60" r="30" fill="#f5c56b"/><path d="M0 200L160 50L310 200L440 110L600 220V240H0Z" fill="#21836b"/></svg>';
export function layoutFixture(kind,mode=layoutModes[kind][0]) {
  const cls={'grid-system':'g-grid-24','region-layout-system':'g-region-frame','classic-layout-primitives':'g-stack'}[kind]||'g-'+kind;
  const options={kind,mode,gap:16,position:'contained',breakpoint:640};
  let body='';
  if(kind==='grid-system')body=[8,8,8,6,12,6].map((span,i)=>cell(`${mode==='12-column'?span/2:span} / ${mode==='12-column'?12:24}`,`区域 ${i+1}`,`--g-layout-span:${mode==='12-column'?span/2:span}`)).join('');
  if(kind==='grid-system'&&mode==='subgrid')body=`<div data-g-layout-subgrid style="--g-layout-span:24">${cell('嵌套区域 A','','grid-column:span 12')}${cell('嵌套区域 B','','grid-column:span 12')}</div>`;
  if(kind==='region-layout-system'){
    options.minHeight=280;
    body=`<header class="layout-demo-cell" data-g-layout-region="top">项目工作台</header><aside class="layout-demo-cell" data-g-layout-region="start"><strong>目录</strong><p>概览 · 资源 · 设置</p></aside><div class="layout-demo-cell" data-g-layout-region="main"><strong>主要内容</strong><p>区域宽度、间距和容器断点可以独立设置。窄容器内按阅读顺序排列。</p><label>保留的输入<input class="g-input" aria-label="区域备注" placeholder="切换参数后内容仍保留"></label></div><aside class="layout-demo-cell" data-g-layout-region="end"><strong>检查器</strong><p>属性与补充信息</p></aside><footer class="layout-demo-cell" data-g-layout-region="bottom">已连接 · 草稿已保存</footer>`;
  }
  if(kind==='classic-layout-primitives') {
    body=[cell('项目目标','建立清晰的内容层级。'),cell('设计原则','间距、比例与阅读顺序保持一致。'),cell('下一步','按业务内容选择组合。')].join('');
    if(['frame','aspect-ratio'].includes(mode))body=art;
    if(['overlay','imposter'].includes(mode))body=art+cell('内容说明','图像上的阅读信息。');
    if(mode==='media-object')body=`<span class="layout-demo-avatar" aria-hidden="true">林</span>${cell('林默','更新了项目设计说明。')}<a class="g-link" href="#layout-intro">查看</a>`;
    if(mode==='scroll-area')body=Array.from({length:8},(_,i)=>cell(`记录 ${i+1}`,'容器内滚动，页面宽度保持稳定。')).join('');
    if(['grid-auto-fit','grid-auto-fill','masonry','bento','reel','scroll-snap'].includes(mode))body=Array.from({length:6},(_,i)=>cell(`内容 ${i+1}`,i%2?'较短的说明。':'更完整的说明用于展示不同内容长度下的排列方式。',mode==='bento'?`--g-layout-span:${i===0?8:4};--g-layout-row-span:${i===0?2:1}`:'')).join('');
  }
  if(['page-header','section-header','subheader','footer-bar'].includes(kind))body=`${kind==='page-header'?'<a class="g-link" data-g-layout-back href="#layout-intro" aria-label="返回布局说明">← 返回</a>':''}<div data-g-layout-main><h3 class="${kind==='page-header'?'g-page-header-title':kind==='section-header'?'g-section-header-title':'g-subheader-title'}">${kind==='footer-bar'?'共 12 项 · 已保存':'项目设计规范'}</h3>${['page-header','section-header'].includes(kind)?'<p class="g-page-header-description">让复杂页面保持清晰、紧凑和一致。</p>':''}</div><div class="g-cluster"><a class="g-link" href="#layout-intro">阅读说明</a><button type="button" class="g-btn g-btn-small" data-demo-action="布局示例操作已触发">操作</button></div>`;
  if(kind==='app-shell'){options.collapsed=mode==='collapsed';body=`<aside class="g-app-shell-sidebar layout-demo-cell" data-g-layout-panel="sidebar"><strong>工作空间</strong><nav aria-label="工作空间"><a href="#layout-intro">概览</a><a href="#layout-intro">资源</a><a href="#layout-intro">设置</a></nav></aside><header class="g-app-shell-header">${button}<strong>项目控制台</strong></header><div class="g-app-shell-main">${cell('欢迎回来','自适应侧栏可展开、收起；受控模式由框架回写。')}<label>工作备注<input class="g-input" aria-label="工作备注" placeholder="输入内容不会因布局变化丢失"></label></div><aside class="g-app-shell-aside layout-demo-cell">最近活动<p>已更新设计规范。</p></aside>`;}
  if(kind==='dashboard')body=[cell('本周访问','12,860'),cell('任务完成率','86%'),cell('平均响应','240 ms'),cell('活动概览','统一网格容纳指标、图表与列表。'),cell('待办事项','审核设计 · 更新文档')].join('');
  if(kind==='mobile-shell')body=`<header class="g-mobile-header"><strong>项目动态</strong></header><div class="g-mobile-main">${cell('今日安排','查看日程和团队更新。')}${cell('最近动态','项目设计规范已更新。')}</div><nav class="g-mobile-bottom-nav" aria-label="底部导航"><a href="#layout-intro">首页</a><a href="#layout-intro">项目</a><a href="#layout-intro">我的</a></nav>`;
  if(kind==='responsive-container')body=`<h3>舒适的阅读宽度</h3><p>容器按可用空间收缩，支持固定最大宽度、流式宽度和阅读宽度。嵌套在侧栏、卡片或页面中时，内容都不会撑破父容器。</p>${cell('容器参数','maxWidth、padding、minHeight 与响应断点可组合。')}`;
  const extra=kind==='classic-layout-primitives'&&['reel','scroll-snap','scroll-area'].includes(mode)?' tabindex="0" role="region" aria-label="可滚动内容"':'';
  return {options,body,html:`<div class="layout-demo-host" id="layout-intro"><div class="${cls}" data-demo-component data-g-layout data-g-layout-options="${esc(JSON.stringify(options))}"${extra}>${body}</div></div>`};
}
export const layoutVariants=Object.fromEntries(Object.entries(layoutModes).map(([kind,modes])=>[kind,Object.fromEntries(modes.map(mode=>[mode,layoutFixture(kind,mode)]))]));
export const layoutExamples=Object.fromEntries(Object.keys(layoutModes).map(kind=>[kind,layoutFixture(kind).html]));
export const layoutDemoCss=`.layout-demo-host{min-width:0;max-width:100%;padding:16px;font:14px/1.6 var(--g-font-sans,system-ui,sans-serif);color:var(--g-color-text)}.layout-demo-cell{padding:16px;background:var(--g-color-surface-subtle);border:1px solid var(--g-color-border);border-radius:4px;min-width:0;overflow-wrap:anywhere}.layout-demo-host [data-g-layout-region=top],.layout-demo-host [data-g-layout-region=bottom]{padding:8px 16px;display:flex;align-items:center}.layout-demo-cell p{margin:8px 0 0;color:var(--g-color-text-muted)}.layout-demo-cell nav{display:grid;gap:8px;margin-top:16px}.layout-demo-avatar{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--g-color-primary-subtle);color:var(--g-color-text)}.layout-demo-host h3{font-size:20px;line-height:1.4;margin:0 0 8px}.layout-demo-host input{max-width:100%}.layout-demo-host label{display:grid;gap:8px;margin-top:16px}.layout-demo-host a{color:var(--g-color-primary-text);text-decoration:underline}.layout-demo-host [data-g-layout-toggle]{margin-inline-end:12px}`;
