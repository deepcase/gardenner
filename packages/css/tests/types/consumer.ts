import Gardenerim, {
  Gardenerim as namedGardenerim,
  destroy,
  emit,
  getInstance,
  init,
  observe,
  register,
  toast,
  type GardenerimBehaviorFactory,
  type GardenerimBehaviorName,
  type GardenerimEventName,
} from "@gardenerim/css";
import { bindTauriWindowControls, type GardenerimTauriBridge } from "@gardenerim/css/tauri";
import { bindElectronWindowControls, type GardenerimElectronBridge } from "@gardenerim/css/electron";
import runtime, { init as initRuntime } from "@gardenerim/css/runtime";
import runtimeJs from "@gardenerim/css/runtime.js";
import runtimeMin from "@gardenerim/css/runtime.min.js";
import { bindTauriWindowControls as bindTauriMin } from "@gardenerim/css/tauri.min.js";
import { bindElectronWindowControls as bindElectronMin } from "@gardenerim/css/electron.min.js";

const behavior: GardenerimBehaviorName = "dialog";
const event: GardenerimEventName = "open";
const factory: GardenerimBehaviorFactory = (element) => ({ element, destroy() {} });
register("consumer-test", factory);
init(document);
destroy(document);
observe();
emit(document, event, { behavior });
toast({ title: "Saved", tone: "success", timeout: 1000 });
toast({ id: "sync", message: "Syncing", tone: "loading", position: "bottom", duration: 0, closable: true, actionLabel: "Cancel" });
toast.config({ maxCount: 3, position: "top", showIcon: true });
toast.clear("bottom");
getInstance("[data-g-dialog]", "dialog")?.destroy?.();
Gardenerim.init();
namedGardenerim.destroy();

const tauriBridge: GardenerimTauriBridge = { minimize() {} };
const electronBridge: GardenerimElectronBridge = { windowAction() {} };
bindTauriWindowControls(document, tauriBridge).destroy();
bindElectronWindowControls(document, electronBridge).destroy();
initRuntime();
runtime.init();
runtimeJs.observe();
runtimeMin.destroy();
bindTauriMin(document, tauriBridge).destroy();
bindElectronMin(document, electronBridge).destroy();

import type {GardenerimContentOptions, GardenerimContentSnapshot} from '@gardenerim/css';
const contentConfig: GardenerimContentOptions = {kind:'markdown-editor',showHeader:false,editorRows:4,resize:'none',maxHeight:480,serviceTimeout:3000,save:async(text,{signal})=>{void text;void signal;}};
const contentController=getInstance(document.body,'content');
contentController?.setOptions(contentConfig);
const contentSnapshot: GardenerimContentSnapshot | undefined=contentController?.getState();
void contentSnapshot;
// @ts-expect-error Content column counts are numeric.
contentController?.setOptions({columns:'three'});
// @ts-expect-error Unknown content component names are rejected.
contentController?.setOptions({kind:'missing-editor'});

import type {GardenerimInteractionOptions,GardenerimInteractionSnapshot} from '@gardenerim/css';
const interactionConfig:GardenerimInteractionOptions={kind:'entity-picker',columns:2,showHeader:false,serviceTimeout:1000};
const interactionController=getInstance(document.body,'interaction');interactionController?.setOptions(interactionConfig);
const interactionSnapshot:GardenerimInteractionSnapshot|undefined=interactionController?.getState();void interactionSnapshot;
// @ts-expect-error Invalid interaction component names are rejected.
interactionController?.setOptions({kind:'unknown-picker'});
// @ts-expect-error Size dimensions must be numeric.
interactionController?.setOptions({listHeight:'tall'});

import type {GardenerimDashboardOptions,GardenerimDashboardSnapshot} from '@gardenerim/css';
const dashboardConfig:GardenerimDashboardOptions={showLegend:false,lineWidth:4,donutWidth:40,serviceTimeout:1000};
const dashboardController=getInstance(document.body,'dashboard');dashboardController?.setOptions(dashboardConfig);dashboardController?.cancel();
const dashboardState:GardenerimDashboardSnapshot|undefined=dashboardController?.getState();void dashboardState;
// @ts-expect-error Dashboard dimensions must be numeric.
dashboardController?.setOptions({tableHeight:'tall'});
// @ts-expect-error Private service state cannot be written as public state.
dashboardController?.setValue({loading:true});

const displayController=getInstance(document.body,'data-display');displayController?.setOptions({showSearch:false,tableHeight:320,serviceTimeout:2000});displayController?.cancel();
// @ts-expect-error Typed data display dimensions.
displayController?.setOptions({laneWidth:'wide'});
// @ts-expect-error Unknown data display kind.
displayController?.setOptions({kind:'unknown'});

displayController?.setOptions({kind:'calendar',modelValue:new Date(2026,8,7),pageShowDate:'2026-09-01',defaultMode:'year',panel:true,panelWidth:265,dayStartOfWeek:1,disabledDate:date=>date.getDay()===0,dateInnerContent:(_date,context)=>context.events.length+' events',headerRender:context=>{context.onChangePageDate('2026-10-01');return context.mode;}});
// @ts-expect-error Calendar modes deliberately match the supported month/year views.
displayController?.setOptions({mode:'day'});
// @ts-expect-error Date predicates must return a boolean.
displayController?.setOptions({disabledDate:()=>Promise.resolve(true)});

import type {GardenerimTimelineOptions} from '@gardenerim/css';
const timelineOptions:GardenerimTimelineOptions={items:[{key:'release',content:'Released',dotType:'hollow',lineType:'dashed'}],direction:'horizontal',mode:'alternate',labelPosition:'relative',pending:'Processing',itemMinWidth:180};
displayController?.setOptions(timelineOptions);displayController?.scrollTo('release');
// @ts-expect-error Timeline rejects unknown directions.
const invalidTimeline:GardenerimTimelineOptions={direction:'diagonal'};void invalidTimeline;

import type {GardenerimTooltipOptions} from '@gardenerim/css';
const tooltipOptions:GardenerimTooltipOptions={mini:true,backgroundColor:'#373739',content:'Help',position:'rt',trigger:['hover','focus']};void tooltipOptions;
getInstance(document.body,'tooltip')?.reposition();
// @ts-expect-error mini must be boolean.
const invalidTooltip:GardenerimTooltipOptions={mini:'small'};void invalidTooltip;

const treeController=getInstance(document.body,'tree');treeController?.setOptions({data:[{key:'root',title:'Root'}],checkable:true,checkedStrategy:'parent',virtualListProps:{height:240}});treeController?.check('root',true);treeController?.getState().halfCheckedKeys;
// @ts-expect-error Tree sizes are a fixed union.
treeController?.setOptions({size:'huge'});
// @ts-expect-error Async loaders must produce node arrays.
treeController?.setOptions({loadMore:()=>42});

treeController?.setOptions({fieldNames:{key:"id",title:"name"},data:[{id:1,name:"Mapped field"}]});

import type {GardenerimFoundationOptions,GardenerimFoundationInstance} from '../../dist/gardener.js';
const foundationOptions:GardenerimFoundationOptions={step:.1,precision:2,alpha:true,resizeDirections:['right'],items:[{key:'docs',label:'Docs'}]};
const foundationController = null as GardenerimFoundationInstance|null;
foundationController?.setOptions(foundationOptions);
