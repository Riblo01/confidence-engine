import { Database, ArrowRight } from 'lucide-react';

export default function LearningLoopCard() {
  const steps = [
    { label: 'Feedback', color: '#3b82f6', desc: 'Reviewer classifies validation quality' },
    { label: 'Weight Adjustment', color: '#f59e0b', desc: 'Pattern scoring changes by outcome' },
    { label: 'Harness Improvement', color: '#8b5cf6', desc: 'Evaluation criteria become sharper' },
    { label: 'Better Evaluations', color: '#22c55e', desc: 'Future RCA checks become more accurate' },
  ];

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <Database size={14} color="#f59e0b" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>Learning Loop</span>
        <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: '#f59e0b22', color: '#f59e0b' }}>
          Future Integration
        </span>
      </div>
      <div className="p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <p className="text-sm leading-7" style={{ color: '#8b949e' }}>
            In production, feedback is aggregated by pattern to improve future confidence scoring and harness templates.
          </p>
          <div className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-xs">
            <div className="font-semibold uppercase tracking-[0.16em]" style={{ color: '#f59e0b' }}>Example pattern</div>
            <div className="mt-2 font-mono text-slate-200">Redis Saturation</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <span><strong className="block text-white">120</strong>evaluations</span>
              <span><strong className="block text-green-400">89%</strong>useful</span>
              <span><strong className="block text-red-400">4%</strong>incorrect</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-stretch gap-1 overflow-x-auto pb-1">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1 shrink-0">
              <div className="text-center">
                <div
                  className="rounded px-2 py-1.5 text-xs font-semibold mb-1"
                  style={{ background: `${step.color}22`, color: step.color, border: `1px solid ${step.color}33`, minWidth: 80 }}
                >
                  {step.label}
                </div>
                <div className="text-xs" style={{ color: '#6e7681', maxWidth: 90, lineHeight: '1.3' }}>{step.desc}</div>
              </div>
              {i < steps.length - 1 && <ArrowRight size={12} color="#30363d" className="shrink-0 mb-3" />}
            </div>
          ))}
        </div>
        <div className="mt-3 p-2.5 rounded text-xs" style={{ background: '#21262d', color: '#8b949e', lineHeight: '1.5' }}>
          <span style={{ color: '#f59e0b' }}>Table schema: </span>
          <span className="font-mono">incident_id, verdict, feedback_type, engineer_id, timestamp, pattern_matched, score</span>
        </div>
      </div>
    </div>
  );
}
