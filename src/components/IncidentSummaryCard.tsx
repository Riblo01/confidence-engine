import type { Incident } from '../types';
import { getSeverityColor } from '../scoring/engine';
import { Server, Layers, Activity } from 'lucide-react';

interface Props { incident: Incident; }

const severityLabel: Record<string, string> = {
  availability: 'Availability',
  error_rate: 'Error Rate',
  performance: 'Performance',
  resource_saturation: 'Resource Saturation',
  deployment_failure: 'Deployment Failure',
};

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 py-1.5" style={{ borderBottom: '1px solid #21262d' }}>
      <span className="text-xs w-32 shrink-0" style={{ color: '#6e7681' }}>{label}</span>
      <span className={`text-sm ${mono ? 'font-mono' : 'font-medium'}`} style={{ color: '#e6edf3' }}>{value}</span>
    </div>
  );
}

export default function IncidentSummaryCard({ incident }: Props) {
  const sColor = getSeverityColor(incident.severity);
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <Server size={14} color="#8b949e" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>Incident Summary</span>
      </div>
      <div className="px-4 pb-2 pt-1">
        <div className="flex items-center gap-2 py-2" style={{ borderBottom: '1px solid #21262d' }}>
          <span className="text-xs font-mono" style={{ color: '#8b949e' }}>{incident.problem_id}</span>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: `${sColor}22`, color: sColor, border: `1px solid ${sColor}44` }}
          >
            {severityLabel[incident.severity]}
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded ml-auto"
            style={{
              background: incident.status === 'active' ? '#ef444422' : '#22c55e22',
              color: incident.status === 'active' ? '#ef4444' : '#22c55e',
            }}
          >
            {incident.status.toUpperCase()}
          </span>
        </div>
        <div className="py-2" style={{ borderBottom: '1px solid #21262d' }}>
          <p className="text-sm font-semibold" style={{ color: '#e6edf3' }}>{incident.title}</p>
        </div>
        <Row label="Service" value={incident.affected_service} mono />
        <Row label="Namespace" value={incident.namespace} mono />
        <Row label="Cluster" value={incident.cluster} mono />
        <Row label="Time Window" value={incident.time_window} />
        <div className="py-2" style={{ borderBottom: '1px solid #21262d' }}>
          <span className="text-xs" style={{ color: '#6e7681' }}>Business Impact</span>
          <p className="text-sm mt-0.5" style={{ color: '#f59e0b' }}>{incident.business_impact}</p>
        </div>
        <div className="py-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Activity size={12} color="#6e7681" />
            <span className="text-xs" style={{ color: '#6e7681' }}>Source Tools</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {incident.source_tools.map((t) => (
              <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: '#21262d', color: '#8b949e' }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="py-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Layers size={12} color="#6e7681" />
            <span className="text-xs" style={{ color: '#6e7681' }}>Telemetry Signals</span>
          </div>
          <div className="space-y-1">
            {incident.telemetry_signals.map((sig, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background:
                      sig.status === 'critical' ? '#ef4444' :
                      sig.status === 'anomaly' ? '#f59e0b' : '#22c55e',
                  }}
                />
                <span style={{ color: '#6e7681' }}>{sig.source}:</span>
                <span style={{ color: '#8b949e' }}>{sig.signal}</span>
                <span className="ml-auto font-mono font-medium" style={{ color: sig.status === 'normal' ? '#22c55e' : sig.status === 'anomaly' ? '#f59e0b' : '#ef4444' }}>
                  {sig.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
