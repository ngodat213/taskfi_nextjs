import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { cn } from "@/utils/cn";

interface IssueSummaryInputProps {
  initialSummary: string;
  onUpdateSummary: (newSummary: string) => void;
  errorMessage?: string;
  isDone?: boolean;
}

export function IssueSummaryInput({
  initialSummary,
  onUpdateSummary,
  errorMessage,
  isDone = false,
}: IssueSummaryInputProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [prevInitialSummary, setPrevInitialSummary] = useState(initialSummary);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (initialSummary !== prevInitialSummary) {
    setPrevInitialSummary(initialSummary);
    setSummary(initialSummary);
  }

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [summary]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
  };

  const handleBlur = () => {
    const trimmed = summary.trim();
    if (trimmed !== initialSummary && trimmed !== "") {
      onUpdateSummary(trimmed);
    } else {
      setSummary(initialSummary);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current?.blur();
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={summary}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={1}
        className={cn(
          "w-full text-xl md:text-2xl font-bold leading-tight bg-transparent border-none outline-none resize-none overflow-hidden p-0 m-0 focus:ring-0 transition-colors",
          isDone ? "line-through text-muted-foreground" : "text-foreground",
        )}
        spellCheck={false}
      />
      <ErrorTooltip message={errorMessage} />
    </div>
  );
}
