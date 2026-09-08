import { createElement, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { createNavigation, type GardenerimNavigationInstance } from '@gardenerim/css/runtime';
import type { GardenerimComponentDefinition, GardenerimComponentProps, GardenerimComponentHandle } from './types.js';

export const Navigation = forwardRef<GardenerimComponentHandle,GardenerimComponentProps & {definition:GardenerimComponentDefinition}>(function Navigation({definition,navigation,items,value,onValueChange,className,style,id},ref){
 const host=useRef<HTMLDivElement>(null),controller=useRef<GardenerimNavigationInstance|null>(null);
 const current=useRef({navigation,items,value,onValueChange});current.current={navigation,items,value,onValueChange};
 const options=()=>({...current.current.navigation,items:current.current.items??current.current.navigation?.items??[],component:definition.name,
  value:(current.current.value??current.current.navigation?.value) as string|number|undefined,
  onChange:(detail:any,event:CustomEvent)=>{current.current.navigation?.onChange?.(detail,event);current.current.onValueChange?.(detail.value,event);}});
 useEffect(()=>{if(!host.current)return;controller.current=createNavigation(host.current,options());return()=>{controller.current?.destroy();controller.current=null;};},[definition.name]);
 useEffect(()=>{controller.current?.update(options());},[navigation,items,value,onValueChange]);
 useImperativeHandle(ref,()=>({get element(){return host.current;},getInstance:()=>controller.current as any,refresh:()=>controller.current?.update(options()),focus:()=>controller.current?.focus(),open:()=>controller.current?.open(),close:()=>controller.current?.close(),cancel:()=>controller.current?.cancel(),select:(key:string|number)=>controller.current?.select(key)}),[]);
 return createElement('div',{ref:host,className,style,id,'data-navigation-host':definition.name});
});
