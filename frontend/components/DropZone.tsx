"use client";

import { useCallback, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp", "application/pdf"];

export default function DropZone({ onFile, disabled }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        setError("Please upload a JPG, PNG, or PDF file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File must be under 10 MB.");
        return;
      }
      setError(null);
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`
          flex flex-col items-center justify-center w-full h-56 border-2 border-dashed
          rounded-2xl cursor-pointer transition-all
          ${isDragging
            ? "border-amber-400 bg-amber-50"
            : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-zinc-100"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div className="flex flex-col items-center gap-3 text-center px-6">
          <div className="text-4xl">{isDragging ? "📂" : "📄"}</div>
          <div>
            <p className="font-medium text-zinc-700">
              {isDragging ? "Drop it here!" : "Drag & drop your utility bill"}
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              or click to browse · JPG, PNG, PDF · max 10 MB
            </p>
          </div>
        </div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.gif,.webp,.pdf"
          className="hidden"
          onChange={onChange}
          disabled={disabled}
        />
      </label>

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}
