import type { MissionScenario } from '../types';

interface Props {
  scenarios: MissionScenario[];
}

export default function DecisionDistributionBar({ scenarios }: Props) {
  const total = scenarios.length || 1;
  const trusted = scenarios.filter((s) => s.finalVerdict === 'Trusted').length;
  const review = scenarios.filter((s) => s.finalVerdict === 'Needs Human Review').length;
  const blocked = scenarios.filter((s) => s.decisionRoute === 'Blocked' || s.finalVerdict === 'Low Confidence').length;

  return (
    <section className="mc-distribution">
      <div className="mc-distribution-head">
        <span>Decision Distribution</span>
        <strong>Trusted | Human Review | Blocked</strong>
      </div>
      <div className="mc-distribution-track" aria-label="Decision distribution">
        <i className="trusted" style={{ width: `${(trusted / total) * 100}%` }} />
        <i className="review" style={{ width: `${(review / total) * 100}%` }} />
        <i className="blocked" style={{ width: `${(blocked / total) * 100}%` }} />
      </div>
      <div className="mc-distribution-legend">
        <span><b className="trusted" />Trusted: {trusted}</span>
        <span><b className="review" />Needs Human Review: {review}</span>
        <span><b className="blocked" />Blocked: {blocked}</span>
      </div>
    </section>
  );
}
