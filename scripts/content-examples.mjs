import fs from 'node:fs';
const components=JSON.parse(fs.readFileSync(new URL('../packages/css/metadata/components.json',import.meta.url),'utf8')).components.filter(c=>c.category==='content');
const article='# 让内容保持清晰\n\n统一的组件为不同业务提供一致的阅读与编辑体验。\n\n## 设计原则\n\n- 清晰的层级\n- 紧凑且舒适的间距\n- 完整的键盘操作\n\n> 内容由应用提供，组件负责展示与交互。\n\n## 接入示例\n\n```js\nconst title = "Gardenerim";\nconsole.log(title);\n```\n\n支持 **重点信息**、*补充说明* 与 [项目文档](https://example.com/docs)。';
const items=[{key:'design',label:'设计资源',type:'folder'},{key:'guide',label:'组件使用指南.pdf',type:'application/pdf',size:246784,modified:'2026-09-06',description:'组件参数、状态和接入说明',properties:{版本:'2.1',所有者:'设计团队'}},{key:'cover',label:'文章封面.svg',type:'image/svg+xml',size:1840,src:'/content-assets/cover.svg',modified:'2026-09-05'},{key:'notes',label:'会议纪要.md',type:'text/markdown',size:3200,modified:'2026-09-04'},{key:'tokens',parent:'design',label:'设计变量.json',type:'application/json',size:14800}];
export const contentOptions=Object.fromEntries(components.map(c=>[c.name,{kind:c.name,title:c.name,text:article,items,searchable:true,labels:{query:'搜索内容',find:'查找文本',replacement:'替换为',comment:'评论内容','annotation-text':'标注内容'}}]));
const set=(names,options)=>names.forEach(name=>Object.assign(contentOptions[name],options));
set(['code-block','code-editor-shell','terminal'],{text:'const config = { size: "medium", bordered: true };\n\nfunction welcome(name) {\n  return `Hello, ${name}`;\n}\n\nconsole.log(welcome("Gardenerim"));',language:'JavaScript',lineNumbers:true});
set(['terminal'],{text:'$ npm run build\n\n✓ CSS compiled\n✓ Framework adapters generated\n✓ Content examples verified\n\nBuild complete.'});
set(['diff-viewer','revision-compare-composition'],{before:'const size = 24;\nconst theme = "light";\nrender(size);',after:'const size = 32;\nconst theme = "light";\nconst bordered = true;\nrender(size, bordered);',view:'split'});
set(['article-layout'],{author:'产品设计团队',date:'2026-09-06'});
set(['search-results'],{items:Array.from({length:8},(_,i)=>({key:String(i),label:['组件接入指南','内容编排规范','文件管理实践','编辑器使用说明'][i%4]+' · '+(i+1),description:'了解参数配置、受控状态与可访问性，构建适合业务需求的内容页面。',url:'https://example.com/docs/'+i})),pageSize:3});
set(['report-invoice'],{items:[{key:'design',label:'设计系统服务',quantity:2,price:1280},{key:'support',label:'技术支持',quantity:3,price:360}],currency:'CNY',taxRate:.06,discount:100});
set(['content-outline'],{sections:[{id:'content-intro',title:'内容概览',level:1},{id:'content-parameters',title:'参数配置',level:2},{id:'content-example',title:'完整示例',level:2}]});
set(['content-file-drop','content-upload-queue','chunk-upload','upload-progress-composition','failed-upload'],{items:[],maxFiles:5,maxSize:10485760,accept:'.txt,.md,.json,.png,.jpg,.pdf',chunkSize:1024,concurrency:2});
set(['file-card-composition','media-grid-composition','media-library-composition'],{view:'grid'});
set(['file-properties'],{value:{keys:['guide']}});
set(['media-details-composition'],{value:{keys:['cover']}});
set(['storage-meter'],{total:10737418240,used:6442450944});
set(['document-viewer-composition','file-preview-composition'],{pages:['# 项目说明\n\n这是第一页：描述目标与范围。\n\n## 目标\n\n让内容组件具备真实、可配置的行为。','# 参数与状态\n\n这是第二页：尺寸、边框、只读、受控与错误反馈。','# 接入验收\n\n这是第三页：检查操作、布局和五端一致性。'],thumbnails:true});
set(['pdf-viewer'],{src:'/content-assets/sample.pdf',pageCount:2});
set(['image-crop-composition','image-annotation-composition'],{src:'/content-assets/cover.svg',alt:'青绿色山丘与日出插画',annotations:[{x:65,y:28,text:'标题安全区域'},{x:30,y:70,text:'主要视觉区域'}],value:{crop:{x:10,y:10,width:80,height:70}}});
set(['audio-player-shell'],{src:'/content-assets/sample.wav',title:'真实音频 · 三秒提示音'});
set(['video-player-shell'],{src:'/content-assets/sample.mp4',preload:'none',sources:[{src:'/content-assets/sample.mp4',type:'video/mp4'},{src:'/content-assets/sample.webm',type:'video/webm'}],poster:'/content-assets/cover.svg',title:'真实视频 · 内容演示片段'});
set(['block-editor'],{blocks:[{text:'项目背景与目标'},{text:'可配置的内容组件'},{text:'验证与发布记录'}]});
set(['comment-thread-composition'],{author:'我',comments:[{author:'林晓',text:'建议把参数示例放在正文旁边。',date:'2026-09-06 10:20',resolved:false},{author:'陈嘉',text:'已补充窄屏布局，并检查键盘操作。',date:'2026-09-06 10:35',resolved:true}]});
set(['version-history-composition'],{versions:[{key:'v3',label:'版本 3 · 完整示例',author:'林晓',date:'2026-09-06',text:'# 完整示例\n\n增加受控状态与错误处理。'},{key:'v2',label:'版本 2 · 参数配置',author:'陈嘉',date:'2026-09-05',text:'# 参数配置\n\n补齐尺寸和边框。'}],value:{version:'v3'}});
set(['content-autosave-indicator'],{text:'修改这段内容，将触发可取消的本地异步保存。',saveDelay:500});
const escape=text=>String(text).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
export const contentExamples=Object.fromEntries(components.map(c=>{
 const classes=c.selector.match(/\.([\w-]+)/g).map(v=>v.slice(1)).join(' ');
 const extra=c.name==='content-outline'?'<article id="content-intro"><h3>内容概览</h3><p>大纲链接定位至本文各章节。</p><h3 id="content-parameters">参数配置</h3><p>设置章节 ID、标题和层级。</p><h3 id="content-example">完整示例</h3><p>点击大纲项目可定位至目标章节。</p></article>':'';
 return [c.name,'<section class="'+classes+'" data-demo-component="'+c.name+'" data-g-content data-g-content-options="'+escape(JSON.stringify(contentOptions[c.name]))+'"></section>'+extra];
}));
export const contentDemoServices=`function installContentDemo(root,api){
 if(!api)return;
 const options=JSON.parse(root.dataset.gContentOptions||'{}'),mode=root.dataset.demoContentService||'success';
 if(mode==='timeout')api.setOptions({serviceTimeout:options.serviceTimeout??1000});
 const wait=signal=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>{signal.removeEventListener('abort',cancel);resolve();},120);const cancel=()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));};signal.addEventListener('abort',cancel,{once:true});if(signal.aborted)cancel();});
 if(['content-file-drop','content-upload-queue','chunk-upload','upload-progress-composition','failed-upload'].includes(options.kind)){
  let fail=options.kind==='failed-upload'||mode==='retry';if(mode!=='none')api.setOptions({upload:async(file,{signal,onProgress})=>{if(mode==='timeout')return new Promise(()=>{});onProgress(.3);await wait(signal);if(fail){fail=false;throw new Error('演示：首次传输失败，请重试');}onProgress(1);}});
  api.addFiles([new File(['Gardenerim content demo.\\n'.repeat(100)],'guide.txt',{type:'text/plain'})]);
  if(options.kind==='failed-upload'||root.classList.contains('is-uploading')||root.classList.contains('is-success')||root.classList.contains('is-paused')){api.upload();if(root.classList.contains('is-paused'))setTimeout(()=>api.pauseUpload(),140);}
 }
 if(options.kind==='content-autosave-indicator'&&mode!=='none'){let first=mode==='retry';api.setOptions({save:async(text,{signal})=>{if(mode==='timeout')return new Promise(()=>{});await wait(signal);if(first){first=false;throw new Error('演示首次保存失败，请重试');}if(text.includes('[error]'))throw new Error('演示保存失败：移除 [error] 后重试');}});}
 root.addEventListener('gardener:action',event=>{if(event.target!==root||event.detail.reason!=='crop')return;const url=URL.createObjectURL(event.detail.blob);const link=document.createElement('a');link.href=url;link.download='crop.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
}`;
