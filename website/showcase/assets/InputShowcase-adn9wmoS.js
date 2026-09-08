var e=`<script setup lang="ts">
import { computed, nextTick, ref } from "vue";
import { GInput, GInputAffix, GInputGroup, GSearchField, GPasswordField, GClearableField } from "@gardenerim/vue";

const activeSize = ref<"mini" | "small" | "medium" | "large">("medium");
const clearValue = ref("Gardenerim Design System");
const searchValue = ref("组件设计规范");
const searchLoading = ref(false);
const searchResult = ref("输入关键词后执行搜索");
const password = ref("Gardenerim2026!");
const passwordVisible = ref(false);
const note = ref("跨框架输入组件");
const maxLength = 24;
const noteCount = computed(() => Array.from(note.value).length);

const updateValue = (target: "clear" | "search" | "password" | "note", event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  if (target === "clear") clearValue.value = value;
  if (target === "search") searchValue.value = value;
  if (target === "password") password.value = value;
  if (target === "note") note.value = value;
};

const runSearch = () => {
  if (searchLoading.value) return;
  searchLoading.value = true;
  searchResult.value = "正在搜索…";
  window.setTimeout(() => {
    searchLoading.value = false;
    searchResult.value = searchValue.value ? \`已搜索：\${searchValue.value}\` : "请输入搜索内容";
  }, 650);
};

const clearInput = async (event: MouseEvent) => {
  const control = (event.currentTarget as HTMLElement).previousElementSibling as HTMLInputElement | null;
  clearValue.value = "";
  await nextTick();
  control?.focus();
};
<\/script>

<template>
  <article id="component-input" class="component-doc input-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / INPUT</span>
        <h2>输入框 <span>Input / GInput</span></h2>
        <p>采用浅色填充作为默认输入面，并完整覆盖外观、尺寸、校验、清空、前后缀、组合、搜索、密码和字符统计。</p>
      </div>
      <span class="component-status">css-ready</span>
    </header>

    <section class="usage-section">
      <h3>基本用法与外观</h3>
      <p>默认样式参考 Arco 的低干扰填充输入面；需要明确边界时使用 outlined，工具栏和无边界容器可选 borderless 或 underlined。</p>
      <div class="usage-preview usage-preview--block input-appearance-grid">
        <label class="g-field"><span class="g-label">默认 / Filled</span><GInput placeholder="请输入项目名称" /></label>
        <label class="g-field"><span class="g-label">Outlined</span><GInput variant="outlined" value="明确的输入边界" /></label>
        <label class="g-field"><span class="g-label">Borderless</span><GInput variant="borderless" value="适合工具栏" /></label>
        <label class="g-field"><span class="g-label">Underlined</span><GInput variant="underlined" value="适合轻量编辑" /></label>
        <label class="g-field"><span class="g-label">只读</span><GInput value="由系统自动生成" readonly /></label>
        <label class="g-field"><span class="g-label">禁用</span><GInput value="不可编辑" disabled /></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>四档尺寸</h3>
      <p>Mini、Small、Medium、Large 分别为 24、28、32、36px；尺寸改变信息密度，不改变交互语义。</p>
      <div class="input-size-switch" role="radiogroup" aria-label="输入框尺寸">
        <button v-for="size in (['mini', 'small', 'medium', 'large'] as const)" :key="size" type="button" role="radio" :aria-checked="activeSize === size" :class="{ 'is-active': activeSize === size }" @click="activeSize = size">{{ size }}</button>
      </div>
      <div class="usage-preview usage-preview--block input-size-preview">
        <GInput :variant="activeSize" :placeholder="\`\${activeSize} 输入框\`" aria-label="动态尺寸输入框" />
        <code>{{ activeSize === 'mini' ? '24px' : activeSize === 'small' ? '28px' : activeSize === 'medium' ? '32px' : '36px' }}</code>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态与校验反馈</h3>
      <p>颜色、图标文案和 ARIA 同步表达状态；错误不能只依赖红色，帮助信息通过 aria-describedby 与输入框关联。</p>
      <div class="usage-preview usage-preview--block input-state-grid">
        <label class="g-field is-success"><span class="g-label">成功</span><GInput state="success" value="project-garden" aria-describedby="input-success-help" /><small id="input-success-help" class="g-field-feedback">✓ 名称可以使用</small></label>
        <label class="g-field is-warning"><span class="g-label">警告</span><GInput state="warning" value="名称还可以更明确" aria-describedby="input-warning-help" /><small id="input-warning-help" class="g-field-feedback">! 建议补充业务范围</small></label>
        <label class="g-field is-error"><span class="g-label">错误</span><GInput state="error" value="已存在的名称" aria-invalid="true" aria-describedby="input-error-help" /><small id="input-error-help" class="g-field-feedback">× 该名称已经存在</small></label>
        <label class="g-field"><span class="g-label">加载中</span><GInputAffix class="is-loading" aria-busy="true"><GInput value="正在校验唯一性" readonly /><span class="g-input-spinner" aria-hidden="true" /></GInputAffix><small class="g-field-help">校验期间保留当前内容</small></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>前缀、后缀与一键清空</h3>
      <p>图标和单位属于输入框内部信息；清空按钮具有独立的键盘焦点和可读标签。</p>
      <div class="usage-preview usage-preview--block input-affix-grid">
        <label class="g-field"><span class="g-label">用户</span><GInputAffix class="has-start"><span class="g-input-prefix" aria-hidden="true">●</span><GInput placeholder="用户名" /></GInputAffix></label>
        <label class="g-field"><span class="g-label">网站</span><GInputAffix class="has-end"><GInput value="gardenerim" aria-label="网站名称" /><span class="g-input-suffix">.dev</span></GInputAffix></label>
        <label class="g-field"><span class="g-label">可清空内容</span><GClearableField class="g-input-control"><GInput :value="clearValue" placeholder="输入内容" @input="updateValue('clear', $event)" /><button v-if="clearValue" class="g-clearable-field-action g-input-clear" type="button" aria-label="清空输入内容" @click="clearInput">×</button></GClearableField></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>前置、后置标签与组合输入</h3>
      <p>标签与输入框共享连续边界；组合内的焦点输入会提升层级，避免焦点边框被相邻控件遮挡。</p>
      <div class="usage-preview usage-preview--block input-group-grid">
        <label class="g-field"><span class="g-label">电话号码</span><GInputGroup variant="block"><span class="g-input-prepend">+86</span><GInput value="138 0000 0000" aria-label="手机号码" /></GInputGroup></label>
        <label class="g-field"><span class="g-label">预算</span><GInputGroup variant="block"><GInput value="12,800" aria-label="预算金额" /><span class="g-input-append">CNY</span></GInputGroup></label>
        <label class="g-field"><span class="g-label">地址组合</span><GInputGroup :variant="['block', 'responsive']"><GInput value="https://" aria-label="协议" /><GInput value="gardenerim.dev" aria-label="域名" /><GInput value="/docs" aria-label="路径" /></GInputGroup></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>字数统计</h3>
      <p>统计按用户可见字符计算，并与原生 maxlength 同步；接近限制时提供警告色，超限策略可交给业务层决定。</p>
      <div class="usage-preview usage-preview--block input-counter-preview">
        <label class="g-field"><span class="g-label">版本说明</span><div class="g-character-field"><GInput :value="note" :maxlength="maxLength" aria-describedby="input-count-help" @input="updateValue('note', $event)" /><span class="g-character-count" :class="{ 'is-near-limit': noteCount >= maxLength * .8 }">{{ noteCount }}/{{ maxLength }}</span></div><small id="input-count-help" class="g-field-help">最多 {{ maxLength }} 个字符</small></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>搜索框</h3>
      <p>轻量检索使用内部图标，明确提交操作使用后置按钮；加载期间保留查询词并阻止重复提交。</p>
      <div class="usage-preview usage-preview--block input-search-grid">
        <label class="g-field"><span class="g-label">即时搜索</span><GSearchField variant="icon"><span class="g-search-field-icon" aria-hidden="true">⌕</span><GInput type="search" placeholder="搜索组件" /></GSearchField></label>
        <label class="g-field"><span class="g-label">提交搜索</span><GSearchField :variant="['button', searchLoading ? 'loading' : 'icon']" :class="{ 'is-loading': searchLoading }" role="search"><GInput type="search" :value="searchValue" aria-label="搜索文档" @input="updateValue('search', $event)" @keyup.enter="runSearch" /><button class="g-search-field-action" type="button" :disabled="searchLoading" @click="runSearch"><span v-if="!searchLoading">搜索</span><span v-else>处理中</span></button></GSearchField><output class="g-field-help" aria-live="polite">{{ searchResult }}</output></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>密码输入</h3>
      <p>显隐切换不会清空输入值，并同步更新按钮标签和 aria-pressed 状态。</p>
      <div class="usage-preview usage-preview--block input-password-preview">
        <label class="g-field"><span class="g-label">账号密码</span><GPasswordField class="g-input-control"><GInput :type="passwordVisible ? 'text' : 'password'" :value="password" autocomplete="current-password" aria-describedby="password-help" @input="updateValue('password', $event)" /><button class="g-password-field-action g-password-toggle" type="button" :aria-label="passwordVisible ? '隐藏密码' : '显示密码'" :aria-pressed="passwordVisible" @click="passwordVisible = !passwordVisible">{{ passwordVisible ? '◉' : '◎' }}</button></GPasswordField><small id="password-help" class="g-field-help">请勿在公开设备上保存密码</small></label>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>能力</b><code>clearable</code><code>affix</code><code>group</code><code>search</code><code>password</code><code>word-limit</code></span>
      <span><b>状态</b><code>success</code><code>warning</code><code>error</code><code>loading</code><code>disabled</code><code>read-only</code></span>
      <span><b>无障碍</b><code>label</code><code>aria-describedby</code><code>aria-invalid</code><code>aria-busy</code></span>
    </footer>
  </article>
</template>
`;export{e as default};