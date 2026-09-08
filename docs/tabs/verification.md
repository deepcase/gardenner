# GTabs 验收记录

2026-09-08 · 通过。本次扩展已有 GTabs，没有增加重复组件。

## 完成内容

- 对齐 Arco Vue 2.58.0 的 line / card / card-gutter / text / rounded / capsule 六种类型与四档尺寸，提供四个位置、等宽、首项留白、内容隐藏、动画和滚动参数。
- 支持受控 / 非受控选中、点击 / 悬停、自动 / 手动键盘激活、RTL 和禁用项跳过。
- 新增 / 删除采用事件请求；支持不可关闭项、Delete 快捷键、取消切换与关闭、增加后自动切换。
- 提供延迟渲染、隐藏销毁、强制保留、标题 / 内容 / 附加区原生模板；同 key 参数更新和重排保留节点与输入内容。
- 修复 Vue / React / AngularJS / Blazor 配置更新重建实例、嵌套事件错误归属、关闭控件 ARIA 结构和 WebKit 模板深色文字问题。
- 更新五端共享运行时、类型、静态资源、GardenerDemo、Website 和文档。

## 验证结果

| 验证 | 结果 |
| --- | --- |
| Arco 对照 | 六类型 × 四尺寸，共 24 组；字号与字重一致，实测最大尺寸差 1px |
| CSS 专项 / 导航回归 | 21 + 25 = 46 项通过 |
| CSS schema / HTML / 构建 | 48 / 54 / 11 项通过，含包安装与可复现构建 |
| Vue / React / AngularJS | 149 / 97 / 85 项回归通过，各 3 项 schema 及类型检查通过 |
| Blazor | 构建零警告零错误；563 次 SSR、94 行为、104 事件等契约通过 |
| 三浏览器 | Chromium / Firefox / WebKit 的实际三框架交互、受控选中、增删请求、懒加载、销毁和滚动通过 |
| GardenerDemo | 15 场景，1440 / 768 / 390px，明暗主题，所测区域 Axe 无违规、无页面错误 |
| CSS / Website / Blazor 页面 | 切换类型、选中、新增、Delete / 图标删除通过 |
| 静态资源 | CSS 和 Blazor 的 CSS、runtime、tabs.js、导航包逐文件一致 |
| Website | 7 语言 / 14 页面 / 每个译文目录 3393 条消息；覆盖检查通过 |
| 固定包体预算 | 全部通过，调整依据及保留的原始发布基线见 budget-review.json |

[完整参数](../tabs.md) · [演示](http://127.0.0.1:4180/?component=tabs#catalog) · [机器记录](verification.json) · [检查日志](checks.json) · [Arco 测量](arco-measurements.json)

## 兼容边界

新能力通过 tabs-options JSON 使用；旧手写 DOM 和通用 navigation 模式保持兼容，不能混用配置模式。模板是原生 HTML / Gardener 行为，不是框架编译插槽。scrollPosition 支持 auto / center；异步审批由业务侧处理。组件包预算全部通过，Demo 保留已有大分块构建提示。本次为本地实现与验收，未发布 npm 包。
