import { Boxes, Code2, Headphones, Layers, Scale, Shield, Workflow } from 'lucide-react';

const useCases = [
  {
    name: 'Kubernetes RCA',
    Icon: Boxes,
    color: '#3b82f6',
    output: 'Root Cause Analysis',
    evidence: 'Logs, metrics, traces, Kubernetes events',
    dimensions: 'Pattern match, telemetry coverage, deployment correlation',
    tag: 'Use Case 01 — live demo',
  },
  {
    name: 'Spec to Code',
    Icon: Code2,
    color: '#22c55e',
    output: 'Generated code',
    evidence: 'Spec, acceptance criteria, tests, lint, security scan',
    dimensions: 'Requirement coverage, test coverage, code quality, security risk',
  },
  {
    name: 'SOC Investigation',
    Icon: Shield,
    color: '#ef4444',
    output: 'Threat analysis',
    evidence: 'SIEM, IOCs, endpoint logs, network telemetry',
    dimensions: 'IOC confidence, false positive risk, threat severity',
  },
  {
    name: 'Customer Support',
    Icon: Headphones,
    color: '#f59e0b',
    output: 'Suggested response',
    evidence: 'Ticket history, knowledge base, policy docs',
    dimensions: 'Intent match, resolution accuracy, tone, policy compliance',
  },
  {
    name: 'Compliance Review',
    Icon: Scale,
    color: '#8b5cf6',
    output: 'Compliance assessment',
    evidence: 'Regulations, internal policy, citations, audit trail',
    dimensions: 'Citation quality, regulatory alignment, auditability',
  },
  {
    name: 'Multi-agent Workflow',
    Icon: Workflow,
    color: '#14b8a6',
    output: 'Final consolidated answer',
    evidence: 'Subagent outputs, task plan, review comments, tool results',
    dimensions: 'Agent agreement, inter-agent contradiction, traceability',
  },
];

export default function UseCaseExpansionPanel() {
  return (
    <div>
      <div className="uc-grid">
        {useCases.map(({ name, Icon, color, output, evidence, dimensions, tag }) => (
          <article key={name} className="uc-card">
            <div className="uc-card-head">
              <div
                className="uc-icon"
                style={{ color, background: `${color}14`, border: `1px solid ${color}38` }}
              >
                <Icon size={18} />
              </div>
              <div>
                <div className="uc-name">{name}</div>
                {tag && <div className="text-[10px] font-bold text-blue-400 mt-0.5">{tag}</div>}
              </div>
            </div>
            <dl className="space-y-2 mt-1">
              <div className="uc-row">
                <dt>Output</dt>
                <dd>{output}</dd>
              </div>
              <div className="uc-row">
                <dt>Evidence</dt>
                <dd>{evidence}</dd>
              </div>
              <div className="uc-row">
                <dt>Extra dimensions</dt>
                <dd>{dimensions}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-teal-500/25 bg-teal-500/5 px-4 py-3 text-sm text-teal-300">
        <Layers size={16} className="mt-0.5 flex-shrink-0" />
        <span>
          <strong>The core stays the same. Templates change by use case.</strong> Adding a new use case
          means writing a new evaluation template — never rebuilding the core product.
        </span>
      </div>
    </div>
  );
}
