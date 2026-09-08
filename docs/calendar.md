# GCalendar

GCalendar 通过 `data-display` 运行时与 `dataOptions` 配置提供月日历、全年日历、紧凑卡片、受控选择、事件内容及键盘交互。CSS、Vue、React、AngularJS、Blazor 共享实现。

参考：[Arco Design Vue Calendar](https://arco.design/vue/component/calendar)。对照本地 Arco 2.58.0 的月视图、年视图和卡片样式，保留 Gardener 的主题色、字体族与圆角。默认全尺寸日期行 100px，日期圆 28px，表头控件 28px；卡片宽 265px、日期圆 24px、日期行 36px。全年视图在宽屏显示四列，窄容器调整为两列或单列。

## 配置入口

纯 CSS/JS 使用 `.g-calendar[data-g-data-display]`，静态 JSON 写入 `data-g-data-options`。空内容的 GCalendar 默认展示当前月；已有手写内容则保留至显式配置。动态配置与函数回调通过 `getInstance(host, 'data-display').setOptions(options)` 注入；TypeScript 类型为 `GardenerimDataDisplayOptions`（从 `@gardenerim/css/runtime` 导入）。销毁恢复原始节点。

```js
import { init, getInstance } from '@gardenerim/css/runtime';
init(host);
const calendar = getInstance(host, 'data-display');
calendar.setOptions({
  defaultValue: '2026-09-07',
  headerType: 'select', dayStartOfWeek: 1,
  items: [{ id: 'review', date: '2026-09-10', label: '设计评审' }]
});
```

## 日期、模式与选择

| 参数 | 类型 / 默认值 | 行为 |
| --- | --- | --- |
| `modelValue` | `YYYY-MM-DD` / `Date` / `null` | 受控选中日期；`null` 清空，回调返回候选值，等待宿主回写 |
| `defaultValue` | 日期；默认本地今天 | 非受控初值，仅初始化使用 |
| `pageShowDate` | 日期 | 受控展示页；翻页不会修改选中值 |
| `defaultPageShowDate` | 日期；默认选中日期或今天 | 非受控展示页初值 |
| `date` | `YYYY-MM-DD` | 兼容旧版的展示日期，更新时跳页 |
| `mode` / `defaultMode` | `month` / `year`；默认 `month` | 分别为受控模式和初始模式 |
| `modes` | 非重复模式数组 | 完整日历默认显示月/年开关；卡片默认隐藏开关，点击标题进入月份选择 |
| `allowSelect` | `boolean`；`true` | 关闭后仍可浏览日期；不会触发选择 |
| `readOnly` | `boolean`；`false` | 与 `allowSelect: false` 相同 |
| `disabled` | `boolean`；`false` | 禁止选择、翻页与模式切换 |
| `selection` | `single` / `multiple` / `none` | 多日期模式通过 `selectedKeys` 初始化；`none` 只读 |
| `selectedKeys` | 日期数组 | 兼容已有数据组件的选中值；传入变更会更新选择 |
| `controlled` | `boolean`；`false` | 与 `selectedKeys` 配合启用受控多选 |
| `isWeek` | `boolean`；`false` | 高亮选中日期所在整周；值仍是点击日期，与多选互斥 |
| `dayStartOfWeek` | `0` / `1` 或对应字符串；`0` | 周日或周一；优先于旧参数 `weekStart` |
| `weekStart` | 整数 `0…6` | 保留旧版任意星期起始日能力 |
| `minDate` / `maxDate` | `YYYY-MM-DD` | 包含边界的可选范围；禁止翻到范围外的月/年 |
| `disabledDates` | 日期数组 | 禁止指定日期 |
| `disabledWeekdays` | `0…6` 数组 | 禁止某些星期，如周末 `[0,6]` |
| `disabledDate` | `(date: Date) => boolean` | JavaScript 自定义日期判断，`true` 表示不可选 |

日期字符串作为民用日期处理，不经过 `new Date('YYYY-MM-DD')` 的 UTC 到本地转换。JSON 配置应使用 `YYYY-MM-DD`；原生 `Date` 通过实例 `setOptions` 直接传递，读取本地年月日，不要将 `Date.toISOString()` 的时间戳当作民用日期。渲染回调接收本地中午的原生 `Date`，以避开常见夏令时午夜跳变；日期选择不是时间或时区选择器。支持年份 `0001…9999`，拒绝不存在的日期。

## 外观与内容

| 参数 | 类型 / 默认值 | 行为 |
| --- | --- | --- |
| `panel` | `boolean`；`false` | 紧凑卡片；全年模式显示 12 个月份选项 |
| `panelWidth` | 数字像素 `220…2400` 或 `px/rem/em/%`；`265` | 宽度受父容器限制，不强制横向溢出 |
| `panelOperations` | `left/right/double-left/double-right` 数组 | 卡片前后月/年前后按钮；空数组隐藏所有翻页按钮 |
| `panelTodayBtn` | `boolean`；`false` | 卡片底部今天按钮 |
| `headerType` | `button` / `select`；`button` | 标题或原生年/月下拉选择 |
| `showHeader` / `showToday` | `boolean`；`true` | 隐藏表头 / 完整日历今天按钮 |
| `bordered` | `boolean`；`true` | 外边框 |
| `size` | `small/medium/large` | `small` 日期行 72px，其余保持参考默认 100px；不改变卡片尺寸 |
| `calendarDayHeight` | 整数 `44…400` | 覆盖完整月视图日期行高 |
| `maxHeight` | 整数 `160…2400` | 保留通用数据配置的最大高度；内容可滚动且滚动区域可聚焦 |
| `showOutsideDays` | `boolean`；`true` | 完整月视图是否显示相邻月日期；全年缩略月始终只显示本月 |
| `locale` | BCP 47 字符串 | 本地化日期、月份和星期文字 |
| `label` | 字符串 | 每个日历网格的可访问名称前缀，多实例应使用不同名称 |
| `labels` | 字符串字典 | `month/year/view/left/right/double-left/double-right/more/retry`；`today/previous/next/loading` 可复用运行时语言包 |
| `items` / `rows` | 事件数组；`[]` | 每项需要唯一 `id`、`date` 或 `start`；可用 `end` 显示连续多天（包含结束日） |
| `rowKey` | 字符串；`id` | 自定义事件标识字段 |
| 事件内容 | `label/title/name`、`status` | 文本优先级依次如左；状态支持 `info/success/warning/danger` |
| `showCalendarEvents` | `boolean`；`true` | 显示或隐藏事件 |
| `maxEvents` | 整数 `0…20`；`3` | 每格事件上限；其余用数量提示，原生提示含完整文字 |
| `loading` / `error` | 布尔 / 字符串 | 加载占位与错误信息 |
| `load` | 异步或同步函数 | 接收 `{signal,pageShowDate,mode,filter,path}`，返回数组或 `{items}` |
| `serviceTimeout` | `0…600000` 毫秒；`60000` | `0` 关闭超时；新请求、取消或销毁中止旧请求 |

`dateRender(date, context)` 替换月视图日期内容；`dateInnerContent(date, context)` 保留日期圆并填充其下方内容；`monthRender(date)` 替换全年视图中的月份缩略日历；`headerRender(context)` 替换表头。回调可返回文字或 DOM 节点，字符串不会当 HTML 插入。日期按钮内应返回非交互内容，避免嵌套按钮/链接。

日期上下文为 `{date,selected,today,outside,disabled,events,mode}`。自定义表头上下文为 `{value,pageShowDate,mode,onChange,onChangePageDate,onChangeMode}`，三个操作入口经过相同的禁用与取消检查。不要直接修改控制器生成的日期节点。

## 事件和键盘

`gardener:beforechange` 可取消操作。`gardener:change` 和可选 `onChange(detail)` 返回 `reason`、`modelValue`、`keys/value/selectedKeys`、`date/pageShowDate`、`mode`。`onPanelChange` 仅接收翻月、换页和模式请求；原因分别为 `month/panel/mode`。选择原因 `select`，加载成功原因 `load`。受控模式下事件中的候选值需要由宿主回写，不会先改变内部状态。

`setOptions` 为增量更新；设为 `undefined` 移除选项。`default*` 仅初始化使用；`modelValue: null` 清空受控选择。JSON 属性变更会移除新 JSON 中不存在的旧配置。`getState()` 返回副本。实例还提供 `select`、`setDate`、`refresh`、`load`、`cancel`、`destroy`；旧通用数据接口中的 `move/scrollTo/exportCsv` 不适用于日历。

方向键移动焦点，Home/End 到本周首末，Page Up/Down 翻月，Shift + Page Up/Down 翻年，Enter/Space 选中。移动焦点不会改变选中日期；不可选日期会跳过。RTL 下左右键按视觉方向移动。网格含列标题、选中/禁用状态和单一日期 Tab 入口。

## 五端示例

Vue 与 React 使用同一配置内容：

```vue
<GCalendar :config="{ dataOptions: JSON.stringify(options) }"
  @gardener:change="event => handle(event.detail)" />
```

```tsx
<GCalendar config={{dataOptions: JSON.stringify(options)}}
  onValueChange={keys => setSelected((keys as string[])[0] ?? null)} />
```

AngularJS 用 `gardener-config`；受控值显式放在 options 中：

```html
<div g-calendar gardener-config="calendarConfig"
     gardener-on-value-change="selected = $value"></div>
```

```js
$scope.calendarConfig = {dataOptions: JSON.stringify(options)};
```

Blazor 保留同样的 JSON 命名，无需加载独立日期库：

```razor
<GCalendar Config="Config" EventNames="Events" OnEvent="Handle" />
@code {
  private readonly string[] Events = ["gardener:change"];
  private IReadOnlyDictionary<string, object?> Config =>
    new Dictionary<string, object?> {
      ["dataOptions"] = System.Text.Json.JsonSerializer.Serialize(new {
        defaultValue = "2026-09-07", panel = true,
        panelTodayBtn = true, dayStartOfWeek = 1
      })
    };
}
```

Blazor 自定义函数通过现有 JS interop 注入，.NET 回调使用 `OnEvent`，不能将 C# 委托序列化为 JSON 函数。Vue/React 的 VNode/JSX、Blazor RenderFragment 不是共享 DOM 渲染函数的返回类型。共享配置行为相同，不宣称兼容全部 Arco API；不提供 Arco 文档列举但当前实现未渲染的 `day/week` 模式，也不提供拖拽排期、循环事件或时区调度服务。

## 演示

- GardenerDemo：`?component=calendar#catalog`，9 组功能演示。
- CSS：[calendar.html](../packages/css/examples/calendar.html)。
- Blazor：示例项目 `/calendar`。
- 专项回归：`npm --prefix packages/css run test:calendar`。
