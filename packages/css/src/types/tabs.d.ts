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
