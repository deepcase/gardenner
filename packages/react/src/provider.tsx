import { createContext, createElement, forwardRef, useContext, useEffect, useMemo, useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { configure, destroy, init } from "@gardenerim/css/runtime";
import type { GardenerimThemeState } from "./types.js";

export const themeAxes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"] as const;

export const themeAttributes = (state: GardenerimThemeState): Record<string, string> => Object.fromEntries(
  themeAxes.flatMap((axis) => state[axis] == null || state[axis] === "" ? [] : [[`data-g-${axis}`, String(state[axis])]]),
);

export const GardenerimThemeContext = createContext<Readonly<GardenerimThemeState>>({});

export interface GardenerimProviderProps extends GardenerimThemeState, Omit<HTMLAttributes<HTMLElement>, keyof GardenerimThemeState | "children" | "locale"> {
  as?: ElementType;
  initialize?: boolean;
  className?: string;
  children?: ReactNode;
  locale?: string | readonly string[];
  messages?: Readonly<Record<string, string>>;
}

export const GardenerimProvider = forwardRef<HTMLElement, GardenerimProviderProps>(function GardenerimProvider({
  as: As = "div", initialize = true, className, children, locale, messages, theme, mode, neutral, typography, shape, density, elevation, motion, platform, os, ...nativeProps
}, forwardedRef) {
  const localRef = useRef<HTMLElement | null>(null);
  const state = useMemo(() => Object.fromEntries(
    Object.entries({ theme, mode, neutral, typography, shape, density, elevation, motion, platform, os }).filter(([, value]) => value !== undefined),
  ) as GardenerimThemeState, [theme, mode, neutral, typography, shape, density, elevation, motion, platform, os]);
  const assignRef = (element: HTMLElement | null) => {
    localRef.current = element;
    if (typeof forwardedRef === "function") forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  useEffect(() => {
    const element = localRef.current;
    if (!element) return;
    if (locale || messages) configure({
      ...(locale ? { locale } : {}),
      ...(messages ? { messages } : {}),
      root: element,
    });
    if (initialize) init(element); else destroy(element);
    return () => destroy(element);
  }, [initialize, locale, messages]);
  return createElement(GardenerimThemeContext.Provider, { value: state }, createElement(As, { ...themeAttributes(state), ...nativeProps, className, ref: assignRef }, children));
});

export const useGardenerimThemeContext = (): Readonly<GardenerimThemeState> => useContext(GardenerimThemeContext);
