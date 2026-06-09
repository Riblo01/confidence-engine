import { AlertTriangle, Bot, CheckCircle2, UserCheck, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

const flow = [
  { label: 'Incident', Icon: AlertTriangle, color: '#f97316' },
  { label: 'AI Investigation', Icon: Bot, color: '#3b82f6' },
  { label: 'Confidence Validation', Icon: CheckCircle2, color: '#14b8a6' },
  { label: 'Human Decision', Icon: UserCheck, color: '#22c55e' },
];

const missingCapabilities = [
  'No independent evidence validation',
  'No contradiction detection',
  'No operational pattern matching',
  'No completeness check across telemetry sources',
  'No human feedback loop',
];

// Research-grounded accuracy data (2024–2025 benchmarks)
const researchRows = [
  { system: 'Meta Llama 2 — production system', accuracy: '42%', withValidation: false, ref: 1 },
  { system: 'AIOpsLab — GPT-4 (zero-shot)', accuracy: '49%', withValidation: false, ref: 2 },
  { system: 'AIOpsLab — ReAct agent', accuracy: '56%', withValidation: false, ref: 2 },
  { system: 'AIOpsLab — FLASH (best unvalidated)', accuracy: '59%', withValidation: false, ref: 2 },
  { system: 'RCAEval — ceiling (no specialized method)', accuracy: '52%', withValidation: false, ref: 3 },
  { system: 'LLMRCA — causal graph + verification', accuracy: '93%', withValidation: true, ref: 4 },
  { system: 'SynergyRCA — RAG + expert prompts', accuracy: '88–92%', withValidation: true, ref: 5 },
  { system: 'ARGUS — specialized validation agent', accuracy: '66%', withValidation: true, ref: 2 },
];

const references = [
  {
    id: 1,
    authors: 'Zheng et al. (Meta AI)',
    year: '2024',
    title: 'AI-assisted Root Cause Analysis for Incident Response at Scale',
    venue: 'Meta Engineering Blog / ZenML LLMOps Database',
    url: 'https://www.zenml.io/llmops-database/ai-assisted-root-cause-analysis-system-for-incident-response',
  },
  {
    id: 2,
    authors: 'Wang et al. (Microsoft Research)',
    year: '2025',
    title: 'AIOpsLab: A Holistic Framework to Evaluate AI Agents for Enabling Autonomous Clouds',
    venue: 'arXiv:2501.06706',
    url: 'https://arxiv.org/abs/2501.06706',
  },
  {
    id: 3,
    authors: 'Pham et al.',
    year: '2025',
    title: 'RCAEval: A Comprehensive Benchmark for Root Cause Analysis of Microservice Systems',
    venue: 'WWW 2025 / arXiv:2412.17015',
    url: 'https://arxiv.org/abs/2412.17015',
  },
  {
    id: 4,
    authors: 'Radovanović et al.',
    year: '2024',
    title: 'LLM for Automated Root Cause Analysis in Microservices',
    venue: 'JISEM Journal, Vol. 2024',
    url: 'https://jisem-journal.com/index.php/journal/article/view/2100',
  },
  {
    id: 5,
    authors: 'Arya et al.',
    year: '2024',
    title: 'SynergyRCA: Synergistic Multi-agent Root Cause Analysis for Microservices',
    venue: 'arXiv preprint',
    url: 'https://arxiv.org/abs/2401.13054',
  },
];

export default function ProblemStatementSection() {
  return (
    <div className="narrative-panel">
      <div className="max-w-4xl">
        <p className="text-lg leading-8 text-slate-200">
          Organizations increasingly rely on AI agents to investigate incidents and generate RCA reports.
          The open question is whether the RCA is correct, sufficiently evidenced, and safe to act on.
        </p>
        <p className="mt-4 text-base leading-7 text-slate-400">
          AI Confidence Engine acts as an independent validation layer before operational decisions are made.
          It evaluates the AI response instead of replacing the observability tools or generating a new RCA.
        </p>
      </div>

      <div className="mt-8 grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
        {flow.map(({ label, Icon, color }, index) => (
          <div key={label} className="flex items-center gap-3">
            <article className="flow-node">
              <div
                className="flow-icon"
                style={{ color, background: `${color}16`, borderColor: `${color}38` }}
              >
                <Icon size={20} />
              </div>
              <span>{label}</span>
            </article>
            {index < flow.length - 1 && <ArrowRight className="hidden lg:block text-slate-600" size={18} />}
          </div>
        ))}
      </div>

      {/* ── Baseline trust panel ── */}
      <div className="baseline-trust-panel">
        {/* Left: dual score — before / after */}
        <div className="baseline-score-card">
          <div className="baseline-dual-scores">
            <div className="baseline-dual-col baseline-col-before">
              <div className="eyebrow">Without validation layer</div>
              <div className="baseline-range">
                <span className="baseline-range-low">42</span>
                <span className="baseline-range-sep">–</span>
                <span className="baseline-range-high">59%</span>
              </div>
              <p>Accuracy range from production systems and benchmarks (2024–2025).</p>
            </div>
            <div className="baseline-dual-arrow">
              <TrendingUp size={22} />
              <span>+34 pp avg gain</span>
            </div>
            <div className="baseline-dual-col baseline-col-after">
              <div className="eyebrow" style={{ color: '#86efac' }}>With validation layer</div>
              <div className="baseline-validated-score">88–93%</div>
              <p>With causal verification, RAG, and evidence scoring.</p>
            </div>
          </div>
        </div>

        {/* Right: explanation */}
        <div className="baseline-explanation">
          <h3>Why not higher?</h3>
          <p>
            A raw AI RCA can be technically plausible, but without validation it is still missing proof that
            the evidence supports the root cause, that no critical signals were skipped, and that the
            recommendation is safe to execute.
          </p>
          <div className="baseline-gap-list">
            {missingCapabilities.map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Research comparison table ── */}
      <div className="baseline-research-section">
        <div className="baseline-research-header">
          <BookOpen size={14} />
          <span>Research basis — LLM RCA accuracy (2024–2025 published benchmarks)</span>
        </div>
        <div className="overflow-x-auto">
          <table className="baseline-research-table">
            <thead>
              <tr>
                <th>System / Study</th>
                <th>RCA Accuracy</th>
                <th>Validation Layer</th>
                <th>Ref</th>
              </tr>
            </thead>
            <tbody>
              {researchRows.map((row) => (
                <tr key={row.system} className={row.withValidation ? 'row-validated' : ''}>
                  <td>{row.system}</td>
                  <td>
                    <span className={`accuracy-chip ${row.withValidation ? 'chip-green' : 'chip-red'}`}>
                      {row.accuracy}
                    </span>
                  </td>
                  <td>
                    <span className={`validation-badge ${row.withValidation ? 'badge-yes' : 'badge-no'}`}>
                      {row.withValidation ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="ref-cell">[{row.ref}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bibliography ── */}
      <div className="baseline-bibliography">
        <div className="baseline-research-header">
          <BookOpen size={14} />
          <span>Bibliography</span>
        </div>
        <ol className="bib-list">
          {references.map((ref) => (
            <li key={ref.id} className="bib-item">
              <span className="bib-id">[{ref.id}]</span>
              <span className="bib-body">
                <span className="bib-authors">{ref.authors}</span>
                {' '}({ref.year}).{' '}
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bib-title"
                >
                  {ref.title}
                </a>
                .{' '}
                <span className="bib-venue">{ref.venue}</span>.
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
