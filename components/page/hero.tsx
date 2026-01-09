import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-electric)]/10 border border-[var(--color-electric)]/20 text-[var(--color-electric)] text-xs font-display uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI-Powered Resume Analysis</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
      >
        GET{" "}
        <span className="text-[var(--color-electric)] glitch-hover inline-block" data-text="ROASTED">
          ROASTED
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="font-mono text-sm md:text-base max-w-xl mx-auto opacity-60 leading-relaxed"
      >
        Upload your resume. Paste the job description. Get brutally honest feedback
        powered by AI.
      </motion.p>
    </section>
  );
}
