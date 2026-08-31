# 平台与构建入口

| 场景 | 样式入口 | 说明 |
| --- | --- | --- |
| 通用 Web/后台 | `platforms/gardener.web.min.css` | PC、响应式页面、CMS、Dashboard |
| 移动 Web/Hybrid | `platforms/gardener.mobile.min.css` | 触控尺寸、安全区、底部导航 |
| 桌面 WebView | `platforms/gardener.desktop.min.css` | 密集布局、窗口区域、快捷操作 |
| Tauri | `platforms/gardener.tauri.min.css` | 配合 `GardenerimTauriService` |
| Electron | `platforms/gardener.electron.min.css` | 配合 `GardenerimElectronService` |

也可按 28 个组件域加载 `components/*.min.css`，用于严格控制体积。桌面桥只使用宿主预加载层显式暴露的白名单对象，不启用 Node 全局访问。

