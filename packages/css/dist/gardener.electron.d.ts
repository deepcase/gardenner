/** Gardenerim electron desktop adapter declarations. */
export type GardenerimWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface GardenerimElectronBinding { readonly available: boolean; destroy(): void; }
export type GardenerimElectronBridge = { minimize?: () => unknown; maximize?: () => unknown; close?: () => unknown; drag?: () => unknown; windowAction?: (action: GardenerimWindowAction) => unknown };
export declare function bindElectronWindowControls(root?: Document | Element, injectedBridge?: GardenerimElectronBridge | null): GardenerimElectronBinding;
