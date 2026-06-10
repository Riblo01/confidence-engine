import { FileJson } from 'lucide-react';

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
  );
}
