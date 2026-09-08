var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GMoneyGroup } from "@gardenerim/vue";

type Currency = "CNY" | "USD" | "EUR";
const currency = ref<Currency>("CNY");
const amount = ref("1280.50");
const taxRate = ref("6");
const currencyInfo: Record<Currency, { symbol: string; locale: string; cnyRate: number }> = {
  CNY: { symbol: "¥", locale: "zh-CN", cnyRate: 1 },
  USD: { symbol: "$", locale: "en-US", cnyRate: 7.12 },
  EUR: { symbol: "€", locale: "de-DE", cnyRate: 7.78 },
};
const numericAmount = computed(() => Number(amount.value.replace(/,/g, "")));
const invalid = computed(() => !Number.isFinite(numericAmount.value) || numericAmount.value <= 0);
const formatted = computed(() => Number.isFinite(numericAmount.value)
  ? new Intl.NumberFormat(currencyInfo[currency.value].locale, { style: "currency", currency: currency.value }).format(numericAmount.value)
  : "—");
const tax = computed(() => Number.isFinite(numericAmount.value) ? numericAmount.value * (Number(taxRate.value) || 0) / 100 : 0);
const cnyValue = computed(() => Number.isFinite(numericAmount.value) ? numericAmount.value * currencyInfo[currency.value].cnyRate : 0);
<\/script>

<template>
  <article id="component-money-group" class="component-doc money-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / MONEY</span>
        <h2>金额字段组 <span>GMoneyGroup</span></h2>
        <p>组合币种、金额、税率与换算结果，输入保持适合编辑的十进制格式，展示则使用本地化货币格式。</p>
      </div>
      <span class="component-status">css-ready · Intl</span>
    </header>

    <section class="usage-section">
      <h3>币种、金额与本地化预览</h3>
      <p>不要在输入过程中强行插入千分位；让用户稳定编辑，并在独立区域展示最终格式。</p>
      <div class="usage-preview usage-preview--block money-group-live">
        <GMoneyGroup
          :variant="['international', 'accounting', 'block']"
          :state="invalid ? 'error' : numericAmount > 0 ? 'success' : 'default'"
          :aria-invalid="invalid || undefined"
          
          aria-describedby="invoice-money-help invoice-money-status"
        >
          <legend class="g-money-group-legend">发票金额 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="invoice-money-help" class="g-money-group-description">金额必须大于 0；税率和人民币估值仅用于预览。</p>
          <div class="g-money-field g-money-currency"><label for="money-currency">币种</label><select id="money-currency" v-model="currency" class="g-select" autocomplete="transaction-currency"><option value="CNY">CNY · 人民币</option><option value="USD">USD · 美元</option><option value="EUR">EUR · 欧元</option></select></div>
          <div class="g-money-field g-money-amount"><label for="money-amount">金额</label><div class="g-money-control"><span class="g-money-symbol" aria-hidden="true">{{ currencyInfo[currency].symbol }}</span><input id="money-amount" v-model="amount" class="g-input" inputmode="decimal" autocomplete="transaction-amount" required :aria-invalid="invalid || undefined" /></div></div>
          <div class="g-money-field g-money-tax"><label for="money-tax">税率</label><div class="g-money-control"><input id="money-tax" v-model="taxRate" class="g-input" inputmode="decimal" /><span class="g-money-symbol" aria-hidden="true">%</span></div></div>
          <div class="g-money-converted" aria-live="polite"><strong>{{ formatted }}</strong><span>税额 {{ new Intl.NumberFormat(currencyInfo[currency].locale, { style: 'currency', currency }).format(tax) }}</span><span v-if="currency !== 'CNY'">约合 ¥{{ cnyValue.toFixed(2) }}</span></div>
          <small id="invoice-money-status" :class="invalid ? 'g-money-group-feedback' : 'g-money-group-status'" :role="invalid ? 'alert' : 'status'" aria-live="polite">{{ invalid ? '请输入大于 0 的有效金额。' : \`\${currency} · 最多保留两位小数\` }}</small>
        </GMoneyGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>会计与窄容器布局</h3>
      <div class="usage-preview usage-preview--block money-group-patterns">
        <GMoneyGroup :variant="['accounting', 'card', 'compact', 'block']" state="read-only" data-g-form-read-only="true">
          <legend class="g-money-group-legend">已核准预算</legend>
          <div class="g-money-field g-money-currency"><label for="money-group-pattern-1">币种</label><select id="money-group-pattern-1" class="g-select" disabled><option>USD</option></select></div>
          <div class="g-money-field g-money-amount"><label for="money-amount-pattern-1">金额</label><div class="g-money-control"><span class="g-money-symbol" aria-hidden="true">$</span><input id="money-amount-pattern-1" class="g-input" value="25,000.00" readonly /></div></div>
          <div class="g-money-converted"><strong>$25,000.00</strong><span>财务已核准</span></div>
        </GMoneyGroup>
        <GMoneyGroup :variant="['stacked', 'spacious', 'block']">
          <legend class="g-money-group-legend">退款金额</legend>
          <p class="g-money-group-description">单列形式适合侧栏和移动表单。</p>
          <div class="g-money-field g-money-currency"><label for="money-group-pattern-2">币种</label><select id="money-group-pattern-2" class="g-select"><option>CNY</option></select></div>
          <div class="g-money-field g-money-amount"><label for="money-amount-pattern-2">退款金额</label><div class="g-money-control"><span class="g-money-symbol" aria-hidden="true">¥</span><input id="money-amount-pattern-2" class="g-input" inputmode="decimal" value="88.00" /></div></div>
        </GMoneyGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误与禁用状态</h3>
      <div class="usage-preview usage-preview--block money-group-states">
        <GMoneyGroup :variant="['stacked', 'block']" state="error" aria-invalid="true" aria-describedby="money-error"><legend class="g-money-group-legend">付款金额</legend><div class="g-money-field g-money-amount"><label for="money-amount-pattern-3">金额</label><div class="g-money-control"><span class="g-money-symbol">¥</span><input id="money-amount-pattern-3" class="g-input" value="-20" aria-invalid="true" /></div></div><small id="money-error" class="g-money-group-feedback" role="alert">金额必须大于 0。</small></GMoneyGroup>
        <GMoneyGroup :variant="['stacked', 'block']" state="disabled" disabled><legend class="g-money-group-legend">结算金额</legend><div class="g-money-field g-money-amount"><label for="money-amount-pattern-4">金额</label><div class="g-money-control"><span class="g-money-symbol">¥</span><input id="money-amount-pattern-4" class="g-input" value="560.00" disabled /></div></div><small class="g-money-group-help">等待结算周期结束。</small></GMoneyGroup>
      </div>
    </section>

    <aside class="money-group-guidance"><strong>金额必须同时保存币种</strong><span>不要只保存一个裸数字，也不要用二进制浮点直接做财务运算；后端应采用十进制定点或最小货币单位。</span></aside>
    <footer class="component-doc__meta"><span><b>原生</b><code>inputmode=decimal</code></span><span><b>自动填充</b><code>transaction-amount</code></span><span><b>展示</b><code>Intl.NumberFormat</code></span><span><b>语义</b><code>fieldset</code></span></footer>
  </article>
</template>

<style>
.money-group-documentation .money-group-live { display: grid; max-inline-size: 56rem; gap: 18px; }
.money-group-documentation .money-group-live > .g-btn { justify-self: start; }
.money-group-documentation .money-group-patterns, .money-group-documentation .money-group-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 28px; }
.money-group-documentation .money-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.money-group-documentation .money-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .money-group-documentation .money-group-patterns, .money-group-documentation .money-group-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};