import { Activity, FileOutput, ShieldCheck } from 'lucide-react';
import type { EvaluationTemplate, TemplateScoreResult } from '../types';
import DynamicFormulaPreview from './DynamicFormulaPreview';
import DynamicScorePreview from './DynamicScorePreview';

interface Props {
  template: EvaluationTemplate;
  result: TemplateScoreResult;
}

export default function RuntimeEvaluationLayer({ template, result }: Props) {
  return (
    <div className="runtime-shell">
      <section className="runtime-input">
        <div className="runtime-kicker">
          <FileOutput size={15} />
          Runtime artifact
        </div>
        <h3>Actual AI output enters the engine with context and evidence.</h3>
        <p>
          Configuration defines the rules. Runtime evaluation applies those rules to one generated output,
          the available evidence, and the organization's risk policy.
        </p>
        <div className="runtime-payload">
          <code>use_case_id</code>
          <span>{template.id}</span>
          <code>generated_output</code>
          <span>Customer response, RCA, code diff, threat summary or agent decision</span>
          <code>evidence_sources</code>
          <span>{template.required_evidence.join(', ')}</span>
        </div>
      </section>

      <section className="runtime-evaluation">
        <div className="runtime-kicker">
          <Activity size={15} />
          Live evaluation
        </div>
        <div className="runtime-grid">
          <DynamicScorePreview result={result} />
          <div className="runtime-side">
            <DynamicFormulaPreview template={template} />
            <div className="runtime-decision-callout">
              <ShieldCheck size={16} />
              Runtime ends with a trust decision, not just a score. The score informs whether the output is trusted,
              routed for review, rejected, or blocked.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
