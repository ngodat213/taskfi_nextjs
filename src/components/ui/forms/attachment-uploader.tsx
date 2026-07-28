"use client";

import { PaperclipIcon, CircleNotchIcon } from "@phosphor-icons/react/dist/ssr";
import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/utils/cn";
import { IssueAttachment } from "@/types/issue.types";
import { AttachmentCard, LocalFileCard } from "./attachment-card";
import { useUploadImage } from "@/hooks/use-upload";
import { extractApiError } from "@/utils/error";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";

export interface AttachmentUploaderProps {
  label?: string;
  value?: File[];
  attachments?: (IssueAttachment | string)[];
  uploaderId?: string;
  onChange?: (files: File[]) => void;
  onAttachmentsChange?: (attachments: IssueAttachment[]) => void;
  onUploadFile?: (file: File) => Promise<IssueAttachment | null>;
  onRemoveAttachment?: (attachment: IssueAttachment | string) => void;
  isUploading?: boolean;
  error?: string;
  className?: string;
}

export function AttachmentUploader({
  label = "Attachments",
  value = [],
  attachments = [],
  uploaderId,
  onChange,
  onAttachmentsChange,
  onUploadFile,
  onRemoveAttachment,
  isUploading: externalIsUploading,
  error,
  className,
}: AttachmentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [internalIsUploading, setInternalIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadImage();
  const isUploading =
    externalIsUploading || internalIsUploading || uploadMutation.isPending;
  const validUploaderId =
    uploaderId && uploaderId.length === 24 ? uploaderId : undefined;

  const uploadSingleFile = useCallback(
    async (file: File): Promise<IssueAttachment | null> => {
      if (onUploadFile) {
        return onUploadFile(file);
      }
      const res = await uploadMutation.mutateAsync(file);
      if (!res?.data?.url) return null;

      return {
        fileUrl: res.data.url,
        fileSize: res.data.bytes || file.size,
        publicId: res.data.publicId,
        public_id: res.data.publicId,
        originalName: file.name,
        original_name: file.name,
        name: file.name,
        ...(validUploaderId ? { uploaderId: validUploaderId } : {}),
      };
    },
    [onUploadFile, uploadMutation, validUploaderId],
  );

  const processFileUploads = useCallback(
    async (filesToUpload: File[]) => {
      if (filesToUpload.length === 0) return;
      setInternalIsUploading(true);
      setUploadError(null);

      try {
        const uploadPromises = filesToUpload.map((f) => uploadSingleFile(f));
        const results = await Promise.all(uploadPromises);
        const newUploaded = results.filter(
          (res): res is IssueAttachment => res !== null,
        );

        if (newUploaded.length > 0) {
          const currentList: IssueAttachment[] = attachments.map((a) =>
            typeof a === "string"
              ? ({
                  fileUrl: a,
                  fileSize: 0,
                  ...(validUploaderId ? { uploaderId: validUploaderId } : {}),
                } as IssueAttachment)
              : a,
          );
          onAttachmentsChange?.([...currentList, ...newUploaded]);
        }

        onChange?.([]);
      } catch (err: unknown) {
        const { message } = extractApiError(err);
        setUploadError(message || "Failed to upload file");
        console.error("Failed to upload attachment:", err);
      } finally {
        setInternalIsUploading(false);
      }
    },
    [
      attachments,
      onAttachmentsChange,
      onChange,
      uploadSingleFile,
      validUploaderId,
    ],
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
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        processFileUploads(droppedFiles);
      }
    },
    [processFileUploads],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      processFileUploads(selectedFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange?.(newFiles);
  };

  const displayError = uploadError || error;

  return (
    <div className={cn("flex flex-col gap-1.5 w-full relative", className)}>
      {label && (
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </h3>
      )}

      <div className="flex flex-col gap-3 w-full">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border/60 hover:border-border hover:bg-muted/30",
            isUploading && "opacity-70 cursor-not-allowed",
            displayError && "border-red-500/60 bg-red-500/5",
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.md,.markdown"
            disabled={isUploading}
            className="hidden"
            onChange={handleFileSelect}
          />

          {isUploading ? (
            <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
              <CircleNotchIcon className="w-4 h-4 animate-spin text-primary" />
              <span>Uploading file...</span>
            </div>
          ) : (
            <>
              <div className="p-2 rounded-full bg-muted text-muted-foreground">
                <PaperclipIcon className="w-4 h-4" />
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Click to upload
                </span>{" "}
                or drag and drop files (Images, PDFs, .MD, Docs)
              </div>
            </>
          )}
        </div>

        <ErrorTooltip message={displayError || undefined} />

        {(value.length > 0 || attachments.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {attachments.map((att, idx) => {
              const attObj =
                typeof att === "object"
                  ? (att as unknown as Record<string, string | number>)
                  : null;
              const cardKey =
                typeof att === "string"
                  ? att
                  : (attObj?.publicId as string) ||
                    (attObj?.public_id as string) ||
                    (attObj?.id as string) ||
                    att.fileUrl ||
                    att.originalName ||
                    `att-${idx}`;
              return (
                <AttachmentCard
                  key={cardKey}
                  item={att}
                  onRemove={
                    onRemoveAttachment
                      ? () => onRemoveAttachment(att)
                      : undefined
                  }
                  showRemoveButton={!!onRemoveAttachment}
                />
              );
            })}

            {value.map((file, idx) => {
              const localKey = `${file.name}-${file.size}-${file.lastModified}-${idx}`;
              return (
                <LocalFileCard
                  key={localKey}
                  file={file}
                  onRemove={() => removeFile(idx)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
