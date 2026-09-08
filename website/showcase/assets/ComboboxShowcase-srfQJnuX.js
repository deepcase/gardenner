var e=`<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { GCombobox, getInstance } from "@gardenerim/vue";

type ComboboxDetail = { value?: string; label?: string; query?: string; source?: string };
type ComboHandle = { search(value?: string, source?: string): void };
type City = { value: string; label: string; country: string; code: string };

const localHost = ref<HTMLElement | null>(null);
const remoteHost = ref<HTMLElement | null>(null);
const selected = ref("尚未选择，可自由输入或从建议中选取");
const remoteLoading = ref(false);
const remoteResults = ref<City[]>([]);
let remoteTimer = 0;

const cities: City[] = [
  { value: "beijing", label: "北京", country: "中国", code: "CN" },
  { value: "shanghai", label: "上海", country: "中国", code: "CN" },
  { value: "singapore", label: "新加坡", country: "新加坡", code: "SG" },
  { value: "san-francisco", label: "旧金山", country: "美国", code: "US" },
  { value: "seattle", label: "西雅图", country: "美国", code: "US" },
];

const onLocalChange = (event: Event) => {
  const detail = (event as CustomEvent<ComboboxDetail>).detail;
  selected.value = detail?.value ? \`当前值：\${detail.value} · 显示文本：\${detail.label || detail.value}\` : "已清除选择";
};

const onRemoteFilter = (event: Event) => {
  const detail = (event as CustomEvent<ComboboxDetail>).detail;
  if (!detail || detail.source === "remote") return;
  const query = (detail.query || "").trim().toLocaleLowerCase();
  window.clearTimeout(remoteTimer);
  remoteLoading.value = true;
  remoteResults.value = [];
  remoteTimer = window.setTimeout(async () => {
    remoteResults.value = cities.filter((city) => !query || \`\${city.label} \${city.country} \${city.value}\`.toLocaleLowerCase().includes(query));
    remoteLoading.value = false;
    await nextTick();
    const root = remoteHost.value?.querySelector<HTMLElement>("[data-g-combobox]");
    const instance = root ? getInstance(root, "combobox") as ComboHandle | null : null;
    instance?.search(detail.query || "", "remote");
  }, 520);
};

onMounted(() => {
  localHost.value?.addEventListener("gardener:change", onLocalChange);
  remoteHost.value?.addEventListener("gardener:filter", onRemoteFilter);
});
onBeforeUnmount(() => {
  localHost.value?.removeEventListener("gardener:change", onLocalChange);
  remoteHost.value?.removeEventListener("gardener:filter", onRemoteFilter);
  window.clearTimeout(remoteTimer);
});
<\/script>

<template>
  <article id="component-combobox" class="component-doc combobox-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / EDITABLE SUGGESTIONS</span>
        <h2>组合输入框 <span>Combobox / GCombobox</span></h2>
        <p>当用户既可以自由输入、又需要候选提示时使用；输入焦点始终留在文本框，并通过 active descendant 管理建议项。</p>
      </div>
      <span class="component-status">runtime-ready · ARIA combobox</span>
    </header>

    <section class="usage-section">
      <h3>搜索、分组与自定义值</h3>
      <p>输入姓名、团队或关键词过滤；候选项支持辅助信息与禁用态，没有完全匹配时可直接创建当前输入。</p>
      <div ref="localHost" class="usage-preview usage-preview--block combobox-primary-demo">
        <GCombobox :variant="['outlined', 'clearable', 'grouped', 'allow-create']" data-g-filter="contains">
          <div class="g-combobox-control">
            <span class="g-combobox-prefix" aria-hidden="true">⌕</span>
            <input class="g-combobox-input" type="text" placeholder="搜索成员或输入新邮箱" aria-label="选择负责人" aria-describedby="combobox-local-help combobox-local-status" autocomplete="off" />
            <button type="button" class="g-combobox-clear" data-g-combobox-clear aria-label="清除输入">×</button>
            <span class="g-combobox-toggle" aria-hidden="true" />
          </div>
          <span id="combobox-local-status" class="g-combobox-status" data-g-combobox-status data-g-result-label="个建议" aria-live="polite" />
          <div class="g-combobox-list" role="listbox">
            <div class="g-combobox-header"><span>推荐负责人</span><span>↑↓ 导航 · Enter 选择</span></div>
            <section class="g-combobox-group" role="group" aria-labelledby="combo-group-team">
              <div id="combo-group-team" class="g-combobox-group-label">产品团队</div>
              <div class="g-combobox-option" role="option" data-g-value="ada@gardener.im" data-g-label="Ada Lovelace" data-g-keywords="产品 数据 math">
                <span class="g-combobox-option-avatar" aria-hidden="true">AL</span><span class="g-combobox-option-content"><strong class="g-combobox-option-title">Ada Lovelace</strong><small class="g-combobox-option-description">产品架构 · ada@gardener.im</small></span><span class="g-combobox-option-meta">在线</span>
              </div>
              <div class="g-combobox-option" role="option" data-g-value="grace@gardener.im" data-g-label="Grace Hopper" data-g-keywords="工程 编译 compiler">
                <span class="g-combobox-option-avatar" aria-hidden="true">GH</span><span class="g-combobox-option-content"><strong class="g-combobox-option-title">Grace Hopper</strong><small class="g-combobox-option-description">平台工程 · grace@gardener.im</small></span><span class="g-combobox-option-meta">忙碌</span>
              </div>
            </section>
            <section class="g-combobox-group" role="group" aria-labelledby="combo-group-external">
              <div id="combo-group-external" class="g-combobox-group-label">外部协作者</div>
              <div class="g-combobox-option" role="option" data-g-value="lin@example.com" data-g-label="Lin Chen" data-g-keywords="设计 design">
                <span class="g-combobox-option-avatar" aria-hidden="true">LC</span><span class="g-combobox-option-content"><strong class="g-combobox-option-title">Lin Chen</strong><small class="g-combobox-option-description">视觉设计 · lin@example.com</small></span><span class="g-combobox-option-meta">访客</span>
              </div>
              <div class="g-combobox-option" role="option" aria-disabled="true" data-g-value="archived@example.com" data-g-label="Archived User"><span class="g-combobox-option-avatar" aria-hidden="true">AU</span><span class="g-combobox-option-content"><strong class="g-combobox-option-title">Archived User</strong><small class="g-combobox-option-description">账户已停用</small></span></div>
            </section>
            <div class="g-combobox-option g-combobox-create" role="option" data-g-combobox-create hidden><span class="g-combobox-option-icon" aria-hidden="true">＋</span><span class="g-combobox-option-content"><strong class="g-combobox-option-title">使用“<span data-g-combobox-create-value />”</strong><small class="g-combobox-option-description">保留为自定义文本值</small></span></div>
            <div class="g-combobox-empty" data-g-combobox-empty hidden>没有匹配成员，但仍可使用当前输入</div>
            <div class="g-combobox-footer"><span id="combobox-local-help">Combobox 允许自由输入；限定选项请使用 Select。</span></div>
          </div>
        </GCombobox>
        <output class="combobox-selection" aria-live="polite">{{ selected }}</output>
      </div>
    </section>

    <section class="usage-section">
      <h3>异步远程建议</h3>
      <p>输入城市后模拟服务端搜索。请求期间保留输入与加载反馈，结果为空时展示明确空态。</p>
      <div ref="remoteHost" class="usage-preview usage-preview--block combobox-remote-demo">
        <label for="remote-city">城市</label>
        <GCombobox :variant="['filled', 'remote', 'clearable']" :state="remoteLoading ? 'loading' : undefined" :aria-busy="remoteLoading" data-g-filter="none" data-g-open-on-focus="false">
          <div class="g-combobox-control"><input id="remote-city" class="g-combobox-input" type="text" placeholder="例如：上海、Singapore、Seattle" autocomplete="off" /><span class="g-combobox-spinner" aria-hidden="true" /><button type="button" class="g-combobox-clear" data-g-combobox-clear aria-label="清除城市">×</button><span class="g-combobox-toggle" aria-hidden="true" /></div>
          <span class="g-combobox-status" data-g-combobox-status data-g-loading-label="正在查询城市" data-g-result-label="个城市" aria-live="polite" />
          <div class="g-combobox-list" role="listbox">
            <div class="g-combobox-loading" :hidden="!remoteLoading"><span class="g-combobox-spinner" aria-hidden="true" />正在查询城市…</div>
            <div v-for="city in remoteResults" :key="city.value" class="g-combobox-option" role="option" :data-g-value="city.value" :data-g-label="city.label"><span class="g-combobox-option-icon" aria-hidden="true">{{ city.code }}</span><span class="g-combobox-option-content"><strong class="g-combobox-option-title">{{ city.label }}</strong><small class="g-combobox-option-description">{{ city.country }} · {{ city.value }}</small></span></div>
            <div class="g-combobox-empty" data-g-combobox-empty :hidden="remoteLoading || remoteResults.length > 0">没有找到城市，请更换关键词</div>
          </div>
        </GCombobox>
        <small>示例延迟 520 ms；真实项目应处理请求取消、缓存、竞态和服务端错误。</small>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观、尺寸与状态</h3>
      <p>外观与 Input 保持一致；错误、只读和禁用必须由结构或说明文本补充，不能只靠颜色。</p>
      <div class="usage-preview usage-preview--block combobox-spec-grid">
        <div v-for="appearance in ['filled', 'outlined', 'borderless', 'underlined']" :key="appearance" class="combobox-spec-item"><span>{{ appearance }}</span><GCombobox :variant="[appearance, 'small']"><div class="g-combobox-control"><input class="g-combobox-input" :value="appearance" :aria-label="\`\${appearance} combobox\`" /><span class="g-combobox-toggle" /></div><div class="g-combobox-list" role="listbox"><div class="g-combobox-option" role="option">示例</div></div></GCombobox></div>
        <div v-for="size in ['mini', 'small', 'medium', 'large']" :key="size" class="combobox-spec-item"><span>{{ size }}</span><GCombobox :variant="['outlined', size]"><div class="g-combobox-control"><input class="g-combobox-input" placeholder="请选择" :aria-label="\`\${size} combobox\`" /><span class="g-combobox-toggle" /></div><div class="g-combobox-list" role="listbox"><div class="g-combobox-option" role="option">示例</div></div></GCombobox></div>
        <div class="combobox-spec-item"><span>error</span><GCombobox variant="outlined" state="error" aria-invalid="true"><div class="g-combobox-control"><input class="g-combobox-input" value="未知账户" aria-invalid="true" aria-label="错误状态角色选择" aria-describedby="combo-error-help" /></div><div class="g-combobox-list" role="listbox"><div class="g-combobox-empty">请选择有效账户</div></div></GCombobox><small id="combo-error-help" class="combobox-error">该账户不存在</small></div>
        <div class="combobox-spec-item"><span>disabled</span><GCombobox variant="outlined" state="disabled" aria-disabled="true"><div class="g-combobox-control"><input class="g-combobox-input" aria-label="管理员锁定的角色" value="由管理员锁定" disabled /></div><div class="g-combobox-list" role="listbox"><div role="option">不可用</div></div></GCombobox></div>
      </div>
    </section>

    <aside class="combobox-guidance"><strong>Combobox 不是 Select</strong><span>Combobox 的核心是自由文本输入，建议仅用于辅助；如果值必须来自封闭集合，使用 Select。层级数据使用 Tree Select，多列联动使用 Cascader。</span></aside>

    <footer class="component-doc__meta">
      <span><b>输入</b><code>freeform</code><code>local filter</code><code>remote</code><code>create</code></span>
      <span><b>内容</b><code>group</code><code>icon</code><code>description</code><code>meta</code><code>header/footer</code></span>
      <span><b>状态</b><code>open</code><code>loading</code><code>empty</code><code>error</code><code>disabled</code></span>
      <span><b>键盘</b><code>↑ ↓</code><code>Home/End</code><code>Enter</code><code>Escape</code><code>Tab</code></span>
    </footer>
  </article>
</template>

<style>
.combobox-documentation .combobox-primary-demo,
.combobox-documentation .combobox-remote-demo { display: grid; max-inline-size: 46rem; gap: 10px; align-content: start; }
.combobox-documentation .combobox-selection { color: var(--g-color-primary-text); font-size: var(--g-font-size-xs); font-weight: 650; }
.combobox-documentation .combobox-remote-demo > label { color: var(--g-color-text); font-size: var(--g-font-size-sm); font-weight: 700; }
.combobox-documentation .combobox-remote-demo > small { color: var(--g-color-text-muted); line-height: 1.5; }
.combobox-documentation .combobox-spec-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px 32px; align-items: start; }
.combobox-documentation .combobox-spec-item { display: grid; min-inline-size: 0; gap: 7px; }
.combobox-documentation .combobox-spec-item > span { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); text-transform: capitalize; }
.combobox-documentation .combobox-error { color: var(--g-color-danger); font-size: var(--g-font-size-xs); }
.combobox-documentation .combobox-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.combobox-documentation .combobox-guidance strong { color: var(--g-color-text); }
@media (max-width: 680px) { .combobox-documentation .combobox-spec-grid { grid-template-columns: 1fr; } }
</style>
`;export{e as default};