/** Gardener electron desktop adapter declarations. */
export type GardenerWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface GardenerElectronBinding { readonly available: boolean; destroy(): void; }
export type GardenerElectronBridge = { minimize?: () => unknown; maximize?: () => unknown; close?: () => unknown; drag?: () => unknown; windowAction?: (action: GardenerWindowAction) => unknown };
export declare function bindElectronWindowControls(root?: Document | Element, injectedBridge?: GardenerElectronBridge | null): GardenerElectronBinding;
