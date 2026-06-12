import { useMemo, useState } from 'react';
import type { EvaluationTemplate } from '../types';
import { productFlowSteps, k8sDemoStep, K8S_DEMO_STEP_ID } from '../data/productFlow';
import { evaluationTemplates, getTemplateById } from '../data/evaluationTemplates';
import { calculateTemplateScore } from '../scoring/templateEngine';

import ProductFlowNavigator from './ProductFlowNavigator';
import InvestigationSection from './InvestigationSection';
import ProductFlowChapter from './ProductFlowChapter';
import PresentationBriefing from './PresentationBriefing';
import BeforeAfterTrustStory from './BeforeAfterTrustStory';
import ProductPositioningScreen from './ProductPositioningScreen';
import GeneralProductScope from './GeneralProductScope';
import ConfigurationLayerSection from './ConfigurationLayerSection';
import ConfigurationWorkbench from './ConfigurationWorkbench';
import TrustDecisionCenter from './TrustDecisionCenter';
import InputOutputSimulator from './InputOutputSimulator';
import LearningGovernanceOverview from './LearningGovernanceOverview';
import KubernetesRcaDemo from './KubernetesRcaDemo';
import ProofUseCasesOverview from './ProofUseCasesOverview';

function rebalanceEnabledWeights(
  dimensions: EvaluationTemplate['dimensions'],
): EvaluationTemplate['dimensions'] {
  const enabled = dimensions.filter((d) => d.enabled);
  if (enabled.length === 0) return dimensions;

  const currentTotal = enabled.reduce((sum, d) => sum + d.weight, 0);
  if (currentTotal === 100) return dimensions;

  if (currentTotal <= 0) {
    const base = Math.floor(100 / enabled.length);
    const remainder = 100 - base * enabled.length;
    let seen = 0;

    return dimensions.map((d) => {
      if (!d.enabled) return d;
      const weight = base + (seen === 0 ? remainder : 0);
      seen += 1;
      return { ...d, weight };
    });
  }

  const scaled = enabled.map((d) => ({
    id: d.id,
    weight: Math.round((d.weight / currentTotal) * 100),
  }));
  const roundingDelta = 100 - scaled.reduce((sum, d) => sum + d.weight, 0);
  scaled[0] = { ...scaled[0], weight: scaled[0].weight + roundingDelta };

  const nextById = new Map(scaled.map((d) => [d.id, d.weight]));
  return dimensions.map((d) => (d.enabled ? { ...d, weight: nextById.get(d.id) ?? d.weight } : d));
}

function cloneTemplate(id: string): EvaluationTemplate {
  const template = structuredClone(getTemplateById(id));
  return {
    ...template,
    dimensions: rebalanceEnabledWeights(template.dimensions),
  };
}

function redistributeWeights(
  dimensions: EvaluationTemplate['dimensions'],
  changedId: string,
  nextWeight: number,
): EvaluationTemplate['dimensions'] {
  const changed = dimensions.find((d) => d.id === changedId);
  if (!changed?.enabled) return dimensions;

  const enabledOthers = dimensions.filter((d) => d.enabled && d.id !== changedId);
  const clampedWeight = Math.max(0, Math.min(100, nextWeight));
  const remainingWeight = 100 - clampedWeight;

  if (enabledOthers.length === 0) {
    return dimensions.map((d) => (d.id === changedId ? { ...d, weight: 100 } : d));
  }

  const currentOtherTotal = enabledOthers.reduce((sum, d) => sum + d.weight, 0);
  const scaledOthers =
    currentOtherTotal > 0
      ? enabledOthers.map((d) => ({
          id: d.id,
          weight: Math.round((d.weight / currentOtherTotal) * remainingWeight),
        }))
      : enabledOthers.map((d) => ({
          id: d.id,
          weight: Math.floor(remainingWeight / enabledOthers.length),
        }));

  const roundingDelta = remainingWeight - scaledOthers.reduce((sum, d) => sum + d.weight, 0);
  if (scaledOthers.length > 0) {
    scaledOthers[0] = {
      ...scaledOthers[0],
      weight: scaledOthers[0].weight + roundingDelta,
    };
  }

  const nextById = new Map(scaledOthers.map((d) => [d.id, d.weight]));

  return dimensions.map((d) => {
    if (d.id === changedId) return { ...d, weight: clampedWeight };
    if (!d.enabled) return d;
    return { ...d, weight: nextById.get(d.id) ?? d.weight };
  });
}

const PF_CHAPTERS = [
  { index: 1, title: 'Presentation brief',          summary: 'The exact storyline to cover in the hackathon pitch.' },
  { index: 2, title: 'The problem and the answer',  summary: 'AI output is moving faster than trust controls — Confidence Engine is the layer in between.' },
  { index: 3, title: 'What the product is',          summary: 'A validation engine for any AI-generated output. It never generates — it evaluates.' },
  { index: 4, title: 'What changes with it',         summary: 'The same AI output: acted on blindly, or validated into a safe action.' },
] as const;

export default function ProductExperience() {
  const [activeStepId, setActiveStepId] = useState('product-flow');
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => new Set(['product-flow']));
  const [activeChapter, setActiveChapter] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState('kubernetes_rca');
  const [workingTemplate, setWorkingTemplate] = useState<EvaluationTemplate>(() =>
    cloneTemplate('kubernetes_rca'),
  );
  const [pilotApplied, setPilotApplied] = useState(false);

  const scoreResult = useMemo(() => calculateTemplateScore(workingTemplate), [workingTemplate]);

  function handleNavigate(stepId: string) {
    setActiveStepId(stepId);
    setVisitedSteps((prev) => new Set(prev).add(stepId));
  }

  function handleSelectTemplate(id: string) {
    setSelectedTemplateId(id);
    setWorkingTemplate(cloneTemplate(id));
    setPilotApplied(false);
  }

  function handleWeightChange(dimensionId: string, weight: number) {
    setWorkingTemplate((prev) => ({
      ...prev,
      dimensions: redistributeWeights(prev.dimensions, dimensionId, weight),
    }));
  }

  function handleToggleDimension(dimensionId: string) {
    setWorkingTemplate((prev) => ({
      ...prev,
      dimensions: rebalanceEnabledWeights(
        prev.dimensions.map((d) =>
          d.id === dimensionId
            ? { ...d, enabled: !d.enabled, weight: d.enabled ? 0 : Math.max(d.weight, 10) }
            : d,
        ),
      ),
    }));
  }

  function handleResetTemplate() {
    setWorkingTemplate(cloneTemplate(selectedTemplateId));
    setPilotApplied(false);
  }

  return (
    <div className="pf-layout">
      <ProductFlowNavigator
        steps={productFlowSteps}
        k8sDemoStep={k8sDemoStep}
        activeStepId={activeStepId}
        visitedSteps={visitedSteps}
        onNavigate={handleNavigate}
      />

      <div className="pf-content">
        {activeStepId === 'product-flow' && (
          <InvestigationSection
            kicker="Area 01"
            title="Product Flow"
            whatIs="The complete lifecycle in one view."
            whatDoes="It shows how raw AI output becomes a governed trust decision."
            howWorks="Input is normalized, evaluated, routed to a trust decision, validated by humans and fed back into learning."
            whyMatters="This is the 60-second explanation of the product."
            hideBrief
          >
            <div className="pf-chapter-picker">
              {PF_CHAPTERS.map((ch) => (
                <button
                  key={ch.index}
                  className={`pf-chapter-tab${activeChapter === ch.index ? ' active' : ''}`}
                  onClick={() => setActiveChapter(ch.index)}
                >
                  <span className="pf-chapter-tab-num">{String(ch.index).padStart(2, '0')}</span>
                  <span className="pf-chapter-tab-label">{ch.title}</span>
                </button>
              ))}
            </div>

            {(() => {
              const ch = PF_CHAPTERS.find((chapter) => chapter.index === activeChapter) ?? PF_CHAPTERS[0];
              const chapterIndex = ch.index;
              return (
                <ProductFlowChapter
                  key={chapterIndex}
                  index={ch.index}
                  title={ch.title}
                  summary={ch.summary}
                  hideHeader
                >
                  {chapterIndex === 1 && <PresentationBriefing />}
                  {chapterIndex === 2 && <ProductPositioningScreen />}
                  {chapterIndex === 3 && <GeneralProductScope />}
                  {chapterIndex === 4 && <BeforeAfterTrustStory />}
                </ProductFlowChapter>
              );
            })()}
          </InvestigationSection>
        )}

        {activeStepId === 'configuration-studio' && (
          <InvestigationSection
            kicker="Area 03"
            title="Configuration Studio"
            whatIs="The interactive setup area for trust rules."
            whatDoes="It lets users select templates, tune dimensions, adjust weights and inspect rules."
            howWorks="Every interaction updates the score model, formula and decision logic used by runtime evaluation."
            whyMatters="This is the most important proof that the product is configurable, not hardcoded."
            hideBrief
          >
            <ConfigurationLayerSection>
              <ConfigurationWorkbench
                templates={evaluationTemplates}
                selectedTemplateId={selectedTemplateId}
                template={workingTemplate}
                result={scoreResult}
                pilotApplied={pilotApplied}
                onSelectTemplate={handleSelectTemplate}
                onWeightChange={handleWeightChange}
                onToggleDimension={handleToggleDimension}
                onReset={handleResetTemplate}
              />
            </ConfigurationLayerSection>
          </InvestigationSection>
        )}

        {activeStepId === 'confidence-evaluation' && (
          <InvestigationSection
            kicker="Area 02"
            title="Confidence Evaluation"
            whatIs="The real-time input/output simulator."
            whatDoes="It shows how different AI outputs are evaluated into score, risks and decision."
            howWorks="Select an input type, inspect evidence checks and review the generated trust decision."
            whyMatters="Users understand the system by interacting with realistic examples instead of reading documentation."
          >
            <div className="stacked-product-section">
              <InputOutputSimulator />
              <TrustDecisionCenter />
            </div>
          </InvestigationSection>
        )}

        {activeStepId === 'learning-governance' && (
          <InvestigationSection
            kicker="Area 04"
            title="Learning and Governance"
            whatIs="The layer that makes decisions auditable and improves future evaluations."
            whatDoes="It captures human feedback, stores confidence memory, tracks value and keeps decision records."
            howWorks="Feedback becomes patterns, patterns evolve templates, and audit records explain why decisions were made."
            whyMatters="This is what makes the product credible for enterprise and regulated workflows."
            hideBrief
          >
            <LearningGovernanceOverview />
          </InvestigationSection>
        )}

        {activeStepId === 'use-cases' && (
          <InvestigationSection
            kicker="Area 05"
            title="Proof and Use Cases"
            whatIs="The proof area for domain examples and integration detail."
            whatDoes="It shows where the same confidence engine applies after the core concept is understood."
            howWorks="Templates and evidence requirements change by domain; the trust decision pattern stays consistent."
            whyMatters="This is the supporting detail, not the first explanation of the product."
          >
            <ProofUseCasesOverview />
          </InvestigationSection>
        )}

        {activeStepId === K8S_DEMO_STEP_ID && <KubernetesRcaDemo />}
      </div>
    </div>
  );
}
