import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';

export default function BeforeAfterTrustStory() {
  return (
    <div className="ba-story">
      <article className="ba-card without">
        <div className="ba-card-head">
          <AlertTriangle size={20} />
          <span>Without Confidence Engine</span>
        </div>
        <div className="ba-outcome danger">
          <strong>Blind action</strong>
          <p>No evidence gate before execution</p>
        </div>
        <div className="ba-path">
          <span>AI Output</span>
          <ArrowRight size={16} />
          <span>Human acts immediately</span>
          <ArrowRight size={16} />
          <strong>Risk</strong>
        </div>
        <div className="ba-signal-row">
          <span><XCircle size={14} /> No contradiction check</span>
          <span><XCircle size={14} /> No route control</span>
        </div>
      </article>

      <article className="ba-card with">
        <div className="ba-card-head">
          <ShieldCheck size={20} />
          <span>With Confidence Engine</span>
        </div>
        <div className="ba-outcome safe">
          <strong>Controlled decision</strong>
          <p>Evidence is evaluated before action</p>
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
        <div className="ba-signal-row">
          <span><CheckCircle2 size={14} /> Evidence checked</span>
          <span><CheckCircle2 size={14} /> Unsafe outputs blocked</span>
        </div>
      </article>
    </div>
  );
}
