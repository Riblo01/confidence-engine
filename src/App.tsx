import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, FileText, PlayCircle } from 'lucide-react';
import type { FeedbackType, Incident } from './types';
import type { SyntheticLogEntry } from './types/logs';
import { incidents } from './data/incidents';
import { calculateConfidence } from './scoring/engine';
import { getActiveLogs } from './data/logParser';

import AppHeader from './components/AppHeader';
import IncidentSelector from './components/IncidentSelector';
import IncidentSummaryCard from './components/IncidentSummaryCard';
import AgentRcaCard from './components/AgentRcaCard';
import ConfidenceScoreCard from './components/ConfidenceScoreCard';
import PatternMatchCard from './components/PatternMatchCard';
import EvidenceValidationTable from './components/EvidenceValidationTable';
import TimelineCard from './components/TimelineCard';
import VerdictCard from './components/VerdictCard';
import FeedbackButtons from './components/FeedbackButtons';
import LearningLoopCard from './components/LearningLoopCard';
import LogEvidencePanel from './components/LogEvidencePanel';
import DatasetProvenanceCard from './components/DatasetProvenanceCard';
import InvestigationSection from './components/InvestigationSection';
import ProblemStatementSection from './components/ProblemStatementSection';
import ConfidenceEnginePipeline from './components/ConfidenceEnginePipeline';
import PlatformVisionSection from './components/PlatformVisionSection';
import MetricsDashboard from './components/MetricsDashboard';
import PromptContractCard from './components/PromptContractCard';

const demoSteps = [
  { id: 'problem', label: 'Problem', title: 'Why AI Confidence Matters' },
  { id: 'intake', label: 'Intake', title: 'Select the incident' },
  { id: 'analysis', label: 'AI RCA', title: 'Review the RCA input' },
  { id: 'evidence', label: 'Evidence', title: 'Load and inspect evidence' },
  { id: 'metrics', label: 'Metrics', title: 'Review operational metrics' },
  { id: 'engine', label: 'Validation', title: 'Run confidence validation' },
  { id: 'report', label: 'Report', title: 'Review the confidence report' },
  { id: 'decision', label: 'Decision', title: 'Make the operational decision' },
  { id: 'learning', label: 'Learning', title: 'Show platform learning and scale' },
] as const;

type DemoStepId = typeof demoSteps[number]['id'];

function buildRcaInputSummary(incident: Incident): string {
  return [
    `Incident Summary`,
    `Problem ID: ${incident.problem_id}`,
    `Severity: ${incident.severity}`,
    `Time window: ${incident.time_window}`,
    `Affected services: ${incident.affected_service}`,
    ``,
    `Root Cause Analysis`,
    incident.agent_rca.proposed_root_cause,
    ``,
    `Findings`,
    ...incident.agent_rca.evidence_listed.map((item) => `- ${item}`),
    ``,
    `Recommended Actions`,
    ...incident.agent_rca.recommended_actions.map((item) => `- ${item}`),
    ``,
    `Confidence Level: ${incident.agent_rca.agent_declared_confidence}%`,
  ].join('\n');
}

export default function App() {
  const [selectedId, setSelectedId] = useState(incidents[0].problem_id);
  const [activeStep, setActiveStep] = useState<DemoStepId>('problem');
  const [feedbackMap, setFeedbackMap] = useState<Record<string, FeedbackType>>({});
  const [csvLogs, setCsvLogs] = useState<SyntheticLogEntry[] | null>(null);

  const incident = incidents.find((i) => i.problem_id === selectedId) ?? incidents[0];
  const activeStepIndex = demoSteps.findIndex((step) => step.id === activeStep);
  const rcaInputSummary = buildRcaInputSummary(incident);
  const result = calculateConfidence(
    incident.scoring_inputs,
    incident.scoring_inputs.pattern_matched,
    incident.title,
  );

  const feedback = feedbackMap[selectedId] ?? null;
  const { logs: activeLogs, source: logDataSource } = getActiveLogs(csvLogs);

  function handleFeedback(f: FeedbackType) {
    setFeedbackMap((prev) => ({ ...prev, [selectedId]: f }));
  }

  const handleCsvUpload = useCallback((parsed: SyntheticLogEntry[]) => {
    setCsvLogs(parsed);
  }, []);

  function goToNextStep() {
    const next = demoSteps[Math.min(activeStepIndex + 1, demoSteps.length - 1)];
    setActiveStep(next.id);
  }

  function goToPreviousStep() {
    const previous = demoSteps[Math.max(activeStepIndex - 1, 0)];
    setActiveStep(previous.id);
  }

  function handleIncidentSelect(id: string) {
    setSelectedId(id);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <AppHeader />

      <main className="mx-auto max-w-screen-2xl px-4 py-6 demo-main">
        <div className="demo-stage-header">
          <div>
            <div className="eyebrow">Interactive hackathon walkthrough</div>
            <h1 className="display-title demo-stage-title">{demoSteps[activeStepIndex].title}</h1>
          </div>
        </div>

        <nav className="wizard-nav" aria-label="Demo steps">
          {demoSteps.map((step, index) => (
            <button
              key={step.id}
              className={`wizard-step ${step.id === activeStep ? 'active' : ''} ${index < activeStepIndex ? 'complete' : ''}`}
              onClick={() => setActiveStep(step.id)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{step.label}</strong>
            </button>
          ))}
        </nav>

        <div className="wizard-screen">
          {activeStep === 'problem' && (
            <InvestigationSection
              kicker="Screen 01"
              title="Why AI Confidence Matters"
              whatIs="A business problem statement for teams using AI-generated incident analysis."
              whatDoes="It frames the central question: why should we trust or distrust the RCA generated by an AI agent?"
              howWorks="The experience starts with the decision flow: incident, AI investigation, confidence validation, human decision."
            >
              <ProblemStatementSection />
            </InvestigationSection>
          )}

          {activeStep === 'intake' && (
            <InvestigationSection
              kicker="Screen 02"
              title="Incident Intake"
              whatIs="The operational incident that triggered the investigation."
              whatDoes="It lets the reviewer select one Kubernetes scenario and understand impact before seeing any RCA."
              howWorks="Each incident card exposes ID, service, severity, namespace, cluster and business impact. The selected card updates the investigation context while staying on this screen."
            >
              <div className="space-y-6">
                <IncidentSelector
                  incidents={incidents}
                  selectedId={selectedId}
                  onSelect={handleIncidentSelect}
                />
                <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                  <IncidentSummaryCard incident={incident} />
                  <TimelineCard incident={incident} />
                </div>
              </div>
            </InvestigationSection>
          )}

          {activeStep === 'analysis' && (
            <InvestigationSection
              kicker="Screen 03"
              title="AI Investigation Result"
              whatIs="The RCA or operational analysis received from the initial AI analyst."
              whatDoes="It shows the SRE prompt contract and the structured RCA that will be validated."
              howWorks="The prompt defines sources, priorities and output structure. In this prototype, the selected scenario provides a normalized RCA object that the Confidence Engine validates against evidence."
            >
              <PromptContractCard />
              <div className="analysis-workbench">
                <div className="analysis-editor">
                  <div className="input-banner">RCA Under Validation</div>
                  <pre className="rca-input-preview">{rcaInputSummary}</pre>
                  <div className="analysis-editor-footer">
                    <span>{rcaInputSummary.length.toLocaleString()} characters</span>
                    <span className="prototype-badge">Structured demo input</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="analysis-note">
                    <PlayCircle size={18} />
                    <span>This screen represents the RCA produced from the SRE prompt. Free-text RCA parsing is not implemented in this prototype.</span>
                  </div>
                  <div className="analysis-note neutral">
                    <FileText size={18} />
                    <span>The Confidence Engine validates the normalized RCA below against evidence, metrics, patterns, contradiction risk, and operational completeness.</span>
                  </div>
                  <AgentRcaCard incident={incident} />
                </div>
              </div>
            </InvestigationSection>
          )}

          {activeStep === 'evidence' && (
            <InvestigationSection
              kicker="Screen 04"
              title="Evidence Layer"
              whatIs="The operational evidence source used to validate the AI RCA."
              whatDoes="It explains the synthetic Kubernetes and Istio telemetry dataset, the accepted CSV shape and the extracted signals."
              howWorks="CSV data is parsed into telemetry entries, matched against the selected incident, and shown as evidence candidates."
            >
              <div className="space-y-6">
                <DatasetProvenanceCard dataSource={logDataSource} totalLogs={activeLogs.length} />
                <LogEvidencePanel
                  problemId={incident.problem_id}
                  csvLogs={csvLogs}
                  dataSource={logDataSource}
                  allLogs={activeLogs}
                  onCsvUpload={handleCsvUpload}
                />
              </div>
            </InvestigationSection>
          )}

          {activeStep === 'engine' && (
            <InvestigationSection
              kicker="Screen 06"
              title="Confidence Engine Validation"
              whatIs="The internal validation pipeline."
              whatDoes="It evaluates evidence support, pattern fit, consistency, completeness and contradiction risk."
              howWorks="Evidence validation and pattern matching are calculated first, then the weighted confidence score is produced."
            >
              <div className="space-y-6">
                <ConfidenceEnginePipeline incident={incident} result={result} />
                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <EvidenceValidationTable incident={incident} />
                  <PatternMatchCard incident={incident} />
                </div>
              </div>
            </InvestigationSection>
          )}

          {activeStep === 'metrics' && (
            <InvestigationSection
              kicker="Screen 05"
              title="Operational Metrics"
              whatIs="A visual layer for the metrics correlated to the selected incident."
              whatDoes="It shows traffic, errors, latency, resource pressure and Kubernetes health before confidence scoring."
              howWorks="The prototype renders deterministic metric timelines derived from the selected incident pattern and telemetry signals."
            >
              <MetricsDashboard incident={incident} />
            </InvestigationSection>
          )}

          {activeStep === 'report' && (
            <InvestigationSection
              kicker="Screen 07"
              title="Confidence Report"
              whatIs="The numeric evaluation report."
              whatDoes="It summarizes evidence quality, RCA consistency, historical similarity, completeness, contradiction risk and overall confidence."
              howWorks="The report applies the weighted scoring formula and surfaces the confidence level as a large review artifact."
            >
              <ConfidenceScoreCard result={result} />
            </InvestigationSection>
          )}

          {activeStep === 'decision' && (
            <InvestigationSection
              kicker="Screen 08"
              title="Decision Recommendation"
              whatIs="The executive conclusion for the selected incident."
              whatDoes="It tells the reviewer whether the AI RCA can be trusted and what operational action should happen next."
              howWorks="The final verdict combines the weighted score with contradiction risk, missing evidence flags and human validation."
            >
              <div className="space-y-6">
                <VerdictCard result={result} />
                <FeedbackButtons
                  feedback={feedback}
                  onFeedback={handleFeedback}
                  incidentId={incident.problem_id}
                />
              </div>
            </InvestigationSection>
          )}

          {activeStep === 'learning' && (
            <InvestigationSection
              kicker="Screen 09"
              title="Continuous Learning and Platform Vision"
              whatIs="The improvement loop and scalability story behind the validation platform."
              whatDoes="It demonstrates how reviewer feedback improves harness templates, pattern weights and future evaluations."
              howWorks="Domain-specific harness templates can validate AI-generated decisions across Kubernetes, security, support, code review and compliance."
            >
              <div className="space-y-6">
                <LearningLoopCard />
                <PlatformVisionSection />
              </div>
            </InvestigationSection>
          )}
        </div>

        <div className="demo-bottom-actions">
          <button
            className="wizard-action secondary"
            onClick={goToPreviousStep}
            disabled={activeStepIndex === 0}
          >
            <ArrowLeft size={16} />
            Previous
          </button>
          <span>{activeStepIndex + 1} / {demoSteps.length}</span>
          <button
            className="wizard-action"
            onClick={goToNextStep}
            disabled={activeStepIndex === demoSteps.length - 1}
          >
            Next
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
}
