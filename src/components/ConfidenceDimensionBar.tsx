import { getScoreColor } from '../scoring/engine';

interface Props {
  label: string;
  value: number;
  isRisk?: boolean;
  subtitle?: string;
  description?: string;
}

export default function ConfidenceDimensionBar({ label, value, isRisk = false, subtitle, description }: Props) {
  const displayValue = isRisk ? value : value;
  const barWidth = isRisk ? value : value;
  const color = isRisk
    ? value > 50 ? '#ef4444' : value > 25 ? '#f97316' : value > 10 ? '#f59e0b' : '#22c55e'
    : getScoreColor(value);

  return (
    <div className="confidence-dimension-row">
      <div className="confidence-dimension-copy">
        <div className="text-sm font-medium" style={{ color: '#e6edf3' }}>{label}</div>
        {subtitle && <div className="text-xs mt-0.5" style={{ color: '#6e7681' }}>{subtitle}</div>}
        {description && <p>{description}</p>}
      </div>
      <div className="confidence-dimension-track" style={{ background: '#21262d' }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${barWidth}%`, background: color }}
        />
      </div>
      <div className="confidence-dimension-value" style={{ color }}>
        {displayValue}%
      </div>
    </div>
  );
}
