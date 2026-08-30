<script setup lang="ts">
import { ref } from "vue";
import { GAlert, GButton, GCard, GDialog, GardenerPart, GardenerProvider, useGardenerBehavior, type GardenerBehaviorInstance, type GardenerComponentPublicInstance } from "@gardener/vue";

const dialog = ref<GardenerComponentPublicInstance | null>(null);
interface DialogInstance extends GardenerBehaviorInstance { open(): void }
const { instance } = useGardenerBehavior<DialogInstance>(dialog, "dialog");
const open = () => instance.value?.open?.();
</script>

<template>
  <GardenerProvider class="g-container g-py-10" theme="garden" mode="light" shape="subtle" density="comfortable">
    <main class="g-stack g-gap-6">
      <header>
        <span class="g-badge">Vue 1.0.0</span>
        <h1>Gardener Vue</h1>
        <p class="g-text-muted">506 个组件、66 种行为和完整类型支持。</p>
      </header>

      <GAlert state="info">这是 Gardener CSS 与 Vue 3 的官方适配层。</GAlert>

      <GCard>
        <GardenerPart name="card-header"><strong>开箱即用</strong></GardenerPart>
        <GardenerPart name="card-body">
          <p>组件支持 variant、state、config、slots、原生 attributes 和运行时实例访问。</p>
          <GButton variant="primary" @click="open">打开对话框</GButton>
        </GardenerPart>
      </GCard>

      <GDialog ref="dialog" hidden>
        <div class="g-dialog" aria-labelledby="demo-title">
          <h2 id="demo-title">Gardener Vue 对话框</h2>
          <p>底层复用 Gardener 的焦点管理、键盘和生命周期行为。</p>
          <GButton data-g-close variant="primary">完成</GButton>
        </div>
      </GDialog>
    </main>
  </GardenerProvider>
</template>
