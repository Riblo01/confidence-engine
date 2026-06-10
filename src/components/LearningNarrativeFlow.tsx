import type { CSSProperties } from 'react';
import { Brain, Database, GitBranch, MessageSquare, SlidersHorizontal } from 'lucide-react';

const learningSteps = [
  {
    label: 'Human Feedback',
    detail: 'Reviewer marks output useful, incomplete, incorrect or unsafe.',
    Icon: MessageSquare,
    color: '#f59e0b',
  },
  {
    label: 'Confidence Memory',
    detail: 'Decision, evidence gaps and reviewer corrections are stored.',
    Icon: Database,
    color: '#8b5cf6',
  },
  {
    label: 'Pattern Extraction',
    detail: 'Repeated mistakes and trusted evidence patterns are detected.',
    Icon: Brain,
    color: '#3b82f6',
  },
  {
    label: 'Template Evolution',
    detail: 'Rules, thresholds, evidence requirements and weights evolve.',
    Icon: SlidersHorizontal,
    color: '#14b8a6',
  },
  {
    label: 'Future Evaluations',
    detail: 'Similar outputs are evaluated with better calibrated criteria.',
    Icon: GitBranch,
    color: '#22c55e',
  },
];

export default function LearningNarrativeFlow() {
  return (
    <div className="ln-shell">
      {learningSteps.map(({ label, detail, Icon, color }, index) => (
        <article key={label} className="ln-step" style={{ '--ln-color': color } as CSSProperties}>
          <span className="ln-index">{String(index + 1).padStart(2, '0')}</span>
          <div className="ln-icon">
            <Icon size={18} />
          </div>
          <strong>{label}</strong>
          <p>{detail}</p>
        </article>
      ))}
    </div>
  );
}
