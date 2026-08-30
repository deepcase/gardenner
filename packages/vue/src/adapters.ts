import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from "vue";
import { bindElectronWindowControls, type GardenerElectronBinding, type GardenerElectronBridge } from "@gardenerim/css/electron";
import { bindTauriWindowControls, type GardenerTauriBinding, type GardenerTauriBridge } from "@gardenerim/css/tauri";
import type { GardenerComponentPublicInstance } from "./types.js";

type AdapterTarget = Element | GardenerComponentPublicInstance | null | undefined;
const rootValue = (root?: Ref<AdapterTarget>): Document | Element | undefined => {
  if (!root) return typeof document === "undefined" ? undefined : document;
  const value = root.value;
  return value && typeof value === "object" && "element" in value ? value.element ?? undefined : value ?? undefined;
};

export const useTauriWindowControls = (root?: Ref<AdapterTarget>, bridge?: GardenerTauriBridge | null) => {
  const binding = shallowRef<GardenerTauriBinding | null>(null);
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

export const useElectronWindowControls = (root?: Ref<AdapterTarget>, bridge?: GardenerElectronBridge | null) => {
  const binding = shallowRef<GardenerElectronBinding | null>(null);
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
export type { GardenerElectronBinding, GardenerElectronBridge, GardenerTauriBinding, GardenerTauriBridge };
