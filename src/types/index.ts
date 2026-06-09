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
