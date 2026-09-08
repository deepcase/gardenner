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
