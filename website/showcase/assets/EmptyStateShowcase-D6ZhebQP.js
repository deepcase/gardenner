var e=`<script setup lang="ts">
import { ref } from "vue";
import { GButton, GEmptyState } from "@gardenerim/vue";

const resultReset = ref(false);
<\/script>

<template>
  <article id="component-empty-state" class="component-doc empty-documentation">
    <header class="component-doc__header">
      <div>
        <h2>空状态 <span>Empty State / GEmptyState</span></h2>
        <p>明确说明为什么没有内容，并在可恢复时给出下一步。支持默认插图、简单图标、紧凑嵌入、首次使用、搜索无结果、错误、离线与无权限场景。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>基本用法</h3>
      <p>基础结构由 <code>visual</code>、标题、说明和操作区组成。空状态不是“什么都不显示”，文案应解释原因并帮助用户继续。</p>
      <div class="usage-preview usage-preview--block empty-preview-frame">
        <GEmptyState state="no-data" role="status" aria-labelledby="empty-basic-title" aria-describedby="empty-basic-description">
          <div class="g-empty-visual" aria-hidden="true">
            <svg viewBox="0 0 120 90"><path d="M24 27h72v45H24z" opacity=".13" fill="currentColor"/><path d="M25 31h70v42H25zM25 31l15-14h40l15 14M47 49h26M53 59h14"/><circle cx="90" cy="20" r="8" opacity=".18" fill="currentColor"/></svg>
          </div>
          <div class="g-empty-content"><h4 id="empty-basic-title" class="g-empty-title">暂无数据</h4><p id="empty-basic-description" class="g-empty-description">创建第一条记录后，数据会显示在这里。</p><div class="g-empty-actions"><GButton variant="primary">创建记录</GButton></div></div>
        </GEmptyState>
      </div>
    </section>

    <section class="usage-section">
      <h3>简单、紧凑与无插图</h3>
      <p>默认图标 48px，自定义图片高 80px，上下留白各 10px；表格和选择器内部可使用紧凑模式；文字已经足够时可明确选择 <code>no-image</code>。</p>
      <div class="usage-preview usage-preview--block">
        <div class="empty-variant-grid">
          <GEmptyState variant="simple" state="no-data" role="status" aria-label="列表暂无数据"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 7h14v12H5zM8 4h8v3M9 12h6"/></svg></span></div><div class="g-empty-content"><h4 class="g-empty-title">列表为空</h4><p class="g-empty-description">暂时没有待处理项目。</p></div></GEmptyState>
          <GEmptyState variant="compact" state="no-results" role="status" aria-label="选择器没有选项"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5M8 10h4"/></svg></span></div><div class="g-empty-content"><h4 class="g-empty-title">没有选项</h4><p class="g-empty-description">换一个关键词试试。</p></div></GEmptyState>
          <GEmptyState variant="no-image" state="normal" role="status"><div class="g-empty-content"><h4 class="g-empty-title">通知已全部读完</h4><p class="g-empty-description">这里没有需要处理的新消息。</p></div></GEmptyState>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>搜索无结果</h3>
      <p>保留用户的搜索上下文，说明未命中原因，并提供清除筛选或调整条件的直接操作。</p>
      <div class="usage-preview usage-preview--block empty-preview-frame">
        <GEmptyState variant="card" state="no-results" role="status" aria-labelledby="empty-search-title">
          <div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5M7.5 10h5"/></svg></span></div>
          <div class="g-empty-content"><h4 id="empty-search-title" class="g-empty-title">没有找到“Gardener Pro”</h4><p class="g-empty-description">检查拼写，或尝试减少筛选条件。</p><div class="g-empty-actions"><GButton variant="primary" @click="resultReset = true">清除筛选</GButton><GButton variant="outline">调整条件</GButton></div><output class="g-empty-help" aria-live="polite">{{ resultReset ? "筛选条件已清除" : "当前筛选：已归档、最近 30 天" }}</output></div>
        </GEmptyState>
      </div>
    </section>

    <section class="usage-section">
      <h3>首次使用与完成状态</h3>
      <p>首次进入应介绍价值并邀请创建；用户主动清空或完成任务时，用成功语义确认结果，不必强迫下一步操作。</p>
      <div class="usage-preview usage-preview--block">
        <div class="empty-scenario-grid">
          <GEmptyState variant="card" state="first-use" role="status" aria-labelledby="empty-first-title"><div class="g-empty-visual" aria-hidden="true"><svg viewBox="0 0 120 90"><path d="M27 68V30l33-16 33 16v38L60 84z" opacity=".12" fill="currentColor"/><path d="M27 30l33 17 33-17M60 47v37M27 30l33-16 33 16v38L60 84 27 68zM54 25h12M60 19v12"/></svg></div><div class="g-empty-content"><h4 id="empty-first-title" class="g-empty-title">创建第一个项目</h4><p class="g-empty-description">集中管理任务、成员和交付进度，团队从这里开始协作。</p><div class="g-empty-actions"><GButton variant="primary">新建项目</GButton><GButton variant="text">查看指南</GButton></div></div></GEmptyState>
          <GEmptyState variant="card" state="success" role="status" aria-labelledby="empty-done-title"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 8.5"/></svg></span></div><div class="g-empty-content"><h4 id="empty-done-title" class="g-empty-title">任务全部完成</h4><p class="g-empty-description">今天没有剩余待办，可以放心收工了。</p></div></GEmptyState>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误、离线与无权限</h3>
      <p>这些不是普通“无数据”：必须说明原因，并给出重试、检查网络或申请权限等针对性恢复路径。</p>
      <div class="usage-preview usage-preview--block">
        <div class="empty-scenario-grid empty-scenario-grid--three">
          <GEmptyState :variant="['card', 'simple']" state="error" role="status" aria-label="加载失败"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/></svg></span></div><div class="g-empty-content"><h4 class="g-empty-title">加载失败</h4><p class="g-empty-description">服务暂时不可用，请稍后重试。</p><div class="g-empty-actions"><GButton variant="primary">重新加载</GButton></div></div></GEmptyState>
          <GEmptyState :variant="['card', 'simple']" state="offline" role="status" aria-label="网络已断开"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 9a13 13 0 0 1 16 0M7 12a8 8 0 0 1 10 0M10 15a3 3 0 0 1 4 0M4 4l16 16"/></svg></span></div><div class="g-empty-content"><h4 class="g-empty-title">网络已断开</h4><p class="g-empty-description">恢复连接后可继续同步。</p><div class="g-empty-actions"><GButton variant="outline">检查网络</GButton></div></div></GEmptyState>
          <GEmptyState :variant="['card', 'simple']" state="forbidden" role="status" aria-label="没有访问权限"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2"/></svg></span></div><div class="g-empty-content"><h4 class="g-empty-title">没有访问权限</h4><p class="g-empty-description">联系管理员或提交权限申请。</p><div class="g-empty-actions"><GButton variant="outline">申请权限</GButton></div></div></GEmptyState>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>行内嵌入</h3>
      <p>侧栏、下拉面板和小型卡片可以采用横向布局；窄屏会自动回到居中堆叠。</p>
      <div class="usage-preview usage-preview--block">
        <GEmptyState :variant="['inline', 'card']" state="no-data" role="status" aria-label="最近没有活动"><div class="g-empty-visual"><span class="g-empty-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 19V9M12 19V5M19 19v-7"/></svg></span></div><div class="g-empty-content"><h4 class="g-empty-title">最近没有活动</h4><p class="g-empty-description">成员操作和系统事件会显示在这里。</p></div><div class="g-empty-actions"><GButton variant="text">刷新</GButton></div></GEmptyState>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>结构</b><code>visual</code><code>content</code><code>title</code><code>description</code><code>actions</code><code>help</code></span>
      <span><b>布局</b><code>simple</code><code>compact</code><code>inline</code><code>card</code><code>full-page</code><code>no-image</code></span>
      <span><b>场景</b><code>no-data</code><code>no-results</code><code>first-use</code><code>success</code><code>error</code><code>offline</code><code>forbidden</code></span>
      <span><b>语义</b><code>role="status"</code><code>aria-labelledby</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>
`;export{e as default};