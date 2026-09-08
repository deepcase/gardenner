# 展开收起组件

本次逐项检查扩展了 Accordion，新增 Collapse 与 ReadMore。三者共享 CSS 与 `accordion` 运行时，Vue、React、AngularJS、Blazor 从同一份组件目录生成，组件总数为 514。

| 组件 | 用途 | 变体 |
| --- | --- | --- |
| Accordion / GAccordion | FAQ、分组设置、嵌套内容 | borderless、card、separated、compact、comfortable、striped、icon-start、icon-none |
| Collapse / GCollapse | 高级筛选、附加信息、独立折叠区 | borderless、card、compact、comfortable、icon-start、icon-none |
| ReadMore / GReadMore | 评论、产品说明、摘要和全文 | card、compact、comfortable、inline、icon-none |

没有再创建 FAQ、筛选折叠等重复组件：它们由上述组件的参数和内容组合表达。

## 逐项检查结论

| 组件 | 原问题类型 | 完成内容 |
| --- | --- | --- |
| Accordion | 组件能力和演示均不足 | 补齐稳定 key、默认与受控值、多项／单项、取消守卫、禁用、动态结构、嵌套隔离、键盘与焦点管理；演示包含真实设置表单与嵌套面板 |
| Collapse | 缺少独立组件 | 新增单区域折叠组件与高级筛选演示；复用统一行为，保留表单内容；使用 `.g-collapse-panel` 避免与既有 `.g-collapse` 可见性工具类冲突 |
| ReadMore | 缺少独立组件 | 新增摘要与全文组件；摘要长度、行数、文案可配置，异步全文更新后同步摘要，完整内容保留链接和结构 |

适配层同步修复了布尔参数 `false` 丢失、配置更新导致实例重建和嵌套事件误更新外层模型的问题。演示中显式参数优先于变体，未选择参数时跟随变体，避免尺寸或图标控制被默认值覆盖。

## 共同参数

CSS 属性前缀为 `data-g-disclosure-`。Vue / React 使用 `config`，AngularJS 使用 `gardener-config`，Blazor 使用 `Config`。参数对象使用以下键；布尔值 `false` 在五端均保留，JSON 数组值应作为字符串传入。

| 参数键 | CSS 后缀 | 默认值及用途 |
| --- | --- | --- |
| disclosureMultiple | multiple | false；允许多项展开。兼容既有 `data-g-multiple="true"` |
| disclosureCollapsible | collapsible | true；false 时至少保留一项可用内容 |
| disclosureDefaultValue | default-value | 首次初始化的 key 数组 JSON 字符串；不提供则读取标题的 aria-expanded |
| disclosureValue | value | 不提供时内部管理；提供 JSON 字符串（例如 `[]`、`["settings"]`）时受控 |
| disclosureSize | size | small / medium / large，默认 medium |
| disclosureIcon | icon | start / end / none，默认 end |
| disclosureKeyboard | keyboard | true；是否启用方向键、Home、End 导航。Enter / Space 始终可用 |
| disclosureLines | lines | ReadMore 摘要行数，默认 3，范围 1–20 |
| disclosureLength | length | 自动摘要最大字符数，默认 180，范围 20–10000 |
| disclosureExpandLabel | expand-label | ReadMore 展开文案，默认随运行时语言 |
| disclosureCollapseLabel | collapse-label | ReadMore 收起文案，默认随运行时语言 |

每个触发器用 `data-g-disclosure-key` 设置稳定业务 key。不提供 key 时使用面板 ID；不提供 ID 时组件生成唯一关联 ID。显式受控参数优先于默认值。禁用使用原生按钮 disabled、aria-disabled 或根组件 state="disabled"。

精确比例：单行标题 small 32px、medium 40px、large 48px；正文 14px / 22px；触屏最小 44px。多行标题自适应高度，不裁切内容。CSS 变量 `--g-disclosure-padding`、`--g-disclosure-gap`、`--g-disclosure-header-height`、`--g-disclosure-radius` 可进一步覆盖。

## 五端使用

相同内容结构：触发器 `.g-disclosure-trigger`，内容 `.g-disclosure-panel`；Accordion 在 `.g-accordion-item` 内使用 `.g-accordion-trigger` 和 `.g-accordion-panel`。原生 button 推荐放在标题元素内。

```html
<section class="g-collapse-panel" data-g-accordion data-g-disclosure-size="small">
  <button type="button" class="g-disclosure-trigger" data-g-disclosure-key="settings">高级设置</button>
  <div class="g-disclosure-panel" hidden>这里可以放表单、链接和任意子组件。</div>
</section>
```

```vue
<GCollapse :config="{ disclosureSize:'small', disclosureCollapsible:false }">
  <button type="button" class="g-disclosure-trigger" data-g-disclosure-key="settings">高级设置</button>
  <div class="g-disclosure-panel" hidden>设置内容</div>
</GCollapse>
```

```tsx
<GCollapse config={{ disclosureSize:'small', disclosureCollapsible:false }}>
  <button type="button" className="g-disclosure-trigger" data-g-disclosure-key="settings">高级设置</button>
  <div className="g-disclosure-panel" hidden>设置内容</div>
</GCollapse>
```

```html
<g-collapse gardener-config="{disclosureSize:'small', disclosureCollapsible:false}">
  <button type="button" class="g-disclosure-trigger" data-g-disclosure-key="settings">高级设置</button>
  <div class="g-disclosure-panel" hidden>设置内容</div>
</g-collapse>
```

```razor
<GCollapse Config="Options">
  <button type="button" class="g-disclosure-trigger" data-g-disclosure-key="settings">高级设置</button>
  <div class="g-disclosure-panel" hidden>设置内容</div>
</GCollapse>
@code {
  private IReadOnlyDictionary<string,object?> Options =
    new Dictionary<string,object?> { ["disclosureSize"]="small", ["disclosureCollapsible"]=false };
}
```

## 状态、事件与生命周期

- `gardener:change` 返回 `keys`（目标 key 数组）、`trigger`、`expanded`、`reason`、`controlled`。受控模式下只请求改变，应用写回 `disclosureValue` 后更新。Vue 可用 modelKey="keys"，React 可用 valueKey="keys"，AngularJS 可用 gardener-value-key="keys"，Blazor 可用 ValueKey="keys" 接收目标值；**同时将该值 JSON 序列化写回 config**。
- `gardener:beforeopen` / `gardener:beforeclose` 可用 preventDefault 取消本次切换。嵌套实例的状态事件不会更新外层组件模型。
- `getInstance(root,'accordion')` 提供 `open(keyOrIndex)`、`close(keyOrIndex)`、`toggle(keyOrIndex)`、`value()`、`refresh()`、`destroy()`。省略 open / close 参数操作第一项。disabled 和“保留一项”约束同样约束 API。
- 动态添加、移除面板自动重新关联；无效 key 被忽略，单项模式保留第一个有效 key。默认值只用于初始化。
- 收起不会销毁 DOM，保留表单输入；关闭包含当前焦点的面板时恢复焦点到标题。收起区域不进入键盘顺序；打印显示完整内容。
- ReadMore 自动摘要为纯文本，异步更新全文后会重新生成摘要；完整区域保留结构、链接和交互。也可提供自定义 `.g-read-more-preview` 文本。默认保留展开按钮，避免仅因文本较短而丢失全文中的链接或其他内容。

## 演示与验证

- CSS：[三项完整示例](../../packages/css/examples/disclosure-compositions.html)。
- GardenerDemo：`http://127.0.0.1:4180/?component=disclosure#catalog`，可切换变体、尺寸、图标、状态管理、单项／多项、摘要长度和手机宽度。
- Blazor：演示应用 `/disclosure`，验证受控值、编辑内容与参数更新。
- 回归测试覆盖动态结构、受控状态、取消切换、禁用、嵌套隔离、焦点恢复、键盘与销毁；各适配器另有配置更新和内容保留测试。
- `npm run check:disclosure` 校验三组件的元数据、19 个变体、行为以及五端样式来源一致性，并对 CSS 与 Blazor 静态资源逐项比较 SHA-256。
- [五端一致性报告](./parity.json)；[反馈样式包预算变更依据](./budget-review.json)。新增样式归入已有 feedback 包，仅调整该包的固定上限，保留发布基线及其他产物预算。
- [本次完整验证记录](./verification.json)：运行时 188 项，Vue / React / AngularJS 分别 120 / 69 / 57 项，Blazor 514 个 SSR 与三个展开收起交互用例；整库桌面三引擎 153 项、移动端 58 项、无障碍 28 项通过。另完成 GardenerDemo 三引擎 54 个尺寸／主题场景、受控与禁用状态以及目录参数传播验证。

## GCollapse · Arco reference

GCollapse now also supports configured multi-panel content through `disclosureOptions`, including controlled active keys, accordion mode, left/right/custom icons, independent extra actions, templates, nested controllers and destroy-on-hide. See [the complete API and five-framework integration](../collapse.md) and [CSS examples](../../packages/css/examples/collapse.html). Traditional authored disclosure content remains supported.
