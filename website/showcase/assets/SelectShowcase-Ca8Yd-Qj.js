var e=`<script setup lang="ts">
import { ref } from "vue";
import { GClearableField, GSelect, GTagPicker } from "@gardenerim/vue";
import DemoIcon from "./DemoIcon.vue";

const projectType = ref("")
const controlledValue = ref("production")
const clearableValue = ref("shanghai")
const reviewers = ref<string[]>(["frontend", "design"])

const appearances = ["filled", "outlined", "borderless", "underlined"] as const
const sizes = ["mini", "small", "medium", "large"] as const

const updateReviewers = (event: CustomEvent<{ values?: string[] }>) => {
  reviewers.value = event.detail.values ?? []
}
<\/script>

<template>
  <article id="component-select" class="component-doc select-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / SELECT</span>
        <h2>选择器 <span>Select / GSelect</span></h2>
        <p>保留原生键盘、移动端选择器和表单提交语义，并补齐外观、尺寸、校验、多选、分组、清空及加载组合。</p>
      </div>
      <span class="component-status">css-ready · native semantics</span>
    </header>

    <section class="usage-section">
      <h3>基本用法与受控值</h3>
      <p>默认采用与 Input 一致的低干扰填充面；占位项不代表有效选择，受控值变化会立即同步到表单。</p>
      <div class="usage-preview usage-preview--block select-basic-grid">
        <label class="g-field">
          <span class="g-label g-label-required">项目类型</span>
          <GSelect v-model="projectType" required aria-describedby="select-basic-help">
            <option value="" disabled>请选择项目类型</option>
            <option value="web">Web 应用</option>
            <option value="mobile">移动应用</option>
            <option value="desktop">桌面应用</option>
          </GSelect>
          <small id="select-basic-help" class="g-field-help">原生 required 校验，不使用虚假的默认值</small>
        </label>
        <label class="g-field">
          <span class="g-label">部署环境</span>
          <GSelect v-model="controlledValue" variant="outlined">
            <option value="development">开发环境</option>
            <option value="staging">预发布环境</option>
            <option value="production">生产环境</option>
          </GSelect>
          <output class="select-value-output" aria-live="polite">当前值：{{ controlledValue }}</output>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>四种外观</h3>
      <p>Filled 适合常规表单，Outlined 强调边界，Borderless 适合工具栏，Underlined 适合轻量内联编辑。</p>
      <div class="usage-preview usage-preview--block select-appearance-grid">
        <label v-for="appearance in appearances" :key="appearance" class="g-field">
          <span class="g-label">{{ appearance }}</span>
          <GSelect :variant="appearance" :aria-label="\`\${appearance} select\`">
            <option selected>{{ appearance }} 样式</option>
            <option>另一选项</option>
          </GSelect>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>四档尺寸</h3>
      <p>Mini、Small、Medium、Large 分别对应 24、28、32、36px，与按钮和输入框保持同一密度系统。</p>
      <div class="usage-preview usage-preview--block select-size-grid">
        <label v-for="size in sizes" :key="size" class="g-field">
          <span class="g-label">{{ size }}</span>
          <GSelect :variant="size" :aria-label="\`\${size} select\`"><option selected>{{ size }}</option><option>option</option></GSelect>
          <small class="g-field-help">{{ size === 'mini' ? '24px' : size === 'small' ? '28px' : size === 'medium' ? '32px' : '36px' }}</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>状态与校验反馈</h3>
      <p>成功、警告和错误同时使用边框、柔和背景与说明文本；禁用态保持清晰但退出交互。</p>
      <div class="usage-preview usage-preview--block select-state-grid">
        <label class="g-field is-success"><span class="g-label">成功</span><GSelect state="success" aria-describedby="select-success"><option selected>权限配置有效</option></GSelect><small id="select-success" class="g-field-feedback">✓ 已通过校验</small></label>
        <label class="g-field is-warning"><span class="g-label">警告</span><GSelect state="warning" aria-describedby="select-warning"><option selected>权限范围较大</option></GSelect><small id="select-warning" class="g-field-feedback">! 请确认影响范围</small></label>
        <label class="g-field is-error"><span class="g-label">错误</span><GSelect state="error" aria-invalid="true" aria-describedby="select-error"><option selected>无可用区域</option></GSelect><small id="select-error" class="g-field-feedback">× 请先配置区域</small></label>
        <label class="g-field"><span class="g-label">禁用</span><GSelect disabled><option selected>当前权限不可修改</option></GSelect><small class="g-field-help">保留当前值供用户阅读</small></label>
      </div>
    </section>

    <section class="usage-section">
      <h3>选项分组与禁用项</h3>
      <p>分组用于建立可扫描的信息层级；不可用选项保留在上下文中，并由原生 disabled 阻止选择。</p>
      <div class="usage-preview usage-preview--block select-group-grid">
        <label class="g-field">
          <span class="g-label">部署区域</span>
          <GSelect variant="outlined">
            <optgroup label="中国大陆">
              <option>华北 · 北京</option><option>华东 · 上海</option><option disabled>华南 · 广州（维护中）</option>
            </optgroup>
            <optgroup label="亚太区域">
              <option>新加坡</option><option>东京</option>
            </optgroup>
          </GSelect>
          <small class="g-field-help">支持原生 optgroup 与禁用 option</small>
        </label>
        <label class="g-field">
          <span class="g-label">紧凑工具栏</span>
          <GSelect :variant="['auto-width', 'small', 'borderless']">
            <option selected>最近 7 天</option><option>最近 30 天</option><option>本季度</option>
          </GSelect>
          <small class="g-field-help">auto-width 不强占整行空间</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>标签式多选</h3>
      <p>桌面端多选使用可移除标签和可搜索弹层，避免原生列表框依赖 Ctrl/Command 的隐晦交互；隐藏字段仍可进入传统表单提交。</p>
      <div class="usage-preview usage-preview--block select-multiple-grid">
        <label class="g-field">
          <span class="g-label">评审角色</span>
          <GTagPicker :config="{ pickerMultiple: true }" class="select-tag-picker" @gardener:pickerchange="updateReviewers">
            <div class="g-picker-control" data-g-picker-trigger tabindex="0" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-describedby="select-multiple-help">
              <span class="g-picker-values" data-g-picker-values />
              <input class="g-picker-input" data-g-picker-input placeholder="搜索并选择角色" aria-label="搜索评审角色" />
              <span class="g-picker-arrow" aria-hidden="true" />
            </div>
            <div class="g-picker-panel" data-g-picker-panel hidden>
              <div class="g-picker-results" role="listbox" aria-multiselectable="true">
                <button class="g-picker-option" type="button" role="option" data-g-picker-option data-g-value="frontend" data-g-label="前端开发" aria-selected="true"><span class="g-picker-option-main"><strong class="g-picker-option-title">前端开发</strong><small class="g-picker-option-description">Web、移动与桌面客户端</small></span><span class="g-picker-option-check">✓</span></button>
                <button class="g-picker-option" type="button" role="option" data-g-picker-option data-g-value="backend" data-g-label="后端开发"><span class="g-picker-option-main"><strong class="g-picker-option-title">后端开发</strong><small class="g-picker-option-description">API 与基础设施</small></span><span class="g-picker-option-check">✓</span></button>
                <button class="g-picker-option" type="button" role="option" data-g-picker-option data-g-value="design" data-g-label="产品设计" aria-selected="true"><span class="g-picker-option-main"><strong class="g-picker-option-title">产品设计</strong><small class="g-picker-option-description">交互与视觉设计</small></span><span class="g-picker-option-check">✓</span></button>
                <button class="g-picker-option" type="button" role="option" data-g-picker-option data-g-value="qa" data-g-label="质量保障"><span class="g-picker-option-main"><strong class="g-picker-option-title">质量保障</strong><small class="g-picker-option-description">自动化与发布验收</small></span><span class="g-picker-option-check">✓</span></button>
                <button class="g-picker-option" type="button" role="option" data-g-picker-option data-g-value="ops" data-g-label="运维" aria-disabled="true"><span class="g-picker-option-main"><strong class="g-picker-option-title">运维</strong><small class="g-picker-option-description">当前项目暂不可选</small></span></button>
              </div>
              <div class="g-picker-empty" data-g-picker-empty hidden>没有匹配角色</div>
            </div>
            <input type="hidden" name="reviewers" data-g-picker-output />
          </GTagPicker>
          <small id="select-multiple-help" class="g-field-help">已选择 {{ reviewers.length }} 项：{{ reviewers.join('、') || '无' }}</small>
        </label>
        <div class="select-guidance-card">
          <strong>组件选择建议</strong>
          <span><b>2–5 个互斥项</b>优先 Radio，比较成本更低</span>
          <span><b>需要输入检索</b>使用 GCombobox</span>
          <span><b>树形或级联数据</b>使用 GTreeSelect / GCascader</span>
        </div>
      </div>
    </section>

    <section class="usage-section">
      <h3>前缀、加载与一键清空</h3>
      <p>组合容器提供稳定的前后缀布局；清空按钮具有独立焦点，加载态同时设置 aria-busy 并禁用选择器。</p>
      <div class="usage-preview usage-preview--block select-composition-grid">
        <label class="g-field">
          <span class="g-label">带前缀</span>
          <div class="g-select-control g-select-control-outlined">
            <span class="g-select-prefix" aria-hidden="true"><DemoIcon name="shield" /></span>
            <GSelect aria-label="访问级别"><option selected>仅团队成员</option><option>组织内成员</option><option>公开访问</option></GSelect>
            <span class="g-select-arrow" aria-hidden="true" />
          </div>
          <small class="g-field-help">前缀属于视觉提示，名称仍由 label 提供</small>
        </label>
        <label class="g-field">
          <span class="g-label">加载中</span>
          <div class="g-select-control g-select-control-outlined is-loading" aria-busy="true">
            <GSelect disabled aria-label="正在加载项目"><option selected>正在获取项目…</option></GSelect>
            <span class="g-select-spinner" aria-hidden="true" />
          </div>
          <small class="g-field-help">异步期间保留宽度，避免布局跳动</small>
        </label>
        <label class="g-field">
          <span class="g-label">可清空</span>
          <GClearableField variant="select">
            <GSelect v-model="clearableValue" aria-label="城市"><option value="">请选择城市</option><option value="beijing">北京</option><option value="shanghai">上海</option><option value="shenzhen">深圳</option></GSelect>
            <span class="g-select-arrow" aria-hidden="true" />
            <button class="g-clearable-field-action g-select-clear" type="button" data-g-clear-button aria-label="清空城市" />
          </GClearableField>
          <small class="g-field-help">清除后恢复到占位项并把焦点交还选择器</small>
        </label>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>能力</b><code>single</code><code>multiple</code><code>optgroup</code><code>clearable</code><code>prefix</code><code>loading</code></span>
      <span><b>状态</b><code>success</code><code>warning</code><code>error</code><code>disabled</code><code>loading</code></span>
      <span><b>语义</b><code>native select</code><code>label</code><code>required</code><code>aria-describedby</code><code>aria-invalid</code></span>
    </footer>
  </article>
</template>
`;export{e as default};