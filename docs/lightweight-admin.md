# 后台最小样式接入

完整 CSS 用于全组件演示，不建议不加区分地成为所有业务应用的默认入口。原始全量包约 1 MB；应用的实际结果应以构建报告为准。

## npm / Vite

```ts
import '@gardenerim/css/core.min.css';
import '@gardenerim/css/component/basic.css';
import '@gardenerim/css/component/forms.css';
import '@gardenerim/css/component/data.css';
import '@gardenerim/css/component/feedback.css';
import '@gardenerim/css/component/navigation.css';
// 只有使用 g-flex、g-gap-* 等工具类时才添加工具类入口：
// import '@gardenerim/css/utilities.min.css';
// 只有需要切换额外预设主题时才添加主题入口：
// import '@gardenerim/css/themes.min.css';
```

只选用这些域内组件；例如页面使用其他组合组件时，需额外引入对应模块。适配器的 `component-css/*` 也支持同样的域拆分。不要再同时导入 `style.css` 或全量 `min.css`，否则失去减量效果。

更可靠的自动依赖闭包构建，在 Gardenerim 源码目录运行：

```sh
npm --prefix packages/css run build:custom -- --components button,card,input,select,table,dialog,data-grid --out dist/custom/admin
```

构建器根据组件契约选择样式包及依赖；它按组件域裁剪，并不是保证每条未使用规则都被删除。业务开发中新增组件后要同步更新列表。

## Blazor

在 `_content/Gardenerim.Blazor/` 下使用 `gardener.core.min.css` 加上述 `components/*.min.css`；不同时引用全量 `gardener.min.css`。发布仍需完整保留 RCL 静态资源映射。

## 验收

检查引入清单和生成体积，再检查页面、弹窗、深色主题、移动端和键盘操作。不能为消除告警直接提高性能预算；DataGrid 数据模式等明确新增能力的体积变化也应在变更说明中记录。
