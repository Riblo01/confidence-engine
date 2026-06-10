import { useState } from 'react';
import AppHeader from './components/AppHeader';
import MissionControl from './components/MissionControl';
import ProductExperience from './components/ProductExperience';

export default function App() {
  const [presentationMode, setPresentationMode] = useState(false);
  const [explorerMode, setExplorerMode] = useState(false);

  return (
    <div className={`app-shell ${presentationMode ? 'presentation-mode' : ''}`}>
      <AppHeader
        presentationMode={presentationMode}
        explorerMode={explorerMode}
        onTogglePresentation={() => setPresentationMode((prev) => !prev)}
        onToggleExplorer={() => setExplorerMode((prev) => !prev)}
      />
      {explorerMode ? (
        <ProductExperience />
      ) : (
        <MissionControl presentationMode={presentationMode} />
      )}
    </div>
  );
}
