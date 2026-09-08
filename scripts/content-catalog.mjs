import fs from 'node:fs';
import {writeFile} from './fs-retry.mjs';
const path='packages/css/metadata/components.json',catalog=JSON.parse(fs.readFileSync(path,'utf8'));
if(!catalog.components.some(c=>c.name==='markdown-viewer'))catalog.components.push({name:'markdown-viewer',category:'content',selector:'.g-markdown-viewer',platforms:['web','mobile','desktop']});
export const families={
 code:['code-block','terminal','diff-viewer','revision-compare-composition'],
 article:['article-layout','search-results','report-invoice','content-outline','markdown-viewer'],
 files:['content-file-list','file-card-composition','folder-tree-composition','file-browser-composition','media-library-composition','media-grid-composition','media-details-composition','file-properties','storage-meter'],
 upload:['content-file-drop','content-upload-queue','chunk-upload','upload-progress-composition','failed-upload'],
 viewer:['file-preview-composition','document-viewer-composition','pdf-viewer','image-crop-composition','image-annotation-composition'],
 media:['video-player-shell','audio-player-shell'],
 editor:['code-editor-shell','rich-text-editor-composition','markdown-editor','block-editor','editor-toolbar-composition','find-replace'],
 review:['content-autosave-indicator','comment-thread-composition','version-history-composition']
};
const extras={code:['wrap','line-numbers'],article:['narrow','wide'],files:['list','grid'],upload:['summary','detailed'],viewer:['fit','thumbnails'],media:['compact-controls','wide'],editor:['split','source-only'],review:['timeline','compact-list']};
const findings={code:'原有静态代码或切换外壳；补齐文本、复制、换行、行号和真实行差异。',article:'原有布局；补齐文章数据、检索分页、金额计算、大纲与安全 Markdown 阅读。',files:'原有样式或 DOM 选择；补齐文件数据、过滤排序、目录导航、选择和属性。',upload:'原有上传外壳或 DOM 队列；补齐文件校验、真实异步回调、分块、进度、取消和失败重试。',viewer:'原有预览外壳；补齐文档翻页、缩放、原生 PDF、图像裁剪输出和标注坐标。',media:'已有基础播放行为；补齐真实媒体源、播放速率、音量、进度及错误反馈。',editor:'原有文本计数与工具命令；补齐受控编辑、预览、格式、块操作与查找替换。',review:'原有样式或保存标记；补齐评论、版本选择和真实异步保存状态。'};
const components=catalog.components.filter(c=>c.category==='content');
for(const c of components){const family=Object.keys(families).find(f=>families[f].includes(c.name));if(!family)throw new Error(c.name);if(!c.cssSelector||!/^\.g-[a-z0-9-]+$/.test(c.cssSelector))c.cssSelector=c.selector.match(/\.g-[a-z0-9-]+/g).at(-1);c.behaviors=[...new Set([...(c.behaviors||[]),'content'])];c.type='interactive';c.status='runtime-ready';c.variants=[...new Set([...(c.variants||[]),'compact','comfortable','bordered','borderless',...extras[family]])];c.states=[...new Set([...(c.states||[]),'loading','empty','error','disabled','readonly'])];c.parts=[...new Set([...(c.parts||[]),'g-content-heading','g-content-actions','g-content-status','g-content-button','g-content-body'])];}
await writeFile(path,JSON.stringify(catalog,null,2)+'\n');
fs.mkdirSync('docs/content',{recursive:true});
await writeFile('docs/content/inventory.json',JSON.stringify({originalComponents:38,newComponents:1,components:components.length,variants:components.reduce((s,c)=>s+c.variants.length,0),items:components.map(c=>({name:c.name,cssSelector:c.cssSelector,variants:c.variants,legacyBehaviors:c.behaviors.filter(b=>b!=='content'),family:Object.keys(families).find(f=>families[f].includes(c.name)),finding:c.name==='markdown-viewer'?'新增：安全 Markdown 阅读，与编辑器共用解析器。':findings[Object.keys(families).find(f=>families[f].includes(c.name))]}))},null,2)+'\n');
const body={compact:'--g-content-padding:12px;--g-content-gap:8px',comfortable:'--g-content-padding:20px;--g-content-gap:16px',bordered:'--g-content-border-width:1px',borderless:'--g-content-border-width:0px',wrap:'--g-content-code-wrap:pre-wrap','line-numbers':'--g-content-gutter:3rem',narrow:'--g-content-measure:60ch',wide:'--g-content-measure:100%;--g-content-media-height:540px',list:'--g-content-columns:1',grid:'--g-content-columns:3',summary:'--g-content-details:none',detailed:'--g-content-details:block',fit:'--g-content-preview-fit:contain',thumbnails:'--g-content-thumbnails:flex','compact-controls':'--g-content-padding:8px',split:'--g-content-editor-columns:2','source-only':'--g-content-preview-display:none;--g-content-editor-columns:1',timeline:'--g-content-timeline:2px','compact-list':'--g-content-gap:6px'};
await writeFile('packages/css/src/components/content-variants.css','@layer gardener.components {\n'+components.flatMap(c=>c.variants.map(v=>c.cssSelector+'-'+v+'{'+body[v]+'}')).join('\n')+'\n}\n');
