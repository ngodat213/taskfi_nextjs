import { Paperclip, File as FileIcon, X, ImageSquare as ImageIcon, Plus } from "@phosphor-icons/react/dist/ssr";
import React, { useState, useRef, useCallback } from "react";
;
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";

export interface AttachmentUploaderProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  className?: string;
}

export function AttachmentUploader({
  value = [],
  onChange,
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

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const selectedFiles = Array.from(e.target.files);
        onChange?.([...value, ...selectedFiles]);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [value, onChange],
  );

  const removeAttachment = useCallback(
    (indexToRemove: number) => {
      onChange?.(value.filter((_, idx) => idx !== indexToRemove));
    },
    [value, onChange],
  );

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-1.5">
        <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Attachments {value.length > 0 && `(${value.length})`}
        </h3>
        <Button
          variant={ButtonVariant.Ghost}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-slate-800 hover:bg-secondary rounded-md"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />

      {value.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {value.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/60 group"
            >
              <div className="flex items-center gap-3 overflow-hidden flex-1 pr-2">
                <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center shrink-0">
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                  ) : (
                    <FileIcon className="w-4 h-4 text-blue-500" />
                  )}
                </div>
                <div className="flex flex-col overflow-hidden w-full">
                  <span className="text-[12px] font-medium text-foreground truncate">
                    {file.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="uppercase">
                      {file.name.split(".").pop()}
                    </span>
                  </span>
                </div>
              </div>
              <Button
                variant={ButtonVariant.Ghost}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeAttachment(idx)}
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex items-center justify-center p-4 rounded-lg border border-dashed transition-colors cursor-pointer text-[12px]",
          isDragging
            ? "bg-blue-50/50 border-blue-400 text-blue-600"
            : "bg-muted/50 border-border text-muted-foreground hover:bg-muted",
        )}
      >
        <div className="flex flex-col items-center gap-1.5 pointer-events-none text-center">
          <Paperclip
            className={cn(
              "w-4 h-4",
              isDragging ? "text-blue-500" : "text-muted-foreground",
            )}
          />
          <div className="flex flex-col gap-0.5">
            <span>
              Drop files here or{" "}
              <span className="text-blue-600 hover:underline">
                click to browse
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground">
              Maximum file size 10MB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
