import { ClipboardCheck, History, Scale, UserCheck } from 'lucide-react';
import { governanceAudit } from '../data/governanceAudit';

function historyPoints(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 44 - ((value - min) / range) * 34;
      return `${x},${y}`;
    })
    .join(' ');
}

export default function GovernanceAuditTrail() {
  return (
    <div className="ga-shell">
      <section className="ga-decision">
        <div className="ga-title">
          <Scale size={18} />
          Decision record {governanceAudit.decisionId}
        </div>
        <h3>{governanceAudit.decision}</h3>
        <div className="ga-score">{governanceAudit.score}%</div>
        <p>{governanceAudit.whyDecisionWasMade}</p>
        <div className="ga-approver">
          <UserCheck size={15} />
          Approved by: {governanceAudit.approver}
        </div>
      </section>

      <section className="ga-grid">
        <article className="ga-panel">
          <h4>Dimension contribution</h4>
          {governanceAudit.dimensions.map((dimension) => (
            <div key={dimension.label} className="ga-dimension">
              <span>{dimension.label}</span>
              <strong>{dimension.value}%</strong>
              <p>{dimension.contribution}</p>
            </div>
          ))}
        </article>

        <article className="ga-panel">
          <h4>Evidence and rules</h4>
          <ul>
            {governanceAudit.evidenceUsed.map((item) => (
              <li key={item}><ClipboardCheck size={13} />{item}</li>
            ))}
          </ul>
          <div className="ga-rule-list">
            {governanceAudit.triggeredRules.map((rule) => (
              <span key={rule}>{rule}</span>
            ))}
          </div>
        </article>

        <article className="ga-panel">
          <h4>Historical confidence evolution</h4>
          <svg viewBox="0 0 100 50" className="ga-history">
            <polyline points={historyPoints(governanceAudit.confidenceHistory)} />
          </svg>
          <div className="ga-final-action">
            <History size={14} />
            {governanceAudit.finalAction}
          </div>
        </article>
      </section>
    </div>
  );
}
