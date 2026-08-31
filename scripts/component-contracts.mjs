/** Generated strict, opt-in contracts. Existing open-ended component props stay compatible. */
export function componentContracts(components) {
  const union = values => values.length ? values.map(value => JSON.stringify(value)).join(" | ") : "never";
  const entries = components.map(item => `  ${JSON.stringify(item.name)}: { variant: ${union(item.variants || [])}; state: ${union(item.states || [])}; behavior: ${union(item.behaviors || [])}; };`).join("\n");
  return `/** Generated from the same metadata as components; do not edit. */
export interface GardenerimComponentContractMap {
${entries}
}
export type GardenerimComponentName = keyof GardenerimComponentContractMap;
export type GardenerimVariant<Name extends GardenerimComponentName> = GardenerimComponentContractMap[Name]["variant"];
export type GardenerimState<Name extends GardenerimComponentName> = GardenerimComponentContractMap[Name]["state"];
export type GardenerimStrictProps<Name extends GardenerimComponentName, Value = unknown> = {
  variant?: GardenerimVariant<Name> | readonly GardenerimVariant<Name>[];
  state?: GardenerimState<Name> | readonly GardenerimState<Name>[];
  value?: Value;
  onValueChange?: (value: Value, event: Event) => void;
};
export type { GardenerimRowKey, GardenerimGridColumn, GardenerimGridQuery, GardenerimGridState, GardenerimGridChange, GardenerimDataGridOptions, GardenerimDataGridInstance } from "@gardenerim/css/runtime";
`;
}
