import { useMemo, useState } from 'react';
import type { EvaluationTemplate } from '../types';
import { productFlowSteps, k8sDemoStep, K8S_DEMO_STEP_ID } from '../data/productFlow';
import { evaluationTemplates, getTemplateById } from '../data/evaluationTemplates';
import { adaptivePilot } from '../data/adaptivePilot';
import { calculateTemplateScore } from '../scoring/templateEngine';

import ProductFlowNavigator from './ProductFlowNavigator';
import InvestigationSection from './InvestigationSection';
import ProductFlowChapter from './ProductFlowChapter';
import BeforeAfterTrustStory from './BeforeAfterTrustStory';
import ProductPositioningScreen from './ProductPositioningScreen';
import UniversalValidationExample from './UniversalValidationExample';
import GeneralProductScope from './GeneralProductScope';
import InputContractSection from './InputContractSection';
import ConfigurationLayerSection from './ConfigurationLayerSection';
import ConfigurationWorkbench from './ConfigurationWorkbench';
import RuntimeEvaluationLayer from './RuntimeEvaluationLayer';
import TrustDecisionCenter from './TrustDecisionCenter';
import InputOutputSimulator from './InputOutputSimulator';
import BusinessImpactDashboard from './BusinessImpactDashboard';
import HumanFeedbackLearningPanel from './HumanFeedbackLearningPanel';
import LearningNarrativeFlow from './LearningNarrativeFlow';
import AdaptivePilotFlow from './AdaptivePilotFlow';
import SharedMemoryPanel from './SharedMemoryPanel';
import GovernanceAuditTrail from './GovernanceAuditTrail';
import MultiAgentConsensusValidation from './MultiAgentConsensusValidation';
import FutureArchitectureRoadmap from './FutureArchitectureRoadmap';
import KubernetesRcaDemo from './KubernetesRcaDemo';
import UseCaseExpansionPanel from './UseCaseExpansionPanel';

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

export default function ProductExperience() {
  const [activeStepId, setActiveStepId] = useState('product-flow');
  const [visitedSteps, setVisitedSteps] = useState<Set<string>>(() => new Set(['product-flow']));
  const [selectedTemplateId, setSelectedTemplateId] = useState('kubernetes_rca');
  const [workingTemplate, setWorkingTemplate] = useState<EvaluationTemplate>(() =>
    cloneTemplate('kubernetes_rca'),
  );
  const [pilotApplied, setPilotApplied] = useState(false);

  const scoreResult = useMemo(() => calculateTemplateScore(workingTemplate), [workingTemplate]);
  const canApplyPilot = selectedTemplateId === adaptivePilot.baseline_template_id;

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

  function handleApplyPilotSuggestion() {
    if (!canApplyPilot) return;

    setWorkingTemplate((prev) => ({
      ...prev,
      dimensions: rebalanceEnabledWeights(
        prev.dimensions.map((d) => {
          const adjustment = adaptivePilot.adjustments.find((a) => a.dimension_id === d.id);
          return adjustment ? { ...d, weight: adjustment.after } : d;
        }),
      ),
    }));
    setPilotApplied(true);
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
          >
            <div className="stacked-product-section">
              <ProductFlowChapter
                index={1}
                title="The problem and the answer"
                summary="AI output is moving faster than trust controls — Confidence Engine is the layer in between."
              >
                <ProductPositioningScreen />
              </ProductFlowChapter>

              <ProductFlowChapter
                index={2}
                title="What the product is"
                summary="A validation engine for any AI-generated output. It never generates — it evaluates."
              >
                <GeneralProductScope />
              </ProductFlowChapter>

              <ProductFlowChapter
                index={3}
                title="What changes with it"
                summary="The same AI output: acted on blindly, or validated into a safe action."
              >
                <BeforeAfterTrustStory />
              </ProductFlowChapter>

              <ProductFlowChapter
                index={4}
                title="One output, end to end"
                summary="A generated answer validated against evidence, scored, and routed to a trust decision."
              >
                <UniversalValidationExample />
              </ProductFlowChapter>

              <ProductFlowChapter
                index={5}
                title="How it plugs in"
                summary="Your agents do not change — they send one standard JSON contract."
              >
                <InputContractSection />
              </ProductFlowChapter>
            </div>
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
              <RuntimeEvaluationLayer template={workingTemplate} result={scoreResult} />
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
          >
            <div className="stacked-product-section">
              <LearningNarrativeFlow />
              <HumanFeedbackLearningPanel />
              <AdaptivePilotFlow
                pilot={adaptivePilot}
                workingTemplate={workingTemplate}
                pilotApplied={pilotApplied}
                canApplyPilot={canApplyPilot}
                onApplySuggestion={handleApplyPilotSuggestion}
              />
              <BusinessImpactDashboard />
              <SharedMemoryPanel />
              <GovernanceAuditTrail />
            </div>
          </InvestigationSection>
        )}

        {activeStepId === 'use-cases' && (
          <InvestigationSection
            kicker="Area 05"
            title="Use Cases"
            whatIs="The domains where the same confidence engine can be applied."
            whatDoes="It shows Kubernetes RCA plus support, compliance, security, code and multi-agent validation."
            howWorks="The core stays the same; templates and evidence requirements change by domain."
            whyMatters="This proves the product is a platform, not a single-purpose Kubernetes demo."
          >
            <div className="stacked-product-section">
              <UseCaseExpansionPanel />
              <MultiAgentConsensusValidation />
              <FutureArchitectureRoadmap />
            </div>
          </InvestigationSection>
        )}

        {activeStepId === K8S_DEMO_STEP_ID && <KubernetesRcaDemo />}
      </div>
    </div>
  );
}
