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
