import { AlertTriangle, Bot, CheckCircle2, UserCheck, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

const flow = [
  { label: 'Incident', Icon: AlertTriangle, color: '#f97316' },
  { label: 'AI Investigation', Icon: Bot, color: '#3b82f6' },
  { label: 'Confidence Validation', Icon: CheckCircle2, color: '#14b8a6' },
  { label: 'Human Decision', Icon: UserCheck, color: '#22c55e' },
];


// Research-grounded accuracy data (2024–2025 benchmarks)
// [1] Meta Engineering Blog — real production system, not a peer-reviewed paper
// [5] SynergyRCA removed — paper name/ID could not be verified
const researchRows = [
  { system: 'Meta Llama 2 — production system', accuracy: '42%', withValidation: false, ref: 1 },
  { system: 'AIOpsLab — GPT-4 (zero-shot)', accuracy: '49%', withValidation: false, ref: 2 },
  { system: 'AIOpsLab — ReAct agent', accuracy: '56%', withValidation: false, ref: 2 },
  { system: 'AIOpsLab — FLASH (best unvalidated)', accuracy: '59%', withValidation: false, ref: 2 },
  { system: 'RCAEval — ceiling (no specialized method)', accuracy: '52%', withValidation: false, ref: 3 },
  { system: 'LLMRCA — causal graph + verification', accuracy: '93%', withValidation: true, ref: 4 },
  { system: 'ARGUS — specialized validation agent', accuracy: '66%', withValidation: true, ref: 2 },
];

const references = [
  {
    id: 1,
    authors: 'Meta Engineering',
    year: '2024',
    title: 'Leveraging AI for efficient incident response',
    venue: 'Engineering at Meta (tech blog) · June 24, 2024',
    url: 'https://engineering.fb.com/2024/06/24/data-infrastructure/leveraging-ai-for-efficient-incident-response/',
    note: 'Industry blog post — not peer-reviewed',
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

      {/* ── Baseline comparison panel ── */}
      <div className="bc-panel">

        {/* Before card */}
        <div className="bc-card bc-card--before">
          <div className="bc-card-eyebrow">Without validation layer</div>
          <div className="bc-score bc-score--red">
            <span className="bc-score-num">42</span>
            <span className="bc-score-sep">–</span>
            <span className="bc-score-num">59%</span>
          </div>
          <p className="bc-card-desc">Accuracy range across production systems and benchmarks (2024–2025) for AI-generated RCA.</p>
          <div className="bc-studies">
            {[
              { label: 'Meta Llama 2 (prod)', val: '42%', ref: 1 },
              { label: 'AIOpsLab GPT-4', val: '49%', ref: 2 },
              { label: 'AIOpsLab ReAct', val: '56%', ref: 2 },
              { label: 'AIOpsLab FLASH', val: '59%', ref: 2 },
              { label: 'RCAEval ceiling', val: '52%', ref: 3 },
            ].map((s) => (
              <div key={s.label} className="bc-study-row">
                <span className="bc-study-label">{s.label}</span>
                <span className="bc-study-val bc-study-val--red">{s.val}</span>
                <span className="bc-study-ref">[{s.ref}]</span>
              </div>
            ))}
          </div>
          <div className="bc-card-footer">
            <AlertTriangle size={12} />
            <span>A raw AI RCA lacks evidence validation, contradiction detection, and completeness checks.</span>
          </div>
        </div>

        {/* Central gain indicator */}
        <div className="bc-gain-col">
          <div className="bc-gain-line" />
          <div className="bc-gain-badge">
            <TrendingUp size={18} />
            <span className="bc-gain-pp">+27 pp</span>
            <span className="bc-gain-sub">avg improvement</span>
          </div>
          <div className="bc-gain-line" />
        </div>

        {/* After card */}
        <div className="bc-card bc-card--after">
          <div className="bc-card-eyebrow bc-eyebrow--green">With validation layer</div>
          <div className="bc-score bc-score--green">
            <span className="bc-score-num">66</span>
            <span className="bc-score-sep">–</span>
            <span className="bc-score-num">93%</span>
          </div>
          <p className="bc-card-desc">Accuracy range with causal verification, evidence scoring, and specialized agent validation.</p>
          <div className="bc-studies">
            {[
              { label: 'LLMRCA (causal graph)', val: '93%', ref: 4 },
              { label: 'ARGUS (specialized agent)', val: '66%', ref: 2 },
            ].map((s) => (
              <div key={s.label} className="bc-study-row">
                <span className="bc-study-label">{s.label}</span>
                <span className="bc-study-val bc-study-val--green">{s.val}</span>
                <span className="bc-study-ref">[{s.ref}]</span>
              </div>
            ))}
          </div>
          <div className="bc-card-footer bc-footer--green">
            <CheckCircle2 size={12} />
            <span>Adds independent evidence validation, contradiction detection, and telemetry completeness checks.</span>
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
                {'note' in ref && ref.note && (
                  <span className="bib-note"> ⚠ {ref.note}</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
