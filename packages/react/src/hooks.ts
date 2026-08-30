import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import { Gardener, destroy, getInstance, init, toast } from "@gardener/css/runtime";
import { themeAttributes, themeAxes } from "./provider.js";
import type { GardenerBehaviorInstance, GardenerBehaviorName, GardenerComponentHandle, GardenerElementTarget, GardenerEventHandler, GardenerThemeState } from "./types.js";

export const resolveGardenerTarget = (target?: GardenerElementTarget): Element | Document | null => {
  const value = target && typeof target === "object" && "current" in target ? target.current : target;
  const exposed = value && typeof value === "object" && "element" in value ? (value as GardenerComponentHandle).element : value;
  if (typeof Element !== "undefined" && exposed instanceof Element) return exposed;
  if (typeof Document !== "undefined" && exposed instanceof Document) return exposed;
  return null;
};

export const useGardener = (target?: GardenerElementTarget) => {
  const refresh = useCallback(() => {
    const root = resolveGardenerTarget(target) ?? (target === undefined && typeof document !== "undefined" ? document : null);
    if (root) init(root);
    return Gardener;
  }, [target]);
  useEffect(() => { refresh(); return () => { const root = resolveGardenerTarget(target); if (root) destroy(root); }; }, [refresh, target]);
  return { Gardener, refresh, destroy: () => { const root = resolveGardenerTarget(target); if (root) destroy(root); } } as const;
};

export const useGardenerBehavior = <T extends GardenerBehaviorInstance = GardenerBehaviorInstance>(target: RefObject<Element | GardenerComponentHandle | null>, behavior: GardenerBehaviorName | string) => {
  const [instance, setInstance] = useState<T | null>(null);
  const current = useRef<Element | null>(null);
  const refresh = useCallback(() => {
    const resolved = resolveGardenerTarget(target);
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

export const useGardenerEvent = <T = Record<string, unknown>>(target: RefObject<EventTarget | GardenerComponentHandle | null>, name: string, handler: GardenerEventHandler<T>) => {
  const eventName = name.startsWith("gardener:") ? name : `gardener:${name}`;
  useEffect(() => {
    const value = target.current;
    const current = value && typeof value === "object" && "element" in value ? value.element : value;
    current?.addEventListener(eventName, handler as EventListener);
    return () => current?.removeEventListener(eventName, handler as EventListener);
  }, [eventName, handler, target]);
};

export const useGardenerTheme = (initial: GardenerThemeState = {}, target?: RefObject<Element | GardenerComponentHandle | null>): {
  state: GardenerThemeState;
  setState: Dispatch<SetStateAction<GardenerThemeState>>;
  apply: () => void;
} => {
  const [state, setState] = useState<GardenerThemeState>(initial);
  const original = useRef(new Map<string, string | null>());
  const current = useRef<Element | null>(null);
  const apply = useCallback(() => {
    const resolved = target ? resolveGardenerTarget(target) : typeof document === "undefined" ? null : document.documentElement;
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

export const useGardenerToast = () => ({ show: toast });
