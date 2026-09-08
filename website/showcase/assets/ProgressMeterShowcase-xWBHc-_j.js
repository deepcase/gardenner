var e=`<script setup lang="ts">
import { ref } from "vue";
import { GButton, GProgressMeter } from "@gardenerim/vue";

const dynamicValue = ref(45);
const progressStyle = (value: number, extra: Record<string, string> = {}) => ({
  "--g-progress-value": \`\${value}%\`,
  ...extra,
});
const dashboardStyle = (value: number) => progressStyle(value, {
  "--g-progress-dashboard-value": \`\${value * 0.75}%\`,
});
const decrease = () => { dynamicValue.value = Math.max(0, dynamicValue.value - 10); };
const increase = () => { dynamicValue.value = Math.min(100, dynamicValue.value + 10); };
<\/script>

<template>
  <article id="component-progress-meter" class="component-doc progress-documentation">
    <header class="component-doc__header">
      <div>
        <h2>进度与度量 <span>Progress / Meter / GProgressMeter</span></h2>
        <p>Progress 表达任务完成过程，Meter 表达已知范围内的当前测量值。支持线形、圆形、仪表盘、分段、缓冲、动态状态与语义化读数。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>基本进度</h3>
      <p>进度条默认占满容器宽度。通过 <code>config.feedbackValue / feedbackMin / feedbackMax</code> 同步显示与 ARIA；下方保留手工样式写法，分类顶部可直接调整五框架共用参数。</p>
      <div class="usage-preview usage-preview--block">
        <div class="progress-demo-stack">
          <div v-for="item in [0, 35, 68, 100]" :key="item" class="progress-demo-item">
            <div class="g-progress-label"><span>{{ item === 100 ? "同步完成" : "正在同步" }}</span><span class="g-progress-value">{{ item }}%</span></div>
            <GProgressMeter variant="line" :state="item === 100 ? 'success' : 'determinate'" role="progressbar" aria-label="同步进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="item" :style="progressStyle(item)">
              <span class="g-progress-bar" />
            </GProgressMeter>
          </div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态与反馈</h3>
      <p><code>active</code> 表示持续推进，成功、警告、错误和暂停使用稳定的语义色；颜色不是唯一信息，标签中同步给出状态。</p>
      <div class="usage-preview usage-preview--block">
        <div class="progress-demo-stack">
          <div class="progress-demo-item"><div class="g-progress-label"><span>处理中</span><span class="g-progress-value">52%</span></div><GProgressMeter state="active" role="progressbar" aria-label="处理中" aria-valuemin="0" aria-valuemax="100" aria-valuenow="52" :style="progressStyle(52)"><span class="g-progress-bar" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>上传成功</span><span class="g-progress-value">100%</span></div><GProgressMeter state="success" role="progressbar" aria-label="上传成功" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" :style="progressStyle(100)"><span class="g-progress-bar" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>空间即将不足</span><span class="g-progress-value">84%</span></div><GProgressMeter state="warning" role="progressbar" aria-label="空间即将不足" aria-valuemin="0" aria-valuemax="100" aria-valuenow="84" :style="progressStyle(84)"><span class="g-progress-bar" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>处理失败</span><span class="g-progress-value">63%</span></div><GProgressMeter state="error" role="progressbar" aria-label="处理失败" aria-valuemin="0" aria-valuemax="100" aria-valuenow="63" :style="progressStyle(63)"><span class="g-progress-bar" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>已暂停</span><span class="g-progress-value">41%</span></div><GProgressMeter state="paused" role="progressbar" aria-label="已暂停" aria-valuemin="0" aria-valuemax="100" aria-valuenow="41" :style="progressStyle(41)"><span class="g-progress-bar" /></GProgressMeter></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>尺寸、端点与内部文字</h3>
      <p><code>small / medium / large</code> 线高按 Arco 为 3 / 4 / 8px，<code>mini</code> 2px 是扩展；<code>square</code> 提供直角端点，较高的进度条可将文字放在内部。</p>
      <div class="usage-preview usage-preview--block">
        <div class="progress-demo-stack">
          <div v-for="size in ['mini', 'small', 'medium', 'large']" :key="size" class="progress-demo-item progress-size-row"><span>{{ size }}</span><GProgressMeter :variant="size" role="progressbar" :aria-label="\`\${size} 尺寸\`" aria-valuemin="0" aria-valuemax="100" aria-valuenow="64" :style="progressStyle(64)"><span class="g-progress-bar" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>直角端点</span><span>square</span></div><GProgressMeter variant="square" role="progressbar" aria-label="直角端点进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="58" :style="progressStyle(58)"><span class="g-progress-bar" /></GProgressMeter></div>
          <GProgressMeter :variant="['inside', 'large']" role="progressbar" aria-label="文件优化" aria-valuemin="0" aria-valuemax="100" aria-valuenow="76" :style="progressStyle(76)"><span class="g-progress-bar" /><span class="g-progress-text">已优化 76%</span></GProgressMeter>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>缓冲、成功区间与分段</h3>
      <p>媒体加载可同时显示已播放与已缓冲进度；批处理可保留成功区间；离散流程使用分段进度，而不是伪装成连续百分比。</p>
      <div class="usage-preview usage-preview--block">
        <div class="progress-demo-stack">
          <div class="progress-demo-item"><div class="g-progress-label"><span>视频加载</span><span>播放 46% · 缓冲 78%</span></div><GProgressMeter variant="buffered" role="progressbar" aria-label="视频播放进度，已缓冲到百分之七十八" aria-valuemin="0" aria-valuemax="100" aria-valuenow="46" :style="progressStyle(46, {'--g-progress-buffer-value':'78%'})"><span class="g-progress-buffer" /><span class="g-progress-bar" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>批量导入</span><span>已完成 68%，成功 32%</span></div><GProgressMeter variant="with-success" role="progressbar" aria-label="批量导入，成功三十二，已处理六十八" aria-valuemin="0" aria-valuemax="100" aria-valuenow="68" :style="progressStyle(68, {'--g-progress-success-value':'32%'})"><span class="g-progress-bar" /><span class="g-progress-success" /></GProgressMeter></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>部署阶段</span><span>3 / 5</span></div><GProgressMeter variant="steps" role="progressbar" aria-label="部署阶段" aria-valuemin="0" aria-valuemax="5" aria-valuenow="3"><span v-for="step in 5" :key="step" class="g-progress-step" :class="step < 3 ? 'is-complete' : step === 3 ? 'is-active' : ''" /></GProgressMeter></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>圆形与仪表盘</h3>
      <p>圆形进度适合独立任务或紧凑卡片，仪表盘适合强调单一指标；尺寸和状态可组合。</p>
      <div class="usage-preview">
        <div class="progress-radial-grid">
          <div><GProgressMeter :variant="['circle', 'small']" role="progressbar" aria-label="下载进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="28" :style="progressStyle(28)"><span class="g-progress-text">28%</span></GProgressMeter><span>small</span></div>
          <div><GProgressMeter variant="circle" state="active" role="progressbar" aria-label="构建进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="68" :style="progressStyle(68)"><span class="g-progress-text">68%<small>构建中</small></span></GProgressMeter><span>circle</span></div>
          <div><GProgressMeter :variant="['circle', 'large']" state="success" role="progressbar" aria-label="任务完成" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" :style="progressStyle(100)"><span class="g-progress-text" aria-hidden="true">✓<small>已完成</small></span></GProgressMeter><span>success</span></div>
          <div><GProgressMeter variant="dashboard" state="warning" role="progressbar" aria-label="CPU 使用率" aria-valuemin="0" aria-valuemax="100" aria-valuenow="74" :style="dashboardStyle(74)"><span class="g-progress-text">74%<small>CPU</small></span></GProgressMeter><span>dashboard</span></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>动态与未知进度</h3>
      <p>可量化任务更新 <code>aria-valuenow</code>；无法估算时使用不确定态并省略该属性，配合 <code>aria-busy</code>。</p>
      <div class="usage-preview usage-preview--block">
        <div class="progress-demo-stack">
          <div class="progress-demo-item"><div class="g-progress-label"><span>动态示例</span><span class="g-progress-value">{{ dynamicValue }}%</span></div><GProgressMeter :variant="['striped', 'animated']" state="active" role="progressbar" aria-label="动态进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="dynamicValue" :style="progressStyle(dynamicValue)"><span class="g-progress-bar" /></GProgressMeter><div class="progress-controls"><GButton :variant="['outline', 'small']" aria-label="减少百分之十" @click="decrease">−10</GButton><GButton :variant="['primary', 'small']" aria-label="增加百分之十" @click="increase">+10</GButton></div></div>
          <div class="progress-demo-item"><div class="g-progress-label"><span>正在连接服务</span><span>耗时未知</span></div><GProgressMeter state="indeterminate" role="progressbar" aria-label="正在连接服务" aria-busy="true"><span class="g-progress-bar" /></GProgressMeter></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>Meter 度量与阈值</h3>
      <p>容量、配额和健康分等已知范围的读数使用 <code>role="meter"</code>。分段与阈值标记帮助理解构成和风险线。</p>
      <div class="usage-preview usage-preview--block">
        <div class="progress-demo-stack">
          <div class="progress-demo-item"><div class="g-progress-label"><span>团队存储</span><span>72 GB / 100 GB</span></div><GProgressMeter variant="meter" role="meter" aria-label="团队存储" aria-valuemin="0" aria-valuemax="100" aria-valuenow="72" aria-valuetext="已使用 72 GB，共 100 GB"><span class="g-meter-segment" style="--g-meter-value:38%;--g-meter-color:var(--g-color-primary)" /><span class="g-meter-segment" style="--g-meter-value:21%;--g-meter-color:var(--g-color-info)" /><span class="g-meter-segment" style="--g-meter-value:13%;--g-meter-color:var(--g-color-warning)" /><span class="g-meter-marker" style="--g-meter-marker:85%" /></GProgressMeter><div class="meter-legend"><span><i class="is-primary" />文档 38 GB</span><span><i class="is-info" />媒体 21 GB</span><span><i class="is-warning" />其他 13 GB</span><span>阈值 85%</span></div></div>
        </div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>类型</b><code>line</code><code>circle</code><code>dashboard</code><code>steps</code><code>meter</code></span>
      <span><b>能力</b><code>buffered</code><code>with-success</code><code>inside</code><code>striped</code><code>animated</code></span>
      <span><b>状态</b><code>active</code><code>indeterminate</code><code>success</code><code>warning</code><code>error</code><code>paused</code></span>
      <span><b>语义</b><code>role="progressbar"</code><code>role="meter"</code><code>aria-valuenow</code><code>aria-valuetext</code></span>
    </footer>
  </article>
</template>
`;export{e as default};