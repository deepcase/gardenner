/** Statistic uses decimal strings for final formatting, so rounding never loses large integer digits. */
function decimal(value, precision) {
  const match=String(value).trim().match(/^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i);
  if(!match||!(match[2]||match[3]))return null;
  const exponent=Number(match[4]||0);if(!Number.isInteger(exponent)||Math.abs(exponent)>300)return null;
  let digits=(match[2]||'')+(match[3]||''),point=(match[2]||'').length+exponent;
  if(digits.length>1000)return null;
  if(point<0){digits='0'.repeat(-point)+digits;point=0;}
  if(point>digits.length)digits+='0'.repeat(point-digits.length);
  const integer=digits.slice(0,point)||'0',fraction=digits.slice(point).padEnd(precision+1,'0');
  let scaled=BigInt((integer+fraction.slice(0,precision))||'0');if(Number(fraction[precision])>=5)scaled++;
  const result=scaled.toString().padStart(precision+1,'0');
  return {negative:match[1]==='-'&&scaled!==0n,integer:precision?result.slice(0,-precision):result,decimal:precision?result.slice(-precision):''};
}
function numericParts(value,options) {
  if(value==null||value===''||typeof value==='boolean'||typeof value==='object'||typeof value==='number'&&!Number.isFinite(value))return null;
  const result=decimal(value,options.precision);if(!result)return null;
  let nf;try{nf=new Intl.NumberFormat(options.locale||'en-US',{useGrouping:true,maximumFractionDigits:1});}catch{nf=new Intl.NumberFormat('en-US',{useGrouping:true,maximumFractionDigits:1});}
  const parts=nf.formatToParts(123456789.1),groups=parts.filter(p=>p.type==='integer').map(p=>p.value.length),group=options.separator??parts.find(p=>p.type==='group')?.value??',';
  if(options.showGroupSeparator){let rest=result.integer,segments=[],size=groups.at(-1)||3,repeat=groups.length>1?groups.at(-2):size;while(rest.length>size){segments.unshift(rest.slice(-size));rest=rest.slice(0,-size);size=repeat;}segments.unshift(rest);result.integer=segments.join(group);}
  result.integer=(result.negative?'-':'')+result.integer;
  result.decimal=result.decimal?(options.decimalSeparator??parts.find(p=>p.type==='decimal')?.value??'.')+result.decimal:'';
  return result;
}
const tokens=/\[[^\]]*\]|YYYY|MM|DD|HH|mm|ss|SSS|D+|H+|m+|s+|S+/g;
function countdown(value,format) {
  let remaining=Math.max(0,Math.floor(value));const values={};
  const bare=format.replace(/\[[^\]]*\]/g,'');
  for(const [key,unit]of [['D',86400000],['H',3600000],['m',60000],['s',1000],['S',1]])if(bare.includes(key)){values[key]=Math.floor(remaining/unit);remaining%=unit;}
  return format.replace(tokens,t=>t.startsWith('[')?t.slice(1,-1):values[t[0]]!=null?String(values[t[0]]).padStart(t.length,'0'):t);
}
function dateText(value,options) {
  if(value==null||value==='')return null;const date=new Date(value);if(!Number.isFinite(date.getTime()))return null;
  try{const parts=new Intl.DateTimeFormat('en-GB',{timeZone:options.timeZone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(date),get=k=>parts.find(p=>p.type===k)?.value;
    const values={YYYY:get('year'),MM:get('month'),DD:get('day'),HH:get('hour'),mm:get('minute'),ss:get('second'),SSS:String(date.getMilliseconds()).padStart(3,'0')};
    return options.format.replace(tokens,t=>t.startsWith('[')?t.slice(1,-1):values[t]??t);
  }catch{return null;}
}
export function createStatisticController(element,{emit,init,destroy:destroyContent}) {
  const doc=element.ownerDocument,win=doc.defaultView,originalStyle=element.getAttribute('style'),originalClass=element.className;
  const saved=new Map(['role','aria-live','aria-busy','aria-label'].map(a=>[a,element.getAttribute(a)]));
  let original=null,options={},overrides={},attributeOptions={},raw,disposed=false,frame=0,timer=0,running=false,displayed=null,target,mode,started=false,finished=false,completion=0,anchor=0,serverNow=0,countdownKey,animationStart=0,animationFrom=0,animationTo=0;
  let title,body,value,prefix,integer,fraction,suffix,extra;const templateKeys=new Map();
  const make=(tag,cls)=>{const n=doc.createElement(tag);n.className=cls;return n;};
  const finite=(n,fallback,min,max)=>Number.isFinite(Number(n))?Math.min(max,Math.max(min,Number(n))):fallback;
  const text=(node,value)=>{value=String(value??'');if(node.textContent!==value)node.textContent=value;};
  const stamp=v=>typeof v==='number'?v:v==null||v===''?NaN:new Date(v).getTime();
  function stop(){win.cancelAnimationFrame(frame);win.clearTimeout(timer);frame=timer=0;running=false;}
  function shell(){if(original)return;original=doc.createDocumentFragment();original.append(...element.childNodes);title=make('div','g-statistic-title');body=make('div','g-statistic-content');value=make('div','g-statistic-value');prefix=make('span','g-statistic-prefix');integer=make('span','g-statistic-value-integer');fraction=make('span','g-statistic-value-decimal');suffix=make('span','g-statistic-suffix');extra=make('div','g-statistic-extra');value.append(prefix,integer,fraction,suffix);body.append(value,extra);element.append(title,body);resizeObserver?.observe(value);}
  function slot(node,name) {
    const id=options[name+'Template'],key=id?'template:'+id:'text:'+String(options[name]??'');
    if(templateKeys.get(name)!==key){destroyContent(node);node.replaceChildren();let source=id&&doc.getElementById(id);if(!source&&id)source=[...original.querySelectorAll('template')].find(n=>n.id===id);if(source?.tagName==='TEMPLATE')node.append(source.content.cloneNode(true));else text(node,options[name]);if(!id||source?.tagName==='TEMPLATE')templateKeys.set(name,key);init(node);}
    node.hidden=!node.childNodes.length||!id&&!String(options[name]??'');
  }
  function overflow(){if(!disposed&&value){if(value.scrollWidth>value.clientWidth+1)value.tabIndex=0;else value.removeAttribute('tabindex');}}
  const resizeObserver=typeof win.ResizeObserver==='function'?new win.ResizeObserver(overflow):null;resizeObserver?.observe(element);let resizeFrame=0;const onResize=()=>{win.cancelAnimationFrame(resizeFrame);resizeFrame=win.requestAnimationFrame(overflow);};win.addEventListener("resize",onResize);
  function status(){return options.loading?'loading':options.error?'error':'ready';}
  function paint(current=displayed) {
    if(disposed||!original)return;
    let result=null;
    if(status()==='ready'){
      if(typeof options.formatter==='function'){try{result={integer:String(options.formatter(current)),decimal:''};}catch{result=null;}}
      else if(options.mode==='date'){const str=dateText(options.value,options);if(str!=null)result={integer:str,decimal:''};}
      else if(options.mode==='countdown'&&Number.isFinite(current))result={integer:countdown(current,options.format),decimal:''};
      else if(options.mode==='number')result=numericParts(current,options);
    }
    const placeholder=options.loading?options.loadingText:options.error||options.placeholder;
    text(integer,result?.integer??placeholder);text(fraction,result?.decimal??'');fraction.hidden=!result?.decimal;
    prefix.hidden=!result||!prefix.childNodes.length;suffix.hidden=!result||!suffix.childNodes.length;
    if(options.mode==='countdown')value.setAttribute('role','timer');else value.removeAttribute('role');
    // Updates during animation/countdown must not repeatedly interrupt screen readers.
    element.setAttribute('aria-live',running||options.mode==='countdown'?'off':options.live);queueMicrotask(overflow);
  }
  function finish(reason){running=false;paint();if(finished)return;finished=true;const token=++completion,currentValue=options.value;queueMicrotask(()=>{if(!disposed&&finished&&completion===token)emit(element,'complete',{component:'statistic',reason,value:currentValue});});}
  function tickAnimation(now){if(disposed||!running)return;const t=Math.min(1,(now-animationStart)/options.animationDuration);displayed=animationFrom+(animationTo-animationFrom)*(1-(1-t)**4);if(t>=1){displayed=target;finish('animation');return;}paint();frame=win.requestAnimationFrame(tickAnimation);}
  function tickCountdown(){if(disposed||!running)return;displayed=Math.max(0,target-(serverNow+win.performance.now()-anchor));paint();if(displayed<=0){finish('countdown');return;}timer=win.setTimeout(tickCountdown,options.format.replace(/\[[^\]]*\]/g,'').includes('S')?33:Math.min(250,displayed));}
  function render(restart=false) {
    shell();if(options.maxHeight!=null)element.style.setProperty('--g-data-max-height',Math.min(2400,Math.max(160,Number(options.maxHeight)||160))+'px');else element.style.removeProperty('--g-data-max-height');for(const [node,name]of [[title,'title'],[prefix,'prefix'],[suffix,'suffix'],[extra,'extra']])slot(node,name);
    const variant=['small','medium','large'].find(s=>element.classList.contains('g-statistic-'+s));element.setAttribute('data-statistic-size',options.size||variant||'medium');element.setAttribute('data-statistic-align',options.align);element.setAttribute('data-statistic-tone',options.tone);element.setAttribute('aria-busy',String(options.loading));element.setAttribute('role','group');if(options.label)element.setAttribute('aria-label',options.label);else if(saved.get('aria-label')==null)element.removeAttribute('aria-label');
    value.style.cssText='';for(const [key,v]of Object.entries(options.valueStyle||{}))if(typeof v==='string'||typeof v==='number')value.style.setProperty(key.startsWith('--')?key:key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),String(v));
    const changed=!Object.is(target,options.mode==='countdown'?stamp(options.value):options.value)||mode!==options.mode;const wasRunning=running;
    if(changed||restart){stop();finished=false;completion++;started=false;}
    mode=options.mode;target=mode==='countdown'?stamp(options.value):options.value;
    if(mode==='countdown'){
      const key=String(target)+'|'+String(options.now);if(key!==countdownKey){countdownKey=key;anchor=win.performance.now();serverNow=Number.isFinite(stamp(options.now))?stamp(options.now):Date.now();finished=false;displayed=Math.max(0,target-serverNow);}
      stop();if(Number.isFinite(target)&&options.start&&status()==='ready'){running=true;tickCountdown();}else paint();return;
    }
    if(mode==='date'||status()!=='ready'){stop();displayed=options.value;paint();return;}
    const animate=options.animation&&!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches&&typeof options.value==='number'&&Number.isFinite(options.value)&&Math.abs(options.value)<=Number.MAX_SAFE_INTEGER&&options.animationDuration>0;
    if(!animate){stop();displayed=options.value;paint();return;}
    if(!options.start){if(wasRunning)stop();if(!started)displayed=Number.isFinite(options.valueFrom)?options.valueFrom:0;paint();return;}
    if(changed||restart||!started||wasRunning&&!running){animationFrom=Number.isFinite(options.valueFrom)?options.valueFrom:Number.isFinite(displayed)?displayed:0;animationTo=options.value;animationStart=win.performance.now();displayed=animationFrom;started=true;running=true;finished=false;frame=win.requestAnimationFrame(tickAnimation);}
    else if(!running&&!Object.is(displayed,target)){animationFrom=Number(displayed)||0;animationTo=options.value;animationStart=win.performance.now();running=true;frame=win.requestAnimationFrame(tickAnimation);}
    paint();
  }
  function configure(restart=false){const o={...attributeOptions,...overrides};options={...o,mode:['number','date','countdown'].includes(o.mode)?o.mode:'number',precision:Math.trunc(finite(o.precision,0,0,20)),format:typeof o.format==='string'?o.format:'HH:mm:ss',animationDuration:finite(o.animationDuration,2000,0,600000),start:o.start!==false,animation:o.animation===true,showGroupSeparator:o.showGroupSeparator===true,placeholder:String(o.placeholder??'—'),loadingText:String(o.loadingText??'Loading…'),loading:o.loading===true||element.classList.contains('is-loading'),error:o.error?String(o.error):element.classList.contains('is-error')?'Unable to load':'',align:['start','center','end'].includes(o.align)?o.align:'start',tone:['default','success','warning','danger'].includes(o.tone)?o.tone:'default',live:o.live==='polite'?'polite':'off',size:o.size||element.getAttribute('data-g-data-size')||undefined};render(restart);}
  function refresh(){if(disposed||!element.hasAttribute('data-g-data-options')&&!Object.keys(overrides).length)return;const next=element.getAttribute('data-g-data-options');if(next!==raw){raw=next;try{const parsed=JSON.parse(next||'{}');if(parsed&&typeof parsed==='object'&&!Array.isArray(parsed))attributeOptions=parsed;}catch{}}configure();}
  function getState(){return {kind:'statistic',value:options.value,displayValue:original?integer.textContent+fraction.textContent:'',running,remaining:options.mode==='countdown'?displayed:null,mode:options.mode,items:[],selectedKeys:[],count:0,filter:'',path:null,date:'',zoom:1,rules:[],loading:!!options.loading,error:options.error||''};}
  function setOptions(patch={}){if(disposed)return false;const before=options.animationDuration;for(const [key,value]of Object.entries(patch)){if(value===undefined)delete overrides[key];else overrides[key]=value;}configure(before!==patch.animationDuration&&patch.animationDuration!=null);return getState();}
  const observer=new win.MutationObserver(refresh);observer.observe(element,{attributes:true,attributeFilter:['data-g-data-options','data-g-data-size','class']});refresh();
  const noop=()=>false;
  return {refresh,setOptions,getState,select:noop,move:noop,setDate:noop,scrollTo:noop,exportCsv:()=>'',load:async()=>getState(),cancel(){if(!running)return false;overrides.start=false;configure();return true;},destroy(){if(disposed)return;disposed=true;stop();observer.disconnect();resizeObserver?.disconnect();win.removeEventListener("resize",onResize);win.cancelAnimationFrame(resizeFrame);if(original){destroyContent(title);destroyContent(body);element.replaceChildren(...original.childNodes);}element.className=originalClass;for(const name of ['data-statistic-size','data-statistic-align','data-statistic-tone'])element.removeAttribute(name);for(const [key,val]of saved)if(val==null)element.removeAttribute(key);else element.setAttribute(key,val);if(originalStyle==null)element.removeAttribute('style');else element.setAttribute('style',originalStyle);}};
}
