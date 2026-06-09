import type { ConfidenceResult } from '../types';
import { getVerdictColor } from '../scoring/engine';
import { ShieldCheck, ShieldAlert, Shield, ArrowRight } from 'lucide-react';

interface Props { result: ConfidenceResult; }

const VerdictIcon = ({ verdict }: { verdict: string }) => {
  if (verdict === 'Trusted RCA') return <ShieldCheck size={28} color="#22c55e" />;
  if (verdict === 'Needs Human Review') return <ShieldAlert size={28} color="#f59e0b" />;
  return <Shield size={28} color="#ef4444" />;
};

export default function VerdictCard({ result }: Props) {
  const color = getVerdictColor(result.verdict);
  const levelBg: Record<string, string> = {
    'Trusted RCA': '#22c55e0d',
    'Needs Human Review': '#f59e0b0d',
    'Low Confidence RCA': '#ef44440d',
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: '#161b22', border: `1px solid ${color}44` }}
    >
      {/* Banner */}
      <div
        className="px-4 py-4 flex items-center gap-3"
        style={{ background: levelBg[result.verdict], borderBottom: `1px solid ${color}44` }}
      >
        <VerdictIcon verdict={result.verdict} />
        <div>
          <div className="text-xs uppercase tracking-widest font-semibold mb-0.5" style={{ color: `${color}cc` }}>
            Final Verdict
          </div>
          <div className="text-xl font-bold" style={{ color }}>{result.verdict}</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold" style={{ color }}>{result.overall_score.toFixed(0)}%</div>
          <div className="text-xs" style={{ color: `${color}99` }}>{result.confidence_level} Confidence</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Verdict message */}
        <div>
          <div className="text-xs font-semibold uppercase mb-1.5" style={{ color: '#6e7681' }}>Assessment</div>
          <p className="text-sm leading-relaxed" style={{ color: '#b1bac4' }}>{result.verdict_message}</p>
        </div>

        {/* Next step */}
        <div
          className="rounded-lg p-3 flex items-start gap-3"
          style={{ background: `${color}0d`, border: `1px solid ${color}33` }}
        >
          <ArrowRight size={14} color={color} className="mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-semibold uppercase mb-1" style={{ color }}>Recommended Next Step</div>
            <p className="text-sm" style={{ color: '#b1bac4' }}>{result.next_step}</p>
          </div>
        </div>

        {result.has_critical_missing_evidence && (
          <div
            className="rounded-lg p-3 text-sm"
            style={{ background: '#f59e0b11', border: '1px solid #f59e0b44', color: '#f59e0b' }}
          >
            ⚠ Important evidence missing. Human validation recommended before executing any remediation.
          </div>
        )}
      </div>
    </div>
  );
}
