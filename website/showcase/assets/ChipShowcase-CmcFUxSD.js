var e=`<script setup lang="ts">
import { ref } from "vue";
import { GChip } from "@gardenerim/vue";

const filters = ["全部", "待处理", "进行中", "已完成"];
const activeFilter = ref("全部");
const people = ref(["林默", "周宁", "王砚"]);
const actionMessage = ref("尚未执行操作");
<\/script>

<template>
  <article id="component-chip" class="component-doc label-documentation">
    <header class="component-doc__header">
      <div><h2>纸片 <span>Chip / GChip</span></h2><p>用于表示输入值、筛选条件、人员或轻量操作。相比 Tag，Chip 更强调可操作性，并提供头像、图标、选择和移除部件。</p></div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>基础外观与尺寸</h3>
      <p>默认表面适合输入值，<code>soft</code>、<code>solid</code> 与 <code>outline</code> 可用于强调；三档尺寸保持图标、头像和文字比例一致。</p>
      <div class="usage-preview label-matrix">
        <div><GChip>Default</GChip><GChip variant="soft">Soft</GChip><GChip variant="solid">Solid</GChip><GChip variant="outline">Outline</GChip></div>
        <div><GChip class="g-chip-small">Small</GChip><GChip>Medium</GChip><GChip class="g-chip-large">Large</GChip></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>头像与图标</h3>
      <p>头像和图标是明确的结构部件，不需要业务代码手动调整负边距或尺寸。</p>
      <div class="usage-preview label-row">
        <GChip><span class="g-chip-avatar" aria-hidden="true">林</span><span class="g-chip-label">林默</span></GChip>
        <GChip class="is-success" variant="soft"><span class="g-chip-icon" aria-hidden="true">✓</span><span class="g-chip-label">已验证</span></GChip>
        <GChip class="is-warning" variant="outline"><span class="g-chip-icon" aria-hidden="true">!</span><span class="g-chip-label">待复核</span></GChip>
      </div>
    </section>

    <section class="usage-section">
      <h3>可点击与可选择</h3>
      <p>动作 Chip 使用按钮语义；筛选 Chip 通过 <code>aria-pressed</code> 表示当前值，完整支持键盘焦点、悬停和按下反馈。</p>
      <div class="usage-preview label-matrix">
        <div><GChip as="button" class="g-chip-clickable" type="button" @click="actionMessage = '已打开项目详情'"><span class="g-chip-icon" aria-hidden="true">↗</span><span class="g-chip-label">打开详情</span></GChip><span class="chip-feedback" aria-live="polite">{{ actionMessage }}</span></div>
        <div role="group" aria-label="状态筛选"><GChip v-for="filter in filters" :key="filter" as="button" class="g-chip-selectable" type="button" :aria-pressed="activeFilter === filter" @click="activeFilter = filter">{{ filter }}</GChip></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>可移除输入</h3>
      <p>用于收件人或筛选条件时，Chip 保持一个整体，但移除按钮拥有独立名称；删除不会产生嵌套按钮。</p>
      <div class="usage-preview label-row" aria-label="参与人">
        <GChip v-for="person in people" :key="person">
          <span class="g-chip-avatar" aria-hidden="true">{{ person.slice(0, 1) }}</span><span class="g-chip-label">{{ person }}</span>
          <button class="g-chip-remove" type="button" :aria-label="\`移除 \${person}\`" @click="people = people.filter((item) => item !== person)">×</button>
        </GChip>
        <span v-if="!people.length" class="label-empty" aria-live="polite">参与人已清空</span>
      </div>
    </section>

    <section class="usage-section">
      <h3>多行、状态与禁用</h3>
      <p>长筛选条件可切换为多行模式；语义状态与禁用状态仍保持可辨识的边框、文字和对比度。</p>
      <div class="usage-preview label-row">
        <GChip class="g-chip-multiline chip-long"><span class="g-chip-label">负责人是林默，并且更新时间在最近七天内</span></GChip>
        <GChip class="is-success" variant="soft">已同步</GChip>
        <GChip class="is-danger" variant="outline">同步失败</GChip>
        <GChip as="button" class="g-chip-clickable" type="button" disabled>禁用操作</GChip>
      </div>
    </section>

    <div class="component-doc__meta">
      <span><b>结构</b><code>avatar</code><code>icon</code><code>label</code><code>remove</code></span>
      <span><b>交互</b><code>clickable</code><code>selectable</code><code>removable</code></span>
      <span><b>键盘</b><code>Enter</code><code>Space</code><code>Delete</code></span>
    </div>
  </article>
</template>
`;export{e as default};