import { Layers, Plus } from 'lucide-react';
import { coreDimensions } from '../data/confidenceCore';

export default function ConfidenceCoreSection() {
  return (
    <div>
      <div className="dim-grid">
        {coreDimensions.map((dim) => (
          <article key={dim.id} className="dim-card">
            <div className="dim-card-head">
              <span className="dim-card-name">{dim.name}</span>
              <span className="dim-type-badge core">Core</span>
            </div>
            <p className="dim-card-question">"{dim.question_answered}"</p>
            <p className="dim-card-body">{dim.description}</p>
            <p className="dim-card-method">
              <strong className="text-gray-400">Measurement: </strong>
              {dim.measurement_method}
            </p>
          </article>
        ))}

        <article className="dim-card" style={{ borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
          <div
            className="flex items-center justify-center rounded-lg"
            style={{ width: 42, height: 42, background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c4b5fd' }}
          >
            <Plus size={20} />
          </div>
          <span className="dim-card-name">Domain-specific Dimensions</span>
          <p className="dim-card-body">
            Templates extend the core with dimensions specific to each use case — pattern match, test
            coverage, IOC confidence, policy compliance, agent agreement and more.
          </p>
          <span className="dim-type-badge domain">Added by templates</span>
        </article>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-teal-500/25 bg-teal-500/5 px-4 py-3 text-sm text-teal-300">
        <Layers size={16} className="mt-0.5 flex-shrink-0" />
        <span>
          The five core dimensions are reused across every use case. Domain-specific dimensions are
          layered on top by the evaluation template — the core never changes.
        </span>
      </div>
    </div>
  );
}
