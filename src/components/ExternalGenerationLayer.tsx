import { ArrowDown, ArrowRight, Bot, FileOutput, FileText, ShieldCheck } from 'lucide-react';

const generationExamples = [
  'Initial SRE agent generates a Kubernetes RCA',
  'Coding agent generates code from a spec',
  'SOC copilot generates a threat analysis',
  'Support copilot drafts a customer response',
  'Multi-agent workflow produces a final decision',
];

const generationFlow = [
  { label: 'Source Context', Icon: FileText },
  { label: 'Agent / LLM / Multi-agent / Automation', Icon: Bot },
  { label: 'Generated Output', Icon: FileOutput },
];

export default function ExternalGenerationLayer() {
  return (
    <div>
      <div className="boundary-grid">
        {/* External zone */}
        <div className="boundary-zone boundary-zone--external">
          <span className="boundary-zone-tag">External Generation Layer</span>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Any system that produces a generated output. <strong className="text-slate-300">This is not
            the Confidence Engine — this is the system being evaluated.</strong>
          </p>

          <div className="mt-5 flex flex-col gap-2">
            {generationFlow.map(({ label, Icon }, i) => (
              <div key={label} className="flex flex-col items-start gap-2">
                <article className="flow-node w-full">
                  <div
                    className="flow-icon"
                    style={{ color: '#9da7b3', background: 'rgba(148,163,184,0.08)', borderColor: 'rgba(148,163,184,0.25)' }}
                  >
                    <Icon size={18} />
                  </div>
                  <span>{label}</span>
                </article>
                {i < generationFlow.length - 1 && <ArrowDown size={16} className="text-slate-600 ml-5" />}
              </div>
            ))}
          </div>

          <ul className="mt-5 space-y-1.5">
            {generationExamples.map((e) => (
              <li key={e} className="flex items-start gap-2 text-xs text-slate-500">
                <span className="text-slate-600 mt-0.5">·</span>
                {e}
              </li>
            ))}
          </ul>
        </div>

        {/* Engine zone */}
        <div className="boundary-zone boundary-zone--engine">
          <span className="boundary-zone-tag">Confidence Engine Product</span>
          <p className="mt-4 text-sm leading-6 text-slate-300">
            The product starts <strong>only after the generated output exists</strong>. It receives the
            output plus its context and evidence, evaluates trustworthiness, and returns a score, verdict
            and decision recommendation.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <div
              className="flow-icon"
              style={{ color: '#2dd4bf', background: 'rgba(20,184,166,0.12)', borderColor: 'rgba(20,184,166,0.35)', width: 56, height: 56 }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">Evaluation, not generation</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Evidence validation · contradiction detection · completeness · actionability
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-2 text-xs text-teal-300/90">
            <div className="flex items-center gap-2">
              <ArrowRight size={13} />
              Receives: generated output + source context + evidence sources
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight size={13} />
              Produces: confidence score + verdict + review requirement
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight size={13} />
              Never replaces the generating system or the human decision
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
