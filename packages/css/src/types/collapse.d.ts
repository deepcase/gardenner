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
