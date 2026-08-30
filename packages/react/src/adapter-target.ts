import type { RefObject } from "react";
import type { GardenerComponentHandle } from "./types.js";

export type GardenerAdapterTarget = Element | GardenerComponentHandle | null;

export const adapterRootValue = (root?: RefObject<GardenerAdapterTarget>): Document | Element | undefined => {
  if (!root) return typeof document === "undefined" ? undefined : document;
  const value = root.current;
  return value && typeof value === "object" && "element" in value ? value.element ?? undefined : value ?? undefined;
};
