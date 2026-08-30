import { bindElectronWindowControls, type GardenerElectronBinding, type GardenerElectronBridge } from "@gardenerim/css/electron";

export const createElectronWindowService = (root?: Document | Element, bridge?: GardenerElectronBridge | null): GardenerElectronBinding =>
  bindElectronWindowControls(root, bridge);

export { bindElectronWindowControls };
export type { GardenerElectronBinding, GardenerElectronBridge };
