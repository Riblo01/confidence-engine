import { useState } from 'react';
import { ArrowRight, FileCog, ListChecks, Scale, ShieldAlert, SlidersHorizontal } from 'lucide-react';
import type { EvaluationTemplate, TemplateScoreResult } from '../types';
import EvaluationTemplateSelector from './EvaluationTemplateSelector';
import ConfidenceCoreSection from './ConfidenceCoreSection';
import ConfidenceTemplateBuilder from './ConfidenceTemplateBuilder';

interface Props {
  templates: EvaluationTemplate[];
  selectedTemplateId: string;
  template: EvaluationTemplate;
  result: TemplateScoreResult;
  pilotApplied: boolean;
  onSelectTemplate: (id: string) => void;
  onWeightChange: (dimensionId: string, weight: number) => void;
  onToggleDimension: (dimensionId: string) => void;
  onReset: () => void;
}

const configTabs = [
  {
    id: 'template',
    label: 'Choose template',
    Icon: FileCog,
    input: 'Use case and output type',
    output: 'Domain-specific evaluation template',
  },
  {
    id: 'dimensions',
    label: 'Understand dimensions',
    Icon: ListChecks,
    input: 'Trust questions',
    output: 'Evidence, consistency, completeness, risk and actionability model',
  },
  {
    id: 'weights',
    label: 'Tune weights',
    Icon: SlidersHorizontal,
    input: 'Risk tolerance',
    output: '100-point priority budget',
  },
  {
    id: 'rules',
    label: 'Review rules',
    Icon: Scale,
    input: 'Thresholds and downgrade rules',
    output: 'Trusted, review, low confidence or blocked routing',
  },
] as const;

type ConfigTabId = typeof configTabs[number]['id'];

export default function ConfigurationWorkbench({
  templates,
  selectedTemplateId,
  template,
  result,
  pilotApplied,
  onSelectTemplate,
  onWeightChange,
  onToggleDimension,
  onReset,
}: Props) {
  const [activeTab, setActiveTab] = useState<ConfigTabId>('template');
  const [extraEvidence, setExtraEvidence] = useState<string[]>([]);
  const [forcedDowngrade, setForcedDowngrade] = useState(false);
  const active = configTabs.find((tab) => tab.id === activeTab) ?? configTabs[0];
  const evidenceOptions = ['Policy approval', 'Trace correlation', 'Rollback plan'];
  const allEvidence = [...template.required_evidence, ...extraEvidence];
  const sandboxDecision = forcedDowngrade
    ? 'Unsafe / Blocked'
    : result.verdict === 'Trusted'
      ? 'Trusted'
      : result.verdict === 'Needs Human Review'
        ? 'Needs Human Review'
        : 'Low Confidence';
  const riskLevel = forcedDowngrade
    ? 'Critical'
    : result.score >= 85
      ? 'Low'
      : result.score >= 65
        ? 'Medium'
        : 'High';

  return (
    <div className="config-workbench">
      <div className="config-tab-rail">
        {configTabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`config-tab ${id === activeTab ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      <div className="config-io">
        <article>
          <span>Input</span>
          <p>{active.input}</p>
        </article>
        <article>
          <span>Configuration output</span>
          <p>{active.output}</p>
        </article>
      </div>

      <div className="config-panel">
        {activeTab === 'template' && (
          <EvaluationTemplateSelector
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={onSelectTemplate}
          />
        )}

        {activeTab === 'dimensions' && <ConfidenceCoreSection />}

        {activeTab === 'weights' && (
          <ConfidenceTemplateBuilder
            template={template}
            result={result}
            onWeightChange={onWeightChange}
            onToggleDimension={onToggleDimension}
            onReset={onReset}
            pilotApplied={pilotApplied}
          />
        )}

        {activeTab === 'rules' && (
          <div className="rules-simulator">
            <section className="rules-hero">
              <div>
                <span className="rules-kicker">Decision Rules Simulator</span>
                <h3>See exactly what changes the trust decision.</h3>
                <p>
                  Thresholds define the baseline route. Downgrade rules override the score when risk evidence makes
                  the output unsafe to trust automatically.
                </p>
              </div>
              <div className={`rules-live-verdict ${forcedDowngrade ? 'blocked' : 'review'}`}>
                <span>Current route</span>
                <strong>{sandboxDecision}</strong>
                <em>Risk: {riskLevel}</em>
              </div>
            </section>

            <section className="rules-flow">
              <div className="rules-flow-node">
                <span>AI Output</span>
                <strong>Generated answer</strong>
              </div>
              <ArrowRight size={18} />
              <div className="rules-flow-node score">
                <span>Base score</span>
                <strong>{result.score.toFixed(1)}%</strong>
              </div>
              <ArrowRight size={18} />
              <div className={`rules-flow-node rule ${forcedDowngrade ? 'active' : ''}`}>
                <span>Rule check</span>
                <strong>{forcedDowngrade ? 'Triggered' : 'Not triggered'}</strong>
              </div>
              <ArrowRight size={18} />
              <div className={`rules-flow-node decision ${forcedDowngrade ? 'blocked' : 'review'}`}>
                <span>Trust decision</span>
                <strong>{sandboxDecision}</strong>
              </div>
            </section>

            <section className="rules-grid">
              <article className="threshold-ladder">
                <span className="rules-card-label">Threshold ladder</span>
                <div className="threshold-step trusted">
                  <strong>Trusted</strong>
                  <b>&gt;= {template.thresholds.trusted}%</b>
                  <small>Proceed with audit logging</small>
                </div>
                <div className="threshold-step review">
                  <strong>Needs Human Review</strong>
                  <b>{template.thresholds.review}%-{template.thresholds.trusted - 1}%</b>
                  <small>Human approval required</small>
                </div>
                <div className="threshold-step low">
                  <strong>Low Confidence</strong>
                  <b>&lt; {template.thresholds.review}%</b>
                  <small>Do not act without more evidence</small>
                </div>
              </article>

              <article className={`downgrade-spotlight ${forcedDowngrade ? 'active' : ''}`}>
                <div className="downgrade-head">
                  <ShieldAlert size={20} />
                  <div>
                    <span className="rules-card-label">Blocking rule</span>
                    <strong>Contradiction risk exceeds 50%</strong>
                  </div>
                </div>
                <p>{template.downgrade_rules.map((rule) => rule.effect).join(' ')}</p>
                <button
                  className={`rule-toggle ${forcedDowngrade ? 'active' : ''}`}
                  onClick={() => setForcedDowngrade((prev) => !prev)}
                >
                  {forcedDowngrade ? 'Rule ON - downgrade applied' : 'Rule OFF - use base score'}
                </button>
              </article>

              <article className="evidence-spotlight">
                <span className="rules-card-label">Required evidence</span>
                <strong>{allEvidence.length} sources required</strong>
                <p>{allEvidence.join(', ')}</p>
                <div className="config-pill-row">
                  {evidenceOptions.map((evidence) => {
                    const selected = extraEvidence.includes(evidence);
                    return (
                      <button
                        key={evidence}
                        className={selected ? 'selected' : ''}
                        onClick={() =>
                          setExtraEvidence((prev) =>
                            selected ? prev.filter((item) => item !== evidence) : [...prev, evidence],
                          )
                        }
                      >
                        {evidence}
                      </button>
                    );
                  })}
                </div>
              </article>
            </section>

            <section className="decision-explainer">
              <span className="rules-card-label">Why this decision?</span>
              <div>
                <p>
                  <strong>Base score:</strong> {result.score.toFixed(1)}%
                </p>
                <p>
                  <strong>Triggered rule:</strong>{' '}
                  {forcedDowngrade ? 'Contradiction risk exceeds blocking threshold.' : 'No downgrade rule is active.'}
                </p>
                <p>
                  <strong>Decision change:</strong>{' '}
                  {forcedDowngrade
                    ? 'The score route is overridden because operational risk is too high.'
                    : 'The decision follows the configured threshold ladder.'}
                </p>
                <p>
                  <strong>Next action:</strong>{' '}
                  {forcedDowngrade ? 'Block automation and require human validation.' : 'Route according to score.'}
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
