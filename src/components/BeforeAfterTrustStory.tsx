import { AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function BeforeAfterTrustStory() {
  return (
    <div className="ba-story">
      <article className="ba-card without">
        <div className="ba-card-head">
          <AlertTriangle size={20} />
          Without Confidence Engine
        </div>
        <div className="ba-path">
          <span>AI Output</span>
          <ArrowRight size={16} />
          <span>Human acts immediately</span>
          <ArrowRight size={16} />
          <strong>Risk</strong>
        </div>
      </article>

      <article className="ba-card with">
        <div className="ba-card-head">
          <ShieldCheck size={20} />
          With Confidence Engine
        </div>
        <div className="ba-path">
          <span>AI Output</span>
          <ArrowRight size={16} />
          <span>Validation</span>
          <ArrowRight size={16} />
          <span>Trust Decision</span>
          <ArrowRight size={16} />
          <strong>Safe Action</strong>
        </div>
      </article>
    </div>
  );
}
