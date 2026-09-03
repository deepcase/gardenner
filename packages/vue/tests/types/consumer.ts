import { createApp, h, ref } from "vue";
import GardenerimVue, {
  GButton,
  GDialog,
  GardenerimComponent,
  GardenerimProvider,
  componentByName,
  useGardenerim,
  useGardenerimBehavior,
  useGardenerimEvent,
  useGardenerimLocale,
  useGardenerimTheme,
  useGardenerimToast,
  vGardenerim,
  type GardenerimBehaviorName,
  type GardenerimBehaviorInstance,
  type GardenerimComponentDefinition,
} from "../../src/index.js";

const app = createApp({ render: () => h(GardenerimProvider, { theme: "garden", mode: "light" }, () => h(GButton, { variant: "primary" }, () => "Save")) });
app.use(GardenerimVue).directive("gardener-again", vGardenerim);
const element = ref<Element | null>(null);
const behavior: GardenerimBehaviorName = "dialog";
interface DialogBehavior extends GardenerimBehaviorInstance { open(): void; close(): void }
useGardenerim(element);
useGardenerimBehavior<DialogBehavior>(element, behavior).instance.value?.open();
useGardenerimEvent(element, "open", (event) => event.detail);
useGardenerimLocale().configure({ locale: ["fr", "en"] });
useGardenerimTheme({ theme: "ocean", mode: "system" }, element);
useGardenerimToast().show({ message: "Saved", tone: "success" });
const definition: GardenerimComponentDefinition = componentByName.get("dialog")!;
h(GardenerimComponent, { definition });
h(GDialog, { config: { startOpen: true } });
h(GButton, { modelValue: "save", modelEvent: "change", modelKey: "value", "onUpdate:modelValue": (value: unknown) => value });
