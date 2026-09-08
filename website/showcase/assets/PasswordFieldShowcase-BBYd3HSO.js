var e=`<script setup lang="ts">
import { ref } from "vue";
import { GInput, GPasswordField, GPasswordStrength } from "@gardenerim/vue";
import DemoIcon from "./DemoIcon.vue";

const currentPassword = ref("Gardenerim2026!")
const clearablePassword = ref("temporary-secret")
const controlledPassword = ref("VisibleOnDemand")
const controlledVisibility = ref(false)
const newPassword = ref("Garden")

const valueFrom = (event: Event) => (event.target as HTMLInputElement).value
const syncVisibility = (event: Event) => {
  controlledVisibility.value = Boolean((event as CustomEvent<{ visible: boolean }>).detail?.visible)
}
<\/script>

<template>
  <article id="component-password-field" class="component-doc password-field-documentation">
    <header class="component-doc__header">
      <div>
        <span class="component-kicker">FORM / PASSWORD</span>
        <h2>密码输入框 <span>Password Field / GPasswordField</span></h2>
        <p>在普通输入框基础上提供安全显隐、清空、密码管理器语义、状态反馈、Caps Lock 提醒与密码强度组合。</p>
      </div>
      <span class="component-status">runtime-ready</span>
    </header>

    <section class="usage-section">
      <h3>基本用法</h3>
      <p>默认保持密码隐藏；显隐按钮拥有独立的可访问名称，切换时保留输入值、选择区间和键盘焦点，按 Escape 可立即隐藏。</p>
      <div class="usage-preview usage-preview--block password-basic-grid">
        <label class="g-field">
          <span class="g-label">当前密码</span>
          <GPasswordField>
            <span class="g-password-field-prefix" aria-hidden="true"><DemoIcon name="lock" /></span>
            <GInput id="password-basic" v-model="currentPassword" type="password" autocomplete="current-password" placeholder="请输入当前密码" />
            <button class="g-password-field-action g-password-toggle" type="button" data-g-password-button>
              <span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span>
              <span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span>
            </button>
          </GPasswordField>
          <small class="g-field-help">Enter 提交表单，Escape 隐藏已显示的密码</small>
        </label>

        <label class="g-field">
          <span class="g-label">默认可见</span>
          <GPasswordField :config="{ defaultVisible: 'true' }">
            <GInput id="password-default-visible" value="PreviewOnly2026" type="password" autocomplete="off" />
            <button class="g-password-field-action g-password-toggle" type="button" data-g-password-button>
              <span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span>
              <span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span>
            </button>
          </GPasswordField>
          <small class="g-field-help">仅适合临时口令等低风险场景</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>受控显隐</h3>
      <p>显隐状态既可由字段内部按钮管理，也可通过外部策略控制；两种入口会同步同一个 <code>visibility</code> 状态。</p>
      <div class="usage-preview usage-preview--block password-controlled-preview">
        <div class="password-control-row">
          <span>外部控制</span>
          <label class="g-switch"><input v-model="controlledVisibility" type="checkbox" /><span class="g-switch-track" /><span>{{ controlledVisibility ? '显示' : '隐藏' }}</span></label>
        </div>
        <label class="g-field">
          <span class="g-label">API 密钥</span>
          <GPasswordField :config="{ visibility: String(controlledVisibility), hideOnBlur: 'true' }" @gardener:visibilitychange="syncVisibility">
            <span class="g-password-field-prefix" aria-hidden="true"><DemoIcon name="shield" /></span>
            <GInput id="password-controlled" v-model="controlledPassword" type="password" autocomplete="off" />
            <button class="g-password-field-action g-password-toggle" type="button" data-g-password-button>
              <span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span>
              <span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span>
            </button>
          </GPasswordField>
          <small class="g-field-help">离开字段后自动恢复隐藏，适合敏感凭据</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>外观与尺寸</h3>
      <p>与 GInput 保持统一设计语言：默认浅色填充，同时提供明确边界、无边界和下划线外观，以及 24–36px 四档高度。</p>
      <div class="usage-preview usage-preview--block password-appearance-grid">
        <label class="g-field"><span class="g-label">Filled</span><GPasswordField><GInput type="password" value="filled" aria-label="Filled password" /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField></label>
        <label class="g-field"><span class="g-label">Outlined</span><GPasswordField variant="outlined"><GInput type="password" value="outlined" aria-label="Outlined password" /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField></label>
        <label class="g-field"><span class="g-label">Borderless</span><GPasswordField variant="borderless"><GInput type="password" value="borderless" aria-label="Borderless password" /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField></label>
        <label class="g-field"><span class="g-label">Underlined</span><GPasswordField variant="underlined"><GInput type="password" value="underlined" aria-label="Underlined password" /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField></label>
      </div>
      <div class="usage-preview usage-preview--block password-size-grid">
        <GPasswordField v-for="size in (['mini', 'small', 'medium', 'large'] as const)" :key="size" :variant="size"><GInput type="password" :value="size" :aria-label="\`\${size} password\`" /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField>
      </div>
    </section>

    <section class="usage-section">
      <h3>清空、状态与安全语义</h3>
      <p>清空和显隐是两个独立按钮；错误不能只依赖颜色，禁用与只读也保持不同交互语义。浏览器密码管理器通过 autocomplete 获取准确用途。</p>
      <div class="usage-preview usage-preview--block password-state-grid">
        <label class="g-field">
          <span class="g-label">可清空密码</span>
          <GPasswordField variant="clearable" :config="{ clearInput: true }">
            <GInput v-model="clearablePassword" type="password" autocomplete="new-password" />
            <button class="g-password-clear" type="button" data-g-clear-button aria-label="清空密码">×</button>
            <button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button>
          </GPasswordField>
          <small class="g-field-help">清空后焦点返回输入框</small>
        </label>
        <label class="g-field is-error">
          <span class="g-label">错误</span>
          <GPasswordField state="error" aria-invalid="true"><GInput type="password" value="weak" aria-describedby="password-error" /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField>
          <small id="password-error" class="g-field-feedback">× 密码不符合安全策略</small>
        </label>
        <label class="g-field">
          <span class="g-label">只读</span>
          <GPasswordField><GInput type="password" value="readonly-secret" readonly /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField>
          <small class="g-field-help">仍可查看和复制</small>
        </label>
        <label class="g-field">
          <span class="g-label">禁用</span>
          <GPasswordField><GInput type="password" value="disabled-secret" disabled /><button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button></GPasswordField>
          <small class="g-field-help">显隐按钮同步禁用</small>
        </label>
        <label class="g-field password-caps-demo">
          <span class="g-label">Caps Lock 感知</span>
          <GPasswordField>
            <GInput type="password" autocomplete="new-password" placeholder="开启 Caps Lock 后输入" />
            <button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button>
            <span class="g-password-field-caps" data-g-caps-lock role="status"><DemoIcon name="warning" /> Caps Lock 已开启</span>
          </GPasswordField>
          <small class="g-field-help">仅在键盘报告大写锁定时出现</small>
        </label>
      </div>
    </section>

    <section class="usage-section">
      <h3>密码强度</h3>
      <p>新密码场景可组合 GPasswordStrength，实时提供强度、进度与逐条规则反馈；颜色之外仍保留文字和勾选状态。</p>
      <div class="usage-preview usage-preview--block password-strength-preview">
        <GPasswordStrength :config="{ minLength: 10 }">
          <label class="g-field">
            <span class="g-label">设置新密码</span>
            <GPasswordField variant="outlined">
              <GInput :value="newPassword" type="password" autocomplete="new-password" aria-describedby="password-rules" @input="newPassword = valueFrom($event)" />
              <button class="g-password-toggle" type="button" data-g-password-button><span class="g-password-toggle-icon g-password-icon-hidden"><DemoIcon name="eye" /></span><span class="g-password-toggle-icon g-password-icon-visible"><DemoIcon name="eye-off" /></span></button>
            </GPasswordField>
          </label>
          <div class="g-password-strength-header"><span>密码强度</span><strong data-g-password-strength-label>未设置</strong></div>
          <div class="g-password-strength-meter" data-g-password-strength-meter><span class="g-password-strength-value" /></div>
          <ul id="password-rules" class="g-password-rules">
            <li class="g-password-rule" data-g-password-rule="length">至少 10 个字符</li>
            <li class="g-password-rule" data-g-password-rule="upper">包含大写字母</li>
            <li class="g-password-rule" data-g-password-rule="lower">包含小写字母</li>
            <li class="g-password-rule" data-g-password-rule="number">包含数字</li>
            <li class="g-password-rule" data-g-password-rule="symbol">包含符号</li>
          </ul>
        </GPasswordStrength>
      </div>
    </section>

    <footer class="component-doc__meta">
      <span><b>外观</b><code>filled</code><code>outlined</code><code>borderless</code><code>underlined</code></span>
      <span><b>安全</b><code>visibility</code><code>escape-to-hide</code><code>hide-on-blur</code><code>Caps Lock</code></span>
      <span><b>组合</b><code>clearable</code><code>strength</code><code>prefix</code><code>password manager</code></span>
      <span><b>状态</b><code>error</code><code>disabled</code><code>read-only</code><code>visible</code></span>
    </footer>
  </article>
</template>
`;export{e as default};