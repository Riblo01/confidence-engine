import { useState, useCallback } from 'react';
import { Upload, FileText, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import type { SyntheticLogEntry, LogDataSource } from '../types/logs';
import { parseCSV, filterLogsForIncident } from '../data/logParser';
import DataSourceBadge from './DataSourceBadge';

interface Props {
  problemId: string;
  csvLogs: SyntheticLogEntry[] | null;
  dataSource: LogDataSource;
  allLogs: SyntheticLogEntry[];
  onCsvUpload: (logs: SyntheticLogEntry[]) => void;
}

const LOG_LEVEL_STYLE: Record<string, string> = {
  DEBUG: 'text-gray-400',
  INFO:  'text-blue-400',
  WARN:  'text-yellow-400',
  ERROR: 'text-red-400',
};

const SOURCE_STYLE: Record<string, string> = {
  kubernetes:   'bg-blue-500/15 text-blue-300',
  istio:        'bg-purple-500/15 text-purple-300',
  application:  'bg-green-500/15 text-green-300',
};

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s;
}

export default function LogEvidencePanel({
  problemId,
  csvLogs,
  dataSource,
  allLogs,
  onCsvUpload,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const incidentLogs = filterLogsForIncident(allLogs, problemId, 25);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        setUploadError('File must be a .csv');
        return;
      }

      setIsLoading(true);
      setUploadError(null);

      try {
        const text = await file.text();
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          setUploadError('No valid log entries found in CSV.');
        } else {
          onCsvUpload(parsed);
        }
      } catch {
        setUploadError('Failed to parse CSV file.');
      } finally {
        setIsLoading(false);
        e.target.value = '';
      }
    },
    [onCsvUpload],
  );

  const errorCount  = incidentLogs.filter((l) => l.log_level === 'ERROR').length;
  const warnCount   = incidentLogs.filter((l) => l.log_level === 'WARN').length;

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-indigo-400" />
            <span className="text-sm font-semibold text-gray-100">Log Evidence</span>
          </div>
          <DataSourceBadge source={dataSource} count={allLogs.length} />
          {incidentLogs.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-red-400 font-medium">{errorCount} ERROR</span>
              <span className="text-yellow-400 font-medium">{warnCount} WARN</span>
              <span>{incidentLogs.length} total</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <label
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition-colors ${
              isLoading
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30'
            }`}
          >
            <Upload size={12} />
            {isLoading ? 'Loading…' : csvLogs ? 'Replace CSV' : 'Load CSV'}
            <input
              type="file"
              accept=".csv"
              className="hidden"
              disabled={isLoading}
              onChange={handleFileChange}
            />
          </label>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-1 rounded text-gray-500 hover:text-gray-300 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Upload error */}
      {uploadError && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
          <AlertTriangle size={12} />
          {uploadError}
        </div>
      )}

      {/* CSV hint */}
      {!csvLogs && (
        <p className="text-xs text-gray-500 mb-3">
          Showing built-in synthetic logs. Load a compatible CSV from{' '}
          <code className="text-gray-400">src/data/raw/kubernetes_logs.csv</code>{' '}
          or export your <code className="text-gray-400">.numbers</code> file to CSV to use that controlled dataset.
        </p>
      )}

      {/* Log table */}
      {expanded && (
        <>
          {incidentLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No log entries matched this incident in the{' '}
              {dataSource === 'csv' ? 'uploaded CSV' : 'built-in dataset'}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-500">
                    <th className="pb-2 text-left font-medium pr-3 whitespace-nowrap">Timestamp</th>
                    <th className="pb-2 text-left font-medium pr-3 whitespace-nowrap">Source</th>
                    <th className="pb-2 text-left font-medium pr-3 whitespace-nowrap">Level</th>
                    <th className="pb-2 text-left font-medium pr-3 whitespace-nowrap hidden md:table-cell">Pod</th>
                    <th className="pb-2 text-left font-medium pr-3 whitespace-nowrap hidden lg:table-cell">Status</th>
                    <th className="pb-2 text-left font-medium pr-3 whitespace-nowrap hidden lg:table-cell">Latency</th>
                    <th className="pb-2 text-left font-medium">Message</th>
                    <th className="pb-2 text-left font-medium hidden xl:table-cell">Trace ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {incidentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-gray-800/30 transition-colors group"
                    >
                      <td className="py-1.5 pr-3 text-gray-500 whitespace-nowrap">
                        {log.timestamp.replace('T', ' ').replace('Z', '')}
                      </td>
                      <td className="py-1.5 pr-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            SOURCE_STYLE[log.source] ?? 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {log.source}
                        </span>
                      </td>
                      <td className={`py-1.5 pr-3 font-bold ${LOG_LEVEL_STYLE[log.log_level] ?? 'text-gray-400'}`}>
                        {log.log_level}
                      </td>
                      <td className="py-1.5 pr-3 text-gray-400 hidden md:table-cell whitespace-nowrap">
                        {truncate(log.pod, 36)}
                      </td>
                      <td className="py-1.5 pr-3 hidden lg:table-cell">
                        {log.status_code != null ? (
                          <span
                            className={
                              log.status_code >= 500
                                ? 'text-red-400'
                                : log.status_code >= 400
                                ? 'text-yellow-400'
                                : 'text-green-400'
                            }
                          >
                            {log.status_code}
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="py-1.5 pr-3 text-gray-400 hidden lg:table-cell">
                        {log.latency_ms != null ? (
                          <span className={log.latency_ms > 5000 ? 'text-red-400' : log.latency_ms > 1000 ? 'text-yellow-400' : ''}>
                            {log.latency_ms}ms
                          </span>
                        ) : (
                          <span className="text-gray-600">—</span>
                        )}
                      </td>
                      <td className="py-1.5 pr-3 text-gray-300 max-w-md">
                        <span className="group-hover:whitespace-normal whitespace-nowrap overflow-hidden block max-w-xs xl:max-w-lg truncate group-hover:max-w-none">
                          {log.message}
                        </span>
                      </td>
                      <td className="py-1.5 text-gray-600 hidden xl:table-cell whitespace-nowrap">
                        {truncate(log.trace_id, 24)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
