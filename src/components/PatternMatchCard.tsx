import type { Incident } from '../types';
import { Layers, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { patterns } from '../data/patterns';

interface Props { incident: Incident; }

export default function PatternMatchCard({ incident }: Props) {
  const { scoring_inputs: si } = incident;
  const pattern = patterns.find((p) => p.name === si.pattern_matched);
  const sim = si.pattern_similarity;
  const simColor = sim >= 90 ? '#22c55e' : sim >= 75 ? '#f59e0b' : '#ef4444';

  const matched = si.pattern_matched_signals.filter((s) => s.matched);
  const unmatched = si.pattern_matched_signals.filter((s) => !s.matched);

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <Layers size={14} color="#8b5cf6" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>Pattern Matching</span>
      </div>
      <div className="p-4 space-y-4">
        {/* Pattern header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase mb-1" style={{ color: '#6e7681' }}>Matched Pattern</div>
            <div className="text-sm font-bold" style={{ color: '#8b5cf6' }}>{si.pattern_matched}</div>
            {pattern && (
              <p className="text-xs mt-1 leading-relaxed" style={{ color: '#8b949e' }}>{pattern.description}</p>
            )}
          </div>
          <div className="text-center shrink-0">
            <div className="text-2xl font-bold" style={{ color: simColor }}>{sim}%</div>
            <div className="text-xs" style={{ color: '#6e7681' }}>Similarity</div>
          </div>
        </div>

        {/* Signal grid */}
        <div>
          <div className="text-xs font-semibold uppercase mb-2" style={{ color: '#6e7681' }}>Signal Analysis</div>
          <div className="space-y-1.5">
            {matched.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle size={13} color="#22c55e" className="shrink-0" />
                <span style={{ color: '#b1bac4' }}>{s.signal}</span>
                <span className="ml-auto text-xs font-medium" style={{ color: '#22c55e' }}>matched</span>
              </div>
            ))}
            {unmatched.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <XCircle size={13} color="#f59e0b" className="shrink-0" />
                <span style={{ color: '#6e7681' }}>{s.signal}</span>
                <span className="ml-auto text-xs font-medium" style={{ color: '#f59e0b' }}>missing</span>
              </div>
            ))}
          </div>
        </div>

        {/* Missing signals */}
        {si.missing_signals.length > 0 && (
          <div className="rounded-lg p-3" style={{ background: '#1c2128', border: '1px solid #30363d' }}>
            <div className="flex items-center gap-1.5 mb-2">
              <AlertCircle size={12} color="#f59e0b" />
              <span className="text-xs font-semibold uppercase" style={{ color: '#f59e0b' }}>Missing Signals</span>
            </div>
            <ul className="space-y-1">
              {si.missing_signals.map((ms, i) => (
                <li key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#8b949e' }}>
                  <span style={{ color: '#f59e0b44' }}>–</span>
                  {ms}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Historical matches */}
        {incident.historical_matches.length > 0 && (
          <div>
            <div className="text-xs font-semibold uppercase mb-2" style={{ color: '#6e7681' }}>Historical Matches</div>
            <div className="space-y-2">
              {incident.historical_matches.map((hm, i) => (
                <div
                  key={i}
                  className="rounded p-2.5"
                  style={{ background: '#1c2128', border: '1px solid #21262d' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: '#8b949e' }}>{hm.incident_id}</span>
                    <span className="text-xs font-bold" style={{ color: hm.similarity >= 90 ? '#22c55e' : '#f59e0b' }}>
                      {hm.similarity}%
                    </span>
                  </div>
                  <p className="text-xs font-medium" style={{ color: '#b1bac4' }}>{hm.title}</p>
                  <p className="text-xs mt-1" style={{ color: '#6e7681' }}>Resolution: {hm.resolution}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
