import { nextTick, onBeforeUnmount, onMounted, reactive, readonly, shallowRef, unref, watch, type Ref } from "vue";
import { Gardenerim, configure, destroy, getConfiguration, getInstance, init, toast, type GardenerimConfigureOptions } from "@gardenerim/css/runtime";
import { themeAttributes } from "./provider.js";
import type { GardenerimBehaviorInstance, GardenerimBehaviorName, GardenerimComponentPublicInstance, GardenerimElementTarget, GardenerimEventHandler, GardenerimThemeState, GardenerimTargetValue } from "./types.js";

const resolveTarget = (target: GardenerimElementTarget): Element | Document | null => {
  const value = target && typeof target === "object" && "value" in target ? unref(target as Ref<GardenerimTargetValue | null | undefined>) : target;
  const exposedElement = value && typeof value === "object" && "element" in value ? (value as GardenerimComponentPublicInstance).element : null;
  if (typeof Element !== "undefined" && exposedElement instanceof Element) return exposedElement;
  const isElement = typeof Element !== "undefined" && value instanceof Element;
  const isDocument = typeof Document !== "undefined" && value instanceof Document;
  return isElement || isDocument ? value as Element | Document : null;
};

export const useGardenerim = (target?: GardenerimElementTarget) => {
  const refresh = async () => {
    await nextTick();
    const root = resolveTarget(target) ?? (target === undefined && typeof document !== "undefined" ? document : null);
    if (root) init(root);
    return Gardenerim;
  };
  onMounted(refresh);
  onBeforeUnmount(() => { const root = resolveTarget(target); if (root) destroy(root); });
  return { Gardenerim, refresh, destroy: () => { const root = resolveTarget(target); if (root) destroy(root); } } as const;
};

export const useGardenerimBehavior = <T extends GardenerimBehaviorInstance = GardenerimBehaviorInstance>(target: Ref<Element | GardenerimComponentPublicInstance | null | undefined>, behavior: GardenerimBehaviorName | string) => {
  const instance = shallowRef<T | null>(null);
  let current: Element | null = null;
  const refresh = async () => {
    await nextTick();
    const resolved = resolveTarget(target);
    const element = resolved instanceof Element ? resolved : null;
    if (current && current !== element) destroy(current);
    current = element;
    if (element) {
      init(element);
      instance.value = getInstance(element, behavior) as T | null;
    }
    return instance.value;
  };
  onMounted(refresh);
  watch(target, refresh, { flush: "post" });
  onBeforeUnmount(() => { if (current) destroy(current); current = null; instance.value = null; });
  return { instance: readonly(instance), refresh } as const;
};

export const useGardenerimEvent = <T = Record<string, unknown>>(target: Ref<EventTarget | GardenerimComponentPublicInstance | null | undefined>, name: string, handler: GardenerimEventHandler<T>) => {
  const eventName = name.startsWith("gardener:") ? name : `gardener:${name}`;
  let current: EventTarget | null = null;
  const stop = () => { current?.removeEventListener(eventName, handler as EventListener); current = null; };
  const start = () => {
    stop();
    const value = target.value;
    current = value && typeof value === "object" && "element" in value ? value.element : value ?? null;
    current?.addEventListener(eventName, handler as EventListener);
  };
  onMounted(start);
  watch(target, start);
  onBeforeUnmount(stop);
  return { start, stop } as const;
};

export const useGardenerimTheme = (initial: GardenerimThemeState = {}, target?: Ref<Element | GardenerimComponentPublicInstance | null | undefined>) => {
  const state = reactive<GardenerimThemeState>({ ...initial });
  const attributes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"] as const;
  let current: Element | null = null;
  let original = new Map<string, string | null>();
  const restore = () => {
    if (!current) return;
    for (const axis of attributes) {
      const name = `data-g-${axis}`;
      const value = original.get(name);
      if (value == null) current.removeAttribute(name); else current.setAttribute(name, value);
    }
    current = null;
    original = new Map();
  };
  const apply = () => {
    const resolved = target ? resolveTarget(target) : typeof document === "undefined" ? null : document.documentElement;
    const element = resolved instanceof Element ? resolved : null;
    if (!element) return;
    if (current !== element) {
      restore();
      current = element;
      original = new Map(attributes.map((axis) => { const name = `data-g-${axis}`; return [name, element.getAttribute(name)]; }));
    }
    for (const axis of attributes) element.removeAttribute(`data-g-${axis}`);
    for (const [name, value] of Object.entries(themeAttributes(state))) element.setAttribute(name, value);
  };
  onMounted(apply);
  watch(state, apply, { deep: true });
  if (target) watch(target, apply, { flush: "post" });
  onBeforeUnmount(restore);
  return { state, apply } as const;
};

export const useGardenerimToast = () => ({ show: toast });

export const useGardenerimLocale = () => ({
  get configuration() { return getConfiguration(); },
  configure: (options: GardenerimConfigureOptions) => configure(options),
});
