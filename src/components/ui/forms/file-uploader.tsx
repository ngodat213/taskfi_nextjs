"use client";
import { CloudArrowUp, X, File as FileIcon } from "@phosphor-icons/react/dist/ssr";

import React, { useRef, useState } from "react";
;
import { cn } from "@/utils/cn";
import { InputLabel } from "./input-label";

export interface FileUploaderProps {
  label?: string;
  value: string[]; // URLs or file names
  onChange: (urls: string[]) => void;
  className?: string;
}

export function FileUploader({
  label,
  value,
  onChange,
  className,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    // In a real app, you would upload these files to a server here
    // and get back the URLs. We will mock the URLs with file names for now.
    const newUrls = files.map((f) => URL.createObjectURL(f));
    onChange([...value, ...newUrls]);
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && <InputLabel>{label}</InputLabel>}

      <div
        className={cn(
          "w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-border bg-muted/50 hover:bg-muted hover:border-slate-400",
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <CloudArrowUp
          className={cn(
            "w-8 h-8",
            isDragging ? "text-blue-500" : "text-muted-foreground",
          )}
        />
        <div className="text-sm font-medium text-foreground">
          Drag and drop files here
        </div>
        <div className="text-xs text-muted-foreground">
          or click to browse from your computer
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleFileChange}
        />
      </div>

      {value.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          {value.map((url, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <FileIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-foreground truncate">
                  Attachment {idx + 1}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(url);
                }}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
