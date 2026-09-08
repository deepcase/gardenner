var e=`<script setup lang="ts">
import { ref } from "vue";
import { GSwitch, GSwitchRow } from "@gardenerim/vue";

const enabled = ref(true);
const quietHours = ref(false);
const cloudSync = ref(true);
const cloudSaving = ref(false);
const settings = ref({ autoSave: true, desktopNotifications: false, analytics: false });

const saveCloudSync = (event: Event) => {
  cloudSync.value = (event.target as HTMLInputElement).checked;
  cloudSaving.value = true;
  window.setTimeout(() => { cloudSaving.value = false; }, 900);
};
<\/script>

<template>
  <article id="component-switch" class="component-doc switch-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / IMMEDIATE TOGGLE</span>
        <h2>开关 <span>Switch / GSwitch</span></h2>
        <p>用于立即改变两个互斥状态；保留原生 checkbox 表单能力，同时提供轨道内容、加载反馈和完整设置行。</p>
      </div>
      <span class="component-status">css-ready · native semantics</span>
    </header>

    <section class="usage-section">
      <h3>基本用法与受控状态</h3>
      <p>点击后立即生效，当前结果同时通过轨道位置、颜色、文字和实时状态说明表达。</p>
      <div class="usage-preview usage-preview--block switch-basic-grid">
        <div class="switch-demo-item">
          <GSwitch as="label">
            <input v-model="enabled" type="checkbox" role="switch" name="feature-enabled" />
            <span class="g-switch-track" aria-hidden="true" />
            <span class="g-switch-content"><strong class="g-switch-label">启用协作功能</strong><small class="g-switch-description">切换后立即对当前项目生效</small></span>
          </GSwitch>
          <output class="switch-live-value" aria-live="polite">当前状态：{{ enabled ? '已开启' : '已关闭' }}</output>
        </div>
        <GSwitch as="label" variant="reverse" class="switch-compact-setting">
          <input v-model="quietHours" type="checkbox" role="switch" name="quiet-hours" />
          <span class="g-switch-track" aria-hidden="true" />
          <span class="g-switch-content"><strong class="g-switch-label">免打扰时段</strong><small class="g-switch-description">22:00 至次日 08:00 暂停普通通知</small></span>
        </GSwitch>
      </div>
    </section>

    <section class="usage-section">
      <h3>四档尺寸</h3>
      <p>Mini、Small、Medium、Large 与同尺寸输入框和按钮对齐；移动端非 Mini 开关保留足够触控区域。</p>
      <div class="usage-preview usage-preview--block switch-size-row">
        <label v-for="size in ['mini', 'small', 'medium', 'large']" :key="size" class="switch-size-item">
          <span>{{ size }}</span>
          <GSwitch as="span" :variant="size">
            <input type="checkbox" role="switch" checked :aria-label="\`\${size} switch\`" />
            <span class="g-switch-track" aria-hidden="true" />
          </GSwitch>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>轨道文字、图标与自定义手柄</h3>
      <p>短文字或图标可以置于轨道内部；较长解释仍应放在外部标签，避免压缩触控目标。</p>
      <div class="usage-preview usage-preview--block switch-content-row">
        <GSwitch as="label" :variant="['wide', 'inline-prompt']">
          <input type="checkbox" role="switch" checked aria-label="服务状态" />
          <span class="g-switch-track" aria-hidden="true"><span class="g-switch-checked-content">ON</span><span class="g-switch-unchecked-content">OFF</span></span>
        </GSwitch>
        <GSwitch as="label" :variant="['wide', 'inline-prompt']">
          <input type="checkbox" role="switch" aria-label="审批状态" />
          <span class="g-switch-track" aria-hidden="true"><span class="g-switch-checked-content">是</span><span class="g-switch-unchecked-content">否</span></span>
        </GSwitch>
        <GSwitch as="label" variant="large">
          <input type="checkbox" role="switch" checked aria-label="自定义手柄" />
          <span class="g-switch-track" aria-hidden="true"><span class="g-switch-handle">✓</span></span>
        </GSwitch>
        <GSwitch as="label" variant="square">
          <input type="checkbox" role="switch" aria-label="方形开关" />
          <span class="g-switch-track" aria-hidden="true" />
        </GSwitch>
      </div>
    </section>

    <section class="usage-section">
      <h3>加载、禁用与语义状态</h3>
      <p>异步保存期间锁定控件并显示进度；禁用态保留当前值，错误态同时提供说明文本而非只改变颜色。</p>
      <div class="usage-preview usage-preview--block switch-state-grid">
        <div class="switch-state-item">
          <GSwitch as="label" :state="cloudSaving ? 'loading' : undefined" :aria-busy="cloudSaving">
            <input type="checkbox" role="switch" :checked="cloudSync" :disabled="cloudSaving" aria-describedby="cloud-sync-help" @change="saveCloudSync" />
            <span class="g-switch-track" aria-hidden="true" />
            <span class="g-switch-label">云端同步</span>
          </GSwitch>
          <small id="cloud-sync-help" class="g-field-help">{{ cloudSaving ? '正在保存设置…' : '点击后模拟异步保存' }}</small>
        </div>
        <div class="switch-state-item">
          <GSwitch as="label" state="loading" aria-busy="true"><input type="checkbox" role="switch" checked disabled aria-label="正在开启" /><span class="g-switch-track" aria-hidden="true" /><span class="g-switch-label">开启中</span></GSwitch>
          <small class="g-field-help">静态加载展示</small>
        </div>
        <div class="switch-state-item">
          <GSwitch as="label"><input type="checkbox" role="switch" checked disabled aria-label="已启用且不可修改" /><span class="g-switch-track" aria-hidden="true" /><span class="g-switch-label">已启用</span></GSwitch>
          <small class="g-field-help">禁用但保留状态</small>
        </div>
        <div class="switch-state-item">
          <GSwitch as="label" state="invalid" aria-invalid="true"><input type="checkbox" role="switch" aria-invalid="true" aria-describedby="switch-error-help" /><span class="g-switch-track" aria-hidden="true" /><span class="g-switch-content"><span class="g-switch-label">公开访问</span><small id="switch-error-help" class="g-switch-description">当前组织策略不允许公开</small></span></GSwitch>
        </div>
        <div class="switch-state-item">
          <GSwitch as="label" state="success"><input type="checkbox" role="switch" checked aria-label="安全扫描" /><span class="g-switch-track" aria-hidden="true" /><span class="g-switch-label">安全扫描</span></GSwitch>
          <small class="g-field-help">成功语义色</small>
        </div>
        <div class="switch-state-item">
          <GSwitch as="label" state="danger"><input type="checkbox" role="switch" checked aria-label="维护模式" /><span class="g-switch-track" aria-hidden="true" /><span class="g-switch-label">维护模式</span></GSwitch>
          <small class="g-field-help">高风险即时状态</small>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>边框与卡片形态</h3>
      <p>整块区域可点击，适合重要偏好或带描述的功能开关；选中态同时改变边框和柔和背景。</p>
      <div class="usage-preview usage-preview--block switch-card-grid">
        <GSwitch as="label" :variant="['card', 'block', 'reverse']">
          <input type="checkbox" role="switch" checked />
          <span class="g-switch-track" aria-hidden="true" />
          <span class="g-switch-content"><strong class="g-switch-label">自动创建每日备份</strong><small class="g-switch-description">每天 02:00 保存数据库与附件，保留 30 天</small></span>
        </GSwitch>
        <GSwitch as="label" :variant="['bordered', 'block', 'reverse']">
          <input type="checkbox" role="switch" />
          <span class="g-switch-track" aria-hidden="true" />
          <span class="g-switch-content"><strong class="g-switch-label">允许访客下载</strong><small class="g-switch-description">任何拥有链接的人都可以下载公开附件</small></span>
        </GSwitch>
      </div>
    </section>

    <section class="usage-section">
      <h3>设置列表</h3>
      <p>Switch Row 将标题、解释、状态和值对齐，适合账户、通知、隐私与系统设置页面。</p>
      <div class="usage-preview usage-preview--block switch-settings-panel">
        <div class="g-switch-list">
          <GSwitchRow as="label">
            <span class="g-switch-row-content"><strong class="g-switch-row-title">自动保存</strong><small id="auto-save-description" class="g-switch-row-description">编辑时每 30 秒保存一次草稿</small></span>
            <GSwitch as="span"><input v-model="settings.autoSave" type="checkbox" role="switch" name="auto-save" aria-describedby="auto-save-description" /><span class="g-switch-track" aria-hidden="true" /></GSwitch>
          </GSwitchRow>
          <GSwitchRow as="label">
            <span class="g-switch-row-content"><strong class="g-switch-row-title">桌面通知</strong><small id="desktop-notification-description" class="g-switch-row-description">仅发送提及、评审和发布结果</small></span>
            <span class="g-switch-row-meta">系统权限正常</span>
            <GSwitch as="span"><input v-model="settings.desktopNotifications" type="checkbox" role="switch" name="desktop-notifications" aria-describedby="desktop-notification-description" /><span class="g-switch-track" aria-hidden="true" /></GSwitch>
          </GSwitchRow>
          <GSwitchRow as="label">
            <span class="g-switch-row-content"><strong class="g-switch-row-title">匿名使用数据</strong><small id="analytics-description" class="g-switch-row-description">帮助改进性能，不包含项目内容和身份信息</small></span>
            <GSwitch as="span"><input v-model="settings.analytics" type="checkbox" role="switch" name="analytics" aria-describedby="analytics-description" /><span class="g-switch-track" aria-hidden="true" /></GSwitch>
          </GSwitchRow>
        </div>
      </div>
    </section>

    <aside class="switch-guidance" aria-label="Switch 与 Checkbox 使用建议">
      <strong>什么时候不该使用 Switch？</strong>
      <span>立即生效的二元设置使用 Switch；需要用户最后统一提交、批量勾选或表达“已阅读”时应使用 Checkbox。</span>
    </aside>

    <footer class="component-doc__meta">
      <span><b>尺寸</b><code>mini</code><code>small</code><code>medium</code><code>large</code></span>
      <span><b>内容</b><code>label</code><code>description</code><code>inline prompt</code><code>custom handle</code></span>
      <span><b>状态</b><code>checked</code><code>loading</code><code>disabled</code><code>invalid</code></span>
      <span><b>语义</b><code>input[type=checkbox]</code><code>role=switch</code><code>aria-busy</code><code>aria-describedby</code></span>
    </footer>
  </article>
</template>

<style>
.switch-documentation .switch-basic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 32px; align-items: center; }
.switch-documentation .switch-demo-item,
.switch-documentation .switch-state-item { display: grid; justify-items: start; gap: 6px; }
.switch-documentation .switch-live-value { color: var(--g-color-primary-text); font-size: var(--g-font-size-xs); font-weight: 650; }
.switch-documentation .switch-compact-setting { inline-size: 100%; }
.switch-documentation .switch-compact-setting .g-switch-content { flex: 1 1 auto; }
.switch-documentation .switch-size-row,
.switch-documentation .switch-content-row { display: flex; flex-wrap: wrap; align-items: end; gap: 20px 36px; }
.switch-documentation .switch-size-item { display: grid; justify-items: center; gap: 10px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.switch-documentation .switch-state-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px 32px; }
.switch-documentation .switch-card-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.switch-documentation .switch-card-grid .g-switch-content { flex: 1 1 auto; }
.switch-documentation .switch-settings-panel { padding-block: 0; }
.switch-documentation .switch-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.switch-documentation .switch-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) {
  .switch-documentation .switch-basic-grid,
  .switch-documentation .switch-card-grid { grid-template-columns: 1fr; }
  .switch-documentation .switch-state-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .switch-documentation .g-switch-row-meta { display: none; }
}
@media (max-width: 480px) {
  .switch-documentation .switch-state-grid { grid-template-columns: 1fr; }
}
</style>
`;export{e as default};