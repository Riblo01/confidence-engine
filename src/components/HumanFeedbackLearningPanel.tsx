import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  GitPullRequest,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

interface FeedbackOption {
  id: string;
  label: string;
  Icon: typeof ThumbsUp;
  color: string;
  affectedDimensions: string[];
  learningSignal: string;
}

const feedbackOptions: FeedbackOption[] = [
  {
    id: 'useful',
    label: 'Useful',
    Icon: ThumbsUp,
    color: '#22c55e',
    affectedDimensions: ['All enabled dimensions'],
    learningSignal: 'Confirms current weights and thresholds are calibrated for this use case.',
  },
  {
    id: 'partially_useful',
    label: 'Partially Useful',
    Icon: ThumbsUp,
    color: '#3b82f6',
    affectedDimensions: ['Completeness', 'Actionability'],
    learningSignal: 'Flags partial coverage — may tighten completeness requirements for this template.',
  },
  {
    id: 'incorrect',
    label: 'Incorrect',
    Icon: ThumbsDown,
    color: '#ef4444',
    affectedDimensions: ['Evidence Quality', 'Consistency'],
    learningSignal: 'High-priority signal: scoring passed an output humans rejected. Calibration review queued.',
  },
  {
    id: 'missing_evidence',
    label: 'Missing Evidence',
    Icon: FileWarning,
    color: '#f97316',
    affectedDimensions: ['Evidence Quality', 'Completeness'],
    learningSignal: 'Increase required evidence rules for this use case.',
  },
  {
    id: 'unsafe_recommendation',
    label: 'Unsafe Recommendation',
    Icon: ShieldAlert,
    color: '#dc2626',
    affectedDimensions: ['Actionability', 'Contradiction Risk'],
    learningSignal: 'May raise contradiction weight and lower the automatic-execution threshold.',
  },
  {
    id: 'needs_review',
    label: 'Needs Review',
    Icon: GitPullRequest,
    color: '#f59e0b',
    affectedDimensions: ['Contradiction Risk'],
    learningSignal: 'Borderline case logged — informs review-band tuning around the threshold.',
  },
];

export default function HumanFeedbackLearningPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = feedbackOptions.find((o) => o.id === selectedId) ?? null;

  return (
    <div>
      <p className="text-sm leading-6 text-slate-400 max-w-3xl">
        Every reviewer decision is captured as structured data — not free text. Each feedback label maps
        to specific scoring dimensions and produces a learning signal for template tuning.
      </p>

      <div className="fb-option-grid">
        {feedbackOptions.map(({ id, label, Icon, color }) => (
          <button
            key={id}
            className={`fb-option ${id === selectedId ? 'selected' : ''}`}
            style={id === selectedId ? { borderColor: `${color}80`, background: `${color}14` } : undefined}
            onClick={() => setSelectedId(id)}
          >
            <Icon size={15} style={{ color }} />
            {label}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="fb-result">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 size={16} className="text-green-400" />
            Feedback captured: {selected.label}
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
              Affected dimensions
            </div>
            <div>
              {selected.affectedDimensions.map((d) => (
                <span key={d} className="fb-dim-chip">{d}</span>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
              Potential learning signal
            </div>
            <p className="mt-1.5 text-sm leading-6 text-slate-300">{selected.learningSignal}</p>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-purple-300/90">
            <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
            Signals accumulate in Shared Confidence Memory; the adaptive pilot proposes template changes
            only when a pattern repeats across evaluations.
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-gray-700 px-4 py-6 text-center text-sm text-gray-500">
          Select a feedback option to see how it becomes structured learning data.
        </div>
      )}
    </div>
  );
}
