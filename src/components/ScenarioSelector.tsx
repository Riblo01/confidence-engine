import { motion } from 'framer-motion';
import { type LucideIcon, Server, Shield } from 'lucide-react';
import type { MissionScenario } from '../types';

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  Infrastructure: Server,
  Security: Shield,
};

const DOMAIN_COLORS: Record<string, string> = {
  Infrastructure: '#3b82f6',
  Security: '#ef4444',
};

interface Props {
  scenarios: MissionScenario[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ScenarioSelector({ scenarios, selectedId, onSelect }: Props) {
  return (
    <div className="mc-scenario-selector">
      <div className="mc-scenario-selector-label">Select Scenario</div>
      <div className="mc-scenario-chips">
        {scenarios.map((s) => {
          const Icon = DOMAIN_ICONS[s.domain] ?? Server;
          const color = DOMAIN_COLORS[s.domain] ?? '#6366f1';
          const active = s.id === selectedId;
          return (
            <motion.button
              key={s.id}
              className={`mc-scenario-chip ${active ? 'mc-scenario-chip--active' : ''}`}
              style={active ? { borderColor: color, background: `${color}18`, color } : {}}
              onClick={() => onSelect(s.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon size={13} />
              <div>
                <div className="mc-scenario-chip-badge">{s.badge}</div>
                <div className="mc-scenario-chip-title">{s.title}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
