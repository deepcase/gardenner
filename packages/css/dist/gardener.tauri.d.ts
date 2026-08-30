/** Gardener tauri desktop adapter declarations. */
export type GardenerWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface GardenerTauriBinding { readonly available: boolean; destroy(): void; }
export type GardenerTauriBridge = { minimize?: () => unknown; toggleMaximize?: () => unknown; isMaximized?: () => boolean | Promise<boolean>; unmaximize?: () => unknown; maximize?: () => unknown; close?: () => unknown; startDragging?: () => unknown };
export declare function bindTauriWindowControls(root?: Document | Element, injectedBridge?: GardenerTauriBridge | null): GardenerTauriBinding;
