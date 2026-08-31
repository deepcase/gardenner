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
