import { useState } from 'react';
import AppHeader from './components/AppHeader';
import MissionControl from './components/MissionControl';
import ProductExperience from './components/ProductExperience';

export default function App() {
  const [explorerMode, setExplorerMode] = useState(false);

  return (
    <div className="app-shell">
      <AppHeader
        explorerMode={explorerMode}
        onToggleExplorer={() => setExplorerMode((prev) => !prev)}
      />
      {explorerMode ? (
        <ProductExperience />
      ) : (
        <MissionControl />
      )}
    </div>
  );
}
