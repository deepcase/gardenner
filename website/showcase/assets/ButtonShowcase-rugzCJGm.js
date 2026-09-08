var e=`<script setup lang="ts">
import { GButton, GButtonGroup } from "@gardenerim/vue";
import DemoIcon from "./DemoIcon.vue";

const buttonTypes = ["primary", "secondary", "dashed", "outline", "text"] as const;
const typeLabels: Record<(typeof buttonTypes)[number], string> = {
  primary: "Primary",
  secondary: "Secondary",
  dashed: "Dashed",
  outline: "Outline",
  text: "Text",
};
const sizes = [
  { value: "mini", label: "Mini", height: "24px" },
  { value: "small", label: "Small", height: "28px" },
  { value: "medium", label: "Medium", height: "32px" },
  { value: "large", label: "Large", height: "36px" },
] as const;
const statuses = ["success", "warning", "danger"] as const;
<\/script>

<template>
  <article id="component-button" class="component-doc button-documentation">
    <header class="component-doc__header">
      <div>
        <h2>按钮 <span>Button / GButton</span></h2>
        <p>按钮是一种命令组件，可发起一个即时操作。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section id="button-basic" class="usage-section">
      <h3>基本用法</h3>
      <p>按钮分为 <code>primary</code> 主要按钮、<code>secondary</code> 次要按钮（默认）、<code>dashed</code> 虚线按钮、<code>outline</code> 线形按钮和 <code>text</code> 文本按钮。</p>
      <div class="usage-preview button-demo-row">
        <GButton v-for="type in buttonTypes" :key="type" :variant="type">{{ typeLabels[type] }}</GButton>
      </div>
    </section>

    <section id="button-icon" class="usage-section">
      <h3>图标按钮</h3>
      <p>按钮可以嵌入图标。只设置图标时，按钮宽高相等，并保留可访问名称。</p>
      <div class="usage-preview button-demo-row">
        <GButton :variant="['primary', 'icon']" aria-label="添加"><DemoIcon name="plus" /></GButton>
        <GButton variant="primary"><DemoIcon name="trash" />Delete</GButton>
        <GButton :variant="['outline', 'icon', 'circle']" aria-label="更多"><DemoIcon name="more" /></GButton>
      </div>
    </section>

    <section id="button-shape" class="usage-section">
      <h3>按钮形状</h3>
      <p>按钮支持 <code>square</code> 长方形（默认）、<code>round</code> 全圆角和 <code>circle</code> 圆形三种形状。</p>
      <div class="usage-preview button-demo-row">
        <GButton :variant="['primary', 'square']">Square</GButton>
        <GButton :variant="['primary', 'round']">Round</GButton>
        <GButton :variant="['primary', 'icon']" aria-label="添加"><DemoIcon name="plus" /></GButton>
        <GButton :variant="['primary', 'circle']" aria-label="添加"><DemoIcon name="plus" /></GButton>
      </div>
    </section>

    <section id="button-size" class="usage-section">
      <h3>按钮尺寸</h3>
      <p>提供 <code>mini</code>、<code>small</code>、<code>medium</code>、<code>large</code> 四种尺寸，高度分别为 24px、28px、32px、36px，默认尺寸为 medium。</p>
      <div class="usage-preview button-demo-row button-size-row">
        <div v-for="size in sizes" :key="size.value" class="labeled-button">
          <GButton :variant="['primary', size.value]">{{ size.label }}</GButton>
          <small>{{ size.height }}</small>
        </div>
      </div>
    </section>

    <section id="button-status" class="usage-section">
      <h3>按钮状态</h3>
      <p>状态分为 <code>normal</code>、<code>success</code>、<code>warning</code>、<code>danger</code>，并可与五种按钮类型组合使用。</p>
      <div class="usage-preview usage-preview--matrix">
        <div v-for="status in statuses" :key="status" class="button-status-row">
          <span>{{ status }}</span>
          <GButton v-for="type in buttonTypes" :key="type" :variant="type" :state="status">{{ typeLabels[type] }}</GButton>
        </div>
      </div>
    </section>

    <section id="button-disabled" class="usage-section">
      <h3>禁用状态</h3>
      <p>原生 <code>disabled</code> 与 Gardenerim 的 <code>state="disabled"</code> 均使用一致的禁用视觉和交互。</p>
      <div class="usage-preview usage-preview--matrix">
        <div v-for="status in ['normal', ...statuses]" :key="status" class="button-status-row">
          <span>{{ status }}</span>
          <GButton v-for="type in buttonTypes" :key="type" :variant="type" :state="status === 'normal' ? undefined : status" disabled>{{ typeLabels[type] }}</GButton>
        </div>
      </div>
    </section>

    <section id="button-loading" class="usage-section">
      <h3>加载中状态</h3>
      <p>设置 <code>state="loading"</code> 或兼容类 <code>g-btn-loading</code> 后，按钮显示加载指示并停止响应点击。</p>
      <div class="usage-preview button-demo-row">
        <GButton v-for="type in buttonTypes" :key="type" :variant="type" state="loading" aria-busy="true">{{ typeLabels[type] }}</GButton>
      </div>
    </section>

    <section id="button-long" class="usage-section">
      <h3>长按钮</h3>
      <p>使用 <code>long</code> 后按钮宽度跟随容器，<code>block</code> 继续作为兼容别名保留。</p>
      <div class="usage-preview usage-preview--stacked">
        <GButton v-for="type in buttonTypes" :key="type" :variant="[type, 'long']">{{ typeLabels[type] }}</GButton>
      </div>
    </section>

    <section id="button-group" class="usage-section">
      <h3>组合按钮</h3>
      <p>通过 <code>GButtonGroup</code> 组合同级操作；组合级别可统一控制类型、尺寸、形状、语义状态与禁用外观。</p>
      <div class="usage-preview button-group-gallery">
        <GButtonGroup>
          <GButton>Publish</GButton><GButton variant="icon" aria-label="展开"><DemoIcon name="down" /></GButton>
        </GButtonGroup>
        <GButtonGroup variant="primary">
          <GButton><DemoIcon name="left" />Prev</GButton><GButton>Next<DemoIcon name="right" /></GButton>
        </GButtonGroup>
        <GButtonGroup :variant="['primary', 'round']" state="warning">
          <GButton variant="icon" aria-label="上一个"><DemoIcon name="left" /></GButton><GButton>当前步骤</GButton><GButton variant="icon" aria-label="下一个"><DemoIcon name="right" /></GButton>
        </GButtonGroup>
        <GButtonGroup :variant="['outline', 'small']">
          <GButton>复制</GButton><GButton>剪切</GButton><GButton>查找</GButton>
        </GButtonGroup>
        <GButtonGroup :variant="['secondary', 'small']" state="disabled" aria-disabled="true">
          <GButton disabled>上一页</GButton><GButton disabled>下一页</GButton>
        </GButtonGroup>
      </div>
    </section>

    <section id="button-api" class="usage-section">
      <h3>API 对照</h3>
      <p>各框架统一由 Button 元数据生成，对应参数通过 <code>variant</code>、<code>state</code> 与原生属性组合。</p>
      <div class="button-api-wrap">
        <table class="button-api-table">
          <thead><tr><th>能力</th><th>可选值</th><th>Vue / React</th><th>AngularJS</th><th>Blazor</th></tr></thead>
          <tbody>
            <tr><td>类型</td><td><code>primary | secondary | dashed | outline | text</code></td><td><code>variant</code></td><td><code>gardener-variant</code></td><td><code>Variant</code></td></tr>
            <tr><td>形状</td><td><code>square | circle | round</code></td><td><code>variant</code></td><td><code>gardener-variant</code></td><td><code>Variant / Variants</code></td></tr>
            <tr><td>尺寸</td><td><code>mini | small | medium | large</code></td><td><code>variant</code></td><td><code>gardener-variant</code></td><td><code>Variant / Variants</code></td></tr>
            <tr><td>状态</td><td><code>normal | success | warning | danger | info</code></td><td><code>state</code></td><td><code>gardener-state</code></td><td><code>State</code></td></tr>
            <tr><td>加载</td><td><code>loading</code></td><td><code>state</code></td><td><code>gardener-state</code></td><td><code>State</code></td></tr>
            <tr><td>禁用</td><td><code>disabled</code></td><td colspan="3">使用原生 <code>disabled</code>；组合同时设置 <code>state="disabled"</code></td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>按钮</b><code>.g-btn</code><code>GButton</code></span>
      <span><b>组合</b><code>.g-btn-group</code><code>GButtonGroup</code></span>
      <span><b>兼容</b><code>ghost</code><code>danger</code><code>link</code><code>sm</code><code>lg</code><code>block</code></span>
    </footer>
  </article>
</template>
`;export{e as default};