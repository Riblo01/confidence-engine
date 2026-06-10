import { Activity, Gauge, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import type { MissionScenario } from '../types';

interface Props {
  scenarios: MissionScenario[];
}

export default function MissionControlSummary({ scenarios }: Props) {
  const trusted = scenarios.filter((s) => s.finalVerdict === 'Trusted').length;
  const review = scenarios.filter((s) => s.finalVerdict === 'Needs Human Review').length;
  const blocked = scenarios.filter((s) => s.decisionRoute === 'Blocked' || s.finalVerdict === 'Low Confidence').length;
  const average = scenarios.reduce((sum, s) => sum + s.finalScore, 0) / scenarios.length;

  return (
    <section className="mc-summary">
      <article>
        <Activity size={16} />
        <span>Total Evaluations</span>
        <strong>{scenarios.length}</strong>
      </article>
      <article className="trusted">
        <ShieldCheck size={16} />
        <span>Trusted</span>
        <strong>{trusted}</strong>
      </article>
      <article className="review">
        <ShieldAlert size={16} />
        <span>Needs Review</span>
        <strong>{review}</strong>
      </article>
      <article className="blocked">
        <ShieldX size={16} />
        <span>Blocked</span>
        <strong>{blocked}</strong>
      </article>
      <article>
        <Gauge size={16} />
        <span>Avg Confidence</span>
        <strong>{average.toFixed(1)}%</strong>
      </article>
      <article className="pilot">
        <span>Pilot Mode</span>
        <strong>Adaptive Calibration</strong>
      </article>
    </section>
  );
}
