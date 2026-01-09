"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
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

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const loadingStates = [
  { text: "Uploading your resume..." },
  { text: "Extracting text from PDF..." },
  { text: "Analyzing job requirements..." },
  { text: "Matching keywords..." },
  { text: "Evaluating formatting..." },
  { text: "Calculating match score..." },
  { text: "Generating recommendations..." },
  { text: "Almost done..." },
];

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

  const validateAndSetFile = useCallback(
    (selectedFile: File | null | undefined) => {
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

  const canSubmit = file && jobDesc.length >= minLength && !isLoading;

  return (
    <>
      <MultiStepLoader loadingStates={loadingStates} loading={isLoading} duration={2000} loop={false} />

      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={variants} className="text-center space-y-3">
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Upload your resume and a job description to get an honest, AI-powered analysis
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div variants={cardVariants}>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Analyze Your Resume</CardTitle>
              <CardDescription>Upload a PDF resume and paste the job description below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              {!file ? (
                <motion.div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    validateAndSetFile(e.dataTransfer.files[0]);
                  }}
                  animate={isDragging ? { scale: 1.02 } : {}}
                  className="relative"
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => validateAndSetFile(e.target.files?.[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <motion.div
                    animate={isDragging ? { borderColor: "rgba(255,255,255,0.2)", backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                    className="border-2 border-dashed rounded-xl p-10 text-center border-border/40"
                  >
                    <motion.div
                      animate={isDragging ? { scale: 1.1, rotate: [0, -5, 5, -5, 0] } : {}}
                      className="w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-muted/50"
                    >
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                    <p className="text-sm font-medium mb-1">
                      {isDragging ? "Drop your resume here" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF only, max {UPLOAD_LIMITS.MAX_SIZE_MB}MB
                    </p>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onFileChange(null)}
                    disabled={isLoading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* Job Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="jobDesc" className="text-sm font-medium">Job Description</label>
                  <Badge
                    variant="outline"
                    className={jobDesc.length >= minLength
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-muted/50 text-foreground border-border"}
                  >
                    {jobDesc.length} / {minLength}
                  </Badge>
                </div>
                <div className="relative">
                  <Textarea
                    id="jobDesc"
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e) => onJobDescChange(e.target.value)}
                    disabled={isLoading}
                    rows={8}
                    className="resize-none"
                  />
                  {jobDesc.length > 0 && jobDesc.length < minLength && (
                    <div className="absolute bottom-3 left-3 right-3">
                      <Progress value={(jobDesc.length / minLength) * 100} className="h-1" />
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.div whileHover={canSubmit ? { scale: 1.01 } : {}} whileTap={canSubmit ? { scale: 0.99 } : {}}>
                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block w-full"
                >
                  <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </span>
                  <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10 justify-center">
                    {isLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-transparent rounded-full"
                        />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                </button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
}
