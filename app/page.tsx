"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Navbar } from "@/components/navbar";
import { Form, Results } from "@/components/page";
import { AnalysisResult } from "@/lib/types";
import { useScoreAnimation } from "@/hooks/use-score-animation";

const MIN_JOB_DESC_CHARS = 50;

export default function HomePage() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayScore = useScoreAnimation(result?.score ?? 0);

  const handleSubmit = async () => {
    if (!file || jobDesc.length < MIN_JOB_DESC_CHARS) {
      setError(`Please upload a resume and provide a job description (min ${MIN_JOB_DESC_CHARS} characters)`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

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
              <Form
                jobDesc={jobDesc}
                onJobDescChange={setJobDesc}
                file={file}
                onFileChange={setFile}
                error={error}
                onError={setError}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                minLength={MIN_JOB_DESC_CHARS}
              />
            ) : (
              <Results
                result={result}
                displayScore={displayScore}
                onReset={handleReset}
              />
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
