const quoteUnion = (items) => items.length ? items.map((item) => JSON.stringify(item)).join(" | ") : "never";

export function runtimeTypes(publicApi, version) {
  const behaviors = quoteUnion(publicApi.javascript.behaviors);
  const events = quoteUnion(publicApi.javascript.events);
  return `/** Gardener ${version} runtime declarations. Generated from metadata/public-api.json. */
export type GardenerBehaviorName = ${behaviors};
export type GardenerEventName = ${events};
export type GardenerRoot = Document | DocumentFragment | Element;

export interface GardenerBehaviorInstance {
  destroy?: () => void;
  [member: string]: unknown;
}

export type GardenerBehaviorFactory = (element: Element) => GardenerBehaviorInstance | null | void;

export interface GardenerToastOptions {
  title?: string;
  message?: string;
  tone?: "success" | "warning" | "danger" | "info" | string;
  timeout?: number;
}

export interface GardenerAPI {
  readonly version: ${JSON.stringify(version)};
  readonly behaviors: readonly GardenerBehaviorName[];
  init(root?: GardenerRoot): Readonly<GardenerAPI>;
  destroy(root?: GardenerRoot): void;
  register(name: string, factory: GardenerBehaviorFactory): void;
  getInstance(elementOrSelector: Element | string, name: string): GardenerBehaviorInstance | null;
  getInstance(elementOrSelector: Element | string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
  emit(element: EventTarget, name: GardenerEventName | string, detail?: Record<string, unknown>): boolean;
  toast(options?: GardenerToastOptions): HTMLElement;
  observe(): void;
}

export declare function init(root?: GardenerRoot): Readonly<GardenerAPI>;
export declare function destroy(root?: GardenerRoot): void;
export declare function register(name: string, factory: GardenerBehaviorFactory): void;
export declare function getInstance(elementOrSelector: Element | string, name: string): GardenerBehaviorInstance | null;
export declare function getInstance(elementOrSelector: Element | string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
export declare function emit(element: EventTarget, name: GardenerEventName | string, detail?: Record<string, unknown>): boolean;
export declare function toast(options?: GardenerToastOptions): HTMLElement;
export declare function observe(): void;
export declare const Gardener: Readonly<GardenerAPI>;
export default Gardener;
`;
}

export function adapterTypes(name, exportedFunction) {
  const prefix = name === "tauri" ? "Tauri" : "Electron";
  const injected = name === "tauri"
    ? `{ minimize?: () => unknown; toggleMaximize?: () => unknown; isMaximized?: () => boolean | Promise<boolean>; unmaximize?: () => unknown; maximize?: () => unknown; close?: () => unknown; startDragging?: () => unknown }`
    : `{ minimize?: () => unknown; maximize?: () => unknown; close?: () => unknown; drag?: () => unknown; windowAction?: (action: GardenerWindowAction) => unknown }`;
  return `/** Gardener ${name} desktop adapter declarations. */
export type GardenerWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface Gardener${prefix}Binding { readonly available: boolean; destroy(): void; }
export type Gardener${prefix}Bridge = ${injected};
export declare function ${exportedFunction}(root?: Document | Element, injectedBridge?: Gardener${prefix}Bridge | null): Gardener${prefix}Binding;
`;
}
