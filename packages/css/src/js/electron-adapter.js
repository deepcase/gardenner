/** Bind to a narrow, context-isolated Electron preload API (never Node integration). */
export function bindElectronWindowControls(root = document, injectedBridge = null) {
  const bridge = injectedBridge ?? globalThis.gardenerDesktop;
  if (!bridge) return { available: false, execute: async () => { throw new Error("Desktop host unavailable"); }, destroy() {} };
  const allowed = new Set(["minimize", "maximize", "close", "drag"]);
  const controller = new AbortController();

  root.addEventListener("click", (event) => {
    const control = event.target.closest?.("[data-g-window-action]");
    if (!control || !root.contains(control) || control.disabled || control.getAttribute("aria-disabled")==="true") return;
    const action = control.dataset.gWindowAction;
    if (!allowed.has(action)) return;
    if (typeof bridge[action] === "function") bridge[action]();
    else if (typeof bridge.windowAction === "function") bridge.windowAction(action);
  }, { signal: controller.signal });

  async function execute(action){if(!['minimize','maximize','restore','close','drag'].includes(action))throw new Error('Unsupported window action');if(typeof bridge[action]==='function')return await bridge[action]();if(typeof bridge.windowAction==='function')return await bridge.windowAction(action);throw new Error('Window capability unavailable: '+action);}
  return { available: true, execute, destroy: () => controller.abort() };
}

/* Recommended preload shape:
contextBridge.exposeInMainWorld("gardenerDesktop", {
  windowAction: (action) => ipcRenderer.send("gardener:window-action", action)
});
*/
