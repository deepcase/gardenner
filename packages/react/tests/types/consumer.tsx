import { createRef } from "react";
import {
  GButton, GDialog, GInput, GNavbar, GardenerimComponent, GardenerimProvider, componentByName, useGardenerim, useGardenerimBehavior,
  useGardenerimEvent, useGardenerimTheme, useGardenerimToast, type GardenerimBehaviorInstance, type GardenerimBehaviorName,
  type GardenerimComponentDefinition, type GardenerimComponentHandle,
} from "../../src/index.js";

const element = createRef<Element>();
const component = createRef<GardenerimComponentHandle>();
const behavior: GardenerimBehaviorName = "dialog";
interface DialogBehavior extends GardenerimBehaviorInstance { open(): void; close(): void }
useGardenerim(element);
useGardenerimBehavior<DialogBehavior>(component, behavior).instance?.open();
useGardenerimEvent(component, "open", (event) => event.detail);
useGardenerimTheme({ theme: "ocean", mode: "system" }, component);
useGardenerimToast().show({ message: "Saved", tone: "success" });
const definition: GardenerimComponentDefinition = componentByName.get("dialog")!;
const dynamic = <GardenerimComponent definition={definition}>Dialog</GardenerimComponent>;
const app = <GardenerimProvider theme="garden" mode="light"><GButton variant="primary">Save</GButton></GardenerimProvider>;
const dialog = <GDialog config={{ startOpen: true }} ref={component}>Dialog</GDialog>;
const controlled = <GButton value="save" valueEvent="change" valueKey="value" onValueChange={(value) => value}>Save</GButton>;
const intrinsicTypes = [<GInput type="email" autoComplete="email" />, <GButton type="submit">Submit</GButton>, <GNavbar aria-label="Primary" />];
const providerAttributes = <GardenerimProvider id="app" className="shell" style={{ minHeight: 100 }} aria-label="Application">Content</GardenerimProvider>;
void [dynamic, app, dialog, controlled, intrinsicTypes, providerAttributes];
