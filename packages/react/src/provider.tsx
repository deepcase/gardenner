import { createContext, createElement, forwardRef, useContext, useEffect, useMemo, useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { destroy, init } from "@gardenerim/css/runtime";
import type { GardenerThemeState } from "./types.js";

export const themeAxes = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"] as const;

export const themeAttributes = (state: GardenerThemeState): Record<string, string> => Object.fromEntries(
  themeAxes.flatMap((axis) => state[axis] == null || state[axis] === "" ? [] : [[`data-g-${axis}`, String(state[axis])]]),
);

export const GardenerThemeContext = createContext<Readonly<GardenerThemeState>>({});

export interface GardenerProviderProps extends GardenerThemeState, Omit<HTMLAttributes<HTMLElement>, keyof GardenerThemeState | "children"> {
  as?: ElementType;
  initialize?: boolean;
  className?: string;
  children?: ReactNode;
}

export const GardenerProvider = forwardRef<HTMLElement, GardenerProviderProps>(function GardenerProvider({
  as: As = "div", initialize = true, className, children, theme, mode, neutral, typography, shape, density, elevation, motion, platform, os, ...nativeProps
}, forwardedRef) {
  const localRef = useRef<HTMLElement | null>(null);
  const state = useMemo(() => Object.fromEntries(
    Object.entries({ theme, mode, neutral, typography, shape, density, elevation, motion, platform, os }).filter(([, value]) => value !== undefined),
  ) as GardenerThemeState, [theme, mode, neutral, typography, shape, density, elevation, motion, platform, os]);
  const assignRef = (element: HTMLElement | null) => {
    localRef.current = element;
    if (typeof forwardedRef === "function") forwardedRef(element);
    else if (forwardedRef) forwardedRef.current = element;
  };
  useEffect(() => {
    const element = localRef.current;
    if (!element) return;
    if (initialize) init(element); else destroy(element);
    return () => destroy(element);
  }, [initialize]);
  return createElement(GardenerThemeContext.Provider, { value: state }, createElement(As, { ...themeAttributes(state), ...nativeProps, className, ref: assignRef }, children));
});

export const useGardenerThemeContext = (): Readonly<GardenerThemeState> => useContext(GardenerThemeContext);
