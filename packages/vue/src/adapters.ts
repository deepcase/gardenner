import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from "vue";
import { bindElectronWindowControls, type GardenerimElectronBinding, type GardenerimElectronBridge } from "@gardenerim/css/electron";
import { bindTauriWindowControls, type GardenerimTauriBinding, type GardenerimTauriBridge } from "@gardenerim/css/tauri";
import type { GardenerimComponentPublicInstance } from "./types.js";

type AdapterTarget = Element | GardenerimComponentPublicInstance | null | undefined;
const rootValue = (root?: Ref<AdapterTarget>): Document | Element | undefined => {
  if (!root) return typeof document === "undefined" ? undefined : document;
  const value = root.value;
  return value && typeof value === "object" && "element" in value ? value.element ?? undefined : value ?? undefined;
};

export const useTauriWindowControls = (root?: Ref<AdapterTarget>, bridge?: GardenerimTauriBridge | null) => {
  const binding = shallowRef<GardenerimTauriBinding | null>(null);
  const bind = () => {
    binding.value?.destroy();
    const target = rootValue(root);
    if (target) binding.value = bindTauriWindowControls(target, bridge);
    return binding.value;
  };
  onMounted(bind);
  if (root) watch(root, bind, { flush: "post" });
  onBeforeUnmount(() => { binding.value?.destroy(); binding.value = null; });
  return { binding, bind } as const;
};

export const useElectronWindowControls = (root?: Ref<AdapterTarget>, bridge?: GardenerimElectronBridge | null) => {
  const binding = shallowRef<GardenerimElectronBinding | null>(null);
  const bind = () => {
    binding.value?.destroy();
    const target = rootValue(root);
    if (target) binding.value = bindElectronWindowControls(target, bridge);
    return binding.value;
  };
  onMounted(bind);
  if (root) watch(root, bind, { flush: "post" });
  onBeforeUnmount(() => { binding.value?.destroy(); binding.value = null; });
  return { binding, bind } as const;
};

export { bindElectronWindowControls, bindTauriWindowControls };
export type { GardenerimElectronBinding, GardenerimElectronBridge, GardenerimTauriBinding, GardenerimTauriBridge };
