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
