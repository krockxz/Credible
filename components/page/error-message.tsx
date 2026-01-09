import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0" />
          <p className="text-sm text-[var(--color-danger)]">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
