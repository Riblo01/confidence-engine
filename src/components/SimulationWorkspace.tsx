import { Pause, Play, RotateCcw, SkipForward } from 'lucide-react';
import { simulationScenarios } from '../data/simulationScenarios';
import { useSimulationMachine } from '../hooks/useSimulationMachine';

function statusFor(index: number, activeIndex: number, started: boolean, hasWarning: boolean, completed: boolean) {
  if (!started) return 'pending';
  if (index < activeIndex) return hasWarning ? 'warning' : 'completed';
  if (index === activeIndex) return completed && hasWarning ? 'warning' : 'processing';
  return 'pending';
}

export default function SimulationWorkspace() {
  const {
    state,
    scenario,
    activeStage,
    completed,
    currentScore,
    contradictionCount,
    warningCount,
    visibleEvidence,
    verdict,
    riskLevel,
    dispatch,
  } = useSimulationMachine();
  const circumference = 2 * Math.PI * 54;
  const gaugeOffset = circumference - (Math.min(currentScore, 100) / 100) * circumference;

  return (
    <div className="sim-workspace">
      <div className="sim-header">
        <div>
          <div className="eyebrow">Live processing workspace</div>
          <h2>Run an AI output through Confidence Engine.</h2>
        </div>
        <div className="sim-controls">
          <button onClick={() => dispatch({ type: 'start' })}>
            <Play size={14} />
            Start
          </button>
          <button onClick={() => dispatch({ type: 'next' })}>
            <SkipForward size={14} />
            Next
          </button>
          <button onClick={() => dispatch({ type: 'toggle_autoplay' })}>
            {state.autoplay ? <Pause size={14} /> : <Play size={14} />}
            {state.autoplay ? 'Pause' : 'Auto Play'}
          </button>
          <button onClick={() => dispatch({ type: 'reset' })}>
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="sim-scenario-selector">
        {simulationScenarios.map((item) => (
          <button
            key={item.id}
            className={item.id === scenario.id ? 'active' : ''}
            onClick={() => dispatch({ type: 'select_scenario', scenarioId: item.id })}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="sim-grid">
        <aside className="sim-timeline">
          {scenario.stages.map((stage, index) => {
            const status = statusFor(
              index,
              state.activeIndex,
              state.started,
              stage.warnings.length > 0,
              completed,
            );
            return (
              <button
                key={stage.id}
                className={`sim-timeline-step ${status}`}
                onClick={() => {
                  dispatch({ type: 'jump_to', index });
                }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{stage.label}</strong>
                <em>{status}</em>
              </button>
            );
          })}
        </aside>

        <main className="sim-stage-panel">
          <div className="sim-stage-kicker">{activeStage.label}</div>
          <h3>{state.started ? activeStage.processingMessage : 'Ready to process the selected AI output.'}</h3>
          <div className="sim-stage-transform">
            <article>
              <span>Input</span>
              <p>{activeStage.input}</p>
            </article>
            <article>
              <span>Output</span>
              <p>{state.started ? activeStage.output : 'Pending simulation start.'}</p>
            </article>
          </div>

          <div className="sim-output-preview">
            <span>AI-generated output</span>
            <blockquote>{scenario.generatedOutput}</blockquote>
            <p>{scenario.sourceContext}</p>
          </div>

          <div className="sim-evidence-progress">
            <span>Evidence appearing progressively</span>
            <div>
              {visibleEvidence.length === 0 ? (
                <em>No evidence collected yet.</em>
              ) : (
                visibleEvidence.map((evidence) => <b key={evidence}>{evidence}</b>)
              )}
            </div>
          </div>

          {state.started && activeStage.warnings.length > 0 && (
            <div className="sim-warning-list">
              {activeStage.warnings.map((warning) => (
                <span key={warning}>{warning}</span>
              ))}
            </div>
          )}
        </main>

        <aside className="sim-live-panel">
          <span className="sim-panel-label">Live Confidence Output</span>
          <div className="sim-live-gauge">
            <svg viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="54" />
              <circle
                cx="70"
                cy="70"
                r="54"
                className="gauge-progress"
                strokeDasharray={circumference}
                strokeDashoffset={gaugeOffset}
              />
            </svg>
            <div>
              <strong>{currentScore}%</strong>
              <span>confidence</span>
            </div>
          </div>
          <div className={`sim-live-verdict ${completed ? scenario.finalDecision.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '') : ''}`}>
            {verdict}
          </div>
          {state.started && !completed && <div className="sim-activity">Analyzing signals...</div>}
          <dl>
            <dt>Evidence coverage</dt>
            <dd>{visibleEvidence.length}/{scenario.evidenceSources.length}</dd>
            <dt>Missing evidence</dt>
            <dd>{Math.max(0, scenario.evidenceSources.length - visibleEvidence.length)}</dd>
            <dt>Contradictions</dt>
            <dd>{contradictionCount}</dd>
            <dt>Warnings</dt>
            <dd>{warningCount}</dd>
            <dt>Risk level</dt>
            <dd>{riskLevel}</dd>
          </dl>
          <div className="sim-recommendation">
            <span>Recommended action</span>
            <p>{completed ? scenario.recommendedAction : 'Decision pending until the evaluation completes.'}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
