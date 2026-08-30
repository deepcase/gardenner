import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { bindTauriWindowControls, type GardenerTauriBinding, type GardenerTauriBridge } from "@gardener/css/tauri";
import { adapterRootValue, type GardenerAdapterTarget } from "./adapter-target.js";

export const useTauriWindowControls = (root?: RefObject<GardenerAdapterTarget>, bridge?: GardenerTauriBridge | null) => {
  const rootRef = useRef(root);
  const bridgeRef = useRef(bridge);
  const [binding, setBinding] = useState<GardenerTauriBinding | null>(null);
  const bindingRef = useRef<GardenerTauriBinding | null>(null);

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
export type { GardenerTauriBinding, GardenerTauriBridge };
