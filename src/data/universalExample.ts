export const universalExample = {
  title: 'AI-generated customer support response',
  generatedOutput:
    'We can issue a full refund immediately and keep the premium plan active for the next billing cycle.',
  sourceContext: 'Customer requested a refund after a duplicate charge. Account is on a regulated enterprise plan.',
  evidence: [
    { label: 'Ticket history', status: 'validated', detail: 'Duplicate charge confirmed on invoice INV-8841.' },
    { label: 'Refund policy', status: 'contradiction', detail: 'Full refund requires plan cancellation approval.' },
    { label: 'Account data', status: 'validated', detail: 'Customer is eligible for billing correction.' },
    { label: 'Compliance policy', status: 'missing', detail: 'Enterprise plan retention exception not approved.' },
  ],
  flow: [
    'AI-generated response',
    'Confidence Engine evaluation',
    'Evidence validation',
    'Trust Decision',
    'Human approval',
    'Feedback recorded',
  ],
  decision: {
    label: 'Needs Human Review',
    score: 72,
    reason: 'The refund claim is partly supported, but the response promises plan retention without required approval.',
    nextAction: 'Ask billing owner to approve the retention exception before sending.',
  },
};
