"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UPLOAD_LIMITS } from "@/lib/types";

interface UploadFormProps {
  jobDesc: string;
  onJobDescChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error: string | null;
  onError: (error: string | null) => void;
  isLoading: boolean;
  onSubmit: () => void;
  minLength: number;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

export function UploadForm({
  jobDesc,
  onJobDescChange,
  file,
  onFileChange,
  error,
  onError,
  isLoading,
  onSubmit,
  minLength,
}: UploadFormProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      if (!UPLOAD_LIMITS.ALLOWED_TYPES.includes(selectedFile.type as "application/pdf")) {
        onError("Only PDF files are allowed");
        return;
      }

      if (selectedFile.size > UPLOAD_LIMITS.MAX_SIZE_BYTES) {
        onError(`File size must be less than ${UPLOAD_LIMITS.MAX_SIZE_MB}MB`);
        return;
      }

      onFileChange(selectedFile);
      onError(null);
    },
    [onFileChange, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile) return;

      if (!UPLOAD_LIMITS.ALLOWED_TYPES.includes(droppedFile.type as "application/pdf")) {
        onError("Only PDF files are allowed");
        return;
      }

      if (droppedFile.size > UPLOAD_LIMITS.MAX_SIZE_BYTES) {
        onError(`File size must be less than ${UPLOAD_LIMITS.MAX_SIZE_MB}MB`);
        return;
      }

      onFileChange(droppedFile);
      onError(null);
    },
    [onFileChange, onError]
  );

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  const canSubmit = file && jobDesc.length >= minLength && !isLoading;
  const progressPercent = Math.min((jobDesc.length / minLength) * 100, 100);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground mb-2"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Analysis</span>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className="text-5xl font-bold tracking-tight gradient-text"
        >
          Resume Roast & Rank
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed"
        >
          Upload your resume and a job description to get an honest, AI-powered analysis
        </motion.p>
      </motion.div>

      {/* Form Card */}
      <motion.div variants={cardVariants}>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Analyze Your Resume</CardTitle>
            <CardDescription className="text-base">
              Upload a PDF resume and paste the job description below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="space-y-3">
              {!file ? (
                <motion.div
                  className="relative"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    disabled={isLoading}
                  />
                  <motion.div
                    animate={{
                      borderColor: isDragging
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.1)",
                      backgroundColor: isDragging
                        ? "rgba(255, 255, 255, 0.05)"
                        : "transparent",
                    }}
                    transition={{ duration: 0.2 }}
                    className="border-2 border-dashed rounded-xl p-10 text-center"
                  >
                    <motion.div
                      animate={
                        isDragging
                          ? { scale: 1.1, rotate: [0, -5, 5, -5, 0] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                      className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-muted/50"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                    <p className="text-sm font-medium mb-1">
                      {isDragging ? "Drop your resume here" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF files only, max {UPLOAD_LIMITS.MAX_SIZE_MB}MB
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB · PDF document
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveFile}
                    disabled={isLoading}
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Job Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="jobDesc" className="text-sm font-medium">
                  Job Description
                </label>
                <motion.div
                  animate={{
                    scale: jobDesc.length >= minLength ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge
                    variant={jobDesc.length >= minLength ? "default" : "secondary"}
                    className={`text-xs px-2 py-0.5 transition-colors ${
                      jobDesc.length >= minLength
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : ""
                    }`}
                  >
                    {jobDesc.length} / {minLength}
                  </Badge>
                </motion.div>
              </div>
              <div className="relative">
                <Textarea
                  id="jobDesc"
                  placeholder="Paste the job description here..."
                  value={jobDesc}
                  onChange={(e) => onJobDescChange(e.target.value)}
                  disabled={isLoading}
                  rows={8}
                  className="resize-none border-border/50 focus:border-primary/50 bg-background/50"
                />
                {jobDesc.length > 0 && jobDesc.length < minLength && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <Progress value={progressPercent} className="h-1" />
                  </div>
                )}
              </div>
              {jobDesc.length > 0 && jobDesc.length < minLength && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground"
                >
                  Please provide at least {minLength - jobDesc.length} more characters
                </motion.p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: canSubmit ? 1.01 : 1 }}
              whileTap={{ scale: canSubmit ? 0.99 : 1 }}
            >
              <Button
                onClick={onSubmit}
                disabled={!canSubmit}
                className="w-full h-12 text-base font-medium"
                size="lg"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Analyze Resume
                  </span>
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
