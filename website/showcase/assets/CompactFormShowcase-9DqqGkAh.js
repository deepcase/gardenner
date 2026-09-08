var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GCompactForm } from "@gardenerim/vue";

type Density = "tight" | "comfortable";
type Layout = "vertical" | "inline" | "two-columns" | "three-columns";

const density = ref<Density>("tight");
const layout = ref<Layout>("three-columns");
const name = ref("组件文档站");
const slug = ref("gardener-docs");
const environment = ref("production");
const owner = ref("lin");
const submitted = ref(false);
const saving = ref(false);
const saved = ref(false);

const slugInvalid = computed(() => submitted.value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.value));
const formState = computed(() => saving.value ? "busy" : slugInvalid.value ? "error" : saved.value ? "success" : "default");
const formVariants = computed(() => [layout.value, density.value, "bordered", "block"]);

const save = () => {
  submitted.value = true;
  saved.value = false;
  if (slugInvalid.value) return;
  saving.value = true;
  window.setTimeout(() => {
    saving.value = false;
    saved.value = true;
  }, 450);
};
<\/script>

<template>
  <article id="component-compact-form" class="component-doc compact-form-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / HIGH-DENSITY WORKFLOW</span>
        <h2>紧凑表单 <span>Compact Form / GCompactForm</span></h2>
        <p>在有限空间中组织短字段、组合控件与即时操作，同时保留清晰的标签、校验和移动端触控能力。</p>
      </div>
      <span class="component-status">css-ready · semantic form</span>
    </header>

    <section class="usage-section">
      <h3>密度、列数与完整反馈</h3>
      <p>切换紧凑密度和布局；项目标识只接受小写字母、数字和连字符，提交后会展示真实校验与保存状态。</p>
      <div class="compact-form-toolbar" role="group" aria-label="紧凑表单设置">
        <span>密度</span>
        <button v-for="item in (['tight', 'comfortable'] as Density[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="density === item" @click="density = item">{{ item === 'tight' ? '高密度' : '舒适' }}</button>
        <span>布局</span>
        <button v-for="item in (['vertical', 'inline', 'two-columns', 'three-columns'] as Layout[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="layout === item" @click="layout = item">{{ item === 'vertical' ? '单列' : item === 'inline' ? '行内' : item === 'two-columns' ? '两列' : '三列' }}</button>
      </div>

      <div class="usage-preview usage-preview--block g-form-container">
        <GCompactForm as="form" :variant="formVariants" :state="formState" aria-labelledby="compact-settings-title" :aria-invalid="slugInvalid" :aria-busy="saving" novalidate @submit.prevent="save">
          <header class="g-compact-form-header">
            <div><h4 id="compact-settings-title" class="g-compact-form-title">发布设置</h4><p class="g-compact-form-description">修改项目的公开信息与默认发布环境。</p></div>
            <span class="compact-form-badge">{{ saving ? '保存中' : saved ? '已保存' : '草稿' }}</span>
          </header>
          <label class="g-compact-form-field">
            <span class="g-compact-form-label">项目名称<span class="g-compact-form-required" aria-hidden="true">*</span></span>
            <input v-model="name" class="g-input g-input-outlined" required />
            <small class="g-compact-form-help">显示在项目列表和浏览器标题中。</small>
          </label>
          <label class="g-compact-form-field">
            <span class="g-compact-form-label">默认环境</span>
            <select v-model="environment" class="g-select g-select-outlined"><option value="production">Production</option><option value="staging">Staging</option><option value="preview">Preview</option></select>
          </label>
          <label class="g-compact-form-field">
            <span class="g-compact-form-label">负责人<span class="g-compact-form-optional">选填</span></span>
            <select v-model="owner" class="g-select g-select-outlined"><option value="lin">林园</option><option value="zhou">周青</option><option value="team">设计系统组</option></select>
          </label>
          <div class="g-compact-form-field g-compact-form-span-full">
            <label class="g-compact-form-label" for="compact-slug">访问地址<span class="g-compact-form-required" aria-hidden="true">*</span></label>
            <div class="g-input-group">
              <select class="g-select g-select-outlined" aria-label="协议"><option>https://</option><option>http://</option></select>
              <input id="compact-slug" v-model="slug" class="g-input g-input-outlined" :aria-invalid="slugInvalid" aria-describedby="compact-slug-message" placeholder="project-slug" />
              <button class="g-btn g-btn-outline" type="button">检查地址</button>
            </div>
            <small v-if="slugInvalid" id="compact-slug-message" class="g-compact-form-feedback" role="alert">请输入合法标识，例如 gardener-docs。</small>
            <small v-else id="compact-slug-message" class="g-compact-form-help">最终地址：{{ slug || 'project-slug' }}.gardener.dev</small>
          </div>
          <div class="g-compact-form-divider" aria-hidden="true" />
          <div class="g-compact-form-actions"><button class="g-btn g-btn-outline" type="reset">取消</button><button class="g-btn g-btn-primary" type="submit" :disabled="saving">{{ saving ? '正在保存…' : '保存设置' }}</button></div>
          <div v-if="saved" class="g-compact-form-status" role="status">设置已保存，新的发布任务将使用 {{ environment }} 环境。</div>
        </GCompactForm>
      </div>
    </section>

    <section class="usage-section">
      <h3>连续控件与窄容器</h3>
      <p>连续控件共享边框，不制造双线；多列表单在窄容器自动回到单列，移动端恢复可触控高度。</p>
      <div class="usage-preview usage-preview--block compact-form-patterns">
        <div><b>joined · 快速筛选</b><GCompactForm as="form" :variant="['inline', 'joined', 'tight', 'subtle', 'block']" aria-label="日志筛选" @submit.prevent><label class="g-compact-form-field"><span class="g-compact-form-label">部署日志</span><span class="g-input-group"><select class="g-select"><option>全部级别</option><option>错误</option></select><input class="g-input" value="api-gateway" /><button class="g-btn g-btn-primary" type="submit">筛选</button></span></label></GCompactForm></div>
        <div><b>read-only · 摘要</b><GCompactForm :variant="['two-columns', 'comfortable', 'subtle', 'block']" state="read-only" data-g-form-read-only="true"><label class="g-compact-form-field"><span class="g-compact-form-label">区域</span><input class="g-input" value="cn-shanghai" readonly /></label><label class="g-compact-form-field"><span class="g-compact-form-label">运行时</span><input class="g-input" value="Node.js 22" readonly /></label><div class="g-compact-form-status" role="status">配置由组织策略锁定。</div></GCompactForm></div>
        <div class="compact-form-narrow g-form-container"><b>narrow · 自动单列</b><GCompactForm as="form" :variant="['three-columns', 'tight', 'bordered', 'block']" aria-label="通知规则" @submit.prevent><label v-for="label in ['频道', '频率', '范围']" :key="label" class="g-compact-form-field"><span class="g-compact-form-label">{{ label }}</span><select class="g-select"><option>{{ label === '频道' ? '邮件' : label === '频率' ? '每天' : '全部项目' }}</option></select></label><div class="g-compact-form-actions"><button class="g-btn g-btn-primary" type="submit">应用</button></div></GCompactForm></div>
      </div>
    </section>

    <aside class="compact-form-guidance"><strong>紧凑不等于压缩信息</strong><span>它适合短配置、筛选器和高密度后台界面；长说明、复杂验证或触屏主流程仍应选择标准 GForm。小屏幕会主动增大控件高度。</span></aside>

    <footer class="component-doc__meta">
      <span><b>布局</b><code>vertical</code><code>inline</code><code>2 / 3 columns</code></span>
      <span><b>密度</b><code>tight</code><code>comfortable</code></span>
      <span><b>结构</b><code>field</code><code>input group</code><code>actions</code><code>status</code></span>
      <span><b>适配</b><code>container collapse</code><code>touch target</code><code>print stack</code></span>
    </footer>
  </article>
</template>

<style>
.compact-form-documentation .compact-form-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.compact-form-documentation .compact-form-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.compact-form-documentation .compact-form-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.compact-form-documentation .compact-form-badge { padding: 3px 8px; border-radius: var(--g-radius-full); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); font-size: var(--g-font-size-xs); font-weight: 700; white-space: nowrap; }
.compact-form-documentation .compact-form-patterns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 34px; align-items: start; }
.compact-form-documentation .compact-form-patterns > div { display: grid; min-width: 0; gap: 12px; }
.compact-form-documentation .compact-form-patterns > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.compact-form-documentation .compact-form-narrow { inline-size: min(100%, 27rem); }
.compact-form-documentation .compact-form-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.compact-form-documentation .compact-form-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .compact-form-documentation .compact-form-patterns { grid-template-columns: 1fr; } .compact-form-documentation .compact-form-toolbar > span:not(:first-child) { inline-size: 100%; margin-block-start: 4px; } }
</style>
`;export{e as default};