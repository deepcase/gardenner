export interface GardenerimLayoutOptions {
  kind: 'grid-system' | 'region-layout-system' | 'classic-layout-primitives' | 'page-header' | 'section-header' | 'subheader' | 'footer-bar' | 'app-shell' | 'dashboard' | 'mobile-shell' | 'responsive-container';
  /** Valid modes are listed in the layout component catalog. */
  mode?: string;
  gap?: number | string; rowGap?: number | string; columnGap?: number | string;
  padding?: number | string; minItemWidth?: number | string;
  sidebarWidth?: number | string; asideWidth?: number | string;
  headerHeight?: number | string; footerHeight?: number | string;
  minHeight?: number | string; maxWidth?: number | string; height?: number | string; offset?: number | string;
  /** Logical padding overrides, independent of the selected mode. */
  paddingBlock?: number | string; paddingInline?: number | string;
  maxHeight?: number | string; autoRows?: number | string;
  narrowColumns?: number;
  alignContent?: 'start' | 'center' | 'end' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  closeOnEscape?: boolean; collapsible?: boolean; focusOnCollapse?: boolean;
  columns?: number; breakpoint?: number; ratio?: number;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  position?: 'contained' | 'page'; overflow?: 'visible' | 'auto' | 'hidden'; direction?: 'ltr' | 'rtl';
  wrap?: boolean; responsive?: boolean; collapsed?: boolean; disabled?: boolean;
}
export interface GardenerimLayoutState { collapsed: boolean; }
export interface GardenerimLayoutInstance extends GardenerimBehaviorInstance {
  refresh(): boolean | undefined;
  setOptions(options: Partial<GardenerimLayoutOptions>): boolean | undefined;
  getState(): GardenerimLayoutState;
  setValue(value: GardenerimLayoutState, reason?: string): boolean;
  toggle(): boolean;
  destroy(): void;
}
