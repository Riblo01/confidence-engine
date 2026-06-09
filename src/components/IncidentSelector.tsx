import type { Incident } from '../types';
import { getSeverityColor } from '../scoring/engine';
import { AlertCircle, Server, MapPin, Network, Briefcase } from 'lucide-react';

interface Props {
  incidents: Incident[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const severityLabel: Record<string, string> = {
  availability: 'AVAIL',
  error_rate: 'ERR',
  performance: 'PERF',
  resource_saturation: 'SAT',
  deployment_failure: 'DEPLOY',
};

export default function IncidentSelector({ incidents, selectedId, onSelect }: Props) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: '#161b22', border: '1px solid #21262d' }}
    >
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}
      >
        <AlertCircle size={14} color="#8b949e" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>
          Incident Queue
        </span>
        <span
          className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded"
          style={{ background: '#ef444422', color: '#ef4444' }}
        >
          {incidents.length} active
        </span>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        {incidents.map((inc) => {
          const isSelected = inc.problem_id === selectedId;
          const sColor = getSeverityColor(inc.severity);
          return (
            <button
              key={inc.problem_id}
              onClick={() => onSelect(inc.problem_id)}
              className="incident-card text-left transition-all"
              style={{
                background: isSelected ? '#1f2937' : '#0f141d',
                borderColor: isSelected ? `${sColor}88` : '#30363d',
                boxShadow: isSelected ? `0 0 0 1px ${sColor}44, 0 18px 42px rgba(0,0,0,0.24)` : 'none',
              }}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-mono" style={{ color: '#8b949e' }}>{inc.problem_id}</div>
                  <div className="mt-1 text-base font-semibold leading-6" style={{ color: '#e6edf3' }}>
                    {inc.title}
                  </div>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded shrink-0"
                  style={{ background: `${sColor}22`, color: sColor, minWidth: 54, textAlign: 'center' }}
                >
                  {severityLabel[inc.severity]}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="incident-meta-row">
                  <Server size={13} />
                  <span>Service</span>
                  <strong>{inc.affected_service}</strong>
                </div>
                <div className="incident-meta-row">
                  <MapPin size={13} />
                  <span>Namespace</span>
                  <strong>{inc.namespace}</strong>
                </div>
                <div className="incident-meta-row">
                  <Network size={13} />
                  <span>Cluster</span>
                  <strong>{inc.cluster}</strong>
                </div>
              </div>

              <div className="mt-4 rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-1 flex items-center gap-1.5 text-xs uppercase tracking-[0.14em]" style={{ color: '#8b949e' }}>
                  <Briefcase size={12} />
                  Impact
                </div>
                <p className="line-clamp-3 text-xs leading-5" style={{ color: '#b1bac4' }}>{inc.business_impact}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
