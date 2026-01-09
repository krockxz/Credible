import { FileText } from "lucide-react";
import { motion } from "motion/react";

interface JobDescInputProps {
  value: string;
  onChange: (value: string) => void;
  minLength: number;
}

export function JobDescInput({ value, onChange, minLength }: JobDescInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <label className="flex items-center gap-2 font-display text-xs font-semibold mb-3 uppercase tracking-wider">
        <FileText className="w-4 h-4 text-[var(--color-electric)]" />
        Job Description
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="input-audit w-full h-64 p-4 text-sm resize-none rounded-xl"
      />
      <div className="flex justify-between mt-3 text-xs opacity-50">
        <span>{value.length} characters</span>
        <span className={value.length >= minLength ? "text-[var(--color-success)] font-medium" : ""}>
          {value.length >= minLength ? "✓ Ready to analyze" : `Min ${minLength} characters`}
        </span>
      </div>
    </motion.div>
  );
}
