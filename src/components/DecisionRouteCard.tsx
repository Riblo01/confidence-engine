import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import type { MissionScenario } from '../types';

interface Props {
  scenario: MissionScenario;
  selected: boolean;
  onSelect: (id: string) => void;
}

const verdictMeta = {
  Trusted: { Icon: ShieldCheck, className: 'trusted', label: 'Trusted' },
  'Needs Human Review': { Icon: ShieldAlert, className: 'review', label: 'Needs Human Review' },
  'Low Confidence': { Icon: ShieldX, className: 'blocked', label: 'Blocked' },
};

export default function DecisionRouteCard({ scenario, selected, onSelect }: Props) {
  const meta = verdictMeta[scenario.finalVerdict];
  const Icon = meta.Icon;

  return (
    <motion.button
      className={`mc-route-card ${meta.className} ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(scenario.id)}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mc-route-card-top">
        <span>{scenario.useCaseName}</span>
        <strong>{scenario.finalScore}</strong>
      </div>
      <div className={`mc-route-badge ${meta.className}`}>
        <Icon size={13} />
        {meta.label}
      </div>
      <h3>{scenario.generatedOutputType}</h3>
      <p>{scenario.mainReason}</p>
      <dl>
        <dt>Decision route</dt>
        <dd>{scenario.decisionRoute}</dd>
        <dt>Key risk</dt>
        <dd>{scenario.keyRisk}</dd>
        <dt>Evidence status</dt>
        <dd>{scenario.evidenceStatus}</dd>
      </dl>
      <div className="mc-route-next">
        <span>{scenario.recommendedAction}</span>
        <ArrowRight size={14} />
      </div>
    </motion.button>
  );
}
