import { motion } from 'framer-motion';
import { AlertTriangle, AlertOctagon, Info, AlertCircle } from 'lucide-react';
import type { MissionRisk } from '../types';

const SEV_META = {
  high:   { Icon: AlertOctagon,  color: '#ef4444', bg: '#ef444412' },
  medium: { Icon: AlertTriangle, color: '#f97316', bg: '#f9741612' },
  low:    { Icon: Info,          color: '#f59e0b', bg: '#f59e0b12' },
} as const;

interface Props {
  risks: MissionRisk[];
  contradictions: string[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function RiskDetectionPanel({ risks, contradictions }: Props) {
  return (
    <motion.div className="mc-risk-panel" initial="hidden" animate="show" variants={container}>
      <div className="mc-panel-header">Risk Detection</div>

      {risks.map((risk) => {
        const { Icon, color, bg } = SEV_META[risk.severity];
        return (
          <motion.div
            key={risk.id}
            className="mc-risk-card"
            style={{ background: bg, borderColor: `${color}40` }}
            variants={item}
          >
            <Icon size={14} color={color} />
            <span>{risk.label}</span>
            <span className="mc-risk-sev" style={{ color }}>{risk.severity.toUpperCase()}</span>
          </motion.div>
        );
      })}

      {contradictions.length > 0 && (
        <>
          <div className="mc-panel-subheader">
            <AlertCircle size={13} color="#f97316" /> Contradictions
          </div>
          {contradictions.map((c, i) => (
            <motion.div key={i} className="mc-contradiction-card" variants={item}>
              {c}
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );
}
