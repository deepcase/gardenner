# GCollapse 折叠面板

参考 [Arco Design Vue Collapse](https://arco.design/vue/component/collapse)。完整多面板模式通过 `disclosureOptions` 启用；五端共用运行时、样式与参数。原有 GCollapse 单区域内容、GAccordion 和 GReadMore 保持兼容。

## 参数

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `items` | 必填 | 面板数组，最多 500 项，key 为唯一字符串或有限数字；数值 1 与字符串 "1" 视为同一个 key |
| `activeKey` | 未控制 | `(string\|number)[]`，受控展开项 |
| `defaultActiveKey` | `[]` | 初始展开项，后续参数更新不会重置状态 |
| `accordion` | false | 只允许单项展开 |
| `collapsible` | true | false 时至少保留一个可用项 |
| `bordered` | true | 显示容器边框 |
| `showExpandIcon` | true | 显示展开图标，可逐项覆盖 |
| `expandIconPosition` | left | left/right，物理左右位置，与 Arco 一致 |
| `expandIcon` | 箭头 | 自定义文本图标，或 `{collapsed,expanded}` |
| `destroyOnHide` | false | 收起后销毁生成内容；下次展开重新创建 |
| `lazy` | true | 首次展开时创建内容；false 时预先挂载 |
| `disabled` | false | 禁止用户和实例 API 展开/收起，仍接受受控值更新 |
| `keyboard` | true | 上下方向键、Home/End 导航；按钮原生 Enter/Space 始终可用 |
| `animated` / `duration` | true / 200 | 高度动画与时长 0–2000ms，减少动态效果偏好下立即切换 |
| `size` | medium | small/medium/large：标题内容高 32/40/48px，分隔边框另计；触屏至少 44px |
| `label` | 空 | 面板组的上下文名称，用于区分多个折叠组的无障碍区域 |
| `emptyText` | No panels | 空数组状态文案 |

每个 item 支持 `key`、`header`、`content`、`disabled`、`showExpandIcon`、`expandIconPosition`、`expandIcon`、`destroyOnHide`、`lazy`。`content` 作为纯文本渲染，保留换行，不解释 HTML。

`extra` 可为文本或 `{label, action, disabled}`。有 action 时生成独立按钮，发出 `gardener:action`，点击不会切换面板。面板禁用与附加操作禁用可分别配置。

`contentTemplate`、`extraTemplate` 是页面原生 `<template>` 元素的 ID，用于列表、链接、表单、附加操作和嵌套组件。内容模板首次挂载时克隆，内部 Gardener 行为自动初始化，销毁时清理。请先创建模板再初始化组件。它们是 DOM 模板，不是跨框架 VNode/JSX/RenderFragment 插槽；原有框架 children/slots 仍可通过传统结构使用，生命周期由框架管理。

## 五端接入

```js
const options = {
  label: '项目设置', defaultActiveKey: ['overview'], accordion: false,
  items: [
    {key:'overview', header:'项目概览', content:'项目说明'},
    {key:2, header:'高级设置', content:'通知与访问策略', extra:{label:'编辑', action:'edit'}},
    {key:'policy', header:'组织策略', disabled:true, content:'由管理员管理'}
  ]
};
```

CSS：

```html
<div id="collapse" class="g-collapse-panel" data-g-accordion></div>
```

```js
import {init, getInstance} from '@gardenerim/css/runtime';
const root = document.getElementById('collapse');
root.dataset.gDisclosureOptions = JSON.stringify(options);
init(root);
const api = getInstance(root, 'accordion');
api.open('overview');
// 更新时保留现有实例、展开状态和未变更内容的 DOM：
root.dataset.gDisclosureOptions = JSON.stringify({...options, bordered:false});
api.refresh();
```

Vue：`<GCollapse :config="{disclosureOptions:JSON.stringify(options)}" @gardener:change="onChange" />`

React：`<GCollapse config={{disclosureOptions:JSON.stringify(options)}} />`，使用 ref 或框架事件接口订阅 `gardener:change`。

AngularJS：`<div g-collapse gardener-config="config"></div>`，`$scope.config={disclosureOptions:JSON.stringify(options)}`。

Blazor：`<GCollapse Config="Config" EventNames="Events" OnEvent="Changed" />`，`Config["disclosureOptions"] = JsonSerializer.Serialize(options)`，`Events=["gardener:change","gardener:action"]`。示例应用路由 `/collapse`。

TypeScript 类型 `GardenerimCollapseOptions`、`GardenerimCollapseItem` 从 `@gardenerim/css/runtime` 导入。

## 状态与生命周期

- `gardener:change` 包含 `activeKey`（保留字符串/数字类型）、兼容的字符串 `keys`、`expanded`、`trigger`、`reason`、`controlled`。
- `gardener:beforeopen` / `gardener:beforeclose` 可以取消操作。嵌套实例独立管理状态；外层不会响应内层按钮。
- `activeKey` 存在时仅发出建议，由父组件写回；旧 `disclosureValue` 存在时优先作为受控值，建议二者选一。
- 实例继续提供 `toggle`、`open`、`close`、`value`、`refresh`、`destroy`。字符串或数字优先匹配 key，找不到数字 key 时兼容旧的位置索引。
- 默认收起保留节点和输入。`destroyOnHide:true` 在收起动画结束后清理 DOM 和嵌套运行时；重新展开克隆新的模板，原生输入回到初始值。关闭动画可立即销毁。
- 更新 items 时保留内容未变的同 key 节点；内容或模板 ID 变化才重建。移除面板会清理运行时，必要时恢复键盘焦点。
- 销毁实例会还原调用前的原始内容、类名和根属性。文本配置不接受任意 HTML；模板应由应用自行提供。

## 演示与比例

[CSS 交互演示](../packages/css/examples/collapse.html)；GardenerDemo 的 `?component=collapse#catalog` 提供 10 个场景，包含参数实验室、手风琴、受控、无边框、自定义图标、附加操作、嵌套、富内容、销毁与空状态。

标准标题采用 Arco 的 14px 字号、24px 行高、上下 8px 内边距；展开内容上下 8px，左图标布局起始 34px，右图标布局 13px。沿用 Gardener 主题颜色，并提供尺寸与触屏扩展。
