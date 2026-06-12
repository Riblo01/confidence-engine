import { useState } from 'react';
import AppHeader from './components/AppHeader';
import MissionControl from './components/MissionControl';
import ProductExperience from './components/ProductExperience';
import DeveloperDemo from './components/DeveloperDemo';

type View = 'mission' | 'explorer' | 'developers';

export default function App() {
  const [presentationMode, setPresentationMode] = useState(false);
  const [view, setView] = useState<View>('mission');

  // The developer portal is a full-bleed surface with its own chrome.
  if (view === 'developers') {
    return <DeveloperDemo onBack={() => setView('mission')} />;
  }

  return (
    <div className={`app-shell ${presentationMode ? 'presentation-mode' : ''}`}>
      <AppHeader
        presentationMode={presentationMode}
        explorerMode={view === 'explorer'}
        onTogglePresentation={() => setPresentationMode((prev) => !prev)}
        onToggleExplorer={() => setView((prev) => (prev === 'explorer' ? 'mission' : 'explorer'))}
        onOpenDevelopers={() => setView('developers')}
      />
      {view === 'explorer' ? (
        <ProductExperience />
      ) : (
        <MissionControl presentationMode={presentationMode} />
      )}
    </div>
  );
}
