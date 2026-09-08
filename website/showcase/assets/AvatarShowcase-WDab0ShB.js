var e=`<script setup lang="ts">
import { ref } from "vue";
import { GAvatar } from "@gardenerim/vue";

const selectedPerson = ref("尚未选择");
const portrait = \`data:image/svg+xml,\${encodeURIComponent(\`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
    <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#165dff"/><stop offset="1" stop-color="#14c9c9"/></linearGradient></defs>
    <rect width="160" height="160" fill="url(#b)"/><circle cx="80" cy="62" r="30" fill="#fff" fill-opacity=".9"/><path d="M27 151c7-35 27-52 53-52s46 17 53 52" fill="#fff" fill-opacity=".9"/>
  </svg>\`)}\`;
<\/script>

<template>
  <article id="component-avatar" class="component-doc avatar-documentation">
    <header class="component-doc__header">
      <div>
        <h2>头像 <span>Avatar / GAvatar</span></h2>
        <p>用于表示用户、团队或智能体。支持图片、姓名缩写与图标，并补齐图片回退、对象适配、在线状态和交互语义。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>图片、文字与图标</h3>
      <p>图片需要可读的替代文本；纯装饰图标应隐藏给读屏。文字头像支持通过 CSS 变量设置稳定的个人主题色。</p>
      <div class="usage-preview avatar-demo-row">
        <div class="avatar-demo-item"><GAvatar variant="image"><img :src="portrait" alt="林默" /></GAvatar><span>图片</span></div>
        <div class="avatar-demo-item"><GAvatar variant="text" aria-label="周宁"><span class="g-avatar-text">周宁</span></GAvatar><span>姓名</span></div>
        <div class="avatar-demo-item"><GAvatar variant="icon" aria-label="访客用户"><svg class="g-avatar-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></svg></GAvatar><span>图标</span></div>
        <div class="avatar-demo-item"><GAvatar class="avatar-custom" variant="text" aria-label="AI 助手"><span class="g-avatar-text">AI</span></GAvatar><span>自定义色</span></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>尺寸与自定义尺寸</h3>
      <p>提供 24、32、40、56、80、120px 六档尺寸；业务也可只覆盖 <code>--g-avatar-size</code>，字体和状态点会同步缩放。</p>
      <div class="usage-preview avatar-demo-row avatar-demo-row--end">
        <div v-for="item in ['xs', 'sm', 'medium', 'lg', 'xl', '2xl']" :key="item" class="avatar-demo-item">
          <GAvatar :variant="item" :aria-label="\`\${item} 尺寸头像\`"><span class="g-avatar-text">林</span></GAvatar><span>{{ item }}</span>
        </div>
        <div class="avatar-demo-item"><GAvatar class="avatar-custom-size" aria-label="自定义 64px 头像"><span class="g-avatar-text">64</span></GAvatar><span>custom</span></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>形状、边框与层级</h3>
      <p>圆形用于人物，圆角与方形更适合组织、产品或文件。边框和阴影是可组合外观，不改变头像内容。</p>
      <div class="usage-preview avatar-demo-row">
        <div class="avatar-demo-item"><GAvatar :variant="['circle', 'bordered']"><span class="g-avatar-text">圆</span></GAvatar><span>circle</span></div>
        <div class="avatar-demo-item"><GAvatar variant="rounded"><span class="g-avatar-text">圆角</span></GAvatar><span>rounded</span></div>
        <div class="avatar-demo-item"><GAvatar variant="square"><span class="g-avatar-text">方</span></GAvatar><span>square</span></div>
        <div class="avatar-demo-item"><GAvatar :variant="['rounded', 'elevated']"><span class="g-avatar-text">层</span></GAvatar><span>elevated</span></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>图片适配与加载失败回退</h3>
      <p><code>cover / contain / fill / none / scale-down</code> 与原生 <code>object-fit</code> 一致；提供 <code>g-avatar-fallback</code> 后，共享运行时会在图片失败时自动显示备用文字，重新加载成功后恢复图片。</p>
      <div class="usage-preview avatar-fit-grid">
        <div v-for="fit in ['fit-cover', 'fit-contain', 'fit-fill', 'fit-none', 'fit-scale-down']" :key="fit" class="avatar-demo-item">
          <GAvatar :variant="['xl', 'square', fit]"><img :src="portrait" alt="" /></GAvatar><span>{{ fit.replace('fit-', '') }}</span>
        </div>
        <div class="avatar-demo-item">
          <GAvatar :variant="['xl', 'rounded']" aria-label="图片加载失败，显示周字回退">
            <img src="data:image/png;base64,broken" alt="" />
            <span class="g-avatar-fallback">周</span>
          </GAvatar><span>error fallback</span>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>在线状态</h3>
      <p>状态点不能只靠颜色传达含义，因此每个示例同时提供 <code>aria-label</code> 和可见文字。</p>
      <div class="usage-preview avatar-status-grid">
        <div v-for="item in [{state:'online',label:'在线'}, {state:'away',label:'离开'}, {state:'busy',label:'忙碌'}, {state:'offline',label:'离线'}]" :key="item.state" class="avatar-demo-item">
          <GAvatar variant="status" :state="item.state" :aria-label="\`林默，\${item.label}\`"><span class="g-avatar-text">林</span></GAvatar><span>{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>可交互、加载与禁用</h3>
      <p>只有会触发操作的头像才使用 <code>button</code>；键盘焦点、按压和触摸热区均已覆盖。加载与禁用状态保持明确反馈。</p>
      <div class="usage-preview avatar-demo-row">
        <div class="avatar-demo-item"><GAvatar as="button" type="button" variant="interactive" aria-label="选择林默" @click="selectedPerson = '林默'"><span class="g-avatar-text">林</span></GAvatar><span>interactive</span></div>
        <div class="avatar-demo-item"><GAvatar variant="loading" aria-label="头像加载中" aria-busy="true"><span>林</span></GAvatar><span>loading</span></div>
        <div class="avatar-demo-item"><GAvatar as="button" type="button" variant="interactive" state="disabled" aria-label="周宁不可选择" aria-disabled="true" disabled><span>周</span></GAvatar><span>disabled</span></div>
        <output class="avatar-live" aria-live="polite">已选择：{{ selectedPerson }}</output>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>内容</b><code>image</code><code>text</code><code>icon</code><code>fallback</code></span>
      <span><b>尺寸</b><code>xs</code><code>sm</code><code>medium</code><code>lg</code><code>xl</code><code>2xl</code></span>
      <span><b>状态</b><code>online</code><code>away</code><code>busy</code><code>offline</code><code>loading</code><code>disabled</code></span>
    </footer>
  </article>
</template>
`;export{e as default};