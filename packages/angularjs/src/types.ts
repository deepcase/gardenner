import type angular from "angular";
import type {
  GardenerimBehaviorInstance as RuntimeBehaviorInstance,
  GardenerimBehaviorName as RuntimeBehaviorName,
  GardenerimEventName as RuntimeEventName,
  GardenerimConfiguration,
  GardenerimConfigureOptions,
} from "@gardenerim/css/runtime";
import type {
  GardenerimAngularJSComponentExportName,
  GardenerimAngularJSComponentName,
  GardenerimAngularJSDirectiveName,
} from "./generated/components.js";

export type GardenerimAngularJSStatic = angular.IAngularStatic;
export type GardenerimAngularJSModule = angular.IModule;
export type GardenerimAngularJSDirectiveFactory = angular.IDirectiveFactory<angular.IScope, angular.IAugmentedJQuery, angular.IAttributes, angular.INgModelController>;
export type GardenerimBehaviorName = RuntimeBehaviorName;
export type GardenerimEventName = RuntimeEventName;
export type GardenerimBehaviorInstance = RuntimeBehaviorInstance;
export type GardenerimPlatform = "web" | "mobile" | "desktop" | "tauri" | "electron";
export type GardenerimComponentKind = "css" | "hybrid" | string;
export type GardenerimConfigValue = string | number | boolean | null | undefined;
export type GardenerimThemeState = Partial<Record<GardenerimThemeAxis, string>>;
export type GardenerimThemeAxis = "theme" | "mode" | "neutral" | "typography" | "shape" | "density" | "elevation" | "motion" | "platform" | "os";

export interface GardenerimComponentDefinition {
  readonly name: string;
  readonly exportName: string;
  readonly directiveName: string;
  readonly elementName: string;
  readonly category: string;
  readonly type: GardenerimComponentKind;
  readonly selector: string;
  readonly cssSelector?: string;
  readonly className?: string;
  readonly tag: keyof HTMLElementTagNameMap;
  readonly variants: readonly string[];
  readonly states: readonly string[];
  readonly parts: readonly string[];
  readonly behaviors: readonly string[];
  readonly platforms: readonly string[];
}

export interface GardenerimComponentHandle {
  readonly element: Element;
  getInstance(behavior?: string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  refresh(): void;
  destroy(): void;
}

export interface GardenerimAngularJSOptions {
  moduleName?: string;
  dependencies?: readonly string[];
  components?: readonly (GardenerimAngularJSComponentName | GardenerimAngularJSComponentExportName | GardenerimAngularJSDirectiveName)[];
  initialize?: boolean;
  registerProvider?: boolean;
  registerBehaviorDirective?: boolean;
}

export interface GardenerimThemeService {
  readonly axes: readonly GardenerimThemeAxis[];
  attributes(state?: GardenerimThemeState): Record<string, string>;
  apply(target: Element, state?: GardenerimThemeState): void;
  read(target: Element): GardenerimThemeState;
  clear(target: Element): void;
}

export interface GardenerimRuntimeService {
  readonly version: string;
  init(root?: Document | DocumentFragment | Element): unknown;
  destroy(root?: Document | DocumentFragment | Element): void;
  getInstance(element: Element, behavior?: string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  emit(element: EventTarget, name: string, detail?: Record<string, unknown>): boolean;
  observe(): void;
  configure(options?: GardenerimConfigureOptions): GardenerimConfiguration;
  getConfiguration(): GardenerimConfiguration;
}

export type GardenerimValueChangeLocals = { $value: unknown; $event: Event };
