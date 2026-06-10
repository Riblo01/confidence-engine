import { motion } from 'framer-motion';
import {
  type LucideIcon,
  Play, FileText, CheckSquare, BarChart2, AlertTriangle,
  Percent, Shield, MessageSquare, Brain, Lock, Loader2, Check,
} from 'lucide-react';
import type { MissionStep, StepStatus } from '../types';

const ICON_MAP: Record<string, LucideIcon> = {
  Play, FileText, CheckSquare, BarChart2, AlertTriangle,
  Percent, Shield, MessageSquare, Brain,
};

interface Props {
  step: MissionStep;
  status: StepStatus;
  index: number;
  onClick: () => void;
}

export default function FlowNode({ step, status, index, onClick }: Props) {
  const Icon = ICON_MAP[step.iconName] ?? Play;
  const clickable = status === 'ready';

  return (
    <motion.button
      layout
      className={`mc-flow-node mc-flow-node--${status}`}
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      title={step.shortDescription}
      whileHover={clickable ? { scale: 1.06 } : {}}
      whileTap={clickable ? { scale: 0.97 } : {}}
    >
      <div className="mc-flow-node-index">{index + 1}</div>
      <div className="mc-flow-node-icon">
        {status === 'processing' ? (
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <Loader2 size={18} />
          </motion.div>
        ) : status === 'completed' ? (
          <Check size={18} />
        ) : status === 'locked' ? (
          <Lock size={16} />
        ) : (
          <Icon size={18} />
        )}
      </div>
      <span className="mc-flow-node-label">{step.shortLabel}</span>
    </motion.button>
  );
}
