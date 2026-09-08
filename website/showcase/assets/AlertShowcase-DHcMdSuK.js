var e=`<script setup lang="ts">
import { ref } from "vue";
import { GAlert } from "@gardenerim/vue";

const closableVisible = ref(true);
const actionMessage = ref("尚未执行操作");
<\/script>

<template>
  <article id="component-alert" class="component-doc alert-documentation">
    <header class="component-doc__header">
      <div>
        <h2>警告提示 <span>Alert / GAlert</span></h2>
        <p>用于页面内持续展示需要关注的信息。图标和浅色背景表达状态，正文保持清晰可读，并支持标题、操作、关闭、横幅和加载场景。</p>
      </div>
      <span class="kind-badge kind-badge--css">CSS 组件</span>
    </header>

    <section class="usage-section">
      <h3>基本类型</h3>
      <p>默认占满可用宽度。普通通知使用 <code>status / polite</code>，需要立即介入的错误使用 <code>alert / assertive</code>。</p>
      <div class="usage-preview usage-preview--block">
        <div class="alert-demo-stack">
          <GAlert state="info" role="status" aria-live="polite" aria-atomic="true">
            <div class="g-alert-body"><p class="g-alert-content">系统将在今晚 23:00 进行例行维护。</p></div>
          </GAlert>
          <GAlert state="success" role="status" aria-live="polite" aria-atomic="true">
            <div class="g-alert-body"><p class="g-alert-content">配置已保存，新的权限策略立即生效。</p></div>
          </GAlert>
          <GAlert state="warning" role="status" aria-live="polite" aria-atomic="true">
            <div class="g-alert-body"><p class="g-alert-content">当前套餐将在 7 天后到期，请及时续费。</p></div>
          </GAlert>
          <GAlert state="error" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="g-alert-body"><p class="g-alert-content">无法连接到服务器，请检查网络后重试。</p></div>
          </GAlert>
          <GAlert state="normal" role="status">
            <div class="g-alert-body"><p class="g-alert-content">这是一条不带语义色和默认图标的普通提示。</p></div>
          </GAlert>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>标题与辅助说明</h3>
      <p>较复杂的信息使用 <code>with-title</code>，标题和说明拥有不同视觉层级；图标同步放大并与标题首行对齐。</p>
      <div class="usage-preview usage-preview--block">
        <div class="alert-demo-stack">
          <GAlert :variant="['with-title', 'spacious']" state="info" role="status" aria-labelledby="alert-info-title" aria-describedby="alert-info-description">
            <div class="g-alert-body">
              <h4 id="alert-info-title" class="g-alert-title">新版本可以安装</h4>
              <p id="alert-info-description" class="g-alert-description">Gardenerim 2.1.1 包含性能优化和无障碍修复，可在维护窗口内完成升级。</p>
            </div>
          </GAlert>
          <GAlert variant="with-title" state="warning" role="status" aria-labelledby="alert-warning-title" aria-describedby="alert-warning-description">
            <div class="g-alert-body">
              <h4 id="alert-warning-title" class="g-alert-title">存储空间即将不足</h4>
              <p id="alert-warning-description" class="g-alert-description">当前已使用 92%，达到上限后将暂停新的文件上传。</p>
            </div>
          </GAlert>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>可关闭与操作区</h3>
      <p>操作区独立于正文；关闭按钮必须是可聚焦的原生按钮，并提供可读名称。关闭结果通过现场区域反馈。</p>
      <div class="usage-preview usage-preview--block">
        <div class="alert-demo-stack">
          <GAlert v-if="closableVisible" :variant="['with-title', 'closable']" state="success" role="status" aria-labelledby="alert-close-title">
            <div class="g-alert-body">
              <h4 id="alert-close-title" class="g-alert-title">导入任务已经完成</h4>
              <p class="g-alert-content">成功导入 128 条记录，2 条重复记录已跳过。</p>
            </div>
            <button class="g-alert-close" type="button" aria-label="关闭导入结果" @click="closableVisible = false">×</button>
          </GAlert>
          <GAlert v-else variant="outlined" state="normal" role="status">
            <div class="g-alert-body"><p class="g-alert-content">提示已关闭。</p></div>
            <div class="g-alert-action"><button type="button" @click="closableVisible = true">重新显示</button></div>
          </GAlert>

          <GAlert variant="with-title" state="error" role="alert" aria-labelledby="alert-action-title">
            <div class="g-alert-body">
              <h4 id="alert-action-title" class="g-alert-title">发布失败</h4>
              <p class="g-alert-description">服务器没有响应，草稿已经安全保存在本地。</p>
            </div>
            <div class="g-alert-actions">
              <button type="button" @click="actionMessage = '已打开错误详情'">查看详情</button>
              <button type="button" @click="actionMessage = '正在重新发布'">重试</button>
            </div>
          </GAlert>
          <output class="alert-live-result" aria-live="polite">{{ actionMessage }}</output>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观变体</h3>
      <p><code>soft</code> 适合常规页面提示，<code>outlined</code> 用于弱背景，<code>filled</code> 用于高强调，<code>accent</code> 强化左侧状态边界。</p>
      <div class="usage-preview usage-preview--block">
        <div class="alert-variant-grid">
          <div><span>soft</span><GAlert variant="soft" state="info"><div class="g-alert-body"><p class="g-alert-content">浅色背景提示</p></div></GAlert></div>
          <div><span>outlined</span><GAlert variant="outlined" state="success"><div class="g-alert-body"><p class="g-alert-content">描边提示</p></div></GAlert></div>
          <div><span>filled</span><GAlert variant="filled" state="warning"><div class="g-alert-body"><p class="g-alert-content">高强调提示</p></div></GAlert></div>
          <div><span>accent</span><GAlert variant="accent" state="error"><div class="g-alert-body"><p class="g-alert-content">强调边界提示</p></div></GAlert></div>
          <div><span>borderless</span><GAlert variant="borderless" state="info"><div class="g-alert-body"><p class="g-alert-content">无边框提示</p></div></GAlert></div>
          <div><span>compact</span><GAlert variant="compact" state="success"><div class="g-alert-body"><p class="g-alert-content">紧凑提示</p></div></GAlert></div>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>横幅、居中与加载</h3>
      <p>横幅会移除圆角和边框以贴合页面边缘；居中适合全局公告；加载状态使用旋转图标并通过 <code>aria-busy</code> 暴露进度语义。</p>
      <div class="usage-preview usage-preview--block alert-special-preview">
        <GAlert variant="banner" state="warning" role="status"><div class="g-alert-body"><p class="g-alert-content">安全公告：请在 9 月 12 日前更新登录密码。</p></div></GAlert>
        <GAlert :variant="['center', 'borderless']" state="info" role="status"><div class="g-alert-body"><p class="g-alert-content">服务运行正常 · 最近更新于 2 分钟前</p></div></GAlert>
        <GAlert state="loading" role="status" aria-live="polite" aria-busy="true"><div class="g-alert-body"><p class="g-alert-content">正在校验上传文件，请勿关闭页面……</p></div></GAlert>
      </div>
    </section>

    <section class="usage-section">
      <h3>自定义图标与无图标</h3>
      <p>业务可以提供自己的图标；纯文字提示使用 <code>no-icon</code> 明确关闭默认图标，而不是依靠隐藏内容。</p>
      <div class="usage-preview usage-preview--block">
        <div class="alert-demo-stack">
          <GAlert state="info" role="status">
            <span class="g-alert-icon" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M10 2.5 17 6v8l-7 3.5L3 14V6z"/><path d="m7 10 2 2 4-4"/></svg></span>
            <div class="g-alert-body"><p class="g-alert-content">自定义安全验证图标。</p></div>
          </GAlert>
          <GAlert variant="no-icon" state="normal" role="status"><div class="g-alert-body"><p class="g-alert-content">不需要图标的中性辅助信息。</p></div></GAlert>
        </div>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>结构</b><code>icon</code><code>body</code><code>title</code><code>content</code><code>action</code><code>close</code></span>
      <span><b>类型</b><code>normal</code><code>info</code><code>success</code><code>warning</code><code>error</code><code>loading</code></span>
      <span><b>外观</b><code>soft</code><code>outlined</code><code>filled</code><code>banner</code><code>center</code><code>compact</code><code>spacious</code></span>
      <span><b>语义</b><code>role="status"</code><code>role="alert"</code><code>aria-live</code><code>aria-busy</code></span>
    </footer>
  </article>
</template>
`;export{e as default};