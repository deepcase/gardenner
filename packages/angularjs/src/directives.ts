import type angular from "angular";
import { destroy, getInstance, init } from "@gardenerim/css/runtime";
import type {
  GardenerimAngularJSDirectiveFactory,
  GardenerimComponentDefinition,
  GardenerimComponentHandle,
  GardenerimConfigValue,
  GardenerimThemeAxis,
} from "./types.js";

const splitList = (value?: string): string[] => (value ?? "").split(/[\s,]+/u).map((item) => item.trim()).filter(Boolean);
const kebab = (value: string): string => value.replace(/^data-g-/u, "").replace(/([a-z0-9])([A-Z])/gu, "$1-$2").replace(/[\s_]+/gu, "-").toLowerCase();
const eventName = (value?: string): string => {
  const name = value || "change";
  return name.startsWith("gardener:") ? name : `gardener:${name}`;
};

export const configAttributes = (config?: Readonly<Record<string, GardenerimConfigValue>>): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const [name, value] of Object.entries(config ?? {})) {
    if (value === false || value == null) continue;
    attributes[`data-g-${kebab(name)}`] = value === true ? "" : String(value);
  }
  return attributes;
};

export const behaviorAttributes = (behaviors: readonly string[]): Record<string, string> =>
  Object.fromEntries(behaviors.map((behavior) => [`data-g-${behavior}`, ""]));

const replaceClasses = (element: Element, previous: string[], next: string[]): string[] => {
  previous.forEach((name) => element.classList.remove(name));
  next.forEach((name) => element.classList.add(name));
  return next;
};

const applyConfig = (element: Element, previous: string[], config: unknown): string[] => {
  previous.forEach((name) => element.removeAttribute(name));
  if (!config || typeof config !== "object" || Array.isArray(config)) return [];
  const attributes = configAttributes(config as Record<string, GardenerimConfigValue>);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return Object.keys(attributes);
};

const nativeValue = (element: Element): unknown => {
  if (element instanceof HTMLInputElement && element.type === "checkbox") return element.checked;
  if (element instanceof HTMLInputElement && element.type === "radio") return element.checked ? element.value : undefined;
  if (element instanceof HTMLSelectElement && element.multiple) return Array.from(element.selectedOptions, (option) => option.value);
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) return element.value;
  return undefined;
};

export const createGardenerimComponent = (
  definition: GardenerimComponentDefinition,
  initializeByDefault = true,
): GardenerimAngularJSDirectiveFactory => {
  const factory: GardenerimAngularJSDirectiveFactory = () => ({
    restrict: "EA",
    require: "?ngModel",
    link(scope: angular.IScope, jqElement: angular.IAugmentedJQuery, attrs: angular.IAttributes, ngModel?: angular.INgModelController | null) {
      const element = jqElement[0];
      if (!(element instanceof Element)) return;
      if (definition.className) element.classList.add(definition.className);
      if (element instanceof HTMLButtonElement && !element.hasAttribute("type")) element.type = "button";

      let variantClasses: string[] = [];
      let stateClasses: string[] = [];
      let configNames: string[] = [];
      const behaviorValues = new Map(Object.keys(behaviorAttributes(definition.behaviors)).map((name) => [name, element.getAttribute(name)]));
      let shouldInitialize = attrs.gardenerInitialize == null
        ? initializeByDefault
        : scope.$eval(attrs.gardenerInitialize) !== false;
      const applyBehaviorState = (): void => {
        for (const [name, originalValue] of behaviorValues) {
          if (shouldInitialize) {
            if (!element.hasAttribute(name)) element.setAttribute(name, originalValue ?? "");
          } else {
            if (element.hasAttribute(name)) behaviorValues.set(name, element.getAttribute(name));
            element.removeAttribute(name);
          }
        }
      };
      const refresh = (): void => {
        destroy(element);
        applyBehaviorState();
        if (shouldInitialize) init(element);
      };
      const handle: GardenerimComponentHandle = {
        element,
        getInstance: (behavior?: string) => behavior ? getInstance(element, behavior) : getInstance(element),
        refresh,
        destroy: () => destroy(element),
      };
      jqElement.data("$gardenerHandle", handle);

      attrs.$observe("gardenerVariant", (value) => {
        variantClasses = replaceClasses(element, variantClasses, splitList(typeof value === "string" ? value : undefined).map((item) => definition.className ? `${definition.className}-${item}` : item));
      });
      attrs.$observe("gardenerState", (value) => {
        stateClasses = replaceClasses(element, stateClasses, splitList(typeof value === "string" ? value : undefined).map((item) => item.startsWith("is-") ? item : `is-${item}`));
      });
      if (attrs.gardenerConfig) scope.$watch(attrs.gardenerConfig, (value) => {
        configNames = applyConfig(element, configNames, value);
        refresh();
      }, true);
      if (attrs.gardenerInitialize != null) scope.$watch(attrs.gardenerInitialize, (value) => {
        shouldInitialize = value !== false;
        refresh();
      });

      if (ngModel) {
        const isNativeControl = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement;
        if (isNativeControl && attrs.gardenerOnValueChange) {
          const nativeEvent = element instanceof HTMLSelectElement || (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) ? "change" : "input";
          const update = (event: Event) => scope.$evalAsync(() => scope.$eval(attrs.gardenerOnValueChange, { $value: nativeValue(element), $event: event }));
          element.addEventListener(nativeEvent, update);
          scope.$on("$destroy", () => element.removeEventListener(nativeEvent, update));
        }
      } else if (attrs.gardenerOnValueChange && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)) {
        const nativeEvent = element instanceof HTMLSelectElement || (element instanceof HTMLInputElement && ["checkbox", "radio"].includes(element.type)) ? "change" : "input";
        const update = (event: Event) => scope.$evalAsync(() => scope.$eval(attrs.gardenerOnValueChange, { $value: nativeValue(element), $event: event }));
        element.addEventListener(nativeEvent, update);
        scope.$on("$destroy", () => element.removeEventListener(nativeEvent, update));
      }

      if (ngModel || attrs.gardenerOnValueChange) {
        const customEvent = eventName(attrs.gardenerValueEvent);
        const customUpdate = (event: Event) => scope.$evalAsync(() => {
          const detail = (event as CustomEvent<Record<string, unknown>>).detail ?? {};
          const key = attrs.gardenerValueKey || "value";
          const value = detail[key] ?? detail.value ?? detail.values ?? detail.selected;
          ngModel?.$setViewValue(value, customEvent);
          if (attrs.gardenerOnValueChange) scope.$eval(attrs.gardenerOnValueChange, { $value: value, $event: event });
        });
        element.addEventListener(customEvent, customUpdate);
        scope.$on("$destroy", () => element.removeEventListener(customEvent, customUpdate));
      }

      scope.$evalAsync(refresh);
      scope.$on("$destroy", () => {
        destroy(element);
        jqElement.removeData("$gardenerHandle");
      });
    },
  });
  factory.$inject = [];
  return factory;
};

export const gardenerimBehaviorDirective: GardenerimAngularJSDirectiveFactory = () => ({
  restrict: "A",
  link(scope, jqElement, attrs) {
    const element = jqElement[0];
    if (!(element instanceof Element)) return;
    let currentAttribute: string | null = null;
    attrs.$observe("gGardenerim", (value) => {
      if (currentAttribute) element.removeAttribute(currentAttribute);
      destroy(element);
      const behavior = typeof value === "string" ? value : attrs.gardenerBehavior;
      currentAttribute = behavior ? `data-g-${kebab(String(behavior))}` : null;
      if (currentAttribute) element.setAttribute(currentAttribute, "");
      scope.$evalAsync(() => init(element));
    });
    scope.$on("$destroy", () => destroy(element));
  },
});
gardenerimBehaviorDirective.$inject = [];

export const themeAxes: readonly GardenerimThemeAxis[] = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];

export const gardenerimProviderDirective: GardenerimAngularJSDirectiveFactory = () => ({
  restrict: "EA",
  link(scope, jqElement, attrs) {
    const element = jqElement[0];
    if (!(element instanceof Element)) return;
    for (const axis of themeAxes) {
      const normalized = `gardener${axis[0].toUpperCase()}${axis.slice(1)}`;
      attrs.$observe(normalized, (value) => {
        const name = `data-g-${axis}`;
        if (value == null || value === "") element.removeAttribute(name); else element.setAttribute(name, String(value));
      });
    }
    scope.$evalAsync(() => init(element));
    scope.$on("$destroy", () => destroy(element));
  },
});
gardenerimProviderDirective.$inject = [];
