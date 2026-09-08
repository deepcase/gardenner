var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GRangeColor } from "@gardenerim/vue";

const volume = ref(64);
const temperature = ref(24);
const capacity = ref(80);
const lower = ref(20);
const upper = ref(78);
const brandColor = ref("#18a66a");
const accentColor = ref("#2563eb");
const opacity = ref(72);
const palette = ["#18a66a", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#111827"];

const rangePercent = (value: number, min = 0, max = 100) => \`\${((value - min) / (max - min)) * 100}%\`;
const brandPreview = computed(() => \`color-mix(in srgb, \${brandColor.value} \${opacity.value}%, transparent)\`);

const updateLower = (event: Event) => {
  const input = event.target as HTMLInputElement;
  lower.value = Math.min(Number(input.value), upper.value - 5);
  input.value = String(lower.value);
};

const updateUpper = (event: Event) => {
  const input = event.target as HTMLInputElement;
  upper.value = Math.max(Number(input.value), lower.value + 5);
  input.value = String(upper.value);
};
<\/script>

<template>
  <article id="component-range-color" class="component-doc range-color-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / CONTINUOUS VALUE</span>
        <h2>范围与颜色 <span>Range &amp; Color / GRangeColor</span></h2>
        <p>基于原生 range 与 color 输入，覆盖连续值、离散刻度、双端范围、方向、颜色预设和组合业务场景。</p>
      </div>
      <span class="component-status">css-ready · native inputs</span>
    </header>

    <section class="usage-section">
      <h3>基本范围与实时数值</h3>
      <p>数值、轨道填充和辅助说明同步更新；键盘可使用方向键、Page Up/Down、Home 与 End 调整。</p>
      <div class="usage-preview usage-preview--block">
        <GRangeColor variant="range">
          <div class="g-range-field g-range-field-block">
            <div class="g-range-header">
              <label class="g-range-label" for="range-volume">通知音量</label>
              <output class="g-range-value" for="range-volume" aria-live="polite">{{ volume }}%</output>
            </div>
            <div class="g-range-control">
              <span class="g-range-limit">0</span>
              <input id="range-volume" v-model.number="volume" class="g-range" type="range" min="0" max="100" step="1" :style="{ '--g-range-percent': rangePercent(volume) }" aria-describedby="range-volume-help" />
              <span class="g-range-limit">100</span>
            </div>
            <small id="range-volume-help" class="g-range-description">调节新消息、评审和发布通知的默认音量。</small>
          </div>
        </GRangeColor>
      </div>
    </section>

    <section class="usage-section">
      <h3>尺寸、离散刻度与方向</h3>
      <p>四档尺寸与表单控件体系对齐；刻度用于有明确业务节点的离散值，垂直方向适合调音台和图像编辑器。</p>
      <div class="usage-preview usage-preview--block range-size-layout">
        <div class="range-size-stack">
          <GRangeColor v-for="size in ['mini', 'small', 'medium', 'large']" :key="size" :variant="['range', size]">
            <span class="range-size-label">{{ size }}</span>
            <input class="g-range" type="range" min="0" max="100" value="45" :style="{ '--g-range-percent': '45%' }" :aria-label="\`\${size} range\`" />
          </GRangeColor>
          <GRangeColor :variant="['range', 'show-stops']" style="--g-range-stop-gap: 20%">
            <div class="g-range-header"><label class="g-range-label" for="range-temp">环境温度</label><output class="g-range-value" for="range-temp">{{ temperature }}°C</output></div>
            <input id="range-temp" v-model.number="temperature" class="g-range g-range-show-stops" type="range" min="16" max="32" step="4" :style="{ '--g-range-percent': rangePercent(temperature, 16, 32), '--g-range-stop-gap': '25%' }" />
            <div class="g-range-marks" aria-hidden="true"><span class="g-range-mark">16°</span><span class="g-range-mark">20°</span><span class="g-range-mark">24°</span><span class="g-range-mark">28°</span><span class="g-range-mark">32°</span></div>
          </GRangeColor>
        </div>
        <GRangeColor :variant="['range', 'vertical']" class="range-vertical-demo">
          <label class="g-range-label" for="range-vertical">亮度</label>
          <input id="range-vertical" class="g-range g-range-vertical" type="range" min="0" max="100" value="68" style="--g-range-percent: 68%" aria-orientation="vertical" />
          <span class="g-range-value">68%</span>
        </GRangeColor>
      </div>
    </section>

    <section class="usage-section">
      <h3>双端范围与数值输入</h3>
      <p>两个原生滑块分别保留可访问名称；双端间距由业务逻辑约束，适合价格、日期跨度和性能阈值。</p>
      <div class="usage-preview usage-preview--block range-dual-grid">
        <GRangeColor :variant="['range', 'dual']">
          <div class="g-range-header"><span id="budget-range-label" class="g-range-label">预算区间</span><output class="g-range-value">¥{{ lower }}k – ¥{{ upper }}k</output></div>
          <div class="g-range-dual" :style="{ '--g-range-lower': \`\${lower}%\`, '--g-range-upper': \`\${upper}%\` }">
            <span class="g-range-dual-rail" aria-hidden="true" /><span class="g-range-dual-fill" aria-hidden="true" />
            <input class="g-range" type="range" min="0" max="100" :value="lower" aria-label="最低预算" aria-describedby="budget-range-label" @input="updateLower" />
            <input class="g-range" type="range" min="0" max="100" :value="upper" aria-label="最高预算" aria-describedby="budget-range-label" @input="updateUpper" />
          </div>
          <div class="g-range-marks" aria-hidden="true"><span>¥0k</span><span>¥50k</span><span>¥100k</span></div>
        </GRangeColor>
        <GRangeColor :variant="['range', 'with-input']" class="g-range-field g-range-field-with-input">
          <div class="g-range-header"><label class="g-range-label" for="range-capacity">存储告警阈值</label></div>
          <div class="g-range-control">
            <input id="range-capacity" v-model.number="capacity" class="g-range" type="range" min="0" max="100" :style="{ '--g-range-percent': rangePercent(capacity) }" aria-describedby="range-capacity-help" />
            <input v-model.number="capacity" class="g-input g-range-input" type="number" min="0" max="100" aria-label="存储告警阈值数值" />
          </div>
          <small id="range-capacity-help" class="g-range-description">达到该容量百分比时向管理员发送告警。</small>
        </GRangeColor>
      </div>
    </section>

    <section class="usage-section">
      <h3>颜色输入、尺寸与文本值</h3>
      <p>颜色块提供清晰边界和焦点反馈，旁边始终显示可复制、可核对的颜色文本，避免只靠色彩传达信息。</p>
      <div class="usage-preview usage-preview--block color-demo-grid">
        <GRangeColor :variant="['color', 'with-label']">
          <div class="g-color-field">
            <input id="brand-color" v-model="brandColor" class="g-color-input" type="color" aria-describedby="brand-color-help" />
            <span class="g-color-content"><label class="g-color-label" for="brand-color">品牌主色</label><small id="brand-color-help" class="g-color-description">用于主要操作、焦点和选中状态</small></span>
            <output class="g-color-value" for="brand-color">{{ brandColor }}</output>
          </div>
        </GRangeColor>
        <div class="color-size-row">
          <GRangeColor v-for="size in ['mini', 'small', 'medium', 'large']" :key="size" :variant="['color', size, size === 'large' ? 'circle' : 'block']">
            <label class="color-size-item"><span>{{ size }}</span><input class="g-color-input" type="color" :value="accentColor" :aria-label="\`\${size} color picker\`" /></label>
          </GRangeColor>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>预设色、禁用与校验</h3>
      <p>预设色用于品牌或图表调色板；选中状态同时使用对勾，错误状态提供可读说明。</p>
      <div class="usage-preview usage-preview--block color-state-grid">
        <GRangeColor :variant="['color', 'presets']">
          <span class="g-color-label">品牌预设色</span>
          <div class="g-color-presets" role="group" aria-label="品牌预设色">
            <button v-for="color in palette" :key="color" type="button" class="g-color-preset" :style="{ '--g-color-preset': color }" :aria-label="color" :aria-pressed="brandColor.toLowerCase() === color" @click="brandColor = color" />
          </div>
        </GRangeColor>
        <GRangeColor variant="color"><div class="g-color-field"><input class="g-color-input" type="color" value="#94a3b8" disabled aria-label="禁用颜色" /><span class="g-color-content"><strong class="g-color-label">继承组织主题</strong><small class="g-color-description">由组织管理员统一配置</small></span></div></GRangeColor>
        <GRangeColor variant="color" state="invalid" aria-invalid="true"><div class="g-color-field is-invalid" aria-invalid="true"><input class="g-color-input" type="color" value="#ef4444" aria-label="冲突颜色" aria-describedby="color-error" /><span class="g-color-content"><strong class="g-color-label">状态颜色</strong><small id="color-error" class="g-color-description">与危险操作颜色冲突，请重新选择</small></span></div></GRangeColor>
      </div>
    </section>

    <section class="usage-section">
      <h3>颜色与透明度组合</h3>
      <p>真实设计工具通常需要颜色与强度共同编辑；组合仍由两个原生输入组成，提交和键盘操作均不丢失。</p>
      <div class="usage-preview usage-preview--block color-opacity-card">
        <div class="color-opacity-preview" :style="{ '--range-color-preview': brandPreview }"><span>实时预览</span></div>
        <GRangeColor :variant="['color', 'with-label']"><div class="g-color-field"><input v-model="brandColor" class="g-color-input" type="color" aria-label="叠加颜色" /><span class="g-color-content"><strong class="g-color-label">叠加颜色</strong><small class="g-color-description">{{ brandColor.toUpperCase() }}</small></span></div></GRangeColor>
        <GRangeColor :variant="['range', 'with-value']"><div class="g-range-header"><label class="g-range-label" for="range-opacity">透明度</label><output class="g-range-value" for="range-opacity">{{ opacity }}%</output></div><input id="range-opacity" v-model.number="opacity" class="g-range" type="range" min="0" max="100" :style="{ '--g-range-percent': rangePercent(opacity) }" /></GRangeColor>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>范围</b><code>single</code><code>dual</code><code>marks</code><code>vertical</code><code>with-input</code></span>
      <span><b>颜色</b><code>native picker</code><code>sizes</code><code>presets</code><code>text value</code></span>
      <span><b>状态</b><code>hover</code><code>focus</code><code>disabled</code><code>invalid</code></span>
      <span><b>语义</b><code>input[type=range]</code><code>input[type=color]</code><code>output</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>

<style>
.range-color-documentation .range-size-layout { display: grid; grid-template-columns: minmax(0, 1fr) 9rem; gap: 48px; }
.range-color-documentation .range-size-stack { display: grid; gap: 18px; }
.range-color-documentation .range-size-stack > .g-range-color { grid-template-columns: 4rem minmax(0, 1fr); align-items: center; }
.range-color-documentation .range-size-stack > .g-range-color:last-child { grid-template-columns: 1fr; margin-block-start: 12px; }
.range-color-documentation .range-size-label,
.range-color-documentation .color-size-item > span { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); text-transform: capitalize; }
.range-color-documentation .range-vertical-demo { align-content: start; justify-self: center; }
.range-color-documentation .range-dual-grid,
.range-color-documentation .color-demo-grid,
.range-color-documentation .color-state-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; align-items: start; }
.range-color-documentation .color-size-row { display: flex; flex-wrap: wrap; align-items: end; gap: 24px; }
.range-color-documentation .color-size-item { display: grid; justify-items: center; gap: 8px; }
.range-color-documentation .color-state-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.range-color-documentation .color-opacity-card { display: grid; grid-template-columns: minmax(10rem, .7fr) minmax(12rem, 1fr) minmax(14rem, 1.5fr); align-items: center; gap: 28px; }
.range-color-documentation .color-opacity-preview { position: relative; display: grid; min-block-size: 8rem; place-items: center; isolation: isolate; border: 1px solid var(--g-color-border); border-radius: var(--g-radius-lg); background-color: var(--g-color-surface); background-image: linear-gradient(45deg, var(--g-color-surface-active) 25%, transparent 25%), linear-gradient(-45deg, var(--g-color-surface-active) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--g-color-surface-active) 75%), linear-gradient(-45deg, transparent 75%, var(--g-color-surface-active) 75%); background-size: 16px 16px; background-position: 0 0, 0 8px, 8px -8px, -8px 0; overflow: hidden; }
.range-color-documentation .color-opacity-preview::before { position: absolute; z-index: -1; inset: 0; background: var(--range-color-preview); content: ""; }
.range-color-documentation .color-opacity-preview span { padding: 5px 10px; border-radius: var(--g-radius-sm); background: rgb(255 255 255 / .82); color: #111827; font-size: var(--g-font-size-xs); font-weight: 700; backdrop-filter: blur(4px); }
@media (max-width: 760px) {
  .range-color-documentation .range-size-layout,
  .range-color-documentation .range-dual-grid,
  .range-color-documentation .color-demo-grid,
  .range-color-documentation .color-state-grid,
  .range-color-documentation .color-opacity-card { grid-template-columns: 1fr; }
  .range-color-documentation .range-vertical-demo { justify-self: start; }
}
@media (max-width: 480px) {
  .range-color-documentation .g-color-field { align-items: flex-start; flex-wrap: wrap; }
  .range-color-documentation .g-color-value { margin-inline-start: calc(var(--g-control-height-md) + var(--g-space-3)); }
  .range-color-documentation .g-range-control { gap: var(--g-space-2); }
}
</style>
`;export{e as default};