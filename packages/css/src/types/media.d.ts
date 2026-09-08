export interface GardenerimMediaItem {id:string;src:string;alt?:string;title?:string;caption?:string;srcset?:Array<{src:string;descriptor:string}>;sizes?:string}
export interface GardenerimMediaValue {index?:number;open?:boolean;page?:number;zoom?:number;position?:number;rotation?:number;flipX?:boolean;flipY?:boolean;x?:number;y?:number;loaded?:boolean;error?:boolean;crop?:{x?:number;y?:number;width?:number;height?:number}}
export interface GardenerimMediaOptions {
 kind:'image'|'carousel'|'gallery-lightbox'|'media-player'|'document-viewer'|'image-crop-shell'|'responsive-image'|'image-comparison';mode?:string;
 /** current/defaultCurrent are one-based; mediaValue.index and go() remain zero-based. */
 current?:number;defaultCurrent?:number;autoPlay?:boolean|{interval?:number;hoverToPause?:boolean};animationName?:'slide'|'fade'|'card';moveSpeed?:number;trigger?:'click'|'hover';showArrow?:'always'|'hover'|'never';arrowClass?:string;indicatorType?:'dot'|'line'|'slider'|'never';indicatorPosition?:'bottom'|'top'|'left'|'right'|'outer';indicatorClass?:string;transitionTimingFunction?:string;hoverToPause?:boolean;swipe?:boolean;swipeThreshold?:number;
 title?:string;description?:string;caption?:string;src?:string;alt?:string;poster?:string;filename?:string;type?:'audio'|'video'|'pages'|'pdf';
 items?:GardenerimMediaItem[];pages?:Array<string|{text:string}>;pageCount?:number;defaultValue?:GardenerimMediaValue;
 sources?:Array<{src:string;type?:string}>;tracks?:Array<{src:string;kind?:'captions'|'subtitles'|'descriptions'|'chapters'|'metadata';srclang?:string;label?:string;default?:boolean}>;
 srcset?:Array<{src:string;descriptor:string}>;sizes?:string;crossOrigin?:'anonymous'|'use-credentials';
 size?:'small'|'medium'|'large';direction?:'ltr'|'rtl'|'horizontal'|'vertical';fit?:'cover'|'contain'|'fill'|'none'|'scale-down';
 bordered?:boolean;disabled?:boolean;readonly?:boolean;loop?:boolean;autoplay?:boolean;keyboard?:boolean;controls?:boolean;thumbnails?:boolean;download?:boolean;lazy?:boolean;muted?:boolean;
 showHeader?:boolean;showStatus?:boolean;showCaption?:boolean;showNavigation?:boolean;showPagination?:boolean;showRotation?:boolean;showToolbar?:boolean;showZoom?:boolean;showPlaylist?:boolean;showCropFields?:boolean;autoAdvance?:boolean;fullscreen?:boolean;
 height?:number|null;maxHeight?:number;thumbnailSize?:number;documentHeight?:number;playTimeout?:number;playbackRates?:number[];index?:number;
 columns?:number;ratio?:number;interval?:number;preload?:'none'|'metadata'|'auto';volume?:number;playbackRate?:number;
 zoomMin?:number;zoomMax?:number;step?:number;cropRatio?:number;outputType?:'image/png'|'image/jpeg'|'image/webp';quality?:number;maxPixels?:number;labels?:Record<string,string>;
}
export interface GardenerimMediaPlayback {playing:boolean;ended:boolean;currentTime:number;duration:number;volume:number;muted:boolean;playbackRate:number}
export interface GardenerimMediaInstance extends GardenerimBehaviorInstance {
 refresh():boolean;setOptions(options:Partial<GardenerimMediaOptions>|Partial<GardenerimImageOptions>):boolean;setValue(value:GardenerimMediaValue,reason?:string):boolean;
 getState():GardenerimMediaValue;getPlaybackState():GardenerimMediaPlayback;go(index:number,reason?:string):boolean;next():boolean;previous():boolean;
 open(index?:number):boolean;close():boolean;start():boolean;stop():boolean;play():Promise<boolean>;pause():boolean;seek(time:number):boolean;exportCrop():Promise<Blob|false>;retry():void;destroy():void;
}

export interface GardenerimImagePreviewOptions {src?:string;maskClosable?:boolean;closable?:boolean;escToClose?:boolean;keyboard?:boolean;wheelZoom?:boolean;defaultScale?:number;zoomRate?:number;current?:number;defaultCurrent?:number;infinite?:boolean;actionsLayout?:Array<'zoomIn'|'zoomOut'|'rotateLeft'|'rotateRight'|'flipX'|'flipY'|'reset'|'originalSize'|'download'|'fullScreen'>;}
export interface GardenerimImageOptions {kind?:'image';src?:string;alt?:string;width?:number|string;height?:number|string;fit?:'fill'|'cover'|'contain'|'none'|'scale-down';mode?:'default'|'square'|'circle'|'cover'|'contain';title?:string;description?:string;footerPosition?:'inner'|'outer';hideFooter?:boolean|'never';footerClass?:string;showLoader?:boolean;fallback?:string;preview?:boolean;previewVisible?:boolean;defaultPreviewVisible?:boolean;previewProps?:GardenerimImagePreviewOptions;items?:GardenerimMediaItem[];extraTemplate?:string;loaderTemplate?:string;errorTemplate?:string;srcset?:Array<{src:string;descriptor:string}>;sizes?:string;crossOrigin?:'anonymous'|'use-credentials';lazy?:boolean;disabled?:boolean;bordered?:boolean;download?:boolean;filename?:string;zoomMin?:number;zoomMax?:number;labels?:Record<string,string>;}
