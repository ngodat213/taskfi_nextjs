"use client";

import { useEffect, useId, useRef, useState } from "react";

import { useTheme } from "next-themes";

import {
  CheckIcon,
  CodeIcon,
  CopyIcon,
  EyeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/utils/cn";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const rawId = useId().replace(/:/g, "");
  const diagramId = `mermaid-svg-${rawId}`;

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      setIsLoading(true);
      setError(null);

      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = resolvedTheme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
          fontFamily: "var(--font-sans, inherit)",
          sequence: {
            useMaxWidth: false,
            wrap: false,
            showSequenceNumbers: true,
            boxMargin: 15,
            noteMargin: 15,
            messageMargin: 45,
            mirrorActors: true,
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
          themeVariables: isDark
            ? {
                primaryColor: "#3b82f6",
                primaryTextColor: "#f3f4f6",
                primaryBorderColor: "#60a5fa",
                lineColor: "#9ca3af",
                secondaryColor: "#1f2937",
                tertiaryColor: "#111827",
                actorBkg: "#1f2937",
                actorBorder: "#4b5563",
                actorTextColor: "#f3f4f6",
                labelBoxBkgColor: "#1f2937",
                labelBoxBorderColor: "#374151",
                labelTextColor: "#f3f4f6",
                noteBkgColor: "#374151",
                noteBorderColor: "#4b5563",
                noteTextColor: "#f3f4f6",
              }
            : {
                primaryColor: "#2563eb",
                primaryTextColor: "#1f2937",
                primaryBorderColor: "#3b82f6",
                lineColor: "#6b7280",
                secondaryColor: "#f3f4f4",
                tertiaryColor: "#ffffff",
                actorBkg: "#f3f4f6",
                actorBorder: "#d1d5db",
                actorTextColor: "#1f2937",
                labelBoxBkgColor: "#ffffff",
                labelBoxBorderColor: "#e5e7eb",
                labelTextColor: "#1f2937",
                noteBkgColor: "#fef3c7",
                noteBorderColor: "#fde68a",
                noteTextColor: "#92400e",
              },
        });

        // Clean chart definition
        const cleanChart = chart.trim();
        if (!cleanChart) {
          if (isMounted) {
            setIsLoading(false);
            setError("Diagram chart content is empty");
          }
          return;
        }

        const { svg: renderedSvg } = await mermaid.render(
          diagramId,
          cleanChart,
        );

        if (isMounted) {
          setSvg(renderedSvg);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const msg =
            err instanceof Error
              ? err.message
              : "Failed to render Mermaid diagram";
          setError(msg);
          setIsLoading(false);
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [chart, resolvedTheme, diagramId]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(chart);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={cn(
        "my-3 rounded-xl border border-border/80 bg-card overflow-hidden shadow-2xs group transition-all",
        className,
      )}
    >
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-muted/40 text-xs text-muted-foreground font-medium">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
            Diagram (Mermaid)
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title={showCode ? "View Diagram" : "View CodeIcon"}
          >
            {showCode ? (
              <>
                <EyeIcon className="w-3.5 h-3.5" />
                <span>Diagram</span>
              </>
            ) : (
              <>
                <CodeIcon className="w-3.5 h-3.5" />
                <span>CodeIcon</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="CopyIcon Mermaid CodeIcon"
          >
            {copied ? (
              <>
                <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="w-3.5 h-3.5" />
                <span>CopyIcon</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 overflow-x-auto min-h-25 flex items-center justify-center">
        {showCode ? (
          <pre className="w-full text-xs font-mono p-3 bg-muted/50 rounded-lg text-foreground/90 overflow-x-auto border border-border/40">
            <code>{chart}</code>
          </pre>
        ) : isLoading ? (
          <div className="py-6 flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Rendering diagram...</span>
          </div>
        ) : error ? (
          <div className="py-4 px-3 w-full flex items-start gap-2 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
            <WarningCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 flex flex-col gap-1">
              <span className="font-semibold">Mermaid Syntax Error</span>
              <pre className="text-[11px] font-mono whitespace-pre-wrap opacity-90">
                {error}
              </pre>
            </div>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="mermaid-svg-container w-full overflow-x-auto flex justify-center py-2 [&_svg]:max-w-none [&_svg]:h-auto [&_svg]:mx-auto [&_foreignObject]:overflow-visible [&_foreignObject_div]:w-max [&_foreignObject_div]:max-w-none [&_foreignObject_div]:whitespace-nowrap [&_.labelText]:whitespace-nowrap [&_.labelBox]:overflow-visible"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </div>
  );
}
