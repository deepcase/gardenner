import type angular from "angular";
import { createGardenerimComponent, gardenerimBehaviorDirective, gardenerimProviderDirective } from "./directives.js";
import { componentCatalog } from "./generated/catalog.js";
import { GardenerimRuntimeFactory, GardenerimThemeFactory, GardenerimToastFactory } from "./services.js";
import type { GardenerimAngularJSOptions, GardenerimAngularJSStatic } from "./types.js";

export const GARDENERIM_ANGULARJS_MODULE = "gardener";
type InstalledModule = { module: angular.IModule; signature: string };
const installed = new WeakMap<GardenerimAngularJSStatic, Map<string, InstalledModule>>();

const componentAliases = new Map(componentCatalog.flatMap((definition) => [
  [definition.name, definition.name],
  [definition.exportName, definition.name],
  [definition.directiveName, definition.name],
] as const));

const selectedComponentNames = (components: GardenerimAngularJSOptions["components"]): readonly string[] | null => {
  if (!components) return null;
  const selected = new Set<string>();
  for (const component of components) {
    const name = componentAliases.get(component);
    if (!name) throw new Error(`Unknown Gardenerim AngularJS component: ${component}`);
    selected.add(name);
  }
  return [...selected].sort();
};

const optionSignature = (options: GardenerimAngularJSOptions, components: readonly string[] | null): string => JSON.stringify({
  dependencies: [...(options.dependencies ?? [])],
  components,
  initialize: options.initialize !== false,
  registerProvider: options.registerProvider !== false,
  registerBehaviorDirective: options.registerBehaviorDirective !== false,
});

export const createGardenerimAngularJS = (
  angularInstance: GardenerimAngularJSStatic,
  options: GardenerimAngularJSOptions = {},
): string => {
  const moduleName = options.moduleName || GARDENERIM_ANGULARJS_MODULE;
  const modules = installed.get(angularInstance) ?? new Map<string, InstalledModule>();
  installed.set(angularInstance, modules);
  const selectedNames = selectedComponentNames(options.components);
  const signature = optionSignature(options, selectedNames);
  const existing = modules.get(moduleName);
  if (existing) {
    if (existing.signature !== signature) throw new Error(`Gardenerim AngularJS module ${moduleName} is already installed with different options`);
    return moduleName;
  }

  const module = angularInstance.module(moduleName, [...(options.dependencies ?? [])]);
  module.factory("GardenerimRuntime", GardenerimRuntimeFactory);
  module.factory("GardenerimTheme", GardenerimThemeFactory);
  module.factory("GardenerimToast", GardenerimToastFactory);
  if (options.registerBehaviorDirective !== false) { module.directive("gGardenerim", gardenerimBehaviorDirective); }
  if (options.registerProvider !== false) module.directive("gardenerProvider", gardenerimProviderDirective);

  const selected = selectedNames ? new Set(selectedNames) : null;
  for (const definition of componentCatalog) {
    if (selected && !selected.has(definition.name)) continue;
    module.directive(definition.directiveName, createGardenerimComponent(definition, options.initialize !== false));
  }
  modules.set(moduleName, { module, signature });
  return moduleName;
};
