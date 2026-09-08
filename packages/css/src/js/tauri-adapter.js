/** Bind Gardenerim title-bar controls to Tauri v2 without making Tauri a dependency. */
export function bindTauriWindowControls(root = document, injectedWindow = null) {
  const tauriWindow = injectedWindow
    ?? globalThis.__TAURI__?.window?.getCurrentWindow?.()
    ?? globalThis.__TAURI__?.window?.appWindow;
  if (!tauriWindow) return { available: false, execute: async () => { throw new Error("Desktop host unavailable"); }, destroy() {} };

  const controller = new AbortController();
  const actions = {
    minimize: () => tauriWindow.minimize?.(),
    maximize: async () => tauriWindow.toggleMaximize?.() ?? (await tauriWindow.isMaximized?.() ? tauriWindow.unmaximize?.() : tauriWindow.maximize?.()),
    close: () => tauriWindow.close?.(),
    drag: () => tauriWindow.startDragging?.()
  };

  root.addEventListener("click", (event) => {
    const control = event.target.closest?.("[data-g-window-action]");
    if (!control || !root.contains(control) || control.disabled || control.getAttribute("aria-disabled")==="true") return;
    const action = actions[control.dataset.gWindowAction];
    if (action) void action();
  }, { signal: controller.signal });

  root.addEventListener("dblclick", (event) => {
    if (!event.target.closest?.("[data-g-desktop-options]") && event.target.closest?.(".g-titlebar") && !event.target.closest?.(".g-no-drag,button,a,input,select,textarea")) void actions.maximize();
  }, { signal: controller.signal });

  async function execute(action){if(!['minimize','maximize','restore','close','drag'].includes(action))throw new Error('Unsupported window action');const method={minimize:'minimize',maximize:'maximize',restore:'unmaximize',close:'close',drag:'startDragging'}[action];if(typeof tauriWindow[method]!=='function')throw new Error('Window capability unavailable: '+action);return await tauriWindow[method]();}
  return { available: true, execute, destroy: () => controller.abort() };
}
