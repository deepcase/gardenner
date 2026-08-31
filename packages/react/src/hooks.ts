import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { Gardenerim, destroy, getInstance, init, toast } from "@gardenerim/css/runtime";
import { themeAttributes, themeAxes } from "./provider.js";
import type { GardenerimBehaviorInstance, GardenerimBehaviorName, GardenerimComponentHandle, GardenerimElementTarget, GardenerimEventHandler, GardenerimThemeState } from "./types.js";

export const resolveGardenerimTarget = (target?: GardenerimElementTarget): Element | Document | null => {
  const value = target && typeof target === "object" && "current" in target ? target.current : target;
  const exposed = value && typeof value === "object" && "element" in value ? (value as GardenerimComponentHandle).element : value;
  if (typeof Element !== "undefined" && exposed instanceof Element) return exposed;
  if (typeof Document !== "undefined" && exposed instanceof Document) return exposed;
  return null;
};

export const useGardenerim = (target?: GardenerimElementTarget) => {
  const refresh = useCallback(() => {
    const root = resolveGardenerimTarget(target) ?? (target === undefined && typeof document !== "undefined" ? document : null);
    if (root) init(root);
    return Gardenerim;
  }, [target]);
  useEffect(() => { refresh(); return () => { const root = resolveGardenerimTarget(target); if (root) destroy(root); }; }, [refresh, target]);
  return { Gardenerim, refresh, destroy: () => { const root = resolveGardenerimTarget(target); if (root) destroy(root); } } as const;
};

export const useGardenerimBehavior = <T extends GardenerimBehaviorInstance = GardenerimBehaviorInstance>(target: RefObject<Element | GardenerimComponentHandle | null>, behavior: GardenerimBehaviorName | string) => {
  const [instance, setInstance] = useState<T | null>(null);
  const current = useRef<Element | null>(null);
  const refresh = useCallback(() => {
    const resolved = resolveGardenerimTarget(target);
    const element = typeof Element !== "undefined" && resolved instanceof Element ? resolved : null;
    if (current.current && current.current !== element) destroy(current.current);
    current.current = element;
    if (!element) { setInstance(null); return null; }
    init(element);
    const next = getInstance(element, behavior) as T | null;
    setInstance(next);
    return next;
  }, [behavior, target]);
  useEffect(() => { refresh(); return () => { if (current.current) destroy(current.current); current.current = null; }; }, [refresh]);
  return { instance, refresh } as const;
};

export const useGardenerimEvent = <T = Record<string, unknown>>(target: RefObject<EventTarget | GardenerimComponentHandle | null>, name: string, handler: GardenerimEventHandler<T>) => {
  const eventName = name.startsWith("gardener:") ? name : `gardener:${name}`;
  useEffect(() => {
    const value = target.current;
    const current = value && typeof value === "object" && "element" in value ? value.element : value;
    current?.addEventListener(eventName, handler as EventListener);
    return () => current?.removeEventListener(eventName, handler as EventListener);
  }, [eventName, handler, target]);
};

export const useGardenerimTheme = (initial: GardenerimThemeState = {}, target?: RefObject<Element | GardenerimComponentHandle | null>): {
  state: GardenerimThemeState;
  setState: Dispatch<SetStateAction<GardenerimThemeState>>;
  apply: () => void;
} => {
  const [state, setState] = useState<GardenerimThemeState>(initial);
  const original = useRef(new Map<string, string | null>());
  const current = useRef<Element | null>(null);
  const apply = useCallback(() => {
    const resolved = target ? resolveGardenerimTarget(target) : typeof document === "undefined" ? null : document.documentElement;
    const element = typeof Element !== "undefined" && resolved instanceof Element ? resolved : null;
    if (!element) return;
    if (current.current !== element) {
      current.current = element;
      original.current = new Map(themeAxes.map((axis) => { const name = `data-g-${axis}`; return [name, element.getAttribute(name)]; }));
    }
    for (const axis of themeAxes) element.removeAttribute(`data-g-${axis}`);
    for (const [name, value] of Object.entries(themeAttributes(state))) element.setAttribute(name, value);
  }, [state, target]);
  useEffect(() => {
    apply();
    return () => {
      if (!current.current) return;
      for (const axis of themeAxes) {
        const name = `data-g-${axis}`;
        const value = original.current.get(name);
        if (value == null) current.current.removeAttribute(name); else current.current.setAttribute(name, value);
      }
    };
  }, [apply]);
  return { state, setState, apply };
};

export const useGardenerimToast = () => ({ show: toast });
