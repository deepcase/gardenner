# Arco 对照与 Gardenerim 组件

参考 Arco Design Vue 2.58.0 的 74 个顶层组件导出，检查 Gardenerim 现有职责覆盖，复用已有组件，补充缺少的 12 个组件。完整对应关系见 [74 项清单](coverage.md)；机器可读结果见 [coverage.json](coverage.json)。名称不同的等价组合不代表支持完全相同的 Arco 属性、插槽或事件。

保留 Gardenerim 的主题变量、语义色、字体、圆角与焦点样式，不引入 Arco CSS，也不要求应用安装 Arco。新增表单控件高度为 mini 24、small 28、medium 32、large 36 px。默认 14 px 正文，支持深浅主题和窄屏。

| 新增组件 | 常用参数与功能 |
| --- | --- |
| GInputNumber | value/defaultValue、min/max、step、precision、controls、allowClear、formatter/parser；小数步进、上下键、空值、表单提交与重置 |
| GInputTag | value/defaultValue、maxTagCount、separator、allowDuplicates、allowClear；Enter 分隔、粘贴、退格、删除、输入法保护 |
| GColorPicker | value/defaultValue、alpha、presets；原生色板、HEX 手工输入、透明度、预设色 |
| GAffix | offsetTop/offsetBottom；在最近滚动容器中吸附，发出固定状态变化 |
| GResizeBox | width/height、defaultWidth/defaultHeight、四项最小/最大尺寸、resizeDirections；鼠标/触控拖动、方向键、Shift、Home/End |
| GScrollbar | width/height/maxHeight、label；原生滚动、键盘、scrollTo、滚动位置事件 |
| GSpace | gap/rowGap/columnGap、direction、align、justify、wrap、block；保留业务子节点 |
| GWatermark | content/image、rotation、opacity、fontSize、tileWidth/tileHeight；重复文字或图片，允许选择、点击原内容 |
| GOverflowList | items、maxVisible、collapseFrom、gap；按容器宽度折叠到 More，支持链接、禁用项、键盘与 Escape |
| GLink | href、target、underline、tone、disabled；禁用移除跳转，外链 noopener |
| GTypography | text、level、ellipsis、copyable、tone；标题、截断展开、复制，也可传入原始内容 |
| GIcon | icon、iconSize、label、spin、tone；文本符号或应用传入的 SVG，语义图标与装饰图标 |

## 公共约定

组件自动注册 `foundation` 行为。CSS 使用 `data-g-foundation` 和组件根类，框架使用生成的具名组件。所有框架通过 `foundation-options` JSON 共用相同配置。

- `size`: mini / small / medium / large，默认 medium。尺寸直接影响表单控件；其他组件由各自布局参数控制。
- `disabled` / `readOnly`: 默认 false，禁止相关值变更；readOnly 保留输入聚焦。
- `label`: 控件可访问名称；同页多个滚动区域应分别命名。
- `name`: 表单隐藏字段名称，数字/颜色为字符串，标签为 JSON 数组。
- `value`: 受控值。事件提供建议的新值，父应用更新 value 后才显示新值。省略 value 为非受控；defaultValue 只负责首次配置和表单 reset。
- `tone`: normal / primary / success / warning / danger / muted。
- 数字、颜色、标签都提供禁用、只读和清除能力。数字空值为 null，标签空值为 []，颜色清除为黑色。
- 配置变更保留当前非受控值；无效 JSON、枚举、尺寸、重复 key 或不安全 URL 触发 error，保留最后有效配置。

`gardener:beforechange` 可以 preventDefault 阻止操作；`gardener:change` 包含 component、reason、value、controlled；值输入包含 previousValue，调整容器包含 width/height。`gardener:error` 提供 reason/message。框架事件桥与原生自定义事件使用相同 payload。

## CSS / JavaScript

```html
<div id="quantity" class="g-input-number" data-g-foundation
  data-g-foundation-options='{"defaultValue":1,"min":0,"max":99,"step":0.5,"label":"数量"}'></div>
```

```js
import { init, getInstance } from '@gardenerim/css/runtime';
init(document);
const quantity = document.querySelector('#quantity');
const controller = getInstance(quantity, 'foundation');
controller.setOptions({ precision: 2 });
quantity.addEventListener('gardener:change', event => console.log(event.detail.value));
// 函数不能写入 JSON；初始化后通过实例安装。
controller.setOptions({ formatter: value => `¥${value}`, parser: text => Number(text.replace('¥', '')) });
```

实例还提供 getState、refresh、value、increment/decrement、add/remove、resize、focus、scrollTo、destroy。仅适用当前组件的方法会执行，其余返回 false。销毁恢复原有子节点与属性，清理监听和观察器。setOptions 返回当前状态，已销毁时返回 false，无效参数抛出 TypeError；属性配置的无效输入通过 error 事件报告。

## Vue

```vue
<script setup>
import { ref, computed } from 'vue';
import { GInputNumber } from '@gardenerim/vue';
const value = ref(2);
const config = computed(() => ({ 'foundation-options': JSON.stringify({ value: value.value, min: 0, step: .5, label: '数量' }) }));
</script>
<template><GInputNumber :config="config" @gardener:change="value = $event.detail.value" /></template>
```

## React

```jsx
import { useState } from 'react';
import { GInputNumber } from '@gardenerim/react';
function Quantity() {
  const [value, setValue] = useState(2);
  return <GInputNumber config={{ 'foundation-options': JSON.stringify({ value, min: 0, label: '数量' }) }}
    onValueChange={next => setValue(next)} />;
}
```

## AngularJS

```html
<div g-input-number gardener-config="quantityConfig" gardener-on-value-change="quantity = $value"></div>
```

```js
$scope.quantityConfig = { 'foundation-options': JSON.stringify({ defaultValue: 2, min: 0, label: '数量' }) };
// gardener-on-value-change 在 AngularJS digest 中处理回传值。
```

## Blazor

```razor
<GInputNumber Config="Config" EventNames="@(new[]{"change"})" OnEvent="Handle" />
@code {
  private IReadOnlyDictionary<string, object?> Config => new Dictionary<string, object?> {
    ["foundation-options"] = System.Text.Json.JsonSerializer.Serialize(new { defaultValue = 2, min = 0, label = "数量" })
  };
  private void Handle(Gardenerim.Blazor.Models.GardenerimEventArgs e) { /* e.Detail */ }
}
```

真实运行示例：CSS [arco-foundations.html](../../packages/css/examples/arco-foundations.html)，Blazor sample `/foundations`，GardenerDemo `?component=input-number#catalog` 等 12 页，每页包含参数实验室、变体、受控或业务组合与参数示例。

## 与 Arco 的取舍

- 对照采用功能职责和现有组件组合，不提供一套同名的 Arco 兼容层。已有 Table、Tree、Calendar 等保留 Gardenerim API；具体能力以对应组件文档为准。
- Affix 使用 CSS sticky，受最近滚动祖先和容器边界约束，不支持 Arco 的任意 targetContainer 重挂载。Scrollbar 保留浏览器原生滚动条，不模拟一套拖动轨道。
- ColorPicker 使用系统色板 + HEX / Alpha / presets，不提供 Arco 的 HSV 编辑面板。Icon 是可访问图标容器，不捆绑 Arco 图标库。
- ResizeBox 的显式 width/height 各自受控；父容器 max-width 仍可限制实际可见宽度。OverflowList 是最多 1000 个数据项的响应式列表，不是虚拟列表。
- 水印是视觉提示，不能防止截图、复制或开发者工具修改。Typography 复制依赖浏览器 Clipboard API；不可用时发出 error。
- Message/Notification 复用 toast 和 notification-center；toast 新增四个角位置和 topLeft/topRight/bottomLeft/bottomRight 别名，保留 Gardenerim 的队列、操作和关闭能力。

## 验证证据

自动验证覆盖新增组件的生命周期、参数校验、受控状态、输入法、小数、拖动、键盘、框架配置更新、无障碍与主题/窄屏。检查记录在本目录 checks.json、各浏览器 JSON 和 runtime.log 中。74 项对应清单是能力映射，不等于此次逐项重写了全部组件，也不等于对所有业务场景作出发布认证。

本轮结果：74 项映射，12 个新增组件，575 项总目录；三个前端适配器单元测试分别为 Vue 150、React 98、AngularJS 86，全量 CSS 运行时回归 1,118 项通过，最后补充的 foundation 专项 20 项通过。Chromium、Firefox、WebKit 的三框架真实页面与 Demo 的 48 个场景均通过交互、深浅主题、1200/390 px 和 Axe 检查；Blazor、原生 CSS、官网 iframe 的交互与静态资产一致性通过。完整构建、Schema、类型、HTML、包预算与官网 7 语言覆盖检查见日志。
