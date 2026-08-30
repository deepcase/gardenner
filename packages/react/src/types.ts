import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import type { GardenerBehaviorInstance as RuntimeBehaviorInstance, GardenerBehaviorName as RuntimeBehaviorName, GardenerEventName as RuntimeEventName } from "@gardenerim/css/runtime";

export type GardenerAs = ElementType;
export type GardenerBehaviorName = RuntimeBehaviorName;
export type GardenerEventName = RuntimeEventName;
export type GardenerBehaviorInstance = RuntimeBehaviorInstance;
export type GardenerPlatform = "web" | "mobile" | "desktop" | "tauri" | "electron";
export type GardenerComponentKind = "css" | "hybrid" | string;
export type GardenerConfigValue = string | number | boolean | null | undefined;
export type GardenerValueChange = (value: unknown, event: Event) => void;

export interface GardenerComponentDefinition {
  readonly name: string;
  readonly exportName: string;
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
  readonly element: Element | null;
  getInstance(behavior?: string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
  refresh(): void;
}

export interface GardenerOwnProps {
  as?: GardenerAs;
  variant?: string | readonly string[];
  state?: string | readonly string[];
  config?: Readonly<Record<string, GardenerConfigValue>>;
  initialize?: boolean;
  value?: unknown;
  defaultValue?: unknown;
  valueEvent?: string;
  valueKey?: string;
  onValueChange?: GardenerValueChange;
  children?: ReactNode;
}

export type GardenerComponentProps<E extends ElementType = "div"> = GardenerOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof GardenerOwnProps | "className"> & { className?: string };

export type GardenerGeneratedComponent<TDefault extends ElementType = ElementType> = <E extends ElementType = TDefault>(
  props: GardenerComponentProps<E> & { ref?: React.Ref<GardenerComponentHandle> },
) => React.ReactElement | null;

export interface GardenerThemeState {
  theme?: string;
  mode?: string;
  neutral?: string;
  typography?: string;
  shape?: string;
  density?: string;
  elevation?: string;
  motion?: string;
  platform?: string;
  os?: string;
}

export type GardenerTargetValue = Element | Document | GardenerComponentHandle;
export type GardenerElementTarget = GardenerTargetValue | React.RefObject<GardenerTargetValue | null> | null | undefined;
export type GardenerEventHandler<T = Record<string, unknown>> = (event: CustomEvent<T>) => void;
