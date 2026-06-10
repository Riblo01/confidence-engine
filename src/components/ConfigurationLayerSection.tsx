import type { ReactNode } from 'react';
import { FileCog, ListChecks, Scale, SlidersHorizontal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const configItems = [
  { label: 'Templates', detail: 'Define the use case and output type.', Icon: FileCog },
  { label: 'Dimensions and weights', detail: 'Control what the score values most.', Icon: SlidersHorizontal },
  { label: 'Thresholds and rules', detail: 'Decide when review or blocking is required.', Icon: Scale },
  { label: 'Evidence requirements', detail: 'List the sources needed before trust is granted.', Icon: ListChecks },
];

export default function ConfigurationLayerSection({ children }: Props) {
  return (
    <div className="layer-shell">
      <div className="layer-summary">
        {configItems.map(({ label, detail, Icon }) => (
          <article key={label} className="layer-summary-card">
            <Icon size={18} />
            <strong>{label}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </div>
      <div className="layer-workbench">{children}</div>
    </div>
  );
}
