import { AlertTriangle, Eye, FileText, ListChecks, Search, ShieldCheck } from 'lucide-react';

const evidenceSources = [
  'Dynatrace problem details',
  'Loki logs',
  'Tempo traces',
  'Prometheus metrics',
  'Kubernetes events',
  'Pod restarts',
  'Rollouts and autoscaling',
];

const correlationKeys = [
  'trace_id',
  'span_id',
  'pod name',
  'deployment name',
  'namespace',
  'transactionId',
];

const outputSections = [
  'Incident Summary',
  'Timeline',
  'Findings',
  'Logs Analysis',
  'Traces Analysis',
  'Kubernetes Analysis',
  'Metrics Analysis',
  'Root Cause Analysis',
  'Confidence Level',
  'Recommended Actions',
];

export default function PromptContractCard() {
  return (
    <div className="prompt-contract">
      <div className="prompt-contract-header">
        <div>
          <div className="eyebrow">Analysis prompt contract</div>
          <h3>Kubernetes SRE RCA Analysis Prompt</h3>
        </div>
        <span>Internal prompt</span>
      </div>

      <div className="prompt-callout">
        <ShieldCheck size={18} />
        <p>
          Act as a senior SRE and identify the most probable root cause using all available
          observability sources. Do not assume root cause without evidence.
        </p>
      </div>

      <div className="prompt-grid">
        <article>
          <div className="prompt-card-title">
            <Search size={15} />
            Evidence to retrieve
          </div>
          <div className="prompt-chip-list">
            {evidenceSources.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>

        <article>
          <div className="prompt-card-title">
            <Eye size={15} />
            Correlation keys
          </div>
          <div className="prompt-chip-list">
            {correlationKeys.map((item) => <span key={item}>{item}</span>)}
          </div>
        </article>

        <article>
          <div className="prompt-card-title">
            <AlertTriangle size={15} />
            Priority signals
          </div>
          <ul>
            <li>ERROR and WARN logs</li>
            <li>exceptions and dependency failures</li>
            <li>CPU throttling, memory pressure, OOMKilled</li>
            <li>latency spikes and HTTP 4xx/5xx errors</li>
          </ul>
        </article>

        <article>
          <div className="prompt-card-title">
            <ListChecks size={15} />
            Required distinction
          </div>
          <ul>
            <li>symptoms</li>
            <li>correlated events</li>
            <li>inferred hypotheses</li>
            <li>validated findings</li>
          </ul>
        </article>
      </div>

      <div className="prompt-output">
        <div className="prompt-card-title">
          <FileText size={15} />
          Expected output structure
        </div>
        <div className="prompt-output-grid">
          {outputSections.map((section) => <span key={section}>{section}</span>)}
        </div>
      </div>
    </div>
  );
}
