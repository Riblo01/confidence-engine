import type { LogDataSource } from '../types/logs';
import { Database, FileSpreadsheet, FileType2, TableProperties, ArrowRight } from 'lucide-react';

interface Props {
  dataSource: LogDataSource;
  totalLogs: number;
}

export default function DatasetProvenanceCard({ dataSource, totalLogs }: Props) {
  const usingCsv = dataSource === 'csv';

  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,17,23,0.94),rgba(8,10,15,0.98))] p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Dataset provenance</div>
          <h2 className="display-title mt-2 text-2xl">Controlled operational evidence</h2>
        </div>
        <span
          className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]"
          style={{
            background: usingCsv ? '#2563eb22' : '#a855f722',
            color: usingCsv ? '#93c5fd' : '#d8b4fe',
            borderColor: usingCsv ? '#2563eb55' : '#a855f755',
          }}
        >
          {usingCsv ? 'CSV loaded' : 'Built-in synthetic'}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Database size={16} color="#14b8a6" />
            Supported source
          </div>
          <p className="text-sm leading-7 text-slate-300">
            The project uses a synthetic Kubernetes and Istio dataset as its evidence layer. It does not train a model:
            it checks whether the agent RCA is supported by realistic operational signals.
          </p>
          <div className="mt-3 rounded-md border border-white/10 bg-black/20 p-3 text-xs leading-6 text-slate-300">
            <span className="font-semibold text-cyan-200">Source: </span>
            <span>kaggle.com/datasets/gymprathap/synthetic-kubernetes-and-istio-logs</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/8 p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-cyan-200">Valid inputs</div>
              <div className="mt-2 text-sm text-slate-200">Kaggle CSV or compatible extended CSV</div>
            </div>
            <div className="rounded-2xl border border-fuchsia-400/15 bg-fuchsia-400/8 p-3">
              <div className="text-xs uppercase tracking-[0.18em] text-fuchsia-200">Current state</div>
              <div className="mt-2 text-sm text-slate-200">{totalLogs.toLocaleString()} rows available for matching</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-300">
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">CSV</span>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">Telemetry</span>
            <ArrowRight size={14} className="text-slate-600" />
            <span className="rounded-md border border-white/10 bg-white/[0.04] px-3 py-2">Evidence Extraction</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <FileType2 size={16} color="#f59e0b" />
              Important
            </div>
            <p className="text-sm leading-7 text-slate-300">
              A <strong className="text-slate-100">.numbers</strong> file cannot be loaded directly. Export it to
              <strong className="text-slate-100"> CSV</strong>, then load it from the log evidence panel.
            </p>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <FileSpreadsheet size={16} color="#22c55e" />
              UI framing
            </div>
            <p className="text-sm leading-7 text-slate-300">
              The dataset is synthetic, controlled, and reusable. The interface presents it as operational test
              evidence for RCA validation, not as production data.
            </p>
          </div>

          <div className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <TableProperties size={16} color="#8b5cf6" />
              Expected columns
            </div>
            <p className="text-sm leading-7 text-slate-300">
              timestamp, pod_name, namespace, log_level, message, or the extended format with source, service, status_code, latency_ms.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
