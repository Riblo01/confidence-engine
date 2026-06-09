export type LogSource = 'kubernetes' | 'istio' | 'application';
export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface SyntheticLogEntry {
  id: string;
  timestamp: string;
  source: LogSource;
  namespace: string;
  service: string;
  pod: string;
  log_level: LogLevel;
  status_code: number | null;
  latency_ms: number | null;
  method: string | null;
  path: string | null;
  trace_id: string;
  span_id: string | null;
  message: string;
  incident_hint?: string;
}

export interface LogEvidenceMatch {
  claim: string;
  supporting_logs: SyntheticLogEntry[];
  coverage: 'full' | 'partial' | 'none';
}

export type LogDataSource = 'builtin' | 'csv';
