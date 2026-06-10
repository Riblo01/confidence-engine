import type { ProductFlowStep } from '../types';

export const K8S_DEMO_STEP_ID = 'k8s-demo';

export const productFlowSteps: ProductFlowStep[] = [
  {
    id: 'product-flow',
    index: 1,
    label: 'Product Flow',
    title: 'Input to Learning Flow',
    kicker: 'Area 01',
    ownership: 'confidence_engine',
    summary: 'Input, evaluation, decision, human validation and learning in one guided flow.',
  },
  {
    id: 'confidence-evaluation',
    index: 2,
    label: 'Confidence Evaluation',
    title: 'Confidence Evaluation Simulator',
    kicker: 'Area 02',
    ownership: 'confidence_engine',
    summary: 'Real-time input-output simulator for score, risk and trust decisions.',
  },
  {
    id: 'configuration-studio',
    index: 3,
    label: 'Configuration Studio',
    title: 'Configuration Studio',
    kicker: 'Area 03',
    ownership: 'confidence_engine',
    summary: 'Templates, dimensions, weights, evidence requirements and downgrade rules.',
  },
  {
    id: 'learning-governance',
    index: 4,
    label: 'Learning & Governance',
    title: 'Learning and Governance',
    kicker: 'Area 04',
    ownership: 'confidence_engine',
    summary: 'Feedback, confidence memory, auditability and calibration.',
  },
  {
    id: 'use-cases',
    index: 5,
    label: 'Use Cases',
    title: 'Use Cases',
    kicker: 'Area 05',
    ownership: 'confidence_engine',
    summary: 'Kubernetes RCA, support, compliance, security, code and multi-agent validation.',
  },
];

export const k8sDemoStep: ProductFlowStep = {
  id: K8S_DEMO_STEP_ID,
  index: 6,
  label: 'Deep Dive: Kubernetes RCA',
  title: 'Deep Dive: Kubernetes RCA Validation',
  kicker: 'Deep Dive',
  ownership: 'confidence_engine',
  summary: 'Technical walkthrough with incident evidence, metrics, scoring and decision.',
};
