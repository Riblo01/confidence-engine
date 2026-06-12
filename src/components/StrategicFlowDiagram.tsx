import type { CSSProperties } from 'react';
import { useState } from 'react';
import { ArrowRight, Boxes, CheckCircle2, CircleDot } from 'lucide-react';
import { strategicFlowStages, getStrategicStageForStep } from '../data/strategicFlow';

interface Props {
  activeStepId: string;
  visitedSteps: Set<string>;
  onNavigate: (stepId: string) => void;
}

export default function StrategicFlowDiagram({ activeStepId, visitedSteps, onNavigate }: Props) {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  // A manual stage pick (used to disambiguate steps that map to more than one
  // stage) is only honored while it still contains the active step. Once the
  // user navigates elsewhere — e.g. via the sidebar — fall back to the stage
  // derived from the active step so the track and IO panel stay in sync.
  const selectedStage = strategicFlowStages.find((stage) => stage.id === selectedStageId);
  const activeStage =
    selectedStage?.stepIds.includes(activeStepId)
      ? selectedStage
      : getStrategicStageForStep(activeStepId);

  return (
    <section className="strategy-flow" aria-label="Strategic input and output flow">
      <div className="strategy-flow-header">
        <div>
          <div className="eyebrow">Interactive product flow</div>
          <h2>Follow the input-output path as the product advances.</h2>
        </div>
        <div className="strategy-flow-status">
          <CircleDot size={15} />
          Current: {activeStage.label}
        </div>
      </div>

      <div className="strategy-flow-track">
        {strategicFlowStages.map((stage, index) => {
          const isActive = stage.id === activeStage.id;
          const isVisited = stage.stepIds.some((stepId) => visitedSteps.has(stepId));

          return (
            <div key={stage.id} className="strategy-flow-node-wrap">
              <button
                className={`strategy-flow-node ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
                style={{ '--stage-color': stage.color } as CSSProperties}
                onClick={() => {
                  setSelectedStageId(stage.id);
                  onNavigate(stage.stepIds[0]);
                }}
              >
                <span className="strategy-flow-index">
                  {isVisited && !isActive ? <CheckCircle2 size={13} /> : String(index + 1).padStart(2, '0')}
                </span>
                <span>
                  <strong>{stage.label}</strong>
                  <small>{stage.caption}</small>
                </span>
              </button>
              {index < strategicFlowStages.length - 1 && <ArrowRight size={15} className="strategy-flow-arrow" />}
            </div>
          );
        })}
      </div>

      <div className="strategy-io-panel">
        <article>
          <span>Input</span>
          <p>{activeStage.input}</p>
        </article>
        <article>
          <span>Engine action</span>
          <p>{activeStage.engineAction}</p>
        </article>
        <article>
          <span>Output</span>
          <p>{activeStage.output}</p>
        </article>
        {activeStepId === 'k8s-demo' && (
          <article className="strategy-demo-note">
            <span>Live use case</span>
            <p><Boxes size={14} /> Kubernetes RCA shows the same flow with operational evidence and metrics.</p>
          </article>
        )}
      </div>
    </section>
  );
}
