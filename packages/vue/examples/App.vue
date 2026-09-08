<script setup lang="ts">
import { computed, ref } from "vue";
import { GActivityBar, GAlert, GAutosaveStatus, GBreadcrumb, GButton, GCard, GCollapsibleNavigation, GCommandPalette, GConditionalField, GConsentGroup, GContextMenu, GDatePicker, GDialog, GFormActions, GFormBuilder, GFormProgress, GFormReview, GInput, GMenuBar, GMenuDropdown, GNavbar, GNavigationRail, GPagination, GPinInput, GPrimaryNavigation, GRating, GSegmentedControl, GSelect, GSidebar, GStepper, GSubNavigation, GTabs, GTimePicker, GUploadQueue, GUtilityNavigation, GValidationSummary, GardenerimPart, GardenerimProvider, useGardenerimBehavior, type GardenerimBehaviorInstance, type GardenerimComponentPublicInstance } from "@gardenerim/vue";

const dialog = ref<GardenerimComponentPublicInstance | null>(null);
const projectView = ref("list");
const currentPage = ref(3);
const jumpPage = ref(3);
const pageSize = ref(20);
const commandPaletteConfig = Object.freeze({ shortcut: "mod+k" });
const selectedCommand = ref("尚未执行命令");
const handleCommandSelect = (event: Event) => {
  const detail = (event as CustomEvent<{ label?: string }>).detail;
  selectedCommand.value = detail.label ? `已执行：${detail.label}` : "尚未执行命令";
};
const selectedMenuAction = ref("尚未选择操作");
const handleMenuChange = (event: Event) => {
  selectedMenuAction.value = (event as CustomEvent<{ value?: string }>).detail.value ?? "尚未选择操作";
};
const selectedContextAction = ref("尚未执行文件操作");
const handleContextMenuChange = (event: Event) => {
  const detail = (event as CustomEvent<{ value?: string; checked?: boolean }>).detail;
  selectedContextAction.value = detail.checked === undefined ? `已执行：${detail.value ?? "文件操作"}` : `${detail.value ?? "选项"}：${detail.checked ? "已开启" : "已关闭"}`;
};
interface StepperInstance extends GardenerimBehaviorInstance { next(focus?: boolean): Element | null; previous(focus?: boolean): Element | null }
const stepper = ref<GardenerimComponentPublicInstance | null>(null);
const stepperConfig = Object.freeze({ autoComplete: true });
const currentStep = ref(1);
const stepperLabels = ["项目资料", "团队成员", "权限检查", "发布完成"];
const stepperSummary = computed(() => `第 ${currentStep.value + 1} / ${stepperLabels.length} 步：${stepperLabels[currentStep.value]}`);
const handleStepChange = (event: Event) => { currentStep.value = (event as CustomEvent<{ index: number }>).detail.index; };
const moveStep = (direction: "next" | "previous") => (stepper.value?.getInstance("stepper") as StepperInstance | null)?.[direction](true);
const paginationPages = computed(() => [...new Set([1, currentPage.value - 1, currentPage.value, currentPage.value + 1, 12].filter((page) => page >= 1 && page <= 12))].sort((a, b) => a - b));
const setPage = (page: number) => {
  currentPage.value = Math.min(12, Math.max(1, page));
  jumpPage.value = currentPage.value;
};
interface DialogInstance extends GardenerimBehaviorInstance { open(): void }
const { instance } = useGardenerimBehavior<DialogInstance>(dialog, "dialog");
const open = () => instance.value?.open?.();
const deliveryMethod = ref("shipping");
const deliveryCondition = Object.freeze({ controller: "#vue-delivery-method", showWhen: "shipping" });
const projectName = ref("Gardenerim 2.1");
const projectOwner = ref("");
const publishScope = ref("");
const completedProjectFields = computed(() => [projectName.value, projectOwner.value, publishScope.value].filter((value) => value.trim().length > 0).length);
const projectProgressPercent = computed(() => Math.round(completedProjectFields.value / 3 * 100));
const projectProgressStyle = computed(() => ({ "--g-form-progress": `${projectProgressPercent.value}%` }));
const projectProgressState = computed(() => completedProjectFields.value === 3 ? "complete" : "active");
const projectReviewState = computed(() => completedProjectFields.value === 3 ? "complete" : "warning");
const publishScopeLabel = computed(() => ({ team: "仅团队成员", public: "公开访问" })[publishScope.value] ?? "");
const termsAccepted = ref(false);
const privacyAccepted = ref(false);
const productUpdatesAccepted = ref(false);
const acceptedRequiredConsents = computed(() => Number(termsAccepted.value) + Number(privacyAccepted.value));
const consentComplete = computed(() => acceptedRequiredConsents.value === 2);
const consentState = computed(() => consentComplete.value ? "accepted" : acceptedRequiredConsents.value > 0 ? "partial" : "unchecked");
const selectedPublishDates = ref<string[]>(["2026-09-12"]);
const datePickerConfig = Object.freeze({ datePickerValue: "2026-09-12", datePickerMin: "2026-09-01", datePickerMax: "2026-12-31", datePickerFirstDay: 1 });
const selectedPublishTime = ref("13:30");
const timePickerConfig = Object.freeze({ timePickerValue: "13:30", timePickerMin: "09:00", timePickerMax: "18:00", timePickerMinuteStep: 5 });
const verificationPin = ref("");
const pinInputConfig = Object.freeze({ pinInputMode: "numeric", pinInputEmptyLabel: "请输入 6 位验证码", pinInputPartialLabel: "继续输入剩余验证码", pinInputCompleteLabel: "验证码已完整" });
const experienceRating = ref(3.5);
const ratingConfig = Object.freeze({ ratingValue: 3.5, ratingMax: 5, ratingStep: 0.5, ratingAllowClear: true, ratingEmptyLabel: "尚未评分" });
const validationSummaryConfig = Object.freeze({ validationMode: "live", validationFocus: true, validationPreventSubmit: true });
const focusProjectField = (id: string) => document.getElementById(id)?.focus();
const autosaveConfig = Object.freeze({ autosaveScope: "#vue-autosave-form", autosaveDelay: 500, autosaveState: "saved" });
const handleAutosaveRequest = (event: CustomEvent<{ respondWith(value: Promise<void>): void }>) => {
  event.detail.respondWith(new Promise((resolve) => window.setTimeout(resolve, 450)));
};
const sidebarCollapsed = ref(false);
</script>

<template>
  <GardenerimProvider class="g-container g-py-10" theme="garden" mode="light" shape="subtle" density="comfortable">
    <main class="g-stack g-gap-6">
      <header>
        <span class="g-badge">Vue 2.2.0</span>
        <h1>Gardenerim Vue</h1>
        <p class="g-text-muted">514 个组件、75 种行为和完整类型支持。</p>
      </header>

      <GAlert state="info">这是 Gardenerim CSS 与 Vue 3 的官方适配层。</GAlert>

      <GCard>
        <GardenerimPart name="card-header"><strong>Command Palette</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">按 Ctrl/⌘ + K 或使用按钮打开；支持关键词过滤、分组、方向键、禁用命令、空结果、焦点循环与恢复。</p>
          <div class="g-cluster g-gap-3">
            <GButton variant="outline" type="button" data-g-command-trigger="vue-command-palette">打开命令面板 <kbd>Ctrl K</kbd></GButton>
            <span role="status" aria-live="polite">{{ selectedCommand }}</span>
          </div>
          <GCommandPalette id="vue-command-palette" :variant="['responsive']" :config="commandPaletteConfig" hidden aria-label="工作区快速命令" @gardener:commandselect="handleCommandSelect">
            <GardenerimPart name="command-palette" as="section">
              <GardenerimPart name="command-header" as="header">
                <GardenerimPart name="command-search">
                  <GardenerimPart name="command-search-icon" aria-hidden="true">⌕</GardenerimPart>
                  <GardenerimPart name="command-input" as="input" aria-label="搜索命令" placeholder="搜索页面、项目和操作" />
                  <GardenerimPart name="command-clear" as="button" type="button" aria-label="清除搜索" data-g-command-clear>×</GardenerimPart>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="command-results" data-g-command-results>
                <GardenerimPart name="command-group" as="section" data-g-command-group>
                  <GardenerimPart name="command-group-label" as="h2">快速创建</GardenerimPart>
                  <GardenerimPart name="command-list">
                    <GardenerimPart name="command-item" as="button" type="button" data-g-command-item data-g-value="new-page" data-g-keywords="create document 文档">
                      <GardenerimPart name="command-item-icon" aria-hidden="true">＋</GardenerimPart><GardenerimPart name="command-item-content"><GardenerimPart name="command-item-title">新建页面</GardenerimPart><GardenerimPart name="command-item-description">在当前工作区创建空白页面</GardenerimPart></GardenerimPart><kbd class="g-command-item-shortcut">N</kbd>
                    </GardenerimPart>
                    <GardenerimPart name="command-item" as="button" type="button" data-g-command-item data-g-value="new-project" data-g-keywords="create workspace 项目">
                      <GardenerimPart name="command-item-icon" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="command-item-content"><GardenerimPart name="command-item-title">新建项目</GardenerimPart><GardenerimPart name="command-item-description">创建项目并邀请团队成员</GardenerimPart></GardenerimPart><kbd class="g-command-item-shortcut">P</kbd>
                    </GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="command-group" as="section" data-g-command-group>
                  <GardenerimPart name="command-group-label" as="h2">导航</GardenerimPart>
                  <GardenerimPart name="command-list">
                    <GardenerimPart name="command-item" as="button" type="button" data-g-command-item data-g-value="search" data-g-keywords="find content 搜索">
                      <GardenerimPart name="command-item-icon" aria-hidden="true">⌕</GardenerimPart><GardenerimPart name="command-item-content"><GardenerimPart name="command-item-title">全局搜索</GardenerimPart><GardenerimPart name="command-item-description">查找页面、任务和团队成员</GardenerimPart></GardenerimPart><kbd class="g-command-item-shortcut">/</kbd>
                    </GardenerimPart>
                    <GardenerimPart name="command-item" as="button" type="button" data-g-command-item data-g-value="settings" data-g-keywords="preferences account 设置">
                      <GardenerimPart name="command-item-icon" aria-hidden="true">⚙</GardenerimPart><GardenerimPart name="command-item-content"><GardenerimPart name="command-item-title">打开设置</GardenerimPart><GardenerimPart name="command-item-description">管理主题、通知和权限</GardenerimPart></GardenerimPart><kbd class="g-command-item-shortcut">G S</kbd>
                    </GardenerimPart>
                    <GardenerimPart name="command-item" as="button" type="button" data-g-command-item data-g-value="admin" disabled>
                      <GardenerimPart name="command-item-icon" aria-hidden="true">♙</GardenerimPart><GardenerimPart name="command-item-content"><GardenerimPart name="command-item-title">管理员控制台</GardenerimPart><GardenerimPart name="command-item-description">当前账户没有访问权限</GardenerimPart></GardenerimPart>
                    </GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="command-empty" data-g-command-empty hidden role="status">没有找到匹配的命令</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="command-footer" as="footer"><GardenerimPart name="command-hint"><kbd>↑↓</kbd> 移动</GardenerimPart><GardenerimPart name="command-hint"><kbd>Enter</kbd> 执行</GardenerimPart><GardenerimPart name="command-hint"><kbd>Esc</kbd> 关闭</GardenerimPart><GardenerimPart name="command-count"><b data-g-command-count>5</b> 项命令</GardenerimPart></GardenerimPart>
            </GardenerimPart>
          </GCommandPalette>
        </GardenerimPart>
      </GCard>

      <GCard id="vue-context-menu">
        <GardenerimPart name="card-header"><strong>Context Menu</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">在目标文件上右键、按 Shift+F10 / 菜单键，或在触屏上长按；菜单支持方向键、Home/End、字符检索、勾选项、禁用项、视口防溢出和焦点恢复。</p>
          <GContextMenu :variant="['bordered', 'elevated']" data-g-long-press @gardener:change="handleContextMenuChange">
            <GardenerimPart name="context-menu-target" data-g-context-target tabindex="0" aria-label="品牌规范文件">
              <GardenerimPart name="context-menu-target-icon" as="span" aria-hidden="true">PDF</GardenerimPart>
              <GardenerimPart name="context-menu-target-content">
                <GardenerimPart name="context-menu-target-title" as="strong">品牌规范.pdf</GardenerimPart>
                <GardenerimPart name="context-menu-target-description" as="span">右键或按 Shift+F10 打开文件操作</GardenerimPart>
                <GardenerimPart name="context-menu-target-meta" as="span">4.8 MB · 今天 17:42 更新 · 团队可见</GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="context-menu-panel" as="ul" data-g-context-menu-panel hidden aria-label="文件操作">
              <GardenerimPart name="context-menu-group" as="li" role="group" aria-label="打开命令">
                <GardenerimPart name="context-menu-item" as="button" type="button" role="menuitem" data-g-value="打开"><GardenerimPart name="context-menu-item-icon" as="span" aria-hidden="true">↗</GardenerimPart><GardenerimPart name="context-menu-item-label" as="span">打开</GardenerimPart><GardenerimPart name="context-menu-item-shortcut" as="kbd">Enter</GardenerimPart></GardenerimPart>
                <GardenerimPart name="context-menu-item" as="button" type="button" role="menuitem" data-g-value="在新窗口中打开"><GardenerimPart name="context-menu-item-icon" as="span" aria-hidden="true">□</GardenerimPart><GardenerimPart name="context-menu-item-label" as="span">在新窗口中打开</GardenerimPart><GardenerimPart name="context-menu-item-shortcut" as="kbd">Ctrl Enter</GardenerimPart></GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="context-menu-separator" as="li" role="separator" />
              <GardenerimPart name="context-menu-group" as="li" role="group" aria-label="文件选项">
                <GardenerimPart name="context-menu-item" as="button" type="button" role="menuitemcheckbox" aria-checked="true" data-g-value="固定到收藏夹" data-g-keep-open="true"><GardenerimPart name="context-menu-item-check" as="span" aria-hidden="true">✓</GardenerimPart><GardenerimPart name="context-menu-item-label" as="span">固定到收藏夹</GardenerimPart></GardenerimPart>
                <GardenerimPart name="context-menu-item" as="button" type="button" role="menuitem" aria-disabled="true"><GardenerimPart name="context-menu-item-icon" as="span" aria-hidden="true">↺</GardenerimPart><GardenerimPart name="context-menu-item-label" as="span">恢复旧版本</GardenerimPart></GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="context-menu-separator" as="li" role="separator" />
              <li role="none"><GardenerimPart name="context-menu-item" class="is-danger" as="button" type="button" role="menuitem" data-g-value="移到回收站"><GardenerimPart name="context-menu-item-icon" as="span" aria-hidden="true">×</GardenerimPart><GardenerimPart name="context-menu-item-label" as="span">移到回收站</GardenerimPart><GardenerimPart name="context-menu-item-shortcut" as="kbd">Delete</GardenerimPart></GardenerimPart></li>
            </GardenerimPart>
            <GardenerimPart name="context-menu-status" as="span" role="status" aria-live="polite">{{ selectedContextAction }}</GardenerimPart>
          </GContextMenu>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Upload Queue</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">管理真实上传任务的排队、进度、暂停、重试与移除；也可通过运行时实例接收后端进度。</p>
          <GUploadQueue variant="bordered" aria-labelledby="vue-upload-title">
            <GardenerimPart name="upload-queue-header" as="header">
              <div>
                <GardenerimPart id="vue-upload-title" name="upload-queue-title">上传队列</GardenerimPart>
                <GardenerimPart name="upload-summary">
                  <span>共 <b data-g-upload-count="total">0</b></span>
                  <span>完成 <b data-g-upload-count="success">0</b></span>
                  <span>失败 <b data-g-upload-count="error">0</b></span>
                </GardenerimPart>
              </div>
              <GardenerimPart name="upload-actions">
                <label class="g-btn g-btn-primary g-btn-sm">选择文件<input class="g-upload-input" type="file" multiple data-g-upload-input /></label>
                <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="clear">清空</button>
              </GardenerimPart>
            </GardenerimPart>
            <span class="g-sr-only" data-g-upload-live />
            <GardenerimPart name="upload-list" data-g-upload-list>
              <GardenerimPart name="upload-empty" data-g-upload-empty hidden>暂无待上传文件</GardenerimPart>
              <GardenerimPart name="upload-item" data-g-upload-item data-g-upload-id="vue-brand" data-g-status="uploading" data-g-progress="62">
                <GardenerimPart name="file-icon" aria-hidden="true">PDF</GardenerimPart>
                <GardenerimPart name="file-main">
                  <GardenerimPart name="file-name" as="strong">品牌规范.pdf</GardenerimPart>
                  <GardenerimPart name="file-meta">4.8 MB</GardenerimPart>
                  <GardenerimPart name="upload-status" data-g-upload-status />
                </GardenerimPart>
                <GardenerimPart name="upload-progress" data-g-upload-progress><GardenerimPart name="upload-progress-bar" as="i" /></GardenerimPart>
                <GardenerimPart name="upload-actions">
                  <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="advance">推进</button>
                  <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="pause">暂停</button>
                  <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="remove">移除</button>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="upload-item" data-g-upload-item data-g-upload-id="vue-cover" data-g-status="success" data-g-progress="100">
                <GardenerimPart name="file-icon" aria-hidden="true">JPG</GardenerimPart>
                <GardenerimPart name="file-main">
                  <GardenerimPart name="file-name" as="strong">封面.jpg</GardenerimPart>
                  <GardenerimPart name="file-meta">880 KB</GardenerimPart>
                  <GardenerimPart name="upload-status" data-g-upload-status />
                </GardenerimPart>
                <GardenerimPart name="upload-progress" data-g-upload-progress><GardenerimPart name="upload-progress-bar" as="i" /></GardenerimPart>
                <GardenerimPart name="upload-actions"><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="remove">移除</button></GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="upload-item" data-g-upload-item data-g-upload-id="vue-video" data-g-status="error" data-g-progress="28">
                <GardenerimPart name="file-icon" aria-hidden="true">MOV</GardenerimPart>
                <GardenerimPart name="file-main">
                  <GardenerimPart name="file-name" as="strong">访谈.mov</GardenerimPart>
                  <GardenerimPart name="file-meta">网络中断</GardenerimPart>
                  <GardenerimPart name="upload-status" data-g-upload-status />
                </GardenerimPart>
                <GardenerimPart name="upload-progress" data-g-upload-progress><GardenerimPart name="upload-progress-bar" as="i" /></GardenerimPart>
                <GardenerimPart name="upload-actions">
                  <button class="g-btn g-btn-outline g-btn-sm" type="button" data-g-upload-action="retry">重试</button>
                  <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-upload-action="remove">移除</button>
                </GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
          </GUploadQueue>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Interactive Stepper</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-4">
          <p class="g-text-muted">用于多阶段任务的进度与导航；支持完成、当前、错误、禁用状态，以及方向键、Home/End 和编程式前进/后退。</p>
          <GStepper ref="stepper" as="ol" :variant="['navigation', 'responsive', 'contained']" :config="stepperConfig" aria-label="项目发布进度" @gardener:stepchange="handleStepChange">
            <GardenerimPart name="step" as="li" data-g-value="project" :class="{ 'is-complete': currentStep > 0, 'is-active': currentStep === 0 }">
              <GardenerimPart name="step-action" as="button" type="button">
                <GardenerimPart name="step-indicator" as="span" aria-hidden="true">{{ currentStep > 0 ? '✓' : '1' }}</GardenerimPart>
                <GardenerimPart name="step-content" as="span"><GardenerimPart name="step-title" as="strong">项目资料</GardenerimPart><GardenerimPart name="step-description" as="span">名称、标识和所属空间</GardenerimPart><GardenerimPart name="step-status" as="span">{{ currentStep > 0 ? '已完成' : '当前步骤' }}</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="step" as="li" data-g-value="members" :class="{ 'is-complete': currentStep > 1, 'is-active': currentStep === 1 }">
              <GardenerimPart name="step-action" as="button" type="button">
                <GardenerimPart name="step-indicator" as="span" aria-hidden="true">{{ currentStep > 1 ? '✓' : '2' }}</GardenerimPart>
                <GardenerimPart name="step-content" as="span"><GardenerimPart name="step-title" as="strong">团队成员</GardenerimPart><GardenerimPart name="step-description" as="span">邀请协作者并分配角色</GardenerimPart><GardenerimPart name="step-status" as="span">{{ currentStep === 1 ? '当前步骤' : currentStep > 1 ? '已完成' : '待处理' }}</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="step" as="li" data-g-value="permissions" class="is-error" :class="{ 'is-active': currentStep === 2 }">
              <GardenerimPart name="step-action" as="button" type="button">
                <GardenerimPart name="step-indicator" as="span" aria-hidden="true">!</GardenerimPart>
                <GardenerimPart name="step-content" as="span"><GardenerimPart name="step-title" as="strong">权限检查</GardenerimPart><GardenerimPart name="step-description" as="span">有 1 项访问范围需要确认</GardenerimPart><GardenerimPart name="step-status" as="span">需要处理</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="step" as="li" data-g-value="publish" class="is-disabled" aria-disabled="true">
              <GardenerimPart name="step-action" as="button" type="button" disabled>
                <GardenerimPart name="step-indicator" as="span" aria-hidden="true">4</GardenerimPart>
                <GardenerimPart name="step-content" as="span"><GardenerimPart name="step-title" as="strong">发布完成</GardenerimPart><GardenerimPart name="step-description" as="span">通过检查后开放</GardenerimPart><GardenerimPart name="step-status" as="span">尚未开放</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
          </GStepper>
          <GardenerimPart name="stepper-summary" role="status" aria-live="polite">{{ stepperSummary }}</GardenerimPart>
          <GardenerimPart name="stepper-actions">
            <GButton variant="outline" type="button" :disabled="currentStep === 0" @click="moveStep('previous')">上一步</GButton>
            <GButton variant="primary" type="button" :disabled="currentStep >= 2" @click="moveStep('next')">下一步</GButton>
          </GardenerimPart>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Accessible Menu Dropdown</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">完整菜单按钮支持点击、方向键、首尾键、字符搜索、勾选项、禁用项、子菜单、危险操作、外部关闭与焦点恢复。</p>
          <GMenuDropdown :variant="['end', 'scrollable']" @gardener:change="handleMenuChange">
            <GardenerimPart name="dropdown-trigger" as="button" class="g-btn g-btn-outline" type="button" data-g-dropdown-trigger>
              <GardenerimPart name="dropdown-trigger-label" as="span">项目操作</GardenerimPart>
              <GardenerimPart name="dropdown-trigger-icon" as="span" aria-hidden="true">⌄</GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="dropdown-menu" as="ul" class="g-menu" data-g-dropdown-menu hidden>
              <GardenerimPart name="dropdown-header" as="li" role="presentation"><GardenerimPart name="dropdown-title" as="strong">设计系统项目</GardenerimPart><GardenerimPart name="dropdown-description" as="div">最近更新于今天 17:42</GardenerimPart></GardenerimPart>
              <li role="presentation"><button class="g-menu-item" type="button" data-g-value="打开项目"><span class="g-menu-item-icon" aria-hidden="true">↗</span><span class="g-menu-item-content"><span class="g-menu-item-label">打开项目</span><span class="g-menu-item-description">在当前工作区查看详情</span></span><kbd class="g-menu-shortcut">Enter</kbd></button></li>
              <li role="presentation"><button class="g-menu-item" type="button" data-g-value="重命名"><span class="g-menu-item-icon" aria-hidden="true">✎</span><span class="g-menu-item-label">重命名</span><kbd class="g-menu-shortcut">F2</kbd></button></li>
              <li role="presentation"><button class="g-menu-item" type="button" role="menuitemcheckbox" aria-checked="false" data-g-value="显示隐藏文件" data-g-keep-open="true"><span class="g-menu-item-check" aria-hidden="true">✓</span><span class="g-menu-item-label">显示隐藏文件</span></button></li>
              <GMenuDropdown as="li" class="g-menu-submenu">
                <button class="g-menu-item" type="button" data-g-dropdown-trigger aria-haspopup="menu"><span class="g-menu-item-icon" aria-hidden="true">⇩</span><span class="g-menu-item-label">导出</span></button>
                <ul class="g-menu g-dropdown-menu g-submenu-menu" data-g-dropdown-menu hidden>
                  <li role="presentation"><button class="g-menu-item" type="button" data-g-value="导出 PDF">PDF 文档</button></li>
                  <li role="presentation"><button class="g-menu-item" type="button" data-g-value="导出 JSON">JSON 数据</button></li>
                </ul>
              </GMenuDropdown>
              <li class="g-menu-divider" role="separator"></li>
              <li role="presentation"><button class="g-menu-item" type="button" aria-disabled="true"><span class="g-menu-item-icon" aria-hidden="true">⧉</span><span class="g-menu-item-label">复制到组织</span><span class="g-menu-badge">无权限</span></button></li>
              <li role="presentation"><button class="g-menu-item g-menu-item-danger" type="button" data-g-value="删除项目"><span class="g-menu-item-icon" aria-hidden="true">×</span><span class="g-menu-item-label">删除项目</span></button></li>
              <GardenerimPart name="dropdown-footer" as="li" role="presentation"><span class="g-text-muted">使用 ↑ ↓ 移动，Esc 关闭</span></GardenerimPart>
            </GardenerimPart>
          </GMenuDropdown>
          <p role="status" aria-live="polite">{{ selectedMenuAction }}</p>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Complete Pagination</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">原生语义分页，包含总数、上一页/下一页、当前页、省略号、每页条数和跳页表单；窄屏自动收敛。</p>
          <GPagination :variant="['bordered', 'responsive']" aria-label="项目分页">
            <GardenerimPart name="pagination-total" as="span">共 236 条</GardenerimPart>
            <GardenerimPart name="pagination-list" as="ol">
              <GardenerimPart name="pagination-item" as="li">
                <GardenerimPart name="page-link" as="button" class="g-page-previous" type="button" aria-label="上一页" :aria-disabled="currentPage === 1 ? 'true' : undefined" @click="setPage(currentPage - 1)"><span class="g-page-icon" aria-hidden="true">‹</span><span class="g-page-label">上一页</span></GardenerimPart>
              </GardenerimPart>
              <template v-for="(page, index) in paginationPages" :key="page">
                <GardenerimPart v-if="index > 0 && page - (paginationPages[index - 1] ?? page) > 1" name="pagination-item" as="li" class="g-page-distant"><GardenerimPart name="page-ellipsis" as="span" aria-hidden="true">…</GardenerimPart></GardenerimPart>
                <GardenerimPart name="pagination-item" as="li" :class="{ 'g-page-distant': page !== 1 && page !== 12 && page !== currentPage }">
                  <GardenerimPart name="page-link" as="button" class="g-page-number" type="button" :aria-label="`第 ${page} 页`" :aria-current="currentPage === page ? 'page' : undefined" @click="setPage(page)">{{ page }}</GardenerimPart>
                </GardenerimPart>
              </template>
              <GardenerimPart name="pagination-item" as="li">
                <GardenerimPart name="page-link" as="button" class="g-page-next" type="button" aria-label="下一页" :aria-disabled="currentPage === 12 ? 'true' : undefined" @click="setPage(currentPage + 1)"><span class="g-page-label">下一页</span><span class="g-page-icon" aria-hidden="true">›</span></GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <label class="g-pagination-size-label">每页 <select v-model="pageSize" class="g-select g-pagination-size" aria-label="每页条数"><option :value="10">10 条</option><option :value="20">20 条</option><option :value="50">50 条</option></select></label>
            <form class="g-pagination-jumper" aria-label="跳转页码" @submit.prevent="setPage(jumpPage)">
              <label class="g-pagination-jumper-label" for="vue-pagination-jump">前往</label>
              <input id="vue-pagination-jump" v-model.number="jumpPage" class="g-input g-page-jumper" name="page" type="number" min="1" max="12" inputmode="numeric" />
              <button class="g-btn g-btn-outline g-btn-sm g-pagination-submit" type="submit">跳转</button>
            </form>
            <GardenerimPart name="pagination-status" as="span" role="status" aria-live="polite">第 {{ currentPage }} / 12 页</GardenerimPart>
          </GPagination>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Segmented View Control</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">用于少量互斥视图切换，支持图标、徽标、禁用项、表单值和方向键操作。</p>
          <GSegmentedControl v-model="projectView" model-event="viewchange" :variant="['outlined', 'responsive']" data-g-current-view="list" aria-label="项目布局">
            <GardenerimPart name="segmented-item" as="button" type="button" data-g-view="list" aria-checked="true"><GardenerimPart name="segmented-icon" as="span" aria-hidden="true">☷</GardenerimPart><GardenerimPart name="segmented-label" as="span">列表</GardenerimPart></GardenerimPart>
            <GardenerimPart name="segmented-item" as="button" type="button" data-g-view="board"><GardenerimPart name="segmented-icon" as="span" aria-hidden="true">▤</GardenerimPart><GardenerimPart name="segmented-label" as="span">看板</GardenerimPart><GardenerimPart name="segmented-badge" as="span">6</GardenerimPart></GardenerimPart>
            <GardenerimPart name="segmented-item" as="button" type="button" data-g-view="calendar"><GardenerimPart name="segmented-icon" as="span" aria-hidden="true">□</GardenerimPart><GardenerimPart name="segmented-label" as="span">日历</GardenerimPart></GardenerimPart>
            <GardenerimPart name="segmented-item" as="button" type="button" data-g-view="map" aria-disabled="true"><GardenerimPart name="segmented-label" as="span">地图</GardenerimPart></GardenerimPart>
            <input class="g-segmented-input" data-g-segmented-input type="hidden" name="projectLayout" value="list" />
          </GSegmentedControl>
          <p>当前布局：<strong>{{ projectView }}</strong></p>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Interactive Tabs</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">完整展示标签、图标、徽标、禁用项与附加操作；支持自动或手动激活、方向键导航和面板可见性同步。</p>
          <GTabs :variant="['contained', 'scrollable']" aria-label="项目详情标签页">
            <GardenerimPart name="tabs-header">
              <GardenerimPart name="tab-list" role="tablist" aria-label="项目详情">
                <GardenerimPart id="vue-tab-overview" name="tab" as="button" type="button" aria-controls="vue-panel-overview" aria-selected="true">
                  <GardenerimPart name="tab-icon" as="span" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="tab-label" as="span">概览</GardenerimPart>
                </GardenerimPart>
                <GardenerimPart id="vue-tab-activity" name="tab" as="button" type="button" aria-controls="vue-panel-activity">
                  <GardenerimPart name="tab-label" as="span">动态</GardenerimPart><GardenerimPart name="tab-badge" as="span">8</GardenerimPart>
                </GardenerimPart>
                <GardenerimPart id="vue-tab-team" name="tab" as="button" type="button" aria-controls="vue-panel-team"><GardenerimPart name="tab-label" as="span">团队</GardenerimPart></GardenerimPart>
                <GardenerimPart name="tab" as="button" type="button" aria-disabled="true"><GardenerimPart name="tab-label" as="span">审计日志</GardenerimPart></GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="tabs-actions"><button class="g-btn g-btn-outline g-btn-sm" type="button">管理成员</button></GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="tab-panels">
              <GardenerimPart id="vue-panel-overview" name="tab-panel" as="section" aria-labelledby="vue-tab-overview">
                <GardenerimPart name="tab-panel-header" as="header"><strong>项目概览</strong><span class="g-badge g-badge-success">运行正常</span></GardenerimPart>
                <GardenerimPart name="tab-panel-body"><p>12 个活跃任务，最近一次发布于今天 09:42。</p><p class="g-text-muted">方向键可直接切换标签；禁用项会自动跳过。</p></GardenerimPart>
              </GardenerimPart>
              <GardenerimPart id="vue-panel-activity" name="tab-panel" as="section" aria-labelledby="vue-tab-activity" hidden><GardenerimPart name="tab-panel-header" as="header"><strong>最近动态</strong><span class="g-text-muted">共 8 条</span></GardenerimPart><GardenerimPart name="tab-panel-body">林予更新了组件导航规范。</GardenerimPart></GardenerimPart>
              <GardenerimPart id="vue-panel-team" name="tab-panel" as="section" aria-labelledby="vue-tab-team" hidden><GardenerimPart name="tab-panel-header" as="header"><strong>项目成员</strong><span class="g-text-muted">4 人</span></GardenerimPart><GardenerimPart name="tab-panel-body">设计、前端和质量团队共同维护此项目。</GardenerimPart></GardenerimPart>
            </GardenerimPart>
          </GTabs>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Primary Navigation</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">独立主导航支持当前页、图标、描述、徽标、禁用项、多种外观和移动端横向滚动，不依赖 Navbar 才能正确显示。</p>
          <GPrimaryNavigation as="nav" :variant="['contained', 'responsive']" aria-label="工作区主导航">
            <GardenerimPart name="primary-nav-list" as="ul">
              <GardenerimPart name="primary-nav-item" as="li">
                <a class="g-primary-nav-link" href="#vue-primary-overview" aria-current="page">
                  <GardenerimPart name="primary-nav-icon" aria-hidden="true">⌂</GardenerimPart>
                  <GardenerimPart name="primary-nav-content"><GardenerimPart name="primary-nav-label">概览</GardenerimPart><GardenerimPart name="primary-nav-description">工作区最新动态</GardenerimPart></GardenerimPart>
                  <GardenerimPart name="primary-nav-indicator" aria-hidden="true" />
                </a>
              </GardenerimPart>
              <GardenerimPart name="primary-nav-item" as="li">
                <a class="g-primary-nav-link" href="#vue-primary-projects"><GardenerimPart name="primary-nav-icon" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="primary-nav-label">项目</GardenerimPart><GardenerimPart name="primary-nav-badge" aria-label="8 个项目">8</GardenerimPart></a>
              </GardenerimPart>
              <GardenerimPart name="primary-nav-item" as="li">
                <a class="g-primary-nav-link" href="#vue-primary-team"><GardenerimPart name="primary-nav-icon" aria-hidden="true">◎</GardenerimPart><GardenerimPart name="primary-nav-label">团队</GardenerimPart></a>
              </GardenerimPart>
              <GardenerimPart name="primary-nav-item" as="li">
                <a class="g-primary-nav-link" href="#vue-primary-admin" aria-disabled="true" tabindex="-1"><GardenerimPart name="primary-nav-icon" aria-hidden="true">⚙</GardenerimPart><GardenerimPart name="primary-nav-label">管理员</GardenerimPart></a>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="primary-nav-actions"><GButton size="small" variant="primary">新建项目</GButton></GardenerimPart>
          </GPrimaryNavigation>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Utility Navigation</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">辅助导航用于帮助、快捷键、通知和账户等低层级操作；支持当前项、未读徽标、快捷提示、禁用态和移动端横向滚动。</p>
          <GUtilityNavigation id="vue-utility-navigation" as="nav" :variant="['contained', 'divided', 'responsive']" aria-label="工作区辅助导航">
            <GardenerimPart name="utility-nav-list" as="ul">
              <GardenerimPart name="utility-nav-item" as="li">
                <a class="g-utility-nav-link" href="#vue-utility-help"><GardenerimPart name="utility-nav-icon" aria-hidden="true">?</GardenerimPart><GardenerimPart name="utility-nav-label">帮助中心</GardenerimPart></a>
              </GardenerimPart>
              <GardenerimPart name="utility-nav-item" as="li">
                <a class="g-utility-nav-link" href="#vue-utility-shortcuts" aria-current="location"><GardenerimPart name="utility-nav-icon" aria-hidden="true">⌘</GardenerimPart><GardenerimPart name="utility-nav-label">快捷键</GardenerimPart><GardenerimPart name="utility-nav-shortcut" aria-hidden="true">?</GardenerimPart></a>
              </GardenerimPart>
              <GardenerimPart name="utility-nav-item" as="li">
                <a class="g-utility-nav-link" href="#vue-utility-notifications"><GardenerimPart name="utility-nav-icon" aria-hidden="true">◉</GardenerimPart><GardenerimPart name="utility-nav-label">通知</GardenerimPart><GardenerimPart name="utility-nav-badge" aria-label="3 条未读通知">3</GardenerimPart></a>
              </GardenerimPart>
              <GardenerimPart name="utility-nav-item" as="li">
                <a class="g-utility-nav-link" href="#vue-utility-admin" aria-disabled="true" tabindex="-1"><GardenerimPart name="utility-nav-label">管理后台</GardenerimPart></a>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="utility-nav-separator" aria-hidden="true" />
            <GardenerimPart name="utility-nav-actions"><GButton size="small" variant="outline">林予</GButton></GardenerimPart>
          </GUtilityNavigation>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Sub Navigation</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">二级导航用于当前产品或页面区域内的上下文切换；支持当前页、描述、徽标、附加操作、禁用项和窄屏横向滚动。</p>
          <GSubNavigation id="vue-sub-navigation" as="nav" :variant="['contained', 'underline', 'responsive']" aria-label="项目二级导航">
            <GardenerimPart name="subnav-list" as="ul">
              <GardenerimPart name="subnav-item" as="li">
                <a class="g-subnav-link" href="#vue-sub-overview" aria-current="page">
                  <GardenerimPart name="subnav-icon" aria-hidden="true">⌂</GardenerimPart>
                  <GardenerimPart name="subnav-content"><GardenerimPart name="subnav-label">概览</GardenerimPart><GardenerimPart name="subnav-description">项目状态与关键指标</GardenerimPart></GardenerimPart>
                  <GardenerimPart name="subnav-indicator" aria-hidden="true" />
                </a>
              </GardenerimPart>
              <GardenerimPart name="subnav-item" as="li"><a class="g-subnav-link" href="#vue-sub-activity"><GardenerimPart name="subnav-label">动态</GardenerimPart><GardenerimPart name="subnav-badge" aria-label="8 条新动态">8</GardenerimPart></a></GardenerimPart>
              <GardenerimPart name="subnav-item" as="li"><a class="g-subnav-link" href="#vue-sub-members"><GardenerimPart name="subnav-label">成员</GardenerimPart></a></GardenerimPart>
              <GardenerimPart name="subnav-item" as="li"><a class="g-subnav-link" href="#vue-sub-files"><GardenerimPart name="subnav-label">文件</GardenerimPart></a></GardenerimPart>
              <GardenerimPart name="subnav-item" as="li"><a class="g-subnav-link" href="#vue-sub-audit" aria-disabled="true" tabindex="-1"><GardenerimPart name="subnav-label">审计日志</GardenerimPart></a></GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="subnav-actions"><GButton size="small" variant="outline">项目设置</GButton></GardenerimPart>
          </GSubNavigation>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Collapsible Navigation</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">完整折叠导航将标题、说明、触发器和受控内容组合在同一组件中；支持 Escape 收起、焦点恢复、当前项、徽标、禁用项和编程式控制。</p>
          <GCollapsibleNavigation id="vue-collapsible-navigation" as="aside" :variant="['bordered', 'responsive']" aria-label="项目空间导航">
            <GardenerimPart name="collapsible-nav-header" as="header">
              <GardenerimPart name="collapsible-nav-heading">
                <GardenerimPart id="vue-collapsible-title" name="collapsible-nav-title" as="strong">项目空间</GardenerimPart>
                <GardenerimPart name="collapsible-nav-description">最近项目、团队资源和管理入口</GardenerimPart>
              </GardenerimPart>
              <button class="g-collapsible-nav-trigger" type="button" data-g-collapsible-trigger data-g-open-label="展开项目空间导航" data-g-close-label="收起项目空间导航" aria-label="收起项目空间导航">
                <GardenerimPart name="collapsible-nav-trigger-label" as="span" data-g-when-expanded>收起</GardenerimPart>
                <GardenerimPart name="collapsible-nav-trigger-label" as="span" data-g-when-collapsed>展开</GardenerimPart>
                <GardenerimPart name="collapsible-nav-trigger-icon" as="span" aria-hidden="true">⌃</GardenerimPart>
              </button>
            </GardenerimPart>
            <GardenerimPart name="collapsible-nav-body" aria-labelledby="vue-collapsible-title">
              <GardenerimPart name="collapsible-nav-group" as="nav" aria-label="最近项目">
                <GardenerimPart name="nav-group-title" as="h3">最近项目</GardenerimPart>
                <GardenerimPart name="collapsible-nav-list" as="ul">
                  <GardenerimPart name="collapsible-nav-item" as="li"><a class="g-collapsible-nav-link" href="#vue-collapse-gardenerim" aria-current="page"><GardenerimPart name="collapsible-nav-icon" as="span" aria-hidden="true">◆</GardenerimPart><GardenerimPart name="collapsible-nav-label" as="span">Gardenerim 2.1</GardenerimPart><GardenerimPart name="collapsible-nav-badge" as="span" aria-label="12 项待处理">12</GardenerimPart></a></GardenerimPart>
                  <GardenerimPart name="collapsible-nav-item" as="li"><a class="g-collapsible-nav-link" href="#vue-collapse-site"><GardenerimPart name="collapsible-nav-icon" as="span" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="collapsible-nav-label" as="span">企业官网</GardenerimPart></a></GardenerimPart>
                  <GardenerimPart name="collapsible-nav-item" as="li"><a class="g-collapsible-nav-link" href="#vue-collapse-archive" aria-disabled="true" tabindex="-1"><GardenerimPart name="collapsible-nav-icon" as="span" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="collapsible-nav-label" as="span">归档项目</GardenerimPart></a></GardenerimPart>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="collapsible-nav-footer" as="footer"><GardenerimPart name="collapsible-nav-status" as="span">3 个项目</GardenerimPart><a href="#vue-collapse-all" data-g-nav-close>查看全部</a></GardenerimPart>
            </GardenerimPart>
          </GCollapsibleNavigation>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Navigation Rail</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">用于桌面工作区的一级目的地导航；包含品牌、主操作、当前项、徽标、禁用项和底部账户入口，并在窄屏转换为底部导航。</p>
          <div class="g-cluster g-items-stretch g-gap-4">
          <GNavigationRail id="vue-navigation-rail" :variant="['floating', 'responsive']" data-g-orientation="vertical" aria-label="工作区快捷导航">
            <GardenerimPart name="nav-rail-header" as="header">
              <GardenerimPart name="nav-rail-brand" as="a" href="#vue-rail-overview" aria-label="Gardenerim 首页"><GardenerimPart name="nav-rail-brand-mark" as="span" aria-hidden="true">G</GardenerimPart></GardenerimPart>
              <GardenerimPart name="nav-rail-primary-action" as="button" type="button" aria-label="新建项目"><GardenerimPart name="nav-rail-icon" as="span" aria-hidden="true">＋</GardenerimPart></GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="nav-rail-group">
              <GardenerimPart name="nav-rail-group-label" as="span">工作区</GardenerimPart>
              <GardenerimPart name="nav-rail-list" as="ul">
                <li><a id="vue-rail-overview" class="g-nav-rail-item" href="#vue-rail-overview" aria-current="page"><GardenerimPart name="nav-rail-indicator" aria-hidden="true" /><GardenerimPart name="nav-rail-icon" as="span" aria-hidden="true">⌂</GardenerimPart><GardenerimPart name="nav-rail-label" as="span">概览</GardenerimPart></a></li>
                <li><a class="g-nav-rail-item" href="#vue-rail-projects"><GardenerimPart name="nav-rail-icon" as="span" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="nav-rail-label" as="span">项目</GardenerimPart><GardenerimPart name="nav-rail-badge" as="span" role="status" aria-label="8 个待处理项目">8</GardenerimPart></a></li>
                <li><a class="g-nav-rail-item" href="#vue-rail-tasks"><GardenerimPart name="nav-rail-icon" as="span" aria-hidden="true">✓</GardenerimPart><GardenerimPart name="nav-rail-label" as="span">任务</GardenerimPart></a></li>
                <li><a class="g-nav-rail-item" href="#vue-rail-admin" aria-disabled="true" tabindex="-1"><GardenerimPart name="nav-rail-icon" as="span" aria-hidden="true">♙</GardenerimPart><GardenerimPart name="nav-rail-label" as="span">管理</GardenerimPart></a></li>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="nav-rail-footer" as="footer">
              <GardenerimPart name="nav-rail-action" as="a" href="#vue-rail-account" aria-label="账户设置"><GardenerimPart name="nav-rail-icon" as="span" aria-hidden="true">林</GardenerimPart><GardenerimPart name="nav-rail-label" as="span">账户</GardenerimPart></GardenerimPart>
            </GardenerimPart>
          </GNavigationRail>
          <section class="g-stack g-gap-4 g-flex-1 g-min-w-0 g-border g-rounded-lg g-bg-subtle g-p-6" aria-labelledby="vue-rail-preview-title">
            <header><span class="g-badge">项目总览</span><h3 id="vue-rail-preview-title">欢迎回来，林予</h3><p class="g-text-muted">Rail 保留一级目的地，当前页面内容在右侧稳定呈现。</p></header>
            <div class="g-grid-auto">
              <article class="g-card g-p-4"><strong>进行中的项目</strong><p class="g-text-muted">8 个项目正在推进</p></article>
              <article class="g-card g-p-4"><strong>待处理任务</strong><p class="g-text-muted">12 项需要关注</p></article>
            </div>
          </section>
          </div>
        </GardenerimPart>
      </GCard>

      <GCard id="vue-activity-bar">
        <GardenerimPart name="card-header"><strong>Activity Bar</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">桌面工作台的活动切换器：主活动置顶、账户与设置沉底，当前项、通知、禁用与加载状态都有明确反馈；↑/↓、Home、End 可在可用活动间移动焦点。</p>
          <div class="g-cluster g-items-stretch g-gap-2 g-border g-rounded-lg g-bg-subtle" style="min-height: 22rem; overflow: hidden">
            <GActivityBar :variant="['dark']" data-g-orientation="vertical" aria-label="工作台活动">
              <GardenerimPart name="activitybar-header" as="header">
                <GardenerimPart name="activitybar-brand" as="a" href="#vue-activity-explorer" aria-label="Gardenerim 工作台" title="Gardenerim 工作台">G</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="activitybar-group">
                <GardenerimPart name="activitybar-list" as="ul">
                  <li><a id="vue-activity-explorer" class="g-activitybar-item" href="#vue-activity-explorer" aria-current="page" title="资源管理器"><GardenerimPart name="activitybar-indicator" aria-hidden="true" /><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">▱</GardenerimPart><GardenerimPart name="activitybar-label" as="span">资源管理器</GardenerimPart></a></li>
                  <li><a class="g-activitybar-item" href="#vue-activity-search" title="全局搜索"><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">⌕</GardenerimPart><GardenerimPart name="activitybar-label" as="span">全局搜索</GardenerimPart></a></li>
                  <li><a class="g-activitybar-item" href="#vue-activity-source" title="源代码管理"><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">⑂</GardenerimPart><GardenerimPart name="activitybar-label" as="span">源代码管理</GardenerimPart><GardenerimPart name="activitybar-badge" as="span" role="status" aria-label="3 个待提交变更">3</GardenerimPart></a></li>
                  <li><a class="g-activitybar-item" href="#vue-activity-extensions" title="扩展"><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="activitybar-label" as="span">扩展</GardenerimPart></a></li>
                  <li><a class="g-activitybar-item" href="#vue-activity-remote" aria-disabled="true" tabindex="-1" title="远程连接不可用"><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">⇄</GardenerimPart><GardenerimPart name="activitybar-label" as="span">远程连接不可用</GardenerimPart></a></li>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="activitybar-footer" as="footer">
                <GardenerimPart name="activitybar-action" as="a" href="#vue-activity-account" title="账户"><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">◎</GardenerimPart><GardenerimPart name="activitybar-label" as="span">账户</GardenerimPart><GardenerimPart name="activitybar-status" as="span" role="status" aria-label="已在线" /></GardenerimPart>
                <GardenerimPart name="activitybar-action" as="button" type="button" title="管理"><GardenerimPart name="activitybar-icon" as="span" aria-hidden="true">⚙</GardenerimPart><GardenerimPart name="activitybar-label" as="span">管理</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GActivityBar>
            <aside class="g-stack g-gap-3 g-p-4 g-border" style="width: 14rem" aria-labelledby="vue-activity-sidebar-title">
              <header><span class="g-text-muted">资源管理器</span><h3 id="vue-activity-sidebar-title">Gardenerim</h3></header>
              <nav class="g-stack g-gap-2" aria-label="项目文件"><a href="#vue-activity-src">▾ packages</a><a href="#vue-activity-css">　▾ css</a><a href="#vue-activity-components">　　desktop.css</a><a href="#vue-activity-tests">　　runtime.test.mjs</a></nav>
            </aside>
            <section class="g-stack g-gap-4 g-flex-1 g-min-w-0 g-p-6" aria-labelledby="vue-activity-editor-title">
              <header><span class="g-badge">desktop.css</span><h3 id="vue-activity-editor-title">Activity Bar 工作区</h3><p class="g-text-muted">活动栏只负责切换一级工作上下文；资源树与编辑区保持稳定，通知和连接状态不会挤压图标。</p></header>
              <div class="g-card g-p-4"><strong>当前活动：资源管理器</strong><p class="g-text-muted">5 个文件已打开 · 3 个变更待提交</p></div>
            </section>
          </div>
        </GardenerimPart>
      </GCard>

      <GCard id="vue-menu-bar">
        <GardenerimPart name="card-header"><strong>Menu Bar</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">桌面应用的全局命令入口，支持分组命令、快捷键、勾选项、禁用项和危险操作；顶层菜单使用 ←/→、Home/End，↓/↑ 打开菜单，菜单打开后可直接横向切换。</p>
          <section class="g-border g-rounded-lg" aria-labelledby="vue-menubar-workspace-title" style="min-height: 21rem; overflow: hidden">
            <GMenuBar :variant="['bordered']" role="menubar" aria-label="Gardenerim Studio 应用菜单">
              <GardenerimPart name="menubar-start">
                <GardenerimPart name="menubar-brand" as="span">Gardenerim Studio</GardenerimPart>
                <GardenerimPart name="menubar-list" as="ul" role="none">
                  <li role="none">
                    <GardenerimPart name="menubar-menu" class="g-dropdown" data-g-dropdown>
                      <GardenerimPart name="menubar-item" as="button" type="button" role="menuitem" data-g-dropdown-trigger><GardenerimPart name="menubar-item-label" as="span">文件</GardenerimPart><GardenerimPart name="menubar-item-caret" aria-hidden="true" /></GardenerimPart>
                      <GardenerimPart name="menubar-menu-panel" class="g-dropdown-menu g-menu" data-g-dropdown-menu hidden>
                        <GardenerimPart name="menubar-menu-group" as="ul" role="group" aria-label="文件命令">
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem"><GardenerimPart name="menubar-menu-item-icon" as="span" aria-hidden="true">＋</GardenerimPart><GardenerimPart name="menubar-menu-item-label" as="span">新建文件</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl N</GardenerimPart></GardenerimPart></li>
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem"><GardenerimPart name="menubar-menu-item-icon" as="span" aria-hidden="true">↗</GardenerimPart><GardenerimPart name="menubar-menu-item-label" as="span">打开工作区…</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl O</GardenerimPart></GardenerimPart></li>
                          <li role="separator" class="g-menubar-separator"></li>
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem"><GardenerimPart name="menubar-menu-item-label" as="span">保存</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl S</GardenerimPart></GardenerimPart></li>
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem" aria-disabled="true"><GardenerimPart name="menubar-menu-item-label" as="span">另存为…</GardenerimPart></GardenerimPart></li>
                        </GardenerimPart>
                      </GardenerimPart>
                    </GardenerimPart>
                  </li>
                  <li role="none">
                    <GardenerimPart name="menubar-menu" class="g-dropdown" data-g-dropdown>
                      <GardenerimPart name="menubar-item" as="button" type="button" role="menuitem" data-g-dropdown-trigger><GardenerimPart name="menubar-item-label" as="span">编辑</GardenerimPart><GardenerimPart name="menubar-item-caret" aria-hidden="true" /></GardenerimPart>
                      <GardenerimPart name="menubar-menu-panel" class="g-dropdown-menu g-menu" data-g-dropdown-menu hidden>
                        <GardenerimPart name="menubar-menu-group" as="ul" role="group" aria-label="编辑命令">
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem"><GardenerimPart name="menubar-menu-item-label" as="span">撤销</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl Z</GardenerimPart></GardenerimPart></li>
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem"><GardenerimPart name="menubar-menu-item-label" as="span">重做</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl Shift Z</GardenerimPart></GardenerimPart></li>
                          <li role="separator" class="g-menubar-separator"></li>
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitem"><GardenerimPart name="menubar-menu-item-label" as="span">查找</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl F</GardenerimPart></GardenerimPart></li>
                        </GardenerimPart>
                      </GardenerimPart>
                    </GardenerimPart>
                  </li>
                  <li role="none">
                    <GardenerimPart name="menubar-menu" class="g-dropdown" data-g-dropdown>
                      <GardenerimPart name="menubar-item" as="button" type="button" role="menuitem" data-g-dropdown-trigger><GardenerimPart name="menubar-item-label" as="span">视图</GardenerimPart><GardenerimPart name="menubar-item-caret" aria-hidden="true" /></GardenerimPart>
                      <GardenerimPart name="menubar-menu-panel" class="g-dropdown-menu g-menu" data-g-dropdown-menu hidden>
                        <GardenerimPart name="menubar-menu-group" as="ul" role="group" aria-label="视图选项">
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitemcheckbox" aria-checked="true"><GardenerimPart name="menubar-menu-item-check" as="span" aria-hidden="true">✓</GardenerimPart><GardenerimPart name="menubar-menu-item-label" as="span">显示资源管理器</GardenerimPart></GardenerimPart></li>
                          <li role="none"><GardenerimPart name="menubar-menu-item" class="g-menu-item" as="button" type="button" role="menuitemcheckbox" aria-checked="false"><GardenerimPart name="menubar-menu-item-check" as="span" aria-hidden="true">✓</GardenerimPart><GardenerimPart name="menubar-menu-item-label" as="span">显示终端</GardenerimPart><GardenerimPart name="menubar-menu-item-shortcut" as="kbd">Ctrl `</GardenerimPart></GardenerimPart></li>
                        </GardenerimPart>
                      </GardenerimPart>
                    </GardenerimPart>
                  </li>
                  <li role="none"><GardenerimPart name="menubar-item" as="button" type="button" role="menuitem">帮助</GardenerimPart></li>
                </GardenerimPart>
              </GardenerimPart>

            </GMenuBar>
              <GardenerimPart name="menubar-end"><GardenerimPart name="menubar-status" as="span" role="status">● 已保存</GardenerimPart></GardenerimPart>
            <div class="g-cluster g-items-stretch" style="min-height: 18rem">
              <aside class="g-stack g-gap-2 g-p-4 g-bg-subtle g-border" style="width: 14rem"><strong>资源管理器</strong><span>▾ packages</span><span>　▾ css</span><span>　　desktop.css</span><span>　　index.js</span></aside>
              <section class="g-stack g-gap-4 g-flex-1 g-min-w-0 g-p-6"><header><span class="g-badge">desktop.css</span><h3 id="vue-menubar-workspace-title">菜单栏工作区</h3><p class="g-text-muted">文件、编辑和视图命令保持在稳定的应用级入口中，菜单面板不会改变编辑区布局。</p></header><div class="g-card g-p-4"><strong>提示</strong><p class="g-text-muted">按 Alt 后通常由桌面外壳接管；组件内支持完整方向键与退出路径。</p></div></section>
            </div>
          </section>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Page Navbar</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">完整页面导航包含品牌、当前页面、主操作与可关闭的移动菜单；窄屏会自动保留最重要的操作。</p>
          <GNavbar as="header" :variant="['bordered', 'centered']">
            <GardenerimPart name="navbar-inner">
              <GardenerimPart name="navbar-start">
                <a class="g-navbar-brand" href="#vue-navbar-overview" aria-label="Gardenerim 控制台首页">
                  <GardenerimPart name="navbar-brand-mark" as="span" aria-hidden="true">G</GardenerimPart>
                  <GardenerimPart name="navbar-brand-text" as="span">Gardenerim</GardenerimPart>
                </a>
              </GardenerimPart>
              <GardenerimPart name="navbar-center">
                <GardenerimPart name="navbar-nav" as="nav" aria-label="主导航">
                  <a id="vue-navbar-overview" class="g-nav-link" href="#vue-navbar-overview" aria-current="page">概览</a>
                  <a class="g-nav-link" href="#vue-navbar-projects">项目</a>
                  <a class="g-nav-link" href="#vue-navbar-team">团队</a>
                  <a class="g-nav-link" href="#vue-navbar-reports">报表</a>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="navbar-end">
                <GardenerimPart name="navbar-actions">
                  <a class="g-btn g-btn-ghost g-navbar-action-secondary" href="#vue-navbar-help">帮助</a>
                  <GButton variant="primary" size="small">新建项目</GButton>
                  <button
                    class="g-btn g-btn-ghost g-btn-icon g-navbar-toggle"
                    type="button"
                    data-g-nav-toggle="vue-navbar-mobile"
                    data-g-dismiss-outside="true"
                    data-g-focus-first="true"
                    data-g-open-label="打开主导航"
                    data-g-close-label="关闭主导航"
                    aria-label="打开主导航"
                  ><GardenerimPart name="navbar-toggle-icon" as="span" aria-hidden="true" /></button>
                </GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart id="vue-navbar-mobile" name="navbar-mobile-panel" hidden>
              <GardenerimPart name="navbar-mobile-header">
                <strong>导航</strong>
                <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-nav-toggle="vue-navbar-mobile" aria-label="关闭主导航">关闭</button>
              </GardenerimPart>
              <GardenerimPart name="navbar-mobile-body">
                <GardenerimPart name="navbar-nav" as="nav" aria-label="移动端主导航">
                  <a class="g-nav-link" href="#vue-navbar-overview" aria-current="page" data-g-nav-close>概览</a>
                  <a class="g-nav-link" href="#vue-navbar-projects" data-g-nav-close>项目</a>
                  <a class="g-nav-link" href="#vue-navbar-team" data-g-nav-close>团队</a>
                  <a class="g-nav-link" href="#vue-navbar-reports" data-g-nav-close>报表</a>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="navbar-mobile-footer"><span class="g-text-muted">工作区：设计系统</span><GButton variant="primary" size="small">新建项目</GButton></GardenerimPart>
            </GardenerimPart>
          </GNavbar>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Application Sidebar</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <div class="g-cluster g-justify-between">
            <p class="g-text-muted">包含工作区品牌、搜索、分组层级、当前项、徽标、折叠轨道和移动抽屉。</p>
            <button class="g-btn g-btn-outline g-btn-sm" type="button" data-g-nav-toggle="vue-sidebar-drawer" data-g-dismiss-outside="true" data-g-focus-first="true" data-g-open-label="打开移动侧栏" data-g-close-label="关闭移动侧栏" aria-label="打开移动侧栏">移动抽屉</button>
          </div>
          <div style="display:grid;grid-template-columns:auto minmax(0,1fr);min-height:34rem;overflow:hidden;border:1px solid var(--g-color-border);border-radius:var(--g-radius-xl);background:var(--g-color-surface-subtle)">
            <GSidebar :variant="['bordered', 'compact', ...(sidebarCollapsed ? ['collapsed'] : [])]" aria-label="项目侧栏">
              <GardenerimPart name="sidebar-surface">
                <GardenerimPart name="sidebar-header" as="header">
                  <a class="g-sidebar-brand" href="#vue-sidebar-overview" aria-label="Gardenerim 工作区">
                    <GardenerimPart name="sidebar-brand-mark" as="span" aria-hidden="true">G</GardenerimPart>
                    <GardenerimPart name="sidebar-brand-content" as="span"><GardenerimPart name="sidebar-title" as="strong">Gardenerim</GardenerimPart><GardenerimPart name="sidebar-subtitle" as="small">设计系统</GardenerimPart></GardenerimPart>
                  </a>
                  <button class="g-sidebar-toggle" type="button" :aria-label="sidebarCollapsed ? '展开侧栏' : '折叠侧栏'" :aria-expanded="!sidebarCollapsed" @click="sidebarCollapsed = !sidebarCollapsed">{{ sidebarCollapsed ? '›' : '‹' }}</button>
                </GardenerimPart>
                <label class="g-sidebar-search"><span class="g-sr-only">搜索导航</span><input class="g-input" type="search" placeholder="搜索" aria-label="搜索导航" /></label>
                <GardenerimPart name="sidebar-body">
                  <GardenerimPart name="sidebar-nav" as="nav" data-g-roving-nav data-g-orientation="vertical" aria-label="项目导航">
                    <GardenerimPart name="sidebar-group">
                      <GardenerimPart name="sidebar-section" as="h3">工作区</GardenerimPart>
                      <GardenerimPart name="sidebar-list" as="ul">
                        <GardenerimPart name="sidebar-item" as="li"><a id="vue-sidebar-overview" class="g-sidebar-link" href="#vue-sidebar-overview" aria-current="page" aria-label="概览"><GardenerimPart name="sidebar-icon" as="span" aria-hidden="true">⌂</GardenerimPart><GardenerimPart name="sidebar-label" as="span">概览</GardenerimPart></a></GardenerimPart>
                        <GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-projects" aria-label="项目，8 项"><GardenerimPart name="sidebar-icon" as="span" aria-hidden="true">◇</GardenerimPart><GardenerimPart name="sidebar-label" as="span">项目</GardenerimPart><GardenerimPart name="sidebar-badge" as="span">8</GardenerimPart></a></GardenerimPart>
                        <GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-tasks" aria-label="任务"><GardenerimPart name="sidebar-icon" as="span" aria-hidden="true">✓</GardenerimPart><GardenerimPart name="sidebar-label" as="span">任务</GardenerimPart><GardenerimPart name="sidebar-meta" as="span">12</GardenerimPart></a></GardenerimPart>
                        <GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-team" aria-label="团队"><GardenerimPart name="sidebar-icon" as="span" aria-hidden="true">◎</GardenerimPart><GardenerimPart name="sidebar-label" as="span">团队</GardenerimPart></a></GardenerimPart>
                      </GardenerimPart>
                    </GardenerimPart>
                    <GardenerimPart name="sidebar-group">
                      <GardenerimPart name="sidebar-section" as="h3">管理</GardenerimPart>
                      <GardenerimPart name="sidebar-list" as="ul">
                        <GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-reports" aria-label="分析报表"><GardenerimPart name="sidebar-icon" as="span" aria-hidden="true">▥</GardenerimPart><GardenerimPart name="sidebar-label" as="span">分析报表</GardenerimPart></a></GardenerimPart>
                        <GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-settings" aria-label="设置"><GardenerimPart name="sidebar-icon" as="span" aria-hidden="true">⚙</GardenerimPart><GardenerimPart name="sidebar-label" as="span">设置</GardenerimPart><GardenerimPart name="sidebar-trailing" as="span">⌘,</GardenerimPart></a></GardenerimPart>
                      </GardenerimPart>
                    </GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="sidebar-footer" as="footer"><a class="g-sidebar-account" href="#vue-sidebar-account" aria-label="林予，产品设计师"><span class="g-avatar g-avatar-sm">林</span><GardenerimPart name="sidebar-account-content" as="span"><GardenerimPart name="sidebar-account-name" as="strong">林予</GardenerimPart><GardenerimPart name="sidebar-account-meta" as="small">产品设计师</GardenerimPart></GardenerimPart><GardenerimPart name="sidebar-trailing" as="span">•••</GardenerimPart></a></GardenerimPart>
              </GardenerimPart>
            </GSidebar>
            <section style="min-width:0;padding:var(--g-space-6)">
              <span class="g-badge">项目总览</span><h3 class="g-mt-3">欢迎回来，林予</h3><p class="g-text-muted">这里是与侧栏配套的内容区域，用来验证真实应用布局而非孤立占位符。</p>
              <div class="g-grid g-grid-cols-2 g-gap-3 g-mt-5"><div class="g-card g-card-compact"><div class="g-card-body"><strong>进行中的项目</strong><p class="g-text-muted">8 个</p></div></div><div class="g-card g-card-compact"><div class="g-card-body"><strong>待处理任务</strong><p class="g-text-muted">12 项</p></div></div></div>
            </section>
          </div>
          <GSidebar id="vue-sidebar-drawer" variant="drawer" hidden data-g-roving-nav data-g-orientation="vertical" aria-label="移动端项目导航">
            <GardenerimPart name="sidebar-header" as="header"><strong class="g-sidebar-title">项目导航</strong><button class="g-sidebar-toggle" type="button" data-g-nav-toggle="vue-sidebar-drawer" aria-label="关闭移动侧栏">×</button></GardenerimPart>
            <GardenerimPart name="sidebar-body"><GardenerimPart name="sidebar-nav" as="nav" aria-label="移动端导航"><GardenerimPart name="sidebar-list" as="ul"><GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-overview" aria-current="page" data-g-nav-close><span class="g-sidebar-icon" aria-hidden="true">⌂</span><span class="g-sidebar-label">概览</span></a></GardenerimPart><GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-projects" data-g-nav-close><span class="g-sidebar-icon" aria-hidden="true">◇</span><span class="g-sidebar-label">项目</span><span class="g-sidebar-badge">8</span></a></GardenerimPart><GardenerimPart name="sidebar-item" as="li"><a class="g-sidebar-link" href="#vue-sidebar-settings" data-g-nav-close><span class="g-sidebar-icon" aria-hidden="true">⚙</span><span class="g-sidebar-label">设置</span></a></GardenerimPart></GardenerimPart></GardenerimPart></GardenerimPart>
          </GSidebar>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Page Breadcrumb</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">使用有序列表表达页面层级，标记当前页，并通过原生 disclosure 收纳过深路径；无需额外 JavaScript 即可键盘操作。</p>
          <section style="padding:var(--g-space-5);border:1px solid var(--g-color-border);border-radius:var(--g-radius-xl);background:var(--g-color-surface-subtle)">
            <GBreadcrumb :variant="['contained', 'chevron']" aria-label="页面路径">
              <GardenerimPart name="breadcrumb-list" as="ol">
                <GardenerimPart name="breadcrumb-item" as="li">
                  <GardenerimPart name="breadcrumb-home" as="a" class="g-breadcrumb-link" href="#vue-breadcrumb-home">
                    <GardenerimPart name="breadcrumb-icon" as="span" aria-hidden="true">⌂</GardenerimPart>
                    <GardenerimPart name="breadcrumb-label" as="span">控制台</GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="breadcrumb-item" as="li"><GardenerimPart name="breadcrumb-link" as="a" href="#vue-breadcrumb-projects">项目</GardenerimPart></GardenerimPart>
                <GardenerimPart name="breadcrumb-item" as="li" data-g-breadcrumb-overflow>
                  <GardenerimPart name="breadcrumb-overflow" as="details">
                    <GardenerimPart name="breadcrumb-ellipsis" as="summary" aria-label="显示中间路径">•••</GardenerimPart>
                    <GardenerimPart name="breadcrumb-menu" as="ul">
                      <li><a href="#vue-breadcrumb-archive">项目归档</a></li>
                      <li><a href="#vue-breadcrumb-library">组件库</a></li>
                      <li><a href="#vue-breadcrumb-navigation">导航组件</a></li>
                    </GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="breadcrumb-item" as="li"><GardenerimPart name="breadcrumb-link" as="a" href="#vue-breadcrumb-design-system">设计系统</GardenerimPart></GardenerimPart>
                <GardenerimPart name="breadcrumb-item" as="li"><GardenerimPart name="breadcrumb-current" as="span" aria-current="page" title="面包屑导航组件规范与无障碍设计">面包屑导航组件规范与无障碍设计</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GBreadcrumb>
            <div class="g-mt-5"><span class="g-badge">导航 / 页面结构</span><h3 class="g-mt-3">面包屑导航组件</h3><p class="g-text-muted">清楚展示当前位置，同时让长路径在窄屏和复杂信息架构中仍然可读、可达。</p></div>
          </section>
          <div class="g-cluster g-gap-3">
            <GBreadcrumb variant="compact" aria-label="紧凑路径"><GardenerimPart name="breadcrumb-list" as="ol"><GardenerimPart name="breadcrumb-item" as="li"><a class="g-breadcrumb-link" href="#vue-breadcrumb-home">首页</a></GardenerimPart><GardenerimPart name="breadcrumb-item" as="li"><span class="g-breadcrumb-current" aria-current="page">设置</span></GardenerimPart></GardenerimPart></GBreadcrumb>
            <span class="g-text-muted">紧凑模式适合工具栏和抽屉。</span>
          </div>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Form Builder</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">从字段面板添加控件，选中后编辑属性；支持复制、排序、移除和实时 JSON 序列化。</p>
          <GFormBuilder variant="bordered" data-g-builder-status-template="{count} 个字段" aria-labelledby="vue-form-builder-title">
            <GardenerimPart name="form-builder-header" as="header">
              <GardenerimPart name="form-builder-heading">
                <GardenerimPart id="vue-form-builder-title" name="form-builder-title" as="h3">报名表单</GardenerimPart>
                <GardenerimPart name="form-builder-description">在画布中选择字段，再从右侧修改配置。</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="form-builder-actions">
                <GardenerimPart name="form-builder-status" as="span" data-g-builder-status role="status" aria-live="polite">2 个字段</GardenerimPart>
                <span class="g-badge"><b data-g-builder-count>2</b>&nbsp;项</span>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="form-builder-main">
              <GardenerimPart name="form-builder-palette" as="aside" aria-label="字段类型">
                <GardenerimPart name="form-builder-palette-header">添加字段</GardenerimPart>
                <GardenerimPart name="form-builder-palette-list">
                  <button class="g-form-builder-palette-item" type="button" data-g-builder-add data-g-builder-type="text" data-g-builder-label="单行文本">Aa 单行文本</button>
                  <button class="g-form-builder-palette-item" type="button" data-g-builder-add data-g-builder-type="email" data-g-builder-label="邮箱地址">@ 邮箱地址</button>
                  <button class="g-form-builder-palette-item" type="button" data-g-builder-add data-g-builder-type="textarea" data-g-builder-label="多行文本">≡ 多行文本</button>
                  <button class="g-form-builder-palette-item" type="button" data-g-builder-add data-g-builder-type="select" data-g-builder-label="下拉选择">⌄ 下拉选择</button>
                  <button class="g-form-builder-palette-item" type="button" data-g-builder-add data-g-builder-type="date" data-g-builder-label="日期">□ 日期</button>
                  <button class="g-form-builder-palette-item" type="button" data-g-builder-add data-g-builder-type="checkbox" data-g-builder-label="确认选项">✓ 确认选项</button>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="form-builder-canvas">
                <GardenerimPart name="form-builder-canvas-header"><span>表单画布</span><span class="g-text-muted">Alt + ↑ / ↓ 排序</span></GardenerimPart>
                <GardenerimPart name="form-builder-fields" data-g-builder-items>
                  <GardenerimPart name="form-builder-empty" data-g-builder-empty hidden>从左侧选择一种字段开始搭建表单。</GardenerimPart>
                  <GardenerimPart name="form-builder-field" as="section" data-g-builder-item data-g-builder-id="applicant-name" data-g-builder-type="text" data-g-builder-label="申请人姓名" data-g-builder-name="applicantName" data-g-builder-required="true">
                    <GardenerimPart name="form-builder-field-header" as="header">
                      <GardenerimPart name="form-builder-field-type" as="span" data-g-builder-bind="type">text</GardenerimPart>
                      <GardenerimPart name="form-builder-field-actions">
                        <button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-up aria-label="上移字段">↑</button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-down aria-label="下移字段">↓</button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-duplicate aria-label="复制字段">⧉</button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-remove aria-label="移除字段">×</button>
                      </GardenerimPart>
                    </GardenerimPart>
                    <GardenerimPart name="form-builder-field-body"><label class="g-label" data-g-builder-bind="label">申请人姓名</label><input class="g-input" data-g-builder-control placeholder="请输入姓名" /><small class="g-help" data-g-builder-bind="help" /></GardenerimPart>
                  </GardenerimPart>
                  <GardenerimPart name="form-builder-field" as="section" data-g-builder-item data-g-builder-id="project-summary" data-g-builder-type="textarea" data-g-builder-label="项目简介" data-g-builder-name="projectSummary" data-g-builder-placeholder="请简要介绍项目" data-g-builder-help="建议控制在 200 字以内">
                    <GardenerimPart name="form-builder-field-header" as="header">
                      <GardenerimPart name="form-builder-field-type" as="span" data-g-builder-bind="type">textarea</GardenerimPart>
                      <GardenerimPart name="form-builder-field-actions"><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-up aria-label="上移字段">↑</button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-down aria-label="下移字段">↓</button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-duplicate aria-label="复制字段">⧉</button><button class="g-btn g-btn-ghost g-btn-sm" type="button" data-g-builder-remove aria-label="移除字段">×</button></GardenerimPart>
                    </GardenerimPart>
                    <GardenerimPart name="form-builder-field-body"><label class="g-label" data-g-builder-bind="label">项目简介</label><textarea class="g-textarea" data-g-builder-control /><small class="g-help" data-g-builder-bind="help">建议控制在 200 字以内</small></GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="form-builder-inspector" as="aside" aria-label="字段属性">
                <GardenerimPart name="form-builder-inspector-header">字段属性</GardenerimPart>
                <GardenerimPart name="form-builder-inspector-empty" data-g-builder-inspector-empty>选择画布中的字段以编辑属性。</GardenerimPart>
                <GardenerimPart name="form-builder-inspector-body" data-g-builder-inspector-body>
                  <label class="g-field"><span class="g-label">标题</span><input class="g-input" data-g-builder-property="label" /></label>
                  <label class="g-field"><span class="g-label">字段名</span><input class="g-input" data-g-builder-property="name" /></label>
                  <label class="g-field"><span class="g-label">占位提示</span><input class="g-input" data-g-builder-property="placeholder" /></label>
                  <label class="g-field"><span class="g-label">帮助文本</span><textarea class="g-textarea" data-g-builder-property="help" /></label>
                  <label class="g-check"><input type="checkbox" data-g-builder-property="required" /><span>必填字段</span></label>
                </GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <textarea class="g-form-builder-output" name="formSchema" data-g-builder-output aria-hidden="true" tabindex="-1" />
          </GFormBuilder>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>开箱即用</strong></GardenerimPart>
        <GardenerimPart name="card-body">
          <p>组件支持 variant、state、config、slots、原生 attributes 和运行时实例访问。</p>
          <GButton variant="primary" @click="open">打开对话框</GButton>
        </GardenerimPart>
      </GCard>

      <GCard data-g-conditional-scope>
        <GardenerimPart name="card-header"><strong>Conditional Field</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <div class="g-field">
            <label class="g-label" for="vue-delivery-method">交付方式</label>
            <GSelect id="vue-delivery-method" v-model="deliveryMethod" name="deliveryMethod">
              <option value="pickup">到店自取</option>
              <option value="shipping">快递配送</option>
            </GSelect>
          </div>
          <GConditionalField variant="panel" :config="deliveryCondition">
            <GardenerimPart name="conditional-field-header">
              <div>
                <GardenerimPart name="conditional-field-title">配送信息</GardenerimPart>
                <GardenerimPart name="conditional-field-description">只在选择快递配送时显示并参与提交。</GardenerimPart>
              </div>
              <GardenerimPart name="conditional-field-status" as="span">按条件显示</GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="conditional-field-content">
              <div class="g-field">
                <label class="g-label" for="vue-shipping-address">配送地址</label>
                <GInput id="vue-shipping-address" name="shippingAddress" autocomplete="street-address" required />
              </div>
            </GardenerimPart>
          </GConditionalField>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Time Picker</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">选择发布时间；支持直接输入、时间边界、五分钟步进、快捷时间和完整键盘操作。</p>
          <GTimePicker
            v-model="selectedPublishTime"
            :variant="['inline', 'with-presets', 'with-footer']"
            :config="timePickerConfig"
            model-event="wheelchange"
            model-key="value"
            aria-label="选择发布时间"
          >
            <GardenerimPart name="time-picker-control" data-g-time-picker-trigger>
              <GardenerimPart name="time-picker-icon" as="span" aria-hidden="true">
                <svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="5.75" fill="none" stroke="currentColor" stroke-width="1.5" /><path d="M8 4.8v3.5l2.4 1.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" /></svg>
              </GardenerimPart>
              <input class="g-time-picker-input" data-g-time-picker-input inputmode="numeric" autocomplete="off" placeholder="HH:mm" aria-label="发布时间" />
              <button class="g-time-picker-clear" type="button" data-g-time-picker-clear aria-label="清空时间">×</button>
            </GardenerimPart>
            <GardenerimPart id="vue-time-picker-panel" name="time-picker-panel">
              <GardenerimPart name="time-picker-presets" aria-label="快捷时间">
                <button class="g-time-picker-preset" type="button" data-g-time-picker-preset="morning">上午 9:00</button>
                <button class="g-time-picker-preset" type="button" data-g-time-picker-preset="noon">中午 12:00</button>
                <button class="g-time-picker-preset" type="button" data-g-time-picker-preset="evening">下午 18:00</button>
              </GardenerimPart>
              <GardenerimPart name="time-picker-columns" data-g-time-picker-columns />
              <GardenerimPart name="time-picker-footer" as="footer">
                <GardenerimPart name="time-picker-status" as="span" data-g-time-picker-status role="status" aria-live="polite">尚未选择时间</GardenerimPart>
                <GardenerimPart name="time-picker-actions">
                  <GButton variant="ghost" size="small" data-g-time-picker-now>现在</GButton>
                  <GButton variant="primary" size="small" data-g-time-picker-apply>确定</GButton>
                </GardenerimPart>
              </GardenerimPart>
            </GardenerimPart>
            <input class="g-time-picker-output" type="hidden" name="publishTime" data-g-time-picker-output />
          </GTimePicker>
          <p class="g-help">当前值：{{ selectedPublishTime || '未选择' }}</p>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Date Picker</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">选择发布日期；支持月份导航、日期边界、快捷日期和完整键盘网格操作。</p>
          <GDatePicker
            v-model="selectedPublishDates"
            :variant="['inline', 'with-presets', 'with-footer']"
            :config="datePickerConfig"
            model-event="pickerchange"
            model-key="values"
            aria-label="选择发布日期"
          >
            <GardenerimPart name="date-picker-presets" aria-label="快捷日期">
              <button class="g-date-picker-preset" type="button" data-g-date-picker-preset="today">今天</button>
              <button class="g-date-picker-preset" type="button" data-g-date-picker-preset="tomorrow">明天</button>
              <button class="g-date-picker-preset" type="button" data-g-date-picker-preset="next-week">一周后</button>
            </GardenerimPart>
            <GardenerimPart name="date-picker-header" as="header">
              <GardenerimPart name="date-picker-navigation" aria-label="月份导航">
                <button class="g-date-picker-previous" type="button" data-g-date-picker-previous aria-label="上个月">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m10 3-5 5 5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" /></svg>
                </button>
              </GardenerimPart>
              <GardenerimPart id="vue-date-picker-title" name="date-picker-title" as="h3" data-g-date-picker-title aria-live="polite">2026年9月</GardenerimPart>
              <GardenerimPart name="date-picker-navigation" aria-label="月份导航">
                <button class="g-date-picker-next" type="button" data-g-date-picker-next aria-label="下个月">
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" /></svg>
                </button>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart name="date-picker-body">
              <GardenerimPart name="calendar-grid" data-g-date-picker-grid aria-labelledby="vue-date-picker-title" />
            </GardenerimPart>
            <input class="g-date-picker-output" type="hidden" name="publishDate" data-g-date-picker-output :value="selectedPublishDates[0] || ''" />
            <GardenerimPart name="date-picker-footer" as="footer">
              <GardenerimPart name="date-picker-selection">
                <GardenerimPart name="date-picker-status" as="span" data-g-date-picker-status role="status" aria-live="polite">尚未选择日期</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="date-picker-actions">
                <GButton variant="ghost" size="small" data-g-date-picker-clear>清空</GButton>
                <GButton variant="outline" size="small" data-g-date-picker-today>今天</GButton>
              </GardenerimPart>
            </GardenerimPart>
          </GDatePicker>
          <p class="g-help">当前值：{{ selectedPublishDates[0] || '未选择' }}</p>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Pin Input</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">输入 6 位验证码；支持自动跳格、整串粘贴、退格回退、方向键导航和原生表单提交。</p>
          <GPinInput
            v-model="verificationPin"
            variant="boxed"
            :config="pinInputConfig"
            model-event="otpchange"
            model-key="value"
            aria-labelledby="vue-pin-input-label"
            aria-describedby="vue-pin-input-status vue-pin-input-help"
          >
            <GardenerimPart id="vue-pin-input-label" name="pin-input-label">短信验证码</GardenerimPart>
            <GardenerimPart name="pin-input-cells">
              <input class="g-pin-input-cell" data-g-pin-input-cell inputmode="numeric" autocomplete="one-time-code" :value="verificationPin[0] || ''" />
              <input class="g-pin-input-cell" data-g-pin-input-cell inputmode="numeric" autocomplete="off" :value="verificationPin[1] || ''" />
              <input class="g-pin-input-cell" data-g-pin-input-cell inputmode="numeric" autocomplete="off" :value="verificationPin[2] || ''" />
              <input class="g-pin-input-cell" data-g-pin-input-cell inputmode="numeric" autocomplete="off" :value="verificationPin[3] || ''" />
              <input class="g-pin-input-cell" data-g-pin-input-cell inputmode="numeric" autocomplete="off" :value="verificationPin[4] || ''" />
              <input class="g-pin-input-cell" data-g-pin-input-cell inputmode="numeric" autocomplete="off" :value="verificationPin[5] || ''" />
            </GardenerimPart>
            <input class="g-pin-input-output" type="hidden" name="verificationCode" data-g-pin-input-output :value="verificationPin" />
            <GardenerimPart name="pin-input-footer" as="footer">
              <GardenerimPart id="vue-pin-input-status" name="pin-input-status" as="span" data-g-pin-input-status role="status" aria-live="polite">请输入 6 位验证码</GardenerimPart>
              <GardenerimPart name="pin-input-actions">
                <button class="g-pin-input-clear" type="button" data-g-pin-input-clear>清空</button>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart id="vue-pin-input-help" name="pin-input-help">可直接粘贴完整验证码；仅接受数字。</GardenerimPart>
          </GPinInput>
          <p class="g-help">当前值：{{ verificationPin || '未输入' }}</p>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Rating</strong></GardenerimPart>
        <GardenerimPart name="card-body" class="g-stack g-gap-3">
          <p class="g-text-muted">支持整星与半星、悬停预览、键盘调整、再次选择清空和原生表单值。</p>
          <GRating
            v-model="experienceRating"
            :variant="['large', 'half', 'clearable', 'with-label', 'with-value']"
            :config="ratingConfig"
            model-event="ratingchange"
            model-key="value"
            aria-labelledby="vue-rating-label"
            aria-describedby="vue-rating-status vue-rating-help"
          >
            <GardenerimPart id="vue-rating-label" name="rating-label">本次体验评分</GardenerimPart>
            <GardenerimPart name="rating-items">
              <button v-for="score in 5" :key="score" class="g-rating-item" type="button" data-g-rating-item :data-g-value="score"><span class="g-rating-icon" aria-hidden="true" /></button>
            </GardenerimPart>
            <input class="g-rating-output" type="hidden" name="experienceRating" data-g-rating-output />
            <GardenerimPart name="rating-footer" as="footer">
              <GardenerimPart id="vue-rating-status" name="rating-status" as="span" data-g-rating-status role="status" aria-live="polite">已评分：3.5 / 5 星</GardenerimPart>
              <GardenerimPart name="rating-actions">
                <GardenerimPart name="rating-value" as="strong" data-g-rating-value-label>3.5 / 5</GardenerimPart>
                <button class="g-rating-clear" type="button" data-g-rating-clear>清除</button>
              </GardenerimPart>
            </GardenerimPart>
            <GardenerimPart id="vue-rating-help" name="rating-help">方向键每次调整半星，Home 清空，End 选择满分。</GardenerimPart>
          </GRating>
          <p class="g-help">当前评分：{{ experienceRating || '未评分' }}</p>
        </GardenerimPart>
      </GCard>

      <GCard>
        <GardenerimPart name="card-header"><strong>Form Actions</strong></GardenerimPart>
        <GardenerimPart name="card-body">
          <form id="vue-autosave-form" class="g-form" @submit.prevent>
            <GValidationSummary
              :variant="['spacious']"
              :config="validationSummaryConfig"
              aria-labelledby="vue-validation-summary-title"
              aria-describedby="vue-validation-summary-description vue-validation-summary-status"
            >
              <GardenerimPart name="validation-summary-icon" aria-hidden="true" />
              <GardenerimPart name="validation-summary-content">
                <GardenerimPart name="validation-summary-header">
                  <GardenerimPart id="vue-validation-summary-title" name="validation-summary-title" as="h3">提交前请修正以下内容</GardenerimPart>
                  <GardenerimPart name="validation-summary-count" as="span" data-g-validation-count />
                </GardenerimPart>
                <GardenerimPart id="vue-validation-summary-description" name="validation-summary-description" as="p">选择问题即可直接返回对应字段。</GardenerimPart>
                <GardenerimPart name="validation-summary-list" as="ul" data-g-validation-list />
                <GardenerimPart id="vue-validation-summary-status" name="validation-summary-status" as="span" data-g-validation-status />
              </GardenerimPart>
            </GValidationSummary>
            <GFormProgress :variant="['card', 'with-steps']" :state="projectProgressState">
              <GardenerimPart name="form-progress-header">
                <GardenerimPart name="form-progress-heading">
                  <GardenerimPart id="vue-progress-label" name="form-progress-label" as="strong">项目配置</GardenerimPart>
                  <GardenerimPart id="vue-progress-description" name="form-progress-description" as="span">填写 3 项必要信息后即可提交审核。</GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="form-progress-count" as="span">已完成 {{ completedProjectFields }} / 3</GardenerimPart>
                <GardenerimPart name="form-progress-percentage" as="strong">{{ projectProgressPercent }}%</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart
                name="form-progress-track"
                role="progressbar"
                aria-labelledby="vue-progress-label"
                aria-describedby="vue-progress-description"
                :aria-valuemin="0"
                :aria-valuemax="3"
                :aria-valuenow="completedProjectFields"
                :aria-valuetext="`已完成 ${completedProjectFields} 项，共 3 项`"
              >
                <GardenerimPart name="form-progress-value" :style="projectProgressStyle" />
              </GardenerimPart>
              <GardenerimPart name="form-progress-steps" as="ol" aria-label="项目配置步骤">
                <GardenerimPart name="form-progress-step" as="li" :class="projectName.trim() ? 'is-complete' : 'is-active'" :aria-current="projectName.trim() ? undefined : 'step'">
                  <GardenerimPart name="form-progress-step-marker" as="span" aria-hidden="true">1</GardenerimPart>
                  <GardenerimPart name="form-progress-step-content" as="span"><GardenerimPart name="form-progress-step-title" as="strong">项目名称</GardenerimPart><GardenerimPart name="form-progress-step-description" as="span">{{ projectName.trim() ? '已完成' : '待填写' }}</GardenerimPart></GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="form-progress-step" as="li" :class="projectOwner.trim() ? 'is-complete' : projectName.trim() ? 'is-active' : ''" :aria-current="!projectOwner.trim() && projectName.trim() ? 'step' : undefined">
                  <GardenerimPart name="form-progress-step-marker" as="span" aria-hidden="true">2</GardenerimPart>
                  <GardenerimPart name="form-progress-step-content" as="span"><GardenerimPart name="form-progress-step-title" as="strong">负责人</GardenerimPart><GardenerimPart name="form-progress-step-description" as="span">{{ projectOwner.trim() ? '已完成' : '待填写' }}</GardenerimPart></GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="form-progress-step" as="li" :class="publishScope ? 'is-complete' : projectOwner.trim() ? 'is-active' : ''" :aria-current="!publishScope && projectOwner.trim() ? 'step' : undefined">
                  <GardenerimPart name="form-progress-step-marker" as="span" aria-hidden="true">3</GardenerimPart>
                  <GardenerimPart name="form-progress-step-content" as="span"><GardenerimPart name="form-progress-step-title" as="strong">发布范围</GardenerimPart><GardenerimPart name="form-progress-step-description" as="span">{{ publishScope ? '已完成' : '待选择' }}</GardenerimPart></GardenerimPart>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="form-progress-status" as="span" role="status">{{ completedProjectFields === 3 ? '配置已完整，可以提交审核。' : `还需完成 ${3 - completedProjectFields} 项。` }}</GardenerimPart>
            </GFormProgress>
            <div class="g-field">
              <label class="g-label" for="vue-project-name">项目名称</label>
              <GInput id="vue-project-name" v-model="projectName" name="projectName" required />
            </div>
            <div class="g-field">
              <label class="g-label" for="vue-project-owner">负责人</label>
              <GInput id="vue-project-owner" v-model="projectOwner" name="projectOwner" autocomplete="name" placeholder="请输入负责人" required />
            </div>
            <div class="g-field">
              <label class="g-label" for="vue-publish-scope">发布范围</label>
              <GSelect id="vue-publish-scope" v-model="publishScope" name="publishScope" required>
                <option disabled value="">请选择发布范围</option>
                <option value="team">仅团队成员</option>
                <option value="public">公开访问</option>
              </GSelect>
            </div>
            <GFormReview :variant="['subtle', 'editable']" :state="projectReviewState" aria-labelledby="vue-review-title" aria-describedby="vue-review-description">
              <GardenerimPart name="form-review-header">
                <GardenerimPart name="form-review-heading">
                  <GardenerimPart id="vue-review-title" name="form-review-title" as="h3">提交前确认</GardenerimPart>
                  <GardenerimPart id="vue-review-description" name="form-review-description" as="p">核对配置；编辑操作会回到对应字段。</GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="form-review-summary" as="span">{{ completedProjectFields }} / 3 项完整</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="form-review-section" as="section" aria-labelledby="vue-review-project-title">
                <GardenerimPart name="form-review-section-header">
                  <GardenerimPart id="vue-review-project-title" name="form-review-section-title" as="h4">项目资料</GardenerimPart>
                  <GardenerimPart name="form-review-section-description" as="span">提交后用于审核</GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="form-review-list" as="dl">
                  <GardenerimPart name="form-review-row" as="div" :class="projectName.trim() ? '' : 'is-warning'">
                    <GardenerimPart name="form-review-label" as="dt">项目名称</GardenerimPart>
                    <GardenerimPart name="form-review-value" as="dd"><GardenerimPart :name="projectName.trim() ? 'form-review-value-primary' : 'form-review-empty'" as="span">{{ projectName.trim() || '未填写' }}</GardenerimPart></GardenerimPart>
                    <GardenerimPart name="form-review-action" as="dd"><GButton variant="link" size="small" aria-label="编辑项目名称" @click="focusProjectField('vue-project-name')">编辑</GButton></GardenerimPart>
                  </GardenerimPart>
                  <GardenerimPart name="form-review-row" as="div" :class="projectOwner.trim() ? '' : 'is-warning'">
                    <GardenerimPart name="form-review-label" as="dt">负责人</GardenerimPart>
                    <GardenerimPart name="form-review-value" as="dd"><GardenerimPart :name="projectOwner.trim() ? 'form-review-value-primary' : 'form-review-empty'" as="span">{{ projectOwner.trim() || '未填写' }}</GardenerimPart><GardenerimPart v-if="projectOwner.trim()" name="form-review-value-secondary" as="span">将接收审核通知</GardenerimPart></GardenerimPart>
                    <GardenerimPart name="form-review-action" as="dd"><GButton variant="link" size="small" aria-label="编辑负责人" @click="focusProjectField('vue-project-owner')">编辑</GButton></GardenerimPart>
                  </GardenerimPart>
                  <GardenerimPart name="form-review-row" as="div" :class="publishScope ? '' : 'is-warning'">
                    <GardenerimPart name="form-review-label" as="dt">发布范围</GardenerimPart>
                    <GardenerimPart name="form-review-value" as="dd"><GardenerimPart :name="publishScope ? 'form-review-value-primary' : 'form-review-empty'" as="span">{{ publishScopeLabel || '未选择' }}</GardenerimPart></GardenerimPart>
                    <GardenerimPart name="form-review-action" as="dd"><GButton variant="link" size="small" aria-label="编辑发布范围" @click="focusProjectField('vue-publish-scope')">编辑</GButton></GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart name="form-review-footer" as="footer">
                <GardenerimPart name="form-review-status" as="span" :role="completedProjectFields === 3 ? 'status' : 'alert'">{{ completedProjectFields === 3 ? '资料完整，可以提交审核。' : `还有 ${3 - completedProjectFields} 项需要补充。` }}</GardenerimPart>
              </GardenerimPart>
            </GFormReview>
            <GConsentGroup
              as="fieldset"
              :variant="['legal', 'divided']"
              :state="consentState"
              :aria-describedby="consentComplete ? 'vue-consent-description vue-consent-status' : 'vue-consent-description vue-consent-feedback'"
              :aria-invalid="consentComplete ? undefined : 'true'"
            >
              <GardenerimPart id="vue-consent-title" name="consent-group-title" as="legend">
                确认与授权<GardenerimPart name="consent-group-required" as="span">必选</GardenerimPart>
              </GardenerimPart>
              <GardenerimPart id="vue-consent-description" name="consent-group-description" as="p">必要授权彼此独立且默认不勾选；可选通知不会影响提交。</GardenerimPart>
              <GardenerimPart name="consent-group-summary" as="span">必要授权 {{ acceptedRequiredConsents }} / 2</GardenerimPart>
              <GardenerimPart name="consent-group-items">
                <GardenerimPart name="consent-group-item" class="g-check">
                  <input id="vue-consent-terms" v-model="termsAccepted" class="g-consent-group-control" name="termsAccepted" type="checkbox" required />
                  <GardenerimPart name="consent-group-content">
                    <GardenerimPart name="consent-group-label" as="label" for="vue-consent-terms">我同意服务条款</GardenerimPart>
                    <GardenerimPart name="consent-group-item-description" as="span">确认账户、组织配置及提交内容符合平台规则。</GardenerimPart>
                    <GardenerimPart name="consent-group-links" as="span"><a class="g-consent-group-link" href="#vue-service-terms">查看服务条款</a></GardenerimPart>
                  </GardenerimPart>
                  <GardenerimPart name="consent-group-meta" as="span"><GardenerimPart name="consent-group-version" as="span">版本 2.1</GardenerimPart></GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="consent-group-item" class="g-check">
                  <input id="vue-consent-privacy" v-model="privacyAccepted" class="g-consent-group-control" name="privacyAccepted" type="checkbox" required />
                  <GardenerimPart name="consent-group-content">
                    <GardenerimPart name="consent-group-label" as="label" for="vue-consent-privacy">我同意隐私政策</GardenerimPart>
                    <GardenerimPart name="consent-group-item-description" as="span">允许处理本次申请所需的联系人和审核资料。</GardenerimPart>
                    <GardenerimPart name="consent-group-links" as="span"><a class="g-consent-group-link" href="#vue-privacy-policy">查看隐私政策</a><a class="g-consent-group-link" href="#vue-data-summary">数据使用摘要</a></GardenerimPart>
                  </GardenerimPart>
                  <GardenerimPart name="consent-group-meta" as="span"><GardenerimPart name="consent-group-version" as="span">版本 3.0</GardenerimPart></GardenerimPart>
                </GardenerimPart>
                <GardenerimPart name="consent-group-item" class="g-check">
                  <input id="vue-consent-updates" v-model="productUpdatesAccepted" class="g-consent-group-control" name="productUpdatesAccepted" type="checkbox" />
                  <GardenerimPart name="consent-group-content">
                    <GardenerimPart name="consent-group-label" as="label" for="vue-consent-updates">接收产品更新（可选）</GardenerimPart>
                    <GardenerimPart name="consent-group-item-description" as="span">偶尔接收功能更新；可随时在通知设置中取消。</GardenerimPart>
                  </GardenerimPart>
                </GardenerimPart>
              </GardenerimPart>
              <GardenerimPart v-if="!consentComplete" id="vue-consent-feedback" name="consent-group-feedback" as="p" role="alert">还需完成 {{ 2 - acceptedRequiredConsents }} 项必要授权后才能提交。</GardenerimPart>
              <GardenerimPart name="consent-group-footer" as="footer">
                <GardenerimPart id="vue-consent-status" name="consent-group-status" as="span" role="status">{{ consentComplete ? '必要授权已完成' : '必要授权尚未完成' }}</GardenerimPart>
                <GardenerimPart name="consent-group-meta" as="span"><GardenerimPart name="consent-group-timestamp" as="time" datetime="2026-09-05">更新于 2026-09-05</GardenerimPart></GardenerimPart>
              </GardenerimPart>
            </GConsentGroup>
            <GFormActions :variant="['between', 'bordered']" role="group" aria-label="项目表单操作">
              <GardenerimPart name="form-actions-secondary">
                <GButton variant="ghost">取消</GButton>
              </GardenerimPart>
              <GardenerimPart name="form-actions-meta">
                <GAutosaveStatus variant="badge" :config="autosaveConfig" @gardener:autosaverequest="handleAutosaveRequest">
                  <GardenerimPart name="autosave-status-indicator" as="span" aria-hidden="true" />
                  <GardenerimPart name="autosave-status-label" as="span" data-g-autosave-label role="status" aria-live="polite">已保存</GardenerimPart>
                  <GardenerimPart name="autosave-status-time" as="time" data-g-autosave-time />
                  <GardenerimPart name="autosave-status-actions" as="span">
                    <GButton class="g-autosave-status-retry" variant="ghost" data-g-autosave-retry>重试</GButton>
                  </GardenerimPart>
                </GAutosaveStatus>
              </GardenerimPart>
              <GardenerimPart name="form-actions-main">
                <GButton variant="outline">保存草稿</GButton>
                <GButton variant="primary" type="submit" :disabled="completedProjectFields !== 3 || !consentComplete" :aria-describedby="!consentComplete ? 'vue-consent-feedback' : completedProjectFields !== 3 ? 'vue-review-description' : undefined">提交审核</GButton>
              </GardenerimPart>
            </GFormActions>
          </form>
        </GardenerimPart>
      </GCard>

      <GDialog ref="dialog" hidden>
        <div class="g-dialog" aria-labelledby="demo-title">
          <h2 id="demo-title">Gardenerim Vue 对话框</h2>
          <p>底层复用 Gardenerim 的焦点管理、键盘和生命周期行为。</p>
          <GButton data-g-close variant="primary">完成</GButton>
        </div>
      </GDialog>
    </main>
  </GardenerimProvider>
</template>
