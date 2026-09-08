# 五端表单参数协议

Vue、React 使用 `config`；AngularJS 使用 `gardener-config`；Blazor 使用 `Config` 字典；纯 CSS/HTML 使用 `data-g-*`。这些入口生成同一组属性并调用共同运行时，不另写五份状态逻辑。静态尺寸与布局只需 CSS，禁用/只读联动、范围校验和字数计数需要初始化运行时。

## 尺寸与布局

| 配置键 | HTML 属性 | 值与行为 |
| --- | --- | --- |
| formSize | data-g-form-size | mini / small / medium / large，输入类控件高 24 / 28 / 32 / 36px，正文 12 / 14 / 14 / 14px；独立控件可用各端 variant/Variant 指定尺寸。 |
| formLayout | data-g-form-layout | vertical / horizontal / inline；在 GForm 直接子 GField 上应用标签、控件间距。 |
| formLabelAlign | data-g-form-label-align | start / end，逻辑方向，支持 RTL。 |
| formResponsive | data-g-form-responsive | true 时在 575.98px 以下转为纵向。省略或 false 保留指定布局。 |
| formDisabled | data-g-form-disabled | 禁用内部原生控件；恢复时保留调用者原本禁用的控件。 |
| formReadOnly | data-g-form-read-only | 文本只读；选择、开关等阻止修改但保留 FormData 中的值。 |

横向标签列宽使用 `--g-form-label-width`，默认 25%，也可给 `120px`。推荐结构为 GForm → GField → label.g-field-label + div.g-field-control。纵向字段底部间距 20px、标签与控件间距 8px；横向标签右侧间隔 16px。旧 horizontal-form、inline-form、compact-form 的布局类继续可用。

Textarea 使用原生 `rows`，默认 2 行，内边距 4px × 12px；原有 auto-resize 行为用于自动高度。Checkbox/Radio 控件 14px；Switch 普通 40×24、小号 28×16。Rating 用 `--g-rating-size` 指定星形尺寸，默认 24px、间隔 8px。开关 large、卡片选择、业务分组等是 Gardener 扩展，不把它们映射为 Arco 不存在的同名组件。

## 日期与时间范围

配置放在 GDateRangeGroup/GTimeRangeGroup 上；输入元素标记 `data-g-form-range-start`、`data-g-form-range-end`。

| 配置键 | 默认值 | 说明 |
| --- | --- | --- |
| formRange | false | 开启范围校验；基础组件不擅自添加业务约束。 |
| formAllowOvernight | false | type=time 的结束早于开始时允许跨午夜，时长加 1440 分钟。 |
| formRangeInclusive | false | type=date 的有效范围包含首尾，天数加 1。 |
| formRangeMinDuration | 0 | 最小时长，包含边界。 |
| formRangeMaxDuration | 无上限 | 最大时长，包含边界。 |
| formRangeMessage | 英文兜底消息 | 应提供业务语言的错误提示。 |

日期时长单位为天；time/datetime-local 为分钟。任一端为空时范围未完成，是否必填由原生 `required` 决定。范围错误写入结束输入的 `setCustomValidity` 与 `aria-invalid`，可以参与原生表单及 ValidationSummary 校验。`data-g-form-range-output` 接收有效时长；`data-g-form-range-error` 接收错误文本。原生 min/max/step/required 约束仍由浏览器执行。

`gardener:rangechange` 的 detail 包含 `value:[start,end]`、`start`、`end`、`duration`、`valid`、`complete`、`reason:'update'`。`valid` 表示范围约束，不代表整张表单通过所有原生校验。开关与约束更新后会重算；销毁或关闭范围校验后恢复已有自定义有效性信息。

## 字数与提交

GCharacterCounter 使用 `characterCount:40, characterHardLimit:true`；CSS 属性为 `data-g-character-count="40" data-g-character-hard-limit`。硬限制在输入事件捕获阶段完成，框架收到归一后的值；IME 组合输入等到 compositionend 才裁剪，避免打断中文输入。

GValidationSummary 使用 `validationMode:"live", validationPreventSubmit:true` 演示实时错误汇总、阻止无效提交及跳转字段。表单 `reset` 后，原生值和 field-sync 输出重新同步；受控框架组件应在 reset 回调恢复对应模型。自动保存、上传传输和最终提交接口由业务提供，演示不模拟后端成功。

## 五端写法

Vue：

```vue
<GForm :config="{ formSize:'medium', formLayout:'horizontal', formDisabled:disabled, formReadOnly:readonly }">
  <GField>
    <label class="g-field-label" for="name">姓名</label>
    <div class="g-field-control"><GInput id="name" v-model="name" name="name" required /></div>
  </GField>
</GForm>
```

React：

```tsx
<GForm config={{ formSize:'medium', formLayout:'horizontal', formDisabled:disabled, formReadOnly:readonly }}>
  <GField>
    <label className="g-field-label" htmlFor="name">姓名</label>
    <div className="g-field-control"><GInput id="name" value={name} onValueChange={setName} name="name" required /></div>
  </GField>
</GForm>
```

AngularJS（安装 Gardener 模块后）：

```html
<form g-form gardener-config="{formSize:'medium',formLayout:'horizontal',formDisabled:disabled,formReadOnly:readonly}">
  <div g-field>
    <label class="g-field-label" for="name">姓名</label>
    <div class="g-field-control"><input g-input id="name" ng-model="name" name="name" required></div>
  </div>
</form>
```

纯 HTML + CSS + 共享运行时：

```html
<form class="g-form" data-g-form-size="medium" data-g-form-layout="horizontal">
  <div class="g-field">
    <label class="g-field-label" for="name">姓名</label>
    <div class="g-field-control"><input class="g-input" id="name" name="name" required></div>
  </div>
</form>
```

```js
import { init, destroy } from '@gardenerim/css/runtime';
const form = document.querySelector('.g-form');
init(form);
form.setAttribute('data-g-form-disabled', 'true');
form.removeAttribute('data-g-form-disabled');
// 卸载页面时：destroy(form);
```

Blazor：

```razor
<GForm Config="FormOptions">
  <GField>
    <label class="g-field-label" for="name">姓名</label>
    <div class="g-field-control"><GInput id="name" @bind-Value="Name" name="name" required /></div>
  </GField>
</GForm>
@code {
  private object? Name;
  private bool Disabled;
  private bool ReadOnly;
  private IReadOnlyDictionary<string, object?> FormOptions => new Dictionary<string, object?> {
    ["formSize"] = "medium", ["formLayout"] = "horizontal",
    ["formDisabled"] = Disabled, ["formReadOnly"] = ReadOnly
  };
}
```

框架自动初始化与参数更新遵循各包既有 Provider/Runtime 安装方式。Blazor 的范围事件可用 `@bind-Value` 配合 `ValueEvent="rangechange" ValueKey="valid"` 接收有效性；完整可运行例子见 `packages/blazor/samples/Gardenerim.Blazor.Demo/Components/Pages/FormLab.razor`。

## 发布复查：布局与标签扩展

| 配置键 | 默认值 | 范围 / 作用 |
| --- | --- | --- |
| formFieldGap | 20 | 字段间距，0–80px |
| formLabelGap | 8 | 标签间距，0–80px |
| formColumnGap | 16 | 列间距，0–80px |
| formLabelWidth | 0 | 标签列宽，0–600px |
| formControlWidth | 0 | 控件宽度，0–1600px |
| formHelpVisible | true | 显示辅助说明 |
| formColon | false | 标签冒号 |
| formRequiredMark | none | 必填标记，none / auto |
| formRequiredPosition | end | 标记位置，start / end |

宽度为0表示自适应；numeric 配置会限制到允许范围。formFieldGap 控制字段的纵向间距，formLabelGap 控制纵向标签间距，formColumnGap 控制横向和行内布局间距。布局参数设置在 GForm 上，其他表单组件放入其字段结构即可继承。尺寸默认值仍为24/28/32/36px。静态页面可直接使用对应 --g-form-* CSS 变量；数据属性宽度与间距转换需要 init。formHelpVisible 只隐藏辅助说明，不隐藏错误信息；formRequiredMark=auto 根据 required 标记标签，不替代原生 required 验证。标签和字段必须正确关联。

Vue / React / AngularJS / Blazor 的 form 前缀配置统一保留 true 和 false。通过 null/undefined 或移除属性恢复默认值。校验摘要使用 validationMode=live/submit、validationShowValid、validationFocus、validationPreventSubmit；动态更新无需重建。原生重置后，字数计数、范围结果、自动高度和摘要在下一任务刷新，以等待浏览器先完成值恢复。

字数按 Unicode 字素计数（支持 Intl.Segmenter 的浏览器），避免把组合表情或中文输入法中间状态拆断；硬限制在 compositionend 生效。自动增高不指定 maxRows 时允许增长至默认224px；可用 minRows/maxRows/minHeight/maxHeight 调整。销毁恢复原有内联高度和滚动设置。

## 发布复查：模型、重置与降级输入

Vue `modelValue`、React `value`、AngularJS `ngModel`、Blazor `Value` 的程序更新会刷新字数、自动高度和范围展示；动态 form 配置保留行为实例。纯 HTML 在直接修改原生控件的 `value` 后调用 `Gardenerim.init(input)` 刷新这些派生视图，不需要伪造用户 input 事件。原生 reset 在浏览器完成默认重置后更新计数、高度与范围。

`type="time"` 在缺少原生时间控件的浏览器降级为文本时，仍按声明类型解析 HH:mm 或 HH:mm:ss；日期/本地日期时间采用严格日历校验，非法值显示范围错误，不接受25:61或2月30日。原生 min/max/step 等浏览器约束不在文本降级环境自动模拟，应配合业务校验。

分组容器使用 `formReadOnly`；必填条件放在实际控件的 `required` 上，不给普通 div/fieldset 添加 `aria-required` 或 `aria-readonly`。文件上传区作为 group 保留可聚焦的原生文件控件和浏览按钮，文件 input 需要明确的标签。

错误摘要优先使用显式错误配置或 `aria-errormessage`；`aria-describedby` 仅在引用错误类/错误角色节点时参与错误消息提取。普通说明文字保持辅助描述语义，不替代浏览器的必填、格式等校验消息。
