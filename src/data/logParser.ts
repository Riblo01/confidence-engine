import type { SyntheticLogEntry, LogEvidenceMatch, LogDataSource } from '../types/logs';
import { builtinLogs } from './syntheticLogs';

// ── CSV Parser ────────────────────────────────────────────────────────────────

// Derive service name from pod_name by stripping trailing -NN replica suffix.
// "backend-api-02" → "backend-api"  |  "payments-11" → "payments"
function serviceFromPod(podName: string): string {
  return podName.replace(/-\d+$/, '');
}

// Infer log source from pod name and message.
function inferSource(pod: string, msg: string): SyntheticLogEntry['source'] {
  const lc = pod.toLowerCase();
  if (lc.includes('nginx') || lc.includes('istio') || lc.includes('envoy')) return 'istio';
  if (msg.includes('HTTP') || msg.includes('GET ') || msg.includes('POST ')) return 'application';
  if (msg.match(/pod|node|kubelet|container|evict|oomkill|imagepu/i)) return 'kubernetes';
  return 'application';
}

// Extract latency_ms from patterns like "in 307ms", "after 6426ms", "in 201ms".
function extractLatency(msg: string): number | null {
  const m = msg.match(/(?:in|after)\s+(\d+)\s*ms/i);
  return m ? parseInt(m[1], 10) : null;
}

// Extract HTTP status code from patterns like "Completed 200 POST", "status=200", "200 OK".
function extractStatus(msg: string): number | null {
  const m = msg.match(/(?:Completed|status[=:])\s*(\d{3})\b/) ?? msg.match(/\b([245]\d{2})\b/);
  return m ? parseInt(m[1], 10) : null;
}

// Extract HTTP method + path from patterns like "POST /checkout", "GET /api/v1/orders".
function extractMethodPath(msg: string): { method: string | null; path: string | null } {
  const m = msg.match(/\b(GET|POST|PUT|PATCH|DELETE)\s+(\/\S+)/);
  return m ? { method: m[1], path: m[2] } : { method: null, path: null };
}

// ── Kaggle schema: timestamp, pod_name, namespace, log_level, message ─────────
function kaggleRowToLog(row: string[], headers: string[], index: number): SyntheticLogEntry | null {
  const cell = (col: string): string => {
    const i = headers.indexOf(col);
    return i >= 0 ? (row[i] ?? '').trim() : '';
  };

  const pod = cell('pod_name') || 'unknown';
  const msg = cell('message') || '';
  const log_level = cell('log_level').toUpperCase();
  const { method, path } = extractMethodPath(msg);

  return {
    id: `csv-${String(index + 1).padStart(5, '0')}`,
    timestamp: cell('timestamp') || new Date().toISOString(),
    source: inferSource(pod, msg),
    namespace: cell('namespace') || 'unknown',
    service: serviceFromPod(pod),
    pod,
    log_level: (['DEBUG', 'INFO', 'WARN', 'ERROR'].includes(log_level)
      ? log_level
      : 'INFO') as SyntheticLogEntry['log_level'],
    status_code: extractStatus(msg),
    latency_ms: extractLatency(msg),
    method,
    path,
    trace_id: `kaggle-${String(index + 1).padStart(5, '0')}`,
    span_id: null,
    message: msg,
  };
}

// ── Extended schema: our 13-column format ─────────────────────────────────────
function extendedRowToLog(row: string[], headers: string[], index: number): SyntheticLogEntry | null {
  const cell = (col: string): string => {
    const i = headers.indexOf(col);
    return i >= 0 ? (row[i] ?? '').trim() : '';
  };

  const nullStr = (s: string) =>
    s === '' || s.toLowerCase() === 'null' || s.toLowerCase() === 'none' ? null : s;

  const source = cell('source').toLowerCase();
  const log_level = cell('log_level').toUpperCase();

  return {
    id: `csv-${String(index + 1).padStart(5, '0')}`,
    timestamp: cell('timestamp') || new Date().toISOString(),
    source: (['kubernetes', 'istio', 'application'].includes(source)
      ? source
      : 'application') as SyntheticLogEntry['source'],
    namespace: cell('namespace') || 'unknown',
    service: cell('service') || 'unknown',
    pod: cell('pod') || 'unknown',
    log_level: (['DEBUG', 'INFO', 'WARN', 'ERROR'].includes(log_level)
      ? log_level
      : 'INFO') as SyntheticLogEntry['log_level'],
    status_code: nullStr(cell('status_code')) ? parseInt(cell('status_code'), 10) : null,
    latency_ms: nullStr(cell('latency_ms')) ? parseInt(cell('latency_ms'), 10) : null,
    method: nullStr(cell('method')),
    path: nullStr(cell('path')),
    trace_id: cell('trace_id') || `csv-trace-${index}`,
    span_id: nullStr(cell('span_id')),
    message: cell('message') || '',
    incident_hint: nullStr(cell('incident_hint')) ?? undefined,
  };
}

// Minimal CSV parser — handles quoted fields with commas inside.
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

// Auto-detect schema: Kaggle (has pod_name) vs extended (has source + pod).
function isKaggleSchema(headers: string[]): boolean {
  return headers.includes('pod_name') && !headers.includes('source');
}

export function parseCSV(csvText: string): SyntheticLogEntry[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
  const kaggle = isKaggleSchema(headers);
  const entries: SyntheticLogEntry[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const entry = kaggle
      ? kaggleRowToLog(row, headers, i - 1)
      : extendedRowToLog(row, headers, i - 1);
    if (entry) entries.push(entry);
  }

  return entries;
}

// ── Incident Matching ─────────────────────────────────────────────────────────

// Keywords matched against the full haystack:
//   log.incident_hint + log.namespace + log.service + log.pod + log.message
//
// Two groups per incident:
//   - Specific: exact field values from our built-in logs
//   - Generic:  message-content patterns present in the Kaggle dataset
const INCIDENT_KEYWORDS: Record<string, string[]> = {
  // Deployment Migration / Canary — Kaggle: graceful shutdown, nginx rolling, deployment traffic
  'P-260552295': [
    'P-260552295', 'ch-ms-transactional', 'super-app-p-pdn', 'virtualservice', 'rollout',
    // Kaggle patterns
    'graceful shutdown', 'nginx-frontend', 'rolling update', 'deployment complete',
  ],
  // OOMKilled / Memory Exhaustion — Kaggle: "OOMKilled", "out-of-memory", payments pod
  'P-260578120': [
    'P-260578120', 'payment-service', 'payments-pdn', 'heap', 'exit code: 137',
    // Kaggle patterns
    'oomkilled', 'out-of-memory', 'outofmemory',
  ],
  // Redis Saturation / Cache Timeout — Kaggle: "timeout while calling db", "cache"
  'P-260564952': [
    'P-260564952', 'product-catalog', 'catalog-pdn', 'redis', 'connection pool', 'etimedout',
    // Kaggle patterns
    'request timeout', 'cache hit', 'cache miss', 'timeout after', 'calling db',
  ],
  // HPA Max Replicas / Resource Exhaustion — Kaggle: payments errors, ImagePullBackOff
  'P-260590331': [
    'P-260590331', 'payment-gateway', 'hpa', 'max replicas', 'scalinglimited',
    'karpenter', 'insufficient cpu', 'nodepool',
    // Kaggle patterns
    'imagepullbackoff', 'insufficient', 'payments-',
  ],
  // Node Memory Pressure / Pod Evictions — Kaggle: OOMKilled from any pod, eviction
  'P-260601882': [
    'P-260601882', 'memorypressure', 'ip-10-0-14-87',
    // Kaggle patterns — OOMKilled appears on backend-api pods in Kaggle
    'oomkilled', 'out-of-memory', 'evict', 'evicted', 'backend-api',
  ],
  // RabbitMQ Consumer Backlog — Kaggle: orders/auth timeout, database deadlock
  'P-260612740': [
    'P-260612740', 'notification-consumer', 'messaging-pdn', 'rabbitmq', 'sendgrid',
    // Kaggle patterns
    'database deadlock', 'rolling back', 'orders-', 'request timeout',
  ],
  // CrashLoopBackOff / Failed Deployment — Kaggle: ImagePullBackOff, auth-service failures
  'P-260623900': [
    'P-260623900', 'account-service', 'accounts-pdn', 'db_password', 'account-db-secret', 'argocd',
    // Kaggle patterns
    'imagepullbackoff', 'crashloopbackoff', 'failed to pull', 'auth-service',
  ],
};

function logMatchesIncident(log: SyntheticLogEntry, problemId: string): boolean {
  const keywords = INCIDENT_KEYWORDS[problemId];
  if (!keywords) return false;

  const haystack = [
    log.incident_hint ?? '',
    log.namespace,
    log.service,
    log.pod,
    log.message,
  ]
    .join(' ')
    .toLowerCase();

  return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

export function filterLogsForIncident(
  logs: SyntheticLogEntry[],
  problemId: string,
  maxLogs = 30,
): SyntheticLogEntry[] {
  return logs.filter((l) => logMatchesIncident(l, problemId)).slice(0, maxLogs);
}

// ── Evidence Claim Mapping ────────────────────────────────────────────────────

// Simple heuristic: a claim is "covered" if ≥1 log supports it.
const CLAIM_LOG_SIGNALS: Record<string, string[]> = {
  // Common keywords extracted from claim text → log message patterns
  oomkill: ['oomkill', 'exit code: 137', 'memory limit', 'outofmemory'],
  'memory limit': ['512mi', 'heap', 'memory limit', 'outofmemory'],
  'redis timeout': ['redis', 'timeout', 'connection pool', 'etimedout'],
  'connection pool': ['connection pool', 'maxconn', 'pool exhausted'],
  'hpa max': ['max replicas', 'hpa', 'scalinglimited'],
  karpenter: ['karpenter', 'nodepool', 'node provisioning'],
  eviction: ['evict', 'memorypressure', 'node low on resource'],
  'crashloopbackoff': ['crashloopbackoff', 'crash', 'back-off restarting'],
  secret: ['secret', 'db_password', 'not found'],
  rollout: ['rollout', 'deployment', 'v2', 'migration'],
  rabbitmq: ['rabbitmq', 'queue', 'consumer'],
  sendgrid: ['sendgrid', 'smtp', 'email', 'notification'],
};

function claimKeywords(claim: string): string[] {
  const lc = claim.toLowerCase();
  const matches: string[] = [];
  for (const [key, signals] of Object.entries(CLAIM_LOG_SIGNALS)) {
    if (lc.includes(key)) matches.push(...signals);
  }
  // Also add raw words from the claim (>5 chars)
  const words = lc.match(/\b\w{5,}\b/g) ?? [];
  matches.push(...words);
  return matches;
}

function logSupportsClaimText(log: SyntheticLogEntry, claim: string): boolean {
  const keywords = claimKeywords(claim);
  if (keywords.length === 0) return false;
  const haystack = log.message.toLowerCase();
  return keywords.some((kw) => haystack.includes(kw));
}

export function mapLogsToEvidenceClaims(
  logs: SyntheticLogEntry[],
  claims: string[],
): LogEvidenceMatch[] {
  return claims.map((claim) => {
    const supporting = logs.filter((log) => logSupportsClaimText(log, claim));
    return {
      claim,
      supporting_logs: supporting.slice(0, 5),
      coverage:
        supporting.length >= 2
          ? 'full'
          : supporting.length === 1
          ? 'partial'
          : 'none',
    };
  });
}

// ── Data Source Helper ────────────────────────────────────────────────────────

export function getActiveLogs(
  csvLogs: SyntheticLogEntry[] | null,
): { logs: SyntheticLogEntry[]; source: LogDataSource } {
  if (csvLogs && csvLogs.length > 0) {
    return { logs: csvLogs, source: 'csv' };
  }
  return { logs: builtinLogs, source: 'builtin' };
}
