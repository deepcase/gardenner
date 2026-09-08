var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GHorizontalForm } from "@gardenerim/vue";

type LabelSize = "label-sm" | "label-md" | "label-lg";
type LabelAlignment = "label-start" | "label-center" | "label-end";

const labelSize = ref<LabelSize>("label-md");
const labelAlignment = ref<LabelAlignment>("label-end");
const compact = ref(false);
const showError = ref(false);
const saved = ref(false);
const accountName = ref("Gardener 团队");

const mainVariants = computed(() => [
  labelSize.value,
  labelAlignment.value,
  compact.value ? "compact" : "spacious",
  "bordered",
  "block",
]);
<\/script>

<template>
  <article id="component-horizontal-form" class="component-doc horizontal-form-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / ALIGNED FIELDS</span>
        <h2>横向表单 <span>Horizontal Form / GHorizontalForm</span></h2>
        <p>以稳定标签列对齐相关字段，并让帮助、校验和操作信息保持在内容列中。</p>
      </div>
      <span class="component-status">css-ready · responsive form</span>
    </header>

    <section class="usage-section">
      <h3>标签宽度、对齐与校验</h3>
      <p>切换标签列宽度和对齐方式，观察长短标签、帮助信息、错误反馈和底部操作始终共享同一内容基线。</p>
      <div class="horizontal-form-toolbar" role="group" aria-label="横向表单设置">
        <span>标签宽度</span>
        <button v-for="item in (['label-sm', 'label-md', 'label-lg'] as LabelSize[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="labelSize === item" @click="labelSize = item">{{ item === 'label-sm' ? '窄' : item === 'label-md' ? '标准' : '宽' }}</button>
        <span>标签对齐</span>
        <button v-for="item in (['label-start', 'label-center', 'label-end'] as LabelAlignment[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="labelAlignment === item" @click="labelAlignment = item">{{ item === 'label-start' ? '左' : item === 'label-center' ? '居中' : '右' }}</button>
        <label class="g-switch-row horizontal-form-switch"><span><strong>紧凑间距</strong></span><span class="g-switch"><input v-model="compact" type="checkbox" role="switch" /><span /></span></label>
      </div>

      <div class="usage-preview usage-preview--block g-form-container">
        <GHorizontalForm as="form" :variant="mainVariants" :state="showError ? 'error' : 'default'" aria-labelledby="horizontal-profile-title" :aria-invalid="showError" novalidate @submit.prevent="saved = true">
          <header class="g-form-horizontal-header">
            <h4 id="horizontal-profile-title" class="g-form-horizontal-title">团队资料</h4>
            <p class="g-form-horizontal-description">带星号的字段为必填项。保存不会离开当前页面。</p>
          </header>
          <div class="g-form-horizontal-body">
            <div class="g-form-horizontal-row">
              <label class="g-form-horizontal-label" for="horizontal-name">团队名称<span class="g-form-horizontal-required" aria-hidden="true">*</span></label>
              <div class="g-form-horizontal-content">
                <input id="horizontal-name" v-model="accountName" class="g-input g-input-outlined" required :aria-invalid="showError" aria-describedby="horizontal-name-help horizontal-name-error" />
                <small id="horizontal-name-help" class="g-form-horizontal-help">用于工作区标题、邀请邮件和审计记录。</small>
                <small v-if="showError" id="horizontal-name-error" class="g-form-horizontal-feedback" role="alert">团队名称至少需要 4 个字符。</small>
              </div>
            </div>
            <div class="g-form-horizontal-row">
              <label class="g-form-horizontal-label" for="horizontal-owner">负责人</label>
              <div class="g-form-horizontal-control"><select id="horizontal-owner" class="g-select g-select-outlined"><option>林园</option><option>周青</option></select></div>
            </div>
            <div class="g-form-horizontal-row">
              <label class="g-form-horizontal-label" for="horizontal-domain">工作区域名<span class="g-form-horizontal-optional">选填</span></label>
              <div class="g-form-horizontal-content"><div class="g-input-affix has-end"><input id="horizontal-domain" class="g-input g-input-outlined" value="gardener" /><span class="g-input-affix-end">.team</span></div><small class="g-form-horizontal-help">仅允许小写字母、数字和短横线。</small></div>
            </div>
            <div class="g-form-horizontal-row">
              <label class="g-form-horizontal-label" for="horizontal-summary">团队简介</label>
              <div class="g-form-horizontal-content"><textarea id="horizontal-summary" class="g-textarea g-textarea-outlined" rows="3">构建跨框架、一致且可访问的产品体验。</textarea><small class="g-form-horizontal-help">建议不超过 120 个字符。</small></div>
            </div>
            <div class="g-form-horizontal-row">
              <span class="g-form-horizontal-label" id="horizontal-notify-label">通知偏好</span>
              <div class="g-form-horizontal-control" role="group" aria-labelledby="horizontal-notify-label"><label class="g-check"><input type="checkbox" checked /><span>版本发布</span></label><label class="g-check"><input type="checkbox" /><span>安全告警</span></label></div>
            </div>
          </div>
          <div class="g-form-horizontal-actions"><span v-if="saved" class="horizontal-form-saved" role="status">已保存</span><button class="g-btn g-btn-outline" type="button" @click="showError = !showError">{{ showError ? '清除错误' : '触发错误' }}</button><button class="g-btn g-btn-primary" type="submit">保存资料</button></div>
        </GHorizontalForm>
      </div>
    </section>

    <section class="usage-section">
      <h3>长标签、只读状态与容器回落</h3>
      <p>宽标签适合配置类表单；当组件所在容器不足 768px 时，标签自动回到控件上方，不依赖整个页面宽度。</p>
      <div class="usage-preview usage-preview--block horizontal-form-comparison">
        <div><b>宽标签 · 右对齐</b><GHorizontalForm :variant="['label-lg', 'label-end', 'compact']" state="read-only" data-g-form-read-only="true"><div class="g-form-horizontal-row"><label class="g-form-horizontal-label" for="horizontal-policy">默认数据保留策略</label><div class="g-form-horizontal-content"><input id="horizontal-policy" class="g-input" value="180 天" readonly /><small class="g-form-horizontal-help">由组织管理员统一配置。</small></div></div><div class="g-form-horizontal-row"><label class="g-form-horizontal-label" for="horizontal-region">主要数据存储区域</label><div class="g-form-horizontal-control"><input id="horizontal-region" class="g-input" value="亚太地区" readonly /></div></div></GHorizontalForm></div>
        <div class="horizontal-form-narrow g-form-container"><b>窄容器 · 自动堆叠</b><GHorizontalForm :variant="['label-lg', 'bordered']"><div class="g-form-horizontal-row"><label class="g-form-horizontal-label" for="horizontal-mobile-email">联系邮箱</label><div class="g-form-horizontal-content"><input id="horizontal-mobile-email" class="g-input g-input-outlined" type="email" value="team@gardener.dev" /><small class="g-form-horizontal-help">在窄容器内标签位于控件上方。</small></div></div><div class="g-form-horizontal-actions"><button class="g-btn g-btn-primary" type="button">更新邮箱</button></div></GHorizontalForm></div>
      </div>
    </section>

    <aside class="horizontal-form-guidance"><strong>横向布局不等于压缩信息</strong><span>标签列只负责稳定扫描路径；复杂说明、成组选择和错误反馈仍放在内容列。窄容器会自动堆叠，避免把控件挤成不可用的小块。</span></aside>

    <footer class="component-doc__meta">
      <span><b>标签列</b><code>label-sm</code><code>label-md</code><code>label-lg</code></span>
      <span><b>对齐</b><code>label-start</code><code>label-center</code><code>label-end</code></span>
      <span><b>布局</b><code>compact</code><code>spacious</code><code>stacked</code><code>bordered</code></span>
      <span><b>响应式</b><code>container collapse</code><code>print stack</code></span>
    </footer>
  </article>
</template>

<style>
.horizontal-form-documentation .horizontal-form-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.horizontal-form-documentation .horizontal-form-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.horizontal-form-documentation .horizontal-form-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.horizontal-form-documentation .horizontal-form-switch { width: auto; margin-inline-start: auto; border: 0; background: transparent; }
.horizontal-form-documentation .horizontal-form-saved { margin-inline-end: auto; color: var(--g-color-success); font-size: var(--g-font-size-sm); font-weight: 700; }
.horizontal-form-documentation .horizontal-form-comparison { display: grid; grid-template-columns: minmax(0, 1fr); gap: 34px; align-items: start; }
.horizontal-form-documentation .horizontal-form-comparison > div { display: grid; min-width: 0; gap: 14px; }
.horizontal-form-documentation .horizontal-form-comparison > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.horizontal-form-documentation .horizontal-form-narrow { inline-size: min(100%, 36rem); }
.horizontal-form-documentation .horizontal-form-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.horizontal-form-documentation .horizontal-form-guidance strong { color: var(--g-color-text); }
@media (max-width: 900px) { .horizontal-form-documentation .horizontal-form-comparison { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .horizontal-form-documentation .horizontal-form-switch { inline-size: 100%; margin-inline-start: 0; } }
</style>
`;export{e as default};