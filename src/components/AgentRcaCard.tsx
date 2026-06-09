import type { Incident } from '../types';
import { Brain, CheckCircle, XCircle, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Props { incident: Incident; }

export default function AgentRcaCard({ incident }: Props) {
  const [showDiscarded, setShowDiscarded] = useState(false);
  const { agent_rca: rca } = incident;

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <Brain size={14} color="#8b5cf6" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>AI SRE Analysis — RCA</span>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: '#8b5cf622', color: '#8b5cf6', border: '1px solid #8b5cf644' }}
        >
          {rca.agent_name}
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Root cause */}
        <div className="rounded-lg p-3" style={{ background: '#1c2128', border: '1px solid #30363d' }}>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={12} color="#f59e0b" />
            <span className="text-xs font-semibold uppercase" style={{ color: '#f59e0b' }}>Proposed Root Cause</span>
          </div>
          <p className="text-sm font-medium" style={{ color: '#e6edf3' }}>{rca.proposed_root_cause}</p>
        </div>

        {/* Summary */}
        <div>
          <span className="text-xs font-semibold uppercase" style={{ color: '#6e7681' }}>RCA Summary</span>
          <p className="text-sm mt-1 leading-relaxed" style={{ color: '#b1bac4' }}>{rca.rca_summary}</p>
        </div>

        {/* Evidence */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle size={12} color="#22c55e" />
            <span className="text-xs font-semibold uppercase" style={{ color: '#22c55e' }}>Evidence Cited by Agent</span>
          </div>
          <ul className="space-y-1">
            {rca.evidence_listed.map((e, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: '#22c55e' }} />
                <span style={{ color: '#b1bac4' }}>{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Discarded hypotheses toggle */}
        <div>
          <button
            onClick={() => setShowDiscarded(!showDiscarded)}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase w-full"
            style={{ color: '#6e7681' }}
          >
            <XCircle size={12} color="#ef4444" />
            <span style={{ color: '#ef444499' }}>Discarded Hypotheses ({rca.hypotheses_discarded.length})</span>
            {showDiscarded ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
          </button>
          {showDiscarded && (
            <ul className="space-y-1 mt-2">
              {rca.hypotheses_discarded.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1 text-xs" style={{ color: '#ef444466' }}>✕</span>
                  <span style={{ color: '#6e7681' }}>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recommended actions */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={12} color="#3b82f6" />
            <span className="text-xs font-semibold uppercase" style={{ color: '#3b82f6' }}>Recommended Actions</span>
          </div>
          <ol className="space-y-1">
            {rca.recommended_actions.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 w-5 h-5 rounded text-xs flex items-center justify-center font-bold" style={{ background: '#3b82f622', color: '#3b82f6' }}>
                  {i + 1}
                </span>
                <span style={{ color: '#b1bac4' }}>{a}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Agent confidence */}
        <div className="flex items-center justify-between pt-1" style={{ borderTop: '1px solid #21262d' }}>
          <span className="text-xs" style={{ color: '#6e7681' }}>Agent Declared Confidence</span>
          <span className="text-sm font-bold" style={{ color: '#8b5cf6' }}>{rca.agent_declared_confidence}%</span>
        </div>
      </div>
    </div>
  );
}
