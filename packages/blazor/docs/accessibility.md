# 无障碍、键盘与 SSR

组件保留全部原生 HTML 属性，因此 `role`、`aria-*`、`tabindex`、`disabled`、`required`、`autocomplete` 均可直接传入。默认按钮输出 `type="button"`，避免在表单中意外提交。应选择与语义一致的 `As` 标签并提供可见标签或 `aria-label`。

交互行为沿用 Gardenerim CSS runtime 的焦点管理、键盘导航、焦点圈、减少动画和高对比模式约定。服务端预渲染阶段只输出 HTML；JS 初始化在建立交互连接后重试。`DisposeAsync` 会清理 DOM 监听器。

项目浏览器门禁检查键盘可达性、可访问名称、焦点可见性、主题对比约定、触控视口和无 JS 初始渲染；应用仍需对真实业务内容做 WCAG 审计。

