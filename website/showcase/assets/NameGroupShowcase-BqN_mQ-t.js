var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GNameGroup } from "@gardenerim/vue";

type NameOrder = "western" | "eastern";
const order = ref<NameOrder>("eastern");
const prefix = ref("");
const given = ref("小明");
const middle = ref("");
const family = ref("王");
const suffix = ref("");
const preferred = ref("小明");
const touched = ref(false);
const invalid = computed(() => touched.value && (!given.value.trim() || !family.value.trim()));
const displayName = computed(() => order.value === "eastern"
  ? \`\${family.value}\${given.value}\`.trim()
  : [prefix.value, given.value, middle.value, family.value, suffix.value].filter(Boolean).join(" "));
<\/script>

<template>
  <article id="component-name-group" class="component-doc name-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / PERSON NAME</span>
        <h2>姓名字段组 <span>GNameGroup</span></h2>
        <p>按文化与业务场景采集结构化姓名，支持东西方顺序、称谓、中间名、后缀、拼音和常用名。</p>
      </div>
      <span class="component-status">css-ready · autocomplete</span>
    </header>

    <section class="usage-section">
      <h3>国际化姓名顺序</h3>
      <p>顺序切换会同步改变视觉与 DOM 顺序，避免键盘焦点和屏幕阅读器朗读顺序不一致。</p>
      <div class="name-group-toolbar" role="group" aria-label="姓名顺序">
        <button class="g-btn g-btn-outline" type="button" :aria-pressed="order === 'eastern'" @click="order = 'eastern'">姓在前</button>
        <button class="g-btn g-btn-outline" type="button" :aria-pressed="order === 'western'" @click="order = 'western'">名在前</button>
      </div>
      <div class="usage-preview usage-preview--block name-group-live">
        <GNameGroup :variant="[order, 'full', 'block']" :state="invalid ? 'error' : displayName ? 'success' : 'default'" :aria-invalid="invalid || undefined" aria-describedby="person-name-help person-name-status">
          <legend class="g-name-group-legend">法定姓名 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="person-name-help" class="g-name-group-description">请按身份证件填写；称谓、后缀和中间名可以留空。</p>
          <div v-if="order === 'western'" class="g-name-field g-name-prefix"><label for="name-prefix">称谓</label><select id="name-prefix" v-model="prefix" class="g-select" autocomplete="honorific-prefix"><option value="">无</option><option>Dr.</option><option>Ms.</option><option>Mr.</option></select></div>
          <div v-if="order === 'western'" class="g-name-field g-name-given"><label for="name-given-western">名</label><input id="name-given-western" v-model="given" class="g-input" autocomplete="given-name" required /></div>
          <div v-if="order === 'western'" class="g-name-field g-name-middle"><label for="name-middle">中间名</label><input id="name-middle" v-model="middle" class="g-input" autocomplete="additional-name" /></div>
          <div class="g-name-field g-name-family"><label :for="order === 'western' ? 'name-family-western' : 'name-family-eastern'">姓</label><input :id="order === 'western' ? 'name-family-western' : 'name-family-eastern'" v-model="family" class="g-input" autocomplete="family-name" required /></div>
          <div v-if="order === 'eastern'" class="g-name-field g-name-given"><label for="name-given-eastern">名</label><input id="name-given-eastern" v-model="given" class="g-input" autocomplete="given-name" required /></div>
          <div v-if="order === 'western'" class="g-name-field g-name-suffix"><label for="name-suffix">后缀</label><input id="name-suffix" v-model="suffix" class="g-input" autocomplete="honorific-suffix" placeholder="Jr." /></div>
          <div class="g-name-field g-name-preferred"><label for="name-preferred">常用名</label><input id="name-preferred" v-model="preferred" class="g-input" autocomplete="nickname" /><small class="g-name-group-help">将在评论、通知和成员列表中显示。</small></div>
          <small id="person-name-status" :class="invalid ? 'g-name-group-feedback' : 'g-name-group-status'" :role="invalid ? 'alert' : 'status'" aria-live="polite">{{ invalid ? '姓和名均不能为空。' : \`显示姓名：\${displayName || '尚未填写'}\` }}</small>
        </GNameGroup>
        <button class="g-btn g-btn-primary" type="button" @click="touched = true">校验姓名</button>
      </div>
    </section>

    <section class="usage-section">
      <h3>本地文字、拼音与显示名</h3>
      <div class="usage-preview usage-preview--block name-group-patterns">
        <GNameGroup :variant="['eastern', 'two', 'block']">
          <legend class="g-name-group-legend">中文姓名</legend>
          <div class="g-name-field g-name-family"><label for="cn-family">姓</label><input id="cn-family" class="g-input" value="欧阳" autocomplete="family-name" /></div>
          <div class="g-name-field g-name-given"><label for="cn-given">名</label><input id="cn-given" class="g-input" value="晨曦" autocomplete="given-name" /></div>
          <div class="g-name-field g-name-phonetic"><label for="cn-phonetic">拼音 / 罗马字</label><input id="cn-phonetic" class="g-input" value="Ouyang Chenxi" /><small class="g-name-group-help">用于国际票务或英文目录。</small></div>
        </GNameGroup>
        <GNameGroup :variant="['western', 'three', 'block']" state="read-only" data-g-form-read-only="true">
          <legend class="g-name-group-legend">证件姓名（只读）</legend>
          <div class="g-name-field g-name-given"><label for="name-group-pattern-1">Given name</label><input id="name-group-pattern-1" class="g-input" value="Ada" readonly /></div>
          <div class="g-name-field g-name-middle"><label for="name-group-pattern-2">Middle name</label><input id="name-group-pattern-2" class="g-input" value="" readonly /></div>
          <div class="g-name-field g-name-family"><label for="name-group-pattern-3">Family name</label><input id="name-group-pattern-3" class="g-input" value="Lovelace" readonly /></div>
          <div class="g-name-field g-name-display"><label for="name-group-pattern-4">Display name</label><input id="name-group-pattern-4" class="g-input" value="Ada Lovelace" readonly /></div>
        </GNameGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误与禁用状态</h3>
      <div class="usage-preview usage-preview--block name-group-states">
        <GNameGroup :variant="['two', 'block']" state="error" aria-invalid="true" aria-describedby="name-error"><legend class="g-name-group-legend">联系人姓名</legend><div class="g-name-field g-name-family"><label for="name-group-pattern-5">姓</label><input id="name-group-pattern-5" class="g-input" aria-invalid="true" /></div><div class="g-name-field g-name-given"><label for="name-group-pattern-6">名</label><input id="name-group-pattern-6" class="g-input" aria-invalid="true" /></div><small id="name-error" class="g-name-group-feedback" role="alert">请填写完整姓名。</small></GNameGroup>
        <GNameGroup :variant="['two', 'block']" state="disabled" disabled><legend class="g-name-group-legend">同步的姓名</legend><div class="g-name-field g-name-family"><label for="name-group-pattern-7">姓</label><input id="name-group-pattern-7" class="g-input" value="张" disabled /></div><div class="g-name-field g-name-given"><label for="name-group-pattern-8">名</label><input id="name-group-pattern-8" class="g-input" value="海" disabled /></div><small class="g-name-group-help">姓名来自企业身份目录。</small></GNameGroup>
      </div>
    </section>

    <aside class="name-group-guidance"><strong>不要假设所有姓名都是“名 + 姓”</strong><span>根据地区显示并采集必要字段；没有明确业务需求时不要强制中间名、称谓或后缀。完整姓名应允许本地文字与较长字符。</span></aside>
    <footer class="component-doc__meta"><span><b>顺序</b><code>eastern</code><code>western</code></span><span><b>字段</b><code>given</code><code>family</code><code>phonetic</code><code>preferred</code></span><span><b>浏览器</b><code>autocomplete</code></span><span><b>语义</b><code>fieldset</code><code>legend</code></span></footer>
  </article>
</template>

<style>
.name-group-documentation .name-group-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-block-end: 14px; }
.name-group-documentation .name-group-live { display: grid; max-inline-size: 58rem; gap: 18px; }
.name-group-documentation .name-group-live > .g-btn { justify-self: start; }
.name-group-documentation .name-group-patterns, .name-group-documentation .name-group-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 28px; }
.name-group-documentation .name-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.name-group-documentation .name-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .name-group-documentation .name-group-patterns, .name-group-documentation .name-group-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};