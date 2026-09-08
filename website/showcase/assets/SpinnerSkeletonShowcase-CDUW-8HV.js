var e=`<script setup lang="ts">
import { ref } from "vue";
import { GButton, GSpinnerSkeleton } from "@gardenerim/vue";

const embeddedLoading = ref(true);
const contentLoading = ref(true);
const showFullscreen = ref(false);
<\/script>

<template>
  <article id="component-spinner-skeleton" class="component-doc spinner-skeleton-documentation">
    <header class="component-doc__header">
      <div>
        <h2>加载指示与骨架屏 <span>Spinner / Skeleton / GSpinnerSkeleton</span></h2>
        <p>Spinner 反馈无法预估的短时等待，Skeleton 预告即将出现的内容结构。支持尺寸、动效、说明、区域遮罩、全屏加载和可组合骨架模板。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>Spinner 基本用法与尺寸</h3>
      <p>默认圈为 20px；可用尺寸变体或 --g-spinner-size 自定义。提示文案为 14px，和图标间距 6px，与 Arco Spin 同比例。</p>
      <div class="usage-preview">
        <div class="spinner-size-grid">
          <div v-for="size in ['xs', 'small', 'medium', 'large', 'xl']" :key="size" class="spinner-demo-item">
            <GSpinnerSkeleton :variant="size" state="loading" role="status" :aria-label="\`\${size} 加载中\`" />
            <span>{{ size }}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>动效形态</h3>
      <p>环形适合通用等待，跳点适合对话与流式响应，脉冲适合极小空间；业务可以通过 <code>indicator</code> 提供自定义图标。</p>
      <div class="usage-preview">
        <div class="spinner-variant-grid">
          <div class="spinner-demo-item"><GSpinnerSkeleton :variant="['spinner', 'large']" state="loading" role="status" aria-label="环形加载中" /><span>ring</span></div>
          <div class="spinner-demo-item"><GSpinnerSkeleton :variant="['dots', 'large']" state="loading" role="status" aria-label="内容生成中"><span v-for="dot in 3" :key="dot" class="g-spinner-dot" /></GSpinnerSkeleton><span>dots</span></div>
          <div class="spinner-demo-item"><GSpinnerSkeleton :variant="['pulse', 'large']" state="loading" role="status" aria-label="等待响应" /><span>pulse</span></div>
          <div class="spinner-demo-item"><GSpinnerSkeleton variant="large" state="loading" role="status" aria-label="自定义加载图标"><span class="g-spinner-indicator"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8" /></svg></span></GSpinnerSkeleton><span>custom</span></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>行内与说明文字</h3>
      <p><code>inline</code> 与当前文本基线对齐；<code>tip</code> 用于独立等待区域。说明应描述正在做什么，而不是只写“请稍候”。</p>
      <div class="usage-preview">
        <div class="spinner-label-grid">
          <p>正在保存草稿 <GSpinnerSkeleton :variant="['inline', 'small']" state="loading" role="status" aria-label="正在保存草稿" /></p>
          <GSpinnerSkeleton :variant="['tip', 'large']" state="loading" role="status" aria-live="polite" aria-label="正在同步团队数据"><span class="g-spinner-description" aria-hidden="true">正在同步团队数据…</span></GSpinnerSkeleton>
          <GSpinnerSkeleton :variant="['inline', 'medium']" state="paused" role="status" aria-label="同步已暂停"><span class="g-spinner-description" aria-hidden="true">同步已暂停</span></GSpinnerSkeleton>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>区域遮罩</h3>
      <p>异步刷新已有内容时保留上下文，并通过半透明遮罩阻止误操作；加载结束后原内容恢复清晰和可交互状态。</p>
      <div class="usage-preview usage-preview--block">
        <div class="spinner-overlay-demo">
          <div class="spinner-demo-toolbar"><span>{{ embeddedLoading ? "正在刷新成员数据" : "数据已就绪" }}</span><GButton :variant="['outline', 'small']" @click="embeddedLoading = !embeddedLoading">{{ embeddedLoading ? "结束加载" : "重新加载" }}</GButton></div>
          <GSpinnerSkeleton :variant="['overlay', 'large']" :state="embeddedLoading ? 'loading' : 'loaded'" role="status" :aria-busy="embeddedLoading" aria-label="正在刷新成员数据">
            <div class="g-spinner-content">
              <div class="spinner-content-card"><strong>设计系统团队</strong><p>12 位成员 · 4 个进行中项目</p><div><span>林默</span><span>周宁</span><span>陈晓</span></div></div>
            </div>
            <span v-if="embeddedLoading" class="g-spinner-description" aria-hidden="true">正在刷新…</span>
          </GSpinnerSkeleton>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>全屏加载</h3>
      <p>仅在应用初始化或无法继续操作时使用全屏遮罩，并保留退出或取消路径。演示按钮会打开实际全屏状态。</p>
      <div class="usage-preview">
        <GButton variant="primary" @click="showFullscreen = true">打开全屏加载</GButton>
        <GSpinnerSkeleton v-if="showFullscreen" :variant="['fullscreen', 'xl']" state="loading" role="status" aria-live="polite" aria-label="正在准备工作区">
          <span class="g-spinner-description" aria-hidden="true">正在准备工作区…</span>
          <div class="g-spinner-content spinner-fullscreen-controls"><GButton variant="outline" @click="showFullscreen = false">取消加载</GButton></div>
        </GSpinnerSkeleton>
      </div>
    </section>

    <section class="usage-section">
      <h3>Skeleton 基本结构</h3>
      <p>骨架应尽量贴近真实内容尺寸，减少加载完成时的布局跳动。<code>active</code> 用于需要强调正在加载的场景，<code>static</code> 可关闭动画。</p>
      <div class="usage-preview usage-preview--block">
        <div class="skeleton-basic-grid">
          <div><span>active</span><GSpinnerSkeleton :variant="['skeleton', 'active']" state="loading" aria-hidden="true"><span class="g-skeleton-title" /><div class="g-skeleton-paragraph"><span class="g-skeleton-row" /><span class="g-skeleton-row" style="--g-skeleton-width:92%" /><span class="g-skeleton-row" style="--g-skeleton-width:64%" /></div></GSpinnerSkeleton></div>
          <div><span>static</span><GSpinnerSkeleton :variant="['skeleton', 'static']" state="loading" aria-hidden="true"><span class="g-skeleton-title" style="--g-skeleton-width:46%" /><div class="g-skeleton-paragraph"><span class="g-skeleton-row" /><span class="g-skeleton-row" style="--g-skeleton-width:86%" /><span class="g-skeleton-row" style="--g-skeleton-width:52%" /></div></GSpinnerSkeleton></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>骨架元素</h3>
      <p>头像、标题、文本、输入框、按钮和图片均可独立组合；圆形与全圆角形态可以适配真实组件轮廓。</p>
      <div class="usage-preview usage-preview--block">
        <div class="skeleton-element-grid" aria-label="骨架元素示例" aria-busy="true">
          <div><GSpinnerSkeleton :variant="['avatar', 'circle']" aria-hidden="true" /><span>avatar</span></div>
          <div><GSpinnerSkeleton variant="title" aria-hidden="true" /><span>title</span></div>
          <div><GSpinnerSkeleton variant="text" aria-hidden="true" /><span>text</span></div>
          <div><GSpinnerSkeleton variant="input" aria-hidden="true" /><span>input</span></div>
          <div><GSpinnerSkeleton :variant="['button', 'round']" aria-hidden="true" /><span>button</span></div>
          <div><GSpinnerSkeleton variant="image" aria-hidden="true" style="--g-skeleton-height:6rem" /><span>image</span></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>复杂卡片与列表模板</h3>
      <p>Skeleton 不限制固定模板；卡片和列表应复用真实页面的栅格、间距与尺寸，而不是渲染大量无意义占位块。</p>
      <div class="usage-preview usage-preview--block">
        <div class="skeleton-complex-grid">
          <GSpinnerSkeleton :variant="['skeleton', 'card']" state="loading" aria-label="卡片内容加载中" aria-busy="true">
            <span class="g-skeleton-image" aria-hidden="true" />
            <div class="g-skeleton-content" aria-hidden="true"><span class="g-skeleton-title" style="--g-skeleton-width:56%" /><div class="g-skeleton-paragraph"><span class="g-skeleton-row" /><span class="g-skeleton-row" style="--g-skeleton-width:72%" /></div><span class="g-skeleton-button" /></div>
          </GSpinnerSkeleton>
          <GSpinnerSkeleton :variant="['skeleton', 'list']" state="loading" aria-label="成员列表加载中" aria-busy="true">
            <div v-for="item in 3" :key="item" class="g-skeleton-list-item" aria-hidden="true"><span class="g-skeleton-avatar" /><div class="g-skeleton-content"><span class="g-skeleton-title" style="--g-skeleton-width:35%" /><span class="g-skeleton-row" :style="\`--g-skeleton-width:\${85 - item * 8}%\`" /></div></div>
          </GSpinnerSkeleton>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>加载与真实内容切换</h3>
      <p>骨架只用于首次载入或结构明确的等待；短请求应设置显示延迟，避免一闪而过。点击按钮可核对骨架和真实内容尺寸。</p>
      <div class="usage-preview usage-preview--block">
        <div class="skeleton-switch-demo">
          <GButton :variant="['outline', 'small']" @click="contentLoading = !contentLoading">{{ contentLoading ? "显示真实内容" : "重新加载" }}</GButton>
          <div class="skeleton-switch-stage" :aria-busy="contentLoading">
            <GSpinnerSkeleton v-if="contentLoading" :variant="['skeleton', 'with-avatar']" state="loading" aria-label="用户资料加载中"><div class="g-skeleton-header" aria-hidden="true"><span class="g-skeleton-avatar" /></div><div class="g-skeleton-content" aria-hidden="true"><span class="g-skeleton-title" /><div class="g-skeleton-paragraph"><span class="g-skeleton-row" /><span class="g-skeleton-row" style="--g-skeleton-width:78%" /></div></div></GSpinnerSkeleton>
            <div v-else class="skeleton-real-profile"><span class="skeleton-real-avatar">林</span><div><strong>林默</strong><p>设计系统负责人 · 最近更新于 2 分钟前</p></div></div>
          </div>
        </div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>Spinner</b><code>spinner</code><code>dots</code><code>pulse</code><code>inline</code><code>tip</code><code>overlay</code><code>fullscreen</code></span>
      <span><b>Skeleton</b><code>text</code><code>title</code><code>avatar</code><code>button</code><code>input</code><code>image</code><code>card</code><code>list</code></span>
      <span><b>状态</b><code>loading</code><code>paused</code><code>loaded</code><code>disabled</code></span>
      <span><b>语义</b><code>role="status"</code><code>aria-busy</code><code>aria-live</code><code>aria-hidden</code></span>
    </footer>
  </article>
</template>
`;export{e as default};