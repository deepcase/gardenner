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
