import type { Incident, ConfidenceResult } from '../types';
import { CheckCircle2, Layers, GitCompareArrows, ClipboardCheck, ArrowRight } from 'lucide-react';

interface Props {
  incident: Incident;
  result: ConfidenceResult;
}

const coverageItems = ['Logs analyzed', 'Metrics analyzed', 'Traces analyzed', 'Kubernetes events analyzed'];

export default function ConfidenceEnginePipeline({ incident, result }: Props) {
  const validated = incident.evidence_items.filter((item) => item.status === 'validated').length;
  const inferred = incident.evidence_items.filter((item) => item.status === 'inferred').length;
  const missing = incident.evidence_items.filter((item) => item.status === 'missing').length;
  const matched = incident.scoring_inputs.pattern_matched_signals.filter((signal) => signal.matched).length;
  const totalSignals = incident.scoring_inputs.pattern_matched_signals.length;

  const steps = [
    {
      label: 'Evidence Validation',
      Icon: CheckCircle2,
      color: '#22c55e',
      body: `${validated} validated, ${inferred} inferred, ${missing} missing`,
      metric: `${Math.round((validated / incident.evidence_items.length) * 100)}%`,
    },
    {
      label: 'Pattern Matching',
      Icon: Layers,
      color: '#8b5cf6',
      body: incident.scoring_inputs.pattern_matched,
      metric: `${incident.scoring_inputs.pattern_similarity}%`,
    },
    {
      label: 'Consistency Validation',
      Icon: GitCompareArrows,
      color: '#3b82f6',
      body: 'Symptoms, findings and root cause evaluated as one chain',
      metric: `${result.rca_consistency}%`,
    },
    {
      label: 'Completeness Validation',
      Icon: ClipboardCheck,
      color: '#f59e0b',
      body: `${matched}/${totalSignals} operational signals matched`,
      metric: `${result.operational_completeness}%`,
    },
  ];

  return (
    <div className="narrative-panel">
      <div className="pipeline-grid">
        {steps.map(({ label, Icon, color, body, metric }, index) => (
          <div key={label} className="pipeline-step-wrap">
            <article className="pipeline-step">
              <div className="flex items-center justify-between gap-3">
                <div className="pipeline-icon" style={{ color, background: `${color}16`, borderColor: `${color}38` }}>
                  <Icon size={18} />
                </div>
                <span className="pipeline-metric" style={{ color }}>{metric}</span>
              </div>
              <h3>{label}</h3>
              <p>{body}</p>
            </article>
            {index < steps.length - 1 && <ArrowRight className="hidden xl:block text-slate-600" size={18} />}
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {coverageItems.map((item) => (
          <div key={item} className="coverage-chip">
            <CheckCircle2 size={14} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
