import type {
  ConfidenceLevel,
  EvaluationTemplate,
  TemplateDimension,
  TemplateScoreResult,
  TemplateVerdict,
} from '../types';
import { RISK_DIMENSION_IDS } from '../data/confidenceCore';

const VERDICT_ORDER: TemplateVerdict[] = ['Trusted', 'Needs Human Review', 'Low Confidence'];

function downgradeVerdict(verdict: TemplateVerdict): TemplateVerdict {
  const i = VERDICT_ORDER.indexOf(verdict);
  return VERDICT_ORDER[Math.min(i + 1, VERDICT_ORDER.length - 1)];
}

function confidenceLevelFor(score: number): ConfidenceLevel {
  if (score >= 85) return 'High';
  if (score >= 65) return 'Medium';
  if (score >= 40) return 'Low';
  return 'Very Low';
}

// Risk dimensions store risk in example_score (higher = worse);
// their scoring contribution is the inverted value.
export function effectiveScore(dim: TemplateDimension): number {
  return RISK_DIMENSION_IDS.has(dim.id) ? 100 - dim.example_score : dim.example_score;
}

export function isRiskDimension(dim: TemplateDimension): boolean {
  return RISK_DIMENSION_IDS.has(dim.id);
}

export function calculateTemplateScore(template: EvaluationTemplate): TemplateScoreResult {
  const enabled = template.dimensions.filter((d) => d.enabled);
  const warnings: string[] = [];

  const weightSum = enabled.reduce((acc, d) => acc + d.weight, 0);
  const weightSumValid = Math.abs(weightSum - 100) <= 0.5;
  if (!weightSumValid) {
    warnings.push(`Priority budget is ${weightSum}%. Rebalance enabled dimensions to 100%.`);
  }

  // Compute proportionally even when invalid so the preview stays live.
  const divisor = weightSum > 0 ? weightSum : 1;
  const score =
    enabled.reduce((acc, d) => acc + effectiveScore(d) * d.weight, 0) / divisor;
  const rounded = Math.round(score * 10) / 10;

  let verdict: TemplateVerdict;
  if (rounded >= template.thresholds.trusted) verdict = 'Trusted';
  else if (rounded >= template.thresholds.review) verdict = 'Needs Human Review';
  else verdict = 'Low Confidence';

  for (const rule of template.downgrade_rules) {
    const dim = enabled.find((d) => d.id === rule.dimension_id);
    if (!dim) continue;
    const fired =
      rule.operator === 'gt' ? dim.example_score > rule.threshold : dim.example_score < rule.threshold;
    if (fired) {
      const before = verdict;
      verdict = downgradeVerdict(verdict);
      if (verdict !== before) {
        warnings.push(`${dim.name} ${rule.operator === 'gt' ? 'above' : 'below'} ${rule.threshold}% — ${rule.effect}`);
      }
    }
  }

  let biggestContributor: TemplateDimension | null = null;
  let biggestRiskContributor: TemplateDimension | null = null;
  let maxContribution = -1;
  let maxRisk = -1;
  for (const d of enabled) {
    const contribution = effectiveScore(d) * d.weight;
    if (contribution > maxContribution) {
      maxContribution = contribution;
      biggestContributor = d;
    }
    // Risk = weighted points lost vs a perfect 100 on this dimension.
    const risk = (100 - effectiveScore(d)) * d.weight;
    if (risk > maxRisk) {
      maxRisk = risk;
      biggestRiskContributor = d;
    }
  }

  const formulaPreview = enabled
    .map((d) => `(${(d.weight / 100).toFixed(2)} × ${d.name})`)
    .join(' + ');

  return {
    score: rounded,
    verdict,
    confidenceLevel: confidenceLevelFor(rounded),
    warnings,
    weightSumValid,
    weightSum,
    biggestContributor,
    biggestRiskContributor,
    formulaPreview,
    humanReviewRequired: verdict !== 'Trusted',
  };
}
