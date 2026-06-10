import { motion, AnimatePresence } from 'framer-motion';
import { type LucideIcon, Bot, Server, Shield } from 'lucide-react';
import type { MissionScenario } from '../types';

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  Infrastructure: Server,
  Security: Shield,
};

interface Props {
  scenario: MissionScenario;
  visible: boolean;
}

export default function AiInputCard({ scenario, visible }: Props) {
  const DomainIcon = DOMAIN_ICONS[scenario.domain] ?? Bot;

  return (
    <div className="mc-ai-card-wrap">
      <div className="mc-ai-card-eyebrow">
        <Bot size={13} />
        <span>AI-Generated Output</span>
      </div>

      <AnimatePresence mode="wait">
        {visible ? (
          <motion.div
            key={`card-${scenario.id}`}
            className="mc-ai-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
          >
            <div className="mc-ai-card-header">
              <span className="mc-ai-card-badge">
                <DomainIcon size={12} />
                {scenario.badge}
              </span>
              <span className="mc-ai-card-domain">{scenario.domain}</span>
            </div>
            <h3 className="mc-ai-card-title">{scenario.title}</h3>
            <pre className="mc-ai-card-output">{scenario.aiGeneratedOutput}</pre>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            className="mc-ai-card mc-ai-card--empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Bot size={32} className="mc-ai-card-empty-icon" />
            <p>Click <strong>Start Evaluation</strong> to load the AI output</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
