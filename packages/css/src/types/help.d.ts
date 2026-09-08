export interface GardenerimHelpItem {
  id: string; title?: string; description?: string; answer?: string; term?: string;
  category?: string; keywords?: string[]; keys?: string[]; href?: string; actionLabel?: string;
  date?: string; target?: string; placement?: string; disabled?: boolean;
  actions?: GardenerimHelpAction[];
}
export interface GardenerimHelpAction {id?: string; label: string; href?: string}
export interface GardenerimHelpValue {
  query?: string; category?: string; expanded?: string[]; completed?: string[];
  reason?: string; step?: number; open?: boolean; dismissed?: boolean; feedback?: 'yes' | 'no' | null;
}
export interface GardenerimHelpRequest {
  query: string; category: string; feedback: 'yes' | 'no' | null; reason: string; signal: AbortSignal;
}
export interface GardenerimHelpOptions {
  kind: 'tip'|'inline-hint'|'help-text'|'help-trigger'|'rich-tooltip'|'help-popover'|'definition-help'|'callout'|'note'|'guidance-pair'|'key-hint'|'shortcut-list'|'help-card'|'help-panel'|'help-center'|'help-topics'|'faq'|'contextual-help'|'coach-mark'|'spotlight'|'hotspot'|'feature-hint'|'whats-new'|'help-checklist'|'troubleshooting'|'help-feedback'|'tour-spotlight'|'help-search'|'help-glossary';
  mode?: string; title?: string; description?: string; triggerLabel?: string; trigger?: string; placeholder?: string;
  size?: 'small'|'medium'|'large'; tone?: 'neutral'|'info'|'success'|'warning'|'danger';
  bordered?: boolean; disabled?: boolean; searchable?: boolean; multiple?: boolean;
  dismissible?: boolean; readonly?: boolean; animated?: boolean; direction?: 'ltr'|'rtl';
  showHeader?: boolean; showActions?: boolean; showProgress?: boolean; showCount?: boolean; showClear?: boolean;
  showPrevious?: boolean; showStepList?: boolean; arrow?: boolean; closeOnEscape?: boolean; closeOnOutside?: boolean;
  serviceTimeout?: number; maxReasonLength?: number; minQueryLength?: number; tourPadding?: number;
  offset?: number; openDelay?: number; closeDelay?: number; maxHeight?: number;
  columns?: number; limit?: number; debounce?: number; width?: number; placement?: string;
  items?: GardenerimHelpItem[]; actions?: GardenerimHelpAction[]; keys?: string[];
  do?: string; dont?: string; doLabel?: string; dontLabel?: string;
  labels?: Record<string,string>; defaultValue?: GardenerimHelpValue;
  /** Supply service callbacks through setOptions; functions cannot be serialized as JSON. */
  load?: (request: GardenerimHelpRequest) => Promise<GardenerimHelpItem[]>;
  submit?: (request: GardenerimHelpRequest) => Promise<unknown>;
}
export interface GardenerimHelpInstance extends GardenerimBehaviorInstance {
  refresh(): boolean; setOptions(patch: Partial<GardenerimHelpOptions>): boolean;
  setValue(value: GardenerimHelpValue, reason?: string): boolean; getState(): Required<GardenerimHelpValue>;
  search(query: string): boolean; open(): boolean; close(reason?: string): boolean; go(step: number): boolean;
  submit(): boolean | Promise<boolean>; cancel(): void; destroy(): void;
}
