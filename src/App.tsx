import { useState } from 'react';
import AppHeader from './components/AppHeader';
import ProductExperience from './components/ProductExperience';

export default function App() {
  const [presentationMode, setPresentationMode] = useState(false);

  return (
    <div className={`app-shell ${presentationMode ? 'presentation-mode' : ''}`}>
      <AppHeader
        presentationMode={presentationMode}
        onTogglePresentation={() => setPresentationMode((prev) => !prev)}
      />
      <ProductExperience />
    </div>
  );
}
