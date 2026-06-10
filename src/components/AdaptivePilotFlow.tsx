import {
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  FileStack,
  MessageSquare,
  Settings2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { AdaptivePilot, EvaluationTemplate } from '../types';

interface Props {
  pilot: AdaptivePilot;
  workingTemplate: EvaluationTemplate;
  pilotApplied: boolean;
  canApplyPilot: boolean;
  onApplySuggestion: () => void;
}

const pilotFlow = [
  { label: 'Baseline Template', Icon: FileStack, color: '#9da7b3' },
  { label: 'Pilot Evaluations', Icon: BarChart3, color: '#3b82f6' },
  { label: 'Human Feedback', Icon: MessageSquare, color: '#f59e0b' },
  { label: 'Dimension Performance', Icon: TrendingUp, color: '#8b5cf6' },
  { label: 'Suggested Adjustments', Icon: Settings2, color: '#14b8a6' },
  { label: 'Template v2', Icon: Sparkles, color: '#22c55e' },
];

export default function AdaptivePilotFlow({
  pilot,
  workingTemplate,
  pilotApplied,
  canApplyPilot,
  onApplySuggestion,
}: Props) {
  return (
    <div>
      <div className="flex items-start gap-3 rounded-lg border border-blue-500/25 bg-blue-500/5 px-4 py-3 text-sm text-blue-300 max-w-3xl">
        <Brain size={16} className="mt-0.5 flex-shrink-0" />
        <span>
          Adaptive learning does <strong>not</strong> retrain an LLM. It improves scoring weights,
          thresholds, required evidence, downgrade rules, template definitions and review routing —
          all auditable configuration, not model weights.
        </span>
      </div>

      {/* Flow */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5">
        {pilotFlow.map(({ label, Icon, color }, i) => (
          <div key={label} className="flex items-center gap-2.5">
            <article className="flow-node">
              <div
                className="flow-icon"
                style={{ color, background: `${color}16`, borderColor: `${color}38` }}
              >
                <Icon size={17} />
              </div>
              <span>{label}</span>
            </article>
            {i < pilotFlow.length - 1 && <ArrowRight size={15} className="text-slate-600" />}
          </div>
        ))}
      </div>

      {/* Feedback outcomes */}
      <div className="mt-7">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-3">
          Pilot signals · {pilot.evaluations_run} evaluations on {pilot.baseline_template_id}
        </div>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {pilot.feedback_outcomes.map((o) => (
            <div key={o.feedback} className="rounded-lg border border-gray-800 bg-gray-900/40 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-200">{o.feedback}</span>
                <span className="font-mono text-sm font-extrabold text-blue-400">{o.count}</span>
              </div>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{o.signal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Before/after adjustments */}
      <div className="mt-7">
        <div className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 mb-1">
          Suggested weight adjustments
        </div>
        <div className="pilot-diff">
          {pilot.adjustments.map((a) => {
            const current = workingTemplate.dimensions.find((d) => d.id === a.dimension_id);
            const applied = current?.weight === a.after;
            return (
              <div key={a.dimension_id} className="pilot-diff-row">
                <div>
                  <div className="pilot-diff-name flex items-center gap-2">
                    {a.dimension_name}
                    {applied && <CheckCircle2 size={13} className="text-green-400" />}
                  </div>
                  <div className="pilot-diff-reason">{a.reason}</div>
                </div>
                <span className="pilot-diff-before">{a.before}%</span>
                <span className="pilot-diff-arrow">→</span>
                <span className="pilot-diff-after">{a.after}%</span>
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-400 max-w-3xl">{pilot.explanation}</p>

        <div className="mt-4 flex items-center gap-3">
          <button className="apply-btn" onClick={onApplySuggestion} disabled={pilotApplied || !canApplyPilot}>
            {pilotApplied ? (
              <>
                <CheckCircle2 size={15} />
                Suggestion applied to working template
              </>
            ) : !canApplyPilot ? (
              <>
                <CheckCircle2 size={15} />
                Select Kubernetes RCA template to apply
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Apply Suggestion
              </>
            )}
          </button>
          {pilotApplied && (
            <span className="text-xs text-gray-500">
              Open the Template Builder to see updated weights and the recalculated score.
            </span>
          )}
          {!canApplyPilot && (
            <span className="text-xs text-gray-500">
              This pilot was trained on Kubernetes RCA feedback and is intentionally blocked for other templates.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
