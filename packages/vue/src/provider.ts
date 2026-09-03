import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type Component, type PropType } from "vue";
import { configure, destroy, init } from "@gardenerim/css/runtime";
import type { GardenerimThemeState } from "./types.js";

const axes: readonly (keyof GardenerimThemeState)[] = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];

export const themeAttributes = (state: GardenerimThemeState): Record<string, string> => Object.fromEntries(
  axes.flatMap((axis) => state[axis] == null || state[axis] === "" ? [] : [[`data-g-${axis}`, String(state[axis])]]),
);

export const GardenerimProvider = defineComponent({
  name: "GardenerimProvider",
  inheritAttrs: false,
  props: {
    as: { type: [String, Object, Function] as PropType<string | Component>, default: "div" },
    theme: String,
    mode: String,
    neutral: String,
    typography: String,
    shape: String,
    density: String,
    elevation: String,
    motion: String,
    platform: String,
    os: String,
    initialize: { type: Boolean, default: true },
    locale: { type: [String, Array] as PropType<string | readonly string[]>, default: undefined },
    messages: { type: Object as PropType<Readonly<Record<string, string>>>, default: undefined },
  },
  setup(props, { attrs, slots }) {
    const element = ref<Element | null>(null);
    const refresh = () => {
      if (!element.value) return;
      if (props.locale || props.messages) configure({
        ...(props.locale ? { locale: props.locale } : {}),
        ...(props.messages ? { messages: props.messages } : {}),
        root: element.value,
      });
      if (props.initialize) init(element.value);
    };
    onMounted(refresh);
    onBeforeUnmount(() => { if (element.value) destroy(element.value); });
    watch(() => props.initialize, (enabled) => { if (enabled) refresh(); else if (element.value) destroy(element.value); });
    watch(() => [props.locale, props.messages] as const, refresh, { deep: true });
    return () => h(props.as as string | Component, {
      ...attrs,
      ...themeAttributes(Object.fromEntries(axes.map((axis) => [axis, props[axis]])) as GardenerimThemeState),
      ref: element,
    }, slots);
  },
});
