import React, { useState } from "react";
import {
  CheckIcon,
  CaretRightIcon,
  CircleNotchIcon,
  XCircleIcon,
  SparkleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AgentStep, IssueFormDraft } from "@/features/ai-assistant/types/ai-chat.types";
import { MarkdownPreview } from "@/components/ui/data-display/markdown-preview";
import {
  StatusBadge,
  TypeIcon,
} from "@/features/dashboard/components/issue-table-row";
import { PriorityBadge } from "@/components/ui/data-display/priority-badge";
import { Issue } from "@/types/issue.types";

interface AgentStreamViewProps {
  steps: AgentStep[];
  streamedText: string;
  formDraft: IssueFormDraft | null;
  onApplyForm?: (draft: IssueFormDraft) => void;
}

export function AgentStreamView({
  steps,
  streamedText,
  formDraft,
  onApplyForm,
}: AgentStreamViewProps) {
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);

  if (steps.length === 0 && !streamedText && !formDraft) {
    return null;
  }

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const isRunning = steps.some((s) => s.status === "running");

  return (
    <div className="flex flex-col gap-3 max-w-full font-sans text-foreground text-sm leading-relaxed">
      {/* 🔹 1. AGENT THINKING STEPS (Collapsible Actions Dropdown) */}
      {steps.length > 0 && (
        <div className="flex flex-col gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsActionsExpanded(!isActionsExpanded)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted border border-border/50 px-3 py-1.5 rounded-full transition-all cursor-pointer w-fit shadow-xs"
          >
            {isRunning ? (
              <CircleNotchIcon className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
            ) : (
              <CheckIcon
                className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                weight="bold"
              />
            )}
            <span className="font-semibold text-[12px] text-foreground">
              {isRunning
                ? `Processing ${steps.length} actions...`
                : `Completed ${completedCount} actions`}
            </span>
            <CaretRightIcon
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                isActionsExpanded ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Expanded Steps List */}
          {isActionsExpanded && (
            <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-border/60 ml-2 py-1">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col">
                  <div className="flex items-center gap-2 text-muted-foreground py-0.5">
                    {step.status === "completed" ? (
                      <CheckIcon
                        className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                        weight="bold"
                      />
                    ) : step.status === "failed" ? (
                      <XCircleIcon
                        className="w-3.5 h-3.5 text-red-500 shrink-0"
                        weight="bold"
                      />
                    ) : (
                      <CircleNotchIcon className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                    )}
                    <span className="font-medium text-[12px] text-foreground flex-1">
                      {step.title}
                    </span>
                  </div>
                  {step.message && (
                    <div className="pl-5 text-[11.5px] text-muted-foreground">
                      {step.message}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 🔹 2. STREAMING / REPLY TEXT CONTENT */}
      {streamedText && (
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {streamedText}
        </div>
      )}

      {/* 🔹 3. DRAFT METADATA & MARKDOWN DESCRIPTION */}
      {formDraft && (
        <div className="flex flex-col gap-3 max-w-full my-1">
          {/* Title & Badges Header */}
          {formDraft.summary && (
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-base text-foreground leading-snug">
                {formDraft.summary}
              </h3>

              <div className="flex items-center flex-wrap gap-2 text-xs">
                {formDraft.type && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium text-[11px] border border-border/60">
                    <TypeIcon
                      type={formDraft.type as Issue["type"]}
                      className="w-3.5 h-3.5"
                    />
                    <span className="capitalize">{formDraft.type}</span>
                  </span>
                )}

                {formDraft.status && <StatusBadge status={formDraft.status} />}

                {formDraft.priority && (
                  <PriorityBadge
                    priority={formDraft.priority as Issue["priority"]}
                  />
                )}

                {formDraft.storyPoints !== undefined && (
                  <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[11px] font-medium border border-border/50">
                    {formDraft.storyPoints} PTS
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Description Rendered via MarkdownPreview */}
          {formDraft.description && (
            <div className="text-sm text-foreground leading-relaxed bg-muted/30 p-3.5 rounded-2xl border border-border/50 my-1">
              <MarkdownPreview content={formDraft.description} />
            </div>
          )}
        </div>
      )}

      {/* 🔹 4. GENERATED ISSUE DRAFT CARD */}
      {formDraft && (
        <div className="bg-muted/80 text-foreground text-[13.5px] p-4 rounded-[20px] rounded-tl-xs w-full max-w-sm sm:max-w-md leading-relaxed border border-border/60 flex flex-col gap-2.5 shadow-xs relative overflow-hidden">
          {/* Header Card */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground/80 uppercase tracking-wider flex items-center gap-1">
              ✨ Generated Issue Draft
            </span>
          </div>

          {/* Action Button */}
          {onApplyForm && (
            <button
              type="button"
              onClick={() => onApplyForm(formDraft)}
              className="w-full py-2 bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] font-semibold text-xs rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer mt-0.5"
            >
              <SparkleIcon className="w-3.5 h-3.5" weight="fill" />
              Apply to Issue Form
            </button>
          )}
        </div>
      )}
    </div>
  );
}
