"use client";

import { useState } from "react";
import { FileIcon as FileIcon, ImageSquareIcon as ImageIcon, ArrowSquareOutIcon, FileTextIcon as MarkdownIcon, EyeIcon } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { DeleteButton } from "@/components/ui/actions/delete-button";
import { cn } from "@/utils/cn";
import { IssueAttachment } from "@/types/issue.types";
import {
  getCloudinaryUrl,
  formatBytes,
  getFileNameFromUrl,
  isImageUrl,
} from "@/utils/cloudinary";
import { MarkdownPreviewModal } from "@/components/ui/data-display/markdown-preview-modal";

export interface AttachmentCardProps {
  item: IssueAttachment | string;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  className?: string;
}

function isMarkdownFile(name: string): boolean {
  const lower = (name || "").toLowerCase();
  return lower.endsWith(".md") || lower.endsWith(".markdown");
}

export function AttachmentCard({
  item,
  onRemove,
  showRemoveButton = true,
  className,
}: AttachmentCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const rawUrl =
    typeof item === "string"
      ? item
      : item.fileUrl ||
        (item as unknown as Record<string, string>).file_url ||
        "";
  const fileUrl = getCloudinaryUrl(rawUrl) || rawUrl;
  const fileSize =
    typeof item === "object"
      ? item.fileSize || (item as unknown as Record<string, number>).file_size
      : undefined;

  if (!fileUrl) return null;

  const originalName =
    typeof item === "object"
      ? item.originalName || item.original_name || item.name
      : undefined;

  const fileName = originalName || getFileNameFromUrl(fileUrl);
  const isImage = isImageUrl(fileUrl);
  const isMd = isMarkdownFile(fileName);

  const handleClick = (e: React.MouseEvent) => {
    if (isMd) {
      e.preventDefault();
      setIsPreviewOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/60 group hover:border-primary/50 transition-colors",
          className,
        )}
      >
        <a
          href={fileUrl}
          target={isMd ? undefined : "_blank"}
          rel={isMd ? undefined : "noopener noreferrer"}
          onClick={handleClick}
          className="flex items-center gap-3 overflow-hidden flex-1 pr-2 cursor-pointer"
        >
          <div
            className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
              isMd
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-primary/10 text-primary",
            )}
          >
            {isMd ? (
              <MarkdownIcon className="w-4 h-4 text-primary" />
            ) : isImage ? (
              <ImageIcon className="w-4 h-4 text-primary" />
            ) : (
              <FileIcon className="w-4 h-4 text-primary" />
            )}
          </div>
          <div className="flex flex-col overflow-hidden w-full">
            <span className="text-[12px] font-medium text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-1">
              {fileName}
              {!isMd && (
                <ArrowSquareOutIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              )}
            </span>
            {fileSize && (
              <span className="text-[10px] text-muted-foreground">
                {formatBytes(fileSize)}
              </span>
            )}
          </div>
        </a>

        {/* Action Buttons: Preview EyeIcon + Animated 2-Step Delete Button */}
        <div className="flex items-center gap-1 shrink-0">
          {isMd && (
            <Button
              type="button"
              variant={ButtonVariant.Ghost}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              title="Preview Markdown"
            >
              <EyeIcon className="w-3.5 h-3.5" />
            </Button>
          )}

          {showRemoveButton && onRemove && (
            <DeleteButton onDelete={onRemove} title="Delete Attachment" />
          )}
        </div>
      </div>

      {isMd && (
        <MarkdownPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileName={fileName}
          fileUrl={fileUrl}
        />
      )}
    </>
  );
}

export interface LocalFileCardProps {
  file: File;
  onRemove?: () => void;
  className?: string;
}

export function LocalFileCard({
  file,
  onRemove,
  className,
}: LocalFileCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isImage = file.type.startsWith("image/");
  const extension = file.name.split(".").pop();
  const isMd = isMarkdownFile(file.name);

  const handleClick = () => {
    if (isMd) {
      setIsPreviewOpen(true);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between p-2.5 bg-muted/50 rounded-lg border border-border/60 group hover:border-primary/50 transition-colors",
          className,
        )}
      >
        <div
          onClick={handleClick}
          className={cn(
            "flex items-center gap-3 overflow-hidden flex-1 pr-2",
            isMd && "cursor-pointer",
          )}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
              isMd
                ? "bg-primary/15 text-primary border border-primary/20"
                : "bg-blue-50 text-blue-500",
            )}
          >
            {isMd ? (
              <MarkdownIcon className="w-4 h-4 text-primary" />
            ) : isImage ? (
              <ImageIcon className="w-4 h-4 text-blue-500" />
            ) : (
              <FileIcon className="w-4 h-4 text-blue-500" />
            )}
          </div>
          <div className="flex flex-col overflow-hidden w-full">
            <span
              className={cn(
                "text-[12px] font-medium text-foreground truncate flex items-center gap-1",
                isMd && "group-hover:text-primary transition-colors",
              )}
            >
              {file.name}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span>{formatBytes(file.size)}</span>
              {extension && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border" />
                  <span className="uppercase">{extension}</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Action Buttons: Preview EyeIcon + Animated 2-Step Delete Button */}
        <div className="flex items-center gap-1 shrink-0">
          {isMd && (
            <Button
              type="button"
              variant={ButtonVariant.Ghost}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsPreviewOpen(true);
              }}
              title="Preview Markdown"
            >
              <EyeIcon className="w-3.5 h-3.5" />
            </Button>
          )}

          {onRemove && (
            <DeleteButton onDelete={onRemove} title="Delete Attachment" />
          )}
        </div>
      </div>

      {isMd && (
        <MarkdownPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          fileName={file.name}
          file={file}
        />
      )}
    </>
  );
}
