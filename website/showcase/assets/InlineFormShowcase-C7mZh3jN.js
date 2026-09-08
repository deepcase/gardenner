var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GInlineForm } from "@gardenerim/vue";

type FieldSize = "field-sm" | "field-md" | "field-lg";

const fieldSize = ref<FieldSize>("field-md");
const allowWrap = ref(true);
const compact = ref(false);
const submitted = ref(false);
const query = ref("设计系统");
const category = ref("all");
const owner = ref("all");

const mainVariants = computed(() => [
  allowWrap.value ? "wrap" : "nowrap",
  compact.value ? "compact" : "spacious",
  fieldSize.value,
  "align-end",
  "bordered",
  "block",
]);
const mainState = computed(() => submitted.value ? (query.value.trim() ? "submitted" : "error") : "default");
const resultCount = computed(() => query.value.trim() ? (category.value === "all" ? 18 : 6) : 0);

const search = () => { submitted.value = true; };
const clear = () => {
  query.value = "";
  category.value = "all";
  owner.value = "all";
  submitted.value = false;
};
<\/script>

<template>
  <article id="component-inline-form" class="component-doc inline-form-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / COMPACT WORKFLOW</span>
        <h2>内联表单 <span>Inline Form / GInlineForm</span></h2>
        <p>把短字段和主操作组织在同一条工作流中，并在空间不足时可靠换行或堆叠。</p>
      </div>
      <span class="component-status">css-ready · responsive workflow</span>
    </header>

    <section class="usage-section">
      <h3>字段宽度、换行与即时结果</h3>
      <p>调整字段最小宽度和间距；提交时空关键词会进入错误状态，有效关键词则显示结果状态。</p>
      <div class="inline-form-toolbar" role="group" aria-label="内联表单设置">
        <span>字段宽度</span>
        <button v-for="item in (['field-sm', 'field-md', 'field-lg'] as FieldSize[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="fieldSize === item" @click="fieldSize = item">{{ item === 'field-sm' ? '短' : item === 'field-md' ? '标准' : '宽' }}</button>
        <label class="g-switch-row inline-form-switch"><span><strong>允许换行</strong></span><span class="g-switch"><input v-model="allowWrap" type="checkbox" role="switch" /><span /></span></label>
        <label class="g-switch-row inline-form-switch"><span><strong>紧凑间距</strong></span><span class="g-switch"><input v-model="compact" type="checkbox" role="switch" /><span /></span></label>
      </div>

      <div class="usage-preview usage-preview--block g-form-container">
        <GInlineForm as="form" :variant="mainVariants" :state="mainState" aria-label="项目筛选" :aria-invalid="mainState === 'error'" novalidate @submit.prevent="search">
          <div class="g-form-inline-field g-form-inline-field-grow">
            <label class="g-form-inline-label" for="inline-query">关键词<span class="g-form-inline-required" aria-hidden="true">*</span></label>
            <input id="inline-query" v-model="query" class="g-input g-input-outlined" placeholder="名称、标签或项目编号" :aria-invalid="mainState === 'error'" aria-describedby="inline-query-message" />
            <small v-if="mainState === 'error'" id="inline-query-message" class="g-form-inline-feedback" role="alert">请输入至少一个关键词。</small>
            <small v-else id="inline-query-message" class="g-form-inline-help">支持模糊搜索。</small>
          </div>
          <div class="g-form-inline-field g-form-inline-field-fixed">
            <label class="g-form-inline-label" for="inline-category">类型</label>
            <select id="inline-category" v-model="category" class="g-select g-select-outlined"><option value="all">全部类型</option><option value="component">组件</option><option value="document">文档</option></select>
          </div>
          <div class="g-form-inline-field g-form-inline-field-fixed">
            <label class="g-form-inline-label" for="inline-owner">负责人<span class="g-form-inline-optional">选填</span></label>
            <select id="inline-owner" v-model="owner" class="g-select g-select-outlined"><option value="all">全部成员</option><option value="lin">林园</option><option value="zhou">周青</option></select>
          </div>
          <div class="g-form-inline-actions"><button class="g-btn g-btn-outline" type="button" @click="clear">清除</button><button class="g-btn g-btn-primary" type="submit">查询</button></div>
          <div v-if="submitted && mainState !== 'error'" class="g-form-inline-status" role="status">找到 {{ resultCount }} 个匹配项目。</div>
        </GInlineForm>
      </div>
    </section>

    <section class="usage-section">
      <h3>常见组合</h3>
      <p>内联表单适合搜索、邀请、批量筛选等短流程；字段较复杂时应回到标准表单布局。</p>
      <div class="usage-preview usage-preview--block inline-form-patterns g-form-container">
        <div class="inline-form-pattern-wide"><b>快速邀请 · 固定操作</b><GInlineForm as="form" :variant="['field-lg', 'compact', 'bordered']" aria-label="邀请成员" @submit.prevent><div class="g-form-inline-field g-form-inline-field-grow"><label class="g-form-inline-label" for="inline-invite-email">成员邮箱</label><input id="inline-invite-email" class="g-input g-input-outlined" type="email" value="member@gardener.dev" /></div><div class="g-form-inline-field g-form-inline-field-fixed"><label class="g-form-inline-label" for="inline-role">角色</label><select id="inline-role" class="g-select g-select-outlined"><option>编辑者</option><option>查看者</option></select></div><div class="g-form-inline-actions"><button class="g-btn g-btn-primary" type="submit">发送邀请</button></div></GInlineForm></div>
        <div><b>只读条件 · 状态明确</b><GInlineForm :variant="['compact', 'field-sm']" state="read-only" data-g-form-read-only="true"><div class="g-form-inline-field"><label class="g-form-inline-label" for="inline-period">统计周期</label><input id="inline-period" class="g-input" value="最近 30 天" readonly /></div><div class="g-form-inline-divider" aria-hidden="true" /><div class="g-form-inline-field"><label class="g-form-inline-label" for="inline-scope">数据范围</label><input id="inline-scope" class="g-input" value="全部项目" readonly /></div></GInlineForm></div>
        <div class="inline-form-narrow g-form-container"><b>窄容器 · 自动堆叠</b><GInlineForm as="form" :variant="['nowrap', 'bordered']" aria-label="订阅更新" @submit.prevent><div class="g-form-inline-field"><label class="g-form-inline-label" for="inline-subscribe">联系邮箱</label><input id="inline-subscribe" class="g-input g-input-outlined" type="email" value="news@gardener.dev" /></div><div class="g-form-inline-actions"><button class="g-btn g-btn-primary" type="submit">订阅更新</button></div></GInlineForm></div>
      </div>
    </section>

    <aside class="inline-form-guidance"><strong>内联表单适合短任务，不适合长问卷</strong><span>当字段包含长说明、多条错误或复杂选择时，应使用 GForm、GHorizontalForm 或 GFormGrid。即使选择 nowrap，窄容器仍会优先保证控件可用性并自动堆叠。</span></aside>

    <footer class="component-doc__meta">
      <span><b>流式布局</b><code>wrap</code><code>nowrap</code><code>stacked</code></span>
      <span><b>字段宽度</b><code>field-sm</code><code>field-md</code><code>field-lg</code></span>
      <span><b>结构</b><code>field</code><code>actions</code><code>status</code></span>
      <span><b>响应式</b><code>container stack</code><code>print stack</code></span>
    </footer>
  </article>
</template>

<style>
.inline-form-documentation .inline-form-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.inline-form-documentation .inline-form-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.inline-form-documentation .inline-form-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.inline-form-documentation .inline-form-switch { width: auto; border: 0; background: transparent; }
.inline-form-documentation .inline-form-switch:first-of-type { margin-inline-start: auto; }
.inline-form-documentation .inline-form-patterns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 34px; align-items: start; }
.inline-form-documentation .inline-form-patterns > div { display: grid; min-width: 0; gap: 14px; }
.inline-form-documentation .inline-form-patterns > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.inline-form-documentation .inline-form-pattern-wide { grid-column: 1 / -1; }
.inline-form-documentation .inline-form-narrow { inline-size: min(100%, 34rem); }
.inline-form-documentation .inline-form-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.inline-form-documentation .inline-form-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .inline-form-documentation .inline-form-switch, .inline-form-documentation .inline-form-switch:first-of-type { inline-size: 100%; margin-inline-start: 0; } .inline-form-documentation .inline-form-patterns { grid-template-columns: 1fr; } .inline-form-documentation .inline-form-pattern-wide { grid-column: auto; } }
</style>
`;export{e as default};