/** Gardenerim electron desktop adapter declarations. */
export type GardenerimWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface GardenerimElectronBinding { readonly available: boolean; execute(action: GardenerimWindowAction | "restore"): Promise<unknown>; destroy(): void; }
export type GardenerimElectronBridge = { minimize?: () => unknown; maximize?: () => unknown; close?: () => unknown; drag?: () => unknown; restore?: () => unknown; windowAction?: (action: GardenerimWindowAction | "restore") => unknown };
export declare function bindElectronWindowControls(root?: Document | Element, injectedBridge?: GardenerimElectronBridge | null): GardenerimElectronBinding;
