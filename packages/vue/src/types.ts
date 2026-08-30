import type { Component, Ref } from "vue";
import type { GardenerBehaviorInstance, GardenerBehaviorName, GardenerEventName } from "@gardener/css/runtime";

export type GardenerPlatform = "web" | "mobile" | "tablet" | "desktop" | "pwa" | "desktop-webview" | "tauri" | "electron" | "print";
export type GardenerComponentKind = "css" | "interactive";
export type GardenerConfigValue = string | number | boolean | null | undefined;

export interface GardenerComponentDefinition {
  readonly name: string;
  readonly exportName: string;
  readonly category: string;
  readonly type: GardenerComponentKind;
  readonly selector: string;
  readonly cssSelector?: string;
  readonly className?: string;
  readonly tag: string;
  readonly variants: readonly string[];
  readonly states: readonly string[];
  readonly parts: readonly string[];
  readonly behaviors: readonly GardenerBehaviorName[];
  readonly platforms: readonly GardenerPlatform[];
}

export interface GardenerComponentPublicInstance {
  readonly element: Element | null;
  getInstance(behavior?: GardenerBehaviorName | string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
  refresh(): void;
}

export interface GardenerThemeState {
  theme?: string;
  mode?: "light" | "dark" | "system" | string;
  neutral?: string;
  typography?: string;
  shape?: string;
  density?: string;
  elevation?: string;
  motion?: string;
  platform?: GardenerPlatform | string;
  os?: string;
}

export type GardenerTargetValue = Element | Document | GardenerComponentPublicInstance;
export type GardenerElementTarget = GardenerTargetValue | Ref<GardenerTargetValue | null | undefined> | null | undefined;
export type GardenerEventHandler<T = Record<string, unknown>> = (event: CustomEvent<T>) => void;

export interface GardenerDirectiveOptions {
  behavior: GardenerBehaviorName | string | readonly (GardenerBehaviorName | string)[];
  config?: Readonly<Record<string, GardenerConfigValue>>;
}

export type GardenerDirectiveValue = GardenerBehaviorName | string | readonly (GardenerBehaviorName | string)[] | GardenerDirectiveOptions;
export type GardenerAs = string | Component;
export type { GardenerBehaviorInstance, GardenerBehaviorName, GardenerEventName } from "@gardener/css/runtime";
