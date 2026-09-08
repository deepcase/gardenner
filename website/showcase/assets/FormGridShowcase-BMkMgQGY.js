var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GField, GFormGrid } from "@gardenerim/vue";

type Columns = "two" | "three" | "four";
const columnOptions: Columns[] = ["two", "three", "four"];
const columns = ref<Columns>("three");
const compact = ref(false);
const showAdvanced = ref(false);
const projectName = ref("Gardener Design System");

const gridVariants = computed(() => [columns.value, compact.value ? "compact" : "spacious", "align-start"]);
<\/script>

<template>
  <article id="component-form-grid" class="component-doc form-grid-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / RESPONSIVE MATRIX</span>
        <h2>表单网格 <span>Form Grid / GFormGrid</span></h2>
        <p>为完整表单分区建立明确列系统，支持字段跨列、跨行、嵌套和容器断点回落。</p>
      </div>
      <span class="component-status">css-ready · responsive matrix</span>
    </header>

    <section class="usage-section">
      <h3>列数、密度与实时重排</h3>
      <p>在二列、三列和四列之间切换；完整描述保持跨满整行，其他字段根据网格重新分配空间。</p>
      <div class="form-grid-toolbar" role="group" aria-label="表单网格设置">
        <span class="form-grid-toolbar-label">列数</span>
        <button v-for="item in columnOptions" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="columns === item" @click="columns = item">{{ item === 'two' ? '2 列' : item === 'three' ? '3 列' : '4 列' }}</button>
        <label class="g-switch-row form-grid-density"><span><strong>紧凑间距</strong></span><span class="g-switch"><input v-model="compact" type="checkbox" role="switch" /><span /></span></label>
      </div>
      <div class="usage-preview usage-preview--block form-grid-primary-preview g-form-container">
        <GFormGrid :variant="gridVariants" aria-labelledby="form-grid-project-title">
          <GField variant="block"><label id="form-grid-project-title" class="g-field-label" for="grid-project">项目名称</label><input id="grid-project" v-model="projectName" class="g-input g-input-outlined" /></GField>
          <GField variant="block"><label class="g-field-label" for="grid-owner">负责人</label><select id="grid-owner" class="g-select g-select-outlined"><option>林园</option><option>周青</option></select></GField>
          <GField variant="block"><label class="g-field-label" for="grid-status">状态</label><select id="grid-status" class="g-select g-select-outlined"><option>进行中</option><option>已暂停</option><option>已完成</option></select></GField>
          <GField variant="block"><label class="g-field-label" for="grid-date">目标日期</label><input id="grid-date" class="g-input g-input-outlined" type="date" value="2026-12-20" /></GField>
          <GField variant="block"><label class="g-field-label" for="grid-priority">优先级</label><select id="grid-priority" class="g-select g-select-outlined"><option>高</option><option>中</option><option>低</option></select></GField>
          <GField variant="block"><label class="g-field-label" for="grid-team">团队</label><select id="grid-team" class="g-select g-select-outlined"><option>体验设计</option><option>平台工程</option></select></GField>
          <GField class="g-form-grid-span-full" variant="block"><div class="g-field-header"><label class="g-field-label" for="grid-description">项目描述</label><span class="g-field-meta">跨满整行</span></div><textarea id="grid-description" class="g-textarea g-textarea-outlined" rows="3">建立统一、可访问并适用于多框架的组件设计语言。</textarea></GField>
          <div class="g-form-grid-actions"><span class="form-grid-summary">当前：{{ columns === 'two' ? '2' : columns === 'three' ? '3' : '4' }} 列 · {{ compact ? '紧凑' : '宽松' }}</span><button class="g-btn g-btn-outline" type="button">保存草稿</button><button class="g-btn g-btn-primary" type="button">发布项目</button></div>
        </GFormGrid>
      </div>
    </section>

    <section class="usage-section">
      <h3>十二列系统与精确跨列</h3>
      <p>复杂后台表单可使用十二列：主要字段跨 6 列，短字段跨 3 列，说明和操作跨满整行；中等容器自动降为两列。</p>
      <div class="usage-preview usage-preview--block g-form-container">
        <GFormGrid :variant="['twelve', 'compact']">
          <GField class="g-form-grid-span-6"><label class="g-field-label" for="grid-company">企业名称</label><input id="grid-company" class="g-input g-input-outlined" value="Gardener Labs" /></GField>
          <GField class="g-form-grid-span-3"><label class="g-field-label" for="grid-size">团队规模</label><select id="grid-size" class="g-select g-select-outlined"><option>51–200 人</option></select></GField>
          <GField class="g-form-grid-span-3"><label class="g-field-label" for="grid-industry">行业</label><select id="grid-industry" class="g-select g-select-outlined"><option>软件服务</option></select></GField>
          <GField class="g-form-grid-span-4"><label class="g-field-label" for="grid-country">国家或地区</label><select id="grid-country" class="g-select g-select-outlined"><option>中国大陆</option></select></GField>
          <GField class="g-form-grid-span-4"><label class="g-field-label" for="grid-city">城市</label><input id="grid-city" class="g-input g-input-outlined" value="上海" /></GField>
          <GField class="g-form-grid-span-4"><label class="g-field-label" for="grid-timezone">时区</label><select id="grid-timezone" class="g-select g-select-outlined"><option>Asia/Shanghai</option></select></GField>
          <hr class="g-form-grid-divider" />
          <label class="g-check g-form-grid-span-full"><input type="checkbox" checked /><span>允许团队管理员邀请新成员</span></label>
        </GFormGrid>
      </div>
    </section>

    <section class="usage-section">
      <h3>自动填充、密集排列与嵌套网格</h3>
      <p>auto 适合数量变化的短字段；dense 可回填跨列项目留下的空位，但 DOM 顺序仍应保持合理；嵌套网格用于局部子结构。</p>
      <div class="usage-preview usage-preview--block form-grid-patterns g-form-container">
        <div><b>auto · 根据最小宽度换列</b><GFormGrid variant="auto" style="--g-form-grid-item-min: 10rem"><label v-for="label in ['设计', '研发', '测试', '运营', '支持']" :key="label" class="g-check form-grid-option"><input type="checkbox" /><span>{{ label }}</span></label></GFormGrid></div>
        <div><b>dense · 可选高级字段</b><button class="g-btn g-btn-text form-grid-toggle" type="button" :aria-expanded="showAdvanced" @click="showAdvanced = !showAdvanced">{{ showAdvanced ? '隐藏高级字段' : '显示高级字段' }}</button><GFormGrid :variant="['four', 'dense', 'compact']"><GField class="g-form-grid-span-2"><label class="g-field-label" for="grid-code">项目代号</label><input id="grid-code" class="g-input g-input-outlined" value="GDS" /></GField><GField><label class="g-field-label" for="grid-version">版本</label><input id="grid-version" class="g-input g-input-outlined" value="2.1" /></GField><GField v-if="showAdvanced"><label class="g-field-label" for="grid-channel">通道</label><select id="grid-channel" class="g-select"><option>stable</option></select></GField><GField v-if="showAdvanced" class="g-form-grid-span-2"><label class="g-field-label" for="grid-registry">私有仓库</label><input id="grid-registry" class="g-input g-input-outlined" value="registry.example.com" /></GField></GFormGrid></div>
        <div class="form-grid-pattern-full"><b>nested · 地址中的局部网格</b><GFormGrid :variant="['two', 'spacious']"><GField><label class="g-field-label" for="grid-contact">联系人</label><input id="grid-contact" class="g-input g-input-outlined" value="林园" /></GField><div class="g-form-grid-item"><span class="form-grid-subtitle">地址信息</span><GFormGrid :variant="['two', 'compact']"><GField><label class="g-field-label" for="grid-province">省份</label><input id="grid-province" class="g-input" value="上海" /></GField><GField><label class="g-field-label" for="grid-district">区县</label><input id="grid-district" class="g-input" value="青木区" /></GField><GField class="g-form-grid-span-full"><label class="g-field-label" for="grid-street">详细地址</label><input id="grid-street" class="g-input" value="青木路 18 号" /></GField></GFormGrid></div></GFormGrid></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>行跨度与状态边界</h3>
      <p>跨行适用于说明或预览面板；网格状态表达整组上下文，但具体控件仍需设置自己的错误、只读或禁用属性。</p>
      <div class="usage-preview usage-preview--block form-grid-state-grid g-form-container">
        <GFormGrid :variant="['three', 'compact']" state="error" aria-invalid="true"><aside class="form-grid-preview g-form-grid-row-span-2"><strong>配置预览</strong><span>当前配置还有 1 项错误。</span></aside><GField><label class="g-field-label" for="grid-error-name">配置名称</label><input id="grid-error-name" class="g-input g-input-outlined" value="生产环境" /></GField><GField state="error"><label class="g-field-label" for="grid-error-port">端口</label><input id="grid-error-port" class="g-input g-input-outlined" value="99999" aria-invalid="true" /><small class="g-field-feedback">端口必须在 1–65535 之间。</small></GField><GField><label class="g-field-label" for="grid-error-region">区域</label><select id="grid-error-region" class="g-select"><option>华东</option></select></GField><GField><label class="g-field-label" for="grid-error-replicas">副本数</label><input id="grid-error-replicas" class="g-input" type="number" value="3" /></GField></GFormGrid>
        <GFormGrid :variant="['two', 'compact']" state="read-only" data-g-form-read-only="true"><GField><label class="g-field-label" for="grid-readonly-id">资源 ID</label><input id="grid-readonly-id" class="g-input" value="RES-2086" readonly /></GField><GField><label class="g-field-label" for="grid-readonly-owner">创建者</label><input id="grid-readonly-owner" class="g-input" value="系统管理员" readonly /></GField></GFormGrid>
      </div>
    </section>

    <aside class="form-grid-guidance"><strong>GFormGrid 用于矩阵，GFormRow 用于逻辑行</strong><span>Grid 适合完整分区和明确跨列；Row 适合同一业务行中的相关字段与操作。两者都只负责布局，字段语义仍由 GField 与 GFieldset 承担。</span></aside>

    <footer class="component-doc__meta">
      <span><b>列</b><code>auto</code><code>1 / 2 / 3 / 4 / 6 / 12</code></span>
      <span><b>跨列</b><code>span-2</code><code>span-3</code><code>span-4</code><code>span-6</code><code>span-full</code></span>
      <span><b>跨行</b><code>row-span-2</code><code>row-span-3</code><code>dense</code></span>
      <span><b>响应式</b><code>container breakpoints</code><code>mobile stack</code><code>print stack</code></span>
    </footer>
  </article>
</template>

<style>
.form-grid-documentation .form-grid-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.form-grid-documentation .form-grid-toolbar-label { margin-inline-end: 4px; color: var(--g-color-text-muted); font-size: var(--g-font-size-sm); font-weight: 700; }
.form-grid-documentation .form-grid-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.form-grid-documentation .form-grid-density { width: auto; margin-inline-start: auto; border: 0; background: transparent; }
.form-grid-documentation .form-grid-summary { margin-inline-end: auto; color: var(--g-color-text-muted); font-size: var(--g-font-size-sm); }
.form-grid-documentation .form-grid-patterns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 34px; }
.form-grid-documentation .form-grid-patterns > div { display: grid; min-width: 0; align-content: start; gap: 14px; }
.form-grid-documentation .form-grid-patterns > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.form-grid-documentation .form-grid-pattern-full { grid-column: 1 / -1; }
.form-grid-documentation .form-grid-option { padding: 12px; border: 1px solid var(--g-color-border); border-radius: var(--g-radius-sm); }
.form-grid-documentation .form-grid-toggle { justify-self: start; }
.form-grid-documentation .form-grid-subtitle { display: block; margin-block-end: 8px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 700; }
.form-grid-documentation .form-grid-state-grid { display: grid; gap: 30px; }
.form-grid-documentation .form-grid-preview { display: grid; align-content: center; gap: 5px; padding: 16px; border-radius: var(--g-radius-md); background: var(--g-color-danger-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); }
.form-grid-documentation .form-grid-preview strong { color: var(--g-color-danger); }
.form-grid-documentation .form-grid-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.form-grid-documentation .form-grid-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .form-grid-documentation .form-grid-density { inline-size: 100%; margin-inline-start: 0; } .form-grid-documentation .form-grid-patterns { grid-template-columns: 1fr; } .form-grid-documentation .form-grid-pattern-full { grid-column: auto; } }
</style>
`;export{e as default};