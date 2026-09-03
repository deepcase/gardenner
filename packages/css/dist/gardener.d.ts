/** Gardenerim 2.1.0 runtime declarations. Generated from metadata/public-api.json. */
export type GardenerimBehaviorName = "dialog" | "drawer" | "mobile-sheet" | "dropdown" | "tabs" | "accordion" | "auto-resize" | "combobox" | "password-toggle" | "clear-input" | "otp-input" | "password-strength" | "auth-timer" | "quantity-stepper" | "sku-selector" | "cart" | "coupon" | "pull-refresh" | "infinite-load" | "swipe-actions" | "wheel-picker" | "ai-composer" | "prompt-fill" | "ai-approval" | "ai-feedback" | "shortcut-recorder" | "desktop-tabs" | "native-file-picker" | "window-switcher" | "character-count" | "field-sync" | "conditional-field" | "repeatable-field" | "tooltip" | "popover" | "tour" | "carousel" | "split-pane" | "tree" | "data-grid" | "table-scroll" | "table-density" | "filter-summary" | "table-sort" | "row-select" | "row-disclosure" | "column-toggle" | "data-filter" | "data-view" | "transfer" | "picker" | "cascader" | "range-picker" | "saved-choice" | "builder-list" | "toast" | "copy" | "fullscreen" | "scroll-top" | "dropzone" | "nav-toggle" | "roving-nav" | "context-menu" | "scrollspy" | "jump-nav" | "upload-manager" | "file-browser" | "media-player" | "editor-shell" | "revision-compare" | "autosave" | "command-palette";
export type GardenerimEventName = "add" | "approval" | "attachmentremove" | "authtimerexpired" | "authtimerstart" | "autosavestate" | "beforeapproval" | "beforeclose" | "beforefilepicker" | "beforeopen" | "beforepromptstop" | "beforepromptsubmit" | "beforetabclose" | "builderchange" | "cartchange" | "cartremove" | "cascadechange" | "change" | "clear" | "close" | "collapse" | "columnchange" | "composerstate" | "copy" | "count" | "couponchange" | "densitychange" | "desktoptabchange" | "desktoptabclose" | "disclosure" | "dismiss" | "drop" | "editorchange" | "editorcommand" | "error" | "expand" | "feedbackchange" | "feedbacksubmit" | "fieldchange" | "filefilter" | "files" | "fileselect" | "fileview" | "filter" | "fullscreenchange" | "init" | "loadcomplete" | "loadmore" | "mediachange" | "nativefiles" | "open" | "otpchange" | "otpcomplete" | "passwordstrength" | "pickerchange" | "promptfill" | "promptstop" | "promptsubmit" | "quantitychange" | "refresh" | "refreshcomplete" | "remove" | "rangechange" | "resize" | "revisionview" | "savedchoice" | "selectionchange" | "shortcutchange" | "skuchange" | "sort" | "swipechange" | "toggle" | "transferchange" | "uploadadd" | "uploadchange" | "viewchange" | "wheelchange" | "windowactivate" | "windowselect";
export type GardenerimRoot = Document | DocumentFragment | Element;

export interface GardenerimBehaviorInstance {
  destroy?: () => void;
  [member: string]: unknown;
}

export type GardenerimBehaviorFactory = (element: Element) => GardenerimBehaviorInstance | null | void;

export interface GardenerimToastOptions {
  title?: string;
  message?: string;
  tone?: "success" | "warning" | "danger" | "error" | "info" | string;
  timeout?: number;
}

export interface GardenerimConfiguration {
  readonly locale: string;
  readonly messages: Readonly<Record<string, string>>;
  readonly supportedLocales: readonly string[];
}

export interface GardenerimConfigureOptions {
  locale?: string | readonly string[];
  messages?: Readonly<Record<string, string>>;
  root?: GardenerimRoot;
  refresh?: boolean;
}

export interface GardenerimObserveOptions {
  subtree?: boolean;
  attributes?: boolean;
}

export interface GardenerimStartOptions {
  observe?: boolean;
  observeOptions?: GardenerimObserveOptions;
}

export interface GardenerimAPI {
  readonly version: "2.1.0";
  readonly behaviors: readonly GardenerimBehaviorName[];
  readonly started: boolean;
  readonly locale: string;
  readonly supportedLocales: readonly string[];
  init(root?: GardenerimRoot): Readonly<GardenerimAPI>;
  refresh(root?: GardenerimRoot): Readonly<GardenerimAPI>;
  destroy(root?: GardenerimRoot): void;
  register(name: string, factory: GardenerimBehaviorFactory): void;
  getInstance<Row extends object = Record<string, unknown>>(elementOrSelector: Element | string, name: "data-grid"): GardenerimDataGridInstance<Row> | null;
  getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
  getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
  toast(options?: GardenerimToastOptions): HTMLElement;
  observe(root?: GardenerimRoot, options?: GardenerimObserveOptions): { disconnect(): void };
  disconnect(): void;
  start(root?: GardenerimRoot, options?: GardenerimStartOptions): Readonly<GardenerimAPI>;
  stop(options?: { destroy?: boolean; root?: GardenerimRoot }): void;
  configure(options?: GardenerimConfigureOptions): GardenerimConfiguration;
  getConfiguration(): GardenerimConfiguration;
}

export declare function init(root?: GardenerimRoot): Readonly<GardenerimAPI>;
export declare function refresh(root?: GardenerimRoot): Readonly<GardenerimAPI>;
export declare function destroy(root?: GardenerimRoot): void;
export declare function register(name: string, factory: GardenerimBehaviorFactory): void;
export declare function getInstance<Row extends object = Record<string, unknown>>(elementOrSelector: Element | string, name: "data-grid"): GardenerimDataGridInstance<Row> | null;
export declare function getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
export declare function getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
export declare function emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
export declare function toast(options?: GardenerimToastOptions): HTMLElement;
export declare function observe(root?: GardenerimRoot, options?: GardenerimObserveOptions): { disconnect(): void };
export declare function disconnect(): void;
export declare function start(root?: GardenerimRoot, options?: GardenerimStartOptions): Readonly<GardenerimAPI>;
export declare function stop(options?: { destroy?: boolean; root?: GardenerimRoot }): void;
export declare function configure(options?: GardenerimConfigureOptions): GardenerimConfiguration;
export declare function getConfiguration(): GardenerimConfiguration;
export declare const supportedLocales: readonly string[];
export declare const Gardenerim: Readonly<GardenerimAPI>;
export default Gardenerim;
/** Opt-in managed DataGrid. Keys must be stable, unique strings/numbers. */
export type GardenerimRowKey = string | number;
export interface GardenerimGridColumn<Row extends object = Record<string, unknown>> {
  field: Extract<keyof Row, string>;
  title?: string;
  type?: "text" | "number";
  sortable?: boolean;
  editable?: boolean;
  format?: (value: Row[keyof Row], row: Row) => string | number;
}
export interface GardenerimGridQuery {
  page: number;
  pageSize: number;
  sort: { field: string; direction: "asc" | "desc" } | null;
  filter: string;
  signal: AbortSignal;
}
export interface GardenerimGridState extends Omit<GardenerimGridQuery, "signal"> {
  total: number;
  selectedKeys: GardenerimRowKey[];
  loading: boolean;
  error: string;
}
export interface GardenerimGridChange<Row extends object = Record<string, unknown>> extends GardenerimGridState {
  reason: "page" | "sort" | "filter" | "selection" | "edit" | "load" | "error";
  key?: GardenerimRowKey;
  field?: Extract<keyof Row, string>;
  value?: unknown;
  previous?: unknown;
  row?: Row;
}
export interface GardenerimDataGridOptions<Row extends object = Record<string, unknown>> {
  columns: readonly GardenerimGridColumn<Row>[];
  rows?: readonly Row[];
  rowKey?: Extract<keyof Row, string>;
  mode?: "client" | "server";
  page?: number;
  pageSize?: number;
  total?: number;
  sort?: GardenerimGridQuery["sort"];
  filter?: string;
  selectable?: boolean;
  selectedKeys?: readonly GardenerimRowKey[];
  virtual?: boolean;
  rowHeight?: number;
  height?: number;
  locale?: string;
  labels?: Partial<Record<"select" | "loading" | "empty" | "previous" | "next", string>>;
  load?: (query: GardenerimGridQuery) => Promise<{ rows: readonly Row[]; total: number }>;
  onChange?: (event: GardenerimGridChange<Row>) => void;
}
export interface GardenerimDataGridInstance<Row extends object = Record<string, unknown>> extends GardenerimBehaviorInstance {
  focus(cell: HTMLElement): void;
  destroy(): void;
  refresh(): void;
  setOptions(options: GardenerimDataGridOptions<Row>): GardenerimGridState;
  setRows(rows: readonly Row[], total?: number): GardenerimGridState;
  setPage(page: number, pageSize?: number): GardenerimGridState | Promise<GardenerimGridState>;
  setSort(field: Extract<keyof Row, string> | null, direction?: "asc" | "desc"): GardenerimGridState | Promise<GardenerimGridState>;
  setFilter(value: string): GardenerimGridState | Promise<GardenerimGridState>;
  select(key: GardenerimRowKey, checked?: boolean): GardenerimRowKey[];
  getState(): GardenerimGridState;
  updateCell<Key extends Extract<keyof Row, string>>(key: GardenerimRowKey, field: Key, value: Row[Key]): Row;
  load(): Promise<GardenerimGridState>;
}
