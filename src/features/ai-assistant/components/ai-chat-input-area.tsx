import React from "react";

import {
  ArrowUpIcon,
  AtIcon,
  BugIcon,
  CaretDownIcon,
  FadersIcon,
  LightbulbIcon,
  LightningIcon,
  MicrophoneIcon,
  PlusIcon,
  SparkleIcon,
  SquareIcon,
} from "@phosphor-icons/react";

import { cn } from "@/utils/cn";

interface AiChatInputAreaProps {
  inputText: string;
  onChangeInputText: (text: string) => void;
  onSendMessage: () => void;
  onSendMessageWithText: (text: string) => void;
  isLoading: boolean;
  isCentered?: boolean;
}

export function AiChatInputArea({
  inputText,
  onChangeInputText,
  onSendMessage,
  onSendMessageWithText,
  isLoading,
  isCentered = false,
}: AiChatInputAreaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // 🔹 Dynamically auto-expand textarea height based on content scrollHeight
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const minH = isCentered ? 64 : 44;
    const maxH = isCentered ? 200 : 140;

    const calculatedHeight = Math.min(
      Math.max(textarea.scrollHeight, minH),
      maxH,
    );
    textarea.style.height = `${calculatedHeight}px`;
  }, [inputText, isCentered]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div
      className={cn(
        "w-full transition-all",
        isCentered ? "max-w-xl" : "pt-2 shrink-0 bg-transparent",
      )}
    >
      <div className="border border-border/80 rounded-3xl bg-card p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-slate-200/50 focus-within:border-slate-300 transition-all">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => onChangeInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What should we work on?"
          className={cn(
            "w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground px-3 py-2 resize-none focus:outline-none overflow-y-auto hide-scrollbar transition-[height] duration-150 ease-out",
            isCentered ? "min-h-16 max-h-50" : "min-h-11 max-h-35",
          )}
          rows={1}
        />

        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <AtIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <MicrophoneIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <SquareIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              Auto <CaretDownIcon className="w-3 h-3" />
            </button>
            <button
              type="button"
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <FadersIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-primary text-primary-foreground rounded-full p-1.5 ml-1 transition-all hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Pills below Centered Input */}
      {isCentered && (
        <div className="flex flex-wrap gap-2 w-full justify-center mt-3">
          <button
            type="button"
            onClick={() =>
              onSendMessageWithText(
                "Create a Folio for me with modern design, charts, AI images and Q1 overview data",
              )
            }
            className="bg-card hover:bg-muted text-foreground text-[12px] font-medium px-3 py-1.5 rounded-xl border border-border/60 transition-all cursor-pointer flex items-center gap-1.5 hover:border-border shadow-2xs"
          >
            <SparkleIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Create Folio / Report</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onSendMessageWithText(
                "Add detailed acceptance criteria and technical specifications for this task",
              )
            }
            className="bg-card hover:bg-muted text-foreground text-[12px] font-medium px-3 py-1.5 rounded-xl border border-border/60 transition-all cursor-pointer flex items-center gap-1.5 hover:border-border shadow-2xs"
          >
            <LightbulbIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Refine Requirements</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onSendMessageWithText(
                "Break down this issue into actionable subtasks with estimated story points",
              )
            }
            className="bg-card hover:bg-muted text-foreground text-[12px] font-medium px-3 py-1.5 rounded-xl border border-border/60 transition-all cursor-pointer flex items-center gap-1.5 hover:border-border shadow-2xs"
          >
            <LightningIcon className="w-3.5 h-3.5 text-blue-400" />
            <span>Break Down Subtasks</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onSendMessageWithText(
                "Draft a detailed bug report for authentication state sync issue",
              )
            }
            className="bg-card hover:bg-muted text-foreground text-[12px] font-medium px-3 py-1.5 rounded-xl border border-border/60 transition-all cursor-pointer flex items-center gap-1.5 hover:border-border shadow-2xs"
          >
            <BugIcon className="w-3.5 h-3.5 text-red-400" />
            <span>Draft Bug Report</span>
          </button>
        </div>
      )}
    </div>
  );
}
