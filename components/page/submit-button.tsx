import { Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function SubmitButton({ isLoading, disabled, onClick }: SubmitButtonProps) {
  const canAnimate = !isLoading && !disabled;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-center"
    >
      <motion.button
        onClick={onClick}
        disabled={disabled}
        whileHover={{ scale: canAnimate ? 1.02 : 1 }}
        whileTap={{ scale: canAnimate ? 0.98 : 1 }}
        className="relative px-12 py-4 rounded-xl font-display text-sm uppercase tracking-wider overflow-hidden bg-[var(--color-electric)] text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-3"
            >
              <div className="spinner-audit" />
              Analyzing...
            </motion.span>
          ) : (
            <motion.span
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Start Audit
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}
