"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, AlertCircle, CheckCircle, X, Sparkles } from "lucide-react";

interface AnalysisResult {
  score: number;
  summary: string;
  missing_keywords: string[];
  formatting_issues: string[];
  strengths: string[];
  recommendations: string[];
}

export default function HomePage() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [animateResults, setAnimateResults] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "EXCEPTIONAL";
    if (score >= 75) return "STRONG";
    if (score >= 60) return "MODERATE";
    if (score >= 40) return "WEAK";
    return "POOR";
  };

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
    if (!file || jobDesc.length < 50) {
      setError("Please upload a resume and provide a job description (min 50 characters)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setDisplayScore(0);
    setAnimateResults(false);

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
      setAnimateResults(true);

      // Animate score
      let currentScore = 0;
      const increment = data.score / 50;
      const timer = setInterval(() => {
        currentScore += increment;
        if (currentScore >= data.score) {
          setDisplayScore(data.score);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.round(currentScore));
        }
      }, 20);
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
    setAnimateResults(false);
  };

  return (
    <>
      {/* Background Effects */}
      <div className="aurora-container" />
      <div className="grid-pattern" />
      <div className="noise-overlay" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="border-b border-black/10 dark:border-white/10 py-6 px-4 md:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-electric)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-display text-xl md:text-2xl font-bold">
                RESUME<span className="text-[var(--color-electric)]">AUDIT</span>
              </h1>
            </div>
            <span className="badge-audit hidden sm:inline-block border-[var(--color-electric)] text-[var(--color-electric)]">
              BETA v1.0
            </span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
          {!result ? (
            <>
              {/* Hero Section */}
              <section className="text-center mb-16 stagger-in">
                <h2 className="text-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-none">
                  GET <span className="text-[var(--color-electric)] glitch-hover" data-text="ROASTED">ROASTED</span>
                </h2>
                <p className="text-mono text-sm md:text-base max-w-xl mx-auto opacity-70">
                  Upload your resume. Paste the job description. Get brutally honest feedback from AI.
                  No sugarcoating. Just actionable insights.
                </p>
              </section>

              {/* Main Form */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Job Description Input */}
                <div className="stagger-in">
                  <label className="flex items-center gap-2 text-display text-sm font-semibold mb-3">
                    <FileText className="w-4 h-4" />
                    JOB DESCRIPTION
                  </label>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="input-audit w-full h-64 p-4 text-sm resize-none"
                  />
                  <div className="flex justify-between mt-2 text-xs opacity-50">
                    <span>{jobDesc.length} characters</span>
                    <span className={jobDesc.length >= 50 ? "text-[var(--color-success)]" : ""}>
                      {jobDesc.length >= 50 ? "✓ Ready" : `Min 50 required`}
                    </span>
                  </div>
                </div>

                {/* File Upload */}
                <div className="stagger-in">
                  <label className="flex items-center gap-2 text-display text-sm font-semibold mb-3">
                    <Upload className="w-4 h-4" />
                    RESUME (PDF)
                  </label>
                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-zone h-64 flex flex-col items-center justify-center cursor-pointer relative group"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {file ? (
                      <div className="text-center p-4">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-[var(--color-success)]" />
                        <p className="text-display font-semibold">{file.name}</p>
                        <p className="text-xs opacity-50 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="mt-4 text-xs flex items-center gap-1 mx-auto hover:text-[var(--color-danger)]"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center p-4 group-hover:scale-105 transition-transform">
                        <Upload className="w-12 h-12 mx-auto mb-3 opacity-50 group-hover:text-[var(--color-electric)] transition-colors" />
                        <p className="text-display font-semibold">DROP PDF HERE</p>
                        <p className="text-xs opacity-50 mt-1">or click to browse</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="stagger-in card-audit p-4 mb-8 flex items-start gap-3 border-[var(--color-danger)]">
                  <AlertCircle className="w-5 h-5 text-[var(--color-danger)] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[var(--color-danger)]">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="stagger-in text-center">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !file || jobDesc.length < 50}
                  className="btn-primary px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <div className="spinner-audit w-5 h-5" />
                      ANALYZING...
                    </span>
                  ) : (
                    "START AUDIT"
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Results Section */}
              <div className="max-w-4xl mx-auto">
                {/* Score Header */}
                <div className="card-audit p-8 mb-8 text-center score-reveal">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <h2 className="text-display text-2xl">AUDIT SCORE</h2>
                    <span className={`badge-audit ${getScoreBg(result.score)} text-white`}>
                      {getScoreLabel(result.score)}
                    </span>
                  </div>

                  {/* Large Score Display */}
                  <div className="relative py-8">
                    <div className="text-9xl font-bold text-display leading-none">
                      <span className={getScoreColor(displayScore)}>{displayScore}</span>
                      <span className="text-4xl opacity-30">/100</span>
                    </div>

                    {/* Progress Ring */}
                    <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 400 200">
                      <circle
                        cx="200"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-10"
                      />
                      <circle
                        cx="200"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="var(--color-electric)"
                        strokeWidth="4"
                        strokeDasharray={`${(displayScore / 100) * 502} 502`}
                        transform="rotate(-90 200 100)"
                        className="transition-all duration-300"
                      />
                    </svg>
                  </div>

                  {/* Summary */}
                  <p className="text-mono text-sm max-w-lg mx-auto opacity-80">
                    {result.summary}
                  </p>

                  {/* New Analysis Button */}
                  <button
                    onClick={handleReset}
                    className="mt-8 text-sm flex items-center gap-2 mx-auto hover:text-[var(--color-electric)] transition-colors"
                  >
                    <Upload className="w-4 h-4" /> NEW AUDIT
                  </button>
                </div>

                {/* Results Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Missing Keywords */}
                  {result.missing_keywords.length > 0 && (
                    <div className={`card-audit p-6 ${animateResults ? "stagger-in" : ""}`}>
                      <h3 className="flex items-center gap-2 text-display text-sm font-semibold mb-4 text-[var(--color-danger)]">
                        <AlertCircle className="w-4 h-4" />
                        MISSING KEYWORDS
                        <span className="ml-auto text-xs opacity-50">{result.missing_keywords.length}</span>
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result.missing_keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="badge-audit border-[var(--color-danger)] text-[var(--color-danger)]"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Formatting Issues */}
                  {result.formatting_issues.length > 0 && (
                    <div className={`card-audit p-6 ${animateResults ? "stagger-in" : ""}`}>
                      <h3 className="flex items-center gap-2 text-display text-sm font-semibold mb-4 text-[var(--color-warning)]">
                        <AlertCircle className="w-4 h-4" />
                        FORMATTING ISSUES
                        <span className="ml-auto text-xs opacity-50">{result.formatting_issues.length}</span>
                      </h3>
                      <ul className="space-y-2">
                        {result.formatting_issues.map((issue, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="opacity-30">{String(i + 1).padStart(2, "0")}</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Strengths */}
                  {result.strengths.length > 0 && (
                    <div className={`card-audit p-6 ${animateResults ? "stagger-in" : ""}`}>
                      <h3 className="flex items-center gap-2 text-display text-sm font-semibold mb-4 text-[var(--color-success)]">
                        <CheckCircle className="w-4 h-4" />
                        STRENGTHS
                        <span className="ml-auto text-xs opacity-50">{result.strengths.length}</span>
                      </h3>
                      <ul className="space-y-3">
                        {result.strengths.map((strength, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-[var(--color-success)]">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className={`card-audit p-6 ${animateResults ? "stagger-in" : ""}`}>
                      <h3 className="flex items-center gap-2 text-display text-sm font-semibold mb-4 text-[var(--color-electric)]">
                        <Sparkles className="w-4 h-4" />
                        RECOMMENDATIONS
                        <span className="ml-auto text-xs opacity-50">{result.recommendations.length}</span>
                      </h3>
                      <ul className="space-y-3">
                        {result.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-[var(--color-electric)]">→</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-black/10 dark:border-white/10 py-6 px-4 md:px-8 mt-16">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-50">
            <p>Powered by Google Gemini Flash</p>
            <p>Built with Next.js + Aceternity UI</p>
          </div>
        </footer>
      </div>
    </>
  );
}
