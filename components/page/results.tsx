import { Upload, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { AnalysisResult } from "@/lib/types";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";

interface ResultsProps {
  result: AnalysisResult;
  displayScore: number;
  onReset: () => void;
}

export function Results({ result, displayScore, onReset }: ResultsProps) {
  return (
    <motion.div
      key="results"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto"
    >
      {/* Score Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="card-audit p-8 mb-8 text-center score-reveal rounded-2xl"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className="font-display text-lg uppercase tracking-wider">Audit Score</h2>
          <span className={`badge-audit ${getScoreBgColor(result.score)} text-white rounded-full`}>
            {getScoreLabel(result.score).toUpperCase()}
          </span>
        </div>

        {/* Score Display */}
        <div className="relative flex items-center justify-center py-8">
          <svg
            className="absolute w-48 h-48"
            viewBox="0 0 200 200"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="opacity-10"
            />
            <motion.circle
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayScore / 100 }}
              transition={{ duration: 1, ease: "easeOut" }}
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="var(--color-electric)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - displayScore / 100)}
            />
          </svg>

          <div className="relative z-10 text-center">
            <motion.div
              key={displayScore}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-7xl font-bold font-display leading-none"
            >
              <span className={getScoreColor(displayScore)}>{displayScore}</span>
              <span className="text-2xl opacity-30">/100</span>
            </motion.div>
          </div>
        </div>

        <p className="font-mono text-sm max-w-lg mx-auto opacity-70 leading-relaxed mt-6">
          {result.summary}
        </p>

        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 text-xs flex items-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-[var(--color-electric)]/10 hover:text-[var(--color-electric)] transition-colors"
        >
          <Upload className="w-4 h-4" /> New Audit
        </motion.button>
      </motion.div>

      {/* Results Grid */}
      <div className="grid gap-4">
        {/* Missing Keywords */}
        {result.missing_keywords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-audit p-6 rounded-2xl"
          >
            <h3 className="flex items-center gap-2 font-display text-xs font-semibold mb-4 text-[var(--color-danger)] uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              Missing Keywords
              <span className="ml-auto text-xs opacity-40">{result.missing_keywords.length}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.missing_keywords.map((keyword, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="badge-audit border-[var(--color-danger)] text-[var(--color-danger)] text-xs"
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {/* Formatting Issues */}
          {result.formatting_issues.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card-audit p-6 rounded-2xl"
            >
              <h3 className="flex items-center gap-2 font-display text-xs font-semibold mb-4 text-[var(--color-warning)] uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                Formatting Issues
                <span className="ml-auto text-xs opacity-40">{result.formatting_issues.length}</span>
              </h3>
              <ul className="space-y-3">
                {result.formatting_issues.map((issue, i) => (
                  <li key={i} className="text-sm flex gap-3">
                    <span className="opacity-30 text-xs mt-0.5">{i + 1}.</span>
                    <span className="flex-1">{issue}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-audit p-6 rounded-2xl"
            >
              <h3 className="flex items-center gap-2 font-display text-xs font-semibold mb-4 text-[var(--color-success)] uppercase tracking-wider">
                <CheckCircle className="w-4 h-4" />
                Strengths
                <span className="ml-auto text-xs opacity-40">{result.strengths.length}</span>
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((strength, i) => (
                  <li key={i} className="text-sm flex gap-3">
                    <span className="text-[var(--color-success)] text-xs mt-0.5">✓</span>
                    <span className="flex-1">{strength}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Recommendations */}
        {result.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-audit p-6 rounded-2xl"
          >
            <h3 className="flex items-center gap-2 font-display text-xs font-semibold mb-4 text-[var(--color-electric)] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Recommendations
              <span className="ml-auto text-xs opacity-40">{result.recommendations.length}</span>
            </h3>
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="text-sm flex gap-3">
                  <span className="text-[var(--color-electric)] text-xs mt-0.5">→</span>
                  <span className="flex-1">{rec}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
