# GTabs 标签页

参考 [Arco Design Vue Tabs](https://arco.design/vue/component/tabs)，对照版本 2.58.0。已有 GTabs 导出保持不变，新增五端共用的 tabs-options 参数模式。

[完整演示](http://127.0.0.1:4180/?component=tabs#catalog) · [CSS 示例](../packages/css/examples/tabs.html) · [Blazor 示例](http://127.0.0.1:5192/tabs) · [验收记录](tabs/verification.md)

## 共享参数

| 参数 | 默认 | 说明 |
| --- | --- | --- |
| items | 必填 | 标签数组，最多 500 项，key 为唯一字符串或有限数字，0 有效 |
| activeKey | 未设置 | 受控当前 key；null 显示无选中状态 |
| defaultActiveKey | 首个可用项 | 非受控初始 key，仅首次使用 |
| type | line | line / card / card-gutter / text / rounded / capsule |
| size | medium | mini / small / medium / large |
| position | top | top / bottom / left / right |
| direction | horizontal | vertical 等价于 position: left |
| trigger | click | click / hover；hover 模式仍可点击及键盘切换 |
| activation | auto | auto 方向键立即选择；manual 用 Enter / Space 确认 |
| editable | false | 显示可关闭图标，支持 Delete 请求关闭 |
| showAddButton | false | 显示新增按钮 |
| autoSwitch | false | 非受控状态下新增条目自动选中 |
| lazyLoad | false | 首次激活再渲染内容 |
| destroyOnHide | false | 隐藏后移除内容，返回重新创建 |
| animation | false | 内容淡入；减少动态效果偏好下关闭 |
| justify | false | 标签等宽分配剩余宽度 |
| headerPadding | true | 保留首项留白；false 取消首项边距 |
| hideContent | false | 仅展示标签栏，保留选中及关联关系 |
| disabled / loading | false | 禁止操作 / aria-busy 状态；loading 不自动禁止切换 |
| scrollPosition | auto | auto 滚动至可见；center 尽量居中 |
| extra / extraTemplate | 无 | 标签栏附加文字 / 原生 template id |
| label | Tabs | 标签列表可访问名称 |
| emptyText | No tabs | 空状态文案 |
| addLabel / closeLabel / closeHint | 英文 | 新增名称、关闭图标提示、Delete 快捷键读屏说明 |
| previousLabel / nextLabel | 英文 | 标签滚动按钮名称 |

items 条目支持 key、title（或 label）、content、badge、disabled、closable、lazyLoad、destroyOnHide、forceRender、titleTemplate、contentTemplate。forceRender 始终保留内容，优先于 lazyLoad 和 destroyOnHide。普通文本不会解释为 HTML。titleTemplate 适合图标和文本，请不要放置交互控件；可交互内容应放在 contentTemplate 或 extraTemplate。

模板为原生 HTML template；参数和顺序更新保留同一 key 的节点及输入状态。改变内容或模板 id 会更新对应内容。模板不是 Vue / React 等框架编译插槽。组件内的原始 template 节点也可引用，卸载后原始节点恢复。

## 五端用法

```js
const options = {
  items: [
    { key: 'overview', title: '概览', content: '项目概览' },
    { key: 'settings', title: '设置', content: '项目设置' },
  ],
  type: 'line', size: 'medium', position: 'top',
};
const config = { 'tabs-options': JSON.stringify(options) };
```

CSS：

```html
<div id="tabs" class="g-tabs" data-g-tabs></div>
<script type="module">
import { init } from '@gardenerim/css/runtime';
const root = document.getElementById('tabs');
root.setAttribute('data-g-tabs-options', JSON.stringify({items:[{key:'one',title:'项目一',content:'内容'}]}));
init(root);
</script>
```

Vue / React：

```vue
<GTabs :config="config" @gardener:change="handleChange" />
```

```tsx
<GTabs config={config} />
```

AngularJS：

```html
<div g-tabs gardener-config="config"></div>
```

Blazor：

```razor
<GTabs Config="Config" EventNames="@(new[]{"change","add","remove"})" OnEvent="Handle" />
```

Blazor 的 Config 使用 IReadOnlyDictionary<string,object?>，键为 tabs-options，值使用 JsonSerializer.Serialize(options)。完整页面见 TabsLab.razor。

## 事件与实例

- gardener:beforechange：可 preventDefault 阻止切换。
- gardener:change：切换或受控切换请求；detail 提供 key、value、previousKey、tab、panel、reason、controlled。
- gardener:add：新增请求；调用者添加条目并更新 items。
- gardener:beforetabclose：可取消删除请求。
- gardener:remove：关闭请求；调用者从 items 删除对应 key。组件不会擅自改写业务数组。

受控模式下必须在 change 回调中更新 activeKey，组件才改变可见面板。响应 DOM 事件时检查 event.target === root，避免接收嵌套组件冒泡。异步校验可在 beforechange 中立即阻止，再由业务侧更新 activeKey；本模式不提供 Promise 校验接口。

getInstance(root, 'tabs') 在配置模式返回 select(key, focus?)、current()、getState()、setOptions(patch)、refresh()、scrollTo(key)、remove(key)、requestAdd()、destroy()。TypeScript 配置类型为 GardenerimTabsOptions，实例类型为 GardenerimConfiguredTabsInstance。select 的数字参数是 key；旧手写模式的数字参数仍是索引。setOptions 的 undefined 移除覆盖，JSON 属性提供基础配置。

方向键跳过禁用标签，Home / End 到首尾，垂直布局使用上下键，横向布局支持 RTL。Tab 进入当前标签和内容面板；Delete 请求关闭当前标签。关闭图标为指针入口，快捷键承担对应键盘操作。

## 兼容与范围

没有 tabs-options 时保留原手写 DOM 和原导航 items / navigation 模式。本次 Arco 扩展通过 config['tabs-options'] 使用，不能同时与通用 navigation 模式混用。API 不是 Arco 直接替换：使用 items 代替 TabPane、原生模板代替框架插槽、Gardener DOM 事件代替 Arco emits。未宣称支持 Arco 的全部 scrollPosition 类型；目前支持 auto 和 center。没有增加重复组件。
