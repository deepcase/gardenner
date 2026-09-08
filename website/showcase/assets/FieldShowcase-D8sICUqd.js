var e=`<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { GField } from "@gardenerim/vue";

const account = ref("");
const dirty = ref(false);
const touched = ref(false);
const validating = ref(false);
const result = ref<"idle" | "success" | "warning" | "error">("idle");
let validationTimer: number | undefined;

const normalizedAccount = computed(() => account.value.trim());
const feedback = computed(() => {
  if (validating.value) return "正在检查用户名是否可用…";
  if (!touched.value) return "";
  if (!normalizedAccount.value) return "请输入用户名。";
  if (normalizedAccount.value.length < 4) return "用户名至少需要 4 个字符。";
  if (result.value === "warning") return "admin 是保留词，请换一个更具体的名称。";
  if (result.value === "success") return "用户名可用。";
  return "";
});
const isInvalid = computed(() => touched.value && !validating.value && result.value === "error");
const fieldStates = computed(() => {
  const states = [dirty.value ? "dirty" : "pristine", touched.value ? "touched" : "default"];
  if (validating.value) states.push("validating");
  else if (result.value !== "idle") states.push(result.value);
  return states;
});

const cancelValidation = () => {
  if (validationTimer !== undefined) window.clearTimeout(validationTimer);
  validationTimer = undefined;
};

const handleInput = () => {
  dirty.value = true;
  validating.value = false;
  result.value = "idle";
  cancelValidation();
};

const validate = () => {
  touched.value = true;
  cancelValidation();
  if (!normalizedAccount.value || normalizedAccount.value.length < 4) {
    validating.value = false;
    result.value = "error";
    return;
  }
  validating.value = true;
  result.value = "idle";
  validationTimer = window.setTimeout(() => {
    validating.value = false;
    result.value = normalizedAccount.value.toLowerCase() === "admin" ? "warning" : "success";
    validationTimer = undefined;
  }, 550);
};

const clearAccount = () => {
  cancelValidation();
  account.value = "";
  dirty.value = true;
  touched.value = false;
  validating.value = false;
  result.value = "idle";
  document.getElementById("field-account")?.focus();
};

onBeforeUnmount(cancelValidation);
<\/script>

<template>
  <article id="component-field" class="component-doc field-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / FIELD COMPOSITION</span>
        <h2>字段 <span>Field / GField</span></h2>
        <p>把标签、控件、辅助说明、校验反馈和字段操作组织成一个可访问、可响应的输入单元。</p>
      </div>
      <span class="component-status">css-ready · accessible field</span>
    </header>

    <section class="usage-section">
      <h3>完整字段与校验生命周期</h3>
      <p>输入用户名并离开控件，可观察 pristine、dirty、touched、validating、success、warning 与 error；输入 admin 可查看警告。</p>
      <div class="usage-preview usage-preview--block field-primary-preview">
        <GField
          :variant="['block', 'spacious', 'required-mark']"
          :state="fieldStates"
          :aria-busy="validating"
          role="group"
          aria-labelledby="field-account-label"
        >
          <div class="g-field-header">
            <span class="g-field-label-content">
              <label id="field-account-label" class="g-field-label" for="field-account">用户名</label>
            </span>
            <span class="g-field-meta">登录标识 · 必填</span>
          </div>
          <div class="g-field-control">
            <span class="g-field-prefix" aria-hidden="true">@</span>
            <input
              id="field-account"
              v-model="account"
              class="g-input g-input-outlined"
              name="account"
              autocomplete="username"
              required
              minlength="4"
              maxlength="20"
              placeholder="例如 gardener"
              :aria-invalid="isInvalid"
              aria-describedby="field-account-help field-account-feedback field-account-counter"
              :aria-errormessage="isInvalid ? 'field-account-feedback' : undefined"
              @input="handleInput"
              @blur="validate"
            />
            <span class="g-field-actions">
              <button v-if="account" class="g-field-action" type="button" aria-label="清空用户名" @click="clearAccount">清空</button>
            </span>
          </div>
          <div class="g-field-messages">
            <small id="field-account-help" class="g-field-help is-persistent">仅使用字母、数字和短横线，长度 4–20 个字符。</small>
            <small v-if="feedback" id="field-account-feedback" class="g-field-feedback" :role="isInvalid ? 'alert' : 'status'" aria-live="polite">{{ feedback }}</small>
          </div>
          <div class="g-field-meta">
            <span class="g-field-status">{{ dirty ? (touched ? '已触碰' : '已修改') : '尚未修改' }}</span>
            <span id="field-account-counter" class="g-field-counter">{{ account.length }} / 20</span>
          </div>
        </GField>
      </div>
    </section>

    <section class="usage-section">
      <h3>字段结构与常见控件</h3>
      <p>GField 不限制控件类型；input、select、textarea 和组合输入共享同一套标签、说明、操作与反馈结构。</p>
      <div class="usage-preview usage-preview--block field-composition-grid">
        <GField variant="block">
          <div class="g-field-header"><label class="g-field-label" for="field-email">工作邮箱</label><span class="g-field-optional">选填</span></div>
          <div class="g-field-control"><input id="field-email" class="g-input g-input-outlined" type="email" value="team@gardener.im" /><span class="g-field-suffix">已验证</span></div>
          <small class="g-field-help">用于团队邀请与重要通知。</small>
        </GField>

        <GField :variant="['block', 'required-mark']" state="success">
          <label class="g-field-label" for="field-domain">项目域名</label>
          <div class="g-field-control"><span class="g-field-prefix">https://</span><input id="field-domain" class="g-input g-input-outlined" value="garden" /><span class="g-field-suffix">.example.com</span></div>
          <small class="g-field-feedback" role="status">该域名可以使用。</small>
        </GField>

        <GField :variant="['block', 'optional-mark']">
          <div class="g-field-header"><label class="g-field-label" for="field-role">团队角色</label><span class="g-field-meta">影响默认权限</span></div>
          <select id="field-role" class="g-select g-select-outlined"><option>产品设计</option><option>前端开发</option><option>项目管理员</option></select>
          <small class="g-field-help">之后仍可在成员设置中修改。</small>
        </GField>

        <GField variant="block">
          <div class="g-field-header"><label class="g-field-label" for="field-bio">个人简介</label><span class="g-field-optional">选填</span></div>
          <textarea id="field-bio" class="g-textarea g-textarea-outlined" rows="3" maxlength="80">负责 Gardener 的组件体验与无障碍质量。</textarea>
          <div class="g-field-meta"><span class="g-field-help">一句话介绍你的工作。</span><span class="g-field-counter">26 / 80</span></div>
        </GField>
      </div>
    </section>

    <section class="usage-section">
      <h3>纵向、横向与行内布局</h3>
      <p>横向字段使用正式 variant，并在窄容器自动回落为单列；隐藏标签仍保留给屏幕阅读器和原生 label 关联。</p>
      <div class="usage-preview usage-preview--block field-layout-stack g-form-container">
        <GField :variant="['horizontal', 'block']">
          <label class="g-field-label" for="field-display-name">显示名称</label>
          <input id="field-display-name" class="g-input g-input-outlined" value="Gardener 团队" />
          <small class="g-field-help">横向标签与控件对齐。</small>
        </GField>
        <GField :variant="['inline', 'block']">
          <label class="g-field-label" for="field-filter">快速筛选</label>
          <input id="field-filter" class="g-input g-input-outlined" placeholder="成员或邮箱" />
          <button class="g-btn g-btn-primary" type="button">查询</button>
        </GField>
        <GField :variant="['label-hidden', 'block']">
          <label class="g-field-label" for="field-search">搜索项目</label>
          <div class="g-field-control"><span class="g-field-prefix" aria-hidden="true">⌕</span><input id="field-search" class="g-input g-input-outlined" placeholder="搜索项目（标签视觉隐藏）" /></div>
        </GField>
      </div>
    </section>

    <section class="usage-section">
      <h3>反馈、只读与禁用</h3>
      <p>状态同时改变边框、文字和状态标识；只读字段仍可聚焦和复制，禁用字段使用原生 disabled。</p>
      <div class="usage-preview usage-preview--block field-state-grid">
        <GField state="validating" aria-busy="true"><label class="g-field-label" for="field-validating">校验中</label><input id="field-validating" class="g-input g-input-outlined" value="checking-name" /><small class="g-field-feedback">正在检查唯一性…</small></GField>
        <GField state="success"><label class="g-field-label" for="field-success">成功</label><input id="field-success" class="g-input g-input-outlined" value="gardener-ui" /><small class="g-field-feedback">名称可用。</small></GField>
        <GField state="warning"><label class="g-field-label" for="field-warning">警告</label><input id="field-warning" class="g-input g-input-outlined" value="admin" /><small class="g-field-feedback">建议使用更具体的名称。</small></GField>
        <GField state="error"><label class="g-field-label" for="field-error">错误</label><input id="field-error" class="g-input g-input-outlined" value="abc" aria-invalid="true" aria-errormessage="field-static-error" /><small id="field-static-error" class="g-field-feedback" role="alert">至少输入 4 个字符。</small></GField>
        <GField state="read-only" data-g-form-read-only="true"><label class="g-field-label" for="field-readonly">成员编号</label><input id="field-readonly" class="g-input g-input-outlined" value="USR-20260904" readonly /><small class="g-field-help">可复制但不可修改。</small></GField>
        <GField state="disabled" aria-disabled="true"><label class="g-field-label" for="field-disabled">企业目录</label><input id="field-disabled" class="g-input g-input-outlined" value="需要管理员权限" disabled /><small class="g-field-help">联系管理员开通权限。</small></GField>
      </div>
    </section>

    <aside class="field-guidance"><strong>GField 管字段呈现，不接管表单数据</strong><span>业务可使用原生 Constraint Validation 或任意校验库；GField 负责稳定的结构、布局、状态映射与无障碍关联。错误信息必须能被控件通过 aria-describedby 或 aria-errormessage 引用。</span></aside>

    <footer class="component-doc__meta">
      <span><b>布局</b><code>vertical</code><code>horizontal</code><code>inline</code><code>label-hidden</code><code>compact</code></span>
      <span><b>生命周期</b><code>pristine</code><code>dirty</code><code>touched</code><code>validating</code><code>success</code><code>error</code></span>
      <span><b>结构</b><code>label</code><code>control</code><code>prefix</code><code>suffix</code><code>messages</code><code>counter</code></span>
      <span><b>语义</b><code>for</code><code>aria-describedby</code><code>aria-errormessage</code><code>aria-live</code></span>
    </footer>
  </article>
</template>

<style>
.field-documentation .field-primary-preview > .g-field { max-inline-size: 38rem; }
.field-documentation .field-composition-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 30px 34px; }
.field-documentation .field-layout-stack { display: grid; gap: 26px; }
.field-documentation .field-state-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 28px 32px; }
.field-documentation .field-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.field-documentation .field-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .field-documentation .field-composition-grid, .field-documentation .field-state-grid { grid-template-columns: 1fr; } }
</style>
`;export{e as default};