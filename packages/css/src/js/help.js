/** Shared, opt-in help compositions. Legacy author-owned markup is untouched. */
export const helpModes = {
  tip:['default','info','success','warning','danger'], 'inline-hint':['default','compact','success','warning'],
  'help-text':['default','success','warning','danger'], 'help-trigger':['default','text','icon'],
  'rich-tooltip':['default','top','bottom','start','end'], 'help-popover':['default','top','bottom','start','end'],
  'definition-help':['default','inline','popover'], callout:['default','info','success','warning','danger','dismissible'],
  note:['default','compact','warning'], 'guidance-pair':['default','stacked','compact'],
  'key-hint':['default','mac','windows'], 'shortcut-list':['default','searchable','grouped'],
  'help-card':['default','compact','borderless'], 'help-panel':['default','compact','borderless'],
  'help-center':['default','compact','categorized'], 'help-topics':['default','list','compact'],
  faq:['default','multiple','searchable','borderless'], 'contextual-help':['default','compact','dismissible'],
  'coach-mark':['default','top','bottom'], spotlight:['default','top','bottom'], hotspot:['default','quiet','text'],
  'feature-hint':['default','compact','dismissible'], 'whats-new':['default','compact','grouped'],
  'help-checklist':['default','compact','readonly'], troubleshooting:['default','linear','compact'],
  'help-feedback':['default','reason','compact'], 'tour-spotlight':['default','top','bottom'],
  'help-search':['default','compact','categorized'], 'help-glossary':['default','compact','grouped']
};
const floats=new Set(['help-trigger','rich-tooltip','help-popover','hotspot']);
const tours=new Set(['coach-mark','spotlight','tour-spotlight']);
const searchable=new Set(['help-center','help-search','help-glossary']);
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const copy=v=>JSON.parse(JSON.stringify(v));
const labels={search:'搜索帮助',empty:'没有匹配的内容，请尝试其他关键词。',loading:'正在加载…',retry:'重试',clear:'清除',close:'关闭',start:'开始引导',previous:'上一步',next:'下一步',finish:'完成',skip:'跳过',yes:'有帮助',no:'没有帮助',feedback:'这篇内容对你有帮助吗？',reason:'补充说明（可选）',submit:'提交反馈',thanks:'感谢你的反馈。',pending:'反馈已选择，可由应用处理。',error:'操作失败，请重试。',cancel:'取消',missing:'当前步骤的目标暂不可见。',progress:'进度',all:'全部',read:'阅读说明'};
function validate(v){
  if(!object(v)||!Object.hasOwn(helpModes,v.kind))throw new TypeError('helpOptions requires a valid kind');
  if(v.mode!=null&&!helpModes[v.kind].includes(v.mode))throw new TypeError('Invalid help mode');
  if(v.size!=null&&!['small','medium','large'].includes(v.size))throw new TypeError('Invalid help size');
  if(v.tone!=null&&!['neutral','info','success','warning','danger'].includes(v.tone))throw new TypeError('Invalid help tone');
  if(v.direction!=null&&!['ltr','rtl'].includes(v.direction))throw new TypeError('Invalid help direction');
  if(v.trigger!=null&&(typeof v.trigger!=='string'||v.trigger.split(/[ ,]+/).some(x=>!['click','focus','hover','contextmenu'].includes(x))))throw new TypeError('Invalid help trigger');
  if(v.placement!=null&&!/^(top|bottom|left|right)(-start|-end)?$/.test(v.placement))throw new TypeError('Invalid help placement');
  for(const key of ['disabled','bordered','searchable','multiple','dismissible','readonly','animated','showHeader','showActions','showProgress','showCount','showClear','showPrevious','showStepList','arrow','closeOnEscape','closeOnOutside'])if(v[key]!=null&&typeof v[key]!=='boolean')throw new TypeError(`Invalid help ${key}`);
  for(const [key,min,max] of [['columns',1,4],['limit',1,200],['debounce',0,2000],['width',160,960],['serviceTimeout',0,600000],['maxReasonLength',1,10000],['minQueryLength',0,100],['tourPadding',0,48],['offset',0,64],['openDelay',0,2000],['closeDelay',0,2000],['maxHeight',80,1200]])if(v[key]!=null&&(!Number.isInteger(v[key])||v[key]<min||v[key]>max))throw new TypeError(`Invalid help ${key}`);
  if(v.keys!=null&&(!Array.isArray(v.keys)||v.keys.some(k=>typeof k!=='string')))throw new TypeError('Invalid help keys');
  if(v.items!=null){if(!Array.isArray(v.items))throw new TypeError('help items must be an array');const ids=new Set();for(const item of v.items){if(!object(item)||typeof item.id!=='string'||!item.id||ids.has(item.id))throw new TypeError('Help items require unique nonempty string IDs');ids.add(item.id);if(item.keywords!=null&&(!Array.isArray(item.keywords)||item.keywords.some(k=>typeof k!=='string')))throw new TypeError('Invalid help keywords');if(item.actions)validate({kind:v.kind,actions:item.actions});if(item.keys!=null&&(!Array.isArray(item.keys)||item.keys.some(k=>typeof k!=='string')))throw new TypeError('Shortcut keys must be an array');}}
  if(v.items?.length>1000)throw new TypeError('At most 1000 help items');
  if(v.actions!=null&&(!Array.isArray(v.actions)||v.actions.some(a=>!object(a)||typeof a.label!=='string')))throw new TypeError('Help actions must be an array');
  if(v.labels!=null&&!object(v.labels))throw new TypeError('Help labels must be an object');
  for(const key of ['load','submit'])if(v[key]!=null&&typeof v[key]!=='function')throw new TypeError(`help ${key} must be a function supplied through setOptions`);
  return v;
}
let serial=0;
export function createHelpController(element,{emit,createFloating,positionFloating}){
  const doc=element.ownerDocument,win=doc.defaultView,original=[...element.childNodes],saved=new Map(),originalStyles=element.getAttribute('style'),id=`g-help-${++serial}`;
  let options,state={query:'',category:'',expanded:[],completed:[],step:0,open:false,dismissed:false,feedback:null,reason:''},overrides={},observer,disposed=false,floating,spotlight,frame=0,timer=0,abort,requestId=0,busy=false,error='',results=null,submitted=false,last='',errorSignature='',returnFocus=null,composing=false;
  function attr(name,value){if(!saved.has(name))saved.set(name,element.getAttribute(name));if(value==null)element.removeAttribute(name);else if(element.getAttribute(name)!==String(value))element.setAttribute(name,String(value));}
  function make(tag,text,cls){const node=doc.createElement(tag);if(text!=null)node.textContent=String(text);if(cls)node.className=cls;return node;}
  function label(key){return String(options.labels?.[key]??labels[key]);}
  function button(text,action,key){const node=make('button',text,'g-help-button');node.type='button';node.dataset.helpAction=action;if(key!=null)node.dataset.helpKey=key;node.disabled=!!options.disabled;return node;}
  function safeLink(value){if(typeof value!=='string'||!value.trim())return null;try{const url=new URL(String(value),doc.baseURI);return !url.username&&!url.password&&['http:','https:','mailto:','tel:'].includes(url.protocol)?url.href:null;}catch{return null;}}
  function textBlock(parent,title,text){if(title)parent.append(make('strong',title,'g-help-heading'));if(text)parent.append(make('p',text,'g-help-description'));}
  function actions(parent,items=options.actions||[]){if(!items.length||!options.showActions)return;const row=make('div',null,'g-help-actions');for(const item of items){const href=safeLink(item.href);let node;if(href&&!options.disabled){node=make('a',item.label||label('read'),'g-help-link');node.href=href;}else node=button(item.label||label('read'),'action',item.id||item.label);row.append(node);}parent.append(row);}
  function keys(parent,values=options.keys||['Ctrl','K']){const row=make('span',null,'g-help-keys');row.setAttribute('aria-label',values.join(' + '));for(const value of values)row.append(make('kbd',value));parent.append(row);}
  function normalize(v){
    if(!object(v))throw new TypeError('helpValue must be an object');const next={...state};for(const key of Object.keys(state))if(Object.hasOwn(v,key))next[key]=v[key];
    for(const k of ['query','category','reason'])if(typeof next[k]!=='string')throw new TypeError(`helpValue.${k} must be a string`);
    if(next.reason.length>options.maxReasonLength)throw new TypeError('Help reason exceeds maxReasonLength');
    for(const k of ['open','dismissed'])if(typeof next[k]!=='boolean')throw new TypeError(`helpValue.${k} must be boolean`);
    for(const k of ['expanded','completed']){if(!Array.isArray(next[k])||next[k].some(x=>typeof x!=='string'))throw new TypeError(`helpValue.${k} must be string[]`);next[k]=[...new Set(next[k])].filter(x=>[...options.items,...(results||[])].some(item=>item.id===x));}
    if(!options.multiple)next.expanded=next.expanded.slice(-1);
    if(!Number.isInteger(next.step)||next.step<0)throw new TypeError('helpValue.step must be a nonnegative integer');next.step=Math.min(next.step,Math.max(0,options.items.length-1));
    if(next.feedback!==null&&!['yes','no'].includes(next.feedback))throw new TypeError('helpValue.feedback must be yes, no or null');return next;
  }
  function setValue(value,reason='api'){
    if(disposed||!options||options.disabled)return false;const next=normalize(value),controlled=element.hasAttribute('data-g-help-value');
    if(JSON.stringify(next)===JSON.stringify(state))return true;
    if(!emit(element,'beforechange',{value:copy(next),previousValue:copy(state),reason,controlled}))return false;
    if(!controlled){const old=state;state=next;applyState(old);}emit(element,'change',{value:copy(next),reason,controlled});return true;
  }
  function applyState(old){
    if(old.query!==state.query||old.category!==state.category){cancelRequest();results=null;submitted=false;render();if(options.load)scheduleSearch();}
    else if(floating&&old.open!==state.open&&JSON.stringify({...old,open:state.open})===JSON.stringify(state)){floating.root.setAttribute('data-g-overlay-open',String(state.open));if(!state.open&&floating.trigger.isConnected)floating.trigger.focus({preventScroll:true});}
    else {render();if(old.open&&!state.open&&tours.has(options.kind))(returnFocus?.isConnected?returnFocus:element.querySelector('[data-help-action="open"]'))?.focus({preventScroll:true});}
  }
  function filtered(){const query=state.query.trim().toLocaleLowerCase();return (results??options.items).filter(item=>(!state.category||item.category===state.category)&&(!query||results!==null||[item.title,item.description,item.answer,item.term,item.category,...(item.keywords||[])].join(' ').toLocaleLowerCase().includes(query))).slice(0,options.limit);}
  function searchUI(parent){const wrap=make('div',null,'g-help-searchbar'),input=make('input');input.type='search';input.className='g-input';input.value=state.query;input.placeholder=options.placeholder||label('search');input.setAttribute('aria-label',label('search'));input.dataset.helpField='query';input.disabled=!!options.disabled;wrap.append(input);if(options.showClear)wrap.append(button(label('clear'),'clear'));parent.append(wrap);if(options.mode==='categorized'){const row=make('div',null,'g-help-actions');for(const category of ['',...new Set(options.items.map(item=>item.category).filter(Boolean))]){const b=button(category||label('all'),'category',category);b.setAttribute('aria-pressed',String(category===state.category));row.append(b);}parent.append(row);}}
  function renderItems(parent){
    const items=filtered(),kind=options.kind,list=make('div',null,'g-help-items');if(options.maxHeight)list.tabIndex=0;
    if(!items.length&&!busy)list.append(make('p',label('empty'),'g-help-empty'));
    let group='';
    for(const item of items){
      if(options.mode==='grouped'&&item.category&&item.category!==group){group=item.category;list.append(make('h3',group,'g-help-group'));}
      const row=make('div',null,'g-help-item');row.dataset.helpItem=item.id;
      if(kind==='faq'){
        const expanded=state.expanded.includes(item.id),b=button(item.title,'expand',item.id),panel=make('div',item.answer||item.description,'g-help-answer');b.disabled ||= !!item.disabled;b.id=`${id}-q-${items.indexOf(item)}`;panel.id=`${id}-a-${items.indexOf(item)}`;b.setAttribute('aria-expanded',String(expanded));b.setAttribute('aria-controls',panel.id);panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',b.id);panel.hidden=!expanded;row.append(b,panel);
      }else if(kind==='help-checklist'){
        const wrap=make('label',null,'g-help-check'),input=make('input');input.type='checkbox';input.checked=state.completed.includes(item.id);input.dataset.helpCheck=item.id;input.disabled=!!(options.disabled||options.readonly||item.disabled);const text=make('span');textBlock(text,item.title,item.description);wrap.append(input,text);row.append(wrap);
      }else if(kind==='shortcut-list'){const text=make('span');textBlock(text,item.title,item.description);row.append(text);keys(row,item.keys||[]);}
      else if(kind==='help-glossary'){const dl=make('dl');dl.append(make('dt',item.term||item.title),make('dd',item.description||item.answer));row.append(dl);}
      else {textBlock(row,item.title,item.description);actions(row,item.href?[{id:item.id,label:item.actionLabel||label('read'),href:item.href}]:item.actions||[]);if(kind==='whats-new'&&item.date){const time=make('time',item.date);time.dateTime=item.date;row.prepend(time);}}
      list.append(row);
    }
    parent.append(list);
    if(kind==='help-checklist'&&options.showProgress){const completed=options.items.filter(item=>state.completed.includes(item.id)).length,p=make('progress');p.max=options.items.length||1;p.value=completed;p.setAttribute('aria-label',label('progress'));parent.append(p,make('span',`${completed} / ${options.items.length}`));}
  }
  function cleanupSurface(){floating?.api.destroy();floating=null;spotlight?.remove();spotlight=null;if(frame)win.cancelAnimationFrame(frame);frame=0;}
  function positionTour(){if(disposed||!options||!state.open||!tours.has(options.kind))return;const panel=element.querySelector('.g-help-tour-panel'),item=options.items[state.step];if(!panel||!item)return;let target;try{target=item.target?doc.querySelector(item.target):null;}catch{}const rect=target?.getBoundingClientRect();if(target&&rect.width&&rect.height){spotlight.hidden=false;spotlight.style.cssText=`left:${Math.max(0,rect.left-options.tourPadding)}px;top:${Math.max(0,rect.top-options.tourPadding)}px;width:${rect.width+options.tourPadding*2}px;height:${rect.height+options.tourPadding*2}px`;panel.style.transform='none';panel.style.setProperty('--g-overlay-offset',String(options.offset));positionFloating(target,panel,item.placement||options.placement);}else{spotlight.hidden=true;panel.style.position='fixed';panel.style.left='50%';panel.style.top='50%';panel.style.transform='translate(-50%,-50%)';}const notice=panel.querySelector('[data-help-missing]');if(notice)notice.hidden=!!(rect?.width&&rect?.height);}
  function queuePosition(){if(!frame)frame=win.requestAnimationFrame(()=>{frame=0;positionTour();});}
  function renderTour(parent){
    const trigger=button(options.triggerLabel||label('start'),'open');parent.append(trigger);
    if(!options.items.length){trigger.disabled=true;parent.append(make('p',label('empty')));return;}if(!state.open||options.disabled)return;
    const item=options.items[state.step],panel=make('div',null,'g-help-tour-panel');panel.tabIndex=-1;panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby',id+'-title');textBlock(panel,item.title||options.title||label('start'),item.description);panel.querySelector('.g-help-heading').id=id+'-title';
    const notice=make('p',label('missing'),'g-help-description');notice.dataset.helpMissing='';panel.append(notice);if(options.showProgress)panel.append(make('p',`${state.step+1} / ${options.items.length}`));
    const row=make('div',null,'g-help-actions'),prev=button(label('previous'),'previous');prev.disabled ||= state.step===0;if(options.showPrevious)row.append(prev);row.append(button(label(state.step===options.items.length-1?'finish':'next'),'next'));if(options.dismissible)row.append(button(label('skip'),'close'));panel.append(row);parent.append(panel);
    spotlight=make('div',null,'g-help-spotlight');spotlight.setAttribute('aria-hidden','true');doc.body.append(spotlight);
    if(typeof panel.showPopover==='function'){panel.setAttribute('popover','manual');try{panel.showPopover();}catch{}}
    queuePosition();win.queueMicrotask(()=>{if(panel.isConnected)panel.focus({preventScroll:true});});
  }
  function renderFloating(parent){
    const tooltip=options.kind==='rich-tooltip',type=tooltip?'tooltip':'popover',root=make('span',null,'g-help-floating');
    const trigger=button(options.triggerLabel||options.title||'?','floating');trigger.setAttribute(`data-g-${type}-trigger`,'');
    const panel=make('div',null,'g-help-floating-panel');panel.setAttribute(`data-g-${type}-content`,'');textBlock(panel,options.title,options.description);if(!tooltip){actions(panel);const close=button(label('close'),'close');panel.append(close);}
    root.append(trigger,panel);parent.append(root);root.setAttribute('data-g-overlay-trigger',options.trigger||(tooltip?'hover focus':'click'));root.setAttribute('data-g-overlay-controlled','true');root.setAttribute('data-g-overlay-open',String(state.open&&!options.disabled));root.setAttribute('data-g-overlay-disabled',String(options.disabled));root.setAttribute('data-g-overlay-width',String(options.width));root.setAttribute('data-g-overlay-autofocus',tooltip?'false':'true');root.setAttribute('data-g-overlay-placement',options.placement);for(const [key,name]of Object.entries({arrow:'arrow',offset:'offset',openDelay:'open-delay',closeDelay:'close-delay',closeOnEscape:'keyboard',closeOnOutside:'outside-closable'}))root.setAttribute('data-g-overlay-'+name,String(options[key]));
    // Stop child events at the composition boundary; adapters only receive the public state.
    root.addEventListener('gardener:change',event=>{event.stopPropagation();setValue({open:!!event.detail.open},event.detail.reason||'trigger');});
    for(const name of ['beforeopen','beforeclose','open','close'])root.addEventListener('gardener:'+name,event=>event.stopPropagation());
    floating={root,trigger,api:createFloating(root,type)};
  }
  function render(){
    if(disposed||!options||composing)return;const active=doc.activeElement,field=element.contains(active)?active.dataset.helpField:null,action=element.contains(active)?active.dataset.helpAction:null,key=active?.dataset.helpKey,selection=field?active.selectionStart:null;
    const retained=field?active:null;cleanupSurface();element.replaceChildren();attr('data-g-help-kind',options.kind);attr('data-g-help-mode',options.mode);attr('data-g-help-density',options.size);attr('data-g-help-tone',options.tone);attr('data-g-help-frame',String(options.bordered));attr('data-g-help-animated',String(options.animated));attr('aria-disabled',options.disabled?'true':null);attr('aria-busy',busy?'true':null);attr('dir',options.direction||saved.get('dir'));element.style.setProperty('--g-help-columns',String(options.columns));element.style.setProperty('--g-help-width',options.width+'px');element.style.setProperty('--g-help-maxHeight',options.maxHeight?options.maxHeight+'px':'none');
    const host=make('div',null,'g-help-composition');element.append(host);
    if(state.dismissed){host.hidden=true;return;}
    if(floats.has(options.kind)||options.kind==='definition-help'&&options.mode==='popover'){renderFloating(host);return;}
    if(tours.has(options.kind)){renderTour(host);return;}
    const kind=options.kind;
    if(kind==='key-hint'){keys(host,options.keys||(options.mode==='mac'?['⌘','K']:['Ctrl','K']));if(options.description)host.append(make('span',options.description));return;}
    if(options.showHeader)textBlock(host,options.title,options.description);
    if(options.dismissible&&!['faq','troubleshooting'].includes(kind))host.append(button(label('close'),'dismiss'));
    if(options.searchable)searchUI(host);
    if(kind==='guidance-pair'){const grid=make('div',null,'g-help-guidance');for(const [title,text] of [[options.doLabel||'建议',options.do],[options.dontLabel||'避免',options.dont]]){const cell=make('div');textBlock(cell,title,text);grid.append(cell);}host.append(grid);}
    else if(kind==='help-feedback'){
      const row=make('div',null,'g-help-actions');for(const choice of ['yes','no']){const b=button(label(choice),'feedback',choice);b.setAttribute('aria-pressed',String(state.feedback===choice));b.disabled ||= busy||options.readonly;row.append(b);}host.append(row);
      if(options.mode==='reason'&&state.feedback){const input=make('textarea');input.dataset.helpField='reason';input.setAttribute('aria-label',label('reason'));input.placeholder=label('reason');input.maxLength=options.maxReasonLength;input.value=state.reason;input.readOnly=options.readonly;input.disabled=busy||options.disabled;host.append(input,button(label('submit'),'submit'));}
      host.append(make('p',submitted?label('thanks'):state.feedback?label('pending'):'','g-help-feedback-status'));
    }else if(kind==='troubleshooting'){
      const item=options.items[state.step];if(item){const steps=make('nav',null,'g-help-actions');steps.setAttribute('aria-label',label('progress'));options.items.forEach((entry,i)=>{const b=button(`${i+1}. ${entry.title}`,'step',String(i));b.setAttribute('aria-current',i===state.step?'step':'false');b.disabled ||= !!entry.disabled||options.mode==='linear'&&i>state.step;steps.append(b);});if(options.showStepList)host.append(steps);const body=make('div',null,'g-help-item');textBlock(body,item.title,item.description);actions(body,item.actions||[]);host.append(body);const prev=button(label('previous'),'previous');prev.disabled ||= state.step===0;if(options.showPrevious)host.append(prev);host.append(button(label(state.step===options.items.length-1?'finish':'next'),'next'));}
    }else if(options.items.length||['faq','help-search','help-glossary','help-topics','help-center','help-checklist','shortcut-list','whats-new'].includes(kind))renderItems(host);
    actions(host);
    const status=make('div',busy?label('loading'):error||(state.query&&options.showCount?`${filtered().length} ${options.labels?.results||'条结果'}`:''),'g-help-status');status.setAttribute('role',error?'alert':'status');host.append(status);if(busy)host.append(button(label('cancel'),'cancel'));if(error)host.append(button(label('retry'),'retry'));
    const restore=field?[...element.querySelectorAll('[data-help-field]')].find(n=>n.dataset.helpField===field):action?[...element.querySelectorAll('[data-help-action]')].find(n=>n.dataset.helpAction===action&&n.dataset.helpKey===key):null;
    if(retained&&restore&&retained.tagName===restore.tagName){for(const a of [...retained.attributes])if(!restore.hasAttribute(a.name))retained.removeAttribute(a.name);for(const a of [...restore.attributes])retained.setAttribute(a.name,a.value);retained.value=restore.value;restore.replaceWith(retained);}const focus=retained?.isConnected?retained:restore;
    if(focus&&!focus.disabled){focus.focus({preventScroll:true});if(field&&selection!=null)try{focus.setSelectionRange(selection,selection);}catch{}}
  }
  function cancelRequest(){clearTimeout(timer);timer=0;abort?.abort();abort=null;requestId++;busy=false;error='';}
  function scheduleSearch(){clearTimeout(timer);if(state.query.trim().length<options.minQueryLength)return;timer=win.setTimeout(()=>run('load'),options.debounce);}
  async function run(type,choice=state.feedback){
    if(disposed||options.disabled||type==='submit'&&options.readonly||typeof options[type]!=='function')return false;
    cancelRequest();const token=++requestId;abort=new win.AbortController();busy=true;render();
    try{const signal=abort.signal;const value=await new Promise((resolve,reject)=>{let timer;const done=(fn,value)=>{clearTimeout(timer);signal.removeEventListener('abort',cancel);fn(value);},cancel=()=>done(reject,new Error('Operation cancelled'));signal.addEventListener('abort',cancel,{once:true});if(options.serviceTimeout)timer=win.setTimeout(()=>done(reject,new Error('Help service timed out')),options.serviceTimeout);try{Promise.resolve(options[type]({query:state.query,category:state.category,feedback:choice,reason:state.reason,signal})).then(v=>done(resolve,v),e=>done(reject,e));}catch(e){done(reject,e);}});if(disposed||token!==requestId)return false;if(type==='load'){validate({kind:options.kind,items:value});results=value;}else submitted=true;busy=false;abort=null;render();emit(element,'complete',{action:type,value:type==='load'?copy(results):copy(state)});return true;}
    catch(caught){if(disposed||token!==requestId)return false;abort?.abort();busy=false;abort=null;error=String(caught?.message||label('error'));render();emit(element,'error',{reason:type,message:error});return false;}
  }
  function go(step){if(disposed||!options)return false;const index=Math.min(step,options.items.length-1);if(options.items[index]?.disabled)return false;return setValue({step},'step');}
  function adjacent(delta){let step=state.step+delta;while(options.items[step]?.disabled)step+=delta;return step;}
  function open(){if(disposed||!options||options.disabled)return false;returnFocus=doc.activeElement===doc.body?element.querySelector('[data-help-action="open"]'):doc.activeElement;return setValue({open:true},'open');}
  function close(reason='close'){if(!options?.closeOnEscape&&reason==='escape')return false;const accepted=setValue({open:false},reason);if(accepted&&!state.open)(returnFocus?.isConnected?returnFocus:element.querySelector('[data-help-action="open"]'))?.focus({preventScroll:true});return accepted;}
  function click(event){const target=event.target.closest?.('[data-help-action]');if(!target||target.closest('[data-g-help]')!==element||target.disabled||options.disabled)return;const action=target.dataset.helpAction,key=target.dataset.helpKey;
    if(action==='floating')return;
    if(action==='expand'){const expanded=state.expanded.includes(key)?state.expanded.filter(x=>x!==key):options.multiple?[...state.expanded,key]:[key];setValue({expanded},'expand');}
    else if(action==='clear')setValue({query:''},'search');else if(action==='category')setValue({category:key},'category');
    else if(action==='open')open();else if(action==='close')close();else if(action==='dismiss')setValue({dismissed:true},'dismiss');
    else if(action==='previous')go(Math.max(0,adjacent(-1)));else if(action==='step')go(Number(key));
    else if(action==='next'){if(adjacent(1)<options.items.length)go(adjacent(1));else if(tours.has(options.kind)?close('complete'):emit(element,'beforechange',{value:copy(state),reason:'complete'}))emit(element,'complete',{action:'steps',value:copy(state)});}
    else if(action==='feedback'){if(options.readonly)return;submitted=false;if(setValue({feedback:key},'feedback')&&options.mode!=='reason')submitFeedback(key);}
    else if(action==='submit')submitFeedback();else if(action==='retry')run(options.kind==='help-feedback'?'submit':'load');else if(action==='cancel'){cancelRequest();render();}
    else if(action==='action')emit(element,'action',{action:key,value:copy(state)});
  }
  function submitFeedback(choice=state.feedback){if(disposed||options.disabled||options.readonly||!choice||busy)return false;if(!emit(element,'action',{action:'feedback',value:{feedback:choice,reason:state.reason}}))return false;return options.submit?run('submit',choice):true;}
  function input(event){const node=event.target;if(composing||event.isComposing||node.closest?.('[data-g-help]')!==element||options.disabled)return;if(node.dataset.helpField==='query'){if(!setValue({query:node.value},'search')||element.hasAttribute('data-g-help-value'))node.value=state.query;}else if(node.dataset.helpField==='reason'){if(options.readonly)return;if(!setValue({reason:node.value},'reason')||element.hasAttribute('data-g-help-value'))node.value=state.reason;}}
  function change(event){const node=event.target;if(node.closest?.('[data-g-help]')!==element||!node.dataset.helpCheck)return;const key=node.dataset.helpCheck;if(options.readonly||options.disabled||options.items.find(x=>x.id===key)?.disabled){node.checked=state.completed.includes(key);return;}setValue({completed:node.checked?[...state.completed,key]:state.completed.filter(x=>x!==key)},'check');node.checked=state.completed.includes(key);}
  function keydown(event){if(event.key==='Escape'&&state.open&&element.contains(doc.activeElement)){if(close('escape')){event.preventDefault();event.stopPropagation();}}if(element.contains(event.target)&&event.target.dataset?.helpAction==='expand'&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)){const buttons=[...element.querySelectorAll('[data-help-action="expand"]')].filter(b=>!b.disabled),index=buttons.indexOf(event.target);buttons[event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();event.preventDefault();}}
  function refresh(){
    if(disposed)return false;const raw=element.getAttribute('data-g-help-options');if(raw===null)return false;
    try{const parsed=validate({...JSON.parse(raw),...overrides}),prefix={'rich-tooltip':'g-tooltip-rich','definition-help':'g-definition','tour-spotlight':'g-tour','help-search':'g-help-search-composition'}[parsed.kind]||'g-'+parsed.kind,mode=parsed.mode||helpModes[parsed.kind].find(x=>element.classList.contains(prefix+'-'+x))||'default';
      const next={items:[],size:'medium',columns:1,width:320,limit:50,debounce:150,bordered:true,disabled:false,animated:true,placement:'bottom-start',showHeader:true,showActions:true,showProgress:true,showCount:true,showClear:true,showPrevious:true,showStepList:true,arrow:true,closeOnEscape:true,closeOnOutside:true,serviceTimeout:60000,maxReasonLength:2000,minQueryLength:0,tourPadding:6,offset:8,openDelay:100,closeDelay:120,...parsed,mode};
      next.multiple=parsed.multiple??mode==='multiple';next.readonly=parsed.readonly??mode==='readonly';next.dismissible=parsed.dismissible??(tours.has(parsed.kind)||mode==='dismissible');next.searchable=parsed.searchable??(searchable.has(parsed.kind)||mode==='searchable');next.bordered=parsed.bordered??(mode!=='borderless');next.size=parsed.size??(mode==='compact'?'small':next.size);next.tone=parsed.tone||['neutral','info','success','warning','danger'].find(tone=>element.classList.contains('is-'+tone))||(['info','success','warning','danger'].includes(mode)?mode:'neutral');next.animated=parsed.animated??mode!=='quiet';
      if(parsed.placement==null&&['top','bottom','start','end'].includes(mode))next.placement={top:'top',bottom:'bottom',start:'left',end:'right'}[mode];
      if(element.dataset.gHelpSize)next.size=element.dataset.gHelpSize;if(element.dataset.gHelpBordered!=null)next.bordered=element.dataset.gHelpBordered!=='false';if(element.dataset.gHelpDisabled!=null)next.disabled=element.dataset.gHelpDisabled!=='false';else next.disabled=!!(next.disabled||element.classList.contains('is-disabled'));
      validate(next);const oldOptions=options,old=state;options=next;let value;try{value=normalize(element.hasAttribute('data-g-help-value')?JSON.parse(element.getAttribute('data-g-help-value')):last?state:{...state,...parsed.defaultValue});}catch(e){options=oldOptions;throw e;}
      if(!element.hasAttribute('data-g-help-value')&&next.kind==='help-checklist'){if(element.classList.contains('is-complete'))value.completed=next.items.map(item=>item.id);else if(element.classList.contains('is-pending'))value.completed=[];}
      state=value;const signature=JSON.stringify({...next,load:!!next.load,submit:!!next.submit});if(signature!==last||oldOptions?.load!==next.load||oldOptions?.submit!==next.submit){const reset=!oldOptions||oldOptions.load!==next.load||oldOptions.submit!==next.submit||oldOptions.kind!==next.kind||oldOptions.disabled!==next.disabled||oldOptions.readonly!==next.readonly||JSON.stringify(oldOptions.items)!==JSON.stringify(next.items);if(reset){cancelRequest();results=null;}last=signature;render();if(reset&&next.load&&!next.disabled)scheduleSearch();}else if(JSON.stringify(old)!==JSON.stringify(state))applyState(old);errorSignature='';return true;
    }catch(e){if(errorSignature!==e.message){errorSignature=e.message;emit(element,'error',{reason:'configuration',message:e.message});}return false;}
  }
  function setOptions(patch){if(disposed||!options||!object(patch))return false;validate({...options,...patch});const old=overrides;overrides={...overrides,...patch};if(refresh())return true;overrides=old;return false;}
  function compositionStart(e){if(e.target.closest?.('[data-g-help]')===element&&e.target.dataset.helpField)composing=true;}
  function compositionEnd(e){if(e.target.closest?.('[data-g-help]')===element&&e.target.dataset.helpField){composing=false;input(e);render();}}
  function destroy(){if(disposed)return;disposed=true;observer?.disconnect();cancelRequest();cleanupSurface();for(const [name,fn] of [['click',click],['input',input],['change',change],['compositionstart',compositionStart],['compositionend',compositionEnd]])element.removeEventListener(name,fn);doc.removeEventListener('keydown',keydown);win.removeEventListener('resize',queuePosition);win.removeEventListener('scroll',queuePosition,true);element.replaceChildren(...original);for(const [name,value]of saved)value===null?element.removeAttribute(name):element.setAttribute(name,value);if(originalStyles===null)element.removeAttribute('style');else element.setAttribute('style',originalStyles);}
  refresh();element.addEventListener('compositionstart',compositionStart);element.addEventListener('compositionend',compositionEnd);element.addEventListener('click',click);element.addEventListener('input',input);element.addEventListener('change',change);doc.addEventListener('keydown',keydown);win.addEventListener('resize',queuePosition);win.addEventListener('scroll',queuePosition,true);
  observer=new win.MutationObserver(()=>refresh());observer.observe(element,{attributes:true,attributeFilter:['data-g-help-options','data-g-help-value','data-g-help-disabled','data-g-help-size','data-g-help-bordered','class']});
  return {refresh,setOptions,setValue,getState:()=>copy(state),search:query=>setValue({query},'search'),open,close,go,submit:submitFeedback,cancel:()=>{cancelRequest();render();},destroy};
}
