var e=`<script setup lang="ts">
import { GAvatar, GAvatarGroup } from "@gardenerim/vue";

const people = [
  { initials: "林", label: "林默", color: "#165dff" },
  { initials: "周", label: "周宁", color: "#00b42a" },
  { initials: "苏", label: "苏珊", color: "#ff7d00" },
  { initials: "陈", label: "陈屿", color: "#722ed1" },
];
<\/script>

<template>
  <article id="component-avatar-group" class="component-doc avatar-documentation">
    <header class="component-doc__header">
      <div>
        <h2>头像组 <span>Avatar Group / GAvatarGroup</span></h2>
        <p>头像组是独立的结构组件，不再把 <code>group</code> 文字塞进单个头像。它负责重叠、间距、尺寸继承、形状和溢出计数。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>重叠与平铺</h3>
      <p>默认重叠节省空间；<code>spaced</code> 用于需要逐个辨认成员的场景。每位成员仍保留独立可访问名称。</p>
      <div class="usage-preview avatar-group-stack">
        <div><span>Overlap</span><GAvatarGroup variant="overlap" role="group" aria-label="项目成员">
          <GAvatar v-for="person in people" :key="person.label" variant="text" :aria-label="person.label" :style="{'--g-avatar-background': person.color, '--g-avatar-foreground': '#fff'}"><span class="g-avatar-text">{{ person.initials }}</span></GAvatar>
        </GAvatarGroup></div>
        <div><span>Spaced</span><GAvatarGroup variant="spaced" role="group" aria-label="评审成员">
          <GAvatar v-for="person in people.slice(0, 3)" :key="person.label" :aria-label="person.label"><span class="g-avatar-text">{{ person.initials }}</span></GAvatar>
        </GAvatarGroup></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>尺寸、形状与紧凑度</h3>
      <p>组级尺寸和形状会统一传递给子头像，避免业务代码逐个重复设置。</p>
      <div class="usage-preview avatar-group-grid">
        <div v-for="variant in ['small', 'medium', 'large', 'compact', 'square']" :key="variant">
          <span>{{ variant }}</span><GAvatarGroup :variant="variant" role="group" :aria-label="\`\${variant} 头像组\`">
            <GAvatar v-for="person in people.slice(0, 3)" :key="person.label" :aria-label="person.label"><span class="g-avatar-text">{{ person.initials }}</span></GAvatar>
          </GAvatarGroup>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>最大显示数量与溢出</h3>
      <p>可通过 <code>config.basicMax</code> 自动控制显示上限与 +N，页面下方提供实时参数演示；也可像下面这样自行组织名单与溢出计数。</p>
      <div class="usage-preview avatar-group-stack">
        <GAvatarGroup role="group" aria-label="协作成员，共 8 人，显示 3 人">
          <GAvatar v-for="person in people.slice(0, 3)" :key="person.label" :aria-label="person.label"><span class="g-avatar-text">{{ person.initials }}</span></GAvatar>
          <GAvatar class="g-avatar-overflow" aria-label="另有 5 人"><span class="g-avatar-text">+5</span></GAvatar>
        </GAvatarGroup>
        <GAvatarGroup :variant="['large', 'square']" role="group" aria-label="设计团队，共 6 人，显示 2 人">
          <GAvatar v-for="person in people.slice(0, 2)" :key="person.label" :aria-label="person.label"><span class="g-avatar-text">{{ person.initials }}</span></GAvatar>
          <GAvatar class="g-avatar-overflow" aria-label="另有 4 人"><span class="g-avatar-text">+4</span></GAvatar>
        </GAvatarGroup>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>布局</b><code>overlap</code><code>spaced</code><code>compact</code></span>
      <span><b>继承</b><code>small</code><code>medium</code><code>large</code><code>square</code></span>
      <span><b>结构</b><code>GAvatarGroup</code><code>.g-avatar-overflow</code></span>
    </footer>
  </article>
</template>
`;export{e as default};