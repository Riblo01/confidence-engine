export interface TrustDecisionOutcome {
  id: string;
  label: string;
  confidenceScore: number;
  tone: 'trusted' | 'review' | 'low' | 'blocked';
  triggeredRules: string[];
  missingEvidence: string[];
  contradictionsDetected: string[];
  recommendedNextAction: string;
}

export const trustDecisionOutcomes: TrustDecisionOutcome[] = [
  {
    id: 'trusted',
    label: 'Trusted',
    confidenceScore: 92,
    tone: 'trusted',
    triggeredRules: ['All required evidence present', 'No blocking downgrade rules triggered'],
    missingEvidence: ['None'],
    contradictionsDetected: ['None'],
    recommendedNextAction: 'Approve the output for standard execution with audit logging.',
  },
  {
    id: 'needs_review',
    label: 'Needs Human Review',
    confidenceScore: 74,
    tone: 'review',
    triggeredRules: ['Confidence below trusted threshold', 'Completeness score below target'],
    missingEvidence: ['One required evidence source is incomplete'],
    contradictionsDetected: ['No hard contradiction, but one claim is inferred'],
    recommendedNextAction: 'Route to a reviewer with the missing evidence highlighted.',
  },
  {
    id: 'low_confidence',
    label: 'Low Confidence',
    confidenceScore: 51,
    tone: 'low',
    triggeredRules: ['Evidence quality below review threshold', 'Recommendation quality is weak'],
    missingEvidence: ['Primary source context', 'Independent corroborating evidence'],
    contradictionsDetected: ['Output conclusion conflicts with one evidence source'],
    recommendedNextAction: 'Do not act on the output. Request a corrected analysis.',
  },
  {
    id: 'unsafe_blocked',
    label: 'Unsafe / Blocked',
    confidenceScore: 28,
    tone: 'blocked',
    triggeredRules: ['Unsafe recommendation rule triggered', 'Contradiction risk exceeds blocking threshold'],
    missingEvidence: ['Approval evidence', 'Rollback or safety validation'],
    contradictionsDetected: ['Recommended action conflicts with policy and available evidence'],
    recommendedNextAction: 'Block execution and escalate to the domain owner.',
  },
];
