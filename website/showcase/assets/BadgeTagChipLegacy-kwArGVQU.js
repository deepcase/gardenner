var e=`<script setup lang="ts">
import {GBadgeTagChip,GBadge,GTag,GChip} from '@gardenerim/vue';
<\/script>
<template>
  <article id="component-badge-tag-chip" class="component-doc legacy-documentation">
    <header class="component-doc__header">
      <div><h2>兼容入口 <span>GBadgeTagChip</span></h2><p>旧版本把 Badge、Tag、Chip 合并成一个包装组件，无法准确表达三种结构。2.1.0 保留该导出避免升级时中断，新代码应改用 GBadge、GTag 或 GChip。</p></div>
      <span class="kind-badge legacy-badge">Deprecated</span>
    </header>
    <section class="usage-section"><h3>兼容渲染与迁移结果</h3><p>旧入口仍可渲染。新代码按用途选择对应组件，尺寸与交互使用各自的参数。</p><div class="usage-preview" style="display:flex;gap:24px;flex-wrap:wrap;align-items:center"><GBadgeTagChip>旧标签</GBadgeTagChip><GBadge variant="solid">12</GBadge><GTag>分类标签</GTag><GChip>筛选值</GChip></div></section>
    <div class="legacy-callout" role="note">
      <strong>迁移方式</strong>
      <span>计数与状态 → <a href="#component-badge">GBadge</a></span>
      <span>分类与可选标签 → <a href="#component-tag">GTag</a></span>
      <span>筛选、输入与动作值 → <a href="#component-chip">GChip</a></span>
    </div>
  </article>
</template>
`;export{e as default};