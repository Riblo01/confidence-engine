export type SimulationStatus = 'pending' | 'processing' | 'completed' | 'warning' | 'blocked';

export interface SimulationStage {
  id: string;
  label: string;
  input: string;
  processingMessage: string;
  output: string;
  warnings: string[];
  confidenceImpact: number;
  nextAvailableActions: string[];
}

export interface SimulationScenario {
  id: string;
  label: string;
  templateId: string;
  generatedOutput: string;
  sourceContext: string;
  evidenceSources: string[];
  expectedRisks: string[];
  finalDecision: 'Trusted' | 'Needs Human Review' | 'Low Confidence' | 'Unsafe / Blocked';
  finalScore: number;
  finalRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  recommendedAction: string;
  stages: SimulationStage[];
}

const baseStages: SimulationStage[] = [
  {
    id: 'receiving_input',
    label: 'Input Received',
    input: 'Generated output and source context',
    processingMessage: 'Receiving AI output and normalizing the request.',
    output: 'Confidence input contract created.',
    warnings: [],
    confidenceImpact: 8,
    nextAvailableActions: ['Parse context', 'Select evaluation template'],
  },
  {
    id: 'parsing_context',
    label: 'Context Parsed',
    input: 'Use case, output type, source context and risk policy',
    processingMessage: 'Mapping the output to the selected evaluation template.',
    output: 'Domain and required evidence identified.',
    warnings: [],
    confidenceImpact: 10,
    nextAvailableActions: ['Collect evidence', 'Check required fields'],
  },
  {
    id: 'validating_evidence',
    label: 'Evidence Validation',
    input: 'Logs, tickets, traces, policies, tests or security telemetry',
    processingMessage: 'Matching output claims against independent evidence.',
    output: 'Evidence coverage calculated.',
    warnings: ['Some evidence may be missing or incomplete.'],
    confidenceImpact: 18,
    nextAvailableActions: ['Score dimensions', 'Flag missing evidence'],
  },
  {
    id: 'evaluating_dimensions',
    label: 'Confidence Evaluation',
    input: 'Configured dimensions and weights',
    processingMessage: 'Scoring evidence quality, consistency, completeness and actionability.',
    output: 'Weighted confidence dimensions evaluated.',
    warnings: [],
    confidenceImpact: 22,
    nextAvailableActions: ['Detect contradictions', 'Calculate score'],
  },
  {
    id: 'detecting_risks',
    label: 'Risk Detection',
    input: 'Contradictions, missing signals and downgrade rules',
    processingMessage: 'Looking for evidence that conflicts with the generated output.',
    output: 'Risk indicators and downgrade rules resolved.',
    warnings: ['Contradiction check can downgrade the final decision.'],
    confidenceImpact: -8,
    nextAvailableActions: ['Generate trust decision', 'Route review'],
  },
  {
    id: 'generating_decision',
    label: 'Trust Decision',
    input: 'Score, rules, risks and missing evidence',
    processingMessage: 'Converting confidence evaluation into an action decision.',
    output: 'Trust decision generated.',
    warnings: [],
    confidenceImpact: 20,
    nextAvailableActions: ['Approve', 'Review', 'Block', 'Escalate'],
  },
  {
    id: 'capturing_feedback',
    label: 'Human Feedback',
    input: 'Reviewer decision and correction labels',
    processingMessage: 'Capturing human judgment as structured learning data.',
    output: 'Feedback signal stored.',
    warnings: [],
    confidenceImpact: 6,
    nextAvailableActions: ['Update memory', 'Improve template'],
  },
  {
    id: 'updating_learning_memory',
    label: 'Learning Update',
    input: 'Feedback, outcome and repeated pattern signals',
    processingMessage: 'Updating confidence memory and calibration history.',
    output: 'Future evaluations improved.',
    warnings: [],
    confidenceImpact: 4,
    nextAvailableActions: ['Run next evaluation', 'Audit decision'],
  },
];

function scenarioStages(overrides: Partial<Record<string, Partial<SimulationStage>>>): SimulationStage[] {
  return baseStages.map((stage) => ({ ...stage, ...(overrides[stage.id] ?? {}) }));
}

export const simulationScenarios: SimulationScenario[] = [
  {
    id: 'kubernetes_rca',
    label: 'Kubernetes RCA',
    templateId: 'kubernetes_rca',
    generatedOutput: 'Traffic drop is caused by a planned migration from nginx-frontend to nginx-frontend-v2.',
    sourceContext: 'Dynatrace problem detected zero traffic on the old service after a deployment event.',
    evidenceSources: ['Dynatrace problem', 'Prometheus metrics', 'Istio logs', 'Kubernetes deployment event'],
    expectedRisks: ['Migration owner not confirmed', 'False positive alert possible'],
    finalDecision: 'Trusted',
    finalScore: 89,
    finalRisk: 'Low',
    recommendedAction: 'Confirm migration ownership and close as planned change if approved.',
    stages: scenarioStages({}),
  },
  {
    id: 'support_response',
    label: 'Customer Support Response',
    templateId: 'customer_support',
    generatedOutput: 'Issue a full refund and keep the premium plan active for the next billing cycle.',
    sourceContext: 'Customer reported duplicate charge on an enterprise account.',
    evidenceSources: ['Ticket history', 'Billing record', 'Refund policy', 'Retention policy'],
    expectedRisks: ['Policy conflict', 'Missing approval evidence'],
    finalDecision: 'Needs Human Review',
    finalScore: 72,
    finalRisk: 'Medium',
    recommendedAction: 'Route to billing owner before sending response.',
    stages: scenarioStages({
      detecting_risks: {
        warnings: ['Retention promise conflicts with policy evidence.'],
        confidenceImpact: -18,
      },
    }),
  },
  {
    id: 'security_investigation',
    label: 'Security Investigation',
    templateId: 'soc_investigation',
    generatedOutput: 'Alert is a false positive caused by normal admin activity.',
    sourceContext: 'Privileged command executed on production host outside maintenance window.',
    evidenceSources: ['SIEM event', 'Endpoint telemetry', 'Threat intelligence', 'Change ticket search'],
    expectedRisks: ['Missing change ticket', 'Endpoint contradiction', 'Privilege escalation risk'],
    finalDecision: 'Low Confidence',
    finalScore: 46,
    finalRisk: 'High',
    recommendedAction: 'Escalate to SOC analyst and keep alert open.',
    stages: scenarioStages({
      validating_evidence: {
        warnings: ['Change ticket evidence is missing.'],
        confidenceImpact: 8,
      },
      detecting_risks: {
        warnings: ['Endpoint telemetry contradicts false-positive claim.'],
        confidenceImpact: -28,
      },
    }),
  },
  {
    id: 'compliance_review',
    label: 'Compliance Review',
    templateId: 'compliance_review',
    generatedOutput: 'Approve vendor onboarding because data residency requirements are satisfied.',
    sourceContext: 'Vendor stores customer metadata across multiple regions.',
    evidenceSources: ['Policy clause', 'Vendor architecture', 'Risk register', 'Audit trail'],
    expectedRisks: ['Missing region map', 'Open risk register item', 'No DPA exception approval'],
    finalDecision: 'Unsafe / Blocked',
    finalScore: 38,
    finalRisk: 'Critical',
    recommendedAction: 'Block recommendation and request compliance review.',
    stages: scenarioStages({
      validating_evidence: {
        warnings: ['Critical vendor architecture evidence is missing.'],
        confidenceImpact: 4,
      },
      detecting_risks: {
        warnings: ['Risk register conflicts with approval recommendation.'],
        confidenceImpact: -35,
      },
      generating_decision: {
        warnings: ['Blocking downgrade rule triggered.'],
      },
    }),
  },
  {
    id: 'code_review',
    label: 'Code Review',
    templateId: 'spec_to_code',
    generatedOutput: 'Generated code implements the checkout retry policy and updates payment handling.',
    sourceContext: 'Spec requires idempotent retries, test coverage and no duplicate charge risk.',
    evidenceSources: ['Spec', 'Acceptance criteria', 'Unit tests', 'Static analysis'],
    expectedRisks: ['Missing idempotency test', 'Partial requirement coverage'],
    finalDecision: 'Needs Human Review',
    finalScore: 76,
    finalRisk: 'Medium',
    recommendedAction: 'Request missing idempotency test before merge.',
    stages: scenarioStages({}),
  },
  {
    id: 'multi_agent',
    label: 'Multi-Agent Analysis',
    templateId: 'multi_agent_workflow',
    generatedOutput: 'Investigator, analyst and reviewer agree that the output is mostly correct with one unresolved policy gap.',
    sourceContext: 'Three-agent workflow generated a consolidated recommendation.',
    evidenceSources: ['Investigator notes', 'Analyst evidence map', 'Reviewer critique', 'Tool results'],
    expectedRisks: ['Inter-agent contradiction', 'Missing validation step'],
    finalDecision: 'Needs Human Review',
    finalScore: 81,
    finalRisk: 'Medium',
    recommendedAction: 'Resolve policy gap before approving the consolidated answer.',
    stages: scenarioStages({}),
  },
];
