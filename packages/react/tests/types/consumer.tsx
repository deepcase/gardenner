import { createRef } from "react";
import {
  GButton, GDialog, GInput, GNavbar, GardenerComponent, GardenerProvider, componentByName, useGardener, useGardenerBehavior,
  useGardenerEvent, useGardenerTheme, useGardenerToast, type GardenerBehaviorInstance, type GardenerBehaviorName,
  type GardenerComponentDefinition, type GardenerComponentHandle,
} from "../../src/index.js";

const element = createRef<Element>();
const component = createRef<GardenerComponentHandle>();
const behavior: GardenerBehaviorName = "dialog";
interface DialogBehavior extends GardenerBehaviorInstance { open(): void; close(): void }
useGardener(element);
useGardenerBehavior<DialogBehavior>(component, behavior).instance?.open();
useGardenerEvent(component, "open", (event) => event.detail);
useGardenerTheme({ theme: "ocean", mode: "system" }, component);
useGardenerToast().show({ message: "Saved", tone: "success" });
const definition: GardenerComponentDefinition = componentByName.get("dialog")!;
const dynamic = <GardenerComponent definition={definition}>Dialog</GardenerComponent>;
const app = <GardenerProvider theme="garden" mode="light"><GButton variant="primary">Save</GButton></GardenerProvider>;
const dialog = <GDialog config={{ startOpen: true }} ref={component}>Dialog</GDialog>;
const controlled = <GButton value="save" valueEvent="change" valueKey="value" onValueChange={(value) => value}>Save</GButton>;
const intrinsicTypes = [<GInput type="email" autoComplete="email" />, <GButton type="submit">Submit</GButton>, <GNavbar aria-label="Primary" />];
const providerAttributes = <GardenerProvider id="app" className="shell" style={{ minHeight: 100 }} aria-label="Application">Content</GardenerProvider>;
void [dynamic, app, dialog, controlled, intrinsicTypes, providerAttributes];
