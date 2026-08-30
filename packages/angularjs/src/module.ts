import type angular from "angular";
import { createGardenerComponent, gardenerBehaviorDirective, gardenerProviderDirective } from "./directives.js";
import { componentCatalog } from "./generated/catalog.js";
import { GardenerRuntimeFactory, GardenerThemeFactory, GardenerToastFactory } from "./services.js";
import type { GardenerAngularJSOptions, GardenerAngularJSStatic } from "./types.js";

export const GARDENER_ANGULARJS_MODULE = "gardener";
type InstalledModule = { module: angular.IModule; signature: string };
const installed = new WeakMap<GardenerAngularJSStatic, Map<string, InstalledModule>>();

const componentAliases = new Map(componentCatalog.flatMap((definition) => [
  [definition.name, definition.name],
  [definition.exportName, definition.name],
  [definition.directiveName, definition.name],
] as const));

const selectedComponentNames = (components: GardenerAngularJSOptions["components"]): readonly string[] | null => {
  if (!components) return null;
  const selected = new Set<string>();
  for (const component of components) {
    const name = componentAliases.get(component);
    if (!name) throw new Error(`Unknown Gardener AngularJS component: ${component}`);
    selected.add(name);
  }
  return [...selected].sort();
};

const optionSignature = (options: GardenerAngularJSOptions, components: readonly string[] | null): string => JSON.stringify({
  dependencies: [...(options.dependencies ?? [])],
  components,
  initialize: options.initialize !== false,
  registerProvider: options.registerProvider !== false,
  registerBehaviorDirective: options.registerBehaviorDirective !== false,
});

export const createGardenerAngularJS = (
  angularInstance: GardenerAngularJSStatic,
  options: GardenerAngularJSOptions = {},
): string => {
  const moduleName = options.moduleName || GARDENER_ANGULARJS_MODULE;
  const modules = installed.get(angularInstance) ?? new Map<string, InstalledModule>();
  installed.set(angularInstance, modules);
  const selectedNames = selectedComponentNames(options.components);
  const signature = optionSignature(options, selectedNames);
  const existing = modules.get(moduleName);
  if (existing) {
    if (existing.signature !== signature) throw new Error(`Gardener AngularJS module ${moduleName} is already installed with different options`);
    return moduleName;
  }

  const module = angularInstance.module(moduleName, [...(options.dependencies ?? [])]);
  module.factory("GardenerRuntime", GardenerRuntimeFactory);
  module.factory("GardenerTheme", GardenerThemeFactory);
  module.factory("GardenerToast", GardenerToastFactory);
  if (options.registerBehaviorDirective !== false) module.directive("gGardener", gardenerBehaviorDirective);
  if (options.registerProvider !== false) module.directive("gardenerProvider", gardenerProviderDirective);

  const selected = selectedNames ? new Set(selectedNames) : null;
  for (const definition of componentCatalog) {
    if (selected && !selected.has(definition.name)) continue;
    module.directive(definition.directiveName, createGardenerComponent(definition, options.initialize !== false));
  }
  modules.set(moduleName, { module, signature });
  return moduleName;
};
