import { ChevronRight } from 'lucide-react';
import FlowNode from './FlowNode';
import type { MissionStep, MissionStepId, StepStatus } from '../types';

interface Props {
  steps: MissionStep[];
  stepStatuses: Record<MissionStepId, StepStatus>;
  processingStepId: MissionStepId | null;
  onStepClick: (id: MissionStepId) => void;
}

export default function InteractiveFlowMap({ steps, stepStatuses, processingStepId: _p, onStepClick }: Props) {
  return (
    <div className="mc-flow-map">
      <div className="mc-flow-row">
        {steps.map((step, stepIdx) => {
          const status = stepStatuses[step.id];
          return (
            <div key={step.id} className="mc-flow-cell">
              <FlowNode
                step={step}
                status={status}
                index={stepIdx}
                onClick={() => onStepClick(step.id)}
              />
              {stepIdx < steps.length - 1 && (
                <ChevronRight
                  size={14}
                  className={`mc-flow-arrow ${status === 'completed' ? 'mc-flow-arrow--active' : ''}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
