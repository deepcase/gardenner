var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GCharacterCounter } from "@gardenerim/vue";

type CountMode = "count" | "remaining";
type CountDetail = { count: number; maximum: number; remaining: number | null; nearLimit: boolean; atLimit: boolean; overLimit: boolean };

const limit = ref(80);
const mode = ref<CountMode>("count");
const hardLimit = ref(false);
const detail = ref<CountDetail>({ count: 24, maximum: 80, remaining: 56, nearLimit: false, atLimit: false, overLimit: false });

const counterState = computed(() => detail.value.overLimit ? "over-limit" : detail.value.atLimit ? "at-limit" : detail.value.nearLimit ? "near-limit" : detail.value.count === 0 ? "empty" : "default");
const feedback = computed(() => {
  if (detail.value.overLimit) return \`已超出 \${Math.abs(detail.value.remaining ?? 0)} 个字符，请精简内容。\`;
  if (detail.value.atLimit) return hardLimit.value ? "已达到上限，继续输入将被截断。" : "已达到建议上限。";
  if (detail.value.nearLimit) return \`接近上限，还可输入 \${detail.value.remaining} 个字符。\`;
  return "支持 Emoji 和组合字符，按用户看到的字符数量计数。";
});

const onCount = (event: Event) => {
  detail.value = (event as CustomEvent<CountDetail>).detail;
};
<\/script>

<template>
  <article id="component-character-counter" class="component-doc character-counter-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / TEXT LIMITS</span>
        <h2>字符计数器 <span>Character Counter / GCharacterCounter</span></h2>
        <p>按可见字符计算输入长度，提供计数、剩余数量、预警、软限制和硬限制反馈。</p>
      </div>
      <span class="component-status">runtime-ready · grapheme aware</span>
    </header>

    <section class="usage-section">
      <h3>动态上限与计数模式</h3>
      <p>修改上限或模式会立即同步；家庭 Emoji 等组合字符按一个可见字符计算。</p>
      <div class="character-counter-toolbar" role="group" aria-label="字符计数器设置">
        <span>模式</span><button v-for="item in (['count', 'remaining'] as CountMode[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="mode === item" @click="mode = item">{{ item === 'count' ? '已输入' : '剩余' }}</button>
        <span>上限</span><button v-for="item in [40, 80, 120]" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="limit === item" @click="limit = item">{{ item }}</button>
        <span>限制</span><button class="g-btn g-btn-outline" type="button" :aria-pressed="hardLimit" @click="hardLimit = !hardLimit">{{ hardLimit ? '硬限制' : '软限制' }}</button>
      </div>

      <div class="usage-preview usage-preview--block character-counter-primary-preview">
        <GCharacterCounter
          :variant="['textarea', mode, hardLimit ? 'hard-limit' : 'soft-limit', 'block']"
          :state="counterState"
          :data-g-character-count="limit"
          data-g-character-warning="0.8"
          :data-g-character-mode="mode"
          :data-g-character-hard-limit="hardLimit ? '' : undefined"
          aria-describedby="profile-bio-help profile-bio-count-message"
          @gardener:count="onCount"
        >
          <label class="g-character-field-label" for="character-counter-bio">个人简介</label>
          <div class="g-character-field-control">
            <textarea id="character-counter-bio" class="g-textarea g-textarea-outlined g-character-field-input" rows="5">用简洁的文字介绍你的工作。👨‍👩‍👧‍👦</textarea>
            <output id="profile-bio-count" class="g-character-count" aria-live="polite" aria-atomic="true">24 / 80</output>
          </div>
          <small v-if="detail.overLimit" id="profile-bio-count-message" class="g-character-field-feedback" role="alert">{{ feedback }}</small>
          <small v-else id="profile-bio-count-message" class="g-character-field-status" role="status">{{ feedback }}</small>
          <small id="profile-bio-help" class="g-character-field-help">建议突出职责和专长，不要堆砌关键词。</small>
        </GCharacterCounter>
        <dl class="character-counter-readout">
          <div><dt>可见字符</dt><dd>{{ detail.count }}</dd></div><div><dt>最大值</dt><dd>{{ detail.maximum }}</dd></div><div><dt>剩余</dt><dd>{{ detail.remaining ?? '不限' }}</dd></div>
        </dl>
      </div>
    </section>

    <section class="usage-section">
      <h3>输入框、行内与只读模式</h3>
      <p>单行输入可以将计数放在尾部；只读和禁用状态仍显示长度，但不会暗示可编辑。</p>
      <div class="usage-preview usage-preview--block character-counter-patterns">
        <div><b>单行标题</b><GCharacterCounter :variant="['input', 'count', 'block']" data-g-character-count="30"><div class="g-character-field-control"><input class="g-input g-input-outlined" value="Gardenerim 组件设计规范" aria-label="文档标题" /><output class="g-character-count" aria-live="polite" /></div></GCharacterCounter></div>
        <div><b>剩余字数</b><GCharacterCounter :variant="['textarea', 'remaining', 'block']" data-g-character-count="60" data-g-character-mode="remaining"><div class="g-character-field-control"><textarea class="g-textarea g-textarea-filled" rows="3" aria-label="发布说明">修复表单布局并完善键盘操作。</textarea><output class="g-character-count" aria-live="polite" /></div></GCharacterCounter></div>
        <div><b>行内计数</b><GCharacterCounter :variant="['input', 'inline', 'count', 'block']" data-g-character-count="20"><input class="g-input g-input-outlined" value="release-2.1" aria-label="版本标签" /><output class="g-character-count" aria-live="polite" /></GCharacterCounter></div>
        <div><b>只读摘要</b><GCharacterCounter :variant="['textarea', 'count', 'block']" state="read-only" data-g-character-count="100" data-g-form-read-only="true"><div class="g-character-field-control"><textarea class="g-textarea" rows="3" readonly aria-label="只读摘要">该内容来自已发布版本，仅供查阅。</textarea><output class="g-character-count" aria-live="off" /></div></GCharacterCounter></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>软限制与硬限制</h3>
      <div class="usage-preview usage-preview--block character-counter-limits">
        <div><strong>软限制</strong><p>允许超过建议长度，并通过错误色和反馈提示用户精简，适合草稿编辑。</p></div>
        <div><strong>硬限制</strong><p>按可见字符截断超出的输入，适合后端存在严格字段长度约束的场景。</p></div>
        <div><strong>原生上限</strong><p>也支持读取输入元素的 <code>maxlength</code>；运行时上限变化会立即重新计算。</p></div>
      </div>
    </section>

    <aside class="character-counter-guidance"><strong>不要把 UTF-16 长度展示给用户</strong><span>计数器使用 grapheme cluster 统计，Emoji、变音符和组合字符按视觉字符计算；事件同时提供 count、remaining、atLimit 和 overLimit。</span></aside>

    <footer class="component-doc__meta">
      <span><b>模式</b><code>count</code><code>remaining</code><code>soft-limit</code><code>hard-limit</code></span>
      <span><b>状态</b><code>near-limit</code><code>at-limit</code><code>over-limit</code></span>
      <span><b>运行时</b><code>Unicode grapheme</code><code>dynamic limit</code><code>gardener:count</code></span>
      <span><b>无障碍</b><code>output</code><code>aria-live</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>

<style>
.character-counter-documentation .character-counter-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.character-counter-documentation .character-counter-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.character-counter-documentation .character-counter-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.character-counter-documentation .character-counter-primary-preview { display: grid; max-inline-size: 52rem; grid-template-columns: minmax(0, 1fr) 10rem; align-items: start; gap: 24px; }
.character-counter-documentation .character-counter-readout { display: grid; gap: 0; margin: 1.45rem 0 0; border: 1px solid var(--g-color-border); border-radius: var(--g-radius-md); background: var(--g-color-surface-subtle); }
.character-counter-documentation .character-counter-readout div { display: flex; justify-content: space-between; gap: 12px; padding: 8px 10px; border-block-end: 1px solid var(--g-color-border); }
.character-counter-documentation .character-counter-readout div:last-child { border: 0; }
.character-counter-documentation .character-counter-readout dt { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.character-counter-documentation .character-counter-readout dd { margin: 0; font-weight: 700; font-variant-numeric: tabular-nums; }
.character-counter-documentation .character-counter-patterns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 34px; align-items: start; }
.character-counter-documentation .character-counter-patterns > div { display: grid; min-inline-size: 0; gap: 9px; }
.character-counter-documentation .character-counter-patterns b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.character-counter-documentation .character-counter-limits { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1px; overflow: hidden; padding: 1px; background: var(--g-color-border); }
.character-counter-documentation .character-counter-limits > div { padding: 18px; background: var(--g-color-surface); }
.character-counter-documentation .character-counter-limits p { margin-block: 7px 0; color: var(--g-color-text-muted); font-size: var(--g-font-size-sm); line-height: 1.6; }
.character-counter-documentation .character-counter-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.character-counter-documentation .character-counter-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .character-counter-documentation .character-counter-toolbar > span:not(:first-child) { inline-size: 100%; margin-block-start: 4px; } .character-counter-documentation .character-counter-primary-preview, .character-counter-documentation .character-counter-patterns, .character-counter-documentation .character-counter-limits { grid-template-columns: 1fr; } .character-counter-documentation .character-counter-readout { margin-block-start: 0; } }
</style>
`;export{e as default};