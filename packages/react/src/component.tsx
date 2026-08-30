import { createElement, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ElementType } from "react";
import { destroy, getInstance, init } from "@gardener/css/runtime";
import type { GardenerComponentDefinition, GardenerComponentHandle, GardenerComponentProps, GardenerConfigValue, GardenerGeneratedComponent } from "./types.js";

const list = (value: string | readonly string[] | undefined): string[] => value == null ? [] : Array.isArray(value) ? [...value] : [value as string];
const kebab = (value: string): string => value.replace(/^data-g-/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();

export const configAttributes = (config: Readonly<Record<string, GardenerConfigValue>> | undefined): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const [name, value] of Object.entries(config ?? {})) {
    if (value === false || value == null) continue;
    attributes[`data-g-${kebab(name)}`] = value === true ? "" : String(value);
  }
  return attributes;
};

export const behaviorAttributes = (behaviors: readonly string[]): Record<string, string> =>
  Object.fromEntries(behaviors.map((behavior) => [`data-g-${behavior}`, ""]));

const classes = (...values: unknown[]): string => values.flat(Infinity).filter(Boolean).join(" ");

export const createGardenerComponent = (definition: GardenerComponentDefinition): GardenerGeneratedComponent => {
  const Component = forwardRef<GardenerComponentHandle, GardenerComponentProps>(function GardenerGeneratedComponent(props, forwardedRef) {
    const {
      as,
      variant,
      state,
      config,
      initialize = true,
      value,
      defaultValue,
      valueEvent = "change",
      valueKey = "value",
      onValueChange,
      children,
      className,
      ...nativeProps
    } = props;
    const elementRef = useRef<Element | null>(null);
    const handledNativeEvents = useRef(new WeakSet<Event>());
    const configKey = useMemo(() => JSON.stringify(config ?? {}), [config]);
    const refresh = () => { if (initialize && elementRef.current) init(elementRef.current); };

    useImperativeHandle(forwardedRef, () => ({
      get element() { return elementRef.current; },
      getInstance: (behavior?: string) => elementRef.current ? behavior ? getInstance(elementRef.current, behavior) : getInstance(elementRef.current) : null,
      refresh,
    }), [initialize]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;
      if (initialize) init(element); else destroy(element);
      return () => destroy(element);
    }, [initialize, configKey]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element || !valueEvent || !onValueChange) return;
      const eventName = valueEvent.startsWith("gardener:") ? valueEvent : `gardener:${valueEvent}`;
      const listener = (event: Event) => {
        const detail = (event as CustomEvent<Record<string, unknown>>).detail ?? {};
        onValueChange(detail[valueKey] ?? detail.value ?? detail.values ?? detail.selected, event);
      };
      element.addEventListener(eventName, listener);
      return () => element.removeEventListener(eventName, listener);
    }, [onValueChange, valueEvent, valueKey]);

    const variants = list(variant).map((item) => definition.className ? `${definition.className}-${item}` : item);
    const states = list(state).map((item) => item.startsWith("is-") ? item : `is-${item}`);
    const tag = definition.tag;
    const As = (as ?? tag) as ElementType;
    const isNativeControl = ["input", "textarea", "select"].includes(tag);
    const originalInput = (nativeProps as Record<string, unknown>).onInput as ((event: unknown) => void) | undefined;
    const originalChange = (nativeProps as Record<string, unknown>).onChange as ((event: unknown) => void) | undefined;
    const updateFromNative = (event: unknown) => {
      const nativeEvent = ((event as { nativeEvent?: Event }).nativeEvent ?? event) as Event;
      if (handledNativeEvents.current.has(nativeEvent)) return;
      handledNativeEvents.current.add(nativeEvent);
      const target = (event as { target?: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement }).target;
      const next = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target?.value;
      onValueChange?.(next, nativeEvent);
    };
    const attributes: Record<string, unknown> = {
      ...behaviorAttributes(definition.behaviors),
      ...configAttributes(config),
      ...nativeProps,
      ref: elementRef,
      className: classes(definition.className, variants, states, className),
    };
    if (tag === "button" && attributes.type == null) attributes.type = "button";
    if (isNativeControl) {
      const type = String(attributes.type ?? "");
      if (value !== undefined) {
        if (tag === "input" && type === "checkbox" && typeof value === "boolean") attributes.checked = value;
        else attributes.value = value;
      } else if (defaultValue !== undefined) {
        if (tag === "input" && type === "checkbox" && typeof defaultValue === "boolean") attributes.defaultChecked = defaultValue;
        else attributes.defaultValue = defaultValue;
      }
      attributes.onInput = (event: unknown) => { originalInput?.(event); updateFromNative(event); };
      attributes.onChange = (event: unknown) => { originalChange?.(event); updateFromNative(event); };
    }
    return createElement(As, attributes, tag === "input" ? undefined : children);
  });
  Component.displayName = definition.exportName;
  return Component as GardenerGeneratedComponent;
};

export interface GardenerComponentDynamicProps extends GardenerComponentProps {
  definition: GardenerComponentDefinition;
}

export const GardenerComponent = forwardRef<GardenerComponentHandle, GardenerComponentDynamicProps>(function GardenerComponent({ definition, ...props }, ref) {
  const Implementation = useMemo(() => createGardenerComponent(definition), [definition]);
  return createElement(Implementation, { ...props, ref });
});

export interface GardenerPartProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  name: string;
  as?: ElementType;
  children?: React.ReactNode;
}

export const GardenerPart = forwardRef<HTMLElement, GardenerPartProps>(function GardenerPart({ name, as: As = "div", className, ...props }, ref) {
  return createElement(As, { ...props, ref, className: classes(name.startsWith("g-") ? name : `g-${name}`, className) });
});
