/**
 * Type definitions for the Resume Roast & Rank application
 */

/** Request payload for resume analysis */
export interface AnalysisRequest {
  resume: File;
  jobDesc: string;
}

/** Analysis result returned by Gemini AI */
export interface AnalysisResult {
  /** Match score from 0 to 100 */
  score: number;
  /** Two-sentence summary of the candidate's fit */
  summary: string;
  /** Skills and keywords missing from the resume */
  missing_keywords: string[];
  /** Formatting issues found in the resume */
  formatting_issues: string[];
  /** Candidate's demonstrated strengths */
  strengths: string[];
  /** Actionable recommendations for improvement */
  recommendations: string[];
}

/** API response wrapper */
export interface ApiResponse<T = AnalysisResult> {
  data?: T;
  error?: string;
}

/** Upload file validation constraints */
export const UPLOAD_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ["application/pdf"],
} as const;
