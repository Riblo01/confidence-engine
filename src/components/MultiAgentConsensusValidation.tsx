import { Bot, GitCompareArrows, ShieldCheck } from 'lucide-react';
import { multiAgentValidation } from '../data/multiAgentValidation';

export default function MultiAgentConsensusValidation() {
  return (
    <div className="ma-shell">
      <div className="ma-agents">
        {multiAgentValidation.agents.map((agent) => (
          <article key={agent.role} className="ma-agent-card">
            <div className="ma-agent-head">
              <Bot size={18} />
              {agent.role}
            </div>
            <p>{agent.conclusion}</p>
            <div className="ma-evidence-list">
              {agent.evidence.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="ma-score-grid">
        {multiAgentValidation.scores.map((score) => (
          <article key={score.label} className="ma-score-card">
            <strong>{score.value}%</strong>
            <span>{score.label}</span>
            <p>{score.detail}</p>
          </article>
        ))}
      </div>

      <div className="ma-decision">
        <GitCompareArrows size={17} />
        <span>{multiAgentValidation.decision}</span>
        <ShieldCheck size={17} />
      </div>
    </div>
  );
}
