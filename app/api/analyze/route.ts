/**
 * API route for resume analysis
 * Accepts PDF resume + job description, returns AI-powered analysis
 */

import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import { model, buildAnalysisPrompt } from "@/lib/gemini";
import type { AnalysisResult } from "@/lib/types";

// Force Node.js runtime - required for pdf-parse
export const runtime = "nodejs";

// Configure max duration for Vercel deployment (free tier: 10s)
export const maxDuration = 10;

/**
 * POST /api/analyze
 * Analyzes a resume against a job description using Gemini AI
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDesc = formData.get("jobDesc") as string | null;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    if (!jobDesc || jobDesc.trim().length < 50) {
      return NextResponse.json(
        { error: "Job description must be at least 50 characters" },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Parse PDF from buffer in memory
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();

    // Clean up parser resources
    await parser.destroy();

    // Validate PDF content
    if (!pdfData.text || pdfData.text.trim().length < 100) {
      return NextResponse.json(
        { error: "Could not extract sufficient text from PDF. Ensure it's a text-based PDF (not scanned)." },
        { status: 400 }
      );
    }

    // Build and send prompt to Gemini
    const prompt = buildAnalysisPrompt(jobDesc.trim(), pdfData.text);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse and validate response
    let analysis: AnalysisResult;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    // Validate response structure
    if (
      typeof analysis.score !== "number" ||
      typeof analysis.summary !== "string" ||
      !Array.isArray(analysis.missing_keywords) ||
      !Array.isArray(analysis.formatting_issues) ||
      !Array.isArray(analysis.strengths) ||
      !Array.isArray(analysis.recommendations)
    ) {
      return NextResponse.json(
        { error: "Invalid AI response structure" },
        { status: 500 }
      );
    }

    return NextResponse.json(analysis);

  } catch (error) {
    console.error("Analysis error:", error);

    // Provide more specific error messages
    const errorMessage = error instanceof Error
      ? error.message.includes("quota")
        ? "API quota exceeded. Please try again later."
        : error.message.includes("timeout")
        ? "Request timed out. Try with a shorter resume."
        : "Failed to analyze resume"
      : "Failed to analyze resume";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
