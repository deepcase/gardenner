var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GInput, GInputGroup } from "@gardenerim/vue";

type GroupSize = "mini" | "small" | "medium" | "large";
type GroupStyle = "joined" | "separated";
type Appearance = "filled" | "outlined" | "borderless";

const size = ref<GroupSize>("medium");
const composition = ref<GroupStyle>("joined");
const appearance = ref<Appearance>("outlined");
const domain = ref("gardener");
const suffix = ref(".dev");
const checking = ref(false);
const checked = ref(false);

const invalid = computed(() => checked.value && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(domain.value));
const mainState = computed(() => checking.value ? "loading" : invalid.value ? "error" : checked.value ? "success" : "default");
const variants = computed(() => [composition.value, size.value, appearance.value, "block"]);

const checkDomain = () => {
  if (checking.value) return;
  checked.value = false;
  checking.value = true;
  window.setTimeout(() => {
    checking.value = false;
    checked.value = true;
  }, 450);
};

const updateDomain = (event: Event) => {
  domain.value = (event.target as HTMLInputElement).value;
  checked.value = false;
};
<\/script>

<template>
  <article id="component-input-group" class="component-doc input-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / COMPOSED CONTROLS</span>
        <h2>输入组合 <span>Input Group / GInputGroup</span></h2>
        <p>把输入框、选择器、单位、前后置内容和操作按钮组织成一个连续且可访问的任务单元。</p>
      </div>
      <span class="component-status">css-ready · mixed controls</span>
    </header>

    <section class="usage-section">
      <h3>组合方式、尺寸和异步校验</h3>
      <p>连续模式共享边界，分离模式保留独立焦点轮廓；尺寸与外观会统一传播到组内全部控件。</p>
      <div class="input-group-toolbar" role="group" aria-label="输入组合设置">
        <span>组合</span><button v-for="item in (['joined', 'separated'] as GroupStyle[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="composition === item" @click="composition = item">{{ item === 'joined' ? '连续' : '分离' }}</button>
        <span>尺寸</span><button v-for="item in (['mini', 'small', 'medium', 'large'] as GroupSize[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="size === item" @click="size = item">{{ item }}</button>
        <span>外观</span><button v-for="item in (['filled', 'outlined', 'borderless'] as Appearance[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="appearance === item" @click="appearance = item">{{ item }}</button>
      </div>

      <div class="usage-preview usage-preview--block input-group-primary-preview">
        <GInputGroup :variant="variants" :state="mainState" role="group" aria-labelledby="domain-group-label" aria-describedby="domain-group-message" :aria-invalid="invalid" :aria-busy="checking">
          <label id="domain-group-label" class="g-input-group-label" for="input-group-domain">项目域名</label>
          <div class="g-input-group-control">
            <span class="g-input-prepend">https://</span>
            <GInput id="input-group-domain" :value="domain" placeholder="project-name" @input="updateDomain" @keyup.enter="checkDomain" />
            <select v-model="suffix" class="g-select" aria-label="域名后缀"><option>.dev</option><option>.app</option><option>.cn</option></select>
            <button class="g-input-search-button" type="button" :disabled="checking" @click="checkDomain">{{ checking ? '检查中' : '检查' }}</button>
          </div>
          <small v-if="checking" id="domain-group-message" class="g-input-group-status" role="status">正在验证域名可用性…</small>
          <small v-else-if="invalid" id="domain-group-message" class="g-input-group-feedback" role="alert">只能使用小写字母、数字和连字符。</small>
          <small v-else-if="checked" id="domain-group-message" class="g-input-group-status" role="status">{{ domain }}{{ suffix }} 可以使用。</small>
          <small v-else id="domain-group-message" class="g-input-group-help">按 Enter 或点击检查，验证域名可用性。</small>
        </GInputGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>常见业务组合</h3>
      <p>前后置内容只表达单位或上下文；需要操作时使用真实按钮，需要选择时使用原生选择器。</p>
      <div class="usage-preview usage-preview--block input-group-patterns">
        <div><b>电话号码</b><GInputGroup :variant="['joined', 'outlined', 'block']" role="group" aria-label="电话号码"><select class="g-select" aria-label="国家代码"><option>+86</option><option>+1</option><option>+81</option></select><GInput type="tel" value="138 0000 0000" aria-label="手机号码" /></GInputGroup></div>
        <div><b>金额与单位</b><GInputGroup :variant="['joined', 'filled', 'block']" role="group" aria-label="预算金额"><span class="g-input-prepend">¥</span><GInput inputmode="decimal" value="12,800" aria-label="金额" /><span class="g-input-append">CNY</span></GInputGroup></div>
        <div><b>日期区间</b><GInputGroup :variant="['separated', 'small', 'block']" role="group" aria-label="日期范围"><GInput type="date" value="2026-09-01" aria-label="开始日期" /><span class="g-input-group-divider" aria-hidden="true" /><GInput type="date" value="2026-09-30" aria-label="结束日期" /></GInputGroup></div>
        <div><b>只读路径</b><GInputGroup :variant="['joined', 'borderless', 'block']" state="read-only" role="group" data-g-form-read-only="true" aria-label="存储路径"><span class="g-input-prepend">/workspace/</span><GInput value="design-system" readonly aria-label="目录名称" /><span class="g-input-append">/dist</span></GInputGroup></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>窄容器和纵向回落</h3>
      <p><code>responsive</code> 根据可用空间允许每个控件完整换行；<code>stacked</code> 用于明确的纵向步骤。</p>
      <div class="usage-preview usage-preview--block input-group-responsive-grid">
        <div class="input-group-narrow"><b>responsive · 窄容器</b><GInputGroup :variant="['responsive', 'outlined', 'block']" role="search" aria-label="成员搜索"><select class="g-select" aria-label="搜索字段"><option>姓名</option><option>邮箱</option></select><GInput type="search" value="林园" aria-label="搜索词" /><button class="g-input-search-button" type="button">搜索</button></GInputGroup></div>
        <div><b>stacked · 纵向组合</b><GInputGroup :variant="['stacked', 'filled', 'block']" role="group" aria-label="版本坐标"><GInput value="@gardenerim/vue" aria-label="包名" /><GInput value="2.1.0" aria-label="版本" /><button class="g-btn g-btn-primary" type="button">添加依赖</button></GInputGroup></div>
      </div>
    </section>

    <aside class="input-group-guidance"><strong>一个组合只完成一个任务</strong><span>关联性弱的字段不要为了节省空间强行连接；错误与加载状态应挂在组级容器，同时让具体输入保留原生标签。</span></aside>

    <footer class="component-doc__meta">
      <span><b>组合</b><code>joined</code><code>separated</code><code>responsive</code><code>stacked</code></span>
      <span><b>尺寸</b><code>mini</code><code>small</code><code>medium</code><code>large</code></span>
      <span><b>结构</b><code>label</code><code>control</code><code>addon</code><code>feedback</code><code>status</code></span>
      <span><b>无障碍</b><code>group</code><code>search</code><code>aria-describedby</code><code>aria-busy</code></span>
    </footer>
  </article>
</template>

<style>
.input-group-documentation .input-group-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.input-group-documentation .input-group-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.input-group-documentation .input-group-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.input-group-documentation .input-group-primary-preview { max-inline-size: 52rem; }
.input-group-documentation .input-group-patterns, .input-group-documentation .input-group-responsive-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 34px; align-items: start; }
.input-group-documentation .input-group-patterns > div, .input-group-documentation .input-group-responsive-grid > div { display: grid; min-width: 0; gap: 10px; }
.input-group-documentation :is(.input-group-patterns, .input-group-responsive-grid) > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.input-group-documentation .input-group-narrow { inline-size: min(100%, 22rem); }
.input-group-documentation .input-group-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.input-group-documentation .input-group-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .input-group-documentation .input-group-toolbar > span:not(:first-child) { inline-size: 100%; margin-block-start: 4px; } .input-group-documentation .input-group-patterns, .input-group-documentation .input-group-responsive-grid { grid-template-columns: 1fr; } }
</style>
`;export{e as default};