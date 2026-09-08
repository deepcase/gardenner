var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GCheckboxRadio, GRadioGroup } from "@gardenerim/vue";

const plan = ref("");
const touched = ref(false);
const workspace = ref("board");
const billing = ref("yearly");
const planState = computed(() => touched.value && !plan.value ? "error" : plan.value ? "selected" : "empty");
const planMessage = computed(() => touched.value && !plan.value ? "请选择一个团队套餐。" : plan.value ? \`已选择：\${plan.value}\` : "尚未选择套餐");

const plans = [
  { value: "starter", title: "入门版", price: "免费", description: "适合个人项目与原型验证" },
  { value: "team", title: "团队版", price: "¥49 / 人月", description: "协作、权限与版本历史" },
  { value: "business", title: "企业版", price: "联系销售", description: "单点登录、审计与专属支持" },
];
<\/script>

<template>
  <article id="component-radio-group" class="component-doc radio-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / SINGLE CHOICE</span>
        <h2>单选框组 <span>GRadioGroup</span></h2>
        <p>组织一组互斥的原生单选项，覆盖必选校验、键盘切换、按钮、卡片和响应式布局。</p>
      </div>
      <span class="component-status">css-ready · native radio</span>
    </header>

    <section class="usage-section">
      <h3>必选套餐与即时反馈</h3>
      <p>同组 input 使用相同的 <code>name</code>，浏览器负责互斥选择和方向键切换；校验信息通过描述关系传给辅助技术。</p>
      <div class="usage-preview usage-preview--block radio-group-live">
        <GRadioGroup
          :variant="['cards', 'three', 'block']"
          :state="planState"
          :aria-invalid="touched && !plan || undefined"
         
          aria-describedby="plan-help plan-status"
        >
          <legend class="g-choice-group-legend">团队套餐 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="plan-help" class="g-choice-group-description">选择一个最符合当前团队规模的方案。</p>
          <div class="g-choice-group-options">
            <GCheckboxRadio v-for="item in plans" :key="item.value" as="label" class="g-radio g-choice-group-option">
              <input v-model="plan" type="radio" name="team-plan" :value="item.value" :required="item.value === 'starter'" />
              <span class="g-choice-content g-choice-group-option-content">
                <span class="radio-group-plan-heading"><strong class="g-choice-label">{{ item.title }}</strong><b>{{ item.price }}</b></span>
                <small class="g-choice-description">{{ item.description }}</small>
              </span>
            </GCheckboxRadio>
          </div>
          <small id="plan-status" :class="touched && !plan ? 'g-choice-group-feedback' : 'g-choice-group-status'" :role="touched && !plan ? 'alert' : 'status'" aria-live="polite">{{ planMessage }}</small>
        </GRadioGroup>
        <div class="radio-group-actions">
          <button class="g-btn g-btn-primary" type="button" @click="touched = true">确认套餐</button>
          <button class="g-btn g-btn-outline" type="button" @click="plan = ''; touched = false">清空</button>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>行内与按钮样式</h3>
      <p>短选项可使用紧凑行内布局；需要强调当前模式时使用分段按钮外观，焦点仍落在原生 radio 上。</p>
      <div class="usage-preview usage-preview--block radio-group-patterns">
        <GRadioGroup :variant="['inline', 'block']">
          <legend class="g-choice-group-legend">默认工作区</legend>
          <GCheckboxRadio v-for="item in [['list', '列表'], ['board', '看板'], ['timeline', '时间线']]" :key="item[0]" as="label" class="g-radio g-choice-group-option">
            <input v-model="workspace" type="radio" name="workspace-view" :value="item[0]" />
            <span class="g-choice-label">{{ item[1] }}</span>
          </GCheckboxRadio>
          <small class="g-choice-group-status" role="status">当前视图：{{ workspace }}</small>
        </GRadioGroup>

        <GRadioGroup :variant="['buttons', 'medium']">
          <legend class="g-choice-group-legend">结算周期</legend>
          <GCheckboxRadio v-for="item in [['monthly', '按月'], ['yearly', '按年 · 省 20%'], ['lifetime', '永久']]" :key="item[0]" as="label" class="g-radio">
            <input v-model="billing" type="radio" name="billing-cycle" :value="item[0]" />
            <span class="g-choice-content"><span class="g-choice-label">{{ item[1] }}</span></span>
          </GCheckboxRadio>
        </GRadioGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误、禁用与只读</h3>
      <div class="usage-preview usage-preview--block radio-group-states">
        <GRadioGroup :variant="['stacked', 'block']" state="error" aria-invalid="true" aria-describedby="region-error">
          <legend class="g-choice-group-legend">数据区域</legend>
          <GCheckboxRadio as="label" class="g-radio"><input type="radio" name="region" value="cn" /><span class="g-choice-label">中国大陆</span></GCheckboxRadio>
          <GCheckboxRadio as="label" class="g-radio"><input type="radio" name="region" value="sg" /><span class="g-choice-label">新加坡</span></GCheckboxRadio>
          <small id="region-error" class="g-choice-group-feedback" role="alert">请选择数据存储区域。</small>
        </GRadioGroup>
        <GRadioGroup :variant="['stacked', 'block']" state="disabled" disabled>
          <legend class="g-choice-group-legend">组织策略</legend>
          <GCheckboxRadio as="label" class="g-radio"><input type="radio" name="policy" checked disabled /><span class="g-choice-label">由管理员统一配置</span></GCheckboxRadio>
          <GCheckboxRadio as="label" class="g-radio"><input type="radio" name="policy" disabled /><span class="g-choice-label">允许成员修改</span></GCheckboxRadio>
          <small class="g-choice-group-help">当前工作区不允许个人更改。</small>
        </GRadioGroup>
      </div>
    </section>

    <aside class="radio-group-guidance"><strong>单选与复选不要混用</strong><span>必须且只能选择一项时使用单选框组；允许多选时使用复选框组。选项超过十项或需要搜索时应改用选择器。</span></aside>

    <footer class="component-doc__meta">
      <span><b>语义</b><code>fieldset</code><code>legend</code><code>radio</code></span>
      <span><b>布局</b><code>inline</code><code>grid</code><code>buttons</code><code>cards</code></span>
      <span><b>状态</b><code>empty</code><code>selected</code><code>invalid</code><code>disabled</code></span>
      <span><b>键盘</b><code>Tab</code><code>Arrow keys</code><code>Space</code></span>
    </footer>
  </article>
</template>

<style>
.radio-group-documentation .radio-group-live { display: grid; gap: 18px; }
.radio-group-documentation .radio-group-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.radio-group-documentation .radio-group-plan-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; }
.radio-group-documentation .radio-group-plan-heading b { color: var(--g-color-primary-text); font-size: var(--g-font-size-sm); white-space: nowrap; }
.radio-group-documentation .radio-group-patterns { display: grid; gap: 30px; }
.radio-group-documentation .radio-group-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 34px; }
.radio-group-documentation .radio-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.radio-group-documentation .radio-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .radio-group-documentation .radio-group-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};