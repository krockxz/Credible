"use client";

import { useCallback, useState } from "react";
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/50 text-xs text-muted-foreground mb-2">
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Analysis</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight gradient-text">
          Resume Roast & Rank
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Upload your resume and a job description to get an honest, AI-powered analysis
        </p>
      </div>

      {/* Form Card */}
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
              <div
                className={`relative group transition-all duration-300 ${
                  isDragging ? "scale-[1.02]" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLoading}
                />
                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${
                    isDragging
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/40 hover:border-border/80 hover:bg-muted/30"
                  }`}
                >
                  <div
                    className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isDragging
                        ? "bg-primary/20 scale-110"
                        : "bg-muted/50 group-hover:bg-muted/70"
                    }`}
                  >
                    <Upload
                      className={`w-6 h-6 transition-all duration-300 ${
                        isDragging ? "text-primary scale-110" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    {isDragging ? "Drop your resume here" : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF files only, max {UPLOAD_LIMITS.MAX_SIZE_MB}MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-xl animate-scale-in">
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
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="jobDesc" className="text-sm font-medium">
                Job Description
              </label>
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
              <p className="text-xs text-muted-foreground">
                Please provide at least {minLength - jobDesc.length} more characters
              </p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 animate-fade-in-up">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="w-full h-12 text-base font-medium transition-all duration-300 disabled:opacity-50"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Analyze Resume
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
