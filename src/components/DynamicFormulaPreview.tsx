import { Sigma } from 'lucide-react';
import type { EvaluationTemplate } from '../types';

interface Props {
  template: EvaluationTemplate;
}

export default function DynamicFormulaPreview({ template }: Props) {
  const enabled = template.dimensions.filter((d) => d.enabled);

  return (
    <div className="formula-preview">
      <div className="flex items-center gap-2 mb-2 text-gray-500 text-xs font-sans font-bold uppercase tracking-widest">
        <Sigma size={13} />
        Scoring formula
      </div>
      <div>
        <span className="f-op">overall_score = </span>
        {enabled.map((d, i) => (
          <span key={d.id}>
            {i > 0 && <span className="f-op"> + </span>}
            <span className="f-op">(</span>
            <span className="f-weight">{(d.weight / 100).toFixed(2)}</span>
            <span className="f-op"> × </span>
            <span className="f-dim">{d.name}</span>
            <span className="f-op">)</span>
          </span>
        ))}
      </div>
    </div>
  );
}
