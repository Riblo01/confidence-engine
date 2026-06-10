import type { TemplateDimension } from '../types';

// Dimensions whose example_score represents RISK (higher = worse).
// The template engine inverts them: contribution = 100 - example_score.
export const RISK_DIMENSION_IDS = new Set<string>([
  'contradiction_risk',
  'false_positive_risk',
  'security_risk',
  'inter_agent_contradiction',
]);

// The five reusable core dimensions. Every evaluation template starts from
// these; domain-specific dimensions are layered on top per use case.
export const coreDimensions: TemplateDimension[] = [
  {
    id: 'evidence_quality',
    name: 'Evidence Quality',
    type: 'core',
    enabled: true,
    weight: 30,
    example_score: 84,
    description: 'How much of the generated output is backed by independently verifiable evidence.',
    question_answered: 'Is the output backed by verifiable evidence?',
    measurement_method:
      'Each claim in the output is matched against evidence sources (logs, tests, documents, citations). Score = validated claims / total claims, weighted by claim impact.',
  },
  {
    id: 'consistency',
    name: 'Consistency',
    type: 'core',
    enabled: true,
    weight: 25,
    example_score: 88,
    description: 'Whether the output aligns with the source context and tells one coherent story.',
    question_answered: 'Does the output align with the source context and tell a coherent story?',
    measurement_method:
      'Cross-checks the output narrative against the source context (incident, spec, ticket). Penalizes internal contradictions, unsupported jumps, and context mismatches.',
  },
  {
    id: 'completeness',
    name: 'Completeness',
    type: 'core',
    enabled: true,
    weight: 20,
    example_score: 76,
    description: 'Whether the output covered the required evidence, requirements or signals for the use case.',
    question_answered: 'Did the output cover the required evidence, requirements or signals?',
    measurement_method:
      'The template defines required evidence per use case. Score = required items addressed / required items total. Missing critical items trigger warnings.',
  },
  {
    id: 'contradiction_risk',
    name: 'Contradiction Risk',
    type: 'core',
    enabled: true,
    weight: 15,
    example_score: 22,
    description: 'Whether any available evidence actively conflicts with the generated output.',
    question_answered: 'Is there evidence that conflicts with the generated output?',
    measurement_method:
      'Scans evidence sources for signals that contradict output claims. Higher risk lowers the score; risk above the downgrade threshold demotes the verdict one level.',
  },
  {
    id: 'actionability',
    name: 'Actionability',
    type: 'core',
    enabled: true,
    weight: 10,
    example_score: 81,
    description: 'Whether the recommendation is specific, safe and executable by the receiving team.',
    question_answered: 'Is the recommendation specific, safe and executable?',
    measurement_method:
      'Evaluates recommended actions for specificity (named targets, parameters), safety (blast radius, reversibility) and executability (permissions, prerequisites).',
  },
];

export function cloneCoreDimensions(): TemplateDimension[] {
  return coreDimensions.map((d) => ({ ...d }));
}
