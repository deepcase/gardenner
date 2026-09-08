var e=`<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { GFileDrop } from "@gardenerim/vue";

type UploadStatus = "ready" | "uploading" | "success" | "error" | "rejected";
type UploadItem = { id: number; name: string; size: number; kind: string; status: UploadStatus; progress: number; message?: string };
type RejectedFile = { file: File; reasons: string[] };
type FileEventDetail = { acceptedFiles: File[]; rejectedFiles: RejectedFile[]; source: "input" | "drop" | "paste" | "api" };

const host = ref<HTMLElement | null>(null);
const nextId = ref(10);
const feedback = ref("尚未选择文件");
const selectedFiles = ref<UploadItem[]>([]);
const uploadQueue = ref<UploadItem[]>([
  { id: 1, name: "brand-assets.zip", size: 8_704_512, kind: "ZIP", status: "uploading", progress: 68 },
  { id: 2, name: "release-notes.pdf", size: 1_425_408, kind: "PDF", status: "success", progress: 100 },
  { id: 3, name: "product-preview.mov", size: 24_117_248, kind: "MOV", status: "error", progress: 36, message: "网络中断，请重试" },
]);

const formatSize = (bytes: number) => bytes >= 1_048_576 ? \`\${(bytes / 1_048_576).toFixed(1)} MB\` : \`\${Math.max(1, Math.round(bytes / 1024))} KB\`;
const extension = (name: string) => name.split(".").pop()?.slice(0, 4).toUpperCase() || "FILE";
const reasonText = (reasons: string[]) => reasons.map((reason) => ({ type: "文件格式不受支持", size: "文件超过 5 MB", count: "最多选择 5 个文件" }[reason] || reason)).join("；");
const statusText = (item: UploadItem) => ({ ready: "等待上传", uploading: \`\${item.progress}%\`, success: "上传完成", error: item.message || "上传失败", rejected: item.message || "文件不可用" }[item.status]);

const receiveFiles = (event: Event) => {
  const detail = (event as CustomEvent<FileEventDetail>).detail;
  if (!detail) return;
  const accepted = detail.acceptedFiles.map((file) => ({ id: nextId.value++, name: file.name, size: file.size, kind: extension(file.name), status: "ready" as const, progress: 0 }));
  const rejected = detail.rejectedFiles.map(({ file, reasons }) => ({ id: nextId.value++, name: file.name, size: file.size, kind: extension(file.name), status: "rejected" as const, progress: 0, message: reasonText(reasons) }));
  selectedFiles.value = [...accepted, ...rejected];
  const source = { input: "文件选择器", drop: "拖拽", paste: "粘贴", api: "程序调用" }[detail.source] || "选择";
  feedback.value = rejected.length ? \`\${source}：接收 \${accepted.length} 个，拒绝 \${rejected.length} 个\` : \`\${source}：已接收 \${accepted.length} 个文件\`;
};

const removeSelected = (id: number) => {
  selectedFiles.value = selectedFiles.value.filter((item) => item.id !== id);
  if (!selectedFiles.value.length) feedback.value = "文件列表已清空";
};
const removeQueue = (id: number) => { uploadQueue.value = uploadQueue.value.filter((item) => item.id !== id); };
const retry = (item: UploadItem) => {
  item.status = "uploading";
  item.progress = 54;
  item.message = undefined;
  window.setTimeout(() => { item.progress = 100; item.status = "success"; }, 900);
};

onMounted(() => host.value?.addEventListener("gardener:files", receiveFiles));
onBeforeUnmount(() => host.value?.removeEventListener("gardener:files", receiveFiles));
<\/script>

<template>
  <article id="component-file-drop" class="component-doc file-drop-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / FILE UPLOAD</span>
        <h2>文件上传 <span>File Drop / GFileDrop</span></h2>
        <p>统一点击、键盘、拖放与粘贴选取，覆盖前置校验、文件队列、上传进度、失败重试和图片型入口。</p>
      </div>
      <span class="component-status">runtime-ready · native file input</span>
    </header>

    <section class="usage-section">
      <h3>拖拽上传与真实校验</h3>
      <p>支持 PNG、JPG、PDF，单文件不超过 5 MB、一次最多 5 个；失败原因会进入可见列表和实时状态。</p>
      <div ref="host" class="usage-preview usage-preview--block file-drop-main">
        <GFileDrop :variant="['dragger', 'block']" data-g-accept="image/png,image/jpeg,application/pdf" data-g-max-size="5242880" data-g-max-files="5" data-g-paste aria-describedby="file-drop-rules file-drop-live">
          <input aria-label="选择上传文件" class="g-file-drop-input" type="file" accept="image/png,image/jpeg,application/pdf" multiple />
          <span class="g-file-drop-content">
            <span class="g-file-drop-icon" aria-hidden="true" />
            <strong class="g-file-drop-title">拖拽文件到这里，或点击选择</strong>
            <span class="g-file-drop-description">也可以聚焦此区域后按 Enter / Space，或直接粘贴剪贴板文件</span>
            <small id="file-drop-rules" class="g-file-drop-rules">PNG / JPG / PDF · 单个 ≤ 5 MB · 最多 5 个</small>
            <span class="g-file-drop-actions"><button type="button" class="g-btn g-btn-primary g-file-drop-browse" data-g-file-browse>选择文件</button></span>
          </span>
        </GFileDrop>
        <div id="file-drop-live" class="file-drop-live" role="status" aria-live="polite">{{ feedback }}</div>
        <ul v-if="selectedFiles.length" class="g-file-drop-list" aria-label="刚选择的文件">
          <li v-for="item in selectedFiles" :key="item.id" class="g-file-drop-item" :class="\`is-\${item.status}\`" :data-g-status="item.status">
            <span class="g-file-drop-file-icon" aria-hidden="true">{{ item.kind }}</span>
            <span class="g-file-drop-file-info"><strong class="g-file-drop-file-name">{{ item.name }}</strong><span class="g-file-drop-file-meta"><span>{{ formatSize(item.size) }}</span><span>{{ statusText(item) }}</span></span></span>
            <span class="g-file-drop-item-actions"><button type="button" class="g-file-drop-remove" :aria-label="\`移除 \${item.name}\`" @click="removeSelected(item.id)">移除</button></span>
          </li>
        </ul>
      </div>
    </section>

    <section class="usage-section">
      <h3>入口形态</h3>
      <p>入口密度应由场景决定：整页素材使用拖拽区，表单附件使用紧凑行，工具栏使用按钮，头像与封面使用图片卡。</p>
      <div class="usage-preview usage-preview--block file-drop-variant-grid">
        <GFileDrop :variant="['compact', 'block']">
          <input aria-label="选择上传文件" class="g-file-drop-input" type="file" multiple />
          <span class="g-file-drop-icon" aria-hidden="true" />
          <span class="g-file-drop-content"><strong class="g-file-drop-title">添加项目附件</strong><span class="g-file-drop-description">支持多个文件</span></span>
          <span class="g-file-drop-actions"><button type="button" class="g-btn g-btn-outline g-file-drop-browse" data-g-file-browse>浏览</button></span>
        </GFileDrop>
        <GFileDrop variant="button"><input aria-label="选择上传文件" class="g-file-drop-input" type="file" /><span class="g-file-drop-icon" aria-hidden="true" /><strong class="g-file-drop-title">上传文件</strong></GFileDrop>
        <div class="file-drop-card-pair">
          <GFileDrop variant="picture-card"><input aria-label="选择上传文件" class="g-file-drop-input" type="file" accept="image/*" /><span class="g-file-drop-icon" aria-hidden="true" /><span class="g-file-drop-description">添加封面</span></GFileDrop>
          <GFileDrop variant="avatar"><input aria-label="选择上传文件" class="g-file-drop-input" type="file" accept="image/*" /><span class="g-file-drop-icon" aria-hidden="true" /><span class="g-file-drop-description">头像</span></GFileDrop>
        </div>
        <GFileDrop :variant="['compact', 'block', 'directory']"><input aria-label="选择上传文件" class="g-file-drop-input" type="file" multiple webkitdirectory /><span class="g-file-drop-icon" aria-hidden="true" /><span class="g-file-drop-content"><strong class="g-file-drop-title">上传整个文件夹</strong><span class="g-file-drop-description">保留目录层级，由业务决定传输方式</span></span></GFileDrop>
        <GFileDrop :variant="['compact', 'block']" state="disabled" aria-disabled="true"><input aria-label="选择上传文件" class="g-file-drop-input" type="file" disabled /><span class="g-file-drop-icon" aria-hidden="true" /><span class="g-file-drop-content"><strong class="g-file-drop-title">上传已关闭</strong><span class="g-file-drop-description">当前项目为只读状态</span></span></GFileDrop>
      </div>
    </section>

    <section class="usage-section">
      <h3>上传队列、进度与恢复</h3>
      <p>选择文件和网络上传是两个阶段。队列清楚区分等待、上传中、成功和失败，并为失败项保留重试入口。</p>
      <div class="usage-preview usage-preview--block file-drop-queue-panel">
        <div class="g-file-drop-list-header"><strong>上传队列</strong><span>{{ uploadQueue.length }} 个文件</span></div>
        <ul class="g-file-drop-list" aria-label="上传队列">
          <li v-for="item in uploadQueue" :key="item.id" class="g-file-drop-item" :class="\`is-\${item.status}\`" :data-g-status="item.status">
            <span class="g-file-drop-file-icon" aria-hidden="true">{{ item.kind }}</span>
            <span class="g-file-drop-file-info"><strong class="g-file-drop-file-name">{{ item.name }}</strong><span class="g-file-drop-file-meta"><span>{{ formatSize(item.size) }}</span><span>{{ statusText(item) }}</span></span></span>
            <span class="g-file-drop-item-actions"><button v-if="item.status === 'error'" type="button" class="g-file-drop-retry" @click="retry(item)">重试</button><button type="button" class="g-file-drop-remove" :aria-label="\`移除 \${item.name}\`" @click="removeQueue(item.id)">移除</button></span>
            <span v-if="item.status === 'uploading'" class="g-file-drop-progress"><span class="g-file-drop-progress-track"><span class="g-file-drop-progress-bar" :style="{ '--g-file-progress': \`\${item.progress}%\` }" /></span><span class="g-file-drop-status">{{ item.progress }}%</span></span>
          </li>
        </ul>
      </div>
    </section>

    <aside class="file-drop-guidance">
      <strong>职责边界</strong>
      <span>GFileDrop 负责文件选取、输入校验与交互反馈；真正的网络上传、分片、鉴权、断点续传和服务端安全扫描应由应用层实现。</span>
    </aside>

    <footer class="component-doc__meta">
      <span><b>入口</b><code>dragger</code><code>compact</code><code>button</code><code>picture-card</code><code>avatar</code></span>
      <span><b>输入</b><code>click</code><code>keyboard</code><code>drop</code><code>paste</code><code>directory</code></span>
      <span><b>状态</b><code>dragging</code><code>uploading</code><code>success</code><code>error</code><code>rejected</code></span>
      <span><b>约束</b><code>accept</code><code>max-size</code><code>max-files</code><code>multiple</code></span>
    </footer>
  </article>
</template>

<style>
.file-drop-documentation .file-drop-main,
.file-drop-documentation .file-drop-queue-panel { display: grid; gap: 16px; align-content: start; }
.file-drop-documentation .file-drop-live { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.file-drop-documentation .file-drop-variant-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(13rem, .65fr); gap: 22px; align-items: center; }
.file-drop-documentation .file-drop-variant-grid > :first-child,
.file-drop-documentation .file-drop-variant-grid > :nth-last-child(-n + 2) { grid-column: 1 / -1; }
.file-drop-documentation .file-drop-card-pair { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 20px; }
.file-drop-documentation .file-drop-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.file-drop-documentation .file-drop-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) {
  .file-drop-documentation .file-drop-variant-grid { grid-template-columns: 1fr; }
  .file-drop-documentation .file-drop-variant-grid > * { grid-column: 1 !important; }
}
</style>
`;export{e as default};