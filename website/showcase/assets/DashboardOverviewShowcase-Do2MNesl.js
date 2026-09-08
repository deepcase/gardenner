var e=`<script setup lang="ts">
import {ref,onMounted,onBeforeUnmount} from 'vue';
const root=ref<HTMLElement>(),frame=ref<HTMLIFrameElement>(),height=ref(620);
let observer:MutationObserver;
const sync=()=>{const provider=root.value?.closest('[data-g-theme]');if(!provider)return;const axes=Object.fromEntries(['theme','mode','density','shape','elevation','typography'].map(axis=>[axis,provider.getAttribute('data-g-'+axis)||'']));frame.value?.contentWindow?.postMessage({type:'gardener-theme',axes},location.origin);};
const resize=(event:MessageEvent)=>{if(event.origin===location.origin&&event.source===frame.value?.contentWindow&&event.data?.type==='gardener-preview-size'){height.value=Math.max(320,Math.min(1000,Number(event.data.height)||620));sync();}};
onMounted(()=>{observer=new MutationObserver(sync);const provider=root.value?.closest('[data-g-theme]');if(provider)observer.observe(provider,{attributes:true});window.addEventListener('message',resize);});
onBeforeUnmount(()=>{observer?.disconnect();window.removeEventListener('message',resize);});
<\/script>
<template><section ref="root" class="component-doc"><h2>联动经营概览</h2><p>选择周期、团队或输入系列关键词，点击“应用筛选”同步更新营业额和图表。“重置”恢复默认条件。下方逐项提供全部组件的参数、状态和变体。</p><iframe ref="frame" title="仪表盘筛选与图表联动演示" src="./preview.html?component=dashboard&amp;dashboardOverview=true" :style="{width:'100%',height:height+'px',border:'0',display:'block'}" @load="sync" /></section></template>
`;export{e as default};