var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GCharacterCounter, GClearableField, GTextarea } from "@gardenerim/vue";

const clearableValue = ref("这段内容可以一键清空，清空后焦点仍保留在文本域。\\n支持继续输入。")
const limitedValue = ref("Gardenerim 的字数统计按 Unicode 字符计算。")
const softLimitValue = ref("超出建议长度时仍然允许继续输入，但会进入错误状态。")
const autoValue = ref("输入更多内容，文本域会在 2 到 5 行之间自动增长。")
const activeResize = ref<"none" | "vertical" | "horizontal" | "both">("vertical")
const hardLimit = 80
const softLimit = 28
const softCount = computed(() => Array.from(softLimitValue.value).length)
const softOverLimit = computed(() => softCount.value > softLimit)

const valueFrom = (event: Event) => (event.target as HTMLTextAreaElement).value
<\/script>

<template>
  <article id="component-textarea" class="component-doc textarea-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / TEXTAREA</span>
        <h2>文本域 <span>Textarea / GTextarea</span></h2>
        <p>面向多行内容采集，完整覆盖外观、校验、清空、字符限制、自动高度、缩放策略与原生可访问语义。</p>
      </div>
      <span class="component-status">css-ready + runtime</span>
    </header>

    <section class="usage-section">
      <h3>基本用法与外观</h3>
      <p>默认使用低干扰的填充输入面；在表单卡片、工具栏或轻量编辑场景中，可切换明确边界、无边界和下划线外观。</p>
      <div class="usage-preview usage-preview--block textarea-grid textarea-appearance-grid">
        <label class="g-field"><span class="g-label">默认 / Filled</span><GTextarea rows="3" placeholder="请输入详细说明" /></label>
        <label class="g-field"><span class="g-label">Outlined</span><GTextarea variant="outlined" rows="3" value="明确边界适合独立表单区域。" /></label>
        <label class="g-field"><span class="g-label">Borderless</span><GTextarea variant="borderless" rows="3" value="无边界适合嵌入已有容器。" /></label>
        <label class="g-field"><span class="g-label">Underlined</span><GTextarea variant="underlined" rows="3" value="下划线适合轻量编辑。" /></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>校验、禁用与只读</h3>
      <p>成功、警告和错误都由边框、背景与辅助文案共同表达；只读仍可选择复制，禁用则退出交互。</p>
      <div class="usage-preview usage-preview--block textarea-grid textarea-state-grid">
        <label class="g-field is-success"><span class="g-label">成功</span><GTextarea state="success" rows="3" value="内容完整，可以提交。" aria-describedby="textarea-success" /><small id="textarea-success" class="g-field-feedback">✓ 已通过内容校验</small></label>
        <label class="g-field is-warning"><span class="g-label">警告</span><GTextarea state="warning" rows="3" value="内容偏短，建议补充背景。" aria-describedby="textarea-warning" /><small id="textarea-warning" class="g-field-feedback">! 建议增加上下文</small></label>
        <label class="g-field is-error"><span class="g-label">错误</span><GTextarea state="error" rows="3" value="包含不支持的内容。" aria-invalid="true" aria-describedby="textarea-error" /><small id="textarea-error" class="g-field-feedback">× 请删除不支持的内容</small></label>
        <label class="g-field"><span class="g-label">只读</span><GTextarea rows="3" value="由系统生成，可选择和复制。" readonly /><small class="g-field-help">只读内容仍参与表单阅读顺序</small></label>
        <label class="g-field"><span class="g-label">禁用</span><GTextarea rows="3" value="当前权限不可编辑。" disabled /><small class="g-field-help">该字段暂不可用</small></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>可清空与字符限制</h3>
      <p>清空按钮可由键盘访问并在清空后保留焦点；字符计数按 Unicode 字符统计，支持原生硬限制和业务软限制。</p>
      <div class="usage-preview usage-preview--block textarea-grid textarea-counter-grid">
        <label class="g-field">
          <span class="g-label">一键清空</span>
          <GClearableField>
            <GTextarea v-model="clearableValue" rows="4" placeholder="输入内容后可清空" />
            <button class="g-clearable-field-action g-textarea-clear" type="button" data-g-clear-button aria-label="清空文本域">×</button>
          </GClearableField>
          <small class="g-field-help">按钮只在有内容且字段可编辑时显示</small>
        </label>
        <label class="g-field">
          <span class="g-label">硬限制 · 最多 {{ hardLimit }} 字</span>
          <GCharacterCounter :config="{ characterCount: hardLimit }">
            <GTextarea v-model="limitedValue" :maxlength="hardLimit" rows="4" aria-describedby="textarea-hard-limit" />
            <output class="g-character-count" aria-live="polite" />
          </GCharacterCounter>
          <small id="textarea-hard-limit" class="g-field-help">达到上限后原生阻止继续输入</small>
        </label>
        <label class="g-field" :class="{ 'is-error': softOverLimit }">
          <span class="g-label">软限制 · 建议 {{ softLimit }} 字</span>
          <div class="g-character-field">
            <GTextarea :value="softLimitValue" :state="softOverLimit ? 'error' : undefined" rows="4" :aria-invalid="softOverLimit" aria-describedby="textarea-soft-limit" @input="softLimitValue = valueFrom($event)" />
            <output class="g-character-count" :class="{ 'is-over-limit': softOverLimit }" aria-live="polite">{{ softCount }} / {{ softLimit }}</output>
          </div>
          <small id="textarea-soft-limit" class="g-field-feedback">{{ softOverLimit ? \`已超出 \${softCount - softLimit} 字，请精简内容\` : '可继续输入，超限时显示明确错误' }}</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>自动高度</h3>
      <p>开启 <code>autoResize</code> 后根据内容增长，并通过 <code>minRows</code> 与 <code>maxRows</code> 控制边界；达到最大高度后仅在文本域内部滚动。</p>
      <div class="usage-preview usage-preview--block textarea-auto-preview">
        <label class="g-field">
          <span class="g-label">2–5 行自动增长</span>
          <GTextarea v-model="autoValue" variant="auto-size" :config="{ autoResize: true, minRows: 2, maxRows: 5 }" rows="2" aria-describedby="textarea-auto-help" />
          <small id="textarea-auto-help" class="g-field-help">输入换行观察高度变化；最大 5 行</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>缩放策略与尺寸</h3>
      <p>业务可禁止缩放，或仅允许垂直、水平及双向缩放；四档密度用于不同信息量，默认仍推荐 Medium。</p>
      <div class="textarea-resize-switch" role="radiogroup" aria-label="文本域缩放策略">
        <button v-for="mode in (['none', 'vertical', 'horizontal', 'both'] as const)" :key="mode" type="button" role="radio" :aria-checked="activeResize === mode" :class="{ 'is-active': activeResize === mode }" @click="activeResize = mode">{{ mode }}</button>
      </div>
      <div class="usage-preview usage-preview--block textarea-resize-preview">
        <GTextarea :variant="\`resize-\${activeResize}\`" rows="3" :value="\`resize: \${activeResize}\`" aria-label="缩放策略预览" />
      </div>
      <div class="usage-preview usage-preview--block textarea-size-grid">
        <label class="g-field"><span class="g-label">Mini</span><GTextarea variant="mini" value="紧凑备注" /></label>
        <label class="g-field"><span class="g-label">Small</span><GTextarea variant="small" value="较短说明" /></label>
        <label class="g-field"><span class="g-label">Medium</span><GTextarea variant="medium" value="常规内容输入" /></label>
        <label class="g-field"><span class="g-label">Large</span><GTextarea variant="large" value="长篇内容编辑" /></label>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>能力</b><code>clearable</code><code>word-limit</code><code>auto-size</code><code>min/max rows</code></span>
      <span><b>状态</b><code>success</code><code>warning</code><code>error</code><code>disabled</code><code>read-only</code></span>
      <span><b>无障碍</b><code>label</code><code>aria-describedby</code><code>aria-invalid</code><code>live count</code></span>
    </footer>
  </article>
</template>
`;export{e as default};