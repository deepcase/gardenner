# GTag 标签

参考 [Arco Design Vue Tag](https://arco.design/vue/component/tag)，以本地 Arco Vue 2.58.0 实测。四档尺寸、十三种预设色、可关闭和可选中状态均由五端共享实现。保留原有 `.g-tag` 静态 CSS；只有提供 `tag-options` 时才创建交互控制器。

- [GardenerDemo 完整演示](http://127.0.0.1:4180/?component=tag#catalog)：12 组场景与实时参数编辑。
- [原生 CSS / JavaScript 示例](../packages/css/examples/tag.html)
- [Blazor 示例](../packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/TagLab.razor)：本地主机 `/tag`。
- [验证记录](tag/verification.md)

## 五端相同配置

```js
const options = {
  text: '项目标签', size: 'medium', color: 'arcoblue',
  checkable: true, defaultChecked: true, closable: true,
  closeLabel: '关闭标签'
};
const config = { 'tag-options': JSON.stringify(options) };
```

Vue 使用 `<GTag :config="config" @gardener:check="onCheck" />`；React 使用 `<GTag config={config} onValueChange={onCheck} valueEvent="check" valueKey="checked" />`；AngularJS 使用 `<span g-tag gardener-config="config"></span>`；Blazor 使用 `<GTag Config="Config" EventNames="@(new[]{"check","close"})" OnEvent="Handle" />`，其中 Config 是相同 JSON 的字典。原生 HTML 为 `<span class="g-tag" data-g-tag data-g-tag-options='{"text":"标签","closable":true}'></span>`，调用 `init(element)`。

## 参数

| 参数 | 默认值 | 用途 |
| --- | --- | --- |
| text | 原始子内容 | 文本，使用 textContent，不解析 HTML |
| size | medium | mini / small 20px、medium 24px、large 32px |
| color | 未设置 | red、orangered、orange、gold、lime、green、cyan、blue、arcoblue、purple、pinkpurple、magenta、gray，或有效 CSS 颜色 |
| textColor | 主题推导；自定义背景为白色 | 自定义前景色；浅色自定义背景需配深色文字 |
| variant | soft | soft / solid / outline；圆角沿用 g-tag-round |
| bordered | false | 显示边框 |
| checkable | false | 点击、Enter、Space 切换；关闭按钮独立操作 |
| checked / defaultChecked | 未受控 / true | 受控选中值与初始值 |
| closable | false | 关闭按钮；按钮根节点另支持 Delete |
| visible / defaultVisible | 未受控 / true | 受控可见值与初始值 |
| loading / disabled | false | 加载指示、阻止选择和关闭 |
| nowrap | false | true 截断为省略号；false 可换行 |
| maxWidth | 容器宽度 | 正数像素或 CSS 长度，控制长文本 |
| label / closeLabel | 未设置 / Close tag | 选择按钮与关闭按钮的无障碍名称 |
| icon / closeIcon | 空 / × | 文字图标 |
| contentTemplate / iconTemplate / closeIconTemplate | 未设置 | 文档中原生 template 的 id；配置更新保留模板节点 |

默认字体为 12px、字重 500、水平内边距 8px、圆角 2px；large 字号 14px。预设色与暗色模式采用 Gardener 主题 tokens，默认尺寸与 Arco 一致。允许换行、disabled、关闭拦截、独立选择按钮语义是 Gardener 扩展。无需创建新的标签组件，已有 GTag、GChip、GBadge 的职责足以覆盖标签、筛选项和数值徽标。

## 状态、事件与实例

`checked` 或 `visible` 为 boolean 时受控。用户操作只发送请求，应用在事件中回写对应选项。设为 null 或移除该配置可退出受控；default 值只在首次初始化使用。更新尺寸、颜色等不会重置用户状态。

- `gardener:beforechange`：包含 checked、value、previous、reason；同步 `preventDefault()` 取消切换。
- `gardener:check` 与 `gardener:change`：checked、value、reason、controlled。一次选择各发送一次。
- `gardener:beforeclose`：visible=false、reason；同步 `preventDefault()` 取消关闭。
- `gardener:close`：visible=false、reason、controlled。关闭不触发选中切换。

Blazor Server 的异步 OnEvent 回调不能同步取消浏览器事件；采用受控 visible / checked，仅在业务条件通过时回写状态，或使用PreventDefaultEvents 参数（如 new[]{"beforeclose"}）。

`getInstance(element, 'tag')` 返回 check(value?, reason?)、close(reason?)、setOptions(patch)、getState()、refresh()、destroy()。setOptions 优先于属性 JSON；patch 字段 undefined 表示取消该覆盖并恢复属性值，清空模板 id 使用空字符串。无效属性更新保持最后有效状态；无效 setOptions 抛 TypeError。destroy 恢复原始内容、样式及属性并移除监听器。

模板中的内容应保持符合标签语义；复杂表单与嵌套操作使用专门容器组件。普通 CSS 用法不需要任何 JS，托管模式的状态、样式和事件由同一份 tag.js 提供给五端。
