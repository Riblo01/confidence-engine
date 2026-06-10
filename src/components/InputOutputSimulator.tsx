import type { CSSProperties } from 'react';
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, FileInput, ShieldCheck } from 'lucide-react';
import { simulatorScenarios } from '../data/evaluationSimulator';

const statusColor = {
  validated: '#22c55e',
  missing: '#f59e0b',
  contradiction: '#ef4444',
};

const decisionColor = {
  Trusted: '#22c55e',
  'Needs Human Review': '#f59e0b',
  'Low Confidence': '#f97316',
  'Unsafe / Blocked': '#ef4444',
};

export default function InputOutputSimulator() {
  const [scenarioId, setScenarioId] = useState(simulatorScenarios[0].id);
  const scenario = simulatorScenarios.find((item) => item.id === scenarioId) ?? simulatorScenarios[0];
  const decisionTone = decisionColor[scenario.decision];

  return (
    <div className="io-simulator">
      <div className="io-scenario-tabs">
        {simulatorScenarios.map((item) => (
          <button
            key={item.id}
            className={item.id === scenario.id ? 'active' : ''}
            onClick={() => setScenarioId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="io-simulator-grid">
        <section className="io-column input">
          <div className="io-column-title">
            <FileInput size={16} />
            Input
          </div>
          <span className="io-chip">{scenario.outputType}</span>
          <blockquote>{scenario.generatedOutput}</blockquote>
          <p>{scenario.context}</p>
        </section>

        <section className="io-column engine">
          <div className="io-column-title">
            <ShieldCheck size={16} />
            Confidence Engine
          </div>
          <div className="io-check-list">
            {scenario.checks.map((check) => (
              <article key={check.label} className="io-check">
                <div>
                  <strong>{check.label}</strong>
                  <span>{check.detail}</span>
                </div>
                <b>{check.value}%</b>
              </article>
            ))}
          </div>
          <div className="io-evidence-strip">
            {scenario.evidence.map((evidence) => (
              <span key={evidence.label} style={{ '--evidence-color': statusColor[evidence.status] } as CSSProperties}>
                {evidence.label}
              </span>
            ))}
          </div>
        </section>

        <section className="io-column output">
          <div className="io-column-title">
            <CheckCircle2 size={16} />
            Output
          </div>
          <div className="io-score" style={{ color: decisionTone }}>{scenario.score}%</div>
          <div className="io-decision" style={{ borderColor: `${decisionTone}66`, color: decisionTone }}>
            {scenario.decision}
          </div>
          <div className="io-risk">
            <AlertTriangle size={14} />
            Risk level: {scenario.riskLevel}
          </div>
          <div className="io-missing">
            <span>Missing evidence</span>
            <p>{scenario.missingEvidence.join(', ') || 'None'}</p>
          </div>
          <div className="io-action">{scenario.recommendedAction}</div>
        </section>
      </div>
    </div>
  );
}
