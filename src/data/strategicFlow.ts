export interface StrategicFlowStage {
  id: string;
  label: string;
  caption: string;
  stepIds: string[];
  input: string;
  engineAction: string;
  output: string;
  color: string;
}

export const strategicFlowStages: StrategicFlowStage[] = [
  {
    id: 'input',
    label: 'Input',
    caption: 'Generated output + context',
    stepIds: ['product-flow', 'use-cases', 'k8s-demo'],
    input: 'RCA, support answer, compliance recommendation, security summary or code output.',
    engineAction: 'Normalize the generated output with source context, evidence and risk policy.',
    output: 'Structured confidence evaluation request.',
    color: '#60a5fa',
  },
  {
    id: 'evaluation',
    label: 'Confidence Evaluation',
    caption: 'Evidence and risk checks',
    stepIds: ['configuration-studio', 'confidence-evaluation'],
    input: 'Template, dimensions, weights, evidence requirements and available signals.',
    engineAction: 'Validate evidence, check consistency, detect contradictions and score completeness.',
    output: 'Confidence score, risk indicators and triggered rules.',
    color: '#2dd4bf',
  },
  {
    id: 'decision',
    label: 'Trust Decision',
    caption: 'Action routing',
    stepIds: ['confidence-evaluation'],
    input: 'Score, missing evidence, contradictions and downgrade rules.',
    engineAction: 'Route the output to Trusted, Needs Review, Low Confidence or Unsafe / Blocked.',
    output: 'Recommended next action.',
    color: '#f59e0b',
  },
  {
    id: 'human',
    label: 'Human Validation',
    caption: 'Approval or correction',
    stepIds: ['learning-governance'],
    input: 'Decision record, evidence, recommendation and reviewer context.',
    engineAction: 'Capture approval, rejection, correction or missing-evidence feedback.',
    output: 'Structured human feedback signal.',
    color: '#a78bfa',
  },
  {
    id: 'learning',
    label: 'Learning Loop',
    caption: 'Memory and calibration',
    stepIds: ['learning-governance'],
    input: 'Feedback signals, repeated patterns, audit trail and outcomes.',
    engineAction: 'Update confidence memory, extract patterns and evolve templates.',
    output: 'Better future evaluations and enterprise knowledge.',
    color: '#22c55e',
  },
];

export function getStrategicStageForStep(stepId: string): StrategicFlowStage {
  return (
    strategicFlowStages.find((stage) => stage.stepIds.includes(stepId)) ??
    strategicFlowStages[0]
  );
}
