var e=`<script setup lang="ts">
import { ref } from "vue";
import { GContextBar } from "@gardenerim/vue";

const previewMode = ref("草稿版本");
const noticeVisible = ref(true);
const actionResult = ref("尚未执行操作");

const leavePreview = () => {
  previewMode.value = "正式版本";
  actionResult.value = "已退出草稿预览";
};

const retry = () => {
  actionResult.value = "正在重新连接数据源…";
  window.setTimeout(() => { actionResult.value = "数据源连接已恢复"; }, 900);
};
<\/script>

<template>
  <article id="component-context-bar" class="component-doc context-bar-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FEEDBACK / CONTEXTUAL MESSAGE</span>
        <h2>上下文提示条 <span>Context Bar / GContextBar</span></h2>
        <p>持续说明当前页面、抽屉、卡片或编辑模式的特殊上下文，并提供直接相关的恢复操作。它不会像 Toast 自动消失，也不替代阻断式 Dialog。</p>
      </div>
      <span class="component-status">css-ready</span>
    </header>

    <section class="usage-section">
      <h3>真实上下文与操作</h3>
      <p>标题先说明“当前发生了什么”，正文补充影响，操作直接回应当前上下文。长内容允许换行，不以省略号隐藏关键信息。</p>
      <div class="usage-preview usage-preview--block context-demo-surface">
        <div class="context-page-preview">
          <div class="context-page-toolbar"><strong>活动详情</strong><span>{{ previewMode }}</span></div>
          <GContextBar :variant="['soft', 'with-title']" state="info" role="region" aria-labelledby="context-preview-title" aria-describedby="context-preview-description">
            <div class="g-context-bar-body">
              <strong id="context-preview-title" class="g-context-bar-title">你正在查看未发布的草稿</strong>
              <span id="context-preview-description" class="g-context-bar-description">页面中的价格和库存可能与正式版本不同。</span>
              <span class="g-context-bar-meta"><span>最后保存：2 分钟前</span><span>编辑者：Lin</span></span>
            </div>
            <div class="g-context-bar-actions">
              <button class="g-context-bar-action" type="button" @click="actionResult = '已打开版本比较'">比较版本</button>
              <button class="g-context-bar-action" type="button" @click="leavePreview">退出预览</button>
            </div>
          </GContextBar>
          <div class="context-page-content"><span></span><span></span><span></span></div>
        </div>
        <output class="context-action-output" aria-live="polite">{{ actionResult }}</output>
      </div>
    </section>

    <section class="usage-section">
      <h3>语义状态</h3>
      <p>信息和完成状态可仅说明结果；警告和错误必须给出可执行的下一步。每种状态同时使用图标、标题和文字，不只依赖颜色。</p>
      <div class="usage-preview usage-preview--block context-state-stack">
        <GContextBar variant="soft" state="info" role="status" aria-live="polite">
          <div class="g-context-bar-body"><strong class="g-context-bar-title">报表使用昨天的数据</strong><span class="g-context-bar-description">今天的数据将在 14:30 完成同步。</span></div>
          <div class="g-context-bar-actions"><a class="g-context-bar-link" href="#component-context-bar">了解数据延迟</a></div>
        </GContextBar>
        <GContextBar variant="soft" state="success" role="status" aria-live="polite">
          <div class="g-context-bar-body"><strong class="g-context-bar-title">权限策略已更新</strong><span class="g-context-bar-description">新规则已应用到当前工作区。</span></div>
        </GContextBar>
        <GContextBar variant="soft" state="warning" role="region" aria-label="存储空间警告">
          <div class="g-context-bar-body"><strong class="g-context-bar-title">存储空间即将用完</strong><span class="g-context-bar-description">剩余 8%，上传大型文件可能失败。</span></div>
          <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button" @click="actionResult = '已打开存储管理'">管理存储</button></div>
        </GContextBar>
        <GContextBar variant="soft" state="error" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="g-context-bar-body"><strong class="g-context-bar-title">无法加载实时数据</strong><span class="g-context-bar-description">数据源连接已中断，当前页面显示缓存结果。</span></div>
          <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button" @click="retry">重新连接</button><a class="g-context-bar-link" href="#component-context-bar">查看状态</a></div>
        </GContextBar>
        <GContextBar :variant="['soft', 'with-title']" state="loading" role="status" aria-live="polite" aria-busy="true" style="--g-context-progress: 64%">
          <div class="g-context-bar-body"><strong class="g-context-bar-title">正在应用筛选条件</strong><span class="g-context-bar-description">已处理 640 / 1,000 条记录。</span></div>
          <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button">取消</button></div>
          <span class="g-context-bar-progress" aria-hidden="true" />
        </GContextBar>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观、层级与密度</h3>
      <p>低对比 soft 用于常规上下文，高对比 filled 用于必须注意的短期状态；banner 贯穿页面，borderless 适合嵌入已有容器。</p>
      <div class="usage-preview usage-preview--block context-variant-grid">
        <div v-for="variant in ['outlined', 'soft', 'filled', 'borderless', 'compact', 'spacious']" :key="variant">
          <code>{{ variant }}</code>
          <GContextBar :variant="[variant, 'with-title']" :state="variant === 'filled' ? 'warning' : 'info'" role="region" :aria-label="\`\${variant} 上下文提示\`">
            <div class="g-context-bar-body"><strong class="g-context-bar-title">上下文标题</strong><span class="g-context-bar-description">说明当前表面中的状态变化。</span></div>
            <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button">处理</button></div>
          </GContextBar>
        </div>
        <div class="context-banner-preview">
          <code>banner + center</code>
          <GContextBar :variant="['banner', 'center', 'soft']" state="info" role="region" aria-label="系统维护提醒">
            <div class="g-context-bar-body"><span class="g-context-bar-description">系统将在今晚 23:00 维护，预计持续 15 分钟。</span></div>
            <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button">查看计划</button></div>
          </GContextBar>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>重排、关闭与粘附</h3>
      <p>容器变窄时操作自动移到正文下方；可关闭消息应由业务决定是否再次出现。sticky 只粘附在所属表面，不应遮挡全局导航。</p>
      <div class="usage-preview usage-preview--block context-responsive-demo g-page-component-container">
        <GContextBar v-if="noticeVisible" :variant="['outlined', 'dismissible']" state="warning" role="region" aria-labelledby="context-responsive-title" data-g-dismissible>
          <div class="g-context-bar-body">
            <strong id="context-responsive-title" class="g-context-bar-title">部分筛选条件不适用于归档数据</strong>
            <span class="g-context-bar-description">“负责人在线”和“最近编辑时间”只对当前项目有效，继续查看时这两个条件会被忽略。</span>
          </div>
          <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button">调整筛选</button><button class="g-context-bar-action" type="button">仍然继续</button></div>
          <button class="g-context-bar-close" type="button" aria-label="关闭上下文提示" @click="noticeVisible = false">×</button>
        </GContextBar>
        <button v-else class="g-btn g-btn-outline" type="button" @click="noticeVisible = true">重新显示提示</button>
        <div class="context-sticky-panel">
          <GContextBar :variant="['sticky', 'compact', 'soft']" state="info" role="region" aria-label="粘附上下文条">
            <div class="g-context-bar-body"><span class="g-context-bar-description">当前仅显示有风险的变更</span></div>
            <div class="g-context-bar-actions"><button class="g-context-bar-action" type="button">清除范围</button></div>
          </GContextBar>
          <p v-for="line in 4" :key="line">变更记录 {{ line }} · 示例内容</p>
        </div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>结构</b><code>icon</code><code>body</code><code>title</code><code>description</code><code>meta</code><code>actions</code><code>close</code><code>progress</code></span>
      <span><b>外观</b><code>soft</code><code>outlined</code><code>filled</code><code>banner</code><code>borderless</code><code>stacked</code></span>
      <span><b>状态</b><code>info</code><code>success</code><code>warning</code><code>error</code><code>loading</code><code>disabled</code></span>
      <span><b>语义</b><code>region</code><code>status</code><code>alert</code><code>aria-live</code><code>aria-busy</code></span>
    </footer>
  </article>
</template>
`;export{e as default};