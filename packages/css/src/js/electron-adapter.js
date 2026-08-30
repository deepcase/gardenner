/** Bind to a narrow, context-isolated Electron preload API (never Node integration). */
export function bindElectronWindowControls(root = document, injectedBridge = null) {
  const bridge = injectedBridge ?? globalThis.gardenerDesktop;
  if (!bridge) return { available: false, destroy() {} };
  const allowed = new Set(["minimize", "maximize", "close", "drag"]);
  const controller = new AbortController();

  root.addEventListener("click", (event) => {
    const control = event.target.closest?.("[data-g-window-action]");
    if (!control || !root.contains(control)) return;
    const action = control.dataset.gWindowAction;
    if (!allowed.has(action)) return;
    if (typeof bridge[action] === "function") bridge[action]();
    else if (typeof bridge.windowAction === "function") bridge.windowAction(action);
  }, { signal: controller.signal });

  return { available: true, destroy: () => controller.abort() };
}

/* Recommended preload shape:
contextBridge.exposeInMainWorld("gardenerDesktop", {
  windowAction: (action) => ipcRenderer.send("gardener:window-action", action)
});
*/
