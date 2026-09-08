var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GCheckboxRadio } from "@gardenerim/vue";

const permissionOptions = [
  { value: "read", label: "查看项目", description: "浏览项目、任务与公开附件" },
  { value: "comment", label: "参与评论", description: "回复讨论并提及团队成员" },
  { value: "export", label: "导出数据", description: "下载报表与项目归档" },
] as const;

const permissions = ref<string[]>(["read", "comment"]);
const plan = ref("team");
const notification = ref("important");
const viewModes = ref<string[]>(["list"]);
const billingCycle = ref("yearly");

const allChecked = computed(() => permissions.value.length === permissionOptions.length);
const partiallyChecked = computed(() => permissions.value.length > 0 && !allChecked.value);

const toggleAll = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked;
  permissions.value = checked ? permissionOptions.map((option) => option.value) : [];
};
<\/script>

<template>
  <article id="component-checkbox-radio" class="component-doc checkbox-radio-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / SELECTION CONTROL</span>
        <h2>复选框与单选框 <span>Checkbox / Radio</span></h2>
        <p>分别提供多项选择与互斥选择，补齐半选、尺寸、描述、校验、卡片、按钮组和移动端触控细节。</p>
      </div>
      <span class="component-status">css-ready · native semantics</span>
    </header>

    <section class="usage-section">
      <h3>基本用法</h3>
      <p>Checkbox 表示可独立切换的多个选项；Radio 表示一个命名组中只能选中一项。</p>
      <div class="usage-preview usage-preview--block choice-basic-grid">
        <fieldset class="g-check-group g-choice-group-inline">
          <legend class="g-choice-group-label">协作能力</legend>
          <GCheckboxRadio as="label"><input type="checkbox" checked /><span class="g-choice-label">允许评论</span></GCheckboxRadio>
          <GCheckboxRadio as="label"><input type="checkbox" /><span class="g-choice-label">关注变更</span></GCheckboxRadio>
          <GCheckboxRadio as="label"><input type="checkbox" disabled /><span class="g-choice-label">外部分享（不可用）</span></GCheckboxRadio>
        </fieldset>
        <fieldset class="g-radio-group g-choice-group-inline">
          <legend class="g-choice-group-label">发布范围</legend>
          <GCheckboxRadio as="label" class="g-radio"><input v-model="notification" type="radio" name="publish-scope" value="important" /><span class="g-choice-label">仅重要变更</span></GCheckboxRadio>
          <GCheckboxRadio as="label" class="g-radio"><input v-model="notification" type="radio" name="publish-scope" value="all" /><span class="g-choice-label">全部变更</span></GCheckboxRadio>
          <GCheckboxRadio as="label" class="g-radio"><input type="radio" name="publish-scope" value="custom" disabled /><span class="g-choice-label">自定义（不可用）</span></GCheckboxRadio>
        </fieldset>
      </div>
    </section>

    <section class="usage-section">
      <h3>全选与半选</h3>
      <p>父选项会根据子项数量进入未选、半选或全选状态；状态既有视觉反馈，也同步 aria-checked。</p>
      <div class="usage-preview usage-preview--block check-all-panel">
        <GCheckboxRadio as="label" class="check-all-control">
          <input
            type="checkbox"
            :checked="allChecked"
            :indeterminate="partiallyChecked"
            :aria-checked="partiallyChecked ? 'mixed' : allChecked"
            @change="toggleAll"
          />
          <span class="g-choice-content">
            <strong class="g-choice-label">全部权限</strong>
            <small class="g-choice-description">已选择 {{ permissions.length }} / {{ permissionOptions.length }} 项</small>
          </span>
        </GCheckboxRadio>
        <fieldset class="g-check-group permission-list" aria-label="项目权限">
          <GCheckboxRadio v-for="option in permissionOptions" :key="option.value" as="label">
            <input v-model="permissions" type="checkbox" name="permissions" :value="option.value" />
            <span class="g-choice-content">
              <span class="g-choice-label">{{ option.label }}</span>
              <small class="g-choice-description">{{ option.description }}</small>
            </span>
          </GCheckboxRadio>
        </fieldset>
      </div>
    </section>

    <section class="usage-section">
      <h3>尺寸与状态</h3>
      <p>四档尺寸与输入框、按钮使用同一高度体系；成功、警告、错误、禁用状态不只依赖颜色表达。</p>
      <div class="usage-preview usage-preview--block choice-size-state-grid">
        <div class="choice-size-row" aria-label="复选框尺寸">
          <GCheckboxRadio v-for="size in ['mini', 'small', 'medium', 'large']" :key="size" as="label" :variant="size">
            <input type="checkbox" checked />
            <span class="g-choice-label">{{ size }}</span>
          </GCheckboxRadio>
        </div>
        <div class="choice-state-row">
          <GCheckboxRadio as="label" state="success"><input type="checkbox" checked /><span class="g-choice-content"><span class="g-choice-label">成功</span><small class="g-choice-description">配置有效</small></span></GCheckboxRadio>
          <GCheckboxRadio as="label" state="warning"><input type="checkbox" /><span class="g-choice-content"><span class="g-choice-label">警告</span><small class="g-choice-description">需要再次确认</small></span></GCheckboxRadio>
          <GCheckboxRadio as="label" state="error" aria-invalid="true"><input type="checkbox" aria-invalid="true" /><span class="g-choice-content"><span class="g-choice-label">错误</span><small class="g-choice-description">至少选择一项</small></span></GCheckboxRadio>
          <GCheckboxRadio as="label"><input type="checkbox" checked disabled /><span class="g-choice-content"><span class="g-choice-label">已禁用</span><small class="g-choice-description">保留当前值</small></span></GCheckboxRadio>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>带描述的卡片单选</h3>
      <p>复杂选项使用整卡可点击布局，让标题、价格和适用范围可以同时比较；同组仍保持方向键切换语义。</p>
      <fieldset class="usage-preview usage-preview--block g-radio-group g-choice-group-three choice-card-grid">
        <legend class="g-choice-group-label">选择团队套餐</legend>
        <GCheckboxRadio as="label" class="g-radio" variant="card">
          <input v-model="plan" type="radio" name="plan" value="starter" />
          <span class="g-choice-content"><span class="choice-card-heading"><strong class="g-choice-label">Starter</strong><b>免费</b></span><small class="g-choice-description">适合个人项目，最多 3 位协作者</small></span>
        </GCheckboxRadio>
        <GCheckboxRadio as="label" class="g-radio" variant="card">
          <input v-model="plan" type="radio" name="plan" value="team" />
          <span class="g-choice-content"><span class="choice-card-heading"><strong class="g-choice-label">Team</strong><b>¥49 / 月</b></span><small class="g-choice-description">权限控制、审计记录和不限协作者</small></span>
        </GCheckboxRadio>
        <GCheckboxRadio as="label" class="g-radio" variant="card">
          <input v-model="plan" type="radio" name="plan" value="enterprise" disabled />
          <span class="g-choice-content"><span class="choice-card-heading"><strong class="g-choice-label">Enterprise</strong><b>联系销售</b></span><small class="g-choice-description">专属部署当前暂不可选</small></span>
        </GCheckboxRadio>
      </fieldset>
    </section>

    <section class="usage-section">
      <h3>按钮式分组</h3>
      <p>少量、短标签、频繁切换的选项可使用按钮式外观；多选与单选仍使用原生 input，不伪造按钮语义。</p>
      <div class="usage-preview usage-preview--block choice-button-grid">
        <fieldset class="g-check-group g-choice-group-buttons">
          <legend class="g-choice-group-label">可见列</legend>
          <GCheckboxRadio v-for="mode in ['list', 'board', 'timeline']" :key="mode" as="label">
            <input v-model="viewModes" type="checkbox" name="view-mode" :value="mode" />
            <span class="g-choice-content"><span class="g-choice-label">{{ mode === 'list' ? '列表' : mode === 'board' ? '看板' : '时间线' }}</span></span>
          </GCheckboxRadio>
        </fieldset>
        <fieldset class="g-radio-group g-choice-group-buttons">
          <legend class="g-choice-group-label">套餐周期</legend>
          <GCheckboxRadio v-for="value in ['monthly', 'yearly', 'lifetime']" :key="value" as="label" class="g-radio">
            <input v-model="billingCycle" type="radio" name="billing-cycle" :value="value" />
            <span class="g-choice-content"><span class="g-choice-label">{{ value === 'monthly' ? '按月' : value === 'yearly' ? '按年' : '终身' }}</span></span>
          </GCheckboxRadio>
        </fieldset>
      </div>
    </section>

    <section class="usage-section">
      <h3>边框、块级与反向布局</h3>
      <p>边框型适合设置列表，Block 占满可用宽度，Reverse 将控件固定到行尾，便于扫描。</p>
      <div class="usage-preview usage-preview--block choice-setting-list">
        <GCheckboxRadio as="label" :variant="['bordered', 'block', 'reverse']">
          <input type="checkbox" checked />
          <span class="g-choice-content"><span class="g-choice-label">自动保存草稿</span><small class="g-choice-description">离开页面前将更改同步到云端</small></span>
        </GCheckboxRadio>
        <GCheckboxRadio as="label" :variant="['bordered', 'block', 'reverse']">
          <input type="checkbox" />
          <span class="g-choice-content"><span class="g-choice-label">发布前请求评审</span><small class="g-choice-description">所有改动至少需要一名成员批准</small></span>
        </GCheckboxRadio>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>类型</b><code>checkbox</code><code>radio</code><code>indeterminate</code></span>
      <span><b>外观</b><code>plain</code><code>bordered</code><code>card</code><code>button group</code></span>
      <span><b>状态</b><code>checked</code><code>mixed</code><code>invalid</code><code>disabled</code></span>
      <span><b>语义</b><code>native input</code><code>fieldset</code><code>legend</code><code>name/value</code></span>
    </footer>
  </article>
</template>

<style>
.checkbox-radio-documentation .choice-basic-grid,
.checkbox-radio-documentation .choice-button-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; align-items: start; }
.checkbox-radio-documentation .check-all-panel { display: grid; gap: 0; max-inline-size: 720px; }
.checkbox-radio-documentation .check-all-control { padding-block-end: 16px; border-block-end: 1px solid var(--g-color-border); }
.checkbox-radio-documentation .permission-list { padding-block-start: 12px; padding-inline-start: 28px; }
.checkbox-radio-documentation .choice-size-state-grid { display: grid; gap: 24px; }
.checkbox-radio-documentation .choice-size-row,
.checkbox-radio-documentation .choice-state-row { display: flex; flex-wrap: wrap; gap: 12px 28px; align-items: center; }
.checkbox-radio-documentation .choice-state-row > * { min-inline-size: 150px; }
.checkbox-radio-documentation .choice-card-grid { align-items: stretch; }
.checkbox-radio-documentation .choice-card-grid > .g-choice-group-label { grid-column: 1 / -1; }
.checkbox-radio-documentation .choice-card-grid > .g-check { inline-size: 100%; }
.checkbox-radio-documentation .choice-card-heading { display: flex; justify-content: space-between; gap: 12px; }
.checkbox-radio-documentation .choice-card-heading b { color: var(--g-color-primary-text); font-size: var(--g-font-size-xs); white-space: nowrap; }
.checkbox-radio-documentation .choice-setting-list { display: grid; gap: 12px; max-inline-size: 760px; }
.checkbox-radio-documentation .choice-setting-list .g-choice-content { flex: 1 1 auto; }
@media (max-width: 760px) {
  .checkbox-radio-documentation .choice-basic-grid,
  .checkbox-radio-documentation .choice-button-grid { grid-template-columns: 1fr; }
  .checkbox-radio-documentation .permission-list { padding-inline-start: 0; }
}
</style>
`;export{e as default};