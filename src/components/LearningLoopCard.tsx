import type { CSSProperties } from 'react';
import { ArrowRight, BrainCircuit, CheckCircle2, Database, GitBranch, ShieldCheck, SlidersHorizontal } from 'lucide-react';

export default function LearningLoopCard() {
  const steps = [
    {
      label: 'Human Verdict',
      Icon: CheckCircle2,
      color: '#3b82f6',
      desc: 'SRE marks the RCA as useful, incomplete, contradicted or unsafe.',
    },
    {
      label: 'Pattern Memory',
      Icon: GitBranch,
      color: '#f59e0b',
      desc: 'The incident is grouped by Kubernetes pattern, telemetry signals and outcome.',
    },
    {
      label: 'Scoring Tuning',
      Icon: SlidersHorizontal,
      color: '#8b5cf6',
      desc: 'Weights and validation harnesses are adjusted for future similar cases.',
    },
    {
      label: 'Safer RCA',
      Icon: ShieldCheck,
      color: '#22c55e',
      desc: 'The next analysis gets stronger checks before engineers act on it.',
    },
  ];

  const capturedSignals = [
    'Final verdict',
    'Rejected hypotheses',
    'Validated evidence',
    'Missing telemetry',
    'Engineer correction',
    'Recommended action outcome',
  ];

  const learningImpact = [
    { label: 'Useful RCA', value: '89%', tone: 'good' },
    { label: 'Incorrect RCA', value: '4%', tone: 'bad' },
    { label: 'Harness updates', value: '+17', tone: 'warn' },
  ];

  return (
    <div className="learning-card">
      <div className="learning-card-header">
        <div>
          <div className="learning-eyebrow">
            <Database size={14} />
            Learning Loop
          </div>
          <h3>How the platform gets more reliable after every reviewed incident</h3>
        </div>
        <span className="learning-badge">Future Integration</span>
      </div>

      <div className="learning-card-body">
        <div className="learning-hero">
          <div>
            <p>
              After an SRE accepts, corrects or rejects an RCA, the platform stores that decision as operational
              feedback. Future RCA validations use that feedback to detect weak evidence earlier, penalize repeated
              mistakes and strengthen the scoring model for similar Kubernetes incidents.
            </p>
            <div className="learning-signal-grid">
              {capturedSignals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
          </div>

          <div className="learning-pattern-card">
            <div className="learning-pattern-title">Example learned pattern</div>
            <div className="learning-pattern-name">Redis Saturation</div>
            <div className="learning-pattern-subtitle">Grouped from reviewed RCA decisions</div>
            <div className="learning-impact-grid">
              {learningImpact.map((item) => (
                <div key={item.label} className={`learning-impact ${item.tone}`}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="learning-flow">
          {steps.map((step, i) => (
            <div key={step.label} className="learning-flow-item">
              <div className="learning-flow-node" style={{ '--learning-color': step.color } as CSSProperties}>
                <div className="learning-flow-icon">
                  <step.Icon size={18} />
                </div>
                <strong>{step.label}</strong>
                <p>{step.desc}</p>
              </div>
              {i < steps.length - 1 && <ArrowRight size={16} className="learning-flow-arrow" />}
            </div>
          ))}
        </div>

        <div className="learning-storage">
          <div className="learning-storage-icon">
            <BrainCircuit size={18} />
          </div>
          <div>
            <strong>Feedback record schema</strong>
            <code>incident_id, verdict, feedback_type, engineer_id, timestamp, pattern_matched, score_delta</code>
          </div>
        </div>
      </div>
    </div>
  );
}
