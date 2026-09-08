# GStatistic 数值统计

参考 [Arco Design Vue Statistic / Countdown](https://arco.design/vue/component/statistic)，本地对照版本 2.58.0。GStatistic 是独立数据展示组件；原有 GStatList、GMetricCard 保留为布局组合。

[GardenerDemo](http://127.0.0.1:4180/?component=statistic#catalog) · [CSS 示例](../packages/css/examples/statistic.html) · [Blazor 示例](http://127.0.0.1:5192/statistic) · [验收记录](statistic/verification.md)

## 参数

五端都通过 data-options JSON 使用相同配置。CSS 属性为 data-g-data-options；Vue / React 为 config；AngularJS 为 gardener-config；Blazor 为 Config。TypeScript 类型为 @gardenerim/css/runtime 的 GardenerimStatisticOptions。

| 参数 | 默认 | 含义 |
| --- | --- | --- |
| value | 未设置 | number、十进制数字字符串；日期模式支持 ISO 字符串或毫秒时间戳。JS setOptions 可传 Date |
| title / extra | 无 | 标题与附加说明 |
| prefix / suffix | 无 | 数值前后缀，如 ¥、% 和单位；占位、加载或失败时隐藏 |
| precision | 0 | 小数位数，0–20，十进制四舍五入，半数向远离零的方向舍入 |
| showGroupSeparator | false | 启用地区千分位分组 |
| separator / decimalSeparator | 地区默认 | 自定义分组分隔符与小数点 |
| locale | en-US | 数字分组地区，支持 en-IN 等分组规则；无效地区回退 en-US |
| mode | number | number / date / countdown；倒计时对应 Arco Statistic.Countdown |
| format | HH:mm:ss | 日期或倒计时格式，方括号内容为原样文字 |
| timeZone | 本地时区 | 日期模式支持 UTC 或 IANA 时区 |
| now | 当前时间 | 倒计时可提供服务器当前时间，用本地经过时间校准 |
| start | true | 开始 / 暂停；倒计时暂停后恢复会追上真实目标时间 |
| animation | false | 数字变化动画，仅有限且安全的 number 数值插值 |
| animationDuration | 2000 | 动画毫秒数，0–600000；0 表示立即显示目标值 |
| valueFrom | 初次为 0 | 显式起始数字；未提供时，后续变化从当前显示值过渡 |
| placeholder | — | 缺失、非法值的占位文本，0 是有效数值 |
| loading / loadingText | false / Loading… | 加载状态与文案 |
| error | 无 | 失败提示文本 |
| size | medium | small / medium / large；也支持对应组件 variant |
| maxHeight | 无 | 数据展示通用最大高度，160–2400px |
| align | start | start / center / end，兼容 RTL |
| tone | default | default / success / warning / danger |
| valueStyle | 无 | 数值区 CSS 属性对象；长度必须带单位，如 32px；支持 CSS 变量 |
| label / live | 无 / off | 可访问名称；静态数字可设置 polite，动画及倒计时自动关闭重复播报 |
| titleTemplate / extraTemplate / prefixTemplate / suffixTemplate | 无 | HTML template 元素 id，支持图标或富文本；参数更新保留模板节点 |
| formatter | 无 | 通过 JS 实例 setOptions 提供的纯文本格式化函数，不能放入 JSON |

默认标题 14px、数值 26px / 500、前后缀 14px，行高 1.5715，标题和附加说明各间隔 8px。small / large 数值分别为 22px / 32px。颜色使用 Gardener 主题变量，支持明暗主题。长数字在自身区域滚动，溢出区域可通过键盘访问。

日期支持 YYYY、MM、DD、HH、mm、ss、SSS；倒计时支持 D、H、m、s、S（重复字符补零），缺省较大单位会累加至已显示单位，例如没有 D 时 HH 可以超过 24。示例：DD[ 天 ]HH:mm:ss。日期输入请使用明确 ISO 或时间戳，跨时区页面建议显式设置 timeZone。

数字字符串用于保留超出 Number 安全整数范围的位数；已作为 JS number 丢失的精度无法恢复。字符串不做插值动画；最终舍入使用十进制字符与 BigInt，避免 1.005 等常见二进制误差。非法值、非有限数、空值不会显示 NaN 或 Invalid Date。

## 五端用法

共享配置：

```js
const options = { title: '本月收入', value: 26842.75, precision: 2, showGroupSeparator: true, prefix: '¥' };
const config = { 'data-options': JSON.stringify(options) };
```

CSS：

```html
<div id="revenue" class="g-statistic" data-g-data-display></div>
<script type="module">
import { init } from '@gardenerim/css/runtime';
const root = document.getElementById('revenue');
root.setAttribute('data-g-data-options', JSON.stringify({title:'本月收入',value:26842.75,precision:2}));
init(root);
</script>
```

Vue：

```vue
<GStatistic :config="config" />
```

React：

```tsx
<GStatistic config={config} />
```

AngularJS：

```html
<div g-statistic gardener-config="config"></div>
```

Blazor：

```razor
<GStatistic Config="Config" />
@code {
  private IReadOnlyDictionary<string,object?> Config => new Dictionary<string,object?> {
    ["data-options"] = System.Text.Json.JsonSerializer.Serialize(new {title="本月收入",value=26842.75,precision=2})
  };
}
```

## 倒计时、事件与模板

```js
const countdown = {mode:'countdown',value:Date.now()+60000,format:'HH:mm:ss',start:true};
root.addEventListener('gardener:complete', event => {
  if (event.target === root && event.detail.reason === 'countdown') console.log('计时结束');
});
```

实际运行的数值动画与倒计时完成时发出 gardener:complete，detail 为 component: statistic、reason: animation 或 countdown、value: 原始目标值。同一倒计时目标只触发一次；修改目标可以开始新周期。Blazor 使用 EventNames 与 OnEvent；具体实现见 StatisticLab.razor。

getInstance(root, 'data-display') 提供 setOptions、getState、refresh、cancel、destroy。getState 包含 value、displayValue、running、remaining。cancel 暂停，setOptions({start:true}) 恢复。setOptions 的配置优先于 JSON 属性；使用 undefined 移除对应覆盖。卸载取消计时器、动画帧、观察器并还原原始节点。

模板示例：在组件外放置一个 HTML template，其 id 传给 prefixTemplate 等参数。模板内容仅在模板 id 改变时重建，其他参数更新保留输入和节点。Vue 等框架中可在 mounted 后用 template.innerHTML 创建模板，再挂载统计组件。模板为静态 HTML / Gardener 行为，不是框架编译插槽；需要动态内容时更新普通参数或使用宿主侧组合。所有普通文字与 formatter 返回值均作为文本，不解释 HTML。

## 与 Arco 的边界

共享 JSON 协议不是 Arco 直接替换 API。倒计时通过 mode 提供，不增加单独的 GCountdown 导出；完成通知使用 Gardener 事件。日期格式提供上述明确 token 集合，不包含 Day.js 插件格式。十进制字符串、可靠暂停、加载/错误、地区格式为本组件扩展。减少动态效果偏好、动画时长为 0 或字符串数值会跳过数值动画，直接显示目标值，不发动画完成事件。倒计时只是展示，支付到期、订单状态等业务判断应使用服务端结果。
