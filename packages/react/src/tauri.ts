import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { bindTauriWindowControls, type GardenerimTauriBinding, type GardenerimTauriBridge } from "@gardenerim/css/tauri";
import { adapterRootValue, type GardenerimAdapterTarget } from "./adapter-target.js";

export const useTauriWindowControls = (root?: RefObject<GardenerimAdapterTarget>, bridge?: GardenerimTauriBridge | null) => {
  const rootRef = useRef(root);
  const bridgeRef = useRef(bridge);
  const [binding, setBinding] = useState<GardenerimTauriBinding | null>(null);
  const bindingRef = useRef<GardenerimTauriBinding | null>(null);

  rootRef.current = root;
  bridgeRef.current = bridge;

  const bind = useCallback(() => {
    bindingRef.current?.destroy();
    const target = adapterRootValue(rootRef.current);
    const next = target ? bindTauriWindowControls(target, bridgeRef.current) : null;
    bindingRef.current = next;
    setBinding(next);
    return next;
  }, []);
  useEffect(() => { bind(); return () => { bindingRef.current?.destroy(); bindingRef.current = null; }; }, [bind]);
  return { binding, bind } as const;
};

export { bindTauriWindowControls };
export type { GardenerimTauriBinding, GardenerimTauriBridge };
