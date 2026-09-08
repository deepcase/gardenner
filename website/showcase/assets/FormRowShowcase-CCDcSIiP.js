var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GField, GFormRow } from "@gardenerim/vue";

type Layout = "two" | "three" | "split";
const layoutOptions: Layout[] = ["two", "three", "split"];
const layout = ref<Layout>("three");
const spacious = ref(false);
const members = ref([
  { id: 1, name: "林园", email: "lin@gardener.im", role: "产品设计" },
  { id: 2, name: "周青", email: "zhou@gardener.im", role: "前端开发" },
]);

const rowVariants = computed(() => [layout.value, spacious.value ? "spacious" : "compact", "align-end"]);

const addMember = () => {
  const id = Date.now();
  members.value.push({ id, name: "", email: "", role: "访客" });
};

const removeMember = (id: number) => {
  if (members.value.length > 1) members.value = members.value.filter((member) => member.id !== id);
};
<\/script>

<template>
  <article id="component-form-row" class="component-doc form-row-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / RESPONSIVE ROW LAYOUT</span>
        <h2>表单行 <span>Form Row / GFormRow</span></h2>
        <p>在同一逻辑行中排列相关字段、说明和操作，并在窄容器中自动回落到安全的单列阅读顺序。</p>
      </div>
      <span class="component-status">css-ready · responsive grid</span>
    </header>

    <section class="usage-section">
      <h3>可切换列数与动态字段行</h3>
      <p>切换二列、三列和主次分栏，观察同一组字段如何重新排布；添加成员会产生新的完整表单行。</p>
      <div class="form-row-toolbar" role="group" aria-label="表单行布局选项">
        <span class="form-row-toolbar-label">列布局</span>
        <button v-for="item in layoutOptions" :key="item" class="g-btn g-btn-outline" type="button" :aria-pressed="layout === item" @click="layout = item">{{ item === 'two' ? '二列' : item === 'three' ? '三列' : '主次 2:1' }}</button>
        <label class="g-switch-row form-row-density"><span><strong>宽松间距</strong></span><span class="g-switch"><input v-model="spacious" type="checkbox" role="switch" /><span /></span></label>
      </div>
      <div class="usage-preview usage-preview--block form-row-primary-preview g-form-container">
        <div class="form-row-list" aria-live="polite">
          <GFormRow v-for="(member, index) in members" :key="member.id" :variant="rowVariants" :aria-labelledby="\`member-row-\${member.id}\`">
            <GField variant="block">
              <div class="g-field-header"><label class="g-field-label" :for="\`member-name-\${member.id}\`">成员姓名</label><span class="g-field-meta">{{ index + 1 }}</span></div>
              <input :id="\`member-name-\${member.id}\`" v-model="member.name" class="g-input g-input-outlined" autocomplete="name" placeholder="输入姓名" />
            </GField>
            <GField variant="block">
              <label class="g-field-label" :for="\`member-email-\${member.id}\`">工作邮箱</label>
              <input :id="\`member-email-\${member.id}\`" v-model="member.email" class="g-input g-input-outlined" type="email" autocomplete="email" placeholder="name@example.com" />
            </GField>
            <GField variant="block">
              <label class="g-field-label" :for="\`member-role-\${member.id}\`">角色</label>
              <div class="g-field-control"><select :id="\`member-role-\${member.id}\`" v-model="member.role" class="g-select g-select-outlined"><option>产品设计</option><option>前端开发</option><option>管理员</option><option>访客</option></select><button class="g-field-action" type="button" :disabled="members.length === 1" :aria-label="\`移除成员 \${index + 1}\`" @click="removeMember(member.id)">移除</button></div>
            </GField>
            <span :id="\`member-row-\${member.id}\`" class="form-row-sr-only">成员 {{ index + 1 }}</span>
          </GFormRow>
        </div>
        <button class="g-btn g-btn-primary form-row-add" type="button" @click="addMember">添加成员</button>
      </div>
    </section>

    <section class="usage-section">
      <h3>固定列、跨列与分隔</h3>
      <p>固定列适合结构稳定的业务表单；span 部件允许少数字段占据更多空间，并保留自然 DOM 阅读顺序。</p>
      <div class="usage-preview usage-preview--block form-row-example-stack g-form-container">
        <GFormRow :variant="['three', 'align-start']">
          <GField><label class="g-field-label" for="row-country">国家或地区</label><select id="row-country" class="g-select g-select-outlined"><option>中国大陆</option></select></GField>
          <GField class="g-form-row-span-2"><label class="g-field-label" for="row-address">街道地址</label><input id="row-address" class="g-input g-input-outlined" value="青木路 18 号 Gardener 园区" /></GField>
          <GField><label class="g-field-label" for="row-postcode">邮政编码</label><input id="row-postcode" class="g-input g-input-outlined" inputmode="numeric" value="200000" /></GField>
          <GField><label class="g-field-label" for="row-city">城市</label><input id="row-city" class="g-input g-input-outlined" value="上海" /></GField>
          <GField><label class="g-field-label" for="row-district">区县</label><input id="row-district" class="g-input g-input-outlined" value="青木区" /></GField>
          <hr class="g-form-row-divider" />
          <label class="g-check g-form-row-span-full"><input type="checkbox" checked /><span>设为默认收货地址</span></label>
        </GFormRow>
      </div>
    </section>

    <section class="usage-section">
      <h3>主次分栏、侧栏与操作区</h3>
      <p>非对称布局适合“主要内容 + 辅助设置”；操作区保持贴近行末，移动端则与内容一起进入单列。</p>
      <div class="usage-preview usage-preview--block form-row-composition-grid g-form-container">
        <div><b>split · 2:1</b><GFormRow variant="split"><GField class="g-form-row-main"><label class="g-field-label" for="row-summary">项目摘要</label><textarea id="row-summary" class="g-textarea g-textarea-outlined" rows="4">建立统一、可访问的组件规范。</textarea></GField><GField class="g-form-row-aside"><label class="g-field-label" for="row-status">发布状态</label><select id="row-status" class="g-select g-select-outlined"><option>草稿</option><option>已发布</option></select><small class="g-field-help">仅管理员可发布</small></GField></GFormRow></div>
        <div><b>sidebar-start · 导航信息在前</b><GFormRow variant="sidebar-start"><aside class="g-form-row-aside form-row-note"><strong>个人资料</strong><span>这些信息会向团队成员展示。</span></aside><div class="g-form-row-main"><GFormRow :variant="['two', 'compact']"><GField><label class="g-field-label" for="row-first-name">名字</label><input id="row-first-name" class="g-input g-input-outlined" value="园" /></GField><GField><label class="g-field-label" for="row-last-name">姓氏</label><input id="row-last-name" class="g-input g-input-outlined" value="林" /></GField></GFormRow></div></GFormRow></div>
        <div class="form-row-composition-full"><b>align-end · 字段与操作按钮底部对齐</b><GFormRow :variant="['auto', 'align-end']"><GField><label class="g-field-label" for="row-keyword">关键词</label><input id="row-keyword" class="g-input g-input-outlined" placeholder="名称或邮箱" /></GField><GField><label class="g-field-label" for="row-team">团队</label><select id="row-team" class="g-select g-select-outlined"><option>全部团队</option></select></GField><div class="g-form-row-actions"><button class="g-btn g-btn-text" type="button">清除</button><button class="g-btn g-btn-primary" type="button">查询</button></div></GFormRow></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>错误、只读与禁用行</h3>
      <p>行级状态用于表达一组字段的共同上下文；它不会替代控件自身的 readonly 或 disabled 属性。</p>
      <div class="usage-preview usage-preview--block form-row-state-stack">
        <GFormRow :variant="['two', 'compact']" state="error" aria-invalid="true"><GField state="error"><label class="g-field-label" for="row-error-a">开始日期</label><input id="row-error-a" class="g-input g-input-outlined" type="date" value="2026-09-12" aria-invalid="true" /></GField><GField state="error"><label class="g-field-label" for="row-error-b">结束日期</label><input id="row-error-b" class="g-input g-input-outlined" type="date" value="2026-09-10" aria-invalid="true" /><small class="g-field-feedback">结束日期不能早于开始日期。</small></GField></GFormRow>
        <GFormRow :variant="['two', 'compact']" state="read-only" data-g-form-read-only="true"><GField><label class="g-field-label" for="row-readonly-a">创建人</label><input id="row-readonly-a" class="g-input" value="系统管理员" readonly /></GField><GField><label class="g-field-label" for="row-readonly-b">创建时间</label><input id="row-readonly-b" class="g-input" value="2026-09-04 14:30" readonly /></GField></GFormRow>
        <GFormRow :variant="['two', 'compact']" state="disabled" aria-disabled="true"><GField state="disabled"><label class="g-field-label" for="row-disabled-a">受控策略</label><input id="row-disabled-a" class="g-input" value="企业安全策略" disabled /></GField><GField state="disabled"><label class="g-field-label" for="row-disabled-b">修改权限</label><input id="row-disabled-b" class="g-input" value="无权限" disabled /></GField></GFormRow>
      </div>
    </section>

    <aside class="form-row-guidance"><strong>GFormRow 只负责布局</strong><span>它不会创建 label、处理校验或自动禁用控件。字段语义交给 GField，选择分组交给 GFieldset；DOM 顺序应始终与视觉阅读顺序一致。</span></aside>

    <footer class="component-doc__meta">
      <span><b>列</b><code>auto</code><code>one</code><code>two</code><code>three</code><code>four</code></span>
      <span><b>比例</b><code>split</code><code>sidebar-start</code><code>sidebar-end</code></span>
      <span><b>放置</b><code>span-2</code><code>span-3</code><code>span-full</code><code>start-2</code></span>
      <span><b>响应式</b><code>container query</code><code>mobile stack</code><code>print stack</code></span>
    </footer>
  </article>
</template>

<style>
.form-row-documentation .form-row-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-block: 20px; }
.form-row-documentation .form-row-toolbar-label { margin-inline-end: 4px; color: var(--g-color-text-muted); font-size: var(--g-font-size-sm); font-weight: 700; }
.form-row-documentation .form-row-toolbar .g-btn[aria-pressed="true"] { border-color: var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-primary-text); }
.form-row-documentation .form-row-density { width: auto; margin-inline-start: auto; border: 0; background: transparent; }
.form-row-documentation .form-row-list, .form-row-documentation .form-row-example-stack, .form-row-documentation .form-row-state-stack { display: grid; gap: 28px; }
.form-row-documentation .form-row-list > .g-form-row + .g-form-row { padding-block-start: 24px; border-block-start: 1px solid var(--g-color-border); }
.form-row-documentation .form-row-add { margin-block-start: 24px; }
.form-row-documentation .form-row-sr-only { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }
.form-row-documentation .form-row-composition-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 34px; }
.form-row-documentation .form-row-composition-grid > div { display: grid; min-width: 0; gap: 14px; }
.form-row-documentation .form-row-composition-grid > div > b { color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); }
.form-row-documentation .form-row-composition-full { grid-column: 1 / -1; }
.form-row-documentation .form-row-note { display: grid; align-content: start; gap: 5px; padding: 14px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); }
.form-row-documentation .form-row-note strong { color: var(--g-color-text); }
.form-row-documentation .form-row-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.form-row-documentation .form-row-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .form-row-documentation .form-row-density { inline-size: 100%; margin-inline-start: 0; } .form-row-documentation .form-row-composition-grid { grid-template-columns: 1fr; } .form-row-documentation .form-row-composition-full { grid-column: auto; } }
</style>
`;export{e as default};