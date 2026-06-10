import { TrendingUp } from 'lucide-react';
import { businessImpactMetrics } from '../data/businessImpact';

function trendPath(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 42 - ((value - min) / range) * 34;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

export default function BusinessImpactDashboard() {
  return (
    <div className="bi-shell">
      <div className="bi-hero">
        <div>
          <div className="eyebrow">Executive view</div>
          <h3>Measurable value from evaluating AI outputs before action.</h3>
        </div>
        <div className="bi-hero-stat">
          <TrendingUp size={18} />
          90-day synthetic pilot
        </div>
      </div>

      <div className="bi-grid">
        {businessImpactMetrics.map((metric) => (
          <article key={metric.label} className={`bi-card ${metric.tone}`}>
            <div className="bi-card-top">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
            <svg viewBox="0 0 100 48" className="bi-sparkline" preserveAspectRatio="none">
              <path d={trendPath(metric.trend)} />
            </svg>
            <div className="bi-change">{metric.change}</div>
            <p>{metric.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
