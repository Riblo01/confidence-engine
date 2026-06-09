import type { Incident, TimelineEventType } from '../types';
import { Clock } from 'lucide-react';

interface Props { incident: Incident; }

const typeConfig: Record<TimelineEventType, { color: string; label: string }> = {
  detection:  { color: '#ef4444', label: 'DETECT' },
  metric:     { color: '#3b82f6', label: 'METRIC' },
  deployment: { color: '#f59e0b', label: 'DEPLOY' },
  rca:        { color: '#8b5cf6', label: 'RCA' },
  validation: { color: '#22c55e', label: 'VALID' },
};

export default function TimelineCard({ incident }: Props) {
  return (
    <div className="rounded-lg overflow-hidden" style={{ background: '#161b22', border: '1px solid #21262d' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #21262d', background: '#1c2128' }}>
        <Clock size={14} color="#8b949e" />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b949e' }}>Incident Timeline</span>
      </div>
      <div className="p-4">
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[5.5px] top-2 bottom-2 w-0.5"
            style={{ background: '#21262d' }}
          />
          <div className="space-y-3">
            {incident.timeline_events.map((evt, i) => {
              const tc = typeConfig[evt.type];
              const isLast = i === incident.timeline_events.length - 1;
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  <div
                    className="w-3 h-3 rounded-full shrink-0 mt-0.5 z-10"
                    style={{
                      background: tc.color,
                      boxShadow: `0 0 6px ${tc.color}66`,
                      border: isLast ? `2px solid ${tc.color}` : 'none',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono" style={{ color: '#6e7681' }}>{evt.time}</span>
                      <span
                        className="text-xs font-bold px-1.5 py-0 rounded"
                        style={{ background: `${tc.color}22`, color: tc.color }}
                      >
                        {tc.label}
                      </span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: isLast ? '#e6edf3' : '#b1bac4' }}>{evt.event}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
