import { MonitorPlay, ShieldCheck, Zap, LayoutGrid, Code2 } from 'lucide-react';

const evaluates = [
  { label: 'Incident RCA',        color: '#3b82f6' },
  { label: 'Generated Code',      color: '#22c55e' },
  { label: 'SOC Analysis',        color: '#ef4444' },
  { label: 'Support Responses',   color: '#f59e0b' },
  { label: 'Compliance Reviews',  color: '#8b5cf6' },
  { label: 'Multi-agent Outputs', color: '#14b8a6' },
];

interface Props {
  presentationMode: boolean;
  explorerMode: boolean;
  onTogglePresentation: () => void;
  onToggleExplorer: () => void;
  onOpenDevelopers: () => void;
}

export default function AppHeader({
  presentationMode,
  explorerMode,
  onTogglePresentation,
  onToggleExplorer,
  onOpenDevelopers,
}: Props) {
  return (
    <header className="app-hero">
      <div className="max-w-screen-2xl mx-auto">
        <div className="app-hero-grid">
          <div className="app-hero-main">
            <div className="app-hero-mark">
              <ShieldCheck size={20} color="white" />
            </div>
            <div>
              <div className="eyebrow">Configurable trust layer for AI-generated outputs</div>
              <h1 className="app-hero-title">AI Confidence Engine</h1>
              <p className="app-hero-copy">
                External systems generate. Confidence Engine evaluates. Humans decide. The platform learns.
              </p>
            </div>
          </div>

          <div className="app-hero-side">
            {/* Mode tabs */}
            <div className="mc-mode-tabs">
              <button
                className={`mc-mode-tab ${!explorerMode ? 'mc-mode-tab--active' : ''}`}
                onClick={() => explorerMode && onToggleExplorer()}
              >
                <Zap size={13} />
                Mission Control
              </button>
              <button
                className={`mc-mode-tab ${explorerMode ? 'mc-mode-tab--active' : ''}`}
                onClick={() => !explorerMode && onToggleExplorer()}
              >
                <LayoutGrid size={13} />
                Platform Explorer
              </button>
            </div>

            <div className="app-hero-cta-row">
              <button
                className={`presentation-toggle ${presentationMode ? 'active' : ''}`}
                onClick={onTogglePresentation}
              >
                <MonitorPlay size={15} />
                {presentationMode ? 'Presentation On' : 'Presentation Mode'}
              </button>

              <button className="developers-entry" onClick={onOpenDevelopers}>
                <Code2 size={15} />
                For developers
              </button>
            </div>

            <div className="app-hero-tags">
              {evaluates.map((b) => (
                <span
                  key={b.label}
                  style={{ background: `${b.color}18`, color: b.color, border: `1px solid ${b.color}38` }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
