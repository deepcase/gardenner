import { bindElectronWindowControls, type GardenerimElectronBinding, type GardenerimElectronBridge } from "@gardenerim/css/electron";

export const createElectronWindowService = (root?: Document | Element, bridge?: GardenerimElectronBridge | null): GardenerimElectronBinding =>
  bindElectronWindowControls(root, bridge);

export { bindElectronWindowControls };
export type { GardenerimElectronBinding, GardenerimElectronBridge };
