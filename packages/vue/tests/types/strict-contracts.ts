import { getInstance } from "@gardenerim/css/runtime";
import type { GardenerimStrictProps, GardenerimDataGridOptions } from "../../src/generated/contracts.js";
const button = { variant: "primary" } satisfies GardenerimStrictProps<"button">;
// @ts-expect-error invalid variant must be rejected
const wrongVariant: GardenerimStrictProps<"button"> = { variant: "not-a-variant" };
// @ts-expect-error invalid state must be rejected
const wrongState: GardenerimStrictProps<"button"> = { state: "not-a-state" };
// @ts-expect-error misspelled component must be rejected
type WrongName = GardenerimStrictProps<"buton">;
type Row = { id: number; name: string; amount: number };
const options: GardenerimDataGridOptions<Row> = { columns: [{field:"name"}], rows:[{id:1,name:"客户",amount:2}] };
const invalid: GardenerimDataGridOptions<Row> = {
  // @ts-expect-error misspelled row field must be rejected
  columns: [{field:"nmae"}]
};
const grid = getInstance<Row>(document.createElement("div"), "data-grid");
grid?.setOptions(options);
grid?.updateCell(1, "amount", 2);
// @ts-expect-error field value must match row type
grid?.updateCell(1, "amount", "wrong");
// @ts-expect-error sort direction must be asc/desc
grid?.setSort("amount", "down");
void [button, wrongVariant, wrongState, invalid];
