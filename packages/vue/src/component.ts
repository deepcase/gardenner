import { computed, defineComponent, getCurrentInstance, h, nextTick, onBeforeUnmount, onMounted, ref, watch, withDirectives, vModelText, vModelCheckbox, vModelRadio, vModelSelect, type Component, type PropType } from "vue";
import { destroy, getInstance, init } from "@gardenerim/css/runtime";
import type { GardenerimComponentDefinition, GardenerimComponentPublicInstance, GardenerimConfigValue } from "./types.js";

const list = (value: string | readonly string[] | undefined): string[] => value == null ? [] : Array.isArray(value) ? [...value] : [value as string];
const kebab = (value: string): string => value.replace(/^data-g-/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase();

export const configAttributes = (config: Readonly<Record<string, GardenerimConfigValue>> | undefined): Record<string, string> => {
  const attributes: Record<string, string> = {};
  for (const [name, value] of Object.entries(config ?? {})) {
    if (value === false || value == null) continue;
    attributes[`data-g-${kebab(name)}`] = value === true ? "" : String(value);
  }
  return attributes;
};

export const behaviorAttributes = (behaviors: readonly string[]): Record<string, string> =>
  Object.fromEntries(behaviors.map((behavior) => [`data-g-${behavior}`, ""]));

export const createGardenerimComponent = (definition: GardenerimComponentDefinition) => defineComponent({
  name: definition.exportName,
  inheritAttrs: false,
  props: {
    as: { type: [String, Object, Function] as PropType<string | Component>, default: definition.tag },
    variant: { type: [String, Array] as PropType<string | readonly string[]>, default: undefined },
    state: { type: [String, Array] as PropType<string | readonly string[]>, default: undefined },
    config: { type: Object as PropType<Readonly<Record<string, GardenerimConfigValue>>>, default: undefined },
    initialize: { type: Boolean, default: true },
    modelValue: null as unknown as PropType<unknown>,
    modelEvent: { type: String, default: "change" },
    modelKey: { type: String, default: "value" },
  },
  emits: ["update:modelValue"],
  setup(props, { attrs, slots, expose, emit }) {
    const owner = getCurrentInstance();
    const element = ref<Element | null>(null);
    let modelTarget: Element | null = null;
    let modelEventName = "";
    const updateFromGardenerim = (event: CustomEvent<Record<string, unknown>>) => {
      const detail = event.detail ?? {};
      emit("update:modelValue", detail[props.modelKey] ?? detail.value ?? detail.values ?? detail.selected);
    };
    const unbindModelEvent = () => {
      if (modelTarget && modelEventName) modelTarget.removeEventListener(modelEventName, updateFromGardenerim as EventListener);
      modelTarget = null;
    };
    const bindModelEvent = () => {
      unbindModelEvent();
      if (!element.value || !props.modelEvent) return;
      modelTarget = element.value;
      modelEventName = props.modelEvent.startsWith("gardener:") ? props.modelEvent : `gardener:${props.modelEvent}`;
      modelTarget.addEventListener(modelEventName, updateFromGardenerim as EventListener);
    };
    const refresh = () => { if (props.initialize && element.value) init(element.value); };
    const reinitialize = async () => {
      if (!element.value) return;
      destroy(element.value);
      if (props.initialize) { await nextTick(); if (element.value) init(element.value); }
    };
    const publicInstance: GardenerimComponentPublicInstance = {
      get element() { return element.value; },
      getInstance: (behavior) => element.value ? behavior ? getInstance(element.value, behavior) : getInstance(element.value) : null,
      refresh,
    };
    expose(publicInstance);
    onMounted(() => { refresh(); bindModelEvent(); });
    onBeforeUnmount(() => { unbindModelEvent(); if (element.value) destroy(element.value); });
    watch(() => props.initialize, (enabled) => { if (enabled) refresh(); else if (element.value) destroy(element.value); }, { flush: "post" });
    watch(() => props.config, reinitialize, { deep: true, flush: "post" });
    watch(() => props.modelEvent, bindModelEvent, { flush: "post" });

    return () => {
      const variants = list(props.variant).map((variant) => definition.className ? `${definition.className}-${variant}` : variant);
      const states = list(props.state).map((state) => state.startsWith("is-") ? state : `is-${state}`);
      const tag = typeof props.as === "string" ? props.as : definition.tag;
      const nativeControl = ["input", "textarea", "select"].includes(tag);
      const hasModel = props.modelValue !== undefined || Object.prototype.hasOwnProperty.call(owner?.vnode.props ?? {}, "modelValue");
      const data: Record<string, unknown> = {
        ...behaviorAttributes(definition.behaviors),
        ...attrs,
        ...configAttributes(props.config),
        ref: element,
        class: [definition.className, variants, states, attrs.class],
        ...(definition.tag === "button" && attrs.type == null ? { type: "button" } : {}),
      };
      if (nativeControl && hasModel) data["onUpdate:modelValue"] = (value: unknown) => emit("update:modelValue", value);
      const node = h(props.as as string | Component, data, tag === "input" ? undefined : slots);
      if (!nativeControl || !hasModel) return node;
      // Use Vue's own model directives: radio values, checkbox arrays/Sets,
      // multiple selects, async options and IME composition retain native semantics.
      const model = tag === "select" ? vModelSelect : tag === "input" && attrs.type === "radio" ? vModelRadio : tag === "input" && attrs.type === "checkbox" ? vModelCheckbox : vModelText;
      return withDirectives(node, [[model, props.modelValue]]);
    };
  },
});

export const GardenerimComponent = defineComponent({
  name: "GardenerimComponent",
  inheritAttrs: false,
  props: {
    definition: { type: Object as PropType<GardenerimComponentDefinition>, required: true },
    as: { type: [String, Object, Function] as PropType<string | Component>, default: undefined },
    variant: { type: [String, Array] as PropType<string | readonly string[]>, default: undefined },
    state: { type: [String, Array] as PropType<string | readonly string[]>, default: undefined },
    config: { type: Object as PropType<Readonly<Record<string, GardenerimConfigValue>>>, default: undefined },
    initialize: { type: Boolean, default: true },
    modelValue: null as unknown as PropType<unknown>,
    modelEvent: { type: String, default: "change" },
    modelKey: { type: String, default: "value" },
  },
  setup(props, context) {
    const owner = getCurrentInstance();
    const implementation = computed(() => createGardenerimComponent(props.definition));
    return () => {
      const componentProps: Record<string, unknown> = {
        ...context.attrs,
        as: props.as ?? props.definition.tag,
        initialize: props.initialize,
      };
      if (props.variant !== undefined) componentProps.variant = props.variant;
      if (props.state !== undefined) componentProps.state = props.state;
      if (props.config !== undefined) componentProps.config = props.config;
      if (props.modelValue !== undefined || Object.prototype.hasOwnProperty.call(owner?.vnode.props ?? {}, "modelValue")) componentProps.modelValue = props.modelValue;
      componentProps.modelEvent = props.modelEvent;
      componentProps.modelKey = props.modelKey;
      return h(implementation.value, componentProps, context.slots);
    };
  },
});

export const GardenerimPart = defineComponent({
  name: "GardenerimPart",
  inheritAttrs: false,
  props: {
    name: { type: String, required: true },
    as: { type: [String, Object, Function] as PropType<string | Component>, default: "div" },
  },
  setup(props, { attrs, slots }) {
    return () => h(props.as as string | Component, { ...attrs, class: [props.name.startsWith("g-") ? props.name : `g-${props.name}`, attrs.class] }, slots);
  },
});
