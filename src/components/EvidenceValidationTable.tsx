import type { Incident, EvidenceStatus, ImpactLevel } from '../types';
import { Table } from 'lucide-react';

interface Props { incident: Incident; }

const statusConfig: Record<EvidenceStatus, { label: string; color: string }> = {
  validated:    { label: 'Validated',        color: '#22c55e' },
  inferred:     { label: 'Inferred',         color: '#f59e0b' },
  missing:      { label: 'Missing Evidence', color: '#ef4444' },
  contradiction:{ label: 'Contradiction',    color: '#f97316' },
};

const impactConfig: Record<ImpactLevel, { label: string; color: string }> = {
  high:   { label: 'High',   color: '#ef4444' },
  medium: { label: 'Medium', color: '#f59e0b' },
  low:    { label: 'Low',    color: '#22c55e' },
};

export default function EvidenceValidationTable({ incident }: Props) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <Table size={14} color="#3b82f6" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>Evidence Validation</span>
        <span className="ml-auto text-xs" style={{ color: '#6e7681' }}>{incident.evidence_items.length} claims evaluated</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
              {['Agent Claim', 'Evidence Source', 'Status', 'Confidence Impact', 'Detail'].map((h) => (
                <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6e7681' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {incident.evidence_items.map((item, i) => {
              const sc = statusConfig[item.status];
              const ic = impactConfig[item.confidence_impact];
              const isMissing = item.status === 'missing' || item.status === 'contradiction';
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: '1px solid #21262d',
                    background: isMissing ? '#ef444408' : 'transparent',
                  }}
                >
                  <td className="px-4 py-3" style={{ color: '#e6edf3', maxWidth: 220 }}>
                    {item.claim}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: '#21262d', color: '#8b949e' }}>
                      {item.source}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ background: `${sc.color}22`, color: sc.color, border: `1px solid ${sc.color}44` }}
                    >
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ background: `${ic.color}22`, color: ic.color }}
                    >
                      {ic.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#6e7681', maxWidth: 240 }}>
                    {item.detail ?? '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {incident.missing_evidence.length > 0 && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid #21262d', background: '#ef444408' }}>
          <div className="text-xs font-semibold uppercase mb-2" style={{ color: '#ef4444' }}>
            Missing Evidence Summary ({incident.missing_evidence.length} items)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {incident.missing_evidence.map((m, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded"
                style={{ background: '#ef444422', color: '#ef4444', border: '1px solid #ef444433' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {incident.contradiction_risks.length > 0 && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid #21262d', background: '#f9731611' }}>
          <div className="text-xs font-semibold uppercase mb-2" style={{ color: '#f97316' }}>
            Contradiction Risks ({incident.contradiction_risks.length})
          </div>
          {incident.contradiction_risks.map((c, i) => (
            <p key={i} className="text-xs" style={{ color: '#f97316' }}>⚠ {c}</p>
          ))}
        </div>
      )}
    </div>
  );
}
