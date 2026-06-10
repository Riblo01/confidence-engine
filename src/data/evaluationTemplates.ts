import type { EvaluationTemplate, TemplateDimension } from '../types';
import { cloneCoreDimensions } from './confidenceCore';

// Build a template's dimension list: start from the 5 core dimensions,
// apply per-template weight overrides, then append domain dimensions.
function buildDimensions(
  coreOverrides: Record<string, Partial<TemplateDimension>>,
  domainDims: TemplateDimension[],
): TemplateDimension[] {
  const core = cloneCoreDimensions().map((d) => ({ ...d, ...coreOverrides[d.id] }));
  return [...core, ...domainDims];
}

const DEFAULT_THRESHOLDS = { trusted: 85, review: 65 };

const CONTRADICTION_DOWNGRADE = {
  id: 'contradiction-downgrade',
  dimension_id: 'contradiction_risk',
  operator: 'gt' as const,
  threshold: 50,
  effect: 'Verdict downgraded one level when contradiction risk exceeds 50%.',
};

export const evaluationTemplates: EvaluationTemplate[] = [
  // ── 1. Generic Output Validation ──────────────────────────────────────────
  {
    id: 'generic_output_validation',
    name: 'Generic Output Validation',
    domain: 'Any',
    output_type: 'Any generated output (answer, report, recommendation)',
    description:
      'Baseline template using only the five core dimensions. Starting point for any new use case before domain-specific dimensions are added.',
    dimensions: buildDimensions({}, []),
    thresholds: DEFAULT_THRESHOLDS,
    downgrade_rules: [CONTRADICTION_DOWNGRADE],
    required_evidence: ['Source context', 'At least one independent evidence source'],
  },

  // ── 2. Kubernetes RCA (mirrors the original engine weights) ───────────────
  {
    id: 'kubernetes_rca',
    name: 'Kubernetes RCA',
    domain: 'Platform / SRE',
    output_type: 'Root Cause Analysis document',
    description:
      'Validates AI-generated RCAs for Kubernetes incidents against telemetry, operational patterns and historical incidents.',
    dimensions: buildDimensions(
      {
        evidence_quality: { weight: 30, example_score: 86 },
        consistency: { weight: 25, example_score: 90 },
        completeness: { weight: 15, example_score: 78 },
        contradiction_risk: { weight: 10, example_score: 18 },
        actionability: { weight: 0, enabled: false },
      },
      [
        {
          id: 'pattern_match',
          name: 'Pattern Match',
          type: 'domain_specific',
          enabled: true,
          weight: 20,
          example_score: 88,
          description: 'Similarity to known operational failure patterns (OOMKill, CrashLoop, HPA limits...).',
          question_answered: 'Does this incident match a known operational pattern?',
          measurement_method: 'Signal overlap against a curated pattern library of recurring Kubernetes failures.',
        },
        {
          id: 'telemetry_coverage',
          name: 'Telemetry Coverage',
          type: 'domain_specific',
          enabled: false,
          weight: 0,
          example_score: 72,
          description: 'Share of telemetry sources (logs, metrics, traces, events) actually consulted by the RCA.',
          question_answered: 'Did the RCA consult all relevant telemetry sources?',
          measurement_method: 'Sources cited in the RCA vs sources available for the affected workload.',
        },
        {
          id: 'deployment_correlation',
          name: 'Deployment Correlation',
          type: 'domain_specific',
          enabled: false,
          weight: 0,
          example_score: 80,
          description: 'Whether the RCA checked recent deployments and config changes as candidate causes.',
          question_answered: 'Were recent changes correlated with the incident window?',
          measurement_method: 'Change events within the incident window cross-referenced against the proposed cause.',
        },
      ],
    ),
    thresholds: DEFAULT_THRESHOLDS,
    downgrade_rules: [CONTRADICTION_DOWNGRADE],
    required_evidence: ['Logs', 'Metrics', 'Traces', 'Kubernetes events'],
  },

  // ── 3. Spec to Code ────────────────────────────────────────────────────────
  {
    id: 'spec_to_code',
    name: 'Spec to Code',
    domain: 'Software Engineering',
    output_type: 'Generated code diff',
    description:
      'Validates AI-generated code against the originating spec, acceptance criteria, test results and static analysis.',
    dimensions: buildDimensions(
      {
        evidence_quality: { weight: 20, example_score: 82 },
        consistency: { weight: 15, example_score: 85 },
        completeness: { weight: 15, example_score: 74 },
        contradiction_risk: { weight: 10, example_score: 15 },
        actionability: { weight: 10, example_score: 79 },
      },
      [
        {
          id: 'requirement_coverage',
          name: 'Requirement Coverage',
          type: 'domain_specific',
          enabled: true,
          weight: 15,
          example_score: 77,
          description: 'Share of spec requirements implemented by the generated code.',
          question_answered: 'Does the code implement every requirement in the spec?',
          measurement_method: 'Each acceptance criterion mapped to implementing code and its tests.',
        },
        {
          id: 'test_coverage',
          name: 'Test Coverage',
          type: 'domain_specific',
          enabled: true,
          weight: 15,
          example_score: 83,
          description: 'Whether generated code is exercised by passing tests.',
          question_answered: 'Is the generated code verified by passing tests?',
          measurement_method: 'Test run results + line/branch coverage on changed files.',
        },
        {
          id: 'security_risk',
          name: 'Security Risk',
          type: 'domain_specific',
          enabled: true,
          weight: 15,
          example_score: 12,
          description: 'Findings from security scanners and dependency audits on the generated diff.',
          question_answered: 'Does the generated code introduce security vulnerabilities?',
          measurement_method: 'SAST findings, secret detection and dependency CVEs scoped to the diff.',
        },
      ],
    ),
    thresholds: DEFAULT_THRESHOLDS,
    downgrade_rules: [
      CONTRADICTION_DOWNGRADE,
      {
        id: 'security-downgrade',
        dimension_id: 'security_risk',
        operator: 'gt',
        threshold: 40,
        effect: 'Verdict downgraded one level when security risk exceeds 40%.',
      },
    ],
    required_evidence: ['Spec', 'Acceptance criteria', 'Test results', 'Lint output', 'Security scan'],
  },

  // ── 4. SOC Investigation ───────────────────────────────────────────────────
  {
    id: 'soc_investigation',
    name: 'SOC Investigation',
    domain: 'Security Operations',
    output_type: 'Threat analysis summary',
    description:
      'Validates AI-generated threat analyses against SIEM data, indicators of compromise and endpoint/network telemetry.',
    dimensions: buildDimensions(
      {
        evidence_quality: { weight: 25, example_score: 79 },
        consistency: { weight: 15, example_score: 84 },
        completeness: { weight: 15, example_score: 71 },
        contradiction_risk: { weight: 10, example_score: 25 },
        actionability: { weight: 10, example_score: 76 },
      },
      [
        {
          id: 'ioc_confidence',
          name: 'IOC Confidence',
          type: 'domain_specific',
          enabled: true,
          weight: 15,
          example_score: 82,
          description: 'Reliability of the indicators of compromise cited by the analysis.',
          question_answered: 'Are the cited IOCs corroborated by threat intelligence?',
          measurement_method: 'IOC reputation lookups and cross-source corroboration counts.',
        },
        {
          id: 'false_positive_risk',
          name: 'False Positive Risk',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 30,
          description: 'Likelihood that the detection is benign activity misclassified as a threat.',
          question_answered: 'Could this be a false positive?',
          measurement_method: 'Historical FP rate for the detection rule + benign-pattern matching.',
        },
        {
          id: 'threat_severity',
          name: 'Threat Severity Alignment',
          type: 'domain_specific',
          enabled: false,
          weight: 0,
          example_score: 75,
          description: 'Whether the assigned severity matches the evidence and asset criticality.',
          question_answered: 'Is the severity rating justified?',
          measurement_method: 'Severity vs affected asset criticality and observed impact.',
        },
      ],
    ),
    thresholds: { trusted: 88, review: 70 },
    downgrade_rules: [
      CONTRADICTION_DOWNGRADE,
      {
        id: 'fp-downgrade',
        dimension_id: 'false_positive_risk',
        operator: 'gt',
        threshold: 55,
        effect: 'Verdict downgraded one level when false positive risk exceeds 55%.',
      },
    ],
    required_evidence: ['SIEM events', 'IOCs', 'Endpoint logs', 'Network telemetry'],
  },

  // ── 5. Customer Support Response ───────────────────────────────────────────
  {
    id: 'customer_support',
    name: 'Customer Support Response',
    domain: 'Customer Experience',
    output_type: 'Suggested customer response',
    description:
      'Validates AI-drafted support responses against ticket history, knowledge base articles and policy documents.',
    dimensions: buildDimensions(
      {
        evidence_quality: { weight: 20, example_score: 88 },
        consistency: { weight: 15, example_score: 91 },
        completeness: { weight: 15, example_score: 85 },
        contradiction_risk: { weight: 10, example_score: 10 },
        actionability: { weight: 10, example_score: 87 },
      },
      [
        {
          id: 'intent_match',
          name: 'Intent Match',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 90,
          description: 'Whether the response addresses what the customer actually asked.',
          question_answered: 'Does the response address the customer intent?',
          measurement_method: 'Intent classification of the ticket vs topics covered by the draft.',
        },
        {
          id: 'resolution_accuracy',
          name: 'Resolution Accuracy',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 84,
          description: 'Whether the proposed resolution matches documented procedures.',
          question_answered: 'Is the proposed resolution correct per the knowledge base?',
          measurement_method: 'Draft steps matched against KB articles for the detected issue.',
        },
        {
          id: 'policy_compliance',
          name: 'Policy Compliance',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 93,
          description: 'Whether the response respects refund, privacy and communication policies.',
          question_answered: 'Does the response comply with company policy?',
          measurement_method: 'Policy rule checks (commitments, refunds, PII disclosure, tone guidelines).',
        },
      ],
    ),
    thresholds: { trusted: 82, review: 60 },
    downgrade_rules: [CONTRADICTION_DOWNGRADE],
    required_evidence: ['Ticket history', 'Knowledge base articles', 'Policy documents'],
  },

  // ── 6. Compliance Review ───────────────────────────────────────────────────
  {
    id: 'compliance_review',
    name: 'Compliance Review',
    domain: 'Risk & Compliance',
    output_type: 'Compliance assessment',
    description:
      'Validates AI-generated compliance assessments against regulations, internal policy and the audit trail.',
    dimensions: buildDimensions(
      {
        evidence_quality: { weight: 25, example_score: 81 },
        consistency: { weight: 15, example_score: 86 },
        completeness: { weight: 20, example_score: 73 },
        contradiction_risk: { weight: 10, example_score: 20 },
        actionability: { weight: 5, example_score: 70 },
      },
      [
        {
          id: 'citation_quality',
          name: 'Citation Quality',
          type: 'domain_specific',
          enabled: true,
          weight: 15,
          example_score: 78,
          description: 'Whether every assessment claim cites the specific regulation or policy clause.',
          question_answered: 'Is each claim traceable to a specific clause?',
          measurement_method: 'Claims with valid clause-level citations / total claims.',
        },
        {
          id: 'regulatory_alignment',
          name: 'Regulatory Alignment',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 82,
          description: 'Whether the interpretation matches current regulatory guidance and precedent.',
          question_answered: 'Does the interpretation match current guidance?',
          measurement_method: 'Cited regulation versions vs latest published guidance.',
        },
      ],
    ),
    thresholds: { trusted: 90, review: 72 },
    downgrade_rules: [CONTRADICTION_DOWNGRADE],
    required_evidence: ['Regulations', 'Internal policy', 'Citations', 'Audit trail'],
  },

  // ── 7. Multi-agent Workflow ────────────────────────────────────────────────
  {
    id: 'multi_agent_workflow',
    name: 'Multi-agent Workflow',
    domain: 'Agentic Systems',
    output_type: 'Final consolidated answer',
    description:
      'Validates the final output of a multi-agent workflow against subagent outputs, the task plan and tool results.',
    dimensions: buildDimensions(
      {
        evidence_quality: { weight: 20, example_score: 80 },
        consistency: { weight: 15, example_score: 83 },
        completeness: { weight: 15, example_score: 77 },
        contradiction_risk: { weight: 10, example_score: 24 },
        actionability: { weight: 10, example_score: 78 },
      },
      [
        {
          id: 'agent_agreement',
          name: 'Agent Agreement',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 74,
          description: 'Degree of consensus among subagents on the final answer.',
          question_answered: 'Do the subagents agree on the conclusion?',
          measurement_method: 'Pairwise agreement across subagent outputs on key claims.',
        },
        {
          id: 'inter_agent_contradiction',
          name: 'Inter-agent Contradiction',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 28,
          description: 'Unresolved conflicts between subagent outputs that reached the final answer.',
          question_answered: 'Did contradictions between agents survive into the final output?',
          measurement_method: 'Conflicting claims between subagents not reconciled by the coordinator.',
        },
        {
          id: 'traceability',
          name: 'Traceability',
          type: 'domain_specific',
          enabled: true,
          weight: 10,
          example_score: 85,
          description: 'Whether each part of the final answer traces back to a subagent or tool result.',
          question_answered: 'Can every claim be traced to its producing agent or tool?',
          measurement_method: 'Claims with provenance links to subagent/tool outputs / total claims.',
        },
      ],
    ),
    thresholds: DEFAULT_THRESHOLDS,
    downgrade_rules: [
      CONTRADICTION_DOWNGRADE,
      {
        id: 'inter-agent-downgrade',
        dimension_id: 'inter_agent_contradiction',
        operator: 'gt',
        threshold: 50,
        effect: 'Verdict downgraded one level when inter-agent contradiction exceeds 50%.',
      },
    ],
    required_evidence: ['Subagent outputs', 'Task plan', 'Review comments', 'Tool results'],
  },
];

export function getTemplateById(id: string): EvaluationTemplate {
  const found = evaluationTemplates.find((t) => t.id === id);
  return found ?? evaluationTemplates[0];
}
