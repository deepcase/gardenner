import type { Component, Ref } from "vue";
import type { GardenerimBehaviorInstance, GardenerimBehaviorName, GardenerimEventName } from "@gardenerim/css/runtime";

export type GardenerimPlatform = "web" | "mobile" | "tablet" | "desktop" | "pwa" | "desktop-webview" | "tauri" | "electron" | "print";
export type GardenerimComponentKind = "css" | "interactive";
export type GardenerimConfigValue = string | number | boolean | null | undefined;

export interface GardenerimComponentDefinition {
  readonly name: string;
  readonly exportName: string;
  readonly category: string;
  readonly type: GardenerimComponentKind;
  readonly selector: string;
  readonly cssSelector?: string;
  readonly className?: string;
  readonly tag: string;
  readonly variants: readonly string[];
  readonly states: readonly string[];
  readonly parts: readonly string[];
  readonly behaviors: readonly GardenerimBehaviorName[];
  readonly platforms: readonly GardenerimPlatform[];
}

export interface GardenerimComponentPublicInstance {
  readonly element: Element | null;
  getInstance(behavior?: GardenerimBehaviorName | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  refresh(): void;
}

export interface GardenerimThemeState {
  theme?: string;
  mode?: "light" | "dark" | "system" | string;
  neutral?: string;
  typography?: string;
  shape?: string;
  density?: string;
  elevation?: string;
  motion?: string;
  platform?: GardenerimPlatform | string;
  os?: string;
}

export type GardenerimTargetValue = Element | Document | GardenerimComponentPublicInstance;
export type GardenerimElementTarget = GardenerimTargetValue | Ref<GardenerimTargetValue | null | undefined> | null | undefined;
export type GardenerimEventHandler<T = Record<string, unknown>> = (event: CustomEvent<T>) => void;

export interface GardenerimDirectiveOptions {
  behavior: GardenerimBehaviorName | string | readonly (GardenerimBehaviorName | string)[];
  config?: Readonly<Record<string, GardenerimConfigValue>>;
}

export type GardenerimDirectiveValue = GardenerimBehaviorName | string | readonly (GardenerimBehaviorName | string)[] | GardenerimDirectiveOptions;
export type GardenerimAs = string | Component;
export type { GardenerimBehaviorInstance, GardenerimBehaviorName, GardenerimEventName } from "@gardenerim/css/runtime";
