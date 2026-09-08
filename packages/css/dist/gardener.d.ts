/** Gardenerim 2.2.0 runtime declarations. Generated from metadata/public-api.json. */
export type GardenerimBehaviorName = "dialog" | "drawer" | "mobile-sheet" | "dropdown" | "stepper" | "tag" | "tabs" | "accordion" | "auto-resize" | "combobox" | "password-toggle" | "clear-input" | "otp-input" | "password-strength" | "auth-timer" | "quantity-stepper" | "sku-selector" | "cart" | "coupon" | "pull-refresh" | "infinite-load" | "swipe-actions" | "wheel-picker" | "ai-composer" | "prompt-fill" | "ai-approval" | "ai-feedback" | "shortcut-recorder" | "desktop-tabs" | "native-file-picker" | "window-switcher" | "character-count" | "field-sync" | "conditional-field" | "rating" | "validation-summary" | "repeatable-field" | "tooltip" | "popover" | "tour" | "carousel" | "split-pane" | "foundation" | "tree" | "data-grid" | "data-display" | "dashboard" | "interaction" | "content" | "layout" | "help" | "ai" | "media" | "auth" | "mobile" | "workflow" | "communication" | "legal" | "solution" | "desktop" | "enterprise" | "marketing" | "cms" | "commerce" | "table-scroll" | "table-density" | "filter-summary" | "table-sort" | "row-select" | "row-disclosure" | "column-toggle" | "data-filter" | "data-view" | "transfer" | "picker" | "cascader" | "range-picker" | "saved-choice" | "builder-list" | "toast" | "copy" | "fullscreen" | "scroll-top" | "dropzone" | "nav-toggle" | "roving-nav" | "context-menu" | "scrollspy" | "jump-nav" | "upload-manager" | "file-browser" | "media-player" | "editor-shell" | "revision-compare" | "autosave" | "command-palette";
export type GardenerimEventName = "action" | "add" | "approval" | "attachmentremove" | "authtimerexpired" | "authtimerstart" | "autosaverequest" | "autosavestate" | "beforeapproval" | "beforechange" | "beforeclose" | "beforefilepicker" | "beforeopen" | "beforepromptstop" | "beforepromptsubmit" | "beforetabclose" | "builderchange" | "cartchange" | "cartremove" | "cascadechange" | "change" | "check" | "clear" | "close" | "collapse" | "columnchange" | "commandselect" | "complete" | "composerstate" | "copy" | "count" | "couponchange" | "densitychange" | "desktoptabchange" | "desktoptabclose" | "disclosure" | "dismiss" | "drop" | "editorchange" | "editorcommand" | "error" | "expand" | "export" | "feedbackchange" | "feedbacksubmit" | "fieldchange" | "filefilter" | "files" | "fileselect" | "fileview" | "filter" | "fullscreenchange" | "init" | "loadcomplete" | "loadmore" | "mediachange" | "nativefiles" | "navigationback" | "navigationchange" | "navigationcheck" | "navigationcloseitem" | "navigationcollapse" | "navigationerror" | "navigationexpand" | "navigationloadmore" | "navigationnext" | "navigationopen" | "navigationpagesize" | "navigationprevious" | "navigationselect" | "open" | "otpchange" | "otpcomplete" | "passwordstrength" | "pickerchange" | "promptfill" | "promptstop" | "promptsubmit" | "quantitychange" | "rangechange" | "ratingchange" | "refresh" | "refreshcomplete" | "remove" | "resize" | "revisionview" | "savedchoice" | "selectionchange" | "shortcutchange" | "skuchange" | "sort" | "stepchange" | "swipechange" | "toggle" | "transferchange" | "uploadadd" | "uploadchange" | "validationblocked" | "validationchange" | "validationnavigate" | "viewchange" | "visibilitychange" | "wheelchange" | "windowactivate" | "windowselect";
export type GardenerimRoot = Document | DocumentFragment | Element;

export interface GardenerimBehaviorInstance {
  destroy?: () => void;
  [member: string]: unknown;
}

export type GardenerimBehaviorFactory = (element: Element) => GardenerimBehaviorInstance | null | void;

export type GardenerimToastTone = "normal" | "success" | "warning" | "danger" | "error" | "info" | "loading";
export type GardenerimToastPosition = "top" | "bottom" | "top-start" | "top-end" | "bottom-start" | "bottom-end" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface GardenerimToastConfiguration {
  timeout?: number;
  maxCount?: number;
  position?: GardenerimToastPosition;
  closable?: boolean;
  showIcon?: boolean;
}

export interface GardenerimToastOptions extends GardenerimToastConfiguration {
  id?: string | number;
  title?: string;
  message?: string;
  tone?: GardenerimToastTone;
  timeout?: number;
  duration?: number;
  persistent?: boolean;
  compact?: boolean;
  spacious?: boolean;
  actionLabel?: string;
  actionClose?: boolean;
  onAction?: (element: HTMLElement) => void;
  onClose?: (reason: string, element: HTMLElement) => void;
}

export interface GardenerimToastFunction {
  (options?: GardenerimToastOptions | string): HTMLElement;
  clear(position?: GardenerimToastPosition): void;
  config(options?: GardenerimToastConfiguration): Readonly<Required<GardenerimToastConfiguration>>;
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
  readonly version: "2.2.0";
  readonly behaviors: readonly GardenerimBehaviorName[];
  readonly started: boolean;
  readonly locale: string;
  readonly supportedLocales: readonly string[];
  init(root?: GardenerimRoot): Readonly<GardenerimAPI>;
  refresh(root?: GardenerimRoot): Readonly<GardenerimAPI>;
  destroy(root?: GardenerimRoot): void;
  register(name: string, factory: GardenerimBehaviorFactory): void;
  getInstance<Row extends object = Record<string, unknown>>(elementOrSelector: Element | string, name: "data-grid"): GardenerimDataGridInstance<Row> | null;
  getInstance(elementOrSelector: Element | string, name: "foundation"): GardenerimFoundationInstance | null;
  getInstance(elementOrSelector: Element | string, name: "tree"): GardenerimTreeInstance | null;
  getInstance(elementOrSelector: Element | string, name: "tooltip"): GardenerimTooltipInstance | null;
  getInstance(elementOrSelector: Element | string, name: "popover"): GardenerimPopoverInstance | null;
  getInstance(elementOrSelector: Element | string, name: "table"): GardenerimTableInstance | null;
  getInstance(elementOrSelector: Element | string, name: "data-display"): GardenerimDataDisplayInstance | null;
  getInstance(elementOrSelector: Element | string, name: "dashboard"): GardenerimDashboardInstance | null;
  getInstance(elementOrSelector: Element | string, name: "interaction"): GardenerimInteractionInstance | null;
getInstance(elementOrSelector: Element | string, name: "content"): GardenerimContentInstance | null;
  getInstance(elementOrSelector: Element | string, name: "layout"): GardenerimLayoutInstance | null;
  getInstance(elementOrSelector: Element | string, name: "help"): GardenerimHelpInstance | null;
  getInstance(elementOrSelector: Element | string, name: "ai"): GardenerimAIInstance | null;
  getInstance(elementOrSelector: Element | string, name: "media"): GardenerimMediaInstance | null;
  getInstance(elementOrSelector: Element | string, name: "commerce"): GardenerimCommerceInstance | null;
  getInstance(elementOrSelector: Element | string, name: "auth"): GardenerimAuthInstance | null;
  getInstance(elementOrSelector: Element | string, name: "mobile"): GardenerimMobileInstance | null;
  getInstance(elementOrSelector: Element | string, name: "cms"): GardenerimCmsInstance | null;
  getInstance(elementOrSelector: Element | string, name: "marketing"): GardenerimMarketingInstance | null;
  getInstance(elementOrSelector: Element | string, name: "enterprise"): GardenerimEnterpriseInstance | null;
  getInstance(elementOrSelector: Element | string, name: "desktop"): GardenerimDesktopInstance | null;
  getInstance(elementOrSelector: Element | string, name: "workflow"): GardenerimWorkflowInstance | null;
  getInstance(elementOrSelector: Element | string, name: "communication"): GardenerimCommunicationInstance | null;
  getInstance(elementOrSelector: Element | string, name: "solution"): GardenerimSolutionInstance | null;
  getInstance(elementOrSelector: Element | string, name: "legal"): GardenerimLegalInstance | null;
  getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
  getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
  emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
  toast: GardenerimToastFunction;
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
export declare function getInstance(elementOrSelector: Element | string, name: "foundation"): GardenerimFoundationInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "tree"): GardenerimTreeInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "tooltip"): GardenerimTooltipInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "popover"): GardenerimPopoverInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "table"): GardenerimTableInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "data-display"): GardenerimDataDisplayInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "dashboard"): GardenerimDashboardInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "interaction"): GardenerimInteractionInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "content"): GardenerimContentInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "layout"): GardenerimLayoutInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "help"): GardenerimHelpInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "ai"): GardenerimAIInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "media"): GardenerimMediaInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "commerce"): GardenerimCommerceInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "auth"): GardenerimAuthInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "mobile"): GardenerimMobileInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "cms"): GardenerimCmsInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "marketing"): GardenerimMarketingInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "enterprise"): GardenerimEnterpriseInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "desktop"): GardenerimDesktopInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "workflow"): GardenerimWorkflowInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "communication"): GardenerimCommunicationInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "solution"): GardenerimSolutionInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: "legal"): GardenerimLegalInstance | null;
export declare function getInstance(elementOrSelector: Element | string, name: string): GardenerimBehaviorInstance | null;
export declare function getInstance(elementOrSelector: Element | string): GardenerimBehaviorInstance | Record<string, GardenerimBehaviorInstance> | null;
export declare function emit(element: EventTarget, name: GardenerimEventName | string, detail?: Record<string, unknown>): boolean;
export declare const toast: GardenerimToastFunction;
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
/** Shared CSS/Vue/React/AngularJS/Blazor configuration serialized as overlay-options. */
export interface GardenerimPopoverOptions {
  title?: string; content?: string;
  popupVisible?: boolean; defaultPopupVisible?: boolean;
  trigger?: 'hover'|'focus'|'click'|'contextMenu'|'manual'|readonly ('hover'|'focus'|'click'|'contextMenu')[];
  position?: 'top'|'bottom'|'left'|'right'|'tl'|'tr'|'bl'|'br'|'lt'|'lb'|'rt'|'rb'|'top-start'|'top-end'|'bottom-start'|'bottom-end'|'left-start'|'left-end'|'right-start'|'right-end';
  disabled?: boolean; showArrow?: boolean;
  width?: number|string; height?: number|string; maxHeight?: number|string;
  popupOffset?: number; boundary?: number;
  /** Hover delays in milliseconds. */
  mouseEnterDelay?: number; mouseLeaveDelay?: number;
  closeOnEscape?: boolean; closeOnOutside?: boolean;
  autoFocus?: boolean; restoreFocus?: boolean; topLayer?: boolean;
  contentClass?: string; contentStyle?: Readonly<Record<string,string|number>>;
  arrowClass?: string; arrowStyle?: Readonly<Record<string,string|number>>;
}
export interface GardenerimPopoverInstance extends GardenerimBehaviorInstance {
  open():void; close(reason?:string):void; toggle():void; isOpen():boolean;
  reposition():void; setBusy(value:boolean):void; complete(success?:boolean,error?:string):void; destroy():void;
}

/** Tooltip shares floating options; interactive content belongs in Popover. */
export interface GardenerimTooltipOptions extends Omit<GardenerimPopoverOptions,'title'|'autoFocus'|'restoreFocus'> {mini?:boolean;backgroundColor?:string;}
export interface GardenerimTooltipInstance extends GardenerimBehaviorInstance {open():void;close(reason?:string):void;toggle():void;isOpen():boolean;reposition():void;destroy():void;}
export type GardenerimFoundationKind='affix'|'resize-box'|'scrollbar'|'space'|'watermark'|'overflow-list'|'input-number'|'input-tag'|'color-picker'|'link'|'typography'|'icon';
export interface GardenerimFoundationOptions {kind?:GardenerimFoundationKind;size?:'mini'|'small'|'medium'|'large';disabled?:boolean;readOnly?:boolean;label?:string;name?:string;placeholder?:string;value?:number|string|string[]|null;defaultValue?:number|string|string[]|null;min?:number;max?:number;step?:number;precision?:number;controls?:boolean;allowClear?:boolean;formatter?:(value:number)=>string;parser?:(value:string)=>number|null;maxTagCount?:number;separator?:string;allowDuplicates?:boolean;alpha?:boolean;presets?:string[];defaultWidth?:number;defaultHeight?:number;width?:number;height?:number;minWidth?:number;minHeight?:number;maxWidth?:number;maxHeight?:number;resizeDirections?:('right'|'bottom')[];gap?:number;rowGap?:number;columnGap?:number;direction?:'horizontal'|'vertical';align?:'start'|'center'|'end'|'baseline'|'stretch';justify?:'start'|'center'|'end'|'space-between'|'space-around';wrap?:boolean;block?:boolean;offsetTop?:number;offsetBottom?:number;content?:string;image?:string;rotation?:number;opacity?:number;fontSize?:number;tileWidth?:number;tileHeight?:number;items?:Array<{key:string|number;label:string|number;href?:string;disabled?:boolean}>;collapseFrom?:'start'|'end';maxVisible?:number;href?:string;target?:string;underline?:boolean;text?:string;copyable?:boolean;ellipsis?:number;level?:number;tone?:'normal'|'primary'|'success'|'warning'|'danger'|'muted';icon?:string;iconSize?:number;spin?:boolean;onChange?:(detail:{component:string;reason:string;value:unknown;controlled?:boolean;width?:number;height?:number})=>void;}
export interface GardenerimFoundationState{kind:GardenerimFoundationKind;value:unknown;width:number;height:number;expanded:boolean;affixed:boolean;}
export interface GardenerimFoundationInstance extends GardenerimBehaviorInstance{setOptions(options:Partial<GardenerimFoundationOptions>):GardenerimFoundationState|false;getState():GardenerimFoundationState;refresh():GardenerimFoundationState|false;value():unknown;increment():boolean;decrement():boolean;add(text:string):boolean;remove(index:number):boolean;resize(width:number,height:number):boolean;focus():void;scrollTo(options:ScrollToOptions):boolean;destroy():void;}

/** Data-driven mode requires data-g-tree-options on the tree root. */
export interface GardenerimTreeNode {key?:string|number;title?:string|number;children?:GardenerimTreeNode[];disabled?:boolean;disableCheckbox?:boolean;checkable?:boolean;selectable?:boolean;isLeaf?:boolean;icon?:string;extra?:string;titleTemplate?:string;extraTemplate?:string;[field:string]:unknown;}
export interface GardenerimTreeOptions {data?:GardenerimTreeNode[];size?:'mini'|'small'|'medium'|'large';blockNode?:boolean;multiple?:boolean;checkable?:boolean|((node:GardenerimTreeNode)=>boolean);selectable?:boolean|((node:GardenerimTreeNode)=>boolean);checkStrictly?:boolean;checkedStrategy?:'all'|'parent'|'child';selectedKeys?:Array<string|number>;defaultSelectedKeys?:Array<string|number>;checkedKeys?:Array<string|number>;defaultCheckedKeys?:Array<string|number>;halfCheckedKeys?:Array<string|number>;expandedKeys?:Array<string|number>;defaultExpandedKeys?:Array<string|number>;defaultExpandAll?:boolean;defaultExpandSelected?:boolean;defaultExpandChecked?:boolean;autoExpandParent?:boolean;onlyCheckLeaf?:boolean;showLine?:boolean;disabled?:boolean;draggable?:boolean;dataControlled?:boolean;fieldNames?:Partial<Record<'key'|'title'|'children'|'disabled'|'disableCheckbox'|'selectable'|'checkable'|'isLeaf',string>>;searchValue?:string;filterTreeNode?:(node:GardenerimTreeNode)=>boolean;loadMore?:(node:GardenerimTreeNode,context:{signal:AbortSignal})=>Promise<GardenerimTreeNode[]>|GardenerimTreeNode[];allowDrop?:(source:GardenerimTreeNode,target:GardenerimTreeNode,position:'before'|'inside'|'after')=>boolean;actionOnNodeClick?:'expand'|'check';loading?:boolean;loadingKeys?:Array<string|number>;loadingText?:string;error?:string;emptyText?:string;label?:string;titleTemplate?:string;extraTemplate?:string;indent?:number;serviceTimeout?:number;virtualListProps?:{height:number;overscan?:number};onChange?:(detail:GardenerimTreeState&{reason:string;key?:string|number;node?:GardenerimTreeNode|null;dropKey?:string|number;dropPosition?:string})=>void;}
export interface GardenerimTreeState {data:GardenerimTreeNode[];selectedKeys:Array<string|number>;checkedKeys:Array<string|number>;halfCheckedKeys:Array<string|number>;expandedKeys:Array<string|number>;loadingKeys:Array<string|number>;count:number;visibleCount:number;}
export interface GardenerimTreeInstance extends GardenerimBehaviorInstance {setOptions(options:Partial<GardenerimTreeOptions>):GardenerimTreeState|false;getState():GardenerimTreeState;refresh():GardenerimTreeState|false;select(key:string|number|Element):boolean;check(key:string|number|Element,value?:boolean):boolean;expand(key:string|number|Element,value?:boolean):boolean;load(key:string|number):Promise<boolean>;drop(source:string|number,target:string|number,position?:'before'|'inside'|'after'):boolean;focus(key:string|number|Element):boolean;scrollTo(key:string|number):boolean;value():Array<string|number>;destroy():void;}
/** Shared config['tag-options'] / data-g-tag-options contract. */
export interface GardenerimTagOptions {
 text?:string; size?:'mini'|'small'|'medium'|'large'; color?:string; textColor?:string;
 variant?:'soft'|'solid'|'outline'; bordered?:boolean; nowrap?:boolean; maxWidth?:number|string;
 visible?:boolean|null; defaultVisible?:boolean; checked?:boolean|null; defaultChecked?:boolean;
 closable?:boolean; checkable?:boolean; loading?:boolean; disabled?:boolean;
 label?:string; closeLabel?:string; icon?:string; closeIcon?:string;
 contentTemplate?:string; iconTemplate?:string; closeIconTemplate?:string;
}
export interface GardenerimTagInstance extends GardenerimBehaviorInstance {
 check(value?:boolean,reason?:string):boolean; close(reason?:string):boolean;
 getState():{checked:boolean;visible:boolean;checkable:boolean;disabled:boolean;loading:boolean};
 setOptions(patch:Partial<GardenerimTagOptions>):ReturnType<GardenerimTagInstance['getState']>;
 refresh():void; destroy():void;
}

export interface GardenerimTabsItem {
 key:string|number; title?:string; label?:string; content?:string; badge?:string|number;
 disabled?:boolean; closable?:boolean; lazyLoad?:boolean; destroyOnHide?:boolean; forceRender?:boolean;
 titleTemplate?:string; contentTemplate?:string;
}
/** Five-framework configuration serialized as data-g-tabs-options / config['tabs-options']. */
export interface GardenerimTabsOptions {
 items:readonly GardenerimTabsItem[]; activeKey?:string|number|null; defaultActiveKey?:string|number;
 type?:'line'|'card'|'card-gutter'|'text'|'rounded'|'capsule'; size?:'mini'|'small'|'medium'|'large';
 position?:'top'|'bottom'|'left'|'right'; direction?:'horizontal'|'vertical';
 trigger?:'click'|'hover'; activation?:'auto'|'manual'; editable?:boolean; showAddButton?:boolean;
 lazyLoad?:boolean; destroyOnHide?:boolean; autoSwitch?:boolean; animation?:boolean;
 justify?:boolean; headerPadding?:boolean; hideContent?:boolean; disabled?:boolean; loading?:boolean;
 scrollPosition?:'auto'|'center'; extra?:string; extraTemplate?:string;
 label?:string; emptyText?:string; addLabel?:string; closeLabel?:string; closeHint?:string; previousLabel?:string; nextLabel?:string;
}
export interface GardenerimConfiguredTabsInstance extends GardenerimBehaviorInstance {
 select(value:string|number|HTMLElement,focus?:boolean):HTMLElement|null;
 current():HTMLElement|null;
 getState():{activeKey:string|number|null;controlled:boolean;items:GardenerimTabsItem[];position:string;type:string;size:string};
 setOptions(patch:Partial<GardenerimTabsOptions>):ReturnType<GardenerimConfiguredTabsInstance['getState']>;
 refresh():void; scrollTo(value:string|number|HTMLElement):boolean; remove(value:string|number):boolean; requestAdd():boolean; destroy():void;
}
export type GardenerimTableKey = string | number;
export interface GardenerimTableCell<Row = Record<string, unknown>> { record:Row; column:GardenerimTableColumn<Row>; rowIndex:number; columnIndex:number; value:unknown; }
export interface GardenerimTableColumn<Row = Record<string, unknown>> {
  dataIndex?: string; field?:string; title?:string|((column:GardenerimTableColumn<Row>)=>string|Node); children?:readonly GardenerimTableColumn<Row>[];
  type?:'text'|'number'; width?:number; minWidth?:number; maxWidth?:number; align?:'left'|'center'|'right'|'start'|'end'; fixed?:'left'|'right';
  ellipsis?:boolean; tooltip?:boolean; cellClass?:string; resizable?:boolean; editable?:boolean; rowSpan?:number; colSpan?:number;
  sortable?:boolean|{sortDirections?:('ascend'|'descend')[];sortOrder?:'ascend'|'descend'|'';defaultSortOrder?:'ascend'|'descend';sorter?:(a:Row,b:Row,context:{dataIndex:string;direction:string})=>number};
  sorter?:(a:Row,b:Row)=>number;
  filterable?:{filters:readonly {text:string;value:string|number}[];multiple?:boolean;filteredValue?:readonly (string|number)[];defaultFilteredValue?:readonly (string|number)[];filter?:(values:(string|number)[],record:Row)=>boolean};
  render?:(context:GardenerimTableCell<Row>)=>string|number|Node|null;format?:(value:unknown,row:Row)=>string|number;
  validate?:(value:unknown,row:Row)=>string|undefined;
}
export interface GardenerimTableState {page:number;pageSize:number;total:number;sorter:{field:string;direction:'ascend'|'descend'}|null;filters:Record<string,(string|number)[]>;selectedKeys:GardenerimTableKey[];expandedKeys:GardenerimTableKey[];loading:boolean;error:string;}
export interface GardenerimTableChange<Row=Record<string,unknown>> extends GardenerimTableState {component:'table';reason:'selection'|'expand'|'sort'|'filter'|'page'|'pageSize'|'resize'|'drag'|'edit'|'load';record?:Row;data?:Row[];key?:GardenerimTableKey;targetKey?:GardenerimTableKey;dataIndex?:string;width?:number;value?:unknown;previous?:unknown;}
export interface GardenerimTableOptions<Row=Record<string,unknown>> {
  columns:readonly GardenerimTableColumn<Row>[];data?:readonly Row[];rowKey?:string|((row:Row)=>GardenerimTableKey);childrenKey?:string;
  caption?:string;ariaLabel?:string;locale?:string;size?:'mini'|'small'|'medium'|'large';bordered?:boolean|{wrapper?:boolean;cell?:boolean;headerCell?:boolean;bodyCell?:boolean};hoverable?:boolean;stripe?:boolean;tableLayoutFixed?:boolean;showHeader?:boolean;disabled?:boolean;loading?:boolean;
  rowSelection?:boolean|{type?:'checkbox'|'radio';selectedRowKeys?:readonly GardenerimTableKey[];defaultSelectedRowKeys?:readonly GardenerimTableKey[];showCheckedAll?:boolean;checkStrictly?:boolean;onlyCurrent?:boolean;title?:string;width?:number;fixed?:boolean;disabled?:(record:Row)=>boolean};
  selectedKeys?:readonly GardenerimTableKey[];defaultSelectedKeys?:readonly GardenerimTableKey[];
  expandable?:{expandedRowKeys?:readonly GardenerimTableKey[];defaultExpandedRowKeys?:readonly GardenerimTableKey[];defaultExpandAllRows?:boolean;expandedRowRender?:(row:Row)=>string|Node;title?:string;width?:number;fixed?:boolean};expandedKeys?:readonly GardenerimTableKey[];defaultExpandedKeys?:readonly GardenerimTableKey[];defaultExpandAllRows?:boolean;indentSize?:number;
  pagination?:boolean|{current?:number;defaultCurrent?:number;pageSize?:number;defaultPageSize?:number;showPageSize?:boolean;pageSizeOptions?:readonly number[]};pagePosition?:'tl'|'top'|'tr'|'bl'|'bottom'|'br';
  scroll?:{x?:number|string;y?:number|string;minWidth?:number|string;maxHeight?:number|string};stickyHeader?:boolean|number;
  virtualListProps?:{height?:number;itemHeight?:number;overscan?:number};
  sorter?:GardenerimTableState['sorter'];filters?:GardenerimTableState['filters'];spanMethod?:(cell:GardenerimTableCell<Row>)=>{rowspan?:number;colspan?:number}|void;
  summary?:boolean|((context:{columns:GardenerimTableColumn<Row>[];data:Row[]})=>Row[]);summaryText?:string;
  columnResizable?:boolean;draggable?:boolean|{type?:'row'|'handle';title?:string;width?:number;fixed?:boolean};rowClass?:string|((row:Row,index:number)=>string);
  mode?:'client'|'server';total?:number;requestTimeout?:number;
  load?:(query:GardenerimTableState&{signal:AbortSignal})=>Promise<{data?:readonly Row[];rows?:readonly Row[];total:number}>;
  loadMore?:(record:Row,context:{signal:AbortSignal})=>Promise<readonly Row[]>;
  labels?:Partial<Record<'timeout'|'cancelled'|'selectAll'|'selectRow'|'expand'|'sort'|'filter'|'all'|'resize'|'moveUp'|'moveDown'|'loading'|'empty'|'summary'|'previous'|'next'|'total'|'page'|'pageSize'|'selected'|'retry'|'pagination'|'scrollArea'|'reorder',string>>;
  onChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onError?:(error:unknown)=>void;
  onSelectionChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onExpandedChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onSorterChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onFilterChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onPageChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onPageSizeChange?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onColumnResize?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onRowReorder?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;onEdit?:(change:GardenerimTableChange<Row>,event:CustomEvent)=>void;
  onCellClick?:(cell:GardenerimTableCell<Row>,event:Event)=>void;onCellDblclick?:(cell:GardenerimTableCell<Row>,event:Event)=>void;onCellContextmenu?:(cell:GardenerimTableCell<Row>,event:Event)=>void;onRowClick?:(record:Row,event:Event)=>void;onRowDblclick?:(record:Row,event:Event)=>void;onRowContextmenu?:(record:Row,event:Event)=>void;
}
export interface GardenerimTableInstance<Row=Record<string,unknown>> {
  readonly element:HTMLElement;update(options:Partial<GardenerimTableOptions<Row>>):GardenerimTableState;setOptions(options:Partial<GardenerimTableOptions<Row>>):GardenerimTableState;setData(data:readonly Row[]):GardenerimTableState;getState():GardenerimTableState;
  select(keys:GardenerimTableKey|GardenerimTableKey[],checked?:boolean):GardenerimTableKey[];selectAll(checked?:boolean):GardenerimTableKey[];expand(keys:GardenerimTableKey|GardenerimTableKey[],checked?:boolean):Promise<boolean>;expandAll(checked?:boolean):Promise<boolean>;
  setSort(field:string|null,direction?:'ascend'|'descend'):GardenerimTableState|Promise<GardenerimTableState>;setFilter(field:string,values:(string|number)[]):GardenerimTableState|Promise<GardenerimTableState>;setPage(page:number,pageSize?:number):GardenerimTableState|Promise<GardenerimTableState>;
  clearFilters(fields?:string|string[]):void;resetFilters(fields?:string|string[]):void;clearSorters():GardenerimTableState|Promise<GardenerimTableState>;resetSorters():GardenerimTableState|Promise<GardenerimTableState>;
  resizeColumn(field:string,width:number):number|false;moveRow(key:GardenerimTableKey,targetKey:GardenerimTableKey):boolean;editCell(key:GardenerimTableKey,field:string,value:unknown):false|{valid:boolean;message?:string;record?:Row};
  reload():Promise<GardenerimTableState>;cancel():void;scrollTo(position?:{top?:number;left?:number;key?:GardenerimTableKey}):void;destroy():void;
}
export declare function createTable<Row=Record<string,unknown>>(element:HTMLElement,options:GardenerimTableOptions<Row>):GardenerimTableInstance<Row>;
/** Shared data contract for all 41 navigation components. */
export interface GardenerimNavigationItem {
 id:string; label:string; href?:string; target?:'_self'|'_blank'; icon?:string;
 description?:string; badge?:string|number; shortcut?:string; group?:string;
 disabled?:boolean; hidden?:boolean; checked?:boolean; checkable?:boolean;
 closable?:boolean; status?:'pending'|'complete'|'error'; content?:string;
 children?:readonly GardenerimNavigationItem[];
}
export interface GardenerimNavigationChange {
 value:string|number; previousValue?:string|number|undefined;
 item?:GardenerimNavigationItem; originalEvent?:Event;
}
export interface GardenerimNavigationOptions {
 component?:string; items?:readonly GardenerimNavigationItem[];
 actions?:readonly GardenerimNavigationItem[]; value?:string|number|undefined; defaultValue?:string|number;
 label?:string; title?:string; description?:string; brand?:string;
 orientation?:'horizontal'|'vertical'; size?:'small'|'medium'|'large';
 appearance?:'default'|'line'|'pill'|'card'|'contained';
 variant?:string|readonly string[]; state?:string|readonly string[];
 disabled?:boolean; loading?:boolean; activation?:'automatic'|'manual'; loop?:boolean;
 open?:boolean|undefined; defaultOpen?:boolean; collapsed?:boolean|undefined;
 expandedKeys?:readonly string[]|undefined; defaultExpandedKeys?:readonly string[];
 closeOnSelect?:boolean; searchable?:boolean; searchPlaceholder?:string; emptyText?:string; maxVisibleItems?:number;
 total?:number; pageSize?:number; pageSizes?:readonly number[]; siblingCount?:number;
 showTotal?:boolean; showSizeChanger?:boolean; showJumper?:boolean;
 hasPrevious?:boolean; hasNext?:boolean; previous?:GardenerimNavigationItem; next?:GardenerimNavigationItem; backHref?:string;
 threshold?:number; scrollOffset?:number; scrollTarget?:string; sticky?:boolean; fixed?:boolean;
 showIcons?:boolean; showBadges?:boolean; showDescriptions?:boolean; showShortcuts?:boolean;
 showGroups?:boolean; showHeader?:boolean; showActions?:boolean; showPanel?:boolean; bordered?:boolean;
 maxHeight?:number; popupWidth?:number; popupMaxHeight?:number; itemGap?:number; indent?:number;
 selectionTimeout?:number; closeOnEscape?:boolean; closeOnOutside?:boolean;
 beforeChange?:(change:GardenerimNavigationChange,signal:AbortSignal)=>boolean|Promise<boolean>;
 onChange?:(change:GardenerimNavigationChange,event:CustomEvent)=>void;
 onSelect?:(detail:{value:GardenerimNavigationItem},event:CustomEvent)=>void;
 onOpen?:(detail:{value:boolean},event:CustomEvent)=>void;
 onCollapse?:(detail:{value:boolean},event:CustomEvent)=>void;
 onExpand?:(detail:{value:readonly string[]},event:CustomEvent)=>void;
 onPageSizeChange?:(detail:{value:number},event:CustomEvent)=>void;
 onLoadMore?:(detail:unknown,event:CustomEvent)=>void;
 onPrevious?:(detail:unknown,event:CustomEvent)=>void;
 onNext?:(detail:unknown,event:CustomEvent)=>void;
 onBack?:(detail:unknown,event:CustomEvent)=>void;
 onCloseItem?:(detail:{value:GardenerimNavigationItem},event:CustomEvent)=>void;
 onCheck?:(detail:{value:{item:GardenerimNavigationItem;checked:boolean}},event:CustomEvent)=>void;
 onError?:(detail:unknown,event:CustomEvent)=>void;
 render?:Readonly<Record<string,(scope?:any)=>Node|string|readonly (Node|string)[]>>;
}
export interface GardenerimNavigationInstance {
 readonly element:HTMLElement;
 update(options:Partial<GardenerimNavigationOptions>):void;
 select(value:string|number):Promise<boolean|void>;
 focus():void; open():void; close():void; cancel():void; destroy():void;
}
export declare const navigationDefaults:Readonly<GardenerimNavigationOptions>;
export declare function createNavigation(element:HTMLElement,options:GardenerimNavigationOptions):GardenerimNavigationInstance;
export type GardenerimDataDisplayKind='timeline'|'statistic'|'list'|'descriptions'|'virtual-list'|'kanban'|'calendar'|'agenda'|'file-manager'|'query-builder'|'filter-builder'|'pivot-table'|'gantt-shell'|'map-shell'|'export-panel'|'data-inspector'|'data-legend';
export interface GardenerimDataRule {id?:string;field:string;operator:'contains'|'equals'|'gte'|'lte';value?:string|number;}
export interface GardenerimDataDisplayOptions {
/** Calendar selection and visible page are independently controlled. Dates are local civil dates. */
modelValue?:string|Date|null;defaultValue?:string|Date;pageShowDate?:string|Date;defaultPageShowDate?:string|Date;
mode?:'month'|'year';defaultMode?:'month'|'year';modes?:Array<'month'|'year'>;headerType?:'button'|'select';
panel?:boolean;panelWidth?:number|string;panelTodayBtn?:boolean;panelOperations?:Array<'left'|'right'|'double-left'|'double-right'>;
allowSelect?:boolean;dayStartOfWeek?:0|1|'0'|'1';isWeek?:boolean;showOutsideDays?:boolean;disabledWeekdays?:number[];maxEvents?:number;
disabledDate?:(date:Date)=>boolean;
/** Return text or a DOM node; strings are never interpreted as HTML. */
dateRender?:(date:Date,context:{date:string;selected:boolean;today:boolean;outside:boolean;disabled:boolean;events:Record<string,unknown>[];mode:'month'|'year'})=>Node|string|number|null|undefined;
dateInnerContent?:GardenerimDataDisplayOptions['dateRender'];monthRender?:(date:Date)=>Node|string|number|null|undefined;
headerRender?:(context:{value:Date|null;pageShowDate:Date;mode:'month'|'year';onChange:(value:string|Date)=>boolean;onChangePageDate:(value:string|Date)=>boolean;onChangeMode:(mode:'month'|'year')=>boolean})=>Node|string|null|undefined;
onChange?:(detail:GardenerimDataDisplayState & {component:'calendar';reason:string;keys:string[];value:string[];controlled:boolean})=>void;
onPanelChange?:GardenerimDataDisplayOptions['onChange'];
kind?:GardenerimDataDisplayKind;items?:Record<string,unknown>[];rows?:Record<string,unknown>[];rowKey?:string;selectedKeys?:Array<string|number>;selection?:'single'|'multiple'|'none';controlled?:boolean;disabled?:boolean;readOnly?:boolean;loading?:boolean;error?:string;emptyText?:string;title?:string;label?:string;labels?:Record<string,string>;
size?:'small'|'medium'|'large';bordered?:boolean;layout?:'grid'|'list';showHeader?:boolean;showSearch?:boolean;showDescriptions?:boolean;showLaneCount?:boolean;showMoveControls?:boolean;showCalendarEvents?:boolean;showToday?:boolean;showBreadcrumbs?:boolean;showFileMeta?:boolean;showResults?:boolean;showPreview?:boolean;showModeSwitch?:boolean;showZoomControls?:boolean;
maxHeight?:number;tableHeight?:number;laneWidth?:number;calendarDayHeight?:number;mapHeight?:number;maxRules?:number;exportPreviewRows?:number;serviceTimeout?:number;height?:number;rowHeight?:number;overscan?:number;date?:string;startDate?:string;minDate?:string;maxDate?:string;disabledDates?:string[];locale?:string;weekStart?:number;days?:number;path?:string|null;
columns?:Array<{field:string;title?:string;type?:'text'|'number'}>;fields?:Array<{field:string;title?:string;type?:'text'|'number'}>;lanes?:Array<{id:string|number;label:string}>;rules?:GardenerimDataRule[];conjunction?:'and'|'or';rowField?:string;columnField?:string;valueField?:string;aggregate?:'sum'|'count'|'average'|'min'|'max';rowLabel?:string;caption?:string;filename?:string;separator?:','|';'|'\t';bom?:boolean;value?:unknown;indent?:number;expandedDepth?:number;maxDepth?:number;
load?:(context:{filter:string;path:string|null;signal:AbortSignal;pageShowDate?:string;mode?:'month'|'year'})=>Record<string,unknown>[]|{items:Record<string,unknown>[]}|Promise<Record<string,unknown>[]|{items:Record<string,unknown>[]}>
}
export interface GardenerimDataDisplayState {value?:unknown;displayValue?:string;running?:boolean;remaining?:number|null;kind:GardenerimDataDisplayKind;current?:number;pageSize?:number;total?:number;selectedKeys:string[];filter:string;path:string|null;date:string;pageShowDate?:string;modelValue?:string|null;direction?:'vertical'|'horizontal';reverse?:boolean;pending?:boolean|string;mode?:'month'|'year'|'number'|'date'|'countdown'|'left'|'right'|'top'|'bottom'|'alternate';zoom:number;rules:GardenerimDataRule[];count:number;items:Record<string,unknown>[];loading:boolean;error:string;}
export interface GardenerimDataDisplayInstance {setOptions(options:Partial<GardenerimDataDisplayOptions> | Partial<GardenerimDescriptionsOptions> | Partial<GardenerimListOptions> | Partial<GardenerimStatisticOptions> | Partial<GardenerimTimelineOptions>):GardenerimDataDisplayState|false;getState():GardenerimDataDisplayState;refresh():void;select(key:string|number):boolean;move(key:string|number,lane:string|number):boolean;setDate(value:string):boolean;scrollTo(index:string|number):boolean;exportCsv():string;load():Promise<GardenerimDataDisplayState>;cancel():boolean;destroy():void;}

/** Arco-compatible data layout; native template ids support rich content in every adapter. */
export interface GardenerimDescriptionsItem {key?:string|number;label?:string|number|boolean|null;value?:string|number|boolean|null;span?:number;labelTemplate?:string;valueTemplate?:string;labelStyle?:GardenerimDescriptionsStyle;valueStyle?:GardenerimDescriptionsStyle;}
export type GardenerimDescriptionsStyle=Partial<Record<'color'|'backgroundColor'|'fontWeight'|'fontSize'|'width'|'minWidth'|'maxWidth'|'whiteSpace'|'textAlign'|'verticalAlign'|'padding'|'paddingLeft'|'paddingRight',string|number>>;
export interface GardenerimDescriptionsOptions {maxHeight?:number;data?:GardenerimDescriptionsItem[];column?:number|Partial<Record<'xs'|'sm'|'md'|'lg'|'xl'|'xxl',number>>;title?:string;label?:string;extra?:string;extraTemplate?:string;layout?:'horizontal'|'vertical'|'inline-horizontal'|'inline-vertical';align?:'left'|'center'|'right'|{label?:'left'|'center'|'right';value?:'left'|'center'|'right'};size?:'mini'|'small'|'medium'|'large';bordered?:boolean;tableLayout?:'auto'|'fixed';labelStyle?:GardenerimDescriptionsStyle;valueStyle?:GardenerimDescriptionsStyle;placeholder?:string;emptyText?:string;loading?:boolean;loadingText?:string;error?:string;}

export interface GardenerimListItem {id?:string|number;title?:string|number;description?:string|number;content?:string|number|boolean|null;extra?:string|number;avatar?:string;avatarText?:string;disabled?:boolean;actionLayout?:'horizontal'|'vertical';actions?:Array<{key:string|number;label:string;disabled?:boolean}>;titleTemplate?:string;descriptionTemplate?:string;contentTemplate?:string;extraTemplate?:string;[key:string]:unknown;}
export interface GardenerimListPagination {current?:number;defaultCurrent?:number;pageSize?:number;defaultPageSize?:number;total?:number;showTotal?:boolean;showPageSize?:boolean;showJumper?:boolean;simple?:boolean;hideOnSinglePage?:boolean;pageSizeOptions?:number[];}
export interface GardenerimListOptions {data?:Array<GardenerimListItem|string|number|boolean|null>;rowKey?:string;size?:'small'|'medium'|'large';bordered?:boolean;split?:boolean;hoverable?:boolean;loading?:boolean;disabled?:boolean;header?:string;footer?:string;headerTemplate?:string;footerTemplate?:string;emptyTemplate?:string;emptyText?:string;loadingText?:string;error?:string;label?:string;actionLayout?:'horizontal'|'vertical';paginationProps?:false|GardenerimListPagination;gridProps?:Partial<Record<'span'|'xs'|'sm'|'md'|'lg'|'xl'|'xxl'|'gutter',number>>;maxHeight?:number|string;bottomOffset?:number;scrollbar?:boolean;virtualListProps?:{height:number;itemHeight:number;overscan?:number};loadMore?:boolean;hasMore?:boolean;labels?:Record<string,string>;}

/** Shared data-options JSON; formatter is available through setOptions in JavaScript. */
export interface GardenerimStatisticOptions {
  maxHeight?: number;value?:number|string|Date|null;title?:string;extra?:string;prefix?:string;suffix?:string;mode?:'number'|'date'|'countdown';precision?:number;showGroupSeparator?:boolean;separator?:string;decimalSeparator?:string;locale?:string;format?:string;timeZone?:string;now?:number|string;animation?:boolean;animationDuration?:number;valueFrom?:number;start?:boolean;placeholder?:string;loading?:boolean;loadingText?:string;error?:string;size?:'small'|'medium'|'large';align?:'start'|'center'|'end';tone?:'default'|'success'|'warning'|'danger';label?:string;live?:'off'|'polite';valueStyle?:Readonly<Record<string,string|number>>;titleTemplate?:string;extraTemplate?:string;prefixTemplate?:string;suffixTemplate?:string;formatter?:(value:unknown)=>string|number;}

export interface GardenerimTimelineItem {key?:string|number;id?:string|number;content?:string|number;title?:string;label?:string;time?:string;datetime?:string;dot?:string;dotColor?:string;lineColor?:string;dotType?:'solid'|'hollow';lineType?:'solid'|'dashed'|'dotted';position?:'left'|'right'|'top'|'bottom';status?:'normal'|'success'|'warning'|'danger'|'error'|'pending';disabled?:boolean;contentTemplate?:string;labelTemplate?:string;dotTemplate?:string;actions?:Array<{key:string|number;label:string;disabled?:boolean}>;}
export interface GardenerimTimelineOptions {items?:GardenerimTimelineItem[];direction?:'vertical'|'horizontal';mode?:'left'|'right'|'top'|'bottom'|'alternate';labelPosition?:'same'|'relative';reverse?:boolean;pending?:boolean|string;pendingText?:string;pendingTemplate?:string;pendingDotTemplate?:string;responsive?:boolean;breakpoint?:number;itemSpacing?:number;labelWidth?:number;dotSize?:number;itemMinWidth?:number;maxHeight?:number;loading?:boolean;disabled?:boolean;error?:string;emptyText?:string;loadingText?:string;emptyTemplate?:string;loadingTemplate?:string;label?:string;}
export type GardenerimDashboardKind = 'kpi-stat'|'filter-bar'|'chart-container'|'kpi-group'|'dashboard-widget'|'goal-tracker'|'gauge-chart';
export interface GardenerimDashboardState {value?:number;filters?:Record<string,string|number|boolean>;hiddenSeries?:Array<string|number>;collapsed?:boolean;activePoint?:{series:string;index:number;aggregate?:boolean};}
export interface GardenerimDashboardSnapshot extends GardenerimDashboardState {draft:Record<string,string|number|boolean>;loading:boolean;error:string;}
export interface GardenerimDashboardField {key:string;label?:string;type?:'text'|'search'|'number'|'date'|'select';defaultValue?:string|number;placeholder?:string;min?:string|number;max?:string|number;required?:boolean;disabled?:boolean;options?:Array<{value:string|number;label?:string}>;}
export interface GardenerimDashboardMetric {label?:string;title?:string;description?:string;value?:number;previous?:number;format?:'decimal'|'currency'|'percent';currency?:string;locale?:string;notation?:'standard'|'compact';precision?:number;prefix?:string;suffix?:string;unit?:string;inverse?:boolean;comparisonLabel?:string;showValue?:boolean;showTrend?:boolean;showDescription?:boolean;}
export interface GardenerimDashboardOptions extends GardenerimDashboardMetric {
kind?:GardenerimDashboardKind;size?:'small'|'medium'|'large';bordered?:boolean;columns?:number;height?:number;maxHeight?:number;tableHeight?:number;pointRadius?:number;lineWidth?:number;donutWidth?:number;serviceTimeout?:number;
showHeader?:boolean;showLegend?:boolean;showGrid?:boolean;showAxisLabels?:boolean;showMarkers?:boolean;tableVisible?:boolean;showTable?:boolean;showTarget?:boolean;showRemaining?:boolean;showRange?:boolean;showApply?:boolean;showReset?:boolean;
disabled?:boolean;readOnly?:boolean;loading?:boolean;empty?:boolean;error?:string;collapsed?:boolean;collapsible?:boolean;exportable?:boolean;immediate?:boolean;filename?:string;labels?:Record<string,string>;
chartType?:'line'|'area'|'bar'|'donut';arc?:180|360;min?:number;max?:number;target?:number;categories?:string[];series?:Array<{id:string|number;label?:string;values:Array<number|null>}>;hiddenSeries?:Array<string|number>;metrics?:GardenerimDashboardMetric[];fields?:GardenerimDashboardField[];values?:Record<string,string|number|boolean>;thresholds?:Array<{value:number;tone:'primary'|'success'|'warning'|'danger'}>;
load?:(context:{filters:Record<string,string|number|boolean>;signal:AbortSignal})=>Partial<GardenerimDashboardOptions>|Promise<Partial<GardenerimDashboardOptions>>;
}
export interface GardenerimDashboardInstance {
setOptions(options:Partial<GardenerimDashboardOptions>):GardenerimDashboardSnapshot|false;getState():GardenerimDashboardSnapshot;refresh():void;setValue(value:GardenerimDashboardState):boolean;setFilter(value:Record<string,string|number|boolean>):boolean;reset():boolean;load():Promise<GardenerimDashboardSnapshot>;cancel():boolean;exportCsv():string;destroy():void;
}
export type GardenerimInteractionKind = "saved-views" | "sort-builder" | "selection-controls" | "batch-toolbar" | "dual-list" | "tree-select" | "cascader" | "mention-picker" | "user-picker" | "organization-picker" | "resource-picker" | "media-picker" | "icon-picker" | "color-picker-composition" | "date-range-picker-composition" | "time-range-picker-composition" | "saved-filters" | "group-builder" | "entity-picker" | "tag-picker" | "relation-picker" | "bulk-confirmation" | "bulk-progress" | "action-bar" | "bulk-action-bar" | "floating-action-bar" | "sticky-actions" | "transfer-list" | "split-pane" | "drag-sort" | "infinite-scroll" | "pull-refresh" | "copy-action" | "fullscreen-action" | "undo-history";
export interface GardenerimInteractionItem {key:string|number;label?:string;description?:string;disabled?:boolean;children?:GardenerimInteractionItem[];avatar?:string;icon?:string;color?:string;}
export interface GardenerimInteractionState {keys?:Array<string|number>;targetKeys?:Array<string|number>;rules?:Array<{field:string;direction:'asc'|'desc'}>;range?:{start?:string;end?:string};ratio?:number;order?:Array<string|number>;history?:Array<{label:string;value:unknown}>;cursor?:number;path?:Array<string|number>;agreed?:boolean;collapsed?:boolean;}
export interface GardenerimInteractionResult {key:string;label?:string;status:'pending'|'running'|'success'|'error'|'cancelled';message?:string;}
export interface GardenerimInteractionSnapshot extends GardenerimInteractionState {loading:boolean;error:string;results:GardenerimInteractionResult[];}
export interface GardenerimInteractionOptions {
kind:GardenerimInteractionKind;value?:GardenerimInteractionState;items?:GardenerimInteractionItem[];title?:string;description?:string;text?:string;placeholder?:string;confirmLabel?:string;labels?:Record<string,string>;
size?:'small'|'medium'|'large';bordered?:boolean;orientation?:'horizontal'|'vertical';multiple?:boolean;searchable?:boolean;clearable?:boolean;editable?:boolean;leafOnly?:boolean;cascade?:boolean;checkedStrategy?:'all'|'parent'|'leaf';limit?:number;readOnly?:boolean;disabled?:boolean;loading?:boolean;empty?:boolean;error?:string;
showHeader?:boolean;showCount?:boolean;showDescriptions?:boolean;showIcons?:boolean;showAvatars?:boolean;showPresets?:boolean;showReset?:boolean;showResults?:boolean;showSnapshot?:boolean;listHeight?:number;maxHeight?:number;columns?:number;columnWidth?:number;splitHeight?:number;serviceTimeout?:number;
fields?:Array<{key:string;label:string}>;maxRules?:number;min?:string;max?:string;presets?:Array<{label:string;start:string;end:string}>;panels?:string[];minRatio?:number;maxRatio?:number;step?:number;collapsible?:boolean;actions?:Array<{key:string;label:string;tone?:string;disabled?:boolean;requiresSelection?:boolean}>;concurrency?:number;hasMore?:boolean;automatic?:boolean;gesture?:boolean;threshold?:number;historyLimit?:number;
load?:(context:{signal:AbortSignal;offset:number;query:string;reset:boolean})=>Promise<{items:GardenerimInteractionItem[];hasMore?:boolean}>|{items:GardenerimInteractionItem[];hasMore?:boolean};run?:(item:GardenerimInteractionItem,context:{signal:AbortSignal})=>unknown|Promise<unknown>;
}
export interface GardenerimInteractionInstance {
setOptions(options:Partial<GardenerimInteractionOptions>):GardenerimInteractionSnapshot|false;getState():GardenerimInteractionSnapshot;refresh():void;setValue(value:GardenerimInteractionState):boolean;select(key:string|number):boolean;move(keys:Array<string|number>,direction?:'add'|'remove'):boolean;reorder(key:string|number,delta:number):boolean;addRule():boolean;removeRule(index:number):boolean;setRange(value:{start?:string;end?:string}):boolean;load(reset?:boolean):Promise<GardenerimInteractionSnapshot>;run(handler?:GardenerimInteractionOptions['run'],retry?:boolean):Promise<GardenerimInteractionSnapshot>;cancel():boolean;commit(label:string,value:unknown):boolean;undo():boolean;redo():boolean;copy():Promise<boolean>;toggleFullscreen():Promise<boolean>;destroy():void;
}
export type GardenerimContentKind = 'code-block' | 'terminal' | 'diff-viewer' | 'revision-compare-composition' | 'article-layout' | 'search-results' | 'report-invoice' | 'content-outline' | 'markdown-viewer' | 'content-file-list' | 'file-card-composition' | 'folder-tree-composition' | 'file-browser-composition' | 'media-library-composition' | 'media-grid-composition' | 'media-details-composition' | 'file-properties' | 'storage-meter' | 'content-file-drop' | 'content-upload-queue' | 'chunk-upload' | 'upload-progress-composition' | 'failed-upload' | 'file-preview-composition' | 'document-viewer-composition' | 'pdf-viewer' | 'image-crop-composition' | 'image-annotation-composition' | 'video-player-shell' | 'audio-player-shell' | 'code-editor-shell' | 'rich-text-editor-composition' | 'markdown-editor' | 'block-editor' | 'editor-toolbar-composition' | 'find-replace' | 'content-autosave-indicator' | 'comment-thread-composition' | 'version-history-composition';
export interface GardenerimContentItem {
  key: string | number; label?: string; parent?: string | number; type?: string; size?: number;
  description?: string; src?: string; url?: string; modified?: string; disabled?: boolean;
  quantity?: number; price?: number; properties?: Record<string, string | number>;
}
export interface GardenerimContentState {
  text?: string; keys?: Array<string | number>; folder?: string; page?: number; zoom?: number; query?: string;
  sort?: 'name' | 'size' | 'modified'; view?: 'list' | 'grid' | 'split' | 'unified';
  comments?: Array<{text: string; author?: string; date?: string; resolved?: boolean}>;
  annotations?: Array<{x: number; y: number; text: string}>;
  blocks?: Array<{text: string}>; crop?: {x: number; y: number; width: number; height: number}; version?: string | number | null;
}
export interface GardenerimContentUpload {
  key: string; name: string; size: number; status: 'queued' | 'uploading' | 'success' | 'error' | 'cancelled' | 'paused';
  progress: number; chunks: number; completedChunks: number; error?: string;
}
export interface GardenerimContentSnapshot extends GardenerimContentState {
  uploads: GardenerimContentUpload[]; busy: boolean; error: string; saveStatus: 'idle' | 'dirty' | 'saving' | 'saved' | 'error';
}
export interface GardenerimContentOptions extends GardenerimContentState {
  kind: GardenerimContentKind; title?: string; labels?: Record<string,string>; items?: GardenerimContentItem[];
  loading?: boolean; empty?: boolean; error?: string; disabled?: boolean; readOnly?: boolean;
  size?: 'small' | 'medium' | 'large'; bordered?: boolean;
  showHeader?: boolean; showToolbar?: boolean; showCount?: boolean; showPagination?: boolean;
  showMetadata?: boolean; showDescriptions?: boolean; showSort?: boolean; showViewSwitcher?: boolean;
  showUploadHints?: boolean; showChunkDetails?: boolean; showCopy?: boolean;
  /** CSS pixel limits, except editorRows and columns which are integer counts. */
  editorRows?: number; maxHeight?: number; previewHeight?: number; columns?: number; thumbnailSize?: number;
  resize?: 'none' | 'vertical' | 'both';
  /** Per service call timeout in ms; defaults to 60000, zero disables the timeout. */
  serviceTimeout?: number;
  src?: string; alt?: string; type?: string; poster?: string; language?: string; before?: string; after?: string;
  pages?: Array<string | {text: string}>; pageCount?: number; pageSize?: number; thumbnails?: boolean;
  author?: string; date?: string; locale?: string; currency?: string; taxRate?: number; discount?: number;
  total?: number; used?: number; sections?: Array<{id: string; title: string; level?: number}>; smooth?: boolean;
  versions?: Array<{key: string | number; label: string; text?: string; author?: string; date?: string}>;
  multiple?: boolean; maxSelection?: number; searchable?: boolean;
  accept?: string; maxFiles?: number; maxSize?: number; chunkSize?: number; concurrency?: number;
  upload?: (file: File, context: {signal: AbortSignal; key: string; index: number; total: number; offset: number; chunk: Blob; onProgress(value: number): void}) => unknown | Promise<unknown>;
  save?: (text: string, context: {signal: AbortSignal; value: GardenerimContentSnapshot}) => unknown | Promise<unknown>;
  saveDelay?: number; maxLength?: number; preview?: boolean; spellcheck?: boolean; wrap?: boolean; lineNumbers?: boolean;
  findReplace?: boolean; caseSensitive?: boolean; actions?: Array<'bold' | 'italic' | 'heading' | 'link'>; linkUrl?: string;
  sources?: Array<{src: string; type?: string}>; preload?: 'none' | 'metadata' | 'auto'; loop?: boolean; muted?: boolean; volume?: number; playbackRate?: number;
  value?: GardenerimContentState;
}
export interface GardenerimContentInstance extends GardenerimBehaviorInstance {
  setOptions(options: Partial<GardenerimContentOptions>): GardenerimContentSnapshot | false;
  getState(): GardenerimContentSnapshot; refresh(): void; setValue(value: GardenerimContentState): boolean;
  select(key: string | number): boolean; addFiles(files: Iterable<File> | ArrayLike<File>): boolean;
  upload(keys?: string[]): Promise<boolean>; pauseUpload(): boolean; cancel(): void; save(): Promise<boolean>;
  copy(): Promise<boolean>; exportCrop(): Promise<Blob | false>; play(): Promise<boolean>; pause(): void; seek(time: number): boolean;
  format(command: 'bold' | 'italic' | 'heading' | 'link'): boolean;
  findNext(): {start: number; end: number} | false; replace(all?: boolean): boolean | {start: number; end: number}; destroy(): void;
}
export interface GardenerimLayoutOptions {
  kind: 'grid-system' | 'region-layout-system' | 'classic-layout-primitives' | 'page-header' | 'section-header' | 'subheader' | 'footer-bar' | 'app-shell' | 'dashboard' | 'mobile-shell' | 'responsive-container';
  /** Valid modes are listed in the layout component catalog. */
  mode?: string;
  gap?: number | string; rowGap?: number | string; columnGap?: number | string;
  padding?: number | string; minItemWidth?: number | string;
  sidebarWidth?: number | string; asideWidth?: number | string;
  headerHeight?: number | string; footerHeight?: number | string;
  minHeight?: number | string; maxWidth?: number | string; height?: number | string; offset?: number | string;
  /** Logical padding overrides, independent of the selected mode. */
  paddingBlock?: number | string; paddingInline?: number | string;
  maxHeight?: number | string; autoRows?: number | string;
  narrowColumns?: number;
  alignContent?: 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  closeOnEscape?: boolean; collapsible?: boolean; focusOnCollapse?: boolean;
  columns?: number; breakpoint?: number; ratio?: number;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  position?: 'contained' | 'page'; overflow?: 'visible' | 'auto' | 'hidden'; direction?: 'ltr' | 'rtl';
  wrap?: boolean; responsive?: boolean; collapsed?: boolean; disabled?: boolean;
}
export interface GardenerimLayoutState { collapsed: boolean; }
export interface GardenerimLayoutInstance extends GardenerimBehaviorInstance {
  refresh(): boolean | undefined;
  setOptions(options: Partial<GardenerimLayoutOptions>): boolean | undefined;
  getState(): GardenerimLayoutState;
  setValue(value: GardenerimLayoutState, reason?: string): boolean;
  toggle(): boolean;
  destroy(): void;
}
export interface GardenerimHelpItem {
  id: string; title?: string; description?: string; answer?: string; term?: string;
  category?: string; keywords?: string[]; keys?: string[]; href?: string; actionLabel?: string;
  date?: string; target?: string; placement?: string; disabled?: boolean;
  actions?: GardenerimHelpAction[];
}
export interface GardenerimHelpAction {id?: string; label: string; href?: string}
export interface GardenerimHelpValue {
  query?: string; category?: string; expanded?: string[]; completed?: string[];
  reason?: string; step?: number; open?: boolean; dismissed?: boolean; feedback?: 'yes' | 'no' | null;
}
export interface GardenerimHelpRequest {
  query: string; category: string; feedback: 'yes' | 'no' | null; reason: string; signal: AbortSignal;
}
export interface GardenerimHelpOptions {
  kind: 'tip'|'inline-hint'|'help-text'|'help-trigger'|'rich-tooltip'|'help-popover'|'definition-help'|'callout'|'note'|'guidance-pair'|'key-hint'|'shortcut-list'|'help-card'|'help-panel'|'help-center'|'help-topics'|'faq'|'contextual-help'|'coach-mark'|'spotlight'|'hotspot'|'feature-hint'|'whats-new'|'help-checklist'|'troubleshooting'|'help-feedback'|'tour-spotlight'|'help-search'|'help-glossary';
  mode?: string; title?: string; description?: string; triggerLabel?: string; trigger?: string; placeholder?: string;
  size?: 'small'|'medium'|'large'; tone?: 'neutral'|'info'|'success'|'warning'|'danger';
  bordered?: boolean; disabled?: boolean; searchable?: boolean; multiple?: boolean;
  dismissible?: boolean; readonly?: boolean; animated?: boolean; direction?: 'ltr'|'rtl';
  showHeader?: boolean; showActions?: boolean; showProgress?: boolean; showCount?: boolean; showClear?: boolean;
  showPrevious?: boolean; showStepList?: boolean; arrow?: boolean; closeOnEscape?: boolean; closeOnOutside?: boolean;
  serviceTimeout?: number; maxReasonLength?: number; minQueryLength?: number; tourPadding?: number;
  offset?: number; openDelay?: number; closeDelay?: number; maxHeight?: number;
  columns?: number; limit?: number; debounce?: number; width?: number; placement?: string;
  items?: GardenerimHelpItem[]; actions?: GardenerimHelpAction[]; keys?: string[];
  do?: string; dont?: string; doLabel?: string; dontLabel?: string;
  labels?: Record<string,string>; defaultValue?: GardenerimHelpValue;
  /** Supply service callbacks through setOptions; functions cannot be serialized as JSON. */
  load?: (request: GardenerimHelpRequest) => Promise<GardenerimHelpItem[]>;
  submit?: (request: GardenerimHelpRequest) => Promise<unknown>;
}
export interface GardenerimHelpInstance extends GardenerimBehaviorInstance {
  refresh(): boolean; setOptions(patch: Partial<GardenerimHelpOptions>): boolean;
  setValue(value: GardenerimHelpValue, reason?: string): boolean; getState(): Required<GardenerimHelpValue>;
  search(query: string): boolean; open(): boolean; close(reason?: string): boolean; go(step: number): boolean;
  submit(): boolean | Promise<boolean>; cancel(): void; destroy(): void;
}
export interface GardenerimAIMessage {id:string; role?:'user'|'assistant'|'system'; author?:string; content:string}
export interface GardenerimAIItem {
 id:string; title?:string; name?:string; description?:string; content?:string; prompt?:string;
 category?:string; keywords?:string[]; status?:string; date?:string; parent?:string; disabled?:boolean;
 href?:string; src?:string; alt?:string; quote?:string; author?:string; tokens?:number;
 progress?:number; contextLimit?:number; format?:'markdown'|'plain'|'code'|'json';
 messages?:GardenerimAIMessage[]; actions?:Array<{id?:string;label:string;href?:string}>;
}
export interface GardenerimAIValue {
 draft?:string; query?:string; selected?:string; model?:string; output?:string; reason?:string;
 messages?:GardenerimAIMessage[]; expanded?:string[]; checked?:string[]; status?:string;
 decision?:'pending'|'approved'|'rejected'|'cancelled'|'expired'; rating?:'like'|'dislike'|null;
 page?:number; dismissed?:boolean;
}
export interface GardenerimAIGenerateRequest {
 prompt:string; model:string; messages:GardenerimAIMessage[]; context:GardenerimAIItem[];
 files:File[]; signal:AbortSignal;
}
export interface GardenerimAIOptions {
 kind:string; mode?:string; title?:string; description?:string; content?:string; prompt?:string;
 model?:string; role?:'user'|'assistant'|'system'; author?:string; placeholder?:string;
 inputLabel?:string; searchPlaceholder?:string; emptyTitle?:string; emptyDescription?:string;
 items?:GardenerimAIItem[]; messages?:GardenerimAIMessage[]; defaultValue?:GardenerimAIValue;
 size?:'small'|'medium'|'large'; direction?:'ltr'|'rtl'; format?:'markdown'|'plain'|'code'|'json';
 status?:string; bordered?:boolean; disabled?:boolean; readonly?:boolean; searchable?:boolean;
 multiple?:boolean; showActions?:boolean; autoscroll?:boolean; checkable?:boolean; attachments?:boolean;
 /** Presentation controls default to true. */
 showHeader?:boolean; showStatus?:boolean; showAuthor?:boolean; showCount?:boolean;
 showCopy?:boolean; showFeedback?:boolean; showPause?:boolean; clearOnSend?:boolean;
 composerRows?:number; resize?:'none'|'vertical'; messageGap?:number; sidebarWidth?:number;
 treeIndent?:number; codeHeight?:number; imageRatio?:'16/9'|'4/3'|'1/1'|'auto'; imageFit?:'cover'|'contain';
 /** Inactivity timeout in milliseconds, default 60000; 0 disables the timeout. */
 serviceTimeout?:number; maxReasonLength?:number;
 columns?:number; height?:number; pageSize?:number; maxLength?:number; maxOutput?:number;
 maxFiles?:number; maxFileSize?:number; accept?:string; submitKey?:'enter'|'ctrl-enter';
 used?:number; limit?:number; unit?:string; cost?:number; currency?:string; rate?:number;
 rateUnit?:string; costLabel?:string; rateLabel?:string; progress?:number; levels?:number[]; transcript?:string;
 scope?:string|Record<string,unknown>; expiresAt?:string; details?:Record<string,string|number>;
 actions?:Array<{id?:string;label:string;href?:string}>; labels?:Record<string,string>;
 /** Callbacks are set through the instance; JSON options cannot contain functions. */
 generate?:(request:GardenerimAIGenerateRequest)=>string|AsyncIterable<string>|Promise<string|AsyncIterable<string>>;
 submitFeedback?:(request:{rating:'like'|'dislike'|null;reason:string;signal:AbortSignal})=>Promise<unknown>;
 approve?:(request:{decision:string;scope:unknown;signal:AbortSignal})=>Promise<unknown>;
 record?:(request:{status:string;signal:AbortSignal})=>Promise<unknown>;
}
export interface GardenerimAIInstance extends GardenerimBehaviorInstance {
 refresh():boolean; setOptions(patch:Partial<GardenerimAIOptions>):boolean;
 setValue(value:GardenerimAIValue,reason?:string):boolean; getState():Required<GardenerimAIValue>;
 generate(prompt?:string):Promise<boolean>; stop():boolean; pause():boolean; resume():boolean;
 retry():Promise<boolean>; decide(decision:'approved'|'rejected'|'cancelled'):boolean|Promise<boolean>;
 submitFeedback():Promise<boolean>; destroy():void;
}
export interface GardenerimMediaItem {id:string;src:string;alt?:string;title?:string;caption?:string;srcset?:Array<{src:string;descriptor:string}>;sizes?:string}
export interface GardenerimMediaValue {index?:number;open?:boolean;page?:number;zoom?:number;position?:number;rotation?:number;flipX?:boolean;flipY?:boolean;x?:number;y?:number;loaded?:boolean;error?:boolean;crop?:{x?:number;y?:number;width?:number;height?:number}}
export interface GardenerimMediaOptions {
 kind:'image'|'carousel'|'gallery-lightbox'|'media-player'|'document-viewer'|'image-crop-shell'|'responsive-image'|'image-comparison';mode?:string;
 /** current/defaultCurrent are one-based; mediaValue.index and go() remain zero-based. */
 current?:number;defaultCurrent?:number;autoPlay?:boolean|{interval?:number;hoverToPause?:boolean};animationName?:'slide'|'fade'|'card';moveSpeed?:number;trigger?:'click'|'hover';showArrow?:'always'|'hover'|'never';arrowClass?:string;indicatorType?:'dot'|'line'|'slider'|'never';indicatorPosition?:'bottom'|'top'|'left'|'right'|'outer';indicatorClass?:string;transitionTimingFunction?:string;hoverToPause?:boolean;swipe?:boolean;swipeThreshold?:number;
 title?:string;description?:string;caption?:string;src?:string;alt?:string;poster?:string;filename?:string;type?:'audio'|'video'|'pages'|'pdf';
 items?:GardenerimMediaItem[];pages?:Array<string|{text:string}>;pageCount?:number;defaultValue?:GardenerimMediaValue;
 sources?:Array<{src:string;type?:string}>;tracks?:Array<{src:string;kind?:'captions'|'subtitles'|'descriptions'|'chapters'|'metadata';srclang?:string;label?:string;default?:boolean}>;
 srcset?:Array<{src:string;descriptor:string}>;sizes?:string;crossOrigin?:'anonymous'|'use-credentials';
 size?:'small'|'medium'|'large';direction?:'ltr'|'rtl'|'horizontal'|'vertical';fit?:'cover'|'contain'|'fill'|'none'|'scale-down';
 bordered?:boolean;disabled?:boolean;readonly?:boolean;loop?:boolean;autoplay?:boolean;keyboard?:boolean;controls?:boolean;thumbnails?:boolean;download?:boolean;lazy?:boolean;muted?:boolean;
 showHeader?:boolean;showStatus?:boolean;showCaption?:boolean;showNavigation?:boolean;showPagination?:boolean;showRotation?:boolean;showToolbar?:boolean;showZoom?:boolean;showPlaylist?:boolean;showCropFields?:boolean;autoAdvance?:boolean;fullscreen?:boolean;
 height?:number|null;maxHeight?:number;thumbnailSize?:number;documentHeight?:number;playTimeout?:number;playbackRates?:number[];index?:number;
 columns?:number;ratio?:number;interval?:number;preload?:'none'|'metadata'|'auto';volume?:number;playbackRate?:number;
 zoomMin?:number;zoomMax?:number;step?:number;cropRatio?:number;outputType?:'image/png'|'image/jpeg'|'image/webp';quality?:number;maxPixels?:number;labels?:Record<string,string>;
}
export interface GardenerimMediaPlayback {playing:boolean;ended:boolean;currentTime:number;duration:number;volume:number;muted:boolean;playbackRate:number}
export interface GardenerimMediaInstance extends GardenerimBehaviorInstance {
 refresh():boolean;setOptions(options:Partial<GardenerimMediaOptions>|Partial<GardenerimImageOptions>):boolean;setValue(value:GardenerimMediaValue,reason?:string):boolean;
 getState():GardenerimMediaValue;getPlaybackState():GardenerimMediaPlayback;go(index:number,reason?:string):boolean;next():boolean;previous():boolean;
 open(index?:number):boolean;close():boolean;start():boolean;stop():boolean;play():Promise<boolean>;pause():boolean;seek(time:number):boolean;exportCrop():Promise<Blob|false>;retry():void;destroy():void;
}

export interface GardenerimImagePreviewOptions {src?:string;maskClosable?:boolean;closable?:boolean;escToClose?:boolean;keyboard?:boolean;wheelZoom?:boolean;defaultScale?:number;zoomRate?:number;current?:number;defaultCurrent?:number;infinite?:boolean;actionsLayout?:Array<'zoomIn'|'zoomOut'|'rotateLeft'|'rotateRight'|'flipX'|'flipY'|'reset'|'originalSize'|'download'|'fullScreen'>;}
export interface GardenerimImageOptions {kind?:'image';src?:string;alt?:string;width?:number|string;height?:number|string;fit?:'fill'|'cover'|'contain'|'none'|'scale-down';mode?:'default'|'square'|'circle'|'cover'|'contain';title?:string;description?:string;footerPosition?:'inner'|'outer';hideFooter?:boolean|'never';footerClass?:string;showLoader?:boolean;fallback?:string;preview?:boolean;previewVisible?:boolean;defaultPreviewVisible?:boolean;previewProps?:GardenerimImagePreviewOptions;items?:GardenerimMediaItem[];extraTemplate?:string;loaderTemplate?:string;errorTemplate?:string;srcset?:Array<{src:string;descriptor:string}>;sizes?:string;crossOrigin?:'anonymous'|'use-credentials';lazy?:boolean;disabled?:boolean;bordered?:boolean;download?:boolean;filename?:string;zoomMin?:number;zoomMax?:number;labels?:Record<string,string>;}
export interface GardenerimCollapseItem {
 key:string|number;header?:string;content?:string;contentTemplate?:string;extraTemplate?:string;
 extra?:string|{label:string;action?:string;disabled?:boolean};disabled?:boolean;showExpandIcon?:boolean;
 expandIconPosition?:'left'|'right';expandIcon?:string|{collapsed:string;expanded:string};destroyOnHide?:boolean;lazy?:boolean;
}
export interface GardenerimCollapseOptions {
 label?:string;items:GardenerimCollapseItem[];activeKey?:Array<string|number>;defaultActiveKey?:Array<string|number>;
 accordion?:boolean;bordered?:boolean;disabled?:boolean;showExpandIcon?:boolean;expandIconPosition?:'left'|'right';
 expandIcon?:string|{collapsed:string;expanded:string};destroyOnHide?:boolean;lazy?:boolean;
 keyboard?:boolean;collapsible?:boolean;animated?:boolean;duration?:number;size?:'small'|'medium'|'large';emptyText?:string;
}
export interface GardenerimAuthItem {id:string;title?:string;description?:string;date?:string;avatar?:string;status?:string;disabled?:boolean;current?:boolean;connected?:boolean;required?:boolean}
/** Public state never contains a password, OTP, recovery code or WebAuthn assertion. */
export interface GardenerimAuthValue {email?:string;phone?:string;username?:string;name?:string;domain?:string;choice?:string;method?:string;remember?:boolean;trust?:boolean;terms?:boolean;scopes?:string[];filter?:string;step?:number;open?:boolean}
export interface GardenerimAuthOptions {showHeader?:boolean;showBrand?:boolean;showStatus?:boolean;showPasswordToggle?:boolean;showPasswordRules?:boolean|null;showSearch?:boolean;showAvatars?:boolean;showProviderDescriptions?:boolean;showOtherAccount?:boolean;formMaxWidth?:number;qrSize?:number;listMaxHeight?:number|null;kind:string;mode?:string;flow?:'sign-in'|'register'|'recover'|'reset'|'profile'|'mfa';title?:string;description?:string;brand?:string;message?:string;destination?:string;avatar?:string;accountLabel?:string;deviceLabel?:string;qrSrc?:string;qrAlt?:string;identifier?:'email'|'username';items?:GardenerimAuthItem[];providers?:GardenerimAuthItem[];scopes?:GardenerimAuthItem[];recoveryCodes?:string[];size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';bordered?:boolean;disabled?:boolean;readonly?:boolean;minLength?:number;maxLength?:number;codeLength?:number;codeType?:'numeric'|'alphanumeric';confirmPassword?:boolean;requireTerms?:boolean;showRemember?:boolean;showTrust?:boolean;allowCurrentDevice?:boolean;confirmActions?:boolean;requestTimeout?:number;resendDelay?:number;expiresAt?:number;status?:'idle'|'loading'|'pending'|'success'|'error'|'expired'|'scanned';labels?:Record<string,string>;defaultValue?:GardenerimAuthValue}
export interface GardenerimAuthCredentials {password:string;confirmPassword:string;code:string;recoveryCode:string}
export interface GardenerimAuthResult {status:'success'|'error'|'pending';message?:string}
export interface GardenerimAuthInstance {refresh():void;setOptions(options:Partial<GardenerimAuthOptions>):boolean;setValue(value:GardenerimAuthValue):boolean;getState():GardenerimAuthValue;request(action:string,key?:string):string|false;resolve(requestId:string,result:GardenerimAuthResult):boolean;takeCredentials(requestId:string):GardenerimAuthCredentials|null;runPasskey(requestId:string,publicKey:PublicKeyCredentialRequestOptions|PublicKeyCredentialCreationOptions,operation?:'get'|'create'):Promise<Credential|null>;exportRecoveryCodes():Blob|null;cancel():void;destroy():void}
export interface GardenerimMobileItem {id:string;title?:string;description?:string;image?:string;alt?:string;badge?:string;icon?:string;disabled?:boolean;danger?:boolean;children?:GardenerimMobileItem[]}
export interface GardenerimMobileField {id:string;title?:string;type?:'text'|'email'|'tel'|'number'|'textarea'|'select';required?:boolean;disabled?:boolean;readonly?:boolean;minLength?:number;min?:number;max?:number;step?:number;rows?:number;placeholder?:string;value?:string;maxLength?:number;autocomplete?:string;inputMode?:string;options?:GardenerimMobileItem[]}
export interface GardenerimMobileColumn {id:string;title?:string;items:GardenerimMobileItem[]}
export interface GardenerimMobileValue {active?:string;selected?:string[];fields?:Record<string,string>;columns?:Record<string,string>;query?:string;open?:boolean;revealed?:boolean;index?:number;quantity?:number;zoom?:number;rotation?:number;snap?:number}
export interface GardenerimMobileOptions {showHeader?:boolean;showStatus?:boolean;showClear?:boolean;showControls?:boolean;showSelectionCount?:boolean;editorRows?:number;scrollMaxHeight?:number;imageFit?:'contain'|'cover'|'fill'|'none'|'scale-down';sheetHeight?:number;sheetMaxWidth?:number;targetSize?:number|null;kind:string;mode?:string;title?:string;description?:string;message?:string;actionLabel?:string;priceLabel?:string;placeholder?:string;size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';position?:'inline'|'sticky'|'fixed';bordered?:boolean;safeArea?:boolean;disabled?:boolean;readonly?:boolean;items?:GardenerimMobileItem[];actions?:GardenerimMobileItem[];fields?:GardenerimMobileField[];columns?:GardenerimMobileColumn[];multiple?:boolean;maxSelected?:number;threshold?:number;loop?:boolean;hasMore?:boolean;autoLoad?:boolean;requestTimeout?:number;duration?:number;closeOnBackdrop?:boolean;dismissible?:boolean;allowSwipe?:boolean;confirmActions?:boolean;online?:'auto'|'online'|'offline';status?:'idle'|'loading'|'error'|'success';min?:number;max?:number;step?:number;snapPoints?:number[];snap?:number;labels?:Record<string,string>;defaultValue?:GardenerimMobileValue;auth?:Partial<GardenerimAuthOptions>;commerce?:Partial<GardenerimCommerceOptions>}
export interface GardenerimMobileInstance {refresh():void;setOptions(options:Partial<GardenerimMobileOptions>):boolean;setValue(value:GardenerimMobileValue|GardenerimAuthValue|GardenerimCommerceValue):boolean;getState():GardenerimMobileValue|GardenerimAuthValue|GardenerimCommerceValue;request(action:string,key?:string):string|false;resolve(requestId:string,result:{status:'success'|'error'|'pending';message?:string}):boolean;cancel():void;open():boolean;close():boolean;next():boolean;previous():boolean;takeCredentials(id:string):GardenerimAuthCredentials|null;runPasskey(id:string,options:PublicKeyCredentialCreationOptions|PublicKeyCredentialRequestOptions,operation?:'get'|'create'):Promise<Credential|null>;getTotals():GardenerimCommerceTotals|null;destroy():void}
export interface GardenerimDesktopItem {id:string;name?:string;label?:string;description?:string;content?:string;path?:string;status?:string;severity?:'error'|'warning'|'info';message?:string;line?:number;column?:number;fixable?:boolean;read?:boolean;dirty?:boolean;pinned?:boolean;disabled?:boolean;progress?:number;updatedAt?:string;group?:string;shortcut?:string;children?:GardenerimDesktopItem[];}
export interface GardenerimDesktopField {id:string;label?:string;type?:'text'|'number'|'checkbox'|'select'|'textarea';section?:string;value?:string|number|boolean;required?:boolean;readonly?:boolean;disabled?:boolean;min?:number;max?:number;help?:string;placeholder?:string;minLength?:number;maxLength?:number;rows?:number;options?:{id:string;label?:string;name?:string;disabled?:boolean}[];}
export interface GardenerimDesktopValue {query?:string;filter?:string;page?:number;active?:string;closed?:string[];pinned?:string[];order?:string[];expanded?:boolean;dialogOpen?:boolean;sidebar?:boolean;inspector?:boolean;bottom?:boolean;collapsed?:boolean;ratio?:number;fields?:Record<string,string|number|boolean>;section?:string;shortcut?:string;recording?:boolean;progress?:number;phase?:string;maximized?:boolean;name?:string;version?:number;}
export interface GardenerimDesktopOptions {showFilter?:boolean;showProgress?:boolean;showStatus?:boolean;showReset?:boolean;showPin?:boolean;editorRows?:number;outputMaxHeight?:number;windowActions?:('minimize'|'maximize'|'restoreWindow'|'close'|'drag')[];kind:'desktop-shell'|'desktop-titlebar'|'desktop-workbench'|'desktop-native-titlebar'|'desktop-window-controls-composition'|'desktop-menubar-composition'|'desktop-activity-bar-composition'|'desktop-dock-panel'|'desktop-split-pane'|'desktop-inspector-panel'|'desktop-status-bar'|'desktop-command-palette'|'shortcut-recorder'|'desktop-context-menu'|'desktop-document-tabs'|'desktop-drag-region'|'window-loading'|'update-available'|'desktop-permission-request'|'native-file-picker'|'tray-menu-shell'|'multi-window-placeholder'|'desktop-workspace-composition'|'desktop-window-switcher'|'recent-documents'|'desktop-toolbar'|'desktop-bottom-panel'|'background-task-center'|'desktop-notification-center'|'sync-status'|'update-progress'|'crash-recovery'|'single-instance-notice'|'deep-link-handler'|'about-dialog'|'desktop-preferences'|'desktop-session-manager'|'desktop-problems-panel';mode?:string;presentation?:'inline'|'modal';closeOnEscape?:boolean;maskClosable?:boolean;title?:string;description?:string;content?:string;appName?:string;panelTitle?:string;output?:string;statusText?:string;version?:string;url?:string;triggerLabel?:string;placeholder?:string;size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';bordered?:boolean;disabled?:boolean;readonly?:boolean;status?:'ready'|'loading'|'error';platform?:'windows'|'macos'|'linux';items?:GardenerimDesktopItem[];actions?:GardenerimDesktopItem[];fields?:GardenerimDesktopField[];sections?:{id:string;name?:string;label?:string;disabled?:boolean}[];pageSize?:number;maxLength?:number;minRatio?:number;maxRatio?:number;step?:number;height?:number;orientation?:'horizontal'|'vertical';collapsible?:boolean;closable?:boolean;reorderable?:boolean;multiple?:boolean;accept?:string;maxFileSize?:number;maxFiles?:number;requestTimeout?:number;locale?:string;timeZone?:string;allowedSchemes?:string[];capabilities?:('open'|'save'|'close'|'window'|'files'|'update'|'permission'|'sync'|'tasks'|'restore'|'commands')[];requireModifier?:boolean;reservedShortcuts?:string[];shortcuts?:string[];showSearch?:boolean;labels?:Record<string,string>;defaultValue?:GardenerimDesktopValue;}
export interface GardenerimDesktopResult {status:'success'|'error';message?:string;items?:GardenerimDesktopItem[];value?:GardenerimDesktopValue;version?:number;}
export interface GardenerimDesktopHostRequest {requestId:string;action:string;key?:string;value:GardenerimDesktopValue;version:number;signal:AbortSignal;}
export interface GardenerimDesktopInstance {refresh():void;setOptions(options:Partial<GardenerimDesktopOptions>):boolean;setValue(value:GardenerimDesktopValue):boolean;getState():GardenerimDesktopValue;request(action:string,key?:string):string|false;resolve(id:string,result:GardenerimDesktopResult):boolean;cancel():boolean;takeFiles(id:string):File[]|null;setHost(callback:((request:GardenerimDesktopHostRequest)=>GardenerimDesktopResult|Promise<GardenerimDesktopResult>)|null):boolean;destroy():void;}
export interface GardenerimWorkflowField {id:string;label?:string;type?:'text'|'email'|'number'|'checkbox'|'select'|'textarea';value?:string|number|boolean;required?:boolean;readonly?:boolean;disabled?:boolean;min?:number;max?:number;help?:string;placeholder?:string;autocomplete?:string;minLength?:number;maxLength?:number;rows?:number;step?:number|'any';options?:{id:string;label?:string;disabled?:boolean}[];}
export interface GardenerimWorkflowStep {id:string;title?:string;description?:string;content?:string;optional?:boolean;hidden?:boolean;disabled?:boolean;status?:string;when?:{field:string;equals:string|number|boolean};fields?:GardenerimWorkflowField[];}
export interface GardenerimWorkflowItem {id:string;name?:string;description?:string;group?:string;actor?:string;status?:'pending'|'running'|'success'|'failed'|'cancelled';startedAt?:string;disabled?:boolean;dependsOn?:string[];steps?:GardenerimWorkflowStep[];logs?:string[];}
export interface GardenerimWorkflowNode {id:string;name?:string;description?:string;type?:'trigger'|'task'|'condition'|'approval'|'end';}
export interface GardenerimWorkflowEdge {id:string;from:string;to:string;condition?:string;}
export interface GardenerimWorkflowValue {query?:string;filter?:string;page?:number;active?:string;values?:Record<string,string|number|boolean>;completed?:string[];skipped?:string[];decisions?:Record<string,'approved'|'rejected'>;comment?:string;selected?:string;nodes?:GardenerimWorkflowNode[];edges?:GardenerimWorkflowEdge[];edgeCondition?:string;editName?:string;nodeName?:string;nodeType?:'trigger'|'task'|'condition'|'approval'|'end';from?:string;to?:string;zoom?:number;triggerType?:'manual'|'schedule'|'webhook';cron?:string;event?:string;enabled?:boolean;phase?:string;version?:number;}
export interface GardenerimWorkflowOptions {searchable?:boolean;filterable?:boolean;showProgress?:boolean;showLogs?:boolean;showSave?:boolean;showZoom?:boolean;editorRows?:number;logMaxHeight?:number;kind:'onboarding'|'wizard-layout'|'workflow-checklist'|'workflow-approval'|'workflow-builder'|'workflow-run-history'|'workflow-run-detail'|'workflow-trigger';mode?:string;title?:string;description?:string;successText?:string;webhookHint?:string;size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';bordered?:boolean;disabled?:boolean;readonly?:boolean;status?:'ready'|'loading'|'error';items?:GardenerimWorkflowItem[];steps?:GardenerimWorkflowStep[];fields?:GardenerimWorkflowField[];nodes?:GardenerimWorkflowNode[];edges?:GardenerimWorkflowEdge[];pageSize?:number;linear?:boolean;allowSkip?:boolean;allowBack?:boolean;requireComment?:boolean;approvalMode?:'sequential'|'parallel';quorum?:number;maxNodes?:number;maxLength?:number;requestTimeout?:number;locale?:string;timeZone?:string;capabilities?:('edit'|'submit'|'approve'|'run'|'retry'|'cancel')[];labels?:Record<string,string>;defaultValue?:GardenerimWorkflowValue;}
export interface GardenerimWorkflowResult {status:'success'|'error';message?:string;items?:GardenerimWorkflowItem[];value?:GardenerimWorkflowValue;version?:number;}
export interface GardenerimWorkflowHostRequest {requestId:string;action:string;key?:string;value:GardenerimWorkflowValue;version:number;signal:AbortSignal;}
export interface GardenerimWorkflowInstance {refresh():void;setOptions(options:Partial<GardenerimWorkflowOptions>):boolean;setValue(value:GardenerimWorkflowValue):boolean;getState():GardenerimWorkflowValue;request(action:string,key?:string):string|false;resolve(id:string,result:GardenerimWorkflowResult):boolean;cancel():boolean;next():boolean;previous():boolean;validate():boolean;setHost(callback:((request:GardenerimWorkflowHostRequest)=>GardenerimWorkflowResult|Promise<GardenerimWorkflowResult>)|null):boolean;destroy():void;}
export interface GardenerimCommunicationItem {id:string;title?:string;name?:string;body?:string;description?:string;author?:string;senderId?:string;group?:string;time?:string;parentId?:string;read?:boolean;archived?:boolean;starred?:boolean;resolved?:boolean;editable?:boolean;disabled?:boolean;reactions?:number;status?:'pending'|'sent'|'delivered'|'read'|'failed';}
export interface GardenerimCommunicationContact {id:string;name?:string;email?:string;group?:string;description?:string;disabled?:boolean;presence?:'online'|'away'|'busy'|'offline';}
export type GardenerimCommunicationKind='notification-center'|'inbox'|'comment-thread'|'activity-feed'|'communication-composer'|'communication-contacts'|'notification-preferences'|'communication-delivery';
export interface GardenerimCommunicationValue {items?:GardenerimCommunicationItem[];query?:string;filter?:'all'|'unread'|'starred'|'archived'|'online'|'pending'|'sent'|'delivered'|'read'|'failed'|'resolved';page?:number;active?:string;draft?:string;subject?:string;replyTo?:string;editId?:string;recipients?:string[];reacted?:string[];preferences?:Record<string,Record<string,boolean>>;quiet?:boolean;quietStart?:string;quietEnd?:string;frequency?:'instant'|'daily'|'weekly'|'never';version?:number;}
export interface GardenerimCommunicationOptions {searchable?:boolean;filterable?:boolean;showRecipients?:boolean;showSubject?:boolean|null;defaultEnabled?:boolean;editorRows?:number;kind?:GardenerimCommunicationKind;mode?:string;title?:string;description?:string;size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';status?:'ready'|'loading'|'error';sort?:'newest'|'oldest';bordered?:boolean;disabled?:boolean;readonly?:boolean;allowAttachments?:boolean;allowReply?:boolean;allowReactions?:boolean;allowResolve?:boolean;requireRecipient?:boolean;sendOnEnter?:boolean;items?:GardenerimCommunicationItem[];contacts?:GardenerimCommunicationContact[];topics?:{id:string;name?:string;description?:string;disabled?:boolean}[];channels?:{id:string;name?:string;disabled?:boolean}[];pageSize?:number;maxLength?:number;maxRecipients?:number;maxAttachments?:number;maxFileSize?:number;accept?:string[];requestTimeout?:number;locale?:string;timeZone?:string;capabilities?:('read'|'archive'|'send'|'comment'|'edit'|'react'|'resolve'|'save'|'retry'|'contact')[];labels?:Record<string,string>;defaultValue?:GardenerimCommunicationValue;}
export interface GardenerimCommunicationResult {status:'success'|'error';message?:string;version?:number;items?:GardenerimCommunicationItem[];item?:GardenerimCommunicationItem;}
export interface GardenerimCommunicationHostRequest {requestId:string;action:string;key?:string;value:GardenerimCommunicationValue;version:number;attachments:{name:string;size:number;type:string}[];files:File[];signal:AbortSignal;}
export interface GardenerimCommunicationInstance {refresh():void;setOptions(options:Partial<GardenerimCommunicationOptions>):boolean;setValue(value:GardenerimCommunicationValue):boolean;getState():GardenerimCommunicationValue;request(action:string,key?:string):string|false;resolve(id:string,result:GardenerimCommunicationResult):boolean;cancel():boolean;setHost(callback:((request:GardenerimCommunicationHostRequest)=>GardenerimCommunicationResult|Promise<GardenerimCommunicationResult>)|null):boolean;destroy():void;}
export interface GardenerimSolutionItem {id:string;title?:string;description?:string;body?:string;category?:string;value?:string|number;price?:number;yearlyPrice?:number;disabled?:boolean;}
export interface GardenerimSolutionField {id:string;label?:string;type?:'text'|'email'|'number'|'date'|'time'|'textarea'|'select'|'checkbox';required?:boolean;disabled?:boolean;defaultValue?:string|boolean;min?:string;max?:string;step?:string;minLength?:number;maxLength?:number;placeholder?:string;autocomplete?:string;rows?:number;options?:{value:string;label:string}[];}
export interface GardenerimSolutionAction {id:string;label:string;disabled?:boolean;confirm?:boolean;confirmText?:string;}
export interface GardenerimSolutionSection {id:string;title:string;description?:string;type:'cards'|'table'|'article'|'metrics'|'form'|'timeline'|'pricing'|'board';items?:GardenerimSolutionItem[];fields?:GardenerimSolutionField[];actions?:GardenerimSolutionAction[];pageSize?:number;itemLabel?:string;categoryLabel?:string;detailLabel?:string;}
export interface GardenerimSolutionValue {section?:string;query?:string;filter?:string;sort?:'original'|'ascending'|'descending';page?:number;active?:string;fields?:Record<string,Record<string,string|boolean>>;billing?:'monthly'|'yearly';version?:number;}
export interface GardenerimSolutionOptions {title?:string;description?:string;sections:GardenerimSolutionSection[];showHeader?:boolean;showStatus?:boolean;showDetails?:boolean;showPagination?:boolean;showBilling?:boolean;editorRows?:number;formColumns?:number;detailMaxHeight?:number;navigation?:'tabs'|'rail'|'all';pageSize?:number;searchable?:boolean;filterable?:boolean;sortable?:boolean;readonly?:boolean;disabled?:boolean;status?:'ready'|'loading'|'error';direction?:'ltr'|'rtl';locale?:string;currency?:string;requestTimeout?:number;labels?:Record<string,string>;defaultValue?:GardenerimSolutionValue;}
export interface GardenerimSolutionReceipt {id:string;action:string;sectionId:string;itemId?:string;}
export interface GardenerimSolutionResult {status:'success'|'error';version?:number;message?:string;receipt?:GardenerimSolutionReceipt;sections?:GardenerimSolutionSection[];value?:GardenerimSolutionValue;}
export interface GardenerimSolutionHostRequest {requestId:string;sectionId:string;action:string;itemId?:string;version:number;value:GardenerimSolutionValue;fields:Record<string,string|boolean>;item:GardenerimSolutionItem|null;signal:AbortSignal;}
export interface GardenerimSolutionInstance {refresh():void;setOptions(options:Partial<GardenerimSolutionOptions>):boolean;setValue(value:GardenerimSolutionValue):boolean;getState():GardenerimSolutionValue;request(sectionId:string,actionId:string,itemId?:string):string|false;resolve(id:string,result:GardenerimSolutionResult):boolean;cancel():boolean;setHost(callback:((request:GardenerimSolutionHostRequest)=>GardenerimSolutionResult|Promise<GardenerimSolutionResult>)|null):boolean;destroy():void;}
export type GardenerimLegalKind='cookie-consent'|'consent-preferences'|'legal-document'|'legal-agreement'|'consent-history'|'privacy-request'|'privacy-request-status'|'policy-updates';
export interface GardenerimLegalEntry {id:string;title?:string;name?:string;body?:string;description?:string;summary?:string;required?:boolean;disabled?:boolean;purpose?:string;provider?:string;duration?:string;before?:string;after?:string;effectiveAt?:string;time?:string;policyVersion?:string;choices?:Record<string,boolean>;status?:'pending'|'verifying'|'processing'|'completed'|'rejected'|'cancelled'|'accepted'|'withdrawn';steps?:GardenerimLegalEntry[];}
export interface GardenerimLegalReceipt {id:string;policyVersion:string;recordedAt:string;choices?:Record<string,boolean>;agreements?:string[];updateId?:string;}
export interface GardenerimLegalValue {confirmationVersion?:string;query?:string;filter?:'all'|'accepted'|'withdrawn'|'pending'|'verifying'|'processing'|'completed'|'rejected'|'cancelled';page?:number;active?:string;preferencesOpen?:boolean;dismissed?:boolean;choices?:Record<string,boolean>;accepted?:string[];reviewed?:boolean;receipt?:GardenerimLegalReceipt|null;items?:GardenerimLegalEntry[];requestType?:'access'|'export'|'correct'|'delete'|'restrict'|'withdraw';email?:string;name?:string;reason?:string;deleteConfirmed?:boolean;step?:1|2;acknowledged?:string[];version?:number;}
export interface GardenerimLegalOptions {searchable?:boolean;filterable?:boolean;dismissible?:boolean;hideOnConsent?:boolean;exportScope?:'all'|'filtered';kind?:GardenerimLegalKind;mode?:string;title?:string;description?:string;summary?:string;policyVersion?:string;size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';status?:'ready'|'loading'|'error';placement?:'inline'|'top'|'bottom';bordered?:boolean;disabled?:boolean;readonly?:boolean;categories?:GardenerimLegalEntry[];sections?:GardenerimLegalEntry[];agreements?:GardenerimLegalEntry[];items?:GardenerimLegalEntry[];updates?:GardenerimLegalEntry[];requestTypes?:('access'|'export'|'correct'|'delete'|'restrict'|'withdraw')[];requireReview?:boolean;requireEmail?:boolean;requireReason?:boolean;allowWithdraw?:boolean;allowCancel?:boolean;allowExport?:boolean;confirmDelete?:boolean;pageSize?:number;maxLength?:number;requestTimeout?:number;locale?:string;timeZone?:string;capabilities?:('consent'|'accept'|'request'|'cancel'|'withdraw'|'acknowledge'|'export')[];labels?:Record<string,string>;defaultValue?:GardenerimLegalValue;}
export interface GardenerimLegalResult {status:'success'|'error';message?:string;version?:number;receipt?:GardenerimLegalReceipt;item?:GardenerimLegalEntry;}
export interface GardenerimLegalHostRequest {requestId:string;action:string;key?:string;value:GardenerimLegalValue;version:number;submission:{policyVersion:string;choices:Record<string,boolean>;agreements:string[]};signal:AbortSignal;}
export interface GardenerimLegalInstance {refresh():void;setOptions(options:Partial<GardenerimLegalOptions>):boolean;setValue(value:GardenerimLegalValue):boolean;getState():GardenerimLegalValue;request(action:string,key?:string):string|false;resolve(id:string,result:GardenerimLegalResult):boolean;cancel():boolean;exportData():string|false;setHost(callback:((request:GardenerimLegalHostRequest)=>GardenerimLegalResult|Promise<GardenerimLegalResult>)|null):boolean;destroy():void;}
export interface GardenerimEnterpriseItem {id:string;name?:string;title?:string;email?:string;description?:string;status?:string;role?:string;parent?:string;memberCount?:number;memberIds?:string[];permissions?:string[];disabled?:boolean;protected?:boolean;system?:boolean;expiresAt?:string;at?:string;actor?:string;action?:string;resource?:string;before?:unknown;after?:unknown;endpoint?:string;}
export interface GardenerimEnterpriseField {id:string;label?:string;type?:'text'|'email'|'url'|'number'|'checkbox'|'select'|'textarea';section?:string;value?:string|number|boolean;required?:boolean;readonly?:boolean;disabled?:boolean;min?:number;max?:number;help?:string;placeholder?:string;autocomplete?:string;minLength?:number;maxLength?:number;rows?:number;step?:number;options?:{id:string;label?:string;disabled?:boolean}[];}
export interface GardenerimEnterpriseResource {id:string;name?:string;group?:string;disabled?:boolean;lockedRoles?:string[];grants?:Record<string,'allow'|'deny'|'inherit'>;inherited?:Record<string,'allow'|'deny'>;}
export interface GardenerimEnterpriseValue {query?:string;filter?:string;page?:number;selected?:string[];detail?:string;section?:string;fields?:Record<string,string|number|boolean>;grants?:Record<string,Record<string,'allow'|'deny'|'inherit'>>;rolePermissions?:string[];memberIds?:string[];name?:string;description?:string;email?:string;role?:string;team?:string;parent?:string;endpoint?:string;from?:string;to?:string;version?:number;}
export interface GardenerimEnterpriseOptions {kind:'enterprise-settings'|'permission-matrix'|'audit-log'|'member-management'|'invitation-manager'|'role-manager'|'team-management'|'enterprise-integrations';mode?:string;title?:string;description?:string;size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';bordered?:boolean;disabled?:boolean;readonly?:boolean;status?:'ready'|'loading'|'error';items?:GardenerimEnterpriseItem[];roles?:GardenerimEnterpriseItem[];resources?:GardenerimEnterpriseResource[];sections?:{id:string;label?:string;disabled?:boolean}[];fields?:GardenerimEnterpriseField[];members?:GardenerimEnterpriseItem[];permissionOptions?:GardenerimEnterpriseItem[];showSearch?:boolean;showFilter?:boolean;showBatch?:boolean;showReset?:boolean;showStatus?:boolean;showDetails?:boolean;editorRows?:number;detailMaxHeight?:number;pageSize?:number;maxSelected?:number;maxInvitations?:number;maxLength?:number;requestTimeout?:number;locale?:string;timeZone?:string;permissions?:('edit'|'invite'|'manageMembers'|'manageRoles'|'manageTeams'|'manageIntegrations'|'export')[];currentUserId?:string;ownerRole?:string;labels?:Record<string,string>;defaultValue?:GardenerimEnterpriseValue;}
export type GardenerimEnterpriseAction='save'|'invite'|'resend'|'revoke'|'role'|'suspend'|'activate'|'remove'|'createRole'|'renameRole'|'copy'|'deleteRole'|'createTeam'|'renameTeam'|'archive'|'connect'|'disconnect'|'test';
export interface GardenerimEnterpriseInstance {refresh():void;setOptions(options:Partial<GardenerimEnterpriseOptions>):boolean;setValue(value:GardenerimEnterpriseValue):boolean;getState():GardenerimEnterpriseValue;request(action:GardenerimEnterpriseAction,key?:string,keys?:string[]):string|false;resolve(id:string,result:{status:'success'|'error';message?:string;value?:GardenerimEnterpriseValue;items?:GardenerimEnterpriseItem[];version?:number}):boolean;cancel():boolean;exportCsv():string|null;destroy():void;}
export interface GardenerimMarketingItem { id:string; title?:string; label?:string; description?:string; href?:string; target?:'_blank'; disabled?:boolean; primary?:boolean; image?:string; url?:string; alt?:string; category?:string; children?:GardenerimMarketingItem[]; items?:GardenerimMarketingItem[]; monthly?:number|null; yearly?:number|null; featured?:boolean; badge?:string; actionLabel?:string; features?:Record<string,string|number|boolean>; quote?:string; author?:string; role?:string; }
export interface GardenerimMarketingValue { open?:boolean; expanded?:string; cycle?:'monthly'|'yearly'; quantity?:number; index?:number; filter?:string; email?:string; consent?:boolean; dismissed?:boolean; paused?:boolean; }
export interface GardenerimMarketingOptions { showBilling?:boolean; showQuantity?:boolean; showFeatures?:boolean; showFilters?:boolean; showStatus?:boolean; imageFit?:'contain'|'cover'|'fill'|'none'|'scale-down'; imageMaxHeight?:number; emailPlaceholder?:string; emailMaxLength?:number; kind:'site-header'|'hero'|'pricing'|'feature-grid'|'logo-cloud'|'testimonial'|'cta-section'|'newsletter'|'announcement-bar'|'site-footer'; mode?:string; title?:string; description?:string; eyebrow?:string; brand?:string; image?:string; imageAlt?:string; copyright?:string; navigationLabel?:string; size?:'small'|'medium'|'large'; direction?:'ltr'|'rtl'; bordered?:boolean; tone?:'neutral'|'brand'|'subtle'; align?:'start'|'center'|'end'; maxWidth?:number; gap?:number; columns?:number; disabled?:boolean; readonly?:boolean; status?:'ready'|'loading'|'error'; items?:GardenerimMarketingItem[]; actions?:GardenerimMarketingItem[]; groups?:GardenerimMarketingItem[]; categories?:GardenerimMarketingItem[]; currency?:string; locale?:string; quantity?:number; maxQuantity?:number; billingCycles?:('monthly'|'yearly')[]; requireConsent?:boolean; privacyUrl?:string; privacyLabel?:string; loop?:boolean; autoplay?:boolean; interval?:number; dismissible?:boolean; position?:'inline'|'sticky'; expiresAt?:number; requestTimeout?:number; labels?:Record<string,string>; defaultValue?:GardenerimMarketingValue; }
export interface GardenerimMarketingPrice { amount:number|null; formatted:string; cycle:'monthly'|'yearly'; currency:string; quantity:number; }
export interface GardenerimMarketingInstance { refresh():void; setOptions(options:Partial<GardenerimMarketingOptions>):boolean; setValue(value:GardenerimMarketingValue):boolean; getState():GardenerimMarketingValue; getPrice(id:string):GardenerimMarketingPrice|null; request(action:'subscribe'|'plan'|'action',key?:string):string|false; resolve(id:string,result:{status:'success'|'error';message?:string}):boolean; cancel():boolean; next():boolean; previous():boolean; destroy():void; }
export interface GardenerimCmsBlock { id:string; type:'paragraph'|'heading'|'quote'|'image'; text?:string; url?:string; alt?:string; bold?:boolean; italic?:boolean; }
export interface GardenerimCmsItem { id:string; title?:string; status?:string; disabled?:boolean; author?:string; slug?:string; description?:string; tags?:string; version?:number; url?:string; alt?:string; type?:string; size?:number; source?:string; translations?:Record<string,string>; }
export interface GardenerimCmsValue { query?:string; filter?:string; page?:number; selected?:string[]; title?:string; slug?:string; tags?:string; description?:string; note?:string; scheduledAt?:string; status?:'draft'|'review'|'approved'|'published'|'scheduled'|'rejected'|'archived'; blocks?:GardenerimCmsBlock[]; translations?:Record<string,Record<string,string>>; alt?:Record<string,string>; device?:'desktop'|'tablet'|'mobile'; missing?:boolean; version?:number; }
export interface GardenerimCmsOptions { showSearch?:boolean; showFilter?:boolean; showHistory?:boolean; showMetadata?:boolean; showUpload?:boolean; showChooser?:boolean; showStatus?:boolean; editorRows?:number; previewMaxHeight?:number; thumbnailFit?:'contain'|'cover'|'fill'|'none'|'scale-down'; blockTypes?:GardenerimCmsBlock['type'][]; kind:'cms-shell'|'visual-builder'|'rich-editor'|'media-library'|'content-workflow'|'localization-grid'; mode?:string; title?:string; description?:string; size?:'small'|'medium'|'large'; direction?:'ltr'|'rtl'; bordered?:boolean; disabled?:boolean; readonly?:boolean; status?:'ready'|'loading'|'error'; items?:GardenerimCmsItem[]; locales?:{id:string;label?:string;direction?:'ltr'|'rtl';required?:boolean;readonly?:boolean}[]; revisions?:{id:string;title?:string;value?:GardenerimCmsValue}[]; pageSize?:number; maxSelected?:number; multiple?:boolean; maxBlocks?:number; maxLength?:number; maxFileSize?:number; accept?:string; requestTimeout?:number; permissions?:('edit'|'upload'|'review'|'publish')[]; requireApproval?:boolean; showPreview?:boolean; labels?:Record<string,string>; defaultValue?:GardenerimCmsValue; }
export interface GardenerimCmsInstance { refresh():void; setOptions(options:Partial<GardenerimCmsOptions>):boolean; setValue(value:GardenerimCmsValue):boolean; getState():GardenerimCmsValue; request(action:string,key?:string):string|false; resolve(requestId:string,result:{status:'success'|'error';message?:string;version?:number;value?:GardenerimCmsValue}):boolean; cancel():boolean; takeFiles(requestId:string):File[]|null; destroy():void; }
/** Monetary amounts are integer minor units (CNY cents, JPY yen). No charge is initiated by the runtime. */
export interface GardenerimCommerceItem {id:string;title?:string;description?:string;subtitle?:string;image?:string;src?:string;alt?:string;price?:number;originalPrice?:number;yearlyPrice?:number;stock?:number;disabled?:boolean;quantity?:number;badge?:string;date?:string;href?:string;code?:string;features?:string[]}
export interface GardenerimCommerceChoice {id:string;title?:string;description?:string;price?:number;group?:'address'|'shipping'|'payment'|string;disabled?:boolean}
export interface GardenerimCommerceValue {quantities?:Record<string,number>;selected?:string[];removed?:string[];sku?:Record<string,string>;choice?:string;choices?:Record<string,string>;index?:number;step?:number;coupon?:string;fields?:{type?:'personal'|'business';name?:string;taxId?:string;email?:string};terms?:boolean;cycle?:'monthly'|'yearly';saved?:string[];open?:boolean}
export interface GardenerimCommerceOptions {
 kind:string;mode?:string;title?:string;description?:string;message?:string;orderId?:string;
 items?:GardenerimCommerceItem[];choices?:GardenerimCommerceChoice[];groups?:Array<{id:string;title?:string;options:Array<{id:string;title?:string;disabled?:boolean}>}>;
 variants?:Array<{id:string;values:Record<string,string>;price?:number;stock?:number}>;steps?:Array<string|{title:string}>;features?:string[];
 size?:'small'|'medium'|'large';direction?:'ltr'|'rtl';bordered?:boolean;disabled?:boolean;readonly?:boolean;selectable?:boolean;removable?:boolean;requireTerms?:boolean;taxIncluded?:boolean;
 showHeader?:boolean;showStatus?:boolean;showImages?:boolean;showDescription?:boolean;showSave?:boolean;showStock?:boolean;showOriginalPrice?:boolean;showCoupon?:boolean;showSummary?:boolean;showThumbnails?:boolean;showCycle?:boolean;
 imageFit?:'contain'|'cover'|'fill'|'none'|'scale-down';imageMaxHeight?:number;listMaxHeight?:number|null;
 currency?:string;locale?:string;amount?:number;originalAmount?:number;shipping?:number;tax?:number;discount?:number;min?:number;max?:number;step?:number;columns?:number;
 used?:number;limit?:number;requestTimeout?:number;status?:'idle'|'loading'|'success'|'error'|'pending';defaultValue?:GardenerimCommerceValue;labels?:Record<string,string>;
}
export interface GardenerimCommerceTotals {currency:string;subtotal:number;discount:number;shipping:number;tax:number;total:number}
export interface GardenerimCommerceResult {status:'success'|'error'|'pending';message?:string;[key:string]:unknown}
export interface GardenerimCommerceInstance {refresh():void;setOptions(options:Partial<GardenerimCommerceOptions>):boolean;setValue(value:GardenerimCommerceValue):boolean;getState():GardenerimCommerceValue;getTotals():GardenerimCommerceTotals;setQuantity(id:string,value:number):boolean;selectSku(group:string,value:string):boolean;request(action:string,key?:string):string|false;resolve(requestId:string,result:GardenerimCommerceResult):boolean;cancel():void;destroy():void}
