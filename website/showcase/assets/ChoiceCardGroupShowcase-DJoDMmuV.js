var e=`<script setup lang="ts">
import { computed, ref } from "vue";
import { GChoiceCardGroup } from "@gardenerim/vue";

const tier = ref("");
const touched = ref(false);
const modules = ref(["analytics", "automation"]);
const tierState = computed(() => touched.value && !tier.value ? "error" : tier.value ? "selected" : "empty");
const tierMessage = computed(() => touched.value && !tier.value ? "请选择一个工作区方案。" : tier.value ? \`已选择 \${tier.value} 方案\` : "尚未选择方案");

const tiers = [
  { value: "starter", icon: "S", title: "入门版", badge: "个人", description: "核心项目管理与 2 GB 存储空间", price: "免费" },
  { value: "team", icon: "T", title: "团队版", badge: "推荐", description: "协作权限、版本历史与 100 GB 存储", price: "¥49 / 人月" },
  { value: "enterprise", icon: "E", title: "企业版", badge: "定制", description: "单点登录、审计日志和专属支持", price: "联系销售" },
];
const moduleOptions = [
  { value: "analytics", title: "数据分析", description: "趋势图、漏斗和自定义仪表盘" },
  { value: "automation", title: "自动化", description: "按条件触发通知与工作流" },
  { value: "ai", title: "AI 助手", description: "摘要、生成和智能检索" },
  { value: "sandbox", title: "安全沙箱", description: "仅企业版可用", disabled: true },
];
<\/script>

<template>
  <article id="component-choice-card-group" class="component-doc choice-card-group-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / RICH CHOICE</span>
        <h2>卡片选择组 <span>GChoiceCardGroup</span></h2>
        <p>当选项需要同时展示说明、价格、图标或状态时，用整卡可点击的原生单选与复选组合完成决策。</p>
      </div>
      <span class="component-status">css-ready · native choice</span>
    </header>

    <section class="usage-section">
      <h3>单选方案与必选校验</h3>
      <p>卡片只是增强外观，真正的互斥和表单提交仍由同名原生 radio 完成。</p>
      <div class="usage-preview usage-preview--block choice-card-live">
        <GChoiceCardGroup :variant="['grid', 'three', 'single', 'block']" :state="tierState" :aria-invalid="touched && !tier || undefined" aria-describedby="tier-description tier-status">
          <legend class="g-choice-group-legend">工作区方案 <span class="g-validation-required" aria-hidden="true">*</span></legend>
          <p id="tier-description" class="g-choice-group-description">选择适合当前团队规模的计费方案。</p>
          <div class="g-choice-group-options">
            <label v-for="item in tiers" :key="item.value" class="g-choice-card">
              <input v-model="tier" type="radio" name="workspace-tier" :value="item.value" :required="item.value === 'starter'" />
              <span class="g-choice-card-header"><span class="g-choice-card-icon" aria-hidden="true">{{ item.icon }}</span><strong class="g-choice-card-title">{{ item.title }}</strong><span class="g-choice-card-badge">{{ item.badge }}</span></span>
              <span class="g-choice-card-description">{{ item.description }}</span>
              <span class="g-choice-card-footer"><b class="g-choice-card-price">{{ item.price }}</b><span class="g-choice-card-check" aria-hidden="true">✓</span></span>
            </label>
          </div>
          <small id="tier-status" :class="touched && !tier ? 'g-choice-group-feedback' : 'g-choice-group-status'" :role="touched && !tier ? 'alert' : 'status'" aria-live="polite">{{ tierMessage }}</small>
        </GChoiceCardGroup>
        <div class="choice-card-actions"><button class="g-btn g-btn-primary" type="button" @click="touched = true">继续</button><button class="g-btn g-btn-outline" type="button" @click="tier = ''; touched = false">重置</button></div>
      </div>
    </section>

    <section class="usage-section">
      <h3>多选模块</h3>
      <p>多选模式使用原生 checkbox；禁用卡片不响应点击，也不会影响其他已选项。</p>
      <div class="usage-preview usage-preview--block">
        <GChoiceCardGroup :variant="['grid', 'two', 'multiple', 'block']" :state="modules.length ? 'selected' : 'empty'" aria-describedby="module-status">
          <legend class="g-choice-group-legend">启用工作区模块</legend>
          <div class="g-choice-group-options">
            <label v-for="item in moduleOptions" :key="item.value" class="g-choice-card">
              <input v-model="modules" type="checkbox" name="workspace-modules" :value="item.value" :disabled="item.disabled" />
              <span class="g-choice-card-header"><strong class="g-choice-card-title">{{ item.title }}</strong></span>
              <span class="g-choice-card-description">{{ item.description }}</span>
              <span class="g-choice-card-footer"><span class="g-choice-card-meta">{{ item.disabled ? '不可用' : modules.includes(item.value) ? '已启用' : '可选' }}</span><span class="g-choice-card-check" aria-hidden="true">✓</span></span>
            </label>
          </div>
          <small id="module-status" class="g-choice-group-status" role="status" aria-live="polite">已启用 {{ modules.length }} 个模块</small>
        </GChoiceCardGroup>
      </div>
    </section>

    <section class="usage-section">
      <h3>横向、只读与错误状态</h3>
      <div class="usage-preview usage-preview--block choice-card-states">
        <GChoiceCardGroup :variant="['horizontal', 'block']" state="read-only" data-g-form-read-only="true">
          <legend class="g-choice-group-legend">当前数据区域</legend>
          <label class="g-choice-card"><input type="radio" checked tabindex="-1" /><span class="g-choice-card-icon" aria-hidden="true">CN</span><span><strong class="g-choice-card-title">中国大陆</strong><span class="g-choice-card-description">由组织策略锁定</span></span><span class="g-choice-card-badge">只读</span></label>
        </GChoiceCardGroup>
        <GChoiceCardGroup :variant="['two', 'block']" state="error" aria-invalid="true" aria-describedby="choice-error">
          <legend class="g-choice-group-legend">恢复策略</legend>
          <label class="g-choice-card"><input type="radio" name="recovery" /><strong class="g-choice-card-title">自动恢复</strong><span class="g-choice-card-description">检测中断后立即重试</span></label>
          <label class="g-choice-card"><input type="radio" name="recovery" /><strong class="g-choice-card-title">手动确认</strong><span class="g-choice-card-description">等待管理员批准后重试</span></label>
          <small id="choice-error" class="g-choice-group-feedback" role="alert">请选择一种恢复策略。</small>
        </GChoiceCardGroup>
      </div>
    </section>

    <aside class="choice-card-guidance"><strong>只在信息密度值得时使用</strong><span>简单短标签优先用普通单选框或复选框；只有选项之间需要比较说明、价格或能力时，才升级为卡片选择。</span></aside>
    <footer class="component-doc__meta">
      <span><b>模式</b><code>single</code><code>multiple</code></span>
      <span><b>布局</b><code>two</code><code>three</code><code>horizontal</code></span>
      <span><b>状态</b><code>selected</code><code>disabled</code><code>invalid</code></span>
      <span><b>语义</b><code>fieldset</code><code>radio</code><code>checkbox</code></span>
    </footer>
  </article>
</template>

<style>
.choice-card-group-documentation .choice-card-live { display: grid; gap: 18px; }
.choice-card-group-documentation .choice-card-actions { display: flex; flex-wrap: wrap; gap: 10px; }
.choice-card-group-documentation .choice-card-states { display: grid; gap: 24px; }
.choice-card-group-documentation .choice-card-guidance { display: grid; gap: 6px; margin-block: 34px; padding: 18px 20px; border-inline-start: 3px solid var(--g-color-primary); background: var(--g-color-primary-soft); color: var(--g-color-text); font-size: var(--g-font-size-sm); line-height: 1.6; }
.choice-card-group-documentation .choice-card-guidance strong { color: var(--g-color-text); }
</style>
`;export{e as default};