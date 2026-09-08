/** Data-driven description tables. Text is never interpreted as markup. */
const layouts=['horizontal','vertical','inline-horizontal','inline-vertical'];
const breaks={xs:0,sm:576,md:768,lg:992,xl:1200,xxl:1600};
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const scalar=v=>v==null||['string','number','boolean'].includes(typeof v)&&!(typeof v==='number'&&!Number.isFinite(v));
const styles=['color','backgroundColor','fontWeight','fontSize','width','minWidth','maxWidth','whiteSpace','textAlign','verticalAlign','padding','paddingLeft','paddingRight'];
let serial=0;
export function createDescriptionsController(element,{emit,init=()=>{},destroy=()=>{}}) {
  const doc=element.ownerDocument,win=doc.defaultView,uid='g-desc-'+(++serial),original=[...element.childNodes],originalClass=element.className,originalBusy=element.getAttribute('aria-busy'),originalStyle=element.getAttribute('style');
  let options={},overrides={},last='',columns=0,disposed=false,ready=false;const cells=new Map();
  const make=(tag,text,cls)=>{const n=doc.createElement(tag);if(text!=null)n.textContent=String(text);if(cls)n.className=cls;return n;};
  const defaults={data:[],column:3,size:'medium',layout:'horizontal',align:'left',bordered:false,tableLayout:'auto',emptyText:'No data',placeholder:'—',loadingText:'Loading…'};
  const notify=(error)=>emit(element,'error',{component:'descriptions',reason:'validation',message:error.message});
  function validate(o){
    if(!object(o)||!layouts.includes(o.layout)||!['auto','fixed'].includes(o.tableLayout)||o.size!=null&&!['mini','small','medium','large'].includes(o.size))throw TypeError('Invalid descriptions layout, size or tableLayout');
    for(const k of ['bordered','loading'])if(o[k]!=null&&typeof o[k]!=='boolean')throw TypeError(k+' must be boolean');
    for(const k of ['title','label','extra','extraTemplate','emptyText','placeholder','loadingText','error'])if(o[k]!=null&&typeof o[k]!=='string')throw TypeError(k+' must be text');
    const align=v=>['left','center','right'].includes(v);
    if(!(align(o.align)||object(o.align)&&Object.entries(o.align).every(([k,v])=>['label','value'].includes(k)&&align(v))))throw TypeError('Invalid align');
    if(o.maxHeight!=null&&(!Number.isFinite(o.maxHeight)||o.maxHeight<32||o.maxHeight>10000))throw TypeError('maxHeight must be 32–10000');
    const count=v=>Number.isInteger(v)&&v>=1&&v<=24;
    if(!(count(o.column)||object(o.column)&&Object.keys(o.column).length&&Object.entries(o.column).every(([k,v])=>Object.hasOwn(breaks,k)&&count(v))))throw TypeError('column must be 1–24 or breakpoint values');
    const style=v=>{if(v!=null&&(!object(v)||Object.entries(v).some(([k,x])=>!styles.includes(k)||!['string','number'].includes(typeof x))))throw TypeError('Unsupported description style');};
    style(o.labelStyle);style(o.valueStyle);
    if(!Array.isArray(o.data)||o.data.length>1000)throw TypeError('data must contain at most 1000 items');
    const keys=new Set();for(const [index,item]of o.data.entries()){
      if(!object(item)||!scalar(item.label)||!scalar(item.value))throw TypeError('Description labels and values must be text or scalars');
      if(item.key!=null&&!['string','number'].includes(typeof item.key)||typeof item.key==='number'&&!Number.isFinite(item.key))throw TypeError('Invalid item key');
      const key=String(item.key??index);if(keys.has(key))throw TypeError('Duplicate description key');keys.add(key);
      if(item.span!=null&&(!Number.isInteger(item.span)||item.span<1||item.span>24))throw TypeError('span must be 1–24');
      for(const k of ['labelTemplate','valueTemplate'])if(item[k]!=null&&typeof item[k]!=='string')throw TypeError(k+' must be a template id');style(item.labelStyle);style(item.valueStyle);
    }return o;
  }
  function column(){if(typeof options.column==='number')return options.column;let result=3;for(const [key,width]of Object.entries(breaks))if(win.innerWidth>=width&&options.column[key]!=null)result=options.column[key];return result;}
  function content(node,text,template){if(template){const source=doc.getElementById(template);if(source?.tagName==='TEMPLATE'){node.append(source.content.cloneNode(true));return;}}node.textContent=String(text??options.placeholder);}
  function style(node,global,local,alignment){node.removeAttribute('style');node.style.textAlign=alignment;for(const [key,value]of Object.entries({...global,...local}))node.style[key]=typeof value==='number'&&key!=='fontWeight'?value+'px':String(value);}
  function disposeCell(cell){destroy(cell.label);destroy(cell.value);}
  function render(){
    if(disposed)return;columns=column();const focused=doc.activeElement;
    const inline=options.layout.startsWith('inline'),vertical=options.layout==='vertical';
    element.className=[...element.classList].filter(c=>!/^g-desc-(managed|horizontal|vertical|inline-horizontal|inline-vertical|bordered|mini|small|medium|large)$/.test(c)).join(' ')+' g-desc-managed g-desc-'+options.layout+(options.bordered?' g-desc-bordered':'')+(options.size?' g-desc-'+options.size:'');element.setAttribute('aria-busy',String(!!options.loading));if(options.maxHeight!=null)element.style.setProperty('--g-data-max-height',options.maxHeight+'px');else element.style.removeProperty('--g-data-max-height');
    const fragment=doc.createDocumentFragment();
    if(options.title||options.extra||options.extraTemplate){const head=make('div',null,'g-desc-heading');if(options.title)head.append(make('div',options.title,'g-desc-title'));if(options.extra||options.extraTemplate){const extra=make('div',null,'g-desc-extra');content(extra,options.extra,options.extraTemplate);head.append(extra);}fragment.append(head);}
    const status=options.loading?options.loadingText:options.error||(!options.data.length?options.emptyText:null);
    const activeKeys=new Set();
    if(status!=null){const message=make('div',status,'g-desc-status');message.setAttribute('role',options.error?'alert':'status');fragment.append(message);}
    else {
      const body=make('div',null,'g-desc-body'),table=make('table',null,'g-desc-table');table.style.tableLayout=options.tableLayout;table.setAttribute('aria-label',options.label||options.title||'Descriptions');body.tabIndex=0;body.setAttribute('role','region');body.setAttribute('aria-label',options.label||options.title||'Descriptions');const tbody=make('tbody');
      const grouped=[];let row=[],used=0;const finish=()=>{if(row.length){row.at(-1).span+=columns-used;grouped.push(row);}row=[];used=0;};
      options.data.forEach((item,index)=>{const span=Math.min(item.span??1,columns);if(used+span>columns)finish();row.push({item,index,span});used+=span;});finish();
      for(const group of grouped){const tr=make('tr'),values=vertical?make('tr'):tr;
        for(const {item,index,span}of group){const key=String(item.key??index);activeKeys.add(key);const signature=JSON.stringify([item.label,item.value,item.labelTemplate,item.valueTemplate,inline,options.placeholder]);let cell=cells.get(key);
          if(!cell||cell.signature!==signature){if(cell)disposeCell(cell);cell={signature,label:make(inline?'span':'th',null,'g-desc-label'),value:make(inline?'span':'td',null,'g-desc-value'),fresh:true};cell.label.id=uid+'-'+index+'-'+(++serial);content(cell.label,item.label,item.labelTemplate);content(cell.value,item.value,item.valueTemplate);cells.set(key,cell);}
          const labelAlign=typeof options.align==='string'?options.align:options.align.label||'left',valueAlign=typeof options.align==='string'?options.align:options.align.value||'left';style(cell.label,options.labelStyle,item.labelStyle,labelAlign);style(cell.value,options.valueStyle,item.valueStyle,valueAlign);
          if(inline){const td=make('td',null,'g-desc-inline-item');td.colSpan=span;td.append(cell.label,cell.value);tr.append(td);}
          else{cell.label.removeAttribute('scope');cell.label.colSpan=vertical?span:1;cell.value.colSpan=vertical?span:span*2-1;cell.value.setAttribute('headers',cell.label.id);tr.append(cell.label);values.append(cell.value);}
        }tbody.append(tr);if(vertical)tbody.append(values);
      }table.append(tbody);body.append(table);fragment.append(body);
    }
    for(const [key,cell]of cells)if(!activeKeys.has(key)){disposeCell(cell);cells.delete(key);}
    const oldExtra=element.querySelector(':scope > .g-desc-heading > .g-desc-extra');if(oldExtra)destroy(oldExtra);
    element.replaceChildren(fragment);
    for(const cell of cells.values())if(cell.fresh){init(cell.label);init(cell.value);cell.fresh=false;}
    const extra=element.querySelector(':scope > .g-desc-heading > .g-desc-extra');if(extra)init(extra);
    if(focused&&element.contains(focused)&&doc.activeElement!==focused)focused.focus({preventScroll:true});
  }
  function refresh(){if(disposed)return;const raw=element.getAttribute('data-g-data-options')||'{}';try{const parsed=JSON.parse(raw);if(!object(parsed))throw TypeError('Options must be an object');const variants={};for(const value of layouts)if(element.classList.contains('g-descriptions-'+value))variants.layout=value;for(const size of ['mini','small','medium','large'])if(element.classList.contains('g-descriptions-'+size))variants.size=size;if(element.classList.contains('g-descriptions-bordered'))variants.bordered=true;if(element.classList.contains('is-loading'))variants.loading=true;if(element.classList.contains('is-empty'))variants.data=[];if(element.classList.contains('is-error'))variants.error='Unable to load descriptions';const sizeAttribute=element.getAttribute('data-g-data-size');if(sizeAttribute)variants.size=sizeAttribute;const borderAttribute=element.getAttribute('data-g-data-bordered');if(borderAttribute!==null)variants.bordered=borderAttribute!=='false';const next=validate({...defaults,...variants,...parsed,...overrides});const signature=JSON.stringify(next);if(ready&&signature===last&&column()===columns)return;options=next;last=signature;ready=true;render();}catch(error){notify(error);}}
  function setOptions(patch){if(disposed)return false;try{if(!object(patch))throw TypeError('Options must be an object');validate({...defaults,...options,...patch});const old=overrides;overrides={...overrides,...structuredClone(patch)};try{validate({...defaults,...JSON.parse(element.getAttribute('data-g-data-options')||'{}'),...overrides});}catch(error){overrides=old;throw error;}refresh();return getState();}catch(error){notify(error);return false;}}
  function getState(){return {kind:'descriptions',items:structuredClone(options.data||[]),count:options.data?.length||0,columns,loading:!!options.loading,error:options.error||'',selectedKeys:[],filter:'',path:null,date:'',zoom:1,rules:[]};}
  const observer=new win.MutationObserver(refresh);observer.observe(element,{attributes:true,attributeFilter:['data-g-data-options','data-g-data-size','data-g-data-bordered','class']});const resize=()=>{if(ready&&column()!==columns)render();};win.addEventListener('resize',resize);refresh();
  return {setOptions,getState,refresh,select:()=>false,move:()=>false,setDate:()=>false,scrollTo:()=>false,exportCsv:()=>'',load:async()=>getState(),cancel:()=>false,destroy(){if(disposed)return;disposed=true;observer.disconnect();win.removeEventListener('resize',resize);for(const cell of cells.values())disposeCell(cell);cells.clear();const extra=element.querySelector(':scope > .g-desc-heading > .g-desc-extra');if(extra)destroy(extra);element.replaceChildren(...original);element.className=originalClass;if(originalStyle==null)element.removeAttribute('style');else element.setAttribute('style',originalStyle);if(originalBusy==null)element.removeAttribute('aria-busy');else element.setAttribute('aria-busy',originalBusy);}};
}
