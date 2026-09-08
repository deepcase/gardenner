var e=`<script setup lang="ts">
import { GDividerWithText } from "@gardenerim/vue";
<\/script>

<template>
  <article id="component-divider-with-text" class="component-doc divider-documentation">
    <header class="component-doc__header">
      <div>
        <h2>分割线 <span>Divider / GDividerWithText</span></h2>
        <p>用于分隔内容层级，而不是单纯画一条线。支持无文字、带标题、标题位置、线型、间距、内缩与行内垂直分隔。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>基本用法</h3>
      <p>无文字时渲染一条完整横线；作为结构分隔时使用 <code>role="separator"</code>，纯装饰场景可使用 <code>aria-hidden="true"</code>。</p>
      <div class="usage-preview usage-preview--block">
        <div class="divider-content-example">
          <strong>账户资料</strong>
          <p>姓名、头像与联系方式会显示在个人资料页。</p>
          <GDividerWithText role="separator" aria-orientation="horizontal" />
          <strong>安全设置</strong>
          <p>建议定期更新密码并开启双重验证。</p>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>带文字与标题位置</h3>
      <p>标题默认居中，也可使用 <code>start</code> 或 <code>end</code>。文案过长时会单行省略，分割线不会撑破容器。</p>
      <div class="usage-preview usage-preview--block">
        <div class="divider-stack">
          <GDividerWithText variant="start" role="separator" aria-labelledby="divider-start-title">
            <span id="divider-start-title" class="g-divider-text">开始位置</span>
          </GDividerWithText>
          <GDividerWithText variant="center" role="separator" aria-labelledby="divider-center-title">
            <span id="divider-center-title" class="g-divider-text">居中标题</span>
          </GDividerWithText>
          <GDividerWithText variant="end" role="separator" aria-labelledby="divider-end-title">
            <span id="divider-end-title" class="g-divider-text">结束位置</span>
          </GDividerWithText>
          <GDividerWithText class="divider-narrow" variant="plain" role="separator" aria-label="较长标题示例">
            <span class="g-divider-text">过长标题会自动省略并为两侧分割线保留可用空间</span>
          </GDividerWithText>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>线型与内容层级</h3>
      <p>提供 <code>solid</code>、<code>dashed</code>、<code>dotted</code>、<code>double</code>；<code>plain</code> 用于弱提示，<code>heading</code> 用于章节标题，<code>strong</code> 提升分隔强度。</p>
      <div class="usage-preview usage-preview--block">
        <div class="divider-variant-grid">
          <div><span>solid</span><GDividerWithText variant="solid" aria-hidden="true" /></div>
          <div><span>dashed</span><GDividerWithText variant="dashed" aria-hidden="true" /></div>
          <div><span>dotted</span><GDividerWithText variant="dotted" aria-hidden="true" /></div>
          <div><span>double</span><GDividerWithText variant="double" aria-hidden="true" /></div>
          <div><span>plain text</span><GDividerWithText :variant="['plain', 'start']" role="separator" aria-label="说明"><span class="g-divider-text">说明</span></GDividerWithText></div>
          <div><span>heading + strong</span><GDividerWithText :variant="['heading', 'strong', 'start']" role="separator" aria-labelledby="divider-heading"><h4 id="divider-heading" class="g-divider-text">本周数据</h4></GDividerWithText></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>间距与内缩</h3>
      <p><code>small</code>、<code>medium</code>、<code>large</code> 控制纵向留白；<code>inset</code> 适合列表或卡片内部，避免线条贴边。</p>
      <div class="usage-preview usage-preview--block">
        <div class="divider-spacing-grid">
          <div><b>紧凑列表</b><GDividerWithText variant="small" aria-hidden="true" /><span>small · 适合高密度数据</span></div>
          <div><b>常规内容</b><GDividerWithText variant="medium" aria-hidden="true" /><span>medium · 默认阅读节奏</span></div>
          <div><b>章节切换</b><GDividerWithText variant="large" aria-hidden="true" /><span>large · 更明确的内容分区</span></div>
          <div><b>卡片内缩</b><GDividerWithText :variant="['inset', 'dashed']" aria-hidden="true" /><span>inset · 与卡片内容对齐</span></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>垂直分割</h3>
      <p>垂直分割线只用于同一行控件或短文本之间，不承载文字。普通模式跟随当前行高，<code>stretch</code> 可在工具栏中撑满容器高度。</p>
      <div class="usage-preview divider-vertical-preview">
        <nav class="divider-inline-nav" aria-label="项目操作">
          <a href="#component-divider-with-text">概览</a>
          <GDividerWithText variant="vertical" role="separator" aria-orientation="vertical" />
          <a href="#component-divider-with-text">成员</a>
          <GDividerWithText :variant="['vertical', 'dashed']" role="separator" aria-orientation="vertical" />
          <a href="#component-divider-with-text">设置</a>
        </nav>
        <div class="divider-toolbar">
          <button type="button">撤销</button>
          <GDividerWithText :variant="['vertical', 'stretch']" role="separator" aria-orientation="vertical" />
          <button type="button">重做</button>
          <GDividerWithText :variant="['vertical', 'stretch', 'strong']" role="separator" aria-orientation="vertical" />
          <button type="button">导出</button>
        </div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>方向</b><code>horizontal</code><code>vertical</code><code>stretch</code></span>
      <span><b>位置</b><code>start</code><code>center</code><code>end</code></span>
      <span><b>线型</b><code>solid</code><code>dashed</code><code>dotted</code><code>double</code><code>strong</code></span>
      <span><b>间距</b><code>small</code><code>medium</code><code>large</code><code>inset</code></span>
      <span><b>语义</b><code>role="separator"</code><code>aria-orientation</code><code>aria-labelledby</code></span>
    </footer>
  </article>
</template>
`;export{e as default};