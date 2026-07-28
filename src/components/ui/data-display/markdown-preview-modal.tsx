"use client";

import { useEffect, useState } from "react";
import { FileTextIcon, DownloadSimpleIcon, CircleNotchIcon, WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalScrollArea,
} from "@/components/ui/layout/modal";
import { MarkdownPreview } from "./markdown-preview";
import { Button, ButtonVariant } from "@/components/ui/actions/button";

interface MarkdownPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileUrl?: string;
  file?: File;
}

async function fetchMarkdownSource(
  file?: File,
  fileUrl?: string,
): Promise<string> {
  if (file) return await file.text();
  if (fileUrl) {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.text();
  }
  throw new Error("No file or URL provided");
}

export function MarkdownPreviewModal({
  isOpen,
  onClose,
  fileName,
  fileUrl,
  file,
}: MarkdownPreviewModalProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function loadMarkdownContent() {
      if (isMounted) {
        setIsLoading(true);
        setError(null);
        setContent("");
      }

      try {
        const text = await fetchMarkdownSource(file, fileUrl);
        if (isMounted) {
          setContent(text);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Failed to load Markdown file";
          setError(msg);
          setIsLoading(false);
        }
      }
    }

    loadMarkdownContent();

    return () => {
      isMounted = false;
    };
  }, [isOpen, fileUrl, file]);

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else if (content) {
      const blob = new Blob([content], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "preview.md";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent maxWidth="max-w-4xl">
        <ModalHeader
          title={fileName || "Markdown Preview"}
          icon={<FileTextIcon className="w-4 h-4 text-primary" />}
        />

        <ModalBody>
          <ModalScrollArea
            title={
              <div className="flex items-center justify-between gap-4 w-full">
                <span className="text-base font-semibold truncate">
                  {fileName}
                </span>
                <Button
                  type="button"
                  variant={ButtonVariant.Outline}
                  onClick={handleDownload}
                  className="h-8 px-3 text-xs gap-1.5 shrink-0"
                >
                  <DownloadSimpleIcon className="w-3.5 h-3.5" />
                  <span>Download</span>
                </Button>
              </div>
            }
            className="max-h-[80vh] min-h-60"
          >
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
                <CircleNotchIcon className="w-6 h-6 animate-spin text-primary" />
                <span>Loading Markdown preview...</span>
              </div>
            ) : error ? (
              <div className="py-6 px-4 flex items-start gap-2.5 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
                <WarningCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Failed to load preview</span>
                  <span>{error}</span>
                </div>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownPreview content={content} />
              </div>
            )}
          </ModalScrollArea>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
