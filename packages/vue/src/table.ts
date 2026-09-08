import {defineComponent,h,onMounted,onBeforeUnmount,ref,watch,type Component,type PropType} from 'vue';
import {createTable,type GardenerimTableOptions,type GardenerimTableColumn,type GardenerimTableInstance} from '@gardenerim/css/runtime';
export function createGardenerimTableComponent(Legacy:Component){
 return defineComponent({name:'GTable',inheritAttrs:false,
  props:{table:{type:Object as PropType<GardenerimTableOptions>,default:undefined},columns:{type:Array as PropType<GardenerimTableColumn[]>,default:undefined},data:{type:Array as PropType<Record<string,unknown>[]>,default:undefined}},
  emits:['change','selection-change','expand','sorter-change','filter-change','page-change','page-size-change','edit','error'],
  setup(props,{attrs,slots,emit,expose}){
   const host=ref<HTMLElement|null>(null),legacy=ref<any>(null);let controller:GardenerimTableInstance|undefined;
   const enhanced=()=>props.table!==undefined||props.columns!==undefined;
   const options=()=>{const config={...props.table,columns:props.columns??props.table?.columns??[],data:props.data??props.table?.data??[]};return {...config,onChange:(detail:any,event:CustomEvent)=>{config.onChange?.(detail,event);emit('change',detail);const name=({selection:'selection-change',expand:'expand',sort:'sorter-change',filter:'filter-change',page:'page-change',pageSize:'page-size-change',edit:'edit'} as const)[detail.reason as 'selection'];if(name)emit(name,detail);},onError:(error:unknown)=>{config.onError?.(error);emit('error',error);}};};
   const update=()=>{if(!enhanced()){controller?.destroy();controller=undefined;return;}if(host.value){if(controller&&controller.element!==host.value){controller.destroy();controller=undefined;}if(controller)controller.update(options());else controller=createTable(host.value,options());}};
   onMounted(update);watch(()=>[props.table,props.columns,props.data],update,{deep:true,flush:'post'});onBeforeUnmount(()=>controller?.destroy());
   expose({get element(){return controller?.element??legacy.value?.element;},getInstance:()=>controller??legacy.value?.getInstance(),refresh:update});
   return()=>enhanced()?h('div',{...attrs,ref:host,'data-table-host':'vue'}):h(Legacy,{...attrs,ref:legacy},slots);
  }
 });
}
