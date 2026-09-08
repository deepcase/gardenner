var e=`<script setup lang="ts">
import { ref } from "vue";
import { GClearableField, GInput, GSelect, GTextarea } from "@gardenerim/vue";
import DemoIcon from "./DemoIcon.vue";

const basicValue = ref("Gardenerim 组件库")
const controlledValue = ref("可由父级完全控制")
const escapeValue = ref("按 Escape 清空")
const emailValue = ref("hello@gardener.im")
const notesValue = ref("清空能力同样适用于多行文本。\\n输入框会保留自己的调整尺寸能力。")
const statusValue = ref("published")
const lastEvent = ref("尚未触发清空事件")

const valueFrom = (event: Event) => (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value
const recordClear = (event: Event) => {
  const detail = (event as CustomEvent<{ previousValue?: unknown; reason?: string }>).detail
  lastEvent.value = \`reason=\${detail?.reason ?? "unknown"} · previous=\${String(detail?.previousValue ?? "") || "empty"}\`
}
<\/script>

<template>
  <article id="component-clearable-field" class="component-doc clearable-field-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / COMPOSITION</span>
        <h2>可清空字段 <span>Clearable Field / GClearableField</span></h2>
        <p>为输入框、文本域和选择框提供统一的清空入口，并保留原生输入语义、焦点和受控值同步。</p>
      </div>
      <span class="component-status">runtime-ready</span>
    </header>

    <section class="usage-section">
      <h3>基本用法</h3>
      <p>有值时显示清空按钮，清空后立即回到输入焦点，同时派发原生 input/change 与 gardener:clear 事件。</p>
      <div class="usage-preview usage-preview--block clearable-basic-grid">
        <div class="g-field">
          <label class="g-label" for="clearable-basic">搜索组件</label>
          <GClearableField @gardener:clear="recordClear">
            <span class="g-clearable-field-prefix" aria-hidden="true"><DemoIcon name="search" /></span>
            <GInput id="clearable-basic" v-model="basicValue" type="search" autocomplete="off" placeholder="输入关键词" />
            <button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button>
          </GClearableField>
          <small class="g-field-help">{{ basicValue ? \`当前值：\${basicValue}\` : '字段已清空，可以继续输入' }}</small>
        </div>
        <div class="clearable-event-card" aria-live="polite"><b>最近事件</b><code>{{ lastEvent }}</code></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>受控值与键盘清空</h3>
      <p>清空行为可与 v-model 双向同步；敏捷操作场景可以显式启用 Escape 清空，默认不会占用该按键。</p>
      <div class="usage-preview usage-preview--block clearable-control-grid">
        <div class="g-field">
          <label class="g-label" for="clearable-controlled">受控字段</label>
          <GClearableField variant="outlined" @gardener:clear="recordClear">
            <GInput id="clearable-controlled" :value="controlledValue" @input="controlledValue = valueFrom($event)" />
            <button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button>
          </GClearableField>
          <small class="g-field-help">父级状态：{{ controlledValue || '空值' }}</small>
        </div>
        <div class="g-field">
          <label class="g-label" for="clearable-escape">Escape 清空</label>
          <GClearableField variant="clear-on-escape" :config="{ clearOnEscape: 'true' }" @gardener:clear="recordClear">
            <GInput id="clearable-escape" v-model="escapeValue" />
            <button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button>
          </GClearableField>
          <small class="g-field-help">焦点位于字段时按 Escape</small>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观与尺寸</h3>
      <p>默认采用浅色填充，并提供明确边界、无边界和下划线外观；四档尺寸与 GInput 保持一致。</p>
      <div class="usage-preview usage-preview--block clearable-appearance-grid">
        <div v-for="appearance in (['filled', 'outlined', 'borderless', 'underlined'] as const)" :key="appearance" class="g-field">
          <span class="g-label">{{ appearance }}</span>
          <GClearableField :variant="appearance"><GInput :value="appearance" :aria-label="\`\${appearance} clearable field\`" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField>
        </div>
      </div>
      <div class="usage-preview usage-preview--block clearable-size-grid">
        <GClearableField v-for="size in (['mini', 'small', 'medium', 'large'] as const)" :key="size" :variant="size"><GInput :value="size" :aria-label="\`\${size} clearable field\`" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField>
      </div>
    </section>

    <section class="usage-section">
      <h3>不同字段类型</h3>
      <p>同一行为覆盖搜索、邮箱、文本域和原生选择框；文本域按钮固定在右上角，不挤压多行内容。</p>
      <div class="usage-preview usage-preview--block clearable-type-grid">
        <div class="g-field">
          <label class="g-label" for="clearable-email">邮箱</label>
          <GClearableField variant="outlined"><span class="g-clearable-field-prefix" aria-hidden="true"><DemoIcon name="mail" /></span><GInput id="clearable-email" v-model="emailValue" type="text" inputmode="email" name="clearable-email-demo" autocomplete="off" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField>
        </div>
        <div class="g-field">
          <label class="g-label" for="clearable-select">发布状态</label>
          <GClearableField :variant="['select', 'outlined']"><GSelect id="clearable-select" v-model="statusValue"><option value="">请选择状态</option><option value="draft">草稿</option><option value="published">已发布</option><option value="archived">已归档</option></GSelect><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField>
        </div>
        <div class="g-field clearable-textarea-field">
          <label class="g-label" for="clearable-notes">说明</label>
          <GClearableField :variant="['textarea', 'outlined']"><GTextarea id="clearable-notes" v-model="notesValue" rows="4" /><button class="g-clearable-field-action g-textarea-clear" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态与清空按钮策略</h3>
      <p>错误、成功、只读和禁用拥有独立语义；按钮可始终显示，也可仅在悬停或聚焦时出现。</p>
      <div class="usage-preview usage-preview--block clearable-state-grid">
        <div class="g-field is-success"><span class="g-label">成功</span><GClearableField state="success"><GInput value="名称可用" aria-label="Success clearable field" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField><small class="g-field-feedback">✓ 校验通过</small></div>
        <div class="g-field is-error"><span class="g-label">错误</span><GClearableField state="error" aria-invalid="true"><GInput value="名称重复" aria-label="Error clearable field" aria-describedby="clearable-error" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField><small id="clearable-error" class="g-field-feedback">× 该名称已存在</small></div>
        <div class="g-field"><span class="g-label">只读</span><GClearableField><GInput value="只读内容" aria-label="Readonly clearable field" readonly /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField><small class="g-field-help">保持可选择，但不能清空</small></div>
        <div class="g-field"><span class="g-label">禁用</span><GClearableField><GInput value="不可用" aria-label="Disabled clearable field" disabled /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField><small class="g-field-help">清空按钮同步禁用并隐藏</small></div>
        <div class="g-field"><span class="g-label">交互时显示</span><GClearableField variant="interaction"><GInput value="悬停或聚焦后显示" aria-label="Interaction clear action" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField><small class="g-field-help">减少高密度表格中的视觉噪声</small></div>
        <div class="g-field"><span class="g-label">始终显示</span><GClearableField variant="always-visible" :config="{ clearVisibility: 'always' }"><GInput value="" placeholder="空值时按钮禁用" aria-label="Always visible clear action" /><button class="g-clearable-field-action" type="button" data-g-clear-button><DemoIcon name="close" /></button></GClearableField><small class="g-field-help">适合需要稳定尾部占位的布局</small></div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>字段</b><code>input</code><code>textarea</code><code>select</code></span>
      <span><b>交互</b><code>clear</code><code>focus restore</code><code>Escape</code><code>v-model</code></span>
      <span><b>状态</b><code>empty</code><code>has-value</code><code>error</code><code>read-only</code><code>disabled</code></span>
    </footer>
  </article>
</template>
`;export{e as default};