import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import type { MissionStepId } from '../types';
import { MISSION_STEPS } from '../data/missionScenarios';

interface Props {
  autoPlay: boolean;
  currentReadyStep: MissionStepId | undefined;
  allComplete: boolean;
  onToggleAutoPlay: () => void;
  onNext: () => void;
  onReset: () => void;
  completedCount: number;
}

export default function PresentationControls({
  autoPlay,
  currentReadyStep,
  allComplete,
  onToggleAutoPlay,
  onNext,
  onReset,
  completedCount,
}: Props) {
  const total = MISSION_STEPS.length;

  return (
    <motion.div
      className="mc-presentation-bar"
      initial={{ y: 60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mc-presentation-bar-progress">
        {MISSION_STEPS.map((_, i) => (
          <div
            key={i}
            className={`mc-presentation-pip ${i < completedCount ? 'mc-presentation-pip--done' : ''} ${i === completedCount ? 'mc-presentation-pip--active' : ''}`}
          />
        ))}
      </div>

      <div className="mc-presentation-bar-controls">
        <button className="mc-pres-btn" onClick={onReset} title="Reset demo">
          <RotateCcw size={15} />
          Reset
        </button>

        <button
          className={`mc-pres-btn mc-pres-btn--primary ${autoPlay ? 'mc-pres-btn--active' : ''}`}
          onClick={onToggleAutoPlay}
        >
          {autoPlay ? <Pause size={15} /> : <Play size={15} />}
          {autoPlay ? 'Pause' : 'Auto Play'}
        </button>

        <button
          className="mc-pres-btn"
          onClick={onNext}
          disabled={!currentReadyStep || allComplete}
        >
          <SkipForward size={15} />
          Next Step
        </button>

        <span className="mc-pres-counter">{completedCount} / {total}</span>
      </div>
    </motion.div>
  );
}
