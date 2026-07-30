"use client";
import {
  CloudArrowUpIcon,
  XIcon,
  FileIcon,
  FolderIcon,
} from "@phosphor-icons/react/dist/ssr";

import React, { useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { InputLabel } from "./input-label";
import { DocumentPickerModal } from "@/features/documents/components/document-picker-modal";
import { DocumentItem } from "@/features/documents/types/documents.types";

export interface FileUploaderProps {
  label?: string;
  value: string[];
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newUrls = files.map((f) => URL.createObjectURL(f));
    onChange([...value, ...newUrls]);
  };

  const handleSelectDocsFromPicker = (selectedDocs: DocumentItem[]) => {
    const newDocTitles = selectedDocs.map((d) => d.title);
    onChange([...value, ...newDocTitles]);
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
      <div className="flex items-center justify-between">
        {label && <InputLabel>{label}</InputLabel>}
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer bg-primary/10 hover:bg-primary/15 px-2 py-0.5 rounded-lg"
        >
          <FolderIcon className="w-3.5 h-3.5" />
          <span>Browse Project Docs</span>
        </button>
      </div>

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
        <CloudArrowUpIcon
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
              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card shadow-2xs"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-foreground truncate">
                  {url.startsWith("blob:") ? `Attachment ${idx + 1}` : url}
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
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <DocumentPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectDocuments={handleSelectDocsFromPicker}
      />
    </div>
  );
}
