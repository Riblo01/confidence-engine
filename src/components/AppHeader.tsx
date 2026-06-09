import { Shield } from 'lucide-react';

const badges = [
  { label: 'Kubernetes', color: '#326ce5' },
  { label: 'AWS EKS', color: '#ff9900' },
  { label: 'Dynatrace', color: '#1496ff' },
  { label: 'Prometheus', color: '#e6522c' },
  { label: 'Loki', color: '#f9b26a' },
  { label: 'Tempo', color: '#7b61ff' },
  { label: 'SRE', color: '#22c55e' },
];

export default function AppHeader() {
  return (
    <header
      style={{ background: '#0d1117', borderBottom: '1px solid #21262d' }}
      className="px-6 py-5 hero-header"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' }}
            >
              <Shield size={20} color="white" />
            </div>
            <div>
              <div className="eyebrow">AI RCA validation layer</div>
              <h1 className="display-title text-xl font-bold text-white leading-tight mt-1">
                AI Confidence Engine
                <span className="ml-2 text-sm font-medium px-2 py-0.5 rounded" style={{ background: '#21262d', color: '#8b949e' }}>
                  for Kubernetes Triage
                </span>
              </h1>
              <p className="text-sm mt-1.5 max-w-3xl" style={{ color: '#9fb0c3' }}>
                Explain the process first, then walk through the incident, agent RCA, operational evidence,
                confidence score, and human decision.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {badges.map((b) => (
              <span
                key={b.label}
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${b.color}22`, color: b.color, border: `1px solid ${b.color}44` }}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
