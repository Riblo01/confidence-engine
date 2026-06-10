import type { MissionScenario, MissionStep } from '../types';

export const MISSION_STEPS: MissionStep[] = [
  {
    id: 'start',
    label: 'Start Evaluation',
    shortLabel: 'Start',
    actionLabel: 'Start Evaluation',
    shortDescription: 'Initialize the pipeline and load the AI-generated output for evaluation.',
    iconName: 'Play',
  },
  {
    id: 'parse_contract',
    label: 'Parse Input Contract',
    shortLabel: 'Contract',
    actionLabel: 'Parse Input Contract',
    shortDescription: 'Extract the output type, required evidence fields, and trust thresholds.',
    iconName: 'FileText',
  },
  {
    id: 'validate_evidence',
    label: 'Validate Evidence',
    shortLabel: 'Evidence',
    actionLabel: 'Validate Evidence',
    shortDescription: 'Match each claim against available evidence sources and classify coverage.',
    iconName: 'CheckSquare',
  },
  {
    id: 'analyze_consistency',
    label: 'Analyze Consistency',
    shortLabel: 'Consistency',
    actionLabel: 'Analyze Consistency',
    shortDescription: 'Cross-check the output narrative against source context for coherence.',
    iconName: 'BarChart2',
  },
  {
    id: 'detect_contradictions',
    label: 'Detect Contradictions',
    shortLabel: 'Risks',
    actionLabel: 'Detect Contradictions',
    shortDescription: 'Scan evidence for signals that actively conflict with the generated output.',
    iconName: 'AlertTriangle',
  },
  {
    id: 'calculate_confidence',
    label: 'Calculate Confidence',
    shortLabel: 'Score',
    actionLabel: 'Calculate Confidence',
    shortDescription: 'Apply the weighted scoring formula across all enabled dimensions.',
    iconName: 'Percent',
  },
  {
    id: 'generate_decision',
    label: 'Generate Trust Decision',
    shortLabel: 'Decision',
    actionLabel: 'Generate Trust Decision',
    shortDescription: 'Produce the final verdict: Trusted, Needs Human Review, or Low Confidence.',
    iconName: 'Shield',
  },
  {
    id: 'submit_feedback',
    label: 'Submit Human Feedback',
    shortLabel: 'Feedback',
    actionLabel: 'Submit Human Feedback',
    shortDescription: 'Human reviewer rates the output quality to calibrate future evaluations.',
    iconName: 'MessageSquare',
  },
  {
    id: 'update_memory',
    label: 'Update Learning Memory',
    shortLabel: 'Memory',
    actionLabel: 'Update Learning Memory',
    shortDescription: 'Incorporate feedback signal into dimension weights and thresholds.',
    iconName: 'Brain',
  },
];

export const STEP_ORDER: readonly string[] = MISSION_STEPS.map((s) => s.id);

export const missionScenarios: MissionScenario[] = [
  {
    id: 'k8s_rca',
    title: 'Kubernetes OOMKill — payments-prod',
    domain: 'Infrastructure',
    badge: 'K8s RCA',
    useCaseName: 'Kubernetes RCA',
    generatedOutputType: 'Root Cause Analysis',
    aiGeneratedOutput: `ROOT CAUSE ANALYSIS — payments-prod
Generated: 2024-11-12T03:42:17Z  |  Agent: OpsSage-v2

PROPOSED ROOT CAUSE
Memory leak in payments-service v2.3.1 introduced in commit a7f93e1.
The service was consuming 2.4 GB vs expected 800 MB baseline.

EVIDENCE LISTED
• OOMKill events on 3 pods within a 6-minute window
• Memory growth: 180 MB/hr over 4 hours prior to pod kill
• Deployment: payments-service upgraded v2.2.9 → v2.3.1 at 23:14Z
• Historical match: similar pattern in incident INC-0087 (resolved)

RECOMMENDED ACTION
Roll back payments-service to v2.2.9.
Monitor memory for 30 min post-rollback.
Trigger heap dump before rollback for post-mortem analysis.

AGENT CONFIDENCE DECLARED: 83 / 100`,
    inputContract: {
      output_type: 'Kubernetes RCA',
      required_evidence: [
        'Pod crash logs (OOMKill event)',
        'Memory metrics (last 6 h)',
        'Deployment history (last 24 h)',
        'Historical incident match',
        'Service dependency map',
      ],
      thresholds: { trusted: 80, review: 60 },
    },
    evidenceSources: [
      { id: 'e1', label: 'OOMKill pod logs (3 pods)', status: 'validated' },
      { id: 'e2', label: 'Memory growth metrics (4 h)', status: 'validated' },
      { id: 'e3', label: 'Deployment event v2.3.1 at 23:14Z', status: 'validated' },
      { id: 'e4', label: 'Historical match INC-0087', status: 'validated' },
      { id: 'e5', label: 'Service dependency map', status: 'missing' },
      { id: 'e6', label: 'Heap dump / profiler output', status: 'missing' },
    ],
    confidenceDimensions: [
      { id: 'evidence_quality', name: 'Evidence Quality', score: 72, weight: 30 },
      { id: 'consistency', name: 'Consistency', score: 85, weight: 25 },
      { id: 'completeness', name: 'Completeness', score: 58, weight: 20 },
      { id: 'contradiction_risk', name: 'Contradiction Risk', score: 32, weight: 15 },
      { id: 'actionability', name: 'Actionability', score: 91, weight: 10 },
    ],
    risks: [
      {
        id: 'r1',
        label: 'Missing service dependency map — rollback may have cascading effects',
        severity: 'high',
      },
      {
        id: 'r2',
        label: 'No heap dump — root cause not fully confirmed at code level',
        severity: 'medium',
      },
      {
        id: 'r3',
        label: 'Historical match is similarity-based, not a direct reproduction',
        severity: 'low',
      },
    ],
    contradictions: [
      'Pod restarts were sudden (not gradual), which is inconsistent with a slow progressive memory-leak pattern',
    ],
    finalScore: 78,
    finalVerdict: 'Needs Human Review',
    decisionRoute: 'Route to Human Review',
    mainReason:
      'Telemetry supports the memory-leak RCA, but dependency impact and heap evidence are incomplete.',
    keyRisk: 'Rollback may cascade to dependent services because the service dependency map is missing.',
    evidenceStatus: '4 validated, 2 missing',
    recommendedAction:
      'Human engineer must verify service dependency impact before executing rollback. Request heap dump from live pod if still reachable.',
    feedbackOptions: [
      'Useful — executed rollback successfully',
      'Partially Useful — needed more evidence before acting',
      'Incorrect — root cause was something different',
      'Unsafe — rollback would have caused additional downtime',
    ],
    learningUpdate: [
      {
        dimension_id: 'completeness',
        dimension_name: 'Completeness',
        before: 20,
        after: 25,
        reason:
          'Service dependency maps proved critical for rollback safety. Weight increased to enforce coverage.',
      },
      {
        dimension_id: 'contradiction_risk',
        dimension_name: 'Contradiction Risk',
        before: 15,
        after: 18,
        reason:
          'Sudden vs gradual restart pattern is a high-signal contradiction. Downgrade threshold tightened.',
      },
    ],
  },
  {
    id: 'customer_support_trusted',
    title: 'Refund Policy Response — enterprise account',
    domain: 'Customer Experience',
    badge: 'Support',
    useCaseName: 'Customer Support',
    generatedOutputType: 'Suggested customer response',
    aiGeneratedOutput: `CUSTOMER SUPPORT RESPONSE
Generated: 2024-11-12T05:03:41Z  |  Agent: SupportWriter-v3

CUSTOMER ISSUE
The customer asks whether a duplicate invoice can be refunded after plan renewal.

SUGGESTED RESPONSE
Apologize for the duplicate charge, confirm that the renewal policy allows refund review within 14 days, and ask for the invoice ID so the support team can validate the payment record.

EVIDENCE LISTED
• Knowledge-base policy REF-221 allows refund review within 14 days
• CRM account status confirms active enterprise plan
• Billing record shows duplicate invoice generated in the renewal window
• No policy exception or legal escalation required

RECOMMENDED ACTION
Allow assisted send with standard audit logging.

AGENT CONFIDENCE DECLARED: 91 / 100`,
    inputContract: {
      output_type: 'Customer Support Response',
      required_evidence: [
        'Knowledge-base policy',
        'Customer account status',
        'Billing record',
        'Escalation policy check',
      ],
      thresholds: { trusted: 85, review: 65 },
    },
    evidenceSources: [
      { id: 'e1', label: 'Refund policy REF-221', status: 'validated' },
      { id: 'e2', label: 'Enterprise account status', status: 'validated' },
      { id: 'e3', label: 'Duplicate invoice record', status: 'validated' },
      { id: 'e4', label: 'Escalation policy check', status: 'validated' },
    ],
    confidenceDimensions: [
      { id: 'evidence_quality', name: 'Evidence Quality', score: 94, weight: 30 },
      { id: 'consistency', name: 'Consistency', score: 92, weight: 25 },
      { id: 'completeness', name: 'Completeness', score: 89, weight: 20 },
      { id: 'contradiction_risk', name: 'Contradiction Risk', score: 8, weight: 15 },
      { id: 'actionability', name: 'Actionability', score: 93, weight: 10 },
    ],
    risks: [
      {
        id: 'r1',
        label: 'Customer identity must still be verified before account-specific action',
        severity: 'low',
      },
    ],
    contradictions: [],
    finalScore: 91,
    finalVerdict: 'Trusted',
    decisionRoute: 'Proceed',
    mainReason:
      'Policy, billing record, and account context all support the generated response with no critical contradictions.',
    keyRisk: 'Identity verification is still required before disclosing account-specific details.',
    evidenceStatus: '4 validated, 0 missing',
    recommendedAction:
      'Proceed with assisted send after standard identity verification and audit logging.',
    feedbackOptions: [
      'Useful — response sent with no changes',
      'Partially Useful — minor tone edit needed',
      'Incorrect — policy interpretation was wrong',
      'Unsafe — response exposed sensitive account detail',
    ],
    learningUpdate: [
      {
        dimension_id: 'evidence_quality',
        dimension_name: 'Evidence Quality',
        before: 30,
        after: 30,
        reason:
          'Validated policy and billing evidence confirmed that high-confidence support responses can proceed with light supervision.',
      },
    ],
  },
  {
    id: 'spec_to_code_review',
    title: 'Retry Handler Implementation — checkout-api',
    domain: 'Software Engineering',
    badge: 'Code',
    useCaseName: 'Spec to Code',
    generatedOutputType: 'Generated implementation',
    aiGeneratedOutput: `SPEC TO CODE REVIEW
Generated: 2024-11-12T05:22:10Z  |  Agent: CodeBuilder-v2

USER STORY
Add idempotent retry handling for checkout payment submission.

GENERATED IMPLEMENTATION
The implementation adds retry middleware, captures transactionId, and stores an idempotency key before submitting payment.

EVIDENCE LISTED
• Main acceptance path implemented
• transactionId propagation added
• Duplicate-charge guard partially covered
• Edge-case tests for timeout and retry exhaustion missing

RECOMMENDED ACTION
Route to engineer review before merge.

AGENT CONFIDENCE DECLARED: 78 / 100`,
    inputContract: {
      output_type: 'Generated Implementation',
      required_evidence: [
        'User story acceptance criteria',
        'Unit tests',
        'Integration tests',
        'Security and duplicate-charge review',
      ],
      thresholds: { trusted: 85, review: 65 },
    },
    evidenceSources: [
      { id: 'e1', label: 'Acceptance criteria mapping', status: 'validated' },
      { id: 'e2', label: 'transactionId propagation', status: 'validated' },
      { id: 'e3', label: 'Retry exhaustion tests', status: 'missing' },
      { id: 'e4', label: 'Duplicate-charge edge cases', status: 'inferred' },
      { id: 'e5', label: 'Security review', status: 'missing' },
    ],
    confidenceDimensions: [
      { id: 'evidence_quality', name: 'Evidence Quality', score: 76, weight: 30 },
      { id: 'consistency', name: 'Consistency', score: 81, weight: 25 },
      { id: 'completeness', name: 'Completeness', score: 68, weight: 20 },
      { id: 'security_risk', name: 'Security Risk', score: 28, weight: 15 },
      { id: 'actionability', name: 'Actionability', score: 84, weight: 10 },
    ],
    risks: [
      {
        id: 'r1',
        label: 'Missing timeout and retry-exhaustion tests',
        severity: 'medium',
      },
      {
        id: 'r2',
        label: 'Duplicate-charge guard is partially inferred',
        severity: 'medium',
      },
    ],
    contradictions: [],
    finalScore: 78,
    finalVerdict: 'Needs Human Review',
    decisionRoute: 'Route to Human Review',
    mainReason:
      'The implementation is plausible, but acceptance criteria validation and test coverage are incomplete.',
    keyRisk: 'Missing edge-case tests could allow duplicate payment submission under retry exhaustion.',
    evidenceStatus: '2 validated, 2 missing, 1 inferred',
    recommendedAction:
      'Route to engineer review and require additional tests before merge.',
    feedbackOptions: [
      'Useful — engineer approved after test additions',
      'Partially Useful — implementation needed refactor',
      'Incorrect — code did not meet acceptance criteria',
      'Unsafe — duplicate charge risk remained',
    ],
    learningUpdate: [
      {
        dimension_id: 'completeness',
        dimension_name: 'Completeness',
        before: 20,
        after: 24,
        reason:
          'Acceptance criteria and test evidence should carry more weight for generated code before merge.',
      },
    ],
  },
  {
    id: 'security_investigation',
    title: 'Lateral Movement Detection — auth-service',
    domain: 'Security',
    badge: 'SOC L1',
    useCaseName: 'SOC Investigation',
    generatedOutputType: 'Security investigation summary',
    aiGeneratedOutput: `SECURITY INVESTIGATION REPORT
Generated: 2024-11-12T04:18:03Z  |  Agent: SecureGPT-SOC-v1

THREAT ASSESSMENT
Suspected lateral movement from auth-service (10.0.2.44)
to data-store-01 (10.0.4.12).
Pattern matches MITRE ATT&CK T1021.001 (Remote Services: SSH).

EVIDENCE LISTED
• 47 failed SSH attempts from auth-service in a 3-minute window
• Auth token minting rate: +340% above 7-day average
• Unusual outbound port-22 traffic (no baseline established)
• Endpoint behavior sensor on data-store-01 OFFLINE since 03:50Z

RECOMMENDED ACTION
Isolate auth-service from data-store network segment immediately.
Rotate all active auth tokens. Escalate to SOC L2.

AGENT CONFIDENCE DECLARED: 71 / 100`,
    inputContract: {
      output_type: 'Security Investigation',
      required_evidence: [
        'Network traffic logs (source + destination)',
        'Authentication audit trail',
        'Endpoint behavior baseline',
        'Known-good traffic pattern',
        'Asset inventory / role mapping',
      ],
      thresholds: { trusted: 85, review: 65 },
    },
    evidenceSources: [
      { id: 'e1', label: 'SSH attempt logs (47 events)', status: 'validated' },
      { id: 'e2', label: 'Auth token minting rate spike (+340%)', status: 'validated' },
      { id: 'e3', label: 'Outbound port-22 traffic pattern', status: 'inferred' },
      { id: 'e4', label: 'Endpoint behavior baseline', status: 'missing' },
      { id: 'e5', label: 'Asset role map for auth-service', status: 'missing' },
      { id: 'e6', label: 'data-store-01 endpoint sensor data', status: 'contradiction' },
    ],
    confidenceDimensions: [
      { id: 'evidence_quality', name: 'Evidence Quality', score: 55, weight: 30 },
      { id: 'consistency', name: 'Consistency', score: 68, weight: 25 },
      { id: 'completeness', name: 'Completeness', score: 44, weight: 20 },
      { id: 'contradiction_risk', name: 'Contradiction Risk', score: 71, weight: 15 },
      { id: 'actionability', name: 'Actionability', score: 76, weight: 10 },
    ],
    risks: [
      {
        id: 'r1',
        label: 'Endpoint sensor offline — partial visibility only, possible tampering',
        severity: 'high',
      },
      {
        id: 'r2',
        label: 'No established traffic baseline — SSH block may be false positive',
        severity: 'high',
      },
      {
        id: 'r3',
        label: 'Network isolation may cascade to dependent services not yet mapped',
        severity: 'medium',
      },
    ],
    contradictions: [
      'Endpoint behavior sensor on data-store-01 went offline at 03:50Z — may indicate tampering OR routine maintenance (no change ticket found)',
      'Auth token spike correlates with peak traffic window — could be legitimate load event',
    ],
    finalScore: 52,
    finalVerdict: 'Low Confidence',
    decisionRoute: 'Blocked',
    mainReason:
      'The threat conclusion is weakly supported and endpoint telemetry conflicts with the proposed attack path.',
    keyRisk: 'High false-positive risk and contradictory endpoint signals.',
    evidenceStatus: '2 validated, 2 missing, 1 inferred, 1 contradiction',
    recommendedAction:
      'Do NOT act automatically. Require full analyst investigation and additional IOC validation.',
    feedbackOptions: [
      'Confirmed threat — escalation was correct',
      'False positive — routine maintenance window',
      'Incomplete — missing asset context changed the picture',
      'Unsafe — immediate isolation would have broken prod',
    ],
    learningUpdate: [
      {
        dimension_id: 'contradiction_risk',
        dimension_name: 'Contradiction Risk',
        before: 15,
        after: 22,
        reason:
          'Sensor-offline ambiguity is a critical contradiction in security investigations. Weight significantly increased for SOC domain.',
      },
      {
        dimension_id: 'completeness',
        dimension_name: 'Completeness',
        before: 20,
        after: 25,
        reason:
          'Baseline traffic patterns are required evidence for any network anomaly investigation. Weight increased.',
      },
    ],
  },
];

export function getMissionScenario(id: string): MissionScenario | undefined {
  return missionScenarios.find((s) => s.id === id);
}
