import type { Incident } from '../types';
import type { ReactNode } from 'react';
import { Activity, BarChart3, Cpu, Gauge, ServerCrash } from 'lucide-react';

interface Props {
  incident: Incident;
}

interface Series {
  label: string;
  color: string;
  unit: string;
  values: number[];
}

const labels = ['T-30', 'T-25', 'T-20', 'T-15', 'T-10', 'T-05', 'T'];

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function linePoints(values: number[], max: number): string {
  const width = 520;
  const height = 150;
  const left = 28;
  const top = 14;
  const plotWidth = width - left - 18;
  const plotHeight = height - top - 28;

  return values
    .map((value, index) => {
      const x = left + (plotWidth / (values.length - 1)) * index;
      const y = top + plotHeight - (clamp(value, 0, max) / max) * plotHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function latest(series: Series): string {
  const value = series.values[series.values.length - 1];
  return `${value}${series.unit}`;
}

function buildMetricSeries(incident: Incident): {
  traffic: Series[];
  latency: Series[];
  resources: Series[];
  kubernetes: Series[];
  signalScore: number;
} {
  const pattern = incident.scoring_inputs.pattern_matched.toLowerCase();
  const severity = incident.severity;

  if (pattern.includes('migration') || pattern.includes('canary')) {
    return {
      traffic: [
        { label: 'Old service req/min', color: '#f97316', unit: '', values: [42, 38, 26, 8, 0, 0, 0] },
        { label: 'New deployment req/sec', color: '#22c55e', unit: '', values: [0, 4, 16, 28, 34, 36, 35] },
      ],
      latency: [
        { label: 'P95 latency', color: '#38bdf8', unit: 'ms', values: [180, 176, 172, 178, 184, 180, 181] },
      ],
      resources: [
        { label: 'CPU utilization', color: '#a78bfa', unit: '%', values: [38, 39, 36, 37, 35, 36, 35] },
        { label: 'Memory utilization', color: '#f59e0b', unit: '%', values: [44, 45, 44, 43, 45, 44, 44] },
      ],
      kubernetes: [
        { label: 'Pod restarts', color: '#22c55e', unit: '', values: [0, 0, 0, 0, 0, 0, 0] },
        { label: 'HTTP 5xx', color: '#ef4444', unit: '', values: [0, 0, 0, 0, 0, 0, 0] },
      ],
      signalScore: 88,
    };
  }

  if (pattern.includes('oom') || pattern.includes('memory')) {
    return {
      traffic: [
        { label: 'Request rate', color: '#38bdf8', unit: '/s', values: [68, 72, 80, 86, 90, 94, 96] },
        { label: 'Error rate', color: '#ef4444', unit: '%', values: [0.4, 0.7, 1.2, 2.6, 3.8, 4.1, 4.2] },
      ],
      latency: [
        { label: 'P95 latency', color: '#f59e0b', unit: 'ms', values: [240, 260, 410, 820, 1200, 1440, 1510] },
      ],
      resources: [
        { label: 'Memory utilization', color: '#ef4444', unit: '%', values: [62, 70, 78, 86, 92, 96, 97] },
        { label: 'CPU utilization', color: '#a78bfa', unit: '%', values: [42, 45, 52, 58, 62, 68, 70] },
      ],
      kubernetes: [
        { label: 'Pod restarts', color: '#ef4444', unit: '', values: [0, 1, 1, 3, 4, 6, 7] },
        { label: 'OOMKilled events', color: '#f97316', unit: '', values: [0, 1, 1, 3, 4, 6, 7] },
      ],
      signalScore: 94,
    };
  }

  if (pattern.includes('redis') || pattern.includes('rabbitmq') || severity === 'performance') {
    return {
      traffic: [
        { label: 'Request rate', color: '#38bdf8', unit: '/s', values: [84, 92, 110, 126, 138, 144, 148] },
        { label: 'HTTP 5xx', color: '#ef4444', unit: '%', values: [0.6, 1.4, 3.8, 7.2, 11.4, 13.8, 14.8] },
      ],
      latency: [
        { label: 'P99 latency', color: '#ef4444', unit: 'ms', values: [420, 680, 1400, 3100, 6200, 8700, 9400] },
        { label: 'Dependency latency', color: '#f59e0b', unit: 'ms', values: [12, 48, 110, 190, 280, 320, 340] },
      ],
      resources: [
        { label: 'Connection saturation', color: '#ef4444', unit: '%', values: [54, 68, 78, 88, 94, 97, 99] },
        { label: 'CPU utilization', color: '#a78bfa', unit: '%', values: [46, 50, 55, 61, 67, 72, 74] },
      ],
      kubernetes: [
        { label: 'Pod restarts', color: '#22c55e', unit: '', values: [0, 0, 0, 0, 0, 0, 0] },
        { label: 'Timeout events', color: '#ef4444', unit: '', values: [2, 18, 66, 140, 260, 360, 412] },
      ],
      signalScore: 91,
    };
  }

  if (pattern.includes('hpa') || pattern.includes('node pressure')) {
    return {
      traffic: [
        { label: 'Request rate', color: '#38bdf8', unit: '/s', values: [96, 118, 142, 166, 184, 198, 204] },
        { label: 'Error rate', color: '#ef4444', unit: '%', values: [0.8, 1.6, 2.8, 4.4, 7.2, 9.6, 11.1] },
      ],
      latency: [
        { label: 'P95 latency', color: '#f59e0b', unit: 'ms', values: [280, 360, 520, 820, 1180, 1560, 1880] },
      ],
      resources: [
        { label: 'CPU utilization', color: '#ef4444', unit: '%', values: [62, 70, 78, 86, 94, 98, 99] },
        { label: 'Memory pressure', color: '#f97316', unit: '%', values: [54, 58, 66, 74, 82, 88, 92] },
      ],
      kubernetes: [
        { label: 'Pending pods', color: '#f97316', unit: '', values: [0, 0, 2, 4, 7, 9, 11] },
        { label: 'Evictions / scaling blocks', color: '#ef4444', unit: '', values: [0, 1, 2, 3, 5, 7, 8] },
      ],
      signalScore: 86,
    };
  }

  return {
    traffic: [
      { label: 'Request rate', color: '#38bdf8', unit: '/s', values: [54, 52, 44, 30, 18, 12, 9] },
      { label: 'HTTP 5xx', color: '#ef4444', unit: '%', values: [0.2, 1.8, 8.6, 22, 38, 46, 52] },
    ],
    latency: [
      { label: 'P95 latency', color: '#f59e0b', unit: 'ms', values: [210, 340, 860, 1500, 2400, 3200, 3900] },
    ],
    resources: [
      { label: 'CPU utilization', color: '#a78bfa', unit: '%', values: [36, 38, 40, 42, 41, 39, 40] },
      { label: 'Memory utilization', color: '#f59e0b', unit: '%', values: [48, 50, 51, 52, 53, 52, 52] },
    ],
    kubernetes: [
      { label: 'CrashLoopBackOff', color: '#ef4444', unit: '', values: [0, 1, 3, 5, 8, 10, 12] },
      { label: 'Pod restarts', color: '#f97316', unit: '', values: [0, 1, 3, 5, 8, 11, 14] },
    ],
    signalScore: 90,
  };
}

function maxValue(series: Series[]): number {
  return Math.max(...series.flatMap((item) => item.values), 1);
}

function LineChart({ title, icon, series }: { title: string; icon: ReactNode; series: Series[] }) {
  const max = maxValue(series);

  return (
    <article className="metric-chart-card">
      <div className="metric-chart-header">
        <div className="metric-chart-title">
          {icon}
          <h3>{title}</h3>
        </div>
        <div className="metric-chart-latest">
          {series.map((item) => (
            <span key={item.label} style={{ color: item.color }}>{latest(item)}</span>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 520 150" className="metric-line-chart" role="img" aria-label={`${title} metric chart`}>
        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="28"
            x2="502"
            y1={20 + line * 32}
            y2={20 + line * 32}
            stroke="rgba(148, 163, 184, 0.12)"
          />
        ))}
        {series.map((item) => (
          <polyline
            key={item.label}
            fill="none"
            points={linePoints(item.values, max)}
            stroke={item.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
        ))}
        {labels.map((label, index) => (
          <text key={label} x={28 + (474 / (labels.length - 1)) * index} y="142" fill="#64748b" fontSize="10" textAnchor="middle">
            {label}
          </text>
        ))}
      </svg>

      <div className="metric-legend">
        {series.map((item) => (
          <span key={item.label}>
            <i style={{ background: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </article>
  );
}

function SignalSummary({ incident, signalScore }: { incident: Incident; signalScore: number }) {
  const statusCounts = incident.telemetry_signals.reduce(
    (acc, signal) => ({ ...acc, [signal.status]: acc[signal.status] + 1 }),
    { normal: 0, anomaly: 0, critical: 0 },
  );
  const total = incident.telemetry_signals.length || 1;

  return (
    <article className="metric-summary-card">
      <div className="metric-chart-title">
        <BarChart3 size={18} />
        <h3>Evidence signal coverage</h3>
      </div>
      <div className="signal-score">{signalScore}%</div>
      <p>Operational signals correlated against the selected incident pattern.</p>
      <div className="signal-bars">
        {[
          { label: 'Critical', value: statusCounts.critical, color: '#ef4444' },
          { label: 'Anomaly', value: statusCounts.anomaly, color: '#f59e0b' },
          { label: 'Normal', value: statusCounts.normal, color: '#22c55e' },
        ].map((item) => (
          <div key={item.label}>
            <div className="signal-bar-label">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
            <div className="signal-bar-track">
              <div style={{ width: `${(item.value / total) * 100}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function MetricsDashboard({ incident }: Props) {
  const model = buildMetricSeries(incident);

  return (
    <div className="metrics-dashboard">
      <div className="metrics-dashboard-copy">
        <div className="eyebrow">Operational telemetry</div>
        <h3 className="display-title">Metric signals before confidence scoring</h3>
        <p>
          These charts make the RCA validation easier to explain during the demo: the engine sees
          traffic behavior, latency, resource pressure and Kubernetes health before producing a verdict.
        </p>
      </div>

      <div className="metrics-grid">
        <LineChart title="Traffic and errors" icon={<Activity size={18} />} series={model.traffic} />
        <LineChart title="Latency and dependency behavior" icon={<Gauge size={18} />} series={model.latency} />
        <LineChart title="Resource pressure" icon={<Cpu size={18} />} series={model.resources} />
        <LineChart title="Kubernetes health" icon={<ServerCrash size={18} />} series={model.kubernetes} />
        <SignalSummary incident={incident} signalScore={model.signalScore} />
      </div>
    </div>
  );
}
