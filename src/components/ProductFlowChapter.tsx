import type { ReactNode } from 'react';

interface Props {
  index: number;
  title: string;
  summary: string;
  children: ReactNode;
  hideHeader?: boolean;
}

export default function ProductFlowChapter({ index, title, summary, children, hideHeader = false }: Props) {
  return (
    <section className="pf-chapter">
      {!hideHeader && (
        <header className="pf-chapter-head">
          <span className="pf-chapter-num">{String(index).padStart(2, '0')}</span>
          <div>
            <h3 className="pf-chapter-title">{title}</h3>
            <p className="pf-chapter-summary">{summary}</p>
          </div>
        </header>
      )}
      {children}
    </section>
  );
}
