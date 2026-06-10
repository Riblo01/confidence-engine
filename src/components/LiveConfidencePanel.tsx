import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon, ShieldCheck, ShieldAlert, ShieldX, Activity, AlertOctagon, Zap } from 'lucide-react';
import type { MissionState, MissionRiskLevel } from '../types';

interface Props {
  state: MissionState;
}

function AnimatedNumber({ value }: { value: number | null }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === null) return;
    const start = display;
    const end = value;
    const duration = 900;
    const startTime = Date.now();
    const frame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{value === null ? '—' : display}</>;
}

function ScoreRing({ score }: { score: number | null }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const fraction = score !== null ? Math.min(score / 100, 1) : 0;
  const dashOffset = circ * (1 - fraction);
  const color = score === null ? '#4b5563' : score >= 80 ? '#22c55e' : score >= 65 ? '#f59e0b' : '#ef4444';

  return (
    <svg viewBox="0 0 120 120" className="mc-score-ring">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#1f2937" strokeWidth="10" />
      <motion.circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: dashOffset }}
        initial={{ strokeDashoffset: circ }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }}
      />
      <text x="60" y="58" textAnchor="middle" className="mc-score-ring-value" fill={color}>
        {score !== null ? score : '—'}
      </text>
      <text x="60" y="74" textAnchor="middle" className="mc-score-ring-label" fill="#6b7280">
        {score !== null ? '/ 100' : 'pending'}
      </text>
    </svg>
  );
}

const RISK_COLORS: Record<MissionRiskLevel, string> = {
  none: '#6b7280',
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const VERDICT_META: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  'Trusted': { icon: ShieldCheck, color: '#22c55e', label: 'Trusted' },
  'Needs Human Review': { icon: ShieldAlert, color: '#f59e0b', label: 'Needs Review' },
  'Low Confidence': { icon: ShieldX, color: '#ef4444', label: 'Low Confidence' },
};

export default function LiveConfidencePanel({ state }: Props) {
  const score = state.confidenceScore ?? state.partialScore;
  const verdictMeta = state.verdict ? VERDICT_META[state.verdict] : null;
  const VerdictIcon = verdictMeta?.icon ?? ShieldAlert;

  return (
    <div className="mc-live-panel">
      <div className="mc-live-panel-header">
        <Activity size={15} />
        <span>Live Confidence</span>
      </div>

      {/* Score Ring */}
      <div className="mc-score-ring-wrap">
        <ScoreRing score={score} />
        {state.partialScore !== null && state.confidenceScore === null && (
          <div className="mc-score-partial-label">partial score</div>
        )}
      </div>

      {/* Verdict */}
      <AnimatePresence>
        {state.verdict ? (
          <motion.div
            className="mc-live-verdict"
            style={{ background: `${verdictMeta?.color}18`, borderColor: `${verdictMeta?.color}40`, color: verdictMeta?.color }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <VerdictIcon size={14} />
            <span>{verdictMeta?.label}</span>
          </motion.div>
        ) : (
          <div className="mc-live-verdict mc-live-verdict--pending">
            <span>Verdict pending</span>
          </div>
        )}
      </AnimatePresence>

      {/* Stats grid */}
      <div className="mc-live-stats">
        <div className="mc-live-stat">
          <span className="mc-live-stat-label">Evidence Coverage</span>
          <div className="mc-live-stat-bar-wrap">
            <motion.div
              className="mc-live-stat-bar"
              animate={{ width: state.evidenceCoverage !== null ? `${state.evidenceCoverage}%` : '0%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <span className="mc-live-stat-value">
            {state.evidenceCoverage !== null ? `${state.evidenceCoverage}%` : '—'}
          </span>
        </div>

        <div className="mc-live-stat">
          <span className="mc-live-stat-label">Contradictions Found</span>
          <motion.span
            className={`mc-live-stat-badge ${state.contradictionCount > 0 ? 'mc-live-stat-badge--warn' : ''}`}
            animate={{ scale: state.contradictionCount > 0 ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.4 }}
          >
            {state.contradictionCount}
          </motion.span>
        </div>

        <div className="mc-live-stat">
          <span className="mc-live-stat-label">Risk Level</span>
          <span
            className="mc-live-stat-risk"
            style={{ color: RISK_COLORS[state.riskLevel] }}
          >
            <Zap size={12} />
            {state.riskLevel === 'none' ? '—' : state.riskLevel.toUpperCase()}
          </span>
        </div>

        <div className="mc-live-stat">
          <span className="mc-live-stat-label">Confidence Score</span>
          <span className="mc-live-stat-num">
            <AnimatedNumber value={score} />
            {score !== null ? ' / 100' : ''}
          </span>
        </div>
      </div>

      {/* Recommended Action */}
      <AnimatePresence>
        {state.recommendedAction && (
          <motion.div
            className="mc-live-action"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mc-live-action-label">
              <AlertOctagon size={13} />
              Recommended Action
            </div>
            <p className="mc-live-action-text">{state.recommendedAction}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Memory updated indicator */}
      <AnimatePresence>
        {state.memoryUpdated && (
          <motion.div
            className="mc-live-memory-badge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✓ Learning memory updated
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
