export interface GardenerimAIMessage {id:string; role?:'user'|'assistant'|'system'; author?:string; content:string}
export interface GardenerimAIItem {
 id:string; title?:string; name?:string; description?:string; content?:string; prompt?:string;
 category?:string; keywords?:string[]; status?:string; date?:string; parent?:string; disabled?:boolean;
 href?:string; src?:string; alt?:string; quote?:string; author?:string; tokens?:number;
 progress?:number; contextLimit?:number; format?:'markdown'|'plain'|'code'|'json';
 messages?:GardenerimAIMessage[]; actions?:Array<{id?:string;label:string;href?:string}>;
}
export interface GardenerimAIValue {
 draft?:string; query?:string; selected?:string; model?:string; output?:string; reason?:string;
 messages?:GardenerimAIMessage[]; expanded?:string[]; checked?:string[]; status?:string;
 decision?:'pending'|'approved'|'rejected'|'cancelled'|'expired'; rating?:'like'|'dislike'|null;
 page?:number; dismissed?:boolean;
}
export interface GardenerimAIGenerateRequest {
 prompt:string; model:string; messages:GardenerimAIMessage[]; context:GardenerimAIItem[];
 files:File[]; signal:AbortSignal;
}
export interface GardenerimAIOptions {
 kind:string; mode?:string; title?:string; description?:string; content?:string; prompt?:string;
 model?:string; role?:'user'|'assistant'|'system'; author?:string; placeholder?:string;
 inputLabel?:string; searchPlaceholder?:string; emptyTitle?:string; emptyDescription?:string;
 items?:GardenerimAIItem[]; messages?:GardenerimAIMessage[]; defaultValue?:GardenerimAIValue;
 size?:'small'|'medium'|'large'; direction?:'ltr'|'rtl'; format?:'markdown'|'plain'|'code'|'json';
 status?:string; bordered?:boolean; disabled?:boolean; readonly?:boolean; searchable?:boolean;
 multiple?:boolean; showActions?:boolean; autoscroll?:boolean; checkable?:boolean; attachments?:boolean;
 /** Presentation controls default to true. */
 showHeader?:boolean; showStatus?:boolean; showAuthor?:boolean; showCount?:boolean;
 showCopy?:boolean; showFeedback?:boolean; showPause?:boolean; clearOnSend?:boolean;
 composerRows?:number; resize?:'none'|'vertical'; messageGap?:number; sidebarWidth?:number;
 treeIndent?:number; codeHeight?:number; imageRatio?:'16/9'|'4/3'|'1/1'|'auto'; imageFit?:'cover'|'contain';
 /** Inactivity timeout in milliseconds, default 60000; 0 disables the timeout. */
 serviceTimeout?:number; maxReasonLength?:number;
 columns?:number; height?:number; pageSize?:number; maxLength?:number; maxOutput?:number;
 maxFiles?:number; maxFileSize?:number; accept?:string; submitKey?:'enter'|'ctrl-enter';
 used?:number; limit?:number; unit?:string; cost?:number; currency?:string; rate?:number;
 rateUnit?:string; costLabel?:string; rateLabel?:string; progress?:number; levels?:number[]; transcript?:string;
 scope?:string|Record<string,unknown>; expiresAt?:string; details?:Record<string,string|number>;
 actions?:Array<{id?:string;label:string;href?:string}>; labels?:Record<string,string>;
 /** Callbacks are set through the instance; JSON options cannot contain functions. */
 generate?:(request:GardenerimAIGenerateRequest)=>string|AsyncIterable<string>|Promise<string|AsyncIterable<string>>;
 submitFeedback?:(request:{rating:'like'|'dislike'|null;reason:string;signal:AbortSignal})=>Promise<unknown>;
 approve?:(request:{decision:string;scope:unknown;signal:AbortSignal})=>Promise<unknown>;
 record?:(request:{status:string;signal:AbortSignal})=>Promise<unknown>;
}
export interface GardenerimAIInstance extends GardenerimBehaviorInstance {
 refresh():boolean; setOptions(patch:Partial<GardenerimAIOptions>):boolean;
 setValue(value:GardenerimAIValue,reason?:string):boolean; getState():Required<GardenerimAIValue>;
 generate(prompt?:string):Promise<boolean>; stop():boolean; pause():boolean; resume():boolean;
 retry():Promise<boolean>; decide(decision:'approved'|'rejected'|'cancelled'):boolean|Promise<boolean>;
 submitFeedback():Promise<boolean>; destroy():void;
}
