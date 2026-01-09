"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, X, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/navbar";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/utils";

interface AnalysisResult {
  score: number;
  summary: string;
  missing_keywords: string[];
  formatting_issues: string[];
  strengths: string[];
  recommendations: string[];
}

const MIN_JOB_DESC_CHARS = 50;

export default function HomePage() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add("dragover");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove("dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove("dragover");
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Only PDF files are accepted");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file || jobDesc.length < MIN_JOB_DESC_CHARS) {
      setError(`Please upload a resume and provide a job description (min ${MIN_JOB_DESC_CHARS} characters)`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setDisplayScore(0);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDesc", jobDesc);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);

      // Animate score
      const duration = 1200;
      const steps = 60;
      const increment = data.score / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= data.score) {
          setDisplayScore(data.score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, duration / steps);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setJobDesc("");
    setError(null);
    setDisplayScore(0);
  };

  return (
    <>
      {/* Background Effects */}
      <div className="aurora-container" />
      <div className="grid-pattern" />
      <div className="noise-overlay" />

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col pt-16">
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Hero Section */}
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

                {/* Main Form */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Job Description Input */}
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
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Paste the job description here..."
                      className="input-audit w-full h-64 p-4 text-sm resize-none rounded-xl"
                    />
                    <div className="flex justify-between mt-3 text-xs opacity-50">
                      <span>{jobDesc.length} characters</span>
                      <span className={jobDesc.length >= MIN_JOB_DESC_CHARS ? "text-[var(--color-success)] font-medium" : ""}>
                        {jobDesc.length >= MIN_JOB_DESC_CHARS ? "✓ Ready to analyze" : `Min ${MIN_JOB_DESC_CHARS} characters`}
                      </span>
                    </div>
                  </motion.div>

                  {/* File Upload */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="flex items-center gap-2 font-display text-xs font-semibold mb-3 uppercase tracking-wider">
                      <Upload className="w-4 h-4 text-[var(--color-electric)]" />
                      Resume (PDF)
                    </label>
                    <div
                      ref={dropZoneRef}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-zone h-64 flex flex-col items-center justify-center cursor-pointer rounded-xl"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {file ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center p-4"
                        >
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-[var(--color-success)]" />
                          </div>
                          <p className="font-display text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
                          <p className="text-xs opacity-50 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setFile(null); }}
                            className="mt-4 text-xs flex items-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] transition-colors"
                          >
                            <X className="w-3.5 h-3.5" /> Remove
                          </button>
                        </motion.div>
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-electric)]/10 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-[var(--color-electric)] opacity-60" />
                          </div>
                          <p className="font-display text-sm font-semibold">Drop PDF here</p>
                          <p className="text-xs opacity-50 mt-1">or click to browse</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Error Display */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0" />
                      <p className="text-sm text-[var(--color-danger)]">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading || !file || jobDesc.length < MIN_JOB_DESC_CHARS}
                    whileHover={{ scale: (!isLoading && file && jobDesc.length >= MIN_JOB_DESC_CHARS) ? 1.02 : 1 }}
                    whileTap={{ scale: (!isLoading && file && jobDesc.length >= MIN_JOB_DESC_CHARS) ? 0.98 : 1 }}
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
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                {/* Score Card - FIXED ALIGNMENT */}
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

                  {/* FIXED: Score Display with proper centering */}
                  <div className="relative flex items-center justify-center py-8">
                    {/* SVG Ring - properly sized and positioned */}
                    <svg
                      className="absolute w-48 h-48"
                      viewBox="0 0 200 200"
                      style={{ transform: "rotate(-90deg)" }}
                    >
                      {/* Background circle */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="opacity-10"
                      />
                      {/* Progress circle */}
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

                    {/* Score text - centered in the ring */}
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

                  {/* Summary */}
                  <p className="font-mono text-sm max-w-lg mx-auto opacity-70 leading-relaxed mt-6">
                    {result.summary}
                  </p>

                  {/* New Audit Button */}
                  <motion.button
                    onClick={handleReset}
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
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-black/10 dark:border-white/10 px-4 md:px-8 py-6 mt-auto">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
            <p>Powered by Google Gemini Flash</p>
            <p>Built with Next.js + Acernity UI</p>
          </div>
        </footer>
      </div>
    </>
  );
}
