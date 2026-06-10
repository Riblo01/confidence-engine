import { AlertOctagon, CheckCircle2, FileOutput, ListChecks } from 'lucide-react';
import type { EvaluationTemplate } from '../types';

interface Props {
  templates: EvaluationTemplate[];
  selectedTemplateId: string;
  onSelectTemplate: (id: string) => void;
}

export default function EvaluationTemplateSelector({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: Props) {
  const selected = templates.find((t) => t.id === selectedTemplateId) ?? templates[0];
  const coreDims = selected.dimensions.filter((d) => d.type === 'core');
  const domainDims = selected.dimensions.filter((d) => d.type === 'domain_specific');

  return (
    <div>
      <div className="template-select-grid">
        {templates.map((t) => (
          <button
            key={t.id}
            className={`template-select-card ${t.id === selectedTemplateId ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(t.id)}
          >
            <div className="t-name">{t.name}</div>
            <div className="t-domain">{t.domain}</div>
          </button>
        ))}
      </div>

      <div className="template-detail">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-white">{selected.name}</h3>
            <p className="mt-1 text-sm text-gray-400 max-w-2xl">{selected.description}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/40 px-3 py-2 text-xs text-gray-300">
            <FileOutput size={14} className="text-blue-400" />
            {selected.output_type}
          </div>
        </div>

        <div className="template-detail-grid">
          <div className="template-detail-block">
            <h4>Core dimensions</h4>
            <ul>
              {coreDims.map((d) => (
                <li key={d.id}>
                  {d.name} — {d.enabled ? `${d.weight}%` : 'disabled'}
                </li>
              ))}
            </ul>
          </div>

          <div className="template-detail-block">
            <h4>Domain-specific dimensions</h4>
            {domainDims.length === 0 ? (
              <p className="text-xs text-gray-500 italic">None — core dimensions only.</p>
            ) : (
              <ul>
                {domainDims.map((d) => (
                  <li key={d.id}>
                    {d.name} — {d.enabled ? `${d.weight}%` : 'optional, disabled'}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="template-detail-block">
            <h4>Required evidence</h4>
            <ul>
              {selected.required_evidence.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>

          <div className="template-detail-block">
            <h4>Thresholds & downgrade rules</h4>
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
              <CheckCircle2 size={13} className="text-green-400" />
              Trusted ≥ {selected.thresholds.trusted} · Review ≥ {selected.thresholds.review} · Low &lt; {selected.thresholds.review}
            </div>
            {selected.downgrade_rules.map((r) => (
              <div key={r.id} className="flex items-start gap-2 text-xs text-amber-300/90 mb-1.5">
                <AlertOctagon size={13} className="mt-0.5 flex-shrink-0" />
                {r.effect}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-lg border border-purple-500/25 bg-purple-500/5 px-4 py-3 text-sm text-purple-300">
          <ListChecks size={16} className="mt-0.5 flex-shrink-0" />
          <span>
            Changing the template changes how confidence is measured — same engine, different evaluation
            criteria per use case.
          </span>
        </div>
      </div>
    </div>
  );
}
