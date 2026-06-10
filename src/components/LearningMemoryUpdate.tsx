import { motion } from 'framer-motion';
import { Brain, TrendingUp, TrendingDown } from 'lucide-react';
import type { MissionLearningUpdate } from '../types';

interface Props {
  updates: MissionLearningUpdate[];
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { duration: 0.35 } } };

function WeightBar({ value, max = 35 }: { value: number; max?: number }) {
  return (
    <div className="mc-memory-bar-track">
      <motion.div
        className="mc-memory-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  );
}

export default function LearningMemoryUpdate({ updates }: Props) {
  return (
    <motion.div className="mc-memory-panel" initial="hidden" animate="show" variants={container}>
      <div className="mc-panel-header">
        <Brain size={14} />
        Learning Memory Updated
      </div>
      <p className="mc-memory-intro">
        Human feedback was recorded. The following dimension weights have been adjusted for future evaluations:
      </p>

      {updates.map((u) => {
        const increased = u.after > u.before;
        const diff = u.after - u.before;
        const TrendIcon = increased ? TrendingUp : TrendingDown;
        const color = increased ? '#6366f1' : '#f59e0b';

        return (
          <motion.div key={u.dimension_id} className="mc-memory-row" variants={item}>
            <div className="mc-memory-row-header">
              <span className="mc-memory-dim-name">{u.dimension_name}</span>
              <span className="mc-memory-diff" style={{ color }}>
                <TrendIcon size={12} />
                {increased ? '+' : ''}{diff}pp
              </span>
            </div>

            <div className="mc-memory-bars">
              <div className="mc-memory-bar-label">Before</div>
              <WeightBar value={u.before} />
              <span className="mc-memory-bar-num">{u.before}%</span>
            </div>
            <div className="mc-memory-bars">
              <div className="mc-memory-bar-label">After</div>
              <WeightBar value={u.after} />
              <span className="mc-memory-bar-num mc-memory-bar-num--after" style={{ color }}>{u.after}%</span>
            </div>

            <p className="mc-memory-reason">{u.reason}</p>
          </motion.div>
        );
      })}

      <motion.div className="mc-memory-commit" variants={item}>
        ✓ Changes committed to Shared Confidence Memory
      </motion.div>
    </motion.div>
  );
}
