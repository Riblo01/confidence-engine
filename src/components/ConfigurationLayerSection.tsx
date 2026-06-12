import type { ReactNode } from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

export default function ConfigurationLayerSection({ children }: Props) {
  return (
    <div className="layer-shell">
      <header className="layer-intro">
        <div className="layer-intro-icon">
          <SlidersHorizontal size={20} />
        </div>
        <div>
          <span>Configuration layer</span>
          <h3>Define how confidence is measured before runtime evaluation.</h3>
          <p>
            Choose a template, tune scoring dimensions, set decision thresholds and define the evidence
            required before an AI output can be trusted.
          </p>
        </div>
      </header>
      <div className="layer-workbench">{children}</div>
    </div>
  );
}
