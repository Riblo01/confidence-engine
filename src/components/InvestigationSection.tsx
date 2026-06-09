import type { ReactNode } from 'react';

interface Props {
  kicker: string;
  title: string;
  whatIs: string;
  whatDoes: string;
  howWorks: string;
  children: ReactNode;
}

export default function InvestigationSection({
  kicker,
  title,
  whatIs,
  whatDoes,
  howWorks,
  children,
}: Props) {
  return (
    <section className="investigation-section">
      <div className="section-shell">
        <div className="section-intro">
          <div className="eyebrow">{kicker}</div>
          <h2 className="display-title section-title">{title}</h2>
        </div>

        <div className="reference-grid">
          <article className="reference-item">
            <span>What is it?</span>
            <p>{whatIs}</p>
          </article>
          <article className="reference-item">
            <span>What does it do?</span>
            <p>{whatDoes}</p>
          </article>
          <article className="reference-item">
            <span>How does it work?</span>
            <p>{howWorks}</p>
          </article>
        </div>

        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
