/**
 * JobInput component
 * Text area for entering job description with character counter
 */

"use client";

import { ChangeEvent } from "react";

interface JobInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const MIN_CHARS = 50;

export function JobInput({ value, onChange, disabled = false }: JobInputProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const charCount = value.length;
  const isValid = charCount >= MIN_CHARS;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="job-description" className="text-sm font-medium text-gray-700">
        Job Description <span className="text-red-500">*</span>
      </label>

      <textarea
        id="job-description"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Paste the job description here. Include requirements, skills, and qualifications..."
        className={`
          w-full min-h-[180px] p-3 border rounded-lg font-sans text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed resize-y
          ${!isValid && charCount > 0 ? "border-orange-300" : "border-gray-300"}
        `}
        aria-describedby="char-counter"
      />

      <div className="flex justify-between items-center">
        <span id="char-counter" className="text-xs text-gray-500">
          {charCount < MIN_CHARS ? (
            <>
              Minimum {MIN_CHARS} characters (
              <span className={charCount > 0 ? "text-orange-500" : "text-gray-400"}>
                {charCount}/{MIN_CHARS}
              </span>)
            </>
          ) : (
            <span className="text-green-600">{charCount} characters</span>
          )}
        </span>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            disabled={disabled}
            className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
