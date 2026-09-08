var e=`<script setup lang="ts">
import { GBadge, GButton, GCard } from "@gardenerim/vue";
<\/script>

<template>
  <article id="component-badge" class="component-doc label-documentation">
    <header class="component-doc__header">
      <div>
        <h2>徽标 <span>Badge / GBadge</span></h2>
        <p>用于计数提醒、未读状态和局部标记。既支持独立显示，也可附着在头像、按钮或卡片上；状态点与 Ribbon 拥有各自的结构。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>计数与溢出</h3>
      <p>计数使用等宽数字；可通过 <code>config.basicCount</code>、<code>basicMax</code>、<code>basicShowZero</code> 自动处理上限和零值。页面下方提供实时参数演示。</p>
      <div class="usage-preview label-row">
        <GBadge class="g-badge-count">5</GBadge>
        <GBadge class="g-badge-count is-danger" variant="solid">24</GBadge>
        <GBadge class="g-badge-count is-danger" variant="solid" title="128 条未读消息">99+</GBadge>
        <GBadge class="g-badge-count" variant="outline">0</GBadge>
      </div>
    </section>

    <section class="usage-section">
      <h3>附着徽标与小红点</h3>
      <p><code>attached</code> 只负责定位，不改变承载内容。数字和纯提示点分别使用 <code>indicator</code> 与 <code>dot</code> 部件。</p>
      <div class="usage-preview label-row label-row--spacious">
        <GBadge class="g-badge-attached is-danger" aria-label="12 条未读消息">
          <span class="badge-avatar" aria-hidden="true">林</span>
          <span class="g-badge-indicator">12</span>
        </GBadge>
        <GBadge class="g-badge-attached is-danger" aria-label="有新通知">
          <GButton variant="outline">通知</GButton>
          <span class="g-badge-dot"></span>
        </GBadge>
        <GBadge class="g-badge-attached is-success" aria-label="在线">
          <span class="badge-avatar badge-avatar--photo" aria-hidden="true">AI</span>
          <span class="g-badge-dot"></span>
        </GBadge>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态点</h3>
      <p>状态必须同时提供文字，不能只依赖颜色；<code>processing</code> 使用柔和脉冲，并遵循系统的减少动画设置。</p>
      <div class="usage-preview badge-status-grid">
        <GBadge class="g-badge-status"><span class="g-badge-dot"></span><span class="g-badge-status-text">默认</span></GBadge>
        <GBadge class="g-badge-status is-success"><span class="g-badge-dot"></span><span class="g-badge-status-text">成功</span></GBadge>
        <GBadge class="g-badge-status is-warning"><span class="g-badge-dot"></span><span class="g-badge-status-text">警告</span></GBadge>
        <GBadge class="g-badge-status is-danger"><span class="g-badge-dot"></span><span class="g-badge-status-text">错误</span></GBadge>
        <GBadge class="g-badge-status is-info"><span class="g-badge-dot"></span><span class="g-badge-status-text">信息</span></GBadge>
        <GBadge class="g-badge-status is-info is-processing"><span class="g-badge-dot"></span><span class="g-badge-status-text">处理中</span></GBadge>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观、尺寸与语义色</h3>
      <p><code>soft</code>、<code>solid</code>、<code>outline</code> 可与三档尺寸和语义状态组合；实色背景始终使用白色文字。</p>
      <div class="usage-preview label-matrix">
        <div><GBadge class="g-badge-small">Small</GBadge><GBadge>Medium</GBadge><GBadge class="g-badge-large">Large</GBadge></div>
        <div><GBadge class="is-success">Success</GBadge><GBadge class="is-warning" variant="solid">Warning</GBadge><GBadge class="is-danger" variant="outline">Danger</GBadge><GBadge class="is-info">Info</GBadge></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>Ribbon</h3>
      <p>Ribbon 适合标记卡片级推荐、版本或促销信息，支持起始侧和结束侧，并兼容从右到左布局。</p>
      <div class="usage-preview ribbon-grid">
        <GCard class="g-badge-ribbon-wrap ribbon-card"><GBadge class="g-badge-ribbon">推荐</GBadge><div class="g-card-body"><strong>团队协作版</strong><p>权限、审计与自动化工作流。</p></div></GCard>
        <GCard class="g-badge-ribbon-wrap ribbon-card"><GBadge class="g-badge-ribbon g-badge-ribbon-start is-success">NEW</GBadge><div class="g-card-body"><strong>智能助手</strong><p>新增上下文记忆和批量操作。</p></div></GCard>
      </div>
    </section>

    <div class="component-doc__meta">
      <span><b>结构</b><code>count</code><code>dot</code><code>status</code><code>attached</code><code>ribbon</code></span>
      <span><b>尺寸</b><code>small</code><code>medium</code><code>large</code></span>
      <span><b>无障碍</b><code>aria-label</code><code>aria-live</code><code>title</code></span>
    </div>
  </article>
</template>
`;export{e as default};