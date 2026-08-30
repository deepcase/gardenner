import { useState } from "react";
import { GAlert, GButton, GCard, GInput, GardenerProvider, componentCatalog } from "@gardenerim/react";

export function App() {
  const [name, setName] = useState("Gardener");
  const [valueEvents, setValueEvents] = useState(0);
  return (
    <GardenerProvider theme="garden" mode="light" shape="subtle" density="comfortable">
      <main className="g-container g-py-8" style={{ maxWidth: "54rem" }}>
        <header className="g-mb-6">
          <span className="g-badge">React 1.0.0 Stable</span>
          <h1 className="g-mt-3">Gardener React</h1>
          <p>506 个组件、66 种行为、Web / Mobile / Desktop / Tauri / Electron。</p>
        </header>
        <GAlert state="success">官方 React 适配层已加载。</GAlert>
        <GCard className="g-mt-5 g-p-5">
          <label className="g-label" htmlFor="react-name">名称</label>
          <GInput id="react-name" value={name} onValueChange={(value) => { setName(String(value ?? "")); setValueEvents((count) => count + 1); }} />
          <div className="g-flex g-gap-2 g-mt-4">
            <GButton variant="primary" onClick={() => setName("已保存")}>保存</GButton>
            <span className="g-badge" data-testid="value">{name}</span>
            <span className="g-badge" data-testid="value-events">{valueEvents}</span>
          </div>
        </GCard>
        <p className="g-mt-5" data-testid="catalog-count">{componentCatalog.length} components</p>
      </main>
    </GardenerProvider>
  );
}
