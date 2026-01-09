/**
 * Gemini AI client configuration
 * Uses Google Gemini 1.5 Flash for resume analysis with structured JSON output
 */

import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Gemini model configured for structured JSON output
 * Uses gemini-1.5-flash for fast, cost-effective analysis
 */
export const model: GenerativeModel = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.7,
  },
});

/**
 * Builds the analysis prompt for resume evaluation
 */
export function buildAnalysisPrompt(jobDesc: string, resumeText: string): string {
  return `You are an expert ATS (Applicant Tracking System) and hiring manager with 15 years of experience.
Your task is to evaluate the resume against the job description and provide actionable feedback.

JOB DESCRIPTION:
${jobDesc}

RESUME TEXT:
${resumeText}

Analyze the resume and return a valid JSON object with the following structure:
{
  "score": number (0-100 integer, overall match percentage),
  "summary": string (exactly 2 sentences describing the candidate's fit),
  "missing_keywords": string[] (array of important skills/keywords from the JD that are missing),
  "formatting_issues": string[] (array of specific formatting problems found),
  "strengths": string[] (array of what the candidate does well),
  "recommendations": string[] (array of actionable improvements to increase match score)
}

Scoring guidelines:
- 90-100: Exceptional match, all key requirements met
- 75-89: Strong match, most requirements met with minor gaps
- 60-74: Moderate match, some key requirements missing
- 40-59: Weak match, significant gaps in experience/skills
- 0-39: Poor match, fundamental requirements not met

Be thorough but fair in your assessment. Focus on actionable feedback that helps the candidate improve.`;
}
