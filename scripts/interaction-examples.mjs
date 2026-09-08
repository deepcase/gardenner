import fs from 'node:fs';
const components=JSON.parse(fs.readFileSync(new URL('../packages/css/metadata/components.json',import.meta.url),'utf8')).components.filter(c=>c.category==='interaction');
const people=[{key:'lin',label:'林晓',description:'产品设计 · 在线',avatar:'林'},{key:'chen',label:'陈嘉',description:'前端开发 · 上海',avatar:'陈'},{key:'zhou',label:'周宁',description:'已暂停协作',avatar:'周',disabled:true}];
const resources=[{key:'design',label:'设计系统',description:'组件规范与设计资产'},{key:'web',label:'官方网站',description:'网站与文档'},{key:'mobile',label:'移动应用',description:'iOS / Android 体验'},{key:'archive',label:'归档项目',description:'只读数据，不能选择',disabled:true}];
const trees=[{key:'east',label:'华东团队',children:[{key:'sh',label:'上海研发中心'},{key:'hz',label:'杭州设计团队'}]},{key:'south',label:'华南团队',children:[{key:'sz',label:'深圳交付团队'}]}];
const special={
 'saved-views':{title:'保存的视图',items:[{key:'mine',label:'我负责的'},{key:'recent',label:'最近更新'},{key:'all',label:'全部项目'}],value:{keys:['mine']},searchable:false},
 'saved-filters':{title:'常用筛选',items:[{key:'open',label:'待处理'},{key:'week',label:'本周到期'},{key:'high',label:'高优先级'}],multiple:true,searchable:false},
 'sort-builder':{title:'多字段排序',fields:[{key:'updated',label:'更新时间'},{key:'priority',label:'优先级'},{key:'name',label:'名称'}],value:{rules:[{field:'updated',direction:'desc'}]}},
 'group-builder':{title:'多层分组',fields:[{key:'team',label:'团队'},{key:'status',label:'状态'},{key:'owner',label:'负责人'}],value:{rules:[{field:'team',direction:'asc'}]}},
 'selection-controls':{title:'选择项目',multiple:true,value:{keys:['design']}},
 'dual-list':{title:'分配项目',value:{targetKeys:['web']}},'transfer-list':{title:'成员权限穿梭',items:people,value:{targetKeys:['chen']}},
 'tree-select':{title:'选择团队',items:trees,multiple:true,cascade:true},'cascader':{title:'选择所属组织',items:trees,leafOnly:true},'organization-picker':{title:'组织选择',items:trees},
 'mention-picker':{title:'提及协作者',items:people,placeholder:'搜索姓名以插入提及'},'user-picker':{title:'选择负责人',items:people},
 'resource-picker':{title:'选择资源'},'entity-picker':{title:'关联实体'},'relation-picker':{title:'关联项目',multiple:true},
 'tag-picker':{title:'项目标签',items:[{key:'design',label:'设计'},{key:'engineering',label:'研发'},{key:'review',label:'待评审'}],multiple:true},
 'media-picker':{title:'选择媒体',items:[{key:'cover',label:'品牌封面.svg',icon:'▧',description:'矢量插图 · 24 KB'},{key:'guide',label:'操作指南.mp4',icon:'▷',description:'视频 · 02:35'},{key:'audio',label:'欢迎语.mp3',icon:'♫',description:'音频 · 00:18'}]},
 'icon-picker':{title:'选择图标',items:[{key:'home',label:'首页',icon:'⌂'},{key:'star',label:'收藏',icon:'☆'},{key:'calendar',label:'日历',icon:'▦'},{key:'check',label:'完成',icon:'✓'}]},
 'color-picker-composition':{title:'选择主题色',items:[{key:'green',label:'园林绿',color:'#16a34a'},{key:'blue',label:'天空蓝',color:'#2563eb'},{key:'amber',label:'琥珀色',color:'#d97706'},{key:'rose',label:'玫瑰红',color:'#e11d48'}]},
 'date-range-picker-composition':{title:'统计日期范围',min:'2026-01-01',max:'2026-12-31',value:{range:{start:'2026-09-01',end:'2026-09-07'}},presets:[{label:'九月',start:'2026-09-01',end:'2026-09-30'},{label:'第三季度',start:'2026-07-01',end:'2026-09-30'}]},
 'time-range-picker-composition':{title:'工作时段',min:'08:00',max:'22:00',value:{range:{start:'09:00',end:'18:00'}},presets:[{label:'上午',start:'09:00',end:'12:00'},{label:'下午',start:'13:00',end:'18:00'}]},
 'split-pane':{title:'可调整工作区',panels:['项目目录：设计系统、官方网站、移动应用','工作区内容：拖动分隔线，或聚焦后使用方向键调整比例。'],value:{ratio:35},minRatio:20,maxRatio:80,step:5},
 'drag-sort':{title:'安排项目优先级'},
 'bulk-confirmation':{title:'确认批量归档',description:'归档设计系统和官方网站。勾选确认后，应用将收到操作事件；本示例不会修改远程数据。',items:resources.slice(0,2),value:{keys:['design','web']},multiple:true},
 'bulk-progress':{title:'本地批处理演示',items:resources.slice(0,3),concurrency:2},
 'infinite-scroll':{title:'项目动态',items:[{key:'feed-1',label:'设计规范完成评审'},{key:'feed-2',label:'新版官网进入验收'}],hasMore:true},
 'pull-refresh':{title:'团队消息',items:[{key:'feed-1',label:'等待刷新以获取本地示例消息'}]},
 'copy-action':{title:'复制项目链接',text:'https://example.com/projects/design-system'},
 'fullscreen-action':{title:'专注工作区',description:'使用浏览器真实全屏接口查看工作区。按 Escape 返回。'},
 'undo-history':{title:'本地编辑历史',value:{history:[{label:'创建草稿',value:{title:'新项目',status:'draft'}},{label:'修改项目名称',value:{title:'设计系统升级',status:'draft'}},{label:'提交评审',value:{title:'设计系统升级',status:'review'}}],cursor:2}}
};
for(const name of ['batch-toolbar','action-bar','bulk-action-bar','floating-action-bar','sticky-actions'])special[name]={title:'项目操作',description:'2 个项目待处理',value:{keys:['design','web']},multiple:true,actions:[{key:'approve',label:'通过评审',requiresSelection:true},{key:'export',label:'导出清单'},{key:'archive',label:'归档',tone:'danger'}]};
export const interactionOptions=Object.fromEntries(components.map(c=>[c.name,{kind:c.name,items:resources,clearable:true,searchable:true,...special[c.name]}]));
const escape=value=>JSON.stringify(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export const interactionExamples=Object.fromEntries(components.map(c=>[c.name,`<section class="${c.cssSelector.slice(1)}" data-demo-component data-g-interaction data-g-interaction-options="${escape(interactionOptions[c.name])}" aria-label="${interactionOptions[c.name].title}"></section>`]));
// Local, deterministic services demonstrate callbacks without pretending to contact a backend.
export const interactionDemoServices=`function installInteractionDemo(root,api){if(!api)return;const mode=root.dataset.demoInteractionService||'success';if(mode==='none')return;let failed=false,refresh=0;if(mode==='timeout')api.setOptions({serviceTimeout:JSON.parse(root.dataset.gInteractionOptions||'{}').serviceTimeout??200});api.setOptions({load:async({signal,offset,reset})=>{if(mode==='timeout')return new Promise(()=>{});if(mode==='retry'&&!failed){failed=true;throw new Error('首次加载失败，请重试');}await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,100);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));},{once:true});});if(reset)refresh++;const start=reset?0:offset;return {items:Array.from({length:3},(_,i)=>({key:'local-'+refresh+'-'+(start+i),label:'本地示例消息 '+(start+i+1)+(reset?' · 刷新 '+refresh:'')})),hasMore:start<8};},run:async(item,{signal})=>{if(mode==='timeout')return new Promise(()=>{});if(mode==='retry'&&!failed){failed=true;throw new Error('首次处理失败，请重试');}await new Promise((resolve,reject)=>{const timer=setTimeout(resolve,120);signal.addEventListener('abort',()=>{clearTimeout(timer);reject(new DOMException('Cancelled','AbortError'));},{once:true});});}});}`;
