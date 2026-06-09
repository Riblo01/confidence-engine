import { FileCode2, Shield, Headphones, Code2, Building2, Scale } from 'lucide-react';

const useCases = [
  { label: 'Security Operations', Icon: Shield },
  { label: 'Customer Support', Icon: Headphones },
  { label: 'Code Review', Icon: Code2 },
  { label: 'Platform Engineering', Icon: Building2 },
  { label: 'Compliance Validation', Icon: Scale },
];

const templates = [
  'incident-investigation.yaml',
  'security-investigation.yaml',
  'support-review.yaml',
];

export default function PlatformVisionSection() {
  return (
    <div className="narrative-panel">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="vision-current">Current use case</div>
          <h3 className="display-title mt-2 text-3xl text-white">Kubernetes Incident Investigation</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Kubernetes is the first implementation. The same validation architecture can be reused across
            any AI-generated decision workflow by changing the harness template and evidence connectors.
          </p>
          <div className="mt-5 space-y-2">
            {templates.map((template) => (
              <div key={template} className="template-row">
                <FileCode2 size={16} />
                <span>{template}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="use-case-grid">
          {useCases.map(({ label, Icon }) => (
            <article key={label} className="use-case-card">
              <Icon size={20} />
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
