import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, AlertCircle, CheckCircle2 } from 'lucide-react';

const OPTION_ICONS = [ThumbsUp, CheckCircle2, ThumbsDown, AlertCircle];

interface Props {
  options: string[];
  onSubmit: (feedback: string) => void;
  submitted: boolean;
  selected: string | null;
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.25 } } };

export default function HumanFeedbackAction({ options, onSubmit, submitted, selected }: Props) {
  return (
    <motion.div className="mc-feedback-panel" initial="hidden" animate="show" variants={container}>
      <div className="mc-panel-header">Human Feedback</div>
      <p className="mc-feedback-prompt">How accurate was this AI-generated output?</p>

      <div className="mc-feedback-options">
        {options.map((opt, i) => {
          const Icon = OPTION_ICONS[i % OPTION_ICONS.length];
          const isSelected = selected === opt;
          return (
            <motion.button
              key={opt}
              className={`mc-feedback-btn ${isSelected ? 'mc-feedback-btn--selected' : ''}`}
              onClick={() => !submitted && onSubmit(opt)}
              disabled={submitted && !isSelected}
              variants={item}
              whileHover={!submitted ? { scale: 1.02 } : {}}
              whileTap={!submitted ? { scale: 0.98 } : {}}
            >
              <Icon size={14} />
              <span>{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {submitted && selected && (
        <motion.div
          className="mc-feedback-submitted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CheckCircle2 size={14} color="#22c55e" />
          Feedback recorded — learning memory will update
        </motion.div>
      )}
    </motion.div>
  );
}
