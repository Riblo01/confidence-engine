export const governanceAudit = {
  decisionId: 'DEC-2026-0418',
  decision: 'Needs Human Review',
  score: 74,
  approver: 'Billing Operations Lead',
  finalAction: 'Response edited before sending to customer.',
  whyDecisionWasMade:
    'The generated response had partial evidence support, but one recommendation required approval that was not present.',
  dimensions: [
    { label: 'Evidence Quality', value: 82, contribution: 'Strong invoice and ticket evidence.' },
    { label: 'Completeness', value: 68, contribution: 'Missing retention-exception approval.' },
    { label: 'Contradiction Risk', value: 31, contribution: 'Policy conflicts with the promised plan retention.' },
    { label: 'Actionability', value: 76, contribution: 'Recommended action was specific but not fully safe.' },
  ],
  evidenceUsed: [
    'Ticket #CS-1442',
    'Invoice INV-8841',
    'Refund policy v3.2',
    'Enterprise retention policy',
  ],
  triggeredRules: [
    'Human review required when policy evidence is missing.',
    'Downgrade when output promises an action without approval evidence.',
  ],
  confidenceHistory: [64, 67, 70, 72, 74],
};
