/** Shared CSS/Vue/React/AngularJS/Blazor configuration serialized as overlay-options. */
export interface GardenerimPopoverOptions {
  title?: string; content?: string;
  popupVisible?: boolean; defaultPopupVisible?: boolean;
  trigger?: 'hover'|'focus'|'click'|'contextMenu'|'manual'|readonly ('hover'|'focus'|'click'|'contextMenu')[];
  position?: 'top'|'bottom'|'left'|'right'|'tl'|'tr'|'bl'|'br'|'lt'|'lb'|'rt'|'rb'|'top-start'|'top-end'|'bottom-start'|'bottom-end'|'left-start'|'left-end'|'right-start'|'right-end';
  disabled?: boolean; showArrow?: boolean;
  width?: number|string; height?: number|string; maxHeight?: number|string;
  popupOffset?: number; boundary?: number;
  /** Hover delays in milliseconds. */
  mouseEnterDelay?: number; mouseLeaveDelay?: number;
  closeOnEscape?: boolean; closeOnOutside?: boolean;
  autoFocus?: boolean; restoreFocus?: boolean; topLayer?: boolean;
  contentClass?: string; contentStyle?: Readonly<Record<string,string|number>>;
  arrowClass?: string; arrowStyle?: Readonly<Record<string,string|number>>;
}
export interface GardenerimPopoverInstance extends GardenerimBehaviorInstance {
  open():void; close(reason?:string):void; toggle():void; isOpen():boolean;
  reposition():void; setBusy(value:boolean):void; complete(success?:boolean,error?:string):void; destroy():void;
}

/** Tooltip shares floating options; interactive content belongs in Popover. */
export interface GardenerimTooltipOptions extends Omit<GardenerimPopoverOptions,'title'|'autoFocus'|'restoreFocus'> {mini?:boolean;backgroundColor?:string;}
export interface GardenerimTooltipInstance extends GardenerimBehaviorInstance {open():void;close(reason?:string):void;toggle():void;isOpen():boolean;reposition():void;destroy():void;}
