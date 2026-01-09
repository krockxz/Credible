import { Upload, CheckCircle, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useCallback } from "react";

interface FileUploadProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onError: (error: string | null) => void;
}

export function FileUpload({ file, onFileChange, onError }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.add("dragover");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove("dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dropZoneRef.current?.classList.remove("dragover");
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      onFileChange(droppedFile);
      onError(null);
    } else {
      onError("Only PDF files are accepted");
    }
  }, [onFileChange, onError]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
      onError(null);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <label className="flex items-center gap-2 font-display text-xs font-semibold mb-3 uppercase tracking-wider">
        <Upload className="w-4 h-4 text-[var(--color-electric)]" />
        Resume (PDF)
      </label>
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="upload-zone h-64 flex flex-col items-center justify-center cursor-pointer rounded-xl"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />
        {file ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center p-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-[var(--color-success)]" />
            </div>
            <p className="font-display text-sm font-semibold truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs opacity-50 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
            <button
              onClick={handleRemove}
              className="mt-4 text-xs flex items-center gap-2 mx-auto px-4 py-2 rounded-lg hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-electric)]/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-[var(--color-electric)] opacity-60" />
            </div>
            <p className="font-display text-sm font-semibold">Drop PDF here</p>
            <p className="text-xs opacity-50 mt-1">or click to browse</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
