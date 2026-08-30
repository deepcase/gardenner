/** Bind Gardener title-bar controls to Tauri v2 without making Tauri a dependency. */
export function bindTauriWindowControls(root = document, injectedWindow = null) {
  const tauriWindow = injectedWindow
    ?? globalThis.__TAURI__?.window?.getCurrentWindow?.()
    ?? globalThis.__TAURI__?.window?.appWindow;
  if (!tauriWindow) return { available: false, destroy() {} };

  const controller = new AbortController();
  const actions = {
    minimize: () => tauriWindow.minimize?.(),
    maximize: async () => tauriWindow.toggleMaximize?.() ?? (await tauriWindow.isMaximized?.() ? tauriWindow.unmaximize?.() : tauriWindow.maximize?.()),
    close: () => tauriWindow.close?.(),
    drag: () => tauriWindow.startDragging?.()
  };

  root.addEventListener("click", (event) => {
    const control = event.target.closest?.("[data-g-window-action]");
    if (!control || !root.contains(control)) return;
    const action = actions[control.dataset.gWindowAction];
    if (action) void action();
  }, { signal: controller.signal });

  root.addEventListener("dblclick", (event) => {
    if (event.target.closest?.(".g-titlebar") && !event.target.closest?.(".g-no-drag,button,a,input,select,textarea")) void actions.maximize();
  }, { signal: controller.signal });

  return { available: true, destroy: () => controller.abort() };
}
