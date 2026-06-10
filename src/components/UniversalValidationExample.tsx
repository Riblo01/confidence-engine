import { CheckCircle2, FileText, MessageSquareWarning, UserCheck } from 'lucide-react';
import { universalExample } from '../data/universalExample';

const statusTone: Record<string, string> = {
  validated: '#22c55e',
  contradiction: '#f97316',
  missing: '#ef4444',
};

export default function UniversalValidationExample() {
  return (
    <div className="uv-shell">
      <div className="uv-output-card">
        <div className="eyebrow">Generated output</div>
        <h3>{universalExample.title}</h3>
        <blockquote>{universalExample.generatedOutput}</blockquote>
        <p>{universalExample.sourceContext}</p>
      </div>

      <div className="uv-flow">
        {universalExample.flow.map((step, index) => (
          <div key={step} className="uv-flow-step">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <div className="uv-grid">
        <section className="uv-evidence">
          <div className="uv-section-title">
            <FileText size={16} />
            Evidence validation
          </div>
          {universalExample.evidence.map((item) => (
            <article key={item.label} className="uv-evidence-row">
              <span className="uv-dot" style={{ background: statusTone[item.status] }} />
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="uv-decision">
          <div className="uv-section-title">
            <MessageSquareWarning size={16} />
            Trust Decision
          </div>
          <div className="uv-score">{universalExample.decision.score}%</div>
          <h4>{universalExample.decision.label}</h4>
          <p>{universalExample.decision.reason}</p>
          <div className="uv-next">
            <UserCheck size={15} />
            {universalExample.decision.nextAction}
          </div>
        </section>
      </div>

      <div className="uv-feedback">
        <CheckCircle2 size={16} />
        Feedback recorded: reviewer confirmed the output was useful only after policy-sensitive wording was corrected.
      </div>
    </div>
  );
}
