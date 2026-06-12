import { Archive, BarChart3, Brain, ClipboardCheck, MessageSquareText, ShieldCheck, Sparkles } from 'lucide-react';

const loopSteps = [
  { label: 'Human feedback', detail: 'Reviewer confirms, corrects or blocks an AI output.', Icon: MessageSquareText },
  { label: 'Confidence memory', detail: 'The decision, evidence gaps and corrections are stored.', Icon: Archive },
  { label: 'Pattern detection', detail: 'Repeated failures and trusted evidence patterns are identified.', Icon: Brain },
  { label: 'Calibration', detail: 'Templates, thresholds and rules improve future evaluations.', Icon: ShieldCheck },
];

const outcomes = [
  { label: 'Business value', value: 'Less blind trust', detail: 'Human review focuses on risky outputs first.', Icon: BarChart3 },
  { label: 'Governance value', value: 'Explainable decisions', detail: 'Every trust route can show evidence, rules and approver.', Icon: ClipboardCheck },
];

export default function LearningGovernanceOverview() {
  return (
    <div className="lg-overview">
      <section className="lg-hero">
        <span>Learning and governance</span>
        <h3>The system improves because every human decision becomes reusable confidence knowledge.</h3>
        <p>
          This layer turns one-time reviews into organizational memory: what was trusted, what failed,
          which evidence mattered and why a decision was approved.
        </p>
      </section>

      <section className="lg-system-map" aria-label="Learning and governance system map">
        <div className="lg-core">
          <Sparkles size={22} />
          <span>Confidence Memory</span>
          <strong>Reusable trust knowledge</strong>
          <p>Stores what was trusted, corrected, blocked and why.</p>
        </div>

        {loopSteps.map(({ label, detail, Icon }, index) => (
          <article key={label} className={`lg-orbit-card orbit-${index + 1}`}>
            <div className="lg-orbit-index">{String(index + 1).padStart(2, '0')}</div>
            <Icon size={18} />
            <strong>{label}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </section>

      <section className="lg-outcomes">
        {outcomes.map(({ label, value, detail, Icon }) => (
          <article key={label}>
            <Icon size={18} />
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
