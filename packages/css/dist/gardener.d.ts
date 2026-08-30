/** Gardener 1.0.0 runtime declarations. Generated from metadata/public-api.json. */
export type GardenerBehaviorName = "dialog" | "drawer" | "mobile-sheet" | "dropdown" | "tabs" | "accordion" | "auto-resize" | "combobox" | "password-toggle" | "clear-input" | "otp-input" | "password-strength" | "auth-timer" | "quantity-stepper" | "sku-selector" | "cart" | "coupon" | "pull-refresh" | "infinite-load" | "swipe-actions" | "wheel-picker" | "ai-composer" | "prompt-fill" | "ai-approval" | "ai-feedback" | "shortcut-recorder" | "desktop-tabs" | "native-file-picker" | "window-switcher" | "character-count" | "conditional-field" | "repeatable-field" | "tooltip" | "popover" | "tour" | "carousel" | "split-pane" | "tree" | "data-grid" | "table-sort" | "row-select" | "row-disclosure" | "column-toggle" | "data-filter" | "data-view" | "transfer" | "picker" | "cascader" | "saved-choice" | "builder-list" | "toast" | "copy" | "fullscreen" | "scroll-top" | "dropzone" | "nav-toggle" | "roving-nav" | "context-menu" | "scrollspy" | "jump-nav" | "upload-manager" | "file-browser" | "editor-shell" | "revision-compare" | "autosave" | "command-palette";
export type GardenerEventName = "add" | "approval" | "attachmentremove" | "authtimerexpired" | "authtimerstart" | "autosavestate" | "beforeapproval" | "beforeclose" | "beforefilepicker" | "beforeopen" | "beforepromptstop" | "beforepromptsubmit" | "beforetabclose" | "builderchange" | "cartchange" | "cartremove" | "cascadechange" | "change" | "clear" | "close" | "collapse" | "columnchange" | "composerstate" | "copy" | "count" | "couponchange" | "desktoptabchange" | "desktoptabclose" | "disclosure" | "dismiss" | "drop" | "editorchange" | "editorcommand" | "error" | "expand" | "feedbackchange" | "feedbacksubmit" | "filefilter" | "files" | "fileselect" | "fileview" | "filter" | "fullscreenchange" | "init" | "loadcomplete" | "loadmore" | "nativefiles" | "open" | "otpchange" | "otpcomplete" | "passwordstrength" | "pickerchange" | "promptfill" | "promptstop" | "promptsubmit" | "quantitychange" | "refresh" | "refreshcomplete" | "remove" | "resize" | "revisionview" | "savedchoice" | "selectionchange" | "shortcutchange" | "skuchange" | "sort" | "swipechange" | "toggle" | "transferchange" | "uploadadd" | "uploadchange" | "viewchange" | "wheelchange" | "windowactivate" | "windowselect";
export type GardenerRoot = Document | DocumentFragment | Element;

export interface GardenerBehaviorInstance {
  destroy?: () => void;
  [member: string]: unknown;
}

export type GardenerBehaviorFactory = (element: Element) => GardenerBehaviorInstance | null | void;

export interface GardenerToastOptions {
  title?: string;
  message?: string;
  tone?: "success" | "warning" | "danger" | "info" | string;
  timeout?: number;
}

export interface GardenerAPI {
  readonly version: "1.0.0";
  readonly behaviors: readonly GardenerBehaviorName[];
  init(root?: GardenerRoot): Readonly<GardenerAPI>;
  destroy(root?: GardenerRoot): void;
  register(name: string, factory: GardenerBehaviorFactory): void;
  getInstance(elementOrSelector: Element | string, name: string): GardenerBehaviorInstance | null;
  getInstance(elementOrSelector: Element | string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
  emit(element: EventTarget, name: GardenerEventName | string, detail?: Record<string, unknown>): boolean;
  toast(options?: GardenerToastOptions): HTMLElement;
  observe(): void;
}

export declare function init(root?: GardenerRoot): Readonly<GardenerAPI>;
export declare function destroy(root?: GardenerRoot): void;
export declare function register(name: string, factory: GardenerBehaviorFactory): void;
export declare function getInstance(elementOrSelector: Element | string, name: string): GardenerBehaviorInstance | null;
export declare function getInstance(elementOrSelector: Element | string): GardenerBehaviorInstance | Record<string, GardenerBehaviorInstance> | null;
export declare function emit(element: EventTarget, name: GardenerEventName | string, detail?: Record<string, unknown>): boolean;
export declare function toast(options?: GardenerToastOptions): HTMLElement;
export declare function observe(): void;
export declare const Gardener: Readonly<GardenerAPI>;
export default Gardener;
