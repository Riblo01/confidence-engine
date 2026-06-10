import {
  ArrowRight,
  Brain,
  Database,
  GitBranch,
  History,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  BookOpenCheck,
  PackageCheck,
  Users,
} from 'lucide-react';
import { memoryCards } from '../data/sharedMemory';

const MEMORY_ICONS: Record<string, typeof Database> = {
  evaluation_history: History,
  human_feedback: MessageSquare,
  trusted_patterns: ShieldCheck,
  failure_patterns: ShieldAlert,
  template_evolution: GitBranch,
  multi_agent_conflicts: Users,
  calibration_history: Database,
  organizational_best_practices: BookOpenCheck,
  domain_knowledge_packs: PackageCheck,
};

const memoryFlow = [
  { label: 'Human Feedback', color: '#f59e0b' },
  { label: 'Shared Confidence Memory', color: '#8b5cf6' },
  { label: 'Adaptive Learning', color: '#3b82f6' },
  { label: 'Updated Templates', color: '#22c55e' },
];

export default function SharedMemoryPanel() {
  const groups = ['Operational Memory', 'Calibration Memory', 'Enterprise Knowledge'] as const;

  return (
    <div>
      <div className="memory-headline">
        The platform accumulates confidence knowledge across evaluations.
      </div>

      <div className="memory-group-stack">
        {groups.map((group) => (
          <section key={group} className="memory-group">
            <h3>{group}</h3>
            <div className="memory-grid">
              {memoryCards
                .filter((card) => (card.category ?? 'Operational Memory') === group)
                .map((card) => {
                  const Icon = MEMORY_ICONS[card.id] ?? Database;
                  return (
                    <article key={card.id} className="memory-card">
                      <div className="memory-card-head">
                        <Icon size={18} />
                        {card.name}
                      </div>
                      <dl>
                        <dt>Stores</dt>
                        <dd>{card.stores}</dd>
                        <dt>Informs</dt>
                        <dd>{card.informs}</dd>
                      </dl>
                      <div className="memory-example">{card.example}</div>
                    </article>
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {memoryFlow.map(({ label, color }, i) => (
          <div key={label} className="flex items-center gap-3">
            <article className="flow-node">
              <div
                className="flow-icon"
                style={{ color, background: `${color}16`, borderColor: `${color}38` }}
              >
                <Brain size={18} />
              </div>
              <span>{label}</span>
            </article>
            {i < memoryFlow.length - 1 && <ArrowRight size={16} className="text-slate-600" />}
          </div>
        ))}
      </div>
    </div>
  );
}
