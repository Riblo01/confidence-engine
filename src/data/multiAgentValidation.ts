export const multiAgentValidation = {
  agents: [
    {
      role: 'Investigator',
      conclusion: 'Customer was double charged and refund is justified.',
      evidence: ['Invoice', 'Payment processor event', 'Ticket timeline'],
    },
    {
      role: 'Analyst',
      conclusion: 'Refund is justified, but plan retention requires approval.',
      evidence: ['Refund policy', 'Enterprise account policy', 'Invoice'],
    },
    {
      role: 'Reviewer',
      conclusion: 'Approve corrected response after removing unsupported retention promise.',
      evidence: ['Policy exception checklist', 'Analyst notes', 'Ticket timeline'],
    },
  ],
  scores: [
    { label: 'Agreement Score', value: 86, detail: 'All agents agree on duplicate charge and refund eligibility.' },
    { label: 'Contradiction Score', value: 18, detail: 'Only one conflict: unsupported plan-retention promise.' },
    { label: 'Evidence Overlap', value: 72, detail: 'Invoice and ticket timeline appear across agents.' },
    { label: 'Missing Validations', value: 24, detail: 'Retention exception approval is still missing.' },
  ],
  decision:
    'Consensus is high enough to proceed after human review, but automatic sending is blocked until the policy exception is resolved.',
};
