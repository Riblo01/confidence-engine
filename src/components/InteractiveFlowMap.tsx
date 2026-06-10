import { ChevronRight, ChevronDown } from 'lucide-react';
import FlowNode from './FlowNode';
import type { MissionStep, MissionStepId, StepStatus } from '../types';

interface Props {
  steps: MissionStep[];
  stepStatuses: Record<MissionStepId, StepStatus>;
  processingStepId: MissionStepId | null;
  onStepClick: (id: MissionStepId) => void;
}

// Layout: 3 rows of 3 nodes in a serpentine pattern
const ROWS = [
  [0, 1, 2],   // left → right
  [3, 4, 5],   // left → right
  [6, 7, 8],   // left → right
];

export default function InteractiveFlowMap({ steps, stepStatuses, processingStepId: _p, onStepClick }: Props) {
  return (
    <div className="mc-flow-map">
      {ROWS.map((row, rowIdx) => (
        <div key={rowIdx} className="mc-flow-row">
          {row.map((stepIdx, colIdx) => {
            const step = steps[stepIdx];
            const status = stepStatuses[step.id];
            return (
              <div key={step.id} className="mc-flow-cell">
                <FlowNode
                  step={step}
                  status={status}
                  index={stepIdx}
                  onClick={() => onStepClick(step.id)}
                />
                {colIdx < row.length - 1 && (
                  <ChevronRight
                    size={16}
                    className={`mc-flow-arrow ${status === 'completed' ? 'mc-flow-arrow--active' : ''}`}
                  />
                )}
              </div>
            );
          })}
          {rowIdx < ROWS.length - 1 && (
            <div className="mc-flow-row-connector">
              <ChevronDown size={14} className="mc-flow-arrow-down" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
