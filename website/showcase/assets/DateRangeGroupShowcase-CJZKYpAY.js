var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GDateRangeGroup } from "@gardenerim/vue";

const start = ref("2026-09-05");
const end = ref("2026-09-08");
const invalid = computed(() => Boolean(start.value && end.value && end.value < start.value));
const complete = computed(() => Boolean(start.value && end.value));
const duration = computed(() => {
  if (!complete.value || invalid.value) return 0;
  return Math.round((new Date(\`\${end.value}T00:00:00\`).getTime() - new Date(\`\${start.value}T00:00:00\`).getTime()) / 86_400_000) + 1;
});
function setPreset(kind: "week" | "month") {
  start.value = "2026-09-05";
  end.value = kind === "week" ? "2026-09-11" : "2026-10-04";
}
<\/script>

<template>
  <article id="component-date-range-group" class="component-doc date-range-documentation">
    <header class="component-doc__header"><div><span class="component-kicker">FORM / DATE RANGE</span><h2>日期范围字段组 <span>GDateRangeGroup</span></h2><p>使用原生日期输入采集开始与结束日期，联动边界、校验先后顺序，并清楚说明范围是否包含首尾日期。</p></div><span class="component-status">css-ready · native date</span></header>

    <section class="usage-section">
      <h3>约束、预设与时长</h3>
      <p>结束日期的最小值跟随开始日期；错误范围即时反馈，常用范围通过预设按钮填充。</p>
      <div class="usage-preview usage-preview--block date-range-live">
        <GDateRangeGroup :variant="['date', 'inclusive', 'block']" :state="invalid ? 'error' : complete ? 'complete' : 'partial'" :aria-invalid="invalid || undefined" aria-describedby="date-range-help date-range-status">
          <legend class="g-date-range-legend">出行日期</legend>
          <p id="date-range-help" class="g-date-range-description">包含出发日和返程日，可选择 2026 年内的日期。</p>
          <div class="g-date-range-presets" aria-label="日期范围预设"><button class="g-btn g-btn-outline g-date-range-preset" type="button" @click="setPreset('week')">未来 7 天</button><button class="g-btn g-btn-outline g-date-range-preset" type="button" @click="setPreset('month')">未来 30 天</button></div>
          <div class="g-date-range-field g-date-range-start"><label for="date-range-start">开始日期</label><input id="date-range-start" v-model="start" class="g-input" type="date" min="2026-01-01" max="2026-12-31" /></div>
          <span class="g-range-separator" aria-hidden="true">至</span>
          <div class="g-date-range-field g-date-range-end"><label for="date-range-end">结束日期</label><input id="date-range-end" v-model="end" class="g-input" type="date" :min="start || '2026-01-01'" max="2026-12-31" :aria-invalid="invalid || undefined" /></div>
          <div class="g-date-range-duration" aria-live="polite"><strong>{{ invalid ? '范围无效' : complete ? \`\${duration} 天\` : '尚未完成' }}</strong><span>{{ complete && !invalid ? '包含首尾日期' : '请选择两个日期' }}</span></div>
          <small id="date-range-status" :class="invalid ? 'g-date-range-feedback' : 'g-date-range-status'" :role="invalid ? 'alert' : 'status'" aria-live="polite">{{ invalid ? '结束日期不能早于开始日期。' : complete ? \`\${start} 至 \${end}\` : '请选择开始和结束日期。' }}</small>
        </GDateRangeGroup>
      </div>
    </section>

    <section class="usage-section"><h3>日期时间与窄容器</h3><div class="usage-preview usage-preview--block date-range-patterns">
      <GDateRangeGroup :variant="['datetime', 'card', 'compact', 'block']" state="read-only" data-g-form-read-only="true"><legend class="g-date-range-legend">维护窗口（只读）</legend><div class="g-date-range-field g-date-range-start"><label for="date-range-group-pattern-1">开始</label><input id="date-range-group-pattern-1" class="g-input" type="datetime-local" value="2026-09-05T22:00" readonly /></div><span class="g-range-separator">至</span><div class="g-date-range-field g-date-range-end"><label for="date-range-group-pattern-2">结束</label><input id="date-range-group-pattern-2" class="g-input" type="datetime-local" value="2026-09-06T02:00" readonly /></div><div class="g-date-range-duration"><strong>4 小时</strong><span>Asia/Shanghai</span></div></GDateRangeGroup>
      <GDateRangeGroup :variant="['stacked', 'spacious', 'block']"><legend class="g-date-range-legend">筛选日期</legend><div class="g-date-range-field g-date-range-start"><label for="date-range-group-pattern-3">从</label><input id="date-range-group-pattern-3" class="g-input" type="date" /></div><span class="g-range-separator">到</span><div class="g-date-range-field g-date-range-end"><label for="date-range-group-pattern-4">至</label><input id="date-range-group-pattern-4" class="g-input" type="date" /></div></GDateRangeGroup>
    </div></section>

    <section class="usage-section"><h3>错误与禁用状态</h3><div class="usage-preview usage-preview--block date-range-states">
      <GDateRangeGroup :variant="['stacked', 'block']" state="error" aria-invalid="true"><legend class="g-date-range-legend">无效范围</legend><div class="g-date-range-field"><label for="date-range-group-pattern-5">开始</label><input id="date-range-group-pattern-5" class="g-input" type="date" value="2026-09-20" /></div><div class="g-date-range-field"><label for="date-range-group-pattern-6">结束</label><input id="date-range-group-pattern-6" class="g-input" type="date" value="2026-09-10" aria-invalid="true" /></div><small class="g-date-range-feedback" role="alert">结束日期不能早于开始日期。</small></GDateRangeGroup>
      <GDateRangeGroup :variant="['stacked', 'block']" state="disabled" disabled><legend class="g-date-range-legend">锁定周期</legend><div class="g-date-range-field"><label for="date-range-group-pattern-7">开始</label><input id="date-range-group-pattern-7" class="g-input" type="date" value="2026-09-01" disabled /></div><div class="g-date-range-field"><label for="date-range-group-pattern-8">结束</label><input id="date-range-group-pattern-8" class="g-input" type="date" value="2026-09-30" disabled /></div></GDateRangeGroup>
    </div></section>

    <aside class="date-range-guidance"><strong>明确边界与时区</strong><span>日期范围要说明是否包含首尾；涉及时间时还应显示时区。不要用两个互不约束的输入让用户在提交后才发现顺序错误。</span></aside>
    <footer class="component-doc__meta"><span><b>原生</b><code>date</code><code>datetime-local</code></span><span><b>约束</b><code>min</code><code>max</code></span><span><b>边界</b><code>inclusive</code></span><span><b>语义</b><code>fieldset</code></span></footer>
  </article>
</template>

<style>
.date-range-documentation .date-range-live { display: grid; max-inline-size: 54rem; gap: 18px; }
.date-range-documentation .date-range-patterns, .date-range-documentation .date-range-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 28px; }
.date-range-documentation .date-range-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.date-range-documentation .date-range-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .date-range-documentation .date-range-patterns, .date-range-documentation .date-range-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};