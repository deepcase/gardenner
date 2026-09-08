var e=`<script setup lang="ts">
import {computed,ref} from 'vue';
import type {GardenerimComponentDefinition} from '@gardenerim/vue';
import NavigationSpecimen from './NavigationSpecimen.vue';
import catalog from '../data/navigation-examples.json';
import parameterDocs from '../data/navigation-parameters.json';
const parameters=parameterDocs as Record<string,{type:string;default:string;description:string}>;
const props=defineProps<{definition:GardenerimComponentDefinition}>();
const example=computed(()=>(catalog as Record<string,any>)[props.definition.name]);
const framework=ref('Vue');
const csharp=(value:any):string=>value===null?'null':Array.isArray(value)?\`[\${value.map(csharp).join(', ')}]\`:typeof value==='object'?\`new() { \${Object.entries(value).map(([key,item])=>\`\${key[0]!.toUpperCase()+key.slice(1)} = \${csharp(item)}\`).join(', ')} }\`:JSON.stringify(value);
const code=computed(()=>{const name=example.value.exportName,json=JSON.stringify(example.value.scenarios[0].options,null,2);return {
 CSS:\`const options = \${json};\\nconst nav = createNavigation(element, { component: '\${props.definition.name}', ...options,\\n  onChange: ({ value }) => console.log(value)\\n});\\n// 更新参数 / 卸载\\nnav.update({ size: 'small' });\\nnav.destroy();\`,
 Vue:\`const options = \${json};\\nconst selected = ref(options.defaultValue);\\n\\n<\${name} v-model="selected" :navigation="options"\\n  @change="onChange" />\`,
 React:\`const options = \${json};\\nconst [selected, setSelected] = useState(options.defaultValue);\\n\\n<\${name} navigation={options} value={selected}\\n  onValueChange={setSelected} />\`,
 AngularJS:\`$scope.options = \${json};\\n\\n<g-\${props.definition.name} gardener-navigation="options"\\n  ng-model="selected" gardener-on-value-change="onChange($value)">\\n</g-\${props.definition.name}>\`,
 Blazor:\`<\${name} Navigation="options" @bind-Value="selected"\\n  OnEvent="HandleNavigationEvent" />\\n\\n@code {\\n  object? selected = \${csharp(example.value.scenarios[0].options.defaultValue??null)};\\n  GardenerimNavigationOptions options = \${csharp(example.value.scenarios[0].options)};\\n}\`
 }[framework.value];});
<\/script>
<template>
 <article :id="\`component-\${definition.name}\`" class="component-doc navigation-documentation" :data-component="definition.name">
  <header class="component-doc__header"><div><span class="component-kicker">NAVIGATION / CONFIGURABLE</span><h2>{{definition.name.split('-').map(w=>w[0]!.toUpperCase()+w.slice(1)).join(' ')}} <span>{{definition.exportName}}</span></h2><p>{{example.summary}}</p></div><span class="kind-badge">五框架统一契约</span></header>
  <section v-for="scenario in example.scenarios" :key="scenario.id" class="usage-section"><h3>{{scenario.title}}</h3><p>{{scenario.description}}</p><NavigationSpecimen :name="definition.name" :scenario="scenario.id" :mobile="definition.platforms.length===1&&definition.platforms[0]==='mobile'" /></section>
  <section class="usage-section"><h3>参数与事件</h3><p>items 使用稳定且唯一的 id；value 可由应用控制。禁用和加载期间阻止操作，空数据有明确反馈。未传 navigation / items 时仍保留原有插槽方式。</p><div class="navigation-api-table"><table class="g-table"><thead><tr><th>参数</th><th>类型 / 默认值</th><th>用途</th></tr></thead><tbody><tr v-for="parameter in example.parameters" :key="parameter"><td><code>{{parameter}}</code></td><td>{{parameters[parameter]?.type}}<br><small>{{parameters[parameter]?.default}}</small></td><td>{{parameters[parameter]?.description}}</td></tr></tbody></table></div><p>事件：change / select、open、collapse、expand、pageSize、loadMore、previous / next、back、closeItem、check。按组件实际能力触发。</p></section>
  <section class="usage-section"><h3>五套项目使用同一参数结构</h3><label class="navigation-framework">框架<select v-model="framework"><option>Vue</option><option>React</option><option>AngularJS</option><option>Blazor</option><option>CSS</option></select></label><pre class="navigation-code"><code>{{code}}</code></pre></section>
 </article>
</template>
<style scoped>.navigation-api-table{overflow:auto}.navigation-framework{display:flex;align-items:center;gap:12px}.navigation-framework select{padding:8px 12px;background:var(--g-color-surface);color:inherit;border:1px solid var(--g-color-border)}.navigation-code{padding:20px;max-height:480px;overflow:auto;background:var(--g-color-surface-subtle);white-space:pre-wrap;font-size:13px}</style>
`;export{e as default};