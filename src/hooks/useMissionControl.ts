import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { MissionState, MissionStepId, StepStatus, MissionScenario } from '../types';
import { getMissionScenario, STEP_ORDER } from '../data/missionScenarios';

// ─── Initial state factory ────────────────────────────────────────────────────

function buildInitialState(scenarioId: string): MissionState {
  const statuses = Object.fromEntries(
    STEP_ORDER.map((id, i) => [id, i === 0 ? ('ready' as StepStatus) : ('locked' as StepStatus)]),
  ) as Record<MissionStepId, StepStatus>;

  return {
    scenarioId,
    stepStatuses: statuses,
    processingStepId: null,
    confidenceScore: null,
    partialScore: null,
    verdict: null,
    evidenceCoverage: null,
    contradictionCount: 0,
    riskLevel: 'none',
    recommendedAction: null,
    feedbackSubmitted: false,
    selectedFeedback: null,
    memoryUpdated: false,
    autoPlay: false,
  };
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SELECT_SCENARIO'; scenarioId: string }
  | { type: 'ADVANCE_STEP'; stepId: MissionStepId }
  | { type: 'COMPLETE_STEP'; stepId: MissionStepId; scenario: MissionScenario }
  | { type: 'SUBMIT_FEEDBACK'; feedback: string }
  | { type: 'TOGGLE_AUTOPLAY' }
  | { type: 'RESET' };

function deriveUpdatesForStep(
  stepId: MissionStepId,
  scenario: MissionScenario,
): Partial<MissionState> {
  switch (stepId) {
    case 'validate_evidence': {
      const validated = scenario.evidenceSources.filter((e) => e.status === 'validated').length;
      return { evidenceCoverage: Math.round((validated / scenario.evidenceSources.length) * 100) };
    }
    case 'analyze_consistency': {
      const dims = scenario.confidenceDimensions.slice(0, 3);
      const totalWeight = dims.reduce((s, d) => s + d.weight, 0);
      const weighted = dims.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight;
      return { partialScore: Math.round(weighted * 0.65) };
    }
    case 'detect_contradictions': {
      const highRisks = scenario.risks.filter((r) => r.severity === 'high').length;
      const medRisks = scenario.risks.filter((r) => r.severity === 'medium').length;
      return {
        contradictionCount: scenario.contradictions.length,
        riskLevel: highRisks > 0 ? 'high' : medRisks > 0 ? 'medium' : 'low',
      };
    }
    case 'calculate_confidence':
      return { confidenceScore: scenario.finalScore };
    case 'generate_decision':
      return { verdict: scenario.finalVerdict, recommendedAction: scenario.recommendedAction };
    case 'update_memory':
      return { memoryUpdated: true };
    default:
      return {};
  }
}

function reducer(state: MissionState, action: Action): MissionState {
  switch (action.type) {
    case 'SELECT_SCENARIO':
      return { ...buildInitialState(action.scenarioId), autoPlay: state.autoPlay };

    case 'ADVANCE_STEP': {
      if (state.stepStatuses[action.stepId] !== 'ready') return state;
      return {
        ...state,
        stepStatuses: { ...state.stepStatuses, [action.stepId]: 'processing' },
        processingStepId: action.stepId,
      };
    }

    case 'COMPLETE_STEP': {
      const { stepId, scenario } = action;
      const idx = STEP_ORDER.indexOf(stepId);
      const nextId = idx < STEP_ORDER.length - 1 ? (STEP_ORDER[idx + 1] as MissionStepId) : null;

      const newStatuses = { ...state.stepStatuses, [stepId]: 'completed' as StepStatus };
      if (nextId) newStatuses[nextId] = 'ready';

      return {
        ...state,
        ...deriveUpdatesForStep(stepId, scenario),
        stepStatuses: newStatuses,
        processingStepId: null,
      };
    }

    case 'SUBMIT_FEEDBACK':
      return { ...state, feedbackSubmitted: true, selectedFeedback: action.feedback };

    case 'TOGGLE_AUTOPLAY':
      return { ...state, autoPlay: !state.autoPlay };

    case 'RESET':
      return { ...buildInitialState(state.scenarioId), autoPlay: state.autoPlay };

    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMissionControl(defaultScenarioId = 'k8s_rca') {
  const [state, dispatch] = useReducer(reducer, buildInitialState(defaultScenarioId));
  const processingRef = useRef(false);

  const scenario = getMissionScenario(state.scenarioId)!;

  const advanceMissionStep = useCallback(
    (stepId: MissionStepId) => {
      if (processingRef.current) return;
      if (state.stepStatuses[stepId] !== 'ready') return;

      processingRef.current = true;
      dispatch({ type: 'ADVANCE_STEP', stepId });

      setTimeout(() => {
        dispatch({ type: 'COMPLETE_STEP', stepId, scenario });
        processingRef.current = false;
      }, 900);
    },
    [state.stepStatuses, scenario],
  );

  const selectScenario = useCallback((id: string) => {
    processingRef.current = false;
    dispatch({ type: 'SELECT_SCENARIO', scenarioId: id });
  }, []);

  const submitFeedback = useCallback((feedback: string) => {
    dispatch({ type: 'SUBMIT_FEEDBACK', feedback });
    // Auto-complete submit_feedback step so update_memory unlocks
    const stepId: MissionStepId = 'submit_feedback';
    dispatch({ type: 'COMPLETE_STEP', stepId, scenario });
  }, [scenario]);

  const resetDemo = useCallback(() => {
    processingRef.current = false;
    dispatch({ type: 'RESET' });
  }, []);

  const toggleAutoPlay = useCallback(() => {
    dispatch({ type: 'TOGGLE_AUTOPLAY' });
  }, []);

  // Auto-play: find the current "ready" step and advance it
  useEffect(() => {
    if (!state.autoPlay) return;
    if (processingRef.current) return;

    const nextReady = STEP_ORDER.find(
      (id) => state.stepStatuses[id as MissionStepId] === 'ready',
    ) as MissionStepId | undefined;

    if (!nextReady) return;

    // Special case: submit_feedback needs a feedback value
    if (nextReady === 'submit_feedback') {
      const timer = setTimeout(() => {
        submitFeedback(scenario.feedbackOptions[0]);
      }, 1600);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      advanceMissionStep(nextReady);
    }, 1600);

    return () => clearTimeout(timer);
  }, [state.autoPlay, state.stepStatuses, advanceMissionStep, submitFeedback, scenario]);

  // Derived helper
  const currentReadyStep = STEP_ORDER.find(
    (id) => state.stepStatuses[id as MissionStepId] === 'ready',
  ) as MissionStepId | undefined;

  const allComplete = STEP_ORDER.every(
    (id) => state.stepStatuses[id as MissionStepId] === 'completed',
  );

  return {
    state,
    scenario,
    advanceMissionStep,
    selectScenario,
    submitFeedback,
    resetDemo,
    toggleAutoPlay,
    currentReadyStep,
    allComplete,
  };
}
