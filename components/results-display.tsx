"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, ArrowLeft, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnalysisResult } from "@/lib/types";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const scoreRingVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, duration: 1.5 },
  },
};

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const scoreProgress = useMotionValue(0);
  const [showContent, setShowContent] = useState(false);

  // Transform the motion value to the actual score number
  const animatedScore = useTransform(scoreProgress, [0, 1], [0, result.score]);
  const circumference = 2 * Math.PI * 56;

  // Transform progress to stroke dashoffset
  const strokeDashoffset = useTransform(
    scoreProgress,
    [0, 1],
    [circumference, circumference - (result.score / 100) * circumference]
  );

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return "#10b981"; // emerald-500
    if (score >= 60) return "#f59e0b"; // amber-500
    return "#f43f5e"; // rose-500
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

  // Memoize card items to prevent re-renders
  const cardItems = useMemo(
    () => [
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
    ].filter((item) => item.show !== false),
    [result]
  );

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Display value for the score
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    const unsubscribe = animatedScore.on("change", (latest) => {
      setDisplayScore(Math.round(latest));
    });
    return unsubscribe;
  }, [animatedScore]);

  const ringColor = getScoreRingColor(result.score);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header with back button */}
      <motion.div variants={cardVariants} className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onReset} className="hover:bg-muted/50">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Analysis Results</h1>
      </motion.div>

      {/* Score Card */}
      <motion.div variants={cardVariants}>
        <Card className="border-border/50 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Circular Score */}
              <motion.div variants={scoreRingVariants} className="relative">
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-full blur-2xl ${getScoreBgColor(result.score)}`}
                  animate={{
                    opacity: [0.1, 0.2, 0.1],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
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
                    <motion.circle
                      cx="72"
                      cy="72"
                      r="56"
                      stroke={ringColor}
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                      style={{ strokeDashoffset }}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (result.score / 100) * circumference }}
                      transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                      filter={result.score >= 80 ? "drop-shadow(0 0 8px hsl(142 76% 36% / 0.4))" : undefined}
                    />
                  </svg>

                  {/* Score text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-5xl font-bold tracking-tight ${getScoreColor(result.score)}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                      {displayScore}
                    </motion.span>
                    <span className="text-sm text-muted-foreground font-medium">%</span>
                  </div>
                </div>
              </motion.div>

              {/* Score label */}
              <motion.div
                className="space-y-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {result.score >= 80 && (
                    <motion.div
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                    >
                      <Award className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  )}
                  <h2 className={`text-lg font-semibold ${getScoreColor(result.score)}`}>
                    {getScoreLabel(result.score)}
                  </h2>
                </motion.div>
                <p className="text-sm text-muted-foreground">Your resume matches this position</p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content cards with staggered animation */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {cardItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-xl border"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="p-6">
                  <div className="pb-3">
                    <h3 className="flex items-center gap-2 text-base font-semibold">
                      {item.icon}
                      {item.title}
                      {item.type === "tags" && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.content.length}
                        </Badge>
                      )}
                    </h3>
                  </div>
                  <div>
                    {item.type === "text" && (
                      <p className="text-muted-foreground leading-relaxed">{item.content}</p>
                    )}
                    {item.type === "tags" && (
                      <div className="flex flex-wrap gap-2">
                        {item.content.map((tag: string, i: number) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Badge
                              variant="secondary"
                              className="px-3 py-1 text-sm bg-rose-500/10 text-rose-500 border-rose-500/20"
                            >
                              {tag}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                    {item.type === "list" && (
                      <ul className="space-y-3">
                        {item.content.map((listItem: string, i: number) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 300, damping: 24 }}
                            className="flex gap-3"
                          >
                            <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                            <span className="text-muted-foreground">{listItem}</span>
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: showContent ? cardItems.length * 0.1 + 0.3 : 0 }}
        className="flex gap-3 pt-2"
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1"
        >
          <Button
            onClick={onReset}
            variant="outline"
            className="w-full border-border/50 hover:bg-muted/50"
          >
            Analyze Another Resume
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
