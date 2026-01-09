import { motion } from "motion/react";
import { Hero } from "./hero";
import { JobDescInput } from "./job-desc-input";
import { FileUpload } from "./file-upload";
import { ErrorMessage } from "./error-message";
import { SubmitButton } from "./submit-button";

interface FormProps {
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

export function Form({
  jobDesc,
  onJobDescChange,
  file,
  onFileChange,
  error,
  onError,
  isLoading,
  onSubmit,
  minLength,
}: FormProps) {
  const canSubmit = !isLoading && file && jobDesc.length >= minLength;

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <JobDescInput
          value={jobDesc}
          onChange={onJobDescChange}
          minLength={minLength}
        />
        <FileUpload
          file={file}
          onFileChange={onFileChange}
          onError={onError}
        />
      </div>

      <ErrorMessage message={error} />
      <SubmitButton
        isLoading={isLoading}
        disabled={!canSubmit}
        onClick={onSubmit}
      />
    </motion.div>
  );
}
