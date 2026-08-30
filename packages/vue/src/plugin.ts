import type { App, Plugin } from "vue";
import { init } from "@gardener/css/runtime";
import { GardenerComponent, GardenerPart } from "./component.js";
import { GardenerProvider } from "./provider.js";
import { vGardener } from "./directives.js";
import { gardenerComponents } from "./generated/components.js";

export interface GardenerVueOptions {
  prefix?: string;
  components?: boolean | readonly string[];
  directive?: boolean;
  initialize?: boolean;
}

const registrationName = (exportName: string, prefix: string): string => `${prefix}${exportName.replace(/^G/, "")}`;

export const createGardenerVue = (defaults: GardenerVueOptions = {}): Plugin => ({
  install(app: App, options: GardenerVueOptions = {}) {
    const resolved = { prefix: "G", components: true, directive: true, initialize: true, ...defaults, ...options };
    const selected = resolved.components === true ? null : new Set(resolved.components === false ? [] : resolved.components);
    for (const [name, component] of Object.entries(gardenerComponents)) {
      if (selected && !selected.has(name) && !selected.has(name.replace(/^G/, ""))) continue;
      app.component(registrationName(name, resolved.prefix), component);
    }
    app.component(`${resolved.prefix}Provider`, GardenerProvider);
    app.component(`${resolved.prefix}Component`, GardenerComponent);
    app.component(`${resolved.prefix}Part`, GardenerPart);
    if (resolved.directive) app.directive("gardener", vGardener);
    if (resolved.initialize && typeof document !== "undefined") queueMicrotask(() => init(document));
  },
});

export const GardenerVue = createGardenerVue();
export default GardenerVue;
