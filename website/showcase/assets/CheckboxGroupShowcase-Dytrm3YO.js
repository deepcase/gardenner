var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GCheckboxGroup, GCheckboxRadio } from "@gardenerim/vue";

type SelectionDetail = { selected: string[]; count: number; reason: string };

const permissionOptions = [
  { value: "read", label: "查看项目", description: "浏览页面、文件和活动记录" },
  { value: "comment", label: "参与评论", description: "回复讨论并添加批注" },
  { value: "edit", label: "编辑内容", description: "修改页面和上传文件" },
  { value: "admin", label: "管理成员", description: "仅组织管理员可以授予", disabled: true },
];
const selected = ref(["read", "comment"]);
const touched = ref(false);
const enabledTotal = permissionOptions.filter((item) => !item.disabled).length;
const groupState = computed(() => touched.value && selected.value.length === 0 ? "error" : selected.value.length === 0 ? "empty" : selected.value.length === enabledTotal ? "selected" : "partial");
const groupMessage = computed(() => touched.value && selected.value.length === 0 ? "请至少选择一项权限。" : \`已选择 \${selected.value.length} / \${enabledTotal} 项可用权限\`);

const onSelection = (event: Event) => {
  const detail = (event as CustomEvent<SelectionDetail>).detail;
  selected.value = detail.selected;
};
<\/script>

<template>
  <article id="component-checkbox-group" class="component-doc checkbox-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / MULTIPLE CHOICE</span>
        <h2>复选框组 <span>GCheckboxGroup</span></h2>
        <p>组织一组可以同时选择的原生复选框，覆盖全选、半选、计数、禁用项、校验和响应式布局。</p>
      </div>
      <span class="component-status">runtime-ready · native checkbox</span>
    </header>

    <section class="usage-section">
      <h3>全选、半选与选择计数</h3>
      <p>全选只处理可用项；禁用项不会进入总数。每次变化都会发送包含选中值与原因的事件。</p>
      <div class="usage-preview usage-preview--block checkbox-group-live">
        <GCheckboxGroup
          :variant="['grid', 'two', 'block']"
          :state="groupState"
          :aria-invalid="touched && selected.length === 0 || undefined"
          aria-describedby="permissions-help permissions-status"
          @gardener:selectionchange="onSelection"
        >
          <legend class="g-choice-group-legend">项目权限 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="permissions-help" class="g-choice-group-description">选择成员在当前项目中可以执行的操作。</p>
          <div class="g-choice-group-select-all">
            <GCheckboxRadio as="label">
              <input type="checkbox" data-g-select-all />
              <span class="g-choice-content"><strong class="g-choice-label">选择全部可用权限</strong></span>
            </GCheckboxRadio>
            <span class="g-choice-group-count"><output data-g-selection-count>{{ selected.length }}</output> / {{ enabledTotal }}</span>
          </div>
          <div class="g-choice-group-options">
            <GCheckboxRadio v-for="option in permissionOptions" :key="option.value" as="label" class="g-choice-group-option" data-g-selectable-row>
              <input type="checkbox" name="project-permissions" :value="option.value" data-g-select-row :checked="selected.includes(option.value)" :disabled="option.disabled" />
              <span class="g-choice-content g-choice-group-option-content">
                <span class="g-choice-label">{{ option.label }}</span>
                <small class="g-choice-description">{{ option.description }}</small>
              </span>
            </GCheckboxRadio>
          </div>
          <small id="permissions-status" :class="touched && selected.length === 0 ? 'g-choice-group-feedback' : 'g-choice-group-status'" :role="touched && selected.length === 0 ? 'alert' : 'status'" aria-live="polite">{{ groupMessage }}</small>
        </GCheckboxGroup>
        <div class="checkbox-group-actions">
          <button class="g-btn g-btn-outline" type="button" @click="touched = true">校验选择</button>
          <span>事件值：<code>{{ selected.join(', ') || '[]' }}</code></span>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>行内、按钮与卡片布局</h3>
      <p>短标签适合行内或按钮式外观；带解释的选择使用卡片，原生 input 始终保留键盘与表单能力。</p>
      <div class="usage-preview usage-preview--block checkbox-group-patterns">
        <GCheckboxGroup :variant="['inline', 'block']" aria-label="通知方式">
          <span class="g-choice-group-title">通知方式</span>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="email" data-g-select-row checked /><span class="g-choice-label">邮件</span></GCheckboxRadio>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="desktop" data-g-select-row /><span class="g-choice-label">桌面</span></GCheckboxRadio>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="mobile" data-g-select-row /><span class="g-choice-label">移动端</span></GCheckboxRadio>
        </GCheckboxGroup>

        <GCheckboxGroup :variant="['buttons', 'small']" aria-label="数据视图">
          <span class="g-choice-group-title">显示模块</span>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="overview" data-g-select-row checked /><span class="g-choice-label">概览</span></GCheckboxRadio>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="activity" data-g-select-row checked /><span class="g-choice-label">动态</span></GCheckboxRadio>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="files" data-g-select-row /><span class="g-choice-label">文件</span></GCheckboxRadio>
        </GCheckboxGroup>

        <GCheckboxGroup :variant="['cards', 'two', 'block']" aria-label="交付内容">
          <span class="g-choice-group-title">交付内容</span>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="source" data-g-select-row checked /><span class="g-choice-content g-choice-group-option-content"><span class="g-choice-label">源文件</span><small class="g-choice-description">包含可编辑设计稿和组件源码</small></span></GCheckboxRadio>
          <GCheckboxRadio as="label" data-g-selectable-row><input type="checkbox" value="docs" data-g-select-row /><span class="g-choice-content g-choice-group-option-content"><span class="g-choice-label">使用文档</span><small class="g-choice-description">包含接入说明、示例和变更记录</small></span></GCheckboxRadio>
        </GCheckboxGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>校验与不可编辑状态</h3>
      <div class="usage-preview usage-preview--block checkbox-group-states">
        <GCheckboxGroup :variant="['stacked', 'block']" state="error" aria-invalid="true" aria-describedby="channel-error">
          <legend class="g-choice-group-legend">发布渠道</legend>
          <GCheckboxRadio as="label"><input type="checkbox" name="channel" /><span class="g-choice-label">正式环境</span></GCheckboxRadio>
          <small id="channel-error" class="g-choice-group-feedback" role="alert">请至少选择一个发布渠道。</small>
        </GCheckboxGroup>
        <GCheckboxGroup :variant="['stacked', 'block']" state="disabled" disabled>
          <legend class="g-choice-group-legend">企业策略</legend>
          <GCheckboxRadio as="label"><input type="checkbox" checked disabled /><span class="g-choice-label">强制双重验证</span></GCheckboxRadio>
          <GCheckboxRadio as="label"><input type="checkbox" disabled /><span class="g-choice-label">允许公开链接</span></GCheckboxRadio>
          <small class="g-choice-group-help">由组织管理员统一配置。</small>
        </GCheckboxGroup>
      </div>
    </section>

    <aside class="checkbox-group-guidance"><strong>何时使用复选框组</strong><span>用户可以选择零到多项时使用复选框；若必须且只能选一项，请使用单选框组。不要只用视觉按钮替代原生复选框。</span></aside>

    <footer class="component-doc__meta">
      <span><b>布局</b><code>stacked</code><code>inline</code><code>grid</code><code>cards</code></span>
      <span><b>状态</b><code>empty</code><code>partial</code><code>selected</code><code>invalid</code></span>
      <span><b>运行时</b><code>row-select</code><code>selectionchange</code><code>indeterminate</code></span>
      <span><b>无障碍</b><code>fieldset</code><code>legend</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>

<style>
.checkbox-group-documentation .checkbox-group-live { display: grid; max-inline-size: 58rem; gap: 18px; }
.checkbox-group-documentation .checkbox-group-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; color: var(--g-color-text-muted); font-size: var(--g-font-size-sm); }
.checkbox-group-documentation .checkbox-group-patterns { display: grid; gap: 30px; }
.checkbox-group-documentation .checkbox-group-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 34px; }
.checkbox-group-documentation .checkbox-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.checkbox-group-documentation .checkbox-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .checkbox-group-documentation .checkbox-group-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};