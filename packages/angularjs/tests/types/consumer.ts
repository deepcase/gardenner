import type angular from "angular";
import {
  GButtonDirective,
  GInputDirective,
  componentByDirectiveName,
  createGardenerimAngularJS,
  type GardenerimAngularJSOptions,
  type GardenerimAngularJSComponentExportName,
  type GardenerimComponentHandle,
  type GardenerimThemeState,
} from "@gardenerim/angularjs";

declare const ng: angular.IAngularStatic;
const options: GardenerimAngularJSOptions = { components: ["button", "gInput"], initialize: true };
const exportName: GardenerimAngularJSComponentExportName = "GButtonDirective";
// @ts-expect-error unknown component selectors must fail at compile time
const invalidOptions: GardenerimAngularJSOptions = { components: ["not-a-component"] };
const moduleName: string = createGardenerimAngularJS(ng, options);
ng.module("consumer", [moduleName]).directive("customButton", GButtonDirective).directive("customInput", GInputDirective);
const definition = componentByDirectiveName.get("gButton");
const handle = null as GardenerimComponentHandle | null;
const theme: GardenerimThemeState = { theme: "garden", mode: "light", shape: "small" };
void [definition, handle, theme, exportName, invalidOptions];
