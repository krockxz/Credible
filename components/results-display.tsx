"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = result.score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= result.score) {
        setAnimatedScore(result.score);
        clearInterval(timer);
        // Show content after score animation completes
        setTimeout(() => setShowContent(true), 200);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.score]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500";
    if (score >= 60) return "stroke-amber-500";
    return "stroke-rose-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10";
    if (score >= 60) return "bg-amber-500/10";
    return "bg-rose-500/10";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Great Match!";
    if (score >= 60) return "Moderate Match";
    return "Poor Match";
  };

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const cardItems = [
    { id: "summary", title: "Summary", icon: null, content: result.summary, type: "text" },
    {
      id: "missing",
      title: "Missing Keywords",
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      content: result.missing_keywords,
      type: "tags",
      show: result.missing_keywords.length > 0,
    },
    {
      id: "strengths",
      title: "Strengths",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      content: result.strengths,
      type: "list",
      show: result.strengths.length > 0,
    },
    {
      id: "recommendations",
      title: "Recommendations",
      icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      content: result.recommendations,
      type: "list",
      show: result.recommendations.length > 0,
    },
    {
      id: "formatting",
      title: "Formatting Issues",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      content: result.formatting_issues,
      type: "list",
      show: result.formatting_issues.length > 0,
    },
  ].filter((item) => item.show !== false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onReset} className="hover:bg-muted/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Analysis Results</h1>
      </div>

      {/* Score Card */}
      <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Circular Score */}
            <div className="relative">
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full blur-2xl opacity-20 ${getScoreBgColor(result.score)}`}
              />

              {/* SVG Circle */}
              <div className="relative w-36 h-36">
                <svg className="transform -rotate-90 w-36 h-36">
                  {/* Background circle */}
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-muted/20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="72"
                    cy="72"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${getScoreRingColor(result.score)}`}
                    style={{
                      filter: result.score >= 80 ? "drop-shadow(0 0 8px hsl(142 76% 36% / 0.4))" : undefined,
                    }}
                  />
                </svg>

                {/* Score text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-5xl font-bold tracking-tight ${getScoreColor(result.score)}`}>
                    {animatedScore}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">%</span>
                </div>
              </div>
            </div>

            {/* Score label */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50">
                {result.score >= 80 && <Award className="w-4 h-4 text-emerald-500" />}
                <h2 className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                  {getScoreLabel(result.score)}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Your resume matches this position
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content cards with staggered animation */}
      {showContent && (
        <div className="space-y-4">
          {cardItems.map((item, index) => (
            <Card
              key={item.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
              style={{
                animation: `fade-in-up 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {item.icon}
                  {item.title}
                  {item.type === "tags" && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.content.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.type === "text" && (
                  <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                )}
                {item.type === "tags" && (
                  <div className="flex flex-wrap gap-2">
                    {item.content.map((tag: string, i: number) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="px-3 py-1 text-sm bg-rose-500/10 text-rose-500 border-rose-500/20 hover:bg-rose-500/20 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.type === "list" && (
                  <ul className="space-y-3">
                    {item.content.map((listItem: string, i: number) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                        <span className="text-muted-foreground">{listItem}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 border-border/50 hover:bg-muted/50"
        >
          Analyze Another Resume
        </Button>
      </div>
    </div>
  );
}
