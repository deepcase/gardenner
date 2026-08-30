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
} from "@gardener/css";
import { bindTauriWindowControls, type GardenerTauriBridge } from "@gardener/css/tauri";
import { bindElectronWindowControls, type GardenerElectronBridge } from "@gardener/css/electron";
import runtime, { init as initRuntime } from "@gardener/css/runtime";
import runtimeJs from "@gardener/css/runtime.js";
import runtimeMin from "@gardener/css/runtime.min.js";
import { bindTauriWindowControls as bindTauriMin } from "@gardener/css/tauri.min.js";
import { bindElectronWindowControls as bindElectronMin } from "@gardener/css/electron.min.js";

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
