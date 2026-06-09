import type { ConfidenceResult } from '../types';
import { getScoreColor } from '../scoring/engine';
import ConfidenceDimensionBar from './ConfidenceDimensionBar';
import { ShieldCheck } from 'lucide-react';

interface Props { result: ConfidenceResult; }

function CircleScore({ score, color }: { score: number; color: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg viewBox="0 0 120 120" className="w-36 h-36">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#21262d" strokeWidth="10" />
      <circle
        cx="60" cy="60" r={r}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s' }}
      />
      <text x="60" y="54" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold" fontFamily="system-ui">
        {Math.round(score)}
      </text>
      <text x="60" y="66" textAnchor="middle" fill={color} fontSize="9" fontFamily="system-ui">%</text>
      <text x="60" y="78" textAnchor="middle" fill="#6e7681" fontSize="8" fontFamily="system-ui">CONFIDENCE</text>
    </svg>
  );
}

export default function ConfidenceScoreCard({ result }: Props) {
  const color = getScoreColor(result.overall_score);
  const levelColors: Record<string, string> = {
    High: '#22c55e', Medium: '#f59e0b', Low: '#f97316', 'Very Low': '#ef4444',
  };
  const lvlColor = levelColors[result.confidence_level] ?? '#8b949e';

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <ShieldCheck size={14} color="#3b82f6" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>Confidence Engine Evaluation</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-wide mb-1" style={{ color: '#6e7681' }}>Overall Score</div>
            <div className="text-3xl font-bold" style={{ color }}>{result.overall_score.toFixed(1)}%</div>
            <span
              className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: `${lvlColor}22`, color: lvlColor, border: `1px solid ${lvlColor}44` }}
            >
              {result.confidence_level} Confidence
            </span>
          </div>
          <CircleScore score={result.overall_score} color={color} />
        </div>

        <div style={{ borderTop: '1px solid #21262d' }} className="pt-3 space-y-1">
          <div className="text-xs font-semibold uppercase mb-2" style={{ color: '#6e7681' }}>Scoring Dimensions</div>
          <ConfidenceDimensionBar
            label="Evidence Quality"
            value={result.evidence_quality}
            subtitle="Weight: 30%"
            description="Measures whether the RCA claims are backed by concrete logs, metrics, traces, or Kubernetes events."
          />
          <ConfidenceDimensionBar
            label="RCA Consistency"
            value={result.rca_consistency}
            subtitle="Weight: 25%"
            description="Checks whether symptoms, findings, root cause, and recommendation tell the same operational story."
          />
          <ConfidenceDimensionBar
            label="Historical Similarity"
            value={result.historical_similarity}
            subtitle="Weight: 20%"
            description="Compares the incident with known Kubernetes patterns and previous similar resolutions."
          />
          <ConfidenceDimensionBar
            label="Op. Completeness"
            value={result.operational_completeness}
            subtitle="Weight: 15%"
            description="Evaluates whether relevant observability sources were covered: logs, metrics, traces, events, deployments, and scaling."
          />
          <ConfidenceDimensionBar
            label="Contradiction Score"
            value={result.contradiction_score}
            subtitle="Weight: 10%"
            description="Represents how clean the RCA is after subtracting contradictory or conflicting signals."
          />
          <ConfidenceDimensionBar
            label="Contradiction Risk"
            value={result.contradiction_risk}
            isRisk
            subtitle="Inverse — lower is better"
            description="Shows the raw risk that evidence conflicts with the proposed root cause."
          />
          <ConfidenceDimensionBar
            label="Recommendation Quality"
            value={result.recommendation_quality}
            description="Assesses whether the proposed actions are actionable, specific, and justified by evidence."
          />
        </div>

        {result.has_critical_missing_evidence && (
          <div
            className="mt-3 p-3 rounded-lg flex items-start gap-2 text-sm"
            style={{ background: '#f59e0b11', border: '1px solid #f59e0b44', color: '#f59e0b' }}
          >
            <span className="text-base leading-none mt-0.5">⚠</span>
            <span>Important evidence missing. Human validation recommended before executing remediation.</span>
          </div>
        )}
      </div>
    </div>
  );
}
