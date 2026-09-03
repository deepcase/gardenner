import { readFileSync } from "node:fs";
const quoteUnion = (items) => items.length ? items.map((item) => JSON.stringify(item)).join(" | ") : "never";

export function runtimeTypes(publicApi, version) {
  const behaviors = quoteUnion(publicApi.javascript.behaviors);
  const events = quoteUnion(publicApi.javascript.events);
  return `/** Gardenerim ${version} runtime declarations. Generated from metadata/public-api.json. */
export type GardenerimBehaviorName = ${behaviors};
export type GardenerimEventName = ${events};
export type GardenerimRoot = Document | DocumentFragment | Element;

export interface GardenerimBehaviorInstance {
  destroy?: () => void;
  [member: string]: unknown;
}

export type GardenerimBehaviorFactory = (element: Element) => GardenerimBehaviorInstance | null | void;

export interface GardenerimToastOptions {
  title?: string;
  message?: string;
  tone?: "success" | "warning" | "danger" | "error" | "info" | string;
  timeout?: number;
}

export interface GardenerimConfiguration {
  readonly locale: string;
  readonly messages: Readonly<Record<string, string>>;
  readonly supportedLocales: readonly string[];
}

export interface GardenerimConfigureOptions {
  locale?: string | readonly string[];
  messages?: Readonly<Record<string, string>>;
  root?: GardenerimRoot;
  refresh?: boolean;
}

export interface GardenerimObserveOptions {
  subtree?: boolean;
  attributes?: boolean;
}

export interface GardenerimStartOptions {
  observe?: boolean;
  observeOptions?: GardenerimObserveOptions;
}

export interface GardenerimAPI {
  readonly version: ${JSON.stringify(version)};
  readonly behaviors: readonly GardenerimBehaviorName[];
  readonly started: boolean;
  readonly locale: string;
  readonly supportedLocales: readonly string[];
  init(root?: GardenerimRoot): Readonly<GardenerimAPI>;
  refresh(root?: GardenerimRoot): Readonly<GardenerimAPI>;
  destroy(root?: GardenerimRoot): void;
  register(name: string, factory: GardenerimBehaviorFactory): void;
  getInstance<Row extends object = Record<string, unknown>>(elementOrSelector: Element | string, name: "data-grid"): GardenerimDataGridInstance<Row> | null;
  getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
  getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
  toast(options?: GardenerimToastOptions): HTMLElement;
  observe(root?: GardenerimRoot, options?: GardenerimObserveOptions): { disconnect(): void };
  disconnect(): void;
  start(root?: GardenerimRoot, options?: GardenerimStartOptions): Readonly<GardenerimAPI>;
  stop(options?: { destroy?: boolean; root?: GardenerimRoot }): void;
  configure(options?: GardenerimConfigureOptions): GardenerimConfiguration;
  getConfiguration(): GardenerimConfiguration;
}

export declare function init(root?: GardenerimRoot): Readonly<GardenerimAPI>;
export declare function refresh(root?: GardenerimRoot): Readonly<GardenerimAPI>;
export declare function destroy(root?: GardenerimRoot): void;
export declare function register(name: string, factory: GardenerimBehaviorFactory): void;
export declare function getInstance<Row extends object = Record<string, unknown>>(elementOrSelector: Element | string, name: "data-grid"): GardenerimDataGridInstance<Row> | null;
export declare function getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
export declare function getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
export declare function emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
export declare function toast(options?: GardenerimToastOptions): HTMLElement;
export declare function observe(root?: GardenerimRoot, options?: GardenerimObserveOptions): { disconnect(): void };
export declare function disconnect(): void;
export declare function start(root?: GardenerimRoot, options?: GardenerimStartOptions): Readonly<GardenerimAPI>;
export declare function stop(options?: { destroy?: boolean; root?: GardenerimRoot }): void;
export declare function configure(options?: GardenerimConfigureOptions): GardenerimConfiguration;
export declare function getConfiguration(): GardenerimConfiguration;
export declare const supportedLocales: readonly string[];
export declare const Gardenerim: Readonly<GardenerimAPI>;
export default Gardenerim;
${readFileSync(new URL("../../src/types/data-grid.d.ts", import.meta.url), "utf8").trimEnd()}
`;
}

export function adapterTypes(name, exportedFunction) {
  const prefix = name === "tauri" ? "Tauri" : "Electron";
  const injected = name === "tauri"
    ? `{ minimize?: () => unknown; toggleMaximize?: () => unknown; isMaximized?: () => boolean | Promise<boolean>; unmaximize?: () => unknown; maximize?: () => unknown; close?: () => unknown; startDragging?: () => unknown }`
    : `{ minimize?: () => unknown; maximize?: () => unknown; close?: () => unknown; drag?: () => unknown; windowAction?: (action: GardenerimWindowAction) => unknown }`;
  return `/** Gardenerim ${name} desktop adapter declarations. */
export type GardenerimWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface Gardenerim${prefix}Binding { readonly available: boolean; destroy(): void; }
export type Gardenerim${prefix}Bridge = ${injected};
export declare function ${exportedFunction}(root?: Document | Element, injectedBridge?: Gardenerim${prefix}Bridge | null): Gardenerim${prefix}Binding;
`;
}
