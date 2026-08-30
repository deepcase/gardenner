import { defineComponent, h, onBeforeUnmount, onMounted, ref, watch, type Component, type PropType } from "vue";
import { destroy, init } from "@gardener/css/runtime";
import type { GardenerThemeState } from "./types.js";

const axes: readonly (keyof GardenerThemeState)[] = ["theme", "mode", "neutral", "typography", "shape", "density", "elevation", "motion", "platform", "os"];

export const themeAttributes = (state: GardenerThemeState): Record<string, string> => Object.fromEntries(
  axes.flatMap((axis) => state[axis] == null || state[axis] === "" ? [] : [[`data-g-${axis}`, String(state[axis])]]),
);

export const GardenerProvider = defineComponent({
  name: "GardenerProvider",
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
  },
  setup(props, { attrs, slots }) {
    const element = ref<Element | null>(null);
    const refresh = () => { if (props.initialize && element.value) init(element.value); };
    onMounted(refresh);
    onBeforeUnmount(() => { if (element.value) destroy(element.value); });
    watch(() => props.initialize, (enabled) => { if (enabled) refresh(); else if (element.value) destroy(element.value); });
    return () => h(props.as as string | Component, {
      ...attrs,
      ...themeAttributes(Object.fromEntries(axes.map((axis) => [axis, props[axis]])) as GardenerThemeState),
      ref: element,
    }, slots);
  },
});
