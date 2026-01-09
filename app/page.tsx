"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { UploadForm } from "@/components/upload-form";
import { ResultsDisplay } from "@/components/results-display";
import { AnalysisResult } from "@/lib/types";

const MIN_JOB_DESC_CHARS = 50;

export default function HomePage() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-background relative">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/3 via-transparent to-primary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.08),rgba(255,255,255,0))]" />
      </div>

      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        {!result ? (
          <UploadForm
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
          <ResultsDisplay
            result={result}
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="border-t border-border/40 px-4 py-6 mt-12">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Powered by Google Gemini Flash</p>
          <p>Built with Next.js + shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}
