var e=`<script setup lang="ts">
import { ref } from "vue";
import { GForm, GFormSection } from "@gardenerim/vue";

const editingProfile = ref(false);
const savedMessage = ref("偏好设置尚未保存");

const savePreferences = () => {
  savedMessage.value = "偏好设置已保存";
};
<\/script>

<template>
  <article id="component-form-section" class="component-doc form-section-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / INFORMATION ARCHITECTURE</span>
        <h2>表单分区 <span>Form Section / GFormSection</span></h2>
        <p>把长表单拆成有名称、说明、状态和局部操作的任务单元；既可作为语义 section，也可使用原生 details 构建可折叠高级设置。</p>
      </div>
      <span class="component-status">css-ready · semantic section</span>
    </header>

    <section class="usage-section">
      <h3>分步状态与局部操作</h3>
      <p>标题层级、编号、完成状态和错误状态共同帮助用户定位；分区操作只影响本区，最终提交仍由外层 GForm 负责。</p>
      <div class="usage-preview usage-preview--block form-section-primary-preview">
        <GForm variant="bordered" aria-labelledby="section-demo-title">
          <div class="g-form-header">
            <h4 id="section-demo-title" class="g-form-title">团队工作区设置</h4>
            <p class="g-form-description">三个分区共同组成一个表单，但每个分区拥有独立标题、状态和帮助信息。</p>
          </div>

          <GFormSection as="section" :variant="['numbered', 'divided']" state="complete" aria-labelledby="section-profile-title">
            <header class="g-form-section-header">
              <span class="g-form-section-number" aria-hidden="true">1</span>
              <div class="g-form-section-heading">
                <span class="g-form-section-eyebrow">账户信息</span>
                <h5 id="section-profile-title" class="g-form-section-title">个人资料</h5>
                <p class="g-form-section-description">显示名称和联系邮箱会用于团队协作通知。</p>
                <span class="g-form-section-meta"><span>2 个字段</span><span>上次更新：今天 14:20</span></span>
              </div>
              <div class="g-form-section-actions"><span class="g-form-section-status" role="status">已完成</span><button class="g-btn g-btn-text" type="button" @click="editingProfile = !editingProfile">{{ editingProfile ? '完成' : '编辑' }}</button></div>
            </header>
            <div class="g-form-section-body g-form-grid" :hidden="!editingProfile">
              <label class="g-field"><span class="g-field-label">显示名称</span><input class="g-input g-input-outlined" value="Ada Lovelace" /></label>
              <label class="g-field"><span class="g-field-label">联系邮箱</span><input class="g-input g-input-outlined" type="email" value="ada@gardener.im" /></label>
            </div>
            <div v-if="!editingProfile" class="g-form-section-summary">Ada Lovelace · ada@gardener.im</div>
          </GFormSection>

          <GFormSection as="section" :variant="['numbered', 'divided']" state="active" aria-current="step" aria-labelledby="section-preference-title">
            <header class="g-form-section-header">
              <span class="g-form-section-number" aria-hidden="true">2</span>
              <div class="g-form-section-heading">
                <span class="g-form-section-eyebrow">当前步骤</span>
                <h5 id="section-preference-title" class="g-form-section-title">通知偏好</h5>
                <p class="g-form-section-description">控制项目动态、每周摘要和高优先级告警的送达方式。</p>
              </div>
              <span class="g-form-section-status" role="status">正在编辑</span>
            </header>
            <div class="g-form-section-body">
              <div class="form-section-choice-grid">
                <label class="g-switch-row"><span><strong>项目动态</strong><small>成员、任务和里程碑变更</small></span><span class="g-switch"><input type="checkbox" role="switch" checked /><span /></span></label>
                <label class="g-switch-row"><span><strong>每周摘要</strong><small>每周一汇总发送</small></span><span class="g-switch"><input type="checkbox" role="switch" checked /><span /></span></label>
              </div>
            </div>
            <footer class="g-form-section-footer"><span class="g-form-section-meta">修改只保存当前分区</span><div class="g-form-section-actions"><button class="g-btn g-btn-outline" type="button">撤销</button><button class="g-btn g-btn-primary" type="button" @click="savePreferences">保存偏好</button></div></footer>
            <span class="g-form-section-status" role="status" aria-live="polite">{{ savedMessage }}</span>
          </GFormSection>

          <GFormSection as="section" :variant="['numbered', 'no-divider']" state="error" aria-invalid="true" aria-labelledby="section-security-title" aria-describedby="section-security-error">
            <header class="g-form-section-header">
              <span class="g-form-section-number" aria-hidden="true">3</span>
              <div class="g-form-section-heading"><span class="g-form-section-eyebrow">需要处理</span><h5 id="section-security-title" class="g-form-section-title">安全与恢复</h5><p class="g-form-section-description">至少添加一种恢复方式，避免团队失去管理员访问权限。</p></div>
              <span class="g-form-section-status" role="status">未完成</span>
            </header>
            <div id="section-security-error" class="g-form-section-summary" role="alert">缺少恢复邮箱或恢复代码，请完成其中一项。</div>
            <div class="g-form-section-actions"><button class="g-btn g-btn-outline" type="button">添加恢复邮箱</button><button class="g-btn g-btn-text" type="button">生成恢复代码</button></div>
          </GFormSection>
        </GForm>
      </div>
    </section>

    <section class="usage-section">
      <h3>原生可折叠分区</h3>
      <p>低频或高级设置使用 details/summary；Enter、Space、展开状态和打印展开均由原生语义支持，不需要额外脚本。</p>
      <div class="usage-preview usage-preview--block form-section-disclosure-grid">
        <GFormSection as="details" :variant="['bordered', 'collapsible']" open>
          <summary class="g-form-section-header">
            <div class="g-form-section-heading"><h5 class="g-form-section-title">高级网络设置</h5><p class="g-form-section-description">代理、超时和重试策略</p></div>
            <span class="g-form-section-toggle" aria-hidden="true" />
          </summary>
          <div class="g-form-section-body g-form-grid">
            <label class="g-field"><span class="g-field-label">请求超时</span><div class="g-unit-field"><input class="g-input g-input-outlined" type="number" value="30" /><span class="g-input-addon">秒</span></div></label>
            <label class="g-field"><span class="g-field-label">重试次数</span><select class="g-select"><option>3 次</option><option>5 次</option></select></label>
          </div>
        </GFormSection>
        <GFormSection as="details" :variant="['subtle', 'collapsible', 'compact']">
          <summary class="g-form-section-header"><div class="g-form-section-heading"><h5 class="g-form-section-title">实验性功能</h5><p class="g-form-section-description">默认收起，避免干扰主要任务</p></div><span class="g-form-section-toggle" aria-hidden="true" /></summary>
          <div class="g-form-section-body"><label class="g-check"><input type="checkbox" /><span>启用预览功能</span></label></div>
        </GFormSection>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观、密度与嵌套</h3>
      <p>分隔、边框、卡片和弱背景对应不同层级；嵌套分区使用起始边强调从属关系，不用不断叠加卡片。</p>
      <div class="usage-preview usage-preview--block form-section-variant-grid">
        <GFormSection v-for="variant in ['divided', 'bordered', 'card', 'subtle', 'compact', 'spacious']" :key="variant" :variant="variant">
          <header class="g-form-section-header"><div class="g-form-section-heading"><span class="g-form-section-eyebrow">{{ variant }}</span><h5 class="g-form-section-title">分区标题</h5><p class="g-form-section-description">用于展示 {{ variant }} 视觉层级。</p></div></header>
          <div class="g-form-section-summary">保持标题、说明和内容之间的稳定节奏。</div>
        </GFormSection>
        <GFormSection variant="bordered"><header class="g-form-section-header"><div class="g-form-section-heading"><h5 class="g-form-section-title">父级设置</h5><p class="g-form-section-description">包含一个从属分区。</p></div></header><GFormSection :variant="['nested', 'compact']"><header class="g-form-section-header"><div class="g-form-section-heading"><h6 class="g-form-section-title">继承规则</h6><p class="g-form-section-description">只用起始边表达嵌套关系。</p></div></header></GFormSection></GFormSection>
      </div>
    </section>

    <aside class="form-section-guidance"><strong>不要把每两个字段都切成一个分区</strong><span>分区应对应用户可以理解的任务或信息主题。标题必须在脱离上下文时仍有意义；只有低频内容才折叠，含错误的分区应保持展开并明确标记。</span></aside>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>divided</code><code>bordered</code><code>card</code><code>subtle</code><code>nested</code></span>
      <span><b>状态</b><code>active</code><code>complete</code><code>error</code><code>disabled</code><code>collapsed</code><code>expanded</code></span>
      <span><b>结构</b><code>header</code><code>heading</code><code>body</code><code>summary</code><code>footer</code><code>actions</code></span>
      <span><b>语义</b><code>section</code><code>details</code><code>summary</code><code>aria-labelledby</code><code>aria-invalid</code></span>
    </footer>
  </article>
</template>

<style>
.form-section-documentation .form-section-primary-preview > .g-form { max-inline-size: 62rem; }
.form-section-documentation .form-section-choice-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.form-section-documentation .g-switch-row :is(strong, small) { display: block; }
.form-section-documentation .g-switch-row small { margin-block-start: 2px; color: var(--g-color-text-muted); font-size: var(--g-font-size-xs); font-weight: 400; }
.form-section-documentation .form-section-disclosure-grid { display: grid; max-inline-size: 62rem; gap: 16px; }
.form-section-documentation .form-section-variant-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; align-items: start; }
.form-section-documentation .form-section-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.form-section-documentation .form-section-guidance strong { color: var(--g-color-text); }
@media (max-width: 760px) { .form-section-documentation .form-section-choice-grid, .form-section-documentation .form-section-variant-grid { grid-template-columns: 1fr; } }
</style>
`;export{e as default};