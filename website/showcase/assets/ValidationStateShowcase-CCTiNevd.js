var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GValidationState } from "@gardenerim/vue";

type ValidationState = "default" | "success" | "warning" | "error" | "validating";

const email = ref("designer@example");
const validating = ref(false);

const emailState = computed<ValidationState>(() => {
  if (validating.value) return "validating";
  if (!email.value) return "default";
  if (/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value)) return "success";
  if (email.value.includes("@")) return "warning";
  return "error";
});

const emailMessage = computed(() => ({
  default: "用于接收登录提醒和安全通知。",
  success: "邮箱格式正确，可以使用。",
  warning: "域名还不完整，请继续输入。",
  error: "请输入包含 @ 和完整域名的邮箱地址。",
  validating: "正在检查邮箱是否已经注册…",
}[emailState.value]));

const verifyEmail = () => {
  validating.value = true;
  window.setTimeout(() => {
    validating.value = false;
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value)) email.value = "designer@example.com";
  }, 700);
};
<\/script>

<template>
  <article id="component-validation-state" class="component-doc validation-state-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / VALIDATION</span>
        <h2>校验状态 <span>GValidationState</span></h2>
        <p>统一输入、选择与文本域的校验生命周期，在视觉反馈之外提供可被辅助技术理解的状态消息。</p>
      </div>
      <span class="component-status">css-ready · a11y</span>
    </header>

    <section class="usage-section">
      <h3>实时校验与异步状态</h3>
      <p>修改邮箱观察默认、警告、错误和成功状态；异步检查期间保持输入可见并明确标记忙碌状态。</p>
      <div class="usage-preview usage-preview--block validation-state-live">
        <GValidationState
          :variant="['block', 'with-icon', 'reserve-message', 'large']"
          :state="emailState"
          :aria-busy="validating || undefined"
        >
          <label class="g-validation-label" for="validation-email">工作邮箱 <span class="g-validation-required" aria-hidden="true">*</span></label>
          <div class="g-validation-control">
            <input
              id="validation-email"
              v-model="email"
              class="g-input g-input-outlined g-validation-input"
              type="email"
              autocomplete="email"
              required
              :aria-invalid="emailState === 'error' || undefined"
              aria-describedby="validation-email-message"
            />
            <span class="g-validation-icon" aria-hidden="true" />
          </div>
          <small
            id="validation-email-message"
            :class="emailState === 'default' ? 'g-validation-help' : 'g-validation-message'"
            :role="emailState === 'error' ? 'alert' : 'status'"
            aria-live="polite"
            aria-atomic="true"
          >{{ emailMessage }}</small>
        </GValidationState>
        <button class="g-btn g-btn-outline" type="button" :disabled="validating" @click="verifyEmail">
          {{ validating ? '校验中…' : '模拟异步校验' }}
        </button>
      </div>
    </section>

    <section class="usage-section">
      <h3>完整语义状态</h3>
      <p>状态色只用于增强识别，图标和文字会同步说明结果；保留消息高度可避免表单跳动。</p>
      <div class="usage-preview usage-preview--block validation-state-grid">
        <GValidationState :variant="['with-icon', 'reserve-message']" state="success">
          <label class="g-validation-label" for="validation-name">项目名称</label>
          <div class="g-validation-control"><input id="validation-name" class="g-input g-validation-input" value="Gardenerim 设计系统" aria-describedby="validation-name-message" /><span class="g-validation-icon" aria-hidden="true" /></div>
          <small id="validation-name-message" class="g-validation-message" role="status">名称可以使用。</small>
        </GValidationState>
        <GValidationState :variant="['with-icon', 'reserve-message']" state="warning">
          <label class="g-validation-label" for="validation-slug">访问路径</label>
          <div class="g-validation-control"><input id="validation-slug" class="g-input g-validation-input" value="design-system" aria-describedby="validation-slug-message" /><span class="g-validation-icon" aria-hidden="true" /></div>
          <small id="validation-slug-message" class="g-validation-message" role="status">发布后修改会影响已有链接。</small>
        </GValidationState>
        <GValidationState :variant="['with-icon', 'reserve-message']" state="error" aria-invalid="true">
          <label class="g-validation-label" for="validation-code">邀请码</label>
          <div class="g-validation-control"><input id="validation-code" class="g-input g-validation-input" value="A-12" aria-invalid="true" aria-describedby="validation-code-message" /><span class="g-validation-icon" aria-hidden="true" /></div>
          <small id="validation-code-message" class="g-validation-message" role="alert">邀请码应为 8 位字母或数字。</small>
        </GValidationState>
        <GValidationState :variant="['with-icon', 'reserve-message']" state="validating" aria-busy="true">
          <label class="g-validation-label" for="validation-team">团队标识</label>
          <div class="g-validation-control"><input id="validation-team" class="g-input g-validation-input" value="garden-lab" aria-describedby="validation-team-message" /><span class="g-validation-icon" aria-hidden="true" /></div>
          <small id="validation-team-message" class="g-validation-status" role="status">正在检查唯一性…</small>
        </GValidationState>
      </div>
    </section>

    <section class="usage-section">
      <h3>不同控件与不可编辑状态</h3>
      <div class="usage-preview usage-preview--block validation-state-patterns">
        <GValidationState :variant="['inline', 'with-icon']" state="success">
          <label class="g-validation-label" for="validation-role">成员角色</label>
          <div class="g-validation-control"><select id="validation-role" class="g-select g-validation-input" aria-describedby="validation-role-message"><option>设计负责人</option><option>开发者</option></select><span class="g-validation-icon" aria-hidden="true" /></div>
          <small id="validation-role-message" class="g-validation-message" role="status">角色已同步权限。</small>
        </GValidationState>
        <GValidationState :variant="['block', 'with-icon']" state="error">
          <label class="g-validation-label" for="validation-summary">发布摘要</label>
          <div class="g-validation-control"><textarea id="validation-summary" class="g-textarea g-validation-input" rows="3" aria-invalid="true" aria-describedby="validation-summary-message">太短</textarea><span class="g-validation-icon" aria-hidden="true" /></div>
          <small id="validation-summary-message" class="g-validation-message" role="alert">至少输入 20 个字符。</small>
        </GValidationState>
        <GValidationState :variant="['block', 'with-icon']" state="disabled" aria-disabled="true">
          <label class="g-validation-label" for="validation-disabled">企业编号</label>
          <div class="g-validation-control"><input id="validation-disabled" class="g-input g-validation-input" value="ENT-2048" disabled /><span class="g-validation-icon" aria-hidden="true" /></div>
          <small class="g-validation-help">由组织管理员统一维护。</small>
        </GValidationState>
        <GValidationState :variant="['block']" state="read-only" data-g-form-read-only="true">
          <label class="g-validation-label" for="validation-readonly">审核结果</label>
          <div class="g-validation-control"><input id="validation-readonly" class="g-input g-validation-input" value="已通过" readonly /></div>
          <small class="g-validation-help">只读内容不应显示可编辑提示。</small>
        </GValidationState>
      </div>
    </section>

    <aside class="validation-state-guidance"><strong>可访问性约定</strong><span>控件通过 <code>aria-describedby</code> 关联帮助或反馈；错误控件使用 <code>aria-invalid</code>，错误消息使用 <code>role="alert"</code>，校验中和成功消息使用温和的状态播报。</span></aside>

    <footer class="component-doc__meta">
      <span><b>状态</b><code>success</code><code>warning</code><code>error</code><code>validating</code></span>
      <span><b>布局</b><code>block</code><code>inline</code><code>reserve-message</code></span>
      <span><b>控件</b><code>input</code><code>textarea</code><code>select</code></span>
      <span><b>无障碍</b><code>aria-invalid</code><code>aria-busy</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>

<style>
.validation-state-documentation .validation-state-live { display: grid; max-inline-size: 46rem; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 14px; }
.validation-state-documentation .validation-state-live > .g-btn { min-block-size: var(--g-control-height-lg); }
.validation-state-documentation .validation-state-grid, .validation-state-documentation .validation-state-patterns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 28px 34px; }
.validation-state-documentation .validation-state-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.validation-state-documentation .validation-state-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .validation-state-documentation .validation-state-live, .validation-state-documentation .validation-state-grid, .validation-state-documentation .validation-state-patterns { grid-template-columns: 1fr; } .validation-state-documentation .validation-state-live > .g-btn { inline-size: 100%; } }
</style>
`;export{e as default};