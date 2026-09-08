var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GPhoneGroup } from "@gardenerim/vue";

type Country = "CN" | "US" | "GB";
const countries: Record<Country, { label: string; code: string; example: string }> = {
  CN: { label: "中国", code: "+86", example: "138 0013 8000" },
  US: { label: "United States", code: "+1", example: "415 555 0132" },
  GB: { label: "United Kingdom", code: "+44", example: "20 7946 0958" },
};
const country = ref<Country>("CN");
const national = ref(countries.CN.example);
const extension = ref("806");
const phoneType = ref("mobile");
const touched = ref(false);
const digits = computed(() => national.value.replace(/\\D/g, ""));
const invalid = computed(() => touched.value && (digits.value.length < 7 || digits.value.length > 15));
const e164 = computed(() => \`\${countries[country.value].code}\${digits.value}\`);

function chooseCountry(next: Country) {
  country.value = next;
  national.value = countries[next].example;
  extension.value = next === "CN" ? "806" : "";
  touched.value = false;
}
<\/script>

<template>
  <article id="component-phone-group" class="component-doc phone-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / TELEPHONE</span>
        <h2>电话号码字段组 <span>GPhoneGroup</span></h2>
        <p>分离国家、国际区号、本地号码和分机，保留原生电话键盘与自动填充，并实时生成可存储的 E.164 号码。</p>
      </div>
      <span class="component-status">css-ready · E.164</span>
    </header>

    <section class="usage-section">
      <h3>国际号码与实时规范化</h3>
      <p>国家选择会同步区号和示例格式；界面可以保留易读空格，提交时使用规范化号码。</p>
      <div class="phone-group-toolbar" role="group" aria-label="示例国家">
        <button v-for="(item, key) in countries" :key="key" class="g-btn g-btn-outline" type="button" :aria-pressed="country === key" @click="chooseCountry(key as Country)">{{ item.label }}</button>
      </div>
      <div class="usage-preview usage-preview--block phone-group-live">
        <GPhoneGroup
          :variant="['international', 'block']"
          :state="invalid ? 'error' : digits.length >= 7 ? 'success' : 'default'"
          :aria-invalid="invalid || undefined"
          
          aria-describedby="contact-phone-help contact-phone-status"
        >
          <legend class="g-phone-group-legend">联系电话 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="contact-phone-help" class="g-phone-group-description">用于配送通知；分机号可留空。短信号码应单独确认是否可接收消息。</p>
          <div class="g-phone-field g-phone-country"><label for="phone-country">国家或地区</label><select id="phone-country" v-model="country" class="g-select" autocomplete="country" @change="chooseCountry(country)"><option v-for="(item, key) in countries" :key="key" :value="key">{{ item.label }}</option></select></div>
          <div class="g-phone-field g-phone-country-code"><label for="phone-code">国际区号</label><input id="phone-code" class="g-input" :value="countries[country].code" autocomplete="tel-country-code" inputmode="tel" readonly /></div>
          <div class="g-phone-field g-phone-national"><label for="phone-national">本地号码</label><input id="phone-national" v-model="national" class="g-input" type="tel" inputmode="tel" autocomplete="tel-national" required :aria-invalid="invalid || undefined" /></div>
          <div class="g-phone-field g-phone-extension"><label for="phone-extension">分机</label><input id="phone-extension" v-model="extension" class="g-input" inputmode="numeric" autocomplete="tel-extension" /></div>
          <div class="g-phone-field g-phone-type"><label for="phone-type">号码类型</label><select id="phone-type" v-model="phoneType" class="g-select"><option value="mobile">手机</option><option value="work">工作</option><option value="home">家庭</option></select></div>
          <div class="g-phone-preview" aria-live="polite"><strong>E.164</strong><code>{{ e164 || '—' }}</code><span v-if="extension">分机 {{ extension }}</span></div>
          <small id="contact-phone-status" :class="invalid ? 'g-phone-group-feedback' : 'g-phone-group-status'" :role="invalid ? 'alert' : 'status'" aria-live="polite">{{ invalid ? '请输入 7 至 15 位有效电话号码。' : \`\${countries[country].label} · \${phoneType === 'mobile' ? '手机' : phoneType === 'work' ? '工作' : '家庭'}号码\` }}</small>
        </GPhoneGroup>
        <button class="g-btn g-btn-primary" type="button" @click="touched = true">校验号码</button>
      </div>
    </section>

    <section class="usage-section">
      <h3>组合方式</h3>
      <div class="usage-preview usage-preview--block phone-group-patterns">
        <GPhoneGroup :variant="['domestic', 'card', 'compact', 'block']" state="read-only" data-g-form-read-only="true">
          <legend class="g-phone-group-legend">已验证的工作号码</legend>
          <div class="g-phone-field g-phone-country-code"><label for="phone-group-pattern-1">区号</label><input id="phone-group-pattern-1" class="g-input" value="+86" readonly /></div>
          <div class="g-phone-field g-phone-national"><label for="phone-group-pattern-2">号码</label><input id="phone-group-pattern-2" class="g-input" value="138 0013 8000" readonly /></div>
          <div class="g-phone-field g-phone-extension"><label for="phone-group-pattern-3">分机</label><input id="phone-group-pattern-3" class="g-input" value="806" readonly /></div>
          <small class="g-phone-group-status" role="status">已于今天验证</small>
        </GPhoneGroup>
        <GPhoneGroup :variant="['stacked', 'spacious', 'block']">
          <legend class="g-phone-group-legend">窄容器号码</legend>
          <p class="g-phone-group-description">单列结构适合侧栏和移动表单。</p>
          <div class="g-phone-field g-phone-country-code"><label for="phone-group-pattern-4">国家区号</label><select id="phone-group-pattern-4" class="g-select"><option>+86</option><option>+1</option></select></div>
          <div class="g-phone-field g-phone-national"><label for="phone-group-pattern-5">电话号码</label><input id="phone-group-pattern-5" class="g-input" type="tel" inputmode="tel" /></div>
        </GPhoneGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误与禁用状态</h3>
      <div class="usage-preview usage-preview--block phone-group-states">
        <GPhoneGroup :variant="['stacked', 'block']" state="error" aria-invalid="true" aria-describedby="phone-error"><legend class="g-phone-group-legend">紧急联系人</legend><div class="g-phone-field g-phone-national"><label for="phone-group-pattern-6">电话号码</label><input id="phone-group-pattern-6" class="g-input" type="tel" value="123" aria-invalid="true" /></div><small id="phone-error" class="g-phone-group-feedback" role="alert">电话号码长度不足。</small></GPhoneGroup>
        <GPhoneGroup :variant="['stacked', 'block']" state="disabled" disabled><legend class="g-phone-group-legend">企业目录号码</legend><div class="g-phone-field g-phone-national"><label for="phone-group-pattern-7">电话号码</label><input id="phone-group-pattern-7" class="g-input" value="+86 10 5555 0188" disabled /></div><small class="g-phone-group-help">该号码由管理员同步。</small></GPhoneGroup>
      </div>
    </section>

    <aside class="phone-group-guidance"><strong>显示格式与存储格式应分离</strong><span>用户输入可以包含空格、括号和连字符；提交前规范化并验证，但不要把分机号拼进 E.164 主号码。</span></aside>
    <footer class="component-doc__meta"><span><b>格式</b><code>domestic</code><code>international</code></span><span><b>原生</b><code>type=tel</code><code>inputmode=tel</code></span><span><b>自动填充</b><code>tel-national</code></span><span><b>输出</b><code>E.164</code></span></footer>
  </article>
</template>

<style>
.phone-group-documentation .phone-group-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-block-end: 14px; }
.phone-group-documentation .phone-group-live { display: grid; max-inline-size: 60rem; gap: 18px; }
.phone-group-documentation .phone-group-live > .g-btn { justify-self: start; }
.phone-group-documentation .phone-group-patterns, .phone-group-documentation .phone-group-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 28px; }
.phone-group-documentation .phone-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.phone-group-documentation .phone-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .phone-group-documentation .phone-group-patterns, .phone-group-documentation .phone-group-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};