import { ArrowRight, Bot, ChevronDown, FileJson, ScrollText, Search, Settings2, ShieldCheck } from 'lucide-react';

const integrationFlow = [
  { label: 'Your AI agent', detail: 'generates an answer', Icon: Bot, color: '#9da7b3' },
  { label: 'Input contract', detail: 'one standard JSON', Icon: FileJson, color: '#79c0ff' },
  { label: 'Confidence Engine', detail: 'evaluates it', Icon: ShieldCheck, color: '#2dd4bf' },
  { label: 'Trust decision', detail: 'trusted · review · blocked', Icon: ScrollText, color: '#f59e0b' },
];

const contractQuestions = [
  {
    question: 'What is being evaluated?',
    answer: 'The AI-generated answer, plus the original problem it was responding to — so consistency can be checked against what was actually asked.',
    fields: ['generated_output', 'source_context'],
    Icon: Search,
    color: '#79c0ff',
  },
  {
    question: 'Against what evidence?',
    answer: 'Independent logs, metrics, traces or documents. The answer is verified against real signals — never against the AI\'s own claims.',
    fields: ['evidence_sources'],
    Icon: ScrollText,
    color: '#7ee787',
  },
  {
    question: 'Under which rules?',
    answer: 'The domain template picks the scoring dimensions, and the risk policy sets when a human must review. Change the rules — never the engine.',
    fields: ['use_case_id', 'evaluation_template', 'risk_policy'],
    Icon: Settings2,
    color: '#f59e0b',
  },
];

const contractFields = [
  {
    key: 'use_case_id',
    meaning: 'Defines which evaluation template should be loaded.',
    example: '"kubernetes_rca" | "spec_to_code" | "soc_investigation"',
    why: 'Routes the evaluation to the right dimensions, weights and rules.',
  },
  {
    key: 'generated_output',
    meaning: 'The AI-generated answer, RCA, code, report or recommendation to evaluate.',
    example: '{ root_cause: "Memory limit exceeded...", actions: [...] }',
    why: 'This is the artifact under evaluation — the engine never generates it.',
  },
  {
    key: 'source_context',
    meaning: 'The original incident, ticket, spec, alert, document or business context.',
    example: '{ problem_id: "P-260578120", severity: "availability", ... }',
    why: 'Consistency is measured against what was actually asked or observed.',
  },
  {
    key: 'evidence_sources',
    meaning: 'Logs, metrics, traces, tests, documents, citations, tickets, alerts or code scans.',
    example: '[{ type: "logs", uri: "..." }, { type: "metrics", uri: "..." }]',
    why: 'Evidence quality and contradiction checks need independent sources.',
  },
  {
    key: 'evaluation_template',
    meaning: 'Defines dimensions, weights, thresholds and rules.',
    example: '{ dimensions: [...], thresholds: { trusted: 85, review: 65 } }',
    why: 'Makes confidence measurement configurable per domain — without core changes.',
  },
  {
    key: 'risk_policy',
    meaning: 'Defines when human review is required.',
    example: '{ require_review_below: 85, block_execution_below: 65 }',
    why: 'Encodes the organization\'s risk appetite into the trust decision.',
  },
];

export default function InputContractSection() {
  return (
    <div className="contract-story">
      <div className="max-w-4xl">
        <h3 className="contract-story-title">One JSON in. One trust decision out.</h3>
        <p className="contract-story-lead">
          Integrating the engine does not change your agents. They keep generating answers as they do
          today — the only addition is sending each answer through a single standard contract before
          anyone acts on it.
        </p>
      </div>

      <div className="contract-flow">
        {integrationFlow.map((step, i) => (
          <div key={step.label} className="contract-flow-item">
            <div className="contract-flow-node" style={{ '--node-color': step.color } as React.CSSProperties}>
              <step.Icon size={18} />
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </div>
            {i < integrationFlow.length - 1 && <ArrowRight size={16} className="contract-flow-arrow" />}
          </div>
        ))}
      </div>

      <div className="contract-q-grid">
        {contractQuestions.map((q) => (
          <div key={q.question} className="contract-q-card" style={{ '--q-color': q.color } as React.CSSProperties}>
            <div className="contract-q-head">
              <q.Icon size={15} />
              <h4>{q.question}</h4>
            </div>
            <p>{q.answer}</p>
            <div className="contract-q-fields">
              {q.fields.map((f) => (
                <code key={f}>{f}</code>
              ))}
            </div>
          </div>
        ))}
      </div>

      <details className="contract-details">
        <summary>
          <ChevronDown size={14} className="contract-details-chevron" />
          View the full field-by-field contract
        </summary>
        <div className="contract-block">
          <div className="contract-block-header flex items-center gap-2">
            <FileJson size={13} />
            confidence_input_contract.json
          </div>
          {contractFields.map((f) => (
            <div key={f.key} className="contract-field">
              <span className="contract-field-key">{f.key}</span>
              <span className="contract-field-meaning">{f.meaning}</span>
              <span className="contract-field-example">{f.example}</span>
              <span className="contract-field-why">Why: {f.why}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
