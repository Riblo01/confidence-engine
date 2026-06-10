import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

const VERDICT_META = {
  'Trusted': {
    Icon: ShieldCheck,
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #052e1618 0%, #14532d18 100%)',
    border: '#22c55e40',
    description: 'The AI-generated output meets confidence thresholds and can proceed without mandatory human review.',
  },
  'Needs Human Review': {
    Icon: ShieldAlert,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #45260012 0%, #78350f18 100%)',
    border: '#f59e0b40',
    description: 'Confidence is insufficient for autonomous action. A human reviewer must validate before execution.',
  },
  'Low Confidence': {
    Icon: ShieldX,
    color: '#ef4444',
    bg: 'linear-gradient(135deg, #45060012 0%, #7f1d1d18 100%)',
    border: '#ef444440',
    description: 'Output quality is too low to trust. Do not act on this output without full re-evaluation.',
  },
};

interface Props {
  score: number;
  verdict: string;
  action: string;
}

export default function TrustDecisionCard({ score, verdict, action }: Props) {
  const meta = VERDICT_META[verdict as keyof typeof VERDICT_META] ?? VERDICT_META['Needs Human Review'];
  const { Icon, color, bg, border, description } = meta;

  return (
    <motion.div
      className="mc-trust-card"
      style={{ background: bg, borderColor: border }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
    >
      <div className="mc-trust-card-header">
        <Icon size={28} color={color} />
        <div>
          <div className="mc-trust-card-label" style={{ color }}>TRUST DECISION</div>
          <div className="mc-trust-card-verdict" style={{ color }}>{verdict}</div>
        </div>
        <motion.div
          className="mc-trust-card-score"
          style={{ color, borderColor: `${color}60` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
        >
          {score}
          <span className="mc-trust-card-score-denom">/100</span>
        </motion.div>
      </div>

      <p className="mc-trust-card-desc">{description}</p>

      <div className="mc-trust-card-action">
        <span className="mc-trust-card-action-label">Recommended Action</span>
        <p className="mc-trust-card-action-text">{action}</p>
      </div>
    </motion.div>
  );
}
