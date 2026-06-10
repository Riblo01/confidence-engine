import { ArrowRight, Boxes, Brain, Gauge, Network, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const phases = [
  { label: 'Phase 1', title: 'Confidence scoring', Icon: Gauge, detail: 'Reusable scoring dimensions and verdicts.' },
  { label: 'Phase 2', title: 'Dynamic templates', Icon: SlidersHorizontal, detail: 'Configurable domain templates and downgrade rules.' },
  { label: 'Phase 3', title: 'Shared confidence memory', Icon: Boxes, detail: 'Historical decisions, patterns and calibration history.' },
  { label: 'Phase 4', title: 'Organizational learning', Icon: Brain, detail: 'Feedback-driven template evolution and best practices.' },
  { label: 'Phase 5', title: 'Multi-agent trust orchestration', Icon: Network, detail: 'Agreement, contradiction and provenance across agents.' },
  { label: 'Phase 6', title: 'Enterprise confidence operating system', Icon: ShieldCheck, detail: 'Governed trust decisions across AI-enabled workflows.' },
];

export default function FutureArchitectureRoadmap() {
  return (
    <div className="roadmap-shell">
      {phases.map(({ label, title, detail, Icon }, index) => (
        <div key={label} className="roadmap-phase-wrap">
          <article className="roadmap-phase">
            <div className="roadmap-phase-label">{label}</div>
            <Icon size={20} />
            <strong>{title}</strong>
            <p>{detail}</p>
          </article>
          {index < phases.length - 1 && <ArrowRight size={16} className="roadmap-arrow" />}
        </div>
      ))}
    </div>
  );
}
