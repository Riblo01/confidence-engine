import { Boxes, Check } from 'lucide-react';
import type { ProductFlowStep } from '../types';

interface Props {
  steps: ProductFlowStep[];
  k8sDemoStep: ProductFlowStep;
  activeStepId: string;
  visitedSteps: Set<string>;
  onNavigate: (stepId: string) => void;
}

export default function ProductFlowNavigator({
  steps,
  k8sDemoStep,
  activeStepId,
  visitedSteps,
  onNavigate,
}: Props) {
  return (
    <nav className="pf-sidebar" aria-label="Product flow">
      <div className="pf-sidebar-title">Product areas</div>

      {steps.map((step) => {
        const isActive = step.id === activeStepId;
        const isVisited = visitedSteps.has(step.id);
        return (
          <button
            key={step.id}
            className={`pf-step ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
            onClick={() => onNavigate(step.id)}
            title={step.summary}
          >
            <span className="pf-step-index">{String(step.index).padStart(2, '0')}</span>
            <span className="pf-step-text">
              <span className="pf-step-label">{step.label}</span>
              {isActive && <span className="pf-step-summary">{step.summary}</span>}
            </span>
            {isVisited && !isActive && <Check size={14} className="pf-step-check" />}
          </button>
        );
      })}

      <div className="pf-divider">Technical deep dive</div>

      <button
        className={`pf-step pf-step-featured ${activeStepId === k8sDemoStep.id ? 'active' : ''} ${visitedSteps.has(k8sDemoStep.id) ? 'visited' : ''}`}
        onClick={() => onNavigate(k8sDemoStep.id)}
        title={k8sDemoStep.summary}
      >
        <span className="pf-step-index">
          <Boxes size={12} />
        </span>
        <span className="pf-step-text">
          <span className="pf-step-label">{k8sDemoStep.label}</span>
          {activeStepId === k8sDemoStep.id && <span className="pf-step-summary">{k8sDemoStep.summary}</span>}
        </span>
        {visitedSteps.has(k8sDemoStep.id) && activeStepId !== k8sDemoStep.id && (
          <Check size={14} className="pf-step-check" />
        )}
      </button>

    </nav>
  );
}
