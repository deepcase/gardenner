var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GSwitch, GSwitchRow } from "@gardenerim/vue";

const autoSave = ref(true);
const desktop = ref(false);
const analytics = ref(true);
const busy = ref(false);
const saveState = computed(() => busy.value ? "loading" : autoSave.value ? "checked" : "unchecked");

const simulateSave = () => {
  busy.value = true;
  window.setTimeout(() => { busy.value = false; }, 900);
};
<\/script>

<template>
  <article id="component-switch-row" class="component-doc switch-row-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / SETTINGS ROW</span>
        <h2>开关设置行 <span>GSwitchRow</span></h2>
        <p>把标题、解释、状态和原生开关组合成整行可点击的设置项，适用于通知、隐私和系统偏好。</p>
      </div>
      <span class="component-status">css-ready · native label</span>
    </header>

    <section class="usage-section">
      <h3>真实设置列表</h3>
      <p>点击文字或空白区域也能切换开关；每个说明通过 <code>aria-describedby</code> 与对应的原生输入关联。</p>
      <div class="usage-preview usage-preview--block switch-row-live">
        <div class="g-switch-list">
          <GSwitchRow :state="saveState" :aria-busy="busy || undefined">
            <span class="g-switch-row-content"><strong class="g-switch-row-title">自动保存</strong><small id="row-autosave-description" class="g-switch-row-description">编辑时每 30 秒保存一次草稿，离线恢复后自动同步。</small></span>
            <span class="g-switch-row-control"><span class="g-switch-row-status" role="status">{{ busy ? '保存中' : autoSave ? '已开启' : '已关闭' }}</span><GSwitch as="span" :state="saveState"><input v-model="autoSave" type="checkbox" role="switch" aria-describedby="row-autosave-description" :disabled="busy" @change="simulateSave" /><span class="g-switch-track" aria-hidden="true" /></GSwitch></span>
          </GSwitchRow>
          <GSwitchRow :state="desktop ? 'checked' : 'unchecked'">
            <span class="g-switch-row-content"><strong class="g-switch-row-title">桌面通知</strong><small id="row-desktop-description" class="g-switch-row-description">仅发送提及、评审请求和发布结果。</small></span>
            <span class="g-switch-row-control"><span class="g-switch-row-meta">系统权限正常</span><GSwitch as="span"><input v-model="desktop" type="checkbox" role="switch" aria-describedby="row-desktop-description" /><span class="g-switch-track" aria-hidden="true" /></GSwitch></span>
          </GSwitchRow>
          <GSwitchRow :state="analytics ? 'checked' : 'unchecked'">
            <span class="g-switch-row-content"><strong class="g-switch-row-title">匿名使用数据</strong><small id="row-analytics-description" class="g-switch-row-description">帮助改善性能，不包含项目内容或身份信息。</small></span>
            <span class="g-switch-row-control"><GSwitch as="span"><input v-model="analytics" type="checkbox" role="switch" aria-describedby="row-analytics-description" /><span class="g-switch-track" aria-hidden="true" /></GSwitch></span>
          </GSwitchRow>
        </div>
        <output class="switch-row-summary" aria-live="polite">已开启 {{ [autoSave, desktop, analytics].filter(Boolean).length }} / 3 项设置</output>
      </div>
    </section>

    <section class="usage-section">
      <h3>卡片、反向与密度</h3>
      <div class="usage-preview usage-preview--block switch-row-variants">
        <GSwitchRow :variant="['card', 'block']" state="checked">
          <span class="g-switch-row-content"><strong class="g-switch-row-title">云端同步</strong><small class="g-switch-row-description">在所有设备间同步主题、快捷键和工作区偏好。</small></span>
          <span class="g-switch-row-control"><span class="g-switch-row-meta">推荐</span><GSwitch as="span"><input type="checkbox" role="switch" checked /><span class="g-switch-track" aria-hidden="true" /></GSwitch></span>
        </GSwitchRow>
        <GSwitchRow :variant="['bordered', 'reverse', 'block']">
          <span class="g-switch-row-content"><strong class="g-switch-row-title">专注模式</strong><small class="g-switch-row-description">隐藏非必要提示并减少界面动态效果。</small></span>
          <GSwitch as="span"><input type="checkbox" role="switch" /><span class="g-switch-track" aria-hidden="true" /></GSwitch>
        </GSwitchRow>
        <GSwitchRow :variant="['compact', 'block']">
          <span class="g-switch-row-content"><strong class="g-switch-row-title">紧凑设置</strong><small class="g-switch-row-description">用于高密度偏好列表。</small></span>
          <GSwitch as="span" variant="small"><input type="checkbox" role="switch" /><span class="g-switch-track" aria-hidden="true" /></GSwitch>
        </GSwitchRow>
      </div>
    </section>

    <section class="usage-section">
      <h3>不可用、只读与错误</h3>
      <div class="usage-preview usage-preview--block switch-row-states">
        <GSwitchRow :variant="['bordered', 'block']" state="disabled" aria-disabled="true">
          <span class="g-switch-row-content"><strong class="g-switch-row-title">公开分享</strong><small class="g-switch-row-description">组织策略已禁用此功能。</small></span>
          <GSwitch as="span" state="disabled"><input type="checkbox" role="switch" disabled /><span class="g-switch-track" aria-hidden="true" /></GSwitch>
        </GSwitchRow>
        <GSwitchRow :variant="['bordered', 'block']" state="read-only" data-g-form-read-only="true">
          <span class="g-switch-row-content"><strong class="g-switch-row-title">双重验证</strong><small class="g-switch-row-description">由管理员强制开启，当前页面仅供查看。</small></span>
          <span class="g-switch-row-control"><span class="g-switch-row-status" role="status">已强制</span><GSwitch as="span"><input type="checkbox" role="switch" checked tabindex="-1" /><span class="g-switch-track" aria-hidden="true" /></GSwitch></span>
        </GSwitchRow>
        <GSwitchRow :variant="['bordered', 'block']" state="error" aria-invalid="true" aria-describedby="switch-row-error">
          <span class="g-switch-row-content"><strong class="g-switch-row-title">远程备份</strong><small id="switch-row-error" class="g-switch-row-description">无法连接备份服务，请检查网络后重试。</small></span>
          <span class="g-switch-row-control"><span class="g-switch-row-status" role="alert">同步失败</span><GSwitch as="span" state="error"><input type="checkbox" role="switch" /><span class="g-switch-track" aria-hidden="true" /></GSwitch></span>
        </GSwitchRow>
      </div>
    </section>

    <aside class="switch-row-guidance"><strong>让整行承担点击目标</strong><span>设置行默认输出原生 label，不需要额外 click 处理；如果行内包含链接或按钮等独立交互，请显式改用其他容器并为开关提供独立 label。</span></aside>
    <footer class="component-doc__meta">
      <span><b>结构</b><code>content</code><code>control</code><code>status</code></span>
      <span><b>外观</b><code>plain</code><code>bordered</code><code>card</code></span>
      <span><b>状态</b><code>checked</code><code>loading</code><code>disabled</code><code>error</code></span>
      <span><b>语义</b><code>label</code><code>role=switch</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>

<style>
.switch-row-documentation .switch-row-live { display: grid; max-inline-size: 58rem; gap: 16px; }
.switch-row-documentation .switch-row-summary { color: var(--g-color-text-muted); font-size: var(--g-font-size-sm); }
.switch-row-documentation .switch-row-variants { display: grid; max-inline-size: 58rem; gap: 16px; }
.switch-row-documentation .switch-row-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.switch-row-documentation .switch-row-states > :last-child { grid-column: 1 / -1; }
.switch-row-documentation .switch-row-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.switch-row-documentation .switch-row-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .switch-row-documentation .switch-row-states { grid-template-columns: 1fr; } .switch-row-documentation .switch-row-states > :last-child { grid-column: auto; } }
</style>
`;export{e as default};