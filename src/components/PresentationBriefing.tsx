import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Cpu,
  Route,
  ShieldCheck,
  Target,
} from 'lucide-react';

const sections = [
  {
    section: 'Background context',
    cover: 'AI outputs are acted on before trust is measured.',
    Icon: AlertTriangle,
    tone: 'risk',
  },
  {
    section: 'Current challenges',
    cover: 'No consistent evidence checks, routing or audit trail.',
    Icon: Route,
    tone: 'challenge',
  },
  {
    section: 'Solution',
    cover: 'A configurable trust layer before human action.',
    Icon: ShieldCheck,
    tone: 'solution',
  },
  {
    section: 'Expected outcomes',
    cover: 'Safer AI adoption and prioritized human review.',
    Icon: Target,
    tone: 'outcome',
  },
  {
    section: 'Technical approach',
    cover: 'React, TypeScript, templates, scoring and rules.',
    Icon: Cpu,
    tone: 'tech',
  },
  {
    section: 'Success criteria',
    cover: 'Coverage, prevented unsafe actions and calibration gain.',
    Icon: BarChart3,
    tone: 'success',
  },
];

export default function PresentationBriefing() {
  return (
    <div className="presentation-briefing">
      <section className="presentation-brief-hero">
        <span>Executive storyline</span>
        <strong>Trustworthy AI needs a decision layer, not just better generation.</strong>
        <p>Use this screen to explain the product in one minute before entering the interactive demo.</p>
      </section>

      <div className="presentation-grid">
        {sections.map((item, index) => (
          <article key={item.section} className={`presentation-section-card ${item.tone}`}>
            <div className="presentation-section-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="presentation-section-icon">
              <item.Icon size={18} />
            </div>
            <div>
              <h4>{item.section}</h4>
              <p>{item.cover}</p>
            </div>
            <CheckCircle2 size={16} />
          </article>
        ))}
      </div>
    </div>
  );
}
