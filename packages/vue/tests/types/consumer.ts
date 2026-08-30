import { createApp, h, ref } from "vue";
import GardenerVue, {
  GButton,
  GDialog,
  GardenerComponent,
  GardenerProvider,
  componentByName,
  useGardener,
  useGardenerBehavior,
  useGardenerEvent,
  useGardenerTheme,
  useGardenerToast,
  vGardener,
  type GardenerBehaviorName,
  type GardenerBehaviorInstance,
  type GardenerComponentDefinition,
} from "../../src/index.js";

const app = createApp({ render: () => h(GardenerProvider, { theme: "garden", mode: "light" }, () => h(GButton, { variant: "primary" }, () => "Save")) });
app.use(GardenerVue).directive("gardener-again", vGardener);
const element = ref<Element | null>(null);
const behavior: GardenerBehaviorName = "dialog";
interface DialogBehavior extends GardenerBehaviorInstance { open(): void; close(): void }
useGardener(element);
useGardenerBehavior<DialogBehavior>(element, behavior).instance.value?.open();
useGardenerEvent(element, "open", (event) => event.detail);
useGardenerTheme({ theme: "ocean", mode: "system" }, element);
useGardenerToast().show({ message: "Saved", tone: "success" });
const definition: GardenerComponentDefinition = componentByName.get("dialog")!;
h(GardenerComponent, { definition });
h(GDialog, { config: { startOpen: true } });
h(GButton, { modelValue: "save", modelEvent: "change", modelKey: "value", "onUpdate:modelValue": (value: unknown) => value });
