# Security policy

仅支持当前的 1.x 稳定线。报告漏洞时请勿公开利用细节；应向维护者提供受影响版本、最小复现、影响范围和建议修复。Gardenerim.Blazor 不读取任意 Electron/Tauri 全局对象，仅绑定宿主明确暴露的 `__GARDENER_ELECTRON__` 与 `__GARDENER_TAURI__` 白名单桥。调用 `InvokeBehaviorAsync` 时，行为名、成员名和参数必须来自可信应用代码，不能直接转发不可信输入。
