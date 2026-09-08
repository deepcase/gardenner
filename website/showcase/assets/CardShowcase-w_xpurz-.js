var e=`<script setup lang="ts">
import { ref } from "vue";
import { GButton, GCard } from "@gardenerim/vue";
import DemoIcon from "./DemoIcon.vue";

const selectedPlan = ref("team");
const plans = [
  { id: "starter", name: "Starter", price: "¥0", description: "适合个人项目与原型验证" },
  { id: "team", name: "Team", price: "¥69", description: "协作、权限和版本记录" },
  { id: "business", name: "Business", price: "¥199", description: "审计、单点登录与高级支持" },
] as const;
<\/script>

<template>
  <article id="component-card" class="component-doc card-documentation">
    <header class="component-doc__header">
      <div>
        <h2>卡片 <span>Card / GCard</span></h2>
        <p>将同一主题的信息聚合为标题、内容、媒体、元信息与操作区域，既可用于内容概览，也可作为明确的任务入口。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section id="card-basic" class="usage-section">
      <h3>基本用法</h3>
      <p>标准卡片包含 header、body 和可选 extra；各区域使用真实结构，不再用部件名称占位。</p>
      <div class="usage-preview card-demo-gallery">
        <GCard class="card-demo-card">
          <div class="g-card-header">
            <div class="g-card-header-main"><h4 class="g-card-title">Gardenerim Card</h4><p class="g-card-subtitle">最近更新于 5 分钟前</p></div>
            <a class="g-card-extra" href="#card-api">更多</a>
          </div>
          <div class="g-card-body"><p>常规内容容器，可承载文字、列表、图片和复杂业务信息，用于模块划分与内容概览。</p></div>
        </GCard>
        <GCard class="card-demo-card">
          <div class="g-card-header"><div class="g-card-header-main"><h4 class="g-card-title">带底部区域</h4></div><span class="g-badge g-badge-success">运行中</span></div>
          <div class="g-card-body"><p>页脚适合放置补充信息，操作按钮则应放入独立 actions 区域。</p></div>
          <div class="g-card-footer">上次同步：今天 14:20</div>
        </GCard>
      </div>
    </section>

    <section id="card-appearance" class="usage-section">
      <h3>边框、阴影与悬浮</h3>
      <p><code>bordered</code>、<code>borderless</code>、<code>elevated</code> 可适配不同页面层级；<code>hoverable</code> 只在卡片确实可操作时使用。</p>
      <div class="usage-preview card-surface-preview">
        <GCard v-for="item in [
          { variant: 'bordered', title: 'Bordered', desc: '清晰分隔的信息区域' },
          { variant: 'borderless', title: 'Borderless', desc: '适合有底色的页面容器' },
          { variant: 'elevated', title: 'Elevated', desc: '强调浮起的视觉层级' },
          { variant: 'hoverable', title: 'Hoverable', desc: '指针与键盘均有反馈' },
        ]" :key="item.variant" :variant="item.variant" :class="['card-surface-sample', { 'surface-on-fill': item.variant === 'borderless' }]" :tabindex="item.variant === 'hoverable' ? 0 : undefined">
          <div class="g-card-body"><strong class="g-card-title">{{ item.title }}</strong><p class="g-card-subtitle">{{ item.desc }}</p></div>
        </GCard>
      </div>
    </section>

    <section id="card-content" class="usage-section">
      <h3>简洁内容卡片</h3>
      <p>卡片可以只有内容区域，适合成员、文件或轻量入口，避免为不存在的层级强行添加 header。</p>
      <div class="usage-preview card-demo-gallery">
        <GCard variant="hoverable" class="card-identity" tabindex="0">
          <div class="g-card-body">
            <div class="g-card-meta"><span class="g-avatar g-card-meta-avatar">林</span><div class="g-card-meta-content"><strong class="g-card-meta-title">林默</strong><p class="g-card-meta-description">产品设计 · 在线</p></div><a class="g-card-extra" href="#card-meta">查看</a></div>
          </div>
        </GCard>
        <GCard variant="hoverable" class="card-identity" tabindex="0">
          <div class="g-card-body">
            <div class="g-card-meta"><span class="g-avatar g-avatar-square g-card-meta-avatar">UI</span><div class="g-card-meta-content"><strong class="g-card-meta-title">design-system.fig</strong><p class="g-card-meta-description">24.8 MB · 刚刚更新</p></div><button class="g-card-extra">打开</button></div>
          </div>
        </GCard>
      </div>
    </section>

    <section id="card-meta" class="usage-section">
      <h3>封面、元信息与操作</h3>
      <p>cover、meta、avatar、description 与 actions 形成完整内容卡结构；操作区保证等分、分隔线、悬浮和键盘焦点一致。</p>
      <div class="usage-preview card-demo-gallery">
        <GCard variant="hoverable" class="card-media-demo" tabindex="0">
          <div class="g-card-cover card-cover-art card-cover-art--violet" role="img" aria-label="紫色抽象设计封面"><span>Design language</span></div>
          <div class="g-card-body">
            <div class="g-card-meta"><span class="g-avatar g-card-meta-avatar">G</span><div class="g-card-meta-content"><h4 class="g-card-meta-title">统一组件设计语言</h4><p class="g-card-meta-description">从颜色、间距到交互状态，建立可持续维护的产品体验。</p></div></div>
          </div>
          <div class="g-card-actions"><button class="g-card-action"><DemoIcon name="plus" />收藏</button><button class="g-card-action"><DemoIcon name="more" />更多</button></div>
        </GCard>
        <GCard variant="hoverable" class="card-media-demo" tabindex="0">
          <div class="g-card-cover card-cover-art card-cover-art--cyan" role="img" aria-label="青色数据看板封面"><span>Product analytics</span></div>
          <div class="g-card-body"><h4 class="g-card-title">数据看板模板</h4><p class="g-card-subtitle">12 个图表 · 支持暗色主题</p></div>
          <div class="g-card-actions"><button class="g-card-action">预览</button><button class="g-card-action">使用模板</button></div>
        </GCard>
      </div>
    </section>

    <section id="card-size" class="usage-section">
      <h3>卡片尺寸</h3>
      <p>提供 <code>small</code>、<code>medium</code>、<code>large</code> 三档密度；<code>compact</code> 作为 small 的兼容别名。</p>
      <div class="usage-preview card-size-gallery">
        <GCard v-for="size in ['small', 'medium', 'large']" :key="size" :variant="size" class="card-size-sample">
          <div class="g-card-header"><div class="g-card-header-main"><strong class="g-card-title">{{ size }}</strong></div><span class="g-badge">{{ size === 'small' ? '紧凑' : size === 'large' ? '宽松' : '默认' }}</span></div>
          <div class="g-card-body"><p>标题、内容和页脚内边距随密度同步变化。</p></div>
        </GCard>
      </div>
    </section>

    <section id="card-grid" class="usage-section">
      <h3>网格型内嵌卡片</h3>
      <p><code>g-card-grid</code> 用于系统概览或能力入口；移动端自动从四列收敛为两列。</p>
      <div class="usage-preview usage-preview--block">
        <GCard class="card-grid-shell">
          <div class="g-card-header"><div class="g-card-header-main"><h4 class="g-card-title">工作区概览</h4><p class="g-card-subtitle">本周数据</p></div><a class="g-card-extra" href="#card-api">查看报告</a></div>
          <div class="g-card-grid">
            <div v-for="item in [{n:'24',l:'活跃项目'},{n:'128',l:'任务'},{n:'86%',l:'完成率'},{n:'12',l:'成员'}]" :key="item.l" class="g-card-grid-item g-card-hoverable" tabindex="0"><strong>{{ item.n }}</strong><span>{{ item.l }}</span></div>
          </div>
        </GCard>
      </div>
    </section>

    <section id="card-inner" class="usage-section">
      <h3>内部卡片</h3>
      <p>嵌套卡片使用 <code>inner</code> 降低圆角和层级，避免多个高阴影表面互相争夺注意力。</p>
      <div class="usage-preview usage-preview--block">
        <GCard class="card-nested-shell">
          <div class="g-card-header"><div class="g-card-header-main"><h4 class="g-card-title">发布检查</h4><p class="g-card-subtitle">2 个环境等待确认</p></div></div>
          <div class="g-card-body">
            <GCard v-for="env in [{name:'预发布环境',status:'已通过'},{name:'生产环境',status:'待确认'}]" :key="env.name" variant="inner">
              <div class="g-card-header"><div class="g-card-header-main"><strong class="g-card-title">{{ env.name }}</strong></div><span :class="['g-badge', env.status === '已通过' ? 'g-badge-success' : 'g-badge-warning']">{{ env.status }}</span></div>
              <div class="g-card-body">依赖、配置和数据库迁移均已完成扫描。</div>
            </GCard>
          </div>
        </GCard>
      </div>
    </section>

    <section id="card-horizontal" class="usage-section">
      <h3>横向卡片</h3>
      <p>横向结构适合搜索结果、文章或商品预览；窄屏自动切换为纵向，不挤压正文和操作。</p>
      <div class="usage-preview usage-preview--block">
        <GCard variant="horizontal" class="card-horizontal-demo">
          <div class="g-card-cover card-cover-art card-cover-art--green" role="img" aria-label="绿色工作流封面"><span>Workflow</span></div>
          <div class="g-card-main">
            <div class="g-card-header"><div class="g-card-header-main"><h4 class="g-card-title">自动化工作流</h4><p class="g-card-subtitle">效率 · 8 分钟阅读</p></div><span class="g-badge g-badge-info">新文章</span></div>
            <div class="g-card-body"><p>把审批、通知和发布步骤串联成可追踪、可复用的团队流程。</p></div>
            <div class="g-card-actions"><button class="g-card-action">稍后阅读</button><button class="g-card-action">阅读全文</button></div>
          </div>
        </GCard>
      </div>
    </section>

    <section id="card-state" class="usage-section">
      <h3>可选择、加载与禁用状态</h3>
      <p>可选卡使用明确边框和勾选标识；加载态保留布局并展示进度；禁用态阻止内部交互。</p>
      <div class="usage-preview card-state-gallery">
        <GCard v-for="plan in plans" :key="plan.id" variant="selectable" :state="selectedPlan === plan.id ? 'selected' : undefined" role="button" tabindex="0" :aria-pressed="selectedPlan === plan.id" @click="selectedPlan = plan.id" @keydown.enter.prevent="selectedPlan = plan.id" @keydown.space.prevent="selectedPlan = plan.id">
          <div class="g-card-body"><strong class="g-card-title">{{ plan.name }}</strong><b class="card-plan-price">{{ plan.price }}</b><p class="g-card-subtitle">{{ plan.description }}</p></div>
        </GCard>
        <GCard state="loading" aria-busy="true"><div class="g-card-header"><strong class="g-card-title">正在加载</strong></div><div class="g-card-body"><p>内容尺寸保持稳定，完成后不会造成页面跳动。</p></div></GCard>
        <GCard state="disabled" aria-disabled="true"><div class="g-card-header"><strong class="g-card-title">不可用卡片</strong></div><div class="g-card-body"><p>当前账户没有访问权限。</p><GButton variant="primary" disabled>打开</GButton></div></GCard>
      </div>
    </section>

    <section id="card-api" class="usage-section">
      <h3>API 对照</h3>
      <p>四个框架共享同一 Card 元数据；外观通过 <code>variant</code>，运行状态通过 <code>state</code>，内容结构使用统一部件类。</p>
      <div class="button-api-wrap">
        <table class="button-api-table">
          <thead><tr><th>能力</th><th>可选值 / 部件</th><th>Vue / React</th><th>AngularJS</th><th>Blazor</th></tr></thead>
          <tbody>
            <tr><td>表面</td><td><code>bordered | borderless | elevated | hoverable</code></td><td><code>variant</code></td><td><code>gardener-variant</code></td><td><code>Variant</code></td></tr>
            <tr><td>尺寸</td><td><code>small | medium | large</code></td><td><code>variant</code></td><td><code>gardener-variant</code></td><td><code>Variant</code></td></tr>
            <tr><td>布局</td><td><code>horizontal | inner | selectable</code></td><td><code>variant</code></td><td><code>gardener-variant</code></td><td><code>Variant</code></td></tr>
            <tr><td>状态</td><td><code>loading | selected | disabled</code></td><td><code>state</code></td><td><code>gardener-state</code></td><td><code>State</code></td></tr>
            <tr><td>结构</td><td><code>header | extra | cover | meta | body | footer | actions | grid</code></td><td colspan="3">使用同名 <code>g-card-*</code> 部件类组合</td></tr>
          </tbody>
        </table>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>根节点</b><code>.g-card</code><code>GCard</code></span>
      <span><b>内容</b><code>.g-card-header</code><code>.g-card-body</code><code>.g-card-footer</code><code>.g-card-cover</code><code>.g-card-meta</code></span>
      <span><b>组合</b><code>.g-card-actions</code><code>.g-card-grid</code><code>.g-card-inner</code><code>.g-card-horizontal</code></span>
    </footer>
  </article>
</template>
`;export{e as default};