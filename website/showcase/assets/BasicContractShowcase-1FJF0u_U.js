var e=`<script setup lang="ts">
import {ref} from 'vue';
import {GBadge,GTag,GAvatar,GAvatarGroup,GButton} from '@gardenerim/vue';
const count=ref(128),limit=ref(99),showZero=ref(false),maximum=ref(3),selected=ref(false),disabled=ref(false),loading=ref(false),framework=ref('Vue');
const code:Record<string,string>={
 CSS:\`<button class="g-tag g-tag-checkable" data-g-basic-toggle
  data-g-basic-controlled="true" aria-pressed="false">标签</button>
// init(element); 监听 gardener:change，使用 detail.value 更新状态。\`,
 Vue:\`<GTag as="button" variant="checkable" v-model="selected"
  :aria-pressed="selected" :config="{basicToggle:true, basicControlled:true}">标签</GTag>\`,
 React:\`<GTag as="button" variant="checkable" value={selected}
  onValueChange={setSelected} aria-pressed={selected}
  config={{basicToggle:true,basicControlled:true}}>标签</GTag>\`,
 AngularJS:\`<button g-tag gardener-variant="checkable"
  gardener-config="{basicToggle:true,basicControlled:true}"
  ng-model="selected" ng-attr-aria-pressed="{{selected}}">标签</button>\`,
 Blazor:\`<GTag As="button" Variant="checkable" @bind-Value="selected"
  aria-pressed="@selected.ToString().ToLowerInvariant()"
  Config="@(new Dictionary<string,object?> { ["basicToggle"]=true, ["basicControlled"]=true })">标签</GTag>\`
};
<\/script>
<template>
 <section class="basic-contract-panel">
  <h3>Arco 比例基准与五框架参数</h3><p>按钮 24 / 28 / 32 / 36px；Tag、Chip 20 / 24 / 32px；头像默认 40px，文字为尺寸的 1/2。尺寸、留白与字体比例统一由 CSS 包提供。</p>
  <p><a class="g-btn g-btn-outline" href="./basic.html">打开 49 组 Arco 真实组件对照</a></p>
  <div class="basic-parameter-row"><label>计数<input v-model.number="count" type="number" min="0"></label><label>上限<input v-model.number="limit" type="number" min="0"></label><label><input v-model="showZero" type="checkbox">显示零值</label><GBadge variant="solid" :config="{basicCount:count,basicMax:limit,basicShowZero:showZero}" :aria-label="\`\${count} 条消息\`"><span class="g-badge-value"></span></GBadge></div>
  <div class="basic-parameter-row"><label>头像数量上限<input v-model.number="maximum" type="number" min="0" max="5"></label><GAvatarGroup :config="{basicMax:maximum}" role="group" aria-label="团队成员"><GAvatar v-for="name in ['A','B','C','D','E']" :key="name"><span class="g-avatar-text">{{name}}</span></GAvatar><GAvatar class="g-avatar-overflow" aria-label="更多成员" /></GAvatarGroup></div>
  <div class="basic-parameter-row"><label><input v-model="disabled" type="checkbox">禁用</label><label><input v-model="loading" type="checkbox">加载</label><GTag as="button" variant="checkable" v-model="selected" :aria-pressed="selected" :state="disabled?'disabled':undefined" :config="{basicToggle:true,basicControlled:true}">共享选择行为</GTag><GButton variant="primary" :state="loading?'loading':disabled?'disabled':undefined">提交</GButton><output aria-live="polite">选中：{{selected}}</output></div>
  <label>使用方式<select v-model="framework"><option v-for="name in ['Vue','React','AngularJS','CSS','Blazor']" :key="name">{{name}}</option></select></label><pre>{{code[framework]}}</pre>
 </section>
</template>
<style scoped>.basic-contract-panel{padding:24px;margin:24px 0;border:1px solid var(--g-color-border);background:var(--g-color-surface);border-radius:8px}.basic-contract-panel h3{font-size:22px;margin:0 0 12px}.basic-parameter-row{display:flex;gap:18px;flex-wrap:wrap;align-items:center;margin:24px 0}.basic-parameter-row label{display:flex;align-items:center;gap:8px}.basic-parameter-row input[type=number]{width:76px;padding:6px;border:1px solid var(--g-color-border);border-radius:2px;color:inherit;background:var(--g-color-surface)}.basic-contract-panel pre{padding:16px;white-space:pre-wrap;overflow-wrap:anywhere;background:var(--g-color-surface-subtle);font-size:13px}</style>
`;export{e as default};