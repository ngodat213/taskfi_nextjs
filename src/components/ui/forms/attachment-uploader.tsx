"use client";

import { Paperclip, File as FileIcon, X, ImageSquare as ImageIcon, Plus } from "@phosphor-icons/react/dist/ssr";
import React, { useState, useRef, useCallback } from "react";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";
import { IssueAttachment } from "@/types/issue.types";

export interface AttachmentUploaderProps {
  value?: File[];
  attachments?: (IssueAttachment | string)[];
  uploaderId?: string;
  onChange?: (files: File[]) => void;
  onAttachmentsChange?: (attachments: IssueAttachment[]) => void;
  onUploadFile?: (file: File) => Promise<IssueAttachment | null>;
  onRemoveAttachment?: (attachment: IssueAttachment | string) => void;
  isUploading?: boolean;
  className?: string;
}

export function AttachmentUploader({
  value = [],
  attachments = [],
  uploaderId = "user",
  onChange,
  onAttachmentsChange,
  onUploadFile,
  onRemoveAttachment,
  isUploading,
  className,
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        onChange?.([...value, ...droppedFiles]);
      }
    },
    [value, onChange],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onChange?.([...value, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  return (
    <div className={cn("flex flex-col gap-3 w-full", className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border/60 hover:border-border hover:bg-muted/30",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <div className="p-2 rounded-full bg-muted text-muted-foreground">
          <Paperclip className="w-4 h-4" />
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Click to upload</span> or drag and drop files
        </div>
      </div>

      {(value.length > 0 || attachments.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((att, idx) => {
            const fileUrl = typeof att === "string" ? att : att.fileUrl;
            const fileName = fileUrl.split("/").pop() || "Attachment";
            return (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/60 text-xs font-medium text-foreground shadow-2xs"
              >
                <FileIcon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate max-w-[150px]">{fileName}</span>
                {onRemoveAttachment && (
                  <button
                    type="button"
                    onClick={() => onRemoveAttachment(att)}
                    className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {value.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/60 text-xs font-medium text-foreground shadow-2xs"
            >
              <FileIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="truncate max-w-[150px]">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(idx)}
                className="p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
