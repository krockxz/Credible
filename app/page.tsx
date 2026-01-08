/**
 * Main page component
 * Handles resume upload, job description input, and displays analysis results
 */

"use client";

import { useState } from "react";
import { JobInput } from "@/components/JobInput";
import { FileUpload } from "@/components/FileUpload";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import type { AnalysisResult } from "@/lib/types";

export default function Home() {
  const [jobDesc, setJobDesc] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = jobDesc.length >= 50 && resumeFile !== null;

  const handleSubmit = async () => {
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile!);
      formData.append("jobDesc", jobDesc);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze resume");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setJobDesc("");
    setResumeFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Resume Roast & Rank</h1>
              <p className="text-sm text-gray-500">AI-powered resume analysis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {!result ? (
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                See how well your resume matches the job
              </h2>
              <p className="text-sm text-gray-600">
                Upload your resume (PDF) and paste the job description below. Our AI will analyze
                your resume, calculate a match score, and provide actionable feedback to improve
                your chances.
              </p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <FileUpload
                file={resumeFile}
                onFileSelect={setResumeFile}
                disabled={isLoading}
              />

              <JobInput
                value={jobDesc}
                onChange={setJobDesc}
                disabled={isLoading}
              />

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isLoading}
                className={`
                  w-full py-3 px-4 rounded-lg font-medium text-white transition-all
                  ${canSubmit && !isLoading
                    ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-300 cursor-not-allowed"
                  }
                  ${isLoading ? "flex items-center justify-center gap-2" : ""}
                `}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing your resume...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>

            {/* Info Footer */}
            <div className="text-center text-xs text-gray-500">
              Powered by Google Gemini 1.5 Flash • Your resume is processed in memory and never stored
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Analysis Results</h2>
              <button
                onClick={handleReset}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Analyze another resume →
              </button>
            </div>

            {/* Results */}
            <ResultsDisplay result={result} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-6 text-center text-xs text-gray-500">
        Built with Next.js, Google Gemini AI, and hosted on Vercel
      </footer>
    </div>
  );
}
