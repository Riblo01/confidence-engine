import type { ScoringInputs, ConfidenceResult, VerdictType, ConfidenceLevel } from '../types';

const verdictMessages: Record<VerdictType, (pattern: string) => string> = {
  'Trusted RCA': (pattern) =>
    `The RCA is trustworthy. The agent's conclusion is well-supported by telemetry evidence and matches the ${pattern} operational pattern. Evidence quality and consistency are high. Proceed with the recommended actions.`,
  'Needs Human Review': (pattern) =>
    `The RCA requires human validation before action. The ${pattern} pattern partially matches, but critical evidence is missing or contradictions exist. An SRE should review the analysis before executing remediation.`,
  'Low Confidence RCA': (_pattern) =>
    `The RCA has low confidence. Multiple evidence sources are missing or contradictory. The proposed root cause is speculative. A thorough human investigation is required before any remediation.`,
};

const nextSteps: Record<VerdictType, (incident_title: string) => string> = {
  'Trusted RCA': (_t) =>
    'Proceed with the agent\'s recommended actions. Assign ownership to the on-call engineer and track resolution in your incident management system.',
  'Needs Human Review': (_t) =>
    'Assign to a senior SRE for manual review. Collect the missing evidence items listed above before executing any remediation. Re-run the confidence evaluation after investigation.',
  'Low Confidence RCA': (_t) =>
    'Do not act on this RCA without a full manual investigation. Collect all missing evidence, resolve contradictions, and generate a new RCA before taking remediation steps.',
};

function downgradeVerdict(verdict: VerdictType): VerdictType {
  if (verdict === 'Trusted RCA') return 'Needs Human Review';
  if (verdict === 'Needs Human Review') return 'Low Confidence RCA';
  return 'Low Confidence RCA';
}

export function calculateConfidence(
  inputs: ScoringInputs,
  patternMatched: string,
  incidentTitle: string,
): ConfidenceResult {
  const contradiction_score = 100 - inputs.contradiction_risk;

  const raw_score =
    inputs.evidence_quality * 0.30 +
    inputs.rca_consistency * 0.25 +
    inputs.historical_similarity * 0.20 +
    inputs.operational_completeness * 0.15 +
    contradiction_score * 0.10;

  const overall_score = Math.round(raw_score * 10) / 10;

  let confidence_level: ConfidenceLevel;
  if (overall_score >= 85) confidence_level = 'High';
  else if (overall_score >= 65) confidence_level = 'Medium';
  else if (overall_score >= 40) confidence_level = 'Low';
  else confidence_level = 'Very Low';

  let verdict: VerdictType;
  if (overall_score >= 85) verdict = 'Trusted RCA';
  else if (overall_score >= 65) verdict = 'Needs Human Review';
  else verdict = 'Low Confidence RCA';

  if (inputs.contradiction_risk > 50) {
    verdict = downgradeVerdict(verdict);
    confidence_level =
      confidence_level === 'High'
        ? 'Medium'
        : confidence_level === 'Medium'
        ? 'Low'
        : 'Very Low';
  }

  return {
    evidence_quality: inputs.evidence_quality,
    rca_consistency: inputs.rca_consistency,
    historical_similarity: inputs.historical_similarity,
    contradiction_risk: inputs.contradiction_risk,
    contradiction_score,
    operational_completeness: inputs.operational_completeness,
    recommendation_quality: inputs.recommendation_quality,
    overall_score,
    confidence_level,
    verdict,
    verdict_message: verdictMessages[verdict](patternMatched),
    next_step: nextSteps[verdict](incidentTitle),
    has_critical_missing_evidence: inputs.has_critical_missing_evidence,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e';
  if (score >= 65) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

export function getVerdictColor(verdict: VerdictType): string {
  if (verdict === 'Trusted RCA') return '#22c55e';
  if (verdict === 'Needs Human Review') return '#f59e0b';
  return '#ef4444';
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'availability': return '#ef4444';
    case 'error_rate': return '#f97316';
    case 'performance': return '#f59e0b';
    case 'resource_saturation': return '#8b5cf6';
    case 'deployment_failure': return '#3b82f6';
    default: return '#6b7280';
  }
}
