# GDescriptions

参考 [Arco Design Vue Descriptions](https://arco.design/vue/component/descriptions) 的数据布局与比例。保留既有 `GDescriptionList` 手写结构；新增 `GDescriptions` 用于数据驱动详情页。CSS、Vue、React、AngularJS、Blazor 共享同一控制器与样式。

## 参数

通过 `data-g-data-options` / `config['data-options']` 传入 JSON；TypeScript 类型为 `GardenerimDescriptionsOptions`。

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| data | [] | 描述项数组，最多 1000 项 |
| column | 3 | 1–24 列，或 `{xs:1,sm:2,lg:3}` 响应式断点对象 |
| title / label | 无 | 可见标题 / 表格无障碍名称 |
| layout | horizontal | horizontal、vertical、inline-horizontal、inline-vertical |
| size | medium | mini、small、medium、large，与 Arco 默认尺寸一致 |
| bordered | false | 单元格边框与块布局标签底色 |
| align | left | left、center、right，或 `{label:'right',value:'left'}` |
| maxHeight | 无 | 滚动区域最大高度，32–10000px；支持键盘聚焦和滚动 |
| tableLayout | auto | auto / fixed；固定布局适合长文本和等宽列 |
| labelStyle / valueStyle | 无 | 全局标签和值样式，项目样式优先 |
| extra / extraTemplate | 无 | 标题右侧文字 / 原生 template ID |
| placeholder | — | null、undefined 的展示内容；0、false、空字符串原样保留 |
| loading / loadingText | false / Loading… | 加载状态；切换时卸载原内容 |
| error | 无 | 错误文本，使用 alert 语义；加载状态优先 |
| emptyText | No data | 空数组文案 |

每项支持 `key`、`label`、`value`、`span`、`labelTemplate`、`valueTemplate`、`labelStyle`、`valueStyle`。key 可为字符串或有限数字，转为字符串后必须唯一；未提供时采用数组索引。动态列表应明确指定稳定 key。

`span` 为 1–24 的整数，超出当前列数时截断。当前行放不下下一项时换行，行末项目填满剩余列数，与 Arco 分组规则一致。水平块布局的值单元格使用 `2 × span − 1` 个表格列。

断点按视口宽度匹配：xs 0、sm 576、md 768、lg 992、xl 1200、xxl 1600px，选择匹配范围内最大且已配置的断点；未匹配时为 3 列。希望手机自动单列时显式设置 `column:{xs:1,md:2,lg:3}`。固定数值保持固定列数，容器内部允许横向滚动。

样式白名单：color、backgroundColor、fontWeight、fontSize、width、minWidth、maxWidth、whiteSpace、textAlign、verticalAlign、padding、paddingLeft、paddingRight。数字除 fontWeight 外按 px 处理。推荐使用主题 CSS 变量，以兼容明暗主题。

## 五端用法

```html
<!-- CSS -->
<div class="g-descriptions" data-g-data-display
  data-g-data-options='{"title":"项目资料","column":{"xs":1,"md":2},"bordered":true,"data":[{"key":"name","label":"名称","value":"Gardener"}]}'></div>
<script type="module">
  import {init} from '@gardenerim/css/runtime';
  init(document);
</script>
```

```vue
<script setup>
import {GDescriptions} from '@gardenerim/vue';
const options = {bordered:true, data:[{key:'name',label:'名称',value:'Gardener'}]};
</script>
<template><GDescriptions :config="{'data-options':JSON.stringify(options)}" /></template>
```

```tsx
import {GDescriptions} from '@gardenerim/react';
<GDescriptions config={{'data-options':JSON.stringify(options)}} />
```

```html
<!-- AngularJS: 注册 createGardenerimAngularJS 返回的模块；控制器中设置 config -->
<div g-descriptions gardener-config="config"></div>
<!-- $scope.config = {'data-options': JSON.stringify(options)}; -->
```

```razor
@using System.Text.Json
<GDescriptions Config="Config" />
@code {
  private IReadOnlyDictionary<string, object?> Config => new Dictionary<string, object?> {
    ["data-options"] = JsonSerializer.Serialize(new {
      bordered = true,
      data = new[] {new {key = "name", label = "名称", value = "Gardener"}}
    })
  };
}
```

## 自定义内容与生命周期

原生 `<template id="project-status">…</template>` 可由任意端输出，使用 `valueTemplate:'project-status'` 引用，必须在初始化前存在。标签和标题右侧同理。模板找不到时回退为文本。模板字符串不作为 HTML 执行；JSON 的 label/value 只接受文本、有限数字、布尔或 null。

模板不是 Vue VNode、React JSX 或 Blazor RenderFragment 插槽编译器。动态业务组件应由应用管理；模板适用于标记、链接、原生表单和 Gardener DOM 行为。模板会克隆，因此模板内部避免重复固定 ID。

同一 key、相同内容且未在块布局与行内布局之间切换时，调整列数、跨列、尺寸或样式会保留原 DOM、输入值和焦点。改动内容、切换块/行内布局、删除项目或进入加载/错误状态会卸载相应内容。模板内 Gardener 控制器自动初始化和销毁。

实例通过 `getInstance(element,'data-display')` 获取：`setOptions(patch)` 增量更新，`refresh()` 重读属性，`getState()` 返回数据、列数及状态，`destroy()` 清理监听并恢复原始 DOM。setOptions 覆盖项优先于后续 JSON 属性；框架调用方推荐始终使用 config 作为唯一配置来源。非法配置返回 false 并发出 `gardener:error`，保留当前有效视图。Descriptions 为只读布局，通用 data-display 的选择、移动、日期和导出方法不适用。

## 演示

- GardenerDemo：`http://127.0.0.1:4180/?component=descriptions#catalog`，10 组示例。
- [CSS 演示](../packages/css/examples/descriptions.html)
- Blazor 示例路由：`/descriptions`
