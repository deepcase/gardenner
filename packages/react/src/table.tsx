import {createElement,forwardRef,useEffect,useImperativeHandle,useRef} from 'react';
import {createTable,type GardenerimTableInstance} from '@gardenerim/css/runtime';
import type {GardenerimComponentProps,GardenerimComponentHandle} from './types.js';
export const Table=forwardRef<GardenerimComponentHandle,GardenerimComponentProps>(function Table({table,columns,data,className,style,id},ref){
 const host=useRef<HTMLDivElement>(null),controller=useRef<GardenerimTableInstance|null>(null);
 const options=()=>({...table,columns:columns??table?.columns??[],data:data??table?.data??[]});
 useEffect(()=>{if(host.current)controller.current=createTable(host.current,options());return()=>{controller.current?.destroy();controller.current=null;};},[]);
 useEffect(()=>{controller.current?.update(options());},[table,columns,data]);
 useImperativeHandle(ref,()=>({get element(){return host.current;},getInstance:()=>controller.current as any,refresh:()=>{controller.current?.update(options());}}),[table,columns,data]);
 return createElement('div',{ref:host,className,style,id,'data-table-host':'react'});
});
