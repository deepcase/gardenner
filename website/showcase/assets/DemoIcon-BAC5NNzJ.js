var e=`<script setup lang="ts">
defineProps<{ name: "plus" | "trash" | "down" | "left" | "right" | "more" | "save" | "copy" | "search" | "bold" | "italic" | "underline" | "eye" | "eye-off" | "lock" | "shield" | "check" | "warning" | "close" | "mail" }>();
<\/script>

<template>
  <svg class="demo-icon" viewBox="0 0 16 16" aria-hidden="true">
    <template v-if="name === 'plus'"><path d="M8 2v12M2 8h12" /></template>
    <template v-else-if="name === 'trash'"><path d="M3 4h10M6 2h4l1 2H5l1-2Zm-1 4v7h6V6M7 7.5v4M9 7.5v4" /></template>
    <template v-else-if="name === 'down'"><path d="m4 6 4 4 4-4" /></template>
    <template v-else-if="name === 'left'"><path d="m10 3-5 5 5 5" /></template>
    <template v-else-if="name === 'right'"><path d="m6 3 5 5-5 5" /></template>
    <template v-else-if="name === 'save'"><path d="M3 2.5h8l2 2V13.5H3zM5 2.5v4h5v-4M5.5 13.5V9h5v4.5" /></template>
    <template v-else-if="name === 'copy'"><rect x="5" y="5" width="8" height="8" rx="1" /><path d="M3 10H2.5V2.5h7V3" /></template>
    <template v-else-if="name === 'search'"><circle cx="7" cy="7" r="4" /><path d="m10 10 3.5 3.5" /></template>
    <template v-else-if="name === 'bold'"><path d="M5 2.5h3.2a2.5 2.5 0 0 1 0 5H5zm0 5h3.8a3 3 0 0 1 0 6H5z" /></template>
    <template v-else-if="name === 'italic'"><path d="M7 2.5h5M4 13.5h5M9.5 2.5 6.5 13.5" /></template>
    <template v-else-if="name === 'underline'"><path d="M4 2.5v5a4 4 0 0 0 8 0v-5M3 13.5h10" /></template>
    <template v-else-if="name === 'eye'"><path d="M1.5 8s2.2-4 6.5-4 6.5 4 6.5 4-2.2 4-6.5 4S1.5 8 1.5 8Z" /><circle cx="8" cy="8" r="1.8" /></template>
    <template v-else-if="name === 'eye-off'"><path d="M3 3 13 13M6.4 4.2A7.1 7.1 0 0 1 8 4c4.3 0 6.5 4 6.5 4a9.5 9.5 0 0 1-2 2.5M9.6 11.8A7.1 7.1 0 0 1 8 12c-4.3 0-6.5-4-6.5-4a9.5 9.5 0 0 1 2-2.5" /></template>
    <template v-else-if="name === 'lock'"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V5a3 3 0 0 1 6 0v2M8 10v1.5" /></template>
    <template v-else-if="name === 'shield'"><path d="M8 1.5 13 3v4c0 3.3-2 5.8-5 7.5C5 12.8 3 10.3 3 7V3l5-1.5Z" /><path d="m5.8 8 1.5 1.5 3-3" /></template>
    <template v-else-if="name === 'check'"><path d="m2.5 8.2 3.3 3.3 7.7-7.7" /></template>
    <template v-else-if="name === 'warning'"><path d="M8 1.5 14 13H2L8 1.5Z" /><path d="M8 5.5v3.5M8 11.3v.2" /></template>
    <template v-else-if="name === 'close'"><path d="m4 4 8 8M12 4l-8 8" /></template>
    <template v-else-if="name === 'mail'"><rect x="1.5" y="3" width="13" height="10" rx="1.5" /><path d="m2 4 6 5 6-5" /></template>
    <template v-else><circle cx="3" cy="8" r="1" /><circle cx="8" cy="8" r="1" /><circle cx="13" cy="8" r="1" /></template>
  </svg>
</template>
`;export{e as default};