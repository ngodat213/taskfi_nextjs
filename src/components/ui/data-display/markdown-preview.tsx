"use client";

import { useMemo } from "react";

import hljs from "highlight.js";
import { marked } from "marked";

import { renderFormattedCommentContent } from "@/features/issue-detail/utils/comment-user.utils";
import { cn } from "@/utils/cn";

import { MermaidDiagram } from "./mermaid-diagram";

interface MarkdownPreviewProps {
  content?: string | null;
  className?: string;
}

interface ContentChunk {
  type: "html" | "mermaid";
  value: string;
}

// Configure marked parser for Github Flavored Markdown
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Pre-processes code blocks inside Markdown table cells (pipe tables)
 * so that newlines inside ``` code blocks do not break table rows.
 */
function preprocessMarkdownTables(rawContent: string): string {
  if (!rawContent || !rawContent.includes("|")) return rawContent;

  const lines = rawContent.split(/\r?\n/);
  const resultLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.includes("|") && line.includes("```")) {
      const parts = line.split("```");
      if (parts.length >= 3) {
        let newContent = "";
        for (let p = 0; p < parts.length; p++) {
          if (p % 2 === 1) {
            const rawBlock = parts[p];
            const cleanCode = rawBlock
              .replace(/^[\w-]+\s*/, "")
              .replace(/\\n/g, "\n")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
              .trim();

            let highlighted = cleanCode;
            try {
              highlighted = hljs.highlightAuto(cleanCode).value;
            } catch {
              highlighted = cleanCode
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            }

            const htmlCode = highlighted.replace(/\n/g, "<br/>");
            newContent += `<pre class="my-1.5 text-[11px] font-mono p-2 bg-(--hljs-bg,#1e1e1e) text-(--hljs-fg,#d4d4d4) border border-border/60 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed"><code>${htmlCode}</code></pre>`;
          } else {
            newContent += parts[p];
          }
        }
        line = newContent;
      }
    }

    resultLines.push(line);
  }

  return resultLines.join("\n");
}

/**
 * Normalizes text and converts raw Markdown or HTML string into rich formatted HTML
 */
function renderMarkdownToHtml(markdownOrHtml: string): string {
  if (!markdownOrHtml) return "";

  // 1. Preprocess code blocks inside table cells
  const processedText = preprocessMarkdownTables(markdownOrHtml);

  // 2. Normalize any remaining literal '\n' string escapes
  const normalizedText = processedText.replace(/\\n/g, "\n");

  let html: string;
  try {
    html = marked.parse(normalizedText) as string;
  } catch {
    html = normalizedText;
  }

  return renderFormattedCommentContent(html);
}

/**
 * Extracts mermaid code blocks from Markdown or HTML content
 */
function parseContentChunks(rawContent: string): ContentChunk[] {
  if (!rawContent) return [];

  // Preprocess code blocks inside tables first
  const processedContent = preprocessMarkdownTables(rawContent);

  // Normalize literal '\n' string escapes if present from API/JSON strings
  const normalizedContent = processedContent.replace(/\\n/g, "\n");

  if (!normalizedContent.includes("```mermaid")) {
    return [{ type: "html", value: normalizedContent }];
  }

  const chunks: ContentChunk[] = [];
  const parts = normalizedContent.split("```mermaid");

  if (parts[0]) {
    chunks.push({ type: "html", value: parts[0] });
  }

  for (let i = 1; i < parts.length; i++) {
    const subParts = parts[i].split("```");
    const mermaidCode = subParts[0]
      .replace(/<\/?(pre|code)[^>]*>/gi, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (mermaidCode) {
      chunks.push({ type: "mermaid", value: mermaidCode });
    }

    const remainingHtml = subParts.slice(1).join("```");
    if (remainingHtml) {
      chunks.push({ type: "html", value: remainingHtml });
    }
  }

  return chunks;
}

export function MarkdownPreview({ content, className }: MarkdownPreviewProps) {
  const chunks = useMemo(() => {
    if (!content) return [];
    return parseContentChunks(content);
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={cn(
        "markdown-body text-sm text-foreground/90 leading-relaxed font-sans max-w-none wrap-break-word",
        // Typography & Headings
        "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-foreground [&_h1]:border-b [&_h1]:border-border/60 [&_h1]:pb-2",
        "[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h2]:text-foreground [&_h2]:border-b [&_h2]:border-border/40 [&_h2]:pb-1.5",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-foreground",
        "[&_h4]:text-base [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-1.5 [&_h4]:text-foreground",
        // Text Elements
        "[&_p]:mb-3 [&_p]:leading-relaxed",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:font-medium hover:[&_a]:text-primary/80",
        "[&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_em]:italic",
        "[&_hr]:my-4 [&_hr]:border-border/60",
        // Lists
        "[&_ul]:list-disc [&_ul]:ml-5 [&_ul]:mb-3 [&_ul]:space-y-1",
        "[&_ol]:list-decimal [&_ol]:ml-5 [&_ol]:mb-3 [&_ol]:space-y-1",
        "[&_li]:leading-normal",
        // Quotes & Callouts
        "[&_blockquote]:border-l-3 [&_blockquote]:border-primary/60 [&_blockquote]:bg-muted/40 [&_blockquote]:px-3.5 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg [&_blockquote]:my-3 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
        // Code Blocks & Inline Code
        "[&_code]:font-mono [&_code]:text-[12px] [&_code]:bg-muted/70 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-primary",
        "[&_pre]:bg-(--hljs-bg,#1e1e1e) [&_pre]:text-(--hljs-fg,#d4d4d4) [&_pre]:border [&_pre]:border-border/60 [&_pre]:p-3.5 [&_pre]:rounded-xl [&_pre]:my-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
        // Tables
        "[&_table]:w-full [&_table]:my-3 [&_table]:border-collapse [&_table]:border [&_table]:border-border/60 [&_table]:rounded-lg [&_table]:overflow-hidden",
        "[&_th]:bg-muted/60 [&_th]:border [&_th]:border-border/60 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-border/60 [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs",
        className,
      )}
    >
      {chunks.map((chunk, index) => {
        if (chunk.type === "mermaid") {
          return <MermaidDiagram key={index} chart={chunk.value} />;
        }

        const formattedHtml = renderMarkdownToHtml(chunk.value);

        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        );
      })}
    </div>
  );
}
