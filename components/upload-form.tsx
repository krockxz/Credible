"use client";

import { useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

  const handleRemoveFile = () => {
    onFileChange(null);
  };

  const canSubmit = file && jobDesc.length >= minLength && !isLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Resume Roast & Rank</h1>
        <p className="text-muted-foreground">
          Upload your resume and a job description to get an AI-powered analysis
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Analyze Your Resume</CardTitle>
          <CardDescription>
            Upload a PDF resume and paste the job description below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            {!file ? (
              <div className="relative group">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF files only, max {UPLOAD_LIMITS.MAX_SIZE_MB}MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="jobDesc" className="text-sm font-medium">
                Job Description
              </label>
              {jobDesc.length > 0 && (
                <Badge variant={jobDesc.length >= minLength ? "default" : "secondary"}>
                  {jobDesc.length} / {minLength}
                </Badge>
              )}
            </div>
            <Textarea
              id="jobDesc"
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => onJobDescChange(e.target.value)}
              disabled={isLoading}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Analyzing..." : "Analyze Resume"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
