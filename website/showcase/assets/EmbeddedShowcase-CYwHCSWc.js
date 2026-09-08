var e=`<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { componentCatalog } from '@gardenerim/vue';
import ComponentExample from './ComponentExample.vue';
import { showcaseName } from '../showcaseRegistry';
const query = new URLSearchParams(location.search);
const component = computed(() => componentCatalog.find(item => item.name === query.get('component') || item.exportName === query.get('component')));
const main = ref<HTMLElement>();
const source = ref('');
const sourceError = ref('');
const sources = import.meta.glob('./*.vue', { query: '?raw', import: 'default' });
async function showSource(event: Event) {
  if (!(event.target as HTMLDetailsElement).open || source.value || !component.value) return;
  try {
    if (showcaseName(component.value) === 'ComponentShowcase') {
      const { default: examples } = await import('../data/examples.json');
      const fixture = (examples as Record<string, { source: string; html: string }>)[component.value.name];
      source.value = fixture?.source || fixture?.html || '';
    } else source.value = String(await sources[\`./\${showcaseName(component.value)}.vue\`]?.());
  } catch { sourceError.value = '源码加载失败，请关闭后重新打开。'; }
}
let observer: ResizeObserver | undefined;
let mutations: MutationObserver | undefined;
let frame = 0;
function notifySize() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    if (!main.value) return;
    const height = Math.ceil(main.value.getBoundingClientRect().height);
    parent.postMessage({ type: 'gardener-showcase-size', component: component.value?.name, height }, location.origin);
    if (component.value && main.value.querySelector(\`#component-\${component.value.name}\`)) document.documentElement.dataset.showcaseReady = 'true';
  });
}
onMounted(() => {
  document.documentElement.dataset.gTheme = 'garden';
  document.documentElement.dataset.gMode = 'light';
  observer = new ResizeObserver(notifySize);
  mutations = new MutationObserver(notifySize);
  if (main.value) { observer.observe(main.value); mutations.observe(main.value, { childList: true, subtree: true }); }
  notifySize();
});
onBeforeUnmount(() => { observer?.disconnect(); mutations?.disconnect(); cancelAnimationFrame(frame); });
<\/script>

<template>
  <main ref="main" class="showcase-app embedded-showcase">
    <ComponentExample v-if="component" :definition="component" />
    <p v-else role="alert">未找到这个组件，请返回目录重新选择。</p>
    <details v-if="component" class="embedded-source" @toggle="showSource">
      <summary>演示源文件 · {{ component.exportName }}</summary>
      <p v-if="sourceError" role="alert">{{ sourceError }}</p>
      <pre v-else><code>{{ source || '正在读取源码…' }}</code></pre>
    </details>
  </main>
</template>

<style>
html, body, #app { margin: 0; min-width: 0; min-height: 0; background: var(--g-color-surface); }
html { scroll-behavior: auto; }
.embedded-showcase { min-height: 0; width: 100%; padding: 20px; background: var(--g-color-surface); font-family: var(--g-font-sans); font-size: 16px; line-height: 1.65; }
.embedded-showcase > * { min-width: 0; max-width: 100%; }
.embedded-showcase .component-doc { margin: 0; }
.embedded-showcase .component-doc__header { padding-block: 0 24px; gap: 16px; }
.embedded-showcase .component-doc__header h2 { font-size: 28px; line-height: 1.3; letter-spacing: -.025em; }
.embedded-showcase .component-doc__header p { margin-top: 12px; font-size: 14px; line-height: 1.65; }
.embedded-showcase .usage-section { margin-top: 24px; }
.embedded-showcase .usage-section > h3 { font-size: 20px; line-height: 1.4; }
.embedded-showcase .usage-section > p { margin-block: 12px 16px; font-size: 14px; line-height: 1.65; }
.embedded-showcase .usage-preview { padding: 20px; gap: 16px; }
.embedded-source { margin-top: 24px; border: 1px solid var(--g-color-border); border-radius: 4px; }
.embedded-source summary { padding: 12px 16px; cursor: pointer; font-size: 13px; }
.embedded-source pre { margin: 0; padding: 16px; max-height: 480px; overflow: auto; background: var(--g-color-surface-subtle); font-size: 12px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; }
@media (max-width: 480px) { .embedded-showcase { padding: 12px; } }
</style>
`;export{e as default};