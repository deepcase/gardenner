import type { RefObject } from "react";
import type { GardenerimComponentHandle } from "./types.js";

export type GardenerimAdapterTarget = Element | GardenerimComponentHandle | null;

export const adapterRootValue = (root?: RefObject<GardenerimAdapterTarget>): Document | Element | undefined => {
  if (!root) return typeof document === "undefined" ? undefined : document;
  const value = root.current;
  return value && typeof value === "object" && "element" in value ? value.element ?? undefined : value ?? undefined;
};
