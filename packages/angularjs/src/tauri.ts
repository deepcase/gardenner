import { bindTauriWindowControls, type GardenerTauriBinding, type GardenerTauriBridge } from "@gardenerim/css/tauri";

export const createTauriWindowService = (root?: Document | Element, bridge?: GardenerTauriBridge | null): GardenerTauriBinding =>
  bindTauriWindowControls(root, bridge);

export { bindTauriWindowControls };
export type { GardenerTauriBinding, GardenerTauriBridge };
