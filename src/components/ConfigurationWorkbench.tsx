import { useState } from 'react';
import { FileCog, ListChecks, Scale, SlidersHorizontal } from 'lucide-react';
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
          <div className="config-rules-workbench">
            <div className="config-rules-panel">
              <div>
                <span>Trusted threshold</span>
                <strong>{template.thresholds.trusted}%</strong>
                <p>Outputs at or above this score can proceed under normal audit logging.</p>
              </div>
              <div>
                <span>Review threshold</span>
                <strong>{template.thresholds.review}%</strong>
                <p>Outputs between review and trusted thresholds require human approval.</p>
              </div>
              <div>
                <span>Downgrade rules</span>
                <strong>{template.downgrade_rules.length}</strong>
                <p>{template.downgrade_rules.map((rule) => rule.effect).join(' ')}</p>
              </div>
              <div>
                <span>Required evidence</span>
                <strong>{allEvidence.length}</strong>
                <p>{allEvidence.join(', ')}</p>
              </div>
            </div>

            <div className="config-live-controls">
              <article>
                <span>Add evidence requirement</span>
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

              <article>
                <span>Trigger downgrade rule</span>
                <button
                  className={`config-rule-trigger ${forcedDowngrade ? 'selected' : ''}`}
                  onClick={() => setForcedDowngrade((prev) => !prev)}
                >
                  Contradiction risk exceeds blocking threshold
                </button>
              </article>

              <article className="config-sandbox-output">
                <span>Live sandbox output</span>
                <div>
                  <strong>{result.score.toFixed(1)}%</strong>
                  <b>{sandboxDecision}</b>
                  <em>Risk: {riskLevel}</em>
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
