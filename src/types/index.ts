export type SeverityLevel =
  | 'availability'
  | 'error_rate'
  | 'performance'
  | 'resource_saturation'
  | 'deployment_failure';

export type EvidenceStatus = 'validated' | 'inferred' | 'missing' | 'contradiction';
export type ImpactLevel = 'high' | 'medium' | 'low';
export type VerdictType = 'Trusted RCA' | 'Needs Human Review' | 'Low Confidence RCA';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low' | 'Very Low';
export type FeedbackType =
  | 'useful'
  | 'partially_useful'
  | 'incorrect'
  | 'missing_evidence'
  | 'needs_review'
  | null;
export type TimelineEventType = 'detection' | 'metric' | 'deployment' | 'rca' | 'validation';

export interface TelemetrySignal {
  source: string;
  signal: string;
  value: string;
  status: 'normal' | 'anomaly' | 'critical';
}

export interface EvidenceItem {
  claim: string;
  source: string;
  status: EvidenceStatus;
  confidence_impact: ImpactLevel;
  detail?: string;
}

export interface TimelineEvent {
  time: string;
  event: string;
  type: TimelineEventType;
}

export interface AgentRCA {
  agent_name: string;
  proposed_root_cause: string;
  rca_summary: string;
  evidence_listed: string[];
  hypotheses_discarded: string[];
  recommended_actions: string[];
  agent_declared_confidence: number;
}

export interface HistoricalMatch {
  incident_id: string;
  title: string;
  similarity: number;
  resolution: string;
}

export interface PatternSignalMatch {
  signal: string;
  matched: boolean;
}

export interface ScoringInputs {
  evidence_quality: number;
  rca_consistency: number;
  historical_similarity: number;
  contradiction_risk: number;
  operational_completeness: number;
  recommendation_quality: number;
  has_critical_missing_evidence: boolean;
  pattern_similarity: number;
  pattern_matched: string;
  pattern_matched_signals: PatternSignalMatch[];
  missing_signals: string[];
}

export interface Incident {
  problem_id: string;
  title: string;
  severity: SeverityLevel;
  status: 'active' | 'resolved';
  time_window: string;
  affected_service: string;
  namespace: string;
  cluster: string;
  business_impact: string;
  source_tools: string[];
  telemetry_signals: TelemetrySignal[];
  agent_rca: AgentRCA;
  timeline_events: TimelineEvent[];
  evidence_items: EvidenceItem[];
  missing_evidence: string[];
  contradiction_risks: string[];
  expected_pattern: string;
  historical_matches: HistoricalMatch[];
  scoring_inputs: ScoringInputs;
}

export interface ConfidenceResult {
  evidence_quality: number;
  rca_consistency: number;
  historical_similarity: number;
  contradiction_risk: number;
  contradiction_score: number;
  operational_completeness: number;
  recommendation_quality: number;
  overall_score: number;
  confidence_level: ConfidenceLevel;
  verdict: VerdictType;
  verdict_message: string;
  next_step: string;
  has_critical_missing_evidence: boolean;
}

export interface Pattern {
  pattern_id: string;
  name: string;
  description: string;
  expected_symptoms: string[];
  expected_evidence: string[];
  common_root_causes: string[];
  recommended_validations: string[];
  common_false_positives: string[];
  confidence_weight: number;
}

// ── Generalized product types (product-first experience) ─────────────────────

export type StageOwnership = 'external' | 'confidence_engine';

export interface ProductFlowStep {
  id: string;
  index: number;
  label: string;
  title: string;
  kicker: string;
  ownership: StageOwnership;
  summary: string;
}

export type DimensionType = 'core' | 'domain_specific';

export interface TemplateDimension {
  id: string;
  name: string;
  type: DimensionType;
  enabled: boolean;
  weight: number;
  example_score: number;
  description: string;
  question_answered: string;
  measurement_method: string;
}

export interface DowngradeRule {
  id: string;
  dimension_id: string;
  operator: 'gt' | 'lt';
  threshold: number;
  effect: string;
}

export interface EvaluationTemplate {
  id: string;
  name: string;
  domain: string;
  output_type: string;
  description: string;
  dimensions: TemplateDimension[];
  thresholds: { trusted: number; review: number };
  downgrade_rules: DowngradeRule[];
  required_evidence: string[];
}

export type TemplateVerdict = 'Trusted' | 'Needs Human Review' | 'Low Confidence';

export interface TemplateScoreResult {
  score: number;
  verdict: TemplateVerdict;
  confidenceLevel: ConfidenceLevel;
  warnings: string[];
  weightSumValid: boolean;
  weightSum: number;
  biggestContributor: TemplateDimension | null;
  biggestRiskContributor: TemplateDimension | null;
  formulaPreview: string;
  humanReviewRequired: boolean;
}

export interface PilotAdjustment {
  dimension_id: string;
  dimension_name: string;
  before: number;
  after: number;
  reason: string;
}

export interface PilotFeedbackOutcome {
  feedback: string;
  count: number;
  signal: string;
}

export interface AdaptivePilot {
  baseline_template_id: string;
  evaluations_run: number;
  feedback_outcomes: PilotFeedbackOutcome[];
  adjustments: PilotAdjustment[];
  explanation: string;
}

export interface MemoryCard {
  id: string;
  name: string;
  category?: 'Operational Memory' | 'Calibration Memory' | 'Enterprise Knowledge';
  stores: string;
  informs: string;
  example: string;
}

// ── Mission Control types ─────────────────────────────────────────────────────

export type StepStatus = 'locked' | 'ready' | 'processing' | 'completed' | 'warning' | 'blocked';

export type MissionStepId =
  | 'start'
  | 'parse_contract'
  | 'validate_evidence'
  | 'analyze_consistency'
  | 'detect_contradictions'
  | 'calculate_confidence'
  | 'generate_decision'
  | 'submit_feedback'
  | 'update_memory';

export interface MissionStep {
  id: MissionStepId;
  label: string;
  shortLabel: string;
  actionLabel: string;
  shortDescription: string;
  iconName: string;
}

export interface MissionEvidenceSource {
  id: string;
  label: string;
  status: 'validated' | 'inferred' | 'missing' | 'contradiction';
}

export interface MissionRisk {
  id: string;
  label: string;
  severity: 'high' | 'medium' | 'low';
}

export interface MissionLearningUpdate {
  dimension_id: string;
  dimension_name: string;
  before: number;
  after: number;
  reason: string;
}

export interface MissionInputContract {
  output_type: string;
  required_evidence: string[];
  thresholds: { trusted: number; review: number };
}

export interface MissionScenario {
  id: string;
  title: string;
  domain: string;
  badge: string;
  useCaseName: string;
  generatedOutputType: string;
  aiGeneratedOutput: string;
  inputContract: MissionInputContract;
  evidenceSources: MissionEvidenceSource[];
  confidenceDimensions: { id: string; name: string; score: number; weight: number }[];
  risks: MissionRisk[];
  contradictions: string[];
  finalScore: number;
  finalVerdict: 'Trusted' | 'Needs Human Review' | 'Low Confidence';
  decisionRoute: 'Proceed' | 'Route to Human Review' | 'Blocked';
  mainReason: string;
  keyRisk: string;
  evidenceStatus: string;
  recommendedAction: string;
  feedbackOptions: string[];
  learningUpdate: MissionLearningUpdate[];
}

export type MissionRiskLevel = 'none' | 'low' | 'medium' | 'high';

export interface MissionState {
  scenarioId: string;
  stepStatuses: Record<MissionStepId, StepStatus>;
  processingStepId: MissionStepId | null;
  confidenceScore: number | null;
  partialScore: number | null;
  verdict: string | null;
  evidenceCoverage: number | null;
  contradictionCount: number;
  riskLevel: MissionRiskLevel;
  recommendedAction: string | null;
  feedbackSubmitted: boolean;
  selectedFeedback: string | null;
  memoryUpdated: boolean;
  autoPlay: boolean;
}
