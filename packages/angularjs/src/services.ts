import { Gardenerim, configure, destroy, emit, getConfiguration, getInstance, init, observe, toast } from "@gardenerim/css/runtime";
import { themeAxes } from "./directives.js";
import type { GardenerimRuntimeService, GardenerimThemeService, GardenerimThemeState } from "./types.js";

export const themeAttributes = (state: GardenerimThemeState = {}): Record<string, string> => Object.fromEntries(
  themeAxes.flatMap((axis) => state[axis] == null || state[axis] === "" ? [] : [[`data-g-${axis}`, String(state[axis])]]),
);

export const GardenerimRuntimeFactory = (): GardenerimRuntimeService => ({
  version: Gardenerim.version,
  init,
  destroy,
  getInstance: (element, behavior) => behavior ? getInstance(element, behavior) : getInstance(element),
  emit,
  observe,
  configure,
  getConfiguration,
});

export const GardenerimThemeFactory = (): GardenerimThemeService => {
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
    })) as GardenerimThemeState,
    clear,
  };
};

export const GardenerimToastFactory = () => ({ show: toast });
