import { bindTauriWindowControls, type GardenerimTauriBinding, type GardenerimTauriBridge } from "@gardenerim/css/tauri";

export const createTauriWindowService = (root?: Document | Element, bridge?: GardenerimTauriBridge | null): GardenerimTauriBinding =>
  bindTauriWindowControls(root, bridge);

export { bindTauriWindowControls };
export type { GardenerimTauriBinding, GardenerimTauriBridge };
