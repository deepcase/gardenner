import type { ObjectDirective } from "vue";
import { destroy, init } from "@gardener/css/runtime";
import { behaviorAttributes, configAttributes } from "./component.js";
import type { GardenerDirectiveOptions, GardenerDirectiveValue } from "./types.js";

const managed = new WeakMap<Element, Set<string>>();
const signatures = new WeakMap<Element, string>();
const normalize = (value: GardenerDirectiveValue): GardenerDirectiveOptions => {
  if (typeof value === "string" || Array.isArray(value)) return { behavior: value as string | readonly string[] };
  return value as GardenerDirectiveOptions;
};

const apply = (element: Element, value: GardenerDirectiveValue): void => {
  for (const attribute of managed.get(element) ?? []) element.removeAttribute(attribute);
  const options = normalize(value);
  const behaviors = Array.isArray(options.behavior) ? options.behavior : [options.behavior];
  const attributes = { ...behaviorAttributes(behaviors), ...configAttributes(options.config) };
  for (const [name, attributeValue] of Object.entries(attributes)) element.setAttribute(name, attributeValue);
  managed.set(element, new Set(Object.keys(attributes)));
  signatures.set(element, JSON.stringify(attributes));
  init(element);
};

export const vGardener: ObjectDirective<Element, GardenerDirectiveValue> = {
  mounted: (element, binding) => apply(element, binding.value),
  updated: (element, binding) => {
    const options = normalize(binding.value);
    const behaviors = Array.isArray(options.behavior) ? options.behavior : [options.behavior];
    const next = JSON.stringify({ ...behaviorAttributes(behaviors), ...configAttributes(options.config) });
    if (next !== signatures.get(element)) { destroy(element); apply(element, binding.value); }
  },
  beforeUnmount: (element) => { destroy(element); managed.delete(element); signatures.delete(element); },
};

export default vGardener;
