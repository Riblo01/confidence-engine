import {
  Bot,
  Boxes,
  Code2,
  FileJson,
  Headphones,
  Scale,
  Shield,
  ShieldCheck,
  Workflow,
} from 'lucide-react';

const domains = [
  { label: 'Kubernetes RCA', detail: 'Operational evidence', Icon: Boxes, color: '#3b82f6' },
  { label: 'Generated code', detail: 'Specs, tests, scans', Icon: Code2, color: '#22c55e' },
  { label: 'SOC analysis', detail: 'SIEM, IOCs, telemetry', Icon: Shield, color: '#ef4444' },
  { label: 'Support response', detail: 'Tickets, KB, policy', Icon: Headphones, color: '#f59e0b' },
  { label: 'Compliance review', detail: 'Citations and audit', Icon: Scale, color: '#8b5cf6' },
  { label: 'Multi-agent output', detail: 'Agreement and conflicts', Icon: Workflow, color: '#14b8a6' },
];

const proofCards = [
  {
    label: 'Integration contract',
    value: 'One JSON in',
    detail: 'Agents keep generating. Confidence Engine receives output, context, evidence and policy.',
    Icon: FileJson,
  },
  {
    label: 'Decision output',
    value: 'One route out',
    detail: 'Trusted, needs review, low confidence or blocked with evidence and reason.',
    Icon: ShieldCheck,
  },
  {
    label: 'Advanced validation',
    value: 'Agent consensus',
    detail: 'Investigator, analyst and reviewer outputs can be compared for agreement and contradiction.',
    Icon: Bot,
  },
];

export default function ProofUseCasesOverview() {
  return (
    <div className="proof-shell">
      <section className="proof-hero">
        <span>Proof and use cases</span>
        <h3>Same engine. Different templates. Different evidence.</h3>
        <p>
          This section proves that Confidence Engine is not a Kubernetes-only demo. The core trust
          pattern stays stable while each domain changes its evidence and scoring rules.
        </p>
      </section>

      <section className="proof-hub" aria-label="Proof use case engine map">
        <div className="proof-hub-center">
          <ShieldCheck size={24} />
          <span>Confidence Engine</span>
          <strong>One trust core</strong>
          <p>Templates adapt. Evidence changes. The decision layer stays consistent.</p>
        </div>

        {domains.map(({ label, detail, Icon, color }, index) => (
          <article key={label} className={`proof-domain-card domain-${index + 1}`}>
            <div className="proof-domain-icon" style={{ color, borderColor: `${color}42`, background: `${color}18` }}>
              <Icon size={19} />
            </div>
            <strong>{label}</strong>
            <span>{detail}</span>
          </article>
        ))}
      </section>

      <section className="proof-card-grid" aria-label="Proof details">
        {proofCards.map(({ label, value, detail, Icon }) => (
          <article key={label} className="proof-card">
            <Icon size={19} />
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
