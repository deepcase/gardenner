<script setup lang="ts">
import { ref } from "vue";
import { GAlert, GButton, GCard, GDialog, GardenerimPart, GardenerimProvider, useGardenerimBehavior, type GardenerimBehaviorInstance, type GardenerimComponentPublicInstance } from "@gardenerim/vue";

const dialog = ref<GardenerimComponentPublicInstance | null>(null);
interface DialogInstance extends GardenerimBehaviorInstance { open(): void }
const { instance } = useGardenerimBehavior<DialogInstance>(dialog, "dialog");
const open = () => instance.value?.open?.();
</script>

<template>
  <GardenerimProvider class="g-container g-py-10" theme="garden" mode="light" shape="subtle" density="comfortable">
    <main class="g-stack g-gap-6">
      <header>
        <span class="g-badge">Vue 2.0.0</span>
        <h1>Gardenerim Vue</h1>
        <p class="g-text-muted">506 个组件、66 种行为和完整类型支持。</p>
      </header>

      <GAlert state="info">这是 Gardenerim CSS 与 Vue 3 的官方适配层。</GAlert>

      <GCard>
        <GardenerimPart name="card-header"><strong>开箱即用</strong></GardenerimPart>
        <GardenerimPart name="card-body">
          <p>组件支持 variant、state、config、slots、原生 attributes 和运行时实例访问。</p>
          <GButton variant="primary" @click="open">打开对话框</GButton>
        </GardenerimPart>
      </GCard>

      <GDialog ref="dialog" hidden>
        <div class="g-dialog" aria-labelledby="demo-title">
          <h2 id="demo-title">Gardenerim Vue 对话框</h2>
          <p>底层复用 Gardenerim 的焦点管理、键盘和生命周期行为。</p>
          <GButton data-g-close variant="primary">完成</GButton>
        </div>
      </GDialog>
    </main>
  </GardenerimProvider>
</template>
