"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Single source of truth for score-based styling
const getScoreConfig = (score: number) => {
  if (score >= 80) {
    return {
      color: "text-emerald-500",
      ringColor: "#10b981",
      bgColor: "bg-emerald-500/10",
      label: "Great Match!",
    };
  }
  if (score >= 60) {
    return {
      color: "text-amber-500",
      ringColor: "#f59e0b",
      bgColor: "bg-amber-500/10",
      label: "Moderate Match",
    };
  }
  return {
    color: "text-rose-500",
    ringColor: "#f43f5e",
    bgColor: "bg-rose-500/10",
    label: "Poor Match",
  };
};

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const [score, setScore] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const scoreConfig = getScoreConfig(result.score);
  const circumference = 2 * Math.PI * 56;

  // Animate score number
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = result.score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= result.score) {
        setScore(result.score);
        clearInterval(timer);
      } else {
        setScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result.score]);

  // Show content after score animation
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const cardItems = [
    { id: "summary", title: "Summary", icon: null, content: result.summary, type: "text" as const },
    ...(result.missing_keywords.length > 0 ? [{
      id: "missing", title: "Missing Keywords", icon: <XCircle className="w-5 h-5 text-rose-500" />,
      content: result.missing_keywords, type: "tags" as const
    }] : []),
    ...(result.strengths.length > 0 ? [{
      id: "strengths", title: "Strengths", icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      content: result.strengths, type: "list" as const
    }] : []),
    ...(result.recommendations.length > 0 ? [{
      id: "recommendations", title: "Recommendations", icon: <TrendingUp className="w-5 h-5 text-blue-500" />,
      content: result.recommendations, type: "list" as const
    }] : []),
    ...(result.formatting_issues.length > 0 ? [{
      id: "formatting", title: "Formatting Issues", icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      content: result.formatting_issues, type: "list" as const
    }] : []),
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={variants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onReset}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Analysis Results</h1>
      </motion.div>

      {/* Score Card */}
      <motion.div variants={variants}>
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Circular Score */}
              <div className="relative">
                <motion.div
                  className={`absolute inset-0 rounded-full blur-2xl ${scoreConfig.bgColor}`}
                  animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative w-36 h-36">
                  <svg className="transform -rotate-90 w-36 h-36">
                    <circle
                      cx="72" cy="72" r="56"
                      stroke="currentColor" strokeWidth="10" fill="none"
                      className="text-muted/20"
                    />
                    <motion.circle
                      cx="72" cy="72" r="56"
                      stroke={scoreConfig.ringColor}
                      strokeWidth="10" fill="none"
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (result.score / 100) * circumference }}
                      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-5xl font-bold tracking-tight ${scoreConfig.color}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {score}
                    </motion.span>
                    <span className="text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>

              {/* Score Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-1"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  {result.score >= 80 && (
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Award className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  )}
                  <span className={`text-lg font-semibold ${scoreConfig.color}`}>
                    {scoreConfig.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Your resume matches this position</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Cards */}
      {showContent && cardItems.map((item, index) => (
        <motion.div
          key={item.id}
          variants={variants}
          transition={{ delay: index * 0.1 }}
          className="border-border/50 bg-card/50 backdrop-blur-sm rounded-xl border"
        >
          <div className="p-6">
            <h3 className="flex items-center gap-2 text-base font-semibold mb-4">
              {item.icon}
              {item.title}
              {item.type === "tags" && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {item.content.length}
                </Badge>
              )}
            </h3>

            {item.type === "text" && (
              <p className="text-muted-foreground">{item.content}</p>
            )}

            {item.type === "tags" && (
              <div className="flex flex-wrap gap-2">
                {(item.content as string[]).map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="bg-rose-500/10 text-rose-500 border-rose-500/20"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {item.type === "list" && (
              <ul className="space-y-3">
                {(item.content as string[]).map((listItem, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                    <span className="text-muted-foreground">{listItem}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      ))}

      {/* Action Button */}
      {showContent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-2"
        >
          <Button onClick={onReset} variant="outline" className="w-full border-border/50">
            Analyze Another Resume
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
