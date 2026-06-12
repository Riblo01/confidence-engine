import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap } from 'lucide-react';
import { useMissionControl } from '../hooks/useMissionControl';
import { missionScenarios, MISSION_STEPS } from '../data/missionScenarios';
import type { MissionStepId } from '../types';

import ScenarioSelector from './ScenarioSelector';
import AiInputCard from './AiInputCard';
import InteractiveFlowMap from './InteractiveFlowMap';
import LiveConfidencePanel from './LiveConfidencePanel';
import EvidenceRevealPanel from './EvidenceRevealPanel';
import RiskDetectionPanel from './RiskDetectionPanel';
import TrustDecisionCard from './TrustDecisionCard';
import HumanFeedbackAction from './HumanFeedbackAction';
import LearningMemoryUpdate from './LearningMemoryUpdate';
import MissionControlSummary from './MissionControlSummary';
import DecisionDistributionBar from './DecisionDistributionBar';
import DecisionRouteCard from './DecisionRouteCard';
import PilotModeInfoPanel from './PilotModeInfoPanel';

// ─── Dimension scores panel (for analyze_consistency step) ────────────────────

function DimensionScoresPanel({ dims }: { dims: { id: string; name: string; score: number; weight: number }[] }) {
  return (
    <motion.div className="mc-dims-panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="mc-panel-header">Dimension Analysis</div>
      {dims.map((d, i) => (
        <motion.div
          key={d.id}
          className="mc-dim-row"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08, duration: 0.3 }}
        >
          <span className="mc-dim-name">{d.name}</span>
          <div className="mc-dim-bar-track">
            <motion.div
              className="mc-dim-bar-fill"
              style={{ background: d.score >= 70 ? '#22c55e' : d.score >= 50 ? '#f59e0b' : '#ef4444' }}
              initial={{ width: 0 }}
              animate={{ width: `${d.score}%` }}
              transition={{ delay: i * 0.08 + 0.1, duration: 0.6, ease: 'easeOut' }}
            />
          </div>
          <span className="mc-dim-score">{d.score}</span>
          <span className="mc-dim-weight">w={d.weight}%</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Input contract panel ─────────────────────────────────────────────────────

function InputContractPanel({ contract }: { contract: { output_type: string; required_evidence: string[]; thresholds: { trusted: number; review: number } } }) {
  return (
    <motion.div
      className="mc-contract-panel"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mc-panel-header">Input Contract Parsed</div>
      <div className="mc-contract-type">Output type: <strong>{contract.output_type}</strong></div>
      <div className="mc-contract-thresholds">
        <span className="mc-threshold mc-threshold--trusted">Trusted ≥ {contract.thresholds.trusted}</span>
        <span className="mc-threshold mc-threshold--review">Review ≥ {contract.thresholds.review}</span>
        <span className="mc-threshold mc-threshold--low">Low &lt; {contract.thresholds.review}</span>
      </div>
      <div className="mc-contract-evidence-label">Required evidence ({contract.required_evidence.length} items)</div>
      <ul className="mc-contract-evidence-list">
        {contract.required_evidence.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─── Content area — picks the right panel for the current step ────────────────

function ActiveContent({
  state,
  scenario,
  onSubmitFeedback,
}: {
  state: ReturnType<typeof useMissionControl>['state'];
  scenario: ReturnType<typeof useMissionControl>['scenario'];
  onSubmitFeedback: (f: string) => void;
}) {
  const s = state.stepStatuses;

  // Show the latest meaningful completed step's content
  if (s.update_memory === 'completed') {
    return <LearningMemoryUpdate updates={scenario.learningUpdate} />;
  }
  if (s.submit_feedback === 'ready' || s.submit_feedback === 'processing' || s.submit_feedback === 'completed') {
    return (
      <HumanFeedbackAction
        options={scenario.feedbackOptions}
        onSubmit={onSubmitFeedback}
        submitted={state.feedbackSubmitted}
        selected={state.selectedFeedback}
      />
    );
  }
  if (s.generate_decision === 'completed') {
    return (
      <TrustDecisionCard
        score={state.confidenceScore!}
        verdict={state.verdict!}
        action={state.recommendedAction!}
      />
    );
  }
  if (s.detect_contradictions === 'completed' || s.calculate_confidence === 'completed') {
    return <RiskDetectionPanel risks={scenario.risks} contradictions={scenario.contradictions} />;
  }
  if (s.analyze_consistency === 'completed') {
    return <DimensionScoresPanel dims={scenario.confidenceDimensions} />;
  }
  if (s.validate_evidence === 'completed') {
    return <EvidenceRevealPanel sources={scenario.evidenceSources} />;
  }
  if (s.parse_contract === 'completed') {
    return <InputContractPanel contract={scenario.inputContract} />;
  }
  return (
    <div className="mc-content-empty">
      <Zap size={28} className="mc-content-empty-icon" />
      <p>Click <strong>Start Evaluation</strong> to begin the pipeline</p>
    </div>
  );
}

// ─── Primary action button ────────────────────────────────────────────────────

function PrimaryActionButton({
  currentReadyStep,
  processingStepId,
  allComplete,
  onAdvance,
  onReset,
}: {
  currentReadyStep: MissionStepId | undefined;
  processingStepId: MissionStepId | null;
  allComplete: boolean;
  onAdvance: (id: MissionStepId) => void;
  onReset: () => void;
}) {
  if (allComplete) {
    return (
      <motion.button
        className="mc-action-btn mc-action-btn--reset"
        onClick={onReset}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <RotateCcw size={16} />
        Reset Demo
      </motion.button>
    );
  }

  if (processingStepId) {
    const step = MISSION_STEPS.find((s) => s.id === processingStepId);
    return (
      <motion.button className="mc-action-btn mc-action-btn--processing" disabled>
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
          style={{ display: 'inline-flex' }}
        >
          ⚙
        </motion.span>
        {step?.actionLabel ?? 'Processing…'}
      </motion.button>
    );
  }

  if (!currentReadyStep) return null;

  if (currentReadyStep === 'submit_feedback') return null;

  const step = MISSION_STEPS.find((s) => s.id === currentReadyStep)!;

  return (
    <motion.button
      className="mc-action-btn mc-action-btn--primary"
      onClick={() => onAdvance(currentReadyStep)}
      whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(99,102,241,0.45)' }}
      whileTap={{ scale: 0.97 }}
      layout
    >
      <Play size={16} />
      {step.actionLabel}
    </motion.button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function MissionControl() {
  const {
    state,
    scenario,
    advanceMissionStep,
    selectScenario,
    submitFeedback,
    resetDemo,
    currentReadyStep,
    allComplete,
  } = useMissionControl();

  const startCompleted = state.stepStatuses.start === 'completed';
  const handleSelectRoute = (id: string) => {
    selectScenario(id);
    window.setTimeout(() => {
      document.querySelector('.mc-center')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="mc-shell">
      <div className="mc-intake">
        <div className="mc-executive-head">
          <div>
            <span>Evaluation intake</span>
            <h2>Select an AI-generated output and run the confidence pipeline.</h2>
            <p>
              The final route is intentionally hidden until the evaluation finishes. Use the scenario list below,
              then execute the workflow step by step.
            </p>
          </div>
          <PilotModeInfoPanel />
        </div>
      </div>

      <section className="mc-workspace">
        <div className="mc-workspace-header">
          <div>
            <span>Active evaluation</span>
            <strong>{scenario.useCaseName}</strong>
            <p>{scenario.generatedOutputType}</p>
          </div>
          <span className="mc-workspace-hint">Run the pipeline to reveal score, route and recommended action.</span>
        </div>

        <div className="mc-workspace-grid">
          <div className="mc-left">
            <ScenarioSelector
              scenarios={missionScenarios}
              selectedId={state.scenarioId}
              onSelect={handleSelectRoute}
            />
            <AiInputCard scenario={scenario} visible={startCompleted} />
          </div>

          <div className="mc-center">
            <InteractiveFlowMap
              steps={MISSION_STEPS}
              stepStatuses={state.stepStatuses}
              processingStepId={state.processingStepId}
              onStepClick={advanceMissionStep}
            />

            <div className="mc-content-area">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentReadyStep ?? 'done'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  style={{ height: '100%' }}
                >
                  <ActiveContent
                    state={state}
                    scenario={scenario}
                    onSubmitFeedback={submitFeedback}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mc-action-area">
              <PrimaryActionButton
                currentReadyStep={currentReadyStep}
                processingStepId={state.processingStepId}
                allComplete={allComplete}
                onAdvance={advanceMissionStep}
                onReset={resetDemo}
              />
            </div>
          </div>

          <div className="mc-right">
            <LiveConfidencePanel state={state} />
          </div>
        </div>
      </section>

      <section className={`mc-executive mc-results ${allComplete ? 'revealed' : 'locked'}`}>
        <div className="mc-results-lock">
          <span>Execution results</span>
          <strong>{allComplete ? 'Decision routes generated' : 'Results unlock after the pipeline completes'}</strong>
          <p>
            {allComplete
              ? 'The cards below summarize the evaluated routes across trusted, review and blocked outcomes.'
              : 'Complete feedback and memory update to reveal the executive distribution and route cards.'}
          </p>
        </div>

        {allComplete && (
          <>
            <MissionControlSummary scenarios={missionScenarios} />
            <DecisionDistributionBar scenarios={missionScenarios} />
            <div className="mc-route-grid">
              {missionScenarios.map((item) => (
                <DecisionRouteCard
                  key={item.id}
                  scenario={item}
                  selected={item.id === state.scenarioId}
                  onSelect={handleSelectRoute}
                />
              ))}
            </div>
          </>
        )}
      </section>

    </div>
  );
}
