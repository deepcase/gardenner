import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import type { GardenerimBehaviorInstance as RuntimeBehaviorInstance, GardenerimBehaviorName as RuntimeBehaviorName, GardenerimEventName as RuntimeEventName } from "@gardenerim/css/runtime";

export type GardenerimAs = ElementType;
export type GardenerimBehaviorName = RuntimeBehaviorName;
export type GardenerimEventName = RuntimeEventName;
export type GardenerimBehaviorInstance = RuntimeBehaviorInstance;
export type GardenerimPlatform = "web" | "mobile" | "desktop" | "tauri" | "electron";
export type GardenerimComponentKind = "css" | "hybrid" | string;
export type GardenerimConfigValue = string | number | boolean | null | undefined;
export type GardenerimValueChange = (value: unknown, event: Event) => void;

export interface GardenerimComponentDefinition {
  readonly name: string;
  readonly exportName: string;
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
  readonly element: Element | null;
  getInstance(behavior?: string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  refresh(): void;
}

export interface GardenerimOwnProps {
  as?: GardenerimAs;
  variant?: string | readonly string[];
  state?: string | readonly string[];
  config?: Readonly<Record<string, GardenerimConfigValue>>;
  initialize?: boolean;
  value?: unknown;
  defaultValue?: unknown;
  valueEvent?: string;
  valueKey?: string;
  onValueChange?: GardenerimValueChange;
  children?: ReactNode;
}

export type GardenerimComponentProps<E extends ElementType = "div"> = GardenerimOwnProps &
  Omit<ComponentPropsWithoutRef<E>, keyof GardenerimOwnProps | "className"> & { className?: string };

export type GardenerimGeneratedComponent<TDefault extends ElementType = ElementType> = <E extends ElementType = TDefault>(
  props: GardenerimComponentProps<E> & { ref?: React.Ref<GardenerimComponentHandle> },
) => React.ReactElement | null;

export interface GardenerimThemeState {
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

export type GardenerimTargetValue = Element | Document | GardenerimComponentHandle;
export type GardenerimElementTarget = GardenerimTargetValue | React.RefObject<GardenerimTargetValue | null> | null | undefined;
export type GardenerimEventHandler<T = Record<string, unknown>> = (event: CustomEvent<T>) => void;
