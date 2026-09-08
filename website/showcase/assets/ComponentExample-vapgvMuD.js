var e=`<script setup lang="ts">
import { computed } from 'vue';
import type { GardenerimComponentDefinition } from '@gardenerim/vue';
import { showcaseName, showcaseViews } from '../showcaseRegistry';
const props = defineProps<{ definition: GardenerimComponentDefinition }>();
const selected = computed(() => showcaseName(props.definition));
const bindings = computed(() => selected.value === 'FoundationShowcase'
  ? { name: props.definition.name }
  : ['ComponentShowcase', 'NavigationShowcase', 'OverlayShowcase'].includes(selected.value)
    ? { definition: props.definition } : {});
<\/script>

<template>
  <component :is="showcaseViews[selected]" v-bind="bindings" :id="\`component-\${definition.name}\`" />
</template>
`;export{e as default};