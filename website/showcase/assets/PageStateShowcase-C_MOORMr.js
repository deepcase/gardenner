var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GButton, GPageStateSystem } from "@gardenerim/vue";

type ExceptionKind = "403" | "404" | "500";

const activeException = ref<ExceptionKind>("404");
const actionMessage = ref("尚未执行操作");

const exception = computed(() => ({
  "403": {
    title: "你没有访问这个项目的权限",
    description: "该项目仅对财务团队开放。你可以申请访问权限，或者返回自己有权限的工作区。",
    eyebrow: "访问受限",
    primary: "申请权限",
    secondary: "返回工作区",
  },
  "404": {
    title: "没有找到这个页面",
    description: "链接可能已经失效、内容被移动，或者地址输入有误。可以返回首页或从常用入口继续。",
    eyebrow: "页面不存在",
    primary: "返回首页",
    secondary: "返回上一页",
  },
  "500": {
    title: "服务器暂时无法响应",
    description: "你的数据没有丢失。请稍后重试；如果问题持续出现，可复制请求编号并联系技术支持。",
    eyebrow: "服务异常",
    primary: "重新加载",
    secondary: "查看服务状态",
  },
}[activeException.value]));

const handleAction = (label: string) => {
  actionMessage.value = \`已执行：\${label}\`;
};
<\/script>

<template>
  <article id="component-page-state-system" class="component-doc page-state-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FEEDBACK / RESULT &amp; EXCEPTION</span>
        <h2>页面状态系统 <span>Page State System / GPageStateSystem</span></h2>
        <p>统一表达操作结果、空页面、访问异常和服务中断。状态图形负责快速识别，标题说明发生了什么，正文解释影响，操作帮助用户继续前进。</p>
      </div>
      <span class="component-status">css-ready</span>
    </header>

    <section class="usage-section">
      <h3>操作结果</h3>
      <p>成功、警告和失败结果使用一致的内容结构，但操作层级不同：主按钮给出最合理的下一步，次按钮提供退路。</p>
      <div class="usage-preview usage-preview--block page-state-result-grid">
        <GPageStateSystem v-for="item in [
          { variant: 'success', title: '发布成功', description: '版本 v2.1 已发布给 24 位团队成员。', primary: '查看版本', secondary: '继续编辑' },
          { variant: 'info', title: '设置已保存', description: '新设置将在下次进入工作区时生效。', primary: '查看设置', secondary: '知道了' },
          { variant: 'warning', title: '发布完成，但有 2 项提醒', description: '搜索索引仍在更新，部分用户暂时看不到最新内容。', primary: '查看提醒', secondary: '返回项目' },
          { variant: 'error', title: '提交失败', description: '有 3 个字段未通过验证，请修改后再次提交。', primary: '返回修改', secondary: '保存草稿' },
        ]" :key="item.variant" :variant="['card', 'compact', item.variant]" :state="item.variant" role="status" aria-live="polite">
          <div class="g-page-state-content">
            <div class="g-page-state-visual" aria-hidden="true" />
            <div class="g-page-state-body">
              <h3 class="g-page-state-title">{{ item.title }}</h3>
              <p class="g-page-state-description">{{ item.description }}</p>
              <div class="g-page-state-actions">
                <button class="g-page-state-action g-page-state-primary-action" type="button" @click="handleAction(item.primary)">{{ item.primary }}</button>
                <button class="g-page-state-action g-page-state-secondary-action" type="button" @click="handleAction(item.secondary)">{{ item.secondary }}</button>
              </div>
            </div>
          </div>
        </GPageStateSystem>
        <output class="page-state-action-output" aria-live="polite">{{ actionMessage }}</output>
      </div>
    </section>

    <section class="usage-section">
      <h3>403 / 404 / 500 异常页</h3>
      <p>异常页不能只显示错误码。需要解释原因、保护用户对数据安全的判断，并提供与当前异常匹配的恢复路径。</p>
      <div class="page-state-exception-tabs" role="tablist" aria-label="异常页场景">
        <button v-for="kind in (['403', '404', '500'] as ExceptionKind[])" :key="kind" role="tab" :aria-selected="activeException === kind" :class="{ 'is-active': activeException === kind }" type="button" @click="activeException = kind">{{ kind }}</button>
      </div>
      <div class="usage-preview usage-preview--block page-state-exception-preview g-page-component-container">
        <GPageStateSystem :variant="[activeException, 'split', 'card']" :state="activeException === '403' ? 'forbidden' : activeException === '404' ? 'not-found' : 'server-error'" role="region" aria-labelledby="exception-state-title" aria-describedby="exception-state-description">
          <div class="g-page-state-content">
            <div class="g-page-state-visual" aria-hidden="true" />
            <div class="g-page-state-body">
              <span class="g-page-state-eyebrow">{{ exception.eyebrow }}</span>
              <strong class="g-page-state-code">{{ activeException }}</strong>
              <h3 id="exception-state-title" class="g-page-state-title">{{ exception.title }}</h3>
              <p id="exception-state-description" class="g-page-state-description">{{ exception.description }}</p>
              <div v-if="activeException === '500'" class="g-page-state-metadata"><span>发生时间：2026-09-04 14:32</span><span class="g-page-state-request-id">请求编号：req_7F2A91</span></div>
              <div class="g-page-state-actions">
                <button class="g-page-state-action g-page-state-primary-action" type="button" @click="handleAction(exception.primary)">{{ exception.primary }}</button>
                <button class="g-page-state-action g-page-state-secondary-action" type="button" @click="handleAction(exception.secondary)">{{ exception.secondary }}</button>
              </div>
              <ul v-if="activeException === '404'" class="g-page-state-suggestions" aria-label="常用入口">
                <li><a class="g-page-state-suggestion" href="#component-page-state-system"><strong>项目列表</strong><small>继续浏览最近项目</small></a></li>
                <li><a class="g-page-state-suggestion" href="#component-page-state-system"><strong>帮助中心</strong><small>搜索使用文档</small></a></li>
              </ul>
              <details v-if="activeException === '500'" class="g-page-state-details">
                <summary class="g-page-state-detail-summary">技术诊断信息</summary>
                <div class="g-page-state-detail-body"><span>HTTP 500 · gateway/service unavailable</span><span>Trace: req_7F2A91 · Region: cn-east-2</span></div>
              </details>
            </div>
          </div>
        </GPageStateSystem>
      </div>
    </section>

    <section class="usage-section">
      <h3>断网、维护与浏览器兼容</h3>
      <p>临时故障要告诉用户数据是否安全、何时恢复以及可以做什么；技术诊断信息默认折叠，避免抢占主要内容。</p>
      <div class="usage-preview usage-preview--block page-state-service-grid">
        <GPageStateSystem :variant="['offline', 'card', 'left']" state="offline" role="status" aria-live="polite">
          <div class="g-page-state-content">
            <div class="g-page-state-visual" aria-hidden="true" />
            <div class="g-page-state-body"><span class="g-page-state-eyebrow">网络不可用</span><h3 class="g-page-state-title">你当前处于离线状态</h3><p class="g-page-state-description">未提交的编辑已保存在本机，恢复连接后会自动同步。</p><div class="g-page-state-actions"><button class="g-page-state-action g-page-state-primary-action" type="button">重新连接</button><button class="g-page-state-action" type="button">继续离线使用</button></div><div class="g-page-state-help">仍有问题？<a class="g-page-state-link" href="#component-page-state-system">运行网络诊断</a></div></div>
          </div>
        </GPageStateSystem>
        <GPageStateSystem :variant="['maintenance', 'card', 'left']" state="maintenance" role="region" aria-labelledby="maintenance-title">
          <div class="g-page-state-content">
            <div class="g-page-state-visual" aria-hidden="true" />
            <div class="g-page-state-body"><span class="g-page-state-eyebrow">计划维护</span><h3 id="maintenance-title" class="g-page-state-title">服务将在 15:00 恢复</h3><p class="g-page-state-description">我们正在升级存储系统。维护期间可以查看数据，但不能上传或修改文件。</p><div class="g-page-state-metadata"><span>预计剩余 28 分钟</span><span>最后更新：14:32</span></div><div class="g-page-state-actions"><a class="g-page-state-action g-page-state-primary-action" href="#component-page-state-system">查看维护进度</a></div></div>
          </div>
        </GPageStateSystem>
        <GPageStateSystem :variant="['browser-unsupported', 'card', 'left']" state="warning" role="region" aria-labelledby="browser-title">
          <div class="g-page-state-content">
            <div class="g-page-state-visual" aria-hidden="true" />
            <div class="g-page-state-body"><span class="g-page-state-eyebrow">浏览器不受支持</span><h3 id="browser-title" class="g-page-state-title">请升级浏览器后继续</h3><p class="g-page-state-description">当前浏览器缺少安全登录所需的功能。建议使用最新版 Chrome、Edge、Firefox 或 Safari。</p><div class="g-page-state-actions"><button class="g-page-state-action g-page-state-primary-action" type="button">查看升级方法</button></div></div>
          </div>
        </GPageStateSystem>
      </div>
    </section>

    <section class="usage-section">
      <h3>嵌入式与空页面场景</h3>
      <p>整页异常使用居中或 split；卡片内部使用 compact；工具栏或列表中的可恢复状态使用 inline，避免小区域出现巨大的插画。</p>
      <div class="usage-preview usage-preview--block page-state-layout-stack g-page-component-container">
        <GPageStateSystem :variant="['no-results', 'inline']" state="normal" role="status">
          <div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true" /><div class="g-page-state-body"><h3 class="g-page-state-title">没有匹配“季度预算”的结果</h3><p class="g-page-state-description">尝试缩短关键词或清除筛选条件。</p></div><div class="g-page-state-actions"><button class="g-page-state-action" type="button">清除筛选</button></div></div>
        </GPageStateSystem>
        <GPageStateSystem :variant="['first-use', 'compact', 'card']" state="normal" role="region" aria-labelledby="first-use-title">
          <div class="g-page-state-content"><div class="g-page-state-visual" aria-hidden="true" /><div class="g-page-state-body"><span class="g-page-state-eyebrow">开始使用</span><h3 id="first-use-title" class="g-page-state-title">创建第一个自动化规则</h3><p class="g-page-state-description">规则可以在状态变化时自动通知负责人。</p><div class="g-page-state-actions"><button class="g-page-state-action g-page-state-primary-action" type="button">创建规则</button><a class="g-page-state-action" href="#component-page-state-system">查看示例</a></div></div></div>
        </GPageStateSystem>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>场景</b><code>success</code><code>info</code><code>warning</code><code>error</code><code>403</code><code>404</code><code>500</code><code>offline</code><code>maintenance</code></span>
      <span><b>布局</b><code>compact</code><code>inline</code><code>card</code><code>full-page</code><code>split</code><code>left</code></span>
      <span><b>结构</b><code>visual</code><code>body</code><code>metadata</code><code>details</code><code>actions</code><code>suggestions</code></span>
      <span><b>语义</b><code>status</code><code>alert</code><code>region</code><code>aria-live</code><code>aria-labelledby</code></span>
    </footer>
  </article>
</template>
`;export{e as default};