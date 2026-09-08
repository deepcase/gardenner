var e=`<script setup lang="ts">
import { GButton } from "@gardenerim/vue";
<\/script>

<template>
  <section id="system-lab" class="section system-lab">
    <div class="section-heading">
      <div><span class="section-kicker">DESIGN SYSTEM LAB</span><h2>完整设计语言验收</h2></div>
      <p>集中检查尺寸、状态、层级、数据密度、弹层与复杂业务组合；切换上方主题轴时全部同步响应。</p>
    </div>

    <div class="system-lab__grid">
      <article class="lab-panel lab-panel--wide">
        <header class="lab-panel__header"><div><h3>表单控件</h3><p>四种外观、四档尺寸和完整校验状态</p></div><span class="g-badge">Form</span></header>
        <div class="lab-panel__body control-lab">
          <div class="control-grid">
            <label class="g-field"><span class="g-label">Outlined</span><input class="g-input g-input-outlined" value="标准输入框" /></label>
            <label class="g-field"><span class="g-label">Filled</span><input class="g-input g-input-filled" value="填充输入框" /></label>
            <label class="g-field"><span class="g-label">Borderless</span><input class="g-input g-input-borderless" value="无边框输入框" /></label>
            <label class="g-field"><span class="g-label">Underlined</span><input class="g-input g-input-underlined" value="下划线输入框" /></label>
          </div>
          <div class="control-size-row" aria-label="输入框尺寸">
            <input class="g-input g-input-mini" value="Mini 24" aria-label="Mini input" />
            <input class="g-input g-input-small" value="Small 28" aria-label="Small input" />
            <input class="g-input g-input-medium" value="Medium 32" aria-label="Medium input" />
            <input class="g-input g-input-large" value="Large 36" aria-label="Large input" />
          </div>
          <div class="control-grid control-grid--states">
            <label class="g-field is-success"><span class="g-label">Success</span><input class="g-input is-success" value="校验通过" /><small class="g-field-feedback">✓ 名称可以使用</small></label>
            <label class="g-field is-warning"><span class="g-label">Warning</span><input class="g-input is-warning" value="即将达到限制" /><small class="g-field-feedback">还可以输入 8 个字符</small></label>
            <label class="g-field is-error"><span class="g-label">Error</span><input class="g-input is-error" value="重复的项目名称" aria-invalid="true" /><small class="g-field-feedback">该名称已经存在</small></label>
            <label class="g-field"><span class="g-label">Disabled</span><input class="g-input" value="不可编辑" disabled /></label>
          </div>
          <div class="choice-row">
            <label class="g-check"><input type="checkbox" checked /><span>复选框</span></label>
            <label class="g-radio"><input type="radio" checked /><span>单选框</span></label>
            <label class="g-switch"><input type="checkbox" checked /><span class="g-switch-track"></span><span>即时生效</span></label>
            <label class="g-switch g-switch-small"><input type="checkbox" /><span class="g-switch-track"></span><span>小尺寸</span></label>
            <input class="g-range" type="range" value="64" aria-label="完成度" />
          </div>
        </div>
      </article>

      <article class="lab-panel">
        <header class="lab-panel__header"><div><h3>导航与选择</h3><p>当前项、悬停、禁用和紧凑场景</p></div><span class="g-badge g-badge-info">Nav</span></header>
        <div class="lab-panel__body nav-lab">
          <div class="g-tabs" data-g-tabs>
            <div class="g-tab-list" role="tablist"><button class="g-tab" role="tab" aria-selected="true">概览</button><button class="g-tab" role="tab">数据</button><button class="g-tab" role="tab">设置</button><button class="g-tab" role="tab" aria-disabled="true">权限</button></div>
          </div>
          <div class="g-tabs g-tabs-pill" data-g-tabs><div class="g-tab-list" role="tablist"><button class="g-tab" role="tab" aria-selected="true">日</button><button class="g-tab" role="tab">周</button><button class="g-tab" role="tab">月</button></div></div>
          <div class="g-segmented g-segmented-block"><button class="g-segmented-item" aria-pressed="true">列表</button><button class="g-segmented-item">看板</button><button class="g-segmented-item">时间线</button></div>
          <ul class="g-menu nav-lab__menu"><li><button class="g-menu-item" aria-checked="true">最近打开 <kbd>⌘1</kbd></button></li><li><button class="g-menu-item">团队空间 <span class="g-menu-shortcut">⌘2</span></button></li><li class="g-menu-divider"></li><li><button class="g-menu-item g-menu-item-danger">移出项目</button></li></ul>
          <nav class="g-pagination" aria-label="分页"><a class="g-page-link" aria-disabled="true">‹</a><a class="g-page-link" aria-current="page">1</a><a class="g-page-link">2</a><a class="g-page-link">3</a><span>…</span><a class="g-page-link">12</a><a class="g-page-link">›</a></nav>
        </div>
      </article>

      <article class="lab-panel">
        <header class="lab-panel__header"><div><h3>反馈与进度</h3><p>语义色只表达状态，不替代正文层级</p></div><span class="g-badge g-badge-success">Feedback</span></header>
        <div class="lab-panel__body feedback-lab">
          <div class="g-alert g-alert-info"><div><strong class="g-alert-title">有可用更新</strong><p class="g-alert-description">刷新后将应用新的权限策略。</p></div><button class="g-alert-close" aria-label="关闭">×</button></div>
          <div class="g-alert g-alert-warning"><div><strong class="g-alert-title">存储空间不足</strong><p class="g-alert-description">剩余容量低于 10%，建议及时清理。</p></div></div>
          <div><div class="g-progress-label"><span>文件上传</span><span>68%</span></div><div class="g-progress"><div class="g-progress-bar" style="--g-progress-value:68%"></div></div></div>
          <div><div class="g-progress-label"><span>风险扫描</span><span>完成</span></div><div class="g-progress is-success"><div class="g-progress-bar" style="--g-progress-value:100%"></div></div></div>
          <div class="skeleton-card"><span class="g-skeleton g-skeleton-circle"></span><div><span class="g-skeleton g-skeleton-text"></span><span class="g-skeleton g-skeleton-text skeleton-short"></span></div></div>
        </div>
      </article>

      <article class="lab-panel lab-panel--wide">
        <header class="lab-panel__header"><div><h3>高密度数据</h3><p>排序、选中、状态、操作列和窄屏滚动</p></div><span class="g-badge g-badge-warning">Data</span></header>
        <div class="lab-panel__body">
          <div class="g-table-wrap">
            <table class="g-table g-table-hover g-table-bordered g-table-comfortable">
              <thead><tr><th><button class="g-sort-button" aria-sort="ascending">项目</button></th><th>负责人</th><th>状态</th><th>进度</th><th class="g-table-cell-actions">操作</th></tr></thead>
              <tbody>
                <tr class="is-selected"><td><strong>设计系统升级</strong><small class="table-secondary">核心组件与令牌</small></td><td>林默</td><td><span class="g-tag is-success">进行中</span></td><td><div class="g-progress g-progress-small"><div class="g-progress-bar" style="--g-progress-value:76%"></div></div></td><td class="g-table-cell-actions"><GButton variant="text">查看</GButton></td></tr>
                <tr><td><strong>移动端适配</strong><small class="table-secondary">触控与安全区</small></td><td>周宁</td><td><span class="g-tag is-warning">待复核</span></td><td><div class="g-progress g-progress-small is-warning"><div class="g-progress-bar" style="--g-progress-value:48%"></div></div></td><td class="g-table-cell-actions"><GButton variant="text">查看</GButton></td></tr>
                <tr><td><strong>无障碍审计</strong><small class="table-secondary">键盘与对比度</small></td><td>王砚</td><td><span class="g-tag is-danger">有风险</span></td><td><div class="g-progress g-progress-small is-danger"><div class="g-progress-bar" style="--g-progress-value:31%"></div></div></td><td class="g-table-cell-actions"><GButton variant="text">查看</GButton></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </article>

      <article class="lab-panel">
        <header class="lab-panel__header"><div><h3>日期与日程</h3><p>今天、区间、选中和禁用日期</p></div><span class="g-badge">Picker</span></header>
        <div class="lab-panel__body">
          <div class="g-date-picker lab-calendar">
            <div class="g-calendar-header"><GButton :variant="['text','icon']" aria-label="上个月">‹</GButton><strong class="g-calendar-title">2026 年 9 月</strong><GButton :variant="['text','icon']" aria-label="下个月">›</GButton></div>
            <div class="g-calendar-grid"><span v-for="day in ['一','二','三','四','五','六','日']" :key="day" class="g-calendar-weekday">{{ day }}</span><button v-for="day in 28" :key="day" class="g-calendar-day" :class="{ 'is-today': day === 3, 'is-in-range': day > 8 && day < 13, 'is-range-start': day === 8, 'is-range-end': day === 13 }" :aria-selected="day === 13">{{ day }}</button></div>
            <div class="g-date-picker-footer"><GButton variant="text">今天</GButton><GButton variant="primary">确定</GButton></div>
          </div>
        </div>
      </article>

      <article class="lab-panel">
        <header class="lab-panel__header"><div><h3>浮层与确认</h3><p>清晰的标题层级、滚动区域和操作区</p></div><span class="g-badge g-badge-info">Overlay</span></header>
        <div class="lab-panel__body overlay-lab">
          <div class="g-dialog quality-dialog" role="dialog" aria-labelledby="lab-dialog-title">
            <div class="g-dialog-header"><div><strong id="lab-dialog-title" class="g-dialog-title">发布当前版本？</strong><p class="g-card-subtitle">发布后所有成员都能看到本次改动。</p></div><button class="g-dialog-close" aria-label="关闭">×</button></div>
            <div class="g-dialog-body"><div class="g-alert g-alert-warning">还有 2 项检查未完成，可以稍后继续处理。</div></div>
            <div class="g-dialog-footer"><GButton variant="secondary">取消</GButton><GButton variant="primary">确认发布</GButton></div>
          </div>
        </div>
      </article>

      <article class="lab-panel lab-panel--wide">
        <header class="lab-panel__header"><div><h3>复杂业务组合</h3><p>看板、选择卡片、文件与商品信息共享同一交互语言</p></div><span class="g-badge g-badge-success">Composition</span></header>
        <div class="lab-panel__body composition-lab">
          <div class="g-kanban-column"><div class="g-kanban-header"><span>待处理</span><span class="g-badge">3</span></div><article class="g-kanban-card"><strong>补齐表单错误态</strong><p>输入框、选择器、日期选择</p><small>今天 16:00</small></article><article class="g-kanban-card"><strong>检查暗色主题</strong><p>浮层与禁用态对比度</p><small>明天</small></article></div>
          <article class="g-card g-card-hoverable"><div class="g-card-cover composition-cover"></div><div class="g-card-body"><strong class="g-card-title">可交互内容卡片</strong><p class="g-card-subtitle">支持封面、元信息、状态和底部操作。</p></div><div class="g-card-actions"><GButton variant="text">收藏</GButton><GButton variant="text">详情</GButton></div></article>
          <div class="g-transfer-list"><div class="g-transfer-header"><span>可选成员</span><span>3 项</span></div><div class="g-transfer-body"><label v-for="name in ['陈晓','林默','周宁']" :key="name" class="g-transfer-item"><input type="checkbox" /> <span>{{ name }}</span></label></div></div>
        </div>
      </article>

      <article class="lab-panel lab-panel--wide">
        <header class="lab-panel__header"><div><h3>逐组件深审补全</h3><p>展示组件的结构、状态和响应式能力；完整组件及变体请查看下方目录</p></div><span class="g-badge g-badge-success">结构 · 状态 · 响应式</span></header>
        <div class="lab-panel__body audit-lab">
          <div class="audit-summary" aria-label="组件质量审计摘要">
            <div><strong>506</strong><span>已逐项检查</span></div>
            <div><strong>91</strong><span>平均证据分</span></div>
            <div><strong>0</strong><span>大差距</span></div>
            <div><strong>0</strong><span>中差距</span></div>
          </div>

          <div class="audit-showcase-grid">
            <section class="audit-example">
              <div class="audit-example__heading"><div><strong>Filter Builder</strong><small>分组、校验、禁用、加载、空态</small></div><span class="g-tag is-success">P0 fixed</span></div>
              <div class="g-filter-builder">
                <div class="g-filter-builder-header"><strong>筛选条件</strong><GButton variant="text" size="small">清空</GButton></div>
                <div class="g-filter-group">
                  <div class="g-filter-group-header"><span class="g-filter-conjunction">AND</span><GButton :variant="['text','icon']" size="small" aria-label="新增条件">＋</GButton></div>
                  <div class="g-filter-rule"><select class="g-select g-select-small" aria-label="字段"><option>状态</option></select><select class="g-select g-select-small" aria-label="运算符"><option>等于</option></select><input class="g-input g-input-small" value="进行中" aria-label="值" /><GButton :variant="['text','icon']" size="small" aria-label="删除条件">×</GButton></div>
                  <div class="g-filter-rule is-invalid" aria-invalid="true"><select class="g-select g-select-small" aria-label="字段"><option>负责人</option></select><select class="g-select g-select-small" aria-label="运算符"><option>包含</option></select><input class="g-input g-input-small" placeholder="请选择成员" aria-label="值" /><GButton :variant="['text','icon']" size="small" aria-label="删除条件">×</GButton></div>
                </div>
              </div>
            </section>

            <section class="audit-example">
              <div class="audit-example__heading"><div><strong>Organization Chart</strong><small>层级连接、选中、折叠、溢出</small></div><span class="g-tag is-success">P0 fixed</span></div>
              <div class="org-chart-viewport">
                <div class="g-org-chart">
                  <ul class="g-org-level"><li class="g-org-branch"><article class="g-org-node is-selected" aria-selected="true"><span class="g-avatar">林</span><strong class="g-org-node-title">林默</strong><small class="g-org-node-meta">产品与设计负责人</small></article><ul class="g-org-children"><li class="g-org-branch"><article class="g-org-node"><strong class="g-org-node-title">体验设计</strong><small class="g-org-node-meta">8 人</small></article></li><li class="g-org-branch"><article class="g-org-node"><strong class="g-org-node-title">前端平台</strong><small class="g-org-node-meta">12 人</small></article></li></ul></li></ul>
                </div>
              </div>
            </section>

            <section class="audit-example">
              <div class="audit-example__heading"><div><strong>Rating + Actions</strong><small>尺寸、半星、键盘焦点、反馈态</small></div><span class="g-tag is-success">P0 fixed</span></div>
              <div class="rating-stack">
                <div class="g-rating is-small" role="radiogroup" aria-label="小尺寸评分"><button v-for="star in 5" :key="\`sm-\${star}\`" class="g-rating-item" :class="{ 'is-active': star <= 4 }" :aria-checked="star === 4" role="radio">★</button></div>
                <div class="g-rating" role="radiogroup" aria-label="标准评分"><button v-for="star in 5" :key="star" class="g-rating-item" :class="{ 'is-active': star <= 3 }" :aria-checked="star === 3" role="radio">★</button></div>
                <div class="g-rating is-large is-readonly" aria-label="只读评分"><span v-for="star in 5" :key="\`lg-\${star}\`" class="g-rating-item" :class="{ 'is-active': star <= 4 }">★</span></div>
              </div>
              <div class="audit-actions"><GButton data-g-copy data-g-copy-text="Gardenerim 2.1" variant="outline"><span aria-hidden="true">⧉</span> 复制</GButton><GButton data-g-copy class="is-copied" variant="outline"><span aria-hidden="true">✓</span> 已复制</GButton><GButton data-g-fullscreen aria-pressed="true" variant="outline"><span aria-hidden="true">⛶</span> 全屏中</GButton></div>
            </section>

            <section class="audit-example">
              <div class="audit-example__heading"><div><strong>Compact Form + Async State</strong><small>紧凑组合、连续边框、加载与错误反馈</small></div><span class="g-tag is-success">P0 fixed</span></div>
              <form class="g-form-compact" @submit.prevent>
                <label class="g-field"><span class="g-label">项目查询</span><span class="g-input-group"><select class="g-select"><option>名称</option></select><input class="g-input" value="Gardener" /><GButton variant="primary">搜索</GButton></span><small class="g-field-help">支持名称、负责人和标签。</small></label>
              </form>
              <div class="async-state-row"><div class="g-infinite-status is-loading" aria-busy="true"><span class="g-spinner"></span>正在加载更多</div><div class="g-pull-refresh is-ready"><span class="g-pull-refresh-indicator">↓</span><span>释放即可刷新</span></div><div class="g-infinite-status is-error"><span>!</span>加载失败，请重试</div></div>
            </section>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
`;export{e as default};