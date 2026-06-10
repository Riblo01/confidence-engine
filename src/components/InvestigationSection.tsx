import type { ReactNode } from 'react';

interface Props {
  kicker: string;
  title: string;
  whatIs: string;
  whatDoes: string;
  howWorks: string;
  whyMatters?: string;
  children: ReactNode;
}

export default function InvestigationSection({
  kicker,
  title,
  whatIs,
  whatDoes,
  howWorks,
  whyMatters,
  children,
}: Props) {
  return (
    <section className="investigation-section">
      <div className="section-shell">
        <div className="section-intro">
          <div className="eyebrow">{kicker}</div>
          <h2 className="display-title section-title">{title}</h2>
        </div>

        <div className="stage-brief">
          <article>
            <span>Input</span>
            <p>{whatIs}</p>
          </article>
          <article>
            <span>Engine action</span>
            <p>{whatDoes}</p>
          </article>
          <article>
            <span>Output</span>
            <p>{whyMatters ?? howWorks}</p>
          </article>
        </div>

        <div className="section-body">{children}</div>
      </div>
    </section>
  );
}
