var e=`<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import { GInput, GSearchField } from "@gardenerim/vue";

type SearchSize = "mini" | "small" | "medium" | "large";
type Appearance = "filled" | "outlined" | "borderless" | "underlined";
type ActionStyle = "button" | "custom-button";

const catalog = [
  { title: "GInput 输入框", detail: "尺寸、外观、校验和组合输入" },
  { title: "GInputGroup 输入组合", detail: "连接输入框、选择器、单位与按钮" },
  { title: "GInputAffix 前后缀", detail: "在输入边界内展示图标、单位和操作" },
  { title: "GSearchField 搜索框", detail: "提交搜索、清空查询并反馈结果" },
  { title: "GTextarea 多行文本", detail: "自动高度、字数限制和校验状态" },
];

const query = ref("输入");
const searchedQuery = ref("");
const searching = ref(false);
const attempted = ref(false);
const size = ref<SearchSize>("medium");
const appearance = ref<Appearance>("outlined");
const actionStyle = ref<ActionStyle>("button");
let searchTimer: number | undefined;

const results = computed(() => {
  const keyword = searchedQuery.value.trim().toLocaleLowerCase();
  if (!keyword) return [];
  return catalog.filter((item) => \`\${item.title} \${item.detail}\`.toLocaleLowerCase().includes(keyword));
});
const invalid = computed(() => attempted.value && !searchedQuery.value.trim());
const empty = computed(() => attempted.value && !!searchedQuery.value.trim() && results.value.length === 0);
const hasResults = computed(() => attempted.value && results.value.length > 0);
const searchState = computed(() => searching.value ? "searching" : invalid.value ? "invalid" : empty.value ? "empty" : hasResults.value ? "results" : "default");
const searchVariants = computed(() => ["icon", actionStyle.value, "clearable", "responsive", "block", appearance.value, size.value]);

const cancelPendingSearch = () => {
  if (searchTimer !== undefined) window.clearTimeout(searchTimer);
  searchTimer = undefined;
  searching.value = false;
};

const updateQuery = (event: Event) => {
  cancelPendingSearch();
  query.value = (event.target as HTMLInputElement).value;
  attempted.value = false;
};

const runSearch = () => {
  cancelPendingSearch();
  if (!query.value.trim()) {
    searchedQuery.value = "";
    attempted.value = true;
    return;
  }
  searching.value = true;
  attempted.value = false;
  searchTimer = window.setTimeout(() => {
    searchedQuery.value = query.value;
    searching.value = false;
    attempted.value = true;
    searchTimer = undefined;
  }, 450);
};

const clearQuery = () => {
  cancelPendingSearch();
  query.value = "";
  searchedQuery.value = "";
  attempted.value = false;
  window.requestAnimationFrame(() => document.querySelector<HTMLInputElement>("#search-field-query")?.focus());
};

const useSuggestion = (value: string) => {
  query.value = value;
  runSearch();
};

onBeforeUnmount(cancelPendingSearch);
<\/script>

<template>
  <article id="component-search-field" class="component-doc search-field-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / SEARCH</span>
        <h2>搜索框 <span>Search Field / GSearchField</span></h2>
        <p>提供原生搜索提交、查询清空、加载反馈、结果计数和窄容器回落的一体化搜索体验。</p>
      </div>
      <span class="component-status">css-ready · native search</span>
    </header>

    <section class="usage-section">
      <h3>真实搜索流程</h3>
      <p>支持点击与 Enter 提交；搜索、空结果和输入错误通过同一状态区域播报。</p>
      <div class="search-field-toolbar" role="group" aria-label="搜索框设置">
        <span>尺寸</span><button v-for="item in (['mini', 'small', 'medium', 'large'] as SearchSize[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="size === item" @click="size = item">{{ item }}</button>
        <span>外观</span><button v-for="item in (['filled', 'outlined', 'borderless', 'underlined'] as Appearance[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="appearance === item" @click="appearance = item">{{ item }}</button>
        <span>按钮</span><button v-for="item in (['button', 'custom-button'] as ActionStyle[])" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="actionStyle === item" @click="actionStyle = item">{{ item === 'button' ? '主要' : '次要' }}</button>
      </div>

      <div class="usage-preview usage-preview--block search-field-primary-preview">
        <GSearchField as="form" :variant="searchVariants" :state="searchState" role="search" aria-labelledby="search-field-label" aria-describedby="search-field-message" aria-controls="search-field-results" :aria-busy="searching" :aria-invalid="invalid" @submit.prevent="runSearch">
          <label id="search-field-label" class="g-search-field-label" for="search-field-query">搜索组件文档</label>
          <div class="g-search-field-control">
            <div class="g-search-field-input-wrap">
              <span class="g-search-field-icon" aria-hidden="true">⌕</span>
              <GInput id="search-field-query" class="g-search-field-input" type="search" :value="query" autocomplete="off" placeholder="输入组件或能力" @input="updateQuery" />
              <button v-if="query && !searching" class="g-search-field-clear" type="button" aria-label="清空搜索关键词" title="清空" @click="clearQuery">×</button>
              <span v-if="searching" class="g-search-field-spinner" aria-hidden="true" />
              <kbd v-else-if="!query" class="g-search-field-shortcut" aria-hidden="true">/</kbd>
            </div>
            <button class="g-search-field-action" type="submit" :disabled="searching">{{ searching ? '搜索中' : '搜索' }}</button>
          </div>
          <small v-if="searching" id="search-field-message" class="g-search-field-status" role="status">正在搜索“{{ query }}”…</small>
          <small v-else-if="invalid" id="search-field-message" class="g-search-field-feedback" role="alert">请输入搜索关键词。</small>
          <small v-else-if="empty" id="search-field-message" class="g-search-field-status" role="status">没有找到“{{ searchedQuery }}”相关组件。</small>
          <small v-else-if="hasResults" id="search-field-message" class="g-search-field-status" role="status"><span class="g-search-field-result-count">{{ results.length }}</span> 个匹配结果。</small>
          <small v-else id="search-field-message" class="g-search-field-help">输入关键词后按 Enter，或点击搜索按钮。</small>
        </GSearchField>

        <div class="search-field-suggestions" aria-label="搜索建议">
          <span>试试：</span><button type="button" @click="useSuggestion('输入')">输入</button><button type="button" @click="useSuggestion('搜索')">搜索</button><button type="button" @click="useSuggestion('不存在')">无结果</button>
        </div>
        <ul id="search-field-results" class="search-field-results" :aria-busy="searching">
          <li v-for="item in results" :key="item.title"><strong>{{ item.title }}</strong><span>{{ item.detail }}</span></li>
          <li v-if="empty" class="search-field-empty"><strong>未找到结果</strong><span>请检查关键词，或尝试“输入”“搜索”。</span></li>
        </ul>
      </div>
    </section>

    <section class="usage-section">
      <h3>常见搜索模式</h3>
      <p>图标搜索适合即时筛选；按钮搜索用于明确提交；窄容器会将操作按钮完整换到下一行。</p>
      <div class="usage-preview usage-preview--block search-field-patterns">
        <label><b>即时筛选</b><GSearchField :variant="['icon', 'clearable', 'filled', 'block']" role="search"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput type="search" value="设计系统" aria-label="筛选当前列表" /><button class="g-search-field-clear" type="button" aria-label="清空筛选">×</button></div></GSearchField></label>
        <label><b>键盘提示</b><GSearchField :variant="['icon', 'outlined', 'block']" role="search"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput type="search" placeholder="搜索命令" aria-label="搜索命令" /><kbd class="g-search-field-shortcut" aria-hidden="true">⌘ K</kbd></div></GSearchField></label>
        <label class="search-field-narrow"><b>responsive · 20rem 容器</b><GSearchField as="form" :variant="['icon', 'button', 'responsive', 'outlined', 'block']" role="search" @submit.prevent><div class="g-search-field-control"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput type="search" value="移动端搜索" aria-label="窄容器搜索" /></div><button class="g-search-field-action" type="submit">搜索</button></div></GSearchField></label>
        <label><b>只读查询</b><GSearchField :variant="['icon', 'borderless', 'block']" state="read-only" role="search" data-g-form-read-only="true"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput type="search" value="固定审计条件" readonly aria-label="固定审计条件" /></div></GSearchField></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>结果与异常状态</h3>
      <div class="usage-preview usage-preview--block search-field-states">
        <GSearchField :variant="['icon', 'outlined', 'block']" state="results" role="search"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput value="组件" readonly aria-label="有结果的搜索" /></div><small class="g-search-field-status" role="status"><span class="g-search-field-result-count">18</span> 个结果</small></GSearchField>
        <GSearchField :variant="['icon', 'outlined', 'block']" state="invalid" role="search" aria-invalid="true"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput value="" aria-label="错误搜索" /></div><small class="g-search-field-feedback" role="alert">搜索词不能为空</small></GSearchField>
        <GSearchField :variant="['icon', 'outlined', 'block']" state="disabled" role="search" aria-disabled="true"><div class="g-search-field-input-wrap"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput value="暂不可用" disabled aria-label="禁用搜索" /></div><small class="g-search-field-help">索引更新期间暂停搜索</small></GSearchField>
      </div>
    </section>

    <aside class="search-field-guidance"><strong>搜索是一段完整流程</strong><span>除了输入和提交，还需要清空、加载、无结果、结果数量及错误反馈；状态信息使用稳定的描述关联，避免只靠颜色表达。</span></aside>

    <footer class="component-doc__meta">
      <span><b>模式</b><code>icon</code><code>button</code><code>custom-button</code><code>responsive</code></span>
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>状态</b><code>searching</code><code>results</code><code>empty</code><code>invalid</code></span>
      <span><b>语义</b><code>form</code><code>role=search</code><code>status</code><code>alert</code></span>
    </footer>
  </article>
</template>

<style>
.search-field-documentation .search-field-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.search-field-documentation .search-field-toolbar > span { margin-inline: 4px 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.search-field-documentation .search-field-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.search-field-documentation .search-field-primary-preview { max-inline-size: 52rem; }
.search-field-documentation .search-field-suggestions { display: flex; flex-wrap: wrap; align-items: center; gap: 7px; margin-block-start: 14px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.search-field-documentation .search-field-suggestions button { padding: 3px 9px; border: 1px solid var(--g-color-border); border-radius: var(--g-radius-full); background: var(--g-color-surface); color: var(--g-color-text-muted); cursor: pointer; }
.search-field-documentation .search-field-suggestions button:hover { border-color: var(--g-color-primary); color: var(--g-color-primary-text); }
.search-field-documentation .search-field-results { display: grid; gap: 0; margin: 18px 0 0; padding: 0; border-block-start: 1px solid var(--g-color-border); list-style: none; }
.search-field-documentation .search-field-results:empty { display: none; }
.search-field-documentation .search-field-results li { display: grid; gap: 3px; padding: 12px 4px; border-block-end: 1px solid var(--g-color-border); }
.search-field-documentation .search-field-results li strong { font-size: var(--g-font-size-sm); }
.search-field-documentation .search-field-results li span { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.search-field-documentation .search-field-patterns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 26px 34px; align-items: start; }
.search-field-documentation .search-field-patterns > label { display: grid; min-inline-size: 0; gap: 9px; }
.search-field-documentation .search-field-patterns b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.search-field-documentation .search-field-narrow { inline-size: min(100%, 20rem); }
.search-field-documentation .search-field-states { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; align-items: start; }
.search-field-documentation .search-field-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.search-field-documentation .search-field-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .search-field-documentation .search-field-toolbar > span:not(:first-child) { inline-size: 100%; margin-block-start: 4px; } .search-field-documentation .search-field-patterns, .search-field-documentation .search-field-states { grid-template-columns: 1fr; } }
</style>
`;export{e as default};