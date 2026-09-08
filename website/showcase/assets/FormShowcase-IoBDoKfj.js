var e=`<script setup lang="ts">
import { computed, nextTick, reactive, ref } from "vue";
import { GForm } from "@gardenerim/vue";

const validated = ref(false);
const submitting = ref(false);
const submitted = ref(false);
const statusMessage = ref("尚未提交");

const initialModel = () => ({
  project: "",
  email: "",
  team: "",
  summary: "",
  visibility: "team",
  notifications: true,
  terms: false,
});

const model = reactive(initialModel());

const errors = computed(() => {
  if (!validated.value) return [];
  const result: { id: string; message: string }[] = [];
  if (!model.project.trim()) result.push({ id: "form-project", message: "请输入项目名称" });
  if (!model.email.trim()) result.push({ id: "form-email", message: "请输入通知邮箱" });
  else if (!/^\\S+@\\S+\\.\\S+$/.test(model.email)) result.push({ id: "form-email", message: "请输入有效的邮箱地址" });
  if (!model.team) result.push({ id: "form-team", message: "请选择负责团队" });
  if (!model.terms) result.push({ id: "form-terms", message: "请确认数据处理条款" });
  return result;
});

const formStates = computed(() => {
  const states = [validated.value ? "validated" : "default"];
  if (submitting.value) states.push("submitting");
  else if (submitted.value) states.push("success");
  else if (errors.value.length) states.push("error");
  return states;
});

const fieldError = (id: string) => errors.value.find((item) => item.id === id)?.message;

const focusField = (id: string) => {
  document.getElementById(id)?.focus();
};

const submit = async () => {
  validated.value = true;
  submitted.value = false;
  await nextTick();
  const form = document.getElementById("form-demo") as HTMLFormElement | null;
  if (!form?.checkValidity() || errors.value.length) {
    statusMessage.value = \`提交失败，还有 \${errors.value.length} 项需要处理\`;
    focusField(errors.value[0]?.id || "form-project");
    return;
  }
  submitting.value = true;
  statusMessage.value = "正在保存项目设置";
  window.setTimeout(() => {
    submitting.value = false;
    submitted.value = true;
    statusMessage.value = \`“\${model.project}”已保存\`;
  }, 650);
};

const reset = () => {
  Object.assign(model, initialModel());
  validated.value = false;
  submitting.value = false;
  submitted.value = false;
  statusMessage.value = "表单已重置";
};
<\/script>

<template>
  <article id="component-form" class="component-doc form-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / VALIDATION &amp; LAYOUT</span>
        <h2>表单 <span>Form / GForm</span></h2>
        <p>组织字段、校验反馈和提交操作；保留原生 form、label、fieldset 与约束校验语义，可按项目接入任意数据和校验方案。</p>
      </div>
      <span class="component-status">css-ready · native form</span>
    </header>

    <section class="usage-section">
      <h3>完整提交、校验与重置</h3>
      <p>直接提交空表单可检查错误摘要、字段反馈和首个错误聚焦；补全必填项后可观察提交中与成功状态。</p>
      <div class="usage-preview usage-preview--block form-primary-preview">
        <GForm
          id="form-demo"
          :variant="['bordered', 'vertical']"
          :state="formStates"
          :aria-busy="submitting"
          aria-labelledby="form-demo-title"
          aria-describedby="form-demo-description"
          novalidate
          @submit.prevent="submit"
          @reset.prevent="reset"
        >
          <div class="g-form-header">
            <h4 id="form-demo-title" class="g-form-title">创建项目</h4>
            <p id="form-demo-description" class="g-form-description">带 * 的字段为必填项。错误不仅依赖颜色，也会提供文字说明。</p>
          </div>

          <div v-if="errors.length" class="g-form-summary" role="alert" aria-labelledby="form-error-title">
            <strong id="form-error-title">请修正 {{ errors.length }} 个问题后再提交</strong>
            <ul><li v-for="error in errors" :key="error.id"><a :href="\`#\${error.id}\`" @click.prevent="focusField(error.id)">{{ error.message }}</a></li></ul>
          </div>

          <div class="g-form-body g-form-grid">
            <div class="g-field" :class="{ 'is-error': fieldError('form-project') }">
              <div class="g-field-header"><label class="g-field-label" for="form-project">项目名称 <span class="g-field-required" aria-hidden="true">*</span></label><span class="g-field-meta">2–30 字</span></div>
              <input id="form-project" v-model="model.project" class="g-input g-input-outlined" name="project" required minlength="2" maxlength="30" placeholder="例如：Gardener Design System" :aria-invalid="Boolean(fieldError('form-project'))" aria-describedby="form-project-help form-project-error" />
              <small id="form-project-help" class="g-field-help">用于工作区、通知和搜索结果。</small>
              <small v-if="fieldError('form-project')" id="form-project-error" class="g-field-feedback">{{ fieldError('form-project') }}</small>
            </div>

            <div class="g-field" :class="{ 'is-error': fieldError('form-email') }">
              <div class="g-field-header"><label class="g-field-label" for="form-email">通知邮箱 <span class="g-field-required" aria-hidden="true">*</span></label></div>
              <input id="form-email" v-model="model.email" class="g-input g-input-outlined" name="email" type="email" required autocomplete="email" placeholder="name@example.com" :aria-invalid="Boolean(fieldError('form-email'))" aria-describedby="form-email-help form-email-error" />
              <small id="form-email-help" class="g-field-help">发布和异常通知将发送到这里。</small>
              <small v-if="fieldError('form-email')" id="form-email-error" class="g-field-feedback">{{ fieldError('form-email') }}</small>
            </div>

            <div class="g-field" :class="{ 'is-error': fieldError('form-team') }">
              <label class="g-field-label" for="form-team">负责团队 <span class="g-field-required" aria-hidden="true">*</span></label>
              <select id="form-team" v-model="model.team" class="g-select" name="team" required :aria-invalid="Boolean(fieldError('form-team'))" aria-describedby="form-team-error">
                <option value="" disabled>请选择团队</option><option value="design">产品设计</option><option value="platform">平台工程</option><option value="growth">增长研发</option>
              </select>
              <small v-if="fieldError('form-team')" id="form-team-error" class="g-field-feedback">{{ fieldError('form-team') }}</small>
            </div>

            <div class="g-field">
              <div class="g-field-header"><label class="g-field-label" for="form-summary">项目说明</label><span class="g-field-optional">选填</span></div>
              <textarea id="form-summary" v-model="model.summary" class="g-textarea" name="summary" rows="4" maxlength="120" placeholder="说明目标、范围和协作方式" aria-describedby="form-summary-help form-summary-count" />
              <small id="form-summary-help" class="g-field-help">不要在这里填写密钥或个人敏感信息。</small>
              <small id="form-summary-count" class="g-field-counter">{{ model.summary.length }} / 120</small>
            </div>

            <fieldset class="g-fieldset g-field-span-full">
              <legend class="g-fieldset-legend">访问范围</legend>
              <p class="g-fieldset-description">使用原生 fieldset 和 legend，让同组选择拥有清晰名称。</p>
              <div class="g-fieldset-content form-choice-row">
                <label class="g-radio"><input v-model="model.visibility" type="radio" name="visibility" value="team" /><span><strong>团队可见</strong><small>工作区成员都能访问</small></span></label>
                <label class="g-radio"><input v-model="model.visibility" type="radio" name="visibility" value="private" /><span><strong>仅邀请成员</strong><small>适合尚未公开的项目</small></span></label>
              </div>
            </fieldset>

            <div class="g-field g-field-span-full" :class="{ 'is-error': fieldError('form-terms') }">
              <label class="g-check"><input id="form-terms" v-model="model.terms" type="checkbox" required :aria-invalid="Boolean(fieldError('form-terms'))" aria-describedby="form-terms-error" /><span>我确认项目成员已知悉数据处理条款 <span class="g-field-required" aria-hidden="true">*</span></span></label>
              <small v-if="fieldError('form-terms')" id="form-terms-error" class="g-field-feedback">{{ fieldError('form-terms') }}</small>
              <label class="g-switch-row"><span><strong>项目通知</strong><small>接收发布和异常状态变更</small></span><span class="g-switch"><input v-model="model.notifications" type="checkbox" role="switch" aria-label="项目通知" /><span /></span></label>
            </div>
          </div>

          <div class="g-form-actions is-between">
            <span class="g-form-status" role="status" aria-live="polite">{{ statusMessage }}</span>
            <span class="form-action-buttons"><button class="g-btn g-btn-outline" type="reset" :disabled="submitting">重置</button><button class="g-btn g-btn-primary" type="submit" :disabled="submitting">{{ submitting ? '保存中…' : '创建项目' }}</button></span>
          </div>
        </GForm>
      </div>
    </section>

    <section class="usage-section">
      <h3>纵向、横向与行内布局</h3>
      <p>布局是 GForm 的正式 variant；横向标签在窄容器自动回落到单列，行内表单允许字段换行，不靠固定宽度硬撑。</p>
      <div class="usage-preview usage-preview--block form-layout-grid">
        <div><b>vertical · 默认阅读顺序</b><form class="g-form g-form-vertical g-form-compact"><label class="g-field"><span class="g-field-label">关键词</span><input class="g-input" value="设计系统" /></label><label class="g-field"><span class="g-field-label">状态</span><select class="g-select"><option>全部状态</option></select></label></form></div>
        <div><b>horizontal · 宽表单</b><form class="g-form g-form-horizontal g-form-compact"><label class="g-field"><span class="g-field-label">显示名称</span><input class="g-input g-input-outlined" value="Gardener" /><small class="g-field-help">对协作者可见</small></label><label class="g-field is-success"><span class="g-field-label">域名</span><input class="g-input g-input-outlined" value="gardener.im" /><small class="g-field-feedback">域名可用</small></label></form></div>
        <div class="form-layout-span"><b>inline · 筛选与快捷操作</b><form class="g-form g-form-inline g-form-compact"><label class="g-field"><span class="g-field-label">成员</span><input class="g-input" placeholder="姓名或邮箱" /></label><label class="g-field"><span class="g-field-label">角色</span><select class="g-select"><option>全部角色</option><option>管理员</option></select></label><div class="g-form-actions"><button class="g-btn g-btn-primary" type="button">查询</button><button class="g-btn g-btn-text" type="button">清除</button></div></form></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>字段状态与边界</h3>
      <p>帮助、校验中、成功、警告、错误、只读和禁用都有独立语义；真正不可交互时仍应设置原生 disabled，而不是只改颜色。</p>
      <div class="usage-preview usage-preview--block form-state-grid">
        <label class="g-field"><span class="g-field-label">帮助文本</span><input class="g-input g-input-outlined" value="普通字段" /><small class="g-field-help">解释格式或用途</small></label>
        <label class="g-field is-validating"><span class="g-field-label">校验中</span><input class="g-input g-input-outlined" value="checking-name" /><small class="g-field-feedback">正在检查唯一性</small></label>
        <label class="g-field is-success"><span class="g-field-label">成功</span><input class="g-input g-input-outlined" value="gardener-ui" /><small class="g-field-feedback">名称可用</small></label>
        <label class="g-field is-warning"><span class="g-field-label">警告</span><input class="g-input g-input-outlined" value="admin" /><small class="g-field-feedback">建议使用更具体的名称</small></label>
        <label class="g-field is-error"><span class="g-field-label">错误</span><input class="g-input g-input-outlined" value="abc" aria-invalid="true" /><small class="g-field-feedback">至少输入 6 个字符</small></label>
        <label class="g-field"><span class="g-field-label">只读</span><input class="g-input" value="USR-20260904" readonly /><small class="g-field-help">可复制但不可修改</small></label>
        <label class="g-field is-disabled"><span class="g-field-label">禁用</span><input class="g-input" value="暂无权限" disabled /><small class="g-field-help">说明不可用原因</small></label>
      </div>
    </section>

    <aside class="form-guidance"><strong>GForm 管结构，不接管你的数据</strong><span>简单场景使用原生 Constraint Validation；复杂业务可以接入 Zod、Valibot、Yup 或框架表单库。无论校验来源如何，都应把错误关联到具体控件，并在提交失败时提供摘要和可聚焦入口。</span></aside>

    <footer class="component-doc__meta">
      <span><b>布局</b><code>vertical</code><code>horizontal</code><code>inline</code><code>grid</code><code>compact</code></span>
      <span><b>状态</b><code>validated</code><code>submitting</code><code>success</code><code>error</code><code>disabled</code><code>read-only</code></span>
      <span><b>结构</b><code>header</code><code>body</code><code>field</code><code>fieldset</code><code>summary</code><code>actions</code></span>
      <span><b>语义</b><code>form</code><code>label</code><code>fieldset</code><code>aria-describedby</code><code>aria-live</code></span>
    </footer>
  </article>
</template>

<style>
.form-documentation .form-primary-preview > .g-form { max-inline-size: 58rem; }
.form-documentation .form-choice-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.form-documentation .form-choice-row :is(strong, small), .form-documentation .g-switch-row :is(strong, small) { display: block; }
.form-documentation .form-choice-row small, .form-documentation .g-switch-row small { margin-block-start: 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 400; }
.form-documentation .form-action-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.form-documentation .form-layout-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; align-items: start; }
.form-documentation .form-layout-grid > div { display: grid; min-inline-size: 0; gap: 14px; }
.form-documentation .form-layout-grid > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.form-documentation .form-layout-span { grid-column: 1 / -1; }
.form-documentation .form-state-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 26px 30px; align-items: start; }
.form-documentation .form-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.form-documentation .form-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .form-documentation .form-layout-grid, .form-documentation .form-state-grid, .form-documentation .form-choice-row { grid-template-columns: 1fr; } .form-documentation .form-layout-span { grid-column: auto; } }
</style>
`;export{e as default};