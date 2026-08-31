import Gardenerim, {
  Gardenerim as namedGardenerim,
  destroy,
  emit,
  getInstance,
  init,
  observe,
  register,
  toast,
  type GardenerimBehaviorFactory,
  type GardenerimBehaviorName,
  type GardenerimEventName,
} from "@gardenerim/css";
import { bindTauriWindowControls, type GardenerimTauriBridge } from "@gardenerim/css/tauri";
import { bindElectronWindowControls, type GardenerimElectronBridge } from "@gardenerim/css/electron";
import runtime, { init as initRuntime } from "@gardenerim/css/runtime";
import runtimeJs from "@gardenerim/css/runtime.js";
import runtimeMin from "@gardenerim/css/runtime.min.js";
import { bindTauriWindowControls as bindTauriMin } from "@gardenerim/css/tauri.min.js";
import { bindElectronWindowControls as bindElectronMin } from "@gardenerim/css/electron.min.js";

const behavior: GardenerimBehaviorName = "dialog";
const event: GardenerimEventName = "open";
const factory: GardenerimBehaviorFactory = (element) => ({ element, destroy() {} });
register("consumer-test", factory);
init(document);
destroy(document);
observe();
emit(document, event, { behavior });
toast({ title: "Saved", tone: "success", timeout: 1000 });
getInstance("[data-g-dialog]", "dialog")?.destroy?.();
Gardenerim.init();
namedGardenerim.destroy();

const tauriBridge: GardenerimTauriBridge = { minimize() {} };
const electronBridge: GardenerimElectronBridge = { windowAction() {} };
bindTauriWindowControls(document, tauriBridge).destroy();
bindElectronWindowControls(document, electronBridge).destroy();
initRuntime();
runtime.init();
runtimeJs.observe();
runtimeMin.destroy();
bindTauriMin(document, tauriBridge).destroy();
bindElectronMin(document, electronBridge).destroy();
