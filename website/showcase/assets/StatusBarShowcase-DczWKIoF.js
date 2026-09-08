var e=`<script setup lang="ts">
import { ref } from "vue";
import { GStatusBar } from "@gardenerim/vue";

const branch = ref("main");
const syncing = ref(false);
const liveMessage = ref("工作区已就绪");

const toggleBranch = () => {
  branch.value = branch.value === "main" ? "release/2.1" : "main";
  liveMessage.value = \`已切换到 \${branch.value} 分支\`;
};

const sync = () => {
  if (syncing.value) return;
  syncing.value = true;
  liveMessage.value = "正在同步工作区";
  window.setTimeout(() => {
    syncing.value = false;
    liveMessage.value = "工作区同步完成";
  }, 1200);
};
<\/script>

<template>
  <article id="component-status-bar" class="component-doc status-bar-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FEEDBACK / APPLICATION SHELL</span>
        <h2>状态栏 <span>Status Bar / GStatusBar</span></h2>
        <p>用于持续呈现工作区和当前上下文的状态，并承载少量高频快捷操作。它不是 Alert：默认保持低干扰，只有异常状态才提升语义色。</p>
      </div>
      <span class="component-status">css-ready</span>
    </header>

    <section class="usage-section">
      <h3>完整应用状态栏</h3>
      <p>主要的全局状态放左侧，上下文信息放右侧；标签简短、图标克制，所有图标按钮都提供可访问名称。</p>
      <div class="usage-preview usage-preview--block status-bar-shell g-page-component-container">
        <div class="status-bar-workspace" aria-hidden="true">
          <div><span></span><span></span><span></span></div>
          <p>project / src / App.vue</p>
        </div>
        <GStatusBar :variant="['primary', 'responsive']" role="toolbar" aria-label="工作区状态栏">
          <div class="g-status-bar-section is-start">
            <button class="g-status-bar-item" type="button" :aria-label="\`当前分支 \${branch}，点击切换\`" @click="toggleBranch"><span class="g-status-bar-icon" aria-hidden="true">⑂</span><span class="g-status-bar-label">{{ branch }}</span></button>
            <button class="g-status-bar-item" :class="{ 'is-loading': syncing }" type="button" :aria-pressed="syncing" @click="sync"><span class="g-status-bar-icon" aria-hidden="true">↻</span><span class="g-status-bar-label">{{ syncing ? "同步中" : "已同步" }}</span></button>
            <button class="g-status-bar-item is-danger" type="button" aria-label="2 个错误"><span class="g-status-bar-icon" aria-hidden="true">⊗</span><span class="g-status-bar-value">2</span></button>
            <button class="g-status-bar-item is-warning" type="button" aria-label="5 个警告"><span class="g-status-bar-icon" aria-hidden="true">△</span><span class="g-status-bar-value">5</span></button>
          </div>
          <div class="g-status-bar-section is-center status-bar-center">
            <span class="g-status-bar-item g-status-bar-secondary"><span class="g-status-bar-icon" aria-hidden="true">✓</span><span class="g-status-bar-label">检查通过</span></span>
          </div>
          <div class="g-status-bar-section is-end">
            <button class="g-status-bar-item g-status-bar-secondary" type="button">行 18，列 24</button>
            <button class="g-status-bar-item g-status-bar-secondary" type="button">空格: 2</button>
            <button class="g-status-bar-item" type="button">UTF-8</button>
            <button class="g-status-bar-item" type="button"><span class="g-status-bar-icon" aria-hidden="true">♧</span><span class="g-status-bar-value">3</span><span class="g-status-bar-label status-bar-notification-label">通知</span></button>
          </div>
          <span class="g-status-bar-live" role="status" aria-live="polite" aria-atomic="true">{{ liveMessage }}</span>
        </GStatusBar>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观与密度</h3>
      <p>默认、强调、透明、边框和浮起表面覆盖页面、面板与桌面壳层；紧凑与舒适密度适配信息量和触控需求。</p>
      <div class="usage-preview usage-preview--block status-bar-variant-stack">
        <div v-for="variant in ['bordered', 'primary', 'subtle', 'elevated', 'compact', 'comfortable']" :key="variant">
          <code>{{ variant }}</code>
          <GStatusBar :variant="variant" role="toolbar" :aria-label="\`\${variant} 状态栏\`">
            <div class="g-status-bar-section is-start"><span class="g-status-bar-item"><span class="g-status-bar-icon" aria-hidden="true">●</span><span class="g-status-bar-label">在线</span></span></div>
            <div class="g-status-bar-section is-end"><button class="g-status-bar-item" type="button">详细信息</button><span class="g-status-bar-item"><span class="g-status-bar-value">42 ms</span></span></div>
          </GStatusBar>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态、后台进度与溢出</h3>
      <p>正常、成功、警告、错误、离线和加载状态均有文字；后台任务使用 2px 进度轨，不抢占主任务焦点。</p>
      <div class="usage-preview usage-preview--block status-bar-state-grid">
        <GStatusBar v-for="state in ['normal', 'info', 'success', 'warning', 'error', 'offline']" :key="state" variant="bordered" :state="state" role="status" aria-live="polite">
          <div class="g-status-bar-section is-start"><span class="g-status-bar-item"><span class="g-status-bar-icon" aria-hidden="true">{{ state === 'error' || state === 'offline' ? '!' : '●' }}</span><span class="g-status-bar-label">{{ state }}</span></span></div>
          <div class="g-status-bar-section is-end"><span class="g-status-bar-item"><span class="g-status-bar-text">{{ state === 'offline' ? '网络不可用' : state === 'error' ? '构建失败' : '系统状态' }}</span></span></div>
        </GStatusBar>
        <GStatusBar :variant="['bordered', 'comfortable']" state="loading" role="status" aria-busy="true" aria-live="polite" style="--g-status-bar-progress: 68%">
          <span class="g-status-bar-progress" aria-hidden="true" />
          <div class="g-status-bar-section is-start"><span class="g-status-bar-item is-loading"><span class="g-status-bar-icon" aria-hidden="true">↻</span><span class="g-status-bar-label">正在索引 1,248 个文件</span></span></div>
          <div class="g-status-bar-section is-end"><span class="g-status-bar-item"><span class="g-status-bar-value">68%</span></span><button class="g-status-bar-item" type="button">取消</button></div>
        </GStatusBar>
        <GStatusBar :variant="['scrollable', 'bordered']" role="toolbar" aria-label="可滚动状态栏">
          <div class="g-status-bar-section is-start"><button v-for="item in ['main', '0 errors', '3 warnings', 'Preview', 'Ln 18, Col 24', 'Spaces: 2', 'UTF-8', 'LF', 'Vue', 'Prettier']" :key="item" class="g-status-bar-item" type="button">{{ item }}</button></div>
        </GStatusBar>
      </div>
    </section>

    <section class="usage-section">
      <h3>定位与响应式</h3>
      <p><code>sticky</code> 和 <code>fixed</code> 用于页面/应用底部；演示容器中配合 <code>contained</code> 安全预览。窄屏会隐藏标记为 secondary 的次要项。</p>
      <div class="usage-preview usage-preview--block status-bar-position-demo">
        <div class="status-bar-contained-panel">
          <p>可滚动工作区内容</p><p>状态栏固定在此容器底部</p>
          <GStatusBar :variant="['primary', 'fixed', 'contained', 'responsive']" role="toolbar" aria-label="固定状态栏演示">
            <div class="g-status-bar-section is-start"><span class="g-status-bar-item">● Ready</span></div>
            <div class="g-status-bar-section is-end"><span class="g-status-bar-item g-status-bar-secondary">Workspace</span><button class="g-status-bar-item" type="button">UTF-8</button></div>
          </GStatusBar>
        </div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>结构</b><code>section</code><code>item</code><code>icon</code><code>label</code><code>value</code><code>progress</code><code>live</code></span>
      <span><b>外观</b><code>primary</code><code>subtle</code><code>bordered</code><code>elevated</code><code>compact</code><code>comfortable</code></span>
      <span><b>状态</b><code>info</code><code>success</code><code>warning</code><code>error</code><code>loading</code><code>offline</code></span>
      <span><b>语义</b><code>toolbar</code><code>status</code><code>aria-live</code><code>aria-busy</code><code>aria-current</code></span>
    </footer>
  </article>
</template>
`;export{e as default};