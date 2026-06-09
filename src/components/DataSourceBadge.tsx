import type { LogDataSource } from '../types/logs';

interface Props {
  source: LogDataSource;
  count: number;
}

export default function DataSourceBadge({ source, count }: Props) {
  const isCSV = source === 'csv';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium ${
        isCSV
          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
          : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isCSV ? 'bg-blue-400' : 'bg-purple-400'}`}
      />
      {isCSV
        ? `Synthetic Logs (CSV · ${count.toLocaleString()} entries)`
        : `Synthetic Logs (Built-in · ${count} entries)`}
      <span className="opacity-60">SYNTHETIC</span>
    </span>
  );
}
