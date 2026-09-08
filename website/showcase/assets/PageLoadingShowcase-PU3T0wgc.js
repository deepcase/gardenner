var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GButton, GPageLoading } from "@gardenerim/vue";

const progress = ref(42);
const taskState = ref<"determinate" | "paused" | "success" | "cancelled">("determinate");
const overlayVisible = ref(true);

const currentStep = computed(() => progress.value < 34 ? 1 : progress.value < 76 ? 2 : 3);
const taskTitle = computed(() => {
  if (taskState.value === "success") return "导入完成";
  if (taskState.value === "cancelled") return "已取消导入";
  if (taskState.value === "paused") return "导入已暂停";
  return "正在导入客户数据";
});

const advance = () => {
  if (taskState.value === "cancelled" || taskState.value === "success") {
    progress.value = 0;
    taskState.value = "determinate";
  }
  progress.value = Math.min(100, progress.value + 16);
  taskState.value = progress.value >= 100 ? "success" : "determinate";
};

const togglePause = () => {
  taskState.value = taskState.value === "paused" ? "determinate" : "paused";
};

const restart = () => {
  progress.value = 18;
  taskState.value = "determinate";
};
<\/script>

<template>
  <article id="component-page-loading" class="component-doc page-loading-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FEEDBACK / PAGE LOADING</span>
        <h2>页面加载 <span>Page Loading / GPageLoading</span></h2>
        <p>面向首次进入、整页切换和阻断式长任务的加载组合。短等待使用 Spinner，已知页面结构优先使用 Skeleton；只有页面暂时不可操作时才使用遮罩或全屏模式。</p>
      </div>
      <span class="component-status">css-ready</span>
    </header>

    <section class="usage-section">
      <h3>等待强度与尺寸</h3>
      <p>默认会自动生成加载指示器；短文案可内联，页面或卡片等待使用居中布局。尺寸改变的是视觉优先级，不应靠无限放大制造“更重要”的错觉。</p>
      <div class="usage-preview usage-preview--block page-loading-size-grid">
        <div>
          <code>inline + small</code>
          <GPageLoading :variant="['inline', 'small']" state="loading" role="status" aria-live="polite" aria-label="正在刷新列表">
            <div class="g-page-loading-content"><span class="g-page-loading-description">正在刷新列表…</span></div>
          </GPageLoading>
        </div>
        <div>
          <code>contained + medium</code>
          <GPageLoading :variant="['contained', 'medium', 'compact']" state="loading" role="status" aria-labelledby="page-loading-medium-title" aria-busy="true">
            <div class="g-page-loading-content"><strong id="page-loading-medium-title" class="g-page-loading-title">正在载入订单</strong><span class="g-page-loading-description">获取最新的订单与物流状态。</span></div>
          </GPageLoading>
        </div>
        <div>
          <code>card + large</code>
          <GPageLoading :variant="['card', 'large']" state="indeterminate" role="status" aria-labelledby="page-loading-large-title" aria-describedby="page-loading-large-description" aria-busy="true">
            <div class="g-page-loading-content">
              <strong id="page-loading-large-title" class="g-page-loading-title">正在准备工作区</strong>
              <span id="page-loading-large-description" class="g-page-loading-description">同步配置、权限和最近打开的文档。</span>
              <div class="g-page-loading-progress-wrap"><span class="g-page-loading-progress" aria-hidden="true" /></div>
            </div>
          </GPageLoading>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>可测量的长任务</h3>
      <p>当进度可知时，不再只显示转圈：同时给出百分比、数量、当前阶段和可恢复操作。暂停、取消、完成都必须是明确状态。</p>
      <div class="usage-preview usage-preview--block page-loading-task-demo">
        <GPageLoading
          :variant="['contained', 'large']"
          :state="taskState"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          :aria-busy="taskState === 'determinate' || taskState === 'paused'"
          aria-labelledby="import-loading-title"
          aria-describedby="import-loading-description"
          :style="{ '--g-page-loading-progress': \`\${progress}%\` }"
        >
          <div class="g-page-loading-content">
            <strong id="import-loading-title" class="g-page-loading-title">{{ taskTitle }}</strong>
            <span id="import-loading-description" class="g-page-loading-description">正在校验字段并写入客户档案，关闭页面不会丢失已完成的数据。</span>
            <div class="g-page-loading-progress-wrap">
              <div class="g-page-loading-progress-header"><span>{{ Math.round(progress * 12.4) }} / 1,240 条</span><strong class="g-page-loading-progress-value">{{ progress }}%</strong></div>
              <div class="g-page-loading-progress" role="progressbar" aria-label="客户数据导入进度" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="progress" :aria-valuetext="\`已完成 \${progress}%\`" />
            </div>
            <ol class="g-page-loading-steps" aria-label="导入阶段">
              <li v-for="(label, index) in ['上传文件', '校验数据', '写入档案']" :key="label" class="g-page-loading-step" :class="{ 'is-complete': currentStep > index + 1, 'is-current': currentStep === index + 1 }" :aria-current="currentStep === index + 1 ? 'step' : undefined"><span>{{ label }}</span></li>
            </ol>
            <div class="g-page-loading-actions">
              <GButton v-if="taskState === 'determinate' || taskState === 'paused'" variant="outline" size="small" @click="togglePause">{{ taskState === 'paused' ? '继续' : '暂停' }}</GButton>
              <GButton v-if="taskState === 'determinate' || taskState === 'paused'" variant="text" size="small" @click="taskState = 'cancelled'">取消</GButton>
              <GButton v-if="taskState === 'success' || taskState === 'cancelled'" variant="outline" size="small" @click="restart">重新开始</GButton>
              <GButton variant="primary" size="small" @click="advance">推进演示</GButton>
            </div>
          </div>
        </GPageLoading>
      </div>
    </section>

    <section class="usage-section">
      <h3>局部遮罩与背景内容</h3>
      <p>局部刷新保留上下文，但遮罩期间背景内容会减弱并停止接收点击；非阻断式刷新不应使用 overlay。</p>
      <div class="usage-preview usage-preview--block">
        <div class="page-loading-overlay-toolbar"><span>订单概览</span><GButton variant="outline" size="small" @click="overlayVisible = !overlayVisible">{{ overlayVisible ? '显示内容' : '重新加载' }}</GButton></div>
        <div class="g-page-loading-host page-loading-overlay-host" :aria-busy="overlayVisible">
          <div class="g-page-loading-container page-loading-fake-dashboard">
            <div><small>今日订单</small><strong>1,286</strong><span>+12.4%</span></div>
            <div><small>待发货</small><strong>84</strong><span>预计 2 小时完成</span></div>
            <ul><li v-for="item in 3" :key="item"><span></span><b></b><i></i></li></ul>
          </div>
          <GPageLoading v-if="overlayVisible" :variant="['overlay', 'medium']" state="loading" role="status" aria-live="polite" aria-label="正在刷新订单概览" aria-busy="true">
            <div class="g-page-loading-content"><strong class="g-page-loading-title">正在刷新订单</strong><span class="g-page-loading-description">保留当前筛选条件和滚动位置。</span></div>
          </GPageLoading>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>生命周期与异常恢复</h3>
      <p>超过预期时间需要解释等待原因；失败和取消不是“停止旋转”而已，应使用明确图标、文案和恢复操作。delayed 可用于避免极短请求闪烁。</p>
      <div class="usage-preview usage-preview--block page-loading-state-grid">
        <GPageLoading v-for="item in [
          { state: 'loading', title: '正在连接', detail: '短暂等待，自动显示指示器' },
          { state: 'stalled', title: '仍在处理中', detail: '耗时较长，可继续等待或取消' },
          { state: 'success', title: '加载完成', detail: '内容已经可以使用' },
          { state: 'error', title: '加载失败', detail: '检查网络后重新尝试' },
          { state: 'cancelled', title: '已取消', detail: '没有修改已有数据' },
        ]" :key="item.state" :variant="['contained', 'compact', 'small']" :state="item.state" :role="item.state === 'error' ? 'alert' : 'status'" :aria-live="item.state === 'error' ? 'assertive' : 'polite'">
          <div class="g-page-loading-content"><strong class="g-page-loading-title">{{ item.title }}</strong><span class="g-page-loading-description">{{ item.detail }}</span><button v-if="item.state === 'error'" class="g-page-loading-action" type="button">重试</button></div>
        </GPageLoading>
      </div>
    </section>

    <section class="usage-section">
      <h3>全屏模式与选型边界</h3>
      <p>fullscreen 固定覆盖视口，仅用于应用初始化或必须等待的页面切换。演示限制在预览框中，真实使用时会覆盖整个视口并处理安全区。</p>
      <div class="usage-preview usage-preview--block page-loading-fullscreen-stage">
        <div class="page-loading-fullscreen-chrome"><span></span><span></span><span></span><b>Gardenerim Workspace</b></div>
        <GPageLoading :variant="['fullscreen', 'dimmed', 'large']" state="indeterminate" role="status" aria-live="polite" aria-busy="true" aria-labelledby="fullscreen-loading-title">
          <div class="g-page-loading-content">
            <strong id="fullscreen-loading-title" class="g-page-loading-title">正在启动工作区</strong>
            <span class="g-page-loading-description">正在恢复标签页和本地缓存…</span>
            <div class="g-page-loading-progress-wrap"><span class="g-page-loading-progress" aria-hidden="true" /></div>
          </div>
        </GPageLoading>
      </div>
      <div class="page-loading-guidance">
        <div><strong>Spinner / Page Loading</strong><span>结构未知、短等待或必须阻断操作</span></div>
        <div><strong>Determinate Progress</strong><span>可测量的上传、导入、安装与批处理</span></div>
        <div><strong>Skeleton</strong><span>结构已知、内容渐进到达且页面仍可浏览</span></div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>布局</b><code>inline</code><code>contained</code><code>card</code><code>overlay</code><code>fullscreen</code></span>
      <span><b>状态</b><code>determinate</code><code>indeterminate</code><code>paused</code><code>stalled</code><code>success</code><code>error</code><code>cancelled</code></span>
      <span><b>结构</b><code>indicator</code><code>progress</code><code>steps</code><code>actions</code><code>container</code></span>
      <span><b>无障碍</b><code>status</code><code>progressbar</code><code>aria-busy</code><code>aria-valuenow</code><code>aria-live</code></span>
    </footer>
  </article>
</template>
`;export{e as default};