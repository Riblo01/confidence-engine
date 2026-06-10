import { AlertTriangle, ShieldCheck, TrendingDown, TrendingUp, UserCheck } from 'lucide-react';
import type { TemplateScoreResult, TemplateVerdict } from '../types';
import { getScoreColor } from '../scoring/engine';

interface Props {
  result: TemplateScoreResult;
}

const VERDICT_COLOR: Record<TemplateVerdict, string> = {
  Trusted: '#22c55e',
  'Needs Human Review': '#f59e0b',
  'Low Confidence': '#ef4444',
};

export default function DynamicScorePreview({ result }: Props) {
  const color = getScoreColor(result.score);
  const verdictColor = VERDICT_COLOR[result.verdict];
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (Math.min(result.score, 100) / 100) * circumference;

  return (
    <div className="card" style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 12, padding: '1.5rem' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative" style={{ width: 130, height: 130 }}>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="52" fill="none" stroke="#21262d" strokeWidth="9" />
            <circle
              cx="65"
              cy="65"
              r="52"
              fill="none"
              stroke={color}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-black text-3xl" style={{ color }}>
              {result.score.toFixed(1)}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-gray-500">SCORE</span>
          </div>
        </div>

        <span
          className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide"
          style={{ color: verdictColor, background: `${verdictColor}1a`, border: `1px solid ${verdictColor}55` }}
        >
          {result.verdict}
        </span>
        <span className="text-xs text-gray-500">Confidence level: {result.confidenceLevel}</span>
      </div>

      <div className="mt-4 space-y-2 text-xs">
        {result.biggestContributor && (
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp size={13} />
            <span className="text-gray-400">Biggest contributor:</span>
            <strong>{result.biggestContributor.name}</strong>
          </div>
        )}
        {result.biggestRiskContributor && (
          <div className="flex items-center gap-2 text-red-400">
            <TrendingDown size={13} />
            <span className="text-gray-400">Biggest risk:</span>
            <strong>{result.biggestRiskContributor.name}</strong>
          </div>
        )}
        <div className="flex items-center gap-2" style={{ color: result.humanReviewRequired ? '#fbbf24' : '#4ade80' }}>
          {result.humanReviewRequired ? <UserCheck size={13} /> : <ShieldCheck size={13} />}
          <span>{result.humanReviewRequired ? 'Human review required' : 'Safe for automated continuation'}</span>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {result.warnings.map((w) => (
            <div key={w} className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2.5 py-1.5">
              <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
