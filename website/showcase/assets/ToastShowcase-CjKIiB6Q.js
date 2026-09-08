var e=`<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { GButton, GToast, toast } from "@gardenerim/vue";

type ToastTone = "normal" | "info" | "success" | "warning" | "error" | "loading";

const lastEvent = ref("尚未触发运行时消息");
let loadingTimer: ReturnType<typeof setTimeout> | undefined;

const messages: Record<ToastTone, string> = {
  normal: "这是一条常规消息",
  info: "有一个新版本可供更新",
  success: "数据保存成功",
  warning: "请检查尚未完成的字段",
  error: "系统必须保留至少一个有效管理员",
  loading: "正在同步云端数据…",
};

const showTone = (tone: ToastTone, position: "top" | "bottom" = "top") => {
  toast({
    tone,
    position,
    message: messages[tone],
    timeout: tone === "loading" ? 0 : 4200,
    closable: true,
    onClose: (reason) => { lastEvent.value = \`\${tone} 已关闭：\${reason}\`; },
  });
  lastEvent.value = \`\${tone} · \${position}\`;
};

const showLoadingUpdate = () => {
  clearTimeout(loadingTimer);
  toast({ id: "toast-sync-demo", tone: "loading", message: "正在同步 12 个文件…", timeout: 0, closable: true });
  lastEvent.value = "loading 消息已创建";
  loadingTimer = setTimeout(() => {
    toast({ id: "toast-sync-demo", tone: "success", message: "12 个文件同步完成", timeout: 3200, closable: true });
    lastEvent.value = "相同 id 已原位更新为 success";
  }, 1400);
};

const showAction = () => {
  toast({
    tone: "normal",
    message: "项目已移入归档",
    actionLabel: "撤销",
    actionClose: true,
    timeout: 6000,
    onAction: () => {
      lastEvent.value = "已执行撤销操作";
      toast({ tone: "success", message: "已恢复项目", timeout: 2600 });
    },
  });
};

const showQueue = () => {
  ["设计稿上传完成", "代码检查通过", "预览环境已更新", "构建产物已生成", "部署任务已排队"].forEach((message, index) => {
    toast({ tone: index === 4 ? "success" : "info", message, timeout: 0, maxCount: 3, closable: true });
  });
  lastEvent.value = "连续创建 5 条，队列按 maxCount=3 收敛";
};

const clearAll = () => {
  toast.clear();
  lastEvent.value = "已清空全部消息";
};

onBeforeUnmount(() => clearTimeout(loadingTimer));
<\/script>

<template>
  <article id="component-toast" class="component-doc toast-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FEEDBACK / GLOBAL MESSAGE</span>
        <h2>全局消息 <span>Toast / GToast</span></h2>
        <p>参考 Arco Design Message：轻量反馈默认显示在页面顶部居中，不打断当前操作；复杂持久内容应交给 Notification 或 Alert。</p>
      </div>
      <span class="component-status">runtime-ready</span>
    </header>

    <section class="component-section">
      <div class="component-section__heading"><div><h3>消息类型</h3><p>状态通过图标和文字共同表达；错误使用即时 <code>alert</code>，其余使用礼貌的 <code>status</code>。</p></div></div>
      <div class="component-preview toast-static-stack">
        <GToast v-for="tone in (['normal', 'info', 'success', 'warning', 'error', 'loading'] as ToastTone[])" :key="tone" :state="tone" data-g-persistent="true" :role="tone === 'error' ? 'alert' : 'status'" :aria-busy="tone === 'loading' ? 'true' : undefined">
          <div class="g-toast-content"><div class="g-toast-message">{{ messages[tone] }}</div></div>
        </GToast>
      </div>
    </section>

    <section class="component-section">
      <div class="component-section__heading"><div><h3>内容与密度</h3><p>单行消息保持紧凑；标题、说明、操作和关闭按钮可按业务复杂度独立组合。</p></div></div>
      <div class="component-preview toast-variant-grid">
        <div><span>compact</span><GToast :variant="['compact', 'no-icon']" state="normal" data-g-persistent="true" role="status"><div class="g-toast-content"><div class="g-toast-message">已复制到剪贴板</div></div></GToast></div>
        <div><span>with-title</span><GToast :variant="['with-title', 'spacious']" state="info" data-g-persistent="true" role="status"><div class="g-toast-content"><div class="g-toast-title">更新可用</div><div class="g-toast-message">刷新页面后将应用新的权限策略。</div></div></GToast></div>
        <div><span>with-action</span><GToast variant="with-action" state="normal" data-g-persistent="true" role="status"><div class="g-toast-content"><div class="g-toast-message">项目已移入归档</div></div><button type="button" class="g-toast-action">撤销</button></GToast></div>
        <div><span>closable</span><GToast variant="closable" state="success" data-g-persistent="true" role="status"><div class="g-toast-content"><div class="g-toast-message">配置发布成功</div></div><button type="button" class="g-toast-close" aria-label="关闭">×</button></GToast></div>
      </div>
    </section>

    <section class="component-section">
      <div class="component-section__heading"><div><h3>运行时与位置</h3><p>支持顶部/底部、自动关闭、悬停与聚焦暂停、固定消息、同 id 更新、操作回调、数量上限和统一清空。</p></div></div>
      <div class="component-preview toast-runtime-demo">
        <div class="toast-control-group"><strong>语义状态</strong><div><GButton v-for="tone in (['normal', 'info', 'success', 'warning', 'error'] as ToastTone[])" :key="tone" :variant="tone === 'error' ? ['outline', 'danger'] : 'outline'" @click="showTone(tone)">{{ tone }}</GButton></div></div>
        <div class="toast-control-group"><strong>流程与队列</strong><div><GButton variant="outline" @click="showLoadingUpdate">Loading → Success</GButton><GButton variant="outline" @click="showAction">带撤销操作</GButton><GButton variant="outline" @click="showQueue">最大显示 3 条</GButton></div></div>
        <div class="toast-control-group"><strong>位置与管理</strong><div><GButton variant="outline" @click="showTone('info', 'bottom')">底部消息</GButton><GButton :variant="['outline', 'danger']" @click="clearAll">清空消息</GButton></div></div>
        <output class="toast-event-output" aria-live="polite">{{ lastEvent }}</output>
      </div>
    </section>

    <footer class="component-contract">
      <span><b>状态</b><code>normal</code><code>info</code><code>success</code><code>warning</code><code>error</code><code>loading</code></span>
      <span><b>能力</b><code>id update</code><code>maxCount</code><code>pause/resume</code><code>clear/config</code></span>
      <span><b>语义</b><code>role="status"</code><code>role="alert"</code><code>aria-live</code><code>aria-busy</code></span>
    </footer>
  </article>
</template>
`;export{e as default};