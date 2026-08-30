import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { bindElectronWindowControls, type GardenerElectronBinding, type GardenerElectronBridge } from "@gardener/css/electron";
import { adapterRootValue, type GardenerAdapterTarget } from "./adapter-target.js";

export const useElectronWindowControls = (root?: RefObject<GardenerAdapterTarget>, bridge?: GardenerElectronBridge | null) => {
  const rootRef = useRef(root);
  const bridgeRef = useRef(bridge);
  const [binding, setBinding] = useState<GardenerElectronBinding | null>(null);
  const bindingRef = useRef<GardenerElectronBinding | null>(null);

  rootRef.current = root;
  bridgeRef.current = bridge;

  const bind = useCallback(() => {
    bindingRef.current?.destroy();
    const target = adapterRootValue(rootRef.current);
    const next = target ? bindElectronWindowControls(target, bridgeRef.current) : null;
    bindingRef.current = next;
    setBinding(next);
    return next;
  }, []);
  useEffect(() => { bind(); return () => { bindingRef.current?.destroy(); bindingRef.current = null; }; }, [bind]);
  return { binding, bind } as const;
};

export { bindElectronWindowControls };
export type { GardenerElectronBinding, GardenerElectronBridge };
