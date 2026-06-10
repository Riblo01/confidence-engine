import { motion } from 'framer-motion';
import { CheckCircle2, HelpCircle, XCircle, AlertCircle } from 'lucide-react';
import type { MissionEvidenceSource } from '../types';

const STATUS_META = {
  validated: { icon: CheckCircle2, color: '#22c55e', label: 'Validated' },
  inferred:  { icon: HelpCircle,   color: '#f59e0b', label: 'Inferred'  },
  missing:   { icon: XCircle,      color: '#ef4444', label: 'Missing'   },
  contradiction: { icon: AlertCircle, color: '#f97316', label: 'Contradiction' },
} as const;

interface Props {
  sources: MissionEvidenceSource[];
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function EvidenceRevealPanel({ sources }: Props) {
  return (
    <motion.div className="mc-evidence-panel" initial="hidden" animate="show" variants={container}>
      <div className="mc-panel-header">Evidence Sources</div>
      <div className="mc-evidence-grid">
        {sources.map((src) => {
          const meta = STATUS_META[src.status];
          const Icon = meta.icon;
          return (
            <motion.div
              key={src.id}
              className="mc-evidence-chip"
              style={{ borderColor: `${meta.color}40`, background: `${meta.color}12` }}
              variants={item}
            >
              <Icon size={13} color={meta.color} />
              <span className="mc-evidence-chip-label">{src.label}</span>
              <span className="mc-evidence-chip-status" style={{ color: meta.color }}>
                {meta.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
