/** Gardenerim tauri desktop adapter declarations. */
export type GardenerimWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface GardenerimTauriBinding { readonly available: boolean; destroy(): void; }
export type GardenerimTauriBridge = { minimize?: () => unknown; toggleMaximize?: () => unknown; isMaximized?: () => boolean | Promise<boolean>; unmaximize?: () => unknown; maximize?: () => unknown; close?: () => unknown; startDragging?: () => unknown };
export declare function bindTauriWindowControls(root?: Document | Element, injectedBridge?: GardenerimTauriBridge | null): GardenerimTauriBinding;
