import type { AdaptivePilot } from '../types';

// Simulated outcome of a 90-day customer pilot on the kubernetes_rca template.
// Adaptive learning never retrains an LLM — it tunes weights, thresholds,
// required evidence, downgrade rules and review routing.
export const adaptivePilot: AdaptivePilot = {
  baseline_template_id: 'kubernetes_rca',
  evaluations_run: 312,
  feedback_outcomes: [
    {
      feedback: 'Useful',
      count: 214,
      signal: 'High-scoring evaluations were confirmed correct — thresholds are well calibrated at the top.',
    },
    {
      feedback: 'Partially Useful',
      count: 41,
      signal: 'Outputs scored well on evidence but reviewers flagged incomplete coverage of telemetry sources.',
    },
    {
      feedback: 'Incorrect',
      count: 13,
      signal: 'Most incorrect outputs had passed despite unresolved contradictions in the evidence.',
    },
    {
      feedback: 'Missing Evidence',
      count: 24,
      signal: 'Reviewers repeatedly requested deployment-change evidence that the template did not require.',
    },
    {
      feedback: 'Unsafe Recommendation',
      count: 9,
      signal: 'Contradictory outputs were frequently marked unsafe — contradiction weight is too low.',
    },
    {
      feedback: 'Needs Review',
      count: 11,
      signal: 'Borderline scores clustered at 63–67, just around the review threshold.',
    },
  ],
  adjustments: [
    {
      dimension_id: 'contradiction_risk',
      dimension_name: 'Contradiction Risk',
      before: 10,
      after: 20,
      reason:
        'Reviewers frequently marked contradictory outputs as unsafe. Doubling the contradiction weight catches these before they reach execution.',
    },
    {
      dimension_id: 'pattern_match',
      dimension_name: 'Pattern Match',
      before: 20,
      after: 15,
      reason:
        'Pattern similarity over-contributed: novel incidents scored too low even with strong direct evidence. Reduced to rebalance.',
    },
    {
      dimension_id: 'evidence_quality',
      dimension_name: 'Evidence Quality',
      before: 30,
      after: 25,
      reason:
        'Slightly reduced to make room for contradiction weighting — evidence quality remained the top contributor overall.',
    },
  ],
  explanation:
    'During the pilot, human reviewers frequently marked contradictory outputs as unsafe. The system suggests increasing Contradiction Risk weight, funded by small reductions in Pattern Match and Evidence Quality. Thresholds stay unchanged; the downgrade rule now fires earlier in practice.',
};
