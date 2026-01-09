import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Score utilities
export type ScoreLevel = "exceptional" | "strong" | "moderate" | "weak" | "poor";

export function getScoreColor(score: number): string {
  if (score >= 75) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-rose-500";
}

export function getScoreBgColor(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export function getScoreLabel(score: number): ScoreLevel {
  if (score >= 90) return "exceptional";
  if (score >= 75) return "strong";
  if (score >= 60) return "moderate";
  if (score >= 40) return "weak";
  return "poor";
}
