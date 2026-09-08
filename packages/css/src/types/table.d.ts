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
