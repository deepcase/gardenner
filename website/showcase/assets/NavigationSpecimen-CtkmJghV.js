var e=`<script setup lang="ts">
import { ref,onMounted,onBeforeUnmount } from 'vue';
const props=defineProps<{name:string;scenario:string;mobile?:boolean}>();
const frame=ref<HTMLIFrameElement>(),height=ref(550);
const theme=()=>{const provider=frame.value?.closest('[data-g-theme]');if(provider)frame.value?.contentWindow?.postMessage({type:'gardener-theme',axes:Object.fromEntries(['theme','mode','density','shape','elevation','typography'].map(a=>[a,provider.getAttribute(\`data-g-\${a}\`)]))},location.origin);};
const resize=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===frame.value?.contentWindow&&e.data?.type==='gardener-preview-size'){height.value=e.data.height;theme();}};
let observer:MutationObserver;onMounted(()=>{window.addEventListener('message',resize);observer=new MutationObserver(theme);const provider=frame.value?.closest('[data-g-theme]');if(provider)observer.observe(provider,{attributes:true});});onBeforeUnmount(()=>{window.removeEventListener('message',resize);observer?.disconnect();});
<\/script>
<template><div class="navigation-specimen"><iframe ref="frame" loading="lazy" :title="\`\${name} \${scenario} 参数演示\`" :src="\`./preview.html?component=\${name}&scenario=\${scenario}\`" :style="{height:\`\${height}px\`,width:mobile?'390px':'100%'}" @load="theme" /></div></template>
<style scoped>.navigation-specimen{display:flex;justify-content:center;border:1px solid var(--g-color-border);border-radius:8px;background:var(--g-color-surface-subtle);overflow:hidden}.navigation-specimen iframe{border:0;display:block;max-width:100%;background:var(--g-color-surface)}</style>
`;export{e as default};