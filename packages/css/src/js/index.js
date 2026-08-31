/** Gardenerim runtime v2.0.0 — framework-agnostic, accessible component behavior. */

const instanceStores = new WeakMap();
const registry = new Map();
const focusableSelector = [
  "a[href]", "button:not([disabled])", "input:not([disabled])", "select:not([disabled])",
  "textarea:not([disabled])", "[tabindex]:not([tabindex='-1'])", "[contenteditable='true']"
].join(",");

const uid = (prefix = "g") => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const numeric = (value, fallback) => value !== "" && value != null && Number.isFinite(Number(value)) ? Number(value) : fallback;
const targetById = (value) => value ? document.getElementById(value.replace(/^#/, "")) : null;
const visibleFocusable = (container) => [...container.querySelectorAll(focusableSelector)].filter((item) => item.getClientRects().length > 0);

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

function createOverlay(element, type) {
  let trigger = null;
  let open = false;
  let closeTimer = null;
  let closeFinished = true;
  const panel = element.querySelector(type === "dialog" ? ".g-dialog" : type === "mobile-sheet" ? ".g-mobile-sheet-panel" : ".g-drawer") || element;
  panel.tabIndex = panel.tabIndex < 0 ? -1 : panel.tabIndex;
  if (type === "dialog" || type === "mobile-sheet") {
    panel.setAttribute("role", panel.getAttribute("role") || "dialog");
    panel.setAttribute("aria-modal", "true");
  }

  function onKeydown(event) {
    if (event.key === "Escape" && element.dataset.gDismissible !== "false") close("escape");
    if (event.key !== "Tab") return;
    const items = visibleFocusable(panel);
    if (!items.length) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function finishClose(reason) {
    if (open || closeFinished) return;
    closeFinished = true;
    clearTimeout(closeTimer);
    element.hidden = true;
    element.setAttribute("aria-hidden", "true");
    trigger?.focus?.({ preventScroll: true });
    emit(element, "close", { reason });
  }

  function openOverlay(source) {
    if (open || !emit(element, "beforeopen", { source })) return;
    clearTimeout(closeTimer);
    open = true;
    closeFinished = false;
    trigger = source instanceof HTMLElement ? source : document.activeElement;
    element.hidden = false;
    element.setAttribute("aria-hidden", "false");
    lockScroll();
    requestAnimationFrame(() => {
      element.classList.add("is-open");
      (visibleFocusable(panel)[0] || panel).focus({ preventScroll: true });
    });
    document.addEventListener("keydown", onKeydown);
    emit(element, "open", { source });
  }

  function close(reason = "api") {
    if (!open || !emit(element, "beforeclose", { reason })) return;
    open = false;
    element.classList.remove("is-open");
    document.removeEventListener("keydown", onKeydown);
    unlockScroll();
    const onTransitionEnd = (event) => {
      if (event.target === element) finishClose(reason);
    };
    element.addEventListener("transitionend", onTransitionEnd, { once: true });
    closeTimer = window.setTimeout(() => finishClose(reason), 350);
  }

  function onClick(event) {
    if (event.target === element && element.dataset.gDismissible !== "false") close("backdrop");
    if (event.target.closest("[data-g-close]")) close("button");
  }

  const startsOpen = !element.hidden;
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.addEventListener("click", onClick);
  if (startsOpen) queueMicrotask(() => openOverlay());
  return { open: openOverlay, close, toggle: (source) => open ? close("toggle") : openOverlay(source), isOpen: () => open, destroy: () => { clearTimeout(closeTimer); if (open) unlockScroll(); open = false; element.classList.remove("is-open"); element.hidden = true; element.removeEventListener("click", onClick); document.removeEventListener("keydown", onKeydown); } };
}

function createDropdown(element) {
  const trigger = element.querySelector("[data-g-dropdown-trigger]");
  const menu = element.querySelector("[data-g-dropdown-menu]") || element.querySelector(".g-dropdown-menu");
  if (!trigger || !menu) return null;
  let search = "";
  let searchTimer;
  const startsOpen = !menu.hidden;
  const items = () => visibleFocusable(menu).filter((item) => item.getAttribute("aria-disabled") !== "true");

  function open() {
    if (!menu.hidden) return;
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown);
    emit(element, "open");
  }
  function close(focus = false) {
    if (menu.hidden) return;
    menu.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", keydown);
    if (focus) trigger.focus();
    emit(element, "close");
  }
  function outside(event) { if (!element.contains(event.target)) close(); }
  function keydown(event) {
    const options = items();
    const index = options.indexOf(document.activeElement);
    if (event.key === "Escape") return close(true);
    if (event.key === "ArrowDown") { event.preventDefault(); (options[index + 1] || options[0])?.focus(); }
    else if (event.key === "ArrowUp") { event.preventDefault(); (options[index - 1] || options.at(-1))?.focus(); }
    else if (event.key === "Home") { event.preventDefault(); options[0]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); options.at(-1)?.focus(); }
    else if (event.key.length === 1 && /\S/.test(event.key)) {
      search += event.key.toLocaleLowerCase();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { search = ""; }, 500);
      options.find((item) => item.textContent.trim().toLocaleLowerCase().startsWith(search))?.focus();
    }
  }
  function toggle() { menu.hidden ? open() : close(); }
  function menuClick(event) { if (event.target.closest("[role='menuitem']") && !event.target.closest("[aria-haspopup='menu']")) close(); }
  trigger.setAttribute("aria-haspopup", trigger.getAttribute("aria-haspopup") || "menu");
  menu.setAttribute("role", menu.getAttribute("role") || "menu");
  menu.hidden = true;
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("click", toggle);
  menu.addEventListener("click", menuClick);
  if (startsOpen) queueMicrotask(open);
  return { open, close, toggle, destroy: () => { clearTimeout(searchTimer); trigger.removeEventListener("click", toggle); menu.removeEventListener("click", menuClick); document.removeEventListener("pointerdown", outside, true); document.removeEventListener("keydown", keydown); } };
}

function createTabs(element) {
  const tabs = [...element.querySelectorAll("[role='tab']")];
  if (!tabs.length) return null;
  const vertical = () => element.getAttribute("aria-orientation") === "vertical";
  function select(tab, focus = false) {
    if (!tab || tab.getAttribute("aria-disabled") === "true") return;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      const panel = targetById(item.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
    if (focus) tab.focus();
    emit(element, "change", { tab });
  }
  function click(event) { const tab = event.target.closest("[role='tab']"); if (tab) select(tab); }
  function keydown(event) {
    const current = tabs.indexOf(event.target.closest("[role='tab']"));
    if (current < 0) return;
    const forward = vertical() ? "ArrowDown" : "ArrowRight";
    const backward = vertical() ? "ArrowUp" : "ArrowLeft";
    const enabled = tabs.filter((tab) => tab.getAttribute("aria-disabled") !== "true" && !tab.disabled);
    if (!enabled.length) return;
    const enabledIndex = enabled.indexOf(tabs[current]);
    let next;
    if (event.key === forward) next = enabled[(enabledIndex + 1 + enabled.length) % enabled.length];
    else if (event.key === backward) next = enabled[(enabledIndex - 1 + enabled.length) % enabled.length];
    else if (event.key === "Home") next = enabled[0];
    else if (event.key === "End") next = enabled.at(-1);
    else return;
    event.preventDefault();
    select(next, true);
  }
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  select(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
  return { select, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createAccordion(element) {
  const triggerSelector = ".g-accordion-trigger, .g-faq-question, .g-thinking-trigger, [data-g-tool-call-toggle]";
  const triggers = [...element.querySelectorAll(triggerSelector)];
  function set(trigger, expanded) {
    trigger.setAttribute("aria-expanded", String(expanded));
    const panel = targetById(trigger.getAttribute("aria-controls"));
    if (panel) panel.hidden = !expanded;
    emit(element, "change", { trigger, expanded });
  }
  function toggle(trigger) {
    if (trigger.disabled || trigger.getAttribute("aria-disabled") === "true") return;
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    if (!expanded && element.dataset.gMultiple !== "true") triggers.forEach((other) => { if (other !== trigger) set(other, false); });
    set(trigger, !expanded);
  }
  function click(event) { const trigger = event.target.closest(triggerSelector); if (trigger) toggle(trigger); }
  element.addEventListener("click", click);
  triggers.forEach((trigger) => set(trigger, trigger.getAttribute("aria-expanded") === "true"));
  return { toggle, destroy: () => element.removeEventListener("click", click) };
}

function createAutoResize(element) {
  function resize() {
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, Number(element.dataset.gMaxHeight || 224))}px`;
  }
  element.addEventListener("input", resize);
  resize();
  return { resize, destroy: () => element.removeEventListener("input", resize) };
}

function createPasswordToggle(element) {
  const input = element.querySelector("input");
  const button = element.querySelector("[data-g-password-button]");
  if (!input || !button) return null;
  const showLabel = button.dataset.gShowLabel || "显示密码";
  const hideLabel = button.dataset.gHideLabel || "隐藏密码";
  function update() {
    const visible = input.type === "text";
    button.setAttribute("aria-pressed", String(visible));
    button.setAttribute("aria-label", visible ? hideLabel : showLabel);
    const label = button.querySelector("[data-g-password-label]");
    if (label) label.textContent = visible ? hideLabel : showLabel;
  }
  function toggle() {
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.type = input.type === "password" ? "text" : "password";
    update();
    input.focus({ preventScroll: true });
    if (start != null && end != null) input.setSelectionRange(start, end);
    emit(element, "change", { visible: input.type === "text" });
  }
  button.addEventListener("click", toggle);
  update();
  return { toggle, destroy: () => button.removeEventListener("click", toggle) };
}

function createOtpInput(element) {
  const cells = [...element.querySelectorAll("[data-g-otp-cell], .g-otp-cell")];
  const output = element.querySelector("[data-g-otp-output]");
  if (!cells.length) return null;
  const digits = (value) => String(value || "").replace(/\D/g, "");
  function sync(reason = "api") {
    const value = cells.map((cell) => digits(cell.value).slice(-1)).join("");
    cells.forEach((cell, index) => {
      const digit = digits(cell.value).slice(-1);
      if (cell.value !== digit) cell.value = digit;
      cell.setAttribute("aria-label", cell.getAttribute("aria-label") || `验证码第 ${index + 1} 位，共 ${cells.length} 位`);
    });
    element.dataset.gOtpValue = value;
    const valueOutput = element.querySelector("[data-g-otp-output]") || output;
    if (valueOutput) { valueOutput.value = value; valueOutput.defaultValue = value; valueOutput.setAttribute("value", value); }
    const complete = value.length === cells.length;
    element.classList.toggle("is-complete", complete);
    element.setAttribute("aria-invalid", String(element.classList.contains("is-invalid")));
    emit(element, "otpchange", { value, complete, reason });
    if (complete) emit(element, "otpcomplete", { value, reason });
    return value;
  }
  function fill(value, start = 0, reason = "api") {
    const values = digits(value).slice(0, cells.length - start);
    [...values].forEach((digit, offset) => { cells[start + offset].value = digit; });
    const next = Math.min(start + values.length, cells.length - 1);
    cells[next]?.focus({ preventScroll: true });
    sync(reason);
  }
  function input(event) {
    const index = cells.indexOf(event.target);
    if (index < 0) return;
    const value = digits(event.target.value);
    if (value.length > 1) fill(value, index, "input");
    else { event.target.value = value.slice(-1); if (value && index < cells.length - 1) cells[index + 1].focus({ preventScroll: true }); sync("input"); }
  }
  function keydown(event) {
    const index = cells.indexOf(event.target);
    if (index < 0) return;
    if (event.key === "Backspace" && !event.target.value && index > 0) { event.preventDefault(); cells[index - 1].value = ""; cells[index - 1].focus({ preventScroll: true }); sync("backspace"); }
    if (event.key === "ArrowLeft" && index > 0) { event.preventDefault(); cells[index - 1].focus({ preventScroll: true }); }
    if (event.key === "ArrowRight" && index < cells.length - 1) { event.preventDefault(); cells[index + 1].focus({ preventScroll: true }); }
    if (event.key === "Home") { event.preventDefault(); cells[0].focus({ preventScroll: true }); }
    if (event.key === "End") { event.preventDefault(); cells.at(-1).focus({ preventScroll: true }); }
  }
  function paste(event) { const index = cells.indexOf(event.target); if (index >= 0) { event.preventDefault(); fill(event.clipboardData?.getData("text") || "", index, "paste"); } }
  function clear() { cells.forEach((cell) => { cell.value = ""; }); element.classList.remove("is-invalid"); cells[0].focus({ preventScroll: true }); sync("clear"); }
  element.addEventListener("input", input); element.addEventListener("keydown", keydown); element.addEventListener("paste", paste); sync("init");
  return { value: () => sync("read"), fill, clear, destroy: () => { element.removeEventListener("input", input); element.removeEventListener("keydown", keydown); element.removeEventListener("paste", paste); } };
}

function createPasswordStrength(element) {
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
    const labels = ["未设置", "较弱", "一般", "良好", "强"];
    element.dataset.gStrength = String(score); element.style.setProperty("--g-password-strength", `${score * 25}%`);
    if (label) label.textContent = labels[score];
    if (meter) { meter.setAttribute("role", "progressbar"); meter.setAttribute("aria-label", "密码强度"); meter.setAttribute("aria-valuemin", "0"); meter.setAttribute("aria-valuemax", "4"); meter.setAttribute("aria-valuenow", String(score)); meter.setAttribute("aria-valuetext", labels[score]); }
    rules.forEach((rule) => { const valid = Boolean(checks[rule.dataset.gPasswordRule]); rule.classList.toggle("is-valid", valid); rule.setAttribute("aria-label", `${rule.textContent.trim()}：${valid ? "已满足" : "未满足"}`); });
    emit(element, "passwordstrength", { score, checks, reason }); return { score, checks };
  }
  input.addEventListener("input", update); update("init");
  return { update, destroy: () => input.removeEventListener("input", update) };
}

function createAuthTimer(element) {
  const output = element.querySelector("[data-g-auth-time]") || element;
  const resetButton = element.querySelector("[data-g-auth-timer-reset]");
  const duration = Math.max(0, Number(element.dataset.gDuration || 60));
  let remaining = duration; let timer = 0;
  function format(seconds) { const minutes = Math.floor(seconds / 60); const rest = seconds % 60; return minutes ? `${minutes}:${String(rest).padStart(2, "0")}` : `${rest} 秒`; }
  function render(reason = "tick") { output.textContent = format(remaining); const expired = remaining <= 0; element.dataset.gTimerState = expired ? "expired" : "active"; element.setAttribute("aria-live", expired ? "polite" : "off"); if (expired) { window.clearInterval(timer); timer = 0; emit(element, "authtimerexpired", { reason }); } }
  function start(seconds = duration, reason = "start") { window.clearInterval(timer); remaining = Math.max(0, Number(seconds)); render(reason); if (remaining > 0) timer = window.setInterval(() => { remaining -= 1; render(); }, 1000); emit(element, "authtimerstart", { remaining, reason }); }
  function reset() { start(duration, "reset"); }
  function click(event) { if (event.target.closest("[data-g-auth-timer-reset]")) { event.preventDefault(); reset(); } }
  element.addEventListener("click", click); start(duration, "init");
  return { start, reset, expire: () => start(0, "api"), remaining: () => remaining, destroy: () => { window.clearInterval(timer); element.removeEventListener("click", click); } };
}

function createClearInput(element) {
  const input = element.querySelector("input, textarea");
  const button = element.querySelector("[data-g-clear-button]");
  if (!input || !button) return null;
  function update() { button.hidden = !input.value || input.disabled || input.readOnly; }
  function clear() {
    if (input.disabled || input.readOnly) return;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus({ preventScroll: true });
    emit(element, "clear", { input });
  }
  if (!button.hasAttribute("aria-label")) button.setAttribute("aria-label", "清空输入");
  input.addEventListener("input", update);
  button.addEventListener("click", clear);
  update();
  return { clear, update, destroy: () => { input.removeEventListener("input", update); button.removeEventListener("click", clear); } };
}

function createCharacterCount(element) {
  const input = element.querySelector("textarea, input");
  const output = element.querySelector("[data-g-character-output], .g-character-count");
  if (!input || !output) return null;
  const maximum = Number(element.dataset.gCharacterCount || input.maxLength || 0);
  function update() {
    const count = [...input.value].length;
    output.textContent = maximum > 0 ? `${count} / ${maximum}` : String(count);
    output.classList.toggle("is-near-limit", maximum > 0 && count >= maximum * .85 && count <= maximum);
    output.classList.toggle("is-over-limit", maximum > 0 && count > maximum);
    output.setAttribute("aria-label", maximum > 0 ? `已输入 ${count} 个字符，最多 ${maximum} 个` : `已输入 ${count} 个字符`);
    emit(element, "count", { count, maximum });
  }
  input.addEventListener("input", update);
  update();
  return { update, destroy: () => input.removeEventListener("input", update) };
}

function createConditionalField(element) {
  const selector = element.dataset.gController;
  if (!selector) return null;
  let controllers;
  try { controllers = [...document.querySelectorAll(selector)]; }
  catch { return null; }
  if (!controllers.length) return null;
  const expected = new Set(String(element.dataset.gShowWhen ?? "true").split(",").map((value) => value.trim()));
  function value() {
    const checkedRadio = controllers.find((controller) => controller.type === "radio" && controller.checked);
    if (checkedRadio) return checkedRadio.value;
    const controller = controllers[0];
    if (controller.type === "checkbox") return controller.checked ? (controller.value || "true") : "false";
    return controller.value;
  }
  function update() {
    const visible = expected.has(String(value()));
    element.hidden = !visible;
    element.toggleAttribute("inert", !visible);
    element.setAttribute("aria-hidden", String(!visible));
    emit(element, "change", { visible, value: value() });
  }
  controllers.forEach((controller) => controller.addEventListener("change", update));
  update();
  return { update, destroy: () => controllers.forEach((controller) => controller.removeEventListener("change", update)) };
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
  const options = () => [...list.querySelectorAll("[role='option'], .g-combobox-option")].filter((option) => !option.hidden && option.getAttribute("aria-disabled") !== "true");
  let activeIndex = -1;
  if (!list.id) list.id = uid("g-listbox");
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-controls", list.id);
  input.setAttribute("aria-autocomplete", input.getAttribute("aria-autocomplete") || "list");

  function open() { if (!list.hidden) return; list.hidden = false; input.setAttribute("aria-expanded", "true"); emit(element, "open"); }
  function close() { if (list.hidden) return; list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); activeIndex = -1; emit(element, "close"); }
  function activate(index) {
    const items = options();
    if (!items.length) { activeIndex = -1; input.removeAttribute("aria-activedescendant"); return; }
    activeIndex = (index + items.length) % items.length;
    items.forEach((option, optionIndex) => {
      if (!option.id) option.id = uid("g-option");
      option.classList.toggle("is-active", optionIndex === activeIndex);
    });
    input.setAttribute("aria-activedescendant", items[activeIndex].id);
    items[activeIndex].scrollIntoView({ block: "nearest" });
  }
  function choose(option) {
    input.value = option.dataset.gValue ?? option.textContent.trim();
    options().forEach((item) => item.setAttribute("aria-selected", String(item === option)));
    emit(element, "change", { option, value: input.value });
    close();
  }
  function filter() {
    const query = input.value.trim().toLocaleLowerCase();
    [...list.querySelectorAll("[role='option'], .g-combobox-option")].forEach((option) => {
      option.hidden = Boolean(query) && !option.textContent.toLocaleLowerCase().includes(query);
    });
    open();
    activate(0);
  }
  function keydown(event) {
    if (event.key === "ArrowDown") { event.preventDefault(); open(); activate(activeIndex + 1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); open(); activate(activeIndex - 1); }
    else if (event.key === "Enter" && activeIndex >= 0) { event.preventDefault(); choose(options()[activeIndex]); }
    else if (event.key === "Escape") close();
  }
  function click(event) { const option = event.target.closest("[role='option'], .g-combobox-option"); if (option) choose(option); }
  function outside(event) { if (!element.contains(event.target)) close(); }
  input.addEventListener("input", filter);
  input.addEventListener("keydown", keydown);
  input.addEventListener("focus", open);
  list.addEventListener("pointerdown", click);
  document.addEventListener("pointerdown", outside, true);
  list.hidden = true;
  input.setAttribute("aria-expanded", "false");
  return { open, close, choose, destroy: () => { input.removeEventListener("input", filter); input.removeEventListener("keydown", keydown); input.removeEventListener("focus", open); list.removeEventListener("pointerdown", click); document.removeEventListener("pointerdown", outside, true); } };
}

function positionFloating(trigger, panel, requestedPlacement = "bottom-start") {
  const rect = trigger.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const gap = 8;
  const rtl = getComputedStyle(trigger).direction === "rtl";
  const [rawSide, rawAlign = "start"] = String(requestedPlacement || "bottom-start").toLowerCase().split("-");
  let side = rawSide === "start" ? (rtl ? "right" : "left") : rawSide === "end" ? (rtl ? "left" : "right") : rawSide;
  if (!["top", "bottom", "left", "right"].includes(side)) side = "bottom";
  const align = ["start", "center", "end"].includes(rawAlign) ? rawAlign : "start";

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
  const top = Math.max(gap, Math.min(position.top, window.innerHeight - panelRect.height - gap));
  const left = Math.max(gap, Math.min(position.left, window.innerWidth - panelRect.width - gap));
  panel.style.position = "fixed";
  panel.style.inset = `${top}px auto auto ${left}px`;
  panel.dataset.gPlacement = `${side}-${align}`;
  panel.style.setProperty("--g-floating-arrow-inline", `${Math.max(10, Math.min(panelRect.width - 18, rect.left + rect.width / 2 - left - 6))}px`);
  panel.style.setProperty("--g-floating-arrow-block", `${Math.max(10, Math.min(panelRect.height - 18, rect.top + rect.height / 2 - top - 6))}px`);
}

function createFloating(element, type) {
  const trigger = element.querySelector(`[data-g-${type}-trigger]`) || element.previousElementSibling;
  const panel = element.querySelector(`[data-g-${type}-content]`) || element.querySelector(`.g-${type}, .g-${type}-rich, .g-help-${type}`) || element;
  if (!trigger || !panel) return null;
  const startsOpen = !panel.hidden;
  let open = false;
  const interactive = type === "popover";
  if (!panel.id) panel.id = uid(`g-${type}`);
  if (interactive) {
    trigger.setAttribute("aria-haspopup", trigger.getAttribute("aria-haspopup") || "dialog");
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", "false");
  } else {
    panel.setAttribute("role", "tooltip");
    const describedBy = new Set((trigger.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
    describedBy.add(panel.id);
    trigger.setAttribute("aria-describedby", [...describedBy].join(" "));
  }
  panel.hidden = true;
  const placement = () => element.dataset.gPlacement || panel.dataset.gPlacement || trigger.dataset.gPlacement || "bottom-start";
  function show() { if (open) return; open = true; panel.hidden = false; if (interactive) trigger.setAttribute("aria-expanded", "true"); requestAnimationFrame(() => positionFloating(trigger, panel, placement())); emit(element, "open"); }
  function hide() { if (!open) return; open = false; panel.hidden = true; if (interactive) trigger.setAttribute("aria-expanded", "false"); emit(element, "close"); }
  function toggle() { open ? hide() : show(); }
  function outside(event) { if (!element.contains(event.target) && !trigger.contains(event.target)) hide(); }
  function keydown(event) { if (event.key === "Escape") { hide(); trigger.focus(); } }
  function reposition() { if (open) positionFloating(trigger, panel, placement()); }
  if (interactive) trigger.addEventListener("click", toggle);
  else {
    trigger.addEventListener("pointerenter", show);
    trigger.addEventListener("pointerleave", hide);
    trigger.addEventListener("focus", show);
    trigger.addEventListener("blur", hide);
  }
  document.addEventListener("pointerdown", outside, true);
  document.addEventListener("keydown", keydown);
  window.addEventListener("resize", reposition);
  window.addEventListener("scroll", reposition, true);
  if (startsOpen) queueMicrotask(show);
  return { open: show, close: hide, toggle, destroy: () => { trigger.removeEventListener("click", toggle); trigger.removeEventListener("pointerenter", show); trigger.removeEventListener("pointerleave", hide); trigger.removeEventListener("focus", show); trigger.removeEventListener("blur", hide); document.removeEventListener("pointerdown", outside, true); document.removeEventListener("keydown", keydown); window.removeEventListener("resize", reposition); window.removeEventListener("scroll", reposition, true); } };
}

function createTour(element) {
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
    element.querySelectorAll("[data-g-tour-next]").forEach((button) => { button.textContent = index === steps.length - 1 ? (button.dataset.gFinishLabel || "完成") : (button.dataset.gNextLabel || "下一步"); });
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
  const slides = [...element.querySelectorAll(".g-carousel-slide, [data-g-carousel-slide]")];
  const previous = element.querySelector(".g-carousel-prev, [data-g-carousel-prev]");
  const next = element.querySelector(".g-carousel-next, [data-g-carousel-next]");
  const dots = [...element.querySelectorAll(".g-carousel-dot, [data-g-carousel-dot]")];
  if (!slides.length) return null;
  let index = Math.max(0, slides.findIndex((slide) => slide.getAttribute("aria-hidden") !== "true"));
  let timer;
  const interval = Number(element.dataset.gInterval || 0);
  const dotHandlers = dots.map((dot, dotIndex) => [dot, () => go(dotIndex, "dot")]);
  element.setAttribute("aria-roledescription", "carousel");
  function go(nextIndex, source = "api") {
    index = (nextIndex + slides.length) % slides.length;
    element.style.setProperty("--g-slide-index", index);
    slides.forEach((slide, slideIndex) => { slide.setAttribute("aria-hidden", String(slideIndex !== index)); slide.inert = slideIndex !== index; });
    dots.forEach((dot, dotIndex) => dot.setAttribute("aria-current", String(dotIndex === index)));
    emit(element, "change", { index, source });
  }
  function start() { clearInterval(timer); if (interval > 0 && !matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => go(index + 1, "auto"), interval); }
  function stop() { clearInterval(timer); }
  const prevClick = () => go(index - 1, "previous");
  const nextClick = () => go(index + 1, "next");
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
  return { go, next: nextClick, previous: prevClick, start, stop, destroy: () => { stop(); previous?.removeEventListener("click", prevClick); next?.removeEventListener("click", nextClick); dotHandlers.forEach(([dot, handler]) => dot.removeEventListener("click", handler)); element.removeEventListener("focusin", stop); element.removeEventListener("focusout", focusOut); element.removeEventListener("pointerenter", stop); element.removeEventListener("pointerleave", start); } };
}

function createSplitter(element) {
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

function createTree(element) {
  const items = () => [...element.querySelectorAll("[role='treeitem']")].filter((item) => item.getClientRects().length > 0);
  element.setAttribute("role", "tree");
  function focusItem(item) { items().forEach((node) => { node.tabIndex = node === item ? 0 : -1; }); item?.focus(); }
  function keydown(event) {
    const item = event.target.closest("[role='treeitem']");
    if (!item) return;
    const nodes = items();
    const index = nodes.indexOf(item);
    if (event.key === "ArrowDown") { event.preventDefault(); focusItem(nodes[index + 1] || nodes[0]); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusItem(nodes[index - 1] || nodes.at(-1)); }
    else if (event.key === "Home") { event.preventDefault(); focusItem(nodes[0]); }
    else if (event.key === "End") { event.preventDefault(); focusItem(nodes.at(-1)); }
    else if (event.key === "ArrowRight") {
      if (item.getAttribute("aria-expanded") === "false") { event.preventDefault(); item.setAttribute("aria-expanded", "true"); emit(element, "expand", { item }); }
      else { const child = item.querySelector(":scope > [role='group'] [role='treeitem']"); if (child) { event.preventDefault(); focusItem(child); } }
    }
    else if (event.key === "ArrowLeft") {
      if (item.getAttribute("aria-expanded") === "true") { event.preventDefault(); item.setAttribute("aria-expanded", "false"); emit(element, "collapse", { item }); }
      else { const parent = item.parentElement?.closest("[role='treeitem']"); if (parent) { event.preventDefault(); focusItem(parent); } }
    }
    else if (event.key === "Enter" || event.key === " ") { event.preventDefault(); item.setAttribute("aria-selected", String(item.getAttribute("aria-selected") !== "true")); emit(element, "change", { item }); }
  }
  const first = items()[0];
  items().forEach((item) => { item.tabIndex = item === first ? 0 : -1; });
  element.addEventListener("keydown", keydown);
  return { focus: focusItem, destroy: () => element.removeEventListener("keydown", keydown) };
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
    if (options.selectable) { const th = make("th", options.labels?.select || "选择"); th.setAttribute("scope", "col"); header.append(th); }
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
        checkbox.setAttribute("aria-label", `${options.labels?.select || "选择"} ${key}`);
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
    if (!pageRows.length) { const tr = make("tr"), td = make("td", error || (loading ? options.labels?.loading || "加载中…" : options.labels?.empty || "暂无数据")); td.colSpan = span; tr.append(td); body.append(tr); }
    table.setAttribute("aria-rowcount", String(total + 1)); table.setAttribute("aria-colcount", String(span));
    element.setAttribute("aria-busy", String(loading)); element.classList.toggle("is-loading", loading); element.classList.toggle("is-error", !!error); element.classList.toggle("is-empty", total === 0 && !loading);
    viewport.style.maxHeight = `${height}px`; viewport.style.overflow = "auto";
    footer.replaceChildren();
    const previous = make("button", options.labels?.previous || "上一页"), next = make("button", options.labels?.next || "下一页");
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
      table.setAttribute("aria-label", element.getAttribute("aria-label") || "数据网格");
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
  return { focus: focusCell, destroy: () => {
    disposed = true; request++; abort?.abort(); element.removeEventListener("keydown", keydown);
    if (scrollHandler) viewport.removeEventListener("scroll", scrollHandler);
    if (originalChildren) { element.replaceChildren(...originalChildren); element.setAttribute("role", "grid"); }
  }, refresh, setOptions, setRows, setPage, setSort, setFilter, select, getState, updateCell, load };
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
  const source = element.querySelector("[data-g-transfer-source]");
  const target = element.querySelector("[data-g-transfer-target]");
  if (!source || !target) return null;
  const optionSelector = "[data-g-transfer-option]";
  const options = (pane) => [...pane.querySelectorAll(optionSelector)];
  const checked = (pane) => options(pane).filter((option) => option.querySelector("input[type='checkbox']")?.checked || option.getAttribute("aria-selected") === "true");
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
      button.disabled = direction.startsWith("all") ? options(from).length === 0 : checked(from).length === 0;
    });
    emit(element, "transferchange", { source: options(source).map((item) => item.dataset.gValue), target: options(target).map((item) => item.dataset.gValue), reason });
  }
  function move(direction) {
    const toTarget = direction.endsWith("target");
    const from = toTarget ? source : target;
    const to = toTarget ? target : source;
    const moving = direction.startsWith("all") ? options(from) : checked(from);
    moving.forEach((option) => { setChecked(option, false); to.append(option); });
    sync(direction);
    moving[0]?.focus?.();
  }
  function click(event) {
    const button = event.target.closest("[data-g-transfer-move]");
    if (button) { event.preventDefault(); move(button.dataset.gTransferMove); return; }
    const option = event.target.closest(optionSelector);
    if (option && !option.querySelector("input[type='checkbox']") && !event.target.matches("button,a")) { setChecked(option, option.getAttribute("aria-selected") !== "true"); sync("option"); }
  }
  function change(event) {
    const option = event.target.closest(optionSelector);
    if (option) { setChecked(option, event.target.checked); sync("option"); }
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

function createPicker(element) {
  const panel = element.querySelector("[data-g-picker-panel]");
  const trigger = element.querySelector("[data-g-picker-trigger]");
  const input = element.querySelector("[data-g-picker-input]");
  const valuesHost = element.querySelector("[data-g-picker-values]");
  const output = element.querySelector("[data-g-picker-output]");
  const options = () => [...element.querySelectorAll("[data-g-picker-option]")];
  const multiple = element.hasAttribute("data-g-picker-multiple");
  if (!panel || (!trigger && !input) || !options().length) return null;
  let open = !panel.hidden;
  function selected() { return options().filter((option) => option.getAttribute("aria-selected") === "true"); }
  function sync(reason = "api") {
    const current = selected();
    options().forEach((option) => option.classList.toggle("is-selected", current.includes(option)));
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
        const remove = document.createElement("button"); remove.type = "button"; remove.className = "g-picker-value-remove"; remove.dataset.gPickerRemove = chip.dataset.gValue; remove.setAttribute("aria-label", `移除 ${label.textContent}`); remove.textContent = "×"; chip.append(remove); return chip;
      }));
    }
    emit(element, "pickerchange", { values: current.map((option) => option.dataset.gValue), reason });
  }
  function setOpen(value, reason = "api") {
    open = value; panel.hidden = !open; trigger?.setAttribute("aria-expanded", String(open)); input?.setAttribute("aria-expanded", String(open));
    if (open) queueMicrotask(() => input?.focus());
    emit(element, open ? "open" : "close", { reason });
  }
  function choose(option, reason = "option") {
    const next = option.getAttribute("aria-selected") !== "true";
    if (!multiple) options().forEach((item) => item.setAttribute("aria-selected", "false"));
    option.setAttribute("aria-selected", String(next)); sync(reason); if (!multiple) setOpen(false, "selection");
  }
  function click(event) {
    const remove = event.target.closest("[data-g-picker-remove]");
    if (remove) { const option = options().find((item) => (item.dataset.gValue || item.textContent.trim()) === remove.dataset.gPickerRemove); option?.setAttribute("aria-selected", "false"); sync("remove"); return; }
    const option = event.target.closest("[data-g-picker-option]");
    if (option) { event.preventDefault(); choose(option); return; }
    if (event.target.closest("[data-g-picker-trigger]")) { const inputTarget = event.target.closest("[data-g-picker-input]"); if (!inputTarget) event.preventDefault(); setOpen(inputTarget ? true : !open, "trigger"); }
  }
  function filter() {
    const query = String(input?.value || "").normalize("NFKD").toLocaleLowerCase().trim(); let visible = 0;
    options().forEach((option) => { const match = !query || String(option.dataset.gFilterText || option.textContent).normalize("NFKD").toLocaleLowerCase().includes(query); option.hidden = !match; if (match) visible += 1; });
    element.querySelectorAll("[data-g-picker-empty]").forEach((empty) => { empty.hidden = visible !== 0; });
    if (!open) setOpen(true, "input");
  }
  function keydown(event) {
    if (event.key === "Escape" && open) { event.preventDefault(); setOpen(false, "escape"); trigger?.focus(); return; }
    if (!["ArrowDown", "ArrowUp", "Home", "End", "Enter", " "].includes(event.key)) return;
    const visible = options().filter((option) => !option.hidden); if (!visible.length) return;
    const current = visible.indexOf(document.activeElement);
    if ((event.key === "Enter" || event.key === " ") && current >= 0) { event.preventDefault(); choose(visible[current], "keyboard"); return; }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) { event.preventDefault(); setOpen(true, "keyboard"); const index = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : event.key === "ArrowDown" ? (current + 1 + visible.length) % visible.length : (current - 1 + visible.length) % visible.length; visible[index].focus(); }
  }
  function outside(event) { if (open && !element.contains(event.target)) setOpen(false, "outside"); }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); input?.addEventListener("input", filter); document.addEventListener("pointerdown", outside);
  options().forEach((option) => { option.tabIndex ||= -1; option.setAttribute("role", option.getAttribute("role") || "option"); if (!option.hasAttribute("aria-selected")) option.setAttribute("aria-selected", "false"); });
  sync("init"); setOpen(open, "init");
  return { open: () => setOpen(true), close: () => setOpen(false), selected, choose, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); input?.removeEventListener("input", filter); document.removeEventListener("pointerdown", outside); } };
}

function createCascader(element) {
  const columns = () => [...element.querySelectorAll("[data-g-cascade-column]")];
  const output = element.querySelector("[data-g-cascade-output]");
  const path = element.querySelector("[data-g-cascade-path]");
  if (!columns().length) return null;
  function choose(option, reason = "option") {
    const column = option.closest("[data-g-cascade-column]"); const index = columns().indexOf(column);
    [...column.querySelectorAll("[data-g-cascade-option]")].forEach((item) => { item.setAttribute("aria-current", String(item === option)); });
    columns().slice(index + 1).forEach((next) => { next.hidden = next.id !== option.dataset.gCascadeNext; });
    const values = columns().filter((item) => !item.hidden).map((item) => item.querySelector('[data-g-cascade-option][aria-current="true"]')).filter(Boolean);
    if (path) path.textContent = values.map((item) => item.dataset.gLabel || item.textContent.trim()).join(" / ");
    if (output) { const value = values.at(-1)?.dataset.gValue || ""; output.value = value; output.setAttribute("value", value); }
    emit(element, "cascadechange", { value: output?.value, path: values.map((item) => item.dataset.gValue), reason });
  }
  function click(event) { const option = event.target.closest("[data-g-cascade-option]"); if (option) { event.preventDefault(); choose(option); } }
  function keydown(event) { const option = event.target.closest("[data-g-cascade-option]"); if (!option) return; if (["Enter", " ", "ArrowRight"].includes(event.key)) { event.preventDefault(); choose(option, "keyboard"); const next = option.dataset.gCascadeNext && targetById(option.dataset.gCascadeNext); next?.querySelector("[data-g-cascade-option]")?.focus(); } if (event.key === "ArrowLeft") { event.preventDefault(); const column = option.closest("[data-g-cascade-column]"); columns()[Math.max(0, columns().indexOf(column) - 1)]?.querySelector('[data-g-cascade-option][aria-current="true"], [data-g-cascade-option]')?.focus(); } }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown);
  return { choose, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createSavedChoice(element) {
  const items = () => [...element.querySelectorAll("[data-g-saved-choice-item]")];
  if (!items().length) return null;
  function select(item, reason = "option") { const multiple = element.hasAttribute("data-g-multiple"); if (!multiple) items().forEach((option) => option.setAttribute("aria-pressed", "false")); item.setAttribute("aria-pressed", String(multiple ? item.getAttribute("aria-pressed") !== "true" : true)); emit(element, "savedchoice", { values: items().filter((option) => option.getAttribute("aria-pressed") === "true").map((option) => option.dataset.gValue), reason }); }
  function click(event) { const item = event.target.closest("[data-g-saved-choice-item]"); if (item) { event.preventDefault(); select(item); } }
  element.addEventListener("click", click); return { select, destroy: () => element.removeEventListener("click", click) };
}

function createBuilderList(element) {
  const list = element.querySelector("[data-g-builder-items]"); const template = targetById(element.dataset.gBuilderTemplate); if (!list || !template) return null;
  function sync(reason = "api") { [...list.children].forEach((item, index) => { item.dataset.gBuilderIndex = String(index); item.querySelectorAll("[data-g-builder-position]").forEach((output) => { output.textContent = String(index + 1); }); }); emit(element, "builderchange", { count: list.children.length, reason }); }
  function add() { const fragment = template.content ? template.content.cloneNode(true) : template.cloneNode(true); list.append(fragment); sync("add"); list.lastElementChild?.querySelector(focusableSelector)?.focus(); }
  function click(event) { const control = event.target.closest("[data-g-builder-add], [data-g-builder-remove], [data-g-builder-up], [data-g-builder-down]"); if (!control) return; event.preventDefault(); if (control.hasAttribute("data-g-builder-add")) { add(); return; } const item = control.closest("[data-g-builder-item]"); if (!item) return; if (control.hasAttribute("data-g-builder-remove")) item.remove(); else if (control.hasAttribute("data-g-builder-up") && item.previousElementSibling) list.insertBefore(item, item.previousElementSibling); else if (control.hasAttribute("data-g-builder-down") && item.nextElementSibling) list.insertBefore(item.nextElementSibling, item); sync(control.hasAttribute("data-g-builder-remove") ? "remove" : "move"); }
  element.addEventListener("click", click); sync("init"); return { add, sync, destroy: () => element.removeEventListener("click", click) };
}

function createRowDisclosure(element) {
  const triggers = [...element.querySelectorAll("[data-g-row-toggle]")];
  if (!triggers.length) return null;
  function descendants(parent) { return [...element.querySelectorAll(`[data-g-parent="${CSS.escape(parent)}"]`)]; }
  function set(trigger, expanded, reason = "api") {
    const value = trigger.dataset.gRowToggle;
    const target = targetById(value);
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
    emit(element, "disclosure", { trigger, targets: children, expanded, reason });
  }
  function click(event) {
    const trigger = event.target.closest("[data-g-row-toggle]");
    if (trigger) set(trigger, trigger.getAttribute("aria-expanded") !== "true", "toggle");
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
  const controls = [...element.querySelectorAll("[data-g-view]")];
  const panels = [...element.querySelectorAll("[data-g-view-panel]")];
  if (!controls.length) return null;
  function select(view, focus = false) {
    element.dataset.gCurrentView = view;
    controls.forEach((control) => {
      const active = control.dataset.gView === view;
      control.setAttribute("aria-pressed", String(active));
      control.tabIndex = active ? 0 : -1;
      if (active && focus) control.focus();
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.gViewPanel !== view; });
    emit(element, "viewchange", { view });
  }
  function click(event) { const control = event.target.closest("[data-g-view]"); if (control) select(control.dataset.gView); }
  function keydown(event) {
    const current = event.target.closest("[data-g-view]");
    if (!current) return;
    const index = controls.indexOf(current);
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = controls[(index + 1) % controls.length];
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = controls[(index - 1 + controls.length) % controls.length];
    else if (event.key === "Home") next = controls[0];
    else if (event.key === "End") next = controls.at(-1);
    else return;
    event.preventDefault();
    select(next.dataset.gView, true);
  }
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  select(element.dataset.gCurrentView || controls.find((control) => control.getAttribute("aria-pressed") === "true")?.dataset.gView || controls[0].dataset.gView);
  return { select, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createToast(element) {
  let timer;
  let remaining = Number(element.dataset.gTimeout || 5000);
  let startedAt;
  const pauses = new Set();
  function dismiss(reason = "timeout") { clearTimeout(timer); if (emit(element, "dismiss", { reason })) element.remove(); }
  function schedule() { clearTimeout(timer); if (pauses.size || remaining <= 0 || element.dataset.gPersistent === "true") return; startedAt = Date.now(); timer = setTimeout(() => dismiss(), remaining); }
  function pause(reason = "api") { if (!pauses.size && startedAt) remaining = Math.max(0, remaining - (Date.now() - startedAt)); startedAt = null; pauses.add(reason); clearTimeout(timer); }
  function resume(reason = "api") { pauses.delete(reason); schedule(); }
  const pointerEnter = () => pause("pointer");
  const pointerLeave = () => resume("pointer");
  const focusIn = () => pause("focus");
  const focusOut = (event) => { if (!element.contains(event.relatedTarget)) resume("focus"); };
  element.addEventListener("pointerenter", pointerEnter);
  element.addEventListener("pointerleave", pointerLeave);
  element.addEventListener("focusin", focusIn);
  element.addEventListener("focusout", focusOut);
  schedule();
  return { dismiss, pause, resume, destroy: () => { clearTimeout(timer); element.removeEventListener("pointerenter", pointerEnter); element.removeEventListener("pointerleave", pointerLeave); element.removeEventListener("focusin", focusIn); element.removeEventListener("focusout", focusOut); } };
}

function createCopy(element) {
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
  const target = targetById(element.dataset.gNavToggle);
  if (!target) return null;
  let closeTimer;
  if (!target.hasAttribute("data-g-nav-open")) target.dataset.gNavOpen = String(!target.hidden || target.classList.contains("is-open"));
  const isOpen = () => target.dataset.gNavOpen === "true";
  const syncExpanded = (value) => document.querySelectorAll("[data-g-nav-toggle]").forEach((trigger) => {
    if (trigger.dataset.gNavToggle?.replace(/^#/, "") === target.id) trigger.setAttribute("aria-expanded", String(value));
  });
  element.setAttribute("aria-controls", target.id);
  syncExpanded(isOpen());
  target.setAttribute("aria-hidden", String(!isOpen()));

  function show() {
    if (isOpen() || !emit(target, "beforeopen", { trigger: element })) return;
    clearTimeout(closeTimer);
    target.dataset.gNavOpen = "true";
    target.hidden = false;
    target.setAttribute("aria-hidden", "false");
    syncExpanded(true);
    requestAnimationFrame(() => target.classList.add("is-open"));
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
    if (reason === "escape") element.focus({ preventScroll: true });
    emit(target, "close", { reason, trigger: element });
  }
  function toggle() { isOpen() ? hide("toggle") : show(); }
  function keydown(event) { if (event.key === "Escape") { event.preventDefault(); hide("escape"); } }
  function outside(event) { if (!target.contains(event.target) && !element.contains(event.target)) hide("outside"); }
  function targetClose() {
    document.removeEventListener("keydown", keydown);
    document.removeEventListener("pointerdown", outside, true);
  }
  element.addEventListener("click", toggle);
  target.addEventListener("gardener:close", targetClose);
  return { open: show, close: hide, toggle, isOpen, destroy: () => { clearTimeout(closeTimer); element.removeEventListener("click", toggle); target.removeEventListener("gardener:close", targetClose); targetClose(); } };
}

function createRovingNav(element) {
  const selector = ".g-nav-item, .g-nav-rail-item, .g-bottom-nav-item, .g-mobile-tab-item, .g-command-nav-item, [role='menuitem']";
  const items = () => [...element.querySelectorAll(selector)].filter((item) => !item.disabled && item.getAttribute("aria-disabled") !== "true" && !item.hidden);
  const vertical = () => element.getAttribute("aria-orientation") === "vertical" || element.dataset.gOrientation === "vertical";
  function select(item, focus = false) {
    if (!item) return;
    items().forEach((node) => { node.tabIndex = node === item ? 0 : -1; });
    if (element.dataset.gSelection === "true") {
      items().forEach((node) => node.setAttribute("aria-selected", String(node === item)));
      emit(element, "change", { item });
    }
    if (focus) item.focus();
  }
  function click(event) { const item = event.target.closest(selector); if (item && element.contains(item)) select(item); }
  function keydown(event) {
    const current = event.target.closest(selector);
    if (!current) return;
    const nodes = items();
    const index = nodes.indexOf(current);
    const rtl = getComputedStyle(element).direction === "rtl";
    const forward = vertical() ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    const backward = vertical() ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
    let next;
    if (event.key === forward) next = nodes[(index + 1 + nodes.length) % nodes.length];
    else if (event.key === backward) next = nodes[(index - 1 + nodes.length) % nodes.length];
    else if (event.key === "Home") next = nodes[0];
    else if (event.key === "End") next = nodes.at(-1);
    else return;
    event.preventDefault();
    select(next, true);
  }
  const initial = items().find((item) => item.matches("[aria-current], [aria-selected='true'], .is-active")) || items()[0];
  select(initial);
  element.addEventListener("click", click);
  element.addEventListener("keydown", keydown);
  return { select, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createContextMenu(element) {
  const target = element.querySelector("[data-g-context-target]") || element;
  const menu = element.querySelector("[data-g-context-menu-panel]") || element.querySelector(".g-context-menu");
  if (!menu || menu === target) return null;
  let open = !menu.hidden;
  let previousFocus = null;
  const items = () => visibleFocusable(menu).filter((item) => item.getAttribute("aria-disabled") !== "true");
  menu.setAttribute("role", menu.getAttribute("role") || "menu");
  menu.hidden = true;

  function position(x, y) {
    menu.style.inset = "auto";
    menu.style.left = `${Math.max(4, x)}px`;
    menu.style.top = `${Math.max(4, y)}px`;
    const rect = menu.getBoundingClientRect();
    menu.style.left = `${Math.max(4, Math.min(x, window.innerWidth - rect.width - 4))}px`;
    menu.style.top = `${Math.max(4, Math.min(y, window.innerHeight - rect.height - 4))}px`;
  }
  function show(x, y, source = target) {
    if (!emit(element, "beforeopen", { source })) return;
    open = true;
    previousFocus = document.activeElement;
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    position(x, y);
    document.addEventListener("pointerdown", outside, true);
    document.addEventListener("keydown", keydown);
    items()[0]?.focus();
    emit(element, "open", { source, x, y });
  }
  function hide(reason = "api", restore = false) {
    if (!open) return;
    open = false;
    menu.hidden = true;
    menu.setAttribute("aria-hidden", "true");
    document.removeEventListener("pointerdown", outside, true);
    document.removeEventListener("keydown", keydown);
    if (restore) previousFocus?.focus?.({ preventScroll: true });
    emit(element, "close", { reason });
  }
  function context(event) { event.preventDefault(); show(event.clientX, event.clientY, event.target); }
  function targetKeydown(event) {
    if ((event.shiftKey && event.key === "F10") || event.key === "ContextMenu") {
      event.preventDefault();
      const rect = target.getBoundingClientRect();
      show(rect.left + 8, rect.top + 8, target);
    }
  }
  function outside(event) { if (!menu.contains(event.target)) hide("outside"); }
  function keydown(event) {
    const nodes = items();
    const index = nodes.indexOf(document.activeElement);
    if (event.key === "Escape") { event.preventDefault(); hide("escape", true); }
    else if (event.key === "ArrowDown") { event.preventDefault(); (nodes[index + 1] || nodes[0])?.focus(); }
    else if (event.key === "ArrowUp") { event.preventDefault(); (nodes[index - 1] || nodes.at(-1))?.focus(); }
    else if (event.key === "Home") { event.preventDefault(); nodes[0]?.focus(); }
    else if (event.key === "End") { event.preventDefault(); nodes.at(-1)?.focus(); }
  }
  function menuClick(event) { if (event.target.closest("[role='menuitem'], .g-menu-item")) hide("select"); }
  target.addEventListener("contextmenu", context);
  target.addEventListener("keydown", targetKeydown);
  menu.addEventListener("click", menuClick);
  return { open: show, close: hide, isOpen: () => open, destroy: () => { target.removeEventListener("contextmenu", context); target.removeEventListener("keydown", targetKeydown); menu.removeEventListener("click", menuClick); document.removeEventListener("pointerdown", outside, true); document.removeEventListener("keydown", keydown); } };
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
  let depth = 0;
  const input = element.querySelector("input[type='file']");
  const nativeLabel = element.matches("label") && Boolean(input);
  function enter(event) { event.preventDefault(); depth += 1; element.classList.add("is-dragging"); }
  function over(event) { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = "copy"; }
  function leave(event) { event.preventDefault(); depth = Math.max(0, depth - 1); if (!depth) element.classList.remove("is-dragging"); }
  function drop(event) {
    event.preventDefault();
    depth = 0;
    element.classList.remove("is-dragging");
    const files = [...(event.dataTransfer?.files || [])];
    emit(element, "drop", { files, dataTransfer: event.dataTransfer });
  }
  function choose() { const files = [...(input?.files || [])]; emit(element, "files", { files, input }); }
  function activate(event) {
    if (!input || event.target === input || event.target.closest("button, a, input, select, textarea")) return;
    if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    input.click();
  }
  if (input) {
    if (!nativeLabel && !element.hasAttribute("role")) element.setAttribute("role", "button");
    if (!nativeLabel && !element.hasAttribute("tabindex")) element.tabIndex = 0;
    input.addEventListener("change", choose);
    if (!nativeLabel) {
      element.addEventListener("click", activate);
      element.addEventListener("keydown", activate);
    }
  }
  element.addEventListener("dragenter", enter);
  element.addEventListener("dragover", over);
  element.addEventListener("dragleave", leave);
  element.addEventListener("drop", drop);
  return { destroy: () => { element.removeEventListener("dragenter", enter); element.removeEventListener("dragover", over); element.removeEventListener("dragleave", leave); element.removeEventListener("drop", drop); input?.removeEventListener("change", choose); element.removeEventListener("click", activate); element.removeEventListener("keydown", activate); } };
}

function createCommandPalette(element) {
  let trigger = null;
  let open = !element.hidden;
  if (!element.id) element.id = uid("g-command-palette");
  const panel = element.querySelector("[role='dialog'], .g-command-palette") || element;
  const triggers = [...document.querySelectorAll("[data-g-command-trigger], [aria-controls]")].filter((button) => (button.dataset.gCommandTrigger || button.getAttribute("aria-controls"))?.replace(/^#/, "") === element.id);
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  element.setAttribute("aria-hidden", String(!open));
  triggers.forEach((button) => {
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-controls", element.id);
    button.setAttribute("aria-expanded", String(open));
  });
  function syncExpanded(value) { triggers.forEach((button) => button.setAttribute("aria-expanded", String(value))); }
  function show(source = document.activeElement) {
    if (open || !emit(element, "beforeopen", { source })) return;
    open = true;
    trigger = source;
    if (trigger instanceof HTMLElement && trigger.hasAttribute("data-g-command-trigger")) trigger.setAttribute("aria-expanded", "true");
    element.hidden = false;
    element.setAttribute("aria-hidden", "false");
    element.classList.add("is-open");
    syncExpanded(true);
    (visibleFocusable(panel)[0] || panel).focus();
    emit(element, "open", { source });
  }
  function hide(reason = "api") {
    if (!open || !emit(element, "beforeclose", { reason })) return;
    open = false;
    element.hidden = true;
    element.setAttribute("aria-hidden", "true");
    element.classList.remove("is-open");
    syncExpanded(false);
    if (trigger instanceof HTMLElement && trigger.hasAttribute("data-g-command-trigger")) trigger.setAttribute("aria-expanded", "false");
    trigger?.focus?.();
    emit(element, "close", { reason });
  }
  function keydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") { event.preventDefault(); open ? hide("shortcut") : show(document.activeElement); }
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
  if (open) { open = false; queueMicrotask(show); }
  document.addEventListener("keydown", keydown);
  element.addEventListener("pointerdown", backdrop);
  return { open: show, close: hide, toggle: (source) => open ? hide("toggle") : show(source), isOpen: () => open, destroy: () => { document.removeEventListener("keydown", keydown); element.removeEventListener("pointerdown", backdrop); open = false; element.hidden = true; element.setAttribute("aria-hidden", "true"); element.classList.remove("is-open"); syncExpanded(false); } };
}

function createUploadManager(element) {
  const list = element.querySelector("[data-g-upload-list]") || element;
  const input = element.querySelector("input[type='file'][data-g-upload-input]");
  const template = targetById(element.dataset.gUploadTemplate);
  const items = () => [...list.querySelectorAll("[data-g-upload-item]")];
  function statusText(item) {
    const state = item.dataset.gStatus || "queued";
    const progress = Math.max(0, Math.min(100, Number(item.dataset.gProgress || 0)));
    return state === "success" ? "已完成" : state === "error" ? "上传失败" : state === "paused" ? "已暂停" : state === "uploading" ? `上传中 ${progress}%` : "等待上传";
  }
  function sync(reason = "api") {
    const current = items();
    current.forEach((item) => {
      const progress = Math.max(0, Math.min(100, Number(item.dataset.gProgress || 0)));
      item.style.setProperty("--g-progress", `${progress}%`);
      const bar = item.querySelector("[data-g-upload-progress]");
      if (bar) { bar.style.setProperty("--g-progress", `${progress}%`); bar.setAttribute("aria-valuenow", String(progress)); }
      const status = item.querySelector("[data-g-upload-status]");
      if (status) status.textContent = statusText(item);
      item.querySelectorAll("[data-g-upload-action='pause']").forEach((button) => { button.textContent = item.dataset.gStatus === "paused" ? "继续" : "暂停"; });
    });
    const counts = { total: current.length, success: current.filter((item) => item.dataset.gStatus === "success").length, error: current.filter((item) => item.dataset.gStatus === "error").length, active: current.filter((item) => ["queued", "uploading", "paused"].includes(item.dataset.gStatus || "queued")).length };
    Object.entries(counts).forEach(([name, value]) => element.querySelectorAll(`[data-g-upload-count="${name}"]`).forEach((node) => { node.textContent = String(value); }));
    emit(element, "uploadchange", { items: current, counts, reason });
  }
  function addFile(file) {
    let item;
    if (template?.content) { const fragment = template.content.cloneNode(true); item = fragment.querySelector("[data-g-upload-item]") || fragment.firstElementChild; list.append(fragment); }
    if (!item) { item = document.createElement("div"); item.className = "g-upload-item"; item.dataset.gUploadItem = ""; item.innerHTML = '<span class="g-file-icon">FILE</span><span class="g-file-main"><strong class="g-file-name"></strong><span class="g-file-meta"></span><span class="g-upload-status" data-g-upload-status></span></span><span class="g-upload-progress" data-g-upload-progress role="progressbar" aria-valuemin="0" aria-valuemax="100"><i class="g-upload-progress-bar"></i></span><span class="g-upload-actions"><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="remove">移除</button></span>'; list.append(item); }
    item.dataset.gStatus = "queued"; item.dataset.gProgress = "0"; item.querySelector(".g-file-name")?.replaceChildren(document.createTextNode(file.name));
    const meta = item.querySelector(".g-file-meta"); if (meta) meta.textContent = file.size ? `${Math.max(1, Math.round(file.size / 1024))} KB` : "等待计算";
    emit(element, "uploadadd", { file, item });
  }
  function action(item, name) {
    if (name === "remove") { item.remove(); sync("remove"); return; }
    if (name === "retry") { item.dataset.gStatus = "queued"; item.dataset.gProgress = "0"; }
    if (name === "pause") item.dataset.gStatus = item.dataset.gStatus === "paused" ? "uploading" : "paused";
    if (name === "advance" && item.dataset.gStatus !== "paused") { const progress = Math.min(100, Number(item.dataset.gProgress || 0) + 25); item.dataset.gProgress = String(progress); item.dataset.gStatus = progress >= 100 ? "success" : "uploading"; }
    sync(name);
  }
  function click(event) { const button = event.target.closest("[data-g-upload-action]"); const item = button?.closest("[data-g-upload-item]"); if (button && item) { event.preventDefault(); action(item, button.dataset.gUploadAction); } }
  function change() { [...(input?.files || [])].forEach(addFile); if (input) input.value = ""; sync("files"); }
  element.addEventListener("click", click); input?.addEventListener("change", change); sync("init");
  return { sync, addFile, items, destroy: () => { element.removeEventListener("click", click); input?.removeEventListener("change", change); } };
}

function createFileBrowser(element) {
  const items = () => [...element.querySelectorAll("[data-g-file-item]")];
  const search = element.querySelector("[data-g-file-search]");
  let selected = items().find((item) => item.getAttribute("aria-selected") === "true") || null;
  function select(item, reason = "api") {
    items().forEach((entry) => { const active = entry === item; entry.setAttribute("aria-selected", String(active)); entry.tabIndex = active ? 0 : -1; });
    selected = item;
    element.querySelectorAll("[data-g-file-selection]").forEach((node) => { node.textContent = item?.dataset.gFileName || item?.querySelector(".g-file-name, .g-media-label")?.textContent || "未选择"; });
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
    const visible = items().filter((entry) => !entry.hidden); if (!visible.length) return; event.preventDefault();
    if (["Enter", " "].includes(event.key)) { select(item, "keyboard"); return; }
    const current = visible.indexOf(item); const forward = ["ArrowDown", "ArrowRight"].includes(event.key); const index = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1 : (current + (forward ? 1 : -1) + visible.length) % visible.length; visible[index].focus();
  }
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); search?.addEventListener("input", filter);
  items().forEach((item, index) => {
    item.tabIndex = item === selected || (!selected && index === 0) ? 0 : -1;
    item.setAttribute("role", item.getAttribute("role") || "option");
    if (!item.hasAttribute("aria-selected")) item.setAttribute("aria-selected", "false");
    const collection = item.parentElement;
    if (collection) {
      if (!collection.hasAttribute("role")) collection.setAttribute("role", "listbox");
      if (!collection.hasAttribute("aria-label") && !collection.hasAttribute("aria-labelledby")) collection.setAttribute("aria-label", element.getAttribute("aria-label") || "文件列表");
    }
  });
  if (selected) select(selected, "init"); filter();
  return { select, filter, selected: () => selected, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); search?.removeEventListener("input", filter); } };
}

function createEditorShell(element) {
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
  const controls = [...element.querySelectorAll("[data-g-revision-view]")];
  function setView(view, reason = "api") { element.dataset.gRevisionView = view; controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.gRevisionView === view))); emit(element, "revisionview", { view, reason }); }
  function click(event) { const button = event.target.closest("[data-g-revision-view]"); if (button) { event.preventDefault(); setView(button.dataset.gRevisionView, "pointer"); } }
  element.addEventListener("click", click); setView(element.dataset.gRevisionView || controls.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.gRevisionView || "split", "init");
  return { setView, view: () => element.dataset.gRevisionView, destroy: () => element.removeEventListener("click", click) };
}

function createAutosave(element) {
  const scope = targetById(element.dataset.gAutosaveScope) || element.closest("form, [data-g-editor-shell]") || element.parentElement;
  const delay = Math.max(150, Number(element.dataset.gAutosaveDelay || 900));
  let timer = 0; let saveTimer = 0;
  function setState(state, reason = "api") { element.dataset.gAutosaveState = state; const label = element.querySelector("[data-g-autosave-label]"); if (label) label.textContent = state === "dirty" ? "有未保存更改" : state === "saving" ? "正在保存…" : state === "error" ? "保存失败" : "已保存"; emit(element, "autosavestate", { state, reason }); }
  function save(reason = "api") { clearTimeout(timer); clearTimeout(saveTimer); setState("saving", reason); saveTimer = window.setTimeout(() => setState("saved", "complete"), 260); }
  function dirty() { clearTimeout(timer); setState("dirty", "input"); timer = window.setTimeout(() => save("delay"), delay); }
  function click(event) { if (event.target.closest("[data-g-autosave-now]")) { event.preventDefault(); save("button"); } }
  scope?.addEventListener("input", dirty); scope?.addEventListener("change", dirty); element.addEventListener("click", click); setState(element.dataset.gAutosaveState || "saved", "init");
  return { save, state: () => element.dataset.gAutosaveState, destroy: () => { clearTimeout(timer); clearTimeout(saveTimer); scope?.removeEventListener("input", dirty); scope?.removeEventListener("change", dirty); element.removeEventListener("click", click); } };
}

function createQuantityStepper(element) {
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
    if (summary) summary.textContent = Object.values(value).filter(Boolean).join(" / ") || element.dataset.gEmptyLabel || "请选择规格";
    emit(element, "skuchange", { value, complete, reason });
    return value;
  }
  function choose(option, reason = "pointer") {
    if (!option || option.disabled || option.getAttribute("aria-disabled") === "true") return;
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
    const enabled = options(current.closest("[data-g-sku-group]")).filter((item) => !item.disabled && item.getAttribute("aria-disabled") !== "true");
    const index = enabled.indexOf(current);
    const next = event.key === "Home" ? enabled[0] : event.key === "End" ? enabled.at(-1) : ["ArrowRight", "ArrowDown"].includes(event.key) ? enabled[index + 1] || enabled[0] : enabled[index - 1] || enabled.at(-1);
    next?.focus(); choose(next, "keyboard");
  }
  groups.forEach((group) => { const items = options(group); const selected = items.find((item) => item.getAttribute("aria-pressed") === "true") || items.find((item) => !item.disabled && item.getAttribute("aria-disabled") !== "true"); items.forEach((item) => { item.setAttribute("aria-pressed", String(item === selected)); item.tabIndex = item === selected ? 0 : -1; }); });
  element.addEventListener("click", click); element.addEventListener("keydown", keydown); sync("init");
  return { value: selection, select: (groupName, value) => { const group = groups.find((item) => item.dataset.gSkuGroup === groupName); choose(options(group).find((item) => (item.dataset.gValue || item.textContent.trim()) === value), "api"); }, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createCart(element) {
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
  const input = element.querySelector("[data-g-coupon-input]") || element.querySelector("input");
  const status = element.querySelector("[data-g-coupon-status]");
  if (!input) return null;
  const validCodes = (element.dataset.gValidCodes || "").split(",").map((code) => code.trim().toLocaleUpperCase()).filter(Boolean);
  function setState(state, code = "", reason = "api") {
    element.classList.toggle("is-applied", state === "applied"); element.classList.toggle("is-invalid", state === "invalid");
    element.dataset.gCouponState = state; input.setAttribute("aria-invalid", String(state === "invalid"));
    if (status) { status.textContent = state === "applied" ? element.dataset.gAppliedMessage || `优惠码 ${code} 已使用` : state === "invalid" ? element.dataset.gInvalidMessage || "优惠码无效或已过期" : element.dataset.gIdleMessage || ""; status.setAttribute("role", state === "invalid" ? "alert" : "status"); }
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
}

function createPullRefresh(element) {
  const content = element.querySelector(".g-mobile-pull-refresh-content") || element.firstElementChild;
  const indicator = element.querySelector("[data-g-pull-indicator]");
  const threshold = numeric(element.dataset.gPullThreshold, 72);
  let startY = 0; let distance = 0; let tracking = false; let refreshing = false;
  function paint(value) { distance = Math.max(0, Math.min(value, threshold * 1.5)); element.style.setProperty("--g-pull-distance", `${distance}px`); element.classList.toggle("is-pulling", tracking); if (indicator) indicator.textContent = distance >= threshold ? element.dataset.gReleaseLabel || "松开刷新" : element.dataset.gPullLabel || "下拉刷新"; }
  function begin(event) { if (refreshing || element.scrollTop > 0 || event.pointerType === "mouse" && event.button !== 0) return; startY = event.clientY; tracking = true; element.setPointerCapture?.(event.pointerId); }
  function move(event) { if (!tracking) return; const delta = event.clientY - startY; if (delta <= 0) return paint(0); if (delta > 8) event.preventDefault(); paint(Math.sqrt(delta) * 8); }
  function finish() { if (!refreshing) return; refreshing = false; element.classList.remove("is-refreshing"); element.setAttribute("aria-busy", "false"); paint(0); if (indicator) indicator.textContent = element.dataset.gPullLabel || "下拉刷新"; emit(element, "refreshcomplete"); }
  function refresh(reason = "gesture") { if (refreshing || !emit(element, "refresh", { reason, complete: finish })) return; refreshing = true; tracking = false; element.classList.add("is-refreshing"); element.setAttribute("aria-busy", "true"); paint(threshold / 2); if (indicator) indicator.textContent = element.dataset.gRefreshingLabel || "正在刷新…"; const timeout = numeric(element.dataset.gRefreshTimeout, 0); if (timeout > 0) window.setTimeout(finish, timeout); }
  function end() { if (!tracking) return; tracking = false; element.classList.remove("is-pulling"); distance >= threshold ? refresh() : paint(0); }
  function click(event) { if (event.target.closest("[data-g-refresh]")) refresh("button"); }
  element.addEventListener("pointerdown", begin); element.addEventListener("pointermove", move, { passive: false }); element.addEventListener("pointerup", end); element.addEventListener("pointercancel", end); element.addEventListener("click", click);
  return { refresh, complete: finish, isRefreshing: () => refreshing, destroy: () => { element.removeEventListener("pointerdown", begin); element.removeEventListener("pointermove", move); element.removeEventListener("pointerup", end); element.removeEventListener("pointercancel", end); element.removeEventListener("click", click); content?.style.removeProperty("transform"); element.style.removeProperty("--g-pull-distance"); } };
}

function createInfiniteLoad(element) {
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
  let startX = 0; let startY = 0; let tracking = false;
  function set(revealed, reason = "api") { element.classList.toggle("is-revealed", revealed); element.querySelector("[data-g-swipe-toggle]")?.setAttribute("aria-expanded", String(revealed)); emit(element, "swipechange", { revealed, reason }); }
  function begin(event) { if (event.pointerType === "mouse" && event.button !== 0) return; startX = event.clientX; startY = event.clientY; tracking = true; element.setPointerCapture?.(event.pointerId); }
  function end(event) { if (!tracking) return; tracking = false; const dx = event.clientX - startX; const dy = event.clientY - startY; if (Math.abs(dx) < 36 || Math.abs(dx) < Math.abs(dy)) return; const rtl = getComputedStyle(element).direction === "rtl"; set(rtl ? dx > 0 : dx < 0, "gesture"); }
  function click(event) { if (event.target.closest("[data-g-swipe-toggle]")) set(!element.classList.contains("is-revealed"), "button"); else if (event.target.closest("[data-g-swipe-close]")) set(false, "action"); }
  function keydown(event) { if (event.key === "Escape") set(false, "keyboard"); }
  element.addEventListener("pointerdown", begin); element.addEventListener("pointerup", end); element.addEventListener("pointercancel", () => { tracking = false; }); element.addEventListener("click", click); element.addEventListener("keydown", keydown);
  return { reveal: () => set(true), close: () => set(false), toggle: () => set(!element.classList.contains("is-revealed")), destroy: () => { element.removeEventListener("pointerdown", begin); element.removeEventListener("pointerup", end); element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createWheelPicker(element) {
  const columns = [...element.querySelectorAll("[data-g-wheel-column]")]; const output = element.querySelector("[data-g-wheel-output]"); const timers = new WeakMap();
  function options(column) { return [...column.querySelectorAll("[data-g-wheel-option]")]; }
  function select(option, reason = "option") { const column = option.closest("[data-g-wheel-column]"); if (!column) return; options(column).forEach((item) => item.setAttribute("aria-selected", String(item === option))); option.scrollIntoView({ block: "center", behavior: reason === "scroll" ? "auto" : "smooth" }); const values = columns.map((item) => item.querySelector('[data-g-wheel-option][aria-selected="true"]')?.dataset.gValue || ""); if (output) output.value = JSON.stringify(values); emit(element, "wheelchange", { values, reason }); }
  function click(event) { const option = event.target.closest("[data-g-wheel-option]"); if (option) select(option); }
  function keydown(event) { const option = event.target.closest("[data-g-wheel-option]"); if (!option || !["ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return; event.preventDefault(); const list = options(option.closest("[data-g-wheel-column]")); const index = list.indexOf(option); const next = event.key === "Home" ? list[0] : event.key === "End" ? list.at(-1) : list[index + (event.key === "ArrowDown" ? 1 : -1)] || option; next.focus(); select(next, "keyboard"); }
  function scroll(event) { const column = event.currentTarget; clearTimeout(timers.get(column)); timers.set(column, setTimeout(() => { const center = column.getBoundingClientRect().top + column.clientHeight / 2; const nearest = options(column).sort((a, b) => Math.abs(a.getBoundingClientRect().top + a.clientHeight / 2 - center) - Math.abs(b.getBoundingClientRect().top + b.clientHeight / 2 - center))[0]; if (nearest) select(nearest, "scroll"); }, 90)); }
  columns.forEach((column) => { column.addEventListener("scroll", scroll, { passive: true }); const selected = column.querySelector('[data-g-wheel-option][aria-selected="true"]') || options(column)[0]; if (selected) select(selected, "init"); }); element.addEventListener("click", click); element.addEventListener("keydown", keydown);
  return { select, values: () => columns.map((column) => column.querySelector('[data-g-wheel-option][aria-selected="true"]')?.dataset.gValue || ""), destroy: () => { columns.forEach((column) => { clearTimeout(timers.get(column)); column.removeEventListener("scroll", scroll); }); element.removeEventListener("click", click); element.removeEventListener("keydown", keydown); } };
}

function createAIComposer(element) {
  const input = element.querySelector("[data-g-composer-input], .g-composer-input");
  const send = element.querySelector("[data-g-composer-send]");
  const stop = element.querySelector("[data-g-composer-stop]");
  const status = element.querySelector("[data-g-composer-status]");
  if (!input) return null;
  let streaming = element.classList.contains("is-streaming");
  function resize() { input.style.height = "auto"; input.style.height = `${Math.min(input.scrollHeight, Number(element.dataset.gMaxHeight || 224))}px`; }
  function sync() { const empty = !input.value.trim(); if (send) send.disabled = empty || streaming; if (stop) stop.hidden = !streaming; element.classList.toggle("is-empty", empty); if (status && !streaming) status.textContent = empty ? element.dataset.gEmptyLabel || "输入消息，Enter 发送，Shift+Enter 换行" : element.dataset.gReadyLabel || "已准备发送"; resize(); }
  function setStreaming(value, reason = "api") { streaming = Boolean(value); element.classList.toggle("is-streaming", streaming); element.setAttribute("aria-busy", String(streaming)); if (status) status.textContent = streaming ? element.dataset.gStreamingLabel || "正在生成；可停止" : element.dataset.gReadyLabel || "已准备发送"; sync(); emit(element, "composerstate", { streaming, reason }); }
  function submit(reason = "api") { const value = input.value.trim(); if (!value || streaming || !emit(element, "beforepromptsubmit", { value, reason, input })) return; emit(element, "promptsubmit", { value, reason, input }); if (element.dataset.gClearOnSend !== "false") input.value = ""; sync(); }
  function stopGeneration(reason = "api") { if (!streaming || !emit(element, "beforepromptstop", { reason })) return; setStreaming(false, reason); emit(element, "promptstop", { reason }); }
  function keydown(event) { if (event.key === "Enter" && !event.shiftKey && !event.altKey && !event.isComposing) { event.preventDefault(); submit("keyboard"); } }
  function click(event) { if (event.target.closest("[data-g-composer-send]")) submit("button"); else if (event.target.closest("[data-g-composer-stop]")) stopGeneration("button"); else { const remove = event.target.closest("[data-g-attachment-remove]"); if (remove) { const attachment = remove.closest(".g-attachment"); if (attachment && emit(element, "attachmentremove", { attachment })) attachment.remove(); } } }
  input.addEventListener("input", sync); input.addEventListener("keydown", keydown); element.addEventListener("click", click); sync();
  return { submit, stop: stopGeneration, setStreaming, value: () => input.value, focus: () => input.focus(), destroy: () => { input.removeEventListener("input", sync); input.removeEventListener("keydown", keydown); element.removeEventListener("click", click); } };
}

function createPromptFill(element) {
  function click(event) { const item = event.target.closest("[data-g-prompt-value]"); if (!item) return; const target = targetById(item.dataset.gPromptTarget || element.dataset.gPromptTarget); if (!target) return; const value = item.dataset.gPromptValue || item.dataset.gValue || item.textContent.trim(); target.value = value; target.dispatchEvent(new Event("input", { bubbles: true })); target.focus(); emit(element, "promptfill", { value, item, target }); }
  element.addEventListener("click", click);
  return { fill: (item) => click({ target: item }), destroy: () => element.removeEventListener("click", click) };
}

function createAIApproval(element) {
  const choices = [...element.querySelectorAll("[data-g-approval-choice]")];
  function choose(choice, reason = "api") { if (!choice || choice.disabled) return; const value = choice.dataset.gApprovalChoice; if (!emit(element, "beforeapproval", { value, choice, reason })) return; element.dataset.gApprovalState = value; ["approved", "rejected", "cancelled"].forEach((state) => element.classList.toggle(`is-${state}`, value === state)); choices.forEach((item) => { item.setAttribute("aria-pressed", String(item === choice)); if (element.dataset.gKeepEnabled !== "true") item.disabled = true; }); emit(element, "approval", { value, choice, reason }); }
  function click(event) { choose(event.target.closest("[data-g-approval-choice]"), "pointer"); }
  element.addEventListener("click", click);
  return { choose, reset: () => { delete element.dataset.gApprovalState; element.classList.remove("is-approved", "is-rejected", "is-cancelled"); choices.forEach((item) => { item.disabled = false; item.setAttribute("aria-pressed", "false"); }); }, destroy: () => element.removeEventListener("click", click) };
}

function createAIFeedback(element) {
  const options = [...element.querySelectorAll("[data-g-feedback-value]")];
  const detail = element.querySelector("[data-g-feedback-detail]");
  const comment = element.querySelector("[data-g-feedback-comment]");
  const output = element.querySelector("[data-g-feedback-output]");
  let value = output?.value || "";
  function select(option, reason = "api") { if (!option) return; value = option.dataset.gFeedbackValue; options.forEach((item) => item.setAttribute("aria-pressed", String(item === option))); if (output) output.value = value; if (detail) detail.hidden = false; emit(element, "feedbackchange", { value, option, reason }); }
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
  function format(shortcut) { return shortcut ? shortcut.replaceAll("Control", navigator.platform.includes("Mac") ? "⌃" : "Ctrl").replaceAll("Meta", navigator.platform.includes("Mac") ? "⌘" : "Meta").replaceAll("Alt", navigator.platform.includes("Mac") ? "⌥" : "Alt").replaceAll("Shift", navigator.platform.includes("Mac") ? "⇧" : "Shift") : element.dataset.gEmptyLabel || "未设置"; }
  function sync(reason = "api") { if (output) output.value = value; if (display) display.textContent = format(value); element.dataset.gValue = value; emit(element, "shortcutchange", { value, reason }); }
  function stop(reason = "cancel") { recording = false; control.classList.remove("is-recording"); control.setAttribute("aria-pressed", "false"); if (status) status.textContent = reason === "recorded" ? element.dataset.gSavedLabel || "快捷键已记录" : element.dataset.gIdleLabel || "点击后按下组合键"; }
  function start() { recording = true; control.classList.add("is-recording"); control.setAttribute("aria-pressed", "true"); if (status) status.textContent = element.dataset.gRecordingLabel || "请按下快捷键；Esc 取消"; control.focus(); }
  function keydown(event) { if (!recording) return; event.preventDefault(); event.stopPropagation(); if (event.key === "Escape") return stop(); if (["Backspace", "Delete"].includes(event.key)) { value = ""; sync("clear"); return stop("recorded"); } if (["Control", "Alt", "Shift", "Meta"].includes(event.key)) return; const pressed = { Control: event.ctrlKey, Alt: event.altKey, Shift: event.shiftKey, Meta: event.metaKey }; const modifiers = modifierOrder.filter((name) => pressed[name]); const key = event.key.length === 1 ? event.key.toLocaleUpperCase() : event.key; value = [...modifiers, key].join("+"); sync("keyboard"); stop("recorded"); }
  function click(event) { if (event.target.closest("[data-g-shortcut-clear]")) { value = ""; sync("clear"); stop("recorded"); } else start(); }
  control.addEventListener("click", click); control.addEventListener("keydown", keydown); sync("init"); stop();
  return { start, stop, clear: () => { value = ""; sync("api"); }, value: () => value, destroy: () => { control.removeEventListener("click", click); control.removeEventListener("keydown", keydown); } };
}

function createDesktopTabs(element) {
  const tabs = () => [...element.querySelectorAll("[data-g-desktop-tab]")];
  function select(tab, reason = "api", focus = false) { if (!tab || tab.getAttribute("aria-disabled") === "true") return; tabs().forEach((item) => { const active = item === tab; item.setAttribute("aria-selected", String(active)); item.classList.toggle("is-active", active); item.tabIndex = active ? 0 : -1; const panel = targetById(item.getAttribute("aria-controls")); if (panel) panel.hidden = !active; }); if (focus) tab.focus(); emit(element, "desktoptabchange", { tab, reason }); }
  function close(tab, reason = "api") { if (!tab || !emit(element, "beforetabclose", { tab, reason, dirty: tab.classList.contains("is-dirty") })) return; const list = tabs(); const index = list.indexOf(tab); const wasActive = tab.getAttribute("aria-selected") === "true" || tab.classList.contains("is-active"); const panel = targetById(tab.getAttribute("aria-controls")); panel?.remove(); tab.remove(); const remaining = tabs(); if (wasActive) select(remaining[Math.min(index, remaining.length - 1)], "close", true); emit(element, "desktoptabclose", { reason }); }
  function click(event) { const closeButton = event.target.closest("[data-g-desktop-tab-close]"); const tab = event.target.closest("[data-g-desktop-tab]"); if (closeButton) { event.stopPropagation(); close(closeButton.closest("[data-g-desktop-tab]"), "button"); } else if (tab) select(tab, "pointer"); }
  function pointerdown(event) { if (event.button === 1) { const tab = event.target.closest("[data-g-desktop-tab]"); if (tab) { event.preventDefault(); close(tab, "middle-click"); } } }
  function keydown(event) { const list = tabs(); const current = event.target.closest("[data-g-desktop-tab]") || list.find((tab) => tab.getAttribute("aria-selected") === "true"); if (!current) return; const index = list.indexOf(current); if ((event.ctrlKey || event.metaKey) && event.key === "Tab") { event.preventDefault(); select(list[(index + (event.shiftKey ? -1 : 1) + list.length) % list.length], "shortcut", true); } else if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "w") { event.preventDefault(); close(current, "shortcut"); } else if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) { event.preventDefault(); const next = event.key === "Home" ? list[0] : event.key === "End" ? list.at(-1) : list[(index + (event.key === "ArrowRight" ? 1 : -1) + list.length) % list.length]; select(next, "keyboard", true); } }
  element.setAttribute("role", element.getAttribute("role") || "tablist"); tabs().forEach((tab) => tab.setAttribute("role", tab.getAttribute("role") || "tab")); element.addEventListener("click", click); element.addEventListener("pointerdown", pointerdown); element.addEventListener("keydown", keydown); const initial = tabs().find((tab) => tab.getAttribute("aria-selected") === "true") || tabs()[0]; if (initial) select(initial, "init");
  return { select, close, tabs, destroy: () => { element.removeEventListener("click", click); element.removeEventListener("pointerdown", pointerdown); element.removeEventListener("keydown", keydown); } };
}

function createNativeFilePicker(element) {
  const input = element.querySelector("input[type='file']"); const trigger = element.querySelector("[data-g-native-file-trigger]"); const value = element.querySelector("[data-g-native-file-value]"); if (!input || !trigger) return null;
  function sync(reason = "change") { const files = [...input.files]; if (value) value.textContent = files.length ? files.map((file) => file.name).join(", ") : element.dataset.gEmptyLabel || "未选择文件"; emit(element, "nativefiles", { files, input, reason }); }
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
  ["dropdown", createDropdown], ["tabs", createTabs], ["accordion", createAccordion],
  ["auto-resize", createAutoResize], ["combobox", createCombobox],
  ["password-toggle", createPasswordToggle], ["clear-input", createClearInput],
  ["otp-input", createOtpInput], ["password-strength", createPasswordStrength], ["auth-timer", createAuthTimer],
  ["quantity-stepper", createQuantityStepper], ["sku-selector", createSkuSelector], ["cart", createCart], ["coupon", createCoupon],
  ["pull-refresh", createPullRefresh], ["infinite-load", createInfiniteLoad], ["swipe-actions", createSwipeActions], ["wheel-picker", createWheelPicker],
  ["ai-composer", createAIComposer], ["prompt-fill", createPromptFill], ["ai-approval", createAIApproval], ["ai-feedback", createAIFeedback],
  ["shortcut-recorder", createShortcutRecorder], ["desktop-tabs", createDesktopTabs], ["native-file-picker", createNativeFilePicker], ["window-switcher", createWindowSwitcher],
  ["character-count", createCharacterCount], ["conditional-field", createConditionalField],
  ["repeatable-field", createRepeatableField],
  ["tooltip", (element) => createFloating(element, "tooltip")], ["popover", (element) => createFloating(element, "popover")],
  ["tour", createTour],
  ["carousel", createCarousel], ["split-pane", createSplitter], ["tree", createTree],
  ["data-grid", createDataGrid], ["table-sort", createTableSort], ["row-select", createRowSelect],
  ["row-disclosure", createRowDisclosure], ["column-toggle", createColumnToggle],
  ["data-filter", createDataFilter], ["data-view", createDataView],
  ["transfer", createTransfer], ["picker", createPicker], ["cascader", createCascader],
  ["saved-choice", createSavedChoice], ["builder-list", createBuilderList],
  ["toast", createToast], ["copy", createCopy],
  ["fullscreen", createFullscreen], ["scroll-top", createScrollTop], ["dropzone", createDropzone],
  ["nav-toggle", createNavToggle], ["roving-nav", createRovingNav], ["context-menu", createContextMenu],
  ["scrollspy", createScrollspy], ["jump-nav", createJumpNav],
  ["upload-manager", createUploadManager], ["file-browser", createFileBrowser],
  ["editor-shell", createEditorShell], ["revision-compare", createRevisionCompare], ["autosave", createAutosave],
  ["command-palette", createCommandPalette]
].forEach(([name, factory]) => register(name, factory));

function initElement(element, name) {
  const store = storeFor(element);
  if (store.has(name)) return store.get(name);
  const factory = registry.get(name);
  if (!factory) return null;
  const instance = factory(element);
  if (instance) { store.set(name, instance); emit(element, "init", { name, instance }); }
  return instance;
}

function init(root = document) {
  for (const [name] of registry) {
    const selector = `[data-g-${name}]`;
    if (root instanceof Element && root.matches(selector)) initElement(root, name);
    root.querySelectorAll?.(selector).forEach((element) => initElement(element, name));
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
    const store = instanceStores.get(element);
    if (!store) return;
    store.forEach((instance) => instance?.destroy?.());
    instanceStores.delete(element);
  });
}

function toast(options = {}) {
  let region = document.querySelector(".g-toast-region");
  if (!region) {
    region = document.createElement("div");
    region.className = "g-toast-region";
    region.setAttribute("aria-live", options.tone === "danger" ? "assertive" : "polite");
    document.body.append(region);
  }
  const element = document.createElement("div");
  element.className = `g-toast${options.tone ? ` g-toast-${options.tone}` : ""}`;
  element.setAttribute("role", options.tone === "danger" ? "alert" : "status");
  element.dataset.gToast = "";
  if (options.timeout != null) element.dataset.gTimeout = String(options.timeout);
  element.innerHTML = `<div class="g-toast-content"><div class="g-toast-title"></div><div class="g-toast-message"></div></div><button class="g-btn g-btn-ghost g-btn-icon" data-g-dismiss aria-label="Close">×</button>`;
  element.querySelector(".g-toast-title").textContent = options.title || "";
  element.querySelector(".g-toast-message").textContent = options.message || "";
  region.append(element);
  init(element);
  return element;
}

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
    const toastInstance = target ? getInstance(target, "toast") : null;
    if (toastInstance) toastInstance.dismiss("button");
    else if (target && emit(target, "dismiss", { reason: "button" })) target.remove();
  }
}

let observer;
function observe() {
  if (observer || typeof MutationObserver === "undefined") return;
  observer = new MutationObserver((records) => records.forEach((record) => {
    record.addedNodes.forEach((node) => { if (node instanceof Element) init(node); });
    record.removedNodes.forEach((node) => { if (node instanceof Element) destroy(node); });
    if (record.type === "attributes" && record.target instanceof Element && record.attributeName?.startsWith("data-g-")) {
      const name = record.attributeName.slice(7);
      if (registry.has(name) && record.target.hasAttribute(record.attributeName)) initElement(record.target, name);
      else if (registry.has(name)) {
        const store = instanceStores.get(record.target);
        store?.get(name)?.destroy?.();
        store?.delete(name);
        if (store?.size === 0) instanceStores.delete(record.target);
      }
    }
  }));
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
}

const Gardenerim = Object.freeze({ version: "2.0.0", get behaviors() { return Object.freeze([...registry.keys()]); }, init, destroy, register, getInstance, emit, toast, observe });

if (typeof document !== "undefined") {
  document.addEventListener("click", delegateClick);
  const start = () => { init(); observe(); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else queueMicrotask(start);
}


export { Gardenerim, init, destroy, register, getInstance, emit, toast, observe };
export default Gardenerim;
