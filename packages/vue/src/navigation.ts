import { defineComponent, h, onMounted, onBeforeUnmount, ref, watch, type Component, type PropType } from 'vue';
import { createNavigation, type GardenerimNavigationOptions, type GardenerimNavigationInstance, type GardenerimNavigationItem } from '@gardenerim/css/runtime';
import type { GardenerimComponentDefinition } from './types.js';

/** The same controller is used by all framework bindings. Legacy slots remain compatible. */
export function createGardenerimNavigationComponent(definition:GardenerimComponentDefinition,Legacy:Component){
 return defineComponent({
  name:definition.exportName,inheritAttrs:false,
  props:{
   items:{type:Array as PropType<readonly GardenerimNavigationItem[]>,default:undefined},
   navigation:{type:Object as PropType<GardenerimNavigationOptions>,default:undefined},
   modelValue:{type:[String,Number],default:undefined},
  },
  emits:['update:modelValue','change','select','update:open','update:collapsed','update:expandedKeys','update:pageSize','load-more','previous','next','back','close-item','check','error'],
  setup(props,{attrs,slots,emit,expose}){
   const host=ref<HTMLElement|null>(null),legacy=ref<any>(null);let controller:GardenerimNavigationInstance|undefined;
   const enhanced=()=>props.items!==undefined||props.navigation!==undefined;
   const options=()=>{const config={...props.navigation,...Object.fromEntries(Object.entries(attrs).map(([key,value])=>[key.replace(/-([a-z])/g,(_,c:string)=>c.toUpperCase()),value]))} as GardenerimNavigationOptions;const callbacks={
    onChange:(detail:any)=>{emit('update:modelValue',detail.value);emit('change',detail);},
    onSelect:(detail:any)=>emit('select',detail.value),onOpen:(d:any)=>emit('update:open',d.value),onCollapse:(d:any)=>emit('update:collapsed',d.value),onExpand:(d:any)=>emit('update:expandedKeys',d.value),onPageSizeChange:(d:any)=>emit('update:pageSize',d.value),
    onLoadMore:()=>emit('load-more'),onPrevious:()=>emit('previous'),onNext:()=>emit('next'),onBack:()=>emit('back'),onCloseItem:(d:any)=>emit('close-item',d.value),onCheck:(d:any)=>emit('check',d.value),onError:(d:any)=>emit('error',d.value),
   };return {...config,...Object.fromEntries(Object.entries(callbacks).map(([name,notify])=>[name,(detail:any,event:CustomEvent)=>{(config as any)[name]?.(detail,event);notify(detail);} ])),items:props.items??config.items??[],value:props.modelValue??config.value,component:definition.name} as GardenerimNavigationOptions;};
   const update=()=>{if(!enhanced()){controller?.destroy();controller=undefined;return;}if(!host.value)return;if(!controller)controller=createNavigation(host.value,options());else controller.update(options());};
   onMounted(update);watch(()=>[props.items,props.navigation,props.modelValue,{...attrs}],update,{deep:true,flush:'post'});onBeforeUnmount(()=>controller?.destroy());
   expose({get element(){return controller?.element??legacy.value?.element;},getInstance:(...args:unknown[])=>controller??legacy.value?.getInstance(...args),refresh:()=>controller?update():legacy.value?.refresh(),focus:()=>controller?.focus(),open:()=>controller?.open(),close:()=>controller?.close(),cancel:()=>controller?.cancel(),select:(value:string|number)=>controller?.select(value)});
   return ()=>enhanced()?h('div',{ref:host,class:attrs.class,style:attrs.style,id:attrs.id,'data-navigation-host':definition.name}):h(Legacy,{...attrs,ref:legacy,...(props.modelValue!==undefined?{modelValue:props.modelValue}:{}),'onUpdate:modelValue':(value:unknown)=>emit('update:modelValue',value)},slots);
  },
 });
}
