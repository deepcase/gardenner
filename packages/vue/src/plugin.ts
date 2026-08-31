import type { App, Plugin } from "vue";
import { init } from "@gardenerim/css/runtime";
import { GardenerimComponent, GardenerimPart } from "./component.js";
import { GardenerimProvider } from "./provider.js";
import { vGardenerim } from "./directives.js";
import { gardenerimComponents } from "./generated/components.js";

export interface GardenerimVueOptions {
  prefix?: string;
  components?: boolean | readonly string[];
  directive?: boolean;
  initialize?: boolean;
}

const registrationName = (exportName: string, prefix: string): string => `${prefix}${exportName.replace(/^G/, "")}`;

export const createGardenerimVue = (defaults: GardenerimVueOptions = {}): Plugin => ({
  install(app: App, options: GardenerimVueOptions = {}) {
    const resolved = { prefix: "G", components: true, directive: true, initialize: true, ...defaults, ...options };
    const selected = resolved.components === true ? null : new Set(resolved.components === false ? [] : resolved.components);
    for (const [name, component] of Object.entries(gardenerimComponents)) {
      if (selected && !selected.has(name) && !selected.has(name.replace(/^G/, ""))) continue;
      app.component(registrationName(name, resolved.prefix), component);
    }
    app.component(`${resolved.prefix}Provider`, GardenerimProvider);
    app.component(`${resolved.prefix}Component`, GardenerimComponent);
    app.component(`${resolved.prefix}Part`, GardenerimPart);
    if (resolved.directive) { app.directive("gardenerim", vGardenerim); }
    if (resolved.initialize && typeof document !== "undefined") queueMicrotask(() => init(document));
  },
});

export const GardenerimVue = createGardenerimVue();
export default GardenerimVue;
