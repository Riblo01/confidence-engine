import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Building2,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';

const positioningFlow = [
  { label: 'External systems generate.', Icon: Sparkles, color: '#9da7b3' },
  { label: 'Confidence Engine evaluates.', Icon: ShieldCheck, color: '#2dd4bf' },
  { label: 'Humans decide.', Icon: UserCheck, color: '#3b82f6' },
  { label: 'Organizations learn.', Icon: Building2, color: '#f59e0b' },
];

const researchSignals = [
  { label: 'Raw AI output', value: 'Fast but unverified', ref: 'Generated response', tone: 'risk' },
  { label: 'Evidence validation', value: 'Checks facts, gaps and contradictions', ref: 'Trust evaluation', tone: 'validated' },
  { label: 'Trust decision', value: 'Approve, review or block', ref: 'Action routing', tone: 'lift' },
];

export default function ProductPositioningScreen() {
  return (
    <div className="positioning-shell">
      <div className="positioning-problem">
        <div className="positioning-icon">
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="eyebrow">Problem</div>
          <h2>AI output is moving faster than organizational trust controls.</h2>
          <p>
            Teams increasingly rely on AI-generated incident analysis, code, security summaries,
            support responses and compliance reviews, but most workflows still lack a measurable way to
            decide whether those outputs are safe to act on.
          </p>
        </div>
      </div>

      <div className="positioning-research">
        <div className="positioning-research-head">
          <BookOpen size={16} />
          <div>
            <span>Why validation matters</span>
            <strong>AI-generated analysis is useful, but not sufficient on its own for operational decisions.</strong>
          </div>
        </div>
        <div className="positioning-research-grid">
          {researchSignals.map((item) => (
            <article key={item.label} className={`positioning-research-card ${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.ref}</small>
            </article>
          ))}
        </div>
        <p>
          The missing layer is not more generation. The missing layer is validation before action.
        </p>
      </div>

      <div className="positioning-solution">
        <div className="eyebrow">Solution</div>
        <h3>Confidence Engine acts as the configurable trust layer between AI generation and human execution.</h3>
        <div className="positioning-flow">
          {positioningFlow.map(({ label, Icon, color }, index) => (
            <div key={label} className="positioning-flow-wrap">
              <article className="positioning-flow-card">
                <div className="positioning-flow-icon" style={{ color, borderColor: `${color}55`, background: `${color}16` }}>
                  <Icon size={20} />
                </div>
                <span>{label}</span>
              </article>
              {index < positioningFlow.length - 1 && <ArrowRight size={17} className="positioning-arrow" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
