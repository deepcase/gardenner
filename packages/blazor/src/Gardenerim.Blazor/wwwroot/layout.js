/** Layout enhancement preserves application-owned children and event listeners. */
export const layoutModes = {
  'grid-system':['24-column','12-column','responsive','container-query','subgrid','rtl','print'],
  'region-layout-system':['top-main-bottom','start-main-end','five-region','holy-grail','sidebar-shell','double-sidebar','master-detail','list-detail-inspector','sticky-footer','fixed-header','fixed-sidebar','sticky-aside','dock','split-view','fullscreen-workspace','mobile-layout'],
  'classic-layout-primitives':['stack','cluster','center','sidebar','switcher','cover','reel','frame','media-object','grid-auto-fit','grid-auto-fill','bleed','repel','imposter','overlay','masonry','bento','aspect-ratio','scroll-area','scroll-snap','safe-area','sticky-region'],
  'page-header':['default','compact','centered','sticky','with-back','divided'],
  'section-header':['default','borderless','compact','centered','divided'],
  subheader:['default','compact','sticky','divided'],
  'footer-bar':['default','compact','sticky','centered','end'],
  'app-shell':['sidebar','topbar','double-sidebar','collapsed','contained','full-height'],
  dashboard:['responsive','two-column','three-column','four-column','auto-fit','dense'],
  'mobile-shell':['default','contained','safe-area','header-only','bottom-only','full-height'],
  'responsive-container':['default','fluid','reading','wide','narrow','full-height']
};
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const dimension = (value, name) => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 10000) return `${value}px`;
  if (typeof value === 'string') {
    if (/^\d+(?:\.\d+)?(?:px|rem|em|ch|%|vh|vw|dvh)$/.test(value) && parseFloat(value)<=10000) return value;
    if (value==='none' && ['maxWidth','maxHeight'].includes(name)) return value;
    if (value==='auto' && ['height','minHeight','headerHeight','footerHeight','autoRows'].includes(name)) return value;
  }
  throw new TypeError(`Invalid layout ${name}`);
};
const lengths = ['gap','rowGap','columnGap','padding','minItemWidth','sidebarWidth','asideWidth','headerHeight','footerHeight','minHeight','maxWidth','offset','height','paddingBlock','paddingInline','maxHeight','autoRows'];
const enums = {align:['start','center','end','stretch','baseline'],justify:['start','center','end','space-between','space-around','space-evenly'],position:['contained','page'],overflow:['visible','auto','hidden'],direction:['ltr','rtl'],alignContent:['start','center','end','stretch','space-between','space-around','space-evenly'],justifyItems:['start','center','end','stretch']};
const defaults = {gap:16,minItemWidth:220,sidebarWidth:200,asideWidth:200,headerHeight:48,footerHeight:40,minHeight:0,offset:0,breakpoint:640,alignContent:'start',justifyItems:'stretch',narrowColumns:1,closeOnEscape:true,collapsible:true,focusOnCollapse:true,position:'contained',wrap:true,responsive:true,collapsed:false};
function validate(input) {
  if (!isObject(input)) throw new TypeError('layoutOptions must be an object');
  if (!Object.hasOwn(layoutModes,input.kind)) throw new TypeError('Unknown layout kind');
  if (input.mode != null && !layoutModes[input.kind].includes(input.mode)) throw new TypeError('Unknown layout mode');
  for (const key of lengths) if(input[key] != null) dimension(input[key],key);
  for (const [key,values] of Object.entries(enums)) if(input[key] != null && !values.includes(input[key])) throw new TypeError(`Invalid layout ${key}`);
  for (const key of ['wrap','responsive','collapsed','disabled','closeOnEscape','collapsible','focusOnCollapse']) if(input[key] != null && typeof input[key] !== 'boolean') throw new TypeError(`Invalid layout ${key}`);
  if(input.columns != null && (!Number.isInteger(input.columns) || input.columns < 1 || input.columns > 24)) throw new TypeError('columns must be 1–24');
  if(input.narrowColumns != null && (!Number.isInteger(input.narrowColumns) || input.narrowColumns < 1 || input.narrowColumns > 24)) throw new TypeError('narrowColumns must be 1–24');
  if(input.breakpoint != null && (!Number.isFinite(input.breakpoint) || input.breakpoint < 0 || input.breakpoint > 4000)) throw new TypeError('breakpoint must be 0–4000');
  if(input.ratio != null && (!Number.isFinite(input.ratio) || input.ratio <= 0 || input.ratio > 20)) throw new TypeError('ratio must be > 0 and <= 20');
  return input;
}
let nextId = 0;
export function createLayoutController(element, {emit}) {
  let options, state={collapsed:false}, disposed=false, lastOptions, lastMode, overrides={}, observer, resize, frame=0, signature='';
  const originals = new Map(), styles = new Map(), doc=element.ownerDocument;
  const owned = selector => [...element.querySelectorAll(selector)].filter(node => node.closest('[data-g-layout]') === element);
  function original(node,name) {let saved=originals.get(node);if(!saved){saved=new Map();originals.set(node,saved);}if(!saved.has(name))saved.set(name,node.getAttribute(name));return saved.get(name);}
  function attr(node,name,value) {
    original(node,name);
    if(value==null){if(node.hasAttribute(name))node.removeAttribute(name);}else if(node.getAttribute(name)!==String(value))node.setAttribute(name,String(value));
  }
  function style(name,value) {if(!styles.has(name))styles.set(name,[element.style.getPropertyValue(name),element.style.getPropertyPriority(name)]);if(value==null)element.style.removeProperty(name);else if(element.style.getPropertyValue(name)!==String(value))element.style.setProperty(name,String(value));}
  function readValue(value) {if(!isObject(value) || typeof value.collapsed!=='boolean')throw new TypeError('layoutValue must contain a boolean collapsed');return {collapsed:value.collapsed===true};}
  function effectiveMode() {
    // Explicit options override presentation defaults from framework variant classes.
    const prefix={'grid-system':'g-grid-24','region-layout-system':'g-region-frame','classic-layout-primitives':'g-stack'}[options.kind] || 'g-'+options.kind;
    return options.mode || layoutModes[options.kind].find(mode=>element.classList.contains(prefix+'-'+mode)) || layoutModes[options.kind][0];
  }
  function responsive() {
    if(disposed||!options)return;
    const width=element.getBoundingClientRect().width;
    attr(element,'data-g-layout-narrow',options.responsive && width>0 && width<options.breakpoint ? 'true':'false');
  }
  function apply() {
    const mode=effectiveMode();
    attr(element,'data-g-layout-kind',options.kind);attr(element,'data-g-layout-mode',mode);
    attr(element,'data-g-layout-position',options.position);attr(element,'data-g-layout-collapsed',String(state.collapsed));
    attr(element,'data-g-layout-wrap',String(options.wrap));attr(element,'data-g-layout-bounded',String(options.maxHeight!=null&&options.maxHeight!=='none'));attr(element,'aria-disabled',options.disabled?'true':null);
    if(options.direction)attr(element,'dir',options.direction);else if(originals.get(element)?.has('dir'))attr(element,'dir',originals.get(element).get('dir'));
    for(const [node,attrs] of originals)if(node!==element && !element.contains(node)){for(const [name,value] of attrs)value===null?node.removeAttribute(name):node.setAttribute(name,value);originals.delete(node);}
    for(const key of lengths)style('--g-layout-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),options[key]==null?'initial':dimension(options[key],key));
    const heading=['page-header','section-header','subheader','footer-bar'].includes(options.kind);
    style('--g-layout-align',options.align??(heading?'center':options.kind==='dashboard'?'start':'stretch'));
    style('--g-layout-justify',options.justify??(mode==='centered'?'center':mode==='end'?'end':heading||mode==='repel'?'space-between':'start'));
    for(const key of ['overflow','alignContent','justifyItems','narrowColumns'])style('--g-layout-'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),key==='overflow'?(options.overflow??(options.maxHeight!=null&&options.maxHeight!=='none'?'auto':'visible')):options[key]);
    style('--g-layout-columns',options.columns??({'12-column':12,'two-column':2,'three-column':3,'four-column':4,bento:12}[mode]??(options.kind==='dashboard'?3:24)));
    style('--g-layout-max-width',options.maxWidth==null?({fluid:'none',reading:'70ch',wide:'1440px',narrow:'640px'}[mode]??'1200px'):dimension(options.maxWidth,'maxWidth'));
    style('--g-layout-padding-block',dimension(options.paddingBlock??(mode==='compact'&&options.padding===undefined?8:options.padding??16),'paddingBlock'));
    style('--g-layout-padding-inline',dimension(options.paddingInline??(mode==='compact'&&options.padding===undefined?12:options.padding??16),'paddingInline'));
    style('--g-layout-ratio',options.ratio??16/9);
    const panels=owned('[data-g-layout-panel]'),buttons=owned('[data-g-layout-toggle]');
    for(const panel of panels){
      if(!panel.id)attr(panel,'id','g-layout-panel-'+(++nextId));
      if(state.collapsed && options.focusOnCollapse && panel.contains(doc.activeElement))buttons.find(b=>b.dataset.gLayoutToggle===panel.dataset.gLayoutPanel)?.focus();
      const hidden=original(panel,'hidden'),inert=original(panel,'inert');
      attr(panel,'hidden',state.collapsed?'':hidden);attr(panel,'inert',state.collapsed?'':inert);
    }
    for(const button of buttons){const panel=panels.find(p=>p.dataset.gLayoutPanel===button.dataset.gLayoutToggle);attr(button,'aria-expanded',panel?String(!panel.hidden):null);attr(button,'aria-controls',panel?.id||null);const disabled=original(button,'disabled');attr(button,'disabled',options.disabled||!options.collapsible||!panel?'':disabled);}
    const tabIndex=original(element,'tabindex');attr(element,'tabindex',options.maxHeight!=null&&options.maxHeight!=='none'?(tabIndex??'0'):tabIndex);
    responsive();
  }
  function refresh() {
    if(disposed)return;
    try {
      const raw=element.getAttribute('data-g-layout-options')||'{}',value=element.getAttribute('data-g-layout-value');
      const source=JSON.parse(raw);if(!isObject(source))throw new TypeError('layoutOptions must be an object');
      const parsed=validate(Object.fromEntries(Object.entries({...source,...overrides}).filter(([,value])=>value!==undefined)));
      const next={...defaults,...parsed};
      if(element.dataset.gLayoutDisabled!=null)next.disabled=element.dataset.gLayoutDisabled!=='false';
      else next.disabled=Boolean(next.disabled||element.classList.contains('is-disabled'));
      const oldOptions=options;options=next;
      let nextState;
      try { const mode=effectiveMode();nextState=value!==null?readValue(JSON.parse(value)):lastOptions===undefined?{collapsed:parsed.collapsed??(mode==='collapsed')}:mode!==lastMode&&(mode==='collapsed'||lastMode==='collapsed')?{collapsed:mode==='collapsed'}:state;lastMode=mode; }
      catch(error){options=oldOptions;throw error;}
      state=nextState;lastOptions=raw;apply();
    } catch(error) { const message=error.message;if(signature!==message){signature=message;emit(element,'error',{reason:'configuration',message});}return false; }
    signature='';return true;
  }
  function setValue(value,reason='api') {
    if(disposed||!options||options.disabled||!options.collapsible)return false;
    const next=readValue(value),controlled=element.hasAttribute('data-g-layout-value');
    if(next.collapsed===state.collapsed)return true;
    if(!emit(element,'beforechange',{value:{...next},previousValue:{...state},reason,controlled}))return false;
    if(disposed)return false;if(!controlled){state=next;apply();}emit(element,'change',{value:{...next},reason,controlled});return true;
  }
  function toggle() {return setValue({collapsed:!state.collapsed},'toggle');}
  function click(event) {const button=event.target.closest?.('[data-g-layout-toggle]');if(!event.defaultPrevented && button?.closest('[data-g-layout]')===element && !button.disabled){event.preventDefault();toggle();}}
  function keydown(event) {if(!event.defaultPrevented&&!event.isComposing&&options?.closeOnEscape&&event.key==='Escape'&&!state.collapsed&&event.target.closest('[data-g-layout]')===element&&owned('[data-g-layout-panel]').some(p=>p.contains(event.target))){if(setValue({collapsed:true},'escape'))event.preventDefault();}}
  function setOptions(patch) {if(disposed)return false;if(!isObject(patch))throw new TypeError('layout options patch must be an object');validate({...options,...patch});const previous=overrides;overrides={...overrides,...patch};const result=refresh();if(!result)overrides=previous;return result;}
  function destroy() {
    if(disposed)return;disposed=true;observer?.disconnect();resize?.disconnect();doc.defaultView.removeEventListener('resize',responsive);if(frame)doc.defaultView.cancelAnimationFrame(frame);element.removeEventListener('click',click);element.removeEventListener('keydown',keydown);
    for(const [node,attrs] of originals)for(const [name,value] of attrs)value===null?node.removeAttribute(name):node.setAttribute(name,value);
    for(const [name,[value,priority]] of styles)value?element.style.setProperty(name,value,priority):element.style.removeProperty(name);
  }
  refresh();element.addEventListener('click',click);element.addEventListener('keydown',keydown);
  const win=doc.defaultView;
  // Write outside ResizeObserver delivery: a breakpoint can also change height.
  // Scheduling prevents WebKit's undelivered-notification loop on narrow grids.
  if(win.ResizeObserver){resize=new win.ResizeObserver(()=>{if(!frame)frame=win.requestAnimationFrame(()=>{frame=0;responsive();});});resize.observe(element);}else win.addEventListener('resize',responsive);
  observer=new win.MutationObserver(records=>{if(records.some(r=>r.type==='attributes'&&(r.target===element||['data-g-layout-panel','data-g-layout-toggle'].includes(r.attributeName)) || r.type==='childList'))refresh();});
  observer.observe(element,{attributes:true,attributeFilter:['data-g-layout-options','data-g-layout-value','data-g-layout-disabled','data-g-layout-panel','data-g-layout-toggle','class'],childList:true,subtree:true});
  return {refresh,setOptions,getState:()=>({...state}),setValue,toggle,destroy};
}
