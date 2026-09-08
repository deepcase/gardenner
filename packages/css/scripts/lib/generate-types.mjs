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

export type GardenerimToastTone = "normal" | "success" | "warning" | "danger" | "error" | "info" | "loading";
export type GardenerimToastPosition = "top" | "bottom" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface GardenerimToastConfiguration {
  timeout?: number;
  maxCount?: number;
  position?: GardenerimToastPosition;
  closable?: boolean;
  showIcon?: boolean;
}

export interface GardenerimToastOptions extends GardenerimToastConfiguration {
  id?: string | number;
  title?: string;
  message?: string;
  tone?: GardenerimToastTone;
  timeout?: number;
  duration?: number;
  persistent?: boolean;
  compact?: boolean;
  spacious?: boolean;
  actionLabel?: string;
  actionClose?: boolean;
  onAction?: (element: HTMLElement) => void;
  onClose?: (reason: string, element: HTMLElement) => void;
}

export interface GardenerimToastFunction {
  (options?: GardenerimToastOptions | string): HTMLElement;
  clear(position?: GardenerimToastPosition): void;
  config(options?: GardenerimToastConfiguration): Readonly<Required<GardenerimToastConfiguration>>;
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
  getInstance(elementOrSelector: Element | string, name: "foundation"): GardenerimFoundationInstance | null;
  getInstance(elementOrSelector: Element | string, name: "tree"): GardenerimTreeInstance | null;
  getInstance(elementOrSelector: Element | string, name: "tooltip"): GardenerimTooltipInstance | null;
  getInstance(elementOrSelector: Element | string, name: "popover"): GardenerimPopoverInstance | null;
  getInstance(elementOrSelector: Element | string, name: "table"): GardenerimTableInstance | null;
  getInstance(elementOrSelector: Element | string, name: "data-display"): GardenerimDataDisplayInstance | null;
  getInstance(elementOrSelector: Element | string, name: "dashboard"): GardenerimDashboardInstance | null;
  getInstance(elementOrSelector: Element | string, name: "interaction"): GardenerimInteractionInstance | null;
getInstance(elementOrSelector: Element | string, name: "content"): GardenerimContentInstance | null;
  getInstance(elementOrSelector: Element | string, name: "layout"): GardenerimLayoutInstance | null;
  getInstance(elementOrSelector: Element | string, name: "help"): GardenerimHelpInstance | null;
  getInstance(elementOrSelector: Element | string, name: "ai"): GardenerimAIInstance | null;
  getInstance(elementOrSelector: Element | string, name: "media"): GardenerimMediaInstance | null;
  getInstance(elementOrSelector: Element | string, name: "commerce"): GardenerimCommerceInstance | null;
  getInstance(elementOrSelector: Element | string, name: "auth"): GardenerimAuthInstance | null;
  getInstance(elementOrSelector: Element | string, name: "mobile"): GardenerimMobileInstance | null;
  getInstance(elementOrSelector: Element | string, name: "cms"): GardenerimCmsInstance | null;
  getInstance(elementOrSelector: Element | string, name: "marketing"): GardenerimMarketingInstance | null;
  getInstance(elementOrSelector: Element | string, name: "enterprise"): GardenerimEnterpriseInstance | null;
  getInstance(elementOrSelector: Element | string, name: "desktop"): GardenerimDesktopInstance | null;
  getInstance(elementOrSelector: Element | string, name: "workflow"): GardenerimWorkflowInstance | null;
  getInstance(elementOrSelector: Element | string, name: "communication"): GardenerimCommunicationInstance | null;
  getInstance(elementOrSelector: Element | string, name: "solution"): GardenerimSolutionInstance | null;
  getInstance(elementOrSelector: Element | string, name: "legal"): GardenerimLegalInstance | null;
  getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
  getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
  toast: GardenerimToastFunction;
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
export declare function getInstance(elementOrSelector: Element | string, name: "foundation"): GardenerimFoundationInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "tree"): GardenerimTreeInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "tooltip"): GardenerimTooltipInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "popover"): GardenerimPopoverInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "table"): GardenerimTableInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "data-display"): GardenerimDataDisplayInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "dashboard"): GardenerimDashboardInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "interaction"): GardenerimInteractionInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "content"): GardenerimContentInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "layout"): GardenerimLayoutInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "help"): GardenerimHelpInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "ai"): GardenerimAIInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "media"): GardenerimMediaInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "commerce"): GardenerimCommerceInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "auth"): GardenerimAuthInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "mobile"): GardenerimMobileInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "cms"): GardenerimCmsInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "marketing"): GardenerimMarketingInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "enterprise"): GardenerimEnterpriseInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "desktop"): GardenerimDesktopInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "workflow"): GardenerimWorkflowInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "communication"): GardenerimCommunicationInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "solution"): GardenerimSolutionInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "legal"): GardenerimLegalInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
export declare function getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
export declare function emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
export declare const toast: GardenerimToastFunction;
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
${readFileSync(new URL("../../src/types/popover.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/foundation.d.ts", import.meta.url), "utf8").trimEnd()}

${readFileSync(new URL("../../src/types/tree.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/tag.d.ts", import.meta.url), "utf8").trimEnd()}

${readFileSync(new URL("../../src/types/tabs.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/table.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/navigation.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/data-display.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/dashboard.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/interaction.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/content.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/layout.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/help.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/ai.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/media.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/collapse.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/auth.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/mobile.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/desktop.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/workflow.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/communication.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/solution.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/legal.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/enterprise.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/marketing.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/cms.d.ts", import.meta.url), "utf8").trimEnd()}
${readFileSync(new URL("../../src/types/commerce.d.ts", import.meta.url), "utf8").trimEnd()}
`;
}

export function adapterTypes(name, exportedFunction) {
  const prefix = name === "tauri" ? "Tauri" : "Electron";
  const injected = name === "tauri"
    ? `{ minimize?: () => unknown; toggleMaximize?: () => unknown; isMaximized?: () => boolean | Promise<boolean>; unmaximize?: () => unknown; maximize?: () => unknown; close?: () => unknown; startDragging?: () => unknown }`
    : `{ minimize?: () => unknown; maximize?: () => unknown; close?: () => unknown; drag?: () => unknown; restore?: () => unknown; windowAction?: (action: GardenerimWindowAction | "restore") => unknown }`;
  return `/** Gardenerim ${name} desktop adapter declarations. */
export type GardenerimWindowAction = "minimize" | "maximize" | "close" | "drag";
export interface Gardenerim${prefix}Binding { readonly available: boolean; execute(action: GardenerimWindowAction | "restore"): Promise<unknown>; destroy(): void; }
export type Gardenerim${prefix}Bridge = ${injected};
export declare function ${exportedFunction}(root?: Document | Element, injectedBridge?: Gardenerim${prefix}Bridge | null): Gardenerim${prefix}Binding;
`;
}
