import { AlertTriangle, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import type { EvaluationTemplate, TemplateScoreResult } from '../types';
import { effectiveScore, isRiskDimension } from '../scoring/templateEngine';
import DynamicFormulaPreview from './DynamicFormulaPreview';
import DynamicScorePreview from './DynamicScorePreview';

interface Props {
  template: EvaluationTemplate;
  result: TemplateScoreResult;
  onWeightChange: (dimensionId: string, weight: number) => void;
  onToggleDimension: (dimensionId: string) => void;
  onReset: () => void;
  pilotApplied: boolean;
}

export default function ConfidenceTemplateBuilder({
  template,
  result,
  onWeightChange,
  onToggleDimension,
  onReset,
  pilotApplied,
}: Props) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-200">Active template:</span>
          <span className="rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-300">
            {template.name}
          </span>
          {pilotApplied && (
            <span className="flex items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
              <Sparkles size={12} />
              Pilot suggestion applied
            </span>
          )}
        </div>
        <button className="reset-btn flex items-center gap-1.5" onClick={onReset}>
          <RotateCcw size={13} />
          Reset to default
        </button>
      </div>
      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-400">
        Each slider controls how much importance this template gives to one validation dimension. The
        total is a fixed 100-point budget, so increasing one dimension automatically reduces the others.
      </p>

      <div className="builder-layout">
        {/* Left: dimension rows */}
        <div className="flex flex-col gap-2.5">
          {template.dimensions.map((dim) => (
            <div key={dim.id} className={`builder-dim-row ${dim.enabled ? '' : 'disabled'}`}>
              <button
                className={`toggle ${dim.enabled ? 'on' : ''}`}
                onClick={() => onToggleDimension(dim.id)}
                aria-label={`Toggle ${dim.name}`}
              >
                <span className="toggle-knob" />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="builder-dim-name">{dim.name}</span>
                  <span className={`dim-type-badge ${dim.type === 'core' ? 'core' : 'domain'}`}>
                    {dim.type === 'core' ? 'Core' : 'Domain'}
                  </span>
                </div>
                <div className="builder-dim-sub">
                  Example {isRiskDimension(dim) ? 'risk' : 'score'}: {dim.example_score}%
                  {isRiskDimension(dim) && ` → contributes ${effectiveScore(dim)}%`}
                </div>
              </div>

              <input
                type="range"
                className="slider"
                min={0}
                max={60}
                step={5}
                value={dim.weight}
                disabled={!dim.enabled}
                onChange={(e) => onWeightChange(dim.id, Number(e.target.value))}
              />

              <span className="builder-weight">{dim.weight}%</span>
            </div>
          ))}

          {result.weightSumValid ? (
            <div className="weight-ok">
              <CheckCircle2 size={15} />
              Priority budget balanced at 100%. Move any slider to rebalance the template.
            </div>
          ) : (
            <div className="weight-warning">
              <AlertTriangle size={15} />
              Priority budget is {result.weightSum}%. Rebalance the sliders until the template reaches 100%.
            </div>
          )}
        </div>

        {/* Right: live previews */}
        <div className="flex flex-col gap-4">
          <DynamicScorePreview result={result} />
          <DynamicFormulaPreview template={template} />
        </div>
      </div>
    </div>
  );
}
