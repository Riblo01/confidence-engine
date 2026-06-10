import { useEffect, useMemo, useReducer } from 'react';
import { simulationScenarios } from '../data/simulationScenarios';

interface State {
  scenarioId: string;
  activeIndex: number;
  started: boolean;
  autoplay: boolean;
}

type Action =
  | { type: 'select_scenario'; scenarioId: string }
  | { type: 'start' }
  | { type: 'next' }
  | { type: 'jump_to'; index: number }
  | { type: 'reset' }
  | { type: 'toggle_autoplay' }
  | { type: 'pause' };

const initialState: State = {
  scenarioId: simulationScenarios[0].id,
  activeIndex: 0,
  started: false,
  autoplay: false,
};

function reducer(state: State, action: Action): State {
  const scenario =
    simulationScenarios.find((item) => item.id === state.scenarioId) ?? simulationScenarios[0];

  switch (action.type) {
    case 'select_scenario':
      return { scenarioId: action.scenarioId, activeIndex: 0, started: false, autoplay: false };
    case 'start':
      return { ...state, started: true, activeIndex: 0 };
    case 'next':
      return {
        ...state,
        started: true,
        activeIndex: Math.min(state.activeIndex + 1, scenario.stages.length - 1),
      };
    case 'jump_to':
      return {
        ...state,
        started: true,
        activeIndex: Math.max(0, Math.min(action.index, scenario.stages.length - 1)),
      };
    case 'reset':
      return { ...state, activeIndex: 0, started: false, autoplay: false };
    case 'toggle_autoplay':
      return { ...state, started: true, autoplay: !state.autoplay };
    case 'pause':
      return { ...state, autoplay: false };
    default:
      return state;
  }
}

export function useSimulationMachine() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const scenario = useMemo(
    () => simulationScenarios.find((item) => item.id === state.scenarioId) ?? simulationScenarios[0],
    [state.scenarioId],
  );
  const activeStage = scenario.stages[state.activeIndex];
  const completed = state.started && state.activeIndex === scenario.stages.length - 1;

  useEffect(() => {
    if (!state.autoplay || completed) return;

    const timer = window.setTimeout(() => {
      dispatch({ type: 'next' });
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [state.autoplay, state.activeIndex, completed]);

  const currentScore = state.started
    ? Math.min(
        scenario.finalScore,
        Math.max(12, scenario.stages.slice(0, state.activeIndex + 1).reduce((sum, stage) => sum + stage.confidenceImpact, 0)),
      )
    : 0;

  const contradictionCount = state.started
    ? scenario.stages
        .slice(0, state.activeIndex + 1)
        .filter((stage) => stage.warnings.some((warning) => warning.toLowerCase().includes('contradict') || warning.toLowerCase().includes('conflict'))).length
    : 0;

  const warningCount = state.started
    ? scenario.stages.slice(0, state.activeIndex + 1).reduce((sum, stage) => sum + stage.warnings.length, 0)
    : 0;

  const visibleEvidence = state.started
    ? scenario.evidenceSources.slice(0, Math.min(scenario.evidenceSources.length, state.activeIndex + 1))
    : [];

  const verdict = completed ? scenario.finalDecision : state.started ? 'Processing' : 'Idle';
  const riskLevel = completed ? scenario.finalRisk : warningCount > 1 ? 'Elevated' : state.started ? 'Pending' : 'Pending';

  return {
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
  };
}
