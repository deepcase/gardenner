import Gardener, {
  Gardener as namedGardener,
  destroy,
  emit,
  getInstance,
  init,
  observe,
  register,
  toast,
  type GardenerBehaviorFactory,
  type GardenerBehaviorName,
  type GardenerEventName,
} from "@gardenerim/css";
import { bindTauriWindowControls, type GardenerTauriBridge } from "@gardenerim/css/tauri";
import { bindElectronWindowControls, type GardenerElectronBridge } from "@gardenerim/css/electron";
import runtime, { init as initRuntime } from "@gardenerim/css/runtime";
import runtimeJs from "@gardenerim/css/runtime.js";
import runtimeMin from "@gardenerim/css/runtime.min.js";
import { bindTauriWindowControls as bindTauriMin } from "@gardenerim/css/tauri.min.js";
import { bindElectronWindowControls as bindElectronMin } from "@gardenerim/css/electron.min.js";

const behavior: GardenerBehaviorName = "dialog";
const event: GardenerEventName = "open";
const factory: GardenerBehaviorFactory = (element) => ({ element, destroy() {} });
register("consumer-test", factory);
init(document);
destroy(document);
observe();
emit(document, event, { behavior });
toast({ title: "Saved", tone: "success", timeout: 1000 });
getInstance("[data-g-dialog]", "dialog")?.destroy?.();
Gardener.init();
namedGardener.destroy();

const tauriBridge: GardenerTauriBridge = { minimize() {} };
const electronBridge: GardenerElectronBridge = { windowAction() {} };
bindTauriWindowControls(document, tauriBridge).destroy();
bindElectronWindowControls(document, electronBridge).destroy();
initRuntime();
runtime.init();
runtimeJs.observe();
runtimeMin.destroy();
bindTauriMin(document, tauriBridge).destroy();
bindElectronMin(document, electronBridge).destroy();
