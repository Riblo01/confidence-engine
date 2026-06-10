import { Ban, CheckCircle2, ShieldAlert, UserCheck } from 'lucide-react';
import { trustDecisionOutcomes } from '../data/trustDecisions';

const toneIcon = {
  trusted: CheckCircle2,
  review: UserCheck,
  low: ShieldAlert,
  blocked: Ban,
};

export default function TrustDecisionCenter() {
  return (
    <div className="td-shell">
      <div className="td-intro">
        <h3>The product makes a decision, not just a score.</h3>
        <p>
          Each evaluated output resolves into an action state. The score is only one input; missing
          evidence, downgrade rules and contradictions determine what the organization should do next.
        </p>
      </div>

      <div className="td-grid">
        {trustDecisionOutcomes.map((outcome) => {
          const Icon = toneIcon[outcome.tone];
          return (
            <article key={outcome.id} className={`td-card ${outcome.tone}`}>
              <div className="td-card-head">
                <Icon size={20} />
                <div>
                  <strong>{outcome.label}</strong>
                  <span>{outcome.confidenceScore}% confidence</span>
                </div>
              </div>

              <dl className="td-detail-list">
                <dt>Triggered rules</dt>
                <dd>{outcome.triggeredRules.join('; ')}</dd>
                <dt>Missing evidence</dt>
                <dd>{outcome.missingEvidence.join('; ')}</dd>
                <dt>Contradictions detected</dt>
                <dd>{outcome.contradictionsDetected.join('; ')}</dd>
                <dt>Recommended next action</dt>
                <dd>{outcome.recommendedNextAction}</dd>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
