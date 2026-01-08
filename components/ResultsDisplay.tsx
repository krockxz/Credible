/**
 * ResultsDisplay component
 * Shows analysis results with color-coded score and categorized feedback
 */

import type { AnalysisResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: AnalysisResult;
}

const getScoreColor = (score: number): string => {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  return "text-red-600";
};

const getScoreBgColor = (score: number): string => {
  if (score >= 75) return "bg-green-500";
  if (score >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Weak";
  return "Poor";
};

function ListSection({
  title,
  icon,
  items,
  iconColor = "text-blue-500",
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  iconColor?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className={`flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3`}>
        <span className={iconColor}>{icon}</span>
        {title}
        <span className="text-xs font-normal text-gray-500 ml-auto">
          {items.length}
        </span>
      </h3>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="text-gray-400 mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const scoreColor = getScoreColor(result.score);
  const scoreBgColor = getScoreBgColor(result.score);
  const scoreLabel = getScoreLabel(result.score);

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Match Score</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${scoreBgColor} text-white`}
          >
            {scoreLabel}
          </span>
        </div>

        {/* Score Bar */}
        <div className="relative">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${scoreBgColor} transition-all duration-500 ease-out`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <div
            className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${scoreColor}`}
          >
            {result.score}%
          </div>
        </div>

        {/* Summary */}
        <p className="mt-4 text-sm text-gray-600 leading-relaxed">
          {result.summary}
        </p>
      </div>

      {/* Sections Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Missing Keywords */}
        <ListSection
          title="Missing Keywords"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
          items={result.missing_keywords}
          iconColor="text-red-500"
        />

        {/* Formatting Issues */}
        <ListSection
          title="Formatting Issues"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          items={result.formatting_issues}
          iconColor="text-yellow-500"
        />

        {/* Strengths */}
        <ListSection
          title="Strengths"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
          items={result.strengths}
          iconColor="text-green-500"
        />

        {/* Recommendations */}
        <ListSection
          title="Recommendations"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
          items={result.recommendations}
          iconColor="text-blue-500"
        />
      </div>
    </div>
  );
}
