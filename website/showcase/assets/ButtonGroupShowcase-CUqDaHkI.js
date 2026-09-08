var e=`<script setup lang="ts">
import { ref } from "vue";
import { GButton, GButtonGroup } from "@gardenerim/vue";
import DemoIcon from "./DemoIcon.vue";

const formats = ref(new Set(["bold"]));
const toolbar = ref<HTMLElement | null>(null);

function toggleFormat(format: string) {
  const next = new Set(formats.value);
  next.has(format) ? next.delete(format) : next.add(format);
  formats.value = next;
}

function toolbarButtons() {
  return Array.from(toolbar.value?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
}

function setToolbarFocus(target: HTMLButtonElement) {
  for (const button of toolbarButtons()) button.tabIndex = button === target ? 0 : -1;
}

function onToolbarFocus(event: FocusEvent) {
  const target = event.target;
  if (target instanceof HTMLButtonElement) setToolbarFocus(target);
}

function onToolbarKeydown(event: KeyboardEvent) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  const buttons = toolbarButtons();
  const current = event.target instanceof HTMLButtonElement ? buttons.indexOf(event.target) : -1;
  if (current < 0 || buttons.length === 0) return;
  event.preventDefault();
  const nextIndex = event.key === "Home"
    ? 0
    : event.key === "End"
      ? buttons.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
  const nextButton = buttons[nextIndex];
  if (!nextButton) return;
  setToolbarFocus(nextButton);
  nextButton.focus();
}
<\/script>

<template>
  <article id="component-button-group" class="component-doc button-group-documentation">
    <header class="component-doc__header">
      <div>
        <h2>组合按钮 <span>Button Group / GButtonGroup</span></h2>
        <p>将紧密相关的同级操作连接成一个操作单元；连接只是视觉关系，交互语义仍由组内按钮决定。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section button-group-principles">
      <h3>先区分四种需求</h3>
      <p>完整的 Button Group 不是“把按钮挤在一起”。普通组合、分裂按钮、工具栏和切换组具有不同语义。</p>
      <div class="group-principle-grid">
        <div><b>普通组合</b><span>同级、相关、彼此独立的命令</span><code>role="group"</code></div>
        <div><b>分裂按钮</b><span>主操作 + 展开更多同类操作</span><code>aria-haspopup="menu"</code></div>
        <div><b>工具栏</b><span>三个以上高频控件的快捷区</span><code>role="toolbar"</code></div>
        <div><b>切换组</b><span>每个按钮保留开 / 关状态</span><code>aria-pressed</code></div>
      </div>
    </section>

    <section id="button-group-basic" class="usage-section">
      <h3>基本组合与类型</h3>
      <p>组合会折叠相邻边框、合并圆角，并保证 hover、active 和键盘焦点位于接缝上方。</p>
      <div class="usage-preview button-group-demo-stack">
        <GButtonGroup role="group" aria-label="分页操作">
          <GButton><DemoIcon name="left" />上一页</GButton>
          <GButton>第 2 页</GButton>
          <GButton>下一页<DemoIcon name="right" /></GButton>
        </GButtonGroup>
        <GButtonGroup variant="primary" role="group" aria-label="流程操作">
          <GButton>保存草稿</GButton><GButton>提交审核</GButton><GButton>发布</GButton>
        </GButtonGroup>
        <GButtonGroup variant="outline" state="success" role="group" aria-label="成功状态操作">
          <GButton>预览</GButton><GButton>复制链接</GButton><GButton>查看记录</GButton>
        </GButtonGroup>
        <GButtonGroup role="group" aria-label="混合危险等级操作">
          <GButton variant="secondary">归档</GButton><GButton variant="secondary" state="warning">暂停</GButton><GButton variant="danger">删除</GButton>
        </GButtonGroup>
      </div>
    </section>

    <section id="button-group-size" class="usage-section">
      <h3>尺寸与形状</h3>
      <p>尺寸和形状在组级设置，一次同步到全部子按钮；mini / small 在触摸设备上会自动扩大点击高度。</p>
      <div class="usage-preview button-group-size-grid">
        <div><span>24px · mini</span><GButtonGroup :variant="['primary', 'mini']" role="group" aria-label="迷你组合"><GButton>左</GButton><GButton>中</GButton><GButton>右</GButton></GButtonGroup></div>
        <div><span>28px · small</span><GButtonGroup :variant="['outline', 'small']" role="group" aria-label="小型组合"><GButton>左</GButton><GButton>中</GButton><GButton>右</GButton></GButtonGroup></div>
        <div><span>32px · medium</span><GButtonGroup :variant="['primary', 'medium', 'round']" role="group" aria-label="中型圆角组合"><GButton>左</GButton><GButton>中</GButton><GButton>右</GButton></GButtonGroup></div>
        <div><span>36px · large</span><GButtonGroup :variant="['secondary', 'large']" role="group" aria-label="大型组合"><GButton>左</GButton><GButton>中</GButton><GButton>右</GButton></GButtonGroup></div>
      </div>
    </section>

    <section id="button-group-split" class="usage-section">
      <h3>分裂按钮</h3>
      <p>左侧执行最常用动作，右侧只负责打开菜单。触发按钮保持正方形，并提供菜单语义和展开状态。</p>
      <div class="usage-preview button-group-gallery">
        <GButtonGroup :variant="['primary', 'split']" role="group" aria-label="发布选项">
          <GButton class="g-btn-group-primary-action"><DemoIcon name="save" />立即发布</GButton>
          <GButton class="g-btn-group-trigger" aria-label="更多发布选项" aria-haspopup="menu" aria-expanded="false"><DemoIcon name="down" /></GButton>
        </GButtonGroup>
        <GButtonGroup :variant="['outline', 'split', 'round']" role="group" aria-label="导出选项">
          <GButton class="g-btn-group-primary-action">导出 PDF</GButton>
          <GButton class="g-btn-group-trigger" aria-label="更多导出格式" aria-haspopup="menu" aria-expanded="false"><DemoIcon name="down" /></GButton>
        </GButtonGroup>
        <GButtonGroup :variant="['primary', 'split']" state="warning" role="group" aria-label="部署选项">
          <GButton class="g-btn-group-primary-action">部署生产环境</GButton>
          <GButton class="g-btn-group-trigger" aria-label="更多部署环境" aria-haspopup="menu" aria-expanded="false"><DemoIcon name="down" /></GButton>
        </GButtonGroup>
      </div>
    </section>

    <section id="button-group-layout" class="usage-section">
      <h3>纵向与等宽布局</h3>
      <p>纵向组合适合窄侧栏；block / justified 用于必须占满容器的步骤或视图切换。普通组合默认不换行，避免接缝断裂。</p>
      <div class="usage-preview button-group-layout-grid">
        <div class="button-group-layout-card"><span>Vertical</span><GButtonGroup :variant="['vertical', 'outline']" role="group" aria-label="视图操作" aria-orientation="vertical"><GButton>列表视图</GButton><GButton>看板视图</GButton><GButton>时间线</GButton></GButtonGroup></div>
        <div class="button-group-layout-card button-group-layout-card--wide"><span>Block / Justified</span><GButtonGroup :variant="['block', 'secondary']" role="group" aria-label="审批步骤"><GButton>提交</GButton><GButton>复核</GButton><GButton>批准</GButton></GButtonGroup></div>
      </div>
    </section>

    <section id="button-group-toggle" class="usage-section">
      <h3>可切换按钮组</h3>
      <p>切换按钮保持标签不变，通过 <code>aria-pressed</code> 表达状态。若只能单选，应改用 Segmented 或 Radio Group。</p>
      <div class="usage-preview button-group-gallery">
        <GButtonGroup :variant="['toggle', 'outline']" role="group" aria-label="文字格式">
          <GButton variant="icon" aria-label="粗体" :aria-pressed="formats.has('bold')" @click="toggleFormat('bold')"><DemoIcon name="bold" /></GButton>
          <GButton variant="icon" aria-label="斜体" :aria-pressed="formats.has('italic')" @click="toggleFormat('italic')"><DemoIcon name="italic" /></GButton>
          <GButton variant="icon" aria-label="下划线" :aria-pressed="formats.has('underline')" @click="toggleFormat('underline')"><DemoIcon name="underline" /></GButton>
        </GButtonGroup>
        <span class="button-group-live-state" aria-live="polite">已启用：{{ [...formats].join('、') || '无' }}</span>
      </div>
    </section>

    <section id="button-group-toolbar" class="usage-section">
      <h3>按钮工具栏</h3>
      <p>工具栏允许多个按钮组换行，并在本示例中实现左右方向键、Home、End 的 roving tabindex 导航。</p>
      <div class="usage-preview">
        <div ref="toolbar" class="g-btn-toolbar" role="toolbar" aria-label="文档快捷操作" @focusin="onToolbarFocus" @keydown="onToolbarKeydown">
          <GButtonGroup variant="outline" role="group" aria-label="历史操作"><GButton tabindex="0"><DemoIcon name="left" />撤销</GButton><GButton tabindex="-1">重做<DemoIcon name="right" /></GButton></GButtonGroup>
          <GButtonGroup :variant="['outline', 'toggle']" role="group" aria-label="格式操作"><GButton tabindex="-1" variant="icon" aria-label="粗体" :aria-pressed="formats.has('bold')" @click="toggleFormat('bold')"><DemoIcon name="bold" /></GButton><GButton tabindex="-1" variant="icon" aria-label="斜体" :aria-pressed="formats.has('italic')" @click="toggleFormat('italic')"><DemoIcon name="italic" /></GButton></GButtonGroup>
          <GButtonGroup variant="primary" role="group" aria-label="文件操作"><GButton tabindex="-1"><DemoIcon name="save" />保存</GButton><GButton tabindex="-1" variant="icon" aria-label="复制"><DemoIcon name="copy" /></GButton><GButton tabindex="-1" variant="icon" aria-label="搜索"><DemoIcon name="search" /></GButton></GButtonGroup>
        </div>
      </div>
    </section>

    <section id="button-group-states" class="usage-section">
      <h3>禁用与局部加载</h3>
      <p>整组禁用在容器上声明；加载通常只作用于正在执行的按钮，避免用户误以为全部命令都在运行。</p>
      <div class="usage-preview button-group-gallery">
        <GButtonGroup :variant="['secondary', 'small']" state="disabled" role="group" aria-label="禁用分页" aria-disabled="true"><GButton disabled>上一页</GButton><GButton disabled>下一页</GButton></GButtonGroup>
        <GButtonGroup variant="primary" role="group" aria-label="异步操作"><GButton state="loading" aria-busy="true">保存</GButton><GButton>保存并继续</GButton><GButton variant="icon" aria-label="更多"><DemoIcon name="more" /></GButton></GButtonGroup>
      </div>
    </section>

    <section id="button-group-api" class="usage-section">
      <h3>能力边界与跨框架 API</h3>
      <div class="button-api-wrap">
        <table class="button-api-table">
          <thead><tr><th>能力</th><th>Gardenerim</th><th>关键语义</th><th>不应该这样用</th></tr></thead>
          <tbody>
            <tr><td>方向</td><td><code>horizontal | vertical</code></td><td><code>aria-orientation</code></td><td>用换行模拟纵向组合</td></tr>
            <tr><td>宽度</td><td><code>block | justified</code></td><td>子按钮等宽伸展</td><td>在未知宽度里硬编码按钮宽度</td></tr>
            <tr><td>分裂</td><td><code>split</code> + trigger part</td><td><code>aria-haspopup / expanded</code></td><td>两个区域执行同一动作</td></tr>
            <tr><td>切换</td><td><code>toggle</code></td><td><code>aria-pressed</code></td><td>拿它冒充单选 Radio Group</td></tr>
            <tr><td>工具栏</td><td><code>.g-btn-toolbar</code></td><td><code>role="toolbar"</code> + 方向键</td><td>只有两个按钮却声明 toolbar</td></tr>
            <tr><td>框架参数</td><td><code>variant / state</code></td><td>Vue、React、AngularJS、Blazor 同源生成</td><td>各框架维护不同 class 契约</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>容器</b><code>.g-btn-group</code><code>GButtonGroup</code></span>
      <span><b>布局</b><code>vertical</code><code>block</code><code>justified</code></span>
      <span><b>交互</b><code>split</code><code>toggle</code><code>.g-btn-toolbar</code></span>
    </footer>
  </article>
</template>
`;export{e as default};