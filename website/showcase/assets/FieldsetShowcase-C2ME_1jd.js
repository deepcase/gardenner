var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GFieldset } from "@gardenerim/vue";

const delivery = ref("");
const validated = ref(false);
const announcement = ref("尚未确认配送方式");

const deliveryState = computed(() => validated.value && !delivery.value ? "error" : delivery.value ? "success" : "default");

const confirmDelivery = () => {
  validated.value = true;
  announcement.value = delivery.value ? \`已选择\${delivery.value}\` : "请选择一种配送方式";
};

const resetDelivery = () => {
  delivery.value = "";
  validated.value = false;
  announcement.value = "配送方式已重置";
};

const selectDelivery = () => {
  validated.value = true;
  announcement.value = delivery.value ? \`已选择\${delivery.value}\` : "请选择一种配送方式";
};
<\/script>

<template>
  <article id="component-fieldset" class="component-doc fieldset-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / SEMANTIC GROUPING</span>
        <h2>字段组 <span>Fieldset / GFieldset</span></h2>
        <p>使用原生 fieldset 与 legend 为一组相关控件建立共同名称、说明、状态和禁用边界。</p>
      </div>
      <span class="component-status">css-ready · native fieldset</span>
    </header>

    <section class="usage-section">
      <h3>单选分组、校验与恢复</h3>
      <p>不选择直接确认可查看字段组级错误；选择任意方案后，错误会恢复为成功状态。</p>
      <div class="usage-preview usage-preview--block fieldset-primary-preview">
        <GFieldset
          :variant="['card', 'spacious', 'choice-cards', 'three-columns']"
          :state="deliveryState"
          :aria-invalid="validated && !delivery"
          aria-describedby="delivery-description delivery-feedback"
        >
          <legend class="g-fieldset-legend">
            <span class="g-fieldset-legend-content"><span class="g-fieldset-title">配送方式</span><span class="g-fieldset-badge">必选</span></span>
          </legend>
          <p id="delivery-description" class="g-fieldset-description">选择一种适合当前订单的配送方案，费用和预计时间会随之更新。</p>
          <div class="g-fieldset-content">
            <label class="g-radio"><input v-model="delivery" type="radio" name="delivery" value="标准配送" @change="selectDelivery" /><span class="fieldset-choice-content"><strong>标准配送</strong><small>3–5 个工作日 · 免费</small></span></label>
            <label class="g-radio"><input v-model="delivery" type="radio" name="delivery" value="次日送达" @change="selectDelivery" /><span class="fieldset-choice-content"><strong>次日送达</strong><small>明日 18:00 前 · ¥18</small></span></label>
            <label class="g-radio"><input v-model="delivery" type="radio" name="delivery" value="门店自提" @change="selectDelivery" /><span class="fieldset-choice-content"><strong>门店自提</strong><small>最快 2 小时 · 免费</small></span></label>
          </div>
          <p v-if="validated && !delivery" id="delivery-feedback" class="g-fieldset-feedback" role="alert">请选择一种配送方式后继续。</p>
          <p v-else-if="delivery" id="delivery-feedback" class="g-fieldset-status" role="status">已选择：{{ delivery }}</p>
          <p v-else id="delivery-feedback" class="g-fieldset-help">键盘用户可使用方向键在单选项之间移动。</p>
          <div class="g-fieldset-actions"><button class="g-btn g-btn-text" type="button" @click="resetDelivery">重置</button><button class="g-btn g-btn-primary" type="button" @click="confirmDelivery">确认配送方式</button></div>
          <span class="fieldset-live-status" role="status" aria-live="polite">{{ announcement }}</span>
        </GFieldset>
      </div>
    </section>

    <section class="usage-section">
      <h3>复选、字段和嵌套分组</h3>
      <p>同一组件既能组织选择项，也能组织一组相关字段；嵌套时每一级都需要独立 legend。</p>
      <div class="usage-preview usage-preview--block fieldset-composition-grid">
        <GFieldset :variant="['bordered', 'two-columns']">
          <legend class="g-fieldset-legend"><span class="g-fieldset-title">通知渠道</span></legend>
          <p class="g-fieldset-description">选择接收项目动态的渠道。</p>
          <div class="g-fieldset-content">
            <label class="g-check"><input type="checkbox" checked /><span>电子邮件</span></label>
            <label class="g-check"><input type="checkbox" checked /><span>站内通知</span></label>
            <label class="g-check"><input type="checkbox" /><span>短信</span></label>
            <label class="g-check"><input type="checkbox" /><span>桌面推送</span></label>
          </div>
          <p class="g-fieldset-help">系统安全通知不会受此设置影响。</p>
        </GFieldset>

        <GFieldset :variant="['subtle', 'compact']">
          <legend class="g-fieldset-legend"><span class="g-fieldset-legend-content"><span class="g-fieldset-title">联系信息</span><span class="g-fieldset-meta">选填</span></span></legend>
          <p class="g-fieldset-description">用于订单问题和配送联系。</p>
          <div class="g-fieldset-content">
            <label class="g-field"><span class="g-field-label">联系人</span><input class="g-input g-input-outlined" value="林园" autocomplete="name" /></label>
            <label class="g-field"><span class="g-field-label">手机号码</span><input class="g-input g-input-outlined" value="138 0000 0000" inputmode="tel" autocomplete="tel" /></label>
          </div>
        </GFieldset>

        <GFieldset :variant="['plain', 'block']" class="fieldset-nested-example">
          <legend class="g-fieldset-legend"><span class="g-fieldset-title">隐私偏好</span></legend>
          <p class="g-fieldset-description">外层定义偏好主题，内层继续细分数据类别。</p>
          <div class="g-fieldset-content">
            <label class="g-switch-row"><span><strong>产品改进数据</strong><small>发送匿名使用统计</small></span><span class="g-switch"><input type="checkbox" role="switch" checked /><span /></span></label>
          </div>
          <GFieldset variant="compact">
            <legend class="g-fieldset-legend"><span class="g-fieldset-title">个性化内容</span></legend>
            <div class="g-fieldset-content"><label class="g-check"><input type="checkbox" checked /><span>功能推荐</span></label><label class="g-check"><input type="checkbox" /><span>活动资讯</span></label></div>
          </GFieldset>
        </GFieldset>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观、状态与禁用级联</h3>
      <p>禁用原生 fieldset 会自动禁用其中的表单控件；只读则由业务为子控件设置 readonly，并在组级提供解释。</p>
      <div class="usage-preview usage-preview--block fieldset-state-grid">
        <GFieldset :variant="['compact', 'subtle']" state="success"><legend class="g-fieldset-legend"><span class="g-fieldset-title">成功</span></legend><div class="g-fieldset-content"><label class="g-check"><input type="checkbox" checked /><span>邮箱已验证</span></label></div><p class="g-fieldset-status">所有必填项均已完成。</p></GFieldset>
        <GFieldset :variant="['compact', 'bordered']" state="warning"><legend class="g-fieldset-legend"><span class="g-fieldset-title">需要注意</span></legend><div class="g-fieldset-content"><label class="g-check"><input type="checkbox" /><span>备用联系方式</span></label></div><p class="g-fieldset-status">建议添加一种备用方式。</p></GFieldset>
        <GFieldset :variant="['compact', 'bordered']" state="error" aria-invalid="true"><legend class="g-fieldset-legend"><span class="g-fieldset-title">存在错误</span></legend><div class="g-fieldset-content"><label class="g-radio"><input type="radio" name="error-plan" /><span>基础方案</span></label></div><p class="g-fieldset-feedback" role="alert">至少选择一项。</p></GFieldset>
        <GFieldset :variant="['compact', 'bordered']" state="read-only" data-g-form-read-only="true"><legend class="g-fieldset-legend"><span class="g-fieldset-title">只读资料</span></legend><div class="g-fieldset-content"><label class="g-field"><span class="g-field-label">组织编号</span><input class="g-input" value="ORG-2086" readonly /></label></div><p class="g-fieldset-help">该编号由系统生成。</p></GFieldset>
        <GFieldset :variant="['compact', 'bordered']" disabled><legend class="g-fieldset-legend"><span class="g-fieldset-title">禁用分组</span></legend><div class="g-fieldset-content"><label class="g-check"><input type="checkbox" checked /><span>由上级策略控制</span></label><input class="g-input" aria-label="只读字段" value="不可修改" /></div><p class="g-fieldset-help">子控件通过原生 disabled 级联禁用。</p></GFieldset>
      </div>
    </section>

    <aside class="fieldset-guidance"><strong>不要用普通 div 模拟字段组</strong><span>相关选择必须放在原生 fieldset 中，并用 legend 提供组名。GFieldset 负责分组外观和状态；每个子控件仍需要自己的标签，校验错误通过 aria-describedby 关联到整个分组。</span></aside>

    <footer class="component-doc__meta">
      <span><b>标签</b><code>fieldset</code><code>legend</code></span>
      <span><b>布局</b><code>inline</code><code>grid</code><code>two-columns</code><code>three-columns</code><code>choice-cards</code></span>
      <span><b>状态</b><code>success</code><code>warning</code><code>error</code><code>read-only</code><code>disabled</code></span>
      <span><b>语义</b><code>disabled cascade</code><code>aria-describedby</code><code>aria-invalid</code><code>aria-live</code></span>
    </footer>
  </article>
</template>

<style>
.fieldset-documentation .fieldset-primary-preview > .g-fieldset { max-inline-size: 62rem; }
.fieldset-documentation .fieldset-choice-content, .fieldset-documentation .fieldset-choice-content :is(strong, small) { display: block; }
.fieldset-documentation .fieldset-choice-content small, .fieldset-documentation .g-switch-row small { margin-block-start: 3px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 400; }
.fieldset-documentation .fieldset-live-status { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
.fieldset-documentation .fieldset-composition-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 30px 34px; }
.fieldset-documentation .fieldset-nested-example { grid-column: 1 / -1; }
.fieldset-documentation .fieldset-state-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); align-items: start; gap: 26px; }
.fieldset-documentation .fieldset-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.fieldset-documentation .fieldset-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .fieldset-documentation .fieldset-composition-grid, .fieldset-documentation .fieldset-state-grid { grid-template-columns: 1fr; } .fieldset-documentation .fieldset-nested-example { grid-column: auto; } }
</style>
`;export{e as default};