import { createElement, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, type ElementType } from "react";
import { destroy, getInstance, init } from "@gardenerim/css/runtime";
import type { GardenerimComponentDefinition, GardenerimComponentHandle, GardenerimComponentProps, GardenerimConfigValue, GardenerimGeneratedComponent } from "./types.js";
import { Table } from './table.js';
import { Navigation } from './navigation.js';

const list = (value: string | readonly string[] | undefined): string[] => value == null ? [] : Array.isArray(value) ? [...value] : [value as string];
const kebab = (value: string): string => value.replace(/^data-g-/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();

export const configAttributes = (config: Readonly<Record<string, GardenerimConfigValue>> | undefined): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const [name, value] of Object.entries(config ?? {})) {
    if (value == null || value === false && !kebab(name).startsWith("form-") && !kebab(name).startsWith("overlay-") && !kebab(name).startsWith("disclosure-") && !kebab(name).startsWith("data-") && !kebab(name).startsWith("dashboard-") && !kebab(name).startsWith("interaction-") && !kebab(name).startsWith("content-") && !kebab(name).startsWith("layout-") && !kebab(name).startsWith("help-") && !kebab(name).startsWith("ai-") && !kebab(name).startsWith("media-") && !kebab(name).startsWith("auth-") && !kebab(name).startsWith("mobile-") && !kebab(name).startsWith("workflow-") && !kebab(name).startsWith("communication-") && !kebab(name).startsWith("solution-") && !kebab(name).startsWith("legal-") && !kebab(name).startsWith("desktop-") && !kebab(name).startsWith("enterprise-") && !kebab(name).startsWith("marketing-") && !kebab(name).startsWith("cms-") && !kebab(name).startsWith("commerce-")) continue;
    attributes[`data-g-${kebab(name)}`] = value === true && !kebab(name).startsWith("form-") && !kebab(name).startsWith("data-") && !kebab(name).startsWith("dashboard-") && !kebab(name).startsWith("interaction-") && !kebab(name).startsWith("content-") && !kebab(name).startsWith("layout-") && !kebab(name).startsWith("help-") && !kebab(name).startsWith("ai-") && !kebab(name).startsWith("media-") && !kebab(name).startsWith("auth-") && !kebab(name).startsWith("mobile-") && !kebab(name).startsWith("workflow-") && !kebab(name).startsWith("communication-") && !kebab(name).startsWith("solution-") && !kebab(name).startsWith("legal-") && !kebab(name).startsWith("desktop-") && !kebab(name).startsWith("enterprise-") && !kebab(name).startsWith("marketing-") && !kebab(name).startsWith("cms-") && !kebab(name).startsWith("commerce-") ? "" : String(value);
  }
  return attributes;
};

export const behaviorAttributes = (behaviors: readonly string[]): Record<string, string> =>
  Object.fromEntries(behaviors.map((behavior) => [`data-g-${behavior}`, ""]));

const classes = (...values: unknown[]): string => values.flat(Infinity).filter(Boolean).join(" ");

export const createGardenerimComponent = (definition: GardenerimComponentDefinition): GardenerimGeneratedComponent => {
  const Component = forwardRef<GardenerimComponentHandle, GardenerimComponentProps>(function GardenerimGeneratedComponent(props, forwardedRef) {
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
    }, [initialize, ((['tabs','tag'].includes(definition.name)||definition.behaviors.includes('foundation')) && Object.keys(config ?? {}).some(key => kebab(key) === `${definition.behaviors.includes('foundation')?'foundation':definition.name}-options`) || ["form", "overlay", "disclosure", "data", "dashboard"].includes(definition.category) || ["interaction", "content", "layout", "help", "ai", "media", "auth", "mobile", "workflow", "communication", "solution", "legal", "desktop", "enterprise", "marketing", "cms", "marketing", "commerce"].includes(definition.category) && Object.keys(config ?? {}).some(key => kebab(key) === `${definition.category}-options`)) ? "observed" : configKey]);

    useEffect(() => {
      const element = elementRef.current;
      if (!element || !valueEvent || !onValueChange) return;
      const eventName = valueEvent.startsWith("gardener:") ? valueEvent : `gardener:${valueEvent}`;
      const listener = (event: Event) => {
        if ((["tabs","tag"].includes(definition.name) || ["overlay", "disclosure", "data", "dashboard", "interaction", "content", "layout", "help", "ai", "media", "auth", "mobile", "workflow", "communication", "solution", "legal", "desktop", "enterprise", "marketing", "cms", "marketing", "commerce"].includes(definition.category)) && event.target !== element) return;
        const detail = (event as CustomEvent<Record<string, unknown>>).detail ?? {};
        onValueChange(detail[valueKey] ?? detail.value ?? detail.values ?? detail.selected, event);
      };
      element.addEventListener(eventName, listener);
      return () => element.removeEventListener(eventName, listener);
    }, [onValueChange, valueEvent, valueKey]);

    useEffect(() => { if (initialize && elementRef.current?.matches('input,textarea,select')) init(elementRef.current); }, [value, initialize]);
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
      const next = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked
        : target instanceof HTMLSelectElement && target.multiple ? Array.from(target.selectedOptions, (option) => option.value)
        : target?.value;
      onValueChange?.(next, nativeEvent);
    };
    const attributes: Record<string, unknown> = {
      ...behaviorAttributes(definition.behaviors),
      ...configAttributes(config),
      ...nativeProps,
      ref: elementRef,
      className: classes(definition.className, variants, states, className),
    };
    if (As === "button" && attributes.type == null) attributes.type = "button";
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
  if(definition.name==='table'){
    const TableComponent=forwardRef<GardenerimComponentHandle,GardenerimComponentProps>((props,ref)=>props.table!==undefined||props.columns!==undefined?createElement(Table,{...props,ref}):createElement(Component,{...props,ref}));
    TableComponent.displayName=definition.exportName;return TableComponent as GardenerimGeneratedComponent;
  }
  if(definition.category==='navigation'){
    const NavigationComponent=forwardRef<GardenerimComponentHandle,GardenerimComponentProps>((props,ref)=>
      props.items!==undefined||props.navigation!==undefined?createElement(Navigation,{...props,definition,ref}):createElement(Component,{...props,ref}));
    NavigationComponent.displayName=definition.exportName;
    return NavigationComponent as GardenerimGeneratedComponent;
  }
  return Component as GardenerimGeneratedComponent;
};

export interface GardenerimComponentDynamicProps extends GardenerimComponentProps {
  definition: GardenerimComponentDefinition;
}

export const GardenerimComponent = forwardRef<GardenerimComponentHandle, GardenerimComponentDynamicProps>(function GardenerimComponent({ definition, ...props }, ref) {
  const Implementation = useMemo(() => createGardenerimComponent(definition), [definition]);
  return createElement(Implementation, { ...props, ref });
});

export interface GardenerimPartProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  name: string;
  as?: ElementType;
  children?: React.ReactNode;
}

export const GardenerimPart = forwardRef<HTMLElement, GardenerimPartProps>(function GardenerimPart({ name, as: As = "div", className, ...props }, ref) {
  return createElement(As, { ...props, ref, className: classes(name.startsWith("g-") ? name : `g-${name}`, className) });
});
