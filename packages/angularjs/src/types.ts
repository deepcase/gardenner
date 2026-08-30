import type angular from "angular";
import type {
  GardenerBehaviorInstance as RuntimeBehaviorInstance,
  GardenerBehaviorName as RuntimeBehaviorName,
  GardenerEventName as RuntimeEventName,
} from "@gardenerim/css/runtime";
import type {
  GardenerAngularJSComponentExportName,
  GardenerAngularJSComponentName,
  GardenerAngularJSDirectiveName,
} from "./generated/components.js";

export type GardenerAngularJSStatic = angular.IAngularStatic;
export type GardenerAngularJSModule = angular.IModule;
export type GardenerAngularJSDirectiveFactory = angular.IDirectiveFactory<angular.IScope, angular.IAugmentedJQuery, angular.IAttributes, angular.INgModelController>;
export type GardenerBehaviorName = RuntimeBehaviorName;
export type GardenerEventName = RuntimeEventName;
export type GardenerBehaviorInstance = RuntimeBehaviorInstance;
export type GardenerPlatform = "web" | "mobile" | "desktop" | "tauri" | "electron";
export type GardenerComponentKind = "css" | "hybrid" | string;
export type GardenerConfigValue = string | number | boolean | null | undefined;
export type GardenerThemeState = Partial<Record<GardenerThemeAxis, string>>;
export type GardenerThemeAxis = "theme" | "mode" | "neutral" | "typography" | "shape" | "density" | "elevation" | "motion" | "platform" | "os";

export interface GardenerComponentDefinition {
  readonly name: string;
  readonly exportName: string;
  readonly directiveName: string;
  readonly elementName: string;
  readonly category: string;
  readonly type: GardenerComponentKind;
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

export interface GardenerComponentHandle {
  readonly element: Element;
  getInstance(behavior?: string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
  refresh(): void;
  destroy(): void;
}

export interface GardenerAngularJSOptions {
  moduleName?: string;
  dependencies?: readonly string[];
  components?: readonly (GardenerAngularJSComponentName | GardenerAngularJSComponentExportName | GardenerAngularJSDirectiveName)[];
  initialize?: boolean;
  registerProvider?: boolean;
  registerBehaviorDirective?: boolean;
}

export interface GardenerThemeService {
  readonly axes: readonly GardenerThemeAxis[];
  attributes(state?: GardenerThemeState): Record<string, string>;
  apply(target: Element, state?: GardenerThemeState): void;
  read(target: Element): GardenerThemeState;
  clear(target: Element): void;
}

export interface GardenerRuntimeService {
  readonly version: string;
  init(root?: Document | DocumentFragment | Element): unknown;
  destroy(root?: Document | DocumentFragment | Element): void;
  getInstance(element: Element, behavior?: string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
  emit(element: EventTarget, name: string, detail?: Record<string, unknown>): boolean;
  observe(): void;
}

export type GardenerValueChangeLocals = { $value: unknown; $event: Event };
