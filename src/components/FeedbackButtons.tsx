import type { FeedbackType } from '../types';
import { ThumbsUp, ThumbsDown, GitPullRequest, CheckCircle, HelpCircle, FileWarning } from 'lucide-react';

interface Props {
  feedback: FeedbackType;
  onFeedback: (f: FeedbackType) => void;
  incidentId: string;
}

const options: {
  key: Exclude<FeedbackType, null>;
  label: string;
  Icon: typeof ThumbsUp;
  activeColor: string;
}[] = [
  { key: 'useful',            label: 'Useful',           Icon: ThumbsUp,       activeColor: '#22c55e' },
  { key: 'partially_useful',  label: 'Partially Useful', Icon: HelpCircle,     activeColor: '#3b82f6' },
  { key: 'incorrect',         label: 'Incorrect',        Icon: ThumbsDown,     activeColor: '#ef4444' },
  { key: 'missing_evidence',  label: 'Missing Evidence', Icon: FileWarning,    activeColor: '#f97316' },
  { key: 'needs_review',      label: 'Needs Review',     Icon: GitPullRequest, activeColor: '#f59e0b' },
];

export default function FeedbackButtons({ feedback, onFeedback, incidentId }: Props) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <CheckCircle size={14} color="#22c55e" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>RCA Feedback</span>
        <span className="ml-auto text-xs font-mono" style={{ color: '#6e7681' }}>{incidentId}</span>
      </div>
      <div className="p-4">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {options.map(({ key, label, Icon, activeColor }) => {
            const isActive = feedback === key;
            return (
              <button
                key={key}
                onClick={() => onFeedback(isActive ? null : key)}
                className="flex min-h-14 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all"
                style={{
                  background: isActive ? `${activeColor}22` : '#1c2128',
                  border: isActive ? `1px solid ${activeColor}66` : '1px solid #30363d',
                  color: isActive ? activeColor : '#8b949e',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
        {feedback && (
          <div className="mt-3 p-2.5 rounded text-xs" style={{ background: '#22c55e11', border: '1px solid #22c55e33', color: '#22c55e' }}>
            Feedback saved locally for demo purposes.
          </div>
        )}
      </div>
    </div>
  );
}
