import * as Gardenerim from "./gardener.runtime.min.js";

const mounted = new WeakMap();
const tauriBindings = new WeakMap();
const electronBindings = new WeakMap();
const themeAxes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];

const normalizeEvent = (name) => String(name || "change").startsWith("gardener:") ? String(name || "change") : `gardener:${String(name || "change")}`;
const normalizeValue = (value) => value === undefined ? null : value;
const detailValue = (detail, key) => {
  if (detail == null || typeof detail !== "object") return detail;
  return detail[key] ?? detail.value ?? detail.values ?? detail.selected ?? null;
};
const serializable = (value, seen = new WeakSet(), depth = 0) => {
  if (value == null || typeof value === "string" || typeof value === "boolean") return value ?? null;
  if (typeof value === "number") return Number.isFinite(value) ? value : String(value);
  if (typeof value === "bigint") return String(value);
  if (typeof value === "function" || typeof value === "symbol" || depth > 8) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof Element !== "undefined" && value instanceof Element) return { tagName: value.tagName.toLowerCase(), id: value.id || null, className: typeof value.className === "string" ? value.className : null };
  if (typeof File !== "undefined" && value instanceof File) return { name: value.name, size: value.size, type: value.type, lastModified: value.lastModified };
  if (typeof value !== "object") return String(value);
  if (seen.has(value)) return null;
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => serializable(item, seen, depth + 1));
  const result = {};
  try {
    for (const [key, item] of Object.entries(value)) {
      if (typeof item !== "function" && typeof item !== "symbol") result[key] = serializable(item, seen, depth + 1);
    }
  } catch {}
  return result;
};

export function initialize(element) {
  if (element) Gardenerim.init(element);
}

export function destroy(element) {
  if (element) Gardenerim.destroy(element);
}

export function refresh(element) {
  if (!element) return;
  Gardenerim.destroy(element);
  Gardenerim.init(element);
}

export function configureLocalization(options) {
  return Gardenerim.configure(options ?? {});
}

export function getLocalization() {
  return Gardenerim.getConfiguration();
}

export function mount(element, shouldInitialize, valueEvent, valueKey, listenForValue, eventNames = [], preventDefaultEvents = [], receiver) {
  if (!element) return;
  unmount(element);
  if (shouldInitialize) Gardenerim.init(element); else Gardenerim.destroy(element);
  const valueEventName = normalizeEvent(valueEvent || "change");
  const subscribed = new Set((Array.isArray(eventNames) ? eventNames : []).map(normalizeEvent));
  const observed = new Set(subscribed);
  if (listenForValue) observed.add(valueEventName);
  const prevented = new Set((Array.isArray(preventDefaultEvents) ? preventDefaultEvents : []).map(normalizeEvent));
  const listeners = [];
  if (receiver) {
    for (const eventName of observed) {
      const listener = (event) => {
        if (prevented.has(eventName) && event.cancelable) event.preventDefault();
        const detail = event.detail ?? null;
        const safeDetail = serializable(detail);
        if (listenForValue && eventName === valueEventName) receiver.invokeMethodAsync("NotifyGardenerimValueChanged", serializable(normalizeValue(detailValue(detail, valueKey || "value"))), eventName, safeDetail).catch(() => {});
        if (subscribed.has(eventName)) receiver.invokeMethodAsync("NotifyGardenerimEvent", safeDetail, eventName, event.defaultPrevented).catch(() => {});
      };
      element.addEventListener(eventName, listener);
      listeners.push({ eventName, listener });
    }
  }
  mounted.set(element, { listeners });
}

export function unmount(element) {
  if (!element) return;
  const state = mounted.get(element);
  for (const { eventName, listener } of state?.listeners ?? []) element.removeEventListener(eventName, listener);
  mounted.delete(element);
  Gardenerim.destroy(element);
}

export function emit(element, name, detail) {
  return element ? Gardenerim.emit(element, String(name).replace(/^gardener:/, ""), detail ?? {}) : false;
}

export function focus(element) {
  element?.focus?.({ preventScroll: true });
}

export function getBehaviorMembers(element, behavior) {
  const instance = element ? Gardenerim.getInstance(element, behavior) : null;
  if (!instance) return [];
  const names = new Set();
  let current = instance;
  while (current && current !== Object.prototype) {
    Reflect.ownKeys(current).filter((key) => typeof key === "string" && key !== "constructor").forEach((key) => names.add(key));
    current = Object.getPrototypeOf(current);
  }
  return [...names].sort();
}

export function invokeBehavior(element, behavior, member, args = []) {
  const instance = element ? Gardenerim.getInstance(element, behavior) : null;
  if (!instance) throw new Error(`Gardenerim behavior is not initialized: ${behavior}`);
  const target = instance[member];
  if (typeof target !== "function") throw new Error(`Unknown Gardenerim behavior member: ${behavior}.${member}`);
  return target.apply(instance, Array.isArray(args) ? args : []);
}

export function applyTheme(element, state) {
  if (!element) return;
  clearTheme(element);
  for (const axis of themeAxes) {
    const key = axis === "os" ? "os" : axis;
    const value = state?.[key];
    if (value != null && value !== "") element.setAttribute(`data-g-${axis}`, String(value));
  }
}

export function readTheme(element) {
  return Object.fromEntries(themeAxes.flatMap((axis) => {
    const value = element?.getAttribute(`data-g-${axis}`);
    return value == null ? [] : [[axis, value]];
  }));
}

export function clearTheme(element) {
  if (element) themeAxes.forEach((axis) => element.removeAttribute(`data-g-${axis}`));
}

export function showToast(options) {
  Gardenerim.toast(options ?? {});
}

export async function bindTauri(root) {
  if (!root) return false;
  await unbindTauri(root);
  const adapter = await import("./gardener.tauri.min.js");
  const binding = adapter.bindTauriWindowControls(root, window.__GARDENER_TAURI__ ?? null);
  tauriBindings.set(root, binding);
  return Boolean(binding.available);
}

export function unbindTauri(root) {
  tauriBindings.get(root)?.destroy?.();
  tauriBindings.delete(root);
}

export async function bindElectron(root) {
  if (!root) return false;
  await unbindElectron(root);
  const adapter = await import("./gardener.electron.min.js");
  const binding = adapter.bindElectronWindowControls(root, window.__GARDENER_ELECTRON__ ?? null);
  electronBindings.set(root, binding);
  return Boolean(binding.available);
}

export function unbindElectron(root) {
  electronBindings.get(root)?.destroy?.();
  electronBindings.delete(root);
}
