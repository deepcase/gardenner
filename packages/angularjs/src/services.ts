import { Gardener, destroy, emit, getInstance, init, observe, toast } from "@gardener/css/runtime";
import { themeAxes } from "./directives.js";
import type { GardenerRuntimeService, GardenerThemeService, GardenerThemeState } from "./types.js";

export const themeAttributes = (state: GardenerThemeState = {}): Record<string, string> => Object.fromEntries(
  themeAxes.flatMap((axis) => state[axis] == null || state[axis] === "" ? [] : [[`data-g-${axis}`, String(state[axis])]]),
);

export const GardenerRuntimeFactory = (): GardenerRuntimeService => ({
  version: Gardener.version,
  init,
  destroy,
  getInstance: (element, behavior) => behavior ? getInstance(element, behavior) : getInstance(element),
  emit,
  observe,
});

export const GardenerThemeFactory = (): GardenerThemeService => {
  const clear = (target: Element): void => themeAxes.forEach((axis) => target.removeAttribute(`data-g-${axis}`));
  return {
    axes: themeAxes,
    attributes: themeAttributes,
    apply(target, state = {}) {
      clear(target);
      for (const [name, value] of Object.entries(themeAttributes(state))) target.setAttribute(name, value);
    },
    read: (target) => Object.fromEntries(themeAxes.flatMap((axis) => {
      const value = target.getAttribute(`data-g-${axis}`);
      return value == null ? [] : [[axis, value]];
    })) as GardenerThemeState,
    clear,
  };
};

export const GardenerToastFactory = () => ({ show: toast });
