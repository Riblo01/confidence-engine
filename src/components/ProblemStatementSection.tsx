import { AlertTriangle, Bot, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';

const flow = [
  { label: 'Incident', Icon: AlertTriangle, color: '#f97316' },
  { label: 'AI Investigation', Icon: Bot, color: '#3b82f6' },
  { label: 'Confidence Validation', Icon: CheckCircle2, color: '#14b8a6' },
  { label: 'Human Decision', Icon: UserCheck, color: '#22c55e' },
];

export default function ProblemStatementSection() {
  return (
    <div className="narrative-panel">
      <div className="max-w-4xl">
        <p className="text-lg leading-8 text-slate-200">
          Organizations increasingly rely on AI agents to investigate incidents and generate RCA reports.
          The open question is whether the RCA is correct, sufficiently evidenced, and safe to act on.
        </p>
        <p className="mt-4 text-base leading-7 text-slate-400">
          AI Confidence Engine acts as an independent validation layer before operational decisions are made.
          It evaluates the AI response instead of replacing the observability tools or generating a new RCA.
        </p>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        {flow.map(({ label, Icon, color }, index) => (
          <div key={label} className="flex items-center gap-3">
            <article className="flow-node">
              <div
                className="flow-icon"
                style={{ color, background: `${color}16`, borderColor: `${color}38` }}
              >
                <Icon size={20} />
              </div>
              <span>{label}</span>
            </article>
            {index < flow.length - 1 && <ArrowRight className="hidden lg:block text-slate-600" size={18} />}
          </div>
        ))}
      </div>
    </div>
  );
}
