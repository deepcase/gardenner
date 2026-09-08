import {createFoundation} from './foundation.js';
import {createConfiguredTree} from './tree.js';
import {createConfiguredTag as createTagController} from './tag.js';
import {createConfiguredTabs} from './tabs.js';
import {createSolutionController} from './solution.js';
import {createLegalController} from './legal.js';
import {createCommunicationController} from './communication.js';
import {createWorkflowController} from './workflow.js';
import {createDesktopController} from './desktop.js';
import {createEnterpriseController} from './enterprise.js';
import {createMarketingController} from './marketing.js';
import {createCmsController} from './cms.js';
import {createMobileController} from './mobile.js';
import {createAuthController} from './auth.js';
import {createCommerceController} from './commerce.js';
import {createMediaController} from './media.js';
import {createAIController} from './ai.js';
import {createHelpController} from './help.js';
import {createLayoutController} from './layout.js';
import {createContentController} from './content.js';
import {createInteractionController} from './interaction.js';
/** Gardenerim runtime v2.2.0 — framework-agnostic, accessible component behavior. */

import { formatGardenerimMessage, gardenerimLocaleNames, gardenerimLocales, resolveGardenerimLocale } from "./locales.js";
import { createTableController } from './table.js';
import { createNavigation, navigationDefaults } from './navigation.js';
import { createDashboardController } from './dashboard.js';
import { createDataDisplayController } from './data-display.js';

const instanceStores = new WeakMap();
const dropdownAncestorCounts = new WeakMap();
const registry = new Map();
let registrySelector = "";
let runtimeLocale = resolveGardenerimLocale([
  typeof document !== "undefined" ? document.documentElement.lang : null,
  ...(typeof navigator !== "undefined" ? navigator.languages || [navigator.language] : []),
]);
let runtimeMessageOverrides = {};
let observer;
let observedRoot = null;
const focusableSelector = [
  "a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])",
  "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])", "[contenteditable='true']"
].join(",");

const uid = (prefix = "g") => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const numeric = (value, fallback) => value !== "" && value != null && Number.isFinite(Number(value)) ? Number(value) : fallback;
const targetById = (value) => value ? document.getElementById(value.replace(/^#/, "")) : null;
const visibleFocusable = (container) => [...container.querySelectorAll(focusableSelector)].filter((item) => item.getClientRects().length > 0);
const isDisabled = (element) => !element || Boolean(element.disabled) || element.getAttribute("aria-disabled") === "true";

function focusAfterRemoval(target, source) {
  if (!target?.contains(document.activeElement)) return () => {};
  const focusables = [...document.querySelectorAll(focusableSelector)].filter((item) => !target.contains(item) && !item.closest("[hidden]") && !isDisabled(item));
  const relation = (item) => source.compareDocumentPosition(item);
  const next = focusables.find((item) => relation(item) & Node.DOCUMENT_POSITION_FOLLOWING);
  const previous = focusables.filter((item) => relation(item) & Node.DOCUMENT_POSITION_PRECEDING).at(-1);
  const fallback = next || previous;
  return () => queueMicrotask(() => fallback?.focus({ preventScroll: true }));
}

const message = (key, values) => formatGardenerimMessage(runtimeMessageOverrides[key] ?? gardenerimLocales[runtimeLocale]?.[key] ?? gardenerimLocales.en[key] ?? key, values);

function getConfiguration() {
  return Object.freeze({ locale: runtimeLocale, messages: Object.freeze({ ...runtimeMessageOverrides }), supportedLocales: gardenerimLocaleNames });
}

function configure(options = {}) {
  if (options.locale != null) runtimeLocale = resolveGardenerimLocale(options.locale);
  if (options.messages != null) {
    if (typeof options.messages !== "object" || Array.isArray(options.messages)) throw new TypeError("Gardenerim.configure messages must be an object.");
    runtimeMessageOverrides = { ...options.messages };
  }
  const root = options.root ?? (typeof document !== "undefined" ? document : null);
  if (root && options.refresh !== false) refresh(root);
  return getConfiguration();
}

function emit(element, name, detail = {}) {
  return element.dispatchEvent(new CustomEvent(`gardener:${name}`, { bubbles: true, cancelable: true, detail }));
}

function storeFor(element) {
  if (!instanceStores.has(element)) instanceStores.set(element, new Map());
  return instanceStores.get(element);
}

function lockScroll() {
  const root = document.documentElement;
  const count = Number(root.dataset.gScrollLocks || 0) + 1;
  root.dataset.gScrollLocks = String(count);
  if (count === 1) {
    root.dataset.gPreviousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
  }
}

function unlockScroll() {
  const root = document.documentElement;
  const count = Math.max(0, Number(root.dataset.gScrollLocks || 0) - 1);
  root.dataset.gScrollLocks = String(count);
  if (count === 0) {
    root.style.overflow = root.dataset.gPreviousOverflow || "";
    delete root.dataset.gPreviousOverflow;
  }
}

// Overlay state is shared by modal and anchored surfaces, including nested combinations.
// CSS presentation parameters: data-g-overlay-density, data-g-overlay-show-close.
const overlayStack = [];
const overlayInert = new Map();
const overlayFlag = (element, name, fallback = false) => element.hasAttribute(name) ? element.getAttribute(name) !== 'false' : fallback;
const overlayNumber = (element, name, fallback) => Math.max(0, numeric(element.getAttribute(name), fallback));
const overlayLength = value => /^\d+(\.\d+)?$/.test(value || '') ? value + 'px' : value;
function overlayAttributes(node, names) {
  const values = names.map(name => [name, node.getAttribute(name)]);
  return () => values.forEach(([name, value]) => value === null ? node.removeAttribute(name) : node.setAttribute(name, value));
}
function refreshOverlayInert() {
  overlayInert.forEach((value, node) => value ? node.setAttribute('inert', '') : node.removeAttribute('inert'));
  overlayInert.clear();
  const modal = overlayStack.findLast(item => item.modal);
  if (!modal) return;
  for (let node = modal.element; node?.parentElement; node = node.parentElement) {
    for (const sibling of node.parentElement.children) {
      if (sibling === node || ['SCRIPT','STYLE','LINK'].includes(sibling.tagName)) continue;
      overlayInert.set(sibling, sibling.hasAttribute('inert'));
      sibling.setAttribute('inert', '');
    }
    if (node.parentElement === document.body) break;
  }
}
function removeOverlayEntry(entry) {
  for (const child of [...overlayStack].reverse()) if (child !== entry && entry.element.contains(child.element)) child.dismiss?.();
  const index = overlayStack.indexOf(entry);
  if (index >= 0) overlayStack.splice(index, 1);
  refreshOverlayInert();
}
function createOverlay(element, type) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  const panel = element.querySelector(type === 'dialog' ? '.g-dialog' : type === 'mobile-sheet' ? '.g-mobile-sheet-panel' : '.g-drawer') || element;
  const initial = !element.hidden;
  const oldRole = panel.getAttribute('role'), oldModal = panel.getAttribute('aria-modal');
  const restorePanel = overlayAttributes(panel, ['style','tabindex','aria-busy','aria-labelledby']);
  const restoreRoot = overlayAttributes(element, ['style','popover','aria-hidden']);
  const titleNode = panel.querySelector('.g-dialog-title,.g-drawer-title,[data-g-overlay-title]');
  const restoreTitle = titleNode ? overlayAttributes(titleNode, ['id']) : () => {};
  let opened = false, disposed = false, source = null, frame, locked = false;
  const entry = {element, panel, modal:true, dismiss:()=>{emit(element,'change',{value:false,open:false,reason:'ancestor'});apply(false,'ancestor');}};
  const ownedButtons = new Set();
  let busy = false, requestedReason = "controlled", requestedTrigger;
  panel.tabIndex = panel.tabIndex < 0 ? -1 : panel.tabIndex;
  const modal = () => overlayFlag(element,'data-g-overlay-modal',true);
  const controlled = () => overlayFlag(element,'data-g-overlay-controlled');
  const disabled = () => overlayFlag(element,'data-g-overlay-disabled') || element.matches('.is-disabled,[aria-disabled="true"]');
  const top = () => overlayStack.at(-1) === entry;
  function setBusy(value) {
    busy = Boolean(value); panel.setAttribute('aria-busy',String(busy));
    for (const button of panel.querySelectorAll('[data-g-overlay-confirm],[data-g-overlay-cancel],[data-g-close]')) {
      if (busy && !button.disabled) { ownedButtons.add(button); button.disabled = true; }
      else if (!busy && ownedButtons.delete(button)) button.disabled = false;
    }
  }
  function semantics() {
    entry.modal = modal();
    panel.setAttribute('role',element.matches('.g-confirm-dialog-backdrop') ? 'alertdialog' : oldRole || 'dialog');
    panel.setAttribute('aria-modal',String(entry.modal));
    const title = panel.querySelector('.g-dialog-title,.g-drawer-title,[data-g-overlay-title]');
    if (!panel.hasAttribute('aria-label') && !panel.hasAttribute('aria-labelledby') && title) { title.id ||= uid('g-overlay-title'); panel.setAttribute('aria-labelledby',title.id); }
    for (const key of ['width','height']) {
      const value = element.getAttribute(key === 'width' ? 'data-g-overlay-width' : 'data-g-overlay-height');
      if (value) panel.style.setProperty('--g-'+(type === 'drawer'?'drawer':'dialog')+'-'+key,/^\d+(\.\d+)?$/.test(value)?value+'px':value);
      else panel.style.removeProperty('--g-'+(type === 'drawer'?'drawer':'dialog')+'-'+key);
    }
    const maxHeight = element.getAttribute('data-g-overlay-max-height');
    if(maxHeight)panel.style.setProperty('--g-overlay-max-height',overlayLength(maxHeight));else panel.style.removeProperty('--g-overlay-max-height');
  }
  function apply(value, reason = 'api', trigger) {
    if (disposed || value === opened) return;
    opened = value;
    if (value) {
      source = trigger instanceof HTMLElement ? trigger : document.activeElement;
      element.hidden = false; element.setAttribute('aria-hidden','false');
      overlayStack.push(entry); entry.modal = modal(); refreshOverlayInert();
      if (entry.modal && overlayFlag(element,'data-g-overlay-lock-scroll',true)) { lockScroll(); locked = true; }
      element.style.setProperty('--g-overlay-stack',String(1000 + overlayStack.length * 10));
      if (typeof element.showPopover === 'function' && overlayFlag(element,'data-g-overlay-top-layer',true)) { element.setAttribute('popover','manual'); try { element.showPopover(); } catch {} }
      element.classList.add('is-open');
      frame = requestAnimationFrame(() => {
        if (!opened || disposed || !top() || !overlayFlag(element,'data-g-overlay-autofocus',true)) return;
        let preferred;
        try { preferred = panel.querySelector(element.getAttribute('data-g-overlay-initial-focus') || '[autofocus]'); } catch {}
        (preferred || visibleFocusable(panel)[0] || panel).focus({preventScroll:true});
      });
      emit(element,'open',{source,reason});
    } else {
      setBusy(false);
      cancelAnimationFrame(frame); removeOverlayEntry(entry);
      if (locked) { unlockScroll(); locked = false; }
      try { element.hidePopover?.(); } catch {}
      element.hidden = true; element.classList.remove('is-open'); element.setAttribute('aria-hidden','true');
      if (overlayFlag(element,'data-g-overlay-restore-focus',true) && source?.isConnected && !source.closest('[inert],[hidden]')) source.focus?.({preventScroll:true});
      emit(element,'close',{reason});
    }
  }
  function request(value, reason = 'api', trigger) {
    if (disposed || value === opened || value && disabled() || !value && busy) return;
    if (value ? !emit(element,'beforeopen',{source:trigger,reason}) : !emit(element,'beforeclose',{reason})) return;
    requestedReason=reason; requestedTrigger=trigger;
    if (!emit(element,'change',{value,open:value,reason})) return;
    if (!controlled()) apply(value,reason,trigger);
  }
  function open(source) { request(true,'api',source); }
  function close(reason = 'api') { request(false,reason); }
  function complete(success = true, error = '') {
    if (disposed) return;
    setBusy(false);
    const output = panel.querySelector('[data-g-overlay-error]'); if (output) output.textContent = error;
    if (success) close('confirm'); else emit(element,'error',{reason:'confirm',message:error});
  }
  function onClick(event) {
    if (event.target.closest('[data-g-dialog],[data-g-drawer],[data-g-mobile-sheet],[data-g-popover]') !== element) return;
    const confirm = event.target.closest('[data-g-overlay-confirm]'), cancel = event.target.closest('[data-g-overlay-cancel]');
    if (confirm || cancel) {
      event.preventDefault(); if (busy || isDisabled(confirm || cancel)) return;
      const asynchronous = confirm && overlayFlag(element,'data-g-overlay-async');
      if (asynchronous) setBusy(true);
      if (!emit(element,'action',{action:confirm?'confirm':'cancel',source:confirm || cancel})) { if(asynchronous)setBusy(false);return; }
      if (!asynchronous) close(confirm?'confirm':'cancel');
    } else if (event.target.closest('[data-g-close]')) close('button');
    else if (event.target === element && overlayFlag(element,'data-g-overlay-mask-closable',element.dataset.gDismissible !== 'false') && top()) close('backdrop');
  }
  function keydown(event) {
    if (!opened) return;
    if (event.key === 'Escape' && top() && overlayFlag(element,'data-g-overlay-keyboard',element.dataset.gDismissible !== 'false')) { event.preventDefault(); event.stopImmediatePropagation(); close('escape'); }
    if (event.key !== 'Tab' || !entry.modal || overlayStack.findLast(item=>item.modal) !== entry) return;
    const items = visibleFocusable(panel).filter(node=>!node.closest('[inert],[hidden]'));
    const first = items[0] || panel, last = items.at(-1) || panel;
    if (!items.length || event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  }
  function focusin(event) {
    if (opened && entry.modal && overlayStack.findLast(item=>item.modal) === entry && !panel.contains(event.target)) (visibleFocusable(panel)[0] || panel).focus({preventScroll:true});
  }
  function sync(records = []) {
    if (disposed) return;
    semantics();
    if(records.some(record=>record.attributeName==='data-g-overlay-busy'))setBusy(overlayFlag(element,'data-g-overlay-busy'));
    if (disabled()) { if(opened)emit(element,'change',{value:false,open:false,reason:'disabled'});apply(false,'disabled'); }
    else if (controlled()) { apply(overlayFlag(element,'data-g-overlay-open'),requestedReason,requestedTrigger); requestedReason='controlled'; requestedTrigger=undefined; }
    if(opened){refreshOverlayInert();const shouldLock=entry.modal&&overlayFlag(element,'data-g-overlay-lock-scroll',true);if(shouldLock&&!locked){lockScroll();locked=true;}else if(!shouldLock&&locked){unlockScroll();locked=false;}}
  }
  const observer = new MutationObserver(sync);
  observer.observe(element,{attributes:true,attributeFilter:['class','aria-disabled','data-g-overlay-open','data-g-overlay-controlled','data-g-overlay-disabled','data-g-overlay-busy','data-g-overlay-width','data-g-overlay-height','data-g-overlay-max-height','data-g-overlay-modal','data-g-overlay-lock-scroll']});
  element.hidden = true; element.setAttribute('aria-hidden','true'); semantics();
  setBusy(overlayFlag(element,'data-g-overlay-busy'));
  element.addEventListener('click',onClick); document.addEventListener('keydown',keydown); document.addEventListener('focusin',focusin);
  if (controlled()) sync(); else if (initial) queueMicrotask(()=>request(true,'initial'));
  return {open,close,toggle:(source)=>opened?close('toggle'):open(source),isOpen:()=>opened,setBusy,complete,destroy:()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);if(locked)unlockScroll();locked=false;removeOverlayEntry(entry);try{element.hidePopover?.();}catch{}element.removeAttribute('popover');opened=false;element.hidden=true;element.classList.remove('is-open');setBusy(false);element.removeEventListener('click',onClick);document.removeEventListener('keydown',keydown);document.removeEventListener('focusin',focusin);if(oldRole===null)panel.removeAttribute('role');else panel.setAttribute('role',oldRole);if(oldModal===null)panel.removeAttribute('aria-modal');else panel.setAttribute('aria-modal',oldModal);restoreRoot();restorePanel();restoreTitle();}};
}

function createDropdown(element) {
  if(element.hasAttribute('data-g-auth-options'))return null;
  if(element.hasAttribute('data-g-commerce-options'))return null;
  if(element.hasAttribute('data-g-ai-options'))return null;
  const trigger = element.querySelector("[data-g-dropdown-trigger]");
  const menu = element.querySelector("[data-g-dropdown-menu]") || element.querySelector(".g-dropdown-menu");
  if (!trigger || !menu) return null;
  let search = "";
  let searchTimer;
  let autoAlign = false;
  let autoSide = false;
  let clippingAncestors = [];
  const startsOpen = !menu.hidden;
  const owns = (item) => {
    const owner = item.closest("[data-g-dropdown]");
    return owner === element || (item.matches("[data-g-dropdown-trigger]") && owner?.parentElement?.closest("[data-g-dropdown]") === element);
  };
  const allItems = () => [...menu.querySelectorAll(".g-menu-item, [role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio']")].filter(owns);
  const items = () => allItems().filter((item) => !isDisabled(item) && !item.closest("[hidden]"));
  const focusItem = (position = "first") => queueMicrotask(() => (position === "last" ? items().at(-1) : items()[0])?.focus());

  function revealClippingAncestors() {
    clippingAncestors = [];
    for (let ancestor = element.parentElement; ancestor && ancestor !== document.body; ancestor = ancestor.parentElement) {
      const style = window.getComputedStyle(ancestor);
      if (![style.overflow, style.overflowX, style.overflowY].some((value) => /^(auto|clip|hidden|scroll)$/.test(value))) continue;
      const count = (dropdownAncestorCounts.get(ancestor) || 0) + 1;
      dropdownAncestorCounts.set(ancestor, count);
      ancestor.classList.add("g-dropdown-open-ancestor");
      clippingAncestors.push(ancestor);
    }
  }

  function restoreClippingAncestors() {
    clippingAncestors.forEach((ancestor) => {
      const count = Math.max(0, (dropdownAncestorCounts.get(ancestor) || 1) - 1);
      if (count) dropdownAncestorCounts.set(ancestor, count);
      else {
        dropdownAncestorCounts.delete(ancestor);
        ancestor.classList.remove("g-dropdown-open-ancestor");
      }
    });
    clippingAncestors = [];
  }

  function normalize() {
    trigger.id ||= uid("g-dropdown-trigger");
    menu.id ||= uid("g-dropdown-menu");
    trigger.setAttribute("aria-haspopup", trigger.getAttribute("aria-haspopup") || "menu");
    trigger.setAttribute("aria-controls", menu.id);
    trigger.setAttribute("aria-expanded", menu.hidden ? "false" : "true");
    menu.setAttribute("role", menu.getAttribute("role") || "menu");
    if (!menu.hasAttribute("aria-label") && !menu.hasAttribute("aria-labelledby")) menu.setAttribute("aria-labelledby", trigger.id);
    allItems().forEach((item) => {
      item.setAttribute("role", item.getAttribute("role") || "menuitem");
      item.tabIndex = -1;
    });
  }

  function place() {
    if (menu.hidden || typeof window === "undefined") return;
    if (autoAlign) { delete menu.dataset.gAlign; autoAlign = false; }
    if (autoSide) { delete menu.dataset.gSide; autoSide = false; }
    const anchor = trigger.getBoundingClientRect();
    const popup = menu.getBoundingClientRect();
    if (!menu.hasAttribute("data-g-align") && popup.right > window.innerWidth && anchor.right - popup.width >= 0) {
      menu.dataset.gAlign = "end"; autoAlign = true;
    }
    if (!menu.hasAttribute("data-g-side") && popup.bottom > window.innerHeight && anchor.top - popup.height >= 0) {
      menu.dataset.gSide = "top"; autoSide = true;
    }
  }

  function open(focus = false) {
    if (!menu.hidden || isDisabled(trigger) || element.getAttribute("aria-busy") === "true") return;
    revealClippingAncestors();
    menu.hidden = false;
    element.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    place();
    if (focus) focusItem(focus);
    emit(element, "open", { trigger, menu });
  }
  function close(focus = false, reason = "programmatic") {
    if (menu.hidden) return;
    menu.hidden = true;
    element.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", keydown);
    window.removeEventListener("resize", place);
    window.removeEventListener("scroll", place, true);
    restoreClippingAncestors();
    if (focus) trigger.focus({ preventScroll: true });
    emit(element, "close", { trigger, menu, reason });
  }
  function outside(event) { if (!element.contains(event.target)) close(false, "outside"); }
  function triggerKeydown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (menu.hidden) open(event.key === "ArrowUp" ? "last" : "first");
      else focusItem(event.key === "ArrowUp" ? "last" : "first");
    } else if (event.key === "Escape" && !menu.hidden) {
      event.preventDefault(); close(true, "escape");
    }
  }
  function keydown(event) {
    if (menu.hidden) return;
    const activeOwner = event.target.closest?.("[data-g-dropdown].is-open");
    if (activeOwner && activeOwner !== element && event.key !== "Tab") return;
    if (event.key === "Escape") { event.preventDefault(); return close(true, "escape"); }
    if (event.key === "Tab") return close(false, "tab");
    if (!menu.contains(event.target)) return;
    const options = items();
    const index = options.indexOf(document.activeElement);
    if (event.key === "ArrowDown") { event.preventDefault(); (options[index + 1] || options[0])?.focus(); }
    else if (event.key === "ArrowUp") { event.preventDefault(); (options[index - 1] || options.at(-1))?.focus(); }
    else if (event.key === "Home") { event.preventDefault(); options[0]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); options.at(-1)?.focus(); }
    else if (event.key === "ArrowRight" && document.activeElement?.getAttribute("aria-haspopup") === "menu") { event.preventDefault(); document.activeElement.click(); }
    else if (event.key === "ArrowLeft" && element.parentElement?.closest("[data-g-dropdown]")) { event.preventDefault(); close(true, "submenu"); }
    else if ((event.key === "Enter" || event.key === " ") && document.activeElement?.matches("[role^='menuitem']") && !document.activeElement.matches("button, a[href]") ) { event.preventDefault(); document.activeElement.click(); }
    else if (event.key.length === 1 && /\S/.test(event.key)) {
      search += event.key.toLocaleLowerCase();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { search = ""; }, 500);
      options.find((item) => item.textContent.trim().toLocaleLowerCase().startsWith(search))?.focus();
    }
  }
  function toggle(event) { menu.hidden ? open(event ? "first" : false) : close(false, "toggle"); }
  function menuClick(event) {
    const item = event.target.closest(".g-menu-item, [role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio']");
    if (!item || !owns(item)) return;
    if (isDisabled(item)) { event.preventDefault(); return; }
    if (item.getAttribute("aria-haspopup") === "menu") return;
    const role = item.getAttribute("role");
    if (role === "menuitemcheckbox") item.setAttribute("aria-checked", item.getAttribute("aria-checked") === "true" ? "false" : "true");
    if (role === "menuitemradio") {
      const group = item.closest("[role='group']") || menu;
      [...group.querySelectorAll("[role='menuitemradio']")].filter(owns).forEach((option) => option.setAttribute("aria-checked", option === item ? "true" : "false"));
    }
    emit(element, "change", { item, value: item.dataset.gValue || item.textContent.trim() });
    if (item.dataset.gKeepOpen !== "true") close(true, "select");
  }
  menu.hidden = true;
  normalize();
  trigger.addEventListener("click", toggle);
  trigger.addEventListener("keydown", triggerKeydown);
  menu.addEventListener("click", menuClick);
  if (startsOpen) queueMicrotask(open);
  return { open, close, toggle, isOpen: () => !menu.hidden, destroy: () => { clearTimeout(searchTimer); trigger.removeEventListener("click", toggle); trigger.removeEventListener("keydown", triggerKeydown); menu.removeEventListener("click", menuClick); document.removeEventListener("pointerdown", outside, true); document.removeEventListener("keydown", keydown); window.removeEventListener("resize", place); window.removeEventListener("scroll", place, true); restoreClippingAncestors(); element.classList.remove("is-open"); menu.hidden = true; trigger.setAttribute("aria-expanded", "false"); } };
}

function createStepper(element) {
  const owns = (step) => step.closest("[data-g-stepper]") === element;
  const steps = () => [...element.querySelectorAll(".g-step, [data-g-step]")].filter(owns);
  const actionFor = (step) => step.querySelector(":scope > .g-step-action, :scope > [data-g-step-action]") || (step.matches("button, a[href], [tabindex]") ? step : null);
  const stepDisabled = (step) => {
    const action = actionFor(step);
    return isDisabled(step) || step.classList.contains("is-disabled") || Boolean(action && isDisabled(action));
  };
  const valueOf = (step, index = steps().indexOf(step)) => step?.dataset.gValue ?? String(index);
  const orientation = () => element.getAttribute("aria-orientation") || (element.classList.contains("g-stepper-vertical") ? "vertical" : "horizontal");
  const rtl = () => (element.closest("[dir]")?.getAttribute("dir") || document.documentElement.getAttribute("dir")) === "rtl";
  let currentIndex = -1;

  function resolve(value) {
    const items = steps();
    if (typeof value === "number") return items[value] || null;
    if (typeof value === "string") return items.find((step, index) => step.id === value || valueOf(step, index) === value) || null;
    const step = value?.closest?.(".g-step, [data-g-step]");
    return step && owns(step) ? step : null;
  }

  function normalize() {
    const items = steps();
    if (!element.matches("ol, ul") && !element.hasAttribute("role")) element.setAttribute("role", "list");
    let active = items.find((step) => step.getAttribute("aria-current") === "step" || step.classList.contains("is-active"));
    if (!active || stepDisabled(active)) active = items.find((step) => !stepDisabled(step)) || null;
    currentIndex = active ? items.indexOf(active) : -1;
    items.forEach((step, index) => {
      if (!step.matches("li") && !step.hasAttribute("role")) step.setAttribute("role", "listitem");
      const action = actionFor(step);
      const disabled = stepDisabled(step);
      step.classList.toggle("is-active", step === active);
      if (step === active) step.setAttribute("aria-current", "step"); else step.removeAttribute("aria-current");
      if (disabled) step.setAttribute("aria-disabled", "true");
      if (action) {
        if (disabled) action.setAttribute("aria-disabled", "true");
        action.tabIndex = !disabled && step === active ? 0 : -1;
      }
      const indicator = step.querySelector(":scope .g-step-indicator");
      if (indicator && !indicator.textContent.trim()) indicator.textContent = String(index + 1);
    });
    return items;
  }

  function select(value, focus = false, reason = "api") {
    const items = steps();
    const step = resolve(value);
    if (!step || stepDisabled(step)) return null;
    const previousIndex = currentIndex;
    const previousStep = items[previousIndex] || null;
    const index = items.indexOf(step);
    const autoComplete = element.hasAttribute("data-g-auto-complete") && element.dataset.gAutoComplete !== "false";
    items.forEach((item, itemIndex) => {
      const active = item === step;
      item.classList.toggle("is-active", active);
      if (active) item.setAttribute("aria-current", "step"); else item.removeAttribute("aria-current");
      if (autoComplete && !item.classList.contains("is-error") && !stepDisabled(item)) item.classList.toggle("is-complete", itemIndex < index);
      const action = actionFor(item);
      if (action) action.tabIndex = active && !stepDisabled(item) ? 0 : -1;
    });
    currentIndex = index;
    if (focus) (actionFor(step) || step).focus({ preventScroll: true });
    if (previousStep !== step) emit(element, "stepchange", { step, index, value: valueOf(step, index), previousStep, previousIndex, reason });
    return step;
  }

  function move(action, key) {
    const available = steps().filter((step) => actionFor(step) && !stepDisabled(step));
    const current = available.findIndex((step) => actionFor(step) === action);
    if (!available.length) return;
    let next;
    if (key === "Home") next = available[0];
    else if (key === "End") next = available.at(-1);
    else {
      const backwards = key === "ArrowUp" || (key === "ArrowLeft" && !rtl()) || (key === "ArrowRight" && rtl());
      next = available[(current + (backwards ? -1 : 1) + available.length) % available.length];
    }
    const target = actionFor(next);
    steps().forEach((step) => { const item = actionFor(step); if (item) item.tabIndex = item === target ? 0 : -1; });
    target?.focus({ preventScroll: true });
  }

  function click(event) {
    const action = event.target.closest(".g-step-action, [data-g-step-action]");
    const step = action?.closest(".g-step, [data-g-step]");
    if (!step || !owns(step)) return;
    if (stepDisabled(step)) { event.preventDefault(); return; }
    select(step, true, "pointer");
  }

  function keydown(event) {
    const action = event.target.closest(".g-step-action, [data-g-step-action]");
    const step = action?.closest(".g-step, [data-g-step]");
    if (!step || !owns(step)) return;
    const directionalKeys = orientation() === "horizontal" ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
    if ([...directionalKeys, "Home", "End"].includes(event.key)) { event.preventDefault(); move(action, event.key); }
    else if ((event.key === "Enter" || event.key === " ") && !action.matches("button, a[href]")) { event.preventDefault(); select(step, true, "keyboard"); }
  }

  function refresh() { normalize(); return current(); }
  function current() { return steps()[currentIndex] || null; }
  function next(focus = true) { const items = steps(); return select(items.find((step, index) => index > currentIndex && !stepDisabled(step)), focus, "next"); }
  function previous(focus = true) { const items = steps(); return select(items.filter((step, index) => index < currentIndex && !stepDisabled(step)).at(-1), focus, "previous"); }

  normalize();
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  return { current, select, next, previous, refresh, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createTag(element){const c=createTagController(element,{emit,init,destroy});if(!c)return null;return {check:c.check,close:c.close,setOptions:c.setOptions,getState:c.getState,refresh:c.refresh,destroy:c.destroy};}

function createTabs(element) {
  if(element.hasAttribute('data-g-tabs-options'))return createConfiguredTabs(element,{emit,init,destroy,uid});
  if(element.hasAttribute('data-g-mobile-options'))return null;
  if(element.hasAttribute('data-g-ai-options'))return null;
  const owns = (item) => item.closest("[data-g-tabs]") === element;
  const tabList = () => [...element.querySelectorAll("[role='tablist'], .g-tab-list")].find(owns) || (element.matches("[role='tablist']") ? element : null);
  const tabs = () => [...element.querySelectorAll("[role='tab'], .g-tab")].filter((item) => owns(item) && !item.classList.contains("g-tab-close"));
  const panels = () => [...element.querySelectorAll("[role='tabpanel'], .g-tab-panel")].filter(owns);
  const orientation = () => tabList()?.getAttribute("aria-orientation") || element.getAttribute("aria-orientation") || (element.classList.contains("g-tabs-vertical") ? "vertical" : "horizontal");
  const manual = () => (tabList()?.dataset.gActivation || element.dataset.gActivation) === "manual";
  const rtl = () => (element.closest("[dir]")?.getAttribute("dir") || document.documentElement.getAttribute("dir")) === "rtl";
  const panelFor = (tab) => {
    const panel = targetById(tab?.getAttribute("aria-controls"));
    return panel && owns(panel) ? panel : null;
  };
  function normalize() {
    const list = tabList();
    if (list) {
      list.setAttribute("role", "tablist");
      if (orientation() === "vertical") list.setAttribute("aria-orientation", "vertical");
    }
    const items = tabs();
    const targets = panels();
    items.forEach((tab, index) => {
      tab.setAttribute("role", "tab");
      const panel = panelFor(tab) || targets[index];
      if (!panel) return;
      panel.id ||= uid("g-tab-panel");
      tab.id ||= uid("g-tab");
      tab.setAttribute("aria-controls", panel.id);
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", panel.getAttribute("aria-labelledby") || tab.id);
    });
    return items;
  }
  const resolveTab = (value) => {
    const items = tabs();
    if (typeof value === "number") return items[value] || null;
    if (typeof value === "string") return items.find((item) => item.id === value || item.getAttribute("aria-controls") === value.replace(/^#/, "")) || null;
    return items.includes(value) ? value : null;
  };
  function select(value, focus = false) {
    const tab = resolveTab(value);
    if (isDisabled(tab)) return null;
    const items = normalize();
    const previousTab = items.find((item) => item.getAttribute("aria-selected") === "true") || null;
    items.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = panelFor(item);
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
    const panel = panelFor(tab);
    element.dataset.gState = "active";
    if (previousTab !== tab) emit(element, "change", { tab, panel, previousTab, previousPanel: panelFor(previousTab) });
    return tab;
  }
  function moveFocus(tab) {
    tabs().forEach((item) => { item.tabIndex = item === tab ? 0 : -1; });
    tab.focus();
  }
  function click(event) {
    if (event.target.closest(".g-tab-close")) return;
    const tab = event.target.closest("[role='tab'], .g-tab");
    if (tab && owns(tab)) select(tab);
  }
  function keydown(event) {
    const items = normalize();
    const currentTab = event.target.closest("[role='tab'], .g-tab");
    const current = items.indexOf(currentTab);
    if (current < 0) return;
    if ((event.key === "Enter" || event.key === " ") && manual()) {
      event.preventDefault();
      select(currentTab, true);
      return;
    }
    const vertical = orientation() === "vertical";
    const forward = vertical ? "ArrowDown" : rtl() ? "ArrowLeft" : "ArrowRight";
    const backward = vertical ? "ArrowUp" : rtl() ? "ArrowRight" : "ArrowLeft";
    const enabled = items.filter((tab) => !isDisabled(tab));
    if (!enabled.length) return;
    const enabledIndex = enabled.indexOf(currentTab);
    let next;
    if (event.key === forward) next = enabled[(enabledIndex + 1 + enabled.length) % enabled.length];
    else if (event.key === backward) next = enabled[(enabledIndex - 1 + enabled.length) % enabled.length];
    else if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled.at(-1);
    else return;
    event.preventDefault();
    if (manual()) moveFocus(next);
    else select(next, true);
  }
  const initialTabs = normalize();
  if (!initialTabs.length) return null;
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  select(initialTabs.find((tab) => tab.getAttribute("aria-selected") === "true" && !isDisabled(tab)) || initialTabs.find((tab) => !isDisabled(tab)));
  return { select, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

const configuredCollapseRoots=new WeakSet();
function createConfiguredCollapse(element) {
  configuredCollapseRoots.add(element);
  const doc=element.ownerDocument,win=doc.defaultView,original=[...element.childNodes],originalClass=element.className;
  const rows=new Map(),rootAttrs=new Map();let options=null,expanded=new Set(),disposed=false,initialized=false,observer,emptyNode;
  const owns=n=>n?.closest('[data-g-accordion]')===element;
  const make=(tag,cls,text)=>{const n=doc.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=String(text);return n;};
  const attr=(k,v)=>{if(!rootAttrs.has(k))rootAttrs.set(k,element.getAttribute(k));if(v==null)element.removeAttribute(k);else element.setAttribute(k,String(v));};
  function parse(){const o=JSON.parse(element.getAttribute('data-g-disclosure-options'));if(!o||!Array.isArray(o.items)||o.items.length>500)throw TypeError('Collapse options require an items array (maximum 500)');
    const keys=new Set();for(const item of o.items){if(!item||!['string','number'].includes(typeof item.key)||!String(item.key)||typeof item.key==='number'&&!Number.isFinite(item.key)||keys.has(String(item.key)))throw TypeError('Collapse items require unique string/number keys');keys.add(String(item.key));for(const k of ['disabled','showExpandIcon','destroyOnHide','lazy'])if(item[k]!=null&&typeof item[k]!=='boolean')throw TypeError('Invalid collapse item '+k);if(item.expandIconPosition!=null&&!['left','right'].includes(item.expandIconPosition))throw TypeError('Invalid item icon position');}
    for(const k of ['accordion','bordered','disabled','showExpandIcon','destroyOnHide','lazy','keyboard','collapsible','animated'])if(o[k]!=null&&typeof o[k]!=='boolean')throw TypeError('Invalid collapse '+k);
    for(const k of ['activeKey','defaultActiveKey'])if(o[k]!=null&&(!Array.isArray(o[k])||o[k].some(v=>!['string','number'].includes(typeof v))))throw TypeError('Invalid '+k);
    if(o.expandIconPosition!=null&&!['left','right'].includes(o.expandIconPosition))throw TypeError('Invalid icon position');if(o.size!=null&&!['small','medium','large'].includes(o.size))throw TypeError('Invalid size');if(o.duration!=null&&(!Number.isFinite(o.duration)||o.duration<0||o.duration>2000))throw TypeError('Invalid duration');
    return {accordion:false,bordered:true,disabled:false,showExpandIcon:true,expandIconPosition:'left',destroyOnHide:false,lazy:true,keyboard:true,collapsible:true,animated:true,duration:200,size:'medium',...o};
  }
  const controlled=()=>options.activeKey!=null||element.hasAttribute('data-g-disclosure-value');
  const activeKeys=set=>options.items.filter(i=>set.has(String(i.key))).map(i=>i.key);
  function normalize(keys){const available=new Set(options.items.map(i=>String(i.key))),next=new Set(keys.map(String).filter(k=>available.has(k)));if(options.accordion&&next.size>1)return new Set([next.values().next().value]);if(!next.size&&!options.collapsible){const first=options.items.find(i=>!i.disabled);if(first)next.add(String(first.key));}return next;}
  function template(id){const source=typeof id==='string'?doc.getElementById(id):null;return source?.tagName==='TEMPLATE'?source.content.cloneNode(true):null;}
  function mount(row){if(row.mounted)return;const body=make('div','g-collapse-content');const content=template(row.item.contentTemplate);if(content)body.append(content);else if(row.item.content!=null)body.append(make('div','g-collapse-text',row.item.content));row.panel.append(body);row.mounted=true;init(row.panel);}
  function unmount(row){if(!row.mounted)return;destroy(row.panel);row.panel.replaceChildren();row.mounted=false;}
  function draw(){for(const [key,row]of rows){const open=expanded.has(key),was=row.open,disabled=options.disabled||!!row.item.disabled;row.trigger.disabled=disabled;row.panel.inert=!open;row.trigger.setAttribute('aria-expanded',String(open));row.shell.classList.toggle('is-expanded',open);row.shell.classList.toggle('is-disabled',disabled);row.icon.hidden=!(row.item.showExpandIcon??options.showExpandIcon);row.shell.dataset.collapseIcon=row.item.expandIconPosition||options.expandIconPosition;
      const custom=row.item.expandIcon??options.expandIcon;row.icon.textContent=typeof custom==='string'?custom:custom?.[open?'expanded':'collapsed']??'›';row.icon.dataset.custom=String(custom!=null);
      if(!open&&row.panel.contains(doc.activeElement))row.trigger.focus({preventScroll:true});
      if(open||!(row.item.lazy??options.lazy))mount(row);
      if(was===open)continue;row.open=open;row.animation?.cancel();row.animation=null;row.panel.hidden=false;
      const finish=()=>{if(disposed||row.open!==open)return;row.panel.hidden=!open;if(!open&&(row.item.destroyOnHide??options.destroyOnHide))unmount(row);};
      if(was!=null&&options.animated&&options.duration>0&&row.panel.animate&&!win.matchMedia('(prefers-reduced-motion: reduce)').matches){const height=row.panel.scrollHeight;row.animation=row.panel.animate([{height:open?'0px':height+'px'},{height:open?height+'px':'0px'}],{duration:options.duration,easing:'cubic-bezier(0.34, 0.69, 0.1, 1)'});row.animation.onfinish=finish;}else finish();
    }
    element.classList.toggle('is-expanded',expanded.size>0);element.classList.toggle('is-collapsed',expanded.size===0);
  }
  function refresh(){if(disposed)return false;let next;try{next=parse();}catch(error){emit(element,'error',{reason:'configuration',message:error.message});return false;}let requested;try{requested=element.hasAttribute('data-g-disclosure-value')?JSON.parse(element.dataset.gDisclosureValue):next.activeKey??(initialized?[...expanded]:next.defaultActiveKey??[]);if(!Array.isArray(requested))throw TypeError('Collapse value must be an array');}catch(error){emit(element,'error',{reason:'configuration',message:error.message});return false;}
    options=next;let removedFocus=false;if(!initialized)element.replaceChildren();if(!element.hasAttribute('tabindex'))attr('tabindex','-1');element.classList.add('g-collapse-managed');attr('data-collapse-bordered',String(options.bordered));attr('data-collapse-size',options.size);attr('aria-disabled',options.disabled?'true':null);
    for(const [key,row]of rows)if(!options.items.some(i=>String(i.key)===key)){row.animation?.cancel();if(row.shell.contains(doc.activeElement))removedFocus=true;unmount(row);destroy(row.extra);row.shell.remove();rows.delete(key);}
    for(const [position,item] of options.items.entries()){const key=String(item.key);let row=rows.get(key);if(!row){const shell=make('section','g-collapse-item'),header=make('div','g-collapse-header'),trigger=make('button','g-collapse-trigger'),icon=make('span','g-collapse-icon'),title=make('span','g-collapse-title'),extra=make('div','g-collapse-extra'),panel=make('div','g-collapse-content-panel');trigger.type='button';trigger.id=uid('g-collapse-trigger');trigger.dataset.gDisclosureKey=key;panel.id=uid('g-collapse-content');trigger.setAttribute('aria-controls',panel.id);panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',trigger.id);icon.setAttribute('aria-hidden','true');trigger.append(icon,title);header.append(trigger,extra);shell.append(header,panel);row={shell,trigger,icon,title,extra,panel,mounted:false,open:null,signature:null};rows.set(key,row);}
      const signature=JSON.stringify([item.content,item.contentTemplate]);if(row.signature!=null&&row.signature!==signature)unmount(row);row.signature=signature;row.item=item;row.title.textContent=String(item.header??item.key);if(options.label){row.panel.setAttribute('aria-label',options.label+' · '+String(item.header??item.key));row.panel.removeAttribute('aria-labelledby');}else{row.panel.removeAttribute('aria-label');row.panel.setAttribute('aria-labelledby',row.trigger.id);}
      const extraSignature=JSON.stringify([item.extra,item.extraTemplate,options.disabled,item.disabled]);if(row.extraSignature!==extraSignature){destroy(row.extra);row.extra.replaceChildren();row.extraNeedsInit=true;const custom=template(item.extraTemplate);if(custom)row.extra.append(custom);else if(item.extra!=null){const action=typeof item.extra==='object'?item.extra:null;if(action?.action){const b=make('button','g-collapse-extra-action',action.label??action.action);b.type='button';b.dataset.collapseAction=String(action.action);b.disabled=options.disabled||!!action.disabled;row.extra.append(b);}else row.extra.textContent=String(action?.label??item.extra);}row.extraSignature=extraSignature;}
      row.extra.hidden=!row.extra.childNodes.length;if(element.children[position]!==row.shell)element.insertBefore(row.shell,element.children[position]||null);if(row.extraNeedsInit){init(row.extra);row.extraNeedsInit=false;}
    }
    emptyNode?.remove();if(!options.items.length){emptyNode=make('p','g-collapse-empty',options.emptyText??'No panels');element.append(emptyNode);}expanded=normalize(requested);initialized=true;draw();if(removedFocus)([...rows.values()].find(r=>!r.trigger.disabled)?.trigger||element).focus({preventScroll:true});return true;
  }
  function resolve(target){if(target?.nodeType)return [...rows.values()].find(r=>r.trigger===target);const byKey=rows.get(String(target));return byKey??(typeof target==='number'?[...rows.values()][target]:null);}
  function set(target,open,reason='api'){if(disposed||!options)return false;const row=resolve(target??0);if(!row||options.disabled||row.item.disabled)return false;const key=String(row.item.key);if(expanded.has(key)===open||(!open&&!options.collapsible&&expanded.size===1))return false;const next=new Set(expanded);if(open){if(options.accordion)next.clear();next.add(key);}else next.delete(key);const detail={trigger:row.trigger,expanded:open,keys:[...next],activeKey:activeKeys(next),reason,controlled:controlled()};const allowed=open?emit(element,'beforeopen',{...detail}):emit(element,'beforeclose',{...detail});if(!allowed||disposed)return false;if(!controlled()){expanded=next;draw();}emit(element,'change',{...detail,activeKey:activeKeys(next)});return true;}
  const toggle=(target,reason='api')=>{const row=resolve(target??0);return row?set(row.trigger,!expanded.has(String(row.item.key)),reason):false;};
  function click(event){if(!owns(event.target))return;const extra=event.target.closest('[data-collapse-action]');if(extra){if(extra.disabled||options.disabled)return;const row=[...rows.values()].find(r=>r.extra.contains(extra));if(row)emit(element,'action',{key:row.item.key,action:extra.dataset.collapseAction});return;}const trigger=event.target.closest('.g-collapse-trigger');if(owns(trigger))toggle(trigger,'click');}
  function keydown(event){const trigger=event.target.closest('.g-collapse-trigger');if(!owns(trigger)||!options.keyboard||options.disabled)return;if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;const enabled=[...rows.values()].map(r=>r.trigger).filter(t=>!t.disabled),i=enabled.indexOf(trigger);if(i<0)return;event.preventDefault();enabled[event.key==='Home'?0:event.key==='End'?enabled.length-1:(i+(event.key==='ArrowDown'?1:-1)+enabled.length)%enabled.length]?.focus();}
  function dispose(){if(disposed)return;disposed=true;configuredCollapseRoots.delete(element);observer?.disconnect();element.removeEventListener('click',click);element.removeEventListener('keydown',keydown);for(const row of rows.values()){row.animation?.cancel();unmount(row);destroy(row.extra);}rows.clear();element.replaceChildren(...original);element.className=originalClass;for(const[k,v]of rootAttrs)v==null?element.removeAttribute(k):element.setAttribute(k,v);}
  refresh();element.addEventListener('click',click);element.addEventListener('keydown',keydown);observer=new win.MutationObserver(()=>refresh());observer.observe(element,{attributes:true,attributeFilter:['data-g-disclosure-options','data-g-disclosure-value']});
  return {toggle,open:(target=0)=>set(target,true),close:(target=0)=>set(target,false),value:()=>[...expanded],refresh,destroy:dispose};
}

function createAccordion(element) {
  if(element.hasAttribute('data-g-disclosure-options'))return createConfiguredCollapse(element);
  if(element.hasAttribute('data-g-ai-options'))return null;
  if(element.hasAttribute('data-g-help-options'))return null;
  const selector = '.g-accordion-trigger, .g-disclosure-trigger, .g-faq-question, .g-thinking-trigger, [data-g-tool-call-toggle]';
  const owns = node => node?.closest('[data-g-accordion]') === element;
  const triggers = () => [...element.querySelectorAll(selector)].filter(owns);
  const panelFor = trigger => {
    const id = trigger?.getAttribute('aria-controls');
    const explicit = id && targetById(id);
    if (explicit && element.contains(explicit) && owns(explicit)) return explicit;
    return [...(trigger?.closest('.g-accordion-item, .g-collapse-panel, .g-read-more') || element).querySelectorAll('.g-accordion-panel, .g-disclosure-panel')].find(owns) || null;
  };
  const keyFor = trigger => trigger?.dataset.gDisclosureKey || panelFor(trigger)?.id || trigger?.id;
  const disabled = trigger => element.classList.contains('is-disabled') || isDisabled(element) || isDisabled(trigger) || trigger?.closest('.g-accordion-item')?.getAttribute('aria-disabled') === 'true';
  const multiple = () => (element.hasAttribute('data-g-disclosure-multiple') && element.dataset.gDisclosureMultiple !== 'false') || (element.dataset.gDisclosureMultiple == null && element.dataset.gMultiple === 'true');
  const collapsible = () => element.dataset.gDisclosureCollapsible !== 'false';
  const controlled = () => element.hasAttribute('data-g-disclosure-value');
  let expanded = new Set(), disposed = false;
  const parse = value => { try { const result = JSON.parse(value); return Array.isArray(result) ? result.map(String) : result == null ? [] : [String(result)]; } catch { return value ? value.split(',').map(s => s.trim()).filter(Boolean) : []; } };
  function normalize(keys) {
    const available = triggers().filter(t => panelFor(t)).map(keyFor), next = new Set(keys.filter(key => available.includes(key)));
    if (!multiple() && next.size > 1) return new Set([next.values().next().value]);
    if (!next.size && !collapsible()) { const first = triggers().find(t => !disabled(t) && panelFor(t)); if (first) next.add(keyFor(first)); }
    return next;
  }
  function render(next) {
    expanded = normalize([...next]);
    for (const trigger of triggers()) {
      const panel = panelFor(trigger); if (!panel) continue;
      const open = expanded.has(keyFor(trigger));
      trigger.setAttribute('aria-expanded', String(open));
      if (!open && panel.contains(document.activeElement)) trigger.focus({preventScroll:true});
      panel.hidden = !open;
      const item = trigger.closest('.g-accordion-item'); if (owns(item)) item.classList.toggle('is-expanded', open);
      const label = trigger.querySelector('[data-g-disclosure-label]');
      if (label) label.textContent = open ? (element.dataset.gDisclosureCollapseLabel || message('disclosure.less')) : (element.dataset.gDisclosureExpandLabel || message('disclosure.more'));
    }
    element.classList.toggle('is-expanded', expanded.size > 0);
    element.classList.toggle('is-collapsed', expanded.size === 0);
    const preview = [...element.querySelectorAll('.g-read-more-preview')].find(owns);
    if (preview) {
      preview.hidden = expanded.size > 0;
      preview.style.setProperty('--g-read-more-lines', String(Math.max(1, Math.min(20, numeric(element.dataset.gDisclosureLines, 3)))));
      if (preview.dataset.gDisclosureGenerated === 'true' || !preview.textContent.trim()) {
        const content = panelFor(triggers()[0])?.textContent.trim() || '';
        const length = Math.max(20, Math.min(10000, numeric(element.dataset.gDisclosureLength, 180)));
        preview.textContent = [...content].slice(0, length).join('') + ([...content].length > length ? '…' : '');
        preview.dataset.gDisclosureGenerated = 'true';
      }
    }
  }
  function refresh(initial = false) {
    for (const trigger of triggers()) {
      const panel = panelFor(trigger); if (!panel) continue;
      trigger.id ||= uid('g-disclosure-trigger'); panel.id ||= uid('g-disclosure-panel');
      trigger.setAttribute('aria-controls', panel.id);
      if (trigger.tagName === 'BUTTON') trigger.type = 'button';
      else { trigger.setAttribute('role','button'); if (!trigger.hasAttribute('tabindex')) trigger.tabIndex = 0; }
      panel.setAttribute('role', panel.getAttribute('role') || 'region');
      if (!panel.hasAttribute('aria-label') && !panel.hasAttribute('aria-labelledby')) panel.setAttribute('aria-labelledby', trigger.id);
    }
    const initialKeys = element.dataset.gDisclosureDefaultValue != null ? parse(element.dataset.gDisclosureDefaultValue) : element.classList.contains('is-collapsed') ? [] : element.classList.contains('is-expanded') ? triggers().slice(0,1).map(keyFor) : triggers().filter(t => t.getAttribute('aria-expanded') === 'true').map(keyFor);
    render(new Set(controlled() ? parse(element.dataset.gDisclosureValue) : initial ? initialKeys : [...expanded]));
  }
  const resolveTrigger = target => typeof target === 'number' ? triggers()[target] : typeof target === 'string' ? triggers().find(t => keyFor(t) === target || t.id === target) : target;
  function set(target, open, reason = 'api') {
    const trigger = resolveTrigger(target); if (!owns(trigger) || disabled(trigger) || !panelFor(trigger)) return false;
    const key = keyFor(trigger); if (expanded.has(key) === open || (!open && !collapsible() && expanded.size === 1)) return false;
    const next = new Set(expanded); if (open) { if (!multiple()) next.clear(); next.add(key); } else next.delete(key);
    const allowed = open ? emit(element, 'beforeopen', {trigger, expanded:open, keys:[...next], reason, controlled:controlled()}) : emit(element, 'beforeclose', {trigger, expanded:open, keys:[...next], reason, controlled:controlled()});
    if (!allowed) return false;
    if (!controlled()) render(next);
    emit(element, 'change', {trigger, expanded:open, keys:[...next], reason, controlled:controlled()}); return true;
  }
  function toggle(target, reason = 'api') { const trigger = resolveTrigger(target); return set(trigger, !expanded.has(keyFor(trigger)), reason); }
  function click(event) { const trigger = event.target.closest(selector); if (!owns(trigger)) return; if (event.target.closest('a,input,select,textarea') && event.target !== trigger) return; event.preventDefault(); toggle(trigger, 'click'); }
  function keydown(event) {
    const trigger = event.target.closest(selector); if (!owns(trigger) || disabled(trigger)) return;
    if (['Enter',' '].includes(event.key) && trigger.tagName !== 'BUTTON') { event.preventDefault(); toggle(trigger,'keyboard'); return; }
    if (!['ArrowDown','ArrowUp','Home','End'].includes(event.key) || element.dataset.gDisclosureKeyboard === 'false') return;
    const enabled = triggers().filter(t => !disabled(t)), index = enabled.indexOf(trigger); if (index < 0) return;
    event.preventDefault(); (event.key === 'Home' ? enabled[0] : event.key === 'End' ? enabled.at(-1) : enabled[(index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length])?.focus();
  }
  const observer = new element.ownerDocument.defaultView.MutationObserver(records => {
    if (disposed) return;
    const contentChanged = records.some(r => {
      const node = r.target.nodeType === 1 ? r.target : r.target.parentElement;
      return r.type !== 'attributes' && owns(node?.closest('.g-accordion-panel,.g-disclosure-panel'));
    });
    if (contentChanged || records.some(r => r.type === 'childList' && ([...r.addedNodes,...r.removedNodes].some(n => n.nodeType === 1 && (n.matches?.(selector+', .g-accordion-item, .g-accordion-panel, .g-disclosure-panel') || n.querySelector?.(selector))))) || records.some(r => r.type === 'attributes' && r.target === element)) refresh();
  });
  refresh(true); element.addEventListener('click',click); element.addEventListener('keydown',keydown);
  observer.observe(element,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['data-g-disclosure-value','data-g-disclosure-multiple','data-g-multiple','data-g-disclosure-collapsible','data-g-disclosure-lines','data-g-disclosure-length','data-g-disclosure-expand-label','data-g-disclosure-collapse-label']});
  return { toggle, open:(target=0)=>set(target,true), close:(target=0)=>set(target,false), value:()=>[...expanded], refresh, destroy:()=>{disposed=true;observer.disconnect();element.removeEventListener('click',click);element.removeEventListener('keydown',keydown);} };
}

function createAutoResize(element) {
  if (!element.hasAttribute("rows") && element.classList.contains("g-composer-input")) element.rows = 1;
  const original={height:element.style.height,overflow:element.style.overflowY,capped:element.classList.contains("is-max-rows")};let disposed=false;
  const finite=(value,fallback)=>Number.isFinite(Number(value))&&Number(value)>0?Number(value):fallback;
  function resize() {
    if(disposed)return;
    const computed = window.getComputedStyle(element);
    const lineHeight = Number.parseFloat(computed.lineHeight) || Number.parseFloat(computed.fontSize) * 1.5 || 24;
    const padding = (Number.parseFloat(computed.paddingTop) || 0) + (Number.parseFloat(computed.paddingBottom) || 0);
    const border = (Number.parseFloat(computed.borderTopWidth) || 0) + (Number.parseFloat(computed.borderBottomWidth) || 0);
    const minRows = finite(element.dataset.gMinRows || element.getAttribute("rows"),1);
    const maxRows = element.hasAttribute("data-g-max-rows")?Math.max(minRows,finite(element.dataset.gMaxRows,minRows)):0;
    const minimum = Number(element.dataset.gMinHeight || 0) || (lineHeight * minRows + padding + border);
    const configuredMaximum = Number(element.dataset.gMaxHeight || 0);
    const maximum = configuredMaximum || (maxRows ? lineHeight * maxRows + padding + border : 224);
    element.style.height = "auto";
    const next = Math.max(minimum, Math.min(element.scrollHeight, maximum));
    element.style.height = `${next}px`;
    const capped = element.scrollHeight > maximum + 1;
    element.classList.toggle("is-max-rows", capped);
    element.style.overflowY = capped ? "auto" : "hidden";
  }
  element.addEventListener("input", resize);
  const observer=new MutationObserver(resize);observer.observe(element,{attributes:true,attributeFilter:["rows","data-g-min-rows","data-g-max-rows","data-g-min-height","data-g-max-height"]});
  const reset=()=>setTimeout(resize,0);const form=element.form;form?.addEventListener("reset",reset);
  resize();
  return { resize, destroy: () => {disposed=true;element.removeEventListener("input", resize);observer.disconnect();form?.removeEventListener("reset",reset);element.style.height=original.height;element.style.overflowY=original.overflow;element.classList.toggle("is-max-rows",original.capped);} };
}

function createPasswordToggle(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  if(element.hasAttribute('data-g-auth-options'))return null;
  const input = element.querySelector("input[type='password'], input[type='text'], input");
  const button = element.querySelector("[data-g-password-button]");
  if (!input || !button) return null;
  const showLabel = button.dataset.gShowLabel || message("password.show");
  const hideLabel = button.dataset.gHideLabel || message("password.hide");
  const capsLock = element.querySelector("[data-g-caps-lock], .g-password-field-caps");
  const configuredVisibility = element.dataset.gVisibility;
  const defaultVisible = element.hasAttribute("data-g-default-visible") && element.dataset.gDefaultVisible !== "false";
  if ((configuredVisibility != null && configuredVisibility !== "false") || (configuredVisibility == null && defaultVisible)) input.type = "text";
  if (configuredVisibility === "false") input.type = "password";
  function update(reason = "sync") {
    const visible = input.type === "text";
    element.classList.toggle("is-visible", visible);
    element.classList.toggle("is-hidden", !visible);
    element.dataset.gVisibility = String(visible);
    button.setAttribute("aria-pressed", String(visible));
    button.setAttribute("aria-label", visible ? hideLabel : showLabel);
    button.disabled = input.disabled;
    button.hidden = element.dataset.gToggle === "false" || element.classList.contains("g-password-field-no-toggle");
    if (input.id) button.setAttribute("aria-controls", input.id);
    const label = button.querySelector("[data-g-password-label]");
    if (label) label.textContent = visible ? hideLabel : showLabel;
    return { visible, reason };
  }
  function setVisible(visible, reason = "api") {
    if (input.disabled || (input.type === "text") === visible) return update(reason);
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.type = visible ? "text" : "password";
    update(reason);
    input.focus({ preventScroll: true });
    if (start != null && end != null) input.setSelectionRange(start, end);
    const detail = { visible, input, reason };
    emit(element, "visibilitychange", { visible, input, reason });
    emit(element, "change", { visible, input, reason });
    return detail;
  }
  function toggle() { return setVisible(input.type !== "text", "toggle"); }
  function keyboard(event) {
    if (event.key === "Escape" && input.type === "text") { event.preventDefault(); setVisible(false, "escape"); }
    const active = typeof event.getModifierState === "function" && event.getModifierState("CapsLock");
    element.classList.toggle("is-caps-lock", active);
    if (capsLock) capsLock.hidden = !active;
  }
  function focusout(event) {
    const hideOnBlur = element.hasAttribute("data-g-hide-on-blur") && element.dataset.gHideOnBlur !== "false";
    if (hideOnBlur && !element.contains(event.relatedTarget) && input.type === "text") setVisible(false, "blur");
  }
  button.addEventListener("click", toggle);
  input.addEventListener("keydown", keyboard);
  input.addEventListener("keyup", keyboard);
  element.addEventListener("focusout", focusout);
  if (capsLock) capsLock.hidden = true;
  update("init");
  return { toggle, destroy: () => { button.removeEventListener("click", toggle); input.removeEventListener("keydown", keyboard); input.removeEventListener("keyup", keyboard); element.removeEventListener("focusout", focusout); } };
}

function createOtpInput(element) {
  if(element.hasAttribute('data-g-auth-options'))return null;
  const cells = [...element.querySelectorAll("[data-g-otp-cell], [data-g-pin-input-cell], .g-otp-cell, .g-pin-input-cell")];
  const output = element.querySelector("[data-g-otp-output], [data-g-pin-input-output]");
  const status = element.querySelector("[data-g-pin-input-status], .g-pin-input-status");
  const clearButton = element.querySelector("[data-g-pin-input-clear], .g-pin-input-clear");
  if (!cells.length) return null;
  const mode = element.dataset.gPinInputMode || element.dataset.gOtpMode || "numeric";
  const normalize = (value) => {
    const text = String(value ?? "").replace(/[０-９]/gu, (character) => String.fromCharCode(character.charCodeAt(0) - 0xfee0));
    const filtered = mode === "alphanumeric" ? text.replace(/[^\p{L}\p{N}]/gu, "") : text.replace(/\D/gu, "");
    const letterCase = element.dataset.gPinInputCase || element.dataset.gOtpCase;
    return letterCase === "upper" ? filtered.toLocaleUpperCase() : letterCase === "lower" ? filtered.toLocaleLowerCase() : filtered;
  };
  const unavailable = () => element.matches(".is-disabled, [aria-disabled='true']") || cells.every((cell) => cell.disabled);
  let rootReadOnly = element.getAttribute("aria-readonly") === "true";
  const authoredReadOnly = cells.map((cell) => cell.readOnly);
  let appliedRootReadOnly = false;
  const readOnly = () => rootReadOnly || element.matches(".is-read-only") || cells.every((cell) => cell.readOnly);
  let lastValue;
  let lastComplete = false;
  function sync(reason = "api", notify = true) {
    if (element.hasAttribute("aria-readonly")) { rootReadOnly = element.getAttribute("aria-readonly") === "true"; element.removeAttribute("aria-readonly"); }
    const requestedReadOnly = rootReadOnly || element.classList.contains("is-read-only");
    if (requestedReadOnly !== appliedRootReadOnly) {
      cells.forEach((cell, index) => { if (requestedReadOnly) authoredReadOnly[index] = cell.readOnly; cell.readOnly = requestedReadOnly || authoredReadOnly[index]; });
      appliedRootReadOnly = requestedReadOnly;
    }
    const value = cells.map((cell) => normalize(cell.value).slice(-1)).join("");
    cells.forEach((cell, index) => {
      const digit = normalize(cell.value).slice(-1);
      if (cell.value !== digit) cell.value = digit;
      cell.setAttribute("aria-label", cell.getAttribute("aria-label") || message("otp.cell", { index: index + 1, total: cells.length }));
      cell.maxLength = 1;
      if (!cell.hasAttribute("inputmode")) cell.inputMode = mode === "numeric" ? "numeric" : "text";
      if (!cell.hasAttribute("autocomplete")) cell.autocomplete = index === 0 ? "one-time-code" : "off";
      cell.classList.toggle("has-value", Boolean(digit));
      cell.setAttribute("aria-invalid", String(element.classList.contains("is-invalid")));
    });
    element.dataset.gOtpValue = value;
    element.dataset.gPinInputValue = value;
    element.dataset.gFilled = String(value.length);
    const valueOutput = element.querySelector("[data-g-otp-output], [data-g-pin-input-output]") || output;
    if (valueOutput) valueOutput.value = value;
    const complete = value.length === cells.length;
    element.classList.toggle("is-empty", value.length === 0);
    element.classList.toggle("is-partial", value.length > 0 && !complete);
    element.classList.toggle("is-complete", complete);
    element.setAttribute("aria-invalid", String(element.classList.contains("is-invalid")));
    element.setAttribute("aria-disabled", String(unavailable()));
    // Read-only belongs to the editable cells; the containing group does not support it.
    if (status) {
      const key = complete ? "CompleteLabel" : value ? "PartialLabel" : "EmptyLabel";
      const fallback = complete ? message("otp.complete") : value ? message("otp.partial", { count: value.length, total: cells.length }) : message("otp.empty", { total: cells.length });
      status.textContent = element.dataset[`gPinInput${key}`] || element.dataset[`gOtp${key}`] || fallback;
    }
    if (clearButton) {
      if (clearButton.tagName === "BUTTON" && !clearButton.hasAttribute("type")) clearButton.type = "button";
      clearButton.disabled = unavailable() || readOnly() || value.length === 0;
      clearButton.setAttribute("aria-label", clearButton.getAttribute("aria-label") || message("input.clear"));
    }
    if (notify && value !== lastValue) emit(element, "otpchange", { value, complete, filled: value.length, total: cells.length, reason });
    if (notify && complete && (!lastComplete || value !== lastValue)) emit(element, "otpcomplete", { value, total: cells.length, reason });
    lastValue = value;
    lastComplete = complete;
    return value;
  }
  function fill(value, start = 0, reason = "api") {
    const safeStart = Math.max(0, Math.min(Number(start) || 0, cells.length - 1));
    const values = [...normalize(value)].slice(0, cells.length - safeStart);
    values.forEach((digit, offset) => { cells[safeStart + offset].value = digit; });
    const next = Math.min(safeStart + values.length, cells.length - 1);
    const result = sync(reason);
    queueMicrotask(() => cells[next]?.focus({ preventScroll: true }));
    return result;
  }
  function input(event) {
    const index = cells.indexOf(event.target);
    if (index < 0 || unavailable() || readOnly()) return;
    const value = normalize(event.target.value);
    if (value.length > 1) fill(value, index, "input");
    else { event.target.value = value.slice(-1); sync("input"); if (value && index < cells.length - 1) queueMicrotask(() => cells[index + 1]?.focus({ preventScroll: true })); }
  }
  function keydown(event) {
    const index = cells.indexOf(event.target);
    if (index < 0 || unavailable() || readOnly()) return;
    if (event.key === "Backspace" && !event.target.value && index > 0) { event.preventDefault(); cells[index - 1].value = ""; cells[index - 1].focus({ preventScroll: true }); sync("backspace"); }
    if (event.key === "Delete" && event.target.value) { event.preventDefault(); event.target.value = ""; sync("delete"); }
    if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); cells[index - 1].focus({ preventScroll: true }); }
    if (event.key === "ArrowRight" && index < cells.length - 1) { event.preventDefault(); cells[index + 1].focus({ preventScroll: true }); }
    if (event.key === "Home") { event.preventDefault(); cells[0].focus({ preventScroll: true }); }
    if (event.key === "End") { event.preventDefault(); cells.at(-1).focus({ preventScroll: true }); }
  }
  function paste(event) { const index = cells.indexOf(event.target); if (index >= 0 && !unavailable() && !readOnly()) { event.preventDefault(); fill(event.clipboardData?.getData("text") || "", index, "paste"); } }
  function focusin(event) { if (cells.includes(event.target) && typeof event.target.select === "function") event.target.select(); }
  function clear(reason = "clear") { cells.forEach((cell) => { cell.value = ""; }); element.classList.remove("is-invalid"); if (!unavailable() && !readOnly()) cells[0].focus({ preventScroll: true }); return sync(reason); }
  function click(event) { if (event.target.closest("[data-g-pin-input-clear], .g-pin-input-clear") && !unavailable() && !readOnly()) clear(); }
  const form = element.closest("form");
  const initialValue = normalize(output?.value || cells.map((cell) => cell.value).join("")).slice(0, cells.length);
  function reset() { queueMicrotask(() => { cells.forEach((cell, index) => { cell.value = [...initialValue][index] || ""; }); sync("reset"); }); }
  if (initialValue) [...initialValue].forEach((character, index) => { if (cells[index]) cells[index].value = character; });
  element.setAttribute("role", element.getAttribute("role") || "group");
  element.addEventListener("input", input); element.addEventListener("keydown", keydown); element.addEventListener("paste", paste); element.addEventListener("focusin", focusin); element.addEventListener("click", click); form?.addEventListener("reset", reset); sync("init");
  return { value: () => sync("read", false), fill, clear, destroy: () => { element.removeEventListener("input", input); element.removeEventListener("keydown", keydown); element.removeEventListener("paste", paste); element.removeEventListener("focusin", focusin); element.removeEventListener("click", click); form?.removeEventListener("reset", reset); } };
}

function createRating(element) {
  const items = () => [...element.querySelectorAll("[data-g-rating-item], .g-rating-item")];
  const output = element.querySelector("[data-g-rating-output], .g-rating-output");
  const status = element.querySelector("[data-g-rating-status], .g-rating-status");
  const valueLabel = element.querySelector("[data-g-rating-value-label], .g-rating-value");
  const clearButton = element.querySelector("[data-g-rating-clear], .g-rating-clear");
  if (!items().length) return null;
  const maximum = Math.max(1, numeric(element.dataset.gRatingMax, items().length));
  const configuredStep = numeric(element.dataset.gRatingStep, element.classList.contains("g-rating-half") ? 0.5 : 1);
  const step = configuredStep > 0 && configuredStep <= 1 ? configuredStep : 1;
  const allowClear = element.hasAttribute("data-g-rating-allow-clear") || element.classList.contains("g-rating-clearable");
  const authorDisabled = new WeakSet(items().filter((item) => isDisabled(item)));
  const authorLabels = new WeakMap(items().map((item) => [item, item.getAttribute("aria-label")]));
  const unavailable = () => element.matches(".is-disabled, [aria-disabled='true']");
  const itemUnavailable = (item) => unavailable() || authorDisabled.has(item);
  const readOnly = () => element.matches(".is-read-only, .is-readonly, [aria-readonly='true']");
  const round = (candidate) => {
    const bounded = Math.max(0, Math.min(maximum, numeric(candidate, 0)));
    return Number((Math.round(bounded / step) * step).toFixed(4));
  };
  const itemValue = (item, index) => round(numeric(item.dataset.gValue || item.dataset.gRatingValue, index + 1));
  let current = round(element.dataset.gRatingValue ?? output?.value ?? items().find((item) => item.matches(".is-active, [aria-checked='true']"))?.dataset.gValue ?? 0);
  let preview = null;
  let lastEmitted = current;
  let renderFrame = null;
  let disposed = false;
  const form = element.closest("form");
  const initialValue = current;

  function valueText(value) {
    const formatted = Number.isInteger(value) ? String(value) : String(value).replace(/\.0+$/, "");
    return value === 0
      ? element.dataset.gRatingEmptyLabel || message("rating.empty")
      : message("rating.value", { value: formatted, maximum });
  }

  function render(value = current, previewing = false) {
    const visible = round(value);
    const controls = items();
    controls.forEach((item, index) => {
      const upper = itemValue(item, index);
      const lower = Math.max(0, upper - 1);
      const fill = Math.max(0, Math.min(1, visible - lower));
      item.classList.toggle("is-filled", fill >= 1);
      item.classList.toggle("is-half", fill > 0 && fill < 1);
      item.classList.toggle("is-empty", fill <= 0);
      item.style.setProperty("--g-rating-fill", `${Math.round(fill * 100)}%`);
      item.setAttribute("role", "radio");
      const checked = visible > lower && visible <= upper;
      item.setAttribute("aria-checked", String(checked));
      item.setAttribute("aria-label", authorLabels.get(item) || message("rating.option", { value: checked ? visible : upper, maximum }));
      item.setAttribute("aria-disabled", String(itemUnavailable(item)));
      if (item.tagName === "BUTTON" && !item.hasAttribute("type")) item.type = "button";
      if ("disabled" in item) item.disabled = itemUnavailable(item);
    });
    const focusIndex = visible > 0 ? Math.max(0, Math.min(controls.length - 1, Math.ceil(visible) - 1)) : 0;
    controls.forEach((item, index) => { item.tabIndex = index === focusIndex && !itemUnavailable(item) ? 0 : -1; });
    element.classList.toggle("is-empty", current === 0);
    element.classList.toggle("is-rated", current > 0);
    element.classList.toggle("is-complete", current === maximum);
    element.classList.toggle("is-previewing", previewing);
    element.dataset.gRatingValue = String(current);
    element.dataset.gRatingPreview = previewing ? String(visible) : "";
    element.setAttribute("aria-disabled", String(unavailable()));
    element.setAttribute("aria-readonly", String(readOnly()));
    element.setAttribute("aria-invalid", String(element.classList.contains("is-invalid")));
    const liveOutput = element.querySelector("[data-g-rating-output], .g-rating-output") || output;
    if (liveOutput) liveOutput.value = String(current);
    if (status) status.textContent = valueText(previewing ? visible : current);
    if (valueLabel) valueLabel.textContent = current ? `${current} / ${maximum}` : `— / ${maximum}`;
    if (clearButton) {
      if (clearButton.tagName === "BUTTON" && !clearButton.hasAttribute("type")) clearButton.type = "button";
      clearButton.disabled = unavailable() || readOnly() || current === 0;
      clearButton.setAttribute("aria-label", clearButton.getAttribute("aria-label") || message("rating.clear"));
    }
    return current;
  }

  function scheduleRender() {
    queueMicrotask(() => { if (!disposed) render(); });
    if (typeof requestAnimationFrame === "function") {
      if (renderFrame != null) cancelAnimationFrame(renderFrame);
      renderFrame = requestAnimationFrame(() => { renderFrame = null; if (!disposed) render(); });
    }
  }

  function setValue(candidate, reason = "api", notify = true) {
    const next = round(candidate);
    current = allowClear && reason === "pointer" && next === current ? 0 : next;
    preview = null;
    render();
    if (notify && current !== lastEmitted) emit(element, "ratingchange", { value: current, maximum, step, reason });
    lastEmitted = current;
    scheduleRender();
    return current;
  }

  function pointerValue(item, event) {
    const index = items().indexOf(item);
    const upper = itemValue(item, index);
    if (step > 0.5) return upper;
    const rect = item.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    return round(upper - (event.clientX < midpoint ? 0.5 : 0));
  }

  function pointermove(event) {
    const item = event.target.closest("[data-g-rating-item], .g-rating-item");
    if (!item || !element.contains(item) || itemUnavailable(item) || readOnly()) return;
    preview = pointerValue(item, event);
    render(preview, true);
  }

  function pointerleave() { if (preview != null) { preview = null; render(); } }

  function click(event) {
    const clear = event.target.closest("[data-g-rating-clear], .g-rating-clear");
    if (clear && element.contains(clear)) { if (!unavailable() && !readOnly()) setValue(0, "clear"); return; }
    const item = event.target.closest("[data-g-rating-item], .g-rating-item");
    if (!item || !element.contains(item) || itemUnavailable(item) || readOnly()) return;
    setValue(pointerValue(item, event), "pointer");
  }

  function keydown(event) {
    const item = event.target.closest("[data-g-rating-item], .g-rating-item");
    if (!item || !element.contains(item) || itemUnavailable(item) || readOnly()) return;
    const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", " ", "Enter"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const direction = document.documentElement.dir === "rtl" ? -1 : 1;
    let next = current;
    if (event.key === "ArrowRight") next += step * direction;
    if (event.key === "ArrowLeft") next -= step * direction;
    if (event.key === "ArrowUp") next += step;
    if (event.key === "ArrowDown") next -= step;
    if (event.key === "Home") next = allowClear ? 0 : step;
    if (event.key === "End") next = maximum;
    if (event.key === " " || event.key === "Enter") {
      const selected = itemValue(item, items().indexOf(item));
      next = allowClear && selected === current ? 0 : selected;
    }
    setValue(next, "keyboard");
    const focusIndex = current > 0 ? Math.ceil(current) - 1 : 0;
    queueMicrotask(() => items()[focusIndex]?.focus({ preventScroll: true }));
  }

  function clear(reason = "clear") { return setValue(0, reason); }
  function refresh() {
    const external = element.dataset.gRatingValue ?? output?.value;
    if (external != null && external !== "") current = round(external);
    return render();
  }
  function reset() { queueMicrotask(() => setValue(initialValue, "reset")); }
  element.setAttribute("role", element.getAttribute("role") || "radiogroup");
  element.addEventListener("pointermove", pointermove);
  element.addEventListener("pointerleave", pointerleave);
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  form?.addEventListener("reset", reset);
  render();
  scheduleRender();
  return { value: () => current, setValue, clear, refresh, destroy: () => { disposed = true; if (renderFrame != null) cancelAnimationFrame(renderFrame); element.removeEventListener("pointermove", pointermove); element.removeEventListener("pointerleave", pointerleave); element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); form?.removeEventListener("reset", reset); } };
}

function createValidationSummary(element) {
  const configuredForm = element.dataset.gValidationForm;
  let form = configuredForm ? targetById(configuredForm) : element.closest("form");
  if (!form && configuredForm) {
    try { form = document.querySelector(configuredForm); } catch { form = null; }
  }
  if (!form) return null;

  const list = element.querySelector("[data-g-validation-list], .g-validation-summary-list");
  const title = element.querySelector("[data-g-validation-title], .g-validation-summary-title");
  const count = element.querySelector("[data-g-validation-count], .g-validation-summary-count");
  const status = element.querySelector("[data-g-validation-status], .g-validation-summary-status");
  if (!list) return null;

  const authoredTitle = title?.textContent?.trim() || "";
  const showValid = () => element.hasAttribute("data-g-validation-show-valid") && element.dataset.gValidationShowValid !== "false";
  const live = () => element.dataset.gValidationMode !== "submit";
  const focusOnSubmit = () => element.dataset.gValidationFocus !== "false";
  const preventSubmit = () => element.dataset.gValidationPreventSubmit !== "false";
  let currentErrors = [];
  let signature = "";
  let scheduled = false;
  let disposed = false;
  const managedInvalid = new Set();

  function controlLabel(control) {
    const explicit = control.dataset.gLabel || control.getAttribute("aria-label");
    if (explicit) return explicit.trim();
    const labelledBy = control.getAttribute("aria-labelledby")?.split(/\s+/).map((id) => document.getElementById(id)?.textContent?.trim()).filter(Boolean).join(" ");
    if (labelledBy) return labelledBy;
    const wrappingLabel = control.closest("label")?.textContent?.trim();
    if (wrappingLabel) return wrappingLabel;
    if (control.id) {
      const matchingLabel = [...form.querySelectorAll("label[for]")].find((label) => label.htmlFor === control.id);
      if (matchingLabel?.textContent?.trim()) return matchingLabel.textContent.trim();
    }
    return control.name || control.id || message("validationSummary.field");
  }

  function referencedMessage(control) {
    for (const attribute of ['aria-errormessage', 'aria-describedby']) {
      for (const id of control.getAttribute(attribute)?.split(/\s+/) || []) {
        const node = document.getElementById(id);
        const isError = attribute === 'aria-errormessage' || node?.matches('.g-validation-message,.g-field-error,.g-field-feedback,.g-error,[data-g-field-error],[data-g-validation-for],[role="alert"]');
        if (isError && node && !node.closest('[hidden],[aria-hidden="true"]') && node.textContent?.trim()) return node.textContent.trim();
      }
    }
    const field = control.closest(".g-field, .g-form-field, [data-g-field]");
    const node = field?.querySelector(".g-validation-message, .g-field-error, [data-g-field-error]");
    return node && !node.hidden ? node.textContent?.trim() : "";
  }

  function invalidControls() {
    const isInvalidControl = (control) => (control.getAttribute("aria-invalid") === "true" && !control.hasAttribute("data-g-validation-summary-invalid")) || control.classList.contains("is-invalid") || (control.willValidate && control.validity && !control.validity.valid);
    const nativeSelector = "input, select, textarea, [contenteditable='true']";
    return [...form.querySelectorAll(`${nativeSelector}, [aria-invalid='true']`)]
      .filter((control) => !element.contains(control) && !isDisabled(control) && control.type !== "hidden" && !control.closest("[hidden], [aria-hidden='true']"))
      .filter((control) => control.matches(nativeSelector) || ![...control.querySelectorAll(nativeSelector)].some(isInvalidControl))
      .filter(isInvalidControl);
  }

  function collectErrors() {
    const errors = new Map();
    invalidControls().forEach((control, index) => {
      if (!control.id) control.id = uid("g-invalid-field");
      const label = controlLabel(control);
      const detail = control.dataset.gValidationMessage || referencedMessage(control) || control.validationMessage || message("validationSummary.invalid");
      errors.set(control.id || `control-${index}`, { control, targetId: control.id, label, message: detail });
    });
    form.querySelectorAll("[data-g-validation-for]").forEach((source, index) => {
      if (element.contains(source) || source.hidden || source.getAttribute("aria-hidden") === "true" || !source.textContent?.trim()) return;
      const targetId = source.dataset.gValidationFor.replace(/^#/, "");
      const control = document.getElementById(targetId);
      if (control && (isDisabled(control) || control.closest("[hidden], [aria-hidden='true']"))) return;
      const label = source.dataset.gLabel || (control ? controlLabel(control) : message("validationSummary.field"));
      errors.set(targetId || `custom-${index}`, { control, targetId, label, message: source.textContent.trim() });
    });
    return [...errors.values()];
  }

  function announce(errors, reason) {
    const total = errors.length;
    element.dataset.gValidationCount = String(total);
    element.classList.toggle("is-empty", total === 0);
    element.classList.toggle("is-valid", total === 0);
    element.classList.toggle("is-invalid", total > 0);
    element.classList.remove("is-updating");
    element.hidden = total === 0 && !showValid();
    element.setAttribute("aria-hidden", String(element.hidden));
    element.setAttribute("aria-invalid", String(total > 0));
    element.setAttribute("role", total > 0 ? "alert" : "status");
    element.setAttribute("aria-live", total > 0 && reason === "submit" ? "assertive" : "polite");
    element.setAttribute("aria-atomic", "true");
    if (title && (!authoredTitle || title.hasAttribute("data-g-validation-title-auto"))) {
      title.textContent = total === 0 ? message("validationSummary.valid") : message(total === 1 ? "validationSummary.titleOne" : "validationSummary.titleMany", { count: total });
    }
    if (count) count.textContent = total ? message("validationSummary.count", { count: total }) : message("validationSummary.noErrors");
    if (status) status.textContent = total === 0 ? message("validationSummary.valid") : message(total === 1 ? "validationSummary.statusOne" : "validationSummary.statusMany", { count: total });
  }

  function render(errors, reason = "refresh") {
    const fragment = document.createDocumentFragment();
    const nextManaged = new Set(errors.map((error) => error.control).filter(Boolean));
    managedInvalid.forEach((control) => {
      if (!nextManaged.has(control)) {
        control.removeAttribute("data-g-validation-summary-invalid");
        control.removeAttribute("aria-invalid");
        managedInvalid.delete(control);
      }
    });
    errors.forEach((error, index) => {
      const item = document.createElement("li");
      item.className = "g-validation-summary-item";
      item.dataset.gValidationItem = "";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "g-validation-summary-link";
      button.dataset.gValidationTarget = error.targetId;
      button.setAttribute("aria-label", message("validationSummary.goTo", { label: error.label, message: error.message }));
      const label = document.createElement("span");
      label.className = "g-validation-summary-label";
      label.textContent = error.label;
      const detail = document.createElement("span");
      detail.className = "g-validation-summary-message";
      detail.textContent = error.message;
      button.append(label, detail);
      item.append(button);
      fragment.append(item);
      if (error.control && error.control.getAttribute("aria-invalid") !== "true") {
        error.control.setAttribute("aria-invalid", "true");
        error.control.setAttribute("data-g-validation-summary-invalid", "");
        managedInvalid.add(error.control);
      }
      item.style.setProperty("--g-validation-index", String(index));
    });
    list.replaceChildren(fragment);
    list.setAttribute("role", "list");
    currentErrors = errors;
    announce(errors, reason);
  }

  function refresh(reason = "api", notify = true) {
    if (disposed) return [];
    element.classList.add("is-updating");
    const errors = collectErrors();
    const nextSignature = errors.map((error) => `${error.targetId}:${error.message}`).join("|");
    render(errors, reason);
    if (notify && nextSignature !== signature) emit(element, "validationchange", { errors, count: errors.length, valid: errors.length === 0, reason });
    signature = nextSignature;
    return [...currentErrors];
  }

  function schedule(reason = "change") {
    if (scheduled || disposed) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; refresh(reason); });
  }

  function focusSummary() {
    if (element.hidden) return false;
    if (!element.hasAttribute("tabindex")) element.tabIndex = -1;
    element.focus({ preventScroll: true });
    element.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
    return true;
  }

  function navigate(targetId, reason = "api") {
    const target = document.getElementById(targetId);
    if (!target || isDisabled(target) || target.closest("[hidden], [aria-hidden='true']")) return false;
    target.scrollIntoView?.({ block: "center", behavior: "smooth" });
    target.focus({ preventScroll: true });
    emit(element, "validationnavigate", { target, targetId, reason });
    return document.activeElement === target;
  }

  function click(event) {
    const trigger = event.target.closest("[data-g-validation-target]");
    if (trigger && element.contains(trigger)) navigate(trigger.dataset.gValidationTarget, "pointer");
  }

  function input() { if (live() || currentErrors.length) schedule("input"); }
  function change() { if (live() || currentErrors.length) schedule("change"); }
  function invalid() { schedule("invalid"); }
  function submit(event) {
    const errors = refresh("submit");
    if (!errors.length) return;
    if (preventSubmit()) event.preventDefault();
    if (focusOnSubmit()) queueMicrotask(focusSummary);
    emit(element, "validationblocked", { errors, count: errors.length, submitter: event.submitter || null });
  }
  function reset() { setTimeout(() => refresh("reset"),0); }

  const mutationObserver = typeof MutationObserver === "function" ? new MutationObserver((records) => {
    if (records.some((record) => !element.contains(record.target)||record.target===element&&record.attributeName?.startsWith("data-g-validation-"))) schedule("mutation");
  }) : null;
  mutationObserver?.observe(form, { childList: true, characterData: true, subtree: true, attributes: true, attributeFilter: ["aria-invalid", "data-g-validation-message", "hidden", "disabled", "required", "data-g-validation-show-valid", "data-g-validation-mode", "data-g-validation-focus", "data-g-validation-prevent-submit"] });
  form.addEventListener("input", input);
  form.addEventListener("change", change);
  form.addEventListener("invalid", invalid, true);
  form.addEventListener("submit", submit);
  form.addEventListener("reset", reset);
  element.addEventListener("click", click);
  if (!element.hasAttribute("tabindex")) element.tabIndex = -1;
  refresh("init", false);
  return {
    errors: () => [...currentErrors],
    refresh,
    focus: focusSummary,
    navigate,
    destroy: () => {
      disposed = true;
      mutationObserver?.disconnect();
      managedInvalid.forEach((control) => { control.removeAttribute("data-g-validation-summary-invalid"); control.removeAttribute("aria-invalid"); });
      managedInvalid.clear();
      form.removeEventListener("input", input);
      form.removeEventListener("change", change);
      form.removeEventListener("invalid", invalid, true);
      form.removeEventListener("submit", submit);
      form.removeEventListener("reset", reset);
      element.removeEventListener("click", click);
    }
  };
}

function createPasswordStrength(element) {
  if(element.hasAttribute('data-g-auth-options'))return null;
  const input = targetById(element.dataset.gPasswordTarget) || element.querySelector("input[type='password'], input");
  const label = element.querySelector("[data-g-password-strength-label]");
  const meter = element.querySelector("[data-g-password-strength-meter], .g-password-strength-meter");
  const rules = [...element.querySelectorAll("[data-g-password-rule]")];
  if (!input) return null;
  const tests = {
    length: (value) => value.length >= Number(element.dataset.gMinLength || input.minLength || 8),
    upper: (value) => /[A-Z]/.test(value), lower: (value) => /[a-z]/.test(value),
    number: (value) => /\d/.test(value), symbol: (value) => /[^\w\s]/.test(value)
  };
  function update(reason = "input") {
    const value = input.value; const checks = Object.fromEntries(Object.entries(tests).map(([key, test]) => [key, test(value)]));
    const passed = Object.values(checks).filter(Boolean).length;
    const score = value ? Math.min(4, Math.max(1, Math.ceil((passed / Object.keys(checks).length) * 4))) : 0;
    const labels = ["none", "weak", "fair", "good", "strong"].map((level) => message(`passwordStrength.${level}`));
    element.dataset.gStrength = String(score); element.style.setProperty("--g-password-strength", `${score * 25}%`);
    if (label) label.textContent = labels[score];
    if (meter) { meter.setAttribute("role", "progressbar"); meter.setAttribute("aria-label", message("passwordStrength.label")); meter.setAttribute("aria-valuemin", "0"); meter.setAttribute("aria-valuemax", "4"); meter.setAttribute("aria-valuenow", String(score)); meter.setAttribute("aria-valuetext", labels[score]); }
    rules.forEach((rule) => { const valid = Boolean(checks[rule.dataset.gPasswordRule]); rule.classList.toggle("is-valid", valid); rule.setAttribute("aria-label", message("passwordStrength.rule", { rule: rule.textContent.trim(), status: message(valid ? "passwordStrength.met" : "passwordStrength.unmet") })); });
    emit(element, "passwordstrength", { score, checks, reason }); return { score, checks };
  }
  input.addEventListener("input", update); update("init");
  return { update, destroy: () => input.removeEventListener("input", update) };
}

function createAuthTimer(element) {
  if(element.hasAttribute('data-g-auth-options'))return null;
  const output = element.querySelector("[data-g-auth-time]") || element;
  const resetButton = element.querySelector("[data-g-auth-timer-reset]");
  const duration = Math.max(0, Number(element.dataset.gDuration || 60));
  let remaining = duration; let timer = 0;
  function format(seconds) { const minutes = Math.floor(seconds / 60); const rest = seconds % 60; return minutes ? `${minutes}:${String(rest).padStart(2, "0")}` : message("auth.seconds", { seconds: rest }); }
  function render(reason = "tick") { output.textContent = format(remaining); const expired = remaining <= 0; element.dataset.gTimerState = expired ? "expired" : "active"; element.setAttribute("aria-live", expired ? "polite" : "off"); if (expired) { window.clearInterval(timer); timer = 0; emit(element, "authtimerexpired", { reason }); } }
  function start(seconds = duration, reason = "start") { window.clearInterval(timer); remaining = Math.max(0, Number(seconds)); render(reason); if (remaining > 0) timer = window.setInterval(() => { remaining -= 1; render(); }, 1000); emit(element, "authtimerstart", { remaining, reason }); }
  function reset() { start(duration, "reset"); }
  function click(event) { if (event.target.closest("[data-g-auth-timer-reset]")) { event.preventDefault(); reset(); } }
  element.addEventListener("click", click); start(duration, "init");
  return { start, reset, expire: () => start(0, "api"), remaining: () => remaining, destroy: () => { window.clearInterval(timer); element.removeEventListener("click", click); } };
}

function createClearInput(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  const input = element.querySelector("input, textarea, select");
  const button = element.querySelector("[data-g-clear-button]");
  if (!input || !button) return null;
  if (button.tagName === "BUTTON" && !button.hasAttribute("type")) button.type = "button";
  const authoredState = { disabled: element.classList.contains("is-disabled"), readonly: element.classList.contains("is-read-only") };
  const value = () => input.tagName === "SELECT" && input.multiple
    ? [...input.selectedOptions].map((option) => option.value)
    : input.type === "checkbox" || input.type === "radio" ? input.checked : input.value;
  const hasValue = () => Array.isArray(value()) ? value().length > 0 : typeof value() === "boolean" ? value() : String(value() ?? "").length > 0;
  function update(reason = "sync") {
    const populated = hasValue();
    const unavailable = input.disabled || input.readOnly;
    const alwaysVisible = element.dataset.gClearVisibility === "always" || element.classList.contains("g-clearable-field-always-visible");
    element.classList.toggle("has-value", populated);
    element.classList.toggle("is-empty", !populated);
    formReflectedStates.set(element, { disabled: input.disabled && !authoredState.disabled, readonly: Boolean(input.readOnly) && !authoredState.readonly });
    element.classList.toggle("is-disabled", input.disabled || authoredState.disabled);
    element.classList.toggle("is-read-only", Boolean(input.readOnly) || authoredState.readonly);
    button.hidden = unavailable || (!populated && !alwaysVisible);
    button.disabled = unavailable || !populated;
    if (input.id) button.setAttribute("aria-controls", input.id);
    return { value: value(), hasValue: populated, reason };
  }
  function clear(reason = "api") {
    if (input.disabled || input.readOnly || !hasValue()) return update(reason);
    const previousValue = value();
    element.classList.add("is-clearing");
    if (input.tagName === "SELECT" && input.multiple) [...input.options].forEach((option) => { option.selected = false; });
    else if (input.type === "checkbox" || input.type === "radio") input.checked = false;
    else input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus({ preventScroll: true });
    const detail = { input, previousValue, value: value(), reason };
    update(reason);
    element.classList.remove("is-clearing");
    element.classList.add("is-cleared");
    queueMicrotask(() => element.classList.remove("is-cleared"));
    emit(element, "clear", { input, previousValue, value: value(), reason });
    return detail;
  }
  function keyboard(event) {
    const clearOnEscape = element.hasAttribute("data-g-clear-on-escape") && element.dataset.gClearOnEscape !== "false";
    if (clearOnEscape && event.key === "Escape" && hasValue()) { event.preventDefault(); clear("escape"); }
  }
  if (!button.hasAttribute("aria-label")) button.setAttribute("aria-label", message("input.clear"));
  input.addEventListener("input", update);
  input.addEventListener("change", update);
  input.addEventListener("keydown", keyboard);
  const click = () => clear("button");
  button.addEventListener("click", click);
  const observer = new MutationObserver(() => update("attribute"));
  observer.observe(input, { attributes: true, attributeFilter: ["disabled", "readonly", "value"] });
  update("init");
  return { clear, update, destroy: () => { input.removeEventListener("input", update); input.removeEventListener("change", update); input.removeEventListener("keydown", keyboard); button.removeEventListener("click", click); observer.disconnect(); formReflectedStates.delete(element); element.classList.toggle("is-disabled", authoredState.disabled); element.classList.toggle("is-read-only", authoredState.readonly); } };
}

function createCharacterCount(element) {
  const input = element.querySelector("textarea, input");
  const output = element.querySelector("[data-g-character-output], .g-character-count");
  if (!input || !output) return null;
  const initialInvalid = input.getAttribute("aria-invalid");
  const authoredStates = new Map([element,output].map(target=>[target,{disabled:target.classList.contains("is-disabled"),readonly:target.classList.contains("is-read-only")}]));
  const segmenter = typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
  const segments = (value) => segmenter ? [...segmenter.segment(value)].map(({ segment }) => segment) : [...value];
  const number = (value, fallback = 0) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const constraints = () => {
    const datasetMaximum = element.dataset.gCharacterCount;
    const maximum = Math.max(0, Math.floor(datasetMaximum === undefined || datasetMaximum === "" ? Math.max(0, input.maxLength) : number(datasetMaximum)));
    const warning = Math.min(1, Math.max(0, number(element.dataset.gCharacterWarning, .85)));
    const mode = element.dataset.gCharacterMode === "remaining" || element.classList.contains("g-character-field-remaining") ? "remaining" : "count";
    const hardLimit = element.dataset.gCharacterHardLimit !== undefined && element.dataset.gCharacterHardLimit !== "false";
    return { maximum, warning, mode, hardLimit };
  };
  let composing=false,disposed=false;
  function update(reason = "update") {
    if(disposed||composing)return;
    const previousValue=input.value;
    const config = constraints();
    let graphemes = segments(input.value);
    if (config.hardLimit && config.maximum > 0 && graphemes.length > config.maximum) {
      input.value = graphemes.slice(0, config.maximum).join("");
      graphemes = graphemes.slice(0, config.maximum);
    }
    const count = graphemes.length;
    const remaining = config.maximum > 0 ? config.maximum - count : null;
    const nearLimit = config.maximum > 0 && count >= Math.ceil(config.maximum * config.warning) && count < config.maximum;
    const atLimit = config.maximum > 0 && count === config.maximum;
    const overLimit = config.maximum > 0 && count > config.maximum;
    const displayed = config.mode === "remaining" && remaining !== null ? remaining : count;
    const currentOutput = output.querySelector(".g-character-count-current");
    const maximumOutput = output.querySelector(".g-character-count-maximum");
    if (currentOutput || maximumOutput) {
      if (currentOutput) currentOutput.textContent = String(displayed);
      if (maximumOutput) maximumOutput.textContent = config.maximum > 0 ? String(config.maximum) : "";
    } else {
      output.textContent = config.maximum > 0 && config.mode === "count" ? `${count} / ${config.maximum}` : String(displayed);
    }
    for (const target of [element, output]) {
      target.classList.toggle("is-empty", count === 0);
      target.classList.toggle("is-typing", reason === "input");
      target.classList.toggle("is-near-limit", nearLimit);
      target.classList.toggle("is-at-limit", atLimit);
      target.classList.toggle("is-over-limit", overLimit);
      const authored = authoredStates.get(target);
      formReflectedStates.set(target,{disabled:input.disabled&&!authored.disabled,readonly:input.readOnly&&!authored.readonly});
      target.classList.toggle("is-disabled", input.disabled||authored.disabled);
      target.classList.toggle("is-read-only", input.readOnly||authored.readonly);
    }
    if (overLimit) input.setAttribute("aria-invalid", "true");
    else if (initialInvalid === null) input.removeAttribute("aria-invalid");
    else input.setAttribute("aria-invalid", initialInvalid);
    output.dataset.gCharacterCurrent = String(count);
    if (remaining !== null) output.dataset.gCharacterRemaining = String(remaining);
    else delete output.dataset.gCharacterRemaining;
    output.setAttribute("aria-label", message(config.maximum > 0 ? "character.withMax" : "character.withoutMax", { count, maximum: config.maximum }));
    if(previousValue!==input.value&&reason!=="input")input.dispatchEvent(new Event("input",{bubbles:true}));
    emit(element, "count", { count, maximum: config.maximum, remaining, mode: config.mode, nearLimit, atLimit, overLimit, reason });
  }
  const onInput = (event) => { if (!event.isComposing) update("input"); };
  const onCompositionStart=()=>{composing=true;};
  const onCompositionEnd = () => {composing=false;update("compositionend");};
  const form=input.form,reset=()=>setTimeout(()=>update("reset"),0);form?.addEventListener("reset",reset);input.addEventListener("compositionstart",onCompositionStart);
  const observer = typeof MutationObserver === "function" ? new MutationObserver(() => update("constraint")) : null;
  input.addEventListener("input", onInput, true);
  input.addEventListener("compositionend", onCompositionEnd);
  observer?.observe(input, { attributes: true, attributeFilter: ["maxlength", "disabled", "readonly"] });
  observer?.observe(element, { attributes: true, attributeFilter: ["data-g-character-count", "data-g-character-warning", "data-g-character-mode", "data-g-character-hard-limit"] });
  update("init");
  return { update, destroy: () => { disposed=true;form?.removeEventListener("reset",reset);input.removeEventListener("compositionstart",onCompositionStart);if(initialInvalid===null)input.removeAttribute("aria-invalid");else input.setAttribute("aria-invalid",initialInvalid);input.removeEventListener("input", onInput, true); input.removeEventListener("compositionend", onCompositionEnd); observer?.disconnect(); authoredStates.forEach((v,n)=>{formReflectedStates.delete(n);n.classList.toggle("is-disabled",v.disabled);n.classList.toggle("is-read-only",v.readonly);}); } };
}

function createFieldSync(element) {
  const input = element.querySelector("input[type='range'], input[type='file']");
  const output = element.querySelector("[data-g-field-output], .g-range-field-output, .g-file-field-name");
  if (!input || !output) return null;
  const kind = input.type === "file" ? "file" : "range";
  function value() {
    if (kind === "file") return [...(input.files || [])].map((file) => file.name);
    return input.value;
  }
  function sync(reason = "input", notify = true) {
    const next = value();
    if (kind === "file") output.textContent = next.length ? next.join(", ") : element.dataset.gEmptyLabel || message("file.none");
    else output.textContent = `${next}${output.dataset.gSuffix ?? element.dataset.gSuffix ?? ""}`;
    output.toggleAttribute("title", kind === "file" && next.length > 0);
    if (output.hasAttribute("title")) output.title = next.join(", ");
    if (notify) emit(element, "fieldchange", { kind, value: next, files: kind === "file" ? [...(input.files || [])] : [], input });
    return next;
  }
  const change = () => sync("change");
  const inputEvent = () => sync("input");
  input.addEventListener("change", change);
  if (kind === "range") input.addEventListener("input", inputEvent);
  let disposed = false;
  const reset = () => setTimeout(() => { if (!disposed) sync("reset"); },0);
  const form = input.form;
  form?.addEventListener("reset", reset);
  sync("init", false);
  return { sync, value, destroy: () => { disposed = true; input.removeEventListener("change", change); input.removeEventListener("input", inputEvent); form?.removeEventListener("reset", reset); } };
}

function createConditionalField(element) {
  const original = {
    id: element.getAttribute("id"),
    hidden: element.hidden,
    inert: element.hasAttribute("inert"),
    ariaHidden: element.getAttribute("aria-hidden"),
    state: element.getAttribute("data-g-state"),
    visibleClass: element.classList.contains("is-visible"),
    hiddenClass: element.classList.contains("is-hidden"),
    unresolvedClass: element.classList.contains("is-unresolved"),
  };
  const disabledControls = new Map();
  const controllerAria = new Map();
  const rootNode = element.getRootNode?.() || document;
  const localScope = element.closest("[data-g-conditional-scope], form") || rootNode;
  const eventRoot = rootNode?.addEventListener ? rootNode : document;
  const resetRoot = localScope.matches?.("form") ? localScope : element.closest("form");
  let controllers = [];
  let currentValue = "";
  let currentValues = [];
  let visible = !element.hidden;
  let resolved = false;
  if (!element.id) element.id = uid("g-conditional-field");

  function restoreAttribute(target, name, previous) {
    if (previous == null) target.removeAttribute(name);
    else target.setAttribute(name, previous);
  }

  function resolveControllers() {
    const selector = element.dataset.gController?.trim();
    if (!selector) return { items: [], valid: false };
    try {
      const scoped = [...localScope.querySelectorAll(selector)].filter((controller) => controller !== element);
      if (scoped.length || localScope === rootNode) return { items: scoped, valid: true };
      return { items: [...rootNode.querySelectorAll(selector)].filter((controller) => controller !== element), valid: true };
    } catch {
      return { items: [], valid: false };
    }
  }

  function syncControllerRelationships(nextControllers) {
    for (const [controller, previous] of controllerAria) {
      if (nextControllers.includes(controller)) continue;
      restoreAttribute(controller, "aria-controls", previous);
      controllerAria.delete(controller);
    }
    for (const controller of nextControllers) {
      if (!controllerAria.has(controller)) controllerAria.set(controller, controller.getAttribute("aria-controls"));
      const ids = new Set((controller.getAttribute("aria-controls") || "").split(/\s+/u).filter(Boolean));
      ids.add(element.id);
      controller.setAttribute("aria-controls", [...ids].join(" "));
    }
  }

  function valuesFor(nextControllers) {
    const checkboxCount = nextControllers.filter((controller) => controller.type === "checkbox").length;
    const values = [];
    for (const controller of nextControllers) {
      if (controller.type === "radio") {
        if (controller.checked) values.push(String(controller.value));
      } else if (controller.type === "checkbox") {
        if (controller.checked) values.push(String(controller.value || "true"));
        else if (checkboxCount === 1) values.push("false");
      } else if (controller.matches?.("select[multiple]")) {
        values.push(...[...controller.selectedOptions].map((option) => String(option.value)));
      } else if ("value" in controller) {
        values.push(String(controller.value ?? ""));
      } else if (controller.dataset.gValue != null) {
        values.push(String(controller.dataset.gValue));
      }
    }
    return [...new Set(values)];
  }

  function restoreDisabledControls() {
    for (const [control, wasDisabled] of disabledControls) {
      if (wasDisabled) control.setAttribute("disabled", "");
      else control.removeAttribute("disabled");
    }
    disabledControls.clear();
  }

  function syncDisabledControls(disable) {
    if (!disable || element.dataset.gDisableWhenHidden === "false") {
      restoreDisabledControls();
      return;
    }
    for (const control of element.querySelectorAll("button, fieldset, input, select, textarea")) {
      if (!disabledControls.has(control)) disabledControls.set(control, control.hasAttribute("disabled"));
      control.setAttribute("disabled", "");
    }
  }

  function reflect(nextVisible, nextResolved) {
    resolved = nextResolved;
    visible = nextResolved ? nextVisible : true;
    element.hidden = !visible;
    element.toggleAttribute("inert", !visible);
    element.setAttribute("aria-hidden", String(!visible));
    element.classList.toggle("is-visible", nextResolved && visible);
    element.classList.toggle("is-hidden", nextResolved && !visible);
    element.classList.toggle("is-unresolved", !nextResolved);
    element.dataset.gState = nextResolved ? (visible ? "visible" : "hidden") : "unresolved";
    syncDisabledControls(nextResolved && !visible);
  }

  function update(reason = "api") {
    const resolution = resolveControllers();
    controllers = resolution.items;
    syncControllerRelationships(controllers);
    currentValues = valuesFor(controllers);
    currentValue = currentValues.length > 1 ? [...currentValues] : (currentValues[0] ?? "");
    const expected = String(element.dataset.gShowWhen ?? "true").split(",").map((item) => item.trim());
    const selected = new Set(currentValues);
    const matches = element.dataset.gMatch === "all"
      ? expected.every((item) => selected.has(item))
      : expected.some((item) => selected.has(item));
    const nextResolved = resolution.valid && controllers.length > 0;
    reflect(matches, nextResolved);
    emit(element, "change", {
      visible,
      resolved,
      value: currentValue,
      values: [...currentValues],
      controllers: [...controllers],
      reason,
    });
    return visible;
  }

  function onControllerEvent(event) {
    if (resolveControllers().items.includes(event.target)) update(event.type);
  }

  function onFormReset() {
    queueMicrotask(() => update("reset"));
  }

  const configObserver = typeof MutationObserver === "function" ? new MutationObserver((records) => {
    if (records.some((record) => record.type === "attributes")) update("config");
    else if (!controllers.length) update("mutation");
    else if (records.some((record) => [...record.addedNodes, ...record.removedNodes].some((node) => node instanceof Element))) update("mutation");
  }) : null;
  configObserver?.observe(element, {
    attributes: true,
    attributeFilter: ["data-g-controller", "data-g-show-when", "data-g-match", "data-g-disable-when-hidden"],
  });
  if (localScope instanceof Element && localScope !== element) configObserver?.observe(localScope, { childList: true, subtree: true });
  eventRoot.addEventListener("input", onControllerEvent);
  eventRoot.addEventListener("change", onControllerEvent);
  resetRoot?.addEventListener("reset", onFormReset);
  update("init");
  return {
    update,
    value: () => currentValue,
    values: () => [...currentValues],
    controllers: () => [...controllers],
    isVisible: () => visible,
    isResolved: () => resolved,
    destroy: () => {
      configObserver?.disconnect();
      eventRoot.removeEventListener("input", onControllerEvent);
      eventRoot.removeEventListener("change", onControllerEvent);
      resetRoot?.removeEventListener("reset", onFormReset);
      restoreDisabledControls();
      for (const [controller, previous] of controllerAria) restoreAttribute(controller, "aria-controls", previous);
      if (original.id == null) element.removeAttribute("id");
      else element.id = original.id;
      element.hidden = original.hidden;
      element.toggleAttribute("inert", original.inert);
      restoreAttribute(element, "aria-hidden", original.ariaHidden);
      restoreAttribute(element, "data-g-state", original.state);
      element.classList.toggle("is-visible", original.visibleClass);
      element.classList.toggle("is-hidden", original.hiddenClass);
      element.classList.toggle("is-unresolved", original.unresolvedClass);
    },
  };
}

function createRepeatableField(element) {
  const list = element.querySelector("[data-g-repeatable-list], .g-repeatable-list");
  const template = element.querySelector("template[data-g-repeatable-template]");
  const addButton = element.querySelector("[data-g-repeatable-add]");
  if (!list || !template || !addButton) return null;
  const minimum = Math.max(0, Number(element.dataset.gMinItems || 0));
  const maximum = Math.max(minimum, Number(element.dataset.gMaxItems || Infinity));
  const items = () => [...list.querySelectorAll(":scope > .g-repeatable-item")];
  function replaceIndex(node, attribute, index) {
    const current = node.getAttribute(attribute);
    if (current == null) return;
    const dataKey = `g${attribute[0].toUpperCase()}${attribute.slice(1)}Template`;
    if (current.includes("__INDEX__")) node.dataset[dataKey] = current;
    const source = node.dataset[dataKey];
    if (source) node.setAttribute(attribute, source.replaceAll("__INDEX__", String(index)));
  }
  function sync() {
    const currentItems = items();
    currentItems.forEach((item, index) => {
      item.dataset.gIndex = String(index);
      item.querySelectorAll("[data-g-item-number]").forEach((node) => { node.textContent = String(index + 1); });
      item.querySelectorAll("[name], [id], [for]").forEach((node) => { replaceIndex(node, "name", index); replaceIndex(node, "id", index); replaceIndex(node, "for", index); });
      item.querySelectorAll("[data-g-repeatable-remove]").forEach((button) => { button.disabled = currentItems.length <= minimum; });
    });
    addButton.disabled = currentItems.length >= maximum;
  }
  function add() {
    if (items().length >= maximum) return;
    const fragment = template.content.cloneNode(true);
    list.append(fragment);
    sync();
    const item = items().at(-1);
    init(item);
    visibleFocusable(item)[0]?.focus({ preventScroll: true });
    emit(element, "add", { item, index: items().length - 1 });
  }
  function click(event) {
    const removeButton = event.target.closest("[data-g-repeatable-remove]");
    if (!removeButton) return;
    const item = removeButton.closest(".g-repeatable-item");
    if (!item || items().length <= minimum) return;
    const index = items().indexOf(item);
    item.remove();
    sync();
    addButton.focus({ preventScroll: true });
    emit(element, "remove", { index });
  }
  addButton.addEventListener("click", add);
  list.addEventListener("click", click);
  sync();
  return { add, sync, destroy: () => { addButton.removeEventListener("click", add); list.removeEventListener("click", click); } };
}

function createCombobox(element) {
  const input = element.querySelector("[role='combobox'], input");
  const list = element.querySelector("[role='listbox'], .g-combobox-list");
  if (!input || !list) return null;
  const clearButton = element.querySelector("[data-g-combobox-clear], .g-combobox-clear");
  const empty = list.querySelector("[data-g-combobox-empty], .g-combobox-empty");
  const status = element.querySelector("[data-g-combobox-status], .g-combobox-status");
  const createOption = list.querySelector("[data-g-combobox-create], .g-combobox-create");
  const allOptions = () => [...list.querySelectorAll("[role='option'], .g-combobox-option")];
  const options = () => allOptions().filter((option) => !option.hidden && !isDisabled(option));
  const disabled = () => Boolean(input.disabled || element.matches(".is-disabled, [aria-disabled='true'], [data-g-disabled]"));
  let activeIndex = -1;
  let internalChange = false;
  if (!list.id) list.id = uid("g-listbox");
  list.setAttribute("role", "listbox");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-controls", list.id);
  input.setAttribute("aria-haspopup", "listbox");
  input.setAttribute("aria-autocomplete", input.getAttribute("aria-autocomplete") || "list");
  allOptions().forEach((option) => { option.setAttribute("role", "option"); if (!option.hasAttribute("aria-selected")) option.setAttribute("aria-selected", "false"); });

  function open() { if (disabled() || !list.hidden) return; list.hidden = false; element.classList.add("is-open"); input.setAttribute("aria-expanded", "true"); emit(element, "open"); }
  function close() { if (list.hidden) return; list.hidden = true; element.classList.remove("is-open"); input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); allOptions().forEach((option) => option.classList.remove("is-active")); activeIndex = -1; emit(element, "close"); }
  function activate(index) {
    const items = options();
    if (!items.length) { activeIndex = -1; input.removeAttribute("aria-activedescendant"); return; }
    const loop = element.dataset.gLoopNavigation !== "false";
    activeIndex = loop ? (index + items.length) % items.length : Math.max(0, Math.min(index, items.length - 1));
    allOptions().forEach((option) => {
      if (!option.id) option.id = uid("g-option");
      option.classList.toggle("is-active", option === items[activeIndex]);
    });
    input.setAttribute("aria-activedescendant", items[activeIndex].id);
    items[activeIndex].scrollIntoView({ block: "nearest" });
  }
  function choose(option) {
    if (isDisabled(option) || disabled() || input.readOnly) return;
    const label = option.dataset.gLabel ?? option.querySelector(".g-combobox-option-title")?.textContent?.trim() ?? option.textContent.trim();
    input.value = option.dataset.gValue ?? label;
    allOptions().forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    element.classList.toggle("has-value", Boolean(input.value));
    if (clearButton) clearButton.hidden = !input.value;
    internalChange = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    internalChange = false;
    emit(element, "change", { option, value: input.value, label });
    close();
  }
  function search(value = input.value, source = "api") {
    const query = String(value ?? "").trim();
    const normalized = query.toLocaleLowerCase();
    const mode = element.dataset.gFilter || "contains";
    const regularOptions = allOptions().filter((option) => option !== createOption);
    regularOptions.forEach((option) => {
      const haystack = `${option.dataset.gLabel || ""} ${option.dataset.gKeywords || ""} ${option.textContent || ""}`.toLocaleLowerCase();
      option.hidden = mode === "none" ? false : Boolean(normalized) && !(mode === "starts-with" ? haystack.trim().startsWith(normalized) : haystack.includes(normalized));
    });
    const exact = regularOptions.some((option) => !option.hidden && (option.dataset.gValue || option.dataset.gLabel || option.textContent.trim()).toLocaleLowerCase() === normalized);
    if (createOption) {
      createOption.hidden = !query || exact;
      createOption.dataset.gValue = query;
      createOption.dataset.gLabel = query;
      const valueNode = createOption.querySelector("[data-g-combobox-create-value]");
      if (valueNode) valueNode.textContent = query;
    }
    [...list.querySelectorAll(".g-combobox-group, [role='group']")].forEach((group) => { group.hidden = ![...group.querySelectorAll("[role='option'], .g-combobox-option")].some((option) => !option.hidden); });
    const visible = options();
    if (empty) empty.hidden = visible.length > 0 || element.matches(".is-loading, [aria-busy='true'], [data-g-loading='true']");
    if (status) status.textContent = element.matches(".is-loading, [aria-busy='true'], [data-g-loading='true']") ? (status.dataset.gLoadingLabel || "Loading suggestions") : `${visible.length} ${status.dataset.gResultLabel || "suggestions"}`;
    element.classList.toggle("has-value", Boolean(input.value));
    if (clearButton) clearButton.hidden = !input.value || disabled() || input.readOnly;
    open();
    activate(visible.length ? 0 : -1);
    emit(element, "filter", { query, visibleOptions: visible, source });
  }
  function filter() { if (!internalChange) search(input.value, "input"); }
  function clear() {
    if (disabled() || input.readOnly) return;
    input.value = "";
    allOptions().forEach((option) => option.setAttribute("aria-selected", "false"));
    internalChange = true;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    internalChange = false;
    search("", "clear");
    input.focus();
    emit(element, "clear", { value: "" });
  }
  function keydown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); open(); activate(activeIndex + 1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); open(); activate(activeIndex - 1); }
    else if (event.key === "Home" && !list.hidden) { event.preventDefault(); activate(0); }
    else if (event.key === "End" && !list.hidden) { event.preventDefault(); activate(options().length - 1); }
    else if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); choose(options()[activeIndex]); }
    else if (event.key === "Escape") { event.preventDefault(); close(); }
    else if (event.key === "Tab") { if (element.hasAttribute("data-g-select-on-tab") && activeIndex >= 0) choose(options()[activeIndex]); else close(); }
  }
  function click(event) { const option = event.target.closest?.("[role='option'], .g-combobox-option"); if (option) { event.preventDefault(); choose(option); } }
  function outside(event) { if (!element.contains(event.target)) close(); }
  function clearClick(event) { event.preventDefault(); event.stopPropagation(); clear(); }
  function focus() { if (element.dataset.gOpenOnFocus !== "false") search(input.value, "focus"); }
  input.addEventListener("input", filter);
  input.addEventListener("keydown", keydown);
  input.addEventListener("focus", focus);
  list.addEventListener("pointerdown", click);
  clearButton?.addEventListener("click", clearClick);
  document.addEventListener("pointerdown", outside, true);
  list.hidden = true;
  input.setAttribute("aria-expanded", "false");
  element.classList.toggle("has-value", Boolean(input.value));
  if (clearButton) clearButton.hidden = !input.value || disabled() || input.readOnly;
  return { open, close, choose, clear, search, destroy: () => { input.removeEventListener("input", filter); input.removeEventListener("keydown", keydown); input.removeEventListener("focus", focus); list.removeEventListener("pointerdown", click); clearButton?.removeEventListener("click", clearClick); document.removeEventListener("pointerdown", outside, true); } };
}

function positionFloating(trigger, panel, requestedPlacement = "bottom-start") {
  const rect = trigger.getBoundingClientRect();
  const gap = Math.max(0,numeric(panel.style.getPropertyValue('--g-overlay-offset'),8));
  const boundary = Math.max(0,numeric(panel.style.getPropertyValue('--g-overlay-boundary'),8));
  panel.style.setProperty('--g-overlay-viewport-width',Math.max(0,window.innerWidth-boundary*2)+'px');
  panel.style.setProperty('--g-overlay-viewport-height',Math.max(0,window.innerHeight-boundary*2)+'px');
  const rtl = getComputedStyle(trigger).direction === "rtl";
  const aliases = {tl:'top-start',tr:'top-end',bl:'bottom-start',br:'bottom-end',lt:'left-start',lb:'left-end',rt:'right-start',rb:'right-end'};
  const requested = String(requestedPlacement || 'bottom-start').toLowerCase();
  // Arco abbreviations use physical left/right; long start/end names remain logical in RTL.
  const physical = aliases[requested];
  let [rawSide, rawAlign = 'center'] = (physical || requested).split('-');
  if (physical && rtl && ['top','bottom'].includes(rawSide)) rawAlign = rawAlign === 'start' ? 'end' : 'start';
  let side = rawSide === "start" ? (rtl ? "right" : "left") : rawSide === "end" ? (rtl ? "left" : "right") : rawSide;
  if (!["top", "bottom", "left", "right"].includes(side)) side = "bottom";
  const align = ["start", "center", "end"].includes(rawAlign) ? rawAlign : "start";

  // Filters, transforms and containment can make a fixed descendant use an
  // ancestor as its containing block. Probe that coordinate space so the
  // viewport coordinates below remain correct without moving the panel out of
  // its component tree.
  panel.style.position = "fixed";
  panel.style.inset = "0 auto auto 0";
  const origin = panel.getBoundingClientRect();
  panel.style.inset = "0 auto auto 100px";
  const horizontalProbe = panel.getBoundingClientRect();
  panel.style.inset = "100px auto auto 0";
  const verticalProbe = panel.getBoundingClientRect();
  const matrix = {
    a: (horizontalProbe.left - origin.left) / 100,
    b: (verticalProbe.left - origin.left) / 100,
    c: (horizontalProbe.top - origin.top) / 100,
    d: (verticalProbe.top - origin.top) / 100,
  };
  const determinant = matrix.a * matrix.d - matrix.b * matrix.c;
  const panelRect = origin;

  function coordinates(candidate) {
    let top;
    let left;
    if (candidate === "top" || candidate === "bottom") {
      top = candidate === "top" ? rect.top - panelRect.height - gap : rect.bottom + gap;
      if (align === "center") left = rect.left + (rect.width - panelRect.width) / 2;
      else if (align === "end") left = rtl ? rect.left : rect.right - panelRect.width;
      else left = rtl ? rect.right - panelRect.width : rect.left;
    } else {
      left = candidate === "left" ? rect.left - panelRect.width - gap : rect.right + gap;
      if (align === "center") top = rect.top + (rect.height - panelRect.height) / 2;
      else if (align === "end") top = rect.bottom - panelRect.height;
      else top = rect.top;
    }
    return { top, left };
  }

  let position = coordinates(side);
  if (side === "bottom" && position.top + panelRect.height > window.innerHeight - gap && rect.top >= panelRect.height + gap) side = "top";
  else if (side === "top" && position.top < gap && window.innerHeight - rect.bottom >= panelRect.height + gap) side = "bottom";
  else if (side === "right" && position.left + panelRect.width > window.innerWidth - gap && rect.left >= panelRect.width + gap) side = "left";
  else if (side === "left" && position.left < gap && window.innerWidth - rect.right >= panelRect.width + gap) side = "right";
  position = coordinates(side);
  const top = Math.max(boundary, Math.min(position.top, window.innerHeight - panelRect.height - boundary));
  const left = Math.max(boundary, Math.min(position.left, window.innerWidth - panelRect.width - boundary));
  const deltaLeft = left - origin.left;
  const deltaTop = top - origin.top;
  let topLayer=false;try{topLayer=panel.matches(':popover-open');}catch{}
  const localLeft = topLayer ? left : Math.abs(determinant) > 0.0001 ? (matrix.d * deltaLeft - matrix.b * deltaTop) / determinant : deltaLeft;
  const localTop = topLayer ? top : Math.abs(determinant) > 0.0001 ? (matrix.a * deltaTop - matrix.c * deltaLeft) / determinant : deltaTop;
  panel.style.inset = `${localTop}px auto auto ${localLeft}px`;
  const resolvedPlacement = `${side}-${align}`;
  if(panel.dataset.gPlacement !== resolvedPlacement)panel.dataset.gPlacement = resolvedPlacement;
  panel.style.setProperty("--g-floating-arrow-inline", `${Math.max(10, Math.min(panelRect.width - 18, rect.left + rect.width / 2 - left - 4))}px`);
  panel.style.setProperty("--g-floating-arrow-block", `${Math.max(10, Math.min(panelRect.height - 18, rect.top + rect.height / 2 - top - 4))}px`);
}

function createFloating(element, type) {
  if(element.hasAttribute('data-g-help-options'))return null;
  const trigger = element.querySelector(`[data-g-${type}-trigger]`) || element.previousElementSibling;
  const panel = element.querySelector(`[data-g-${type}-content]`) || element.querySelector(`.g-${type}, .g-${type}-rich, .g-help-${type}`) || element;
  if (!trigger || !panel) return null;
  const interactive = type === 'popover', confirmation = element.matches('.g-popconfirm') || panel.matches('.g-popconfirm');
  const initial = !panel.hidden, oldDescription = trigger.getAttribute('aria-describedby'), initialWidth = panel.style.width;
  const restorePanel = overlayAttributes(panel,['id','style','role','tabindex','aria-labelledby','aria-busy','popover','data-g-overlay-arrow','data-g-placement','data-g-overlay-custom-arrow','data-g-tooltip-mini']);
  const restoreTrigger = overlayAttributes(trigger,['id','aria-haspopup','aria-controls','aria-expanded','aria-describedby']);
  const entry = {element,panel,modal:false,dismiss:()=>{emit(element,'change',{value:false,open:false,reason:'ancestor'});apply(false,'ancestor');}};
  let opened = false, disposed = false, openTimer, closeTimer, frame, busy = false, restoringFocus = false, managedClasses = [], requestedReason = "controlled";
  const ownedButtons = new Set();
  panel.id ||= uid('g-'+type);
  panel.classList.add('g-'+type);
  if (confirmation) panel.classList.add('g-popconfirm');
  panel.tabIndex = -1;
  panel.setAttribute('role',interactive ? 'dialog' : 'tooltip');
  if (interactive) {
    trigger.setAttribute('aria-haspopup','dialog'); trigger.setAttribute('aria-controls',panel.id); trigger.setAttribute('aria-expanded','false');
    trigger.id ||= uid('g-floating-trigger');
    if (!panel.hasAttribute('aria-label') && !panel.hasAttribute('aria-labelledby')) panel.setAttribute('aria-labelledby',trigger.id);
  } else {
    const ids = new Set((oldDescription || '').split(/\s+/).filter(Boolean)); ids.add(panel.id); trigger.setAttribute('aria-describedby',[...ids].join(' '));
  }
  // overlay-options is a shared, serializable floating API. Authored slot nodes stay owned by the framework.
  let options = {}, optionsRaw, defaultConsumed = false;
  const generated = new Map(), customClasses = new Set(), customStyles = new Map();
  const optionNames = {trigger:'trigger',placement:'position',open:'popupVisible',disabled:'disabled',arrow:'showArrow',width:'width',height:'height','max-height':'maxHeight',offset:'popupOffset',boundary:'boundary','open-delay':'mouseEnterDelay','close-delay':'mouseLeaveDelay',keyboard:'closeOnEscape','outside-closable':'closeOnOutside',autofocus:'autoFocus','restore-focus':'restoreFocus','top-layer':'topLayer'};
  const configured = () => !confirmation && element.hasAttribute('data-g-overlay-options');
  function readOptions() {
    const raw = configured() ? element.getAttribute('data-g-overlay-options') : null;
    if (raw === optionsRaw) return;
    optionsRaw = raw; clearTimeout(openTimer); clearTimeout(closeTimer);
    if (raw === null) { options = {}; return; }
    try { const value = JSON.parse(raw); if (value && typeof value === 'object' && !Array.isArray(value)) options = value; } catch { /* Keep the last valid configuration during an incomplete update. */ }
  }
  function option(attribute, fallback) {
    const key = attribute.replace('data-g-overlay-',''), value = options[optionNames[key]];
    return value == null ? element.getAttribute(attribute) ?? fallback : value;
  }
  function flag(attribute,fallback=false) { const value=option(attribute,fallback); return value !== false && value !== 'false' && value != null; }
  function number(attribute,fallback) { const value=Number(option(attribute,fallback)); return Number.isFinite(value)?Math.max(0,value):fallback; }
  function contentOptions() {
    for (const part of (interactive?['title','content']:['content'])) {
      let node = generated.get(part);
      if (options[part] != null && String(options[part]) !== '') {
        if (!node && !panel.querySelector(':scope > .g-'+type+'-'+part) && (interactive || ![...panel.childNodes].some(n=>!generated.has('arrow')||n!==generated.get('arrow') ? n.nodeType===1 || n.nodeType===3&&n.textContent.trim() : false))) { node=document.createElement('div');node.className='g-'+type+'-'+part;generated.set(part,node);if(part==='title')panel.prepend(node);else panel.append(node); }
        if(node && node.textContent !== String(options[part]))node.textContent=String(options[part]);
      } else if(node) {node.remove();generated.delete(part);}
    }
    const nextClasses = new Set(typeof options.contentClass==='string'?options.contentClass.split(/\s+/).filter(Boolean):[]);
    for(const name of customClasses)if(!nextClasses.has(name)){panel.classList.remove(name);customClasses.delete(name);}
    for(const name of nextClasses)if(!panel.classList.contains(name)){panel.classList.add(name);customClasses.add(name);}
    const nextStyles = {...(!interactive&&typeof options.backgroundColor==='string'?{backgroundColor:options.backgroundColor}:{}),...(options.contentStyle && typeof options.contentStyle==='object' ? options.contentStyle : {})};
    for(const [name,value] of Object.entries(nextStyles)) {
      const key=name.startsWith('--')?name:name.replace(/[A-Z]/g,m=>'-'+m.toLowerCase());
      if(typeof value!=='string' && typeof value!=='number')continue;
      customStyles.set(key,panel.style.getPropertyValue(key));panel.style.setProperty(key,String(value));
    }
    let arrow=generated.get('arrow');
    if(configured()) {
      if(!arrow){arrow=document.createElement('span');arrow.setAttribute('aria-hidden','true');generated.set('arrow',arrow);panel.append(arrow);}
      const cls='g-popover-arrow'+(!interactive?' g-tooltip-arrow':'')+(typeof options.arrowClass==='string'?' '+options.arrowClass:'');if(arrow.className!==cls)arrow.className=cls;
      arrow.style.cssText='';if(!interactive&&typeof options.backgroundColor==='string')arrow.style.backgroundColor=options.backgroundColor;for(const [key,value]of Object.entries(options.arrowStyle||{}))if(typeof value==='string'||typeof value==='number')arrow.style.setProperty(key.startsWith('--')?key:key.replace(/[A-Z]/g,m=>'-'+m.toLowerCase()),String(value));
      if(!panel.hasAttribute('data-g-overlay-custom-arrow'))panel.setAttribute('data-g-overlay-custom-arrow','');
    }else if(arrow){arrow.remove();generated.delete('arrow');panel.removeAttribute('data-g-overlay-custom-arrow');}
  }
  readOptions();
  const controlled = () => typeof options.popupVisible==='boolean' || flag('data-g-overlay-controlled');
  const disabled = () => isDisabled(trigger) || flag('data-g-overlay-disabled') || element.matches('.is-disabled,[aria-disabled="true"]');
  const modes = () => {const value=option('data-g-overlay-trigger',configured()?'hover focus':interactive?'click':'hover focus');return (Array.isArray(value)?value.join(' '):String(value)).toLowerCase().split(/[\s,]+/);};
  const top = () => overlayStack.at(-1) === entry;
  const placement = () => {
    const variant = ['top','bottom','start','end','start-aligned','centered','end-aligned'].find(value=>element.classList.contains('g-tooltip-'+value));
    const tipPlacement = {'start-aligned':'top-start','centered':'top','end-aligned':'top-end'}[variant] || variant || 'top';
    return option('data-g-overlay-placement',configured()?'top':undefined) || (panel!==element?element.dataset.gPlacement:undefined) || trigger.dataset.gPlacement || (interactive?'bottom-start':tipPlacement);
  };
  function setBusy(value) {
    busy = Boolean(value); panel.setAttribute('aria-busy',String(busy));
    panel.querySelectorAll('[data-g-overlay-confirm],[data-g-overlay-cancel],[data-g-close]').forEach(button=>{if(busy&&!button.disabled){ownedButtons.add(button);button.disabled=true;}else if(!busy&&ownedButtons.delete(button))button.disabled=false;});
  }
  function syncStyles() {
    for(const [key,value] of customStyles) {panel.style.setProperty(key,value);customStyles.delete(key);}
    readOptions();
    if (panel !== element) {
      managedClasses.forEach(name=>panel.classList.remove(name));
      managedClasses = [...element.classList].filter(name=>name.startsWith('g-'+type+'-') || name.startsWith('g-popconfirm-'));
      panel.classList.add(...managedClasses);
    }
    panel.style.setProperty('--g-overlay-offset',String(number('data-g-overlay-offset',configured()?10:8)));
    panel.style.setProperty('--g-overlay-boundary',String(number('data-g-overlay-boundary',8)));
    for(const key of ['height','max-height']) {
      const value=option('data-g-overlay-'+key);
      if(value)panel.style.setProperty('--g-overlay-'+key,overlayLength(value));else panel.style.removeProperty('--g-overlay-'+key);
    }
    const width = option('data-g-overlay-width');
    if(width) panel.style.width = /^\d+(\.\d+)?$/.test(width) ? width+'px' : width; else if(initialWidth)panel.style.width=initialWidth;else panel.style.removeProperty('width');
    const arrow = String(flag('data-g-overlay-arrow',true));
    if(panel.dataset.gOverlayArrow!==arrow)panel.dataset.gOverlayArrow=arrow;
    if(!confirmation){contentOptions();if(!interactive)panel.setAttribute('data-g-tooltip-mini',String(options.mini===true));}
  }
  function position() { if(opened&&!disposed){syncStyles();positionFloating(trigger,panel,placement());const text=!interactive&&generated.get('content');if(text){if(text.scrollHeight>text.clientHeight+1)text.setAttribute('tabindex','0');else text.removeAttribute('tabindex');}} }
  function apply(value, reason = 'api') {
    if(disposed||value===opened)return;
    const restoreTooltipFocus=!interactive&&panel.contains(document.activeElement);
    clearTimeout(openTimer);clearTimeout(closeTimer);opened=value;
    panel.hidden=!value;
    if(interactive)trigger.setAttribute('aria-expanded',String(value));
    if(value){
      overlayStack.push(entry);syncStyles();panel.classList.add('is-open');panel.style.setProperty('--g-overlay-stack',String(1000+overlayStack.length*10));
      if(typeof panel.showPopover==='function'&&flag('data-g-overlay-top-layer',true)){panel.setAttribute('popover','manual');try{panel.showPopover();}catch{}}
      position();frame=requestAnimationFrame(()=>{position();if(opened&&interactive&&flag('data-g-overlay-autofocus',confirmation))(visibleFocusable(panel)[0]||panel).focus({preventScroll:true});});
      emit(element,'open',{source:trigger,reason});
    }else{
      setBusy(false);cancelAnimationFrame(frame);removeOverlayEntry(entry);try{panel.hidePopover?.();}catch{}panel.classList.remove('is-open');
      if((interactive||restoreTooltipFocus)&&['escape','confirm','cancel','button'].includes(reason)&&flag('data-g-overlay-restore-focus',true)&&trigger.isConnected){restoringFocus=true;try{trigger.focus({preventScroll:true});}finally{restoringFocus=false;}}
      emit(element,'close',{reason});
    }
  }
  function request(value, reason = 'api') {
    if(disposed||value===opened||value&&disabled()||!value&&busy)return;
    if(value?!emit(element,'beforeopen',{source:trigger,reason}):!emit(element,'beforeclose',{reason}))return;
    requestedReason=reason;
    if(!emit(element,'change',{value,open:value,reason}))return;
    if(!controlled())apply(value,reason);
  }
  function show(){request(true);}
  function hide(reason = 'api'){request(false,reason);}
  function toggle(){request(!opened,'trigger');}
  function complete(success = true,error = ''){if(disposed)return;setBusy(false);const output=panel.querySelector('[data-g-overlay-error]');if(output)output.textContent=error;if(success)hide('confirm');else emit(element,'error',{reason:'confirm',message:error});}
  function enter(){if(!modes().includes('hover'))return;clearTimeout(closeTimer);clearTimeout(openTimer);openTimer=setTimeout(()=>request(true,'hover'),number('data-g-overlay-open-delay',100));}
  function leave(event){if(!modes().includes('hover')||panel.contains(event.relatedTarget)||trigger.contains(event.relatedTarget))return;clearTimeout(openTimer);clearTimeout(closeTimer);closeTimer=setTimeout(()=>{if(panel.contains(document.activeElement)||(modes().includes('focus')&&trigger.contains(document.activeElement)))return;request(false,'leave');},number('data-g-overlay-close-delay',120));}
  function focus(){if(restoringFocus)return;clearTimeout(closeTimer);if(modes().includes('focus'))request(true,'focus');}
  function blur(event){if((modes().includes('focus')||modes().includes('hover'))&&!panel.contains(event.relatedTarget)&&!trigger.contains(event.relatedTarget))request(false,'blur');}
  function click(event){if(modes().includes('click')){event.preventDefault();toggle();}}
  function context(event){if(modes().includes('contextmenu')){event.preventDefault();request(true,'contextmenu');}}
  function outside(event){if(opened&&top()&&!element.contains(event.target)&&!panel.contains(event.target)&&!trigger.contains(event.target)&&flag('data-g-overlay-outside-closable',true))request(false,'outside');}
  function keydown(event){if(opened&&top()&&event.key==='Escape'&&flag('data-g-overlay-keyboard',true)){event.preventDefault();event.stopImmediatePropagation();request(false,'escape');}}
  function action(event){
    const button=event.target.closest('[data-g-overlay-confirm],[data-g-overlay-cancel],[data-g-close]');
    if(!button||!panel.contains(button)||(button.closest('[data-g-popover-content],[data-g-tooltip-content]')||button.closest('[data-g-popover],[data-g-tooltip]'))!==panel||busy||isDisabled(button))return;
    event.preventDefault();
    const confirm=button.hasAttribute('data-g-overlay-confirm'),cancel=button.hasAttribute('data-g-overlay-cancel');
    const asynchronous=confirm&&flag('data-g-overlay-async');
    if(asynchronous)setBusy(true);
    if((confirm||cancel)&&!emit(element,'action',{action:confirm?'confirm':'cancel',source:button})){if(asynchronous)setBusy(false);return;}
    if(!asynchronous)request(false,confirm?'confirm':cancel?'cancel':'button');
  }
  function sync(records=[]){if(disposed)return;syncStyles();const firstConfiguration=configured()&&!defaultConsumed;if(configured())defaultConsumed=true;if(records.some(record=>record.attributeName==='data-g-overlay-busy'))setBusy(flag('data-g-overlay-busy'));if(disabled()){if(opened)emit(element,'change',{value:false,open:false,reason:'disabled'});apply(false,'disabled');}else if(controlled()){apply(flag('data-g-overlay-open'),requestedReason);requestedReason='controlled';}else if(firstConfiguration){if(options.defaultPopupVisible===true)request(true,'initial');}position();}
  const observer=new MutationObserver(sync);
  observer.observe(element,{attributes:true,attributeFilter:['class','aria-disabled','data-g-overlay-options','data-g-overlay-open','data-g-overlay-controlled','data-g-overlay-disabled','data-g-overlay-busy','data-g-overlay-width','data-g-overlay-height','data-g-overlay-max-height','data-g-placement','data-g-overlay-placement','data-g-overlay-offset','data-g-overlay-boundary','data-g-overlay-arrow']});
  if(trigger!==element)observer.observe(trigger,{attributes:true,attributeFilter:['disabled','aria-disabled']});
  const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(position):null;resizeObserver?.observe(trigger);resizeObserver?.observe(panel);
  trigger.addEventListener('click',click);trigger.addEventListener('contextmenu',context);trigger.addEventListener('pointerenter',enter);trigger.addEventListener('pointerleave',leave);trigger.addEventListener('focusin',focus);trigger.addEventListener('focusout',blur);
  panel.addEventListener('pointerenter',enter);panel.addEventListener('pointerleave',leave);panel.addEventListener('focusout',blur);panel.addEventListener('click',action);
  document.addEventListener('pointerdown',outside,true);document.addEventListener('keydown',keydown);window.addEventListener('resize',position);window.addEventListener('scroll',position,true);
  panel.hidden=true;syncStyles();setBusy(flag('data-g-overlay-busy'));
  sync();if(!controlled()&&!configured()&&initial)queueMicrotask(()=>request(true,'initial'));
  return {open:show,close:hide,toggle,isOpen:()=>opened,reposition:position,setBusy,complete,destroy:()=>{disposed=true;clearTimeout(openTimer);clearTimeout(closeTimer);cancelAnimationFrame(frame);observer.disconnect();resizeObserver?.disconnect();removeOverlayEntry(entry);try{panel.hidePopover?.();}catch{}panel.removeAttribute('popover');panel.hidden=true;opened=false;panel.classList.remove('is-open');setBusy(false);trigger.setAttribute('aria-expanded','false');if(!interactive){if(oldDescription===null)trigger.removeAttribute('aria-describedby');else trigger.setAttribute('aria-describedby',oldDescription);}trigger.removeEventListener('click',click);trigger.removeEventListener('contextmenu',context);trigger.removeEventListener('pointerenter',enter);trigger.removeEventListener('pointerleave',leave);trigger.removeEventListener('focusin',focus);trigger.removeEventListener('focusout',blur);panel.removeEventListener('pointerenter',enter);panel.removeEventListener('pointerleave',leave);panel.removeEventListener('focusout',blur);panel.removeEventListener('click',action);document.removeEventListener('pointerdown',outside,true);document.removeEventListener('keydown',keydown);window.removeEventListener('resize',position);window.removeEventListener('scroll',position,true);for(const node of generated.values())node.remove();for(const name of customClasses)panel.classList.remove(name);restorePanel();restoreTrigger();}};
}

function createTour(element) {
  if(element.hasAttribute('data-g-help-options'))return null;
  const steps = [...element.querySelectorAll(".g-tour-step")];
  if (!steps.length) return null;
  if (!element.id) element.id = uid("g-tour");
  const startsOpen = !element.hidden || element.dataset.gStartOpen === "true";
  const progress = element.querySelector("[data-g-tour-progress], .g-tour-progress");
  const spotlight = document.createElement("div");
  spotlight.className = "g-spotlight";
  spotlight.hidden = true;
  spotlight.setAttribute("aria-hidden", "true");
  document.body.append(spotlight);
  element.setAttribute("role", element.getAttribute("role") || "dialog");
  element.setAttribute("aria-modal", "false");
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  let index = 0;
  let open = false;
  let trigger = null;

  function targetFor(step) {
    try { return step.dataset.gTarget ? document.querySelector(step.dataset.gTarget) : null; }
    catch { return null; }
  }

  function position() {
    if (!open) return;
    const step = steps[index];
    const target = targetFor(step);
    if (!target) {
      spotlight.hidden = true;
      element.style.position = "fixed";
      element.style.inset = "50% auto auto 50%";
      element.style.transform = "translate(-50%, -50%)";
      return;
    }
    const rect = target.getBoundingClientRect();
    const padding = Number(step.dataset.gSpotlightPadding || element.dataset.gSpotlightPadding || 6);
    spotlight.hidden = false;
    spotlight.style.inset = `${Math.max(0, rect.top - padding)}px auto auto ${Math.max(0, rect.left - padding)}px`;
    spotlight.style.inlineSize = `${Math.min(window.innerWidth, rect.width + padding * 2)}px`;
    spotlight.style.blockSize = `${Math.min(window.innerHeight, rect.height + padding * 2)}px`;
    element.style.transform = "none";
    positionFloating(target, element, step.dataset.gPlacement || element.dataset.gPlacement || "bottom-start");
  }

  function showStep(nextIndex, source = "api") {
    index = Math.max(0, Math.min(steps.length - 1, nextIndex));
    steps.forEach((step, stepIndex) => {
      step.hidden = stepIndex !== index;
      step.setAttribute("aria-hidden", String(stepIndex !== index));
    });
    if (progress) progress.textContent = `${index + 1} / ${steps.length}`;
    element.querySelectorAll("[data-g-tour-prev]").forEach((button) => { button.disabled = index === 0; });
    element.querySelectorAll("[data-g-tour-next]").forEach((button) => { button.textContent = index === steps.length - 1 ? (button.dataset.gFinishLabel || message("tour.finish")) : (button.dataset.gNextLabel || message("tour.next")); });
    requestAnimationFrame(position);
    emit(element, "change", { index, step: steps[index], source });
  }

  function openTour(source) {
    if (open) return;
    open = true;
    trigger = source instanceof HTMLElement ? source : document.activeElement;
    element.hidden = false;
    element.setAttribute("aria-hidden", "false");
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    document.addEventListener("keydown", keydown);
    showStep(Number(element.dataset.gInitialStep || 0), "open");
    emit(element, "open", { source });
  }

  function close(reason = "api") {
    if (!open) return;
    open = false;
    element.hidden = true;
    element.setAttribute("aria-hidden", "true");
    spotlight.hidden = true;
    window.removeEventListener("resize", position);
    window.removeEventListener("scroll", position, true);
    document.removeEventListener("keydown", keydown);
    trigger?.focus?.({ preventScroll: true });
    emit(element, "close", { reason, index });
  }

  function click(event) {
    if (event.target.closest("[data-g-tour-prev]")) showStep(index - 1, "previous");
    else if (event.target.closest("[data-g-tour-next]")) index === steps.length - 1 ? close("complete") : showStep(index + 1, "next");
    else if (event.target.closest("[data-g-tour-close], [data-g-tour-skip]")) close(event.target.closest("[data-g-tour-skip]") ? "skip" : "close");
  }
  function keydown(event) { if (event.key === "Escape" && element.dataset.gDismissible !== "false") close("escape"); }
  element.addEventListener("click", click);
  if (startsOpen) queueMicrotask(openTour);
  return { open: openTour, close, next: () => showStep(index + 1, "api"), previous: () => showStep(index - 1, "api"), go: (stepIndex) => showStep(stepIndex, "api"), isOpen: () => open, current: () => index, destroy: () => { close("destroy"); spotlight.remove(); element.removeEventListener("click", click); } };
}

function createCarousel(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  if(element.hasAttribute('data-g-commerce-options'))return null;
  if(element.hasAttribute('data-g-media-options'))return null;
  const owns = (item) => item?.closest("[data-g-carousel]") === element;
  const slides = [...element.querySelectorAll(".g-carousel-slide, [data-g-carousel-slide]")].filter(owns);
  const previous = [...element.querySelectorAll(".g-carousel-prev, [data-g-carousel-prev]")].find(owns);
  const next = [...element.querySelectorAll(".g-carousel-next, [data-g-carousel-next]")].find(owns);
  const dots = [...element.querySelectorAll(".g-carousel-dot, [data-g-carousel-dot]")].filter(owns);
  if (!slides.length) return null;
  let index = Math.max(0, slides.findIndex((slide) => slide.getAttribute("aria-hidden") !== "true"));
  let timer;
  const interval = Number(element.dataset.gInterval || 0);
  const dotHandlers = dots.map((dot, dotIndex) => [dot, () => go(dotIndex, "dot")]);
  element.setAttribute("aria-roledescription", "carousel");
  function go(nextIndex, source = "api") {
    if (!Number.isFinite(Number(nextIndex))) return;
    index = ((Math.trunc(Number(nextIndex)) % slides.length) + slides.length) % slides.length;
    element.style.setProperty("--g-slide-index", index);
    slides.forEach((slide, slideIndex) => { slide.setAttribute("aria-hidden", String(slideIndex !== index)); slide.inert = slideIndex !== index; });
    dots.forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === index)));
    emit(element, "change", { index, source });
  }
  function start() { clearInterval(timer); if (interval > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(index + 1, "auto"), interval); }
  function stop() { clearInterval(timer); }
  const prevClick = () => go(index - 1, "previous");
  const nextClick = () => go(index + 1, "next");
  function keydown(event) {
    if (!owns(event.target) || event.target.closest("input,textarea,select,[contenteditable='true']") || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const rtl = getComputedStyle(element).direction === "rtl";
    go(event.key === "Home" ? 0 : event.key === "End" ? slides.length - 1 : index + ((event.key === "ArrowRight") !== rtl ? 1 : -1), "keyboard");
  }
  if (!element.hasAttribute("tabindex")) element.tabIndex = 0;
  element.addEventListener("keydown", keydown);
  previous?.addEventListener("click", prevClick);
  next?.addEventListener("click", nextClick);
  dotHandlers.forEach(([dot, handler]) => dot.addEventListener("click", handler));
  const focusOut = (event) => { if (!element.contains(event.relatedTarget)) start(); };
  element.addEventListener("focusin", stop);
  element.addEventListener("focusout", focusOut);
  element.addEventListener("pointerenter", stop);
  element.addEventListener("pointerleave", start);
  go(index, "init");
  start();
  return { go, next: nextClick, previous: prevClick, start, stop, destroy: () => { stop(); previous?.removeEventListener("click", prevClick); next?.removeEventListener("click", nextClick); dotHandlers.forEach(([dot, handler]) => dot.removeEventListener("click", handler)); element.removeEventListener("keydown", keydown); element.removeEventListener("focusin", stop); element.removeEventListener("focusout", focusOut); element.removeEventListener("pointerenter", stop); element.removeEventListener("pointerleave", start); } };
}

function createSplitter(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const handle = element.querySelector(".g-split-handle, [role='separator']");
  const panels = [...element.querySelectorAll(":scope > .g-split-panel")];
  if (!handle || panels.length < 2) return null;
  const vertical = () => element.dataset.gOrientation === "vertical";
  handle.setAttribute("role", "separator");
  handle.tabIndex = 0;
  handle.setAttribute("aria-orientation", vertical() ? "horizontal" : "vertical");
  handle.setAttribute("aria-valuemin", "10");
  handle.setAttribute("aria-valuemax", "90");
  let activeMove = null;
  let activeUp = null;
  function setPercent(percent) {
    const value = Math.max(10, Math.min(90, percent));
    panels[0].style.flex = `0 0 ${value}%`;
    panels[1].style.flex = "1 1 0";
    handle.setAttribute("aria-valuenow", String(Math.round(value)));
    emit(element, "resize", { value });
  }
  function pointerDown(event) {
    event.preventDefault();
    handle.setPointerCapture?.(event.pointerId);
    handle.classList.add("is-dragging");
    const rect = element.getBoundingClientRect();
    activeMove = (moveEvent) => setPercent(vertical() ? (moveEvent.clientY - rect.top) / rect.height * 100 : (moveEvent.clientX - rect.left) / rect.width * 100);
    activeUp = () => { handle.classList.remove("is-dragging"); window.removeEventListener("pointermove", activeMove); window.removeEventListener("pointerup", activeUp); window.removeEventListener("pointercancel", activeUp); activeMove = null; activeUp = null; };
    window.addEventListener("pointermove", activeMove);
    window.addEventListener("pointerup", activeUp, { once: true });
    window.addEventListener("pointercancel", activeUp, { once: true });
  }
  function keydown(event) {
    const delta = event.shiftKey ? 10 : 2;
    const current = Number(handle.getAttribute("aria-valuenow") || 50);
    if (event.key === (vertical() ? "ArrowUp" : "ArrowLeft")) { event.preventDefault(); setPercent(current - delta); }
    else if (event.key === (vertical() ? "ArrowDown" : "ArrowRight")) { event.preventDefault(); setPercent(current + delta); }
    else if (event.key === "Home") { event.preventDefault(); setPercent(10); }
    else if (event.key === "End") { event.preventDefault(); setPercent(90); }
  }
  handle.addEventListener("pointerdown", pointerDown);
  handle.addEventListener("keydown", keydown);
  setPercent(Number(element.dataset.gSplit || 50));
  return { set: setPercent, destroy: () => { activeUp?.(); handle.removeEventListener("pointerdown", pointerDown); handle.removeEventListener("keydown", keydown); } };
}

function createCommerce(element) {if(element.hasAttribute("data-mo-delegate"))return null;if(!element.hasAttribute('data-g-commerce-options'))return null;const store=storeFor(element);for(const name of ['carousel','sku-selector','quantity-stepper','cart','coupon','saved-choice','dropdown']){store.get(name)?.destroy?.();store.delete(name);}const controller=createCommerceController(element,{emit});return {refresh:controller.refresh,setOptions:controller.setOptions,setValue:controller.setValue,getState:controller.getState,getTotals:controller.getTotals,setQuantity:controller.setQuantity,selectSku:controller.selectSku,request:controller.request,resolve:controller.resolve,cancel:controller.cancel,destroy:controller.destroy};}
function createManagedCms(element){if(!element.hasAttribute('data-g-cms-options'))return null;const c=createCmsController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,takeFiles:c.takeFiles,destroy:c.destroy};}
function createManagedMarketing(element){if(!element.hasAttribute('data-g-marketing-options'))return null;const c=createMarketingController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,getPrice:c.getPrice,next:c.next,previous:c.previous,destroy:c.destroy};}
function createManagedEnterprise(element){if(!element.hasAttribute('data-g-enterprise-options'))return null;const c=createEnterpriseController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,exportCsv:c.exportCsv,destroy:c.destroy};}
function createManagedSolution(element){if(!element.hasAttribute('data-g-solution-options'))return null;const c=createSolutionController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,setHost:c.setHost,destroy:c.destroy};}
function createManagedLegal(element){if(!element.hasAttribute('data-g-legal-options'))return null;const c=createLegalController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,exportData:c.exportData,setHost:c.setHost,destroy:c.destroy};}
function createManagedCommunication(element){if(!element.hasAttribute('data-g-communication-options'))return null;const c=createCommunicationController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,setHost:c.setHost,destroy:c.destroy};}
function createManagedWorkflow(element){if(!element.hasAttribute('data-g-workflow-options'))return null;const c=createWorkflowController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,next:c.next,previous:c.previous,validate:c.validate,setHost:c.setHost,destroy:c.destroy};}
function createManagedDesktop(element){if(!element.hasAttribute('data-g-desktop-options'))return null;const c=createDesktopController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,takeFiles:c.takeFiles,setHost:c.setHost,destroy:c.destroy};}
function createManagedMobile(element){if(!element.hasAttribute('data-g-mobile-options'))return null;const store=storeFor(element);for(const name of ['mobile-sheet','pull-refresh','infinite-load','swipe-actions','wheel-picker','tabs','clear-input','saved-choice','carousel','dialog','password-toggle','row-select','toast']){store.get(name)?.destroy?.();store.delete(name);}const c=createMobileController(element,{emit});return {refresh:c.refresh,setOptions:c.setOptions,setValue:c.setValue,getState:c.getState,request:c.request,resolve:c.resolve,cancel:c.cancel,open:c.open,close:c.close,next:c.next,previous:c.previous,takeCredentials:c.takeCredentials,runPasskey:c.runPasskey,getTotals:c.getTotals,destroy:c.destroy};}
function createAuth(element) {if(element.hasAttribute("data-mo-delegate"))return null;if(!element.hasAttribute('data-g-auth-options'))return null;const store=storeFor(element);for(const name of ['otp-input','password-strength','password-toggle','auth-timer','saved-choice','dropdown']){store.get(name)?.destroy?.();store.delete(name);}const controller=createAuthController(element,{emit});return {refresh:controller.refresh,setOptions:controller.setOptions,setValue:controller.setValue,getState:controller.getState,request:controller.request,resolve:controller.resolve,takeCredentials:controller.takeCredentials,runPasskey:controller.runPasskey,exportRecoveryCodes:controller.exportRecoveryCodes,cancel:controller.cancel,destroy:controller.destroy};}
function createManagedMedia(element) {if(!element.hasAttribute('data-g-media-options'))return null;const store=storeFor(element);for(const name of ['carousel','media-player']){store.get(name)?.destroy?.();store.delete(name);}const controller=createMediaController(element,{emit,init,destroy});return {refresh:controller.refresh,setOptions:controller.setOptions,setValue:controller.setValue,getState:controller.getState,getPlaybackState:controller.getPlaybackState,go:controller.go,next:controller.next,previous:controller.previous,open:controller.open,close:controller.close,start:controller.start,stop:controller.stop,play:controller.play,pause:controller.pause,seek:controller.seek,exportCrop:controller.exportCrop,retry:controller.retry,destroy:controller.destroy};}
function createAI(element) {
 if(!element.hasAttribute('data-g-ai-options'))return null;
 const store=storeFor(element);for(const name of ['ai-composer','ai-approval','ai-feedback','accordion','tabs','dropdown','prompt-fill','roving-nav']){store.get(name)?.destroy?.();store.delete(name);}
 const controller=createAIController(element,{emit});
 return {refresh:controller.refresh,setOptions:controller.setOptions,setValue:controller.setValue,getState:controller.getState,generate:controller.generate,stop:controller.stop,pause:controller.pause,resume:controller.resume,retry:controller.retry,decide:controller.decide,submitFeedback:controller.submitFeedback,destroy:controller.destroy};
}
function createHelp(element) {
 if(!element.hasAttribute('data-g-help-options'))return null;
 const store=storeFor(element);for(const name of ['tooltip','popover','accordion','saved-choice','tour']){store.get(name)?.destroy?.();store.delete(name);}
 const controller=createHelpController(element,{emit,createFloating,positionFloating});
 return {refresh:controller.refresh,setOptions:controller.setOptions,setValue:controller.setValue,getState:controller.getState,search:controller.search,open:controller.open,close:controller.close,go:controller.go,submit:controller.submit,cancel:controller.cancel,destroy:controller.destroy};
}
function createLayout(element) {
  if(!element.hasAttribute('data-g-layout-options')) return null;
  const controller=createLayoutController(element,{emit});
  return {refresh:controller.refresh,setOptions:controller.setOptions,getState:controller.getState,setValue:controller.setValue,toggle:controller.toggle,destroy:controller.destroy};
}

function createContent(element) {
  if(!element.hasAttribute('data-g-content-options')) return null;
  const store=storeFor(element);
  for(const name of ['dropzone','upload-manager','file-browser','media-player','editor-shell','revision-compare','autosave']){store.get(name)?.destroy?.();store.delete(name);}
  const controller=createContentController(element,{emit});
  return {setOptions:controller.setOptions,getState:controller.getState,refresh:controller.refresh,setValue:controller.setValue,select:controller.select,addFiles:controller.addFiles,upload:controller.upload,pauseUpload:controller.pauseUpload,cancel:controller.cancel,save:controller.save,copy:controller.copy,exportCrop:controller.exportCrop,play:controller.play,pause:controller.pause,seek:controller.seek,format:controller.format,findNext:controller.findNext,replace:controller.replace,destroy:controller.destroy};
}

function createInteraction(element) {
  if(!element.hasAttribute('data-g-interaction-options')) return null;
  const store=storeFor(element);
  for(const name of ['saved-choice','builder-list','row-select','transfer','picker','cascader','range-picker','split-pane','copy','fullscreen']){
    store.get(name)?.destroy?.();
    store.delete(name);
  }
  const controller=createInteractionController(element,{emit});
  return {setOptions:controller.setOptions,getState:controller.getState,refresh:controller.refresh,setValue:controller.setValue,select:controller.select,move:controller.move,reorder:controller.reorder,addRule:controller.addRule,removeRule:controller.removeRule,setRange:controller.setRange,load:controller.load,run:controller.run,cancel:controller.cancel,commit:controller.commit,undo:controller.undo,redo:controller.redo,copy:controller.copy,toggleFullscreen:controller.toggleFullscreen,destroy:controller.destroy};
}

function createDashboard(element) {
  const controller=createDashboardController(element,{emit,message});
  return {setOptions:controller.setOptions,getState:controller.getState,refresh:controller.refresh,setValue:controller.setValue,setFilter:controller.setFilter,reset:controller.reset,load:controller.load,cancel:controller.cancel,exportCsv:controller.exportCsv,destroy:controller.destroy};
}

function createDataDisplay(element) {
  const controller = createDataDisplayController(element, {emit,message,init,destroy});
  return {setOptions:controller.setOptions,getState:controller.getState,refresh:controller.refresh,select:controller.select,move:controller.move,setDate:controller.setDate,scrollTo:controller.scrollTo,exportCsv:controller.exportCsv,load:controller.load,cancel:controller.cancel,destroy:controller.destroy};
}

function createFoundationController(element){const c=createFoundation(element,{emit});if(!c)return null;return {setOptions:c.setOptions,refresh:c.refresh,getState:c.getState,value:c.value,increment:c.increment,decrement:c.decrement,add:c.add,remove:c.remove,resize:c.resize,focus:c.focus,scrollTo:c.scrollTo,destroy:c.destroy};}

function createTree(element) {
  if(element.hasAttribute("data-g-tree-options"))return createConfiguredTree(element,{emit,init,destroy});
  const owns = item => item?.closest('[data-g-tree]') === element;
  const all = () => [...element.querySelectorAll('[role="treeitem"]')].filter(owns);
  const disabled = item => isDisabled(element) || element.classList.contains('is-disabled') || isDisabled(item);
  const visible = item => {let parent=item.parentElement?.closest('[role="treeitem"]');while(parent&&owns(parent)){if(parent.getAttribute('aria-expanded')==='false')return false;parent=parent.parentElement?.closest('[role="treeitem"]');}return !item.closest('[hidden]');};
  const items = () => all().filter(item=>visible(item)&&!disabled(item));
  const key = item => item?.dataset.gTreeKey || item?.id;
  const controlled = () => element.hasAttribute('data-g-data-value');
  const multiple = () => element.dataset.gDataSelection==='multiple';
  element.setAttribute("role", "tree");
  function focusItem(item) { if(!owns(item)||disabled(item))return;all().forEach(node=>node.tabIndex=node===item?0:-1);item.focus(); }
  function refresh() {
    let values;try{values=JSON.parse(element.dataset.gDataValue);}catch{}
    const nodes=all();element.setAttribute('aria-multiselectable',String(multiple()));
    for(const item of nodes){item.id ||= uid('g-tree-item');const group=item.querySelector(':scope > [role="group"]');if(group){group.id ||= uid('g-tree-group');item.setAttribute('aria-controls',group.id);if(!item.hasAttribute('aria-expanded'))item.setAttribute('aria-expanded','false');group.hidden=item.getAttribute('aria-expanded')!=='true';}if(Array.isArray(values))item.setAttribute('aria-selected',String(values.map(String).includes(key(item))));else if(!item.hasAttribute('aria-selected'))item.setAttribute('aria-selected','false');}
    if(!multiple()){const chosen=nodes.filter(item=>item.getAttribute('aria-selected')==='true');chosen.slice(1).forEach(item=>item.setAttribute('aria-selected','false'));}
    const first=items().find(item=>item.tabIndex===0)||items()[0];nodes.forEach(item=>item.tabIndex=item===first?0:-1);
  }
  function expand(item,value=true) {if(!owns(item)||disabled(item)||!item.querySelector(':scope > [role="group"]'))return false;if(!emit(element,'beforechange',{item,value,reason:'expand'}))return false;item.setAttribute('aria-expanded',String(value));refresh();if(value)emit(element,'expand',{item});else{emit(element,'collapse',{item});if(item.contains(document.activeElement))focusItem(item);}return true;}
  function select(item) {if(!owns(item)||disabled(item)||element.dataset.gDataSelection==='none')return false;let keys=all().filter(item=>item.getAttribute('aria-selected')==='true').map(key);keys=multiple()?keys.includes(key(item))?keys.filter(value=>value!==key(item)):[...keys,key(item)]:[key(item)];if(!emit(element,'beforechange',{item,value:keys,reason:'select'}))return false;if(!controlled())all().forEach(node=>node.setAttribute('aria-selected',String(keys.includes(key(node)))));emit(element,'change',{item,keys,value:keys,controlled:controlled()});return true;}
  function keydown(event) {
    const item = event.target.closest("[role='treeitem']");
    if (!owns(item)||disabled(item)||event.target.matches('input,select,textarea')) return;
    const nodes = items();
    const index = nodes.indexOf(item);
    if (event.key === "ArrowDown") { event.preventDefault(); focusItem(nodes[index + 1] || nodes[0]); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusItem(nodes[index - 1] || nodes.at(-1)); }
    else if (event.key === "Home") { event.preventDefault(); focusItem(nodes[0]); }
    else if (event.key === "End") { event.preventDefault(); focusItem(nodes.at(-1)); }
    else if (event.key === (element.closest("[dir]")?.getAttribute("dir")==="rtl"?"ArrowLeft":"ArrowRight")) {
      if (item.getAttribute("aria-expanded") === "false") { event.preventDefault(); expand(item,true); }
      else { const child = item.querySelector(":scope > [role='group'] [role='treeitem']"); if (child) { event.preventDefault(); focusItem(child); } }
    }
    else if (event.key === (element.closest("[dir]")?.getAttribute("dir")==="rtl"?"ArrowRight":"ArrowLeft")) {
      if (item.getAttribute("aria-expanded") === "true") { event.preventDefault(); expand(item,false); }
      else { const parent = item.parentElement?.closest("[role='treeitem']"); if (parent) { event.preventDefault(); focusItem(parent); } }
    }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(item); }
    else if(event.key.length===1 && !event.ctrlKey && !event.metaKey){const next=[...nodes.slice(index+1),...nodes.slice(0,index+1)].find(node=>(node.querySelector('.g-tree-label')?.textContent || node.firstChild?.textContent || '').trim().toLocaleLowerCase().startsWith(event.key.toLocaleLowerCase()));if(next)focusItem(next);}
  }
  const click=event=>{const item=event.target.closest('[role="treeitem"]');if(!owns(item)||disabled(item)||event.target.matches('input,select,textarea,a'))return;if(event.target.closest('[data-g-tree-toggle]')){event.preventDefault();expand(item,item.getAttribute('aria-expanded')!=='true');}else{focusItem(item);select(item);}};
  const observer=new element.ownerDocument.defaultView.MutationObserver(()=>refresh());refresh();observer.observe(element,{subtree:true,childList:true,attributes:true,attributeFilter:['data-g-data-value','data-g-data-selection']});
  element.addEventListener("keydown", keydown);
  element.addEventListener('click',click);
  return {focus:focusItem,refresh,expand,select,value:()=>all().filter(item=>item.getAttribute('aria-selected')==='true').map(key),destroy:()=>{observer.disconnect();element.removeEventListener('keydown',keydown);element.removeEventListener('click',click);}};
}

function createDataGrid(element) {
  // Markup-only mode remains compatible. Data ownership starts only when the
  // consumer explicitly calls setOptions({ columns, rows/load }).
  let options = {}, rows = [], columns = [], selected = new Set(), page = 1;
  let pageSize = 20, sort = null, filter = "", total = 0, loading = false, error = "";
  let viewport, table, body, footer, managed = false, disposed = false, request = 0, abort;
  let originalChildren = null, scrollHandler = null;
  const focusIds = new WeakMap();
  const identify = (node, id) => { focusIds.set(node, JSON.stringify(id)); return node; };
  const make = (tag, text) => { const node = document.createElement(tag); if (text != null) node.textContent = String(text); return node; };
  const keyOf = (row) => row[options.rowKey || "id"];
  const safeField = (field) => typeof field === "string" && !["__proto__", "prototype", "constructor"].includes(field);
  const announce = (reason, extra = {}) => {
    const detail = { reason, ...getState(), ...extra };
    emit(element, "change", { reason: detail.reason, page: detail.page, pageSize: detail.pageSize, total: detail.total, sort: detail.sort, filter: detail.filter, selectedKeys: detail.selectedKeys, loading: detail.loading, error: detail.error, key: detail.key, field: detail.field, value: detail.value, previous: detail.previous, row: detail.row });
    options.onChange?.(detail);
  };
  const filteredRows = () => {
    if (options.mode === "server") return rows;
    const query = filter.trim().toLocaleLowerCase();
    const result = query ? rows.filter(row => columns.some(column => String(row[column.field] ?? "").toLocaleLowerCase().includes(query))) : [...rows];
    if (sort) {
      const column = columns.find(column => column.field === sort.field);
      const compare = new Intl.Collator(options.locale, { numeric: true, sensitivity: "base" });
      result.sort((a, b) => {
        const left = a[sort.field], right = b[sort.field];
        const value = column?.type === "number" ? numeric(left, 0) - numeric(right, 0) : compare.compare(String(left ?? ""), String(right ?? ""));
        return sort.direction === "desc" ? -value : value;
      });
    }
    return result;
  };
  function getState() {
    return { page, pageSize, total, sort: sort ? { ...sort } : null, filter, selectedKeys: [...selected], loading, error };
  }
  function refresh() {
    if (!managed || disposed) return;
    const focused = document.activeElement, focusId = focusIds.get(focused);
    const selection = focused?.selectionStart == null ? null : [focused.selectionStart, focused.selectionEnd];
    const filtered = filteredRows();
    total = options.mode === "server" ? total : filtered.length;
    if (options.mode !== "server") page = Math.max(1, Math.min(page, Math.max(1, Math.ceil(total / pageSize))));
    const pageRows = options.mode === "server" ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize);
    const rowHeight = Math.max(24, numeric(options.rowHeight, 40));
    const height = Math.max(rowHeight, numeric(options.height, 400));
    const virtual = options.virtual === true;
    const start = virtual ? Math.min(Math.max(0, pageRows.length - 1), Math.max(0, Math.floor(viewport.scrollTop / rowHeight) - 3)) : 0;
    const end = virtual ? Math.min(pageRows.length, start + Math.ceil(height / rowHeight) + 6) : pageRows.length;
    const head = make("thead"), header = make("tr"); header.setAttribute("role", "row");
    if (options.selectable) { const th = make("th", options.labels?.select || message("grid.select")); th.setAttribute("scope", "col"); header.append(th); }
    for (const column of columns) {
      const th = make("th"); th.setAttribute("role", "columnheader"); th.setAttribute("scope", "col");
      th.setAttribute("aria-sort", sort?.field === column.field ? sort.direction === "asc" ? "ascending" : "descending" : "none");
      if (column.sortable !== false) {
        const button = make("button", column.title || column.field); button.type = "button"; button.className = "g-btn g-btn-ghost";
        identify(button, ["sort", column.field]);
        button.addEventListener("click", () => setSort(column.field, sort?.field === column.field && sort.direction === "asc" ? "desc" : "asc")); th.append(button);
      } else th.textContent = column.title || column.field;
      header.append(th);
    }
    head.append(header); table.tHead?.remove(); table.prepend(head);
    body.replaceChildren();
    const span = columns.length + (options.selectable ? 1 : 0);
    const spacer = size => { if (size <= 0) return; const tr = make("tr"), td = make("td"); tr.setAttribute("aria-hidden", "true"); td.colSpan = span; td.style.cssText = `height:${size}px;padding:0;border:0`; tr.append(td); body.append(tr); };
    spacer(start * rowHeight);
    for (let index = start; index < end; index++) {
      const row = pageRows[index], key = keyOf(row), tr = make("tr");
      tr.setAttribute("role", "row"); tr.setAttribute("aria-rowindex", String((page - 1) * pageSize + index + 2));
      if (virtual) tr.style.height = `${rowHeight}px`;
      if (options.selectable) {
        tr.setAttribute("aria-selected", String(selected.has(key)));
        const td = make("td"), checkbox = make("input"); checkbox.type = "checkbox"; checkbox.checked = selected.has(key);
        td.setAttribute("role", "gridcell"); identify(checkbox, ["select", key]);
        checkbox.setAttribute("aria-label", `${options.labels?.select || message("grid.select")} ${key}`);
        checkbox.addEventListener("change", () => select(key, checkbox.checked)); td.append(checkbox); tr.append(td);
      }
      for (const column of columns) {
        const td = make("td"); td.setAttribute("role", "gridcell"); td.tabIndex = -1;
        if (column.editable) {
          const input = make("input"); input.type = column.type === "number" ? "number" : "text";
          identify(input, ["edit", key, column.field]);
          input.className = "g-input"; input.value = String(row[column.field] ?? "");
          input.setAttribute("aria-label", `${column.title || column.field} ${key}`);
          input.addEventListener("change", () => updateCell(key, column.field, column.type === "number" ? Number(input.value) : input.value)); td.append(input);
        } else td.textContent = String(column.format ? column.format(row[column.field], row) : row[column.field] ?? "");
        if (virtual) { td.style.height = `${rowHeight}px`; td.style.paddingBlock = "0"; td.style.whiteSpace = "nowrap"; td.style.overflow = "hidden"; }
        tr.append(td);
      }
      body.append(tr);
    }
    spacer((pageRows.length - end) * rowHeight);
    if (!pageRows.length) { const tr = make("tr"), td = make("td", error || (loading ? options.labels?.loading || message("grid.loading") : options.labels?.empty || message("grid.empty"))); td.colSpan = span; tr.append(td); body.append(tr); }
    table.setAttribute("aria-rowcount", String(total + 1)); table.setAttribute("aria-colcount", String(span));
    element.setAttribute("aria-busy", String(loading)); element.classList.toggle("is-loading", loading); element.classList.toggle("is-error", !!error); element.classList.toggle("is-empty", total === 0 && !loading);
    viewport.style.maxHeight = `${height}px`; viewport.style.overflow = "auto";
    footer.replaceChildren();
    const previous = make("button", options.labels?.previous || message("grid.previous")), next = make("button", options.labels?.next || message("grid.next"));
    identify(previous, ["page", "previous"]); identify(next, ["page", "next"]);
    previous.type = next.type = "button"; previous.className = next.className = "g-btn";
    previous.disabled = page <= 1 || loading; next.disabled = page * pageSize >= total || loading;
    previous.addEventListener("click", () => setPage(page - 1)); next.addEventListener("click", () => setPage(page + 1));
    footer.append(previous, make("span", ` ${page} / ${Math.max(1, Math.ceil(total / pageSize))} · ${total} `), next);
    const first = cells()[0]; if (first) first.tabIndex = 0;
    if (focusId) {
      const replacement = [...element.querySelectorAll("input,button")].find(node => focusIds.get(node) === focusId);
      if (replacement && !replacement.disabled) { replacement.focus({ preventScroll: true }); if (selection && replacement.setSelectionRange) replacement.setSelectionRange(...selection); }
    }
  }
  function setRows(next, count) {
    if (!Array.isArray(next)) throw new TypeError("DataGrid rows must be an array");
    const keys = new Set();
    for (const row of next) { const key = row && keyOf(row); if (!["string", "number"].includes(typeof key) || keys.has(key)) throw new TypeError("DataGrid requires unique string/number row keys"); keys.add(key); }
    rows = next.map(row => ({ ...row })); total = options.mode === "server" ? Math.max(0, numeric(count, rows.length)) : rows.length;
    refresh(); return getState();
  }
  async function load() {
    if (disposed || options.mode !== "server" || typeof options.load !== "function") { refresh(); return getState(); }
    abort?.abort(); abort = new AbortController(); const id = ++request;
    loading = true; error = ""; refresh();
    try {
      const result = await options.load({ page, pageSize, sort: sort ? { ...sort } : null, filter, signal: abort.signal });
      if (disposed || id !== request) return getState();
      loading = false; setRows(result.rows, result.total); announce("load");
    } catch (exception) {
      if (!disposed && id === request && !abort.signal.aborted) { loading = false; error = String(exception?.message || exception); refresh(); announce("error"); }
    }
    return getState();
  }
  function queryChanged(reason) { if (viewport) viewport.scrollTop = 0; refresh(); announce(reason); return options.mode === "server" ? load() : getState(); }
  function setPage(value, size = pageSize) { page = Math.max(1, Math.floor(numeric(value, 1))); pageSize = Math.max(1, Math.floor(numeric(size, 20))); return queryChanged("page"); }
  function setSort(field, direction = "asc") { if (field != null && !columns.some(column => column.field === field)) throw new TypeError("Unknown DataGrid column"); sort = field == null ? null : { field, direction: direction === "desc" ? "desc" : "asc" }; page = 1; return queryChanged("sort"); }
  function setFilter(value) { filter = String(value ?? ""); page = 1; return queryChanged("filter"); }
  function select(key, checked = true) { if (checked) selected.add(key); else selected.delete(key); refresh(); announce("selection"); return [...selected]; }
  function updateCell(key, field, value) {
    const column = columns.find(column => column.field === field), index = rows.findIndex(row => keyOf(row) === key);
    if (index < 0 || !column?.editable || !safeField(field) || field === (options.rowKey || "id")) throw new TypeError("DataGrid cell is not editable");
    if (column.type === "number" && !Number.isFinite(Number(value))) throw new TypeError("DataGrid number must be finite");
    if (column.type === "number") value = Number(value);
    const previous = rows[index][field]; rows[index] = { ...rows[index], [field]: value }; refresh();
    announce("edit", { key, field, value, previous, row: { ...rows[index] } }); return { ...rows[index] };
  }
  function setOptions(next) {
    if (disposed) throw new Error("DataGrid has been destroyed");
    if (!next || !Array.isArray(next.columns) || !next.columns.length || next.columns.some(column => !safeField(column.field))) throw new TypeError("DataGrid requires safe columns");
    if (new Set(next.columns.map(column => column.field)).size !== next.columns.length) throw new TypeError("DataGrid column fields must be unique");
    abort?.abort(); request++; loading = false; error = "";
    options = { ...next }; columns = next.columns.map(column => ({ ...column }));
    page = Math.max(1, Math.floor(numeric(next.page, 1))); pageSize = Math.max(1, Math.floor(numeric(next.pageSize, 20)));
    selected = new Set(next.selectedKeys || []); sort = next.sort || null; filter = String(next.filter || "");
    if (!managed) {
      originalChildren = [...element.childNodes]; element.replaceChildren();
      viewport = make("div"); viewport.setAttribute("data-g-grid-viewport", ""); table = make("table"); table.className = "g-table"; table.setAttribute("role", "grid");
      element.setAttribute("role", "region");
      table.setAttribute("aria-label", element.getAttribute("aria-label") || message("grid.label"));
      if (element.hasAttribute("aria-labelledby")) table.setAttribute("aria-labelledby", element.getAttribute("aria-labelledby"));
      body = make("tbody"); table.append(body); viewport.append(table); footer = make("div"); footer.className = "g-pagination";
      element.append(viewport, footer); managed = true;
      scrollHandler = () => { if (options.virtual) refresh(); }; viewport.addEventListener("scroll", scrollHandler);
    }
    setRows(next.rows || [], next.total); if (options.mode === "server" && options.load) void load(); return getState();
  }
  const cells = () => [...element.querySelectorAll("[role='gridcell'], [role='columnheader'], [role='rowheader']")].filter((cell) => cell.getClientRects().length > 0);
  element.setAttribute("role", "grid");
  function focusCell(cell) { cells().forEach((item) => { item.tabIndex = item === cell ? 0 : -1; }); cell?.focus(); }
  function keydown(event) {
    if (event.target.matches("input,textarea,select,button")) return;
    const cell = event.target.closest("[role='gridcell'], [role='columnheader'], [role='rowheader']");
    if (!cell) return;
    const row = cell.closest("[role='row']");
    const rowCells = [...row.querySelectorAll("[role='gridcell'], [role='columnheader'], [role='rowheader']")];
    const rows = [...element.querySelectorAll("[role='row']")];
    const columnIndex = rowCells.indexOf(cell);
    const rowIndex = rows.indexOf(row);
    let target;
    if (event.key === "ArrowRight") target = rowCells[columnIndex + 1];
    else if (event.key === "ArrowLeft") target = rowCells[columnIndex - 1];
    else if (event.key === "ArrowDown") target = rows[rowIndex + 1]?.querySelectorAll("[role='gridcell'], [role='columnheader'], [role='rowheader']")[columnIndex];
    else if (event.key === "ArrowUp") target = rows[rowIndex - 1]?.querySelectorAll("[role='gridcell'], [role='columnheader'], [role='rowheader']")[columnIndex];
    else if (event.key === "Home") target = event.ctrlKey ? cells()[0] : rowCells[0];
    else if (event.key === "End") target = event.ctrlKey ? cells().at(-1) : rowCells.at(-1);
    if (target) { event.preventDefault(); focusCell(target); }
  }
  const first = cells()[0];
  cells().forEach((cell) => { cell.tabIndex = cell === first ? 0 : -1; });
  element.addEventListener("keydown", keydown);
  const readOptions = () => {if(element.hasAttribute('data-g-grid-options')){const next=JSON.parse(element.dataset.gGridOptions);setOptions({...options,...next});}};
  const optionsObserver = new element.ownerDocument.defaultView.MutationObserver(readOptions);
  readOptions();optionsObserver.observe(element,{attributes:true,attributeFilter:['data-g-grid-options']});
  return { focus: focusCell, destroy: () => {
    disposed = true; request++; abort?.abort(); optionsObserver.disconnect();element.removeEventListener("keydown", keydown);
    if (scrollHandler) viewport.removeEventListener("scroll", scrollHandler);
    if (originalChildren) { element.replaceChildren(...originalChildren); element.setAttribute("role", "grid"); }
  }, refresh, setOptions, setRows, setPage, setSort, setFilter, select, getState, updateCell, load };
}

function createTableScroll(element) {
  const table = element.querySelector("table, [role='grid']");
  if (!table) return null;
  const originalRole = element.getAttribute("role");
  const originalTabIndex = element.getAttribute("tabindex");
  let managedRole = false;
  let managedTabIndex = false;
  let managedLabel = false;
  let frame = 0;
  const direction = () => getComputedStyle(element).direction;
  const maximum = () => Math.max(0, element.scrollWidth - element.clientWidth);
  function position() {
    const max = maximum();
    if (direction() !== "rtl") return Math.max(0, Math.min(max, element.scrollLeft));
    return Math.max(0, Math.min(max, Math.abs(element.scrollLeft)));
  }
  function scrollToPosition(value) {
    const next = Math.max(0, Math.min(maximum(), value));
    element.scrollLeft = direction() === "rtl" ? -next : next;
    schedule();
    return next;
  }
  function state() {
    const max = maximum();
    const current = position();
    const overflow = max > 1;
    return {
      overflow,
      atStart: !overflow || current <= 1,
      atEnd: !overflow || current >= max - 1,
      canScrollStart: overflow && current > 1,
      canScrollEnd: overflow && current < max - 1,
    };
  }
  function restoreAccessibility() {
    if (managedRole) {
      if (originalRole == null) element.removeAttribute("role"); else element.setAttribute("role", originalRole);
      managedRole = false;
    }
    if (managedTabIndex) {
      if (originalTabIndex == null) element.removeAttribute("tabindex"); else element.setAttribute("tabindex", originalTabIndex);
      managedTabIndex = false;
    }
    if (managedLabel) { element.removeAttribute("aria-label"); managedLabel = false; }
  }
  function update() {
    frame = 0;
    const next = state();
    element.classList.toggle("is-scrollable", next.overflow);
    element.classList.toggle("can-scroll-start", next.canScrollStart);
    element.classList.toggle("can-scroll-end", next.canScrollEnd);
    if (next.overflow) {
      if (!element.hasAttribute("role")) { element.setAttribute("role", "region"); managedRole = true; }
      if (!element.hasAttribute("aria-label") && !element.hasAttribute("aria-labelledby")) {
        element.setAttribute("aria-label", message("table.scrollLabel")); managedLabel = true;
      }
      if (!element.hasAttribute("tabindex")) { element.tabIndex = 0; managedTabIndex = true; }
    } else restoreAccessibility();
    return next;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  function keydown(event) {
    if (event.target !== element || event.altKey || event.ctrlKey || event.metaKey) return;
    const rtl = direction() === "rtl";
    const line = Math.max(48, Math.round(element.clientWidth * 0.12));
    const page = Math.max(line, Math.round(element.clientWidth * 0.8));
    let next = null;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = maximum();
    else if (event.key === "PageUp") next = position() - page;
    else if (event.key === "PageDown") next = position() + page;
    else if (event.key === "ArrowLeft") next = position() + (rtl ? line : -line);
    else if (event.key === "ArrowRight") next = position() + (rtl ? -line : line);
    if (next == null || !state().overflow) return;
    event.preventDefault();
    scrollToPosition(next);
  }
  const resizeObserver = typeof ResizeObserver === "function" ? new ResizeObserver(schedule) : null;
  resizeObserver?.observe(element); resizeObserver?.observe(table);
  const mutationObserver = typeof MutationObserver === "function" ? new MutationObserver(schedule) : null;
  mutationObserver?.observe(table, { childList: true, subtree: true, attributes: true });
  element.addEventListener("scroll", schedule, { passive: true });
  element.addEventListener("keydown", keydown);
  window.addEventListener("resize", schedule);
  update();
  return { update, state, destroy: () => {
    if (frame) cancelAnimationFrame(frame);
    resizeObserver?.disconnect(); mutationObserver?.disconnect();
    element.removeEventListener("scroll", schedule); element.removeEventListener("keydown", keydown); window.removeEventListener("resize", schedule);
    element.classList.remove("is-scrollable", "can-scroll-start", "can-scroll-end");
    restoreAccessibility();
  } };
}

function createTableDensity(element) {
  const scope = element.closest("[data-g-table-sort], [data-g-data-grid], [data-g-table-scope]") || element.parentElement;
  const table = targetById(element.dataset.gTableDensity) || scope?.querySelector(".g-table, [role='grid']");
  const controls = [...element.querySelectorAll("[data-g-value]")];
  if (!table || !controls.length) return null;
  let current = element.dataset.gCurrentDensity || controls.find((control) => control.getAttribute("aria-pressed") === "true")?.dataset.gValue || "standard";
  function set(value, focus = false, notify = true) {
    current = value === "compact" ? "compact" : "standard";
    element.dataset.gCurrentDensity = current;
    table.classList.toggle("g-table-compact", current === "compact");
    controls.forEach((control) => {
      const active = control.dataset.gValue === current;
      control.setAttribute("aria-pressed", String(active)); control.tabIndex = active ? 0 : -1;
      if (active && focus) control.focus();
    });
    if (notify) emit(element, "densitychange", { density: current, table });
    return current;
  }
  function click(event) { const control = event.target.closest("[data-g-value]"); if (control) set(control.dataset.gValue); }
  function keydown(event) {
    const control = event.target.closest("[data-g-value]"); if (!control) return;
    const index = controls.indexOf(control);
    const next = ["ArrowRight", "ArrowDown"].includes(event.key) ? controls[(index + 1) % controls.length]
      : ["ArrowLeft", "ArrowUp"].includes(event.key) ? controls[(index - 1 + controls.length) % controls.length]
      : event.key === "Home" ? controls[0] : event.key === "End" ? controls.at(-1) : null;
    if (next) { event.preventDefault(); set(next.dataset.gValue, true); }
  }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); set(current, false, false);
  return { set, value: () => current, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createFilterSummary(element) {
  const clearControl = element.querySelector(".g-filter-summary-clear, [data-g-clear-selection]");
  if (!clearControl) return null;
  function clear(focus = false) {
    const scope = element.closest("[data-g-table-scope], [data-g-data-filter], form, section") || element.parentElement;
    const input = scope?.querySelector("[data-g-filter-input], input[type='search']");
    const candidates = [...(scope?.querySelectorAll(focusableSelector) || [])].filter((item) => !element.contains(item) && item.tabIndex >= 0);
    const previous = candidates.filter((item) => item.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING).at(-1);
    const next = candidates.find((item) => item.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_PRECEDING);
    const focusTarget = input || previous || next;
    if (emit(element, "clear", { input })) {
      if(input){input.value='';input.dispatchEvent(new input.ownerDocument.defaultView.Event('input',{bubbles:true}));}
      element.hidden = true;
      if (focus) queueMicrotask(() => focusTarget?.focus({ preventScroll: true }));
    }
  }
  function show() { element.hidden = false; }
  const click = () => clear(true);
  clearControl.addEventListener("click", click);
  return { clear, show, destroy: () => clearControl.removeEventListener("click", click) };
}

function createTableSort(element) {
  const table = element.matches("table") ? element : element.querySelector("table");
  const body = table?.tBodies?.[0];
  const buttons = table ? [...table.querySelectorAll("[data-g-sort-key]")] : [];
  if (!body || !buttons.length) return null;
  const collator = new Intl.Collator(element.lang || document.documentElement.lang || undefined, { numeric: true, sensitivity: "base" });

  function valueFor(row, key, index, type) {
    const cell = row.querySelector(`[data-g-column="${CSS.escape(key)}"]`) || row.cells[index];
    const raw = cell?.dataset.gSortValue ?? cell?.textContent?.trim() ?? "";
    if (type === "number") return Number(String(raw).replace(/[^\d+-.]/g, "")) || 0;
    if (type === "date") return Date.parse(raw) || 0;
    return raw;
  }
  function sort(button, direction) {
    const key = button.dataset.gSortKey;
    const header = button.closest("th, [role='columnheader']");
    const headers = [...table.querySelectorAll("th, [role='columnheader']")];
    const index = headers.indexOf(header);
    const type = button.dataset.gSortType || "text";
    const rows = [...body.rows].filter((row) => !row.hasAttribute("data-g-detail-row") && !row.hasAttribute("data-g-group-row"));
    const details = new Map([...body.querySelectorAll("[data-g-detail-row]")].map((row) => [row.dataset.gDetailRow, row]));
    const stable = rows.map((row, order) => ({ row, order, value: valueFor(row, key, index, type) }));
    stable.sort((left, right) => {
      const result = type === "text" ? collator.compare(String(left.value), String(right.value)) : left.value - right.value;
      return (direction === "descending" ? -result : result) || left.order - right.order;
    });
    stable.forEach(({ row }) => {
      body.append(row);
      const detail = details.get(row.id);
      if (detail) body.append(detail);
    });
    headers.forEach((item) => item.setAttribute("aria-sort", item === header ? direction : "none"));
    buttons.forEach((item) => item.dataset.gSortDirection = item === button ? direction : "none");
    emit(element, "sort", { key, direction, type, button });
  }
  function click(event) {
    const button = event.target.closest("[data-g-sort-key]");
    if (!button || !element.contains(button)) return;
    const current = button.dataset.gSortDirection || button.closest("th, [role='columnheader']")?.getAttribute("aria-sort") || "none";
    sort(button, current === "ascending" ? "descending" : "ascending");
  }
  table.querySelectorAll("th, [role='columnheader']").forEach((header) => {
    if (header.querySelector("[data-g-sort-key]") && !header.hasAttribute("aria-sort")) header.setAttribute("aria-sort", "none");
  });
  element.addEventListener("click", click);
  return { sort, destroy: () => element.removeEventListener("click", click) };
}

function createRowSelect(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const master = element.querySelector("[data-g-select-all]");
  const boxes = () => [...element.querySelectorAll("[data-g-select-row]")].filter((box) => !box.disabled);
  const outputs = () => [...element.querySelectorAll("[data-g-selection-count]")];
  const totals = () => [...element.querySelectorAll("[data-g-selection-total]")];
  const summaries = () => [...element.querySelectorAll("[data-g-selection-summary], [data-g-batch-toolbar]")];
  let lastIndex = -1;

  function sync(reason = "api") {
    const items = boxes();
    const selected = items.filter((box) => box.checked);
    items.forEach((box) => {
      const row = box.closest("tr, [role='row'], .g-list-item, [data-g-selectable-row]");
      row?.classList.toggle("is-selected", box.checked);
      if (row?.matches("tr, [role='row'], [role='option'], [role='tab'], [role='treeitem']")) row.setAttribute("aria-selected", String(box.checked));
      else row?.removeAttribute("aria-selected");
    });
    if (master) {
      master.checked = items.length > 0 && selected.length === items.length;
      master.indeterminate = selected.length > 0 && selected.length < items.length;
    }
    outputs().forEach((output) => { output.textContent = String(selected.length); });
    totals().forEach((output) => { output.textContent = String(items.length); });
    summaries().forEach((summary) => { summary.hidden = selected.length === 0; });
    element.querySelectorAll("[data-g-selection-requires]").forEach((control) => { control.disabled = selected.length === 0; });
    emit(element, "selectionchange", { selected: selected.map((box) => box.value), count: selected.length, reason });
  }
  function change(event) {
    if (event.target === master) boxes().forEach((box) => { box.checked = master.checked; });
    if (event.target.matches?.("[data-g-select-row]")) lastIndex = boxes().indexOf(event.target);
    sync(event.target === master ? "all" : "item");
  }
  function click(event) {
    const action = event.target.closest?.("[data-g-select-all-action], [data-g-select-visible], [data-g-invert-selection], [data-g-clear-selection]");
    if (action) {
      event.preventDefault();
      if (action.hasAttribute("data-g-clear-selection")) boxes().forEach((item) => { item.checked = false; });
      else if (action.hasAttribute("data-g-invert-selection")) boxes().forEach((item) => { item.checked = !item.checked; });
      else if (action.hasAttribute("data-g-select-visible")) boxes().filter((item) => !item.closest("[hidden]")).forEach((item) => { item.checked = true; });
      else boxes().forEach((item) => { item.checked = true; });
      sync(action.hasAttribute("data-g-invert-selection") ? "invert" : action.hasAttribute("data-g-clear-selection") ? "clear" : "all-action");
      return;
    }
    const box = event.target.closest?.("[data-g-select-row]");
    if (!box || !event.shiftKey || lastIndex < 0) return;
    const items = boxes();
    const current = items.indexOf(box);
    if (current < 0) return;
    const [start, end] = [lastIndex, current].sort((a, b) => a - b);
    items.slice(start, end + 1).forEach((item) => { item.checked = box.checked; });
    sync("range");
  }
  element.addEventListener("change", change);
  element.addEventListener("click", click);
  sync("init");
  return {
    sync,
    clear: () => { boxes().forEach((box) => { box.checked = false; }); sync("clear"); },
    selectAll: () => { boxes().forEach((box) => { box.checked = true; }); sync("all-api"); },
    invert: () => { boxes().forEach((box) => { box.checked = !box.checked; }); sync("invert-api"); },
    selected: () => boxes().filter((box) => box.checked),
    destroy: () => { element.removeEventListener("change", change); element.removeEventListener("click", click); }
  };
}

function createTransfer(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const source = element.querySelector("[data-g-transfer-source]");
  const target = element.querySelector("[data-g-transfer-target]");
  if (!source || !target) return null;
  const optionSelector = "[data-g-transfer-option]";
  const options = (pane) => [...pane.querySelectorAll(optionSelector)];
  const enabled = (pane) => options(pane).filter((option) => { const input = option.querySelector("input[type='checkbox']"); return !isDisabled(option) && (!input || !isDisabled(input)); });
  const checked = (pane) => enabled(pane).filter((option) => option.querySelector("input[type='checkbox']")?.checked || option.getAttribute("aria-selected") === "true");
  function setChecked(option, value) {
    const input = option.querySelector("input[type='checkbox']");
    if (input) input.checked = value;
    if (input) option.removeAttribute("aria-selected");
    else { option.setAttribute("role", option.getAttribute("role") || "option"); option.setAttribute("aria-selected", String(value)); }
  }
  function sync(reason = "api") {
    [[source, "source"], [target, "target"]].forEach(([pane, name]) => {
      const list = options(pane);
      const count = element.querySelector(`[data-g-transfer-count="${name}"]`);
      const empty = pane.querySelector("[data-g-transfer-empty]");
      if (count) count.textContent = String(list.length);
      if (empty) empty.hidden = list.length !== 0;
    });
    element.querySelectorAll("[data-g-transfer-move]").forEach((button) => {
      const direction = button.dataset.gTransferMove;
      const from = direction.endsWith("target") ? source : target;
      button.disabled = direction.startsWith("all") ? enabled(from).length === 0 : checked(from).length === 0;
    });
    emit(element, "transferchange", { source: options(source).map((item) => item.dataset.gValue), target: options(target).map((item) => item.dataset.gValue), reason });
  }
  function move(direction) {
    const toTarget = direction.endsWith("target");
    const from = toTarget ? source : target;
    const to = toTarget ? target : source;
    const moving = direction.startsWith("all") ? enabled(from) : checked(from);
    moving.forEach((option) => { setChecked(option, false); to.append(option); });
    sync(direction);
    moving[0]?.focus?.();
  }
  function click(event) {
    const button = event.target.closest("[data-g-transfer-move]");
    if (button) { event.preventDefault(); move(button.dataset.gTransferMove); return; }
    const option = event.target.closest(optionSelector);
    if (option && !isDisabled(option) && !option.querySelector("input[type='checkbox']") && !event.target.matches("button,a")) { setChecked(option, option.getAttribute("aria-selected") !== "true"); sync("option"); }
  }
  function change(event) {
    const option = event.target.closest(optionSelector);
    if (option && !isDisabled(option) && !isDisabled(event.target)) { setChecked(option, event.target.checked); sync("option"); }
  }
  function input(event) {
    const field = event.target.closest("[data-g-transfer-search]");
    if (!field) return;
    const pane = field.dataset.gTransferSearch === "target" ? target : source;
    const query = field.value.normalize("NFKD").toLocaleLowerCase().trim();
    options(pane).forEach((option) => { option.hidden = Boolean(query) && !String(option.dataset.gFilterText || option.textContent).normalize("NFKD").toLocaleLowerCase().includes(query); });
  }
  function keydown(event) {
    const option = event.target.closest(optionSelector);
    if (!option || !(event.ctrlKey || event.metaKey)) return;
    if (event.key === "ArrowRight" && source.contains(option)) { event.preventDefault(); setChecked(option, true); move("selected-to-target"); }
    if (event.key === "ArrowLeft" && target.contains(option)) { event.preventDefault(); setChecked(option, true); move("selected-to-source"); }
  }
  element.addEventListener("click", click);
  element.addEventListener("change", change);
  element.addEventListener("input", input);
  element.addEventListener("keydown", keydown);
  sync("init");
  return { move, sync, values: () => options(target).map((item) => item.dataset.gValue), destroy: () => { element.removeEventListener("click", click); element.removeEventListener("change", change); element.removeEventListener("input", input); element.removeEventListener("keydown", keydown); } };
}

function createDatePicker(element) {
  const grid = element.querySelector("[data-g-date-picker-grid], .g-calendar-grid");
  const title = element.querySelector("[data-g-date-picker-title], .g-date-picker-title, .g-calendar-title");
  const status = element.querySelector("[data-g-date-picker-status], .g-date-picker-status");
  const output = element.querySelector("[data-g-date-picker-output], [data-g-picker-output]");
  const startOutput = element.querySelector("[data-g-date-picker-start]");
  const endOutput = element.querySelector("[data-g-date-picker-end]");
  if (!grid || !title) return null;

  const originalGrid = grid.innerHTML;
  const originalTitle = title.textContent;
  const originalStatus = status?.textContent || "";
  let disposed = false;
  const rangeMode = element.dataset.gDatePickerMode === "range" || element.classList.contains("is-range") || element.hasAttribute("data-g-picker-multiple");
  const locale = element.lang || document.documentElement.lang || runtimeLocale || "en";
  const firstDay = Math.min(6, Math.max(0, numeric(element.dataset.gDatePickerFirstDay, 1)));
  const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const parseDate = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(String(value || ""));
    if (!match) return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return localDate(date) === match[0] ? date : null;
  };
  const atStartOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const addDays = (date, amount) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
  const formatDate = (date) => new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" }).format(date);
  const formatFullDate = (date) => new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(date);
  const today = new Date();
  const todayValue = localDate(today);
  const minDate = parseDate(element.dataset.gDatePickerMin || output?.min || startOutput?.min);
  const maxDate = parseDate(element.dataset.gDatePickerMax || output?.max || endOutput?.max);
  const inBounds = (date) => (!minDate || date >= minDate) && (!maxDate || date <= maxDate);
  const initialValues = String(element.dataset.gDatePickerValue || output?.value || "").split("/").filter(Boolean);
  let start = parseDate(element.dataset.gDatePickerStart || startOutput?.value || initialValues[0]);
  let end = rangeMode ? parseDate(element.dataset.gDatePickerEnd || endOutput?.value || initialValues[1]) : null;
  let view = atStartOfMonth(start || end || today);
  let open = !element.hidden;

  if (!title.id) title.id = uid("g-date-picker-title");
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-labelledby", grid.getAttribute("aria-labelledby") || title.id);
  grid.setAttribute("aria-readonly", String(element.getAttribute("aria-readonly") === "true"));

  const values = () => [start, end].filter(Boolean).map(localDate);
  const selected = () => [...grid.querySelectorAll('.g-calendar-day[aria-selected="true"]')];
  const selectionText = () => {
    if (!start) return element.dataset.gDatePickerEmptyLabel || originalStatus;
    if (!rangeMode) return formatDate(start);
    return end ? `${formatDate(start)} – ${formatDate(end)}` : `${formatDate(start)} – …`;
  };
  function syncOutputs(reason, notify = true) {
    const current = values();
    const value = rangeMode ? current.join("/") : current[0] || "";
    const writeOutputs = () => {
      if (disposed) return;
      const currentOutput = element.querySelector("[data-g-date-picker-output], [data-g-picker-output]");
      const currentStartOutput = element.querySelector("[data-g-date-picker-start]");
      const currentEndOutput = element.querySelector("[data-g-date-picker-end]");
      if (currentOutput) { currentOutput.value = value; currentOutput.setAttribute("value", value); }
      if (currentStartOutput) { currentStartOutput.value = current[0] || ""; currentStartOutput.setAttribute("value", currentStartOutput.value); }
      if (currentEndOutput) { currentEndOutput.value = current[1] || ""; currentEndOutput.setAttribute("value", currentEndOutput.value); }
    };
    writeOutputs();
    element.dataset.gDatePickerValue = value;
    element.classList.toggle("is-single", !rangeMode && Boolean(start));
    element.classList.toggle("is-range", rangeMode && Boolean(start && end));
    element.classList.toggle("is-empty", !start);
    element.classList.toggle("is-partial", rangeMode && Boolean(start && !end));
    element.classList.toggle("is-complete", !rangeMode ? Boolean(start) : Boolean(start && end));
    if (status) status.textContent = selectionText();
    if (notify) emit(element, "pickerchange", { values: current, value, start: current[0] || "", end: current[1] || "", reason });
    queueMicrotask(writeOutputs);
  }
  function render(focusValue = "") {
    title.textContent = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(view);
    const fragment = document.createDocumentFragment();
    const headerRow = document.createElement("div");
    headerRow.className = "g-calendar-row";
    headerRow.setAttribute("role", "row");
    const weekdayBase = new Date(2024, 0, 7 + firstDay);
    for (let index = 0; index < 7; index += 1) {
      const weekdayDate = addDays(weekdayBase, index);
      const weekday = document.createElement("span");
      weekday.className = "g-calendar-weekday";
      weekday.setAttribute("role", "columnheader");
      weekday.setAttribute("aria-label", new Intl.DateTimeFormat(locale, { weekday: "long" }).format(weekdayDate));
      weekday.textContent = new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(weekdayDate);
      headerRow.append(weekday);
    }
    fragment.append(headerRow);
    const offset = (view.getDay() - firstDay + 7) % 7;
    const firstVisible = addDays(view, -offset);
    const activeValue = focusValue || (start && start.getFullYear() === view.getFullYear() && start.getMonth() === view.getMonth() ? localDate(start) : today.getFullYear() === view.getFullYear() && today.getMonth() === view.getMonth() ? todayValue : localDate(view));
    for (let week = 0; week < 6; week += 1) {
      const row = document.createElement("div");
      row.className = "g-calendar-row";
      row.setAttribute("role", "row");
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const date = addDays(firstVisible, week * 7 + dayIndex);
        const value = localDate(date);
        const isStart = Boolean(start && value === localDate(start));
        const isEnd = Boolean(end && value === localDate(end));
        const inRange = Boolean(rangeMode && start && end && date > start && date < end);
        const button = document.createElement("button");
        button.type = "button";
        button.className = ["g-calendar-day", date.getMonth() !== view.getMonth() && "is-outside", (date.getDay() === 0 || date.getDay() === 6) && "is-weekend", value === todayValue && "is-today", isStart && "is-range-start", isEnd && "is-range-end", inRange && "is-in-range"].filter(Boolean).join(" ");
        button.dataset.gDate = value;
        button.setAttribute("role", "gridcell");
        button.setAttribute("aria-label", formatFullDate(date));
        button.setAttribute("aria-selected", String(isStart || isEnd));
        if (value === todayValue) button.setAttribute("aria-current", "date");
        button.disabled = !inBounds(date) || element.getAttribute("aria-disabled") === "true";
        button.tabIndex = !button.disabled && value === activeValue ? 0 : -1;
        button.textContent = String(date.getDate());
        row.append(button);
      }
      fragment.append(row);
    }
    grid.replaceChildren(fragment);
    const previous = element.querySelector("[data-g-date-picker-previous]");
    const next = element.querySelector("[data-g-date-picker-next]");
    const previousMonthEnd = new Date(view.getFullYear(), view.getMonth(), 0);
    const nextMonthStart = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    if (previous) previous.disabled = Boolean(minDate && previousMonthEnd < minDate);
    if (next) next.disabled = Boolean(maxDate && nextMonthStart > maxDate);
    if (focusValue) queueMicrotask(() => grid.querySelector(`[data-g-date="${focusValue}"]:not(:disabled)`)?.focus());
  }
  function choose(dateOrDay, reason = "day") {
    if (element.getAttribute("aria-readonly") === "true" || element.getAttribute("aria-disabled") === "true") return values();
    const date = dateOrDay instanceof Element ? parseDate(dateOrDay.dataset.gDate) : dateOrDay instanceof Date ? dateOrDay : parseDate(dateOrDay);
    if (!date || !inBounds(date)) return values();
    if (!rangeMode) { start = date; end = null; }
    else if (!start || end) { start = date; end = null; }
    else if (date < start) { end = start; start = date; }
    else end = date;
    view = atStartOfMonth(date);
    syncOutputs(reason);
    render(localDate(date));
    return values();
  }
  function clear(reason = "clear") { start = null; end = null; syncOutputs(reason); render(); return values(); }
  function navigate(amount, reason = "navigation", focusDate = null) {
    const base = focusDate || view;
    const targetDay = Math.min(base.getDate(), new Date(base.getFullYear(), base.getMonth() + amount + 1, 0).getDate());
    const target = new Date(base.getFullYear(), base.getMonth() + amount, targetDay);
    view = atStartOfMonth(target);
    render(localDate(target));
    emit(element, "pickerchange", { values: values(), value: rangeMode ? values().join("/") : values()[0] || "", start: values()[0] || "", end: values()[1] || "", month: localDate(view).slice(0, 7), reason });
  }
  function preset(name) {
    const date = new Date(today);
    if (name === "tomorrow") date.setDate(date.getDate() + 1);
    else if (name === "next-week") date.setDate(date.getDate() + 7);
    else if (name === "clear") return clear("preset:clear");
    choose(date, `preset:${name || "today"}`);
  }
  function click(event) {
    const day = event.target.closest(".g-calendar-day[data-g-date]");
    if (day) { event.preventDefault(); choose(day); return; }
    if (event.target.closest("[data-g-date-picker-previous]")) { event.preventDefault(); navigate(-1, "previous-month"); return; }
    if (event.target.closest("[data-g-date-picker-next]")) { event.preventDefault(); navigate(1, "next-month"); return; }
    const presetButton = event.target.closest("[data-g-date-picker-preset]");
    if (presetButton) { event.preventDefault(); preset(presetButton.dataset.gDatePickerPreset); return; }
    if (event.target.closest("[data-g-date-picker-today]")) { event.preventDefault(); preset("today"); return; }
    if (event.target.closest("[data-g-date-picker-clear]")) { event.preventDefault(); clear(); return; }
    if (event.target.closest("[data-g-date-picker-apply]")) { event.preventDefault(); syncOutputs("apply"); }
  }
  function keydown(event) {
    const day = event.target.closest(".g-calendar-day[data-g-date]");
    if (!day || isDisabled(day)) return;
    const date = parseDate(day.dataset.gDate);
    let target = null;
    const rtl = getComputedStyle(element).direction === "rtl";
    if (event.key === "ArrowLeft") target = addDays(date, rtl ? 1 : -1);
    else if (event.key === "ArrowRight") target = addDays(date, rtl ? -1 : 1);
    else if (event.key === "ArrowUp") target = addDays(date, -7);
    else if (event.key === "ArrowDown") target = addDays(date, 7);
    else if (event.key === "Home") target = addDays(date, -((date.getDay() - firstDay + 7) % 7));
    else if (event.key === "End") target = addDays(date, 6 - ((date.getDay() - firstDay + 7) % 7));
    else if (event.key === "PageUp" || event.key === "PageDown") {
      const amount = event.key === "PageUp" ? -1 : 1;
      target = new Date(date.getFullYear(), date.getMonth() + amount, Math.min(date.getDate(), new Date(date.getFullYear(), date.getMonth() + amount + 1, 0).getDate()));
    } else return;
    event.preventDefault();
    if (!inBounds(target)) return;
    if (target.getMonth() !== view.getMonth() || target.getFullYear() !== view.getFullYear()) view = atStartOfMonth(target);
    render(localDate(target));
  }
  function openPicker() { open = true; element.hidden = false; element.setAttribute("aria-hidden", "false"); }
  function closePicker() { open = false; element.hidden = true; element.setAttribute("aria-hidden", "true"); }
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  syncOutputs("init", false);
  render();
  return {
    open: openPicker,
    close: closePicker,
    clear,
    selected,
    choose,
    refresh: () => { syncOutputs("refresh", false); render(); },
    destroy: () => {
      disposed = true;
      element.removeEventListener("click", click);
      element.removeEventListener("keydown", keydown);
      grid.innerHTML = originalGrid;
      title.textContent = originalTitle;
      if (status) status.textContent = originalStatus;
      element.hidden = !open;
    },
  };
}

function createPicker(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  if (element.classList.contains("g-date-picker")) return createDatePicker(element);
  const panel = element.querySelector("[data-g-picker-panel]");
  const trigger = element.querySelector("[data-g-picker-trigger]");
  const input = element.querySelector("[data-g-picker-input]");
  const valuesHost = element.querySelector("[data-g-picker-values]");
  const output = element.querySelector("[data-g-picker-output]");
  const options = () => [...element.querySelectorAll("[data-g-picker-option]")];
  const multiple = element.hasAttribute("data-g-picker-multiple");
  const treeMode = element.classList.contains("g-tree-select") || element.hasAttribute("data-g-picker-tree");
  const cascade = treeMode && element.hasAttribute("data-g-picker-cascade");
  if (!panel || (!trigger && !input) || !options().length) return null;
  const results = panel.querySelector(treeMode ? '[role="tree"]' : '[role="listbox"]') || panel;
  results.id ||= uid('g-picker-results');
  results.setAttribute('role', treeMode ? 'tree' : 'listbox');
  results.setAttribute('aria-multiselectable', String(multiple));
  const restoreInput = input ? overlayAttributes(input, ['role', 'aria-autocomplete', 'aria-haspopup', 'aria-controls', 'aria-expanded']) : () => {};
  if (input) {
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-haspopup', treeMode ? 'tree' : 'listbox');
    input.setAttribute('aria-controls', results.id);
  }
  let open = !panel.hidden;
  const groupFor = (option) => option.querySelector(":scope > [role='group']");
  const childrenOf = (option) => [...(groupFor(option)?.querySelectorAll(":scope > [data-g-picker-option]") || [])];
  const descendantsOf = (option) => [...(groupFor(option)?.querySelectorAll("[data-g-picker-option]") || [])];
  const parentOf = (option) => option.parentElement?.closest("[data-g-picker-option]") || null;
  const isVisible = (option) => {
    if (option.hidden) return false;
    for (let parent = parentOf(option); parent; parent = parentOf(parent)) if (parent.getAttribute("aria-expanded") === "false") return false;
    return true;
  };
  const allSelected = () => options().filter((option) => option.getAttribute("aria-selected") === "true");
  function selected() {
    const current = allSelected();
    if (!treeMode || !multiple || element.dataset.gTreeValueStrategy === "all") return current;
    if (element.dataset.gTreeValueStrategy === "parent") return current.filter((option) => !parentOf(option)?.matches('[aria-selected="true"]'));
    return current.filter((option) => !groupFor(option));
  }
  function setExpanded(option, value, reason = "api") {
    const group = groupFor(option);
    if (!group) return false;
    option.setAttribute("aria-expanded", String(value));
    group.hidden = !value;
    option.classList.toggle("is-expanded", value);
    emit(element, value ? "expand" : "collapse", { item: option, reason });
    return true;
  }
  function updateTreeParents(option) {
    for (let parent = parentOf(option); parent; parent = parentOf(parent)) {
      const children = childrenOf(parent).filter((child) => !isDisabled(child));
      if (!children.length) continue;
      const checked = children.filter((child) => child.getAttribute("aria-selected") === "true").length;
      const mixed = children.some((child) => child.getAttribute("aria-checked") === "mixed");
      const state = checked === children.length ? "true" : checked > 0 || mixed ? "mixed" : "false";
      parent.setAttribute("aria-checked", state);
      parent.setAttribute("aria-selected", String(state === "true"));
      parent.classList.toggle("is-indeterminate", state === "mixed");
    }
  }
  function sync(reason = "api") {
    if (treeMode && multiple) [...options()].reverse().forEach(updateTreeParents);
    const current = selected();
    options().forEach((option) => {
      const chosen = option.getAttribute("aria-selected") === "true";
      option.classList.toggle("is-selected", chosen);
      if (treeMode && multiple && option.getAttribute("aria-checked") !== "mixed") option.setAttribute("aria-checked", String(chosen));
    });
    if (output) {
      const value = multiple ? current.map((option) => option.dataset.gValue || option.textContent.trim()).join(",") : current[0]?.dataset.gValue || "";
      output.value = value;
      output.setAttribute("value", value);
    }
    element.querySelectorAll("[data-g-picker-count]").forEach((node) => { node.textContent = String(current.length); });
    if (valuesHost) {
      valuesHost.replaceChildren(...current.map((option) => {
        const chip = document.createElement("span"); chip.className = "g-picker-value"; chip.dataset.gValue = option.dataset.gValue || option.textContent.trim();
        const label = document.createElement("span"); label.className = "g-picker-value-label"; label.textContent = option.dataset.gLabel || option.querySelector(".g-picker-option-title")?.textContent || option.textContent.trim(); chip.append(label);
        if (multiple) { const remove = document.createElement("button"); remove.type = "button"; remove.className = "g-picker-value-remove"; remove.dataset.gPickerRemove = chip.dataset.gValue; remove.setAttribute("aria-label", message("picker.remove", { label: label.textContent })); remove.textContent = "×"; chip.append(remove); } return chip;
      }));
    }
    emit(element, "pickerchange", { values: current.map((option) => option.dataset.gValue), reason });
  }
  function setOpen(value, reason = "api") {
    open = value; panel.hidden = !open; element.classList.toggle("is-open", open); trigger?.setAttribute("aria-expanded", String(open)); input?.setAttribute("aria-expanded", String(open));
    if (open) queueMicrotask(() => input?.focus());
    emit(element, open ? "open" : "close", { reason });
  }
  function choose(option, reason = "option") {
    if (isDisabled(option)) return;
    const next = option.getAttribute("aria-selected") !== "true";
    if (!multiple) options().forEach((item) => item.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", String(next));
    if (cascade) descendantsOf(option).filter((item) => !isDisabled(item)).forEach((item) => { item.setAttribute("aria-selected", String(next)); item.setAttribute("aria-checked", String(next)); });
    if (treeMode && multiple) updateTreeParents(option);
    sync(reason); if (!multiple) setOpen(false, "selection");
  }
  function clear(reason = "clear") { options().forEach((option) => { option.setAttribute("aria-selected", "false"); if (treeMode && multiple) option.setAttribute("aria-checked", "false"); }); sync(reason); trigger?.focus(); }
  function click(event) {
    const remove = event.target.closest("[data-g-picker-remove]");
    if (remove) { const option = options().find((item) => (item.dataset.gValue || item.textContent.trim()) === remove.dataset.gPickerRemove); option?.setAttribute("aria-selected", "false"); sync("remove"); return; }
    if (event.target.closest("[data-g-picker-clear]")) { event.preventDefault(); clear(); return; }
    const toggle = event.target.closest("[data-g-tree-toggle]");
    if (toggle) { event.preventDefault(); event.stopPropagation(); const item = toggle.closest("[data-g-picker-option]"); if (item) setExpanded(item, item.getAttribute("aria-expanded") !== "true", "toggle"); return; }
    const option = event.target.closest("[data-g-picker-option]");
    if (option) { event.preventDefault(); choose(option); return; }
    if (event.target.closest("[data-g-picker-trigger]")) { const inputTarget = event.target.closest("[data-g-picker-input]"); if (!inputTarget) event.preventDefault(); setOpen(inputTarget ? true : !open, "trigger"); }
  }
  function filter() {
    const query = String(input?.value || "").normalize("NFKD").toLocaleLowerCase().trim(); let visible = 0;
    const matches = new Set(options().filter((option) => !query || String(option.dataset.gFilterText || option.querySelector(".g-tree-node-label")?.textContent || option.textContent).normalize("NFKD").toLocaleLowerCase().includes(query)));
    if (treeMode && query) [...matches].forEach((option) => { for (let parent = parentOf(option); parent; parent = parentOf(parent)) { matches.add(parent); setExpanded(parent, true, "search"); } });
    options().forEach((option) => { const match = matches.has(option); option.hidden = !match; if (match) visible += 1; });
    element.querySelectorAll("[data-g-picker-empty]").forEach((empty) => { empty.hidden = visible !== 0; });
    if (!open) setOpen(true, "input");
  }
  function keydown(event) {
    if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false, "escape"); trigger?.focus(); return; }
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End", "Enter", " "].includes(event.key)) return;
    const visible = options().filter((option) => isVisible(option) && !isDisabled(option)); if (!visible.length) return;
    const current = visible.indexOf(document.activeElement);
    if (treeMode && current >= 0 && event.key === "ArrowRight") { const item = visible[current]; const group = groupFor(item); if (group && item.getAttribute("aria-expanded") !== "true") { event.preventDefault(); setExpanded(item, true, "keyboard"); } else { const child = childrenOf(item).find((node) => !isDisabled(node)); if (child) { event.preventDefault(); child.focus(); } } return; }
    if (treeMode && current >= 0 && event.key === "ArrowLeft") { const item = visible[current]; if (groupFor(item) && item.getAttribute("aria-expanded") === "true") { event.preventDefault(); setExpanded(item, false, "keyboard"); } else { const parent = parentOf(item); if (parent) { event.preventDefault(); parent.focus(); } } return; }
    if ((event.key === "Enter" || event.key === " ") && current >= 0) { event.preventDefault(); choose(visible[current], "keyboard"); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); setOpen(true, "keyboard"); const index = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : event.key === "ArrowDown" ? (current + 1 + visible.length) % visible.length : (current - 1 + visible.length) % visible.length; visible[index].focus(); }
  }
  function outside(event) { if (open && !element.contains(event.target)) setOpen(false, "outside"); }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); input?.addEventListener("input", filter); document.addEventListener("pointerdown", outside);
  options().forEach((option) => { option.tabIndex = isDisabled(option) ? -1 : (option.tabIndex || -1); option.setAttribute("role", option.getAttribute("role") || (treeMode ? "treeitem" : "option")); if (!option.hasAttribute("aria-selected")) option.setAttribute("aria-selected", "false"); if (treeMode && groupFor(option)) setExpanded(option, option.getAttribute("aria-expanded") !== "false", "init"); });
  if (treeMode) panel.querySelector("[role='tree']")?.setAttribute("aria-multiselectable", String(multiple));
  sync("init"); setOpen(open, "init");
  return { open: () => setOpen(true), close: () => setOpen(false), clear, selected, choose, refresh: () => sync("refresh"), destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); input?.removeEventListener("input", filter); document.removeEventListener("pointerdown", outside); restoreInput(); } };
}

function createCascader(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const columns = () => [...element.querySelectorAll("[data-g-cascade-column]")];
  const output = element.querySelector("[data-g-cascade-output]");
  const path = element.querySelector("[data-g-cascade-path]");
  if (!columns().length) return null;
  function choose(option, reason = "option") {
    if (isDisabled(option)) return;
    const column = option.closest("[data-g-cascade-column]"); const index = columns().indexOf(column);
    [...column.querySelectorAll("[data-g-cascade-option]")].forEach((item) => { item.setAttribute("aria-current", String(item === option)); });
    columns().slice(index + 1).forEach((next) => { next.hidden = next.id !== option.dataset.gCascadeNext; });
    const values = columns().filter((item) => !item.hidden).map((item) => item.querySelector('[data-g-cascade-option][aria-current="true"]')).filter(Boolean);
    if (path) path.textContent = values.map((item) => item.dataset.gLabel || item.textContent.trim()).join(" / ");
    if (output) { const value = values.at(-1)?.dataset.gValue || ""; output.value = value; output.setAttribute("value", value); }
    emit(element, "cascadechange", { value: output?.value, path: values.map((item) => item.dataset.gValue), reason });
  }
  function click(event) { const option = event.target.closest("[data-g-cascade-option]"); if (option) { event.preventDefault(); choose(option); } }
  function keydown(event) { const option = event.target.closest("[data-g-cascade-option]"); if (!option || isDisabled(option)) return; if (["Enter", " ", "ArrowRight"].includes(event.key)) { event.preventDefault(); choose(option, "keyboard"); const next = option.dataset.gCascadeNext && targetById(option.dataset.gCascadeNext); [...(next?.querySelectorAll("[data-g-cascade-option]") || [])].find((item) => !isDisabled(item))?.focus(); } if (event.key === "ArrowLeft") { event.preventDefault(); const column = option.closest("[data-g-cascade-column]"); const previous = columns()[Math.max(0, columns().indexOf(column) - 1)]; [...(previous?.querySelectorAll('[data-g-cascade-option][aria-current="true"], [data-g-cascade-option]') || [])].find((item) => !isDisabled(item))?.focus(); } }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown);
  return { choose, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createRangePicker(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const inputs = [...element.querySelectorAll("input[type='date'], input[type='time'], input[type='datetime-local']")];
  if (inputs.length < 2) return null;
  const [startInput, endInput] = inputs;
  const applyControls = [...element.querySelectorAll("[data-g-range-apply]")];
  const localDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  function value() {
    const start = startInput.value;
    const end = endInput.value;
    return { start, end, valid: !start || !end || start <= end, inputs };
  }
  function sync(reason = "input", notify = true) {
    const next = value();
    if (startInput.value) endInput.min = startInput.value; else endInput.removeAttribute("min");
    endInput.setAttribute("aria-invalid", String(!next.valid));
    element.classList.toggle("is-invalid", !next.valid);
    if (reason !== "apply") element.classList.remove("is-applied");
    applyControls.forEach((control) => { control.disabled = !next.valid; });
    if (notify) emit(element, "rangechange", { start: next.start, end: next.end, valid: next.valid, inputs: next.inputs, reason });
    return next;
  }
  function set(start, end, reason = "api") {
    startInput.value = start || "";
    endInput.value = end || "";
    return sync(reason);
  }
  function clear(reason = "clear") { return set("", "", reason); }
  function preset(name) {
    if (startInput.getAttribute("type") !== "date") return;
    const end = new Date();
    const start = new Date(end);
    if (name === "last-7-days") start.setDate(end.getDate() - 6);
    else if (name === "this-month") start.setDate(1);
    set(localDate(start), localDate(end), `preset:${name}`);
  }
  function apply(reason = "apply") { const next = sync(reason); element.classList.toggle("is-applied", next.valid); return next; }
  function click(event) {
    const presetButton = event.target.closest("[data-g-range-preset]");
    if (presetButton) { event.preventDefault(); preset(presetButton.dataset.gRangePreset); return; }
    if (event.target.closest("[data-g-range-clear]")) { event.preventDefault(); clear(); }
    else if (event.target.closest("[data-g-range-apply]")) { event.preventDefault(); apply(); }
  }
  const change = () => sync("change");
  const input = () => sync("input");
  inputs.forEach((input) => input.addEventListener("change", change));
  inputs.forEach((control) => control.addEventListener("input", input));
  element.addEventListener("click", click);
  sync("init", false);
  return { set, clear, value, apply, destroy: () => { inputs.forEach((control) => { control.removeEventListener("change", change); control.removeEventListener("input", input); }); element.removeEventListener("click", click); } };
}

function createSavedChoice(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  if(element.hasAttribute('data-g-auth-options'))return null;
  if(element.hasAttribute('data-g-commerce-options'))return null;
  if(element.hasAttribute('data-g-help-options'))return null;
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const items = () => [...element.querySelectorAll("[data-g-saved-choice-item]")];
  if (!items().length) return null;
  const output = element.querySelector("[data-g-saved-choice-output]");
  const inputFor = (item) => item.querySelector("input[type='radio'], input[type='checkbox']");
  const disabled = (item) => { const input = inputFor(item); return isDisabled(item) || Boolean(input && isDisabled(input)); };
  const isSelected = (item) => inputFor(item)?.checked || item.getAttribute("aria-pressed") === "true" || item.getAttribute("aria-selected") === "true" || item.classList.contains("is-selected");
  function setSelected(item, selected) {
    const input = inputFor(item);
    if (input) input.checked = selected;
    item.classList.toggle("is-selected", selected);
    if (item.matches("button, [role='button']")) item.setAttribute("aria-pressed", String(selected));
    else item.removeAttribute("aria-pressed");
    if (item.hasAttribute("aria-selected")) item.setAttribute("aria-selected", String(selected));
  }
  function select(item, reason = "option") { if (disabled(item)) return; const multiple = element.hasAttribute("data-g-multiple"); const next = multiple ? !isSelected(item) : true; if (!multiple) items().forEach((option) => { setSelected(option, false); option.tabIndex = -1; }); setSelected(item, next); item.tabIndex = 0; if (output) output.textContent = item.dataset.gConfirmation || ""; emit(element, "savedchoice", { values: items().filter(isSelected).map((option) => option.dataset.gValue), reason }); }
  function click(event) { const item = event.target.closest("[data-g-saved-choice-item]"); if (item) { event.preventDefault(); select(item); } }
  function keydown(event) {
    const item = event.target.closest("[data-g-saved-choice-item]");
    if (!item) return;
    if ((event.key === "Enter" || event.key === " ") && !item.matches("button, input, select, textarea")) {
      event.preventDefault(); select(item, "keyboard"); return;
    }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault(); const list = items().filter((option) => !disabled(option)); if (!list.length) return; const index = list.indexOf(item); const next = event.key === "Home" ? list[0] : event.key === "End" ? list.at(-1) : list[(index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + list.length) % list.length]; select(next, "keyboard"); next.focus();
  }
  const multiple = element.hasAttribute("data-g-multiple");
  const initialStates = new Map(items().map((item) => [item, isSelected(item)]));
  const selectedItems = items().filter((item) => initialStates.get(item));
  const initial = selectedItems.find((item) => !disabled(item)) || items().find((item) => !disabled(item));
  items().forEach((item) => { setSelected(item, multiple ? initialStates.get(item) : item === selectedItems[0]); item.tabIndex = item === initial ? 0 : -1; });
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); return { select, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createBuilderList(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const list = element.querySelector("[data-g-builder-items]"); const template = targetById(element.dataset.gBuilderTemplate); if (!list) return null;
  const formBuilder = element.classList.contains("g-form-builder");
  const output = element.querySelector("[data-g-builder-output]");
  const status = element.querySelector("[data-g-builder-status]");
  const empty = element.querySelector("[data-g-builder-empty]");
  const inspectorEmpty = element.querySelector("[data-g-builder-inspector-empty]");
  const inspectorBody = element.querySelector("[data-g-builder-inspector-body]");
  let selectedItem = null; let sequence = 0;
  const readOnly = () => element.dataset.gReadonly !== undefined || element.getAttribute("aria-readonly") === "true";
  const children = () => [...list.children].filter((item) => item.hasAttribute("data-g-builder-item"));
  const uniqueId = (preferred = "") => {
    const base = String(preferred || `field-${++sequence}`).replace(/[^a-zA-Z0-9_-]+/gu, "-").replace(/^-+|-+$/gu, "") || `field-${++sequence}`;
    let value = base; let suffix = 2;
    while (children().some((item) => item.dataset.gBuilderId === value)) value = `${base}-${suffix++}`;
    return value;
  };
  const definition = (item) => ({
    id: item.dataset.gBuilderId || "",
    type: item.dataset.gBuilderType || "text",
    label: item.dataset.gBuilderLabel || "",
    name: item.dataset.gBuilderName || "",
    placeholder: item.dataset.gBuilderPlaceholder || "",
    help: item.dataset.gBuilderHelp || "",
    required: item.dataset.gBuilderRequired === "true",
  });
  const setControlValue = (control, value) => {
    if (control.type === "checkbox") control.checked = Boolean(value);
    else control.value = value == null ? "" : String(value);
  };
  function render(item) {
    const value = definition(item);
    item.querySelectorAll("[data-g-builder-bind]").forEach((target) => {
      const key = target.dataset.gBuilderBind;
      if (key === "required") target.hidden = !value.required;
      else if (key in value) target.textContent = value[key] || target.dataset.gBuilderEmpty || "";
    });
    const control = item.querySelector("[data-g-builder-control]");
    if (control) {
      if (value.name) control.name = value.name; else control.removeAttribute("name");
      if ("placeholder" in control) control.placeholder = value.placeholder;
      control.required = value.required;
      const label = item.querySelector("label[data-g-builder-bind='label']");
      if (label) { if (!control.id) control.id = uid(`${value.id}-control`); label.htmlFor = control.id; }
      else if (!control.hasAttribute("aria-labelledby")) control.setAttribute("aria-label", value.label || value.name || "Field");
    }
  }
  function updateInspector() {
    const hasSelection = Boolean(selectedItem && selectedItem.isConnected);
    if (inspectorEmpty) inspectorEmpty.hidden = hasSelection;
    if (inspectorBody) inspectorBody.hidden = !hasSelection;
    const value = hasSelection ? definition(selectedItem) : {};
    element.querySelectorAll("[data-g-builder-property]").forEach((control) => {
      control.disabled = !hasSelection || isDisabled(element) || readOnly();
      setControlValue(control, value[control.dataset.gBuilderProperty]);
    });
  }
  function select(target, { focus = false } = {}) {
    const item = typeof target === "number" ? children()[target] : typeof target === "string" ? children().find((candidate) => candidate.dataset.gBuilderId === target) : target?.closest?.("[data-g-builder-item]") || target;
    if (!item || !list.contains(item) || isDisabled(element)) return false;
    selectedItem = item;
    children().forEach((candidate) => { const selected = candidate === item; candidate.removeAttribute("aria-selected"); candidate.setAttribute("aria-current", selected ? "true" : "false"); candidate.classList.toggle("is-selected", selected); candidate.tabIndex = selected ? 0 : -1; });
    element.classList.add("is-editing"); updateInspector();
    if (focus) item.focus({ preventScroll: true });
    return true;
  }
  function createField(value = {}) {
    const type = value.type || "text"; const item = document.createElement("section");
    item.className = "g-form-builder-field"; item.dataset.gBuilderItem = "";
    const header = document.createElement("header"); header.className = "g-form-builder-field-header";
    const badge = document.createElement("span"); badge.className = "g-form-builder-field-type"; badge.dataset.gBuilderBind = "type";
    const actions = document.createElement("span"); actions.className = "g-form-builder-field-actions";
    [["up", "↑"], ["down", "↓"], ["duplicate", "⧉"], ["remove", "×"]].forEach(([action, text]) => { const button = document.createElement("button"); button.type = "button"; button.className = "g-btn g-btn-ghost g-btn-sm"; button.dataset[`gBuilder${action[0].toUpperCase()}${action.slice(1)}`] = ""; button.setAttribute("aria-label", action); button.textContent = text; actions.append(button); });
    header.append(badge, actions);
    const body = document.createElement("div"); body.className = "g-form-builder-field-body";
    const label = document.createElement("label"); label.className = "g-label"; label.dataset.gBuilderBind = "label";
    let control;
    if (type === "textarea") control = document.createElement("textarea");
    else if (type === "select") { control = document.createElement("select"); ["Option 1", "Option 2"].forEach((text) => { const option = document.createElement("option"); option.textContent = text; control.append(option); }); }
    else { control = document.createElement("input"); control.type = ["email", "number", "date", "checkbox"].includes(type) ? type : "text"; }
    control.className = type === "select" ? "g-select" : type === "textarea" ? "g-textarea" : "g-input"; control.dataset.gBuilderControl = ""; control.tabIndex = -1;
    const help = document.createElement("small"); help.className = "g-help"; help.dataset.gBuilderBind = "help";
    body.append(label, control, help); item.append(header, body); return item;
  }
  function apply(item, patch = {}) {
    const current = definition(item); const next = { ...current, ...patch };
    if (!next.id || next.id !== current.id) next.id = uniqueId(next.id);
    item.dataset.gBuilderId = next.id; item.dataset.gBuilderType = next.type || "text";
    item.dataset.gBuilderLabel = next.label || ""; item.dataset.gBuilderName = next.name || "";
    item.dataset.gBuilderPlaceholder = next.placeholder || ""; item.dataset.gBuilderHelp = next.help || "";
    item.dataset.gBuilderRequired = String(Boolean(next.required)); item.setAttribute("aria-label", next.label || next.type || next.id); render(item); return item;
  }
  function schema() { return { version: 1, fields: children().map(definition) }; }
  function sync(reason = "api") {
    const items = children();
    items.forEach((item, index) => {
      item.dataset.gBuilderIndex = String(index);
      item.querySelectorAll("[data-g-builder-position]").forEach((output) => { output.textContent = String(index + 1); });
      item.querySelectorAll("[data-g-builder-up]").forEach((control) => { control.disabled = index === 0; });
      item.querySelectorAll("[data-g-builder-down]").forEach((control) => { control.disabled = index === items.length - 1; });
      if (formBuilder) { if (!item.dataset.gBuilderId) apply(item, { id: item.id, type: item.dataset.gBuilderType || "text", label: item.dataset.gBuilderLabel || item.querySelector("label")?.textContent?.trim() || "Field", name: item.dataset.gBuilderName || "", placeholder: item.dataset.gBuilderPlaceholder || "", help: item.dataset.gBuilderHelp || "", required: item.dataset.gBuilderRequired === "true" }); item.setAttribute("role", "listitem"); render(item); }
    });
    if (empty) empty.hidden = items.length > 0;
    element.classList.toggle("is-empty", items.length === 0); element.classList.toggle("is-dirty", !["init", "reset"].includes(reason));
    if (list.getAttribute("role") === null && formBuilder) list.setAttribute("role", "list");
    if (selectedItem && !selectedItem.isConnected) selectedItem = null;
    if (formBuilder && !selectedItem && items.length) select(items[0]); else updateInspector();
    const value = schema(); if (output) output.value = JSON.stringify(value);
    element.querySelectorAll("[data-g-builder-count]").forEach((target) => { target.textContent = String(items.length); });
    if (status) status.textContent = (element.dataset.gBuilderStatusTemplate || "{count}").replace("{count}", String(items.length));
    emit(element, "builderchange", { count: items.length, reason });
  }
  function add(value = {}, options = {}) {
    if (isDisabled(element) || readOnly()) return false;
    const normalized = typeof value === "string" ? { type: value } : value || {};
    const source = options.template || (options.control?.dataset.gBuilderTemplate ? targetById(options.control.dataset.gBuilderTemplate) : null) || [...element.querySelectorAll("template[data-g-builder-type]")].find((candidate) => candidate.dataset.gBuilderType === normalized.type) || template;
    const before = new Set(children());
    if (source) list.append(source.content ? source.content.cloneNode(true) : source.cloneNode(true));
    else if (formBuilder) list.append(createField(normalized));
    else return false;
    const item = children().find((candidate) => !before.has(candidate)); if (!item) return false;
    if (formBuilder) apply(item, { id: normalized.id, type: normalized.type || item.dataset.gBuilderType || "text", label: normalized.label || item.dataset.gBuilderLabel || options.control?.dataset.gBuilderLabel || normalized.type || "Field", name: normalized.name || item.dataset.gBuilderName || "", placeholder: normalized.placeholder || item.dataset.gBuilderPlaceholder || "", help: normalized.help || item.dataset.gBuilderHelp || "", required: normalized.required ?? item.dataset.gBuilderRequired === "true" });
    sync(options.reason || "add"); if (formBuilder) select(item, { focus: options.focus !== false }); else item.querySelector(focusableSelector)?.focus(); return item;
  }
  function update(target, patch = {}, reason = "update") { const item = typeof target === "undefined" ? selectedItem : typeof target === "string" ? children().find((candidate) => candidate.dataset.gBuilderId === target) : target; if (!item || !formBuilder || isDisabled(element) || readOnly()) return false; apply(item, patch); sync(reason); select(item); return definition(item); }
  function move(target, destination, reason = "move") {
    const items = children(); const item = typeof target === "number" ? items[target] : typeof target === "string" ? items.find((candidate) => candidate.dataset.gBuilderId === target) : target;
    if (!item || isDisabled(element) || readOnly()) return false;
    const index = items.indexOf(item); const nextIndex = destination === "up" ? index - 1 : destination === "down" ? index + 1 : Number(destination);
    if (!Number.isInteger(nextIndex) || nextIndex < 0 || nextIndex >= items.length || nextIndex === index) return false;
    if (nextIndex > index) list.insertBefore(item, items[nextIndex].nextElementSibling); else list.insertBefore(item, items[nextIndex]);
    sync(reason); if (formBuilder) select(item, { focus: true }); return true;
  }
  function remove(target = selectedItem) { const items = children(); const item = typeof target === "string" ? items.find((candidate) => candidate.dataset.gBuilderId === target) : target; if (!item || isDisabled(element) || readOnly()) return false; const index = items.indexOf(item); const next = items[index + 1] || items[index - 1] || null; item.remove(); selectedItem = null; sync("remove"); if (next) select(next, { focus: true }); else element.querySelector("[data-g-builder-add]")?.focus({ preventScroll: true }); return true; }
  function duplicate(target = selectedItem) { const item = typeof target === "string" ? children().find((candidate) => candidate.dataset.gBuilderId === target) : target; if (!item || !formBuilder) return false; const copy = add({ ...definition(item), id: "" }, { focus: false, reason: "duplicate" }); if (copy) { item.after(copy); sync("duplicate"); select(copy, { focus: true }); } return copy; }
  function load(value, options = {}) { if (!formBuilder || !value || !Array.isArray(value.fields) || isDisabled(element) || readOnly()) return false; list.replaceChildren(); selectedItem = null; value.fields.forEach((field) => add(field, { focus: false, reason: "load-item" })); sync(options.reason || "load"); if (options.select !== false && children()[0]) select(children()[0]); return schema(); }
  function click(event) {
    const control = event.target.closest("[data-g-builder-add], [data-g-builder-remove], [data-g-builder-up], [data-g-builder-down], [data-g-builder-duplicate]");
    if (!control) { const item = event.target.closest("[data-g-builder-item]"); if (formBuilder && item && element.contains(item)) select(item); return; }
    event.preventDefault(); if (control.hasAttribute("data-g-builder-add")) { add(control.dataset.gBuilderType || {}, { control }); return; }
    const item = control.closest("[data-g-builder-item]"); if (!item) return;
    if (control.hasAttribute("data-g-builder-remove") && !formBuilder) {
      const adjacent = item.nextElementSibling || item.previousElementSibling;
      const ordered = [...document.querySelectorAll(focusableSelector)].filter((candidate) => candidate.tabIndex >= 0 && !candidate.closest("[hidden]"));
      const controlIndex = ordered.indexOf(control);
      const outside = ordered.slice(controlIndex + 1).find((candidate) => !item.contains(candidate))
        || ordered.slice(0, controlIndex).reverse().find((candidate) => !item.contains(candidate));
      item.remove(); sync("remove");
      const focusTarget = adjacent?.querySelector(focusableSelector) || element.querySelector("[data-g-builder-add]") || outside;
      if (focusTarget) focusTarget.focus({ preventScroll: true });
      else { list.tabIndex = -1; list.focus({ preventScroll: true }); }
      return;
    }
    if (control.hasAttribute("data-g-builder-remove")) remove(item);
    else if (control.hasAttribute("data-g-builder-duplicate")) duplicate(item);
    else if (control.hasAttribute("data-g-builder-up")) move(item, "up");
    else if (control.hasAttribute("data-g-builder-down")) move(item, "down");
  }
  function input(event) { const control = event.target.closest("[data-g-builder-property]"); if (!control || !selectedItem) return; const key = control.dataset.gBuilderProperty; update(selectedItem, { [key]: control.type === "checkbox" ? control.checked : control.value }); }
  function keydown(event) { const item = event.target.closest("[data-g-builder-item]"); if (!formBuilder || !item || event.target !== item) return; if (event.altKey && ["ArrowUp", "ArrowDown"].includes(event.key)) { event.preventDefault(); move(item, event.key === "ArrowUp" ? "up" : "down", "keyboard"); } else if (["Enter", " "].includes(event.key)) { event.preventDefault(); select(item); } }
  element.addEventListener("click", click); element.addEventListener("input", input); element.addEventListener("change", input); element.addEventListener("keydown", keydown); sync("init");
  return { add, select, update, move, remove, duplicate, schema, load, items: () => children().map(definition), selected: () => selectedItem ? definition(selectedItem) : null, sync, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("input", input); element.removeEventListener("change", input); element.removeEventListener("keydown", keydown); } };
}

function createRowDisclosure(element) {
  const triggers = [...element.querySelectorAll("[data-g-row-toggle]")];
  if (!triggers.length) return null;
  function descendants(parent) { return [...element.querySelectorAll(`[data-g-parent="${CSS.escape(parent)}"]`)]; }
  function set(trigger, expanded, reason = "api") {
    if(!trigger || trigger.closest('[data-g-row-disclosure]')!==element || isDisabled(trigger) || isDisabled(element))return false;
    const value = trigger.dataset.gRowToggle;
    const candidate = targetById(value);
    const target = candidate && !candidate.contains(trigger) && element.contains(candidate) ? candidate : null;
    const children = target ? [target] : descendants(value);
    trigger.setAttribute("aria-expanded", String(expanded));
    if (target?.id) trigger.setAttribute("aria-controls", target.id);
    children.forEach((child) => {
      child.hidden = !expanded;
      child.setAttribute("aria-hidden", String(!expanded));
      if (!expanded && child.id) {
        descendants(child.id).forEach((nested) => { nested.hidden = true; nested.setAttribute("aria-hidden", "true"); });
      }
    });
    const visible = (row,seen=new Set()) => {
      const parentKey=row.dataset.gParent;if(!parentKey)return true;if(seen.has(parentKey))return false;seen.add(parentKey);
      const control=[...element.querySelectorAll('[data-g-row-toggle]')].find(button=>button.dataset.gRowToggle===parentKey);
      if(control?.getAttribute('aria-expanded')==='false')return false;
      const parent=element.querySelector('[id="'+CSS.escape(parentKey)+'"]');return !parent || visible(parent,seen);
    };
    for(const row of element.querySelectorAll('[data-g-parent]')){row.hidden=!visible(row);row.setAttribute('aria-hidden',String(row.hidden));}
    emit(element, "disclosure", { trigger, targets: children, expanded, reason });
  }
  function click(event) {
    const trigger = event.target.closest("[data-g-row-toggle]");
    if (trigger?.closest('[data-g-row-disclosure]')===element) set(trigger, trigger.getAttribute("aria-expanded") !== "true", "toggle");
  }
  function keydown(event) {
    const trigger = event.target.closest("[data-g-row-toggle]");
    if (trigger && event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") { event.preventDefault(); set(trigger, false, "escape"); trigger.focus(); }
  }
  triggers.forEach((trigger) => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    set(trigger, expanded, "init");
  });
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  return { set, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createColumnToggle(element) {
  const table = element.querySelector("table, [role='grid']");
  const toggles = [...element.querySelectorAll("[data-g-toggle-column]")];
  if (!table || !toggles.length) return null;
  function set(key, visible, source) {
    const active = toggles.filter((toggle) => toggle.dataset.gToggleColumn === key ? visible : toggle.checked);
    if (!visible && active.length === 0 && element.dataset.gAllowEmptyColumns !== "true") {
      if (source) source.checked = true;
      return false;
    }
    table.querySelectorAll(`[data-g-column="${CSS.escape(key)}"]`).forEach((cell) => {
      cell.hidden = !visible;
      cell.setAttribute("aria-hidden", String(!visible));
    });
    element.querySelectorAll(`[data-g-toggle-column="${CSS.escape(key)}"]`).forEach((toggle) => { toggle.checked = visible; });
    emit(element, "columnchange", { key, visible });
    return true;
  }
  function change(event) { if (event.target.matches("[data-g-toggle-column]")) set(event.target.dataset.gToggleColumn, event.target.checked, event.target); }
  toggles.forEach((toggle) => set(toggle.dataset.gToggleColumn, toggle.checked, toggle));
  element.addEventListener("change", change);
  return { set, destroy: () => element.removeEventListener("change", change) };
}

function createDataFilter(element) {
  const input = element.querySelector("[data-g-filter-input]") || (element.matches("input") ? element : null);
  const scope = targetById(element.dataset.gFilterTarget) || element;
  const items = () => [...scope.querySelectorAll("[data-g-filter-item]")];
  const empty = scope.querySelector("[data-g-filter-empty]");
  const output = element.querySelector("[data-g-filter-count]") || scope.querySelector("[data-g-filter-count]");
  if (!input || !items().length) return null;
  const normalize = (value) => String(value).normalize("NFKD").toLocaleLowerCase().trim();
  function filter(value = input.value) {
    const terms = normalize(value).split(/\s+/).filter(Boolean);
    let visible = 0;
    items().forEach((item) => {
      const haystack = normalize(item.dataset.gFilterText || item.textContent);
      const match = terms.every((term) => haystack.includes(term));
      item.hidden = !match;
      const related = item.id
        ? [...scope.querySelectorAll(`[data-g-detail-row="${CSS.escape(item.id)}"], [data-g-parent="${CSS.escape(item.id)}"]`)]
        : [];
      related.forEach((row) => {
        if (!match && !row.hasAttribute("data-g-filter-previous-hidden")) {
          row.dataset.gFilterPreviousHidden = String(row.hidden);
          row.hidden = true;
        } else if (match && row.hasAttribute("data-g-filter-previous-hidden")) {
          row.hidden = row.dataset.gFilterPreviousHidden === "true";
          delete row.dataset.gFilterPreviousHidden;
        }
      });
      if (match) visible += 1;
    });
    if (empty) empty.hidden = visible !== 0;
    if (output) output.textContent = String(visible);
    emit(element, "filter", { value, terms, count: visible });
    return visible;
  }
  const inputHandler = () => filter();
  input.addEventListener("input", inputHandler);
  filter();
  return { filter, clear: () => { input.value = ""; filter(); }, destroy: () => input.removeEventListener("input", inputHandler) };
}

function createDataView(element) {
  const owns = (item) => item.closest("[data-g-data-view]") === element;
  const segmented = element.classList.contains("g-segmented");
  const controls = () => [...element.querySelectorAll("[data-g-view], .g-segmented-item")].filter(owns);
  const panels = () => [...element.querySelectorAll("[data-g-view-panel]")].filter(owns);
  const input = [...element.querySelectorAll("[data-g-segmented-input], .g-segmented-input")].find(owns) || null;
  const disabled = (control) => isDisabled(element) || isDisabled(control);
  const loading = () => element.getAttribute("aria-busy") === "true" || element.classList.contains("is-loading");
  const valueOf = (control, index = controls().indexOf(control)) => control ? control.dataset.gView || control.dataset.gValue || control.getAttribute("value") || String(index) : "";
  const orientation = () => element.getAttribute("aria-orientation") || (element.classList.contains("g-segmented-vertical") ? "vertical" : "horizontal");
  const rtl = () => (element.closest("[dir]")?.getAttribute("dir") || document.documentElement.getAttribute("dir")) === "rtl";
  function normalize() {
    const items = controls();
    if (segmented) {
      element.setAttribute("role", element.getAttribute("role") || "radiogroup");
      element.setAttribute("aria-orientation", orientation());
    }
    items.forEach((control, index) => {
      control.dataset.gView ||= valueOf(control, index);
      if (!segmented) return;
      control.setAttribute("role", "radio");
      if (!control.hasAttribute("aria-checked")) control.setAttribute("aria-checked", control.getAttribute("aria-pressed") || "false");
      control.removeAttribute("aria-pressed");
    });
    return items;
  }
  function resolve(value) {
    const items = controls();
    if (typeof value === "number") return items[value] || null;
    if (typeof value === "string") return items.find((control, index) => valueOf(control, index) === value) || null;
    return items.includes(value) ? value : null;
  }
  function select(target, focus = false, reason = "api") {
    const item = resolve(target);
    if (!item || disabled(item) || (reason !== "init" && loading())) return null;
    const items = normalize();
    const previousItem = items.find((control) => control.getAttribute(segmented ? "aria-checked" : "aria-pressed") === "true") || null;
    const view = valueOf(item);
    element.dataset.gCurrentView = view;
    element.dataset.gValue = view;
    items.forEach((control) => {
      const active = control === item;
      if (segmented) control.setAttribute("aria-checked", String(active));
      else control.setAttribute("aria-pressed", String(active));
      control.classList.toggle("is-selected", active);
      control.tabIndex = active ? 0 : -1;
    });
    panels().forEach((panel) => { panel.hidden = panel.dataset.gViewPanel !== view; });
    if (input) input.value = view;
    if (focus) item.focus();
    if (previousItem !== item) emit(element, "viewchange", { view, value: view, item, previousItem, reason });
    return item;
  }
  function click(event) { const control = event.target.closest("[data-g-view], .g-segmented-item"); if (control && owns(control)) select(control, false, "pointer"); }
  function keydown(event) {
    const current = event.target.closest("[data-g-view], .g-segmented-item");
    if (!current || !owns(current)) return;
    if (event.key === " " && !current.matches("button, input, select, textarea")) {
      event.preventDefault(); select(current, true, "keyboard"); return;
    }
    const items = normalize().filter((control) => !disabled(control));
    if (!items.length) return;
    const index = items.indexOf(current);
    let next;
    const vertical = orientation() === "vertical";
    const forward = vertical ? "ArrowDown" : rtl() ? "ArrowLeft" : "ArrowRight";
    const backward = vertical ? "ArrowUp" : rtl() ? "ArrowRight" : "ArrowLeft";
    if (event.key === forward) next = items[(index + 1 + items.length) % items.length];
    else if (event.key === backward) next = items[(index - 1 + items.length) % items.length];
    else if (event.key === "Home") next = items[0];
    else if (event.key === "End") next = items.at(-1);
    else return;
    event.preventDefault(); select(next, true, "keyboard");
  }
  const items = normalize();
  if (!items.length) return null;
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  const initial = element.dataset.gCurrentView || input?.value || valueOf(items.find((control) => control.getAttribute("aria-checked") === "true" || control.getAttribute("aria-pressed") === "true" || control.classList.contains("is-selected"))) || valueOf(items.find((control) => !disabled(control)));
  select(initial, false, "init");
  return { select, value: () => element.dataset.gCurrentView || "", destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

const toastCallbacks = new WeakMap();

function createToast(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  let timer;
  let removeTimer;
  const timeout = Number(element.dataset.gTimeout ?? 5000);
  let remaining = Number.isFinite(timeout) ? Math.max(0,timeout) : 5000;
  let startedAt;
  let dismissed = false;
  const pauses = new Set();
  function dismiss(reason = "timeout", immediate = false) {
    if (dismissed || !emit(element, "dismiss", { reason })) return false;
    if (basicFlag(element,'data-g-feedback-controlled')) { clearTimeout(timer); return true; }
    dismissed = true;
    clearTimeout(timer);
    const remove = () => {
      const callback = toastCallbacks.get(element)?.onClose;
      element.remove();
      destroy(element);
      callback?.(reason, element);
      toastCallbacks.delete(element);
    };
    const reducedMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (immediate || reducedMotion) remove();
    else {
      element.classList.add("is-leaving");
      removeTimer = setTimeout(remove, 180);
    }
    return true;
  }
  function schedule() { clearTimeout(timer); if (pauses.size || remaining <= 0 || basicFlag(element,'data-g-persistent')) return; startedAt = Date.now(); timer = setTimeout(() => dismiss(), remaining); }
  function pause(reason = "api") { if (!pauses.size && startedAt) remaining = Math.max(0, remaining - (Date.now() - startedAt)); startedAt = null; pauses.add(reason); element.classList.add("is-paused"); clearTimeout(timer); }
  function resume(reason = "api") { pauses.delete(reason); if (!pauses.size) element.classList.remove("is-paused"); schedule(); }
  const pointerEnter = () => pause("pointer");
  const pointerLeave = () => resume("pointer");
  const focusIn = () => pause("focus");
  const focusOut = (event) => { if (!element.contains(event.relatedTarget)) resume("focus"); };
  const click = (event) => {
    if (!(event.target instanceof Element) || event.defaultPrevented || event.target.closest('.g-toast') !== element) return;
    const close=event.target.closest('[data-g-dismiss]'), action=event.target.closest('[data-g-toast-action]');
    if(close){event.preventDefault();event.stopPropagation();const restore=focusAfterRemoval(element,close);if(dismiss('button'))restore();}
    else if(action){event.preventDefault();event.stopPropagation();if(emit(element,'action',{trigger:action})){toastCallbacks.get(element)?.onAction?.(element);if(basicFlag(element,'data-g-action-close'))dismiss('action');}}
  };
  element.addEventListener('click',click);
  element.addEventListener("pointerenter", pointerEnter);
  element.addEventListener("pointerleave", pointerLeave);
  element.addEventListener("focusin", focusIn);
  element.addEventListener("focusout", focusOut);
  schedule();
  return { dismiss, pause, resume, destroy: () => { clearTimeout(timer); clearTimeout(removeTimer); element.removeEventListener('click',click); element.removeEventListener("pointerenter", pointerEnter); element.removeEventListener("pointerleave", pointerLeave); element.removeEventListener("focusin", focusIn); element.removeEventListener("focusout", focusOut); } };
}

function createCopy(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  async function copy() {
    const target = targetById(element.dataset.gCopy);
    const value = element.dataset.gCopyValue ?? target?.value ?? target?.textContent ?? "";
    try {
      const text = String(value);
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const fallback = document.createElement("textarea");
        fallback.value = text;
        fallback.setAttribute("readonly", "");
        fallback.style.cssText = "position:fixed;opacity:0;pointer-events:none";
        document.body.append(fallback);
        fallback.select();
        const copied = document.execCommand("copy");
        fallback.remove();
        if (!copied) throw new Error("Clipboard API is unavailable.");
      }
      element.dataset.gCopyState = "success";
      emit(element, "copy", { value: text });
    } catch (error) {
      element.dataset.gCopyState = "error";
      emit(element, "error", { action: "copy", error });
    }
  }
  element.addEventListener("click", copy);
  return { copy, destroy: () => element.removeEventListener("click", copy) };
}

function createFullscreen(element) {
  if(element.hasAttribute('data-g-interaction-options')) return null;
  const target = targetById(element.dataset.gFullscreen) || document.documentElement;
  async function toggle() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen?.();
      else if (target.requestFullscreen) await target.requestFullscreen();
      else throw new Error("Fullscreen API is unavailable.");
    } catch (error) { emit(element, "error", { action: "fullscreen", error }); }
  }
  function change() {
    const active = document.fullscreenElement === target;
    element.setAttribute("aria-pressed", String(active));
    emit(element, "fullscreenchange", { active, target });
  }
  element.setAttribute("aria-pressed", String(document.fullscreenElement === target));
  element.addEventListener("click", toggle);
  document.addEventListener("fullscreenchange", change);
  return { toggle, destroy: () => { element.removeEventListener("click", toggle); document.removeEventListener("fullscreenchange", change); } };
}

function createScrollTop(element) {
  const threshold = Number(element.dataset.gScrollThreshold || 320);
  function update() { element.hidden = window.scrollY < threshold; }
  function scroll() { window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }
  element.addEventListener("click", scroll);
  window.addEventListener("scroll", update, { passive: true });
  update();
  return { update, scroll, destroy: () => { element.removeEventListener("click", scroll); window.removeEventListener("scroll", update); } };
}

function createNavToggle(element) {
  if (element.matches(".g-collapsible-nav, .g-desktop-dock-panel, .g-desktop-inspector-panel, .g-desktop-bottom-panel")) {
    const triggerSelector = ".g-collapsible-nav-trigger, [data-g-collapsible-trigger], [data-g-panel-toggle]";
    const trigger = element.querySelector(triggerSelector);
    const target = element.querySelector(":scope > .g-collapsible-nav-body, :scope > .g-desktop-panel-body");
    if (!trigger || !target) return null;
    if (!trigger.id) trigger.id = uid("g-collapsible-nav-trigger");
    if (!target.id) target.id = uid("g-collapsible-nav-panel");
    const explicitState = element.getAttribute("data-g-nav-open");
    let open = explicitState == null ? !target.hidden && !element.classList.contains("is-collapsed") : explicitState === "true";
    const blocked = () => isDisabled(element) || element.getAttribute("aria-busy") === "true";
    const triggers = () => [...element.querySelectorAll(triggerSelector)];
    function sync(value) {
      open = value;
      element.dataset.gNavOpen = String(value);
      element.classList.toggle("is-expanded", value);
      element.classList.toggle("is-collapsed", !value);
      target.hidden = !value;
      target.setAttribute("aria-hidden", String(!value));
      target.setAttribute("role", target.getAttribute("role") || "region");
      target.setAttribute("aria-labelledby", target.getAttribute("aria-labelledby") || trigger.id);
      triggers().forEach((control) => {
        control.setAttribute("aria-controls", target.id);
        control.setAttribute("aria-expanded", String(value));
        const label = value ? control.dataset.gCloseLabel : control.dataset.gOpenLabel;
        if (label) control.setAttribute("aria-label", label);
      });
    }
    function show() {
      if (open || blocked() || !emit(element, "beforeopen", { trigger })) return;
      sync(true);
      if (trigger.dataset.gFocusFirst === "true" || element.dataset.gFocusFirst === "true") queueMicrotask(() => visibleFocusable(target)[0]?.focus({ preventScroll: true }));
      emit(element, "open", { trigger });
    }
    function hide(reason = "api") {
      if (!open || !emit(element, "beforeclose", { reason, trigger })) return;
      const activeInside = target.contains(document.activeElement);
      sync(false);
      if (reason === "escape" || activeInside) trigger.focus({ preventScroll: true });
      emit(element, "close", { reason, trigger });
    }
    function toggle() { if (blocked()) return; open ? hide("toggle") : show(); }
    function keydown(event) { if (event.key === "Escape" && open && (target.contains(event.target) || trigger.contains(event.target))) { event.preventDefault(); hide("escape"); } }
    function targetClick(event) { if (event.target.closest("[data-g-nav-close]")) hide("navigate"); }
    trigger.addEventListener("click", toggle);
    element.addEventListener("keydown", keydown);
    target.addEventListener("click", targetClick);
    sync(open);
    return { open: show, close: hide, toggle, isOpen: () => open, destroy: () => { trigger.removeEventListener("click", toggle); element.removeEventListener("keydown", keydown); target.removeEventListener("click", targetClick); } };
  }
  const target = targetById(element.dataset.gNavToggle);
  if (!target) return null;
  let closeTimer;
  if (!target.hasAttribute("data-g-nav-open")) target.dataset.gNavOpen = String(!target.hidden || target.classList.contains("is-open"));
  const isOpen = () => target.dataset.gNavOpen === "true";
  const triggers = () => [...document.querySelectorAll("[data-g-nav-toggle]")].filter((trigger) => trigger.dataset.gNavToggle?.replace(/^#/, "") === target.id);
  const syncExpanded = (value) => triggers().forEach((trigger) => {
    trigger.setAttribute("aria-expanded", String(value));
    const label = value ? trigger.dataset.gCloseLabel : trigger.dataset.gOpenLabel;
    if (label) trigger.setAttribute("aria-label", label);
  });
  element.setAttribute("aria-controls", target.id);
  element.setAttribute("aria-haspopup", element.getAttribute("aria-haspopup") || "true");
  syncExpanded(isOpen());
  target.setAttribute("aria-hidden", String(!isOpen()));

  function show() {
    if (isOpen() || !emit(target, "beforeopen", { trigger: element })) return;
    clearTimeout(closeTimer);
    target.dataset.gNavOpen = "true";
    target.hidden = false;
    target.setAttribute("aria-hidden", "false");
    syncExpanded(true);
    requestAnimationFrame(() => {
      target.classList.add("is-open");
      if (element.dataset.gFocusFirst === "true") visibleFocusable(target)[0]?.focus({ preventScroll: true });
    });
    document.addEventListener("keydown", keydown);
    if (element.dataset.gDismissOutside === "true") document.addEventListener("pointerdown", outside, true);
    emit(target, "open", { trigger: element });
  }
  function hide(reason = "api") {
    if (!isOpen() || !emit(target, "beforeclose", { reason, trigger: element })) return;
    target.dataset.gNavOpen = "false";
    target.classList.remove("is-open");
    target.setAttribute("aria-hidden", "true");
    syncExpanded(false);
    document.removeEventListener("keydown", keydown);
    document.removeEventListener("pointerdown", outside, true);
    closeTimer = window.setTimeout(() => { if (!isOpen()) target.hidden = true; }, 300);
    const activeInside = target.contains(document.activeElement);
    if (reason === "escape" || activeInside) (triggers().find((trigger) => !target.contains(trigger)) || element).focus({ preventScroll: true });
    emit(target, "close", { reason, trigger: element });
  }
  function toggle() { isOpen() ? hide("toggle") : show(); }
  function keydown(event) { if (event.key === "Escape") { event.preventDefault(); hide("escape"); } }
  function outside(event) { if (!target.contains(event.target) && !element.contains(event.target)) hide("outside"); }
  function targetClick(event) { if (event.target.closest("[data-g-nav-close]")) hide("navigate"); }
  function targetClose() {
    document.removeEventListener("keydown", keydown);
    document.removeEventListener("pointerdown", outside, true);
  }
  element.addEventListener("click", toggle);
  target.addEventListener("click", targetClick);
  target.addEventListener("gardener:close", targetClose);
  return { open: show, close: hide, toggle, isOpen, destroy: () => { clearTimeout(closeTimer); element.removeEventListener("click", toggle); target.removeEventListener("click", targetClick); target.removeEventListener("gardener:close", targetClose); targetClose(); } };
}

function createRovingNav(element) {
  if(element.hasAttribute('data-g-ai-options'))return null;
  const selector = ".g-nav-item, .g-nav-link, .g-primary-nav-link, .g-utility-nav-link, .g-subnav-link, .g-sidebar-link, .g-nav-rail-item, .g-activitybar-item, .g-activitybar-action, .g-menubar-item, .g-bottom-nav-item, .g-mobile-tab-item, .g-command-nav-item, [role='menuitem']";
  const menuBar = element.matches(".g-menubar");
  const owns = (item) => item.closest("[data-g-roving-nav]") === element && (!menuBar || (item.matches(".g-menubar-item") && item.closest(".g-menubar") === element));
  const candidates = () => [...element.querySelectorAll(selector)].filter(owns);
  const items = () => candidates().filter((item) => !isDisabled(item) && !item.hidden && !item.closest("[hidden]"));
  const vertical = () => element.matches(".g-nav-rail, .g-activitybar") || element.getAttribute("aria-orientation") === "vertical" || element.dataset.gOrientation === "vertical";
  function select(item, focus = false) {
    const nodes = items();
    if (!item || !nodes.includes(item)) return null;
    candidates().forEach((node) => { node.tabIndex = node === item ? 0 : -1; });
    if (element.dataset.gSelection === "true") {
      nodes.forEach((node) => node.setAttribute("aria-selected", String(node === item)));
      emit(element, "change", { item });
    }
    if (focus) item.focus({ preventScroll: true });
    return item;
  }
  function click(event) { const item = event.target.closest(selector); if (item && element.contains(item) && items().includes(item)) select(item); }
  function keydown(event) {
    const nodes = items();
    const rtl = getComputedStyle(element).direction === "rtl";
    const forward = vertical() ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    const backward = vertical() ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    if (menuBar && (event.key === forward || event.key === backward)) {
      const directItem = event.target.closest(".g-menubar-item");
      const menuOwner = directItem?.closest("[data-g-dropdown]") || event.target.closest("[data-g-dropdown]");
      const menuTrigger = directItem || menuOwner?.querySelector(":scope > .g-menubar-item[data-g-dropdown-trigger]");
      const menuIndex = nodes.indexOf(menuTrigger);
      if (menuIndex >= 0) {
        event.preventDefault();
        const offset = event.key === forward ? 1 : -1;
        const nextItem = nodes[(menuIndex + offset + nodes.length) % nodes.length];
        const ownerInstance = getInstance(menuOwner, "dropdown");
        const keepMenusOpen = !directItem || Boolean(ownerInstance?.isOpen?.());
        ownerInstance?.close(false, "menubar-switch");
        select(nextItem, true);
        if (keepMenusOpen) getInstance(nextItem.closest("[data-g-dropdown]"), "dropdown")?.open("first");
        return;
      }
    }
    const current = event.target.closest(selector);
    if (!current) return;
    const index = nodes.indexOf(current);
    if (index < 0 || !nodes.length) return;
    let next;
    if (event.key === forward) next = nodes[(index + 1 + nodes.length) % nodes.length];
    else if (event.key === backward) next = nodes[(index - 1 + nodes.length) % nodes.length];
    else if (event.key === "Home") next = nodes[0];
    else if (event.key === "End") next = nodes.at(-1);
    else return;
    event.preventDefault();
    select(next, true);
  }
  function refresh() {
    if (menuBar) {
      element.setAttribute("role", element.getAttribute("role") || "menubar");
      element.setAttribute("aria-orientation", element.getAttribute("aria-orientation") || "horizontal");
      candidates().forEach((item) => item.setAttribute("role", item.getAttribute("role") || "menuitem"));
    }
    const nodes = items();
    const initial = nodes.find((item) => item.getAttribute("tabindex") === "0") || nodes.find((item) => item.matches("[aria-current], [aria-selected='true'], .is-active")) || nodes[0];
    select(initial);
  }
  refresh();
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  element.addEventListener("gardener:open", refresh);
  return { select, refresh, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); element.removeEventListener("gardener:open", refresh); } };
}

function createContextMenu(element) {
  const target = element.querySelector("[data-g-context-target]") || element;
  const menu = element.querySelector("[data-g-context-menu-panel]") || element.querySelector(".g-context-menu");
  if (!menu || menu === target) return null;
  const startsOpen = !menu.hidden;
  let open = false;
  let previousFocus = null;
  let returnFocus = target;
  let lastPoint = null;
  let search = "";
  let searchTimer;
  let longPressTimer;
  let longPressPoint = null;
  let longPressTriggered = false;
  const itemSelector = ".g-context-menu-item, .g-menu-item, [role='menuitem'], [role='menuitemcheckbox'], [role='menuitemradio']";
  const allItems = () => [...menu.querySelectorAll(itemSelector)];
  const items = () => allItems().filter((item) => !isDisabled(item) && !item.hidden && !item.closest("[hidden]"));
  function focusItem(item) {
    if (!item) return;
    allItems().forEach((candidate) => { candidate.tabIndex = candidate === item ? 0 : -1; });
    item.focus({ preventScroll: true });
  }

  function normalize() {
    target.id ||= uid("g-context-target");
    if (!target.hasAttribute("role") && !target.matches("button, a[href], input, summary")) target.setAttribute("role", "button");
    menu.id ||= uid("g-context-menu");
    target.setAttribute("aria-haspopup", target.getAttribute("aria-haspopup") || "menu");
    target.setAttribute("aria-controls", menu.id);
    target.setAttribute("aria-expanded", open ? "true" : "false");
    if (!target.matches(focusableSelector) && !target.hasAttribute("tabindex")) target.tabIndex = 0;
    menu.setAttribute("role", menu.getAttribute("role") || "menu");
    if (!menu.hasAttribute("aria-label") && !menu.hasAttribute("aria-labelledby")) menu.setAttribute("aria-labelledby", target.id);
    allItems().forEach((item) => {
      item.setAttribute("role", item.getAttribute("role") || "menuitem");
      item.tabIndex = -1;
    });
  }

  function position(x, y) {
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft || 0;
    const viewportTop = viewport?.offsetTop || 0;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const margin = Math.max(0, numeric(element.dataset.gContextMargin, 8));
    const anchor = target.getBoundingClientRect();
    const pointX = Number.isFinite(Number(x)) ? Number(x) : anchor.left + 8;
    const pointY = Number.isFinite(Number(y)) ? Number(y) : anchor.top + 8;
    menu.style.inset = "auto";
    menu.style.left = `${Math.max(viewportLeft + margin, pointX)}px`;
    menu.style.top = `${Math.max(viewportTop + margin, pointY)}px`;
    const rect = menu.getBoundingClientRect();
    const maxLeft = viewportLeft + viewportWidth - rect.width - margin;
    const maxTop = viewportTop + viewportHeight - rect.height - margin;
    const left = Math.max(viewportLeft + margin, Math.min(pointX, maxLeft));
    const top = Math.max(viewportTop + margin, Math.min(pointY, maxTop));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.dataset.gHorizontalPlacement = left < pointX ? "end" : "start";
    menu.dataset.gVerticalPlacement = top < pointY ? "above" : "below";
    lastPoint = { x: pointX, y: pointY };
  }

  function reposition() { if (open && lastPoint) position(lastPoint.x, lastPoint.y); }

  function show(x, y, source = target, reason = "api") {
    if (isDisabled(element) || isDisabled(target) || element.getAttribute("aria-busy") === "true") return false;
    if (!open && !emit(element, "beforeopen", { source, reason })) return false;
    if (!open) {
      previousFocus = document.activeElement;
      returnFocus = target.matches(focusableSelector) ? target : previousFocus;
    }
    open = true;
    element.classList.add("is-open");
    target.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    position(x, y);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    focusItem(items()[0]);
    emit(element, "open", { source, x: lastPoint.x, y: lastPoint.y, reason, menu });
    return true;
  }

  function hide(reason = "api", restore = false) {
    if (!open || !emit(element, "beforeclose", { reason })) return false;
    open = false;
    element.classList.remove("is-open");
    target.setAttribute("aria-expanded", "false");
    menu.hidden = true;
    menu.setAttribute("aria-hidden", "true");
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", keydown);
    window.removeEventListener("resize", reposition);
    window.removeEventListener("scroll", reposition, true);
    clearTimeout(searchTimer);
    search = "";
    if (restore) returnFocus?.focus?.({ preventScroll: true });
    emit(element, "close", { reason, menu });
    return true;
  }

  function context(event) {
    if (menu.contains(event.target)) return;
    event.preventDefault();
    show(event.clientX || undefined, event.clientY || undefined, event.target, "contextmenu");
  }

  function targetKeydown(event) {
    if ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu" || (event.target === target && target.getAttribute("role") === "button" && ["Enter", " "].includes(event.key))) {
      event.preventDefault();
      const rect = target.getBoundingClientRect();
      show(rect.left + Math.min(24, rect.width / 2), rect.top + Math.min(24, rect.height / 2), target, "keyboard");
    }
  }

  function outside(event) { if (!menu.contains(event.target)) hide("outside"); }

  function keydown(event) {
    if (!open) return;
    if (event.key === "Escape") { event.preventDefault(); hide("escape", true); return; }
    if (event.key === "Tab") { hide("tab"); return; }
    if (!menu.contains(event.target)) return;
    const nodes = items();
    const index = nodes.indexOf(document.activeElement);
    if (event.key === "ArrowDown") { event.preventDefault(); focusItem(nodes[index + 1] || nodes[0]); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusItem(nodes[index - 1] || nodes.at(-1)); }
    else if (event.key === "Home") { event.preventDefault(); focusItem(nodes[0]); }
    else if (event.key === "End") { event.preventDefault(); focusItem(nodes.at(-1)); }
    else if ((event.key === "Enter" || event.key === " ") && !document.activeElement?.matches("button, a[href]") ) { event.preventDefault(); document.activeElement?.click?.(); }
    else if (event.key.length === 1 && /\S/.test(event.key)) {
      search += event.key.toLocaleLowerCase();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { search = ""; }, 500);
      focusItem(nodes.find((item) => item.textContent.trim().toLocaleLowerCase().startsWith(search)));
    }
  }

  function menuClick(event) {
    const item = event.target.closest(itemSelector);
    if (!item || !menu.contains(item)) return;
    if (isDisabled(item)) { event.preventDefault(); return; }
    const role = item.getAttribute("role");
    if (role === "menuitemcheckbox") item.setAttribute("aria-checked", item.getAttribute("aria-checked") === "true" ? "false" : "true");
    if (role === "menuitemradio") [...(item.closest("[role='group']") || menu).querySelectorAll("[role='menuitemradio']")].forEach((option) => option.setAttribute("aria-checked", option === item ? "true" : "false"));
    emit(element, "change", { item, value: item.dataset.gValue || item.textContent.trim(), checked: item.hasAttribute("aria-checked") ? item.getAttribute("aria-checked") === "true" : undefined });
    if (item.dataset.gKeepOpen !== "true") hide("select", true);
  }

  function clearLongPress() { clearTimeout(longPressTimer); longPressTimer = undefined; longPressPoint = null; }
  function longPressStart(event) {
    if (event.pointerType !== "touch" || element.dataset.gLongPress === "false" || menu.contains(event.target)) return;
    clearLongPress();
    longPressPoint = { x: event.clientX, y: event.clientY };
    const delay = Math.max(250, numeric(element.dataset.gLongPressDelay, 550));
    longPressTimer = setTimeout(() => {
      longPressTimer = undefined;
      longPressTriggered = show(longPressPoint.x, longPressPoint.y, event.target, "longpress");
    }, delay);
  }
  function longPressMove(event) {
    if (!longPressPoint || Math.hypot(event.clientX - longPressPoint.x, event.clientY - longPressPoint.y) <= 10) return;
    clearLongPress();
  }
  function suppressLongPressClick(event) {
    if (!longPressTriggered) return;
    event.preventDefault();
    event.stopPropagation();
    longPressTriggered = false;
  }

  normalize();
  menu.hidden = true;
  menu.setAttribute("aria-hidden", "true");
  target.addEventListener("contextmenu", context);
  target.addEventListener("keydown", targetKeydown);
  target.addEventListener("pointerdown", longPressStart);
  target.addEventListener("pointermove", longPressMove);
  target.addEventListener("pointerup", clearLongPress);
  target.addEventListener("pointercancel", clearLongPress);
  target.addEventListener("click", suppressLongPressClick, true);
  menu.addEventListener("click", menuClick);
  if (startsOpen) queueMicrotask(() => show(undefined, undefined, target, "initial"));
  return {
    open: show,
    close: hide,
    refresh: normalize,
    isOpen: () => open,
    destroy: () => {
      clearTimeout(searchTimer);
      clearLongPress();
      target.removeEventListener("contextmenu", context);
      target.removeEventListener("keydown", targetKeydown);
      target.removeEventListener("pointerdown", longPressStart);
      target.removeEventListener("pointermove", longPressMove);
      target.removeEventListener("pointerup", clearLongPress);
      target.removeEventListener("pointercancel", clearLongPress);
      target.removeEventListener("click", suppressLongPressClick, true);
      menu.removeEventListener("click", menuClick);
      document.removeEventListener("pointerdown", outside, true);
      document.removeEventListener("keydown", keydown);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      element.classList.remove("is-open");
      target.setAttribute("aria-expanded", "false");
      menu.hidden = true;
      menu.setAttribute("aria-hidden", "true");
    }
  };
}

function createScrollspy(element) {
  const links = [...element.querySelectorAll("a[href^='#']")];
  const entries = links.map((link) => ({ link, section: targetById(link.getAttribute("href")) })).filter((entry) => entry.section);
  if (!entries.length) return null;
  const offset = Number(element.dataset.gScrollspyOffset || 96);
  const scrollRoot = targetById(element.dataset.gScrollspyRoot) || window;
  let current = null;
  let frame;
  function update() {
    frame = null;
    let active = entries[0];
    const rootTop = scrollRoot === window ? 0 : scrollRoot.getBoundingClientRect().top;
    for (const entry of entries) if (entry.section.getBoundingClientRect().top <= rootTop + offset) active = entry;
    const atEnd = scrollRoot === window
      ? window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1
      : scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 1;
    if (atEnd) active = entries.at(-1);
    entries.forEach((entry) => {
      if (entry === active) entry.link.setAttribute("aria-current", "location");
      else entry.link.removeAttribute("aria-current");
    });
    if (current !== active) {
      current = active;
      emit(element, "change", { link: active.link, section: active.section });
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  scrollRoot.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
  return { update, destroy: () => { if (frame) cancelAnimationFrame(frame); scrollRoot.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); } };
}

function createJumpNav(element) {
  const select = element.matches("select") ? element : element.querySelector("select");
  if (!select) return null;
  function jump() {
    const target = targetById(select.value);
    if (!target) return;
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (target.id && history.replaceState) history.replaceState(null, "", `#${target.id}`);
    emit(element, "change", { target, value: select.value });
  }
  select.addEventListener("change", jump);
  return { jump, destroy: () => select.removeEventListener("change", jump) };
}

function createDropzone(element) {
  if(element.hasAttribute('data-g-content-options')) return null;
  let depth = 0;
  const input = element.querySelector("input[type='file']");
  const browse = element.querySelector("[data-g-file-browse]");
  const nativeLabel = element.matches("label") && Boolean(input);
  const restoreSurface = overlayAttributes(element, ['role', 'tabindex']);
  function disabled() { return Boolean(input?.disabled || element.matches(".is-disabled, [aria-disabled='true'], [data-g-disabled]")); }
  function accepts(file, rule) {
    const tokens = String(rule || "").split(",").map((token) => token.trim().toLowerCase()).filter(Boolean);
    if (!tokens.length) return true;
    const name = String(file?.name || "").toLowerCase();
    const type = String(file?.type || "").toLowerCase();
    return tokens.some((token) => token.startsWith(".") ? name.endsWith(token) : token.endsWith("/*") ? type.startsWith(token.slice(0, -1)) : type === token);
  }
  function validate(files) {
    const accept = element.dataset.gAccept || input?.accept || "";
    const maxSize = Number(element.dataset.gMaxSize || 0);
    const maxFiles = Number(element.dataset.gMaxFiles || 0);
    const acceptedFiles = [];
    const rejectedFiles = [];
    files.forEach((file, index) => {
      const reasons = [];
      if (maxFiles > 0 && index >= maxFiles) reasons.push("count");
      if (maxSize > 0 && Number(file?.size || 0) > maxSize) reasons.push("size");
      if (!accepts(file, accept)) reasons.push("type");
      if (reasons.length) rejectedFiles.push({ file, reasons });
      else acceptedFiles.push(file);
    });
    return { acceptedFiles, rejectedFiles };
  }
  function selectFiles(sourceFiles, source = "api", dataTransfer = null) {
    const files = [...(sourceFiles || [])];
    const { acceptedFiles, rejectedFiles } = validate(files);
    element.classList.toggle("has-files", acceptedFiles.length > 0);
    element.classList.toggle("is-rejected", rejectedFiles.length > 0);
    if (rejectedFiles.length) element.setAttribute("aria-invalid", "true");
    else element.removeAttribute("aria-invalid");
    const detail = { files, acceptedFiles, rejectedFiles, input, dataTransfer, source };
    if (source === "drop") emit(element, "drop", { files, acceptedFiles, rejectedFiles, input, dataTransfer, source });
    emit(element, "files", { files, acceptedFiles, rejectedFiles, input, dataTransfer, source });
    return detail;
  }
  function enter(event) {
    event.preventDefault();
    if (disabled()) return;
    depth += 1;
    element.classList.add("is-dragging");
    element.dataset.gState = "dragging";
  }
  function over(event) { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = disabled() ? "none" : "copy"; }
  function leave(event) {
    event.preventDefault();
    depth = Math.max(0, depth - 1);
    if (!depth) {
      element.classList.remove("is-dragging");
      if (element.dataset.gState === "dragging") delete element.dataset.gState;
    }
  }
  function drop(event) {
    event.preventDefault();
    depth = 0;
    element.classList.remove("is-dragging");
    if (element.dataset.gState === "dragging") delete element.dataset.gState;
    if (disabled()) return;
    selectFiles(event.dataTransfer?.files, "drop", event.dataTransfer);
  }
  function paste(event) {
    const files = [...(event.clipboardData?.files || [])];
    if (!files.length || disabled()) return;
    event.preventDefault();
    selectFiles(files, "paste", event.clipboardData);
  }
  function choose() { if (!disabled()) selectFiles(input?.files, "input"); }
  function open() { if (!disabled()) input?.click(); }
  function clear() {
    if (input) input.value = "";
    element.classList.remove("has-files", "is-rejected");
    element.removeAttribute("aria-invalid");
  }
  function activate(event) {
    if (!input || disabled() || event.target === input || event.target.closest("button, a, input, select, textarea")) return;
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    open();
  }
  function browseClick(event) {
    event.preventDefault();
    event.stopPropagation();
    open();
  }
  if (input) {
    if (!nativeLabel && !element.hasAttribute("role")) element.setAttribute("role", "group");
    if (!nativeLabel && !element.hasAttribute("tabindex")) element.tabIndex = 0;
    if (disabled()) element.setAttribute("aria-disabled", "true");
    input.addEventListener("change", choose);
    browse?.addEventListener("click", browseClick);
    if (!nativeLabel) {
      element.addEventListener("click", activate);
      element.addEventListener("keydown", activate);
    }
  }
  element.addEventListener("dragenter", enter);
  element.addEventListener("dragover", over);
  element.addEventListener("dragleave", leave);
  element.addEventListener("drop", drop);
  if (element.hasAttribute("data-g-paste")) element.addEventListener("paste", paste);
  return {
    open,
    files: selectFiles,
    clear,
    destroy: () => {
      element.removeEventListener("dragenter", enter);
      element.removeEventListener("dragover", over);
      element.removeEventListener("dragleave", leave);
      element.removeEventListener("drop", drop);
      element.removeEventListener("paste", paste);
      input?.removeEventListener("change", choose);
      browse?.removeEventListener("click", browseClick);
      element.removeEventListener("click", activate);
      element.removeEventListener("keydown", activate);
      restoreSurface();
    }
  };
}

function createCommandPalette(element) {
  let trigger = null;
  let open = !element.hidden;
  let activeItem = null;
  if (!element.id) element.id = uid("g-command-palette");
  const panel = element.querySelector(":scope > .g-command-palette, :scope > [data-g-command-panel], [role='dialog']") || element;
  const input = panel.querySelector(".g-command-input, [data-g-command-input]");
  const results = panel.querySelector(".g-command-results, [data-g-command-results]");
  const clear = panel.querySelector(".g-command-clear, [data-g-command-clear]");
  const empty = panel.querySelector(".g-command-empty, [data-g-command-empty]");
  const count = panel.querySelector("[data-g-command-count]") || panel.querySelector(".g-command-count");
  const owned = (node) => node.closest("[data-g-command-palette]") === element;
  const items = () => [...panel.querySelectorAll(".g-command-item, [data-g-command-item]")].filter(owned);
  const triggers = () => [...document.querySelectorAll("[data-g-command-trigger], [aria-controls]")].filter((button) => (button.dataset.gCommandTrigger || button.getAttribute("aria-controls"))?.replace(/^#/, "") === element.id);
  const paletteDisabled = () => isDisabled(element) || element.classList.contains("is-disabled");
  const disabled = (item) => isDisabled(item) || item.classList.contains("is-disabled");
  const normalized = (value) => String(value || "").normalize("NFKC").trim().toLocaleLowerCase();
  const labelOf = (item) => item.querySelector(".g-command-item-title")?.textContent?.trim() || item.getAttribute("aria-label") || item.textContent?.trim() || "";
  const valueOf = (item, index = items().indexOf(item)) => item.dataset.gValue || item.dataset.gCommandItem || item.id || String(index);
  element.setAttribute("role", "dialog");
  element.setAttribute("aria-modal", "true");
  if (!element.hasAttribute("aria-label") && !element.hasAttribute("aria-labelledby")) element.setAttribute("aria-label", "Command palette");
  if (!element.hasAttribute("tabindex")) element.tabIndex = -1;
  if (results) {
    if (!results.id) results.id = uid("g-command-results");
    results.setAttribute("role", "listbox");
  }
  if (input) {
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("autocomplete", "off");
    if (results) input.setAttribute("aria-controls", results.id);
  }
  element.setAttribute("aria-hidden", String(!open));
  function syncExpanded(value) {
    triggers().forEach((button) => {
      button.setAttribute("aria-haspopup", "dialog");
      button.setAttribute("aria-controls", element.id);
      button.setAttribute("aria-expanded", String(value));
    });
    input?.setAttribute("aria-expanded", String(value));
  }
  function setActive(item, scroll = false) {
    const available = items().filter((candidate) => !candidate.hidden && !disabled(candidate));
    activeItem = available.includes(item) ? item : available[0] || null;
    items().forEach((candidate) => {
      const selected = candidate === activeItem;
      candidate.setAttribute("aria-selected", String(selected));
      candidate.tabIndex = -1;
    });
    if (input) {
      if (activeItem) input.setAttribute("aria-activedescendant", activeItem.id);
      else input.removeAttribute("aria-activedescendant");
    }
    if (scroll) activeItem?.scrollIntoView?.({ block: "nearest" });
    return activeItem;
  }
  function filter(query = input?.value || "", reason = "api") {
    const needle = normalized(query);
    items().forEach((item) => {
      const haystack = normalized(`${labelOf(item)} ${item.dataset.gKeywords || ""}`);
      item.hidden = Boolean(item._gCommandInitiallyHidden) || Boolean(needle && !haystack.includes(needle));
    });
    panel.querySelectorAll(".g-command-group, [data-g-command-group]").forEach((group) => {
      if (!owned(group)) return;
      group.hidden = !items().some((item) => group.contains(item) && !item.hidden);
    });
    const visibleItems = items().filter((item) => !item.hidden);
    if (empty) empty.hidden = visibleItems.length > 0;
    if (count) count.textContent = String(visibleItems.length);
    element.classList.toggle("is-empty", visibleItems.length === 0);
    element.classList.toggle("is-filtered", Boolean(needle));
    setActive(activeItem);
    emit(element, "filter", { query: String(query), items: items(), visibleItems, reason });
    return visibleItems;
  }
  function refresh(reason = "refresh") {
    items().forEach((item, index) => {
      if (item._gCommandInitiallyHidden === undefined) item._gCommandInitiallyHidden = item.hidden;
      if (!item.id) item.id = uid("g-command-item");
      item.setAttribute("role", "option");
      item.setAttribute("aria-disabled", String(disabled(item)));
      item.setAttribute("aria-posinset", String(index + 1));
      item.setAttribute("aria-setsize", String(items().length));
    });
    panel.querySelectorAll(".g-command-group, [data-g-command-group]").forEach((group) => {
      if (!owned(group)) return;
      group.setAttribute("role", "group");
      const label = group.querySelector(":scope > .g-command-group-label");
      if (label) {
        if (!label.id) label.id = uid("g-command-group-label");
        group.setAttribute("aria-labelledby", label.id);
      }
    });
    syncExpanded(open);
    return filter(input?.value || "", reason);
  }
  function show(source = document.activeElement) {
    if (open || paletteDisabled() || !emit(element, "beforeopen", { source })) return;
    open = true;
    trigger = source;
    element.hidden = false;
    element.setAttribute("aria-hidden", "false");
    element.classList.add("is-open");
    syncExpanded(true);
    refresh("open");
    (input || visibleFocusable(panel)[0] || panel).focus();
    emit(element, "open", { source });
  }
  function hide(reason = "api") {
    if (!open || !emit(element, "beforeclose", { reason })) return;
    open = false;
    element.hidden = true;
    element.setAttribute("aria-hidden", "true");
    element.classList.remove("is-open");
    syncExpanded(false);
    trigger?.focus?.();
    emit(element, "close", { reason });
  }
  function activate(item, reason = "api") {
    if (!item || item.hidden || disabled(item)) return false;
    if (!emit(element, "commandselect", { item, value: valueOf(item), label: labelOf(item), query: input?.value || "", reason })) return false;
    if (!item.hasAttribute("data-g-command-keep-open")) hide("select");
    return true;
  }
  function select(value, reason = "api") {
    const currentItems = items();
    const item = value instanceof Element ? value : typeof value === "number" ? currentItems[value] : currentItems.find((candidate, index) => valueOf(candidate, index) === String(value));
    return activate(item, reason) ? item : null;
  }
  function move(offset) {
    const available = items().filter((item) => !item.hidden && !disabled(item));
    if (!available.length) return setActive(null);
    const index = Math.max(0, available.indexOf(activeItem));
    return setActive(available[(index + offset + available.length) % available.length], true);
  }
  function inputKeydown(event) {
    if (!open || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowDown") { event.preventDefault(); move(1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); move(-1); }
    else if (event.key === "Home") { event.preventDefault(); setActive(items().find((item) => !item.hidden && !disabled(item)), true); }
    else if (event.key === "End") { event.preventDefault(); setActive(items().filter((item) => !item.hidden && !disabled(item)).at(-1), true); }
    else if (event.key === "Enter" && activeItem) { event.preventDefault(); activate(activeItem, "keyboard"); }
  }
  function shortcutMatches(event) {
    const shortcut = normalized(element.dataset.gShortcut || "mod+k").replace(/\s/g, "");
    const key = normalized(event.key);
    if (shortcut === "none" || key !== "k") return false;
    if (shortcut === "ctrl+k") return event.ctrlKey && !event.metaKey;
    if (shortcut === "meta+k") return event.metaKey && !event.ctrlKey;
    return (event.ctrlKey || event.metaKey) && !event.altKey;
  }
  function keydown(event) {
    const palettes = [...document.querySelectorAll("[data-g-command-palette]:not([data-g-shortcut='none'])")];
    const focusedTrigger = document.activeElement?.closest?.("[data-g-command-trigger], [aria-controls]");
    const focusedTarget = focusedTrigger && document.getElementById((focusedTrigger.dataset.gCommandTrigger || focusedTrigger.getAttribute("aria-controls") || "").replace(/^#/, ""));
    const shortcutOwner = palettes.includes(focusedTarget) ? focusedTarget : palettes.find((candidate) => candidate.hasAttribute("data-g-shortcut")) || palettes[0];
    if (shortcutMatches(event) && shortcutOwner === element) { event.preventDefault(); open ? hide("shortcut") : show(document.activeElement); }
    else if (open && event.key === "Escape") { event.preventDefault(); hide("escape"); }
    else if (open && event.key === "Tab") {
      const items = visibleFocusable(panel);
      if (!items.length) { event.preventDefault(); panel.focus(); return; }
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }
  function backdrop(event) { if (event.target === element) hide("backdrop"); }
  function click(event) {
    const clearButton = event.target.closest(".g-command-clear, [data-g-command-clear]");
    if (clearButton && panel.contains(clearButton)) {
      event.preventDefault();
      if (input) input.value = "";
      activeItem = null;
      filter("", "clear");
      input?.focus();
      return;
    }
    const item = event.target.closest(".g-command-item, [data-g-command-item]");
    if (item && owned(item)) activate(item, "pointer");
  }
  function inputChange() { filter(input?.value || "", "input"); }
  refresh("init");
  if (open) { open = false; queueMicrotask(show); }
  document.addEventListener("keydown", keydown);
  element.addEventListener("pointerdown", backdrop);
  panel.addEventListener("keydown", inputKeydown);
  panel.addEventListener("click", click);
  input?.addEventListener("input", inputChange);
  return {
    open: show,
    close: hide,
    toggle: (source) => open ? hide("toggle") : show(source),
    isOpen: () => open,
    query: (value) => { if (value === undefined) return input?.value || ""; if (input) input.value = String(value); return filter(String(value), "api"); },
    active: () => activeItem,
    select,
    refresh,
    destroy: () => {
      document.removeEventListener("keydown", keydown);
      element.removeEventListener("pointerdown", backdrop);
      panel.removeEventListener("keydown", inputKeydown);
      panel.removeEventListener("click", click);
      input?.removeEventListener("input", inputChange);
      open = false;
      element.hidden = true;
      element.setAttribute("aria-hidden", "true");
      element.classList.remove("is-open", "is-empty", "is-filtered");
      syncExpanded(false);
    }
  };
}

function createUploadManager(element) {
  if(element.hasAttribute('data-g-content-options')) return null;
  const list = element.querySelector("[data-g-upload-list]") || element;
  const input = element.querySelector("input[type='file'][data-g-upload-input]");
  const template = targetById(element.dataset.gUploadTemplate);
  const items = () => [...list.querySelectorAll("[data-g-upload-item]")];
  const stateNames = ["empty", "queued", "uploading", "paused", "success", "error", "mixed"];
  const inputInitiallyDisabled = Boolean(input?.disabled);
  function disabled() { return element.matches(".is-disabled, [aria-disabled='true'], [data-g-disabled]"); }
  function itemFor(target) {
    if (target instanceof HTMLElement) return element.contains(target) ? target.closest("[data-g-upload-item]") : null;
    if (typeof target === "number") return items()[target] || null;
    return items().find((item) => item.dataset.gUploadId === String(target)) || null;
  }
  function statusText(item) {
    const state = item.dataset.gStatus || "queued";
    const progress = Math.max(0, Math.min(100, Number(item.dataset.gProgress || 0)));
    return message(state === "success" ? "upload.complete" : state === "error" ? "upload.failed" : state === "paused" ? "upload.paused" : state === "uploading" ? "upload.uploading" : "upload.waiting", { progress });
  }
  function queueState(current) {
    if (!current.length) return "empty";
    const states = new Set(current.map((item) => item.dataset.gStatus || "queued"));
    return states.size === 1 ? [...states][0] : "mixed";
  }
  function sync(reason = "api") {
    const current = items();
    current.forEach((item) => {
      const state = ["queued", "uploading", "paused", "success", "error"].includes(item.dataset.gStatus) ? item.dataset.gStatus : "queued";
      const progress = Math.max(0, Math.min(100, Number(item.dataset.gProgress || 0)));
      item.dataset.gStatus = state;
      item.dataset.gProgress = String(progress);
      if (!item.dataset.gUploadId) item.dataset.gUploadId = uid("upload");
      if (!item.hasAttribute("role")) item.setAttribute("role", "listitem");
      item.style.setProperty("--g-progress", `${progress}%`);
      const bar = item.querySelector("[data-g-upload-progress]");
      if (bar) {
        const fileName = item.querySelector(".g-file-name")?.textContent?.trim();
        bar.style.setProperty("--g-progress", `${progress}%`);
        if (!bar.hasAttribute("role")) bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.setAttribute("aria-valuenow", String(progress));
        bar.setAttribute("aria-valuetext", statusText(item));
        if (fileName && !bar.hasAttribute("aria-labelledby") && (!bar.hasAttribute("aria-label") || bar._gUploadAutoLabel)) {
          bar.setAttribute("aria-label", `${fileName}: ${statusText(item)}`);
          bar._gUploadAutoLabel = true;
        }
      }
      const status = item.querySelector("[data-g-upload-status]");
      if (status) status.textContent = statusText(item);
      item.querySelectorAll("[data-g-upload-action]").forEach((button) => {
        const actionName = button.dataset.gUploadAction;
        if (actionName === "pause") {
          button.textContent = message(state === "paused" ? "upload.continue" : "upload.pause");
          button.hidden = !["queued", "uploading", "paused"].includes(state);
        } else if (actionName === "retry") button.hidden = state !== "error";
        else if (actionName === "advance") button.hidden = !["queued", "uploading"].includes(state);
        button.disabled = disabled();
      });
    });
    const counts = {
      total: current.length,
      queued: current.filter((item) => item.dataset.gStatus === "queued").length,
      uploading: current.filter((item) => item.dataset.gStatus === "uploading").length,
      paused: current.filter((item) => item.dataset.gStatus === "paused").length,
      success: current.filter((item) => item.dataset.gStatus === "success").length,
      error: current.filter((item) => item.dataset.gStatus === "error").length,
      active: current.filter((item) => ["queued", "uploading", "paused"].includes(item.dataset.gStatus || "queued")).length,
    };
    Object.entries(counts).forEach(([name, value]) => element.querySelectorAll(`[data-g-upload-count="${name}"]`).forEach((node) => { node.textContent = String(value); }));
    const state = queueState(current);
    stateNames.forEach((name) => element.classList.toggle(`is-${name}`, state === name));
    element.dataset.gState = state;
    element.setAttribute("aria-busy", String(counts.uploading > 0));
    if (!element.hasAttribute("role")) element.setAttribute("role", "region");
    if (!element.hasAttribute("aria-label") && !element.hasAttribute("aria-labelledby")) element.setAttribute("aria-label", message("upload.queue"));
    if (list !== element && !list.hasAttribute("role")) list.setAttribute("role", "list");
    const empty = element.querySelector("[data-g-upload-empty]");
    if (empty) empty.hidden = current.length > 0;
    const live = element.querySelector("[data-g-upload-live]");
    if (live) {
      live.setAttribute("role", "status");
      live.setAttribute("aria-live", "polite");
      if (reason !== "init") live.textContent = message("upload.summary", counts);
    }
    if (input) {
      input.disabled = inputInitiallyDisabled || disabled();
      if (!input.hasAttribute("aria-label") && !input.hasAttribute("aria-labelledby")) input.setAttribute("aria-label", message("upload.chooseFiles"));
    }
    emit(element, "uploadchange", { items: current, counts, reason });
    return { items: current, counts, state };
  }
  function createFileItem(file, options = {}) {
    if (!file || typeof file.name !== "string") throw new TypeError("upload-manager addFile expects a File-like object with a name.");
    let item;
    if (template?.content) { const fragment = template.content.cloneNode(true); item = fragment.querySelector("[data-g-upload-item]") || fragment.firstElementChild; list.append(fragment); }
    if (!item) {
      item = document.createElement("div");
      item.className = "g-upload-item";
      item.dataset.gUploadItem = "";
      item.innerHTML = '<span class="g-file-icon" aria-hidden="true">FILE</span><span class="g-file-main"><strong class="g-file-name"></strong><span class="g-file-meta"></span><span class="g-upload-status" data-g-upload-status></span></span><span class="g-upload-progress" data-g-upload-progress><i class="g-upload-progress-bar"></i></span><span class="g-upload-actions"><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="pause"></button><button class="g-btn g-btn-outline g-btn-sm" type="button" data-g-upload-action="retry"></button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="remove"></button></span>';
      item.querySelector("[data-g-upload-action='retry']").textContent = message("upload.retry");
      item.querySelector("[data-g-upload-action='remove']").textContent = message("upload.remove");
      list.append(item);
    }
    item.dataset.gUploadId = String(options.id || item.dataset.gUploadId || uid("upload"));
    item.dataset.gStatus = ["queued", "uploading", "paused", "success", "error"].includes(options.status) ? options.status : "queued";
    item.dataset.gProgress = String(Math.max(0, Math.min(100, Number(options.progress || 0))));
    item._gUploadFile = file;
    item.querySelector(".g-file-name")?.replaceChildren(document.createTextNode(file.name));
    const meta = item.querySelector(".g-file-meta"); if (meta) meta.textContent = file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : message("upload.calculating");
    const icon = item.querySelector(".g-file-icon");
    if (icon) icon.textContent = String(file.name).includes(".") ? String(file.name).split(".").at(-1).slice(0, 4) : "FILE";
    emit(element, "uploadadd", { file, item });
    return item;
  }
  function addFile(file, options = {}) {
    const item = createFileItem(file, options);
    sync("add");
    return item;
  }
  function addFiles(files, options = {}) {
    const added = [...(files || [])].map((file) => createFileItem(file, options));
    sync("files");
    return added;
  }
  function update(target, patch = {}) {
    const item = itemFor(target);
    if (!item) return null;
    if (["queued", "uploading", "paused", "success", "error"].includes(patch.status)) item.dataset.gStatus = patch.status;
    if (patch.progress != null) item.dataset.gProgress = String(Math.max(0, Math.min(100, Number(patch.progress) || 0)));
    if (patch.error != null) {
      item.dataset.gError = String(patch.error);
      const meta = item.querySelector(".g-file-meta");
      if (meta) meta.textContent = String(patch.error);
    }
    if (patch.progress != null && Number(patch.progress) >= 100 && patch.status == null) item.dataset.gStatus = "success";
    sync("update");
    return item;
  }
  function remove(target) {
    const item = itemFor(target);
    if (!item) return false;
    const restoreFocus = focusAfterRemoval(item, item);
    item.remove();
    restoreFocus();
    sync("remove");
    return true;
  }
  function clear(predicate = null) {
    const removable = items().filter((item) => !predicate || predicate(item));
    removable.forEach((item) => item.remove());
    sync("clear");
    return removable.length;
  }
  function action(item, name) {
    if (disabled()) return;
    if (name === "remove") { remove(item); return; }
    if (name === "retry") { item.dataset.gStatus = "queued"; item.dataset.gProgress = "0"; }
    if (name === "pause") item.dataset.gStatus = item.dataset.gStatus === "paused" ? "uploading" : "paused";
    if (name === "advance" && item.dataset.gStatus !== "paused") { const progress = Math.min(100, Number(item.dataset.gProgress || 0) + 25); item.dataset.gProgress = String(progress); item.dataset.gStatus = progress >= 100 ? "success" : "uploading"; }
    sync(name);
  }
  function click(event) {
    const button = event.target.closest("[data-g-upload-action]");
    if (!button || !element.contains(button)) return;
    event.preventDefault();
    if (button.dataset.gUploadAction === "clear") { clear(); return; }
    const item = button.closest("[data-g-upload-item]");
    if (item) action(item, button.dataset.gUploadAction);
  }
  function change() {
    if (input?.closest("[data-g-dropzone]")) return;
    addFiles(input?.files || []);
    if (input) input.value = "";
  }
  function filesEvent(event) {
    if (event.target === element || element.contains(event.target)) addFiles(event.detail?.acceptedFiles || event.detail?.files || []);
  }
  element.addEventListener("click", click);
  element.addEventListener("gardener:files", filesEvent);
  input?.addEventListener("change", change);
  sync("init");
  return {
    sync, addFile, addFiles, update, remove, clear, items,
    destroy: () => {
      element.removeEventListener("click", click);
      element.removeEventListener("gardener:files", filesEvent);
      input?.removeEventListener("change", change);
    },
  };
}

function createFileBrowser(element) {
  if(element.hasAttribute('data-g-content-options')) return null;
  const items = () => [...element.querySelectorAll("[data-g-file-item]")];
  const search = element.querySelector("[data-g-file-search]");
  let selected = items().find((item) => item.getAttribute("aria-selected") === "true") || null;
  function select(item, reason = "api") {
    if (isDisabled(item)) return;
    items().forEach((entry) => { const active = entry === item; entry.setAttribute("aria-selected", String(active)); entry.tabIndex = active ? 0 : -1; });
    selected = item;
    element.querySelectorAll("[data-g-file-selection]").forEach((node) => { node.textContent = item?.dataset.gFileName || item?.querySelector(".g-file-name, .g-media-label")?.textContent || message("upload.notSelected"); });
    emit(element, "fileselect", { item, value: item?.dataset.gValue, reason });
  }
  function filter() {
    const query = String(search?.value || "").normalize("NFKD").toLocaleLowerCase().trim();
    let visible = 0;
    items().forEach((item) => { const match = !query || String(item.dataset.gFilterText || item.dataset.gFileName || item.textContent).normalize("NFKD").toLocaleLowerCase().includes(query); item.hidden = !match; if (match) visible += 1; });
    element.querySelectorAll("[data-g-file-count]").forEach((node) => { node.textContent = String(visible); });
    emit(element, "filefilter", { query, visible });
  }
  function click(event) {
    const view = event.target.closest("[data-g-file-view]");
    if (view) { element.dataset.gView = view.dataset.gFileView; element.querySelectorAll("[data-g-file-view]").forEach((button) => button.setAttribute("aria-pressed", String(button === view))); emit(element, "fileview", { view: element.dataset.gView }); return; }
    const item = event.target.closest("[data-g-file-item]"); if (item) select(item, "pointer");
  }
  function keydown(event) {
    const item = event.target.closest("[data-g-file-item]"); if (!item || !["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End", "Enter", " "].includes(event.key)) return;
    const visible = items().filter((entry) => !entry.hidden && !isDisabled(entry)); if (!visible.length) return; event.preventDefault();
    if (["Enter", " "].includes(event.key)) { select(item, "keyboard"); return; }
    const current = visible.indexOf(item); const forward = ["ArrowDown", "ArrowRight"].includes(event.key); const index = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : (current + (forward ? 1 : -1) + visible.length) % visible.length; visible[index].focus();
  }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); search?.addEventListener("input", filter);
  const initialFocusable = (selected && !isDisabled(selected) ? selected : items().find((item) => !isDisabled(item))) || null;
  items().forEach((item) => {
    item.tabIndex = item === initialFocusable ? 0 : -1;
    item.setAttribute("role", item.getAttribute("role") || "option");
    if (!item.hasAttribute("aria-selected")) item.setAttribute("aria-selected", "false");
    const collection = item.parentElement;
    if (collection) {
      if (!collection.hasAttribute("role")) collection.setAttribute("role", "listbox");
      if (!collection.hasAttribute("aria-label") && !collection.hasAttribute("aria-labelledby")) collection.setAttribute("aria-label", element.getAttribute("aria-label") || message("upload.fileList"));
    }
  });
  if (selected) select(selected, "init"); filter();
  return { select, filter, selected: () => selected, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); search?.removeEventListener("input", filter); } };
}

function createMediaPlayer(element) {
  if(element.hasAttribute('data-g-media-options'))return null;
  if(element.hasAttribute('data-g-content-options')) return null;
  const media = element.querySelector("audio, video");
  const toggleButton = element.querySelector("[data-g-media-toggle]");
  const timeline = element.querySelector("[data-g-media-timeline], .g-media-timeline");
  const timeOutput = element.querySelector("[data-g-media-time], .g-media-time");
  if (!toggleButton && !timeline) return null;
  let playing = media ? !media.paused : element.dataset.gPlaying === "true";
  let currentTime = Number(media?.currentTime || timeline?.value || 0);
  let duration = Number(media?.duration || element.dataset.gDuration || timeline?.max || 100);
  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  function state() { return { playing, currentTime, duration, media }; }
  function sync(reason = "api", notify = true) {
    if (media) { currentTime = Number(media.currentTime || 0); if (Number.isFinite(media.duration)) duration = media.duration; playing = !media.paused; }
    element.dataset.gPlaying = String(playing);
    if (toggleButton) {
      toggleButton.setAttribute("aria-pressed", String(playing));
      toggleButton.setAttribute("aria-label", toggleButton.dataset[playing ? "gPauseLabel" : "gPlayLabel"] || message(playing ? "media.pause" : "media.play"));
      const icon = toggleButton.querySelector("[data-g-media-icon]"); if (icon) icon.textContent = playing ? "Ⅱ" : "▶";
    }
    if (timeline) { timeline.max = String(duration || 100); timeline.value = String(currentTime); timeline.setAttribute("aria-valuetext", `${formatTime(currentTime)} / ${formatTime(duration)}`); }
    if (timeOutput) timeOutput.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    if (notify) emit(element, "mediachange", { playing, currentTime, duration, media, reason });
    return state();
  }
  function play(reason = "api") { playing = true; const result = media?.play?.(); result?.catch?.(() => { playing = false; sync("play-rejected"); }); return sync(reason); }
  function pause(reason = "api") { playing = false; media?.pause?.(); return sync(reason); }
  function toggle(reason = "api") { return playing ? pause(reason) : play(reason); }
  function seek(value, reason = "seek") { currentTime = Math.max(0, Math.min(duration || 100, Number(value) || 0)); if (media) media.currentTime = currentTime; return sync(reason); }
  const click = (event) => { if (event.target.closest("[data-g-media-toggle]")) { event.preventDefault(); toggle("button"); } };
  const input = () => seek(timeline.value, "timeline");
  const mediaSync = () => sync("media");
  element.addEventListener("click", click); timeline?.addEventListener("input", input);
  ["play", "pause", "timeupdate", "durationchange", "ended"].forEach((name) => media?.addEventListener(name, mediaSync));
  sync("init", false);
  return { play, pause, toggle, seek, state, destroy: () => { element.removeEventListener("click", click); timeline?.removeEventListener("input", input); ["play", "pause", "timeupdate", "durationchange", "ended"].forEach((name) => media?.removeEventListener(name, mediaSync)); } };
}

function createEditorShell(element) {
  if(element.hasAttribute('data-g-content-options')) return null;
  const surface = element.querySelector("[data-g-editor-surface]");
  if (!surface) return null;
  const tools = [...element.querySelectorAll("[data-g-editor-command]")];
  function counts() {
    const text = String("value" in surface ? surface.value : surface.innerText || surface.textContent || "");
    const trimmed = text.trim(); const words = trimmed ? (trimmed.match(/[\p{L}\p{N}]+/gu) || []).length : 0;
    element.querySelectorAll("[data-g-editor-count='characters']").forEach((node) => { node.textContent = String(text.length); });
    element.querySelectorAll("[data-g-editor-count='words']").forEach((node) => { node.textContent = String(words); });
    emit(element, "editorchange", { text, characters: text.length, words });
  }
  function run(tool) {
    const command = tool.dataset.gEditorCommand; const value = tool.dataset.gEditorValue || null;
    surface.focus();
    if (command === "undo" || command === "redo" || surface.isContentEditable) document.execCommand?.(command, false, value);
    if (tool.hasAttribute("aria-pressed")) tool.setAttribute("aria-pressed", String(tool.getAttribute("aria-pressed") !== "true"));
    counts(); emit(element, "editorcommand", { command, value, tool });
  }
  function click(event) { const tool = event.target.closest("[data-g-editor-command]"); if (tool) { event.preventDefault(); run(tool); } }
  function keydown(event) { if ((event.ctrlKey || event.metaKey) && ["b", "i", "u"].includes(event.key.toLocaleLowerCase())) { event.preventDefault(); const map = { b: "bold", i: "italic", u: "underline" }; const tool = tools.find((item) => item.dataset.gEditorCommand === map[event.key.toLocaleLowerCase()]); if (tool) run(tool); } }
  element.addEventListener("click", click); surface.addEventListener("input", counts); surface.addEventListener("keydown", keydown); counts();
  return { run, counts, surface, destroy: () => { element.removeEventListener("click", click); surface.removeEventListener("input", counts); surface.removeEventListener("keydown", keydown); } };
}

function createRevisionCompare(element) {
  if(element.hasAttribute('data-g-content-options')) return null;
  const controls = [...element.querySelectorAll("[data-g-revision-view]")];
  function setView(view, reason = "api") { element.dataset.gRevisionView = view; controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.gRevisionView === view))); emit(element, "revisionview", { view, reason }); }
  function click(event) { const button = event.target.closest("[data-g-revision-view]"); if (button) { event.preventDefault(); setView(button.dataset.gRevisionView, "pointer"); } }
  element.addEventListener("click", click); setView(element.dataset.gRevisionView || controls.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.gRevisionView || "split", "init");
  return { setView, view: () => element.dataset.gRevisionView, destroy: () => element.removeEventListener("click", click) };
}

function createAutosave(element) {
  if(element.hasAttribute('data-g-content-options')) return null;
  const scope = targetById(element.dataset.gAutosaveScope) || element.closest("form, [data-g-editor-shell]") || element.parentElement;
  const delay = Math.max(150, numeric(element.dataset.gAutosaveDelay, 900));
  const states = ["idle", "dirty", "saving", "saved", "error", "offline", "disabled"];
  const label = element.querySelector("[data-g-autosave-label], .g-autosave-status-label");
  const time = element.querySelector("[data-g-autosave-time], .g-autosave-status-time");
  const retry = element.querySelector("[data-g-autosave-retry], [data-g-autosave-now]");
  let timer = 0; let saveTimer = 0; let operation = 0;
  const clearTimers = () => { clearTimeout(timer); clearTimeout(saveTimer); timer = 0; saveTimer = 0; };
  const statusMessage = (state) => message(`autosave.${state}`);
  function setState(next, reason = "api") {
    const state = states.includes(next) ? next : "idle";
    element.dataset.gAutosaveState = state;
    states.forEach((name) => element.classList.toggle(`is-${name}`, name === state));
    element.setAttribute("aria-busy", String(state === "saving"));
    if (state === "disabled") element.setAttribute("aria-disabled", "true"); else element.removeAttribute("aria-disabled");
    if (label) {
      label.textContent = statusMessage(state);
      label.setAttribute("role", label.getAttribute("role") || (state === "error" ? "alert" : "status"));
      label.setAttribute("aria-live", label.getAttribute("aria-live") || "polite");
      label.setAttribute("aria-atomic", label.getAttribute("aria-atomic") || "true");
    }
    if (retry) retry.disabled = ["saving", "offline", "disabled"].includes(state);
    if (state === "saved" && time) {
      const savedAt = new Date();
      time.setAttribute("datetime", savedAt.toISOString());
      time.textContent = new Intl.DateTimeFormat(runtimeLocale, { hour: "2-digit", minute: "2-digit" }).format(savedAt);
    }
    emit(element, "autosavestate", { state, reason });
    return state;
  }
  function complete(reason = "complete") { clearTimers(); operation += 1; return setState("saved", reason); }
  function fail(reason = "error") { clearTimers(); operation += 1; return setState("error", reason); }
  function save(reason = "api") {
    if (["disabled", "offline"].includes(element.dataset.gAutosaveState)) return element.dataset.gAutosaveState;
    clearTimers(); const requestId = ++operation; setState("saving", reason);
    let response;
    const shouldContinue = emit(element, "autosaverequest", {
      reason,
      scope,
      respondWith(value) { response = Promise.resolve(value); },
      complete: () => requestId === operation && complete("request-complete"),
      fail: () => requestId === operation && fail("request-error"),
    });
    if (!shouldContinue) return element.dataset.gAutosaveState;
    if (response) {
      response.then(() => { if (requestId === operation) complete("request-complete"); }, () => { if (requestId === operation) fail("request-error"); });
    } else if (element.dataset.gAutosaveAutoComplete === "true") {
      saveTimer = window.setTimeout(() => { if (requestId === operation) complete("demo-complete"); }, 260);
    } else {
      setState("dirty", "unhandled-request");
    }
    return element.dataset.gAutosaveState;
  }
  function dirty(reason = "input") {
    if (["disabled", "offline"].includes(element.dataset.gAutosaveState)) return element.dataset.gAutosaveState;
    clearTimers(); operation += 1; setState("dirty", reason); timer = window.setTimeout(() => save("delay"), delay); return "dirty";
  }
  function offline(reason = "offline") { clearTimers(); operation += 1; return setState("offline", reason); }
  function disable(reason = "disabled") { clearTimers(); operation += 1; return setState("disabled", reason); }
  function enable(reason = "enabled") { return setState("idle", reason); }
  function click(event) { if (event.target.closest("[data-g-autosave-retry], [data-g-autosave-now]")) { event.preventDefault(); save("button"); } }
  const markDirty = () => dirty("input");
  const networkOffline = () => offline("network-offline");
  const networkOnline = () => { if (element.dataset.gAutosaveState === "offline") enable("network-online"); };
  scope?.addEventListener("input", markDirty); scope?.addEventListener("change", markDirty); element.addEventListener("click", click);
  window.addEventListener("offline", networkOffline); window.addEventListener("online", networkOnline);
  const initialState = element.getAttribute("aria-disabled") === "true" ? "disabled" : navigator.onLine === false ? "offline" : element.dataset.gAutosaveState || "idle";
  setState(initialState, "init");
  return { save, dirty, complete, fail, offline, enable, disable, state: () => element.dataset.gAutosaveState, destroy: () => { clearTimers(); operation += 1; scope?.removeEventListener("input", markDirty); scope?.removeEventListener("change", markDirty); element.removeEventListener("click", click); window.removeEventListener("offline", networkOffline); window.removeEventListener("online", networkOnline); } };
}

function createQuantityStepper(element) {
  if(element.hasAttribute('data-g-commerce-options'))return null;
  const input = element.querySelector("[data-g-quantity-input]") || element.querySelector("input[type='number']");
  const decrement = element.querySelector("[data-g-quantity-decrement]");
  const increment = element.querySelector("[data-g-quantity-increment]");
  if (!input) return null;
  const limits = () => ({ min: numeric(input.min, 0), max: input.max === "" ? Infinity : numeric(input.max, Infinity), step: Math.max(.000001, numeric(input.step, 1)) });
  function set(value, reason = "api") {
    const { min, max, step } = limits();
    const next = Math.min(max, Math.max(min, numeric(value, min)));
    const precision = Math.max(0, String(step).split(".")[1]?.length || 0);
    input.value = String(Number(next.toFixed(precision)));
    decrement?.toggleAttribute("disabled", next <= min);
    increment?.toggleAttribute("disabled", next >= max);
    element.dataset.gQuantityValue = input.value;
    emit(element, "quantitychange", { value: next, reason });
    return next;
  }
  function click(event) {
    if (event.target.closest("[data-g-quantity-decrement]")) set(numeric(input.value, 0) - limits().step, "decrement");
    if (event.target.closest("[data-g-quantity-increment]")) set(numeric(input.value, 0) + limits().step, "increment");
  }
  function change() { set(input.value, "input"); }
  element.addEventListener("click", click);
  input.addEventListener("change", change);
  set(input.value, "init");
  return { value: () => numeric(input.value, 0), set, increment: () => set(numeric(input.value, 0) + limits().step, "api"), decrement: () => set(numeric(input.value, 0) - limits().step, "api"), destroy: () => { element.removeEventListener("click", click); input.removeEventListener("change", change); } };
}

function createSkuSelector(element) {
  if(element.hasAttribute('data-g-commerce-options'))return null;
  const groups = [...element.querySelectorAll("[data-g-sku-group]")];
  const output = element.querySelector("[data-g-sku-output]");
  const summary = element.querySelector("[data-g-sku-selection]");
  if (!groups.length) return null;
  function options(group) { return group ? [...group.querySelectorAll("[data-g-sku-option]")] : []; }
  function selection() {
    return Object.fromEntries(groups.map((group, index) => {
      const chosen = options(group).find((option) => option.getAttribute("aria-pressed") === "true");
      return [group.dataset.gSkuGroup || `option${index + 1}`, chosen?.dataset.gValue || chosen?.textContent.trim() || ""];
    }));
  }
  function sync(reason = "api") {
    const value = selection();
    const complete = Object.values(value).every(Boolean);
    element.classList.toggle("is-complete", complete);
    element.dataset.gSkuComplete = String(complete);
    if (output) output.value = JSON.stringify(value);
    if (summary) summary.textContent = Object.values(value).filter(Boolean).join(" / ") || element.dataset.gEmptyLabel || message("sku.select");
    emit(element, "skuchange", { value, complete, reason });
    return value;
  }
  function choose(option, reason = "pointer") {
    if (isDisabled(option)) return;
    const group = option.closest("[data-g-sku-group]");
    options(group).forEach((item) => { item.setAttribute("aria-pressed", String(item === option)); item.tabIndex = item === option ? 0 : -1; });
    sync(reason);
  }
  function click(event) { const option = event.target.closest("[data-g-sku-option]"); if (option && element.contains(option)) choose(option); }
  function keydown(event) {
    const current = event.target.closest("[data-g-sku-option]");
    if (!current) return;
    if (["Enter", " "].includes(event.key)) { event.preventDefault(); choose(current, "keyboard"); return; }
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const enabled = options(current.closest("[data-g-sku-group]")).filter((item) => !isDisabled(item));
    const index = enabled.indexOf(current);
    const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1) : ["ArrowRight", "ArrowDown"].includes(event.key) ? enabled[index + 1] || enabled[0] : enabled[index - 1] || enabled.at(-1);
    next?.focus(); choose(next, "keyboard");
  }
  groups.forEach((group) => { const items = options(group); const selected = items.find((item) => item.getAttribute("aria-pressed") === "true") || items.find((item) => !isDisabled(item)); items.forEach((item) => { item.setAttribute("aria-pressed", String(item === selected)); item.tabIndex = item === selected ? 0 : -1; }); });
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); sync("init");
  return { value: selection, select: (groupName, value) => { const group = groups.find((item) => item.dataset.gSkuGroup === groupName); choose(options(group).find((item) => (item.dataset.gValue || item.textContent.trim()) === value), "api"); }, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createCart(element) {
  if(element.hasAttribute('data-g-commerce-options'))return null;
  const locale = element.dataset.gLocale || document.documentElement.lang || "zh-CN";
  const currency = element.dataset.gCurrency || "CNY";
  const formatter = new Intl.NumberFormat(locale, { style: "currency", currency });
  const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  function update(reason = "api") {
    const items = [...element.querySelectorAll("[data-g-cart-item]")];
    let subtotal = 0; let count = 0;
    items.forEach((item) => {
      const input = item.querySelector("[data-g-quantity-input]") || item.querySelector("input[type='number']");
      const quantity = Math.max(0, number(input?.value || item.dataset.gQuantity || 1));
      const total = number(item.dataset.gUnitPrice) * quantity;
      subtotal += total; count += quantity;
      const line = item.querySelector("[data-g-line-total]");
      if (line) line.textContent = formatter.format(total / 100);
    });
    const discount = number(element.dataset.gDiscount);
    const shipping = number(element.dataset.gShipping);
    const tax = number(element.dataset.gTax);
    const total = Math.max(0, subtotal - discount + shipping + tax);
    const values = { "[data-g-cart-subtotal]": subtotal, "[data-g-cart-discount]": -discount, "[data-g-cart-shipping]": shipping, "[data-g-cart-tax]": tax, "[data-g-cart-total]": total };
    Object.entries(values).forEach(([selector, value]) => { element.querySelectorAll(selector).forEach((node) => { node.textContent = formatter.format(value / 100); }); });
    element.querySelectorAll("[data-g-cart-count]").forEach((node) => { node.textContent = String(count); });
    element.querySelector("[data-g-cart-empty]")?.toggleAttribute("hidden", items.length > 0);
    element.classList.toggle("is-empty", items.length === 0);
    emit(element, "cartchange", { subtotal, discount, shipping, tax, total, count, reason });
    return { subtotal, discount, shipping, tax, total, count };
  }
  function click(event) { const remove = event.target.closest("[data-g-cart-remove]"); if (remove) { const item = remove.closest("[data-g-cart-item]"); if (item && emit(item, "cartremove", { item })) { item.remove(); update("remove"); } } }
  function change(event) { if (event.target.matches("[data-g-quantity-input], input[type='number']")) update("quantity"); }
  function quantity(event) { if (element.contains(event.target)) update("quantity"); }
  element.addEventListener("click", click); element.addEventListener("change", change); element.addEventListener("gardener:quantitychange", quantity); update("init");
  return { update, summary: () => update("api"), destroy: () => { element.removeEventListener("click", click); element.removeEventListener("change", change); element.removeEventListener("gardener:quantitychange", quantity); } };
}

function createCoupon(element) {
  if(element.hasAttribute('data-g-commerce-options'))return null;
  const input = element.querySelector("[data-g-coupon-input]") || element.querySelector("input");
  const status = element.querySelector("[data-g-coupon-status]");
  if (!input) return null;
  const validCodes = (element.dataset.gValidCodes || "").split(",").map((code) => code.trim().toLocaleUpperCase()).filter(Boolean);
  function setState(state, code = "", reason = "api") {
    element.classList.toggle("is-applied", state === "applied"); element.classList.toggle("is-invalid", state === "invalid");
    element.dataset.gCouponState = state; input.setAttribute("aria-invalid", String(state === "invalid"));
    if (status) { status.textContent = state === "applied" ? element.dataset.gAppliedMessage || message("coupon.applied", { code }) : state === "invalid" ? element.dataset.gInvalidMessage || message("coupon.invalid") : element.dataset.gIdleMessage || ""; status.setAttribute("role", state === "invalid" ? "alert" : "status"); }
    emit(element, "couponchange", { state, code, reason });
  }
  function apply(reason = "button") { const code = input.value.trim().toLocaleUpperCase(); if (!code || (validCodes.length && !validCodes.includes(code))) setState("invalid", code, reason); else { input.value = code; setState("applied", code, reason); } }
  function clear() { input.value = ""; setState("idle", "", "clear"); input.focus(); }
  function click(event) { if (event.target.closest("[data-g-coupon-apply]")) { event.preventDefault(); apply(); } if (event.target.closest("[data-g-coupon-clear]")) { event.preventDefault(); clear(); } }
  function keydown(event) { if (event.key === "Enter") { event.preventDefault(); apply("keyboard"); } }
  element.addEventListener("click", click); input.addEventListener("keydown", keydown); setState("idle", "", "init");
  return { apply, clear, state: () => element.dataset.gCouponState, destroy: () => { element.removeEventListener("click", click); input.removeEventListener("keydown", keydown); } };
}

function register(name, factory) {
  if (!name || typeof factory !== "function") throw new TypeError("Gardenerim.register requires a name and factory function.");
  registry.set(name, factory);
  registrySelector = [...registry.keys()].map((behavior) => `[data-g-${behavior}]`).join(",");
  if (observer && observedRoot) {
    const root = observedRoot;
    disconnect();
    observe(root);
  }
}

function createPullRefresh(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  const content = element.querySelector(".g-mobile-pull-refresh-content") || element.firstElementChild;
  const indicator = element.querySelector("[data-g-pull-indicator]");
  const threshold = numeric(element.dataset.gPullThreshold, 72);
  let startY = 0; let distance = 0; let tracking = false; let refreshing = false;
  function paint(value) { distance = Math.max(0, Math.min(value, threshold * 1.5)); element.style.setProperty("--g-pull-distance", `${distance}px`); element.classList.toggle("is-pulling", tracking); if (indicator) indicator.textContent = distance >= threshold ? element.dataset.gReleaseLabel || message("refresh.release") : element.dataset.gPullLabel || message("refresh.pull"); }
  function begin(event) { if (refreshing || element.scrollTop > 0 || event.pointerType === "mouse" && event.button !== 0 || event.target.closest("button,a,input,textarea,select,[contenteditable='true']")) return; startY = event.clientY; tracking = true; element.setPointerCapture?.(event.pointerId); }
  function move(event) { if (!tracking) return; const delta = event.clientY - startY; if (delta <= 0) return paint(0); if (delta > 8) event.preventDefault(); paint(Math.sqrt(delta) * 8); }
  function finish() { if (!refreshing) return; refreshing = false; element.classList.remove("is-refreshing"); element.setAttribute("aria-busy", "false"); paint(0); if (indicator) indicator.textContent = element.dataset.gPullLabel || message("refresh.pull"); emit(element, "refreshcomplete"); }
  function refresh(reason = "gesture") { if (refreshing || !emit(element, "refresh", { reason, complete: finish })) return; refreshing = true; tracking = false; element.classList.add("is-refreshing"); element.setAttribute("aria-busy", "true"); paint(threshold / 2); if (indicator) indicator.textContent = element.dataset.gRefreshingLabel || message("refresh.refreshing"); const timeout = numeric(element.dataset.gRefreshTimeout, 0); if (timeout > 0) window.setTimeout(finish, timeout); }
  function end() { if (!tracking) return; tracking = false; element.classList.remove("is-pulling"); distance >= threshold ? refresh() : paint(0); }
  function click(event) { if (event.target.closest("[data-g-refresh]")) refresh("button"); }
  element.addEventListener("pointerdown", begin); element.addEventListener("pointermove", move, { passive: false }); element.addEventListener("pointerup", end); element.addEventListener("pointercancel", end); element.addEventListener("click", click);
  return { refresh, complete: finish, isRefreshing: () => refreshing, destroy: () => { element.removeEventListener("pointerdown", begin); element.removeEventListener("pointermove", move); element.removeEventListener("pointerup", end); element.removeEventListener("pointercancel", end); element.removeEventListener("click", click); content?.style.removeProperty("transform"); element.style.removeProperty("--g-pull-distance"); } };
}

function createInfiniteLoad(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  const sentinel = element.querySelector("[data-g-infinite-sentinel]") || element;
  let loading = false; let done = false; let observer;
  function complete(options = {}) { loading = false; done = Boolean(options.done); element.classList.toggle("is-loading", false); element.classList.toggle("is-done", done); element.setAttribute("aria-busy", "false"); if (done) observer?.disconnect(); emit(element, "loadcomplete", { done }); }
  function load(reason = "observer") { if (loading || done || !emit(element, "loadmore", { reason, complete })) return; loading = true; element.classList.add("is-loading"); element.setAttribute("aria-busy", "true"); }
  function click(event) { if (event.target.closest("[data-g-infinite-load-more]")) load("button"); }
  if (typeof IntersectionObserver !== "undefined") { observer = new IntersectionObserver((entries) => { if (entries.some((entry) => entry.isIntersecting)) load(); }, { rootMargin: element.dataset.gRootMargin || "200px" }); observer.observe(sentinel); }
  element.addEventListener("click", click);
  return { load, complete, isLoading: () => loading, destroy: () => { observer?.disconnect(); element.removeEventListener("click", click); } };
}

function createSwipeActions(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  let startX = 0; let startY = 0; let tracking = false;
  function set(revealed, reason = "api") { element.classList.toggle("is-revealed", revealed); element.querySelector("[data-g-swipe-toggle]")?.setAttribute("aria-expanded", String(revealed)); emit(element, "swipechange", { revealed, reason }); }
  function begin(event) { if (event.pointerType === "mouse" && event.button !== 0) return; startX = event.clientX; startY = event.clientY; tracking = true; element.setPointerCapture?.(event.pointerId); }
  function end(event) { if (!tracking) return; tracking = false; const dx = event.clientX - startX; const dy = event.clientY - startY; if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return; const rtl = getComputedStyle(element).direction === "rtl"; set(rtl ? dx > 0 : dx < 0, "gesture"); }
  function click(event) { if (event.target.closest("[data-g-swipe-toggle]")) set(!element.classList.contains("is-revealed"), "button"); else if (event.target.closest("[data-g-swipe-close]")) set(false, "action"); }
  function keydown(event) { if (event.key === "Escape") set(false, "keyboard"); }
  element.addEventListener("pointerdown", begin); element.addEventListener("pointerup", end); element.addEventListener("pointercancel", () => { tracking = false; }); element.addEventListener("click", click); element.addEventListener("keydown", keydown);
  return { reveal: () => set(true), close: () => set(false), toggle: () => set(!element.classList.contains("is-revealed")), destroy: () => { element.removeEventListener("pointerdown", begin); element.removeEventListener("pointerup", end); element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createTimePicker(element) {
  const input = element.querySelector("[data-g-time-picker-input], .g-time-picker-input");
  const panel = element.querySelector("[data-g-time-picker-panel], .g-time-picker-panel");
  const columnsHost = element.querySelector("[data-g-time-picker-columns], .g-time-picker-columns");
  const status = element.querySelector("[data-g-time-picker-status], .g-time-picker-status");
  const output = element.querySelector("[data-g-time-picker-output], [data-g-wheel-output]");
  const clearButton = element.querySelector("[data-g-time-picker-clear]");
  if (!input || !panel || !columnsHost) return null;

  const originalColumns = columnsHost.innerHTML;
  const originalStatus = status?.textContent || "";
  const originalInput = input.value;
  const inline = element.classList.contains("g-time-picker-inline");
  const withSeconds = element.classList.contains("g-time-picker-with-seconds") || element.dataset.gTimePickerSeconds === "true";
  const twelveHour = element.classList.contains("g-time-picker-twelve-hour") || element.dataset.gTimePickerHourCycle === "12";
  const locale = element.lang || document.documentElement.lang || runtimeLocale || "en";
  const stepHour = Math.max(1, Math.min(23, numeric(element.dataset.gTimePickerHourStep, 1)));
  const stepMinute = Math.max(1, Math.min(59, numeric(element.dataset.gTimePickerMinuteStep, 1)));
  const stepSecond = Math.max(1, Math.min(59, numeric(element.dataset.gTimePickerSecondStep, 1)));
  const pad = (value) => String(value).padStart(2, "0");
  const parseTime = (value) => {
    const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/u.exec(String(value || "").trim());
    if (!match) return null;
    const time = { hour: Number(match[1]), minute: Number(match[2]), second: Number(match[3] || 0) };
    return time.hour <= 23 && time.minute <= 59 && time.second <= 59 ? time : null;
  };
  const seconds = (time) => time ? time.hour * 3600 + time.minute * 60 + time.second : 0;
  const minTime = parseTime(element.dataset.gTimePickerMin || input.min || output?.min);
  const maxTime = parseTime(element.dataset.gTimePickerMax || input.max || output?.max);
  const inBounds = (time) => (!minTime || seconds(time) >= seconds(minTime)) && (!maxTime || seconds(time) <= seconds(maxTime));
  const canonical = (time) => time ? `${pad(time.hour)}:${pad(time.minute)}${withSeconds ? `:${pad(time.second)}` : ""}` : "";
  const valuesFor = (time) => time ? [pad(time.hour), pad(time.minute), ...(withSeconds ? [pad(time.second)] : [])] : [];
  const fromDate = (date) => ({ hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() });
  const initial = parseTime(element.dataset.gTimePickerValue || input.value || output?.value);
  let current = initial && inBounds(initial) ? initial : null;
  let open = inline || !panel.hidden;
  let disposed = false;

  if (!panel.id) panel.id = uid("g-time-picker-panel");
  input.setAttribute("aria-controls", panel.id);
  input.setAttribute("aria-haspopup", "dialog");
  input.setAttribute("role", "combobox");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", panel.getAttribute("aria-label") || input.getAttribute("aria-label") || "Time");
  input.setAttribute("aria-readonly", String(element.getAttribute("aria-readonly") === "true" || input.readOnly));

  const nearestValid = (time) => {
    if (inBounds(time)) return time;
    if (minTime && seconds(time) < seconds(minTime)) return { ...minTime };
    if (maxTime && seconds(time) > seconds(maxTime)) return { ...maxTime };
    return time;
  };
  const displayStatus = () => {
    if (!current) return element.dataset.gTimePickerEmptyLabel || originalStatus;
    const date = new Date(2024, 0, 1, current.hour, current.minute, current.second);
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", ...(withSeconds ? { second: "2-digit" } : {}), hour12: twelveHour }).format(date);
  };
  function writeValues(value) {
    if (disposed) return;
    const liveOutput = element.querySelector("[data-g-time-picker-output], [data-g-wheel-output]");
    input.value = value;
    input.setAttribute("value", value);
    if (liveOutput) { liveOutput.value = value; liveOutput.setAttribute("value", value); }
  }
  function sync(reason, notify = true) {
    const value = canonical(current);
    const values = valuesFor(current);
    writeValues(value);
    element.dataset.gTimePickerValue = value;
    element.classList.toggle("is-empty", !current);
    element.classList.toggle("is-selected", Boolean(current));
    element.classList.remove("is-invalid");
    element.setAttribute("aria-invalid", "false");
    input.setAttribute("aria-invalid", "false");
    if (clearButton) clearButton.hidden = !current;
    if (status) status.textContent = displayStatus();
    if (notify) emit(element, "wheelchange", { values, value, hour: values[0] || "", minute: values[1] || "", second: values[2] || "", reason });
    queueMicrotask(() => writeValues(value));
  }
  const candidateFor = (part, raw) => {
    const base = current ? { ...current } : fromDate(new Date());
    const value = Number(raw);
    if (part === "period") {
      const hour = base.hour % 12;
      base.hour = raw === "PM" ? hour + 12 : hour;
    } else if (part === "hour" && twelveHour) {
      const pm = base.hour >= 12;
      base.hour = value % 12 + (pm ? 12 : 0);
    } else base[part] = value;
    if (!withSeconds) base.second = 0;
    return base;
  };
  const optionIsFeasible = (part, raw) => {
    const candidate = candidateFor(part, raw);
    let first = seconds(candidate);
    let last = first;
    if (part === "hour") { first = candidate.hour * 3600; last = first + 3599; }
    else if (part === "minute") { first = candidate.hour * 3600 + candidate.minute * 60; last = first + 59; }
    else if (part === "period") { first = raw === "PM" ? 43200 : 0; last = first + 43199; }
    return (!minTime || last >= seconds(minTime)) && (!maxTime || first <= seconds(maxTime));
  };
  function render(focusPart = "") {
    const displayHour = current ? current.hour % 12 || 12 : null;
    const definitions = [
      { part: "hour", label: element.dataset.gTimePickerHourLabel || "HH", values: twelveHour ? Array.from({ length: 12 }, (_, index) => index + 1).filter((value) => (value - 1) % stepHour === 0) : Array.from({ length: 24 }, (_, index) => index).filter((value) => value % stepHour === 0), selected: twelveHour ? displayHour : current?.hour },
      { part: "minute", label: element.dataset.gTimePickerMinuteLabel || "MM", values: Array.from({ length: 60 }, (_, index) => index).filter((value) => value % stepMinute === 0), selected: current?.minute },
      ...(withSeconds ? [{ part: "second", label: element.dataset.gTimePickerSecondLabel || "SS", values: Array.from({ length: 60 }, (_, index) => index).filter((value) => value % stepSecond === 0), selected: current?.second }] : []),
      ...(twelveHour ? [{ part: "period", label: element.dataset.gTimePickerPeriodLabel || "AM/PM", values: ["AM", "PM"], selected: current ? current.hour >= 12 ? "PM" : "AM" : null }] : []),
    ];
    element.style.setProperty("--g-time-columns", String(definitions.length));
    const fragment = document.createDocumentFragment();
    definitions.forEach((definition) => {
      const column = document.createElement("div");
      column.className = "g-time-picker-column";
      column.dataset.gWheelColumn = "";
      column.dataset.gTimePart = definition.part;
      column.setAttribute("role", "listbox");
      column.setAttribute("aria-label", definition.label);
      const header = document.createElement("span");
      header.className = "g-time-picker-column-header";
      header.textContent = definition.label;
      header.setAttribute("aria-hidden", "true");
      column.append(header);
      definition.values.forEach((raw) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "g-time-picker-option";
        option.dataset.gWheelOption = "";
        option.dataset.gTimePart = definition.part;
        option.dataset.gValue = typeof raw === "number" ? pad(raw) : String(raw);
        option.setAttribute("role", "option");
        const selected = raw === definition.selected;
        option.setAttribute("aria-selected", String(selected));
        option.disabled = !optionIsFeasible(definition.part, raw) || element.getAttribute("aria-disabled") === "true";
        option.tabIndex = selected && !option.disabled ? 0 : -1;
        option.textContent = typeof raw === "number" ? pad(raw) : raw;
        column.append(option);
      });
      if (!column.querySelector('[role="option"][tabindex="0"]')) column.querySelector('[role="option"]:not(:disabled)')?.setAttribute("tabindex", "0");
      fragment.append(column);
    });
    columnsHost.replaceChildren(fragment);
    queueMicrotask(() => {
      columnsHost.querySelectorAll('.g-time-picker-option[aria-selected="true"]').forEach((option) => option.scrollIntoView?.({ block: "center" }));
      if (focusPart) columnsHost.querySelector(`[data-g-time-part="${focusPart}"][aria-selected="true"]`)?.focus();
    });
  }
  function select(option, reason = "option") {
    if (!option || isDisabled(option) || element.getAttribute("aria-readonly") === "true") return valuesFor(current);
    const part = option.dataset.gTimePart || option.closest("[data-g-time-part]")?.dataset.gTimePart;
    if (!part) return valuesFor(current);
    current = nearestValid(candidateFor(part, option.dataset.gValue));
    sync(reason);
    render(part);
    return valuesFor(current);
  }
  function setTime(value, reason = "api") {
    const next = parseTime(value);
    if (!next || !inBounds(next)) return false;
    current = next;
    sync(reason);
    render();
    return true;
  }
  function clear(reason = "clear") { if (element.getAttribute("aria-readonly") === "true") return; current = null; sync(reason); render(); }
  function show() { if (inline || element.getAttribute("aria-disabled") === "true") return; open = true; panel.hidden = false; element.classList.add("is-open"); input.setAttribute("aria-expanded", "true"); }
  function hide(focus = false) { if (inline) return; open = false; panel.hidden = true; element.classList.remove("is-open"); input.setAttribute("aria-expanded", "false"); if (focus) input.focus({ preventScroll: true }); }
  function inputChange() {
    if (!input.value.trim()) { clear("input"); return; }
    if (!setTime(input.value, "input")) {
      element.classList.add("is-invalid");
      element.setAttribute("aria-invalid", "true");
      input.setAttribute("aria-invalid", "true");
      if (status) status.textContent = element.dataset.gTimePickerInvalidLabel || originalStatus;
    }
  }
  function preset(name) {
    const now = new Date();
    const presets = { morning: { hour: 9, minute: 0, second: 0 }, noon: { hour: 12, minute: 0, second: 0 }, evening: { hour: 18, minute: 0, second: 0 } };
    current = nearestValid(name === "now" ? fromDate(now) : presets[name] || fromDate(now));
    sync(`preset:${name || "now"}`);
    render();
  }
  function click(event) {
    const option = event.target.closest("[data-g-wheel-option]");
    if (option) { event.preventDefault(); select(option); return; }
    const presetButton = event.target.closest("[data-g-time-picker-preset]");
    if (presetButton) { event.preventDefault(); preset(presetButton.dataset.gTimePickerPreset); return; }
    if (event.target.closest("[data-g-time-picker-clear]")) { event.preventDefault(); clear(); return; }
    if (event.target.closest("[data-g-time-picker-now]")) { event.preventDefault(); preset("now"); return; }
    if (event.target.closest("[data-g-time-picker-apply]")) { event.preventDefault(); sync("apply"); hide(true); return; }
    if (event.target.closest("[data-g-time-picker-trigger]")) open ? hide() : show();
  }
  function keydown(event) {
    const option = event.target.closest("[data-g-wheel-option]");
    if (option) {
      const column = option.closest("[data-g-wheel-column]");
      const options = [...column.querySelectorAll("[data-g-wheel-option]:not(:disabled)")];
      const index = options.indexOf(option);
      let next = null;
      if (event.key === "ArrowUp") next = options[index - 1] || options.at(-1);
      else if (event.key === "ArrowDown") next = options[index + 1] || options[0];
      else if (event.key === "Home") next = options[0];
      else if (event.key === "End") next = options.at(-1);
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const columns = [...columnsHost.querySelectorAll("[data-g-wheel-column]")];
        const targetColumn = columns[columns.indexOf(column) + (event.key === "ArrowRight" ? 1 : -1)];
        next = targetColumn?.querySelector('[data-g-wheel-option][aria-selected="true"]:not(:disabled), [data-g-wheel-option]:not(:disabled)');
      } else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(option, "keyboard"); return; }
      else if (event.key === "Escape") { event.preventDefault(); hide(true); return; }
      else return;
      event.preventDefault();
      next?.focus();
      if (next?.closest("[data-g-wheel-column]") === column) select(next, "keyboard");
      return;
    }
    if (event.target === input && (event.key === "ArrowDown" || event.key === "Enter")) { event.preventDefault(); show(); columnsHost.querySelector('[aria-selected="true"]:not(:disabled), [role="option"]:not(:disabled)')?.focus(); }
    else if (event.key === "Escape") hide(true);
  }
  function outside(event) { if (open && !inline && !element.contains(event.target)) hide(); }
  panel.hidden = !inline && !open;
  input.setAttribute("aria-expanded", String(open));
  input.addEventListener("focus", show);
  input.addEventListener("change", inputChange);
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  document.addEventListener("pointerdown", outside, true);
  sync("init", false);
  render();
  return {
    select,
    values: () => valuesFor(current),
    destroy: () => {
      disposed = true;
      input.removeEventListener("focus", show);
      input.removeEventListener("change", inputChange);
      element.removeEventListener("click", click);
      element.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", outside, true);
      columnsHost.innerHTML = originalColumns;
      input.value = originalInput;
      if (status) status.textContent = originalStatus;
      panel.hidden = !open;
      element.style.removeProperty("--g-time-columns");
    },
  };
}

function createWheelPicker(element) {
  if(element.hasAttribute('data-g-mobile-options'))return null;
  if (element.classList.contains("g-time-picker")) return createTimePicker(element);
  const columns = [...element.querySelectorAll("[data-g-wheel-column]")]; const output = element.querySelector("[data-g-wheel-output]"); const timers = new WeakMap();
  function options(column) { return [...column.querySelectorAll("[data-g-wheel-option]")]; }
  const enabled = (column) => options(column).filter((option) => !isDisabled(option));
  function select(option, reason = "option") { if (isDisabled(option)) return; const column = option.closest("[data-g-wheel-column]"); if (!column) return; options(column).forEach((item) => item.setAttribute("aria-selected", String(item === option))); option.scrollIntoView({ block: "center", behavior: reason === "scroll" ? "auto" : "smooth" }); const values = columns.map((item) => item.querySelector('[data-g-wheel-option][aria-selected="true"]')?.dataset.gValue || ""); if (output) output.value = JSON.stringify(values); emit(element, "wheelchange", { values, reason }); }
  function click(event) { const option = event.target.closest("[data-g-wheel-option]"); if (option) select(option); }
  function keydown(event) { const option = event.target.closest("[data-g-wheel-option]"); if (isDisabled(option) || !["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return; event.preventDefault(); const list = enabled(option.closest("[data-g-wheel-column]")); const index = list.indexOf(option); const next = event.key === "Home" ? list[0] : event.key === "End" ? list.at(-1) : list[index + (event.key === "ArrowDown" ? 1 : -1)] || option; next?.focus(); select(next, "keyboard"); }
  function scroll(event) { const column = event.currentTarget; clearTimeout(timers.get(column)); timers.set(column, setTimeout(() => { const center = column.getBoundingClientRect().top + column.clientHeight / 2; const nearest = enabled(column).sort((a, b) => Math.abs(a.getBoundingClientRect().top + a.clientHeight / 2 - center) - Math.abs(b.getBoundingClientRect().top + b.clientHeight / 2 - center))[0]; if (nearest) select(nearest, "scroll"); }, 90)); }
  columns.forEach((column) => { column.addEventListener("scroll", scroll, { passive: true }); const selected = column.querySelector('[data-g-wheel-option][aria-selected="true"]:not([aria-disabled="true"])') || enabled(column)[0]; if (selected) select(selected, "init"); }); element.addEventListener("click", click); element.addEventListener("keydown", keydown);
  return { select, values: () => columns.map((column) => column.querySelector('[data-g-wheel-option][aria-selected="true"]')?.dataset.gValue || ""), destroy: () => { columns.forEach((column) => { clearTimeout(timers.get(column)); column.removeEventListener("scroll", scroll); }); element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createAIComposer(element) {
  if(element.hasAttribute('data-g-ai-options'))return null;
  const input = element.querySelector("[data-g-composer-input], .g-composer-input");
  const send = element.querySelector("[data-g-composer-send]");
  const stop = element.querySelector("[data-g-composer-stop]");
  const status = element.querySelector("[data-g-composer-status]");
  if (!input) return null;
  let streaming = element.classList.contains("is-streaming");
  function resize() { input.style.height = "auto"; input.style.height = `${Math.min(input.scrollHeight, Number(element.dataset.gMaxHeight || 224))}px`; }
  function sync() { const empty = !input.value.trim(); if (send) send.disabled = empty || streaming; if (stop) stop.hidden = !streaming; element.classList.toggle("is-empty", empty); if (status && !streaming) status.textContent = empty ? element.dataset.gEmptyLabel || message("composer.empty") : element.dataset.gReadyLabel || message("composer.ready"); resize(); }
  function setStreaming(value, reason = "api") { streaming = Boolean(value); element.classList.toggle("is-streaming", streaming); element.setAttribute("aria-busy", String(streaming)); if (status) status.textContent = streaming ? element.dataset.gStreamingLabel || message("composer.streaming") : element.dataset.gReadyLabel || message("composer.ready"); sync(); emit(element, "composerstate", { streaming, reason }); }
  function submit(reason = "api") { const value = input.value.trim(); if (!value || streaming || !emit(element, "beforepromptsubmit", { value, reason, input })) return; emit(element, "promptsubmit", { value, reason, input }); if (element.dataset.gClearOnSend !== "false") input.value = ""; sync(); }
  function stopGeneration(reason = "api") { if (!streaming || !emit(element, "beforepromptstop", { reason })) return; setStreaming(false, reason); emit(element, "promptstop", { reason }); }
  function keydown(event) { if (event.key === "Enter" && !event.shiftKey && !event.altKey && !event.isComposing) { event.preventDefault(); submit("keyboard"); } }
  function click(event) { if (event.target.closest("[data-g-composer-send]")) submit("button"); else if (event.target.closest("[data-g-composer-stop]")) stopGeneration("button"); else { const remove = event.target.closest("[data-g-attachment-remove]"); if (remove) { const attachment = remove.closest(".g-attachment"); if (attachment && emit(element, "attachmentremove", { attachment })) attachment.remove(); } } }
  input.addEventListener("input", sync); input.addEventListener("keydown", keydown); element.addEventListener("click", click); sync();
  return { submit, stop: stopGeneration, setStreaming, value: () => input.value, focus: () => input.focus(), destroy: () => { input.removeEventListener("input", sync); input.removeEventListener("keydown", keydown); element.removeEventListener("click", click); } };
}

function createPromptFill(element) {
  if(element.hasAttribute('data-g-ai-options'))return null;
  function click(event) { const item = event.target.closest("[data-g-prompt-value]"); if (isDisabled(item)) return; const target = targetById(item.dataset.gPromptTarget || element.dataset.gPromptTarget); if (!target || isDisabled(target)) return; const value = item.dataset.gPromptValue || item.dataset.gValue || item.textContent.trim(); target.value = value; target.dispatchEvent(new Event("input", { bubbles: true })); target.focus(); emit(element, "promptfill", { value, item, target }); }
  element.addEventListener("click", click);
  return { fill: (item) => click({ target: item }), destroy: () => element.removeEventListener("click", click) };
}

function createAIApproval(element) {
  if(element.hasAttribute('data-g-ai-options'))return null;
  const choices = [...element.querySelectorAll("[data-g-approval-choice]")];
  function choose(choice, reason = "api") { if (isDisabled(choice)) return; const value = choice.dataset.gApprovalChoice; if (!emit(element, "beforeapproval", { value, choice, reason })) return; element.dataset.gApprovalState = value; ["approved", "rejected", "cancelled"].forEach((state) => element.classList.toggle(`is-${state}`, value === state)); choices.forEach((item) => { item.setAttribute("aria-pressed", String(item === choice)); if (element.dataset.gKeepEnabled !== "true") item.disabled = true; }); emit(element, "approval", { value, choice, reason }); }
  function click(event) { choose(event.target.closest("[data-g-approval-choice]"), "pointer"); }
  element.addEventListener("click", click);
  return { choose, reset: () => { delete element.dataset.gApprovalState; element.classList.remove("is-approved", "is-rejected", "is-cancelled"); choices.forEach((item) => { item.disabled = false; item.setAttribute("aria-pressed", "false"); }); }, destroy: () => element.removeEventListener("click", click) };
}

function createAIFeedback(element) {
  if(element.hasAttribute('data-g-ai-options'))return null;
  const options = [...element.querySelectorAll("[data-g-feedback-value]")];
  const detail = element.querySelector("[data-g-feedback-detail]");
  const comment = element.querySelector("[data-g-feedback-comment]");
  const output = element.querySelector("[data-g-feedback-output]");
  let value = output?.value || "";
  function select(option, reason = "api") { if (isDisabled(option)) return; value = option.dataset.gFeedbackValue; options.forEach((item) => item.setAttribute("aria-pressed", String(item === option))); if (output) output.value = value; if (detail) detail.hidden = false; emit(element, "feedbackchange", { value, option, reason }); }
  function submit(reason = "api") { if (!value) return; emit(element, "feedbacksubmit", { value, comment: comment?.value || "", reason }); element.classList.add("is-submitted"); }
  function click(event) { const option = event.target.closest("[data-g-feedback-value]"); if (option) select(option, "pointer"); else if (event.target.closest("[data-g-feedback-submit]")) submit("button"); }
  element.addEventListener("click", click); if (value) select(options.find((item) => item.dataset.gFeedbackValue === value), "init");
  return { select, submit, value: () => value, destroy: () => element.removeEventListener("click", click) };
}

function createShortcutRecorder(element) {
  const control = element.querySelector("[data-g-shortcut-control]") || element;
  const output = element.querySelector("[data-g-shortcut-output]");
  const display = element.querySelector("[data-g-shortcut-display]");
  const status = element.querySelector("[data-g-shortcut-status]");
  let recording = false; let value = output?.value || element.dataset.gValue || "";
  const modifierOrder = ["Control", "Alt", "Shift", "Meta"];
  function format(shortcut) { return shortcut ? shortcut.replaceAll("Control", navigator.platform.includes("Mac") ? "⌃" : "Ctrl").replaceAll("Meta", navigator.platform.includes("Mac") ? "⌘" : "Meta").replaceAll("Alt", navigator.platform.includes("Mac") ? "⌥" : "Alt").replaceAll("Shift", navigator.platform.includes("Mac") ? "⇧" : "Shift") : element.dataset.gEmptyLabel || message("shortcut.empty"); }
  function sync(reason = "api") { if (output) output.value = value; if (display) display.textContent = format(value); element.dataset.gValue = value; emit(element, "shortcutchange", { value, reason }); }
  function stop(reason = "cancel") { recording = false; control.classList.remove("is-recording"); control.setAttribute("aria-pressed", "false"); if (status) status.textContent = reason === "recorded" ? element.dataset.gSavedLabel || message("shortcut.saved") : element.dataset.gIdleLabel || message("shortcut.idle"); }
  function start() { recording = true; control.classList.add("is-recording"); control.setAttribute("aria-pressed", "true"); if (status) status.textContent = element.dataset.gRecordingLabel || message("shortcut.recording"); control.focus(); }
  function keydown(event) { if (!recording) return; event.preventDefault(); event.stopPropagation(); if (event.key === "Escape") return stop(); if (["Backspace", "Delete"].includes(event.key)) { value = ""; sync("clear"); return stop("recorded"); } if (["Control", "Alt", "Shift", "Meta"].includes(event.key)) return; const pressed = { Control: event.ctrlKey, Alt: event.altKey, Shift: event.shiftKey, Meta: event.metaKey }; const modifiers = modifierOrder.filter((name) => pressed[name]); const key = event.key.length === 1 ? event.key.toLocaleUpperCase() : event.key; value = [...modifiers, key].join("+"); sync("keyboard"); stop("recorded"); }
  function click(event) { if (event.target.closest("[data-g-shortcut-clear]")) { value = ""; sync("clear"); stop("recorded"); } else start(); }
  control.addEventListener("click", click); control.addEventListener("keydown", keydown); sync("init"); stop();
  return { start, stop, clear: () => { value = ""; sync("api"); }, value: () => value, destroy: () => { control.removeEventListener("click", click); control.removeEventListener("keydown", keydown); } };
}

function createDesktopTabs(element) {
  const tabs = () => [...element.querySelectorAll("[data-g-desktop-tab]")];
  function select(tab, reason = "api", focus = false) { if (isDisabled(tab)) return; tabs().forEach((item) => { const active = item === tab; item.setAttribute("aria-selected", String(active)); item.classList.toggle("is-active", active); item.tabIndex = active ? 0 : -1; const panel = targetById(item.getAttribute("aria-controls")); if (panel) panel.hidden = !active; }); if (focus) tab.focus(); emit(element, "desktoptabchange", { tab, reason }); }
  function close(tab, reason = "api") { if (!tab || !emit(element, "beforetabclose", { tab, reason, dirty: tab.classList.contains("is-dirty") })) return; const list = tabs(); const index = list.indexOf(tab); const wasActive = tab.getAttribute("aria-selected") === "true" || tab.classList.contains("is-active"); const panel = targetById(tab.getAttribute("aria-controls")); panel?.remove(); tab.remove(); const remaining = tabs(); if (wasActive) select(remaining[Math.min(index, remaining.length - 1)], "close", true); emit(element, "desktoptabclose", { reason }); }
  function click(event) { const closeButton = event.target.closest("[data-g-desktop-tab-close]"); const tab = event.target.closest("[data-g-desktop-tab]"); if (closeButton) { event.stopPropagation(); close(closeButton.closest("[data-g-desktop-tab]"), "button"); } else if (tab) select(tab, "pointer"); }
  function pointerdown(event) { if (event.button === 1) { const tab = event.target.closest("[data-g-desktop-tab]"); if (tab) { event.preventDefault(); close(tab, "middle-click"); } } }
  function keydown(event) { const list = tabs(); const current = event.target.closest("[data-g-desktop-tab]") || list.find((tab) => tab.getAttribute("aria-selected") === "true"); if (!current) return; const index = list.indexOf(current); if ((event.ctrlKey || event.metaKey) && event.key === "Tab") { event.preventDefault(); select(list[(index + (event.shiftKey ? -1 : 1) + list.length) % list.length], "shortcut", true); } else if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "w") { event.preventDefault(); close(current, "shortcut"); } else if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? list[0] : event.key === "End" ? list.at(-1) : list[(index + (event.key === "ArrowRight" ? 1 : -1) + list.length) % list.length]; select(next, "keyboard", true); } }
  element.setAttribute("role", element.getAttribute("role") || "tablist"); tabs().forEach((tab) => tab.setAttribute("role", tab.getAttribute("role") || "tab")); element.addEventListener("click", click); element.addEventListener("pointerdown", pointerdown); element.addEventListener("keydown", keydown); const initial = tabs().find((tab) => tab.getAttribute("aria-selected") === "true") || tabs()[0]; if (initial) select(initial, "init");
  return { select, close, tabs, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("pointerdown", pointerdown); element.removeEventListener("keydown", keydown); } };
}

function createNativeFilePicker(element) {
  const input = element.querySelector("input[type='file']"); const trigger = element.querySelector("[data-g-native-file-trigger]"); const value = element.querySelector("[data-g-native-file-value]"); if (!input || !trigger) return null;
  function sync(reason = "change") { const files = [...input.files]; if (value) value.textContent = files.length ? files.map((file) => file.name).join(", ") : element.dataset.gEmptyLabel || message("file.none"); emit(element, "nativefiles", { files, input, reason }); }
  function open() { if (!emit(element, "beforefilepicker", { input })) return; input.click(); }
  function change() { sync(); }
  trigger.addEventListener("click", open); input.addEventListener("change", change); sync("init");
  return { open, files: () => [...input.files], clear: () => { input.value = ""; sync("clear"); }, destroy: () => { trigger.removeEventListener("click", open); input.removeEventListener("change", change); } };
}

function createWindowSwitcher(element) {
  const panel = element.querySelector(".g-desktop-window-switcher-panel") || element; const items = () => [...element.querySelectorAll("[data-g-window-item]")]; let open = !element.hidden; let trigger = null;
  function select(item, reason = "api") { if (!item) return; items().forEach((node) => node.setAttribute("aria-selected", String(node === item))); item.focus(); emit(element, "windowselect", { item, value: item.dataset.gValue, reason }); }
  function show(source = document.activeElement) { if (open) return; open = true; trigger = source; element.hidden = false; element.setAttribute("aria-hidden", "false"); select(items().find((item) => item.getAttribute("aria-selected") === "true") || items()[0], "open"); emit(element, "open", { source }); }
  function hide(reason = "api") { if (!open) return; open = false; element.hidden = true; element.setAttribute("aria-hidden", "true"); trigger?.focus?.(); emit(element, "close", { reason }); }
  function keydown(event) { const list = items(); const current = list.indexOf(document.activeElement); if ((event.ctrlKey || event.metaKey) && event.key === "`") { event.preventDefault(); open ? select(list[(current + 1) % list.length], "shortcut") : show(); } else if (!open) return; else if (event.key === "Escape") { event.preventDefault(); hide("escape"); } else if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(event.key)) { event.preventDefault(); select(list[(current + (["ArrowDown", "ArrowRight"].includes(event.key) ? 1 : -1) + list.length) % list.length], "keyboard"); } else if (event.key === "Enter") { event.preventDefault(); emit(element, "windowactivate", { item: document.activeElement, value: document.activeElement?.dataset.gValue }); hide("activate"); } }
  function click(event) { const item = event.target.closest("[data-g-window-item]"); if (item) { select(item, "pointer"); emit(element, "windowactivate", { item, value: item.dataset.gValue }); hide("activate"); } else if (event.target === element) hide("backdrop"); }
  if (open) { open = false; queueMicrotask(show); } else { element.hidden = true; element.setAttribute("aria-hidden", "true"); } document.addEventListener("keydown", keydown); element.addEventListener("click", click); panel.tabIndex = panel.tabIndex < 0 ? -1 : panel.tabIndex;
  return { open: show, close: hide, select, isOpen: () => open, destroy: () => { document.removeEventListener("keydown", keydown); element.removeEventListener("click", click); element.hidden = true; } };
}

[
  ["dialog", (element) => createOverlay(element, "dialog")],
  ["drawer", (element) => createOverlay(element, "drawer")],
  ["mobile-sheet", (element) => createOverlay(element, "mobile-sheet")],
  ["dropdown", createDropdown], ["stepper", createStepper], ["tag", createTag], ["tabs", createTabs], ["accordion", createAccordion],
  ["auto-resize", createAutoResize], ["combobox", createCombobox],
  ["password-toggle", createPasswordToggle], ["clear-input", createClearInput],
  ["otp-input", createOtpInput], ["password-strength", createPasswordStrength], ["auth-timer", createAuthTimer],
  ["quantity-stepper", createQuantityStepper], ["sku-selector", createSkuSelector], ["cart", createCart], ["coupon", createCoupon],
  ["pull-refresh", createPullRefresh], ["infinite-load", createInfiniteLoad], ["swipe-actions", createSwipeActions], ["wheel-picker", createWheelPicker],
  ["ai-composer", createAIComposer], ["prompt-fill", createPromptFill], ["ai-approval", createAIApproval], ["ai-feedback", createAIFeedback],
  ["shortcut-recorder", createShortcutRecorder], ["desktop-tabs", createDesktopTabs], ["native-file-picker", createNativeFilePicker], ["window-switcher", createWindowSwitcher],
  ["character-count", createCharacterCount], ["field-sync", createFieldSync], ["conditional-field", createConditionalField],
  ["rating", createRating], ["validation-summary", createValidationSummary],
  ["repeatable-field", createRepeatableField],
  ["tooltip", (element) => createFloating(element, "tooltip")], ["popover", (element) => createFloating(element, "popover")],
  ["tour", createTour],
  ["carousel", createCarousel], ["split-pane", createSplitter], ["foundation", createFoundationController],
  ["tree", createTree],
  ["data-grid", createDataGrid], ["data-display", createDataDisplay], ["dashboard", createDashboard], ["interaction", createInteraction], ["content", createContent], ["layout", createLayout], ["help", createHelp], ["ai", createAI], ["media", createManagedMedia], ["auth", createAuth], ["mobile", createManagedMobile], ["workflow", createManagedWorkflow], ["communication", createManagedCommunication], ["legal", createManagedLegal], ["solution", createManagedSolution], ["desktop", createManagedDesktop], ["enterprise", createManagedEnterprise], ["marketing", createManagedMarketing], ["cms", createManagedCms], ["commerce", createCommerce], ["table-scroll", createTableScroll], ["table-density", createTableDensity], ["filter-summary", createFilterSummary],
  ["table-sort", createTableSort], ["row-select", createRowSelect],
  ["row-disclosure", createRowDisclosure], ["column-toggle", createColumnToggle],
  ["data-filter", createDataFilter], ["data-view", createDataView],
  ["transfer", createTransfer], ["picker", createPicker], ["cascader", createCascader], ["range-picker", createRangePicker],
  ["saved-choice", createSavedChoice], ["builder-list", createBuilderList],
  ["toast", createToast], ["copy", createCopy],
  ["fullscreen", createFullscreen], ["scroll-top", createScrollTop], ["dropzone", createDropzone],
  ["nav-toggle", createNavToggle], ["roving-nav", createRovingNav], ["context-menu", createContextMenu],
  ["scrollspy", createScrollspy], ["jump-nav", createJumpNav],
  ["upload-manager", createUploadManager], ["file-browser", createFileBrowser], ["media-player", createMediaPlayer],
  ["editor-shell", createEditorShell], ["revision-compare", createRevisionCompare], ["autosave", createAutosave],
  ["command-palette", createCommandPalette]
].forEach(([name, factory]) => register(name, factory));

function initElement(element, name) {
  if(element.hasAttribute("data-g-desktop-options")&&name!=="desktop"){const previous=instanceStores.get(element)?.get(name);previous?.destroy?.();instanceStores.get(element)?.delete(name);return null;}
  const store = storeFor(element);
  if(name==='accordion'&&store.has(name)&&element.hasAttribute('data-g-disclosure-options')!==configuredCollapseRoots.has(element)){store.get(name)?.destroy?.();store.delete(name);}
  if(name==='tree'&&store.has(name)&&element.hasAttribute('data-g-tree-options')!==(typeof store.get(name)?.setOptions==='function')){store.get(name)?.destroy?.();store.delete(name);}
  if (store.has(name)) return store.get(name);
  const factory = registry.get(name);
  if (!factory) return null;
  const instance = factory(element);
  if (instance) { store.set(name, instance); emit(element, "init", { name, instance }); }
  return instance;
}

// Basic components retain framework-owned markup and share progressive enhancement.
const basicSelector = '.g-btn,.g-btn-group,.g-card,.g-badge,.g-tag,.g-chip,.g-avatar,.g-avatar-group';
const basicStores = new WeakMap();
const basicFlag = (element, name) => element.hasAttribute(name) && !['false','0'].includes(element.getAttribute(name));
const basicBlocked = (element) => element.closest(':is(.g-btn,.g-btn-group,.g-card,.g-tag,.g-chip,.g-avatar,.g-avatar-group):is(.is-disabled,[aria-disabled="true"],.is-loading,[aria-busy="true"],.g-btn-loading,.g-tag-loading,.g-avatar-loading)');
function initBasic(element) {
  if (basicStores.has(element)) return;
  const managed = new Set();
  let disposed = false, queued = false;
  const sync = () => {
    if (disposed) return;
    const controls = [...(element.matches('button') ? [element] : []), ...element.querySelectorAll('button')];
    for (const control of controls) {
      if (basicBlocked(control)) { if (!control.disabled) { managed.add(control); control.disabled = true; } }
      else if (managed.delete(control)) control.disabled = false;
    }
    if (element.matches('.g-badge[data-g-basic-count]')) {
      const output = element.querySelector('.g-badge-indicator,.g-badge-value') || (!element.matches('.g-badge-attached') ? element : null);
      const count = Math.max(0, Number(element.getAttribute('data-g-basic-count')) || 0);
      const limit = Math.max(0, Number(element.getAttribute('data-g-basic-max') ?? 99) || 0);
      if (output) {
        const text = count > limit ? `${limit}+` : String(count);
        if (output.textContent !== text) output.textContent = text;
        output.hidden = count === 0 && !basicFlag(element, 'data-g-basic-show-zero');
        if (!element.matches('.g-badge-attached')) element.hidden = output.hidden;
      }
    }
    if (element.matches('.g-avatar-group[data-g-basic-max]')) {
      const children = [...element.children].filter(child=>child.matches('.g-avatar:not(.g-avatar-overflow)'));
      const limit = Math.max(0, Math.floor(Number(element.getAttribute('data-g-basic-max')) || 0));
      children.forEach((child,index)=>child.hidden=index>=limit);
      const overflow = element.querySelector('.g-avatar-overflow');
      if (overflow) { const text = `+${Math.max(0, children.length-limit)}`; if (overflow.textContent !== text) overflow.textContent=text;overflow.hidden=children.length<=limit; }
    }
    if (element.matches('.g-avatar')) {
      const img = element.querySelector('img');
      const failed = !!(img?.complete && !img.naturalWidth && img.getAttribute('src'));
      if (element.classList.contains('has-image-error') !== failed) element.classList.toggle('has-image-error', failed);
      const text = element.querySelector('.g-avatar-text');
      if (text) {
        const scale = Math.min(1, Math.max(0, element.clientWidth - 8) / Math.max(1, text.scrollWidth));
        const value = String(scale);
        if (text.style.getPropertyValue('--g-avatar-text-scale') !== value) text.style.setProperty('--g-avatar-text-scale', value);
      }
    }
  };
  const schedule = () => { if (queued) return; queued = true; queueMicrotask(() => { queued = false; sync(); }); };
  const guard = (event) => {
    if (!(event.target instanceof Element)) return;
    if (basicBlocked(event.target) && (event.type === 'click' || ['Enter',' '].includes(event.key))) { event.preventDefault(); event.stopImmediatePropagation(); }
  };
  const click = (event) => {
    if (!(event.target instanceof Element) || event.defaultPrevented) return;
    const close = event.target.closest('[data-g-basic-close]');
    if (close && close.closest('.g-tag,.g-chip') === element) {
      if (!emit(element, 'close', { reason: 'close-button' })) return;
      if (!basicFlag(element, 'data-g-basic-controlled')) element.hidden = true;
      return;
    }
    if (basicFlag(element, 'data-g-basic-toggle') && event.target.closest(basicSelector) === element) {
      const value = element.getAttribute('aria-pressed') !== 'true';
      if (!basicFlag(element, 'data-g-basic-controlled')) element.setAttribute('aria-pressed', String(value));
      emit(element, 'change', { value, checked: value });
    }
  };
  element.addEventListener('click', guard, true);element.addEventListener('keydown', guard, true);element.addEventListener('click', click);
  element.addEventListener('load', schedule, true);element.addEventListener('error', schedule, true);
  const observer = new MutationObserver(schedule);
  observer.observe(element, { attributes: true, attributeFilter: ['class','aria-disabled','aria-busy','src','data-g-basic-count','data-g-basic-max','data-g-basic-show-zero'], childList: true, characterData: true, subtree: true });
  const resize = element.matches('.g-avatar') && typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null;
  resize?.observe(element);
  basicStores.set(element, { destroy() { disposed = true;observer.disconnect();resize?.disconnect();element.removeEventListener('click',guard,true);element.removeEventListener('keydown',guard,true);element.removeEventListener('click',click);element.removeEventListener('load',schedule,true);element.removeEventListener('error',schedule,true);managed.forEach(control=>control.disabled=false); } });
  sync();
}

// Form containers share native disabled/read-only semantics and optional range validation.
const formSelector = '.g-form,.g-field,.g-fieldset,.g-form-section,.g-name-group,.g-address-group,.g-phone-group,.g-money-group,.g-date-range-group,.g-time-range-group,.g-choice-group,.g-checkbox-group,.g-radio-group,.g-consent-group,.g-password-field,.g-clearable-field,.g-search-field,.g-input-affix,.g-combobox,.g-switch,.g-check,.g-radio';
const formStores = new WeakMap();
const formReflectedStates = new WeakMap();
function initForm(element) {
  if (formStores.has(element)) return;
  let disposed=false,queued=false,lastRange='';
  const disabledControls=new Set(),readonlyControls=new Set(),customValidity=new Map(),originalStyles=new Map();
  const layoutProperties=[["data-g-form-field-gap","--g-form-field-gap",80],["data-g-form-label-gap","--g-form-label-gap",80],["data-g-form-column-gap","--g-form-column-gap",80],["data-g-form-label-width","--g-form-label-width",600],["data-g-form-control-width","--g-form-control-width",1600]];
  const stateRoot=(node,kind)=>{const selector=kind==='disabled'?'.is-disabled,[aria-disabled="true"],[data-g-form-disabled]:not([data-g-form-disabled="false"])':'.is-read-only,[aria-readonly="true"],[data-g-form-read-only]:not([data-g-form-read-only="false"])';let owner=node.closest(selector);while(owner&&formReflectedStates.get(owner)?.[kind])owner=owner.parentElement?.closest(selector);return owner;};
  const controls=()=>[...element.querySelectorAll('input,textarea,select,button')];
  const sync=()=>{
    if(disposed)return;
    for(const [attribute,property,max]of layoutProperties){const raw=element.getAttribute(attribute),value=raw===null||raw.trim()===""?NaN:Number(raw);if(Number.isFinite(value)){if(!originalStyles.has(property))originalStyles.set(property,element.style.getPropertyValue(property));if(value===0&&attribute.endsWith("width"))element.style.removeProperty(property);else{const css=Math.min(max,Math.max(0,value))+"px";if(element.style.getPropertyValue(property)!==css)element.style.setProperty(property,css);}}else if(originalStyles.has(property)){const prior=originalStyles.get(property);if(prior)element.style.setProperty(property,prior);else element.style.removeProperty(property);originalStyles.delete(property);}}
    const currentControls=new Set(controls());
    for(const control of disabledControls)if(!currentControls.has(control)){control.disabled=false;disabledControls.delete(control);}
    for(const control of readonlyControls)if(!currentControls.has(control)){control.readOnly=false;readonlyControls.delete(control);}
    for(const [control,prior]of customValidity)if(!currentControls.has(control)){control.setCustomValidity(prior.message);if(prior.invalid===null)control.removeAttribute("aria-invalid");else control.setAttribute("aria-invalid",prior.invalid);customValidity.delete(control);}
    for(const control of controls()) {
      const disabled=!!stateRoot(control,'disabled'),readonly=!!stateRoot(control,'readonly');
      if(disabled&&!control.disabled){disabledControls.add(control);control.disabled=true;}
      else if(!disabled&&disabledControls.delete(control))control.disabled=false;
      if(control.matches('textarea,input:not([type=checkbox],[type=radio],[type=range],[type=color],[type=file],[type=button],[type=submit],[type=reset])')) {
        if(readonly&&!control.readOnly){readonlyControls.add(control);control.readOnly=true;}
        else if(!readonly&&readonlyControls.delete(control))control.readOnly=false;
      }
    }
    if(!basicFlag(element,'data-g-form-range')) {
      customValidity.forEach((v,n)=>{n.setCustomValidity(v.message);if(v.invalid===null)n.removeAttribute('aria-invalid');else n.setAttribute('aria-invalid',v.invalid);});
      customValidity.clear();if(lastRange)for(const node of element.querySelectorAll('[data-g-form-range-output],[data-g-form-range-error]'))if(node.textContent)node.textContent='';lastRange='';return;
    }
    const start=element.querySelector('[data-g-form-range-start],.g-date-range-start input,.g-time-range-start input,.g-date-range-start:is(input),.g-time-range-start:is(input)'),end=element.querySelector('[data-g-form-range-end],.g-date-range-end input,.g-time-range-end input,.g-date-range-end:is(input),.g-time-range-end:is(input)');
    if(!start||!end)return;
    const type=start.getAttribute('type')||start.type,time=type==='time',parse=input=>{
      if(!input.value)return NaN;
      if(time){if(!/^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?$/.test(input.value))return NaN;const [h,m,sec=0]=input.value.split(':').map(Number);return h*60+m+sec/60;}
      if(Number.isFinite(input.valueAsNumber))return input.valueAsNumber;
      // Engines without native date/time controls preserve the authored type as an attribute.
      const match=/^(\d{4,})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/.exec(input.value);
      if(!match||type==='date'&&match[4]!==undefined||type==='datetime-local'&&match[4]===undefined)return NaN;
      const [,y,m,d,h='0',minute='0',sec='0',ms='0']=match,stamp=new Date(0);stamp.setUTCFullYear(+y,+m-1,+d);stamp.setUTCHours(+h,+minute,+sec,+(ms.padEnd(3,'0')));
      return +y>0&&stamp.getUTCFullYear()===+y&&stamp.getUTCMonth()===+m-1&&stamp.getUTCDate()===+d&&+h<24&&+minute<60&&+sec<60?stamp.getTime():NaN;
    };
    const from=parse(start),to=parse(end),complete=Number.isFinite(from)&&Number.isFinite(to);let duration=complete?to-from:null;
    if(time&&duration<0&&basicFlag(element,'data-g-form-allow-overnight'))duration+=1440;
    if(!time&&duration!==null)duration/=type==='date'?86400000:60000;
    if(type==='date'&&duration!==null&&duration>=0&&basicFlag(element,'data-g-form-range-inclusive'))duration++;
    const option=(name,fallback)=>{const raw=element.getAttribute(name);return raw!==null&&Number.isFinite(Number(raw))?Number(raw):fallback;};
    const min=option('data-g-form-range-min-duration',0),max=Math.max(min,option('data-g-form-range-max-duration',Infinity));
    const malformed=Boolean(start.value&&!Number.isFinite(from)||end.value&&!Number.isFinite(to));
    const valid=!malformed&&(!complete||(duration>=min&&duration<=max)),error=valid?'':element.dataset.gFormRangeMessage||'The range is outside the allowed bounds.';
    if(!customValidity.has(end))customValidity.set(end,{message:end.validity?.customError?end.validationMessage:'',invalid:end.getAttribute('aria-invalid')});
    const previous=customValidity.get(end);end.setCustomValidity(error||previous.message);if(!valid)end.setAttribute('aria-invalid','true');else if(previous.invalid===null)end.removeAttribute('aria-invalid');else end.setAttribute('aria-invalid',previous.invalid);
    const status=element.querySelector('[data-g-form-range-output]');if(status){const text=complete&&valid?String(duration):'';if(status.textContent!==text)status.textContent=text;}
    const feedback=element.querySelector('[data-g-form-range-error]');if(feedback&&feedback.textContent!==error)feedback.textContent=error;
    const signature=JSON.stringify([start.value,end.value,duration,valid]);if(signature!==lastRange){lastRange=signature;emit(element,'rangechange',{value:[start.value,end.value],start:start.value,end:end.value,duration,valid,complete,reason:'update'});}
  };
  const schedule=()=>{if(queued||disposed)return;queued=true;queueMicrotask(()=>{queued=false;sync();});};
  const guard=event=>{const target=event.target;if(!(target instanceof Element))return;const control=target.closest('input,textarea,select,button,a,[role=button],[role=option]');if(!control)return;
    const readonly=stateRoot(control,'readonly');if(stateRoot(control,'disabled')||readonly&&!control.matches('textarea,input:not([type=checkbox],[type=radio],[type=range],[type=color],[type=file],[type=button],[type=submit],[type=reset])')){
      if(event.type==='click'||event.type==='pointerdown'||event.type==='mousedown'||event.type==='beforeinput'||event.type==='keydown'&&event.key!=='Tab'){event.preventDefault();event.stopImmediatePropagation();}
    }
  };
  const observer=new MutationObserver(schedule);observer.observe(element,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-disabled','aria-readonly','data-g-form-disabled','data-g-form-read-only','data-g-form-range','data-g-form-allow-overnight','data-g-form-range-inclusive','data-g-form-range-min-duration','data-g-form-range-max-duration','data-g-form-range-message','value','data-g-form-size','data-g-form-layout','data-g-form-responsive','data-g-form-label-align','data-g-form-help-visible','data-g-form-colon','data-g-form-required-mark','data-g-form-required-position',...layoutProperties.map(([attribute])=>attribute)]});
  for(const type of ['click','keydown','beforeinput','pointerdown','mousedown'])element.addEventListener(type,guard,true);
  element.addEventListener('input',schedule);element.addEventListener('change',schedule);const form=element.closest('form'),reset=()=>setTimeout(schedule,0);form?.addEventListener('reset',reset);
  formStores.set(element,{refresh:sync,destroy(){originalStyles.forEach((value,key)=>value?element.style.setProperty(key,value):element.style.removeProperty(key));disposed=true;observer.disconnect();for(const type of ['click','keydown','beforeinput','pointerdown','mousedown'])element.removeEventListener(type,guard,true);element.removeEventListener('input',schedule);element.removeEventListener('change',schedule);form?.removeEventListener('reset',reset);disabledControls.forEach(n=>n.disabled=false);readonlyControls.forEach(n=>n.readOnly=false);customValidity.forEach((v,n)=>{n.setCustomValidity(v.message);if(v.invalid===null)n.removeAttribute('aria-invalid');else n.setAttribute('aria-invalid',v.invalid);});}});
  sync();
}

// Feedback enhancements are opt-in for data/state changes and retain framework-owned children.
const feedbackSelector = '.g-alert,.g-progress,.g-spinner,.g-empty,.g-status-bar,.g-context-bar,.g-page-loading,.g-page-state';
const feedbackStores = new WeakMap();
function initFeedback(element) {
  if (feedbackStores.has(element)) return;
  let disposed = false, queued = false, timer, loadingKey;
  const controls = new Set(), inertNodes = new Map(), originals = new Map();
  const remember = (name) => { if (!originals.has(name)) originals.set(name, element.getAttribute(name)); };
  const attr = (name, value) => { remember(name); const text = value == null ? null : String(value); if (text == null) element.removeAttribute(name); else if (element.getAttribute(name) !== text) element.setAttribute(name,text); };
  const initialLoaded = element.classList.contains('is-loaded'), initialHidden = element.classList.contains('is-hidden');
  const setInert = (node, active) => { if (!inertNodes.has(node)) inertNodes.set(node,node.hasAttribute('inert')); if(active) node.setAttribute('inert',''); else if (!inertNodes.get(node)) node.removeAttribute('inert'); };
  const number = (name, fallback) => { const raw=element.getAttribute(name);return raw!==null&&Number.isFinite(Number(raw))?Number(raw):fallback; };
  const sync = () => {
    if (disposed) return;
    if(element.hasAttribute('data-g-feedback-value')) {
      const min=number('data-g-feedback-min',0),max=Math.max(min,number('data-g-feedback-max',100)),value=Math.min(max,Math.max(min,number('data-g-feedback-value',min))),percent=max===min?0:(value-min)/(max-min)*100;
      const unknown=element.matches('.is-indeterminate,.g-progress-indeterminate');
      const cssValue=`${percent}%`;
      for(const name of ['--g-progress-value','--g-page-loading-progress','--g-context-progress','--g-status-bar-progress'])if(element.style.getPropertyValue(name)!==cssValue)element.style.setProperty(name,cssValue);
      element.style.setProperty('--g-progress-dashboard-value',`${percent*.75}%`);
      for(const [attribute,property]of [['data-g-feedback-buffer','--g-progress-buffer-value'],['data-g-feedback-success','--g-progress-success-value']]){const raw=Math.min(max,Math.max(min,number(attribute,min))),extra=attribute==='data-g-feedback-buffer'?Math.max(value,raw):Math.min(value,raw);element.style.setProperty(property,`${max===min?0:(extra-min)/(max-min)*100}%`);}
      const progress=element.matches('.g-progress')?element:element.querySelector('.g-page-loading-progress,.g-context-bar-progress,.g-status-bar-progress');
      if(progress){if(!progress.hasAttribute('role'))progress.setAttribute('role','progressbar');progress.setAttribute('aria-valuemin',String(min));progress.setAttribute('aria-valuemax',String(max));if(unknown)progress.removeAttribute('aria-valuenow');else progress.setAttribute('aria-valuenow',String(value));}
      element.querySelectorAll('[data-g-feedback-value-text]').forEach(node=>{const text=unknown?'…':`${Math.round(percent*100)/100}%`;if(node.textContent!==text)node.textContent=text;});
      const steps=[...element.querySelectorAll(':scope > .g-progress-step')];steps.forEach((node,index)=>{const complete=index<Math.ceil(percent/100*steps.length);if(node.classList.contains('is-complete')!==complete)node.classList.toggle('is-complete',complete);});
    }
    const disabled=element.matches('.is-disabled,[aria-disabled="true"]');
    element.querySelectorAll('button').forEach(button=>{if(disabled&&!button.disabled){controls.add(button);button.disabled=true;}else if(!disabled&&controls.delete(button))button.disabled=false;});
    if(element.matches('.g-spinner,.g-page-loading')&&element.hasAttribute('data-g-feedback')) {
      const active=basicFlag(element,'data-g-feedback-loading'),delay=Math.max(0,number('data-g-feedback-delay',0)),key=`${active}:${delay}`;
      attr('aria-busy',active);
      element.querySelectorAll(':scope > .g-spinner-content').forEach(node=>setInert(node,active));
      if(element.matches('.g-page-loading')&&element.parentElement?.matches('.g-page-loading-host'))element.parentElement.querySelectorAll(':scope > .g-page-loading-container').forEach(node=>setInert(node,active));
      if(key!==loadingKey){loadingKey=key;clearTimeout(timer);const reveal=visible=>{if(disposed)return;if(element.matches('.g-spinner'))element.classList.toggle('is-loaded',!visible);else element.classList.toggle('is-hidden',!visible);};reveal(active&&delay===0);if(active&&delay>0)timer=setTimeout(()=>reveal(true),delay);}
    }
  };
  const schedule=()=>{if(queued||disposed)return;queued=true;queueMicrotask(()=>{queued=false;sync();});};
  const guard=event=>{if(!(event.target instanceof Element))return;if(element.matches('.is-disabled,[aria-disabled="true"]')&&(event.type==='click'||['Enter',' '].includes(event.key))){event.preventDefault();event.stopImmediatePropagation();}};
  const click=event=>{
    if(!(event.target instanceof Element)||event.defaultPrevented)return;
    const close=event.target.closest('[data-g-feedback-dismiss], [data-g-dismiss]');
    if(!close||close.closest(feedbackSelector)!==element)return;
    event.preventDefault();event.stopPropagation();
    if(!emit(element,'dismiss',{reason:'button',trigger:close}))return;
    if(!basicFlag(element,'data-g-feedback-controlled')){const restore=focusAfterRemoval(element,close);element.hidden=true;restore();}
  };
  element.addEventListener('click',guard,true);element.addEventListener('keydown',guard,true);element.addEventListener('click',click);
  const observer=new MutationObserver(schedule);observer.observe(element,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-disabled','data-g-feedback','data-g-feedback-value','data-g-feedback-min','data-g-feedback-max','data-g-feedback-buffer','data-g-feedback-success','data-g-feedback-loading','data-g-feedback-delay']});
  feedbackStores.set(element,{destroy(){disposed=true;clearTimeout(timer);observer.disconnect();element.removeEventListener('click',guard,true);element.removeEventListener('keydown',guard,true);element.removeEventListener('click',click);controls.forEach(button=>button.disabled=false);inertNodes.forEach((value,node)=>value?node.setAttribute('inert',''):node.removeAttribute('inert'));originals.forEach((value,name)=>value===null?element.removeAttribute(name):element.setAttribute(name,value));if(loadingKey!==undefined){element.classList.toggle('is-loaded',initialLoaded);element.classList.toggle('is-hidden',initialHidden);}}});
  sync();
}

function createTable(element, options) {
  const store=storeFor(element);
  if(store.has('table')){store.get('table').update(options);return store.get('table');}
  const controller=createTableController(element,options),dispose=controller.destroy;
  controller.destroy=()=>{dispose();store.delete('table');};store.set('table',controller);return controller;
}
function initTable(element) {
  const source=element.getAttribute('data-g-table-options');
  if(source===null){const previous=getInstance(element,'table');if(previous?._source!==undefined)previous.destroy();return;}
  const current=getInstance(element,'table');if(current?._source===source)return;
  try {const instance=createTable(element,JSON.parse(source));instance._source=source;}
  catch(error){emit(element,'error',{component:'table',message:error.message});}
}
function init(root = document) {
  if(root instanceof Element && (root.hasAttribute('data-g-table-options')||getInstance(root,'table')))initTable(root);
  root.querySelectorAll?.('[data-g-table-options]').forEach(initTable);
  if (root instanceof Element && root.matches(formSelector)) initForm(root);
  root.querySelectorAll?.(formSelector).forEach(initForm);
  if (root instanceof Element && root.matches(feedbackSelector)) initFeedback(root);
  root.querySelectorAll?.(feedbackSelector).forEach(initFeedback);
  if (root instanceof Element && root.matches(basicSelector)) initBasic(root);
  root.querySelectorAll?.(basicSelector).forEach(initBasic);
  if (!registrySelector) return Gardenerim;
  const candidates = [];
  if (root instanceof Element && root.matches(registrySelector)) candidates.push(root);
  root.querySelectorAll?.(registrySelector).forEach((element) => candidates.push(element));
  for (const element of candidates) {
    const managedCommerce=instanceStores.get(element)?.get('commerce');if(managedCommerce&&!element.hasAttribute('data-g-commerce-options')){managedCommerce.destroy();instanceStores.get(element).delete('commerce');}
    const managedCms=instanceStores.get(element)?.get('cms');if(managedCms&&!element.hasAttribute('data-g-cms-options')){managedCms.destroy();instanceStores.get(element).delete('cms');}
    const managedMarketing=instanceStores.get(element)?.get('marketing');if(managedMarketing&&!element.hasAttribute('data-g-marketing-options')){managedMarketing.destroy();instanceStores.get(element).delete('marketing');}
    const managedEnterprise=instanceStores.get(element)?.get('enterprise');if(managedEnterprise&&!element.hasAttribute('data-g-enterprise-options')){managedEnterprise.destroy();instanceStores.get(element).delete('enterprise');}
    const managedSolution=instanceStores.get(element)?.get('solution');if(managedSolution&&!element.hasAttribute('data-g-solution-options')){managedSolution.destroy();instanceStores.get(element).delete('solution');}
    const managedLegal=instanceStores.get(element)?.get('legal');if(managedLegal&&!element.hasAttribute('data-g-legal-options')){managedLegal.destroy();instanceStores.get(element).delete('legal');}
    const managedCommunication=instanceStores.get(element)?.get('communication');if(managedCommunication&&!element.hasAttribute('data-g-communication-options')){managedCommunication.destroy();instanceStores.get(element).delete('communication');}
    const managedWorkflow=instanceStores.get(element)?.get('workflow');if(managedWorkflow&&!element.hasAttribute('data-g-workflow-options')){managedWorkflow.destroy();instanceStores.get(element).delete('workflow');}
    const managedDesktop=instanceStores.get(element)?.get('desktop');if(managedDesktop&&!element.hasAttribute('data-g-desktop-options')){managedDesktop.destroy();instanceStores.get(element).delete('desktop');}
    const managedMobile=instanceStores.get(element)?.get('mobile');if(managedMobile&&!element.hasAttribute('data-g-mobile-options')){managedMobile.destroy();instanceStores.get(element).delete('mobile');}
    const managedAuth=instanceStores.get(element)?.get('auth');if(managedAuth&&!element.hasAttribute('data-g-auth-options')){managedAuth.destroy();instanceStores.get(element).delete('auth');}
    const managedMedia=instanceStores.get(element)?.get('media');if(managedMedia&&!element.hasAttribute('data-g-media-options')){managedMedia.destroy();instanceStores.get(element).delete('media');}
    const managedAI=instanceStores.get(element)?.get('ai');
    if(managedAI&&!element.hasAttribute('data-g-ai-options')){managedAI.destroy();instanceStores.get(element).delete('ai');}
    const managedHelp=instanceStores.get(element)?.get('help');
    if(managedHelp&&!element.hasAttribute('data-g-help-options')){managedHelp.destroy();instanceStores.get(element).delete('help');}
    const managedLayout=instanceStores.get(element)?.get('layout');
    if(managedLayout&&!element.hasAttribute('data-g-layout-options')){managedLayout.destroy();instanceStores.get(element).delete('layout');}
    const managedContent=instanceStores.get(element)?.get('content');
    if(managedContent&&!element.hasAttribute('data-g-content-options')){managedContent.destroy();instanceStores.get(element).delete('content');}
    const managedInteraction=instanceStores.get(element)?.get('interaction');
    if(managedInteraction&&!element.hasAttribute('data-g-interaction-options')){
      managedInteraction.destroy();
      instanceStores.get(element).delete('interaction');
    }
    for (const attribute of element.getAttributeNames()) {
      if (!attribute.startsWith("data-g-")) continue;
      const name = attribute.slice(7);
      if (registry.has(name)) initElement(element, name);
    }
  }
  // Framework property writes do not dispatch native input events. Re-initializing
  // a native control refreshes dependent form views without remounting their owners.
  if(root instanceof Element&&root.matches('input,textarea,select')){
    instanceStores.get(root)?.get('auto-resize')?.resize();
    for(let owner=root.parentElement;owner;owner=owner.parentElement){
      const store=instanceStores.get(owner);
      if(owner.querySelector('textarea,input')===root){store?.get('character-count')?.update('model');store?.get('clearable')?.update();}
      if(owner.querySelector('input[type="range"],input[type="file"]')===root)store?.get('field-sync')?.sync('model',false);
      formStores.get(owner)?.refresh();
    }
  }
  return Gardenerim;
}

function getInstance(elementOrSelector, name) {
  const element = typeof elementOrSelector === "string" ? document.querySelector(elementOrSelector) : elementOrSelector;
  const store = element ? instanceStores.get(element) : null;
  if (!store) return null;
  return name ? store.get(name) || null : store.size === 1 ? store.values().next().value : Object.fromEntries(store);
}

function destroy(root = document) {
  const candidates = [];
  if (root instanceof Element) candidates.push(root);
  root.querySelectorAll?.("*").forEach((element) => candidates.push(element));
  candidates.forEach((element) => {
    formStores.get(element)?.destroy();
    formStores.delete(element);
    feedbackStores.get(element)?.destroy();
    feedbackStores.delete(element);
    basicStores.get(element)?.destroy();
    basicStores.delete(element);
    const store = instanceStores.get(element);
    if (!store) return;
    store.forEach((instance) => instance?.destroy?.());
    instanceStores.delete(element);
  });
}

function refresh(root = document) {
  destroy(root);
  return init(root);
}

const toastConfiguration = { timeout: 5000, maxCount: 5, position: "top", closable: true, showIcon: true };
const toastPositions = new Set(["top", "bottom", "top-start", "top-end", "bottom-start", "bottom-end"]);
const toastPosition = position => ({topLeft:"top-start",topRight:"top-end",bottomLeft:"bottom-start",bottomRight:"bottom-end"}[position] || position);
const toastTones = new Set(["normal", "info", "success", "warning", "danger", "error", "loading"]);

function toastRegion(position) {
  let region = [...document.querySelectorAll(".g-toast-region")].find((item) => item.dataset.gPosition === position);
  if (!region) {
    region = document.createElement("div");
    region.className = `g-toast-region g-toast-region-${position}`;
    region.dataset.gPosition = position;
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-relevant", "additions text");
    document.body.append(region);
  }
  return region;
}

function toast(options = {}) {
  if (typeof options === "string") options = { message: options };
  const tone = toastTones.has(options.tone) ? options.tone : "info";
  const urgent = tone === "danger" || tone === "error";
  const position = toastPositions.has(toastPosition(options.position)) ? toastPosition(options.position) : toastConfiguration.position;
  const region = toastRegion(position);
  const identifier = options.id == null ? "" : String(options.id);
  let element = identifier ? [...document.querySelectorAll("[data-g-toast-id]")].find((item) => item.dataset.gToastId === identifier) : null;
  const updating = Boolean(element);
  if (element) {
    destroy(element);
    element.classList.remove("is-leaving", "is-paused");
    if (element.parentElement !== region) region.append(element);
  } else element = document.createElement("div");
  const title = options.title == null ? "" : String(options.title);
  const content = options.message == null ? "" : String(options.message);
  const closable = options.closable ?? toastConfiguration.closable;
  const showIcon = options.showIcon ?? toastConfiguration.showIcon;
  const actionLabel = options.actionLabel == null ? "" : String(options.actionLabel);
  const defaultTimeout = tone === "loading" ? 0 : toastConfiguration.timeout;
  const timeout = Number(options.timeout ?? options.duration ?? defaultTimeout);
  element.className = [
    "g-toast",
    `g-toast-${tone}`,
    title && "g-toast-with-title",
    closable && "g-toast-closable",
    actionLabel && "g-toast-with-action",
    !showIcon && "g-toast-no-icon",
    options.compact && "g-toast-compact",
    options.spacious && "g-toast-spacious",
  ].filter(Boolean).join(" ");
  element.setAttribute("role", urgent ? "alert" : "status");
  element.setAttribute("aria-atomic", "true");
  if (tone === "loading") element.setAttribute("aria-busy", "true");
  else element.removeAttribute("aria-busy");
  element.dataset.gToast = "";
  element.dataset.gTimeout = Number.isFinite(timeout) ? String(Math.max(0, timeout)) : String(defaultTimeout);
  element.dataset.gPersistent = String(options.persistent === true || timeout <= 0);
  if (identifier) element.dataset.gToastId = identifier;
  else delete element.dataset.gToastId;
  element.dataset.gActionClose = String(options.actionClose === true);
  element.innerHTML = `<div class="g-toast-content"><div class="g-toast-title"></div><div class="g-toast-message"></div></div>${actionLabel ? '<button type="button" class="g-toast-action" data-g-toast-action></button>' : ""}${closable ? '<button type="button" class="g-toast-close" data-g-dismiss>×</button>' : ""}`;
  element.querySelector(".g-toast-title").textContent = title;
  element.querySelector(".g-toast-message").textContent = content;
  const action = element.querySelector("[data-g-toast-action]");
  if (action) action.textContent = actionLabel;
  const close = element.querySelector("[data-g-dismiss]");
  if (close) close.setAttribute("aria-label", message("toast.close"));
  toastCallbacks.set(element, { onAction: options.onAction, onClose: options.onClose });
  if (!updating) {
    const maxCount = Math.max(1, Number(options.maxCount ?? toastConfiguration.maxCount) || toastConfiguration.maxCount);
    while ([...region.children].filter((item) => item.matches(".g-toast")).length >= maxCount) {
      const oldest = [...region.children].find((item) => item.matches(".g-toast"));
      if (!oldest) break;
      const instance = getInstance(oldest, "toast");
      if (!instance?.dismiss?.("overflow", true)) { destroy(oldest); toastCallbacks.delete(oldest); oldest.remove(); }
    }
    region.append(element);
  }
  init(element);
  return element;
}

toast.clear = (position) => {
  if(position!=null&&!toastPositions.has(toastPosition(position)))return;
  const selected = position==null?null:toastPosition(position);
  document.querySelectorAll(".g-toast-region").forEach((region) => {
    if (selected && region.dataset.gPosition !== selected) return;
    [...region.children].forEach((element) => {
      const instance = getInstance(element, "toast");
      if (!instance?.dismiss?.("clear", true)) { destroy(element); toastCallbacks.delete(element); element.remove(); }
    });
  });
};

toast.config = (options = {}) => {
  if (Number.isFinite(Number(options.timeout))) toastConfiguration.timeout = Math.max(0, Number(options.timeout));
  if (Number.isFinite(Number(options.maxCount))) toastConfiguration.maxCount = Math.max(1, Number(options.maxCount));
  if (toastPositions.has(toastPosition(options.position))) toastConfiguration.position = toastPosition(options.position);
  if (typeof options.closable === "boolean") toastConfiguration.closable = options.closable;
  if (typeof options.showIcon === "boolean") toastConfiguration.showIcon = options.showIcon;
  return Object.freeze({ ...toastConfiguration });
};

function delegateClick(event) {
  const commandTrigger = event.target.closest("[data-g-command-trigger]");
  if (commandTrigger) {
    const target = targetById(commandTrigger.dataset.gCommandTrigger);
    if (target) {
      commandTrigger.setAttribute("aria-haspopup", "dialog");
      commandTrigger.setAttribute("aria-controls", target.id);
      init(target);
      getInstance(target, "command-palette")?.toggle(commandTrigger);
    }
  }
  const opener = event.target.closest("[data-g-dialog-open], [data-g-drawer-open], [data-g-mobile-sheet-open]");
  if (opener) {
    const id = opener.dataset.gDialogOpen || opener.dataset.gDrawerOpen || opener.dataset.gMobileSheetOpen;
    const target = targetById(id);
    if (target) {
      init(target);
      getInstance(target, opener.dataset.gDialogOpen ? "dialog" : opener.dataset.gDrawerOpen ? "drawer" : "mobile-sheet")?.open(opener);
    }
  }
  const tourOpener = event.target.closest("[data-g-tour-open]");
  if (tourOpener) {
    const target = targetById(tourOpener.dataset.gTourOpen);
    if (target) {
      tourOpener.setAttribute("aria-haspopup", "dialog");
      tourOpener.setAttribute("aria-controls", target.id);
      init(target);
      getInstance(target, "tour")?.open(tourOpener);
    }
  }
  const toggle = event.target.closest("[data-g-toggle]");
  if (toggle) {
    const target = targetById(toggle.dataset.gToggle);
    if (target) {
      const expanded = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(expanded));
      target.hidden = !expanded;
      target.classList.toggle("is-open", expanded);
      emit(target, "toggle", { expanded, trigger: toggle });
    }
  }
  const dismiss = event.target.closest("[data-g-dismiss]");
  if (dismiss) {
    const target = dismiss.closest(".g-alert, .g-toast, .g-banner, [data-g-dismissible]");
    const restoreFocus = focusAfterRemoval(target, dismiss);
    const toastInstance = target ? getInstance(target, "toast") : null;
    if (toastInstance) { toastInstance.dismiss("button"); restoreFocus(); }
    else if (target && emit(target, "dismiss", { reason: "button" })) { target.remove(); restoreFocus(); }
  }
  const toastAction = event.target.closest("[data-g-toast-action]");
  if (toastAction) {
    const target = toastAction.closest(".g-toast");
    if (target && emit(target, "action", { trigger: toastAction })) {
      toastCallbacks.get(target)?.onAction?.(target);
      if (target.dataset.gActionClose === "true") getInstance(target, "toast")?.dismiss("action");
    }
  }
}

let delegatedRoot = null;
let started = false;

const topLevelNodes = (nodes) => [...nodes].filter((node) => {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) if (nodes.has(parent)) return false;
  return true;
});

function disconnect() {
  observer?.disconnect();
  observer = undefined;
  observedRoot = null;
}

function observe(root = document, options = {}) {
  if (typeof MutationObserver === "undefined") return { disconnect };
  const target = typeof document !== "undefined" && root === document ? document.documentElement : root;
  if (!(target instanceof Element)) throw new TypeError("Gardenerim.observe root must be a Document or Element.");
  if (observer && observedRoot === target) return { disconnect };
  disconnect();
  observedRoot = target;
  observer = new MutationObserver((records) => {
    const added = new Set();
    const removed = new Set();
    const attributes = [];
    for (const record of records) {
      record.addedNodes.forEach((node) => { if (node instanceof Element) added.add(node); });
      record.removedNodes.forEach((node) => { if (node instanceof Element) removed.add(node); });
      if (record.type === "attributes" && record.target instanceof Element) attributes.push(record);
    }
    topLevelNodes(removed).forEach(destroy);
    topLevelNodes(added).forEach(init);
    for (const record of attributes) {
      if(record.attributeName==='data-g-table-options'){initTable(record.target);continue;}
      const name = record.attributeName.slice(7);
      if (record.target.hasAttribute(record.attributeName)) initElement(record.target, name);
      else {
        const store = instanceStores.get(record.target);
        store?.get(name)?.destroy?.();
        store?.delete(name);
        if (store?.size === 0) instanceStores.delete(record.target);
      }
    }
  });
  observer.observe(target, {
    childList: true,
    subtree: options.subtree !== false,
    attributes: options.attributes !== false,
    attributeFilter: options.attributes === false ? undefined : [...registry.keys()].map((name) => `data-g-${name}`).concat('data-g-table-options'),
  });
  return { disconnect };
}

function start(root = document, options = {}) {
  if (typeof document === "undefined") return Gardenerim;
  const eventRoot = root?.addEventListener ? root : document;
  if (delegatedRoot !== eventRoot) {
    delegatedRoot?.removeEventListener("click", delegateClick);
    eventRoot.addEventListener("click", delegateClick);
    delegatedRoot = eventRoot;
  }
  started = true;
  init(root);
  if (options.observe !== false) observe(root, options.observeOptions || {});
  return Gardenerim;
}

function stop(options = {}) {
  disconnect();
  delegatedRoot?.removeEventListener("click", delegateClick);
  delegatedRoot = null;
  started = false;
  if (options.destroy === true && typeof document !== "undefined") destroy(options.root || document);
}

const Gardenerim = Object.freeze({ version: "2.2.0", get behaviors() { return Object.freeze([...registry.keys()]); }, get started() { return started; }, init, refresh, destroy, register, getInstance, emit, toast, observe, disconnect, start, stop, configure, getConfiguration, get locale() { return runtimeLocale; }, supportedLocales: gardenerimLocaleNames });

if (typeof document !== "undefined") {
  const autoStart = () => {
    if (globalThis.GardenerimAutoStart === false || document.documentElement.dataset.gRuntime === "manual") return;
    start(document);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", autoStart, { once: true });
  else queueMicrotask(autoStart);
}

export { Gardenerim, init, refresh, destroy, register, getInstance, emit, toast, observe, disconnect, start, stop, configure, getConfiguration, gardenerimLocaleNames as supportedLocales, createNavigation, navigationDefaults, createTable };
export default Gardenerim;
