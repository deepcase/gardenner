var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GAddressGroup } from "@gardenerim/vue";

type AddressFormat = "CN" | "US";
const format = ref<AddressFormat>("CN");
const recipient = ref("王小明");
const organization = ref("园丁科技");
const line1 = ref("中关村大街 27 号");
const line2 = ref("园丁大厦 8 层");
const city = ref("北京市");
const region = ref("北京市");
const district = ref("海淀区");
const postal = ref("100080");
const touched = ref(false);
const invalid = computed(() => touched.value && [recipient.value, line1.value, city.value, region.value, postal.value].some((value) => !value.trim()));
const formattedAddress = computed(() => format.value === "CN"
  ? ["中国", postal.value, region.value, city.value, district.value, line1.value, line2.value, recipient.value].filter(Boolean).join(" ")
  : [recipient.value, organization.value, line1.value, line2.value, \`\${city.value}, \${region.value} \${postal.value}\`, "United States"].filter(Boolean).join(" · "));

function useFormat(next: AddressFormat) {
  format.value = next;
  touched.value = false;
  if (next === "CN") {
    line1.value = "中关村大街 27 号";
    line2.value = "园丁大厦 8 层";
    city.value = "北京市";
    region.value = "北京市";
    district.value = "海淀区";
    postal.value = "100080";
  } else {
    line1.value = "1 Garden Way";
    line2.value = "Suite 800";
    city.value = "San Francisco";
    region.value = "CA";
    district.value = "";
    postal.value = "94105";
  }
}
<\/script>

<template>
  <article id="component-address-group" class="component-doc address-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / POSTAL ADDRESS</span>
        <h2>地址字段组 <span>GAddressGroup</span></h2>
        <p>按目的国家采集结构化邮寄地址，提供正确的字段顺序、浏览器自动填充、校验反馈和小容器响应式布局。</p>
      </div>
      <span class="component-status">css-ready · autocomplete</span>
    </header>

    <section class="usage-section">
      <h3>国家感知的地址顺序</h3>
      <p>格式切换会改变真实 DOM 顺序，而不是只靠 CSS 重排，键盘焦点和屏幕阅读器顺序始终一致。</p>
      <div class="address-group-toolbar" role="group" aria-label="地址格式">
        <button class="g-btn g-btn-outline" type="button" :aria-pressed="format === 'CN'" @click="useFormat('CN')">中国格式</button>
        <button class="g-btn g-btn-outline" type="button" :aria-pressed="format === 'US'" @click="useFormat('US')">美国格式</button>
      </div>
      <div class="usage-preview usage-preview--block address-group-live">
        <GAddressGroup
          :variant="[format === 'CN' ? 'domestic' : 'international', 'block']"
          :state="invalid ? 'error' : formattedAddress ? 'success' : 'default'"
          :aria-invalid="invalid || undefined"
         
          aria-describedby="shipping-address-help shipping-address-status"
        >
          <legend class="g-address-group-legend">配送地址 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="shipping-address-help" class="g-address-group-description">请填写可接收包裹的实际地址。第二行和公司名称可以留空。</p>

          <div v-if="format === 'CN'" class="g-address-field g-address-country"><label for="address-country-cn">国家或地区</label><select id="address-country-cn" class="g-select" autocomplete="country" value="CN"><option value="CN">中国</option></select></div>
          <div class="g-address-field g-address-recipient"><label for="address-recipient">收件人</label><input id="address-recipient" v-model="recipient" class="g-input" autocomplete="name" required :aria-invalid="invalid && !recipient.trim() || undefined" /></div>
          <div class="g-address-field g-address-organization"><label for="address-organization">公司 / 组织</label><input id="address-organization" v-model="organization" class="g-input" autocomplete="organization" /></div>

          <template v-if="format === 'CN'">
            <div class="g-address-field g-address-region"><label for="address-region-cn">省 / 直辖市</label><input id="address-region-cn" v-model="region" class="g-input" autocomplete="address-level1" required /></div>
            <div class="g-address-field g-address-city"><label for="address-city-cn">城市</label><input id="address-city-cn" v-model="city" class="g-input" autocomplete="address-level2" required /></div>
            <div class="g-address-field g-address-district"><label for="address-district-cn">区 / 县</label><input id="address-district-cn" v-model="district" class="g-input" autocomplete="address-level3" /></div>
            <div class="g-address-field g-address-postal"><label for="address-postal-cn">邮政编码</label><input id="address-postal-cn" v-model="postal" class="g-input" autocomplete="postal-code" inputmode="numeric" required /></div>
            <div class="g-address-field g-address-line-1"><label for="address-line1-cn">街道地址</label><input id="address-line1-cn" v-model="line1" class="g-input" autocomplete="address-line1" required /></div>
            <div class="g-address-field g-address-line-2"><label for="address-line2-cn">楼栋、单元和房间</label><input id="address-line2-cn" v-model="line2" class="g-input" autocomplete="address-line2" /></div>
          </template>
          <template v-else>
            <div class="g-address-field g-address-line-1"><label for="address-line1-us">Street address</label><input id="address-line1-us" v-model="line1" class="g-input" autocomplete="address-line1" required /></div>
            <div class="g-address-field g-address-line-2"><label for="address-line2-us">Apartment, suite, etc.</label><input id="address-line2-us" v-model="line2" class="g-input" autocomplete="address-line2" /></div>
            <div class="g-address-field g-address-city"><label for="address-city-us">City</label><input id="address-city-us" v-model="city" class="g-input" autocomplete="address-level2" required /></div>
            <div class="g-address-field g-address-region"><label for="address-region-us">State</label><input id="address-region-us" v-model="region" class="g-input" autocomplete="address-level1" required /></div>
            <div class="g-address-field g-address-postal"><label for="address-postal-us">ZIP code</label><input id="address-postal-us" v-model="postal" class="g-input" autocomplete="postal-code" inputmode="numeric" required /></div>
            <div class="g-address-field g-address-country"><label for="address-country-us">Country or region</label><select id="address-country-us" class="g-select" autocomplete="country" value="US"><option value="US">United States</option></select></div>
          </template>

          <small id="shipping-address-status" :class="invalid ? 'g-address-group-feedback' : 'g-address-group-status'" :role="invalid ? 'alert' : 'status'" aria-live="polite">{{ invalid ? '请补全收件人、街道、城市、行政区和邮编。' : \`格式化地址：\${formattedAddress}\` }}</small>
        </GAddressGroup>
        <button class="g-btn g-btn-primary" type="button" @click="touched = true">校验地址</button>
      </div>
    </section>

    <section class="usage-section">
      <h3>显示密度与只读确认</h3>
      <div class="usage-preview usage-preview--block address-group-patterns">
        <GAddressGroup :variant="['international', 'card', 'compact', 'block']" state="read-only" data-g-form-read-only="true">
          <legend class="g-address-group-legend">账单地址（只读）</legend>
          <div class="g-address-field g-address-recipient"><label for="address-group-pattern-1">Recipient</label><input id="address-group-pattern-1" class="g-input" value="Ada Lovelace" readonly /></div>
          <div class="g-address-field g-address-line-1"><label for="address-group-pattern-2">Street</label><input id="address-group-pattern-2" class="g-input" value="12 St James's Square" readonly /></div>
          <div class="g-address-field g-address-city"><label for="address-group-pattern-3">City</label><input id="address-group-pattern-3" class="g-input" value="London" readonly /></div>
          <div class="g-address-field g-address-region"><label for="address-group-pattern-4">County</label><input id="address-group-pattern-4" class="g-input" value="Greater London" readonly /></div>
          <div class="g-address-field g-address-postal"><label for="address-group-pattern-5">Postcode</label><input id="address-group-pattern-5" class="g-input" value="SW1Y 4LB" readonly /></div>
          <small class="g-address-group-help">订单提交后仍可返回编辑。</small>
        </GAddressGroup>
        <GAddressGroup :variant="['stacked', 'spacious', 'block']">
          <legend class="g-address-group-legend">单列地址</legend>
          <p class="g-address-group-description">适合侧栏、弹窗和窄容器，不依赖页面断点。</p>
          <div class="g-address-field g-address-line-1"><label for="address-group-pattern-6">地址第一行</label><input id="address-group-pattern-6" class="g-input" placeholder="街道和门牌号" /></div>
          <div class="g-address-field g-address-city"><label for="address-group-pattern-7">城市</label><input id="address-group-pattern-7" class="g-input" /></div>
          <div class="g-address-field g-address-postal"><label for="address-group-pattern-8">邮编</label><input id="address-group-pattern-8" class="g-input" /></div>
        </GAddressGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误与禁用状态</h3>
      <div class="usage-preview usage-preview--block address-group-states">
        <GAddressGroup :variant="['stacked', 'block']" state="error" aria-invalid="true" aria-describedby="address-error"><legend class="g-address-group-legend">退货地址</legend><div class="g-address-field g-address-line-1"><label for="address-group-pattern-9">街道地址</label><input id="address-group-pattern-9" class="g-input" aria-invalid="true" /></div><small id="address-error" class="g-address-group-feedback" role="alert">街道地址不能为空。</small></GAddressGroup>
        <GAddressGroup :variant="['stacked', 'block']" state="disabled" disabled><legend class="g-address-group-legend">同步地址</legend><div class="g-address-field g-address-line-1"><label for="address-group-pattern-10">街道地址</label><input id="address-group-pattern-10" class="g-input" value="来自企业通讯录" disabled /></div><small class="g-address-group-help">此地址由管理员维护。</small></GAddressGroup>
      </div>
    </section>

    <aside class="address-group-guidance"><strong>不要为所有国家强制同一地址结构</strong><span>先确定国家或地区，再展示当地需要的行政层级；保留足够长的输入空间，并让用户看到最终格式化结果。</span></aside>
    <footer class="component-doc__meta"><span><b>格式</b><code>domestic</code><code>international</code></span><span><b>字段</b><code>address-level1</code><code>postal-code</code></span><span><b>浏览器</b><code>autocomplete</code></span><span><b>语义</b><code>fieldset</code><code>legend</code></span></footer>
  </article>
</template>

<style>
.address-group-documentation .address-group-toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-block-end: 14px; }
.address-group-documentation .address-group-live { display: grid; max-inline-size: 64rem; gap: 18px; }
.address-group-documentation .address-group-live > .g-btn { justify-self: start; }
.address-group-documentation .address-group-patterns, .address-group-documentation .address-group-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 28px; }
.address-group-documentation .address-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.address-group-documentation .address-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .address-group-documentation .address-group-patterns, .address-group-documentation .address-group-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};