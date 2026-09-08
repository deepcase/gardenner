import { navigationDefinitions } from "./navigation-catalog.js";
let navigationId = 0;
const navigationDefaults = { "items": [], "actions": [], "label": "\u5BFC\u822A", "title": "", "description": "", "brand": "", "size": "medium", "appearance": "default", "disabled": false, "loading": false, "activation": "automatic", "loop": true, "defaultOpen": false, "defaultExpandedKeys": [], "closeOnSelect": true, "searchable": false, "searchPlaceholder": "\u641C\u7D22\u2026", "emptyText": "\u6682\u65E0\u53EF\u7528\u9879\u76EE", "maxVisibleItems": 5, "total": 0, "pageSize": 10, "pageSizes": [10, 20, 50], "siblingCount": 1, "showTotal": true, "showSizeChanger": false, "showJumper": false, "hasPrevious": false, "hasNext": true, "threshold": 200, "scrollOffset": 80, "sticky": false, "fixed": false };
const values = (value) => value ? typeof value === "string" ? [value] : [...value] : [];
Object.assign(navigationDefaults,{showIcons:true,showBadges:true,showDescriptions:true,showShortcuts:true,showGroups:true,showHeader:true,showActions:true,showPanel:true,bordered:true,maxHeight:0,popupWidth:360,popupMaxHeight:480,itemGap:8,indent:16,selectionTimeout:30000,closeOnEscape:true,closeOnOutside:true});
function validateNavigation(options,baseUrl) {
  for(const [key,defaultValue]of Object.entries(navigationDefaults))if(typeof defaultValue==='boolean'&&typeof options[key]!=='boolean')throw new TypeError(key+' must be boolean');
  for(const [key,allowed]of Object.entries({size:['small','medium','large'],appearance:['default','line','pill','card','contained'],activation:['automatic','manual'],orientation:['horizontal','vertical']}))if(options[key]!=null&&!allowed.includes(options[key]))throw new RangeError('Invalid '+key);
  for(const [key,min,max]of [['total',0,1e12],['pageSize',1,1e6],['siblingCount',0,5],['maxVisibleItems',3,100],['threshold',0,1e6],['scrollOffset',0,1e6],['maxHeight',0,5000],['popupWidth',160,1600],['popupMaxHeight',120,1600],['itemGap',0,48],['indent',0,64],['selectionTimeout',0,300000]])if(!Number.isFinite(options[key])||options[key]<min||options[key]>max)throw new RangeError('Invalid '+key);
  const safeHref=href=>{if(href==null||href==='')return;if(typeof href!=='string'||!['http:','https:','mailto:','tel:'].includes(new URL(href,baseUrl).protocol))throw new TypeError('Unsupported navigation URL');};
  safeHref(options.backHref);
  const seen=new Set(),visiting=new Set();let count=0;
  const walk=(rows,depth=0)=>{if(!Array.isArray(rows)||depth>32)throw new TypeError('Invalid navigation items');return rows.map(item=>{if(!item||typeof item.id!=='string'||!item.id||typeof item.label!=='string'||seen.has(item.id)||visiting.has(item)||++count>10000)throw new TypeError('Navigation item ids must be unique nonempty strings');seen.add(item.id);visiting.add(item);safeHref(item.href);if(item.target!=null&&!['_blank','_self'].includes(item.target))throw new TypeError('Unsupported link target');const clone={...item,...item.children?{children:walk(item.children,depth+1)}:{}};visiting.delete(item);return clone;});};
  const result={...options,items:walk(options.items),actions:walk(options.actions)};
  for(const key of ['previous','next'])if(options[key])result[key]=walk([options[key]])[0];
  for(const key of ['defaultExpandedKeys','expandedKeys'])if(options[key]!=null){if(!Array.isArray(options[key])||options[key].some(id=>typeof id!=='string'))throw new TypeError('Invalid '+key);result[key]=[...options[key]];}
  if(!Array.isArray(options.pageSizes)||options.pageSizes.some(n=>!Number.isInteger(n)||n<1||n>1e6))throw new RangeError('Invalid pageSizes');result.pageSizes=[...options.pageSizes];
  if(options.beforeChange!=null&&typeof options.beforeChange!=='function')throw new TypeError('beforeChange must be a function');
  return result;
}
const anchorTarget=(href,doc)=>{try{return doc.getElementById(decodeURIComponent(href.slice(1)));}catch{return null;}};
const flatten = (items) => items.filter((x) => !x.hidden).flatMap((x) => [x, ...flatten(x.children || [])]);
const linkClasses = {
  navbar: "g-nav-link",
  sidebar: "g-sidebar-link",
  "primary-navigation": "g-primary-nav-link",
  "utility-navigation": "g-utility-nav-link",
  "sub-navigation": "g-subnav-link",
  "navigation-rail": "g-nav-rail-item",
  "activity-bar": "g-activitybar-item",
  "pill-navigation": "g-pill-nav-link",
  "bottom-navigation": "g-bottom-nav-item",
  "mobile-tab-bar": "g-mobile-tab-item",
  "command-navigation": "g-command-nav-item",
  "quick-navigation": "g-quick-nav-item",
  "anchor-navigation": "g-anchor-link",
  "scrollspy-navigation": "g-scrollspy-link",
  "jump-navigation": "g-jump-nav-link",
  "command-bar": "g-command-bar-item"
};
const tabNames = /* @__PURE__ */ new Set(["tabs", "vertical-tabs", "segmented-control", "mobile-tab-bar"]);
const menuNames = /* @__PURE__ */ new Set(["menu-dropdown", "locale-navigation", "account-navigation", "context-menu", "menu-bar", "mega-menu"]);
const stepNames = /* @__PURE__ */ new Set(["stepper", "wizard-navigation"]);
const scrollNames = /* @__PURE__ */ new Set(["anchor-navigation", "scrollspy-navigation", "jump-navigation", "skip-navigation"]);
export const navigationEventContracts = ['change','select','open','collapse','expand','pagesize','loadmore','previous','next','back','closeitem','check','error'].map(suffix=>({name:'navigation'+suffix,detailKeys:suffix==='change'?['value','previousValue','item','originalEvent']:['value'],guard:false,bubbles:true,cancelable:true}));
function createNavigation(host, options) {
  options ||= {};
  if (!host?.ownerDocument) throw new TypeError("Navigation requires a host element.");
  const definition = navigationDefinitions[options.component];
  if (!definition) throw new RangeError("Unknown navigation component: " + options.component);
  const cleanOptions = (value) => Object.fromEntries(Object.entries(value).map(([key,item])=>[key,item == null ? navigationDefaults[key] : item]));
  const props = validateNavigation({ ...navigationDefaults, ...cleanOptions(options) },host.ownerDocument.baseURI), attrs = {}, slots = new Proxy({}, {get:(_,key)=>props.render?.[key]});
  const explicit=new Set(Object.keys(options).filter(key=>options[key]!=null));
  const variants=()=>values(props.variant);
  const effectiveSize=()=>explicit.has('size')?props.size:variants().some(v=>['compact','small','mini'].includes(v))?'small':variants().some(v=>['spacious','large'].includes(v))?'large':props.size;
  const effectiveAppearance=()=>explicit.has('appearance')?props.appearance:variants().includes('pill')?'pill':variants().some(v=>['line','underline'].includes(v))?'line':variants().includes('card')?'card':variants().includes('contained')?'contained':props.appearance;
  const originalNodes=[...host.childNodes],handlers=new WeakMap();let composing=false,selectionVersion=0,cancelSelection,modalLocked=false;
  const mounted = [], cleanups = [], watchers = [];
  let renderView, queued = false, rendering = false;
  const schedule = () => {
    if (queued || !renderView || rendering) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      if (!destroyed) render();
    });
  };
  const ref = (initial) => {
    let value = initial;
    return { get value() {
      return value;
    }, set value(next) {
      if (Object.is(value, next)) return;
      value = next;
      schedule();
    } };
  };
  const computed = (fn) => ({ get value() {
    return fn();
  } });
  const nextTick = (fn) => Promise.resolve().then(() => {
    if (!destroyed) return fn?.();
  });
  const onMounted = (fn) => mounted.push(fn), onBeforeUnmount = (fn) => cleanups.push(fn), watch = (_source, fn) => watchers.push(fn);
  const eventNames = { "change": "navigationchange", "select": "navigationselect", "update:open": "navigationopen", "update:collapsed": "navigationcollapse", "update:expandedKeys": "navigationexpand", "update:pageSize": "navigationpagesize", "load-more": "navigationloadmore", "previous": "navigationprevious", "next": "navigationnext", "back": "navigationback", "close-item": "navigationcloseitem", "check": "navigationcheck", "error": "navigationerror" };
  const emit = (name2, detail, originalEvent) => {
    if (!eventNames[name2]) return;
    const payload = name2 === "change" ? detail : { value: detail, ...originalEvent ? { originalEvent } : {} };
    const event = new host.ownerDocument.defaultView.CustomEvent("gardener:" + eventNames[name2], { bubbles: true, cancelable: true, detail: payload });
    host.dispatchEvent(event);
    const callback = ({"update:pageSize":"onPageSizeChange","load-more":"onLoadMore","close-item":"onCloseItem"})[name2] || "on" + eventNames[name2].slice(10).replace(/^./, (c) => c.toUpperCase());
    props[callback]?.(payload, event);
  };
  function h(tag, attributes, children) {
    if (attributes == null) attributes = {};
    else if (typeof attributes !== "object" || Array.isArray(attributes) || attributes.nodeType) {
      children = attributes;
      attributes = {};
    }
    const node = host.ownerDocument.createElement(tag);
    const cls = (value) => Array.isArray(value) ? value.map(cls).filter(Boolean).join(" ") : value && typeof value === "object" ? Object.keys(value).filter((k) => value[k]).join(" ") : value || "";
    for (const [key, value] of Object.entries(attributes)) {
      if (value == null || key === "key" || key === "ref") continue;
      if (key === "class") {
        node.className = cls(value);
        continue;
      }
      if (key === "style") {
        for(const [property,setting]of Object.entries(value))if(property.startsWith('--'))node.style.setProperty(property,setting);else node.style[property]=setting;
        continue;
      }
      if (key.startsWith("on") && typeof value === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), value);
        const events=handlers.get(node)||{};events[key.slice(2).toLowerCase()]=value;handlers.set(node,events);
        continue;
      }
      if (["disabled", "hidden", "checked", "multiple", "selected"].includes(key)) {
        node[key] = !!value;
        continue;
      }
      if (key === "value") {
        node.value = String(value);
        continue;
      }
      node.setAttribute(key, String(value));
    }
    const append = (value) => {
      if (value == null || value === false) return;
      if (Array.isArray(value)) value.forEach(append);
      else node.append(value.nodeType ? value : host.ownerDocument.createTextNode(String(value)));
    };
    append(children);
    if (tag === "select" && attributes.value != null) node.value = String(attributes.value);
    return node;
  }
  function render() {
    if(composing)return;
    rendering = true;
    const focused = host.contains(host.ownerDocument.activeElement) ? host.ownerDocument.activeElement : null;
    const focusId = focused?.id, focusKey2 = focused?.getAttribute("data-nav-key"), search2 = focused?.matches("input[type=search]"), start = search2 ? focused.selectionStart : null, end=search2?focused.selectionEnd:null;
    const focusIndex = focused ? [...host.querySelectorAll('button,a,input,select,[tabindex]')].indexOf(focused) : -1;
    const root = renderView();
    if (root) {
      reconcile(host,[root]);
      element.value = host.firstElementChild;
      syncModal();
      syncPopup();
      const live=element.value;
      const replacement = focused?.isConnected?focused:focusId ? live.querySelector('[id="' + CSS.escape(focusId) + '"]') : focusKey2 ? live.querySelector('[data-nav-key="' + CSS.escape(focusKey2) + '"]') : search2 ? live.querySelector("input[type=search]") : null;
      if(focused&&document.activeElement!==replacement)(replacement || (focusIndex>=0?live.querySelectorAll('button,a,input,select,[tabindex]')[focusIndex]:null))?.focus({ preventScroll: true });
      if (search2 && start != null) replacement?.setSelectionRange(start, end);
    }
    rendering = false;
  }
  function reconcile(parent,nextNodes){
    const old=[...parent.childNodes],used=new Set();
    const key=n=>n.nodeType===1?(n.id||n.getAttribute('data-nav-key')||n.getAttribute('data-nav-component')):null;
    nextNodes.forEach((next,index)=>{const candidate=key(next)?old.find(n=>!used.has(n)&&key(n)===key(next)):old[index];let node=next;
      if(candidate&&!used.has(candidate)&&candidate.nodeType===next.nodeType&&candidate.nodeName===next.nodeName&&key(candidate)===key(next)){node=candidate;used.add(node);if(node.nodeType===3){if(node.textContent!==next.textContent)node.textContent=next.textContent;}else if(node.nodeType===1){const keepOpen=node.tagName==='DIALOG'&&node.open,detailsOpen=node.tagName==='DETAILS'&&node.open;for(const attr of [...node.attributes])if(!next.hasAttribute(attr.name)&&!(attr.name==='open'&&(keepOpen||detailsOpen))&&!(node.hasAttribute('data-nav-popup')&&['popover','style'].includes(attr.name)))node.removeAttribute(attr.name);for(const attr of next.attributes)if(node.getAttribute(attr.name)!==attr.value)node.setAttribute(attr.name,attr.value);for(const [event,fn]of Object.entries(handlers.get(node)||{}))node.removeEventListener(event,fn);const events=handlers.get(next)||{};for(const [event,fn]of Object.entries(events))node.addEventListener(event,fn);handlers.set(node,events);const value=next.value;reconcile(node,[...next.childNodes]);if(['INPUT','SELECT','TEXTAREA'].includes(node.tagName)&&handlers.has(next)&&node.value!==value)node.value=value;}}
      if(parent.childNodes[index]!==node)parent.insertBefore(node,parent.childNodes[index]||null);
    });old.filter(n=>!used.has(n)&&n.parentNode===parent&&!nextNodes.includes(n)).forEach(n=>n.remove());
  }
  function syncModal(){
    const dialog=host.querySelector('[data-nav-modal]');
    if(dialog&&!dialog.open){try{dialog.showModal();}catch{dialog.setAttribute('open','');}}
    const root=host.ownerDocument.documentElement;
    if(dialog&&!modalLocked){const count=Number(root.dataset.gScrollLocks||0);if(!count){root.dataset.gPreviousOverflow=root.style.overflow;root.style.overflow='hidden';}root.dataset.gScrollLocks=String(count+1);modalLocked=true;}
    if(!dialog&&modalLocked){const count=Math.max(0,Number(root.dataset.gScrollLocks||0)-1);root.dataset.gScrollLocks=String(count);if(!count){root.style.overflow=root.dataset.gPreviousOverflow||'';delete root.dataset.gPreviousOverflow;}modalLocked=false;}
  }
  function syncPopup(){
    if(destroyed||!isOpen.value||host.querySelector('[data-nav-modal]'))return;
    const popup=host.querySelector('[data-nav-popup]');if(!popup)return;
    try{popup.setAttribute('popover','manual');if(!popup.matches(':popover-open'))popup.showPopover();}catch{}
    const trigger=host.querySelector('[aria-expanded="true"][aria-haspopup]')||element.value,rect=trigger.getBoundingClientRect();
    const rtl=getComputedStyle(element.value).direction==='rtl';popup.style.position='fixed';popup.style.margin='0';popup.style.inset='auto';
    const bounds=popup.getBoundingClientRect(),top=popupPoint?popupPoint.y:variants().includes('top')||rect.bottom+8+bounds.height>window.innerHeight-8?rect.top-bounds.height-8:rect.bottom+8;
    const left=popupPoint?popupPoint.x:rtl||variants().includes('end')?rect.right-bounds.width:rect.left;
    popup.style.top=Math.max(8,Math.min(top,window.innerHeight-bounds.height-8))+'px';popup.style.left=Math.max(8,Math.min(left,window.innerWidth-bounds.width-8))+'px';
  }
  const name = definition.name, uid = `g-nav-${navigationId++}`;
  const element = ref(host), local = ref(props.defaultValue), localOpen = ref(props.defaultOpen), localExpanded = ref(props.defaultExpandedKeys), localCollapsed = ref(false), query = ref(""), pending = ref(false), jump = ref("1"), menuId = ref("");
  let opener = null, scrollElement, destroyed = false, controlledPageSize=options.pageSize!=null,popupPoint=null; const targetAttributes=new Map();
  const checked = ref({}), focusKey = ref("");
  const items = computed(() => props.items?.filter((x) => !x.hidden) || []), all = computed(() => flatten(items.value));
  const active = computed(() => props.value ?? local.value ?? (name === "pagination" ? 1 : all.value.find((x) => !x.disabled)?.id));
  const isOpen = computed(() => !props.disabled && (props.open ?? localOpen.value)), collapsed = computed(() => props.collapsed ?? (variants().includes('collapsed')||localCollapsed.value)), expanded = computed(() => props.expandedKeys ?? localExpanded.value);
  const busy = computed(() => props.loading || pending.value), blocked = computed(() => props.disabled || busy.value);
  const vertical = computed(() => props.orientation ? props.orientation === "vertical" : variants().includes('vertical')?true:variants().includes('horizontal')?false:["sidebar", "navigation-rail", "activity-bar", "vertical-tabs", "tree-navigation", "wizard-navigation", "anchor-navigation", "scrollspy-navigation", "jump-navigation"].includes(name));
  const filtered = computed(() => {
    const term=query.value.trim().toLowerCase();if(!term)return items.value;
    const match=rows=>rows.filter(x=>!x.hidden).flatMap(item=>{
      if(`${item.label} ${item.description||''} ${item.group||''} ${item.shortcut||''}`.toLowerCase().includes(term))return [item];
      const children=match(item.children||[]);return children.length?[{...item,children}]:[];
    });return match(items.value);
  });
  const size = computed(() => Math.max(1, Math.floor(Number(props.pageSize) || 10)));
  const pages = computed(() => Math.max(1, Math.ceil(Math.max(0, Number(props.total) || 0) / size.value)));
  const currentPage = computed(() => Math.min(pages.value, Math.max(1, Math.floor(Number(active.value) || 1))));
  const panelId = (id) => `${uid}-panel-${encodeURIComponent(id)}`;
  const itemId = (id) => `${uid}-item-${encodeURIComponent(id)}`;
  function setOpen(value, restore = true) {
    if(destroyed)return;
    if (value && blocked.value) return;
    if (value) opener = host.contains(document.activeElement) ? document.activeElement : element.value?.querySelector('[aria-haspopup],.g-nav-ui-context');
    localOpen.value = value;
    if(!value)popupPoint=null;
    emit("update:open", value);
    if (value) nextTick(() => {
      element.value?.querySelector("[data-nav-popup] input,[data-nav-popup] [data-nav-choice]:not(:disabled)")?.focus();
    });
    else if (restore) nextTick(() => opener?.isConnected ? opener.focus() : element.value?.querySelector('[aria-haspopup],.g-nav-ui-context')?.focus());
  }
  function toggleExpanded(id) {
    if (blocked.value) return;
    const next = expanded.value.includes(id) ? expanded.value.filter((x) => x !== id) : [...expanded.value, id];
    localExpanded.value = next;
    emit("update:expandedKeys", next);
  }
  async function select(value, event, item) {
    if (destroyed||blocked.value || item?.disabled||item?.hidden) return false;
    if(name==='pagination'){if(!Number.isFinite(Number(value)))return false;value=Math.max(1,Math.min(pages.value,Math.floor(Number(value))));}
    else if(!item)return false;
    const change = { value, previousValue: active.value, ...item ? { item } : {}, ...event ? { originalEvent: event } : {} };
    if (props.beforeChange) {
      const version=++selectionVersion,abort=new AbortController();let timer;
      pending.value = true;
      try {
        const cancelled=new Promise(resolve=>{cancelSelection=()=>{abort.abort();resolve(false);};});
        const work=Promise.resolve().then(()=>props.beforeChange(change,abort.signal));
        const timeout=new Promise((_,reject)=>{if(props.selectionTimeout)timer=setTimeout(()=>{abort.abort();reject(new Error('Navigation selection timed out'));},props.selectionTimeout);});
        if (!await Promise.race([work,cancelled,timeout]) || destroyed || version!==selectionVersion||props.disabled||props.loading) return false;
      } catch (error) {
        if(!destroyed&&version===selectionVersion)emit("error", error);
        return false;
      } finally {
        clearTimeout(timer);if(version===selectionVersion){pending.value = false;cancelSelection=undefined;}
      }
    }
    if (props.value === void 0) local.value = value;
    emit("update:modelValue", value);
    emit("change", change);
    if (item) emit("select", item, event);
    return true;
  }
  function scrollToItem(item, event) {
    if (!item.href?.startsWith("#")) return;
    const target = anchorTarget(item.href,document);
    if (!target) return;
    event.preventDefault();
    const container = props.scrollTarget ? document.getElementById(props.scrollTarget.replace(/^#/, "")) : null;
    const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    if (container) container.scrollTo({ top: target.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop - props.scrollOffset, behavior });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - props.scrollOffset, behavior });
    if (!target.hasAttribute("tabindex")) {targetAttributes.set(target,null);target.setAttribute("tabindex", "-1");}
    target.focus({ preventScroll: true });
  }
  async function activate(item, event) {
    if (blocked.value || item.disabled) {
      event.preventDefault();
      return;
    }
    if ((props.beforeChange || scrollNames.has(name)) && item.href) event.preventDefault();
    if (!await select(item.id, event, item)) return;
    if (item.checkable) {
      const value = !(checked.value[item.id] ?? item.checked ?? false);
      checked.value = { ...checked.value, [item.id]: value };
      emit("check", { item, checked: value });
    }
    if (scrollNames.has(name)) scrollToItem(item, event);
    else if (props.beforeChange && item.href) { if(item.target==='_blank')window.open(item.href,'_blank','noopener,noreferrer');else window.location.assign(item.href); }
    if (props.closeOnSelect && (menuNames.has(name) || name === "command-palette" || name === "drawer-navigation" || name === "sidebar" && variants().includes("drawer"))) setOpen(false);
  }
  function keyboard(event, orientation = vertical.value ? "vertical" : "horizontal", manual = false) {
    const target = event.target;
    if (target.matches("input,textarea,select")) return;
    const scope = target.closest("[data-nav-list]");
    if (!scope) return;
    const choices = [...scope.querySelectorAll("[data-nav-choice]")].filter((e) => !e.hasAttribute("disabled") && e.getAttribute("aria-disabled") !== "true" && !e.closest("[hidden]") && e.closest("[data-nav-list]") === scope);
    const i = choices.indexOf(target.closest("[data-nav-choice]"));
    if (i < 0) return;
    const rtl = getComputedStyle(element.value).direction === "rtl";
    let next = -1;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = choices.length - 1;
    else if (event.key === (orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight")) next = i + 1;
    else if (event.key === (orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft")) next = i - 1;
    else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== " ") {
      const reordered = [...choices.slice(i + 1), ...choices.slice(0, i + 1)];
      const found = reordered.find((e) => e.textContent?.trim().toLowerCase().startsWith(event.key.toLowerCase()));
      if (found) {
        event.preventDefault();
        found.focus();
      }
      return;
    } else return;
    event.preventDefault();
    next = props.loop ? (next + choices.length) % choices.length : Math.max(0, Math.min(choices.length - 1, next));
    const choice2 = choices[next];
    choice2?.focus();
    focusKey.value = choice2?.dataset.navKey || "";
    if(name === "menu-bar" && isOpen.value)menuId.value=focusKey.value;
    if (tabNames.has(name) && !manual) choice2?.click();
  }
  const text = (item) => slots.item?.({ item, active: active.value === item.id, disabled: blocked.value || !!item.disabled }) || [
    props.showIcons&&item.icon ? h("span", { class: "g-nav-ui-icon", "aria-hidden": "true" }, item.icon) : null,
    h("span", { class: "g-nav-ui-copy" }, [h("span", { class: "g-nav-ui-label" }, item.label), props.showDescriptions&&item.description ? h("small", item.description) : null]),
    props.showBadges&&item.badge !== void 0 ? h("span", { class: "g-nav-ui-badge" }, String(item.badge)) : null,
    props.showShortcuts&&item.shortcut ? h("kbd", { class: "g-nav-ui-shortcut" }, item.shortcut) : null
  ];
  function choice(item, extra = {}) {
    const disabled = blocked.value || !!item.disabled;
    return h(item.href && !disabled ? "a" : "button", {
      type: item.href && !disabled ? void 0 : "button",
      href: disabled ? void 0 : item.href,
      target: item.target,
      rel: item.target === "_blank" ? "noopener noreferrer" : void 0,
      class: ["g-nav-ui-item", linkClasses[name], { "is-active": active.value === item.id }],
      id: itemId(item.id),
      "data-nav-choice": "",
      "data-nav-key": item.id,
      "aria-current": active.value === item.id ? "page" : void 0,
      "aria-disabled": disabled ? "true" : void 0,
      disabled,
      title: collapsed.value ? item.label : void 0,
      onClick: (event) => activate(item, event),
      ...extra
    }, text(item));
  }
  const empty = () => h("div", { class: "g-nav-ui-empty", role: "status" }, slots.empty?.() || props.emptyText);
  const search = () => props.searchable || name === "command-palette" ? h("input", { class: "g-input g-nav-ui-search", type: "search", value: query.value, disabled:props.disabled||props.loading, placeholder: props.searchPlaceholder, "aria-label": props.searchPlaceholder, onCompositionstart:()=>{composing=true;},onCompositionend:e=>{composing=false;query.value=e.target.value;schedule();},onInput: (e) => {if(!composing&&!e.isComposing)query.value=e.target.value;}, onKeydown: (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      element.value?.querySelector("[data-nav-popup] [data-nav-choice]:not(:disabled)")?.focus();
    }
  } }) : null;
  const actionArea = () => props.showActions?(slots.actions?.() || props.actions.filter((x) => !x.hidden).map((x) => choice(x))):null;
  const heading = () => props.showHeader&&(props.title || props.description) ? h("header", { class: "g-nav-ui-heading" }, [props.title ? h("strong", props.title) : null, props.description ? h("p", props.description) : null]) : null;
  function list(content = filtered.value) {
    return content.length ? h("div", { class: "g-nav-ui-list", "data-nav-list": "", onKeydown: keyboard }, content.map((item, i) => h("div", { class: "g-nav-ui-entry", key: item.id }, [props.showGroups && item.group && item.group !== content[i - 1]?.group ? h("span", { class: "g-nav-ui-group" }, item.group) : null, choice(item), item.children?.length ? h("div", { class: "g-nav-ui-children" }, list(item.children)) : null]))) : empty();
  }
  function tabs() {
    const enabled = items.value.filter((i) => !i.disabled), selected = enabled.find((i) => i.id === active.value) || enabled[0];
    return [h("div", { class: "g-nav-ui-tablist", role: name==='segmented-control'?'radiogroup':"tablist", "aria-label": props.label, "aria-orientation": vertical.value ? "vertical" : "horizontal", "data-nav-list": "", onKeydown: (e) => keyboard(e, vertical.value ? "vertical" : "horizontal", props.activation === "manual") }, items.value.map((item) => h("div", { class: "g-nav-ui-tab-wrap", key: item.id }, [
      choice({ ...item, href: void 0 }, { role: name==='segmented-control'?'radio':"tab", "aria-current": void 0, "aria-selected": name==='segmented-control'?undefined:String(item === selected), 'aria-checked':name==='segmented-control'?String(item===selected):undefined,"aria-controls": name==='segmented-control'?undefined:panelId(item.id), tabindex: (focusKey.value ? focusKey.value === item.id : item === selected) ? 0 : -1 }),
      item.closable ? h("button", { type: "button", class: "g-nav-ui-close", disabled: blocked.value || item.disabled, "aria-label": `\u5173\u95ED ${item.label}`, onClick: () => emit("close-item", item) }, "\xD7") : null
    ]))), name === "segmented-control" ? null : h("div", { class: "g-nav-ui-panels",hidden:!props.showPanel }, items.value.map((item) => h("section", { id: panelId(item.id), key: item.id, role: "tabpanel", "aria-labelledby": itemId(item.id), hidden: item !== selected, tabindex: 0, class: "g-nav-ui-panel" }, slots.panel?.({ item, active: active.value }) || item.content || item.description || item.label)))];
  }
  function tree(nodes = filtered.value, level = 1) {
    const visibleNodes = (rows) => rows.filter(x=>!x.hidden).flatMap((x) => [x, ...(query.value.trim() || expanded.value.includes(x.id)) ? visibleNodes(x.children || []) : []]);
    const first = visibleNodes(filtered.value).find((x) => !x.disabled)?.id;
    return h("ul", { role: level === 1 ? "tree" : "group", class: "g-nav-ui-tree", "aria-label": level === 1 ? props.label : void 0 }, nodes.filter(x=>!x.hidden).map((item) => {
      const has = !!item.children?.length, isExpanded = !!query.value.trim() || expanded.value.includes(item.id);
      return h("li", { role: "none", key: item.id }, [h("div", {
        role: "treeitem",
        id: itemId(item.id),
        "aria-level": level,
        "aria-selected": String(active.value === item.id),
        "aria-expanded": has ? String(isExpanded) : void 0,
        "aria-disabled": blocked.value || item.disabled ? "true" : void 0,
        tabindex: (focusKey.value ? focusKey.value === item.id : active.value === item.id || !active.value && first === item.id) ? 0 : -1,
        class: ["g-nav-ui-item", { "is-active": active.value === item.id }],
        style: { paddingInlineStart: `${(level - 1) * props.indent + 8}px` },
        "data-nav-choice": "",
        "data-nav-key": item.id,
        onFocus: () => focusKey.value = item.id,
        onClick: (e) => activate(item, e),
        onKeydown: (e) => {
          const rtl = getComputedStyle(element.value).direction === "rtl";
          const forward = rtl ? "ArrowLeft" : "ArrowRight", back = rtl ? "ArrowRight" : "ArrowLeft";
          const visible = visibleNodes(filtered.value).filter((x) => !x.disabled), i = visible.findIndex((x) => x.id === item.id);
          let destination;
          if (e.key === forward && has) {
            e.preventDefault();
            if (!isExpanded) toggleExpanded(item.id);
            else destination = item.children?.find((x) => !x.disabled);
          } else if (e.key === back) {
            e.preventDefault();
            if (has && isExpanded) toggleExpanded(item.id);
            else destination = all.value.find((x) => x.children?.some((child) => child.id === item.id));
          } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            destination = visible[Math.max(0, Math.min(visible.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))];
          } else if (e.key === "Home" || e.key === "End") {
            e.preventDefault();
            destination = e.key === "Home" ? visible[0] : visible.at(-1);
          } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate(item, e);
          }
          if (destination) {
            focusKey.value = destination.id;
            nextTick(() => document.getElementById(itemId(destination.id))?.focus());
          }
        }
      }, [has ? h("button", { type: "button", tabindex: -1, class: "g-nav-ui-tree-toggle", "aria-label": `${isExpanded ? "\u6536\u8D77" : "\u5C55\u5F00"} ${item.label}`, disabled: blocked.value || item.disabled, onClick: (e) => {
        e.stopPropagation();
        toggleExpanded(item.id);
      } }, isExpanded ? "\u25BE" : "\u25B8") : h("span", { class: "g-nav-ui-tree-toggle" }), text(item)]), has && isExpanded ? tree(item.children, level + 1) : null]);
    }));
  }
  function pagination() {
    const page = currentPage.value;
    const range = /* @__PURE__ */ new Set([1, pages.value]);
    const siblings = Math.max(0, Math.min(5, Math.floor(props.siblingCount)));
    for (let i = Math.max(1, page - siblings); i <= Math.min(pages.value, page + siblings); i++) range.add(i);
    const numbers = [...range].sort((a, b) => a - b);
    const changePage = (value, e) => select(Math.max(1, Math.min(pages.value, value)), e);
    const btn = (label, value, disabled = false) => h("button", { type: "button", class: ["g-nav-ui-item", "g-page-link", { "is-active": value === page && /^\d/.test(label) }], disabled: blocked.value || disabled, "aria-current": value === page && /^\d/.test(label) ? "page" : void 0, "aria-label": /^\d/.test(label) ? `\u7B2C ${label} \u9875` : label, onClick: (e) => changePage(value, e) }, label);
    return [
      props.showTotal ? h("span", { class: "g-pagination-total" }, `\u5171 ${Math.max(0, props.total)} \u6761`) : null,
      h("div", { class: "g-nav-ui-pagination" }, [btn("\u4E0A\u4E00\u9875", page - 1, page === 1), ...(variants().some(v=>["simple","mini"].includes(v))?[h("span",{class:"g-nav-ui-page-summary"},`${page} / ${pages.value}`)]:numbers.flatMap((n, i) => [i && n - numbers[i - 1] > 1 ? h("span", { "aria-hidden": "true" }, "\u2026") : null, btn(String(n), n)])), btn("\u4E0B\u4E00\u9875", page + 1, page === pages.value)]),
      props.showSizeChanger ? h("label", { class: "g-nav-ui-inline" }, ["\u6BCF\u9875", h("select", { class: "g-select", value: size.value, disabled: blocked.value, onChange: async (e) => {
        const value = Number(e.target.value);
        if(!await select(1,e)){schedule();return;}
        if(!controlledPageSize)props.pageSize=value;
        emit("update:pageSize", value);
        schedule();
      } }, [.../* @__PURE__ */ new Set([size.value, ...props.pageSizes])].filter((n) => n > 0).map((n) => h("option", { value: n }, String(n))))]) : null,
      props.showJumper ? h("form", { class: "g-nav-ui-inline", novalidate: "", onSubmit: (e) => {
        e.preventDefault();
        changePage(Number(jump.value) || 1, e);
      } }, [h("label", ["\u8DF3\u81F3", h("input", { class: "g-input", type: "number", min: 1, max: pages.value, value: jump.value, disabled: blocked.value, onInput: (e) => jump.value = e.target.value })]), h("button", { type: "submit", class: "g-btn g-btn-outline", disabled: blocked.value }, "\u786E\u5B9A")]) : null,
      h("span", { class: "g-nav-ui-sr", role: "status" }, `\u7B2C ${page} \u9875\uFF0C\u5171 ${pages.value} \u9875`)
    ];
  }
  function steps() {
    const index = Math.max(0, items.value.findIndex((x) => x.id === active.value));
    const previous=items.value.slice(0,index).findLast(item=>!item.disabled),next=items.value.slice(index+1).find(item=>!item.disabled);
    return [h("ol", { class: "g-nav-ui-steps", "data-nav-list":"", onKeydown:keyboard }, items.value.map((item, i) => h("li", { key: item.id, class: ["g-nav-ui-step", `is-${item.status || (i < index ? "complete" : i === index ? "active" : "pending")}`] }, choice(item, { "aria-current": i === index ? "step" : void 0, onClick: (e) => activate(item, e) })))), props.showPanel?h("section", { class: "g-nav-ui-panel", "aria-live": "polite" }, slots.panel?.({ item: items.value[index], active: active.value }) || items.value[index]?.content || items.value[index]?.description):null, props.showActions?h("div", { class: "g-nav-ui-actions" }, [h("button", { type: "button", class: "g-btn g-btn-outline", disabled: blocked.value || !previous, onClick: (e) => select(previous.id, e, previous) }, "\u4E0A\u4E00\u6B65"), h("button", { type: "button", class: "g-btn g-btn-primary", disabled: blocked.value || !next, onClick: (e) => select(next.id, e, next) }, "\u4E0B\u4E00\u6B65")]):null];
  }
  function menuRows(rows = filtered.value) {
    return rows.length ? h("div", { role: "menu", "aria-label": props.label, "data-nav-list": "", class: "g-nav-ui-menu-list", onKeydown: (e) => keyboard(e, "vertical") }, rows.map((item, i) => h("div", { role: "none", key: item.id }, [
      props.showGroups && item.group && item.group !== rows[i - 1]?.group ? h("div", { class: "g-nav-ui-group", role: "presentation" }, item.group) : null,
      choice(item, {
        role: item.checkable ? "menuitemcheckbox" : "menuitem",
        "aria-current": void 0,
        "aria-checked": item.checkable ? String(checked.value[item.id] ?? item.checked ?? false) : void 0,
        tabindex: -1,
        "aria-haspopup": item.children?.length ? "menu" : void 0,
        "aria-expanded": item.children?.length ? String(expanded.value.includes(item.id)) : void 0,
        onClick: (e) => item.children?.length ? toggleExpanded(item.id) : activate(item, e),
        onKeydown: (e) => {
          if (item.children?.length && e.key === (getComputedStyle(element.value).direction === "rtl" ? "ArrowLeft" : "ArrowRight")) {
            e.preventDefault();
            if(!expanded.value.includes(item.id))toggleExpanded(item.id);
            nextTick(() => document.getElementById(panelId(item.id))?.querySelector("[data-nav-choice]")?.focus());
          }
        }
      }),
      item.children?.length && expanded.value.includes(item.id) ? h("div", { id: panelId(item.id), class: "g-nav-ui-submenu", onKeydown: (e) => {
        if (e.key === (getComputedStyle(element.value).direction === "rtl" ? "ArrowRight" : "ArrowLeft") || e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          toggleExpanded(item.id);
          document.getElementById(itemId(item.id))?.focus();
        }
      } }, menuRows(item.children)) : null
    ]))) : empty();
  }
  function menu() {
    const trigger = h("button", { type: "button", class: "g-btn g-btn-outline g-nav-ui-trigger", "aria-haspopup": "menu", "aria-expanded": String(isOpen.value), "aria-controls": isOpen.value ? `${uid}-menu` : undefined, disabled: blocked.value, onClick: () => setOpen(!isOpen.value), onKeydown: (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
    } }, slots.trigger?.() || props.title || props.label);
    if (name === "menu-bar") return [h("div", { role: "menubar", "aria-label": props.label, "data-nav-list": "", class: "g-nav-ui-list", onKeydown: (e) => keyboard(e, "horizontal") }, items.value.map((item) => h("button", { type: "button", role: "menuitem", id:itemId(item.id), "data-nav-key":item.id, tabindex:(focusKey.value || items.value.find(x=>!x.disabled)?.id)===item.id?0:-1, "data-nav-choice": "", class: "g-nav-ui-item", disabled: blocked.value || item.disabled, "aria-haspopup": "menu", "aria-expanded": String(isOpen.value && menuId.value === item.id), onClick: () => {
      focusKey.value=item.id;
      const next = !isOpen.value || menuId.value !== item.id;
      menuId.value = item.id;
      setOpen(next);
    }, onKeydown: (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        menuId.value = item.id;
        setOpen(true);
      }
    } }, item.label))), isOpen.value ? h("div", { class: "g-nav-ui-popup", "data-nav-popup": "" }, menuRows(items.value.find((x) => x.id === menuId.value)?.children || [])) : null];
    return [
      name === "context-menu" ? h("div", { class: "g-nav-ui-context", tabindex: 0, "aria-label": props.title || "\u53F3\u952E\u83DC\u5355\u533A\u57DF", onContextmenu: (e) => {
        e.preventDefault();
        popupPoint={x:e.clientX,y:e.clientY};
        setOpen(true);
      }, onKeydown: (e) => {
        if (e.key === "ContextMenu" || e.shiftKey && e.key === "F10") {
          e.preventDefault();
          setOpen(true);
        }
      } }, slots.trigger?.() || [h("strong", props.title || "\u6587\u4EF6\u64CD\u4F5C"), h("p", "\u53F3\u952E\u70B9\u51FB\uFF0C\u6216\u6309 Shift + F10"), trigger]) : trigger,
      isOpen.value ? h("div", { id: `${uid}-menu`, class: ["g-nav-ui-popup", { "g-nav-ui-mega": name === "mega-menu" }], "data-nav-popup": "" }, [search(), menuRows()]) : null
    ];
  }
  function overlay(palette = false) {
    return [h("button", { type: "button", class: "g-btn g-btn-primary", "aria-haspopup": "dialog", "aria-expanded": String(isOpen.value), disabled: blocked.value, onClick: () => setOpen(true) }, slots.trigger?.() || props.title || "\u6253\u5F00\u5BFC\u822A"), isOpen.value ? h("dialog", { class: "g-nav-ui-overlay", "data-nav-modal":"",role:"dialog","aria-modal":"true","aria-labelledby":`${uid}-title`,onCancel:e=>{e.preventDefault();if(props.closeOnEscape)setOpen(false);},onClick: (e) => {
      if (e.target === e.currentTarget&&props.closeOnOutside) setOpen(false);
    } }, h("section", { class: ["g-nav-ui-dialog", { "g-nav-ui-drawer": !palette }], "data-nav-popup": "", onKeydown: (e) => {
      if (e.key === "Tab") {
        const nodes = [...element.value.querySelectorAll("[data-nav-popup] button:not(:disabled),[data-nav-popup] input,[data-nav-popup] a[href]")].filter((x) => !x.closest("[hidden]"));
        const first = nodes[0], last = nodes.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    } }, [
      h("header", { class: "g-nav-ui-heading" }, [h("strong", { id: `${uid}-title` }, props.title || props.label), h("button", { type: "button", class: "g-btn g-btn-ghost", "aria-label": "\u5173\u95ED", onClick: () => setOpen(false) }, "\xD7")]),
      search(),
      palette ? menuRows() : list(),
      slots.footer?.()
    ])) : null];
  }
  const scrollVisible = ref(false);
  const onScroll = () => {
    scrollVisible.value = (scrollElement instanceof HTMLElement ? scrollElement.scrollTop : window.scrollY) > props.threshold;
    if (["anchor-navigation", "scrollspy-navigation", "jump-navigation"].includes(name)) {
      const offset = scrollElement instanceof HTMLElement ? scrollElement.getBoundingClientRect().top : 0;
      let found;
      for (const item of items.value) {
        if (!item.href?.startsWith("#")) continue;
        const target = anchorTarget(item.href,document);
        if (target && target.getBoundingClientRect().top <= offset + props.scrollOffset + 2) found = item;
      }
      if (found && found.id !== active.value && !blocked.value) {
        const previousValue=active.value;
        if (props.value === void 0) local.value = found.id;
        emit("change", {value:found.id,previousValue, item:found});
      }
    }
  };
  const outside = (e) => {
    if (props.closeOnOutside && isOpen.value && element.value && !element.value.contains(e.target)) setOpen(false, false);
  };
  onMounted(() => {
    document.addEventListener("pointerdown", outside);
    window.addEventListener('resize',syncPopup);window.addEventListener('scroll',syncPopup,true);
    scrollElement = props.scrollTarget ? document.getElementById(props.scrollTarget.replace(/^#/, "")) || window : window;
    scrollElement.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  });
  onBeforeUnmount(() => {
    destroyed = true;
    if (typeof document !== "undefined") document.removeEventListener("pointerdown", outside);
    window.removeEventListener('resize',syncPopup);window.removeEventListener('scroll',syncPopup,true);
    scrollElement?.removeEventListener("scroll", onScroll);
  });
  watch(() => props.value, () => {
    focusKey.value = "";
  });
  watch(() => props.items, () => {
    focusKey.value = "";
    if (local.value !== void 0 && name !== "pagination" && !all.value.some((x) => x.id === local.value && !x.disabled)) {
      local.value = all.value.find((x) => !x.disabled)?.id;
    }
  }, { deep: true });
  renderView = () => {
    let content;
    if (tabNames.has(name)) content = items.value.length ? tabs() : empty();
    else if (name === "tree-navigation") content = [search(), filtered.value.length ? tree() : empty()];
    else if (name === "pagination") content = pagination();
    else if (stepNames.has(name)) content = items.value.length ? steps() : empty();
    else if (menuNames.has(name)) content = menu();
    else if (name === "command-palette" || name === "drawer-navigation" || name === "sidebar" && variants().includes("drawer")) content = overlay(name === "command-palette");
    else if (name === "breadcrumb") {
      const limit = Math.max(3, variants().includes("collapsed")&&!explicit.has("maxVisibleItems")?3:props.maxVisibleItems), overflow = items.value.length > limit;
      content = h("ol", { class: "g-nav-ui-breadcrumb" }, items.value.flatMap((item, i) => {
        if (overflow && i > 0 && i < items.value.length - (limit - 2)) return i === 1 ? [h("li", h("details", { class: "g-nav-ui-overflow" }, [h("summary", { "aria-label": "\u663E\u793A\u9690\u85CF\u8DEF\u5F84" }, "\u2026"), h("div", { class: "g-nav-ui-popup" }, items.value.slice(1, -(limit - 2)).map((x) => choice(x)))]))] : [];
        return [h("li", { key: item.id }, [i ? h("span", { class: "g-nav-ui-separator", "aria-hidden": "true" }, variants().includes("dot")?"·":variants().includes("chevron")?"›":"/") : null, i === items.value.length - 1 ? h("span", { "aria-current": "page", class: "g-nav-ui-item" }, text(item)) : choice(item)])];
      }));
    } else if (name === "cursor-pagination") content = [h("span", { class: "g-nav-ui-status", role: "status" }, props.description || "\u6309\u6E38\u6807\u6D4F\u89C8\u8BB0\u5F55"), h("div", { class: "g-nav-ui-actions" }, [h("button", { type: "button", class: "g-btn g-btn-outline", disabled: blocked.value || !props.hasPrevious, onClick: () => emit("previous") }, "\u4E0A\u4E00\u9875"), h("button", { type: "button", class: "g-btn g-btn-outline", disabled: blocked.value || !props.hasNext, onClick: () => emit("next") }, "\u4E0B\u4E00\u9875")])];
    else if (name === "load-more-navigation") content = [h("span", { role: "status" }, busy.value ? "\u6B63\u5728\u52A0\u8F7D\u2026" : props.hasNext ? props.description || "\u7EE7\u7EED\u6D4F\u89C8\u66F4\u591A\u5185\u5BB9" : "\u5DF2\u52A0\u8F7D\u5168\u90E8\u5185\u5BB9"), h("button", { type: "button", class: "g-btn g-btn-outline", disabled: blocked.value || !props.hasNext, onClick: () => emit("load-more") }, busy.value ? "\u52A0\u8F7D\u4E2D\u2026" : "\u52A0\u8F7D\u66F4\u591A")];
    else if (name === "back-navigation" || name === "mobile-top-navigation") content = [choice({ id: "back", label: "\u8FD4\u56DE", ...props.backHref ? { href: props.backHref } : {} }, { onClick: (e) => {
      if (blocked.value) e.preventDefault();
      else emit("back", e);
    } }), h("strong", { class: "g-nav-ui-title" }, props.title), h("div", { class: "g-nav-ui-actions" }, actionArea())];
    else if (name === "previous-next-navigation") content = [props.previous ? choice(props.previous) : h("span"), props.next ? choice(props.next) : null];
    else if (name === "back-to-top") content = h("button", { type: "button", class: "g-btn g-btn-primary", hidden: !scrollVisible.value, disabled: blocked.value, "aria-label": props.label === "\u5BFC\u822A" ? "\u8FD4\u56DE\u9876\u90E8" : props.label, onClick: () => scrollElement?.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }) }, slots.trigger?.() || "\u2191 \u8FD4\u56DE\u9876\u90E8");
    else if (name === "collapsible-navigation") content = [h("button", { type: "button", class: "g-nav-ui-collapse", disabled: blocked.value, "aria-expanded": String(!collapsed.value), "aria-controls": `${uid}-body`, onClick: () => {
      localCollapsed.value = !collapsed.value;
      emit("update:collapsed", localCollapsed.value);
    } }, [h("strong", props.title || props.label), collapsed.value ? "\uFF0B" : "\u2212"]), h("div", { id: `${uid}-body`, hidden: collapsed.value }, [search(), list(), slots.footer?.()])];
    else if (name === "navbar" || name === "sidebar") content = [h("header", { class: "g-nav-ui-heading" }, [slots.brand?.() || h("strong", { class: "g-nav-ui-brand" }, props.brand || props.title), h("button", { type: "button", class: "g-btn g-btn-ghost g-nav-ui-collapse", "aria-label": "\u5C55\u5F00\u6216\u6536\u8D77\u5BFC\u822A", "aria-expanded": String(!collapsed.value), "aria-controls": `${uid}-body`, disabled: blocked.value, onClick: () => {
      localCollapsed.value = !collapsed.value;
      emit("update:collapsed", localCollapsed.value);
    } }, "\u2630")]), h("div", { id: `${uid}-body`, class: "g-nav-ui-body", hidden: name === "navbar" && collapsed.value }, [search(), list()]), h("div", { class: "g-nav-ui-actions" }, actionArea()), slots.footer?.()];
    else content = [name === "toolbar" ? h("strong", { class: "g-nav-ui-title" }, props.title) : heading(), search(), list(), h("div", { class: "g-nav-ui-actions" }, actionArea()), slots.footer?.()];
    const rootTag = props.as || (["toolbar", "command-bar"].includes(name) ? "div" : tabNames.has(name) || menuNames.has(name) || ["command-palette", "drawer-navigation", "tree-navigation", "back-to-top"].includes(name) ? "div" : "nav");
    return h(rootTag, {
      ...attrs,
      ref: element,
      class: [definition.className, "g-nav-config", `g-nav-config--${name}`, `g-nav-size-${effectiveSize()}`, `g-nav-appearance-${effectiveAppearance()}`, { "g-nav-vertical": vertical.value, "is-disabled": props.disabled, "is-loading": busy.value, "is-collapsed": collapsed.value, "g-nav-sticky": props.sticky || variants().includes("sticky"), "g-nav-fixed": props.fixed }, ...values(props.variant).map((v) => `${definition.className}-${v}`), ...values(props.state).map((s) => s.startsWith("is-") ? s : `is-${s}`), attrs.class],
      "data-nav-variant":variants().join(" "),
      "data-nav-bordered":String(props.bordered&&!variants().some(v=>["borderless","transparent"].includes(v))),"data-nav-header":String(props.showHeader),"data-nav-tone":variants().some(v=>["dark","inverse"].includes(v))?"dark":undefined,
      style:{maxHeight:props.maxHeight?props.maxHeight+"px":"",overflow:props.maxHeight?"auto":"","--g-nav-popup-width":(explicit.has("popupWidth")?props.popupWidth:variants().includes("wide")?800:props.popupWidth)+"px","--g-nav-popup-height":props.popupMaxHeight+"px","--g-nav-ui-gap":props.itemGap+"px","--g-nav-indent":props.indent+"px"},
      "aria-label": props.label,
      "aria-busy": busy.value ? "true" : void 0,
      role: rootTag === 'div' ? (['toolbar','command-bar'].includes(name) ? 'toolbar' : 'group') : undefined,
      "data-nav-component": name,
      onKeydown: (e) => {
        if (e.key === "Escape" && isOpen.value && props.closeOnEscape) {
          e.preventDefault();
          e.stopPropagation();setOpen(false);
        }
      }
    }, [content, busy.value ? h("span", { class: "g-nav-ui-progress", role: "status" }, "\u5904\u7406\u4E2D\u2026") : null]);
  };
  render();
  mounted.forEach((fn) => fn());
  return {
    element: host,
    update(options2) {
      if(destroyed)return;
      if(options2.component&&options2.component!==props.component)throw new TypeError("Cannot change navigation component");
      const next=validateNavigation({...props,...cleanOptions(options2)},host.ownerDocument.baseURI);
      if(["items","value","disabled","loading","beforeChange"].some(key=>key in options2&&(key==="items"?JSON.stringify(next.items)!==JSON.stringify(props.items):next[key]!==props[key]))){cancelSelection?.();selectionVersion++;cancelSelection=undefined;pending.value=false;}
      const changedSelection=("items" in options2&&JSON.stringify(props.items)!==JSON.stringify(next.items))||("value" in options2&&props.value!==next.value);
      Object.entries(options2).forEach(([key,value])=>value==null?explicit.delete(key):explicit.add(key));
      Object.assign(props,next);
      if("pageSize" in options2)controlledPageSize=options2.pageSize!=null;
      if(changedSelection)watchers.forEach(fn=>fn());
      if("scrollTarget" in options2){scrollElement?.removeEventListener("scroll",onScroll);scrollElement=props.scrollTarget?document.getElementById(props.scrollTarget.replace(/^#/,""))||window:window;scrollElement.addEventListener("scroll",onScroll,{passive:true});onScroll();}
      schedule();
    },
    cancel(){cancelSelection?.();selectionVersion++;pending.value=false;cancelSelection=undefined;},
    select(value) {
      return select(value, void 0, [...all.value,...props.actions,props.previous,props.next].find((x) => x?.id === value));
    },
    open() {
      setOpen(true);
    },
    close() {
      setOpen(false);
    },
    focus() {
      host.querySelector('[data-nav-choice]:not(:disabled):not([aria-disabled="true"]),button:not(:disabled),input:not(:disabled)')?.focus();
    },
    destroy() {
      if(destroyed)return;destroyed = true;cancelSelection?.();selectionVersion++;
      cleanups.forEach((fn) => fn());
      host.replaceChildren(...originalNodes);syncModal();targetAttributes.forEach((value,node)=>{if(value===null)node.removeAttribute("tabindex");});
    }
  };
}
export {
  createNavigation,
  navigationDefaults
};
