var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GInput, GInputAffix } from "@gardenerim/vue";

type AffixSize = "mini" | "small" | "medium" | "large";
type Appearance = "filled" | "outlined" | "borderless" | "underlined";

const size = ref<AffixSize>("medium");
const appearance = ref<Appearance>("outlined");
const handle = ref("gardener");
const checking = ref(false);
const checked = ref(false);
const copied = ref(false);

const invalid = computed(() => checked.value && !/^[a-z0-9](?:[a-z0-9-]{1,18}[a-z0-9])?$/.test(handle.value));
const mainState = computed(() => checking.value ? "loading" : invalid.value ? "error" : checked.value ? "success" : "default");
const mainVariants = computed(() => [appearance.value, size.value, "prefix", "suffix", "clearable", "block"]);

const updateHandle = (event: Event) => {
  handle.value = (event.target as HTMLInputElement).value;
  checked.value = false;
};

const clearHandle = () => {
  handle.value = "";
  checked.value = false;
  window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>("#input-affix-handle")?.focus());
};

const checkHandle = () => {
  if (checking.value) return;
  checked.value = false;
  checking.value = true;
  window.setTimeout(() => {
    checking.value = false;
    checked.value = true;
  }, 450);
};

const copyUrl = async () => {
  try {
    await navigator.clipboard?.writeText("https://gardener.im/docs");
  } catch {
    // The visual acknowledgement remains useful in restricted preview contexts.
  }
  copied.value = true;
  window.setTimeout(() => { copied.value = false; }, 1200);
};
<\/script>

<template>
  <article id="component-input-affix" class="component-doc input-affix-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / INPUT COMPOSITION</span>
        <h2>输入框前后缀 <span>Input Affix / GInputAffix</span></h2>
        <p>在同一输入边界中放置图标、单位、固定文本或轻量操作，并保持完整的输入语义与状态反馈。</p>
      </div>
      <span class="component-status">css-ready · semantic affixes</span>
    </header>

    <section class="usage-section">
      <h3>外观、尺寸和异步校验</h3>
      <p>前后缀不会挤压输入焦点区；容器统一承担悬停、焦点、校验和加载状态。</p>
      <div class="input-affix-toolbar" role="group" aria-label="输入框前后缀设置">
        <span>尺寸</span><button v-for="item in (['mini', 'small', 'medium', 'large'] as AffixSize[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="size === item" @click="size = item">{{ item }}</button>
        <span>外观</span><button v-for="item in (['filled', 'outlined', 'borderless', 'underlined'] as Appearance[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="appearance === item" @click="appearance = item">{{ item }}</button>
      </div>

      <div class="usage-preview usage-preview--block input-affix-primary-preview">
        <GInputAffix :variant="mainVariants" :state="mainState" role="group" aria-labelledby="handle-label" aria-describedby="handle-message" :aria-invalid="invalid" :aria-busy="checking">
          <label id="handle-label" class="g-input-affix-label" for="input-affix-handle">团队地址</label>
          <div class="g-input-affix-control">
            <span class="g-input-affix-start" aria-hidden="true">@</span>
            <GInput id="input-affix-handle" :value="handle" autocomplete="off" placeholder="team-name" @input="updateHandle" @keyup.enter="checkHandle" />
            <span class="g-input-affix-end" aria-hidden="true">.design</span>
            <button v-if="handle && !checking" class="g-input-affix-action" type="button" aria-label="清空团队地址" title="清空" @click="clearHandle">×</button>
            <span v-if="checking" class="g-input-spinner" aria-hidden="true" />
          </div>
          <small v-if="checking" id="handle-message" class="g-input-affix-status" role="status">正在检查地址…</small>
          <small v-else-if="invalid" id="handle-message" class="g-input-affix-feedback" role="alert">请输入 3–20 位小写字母、数字或中间连字符。</small>
          <small v-else-if="checked" id="handle-message" class="g-input-affix-status" role="status">@{{ handle }}.design 可以使用。</small>
          <small v-else id="handle-message" class="g-input-affix-help">按 Enter 或点击按钮检查地址；前后缀仅提供上下文，不进入输入值。</small>
        </GInputAffix>
        <button class="g-btn g-btn-primary input-affix-check" type="button" :disabled="checking" @click="checkHandle">{{ checking ? '检查中' : '检查可用性' }}</button>
      </div>
    </section>

    <section class="usage-section">
      <h3>常见前后缀模式</h3>
      <p>静态内容使用文本或图标；产生操作的后缀必须使用可聚焦按钮，并提供可读名称。</p>
      <div class="usage-preview usage-preview--block input-affix-patterns">
        <label><b>搜索</b><GInputAffix :variant="['filled', 'prefix', 'suffix', 'block']"><span class="g-input-prefix" aria-hidden="true">⌕</span><GInput type="search" value="组件规范" aria-label="搜索关键词" /><kbd class="g-input-suffix" aria-hidden="true">⌘ K</kbd></GInputAffix></label>
        <label><b>金额</b><GInputAffix :variant="['outlined', 'prefix', 'suffix', 'block']"><span class="g-input-affix-start" aria-hidden="true">¥</span><GInput inputmode="decimal" value="12,800.00" aria-label="预算金额" /><span class="g-input-affix-end" aria-hidden="true">CNY</span></GInputAffix></label>
        <label><b>文档链接</b><GInputAffix :variant="['outlined', 'prefix', 'suffix', 'block']"><span class="g-input-prefix" aria-hidden="true">↗</span><GInput value="gardener.im/docs" readonly aria-label="文档链接" /><button class="g-input-affix-action" type="button" :aria-label="copied ? '链接已复制' : '复制文档链接'" @click="copyUrl">{{ copied ? '✓' : '⧉' }}</button></GInputAffix></label>
        <label><b>邮箱</b><GInputAffix :variant="['underlined', 'suffix', 'block']"><GInput value="design-system" aria-label="企业邮箱账户" /><span class="g-input-suffix" aria-hidden="true">@gardener.im</span></GInputAffix></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态与只读语义</h3>
      <p>状态放在整个组合上，输入仍保留原生 <code>disabled</code>、<code>readonly</code> 和描述关联。</p>
      <div class="usage-preview usage-preview--block input-affix-states">
        <label><b>成功</b><GInputAffix :variant="['outlined', 'suffix', 'block']" state="success"><GInput value="verified" aria-label="已验证账户" /><span class="g-input-suffix" aria-hidden="true">✓</span></GInputAffix></label>
        <label><b>警告</b><GInputAffix :variant="['outlined', 'prefix', 'block']" state="warning"><span class="g-input-prefix" aria-hidden="true">!</span><GInput value="即将到期" aria-label="即将到期的值" /></GInputAffix></label>
        <label><b>只读</b><GInputAffix :variant="['filled', 'prefix', 'block']" state="read-only" data-g-form-read-only="true"><span class="g-input-prefix" aria-hidden="true">ID</span><GInput value="GRD-2048" readonly aria-label="只读编号" /></GInputAffix></label>
        <label><b>禁用</b><GInputAffix :variant="['outlined', 'suffix', 'block']" state="disabled" aria-disabled="true"><GInput value="不可编辑" disabled aria-label="禁用值" /><span class="g-input-suffix" aria-hidden="true">锁定</span></GInputAffix></label>
      </div>
    </section>

    <aside class="input-affix-guidance"><strong>前后缀不是标签</strong><span>货币符号、单位和图标可以放入边界内，但每个输入仍需可见标签或 <code>aria-label</code>；带动作的后缀必须使用按钮。</span></aside>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>尺寸</b><code>mini</code><code>small</code><code>medium</code><code>large</code></span>
      <span><b>结构</b><code>start</code><code>input</code><code>end</code><code>action</code><code>feedback</code></span>
      <span><b>无障碍</b><code>aria-describedby</code><code>aria-invalid</code><code>aria-busy</code></span>
    </footer>
  </article>
</template>

<style>
.input-affix-documentation .input-affix-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.input-affix-documentation .input-affix-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.input-affix-documentation .input-affix-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.input-affix-documentation .input-affix-primary-preview { display: grid; max-inline-size: 46rem; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 12px; }
.input-affix-documentation .input-affix-check { margin-block-end: 1.35rem; white-space: nowrap; }
.input-affix-documentation .input-affix-patterns, .input-affix-documentation .input-affix-states { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 34px; }
.input-affix-documentation :is(.input-affix-patterns, .input-affix-states) > label { display: grid; min-inline-size: 0; gap: 9px; }
.input-affix-documentation :is(.input-affix-patterns, .input-affix-states) b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.input-affix-documentation .g-input-suffix:is(kbd) { padding: 3px 6px; border: 1px solid var(--g-color-border); border-radius: var(--g-radius-sm); background: var(--g-color-surface); font: inherit; font-size: var(--g-font-size-xs); }
.input-affix-documentation .input-affix-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.input-affix-documentation .input-affix-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .input-affix-documentation .input-affix-toolbar > span:not(:first-child) { inline-size: 100%; margin-block-start: 4px; } .input-affix-documentation .input-affix-primary-preview, .input-affix-documentation .input-affix-patterns, .input-affix-documentation .input-affix-states { grid-template-columns: 1fr; } .input-affix-documentation .input-affix-check { justify-self: start; margin-block-end: 0; } }
</style>
`;export{e as default};