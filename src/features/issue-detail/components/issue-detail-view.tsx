import { useIssue, useUpdateIssue } from "@/features/projects/hooks/use-issues";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { Issue, IssueType } from "@/types/issue.types";
import { Button, ButtonVariant } from "@/components/ui/actions/button";
import { AiChatSidebar } from "./ai-chat-sidebar";
import { IssueMainContent } from "./issue-main-content";
import { IssueProperties } from "./issue-properties";
import { useState, useEffect, useRef } from "react";

interface IssueDetailViewProps {
  projectId: string;
  issueId: string;
  onClose: () => void;
}

export function IssueDetailView({
  projectId,
  issueId,
  onClose,
}: IssueDetailViewProps) {
  const { data: issueResponse, isLoading } = useIssue(projectId, issueId);
  const issue = issueResponse?.data;
  const updateIssue = useUpdateIssue();

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        typeDropdownRef.current &&
        !typeDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTypeDropdownOpen(false);
      }
    };
    if (isTypeDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isTypeDropdownOpen]);

  const [summary, setSummary] = useState(issue?.summary || "");
  const [prevIssueSummary, setPrevIssueSummary] = useState(issue?.summary);

  if (issue?.summary !== prevIssueSummary) {
    setPrevIssueSummary(issue?.summary);
    setSummary(issue?.summary || "");
  }

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [summary]);

  const handleSummaryBlur = () => {
    if (summary !== issue?.summary && summary.trim() !== "") {
      handleUpdate("summary", summary.trim());
    } else {
      setSummary(issue?.summary || "");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current?.blur();
    }
  };

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSummary(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleUpdate = (field: keyof Issue, value: unknown) => {
    if (!issue) return;
    updateIssue.mutate({
      projectId,
      issueId: issue.id,
      data: { [field]: value } as Partial<Issue>,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground bg-transparent">
        Loading issue details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4 bg-transparent">
        <div>Issue not found.</div>
        <Button variant={ButtonVariant.Outline} onClick={onClose}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full bg-transparent w-full animate-in fade-in duration-200 overflow-hidden">
      {/* AI Chatbox Sidebar (Left) */}
      <AiChatSidebar />

      {/* Main Content Area (Right) */}
      <div className="flex-1 h-full py-6 pl-6 pr-0 lg:py-8 lg:pl-6 lg:pr-0 bg-transparent overflow-hidden flex flex-col">
        <div className="flex flex-col gap-6 w-full h-full">
          {/* Main Issue Card */}
          <div className="w-full h-full bg-card/60 backdrop-blur-md rounded-l-xl border border-border/50 flex flex-col overflow-hidden shadow-sm">
            <div className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto custom-scrollbar flex-1">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-medium">
                  <div className="relative" ref={typeDropdownRef}>
                    <button
                      onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                      className="flex items-center gap-1.5 hover:bg-muted px-2 py-1 -ml-2 rounded-md transition-colors border border-transparent hover:border-border/50"
                    >
                      <TypeIcon
                        type={issue.type as IssueType}
                        className="w-4 h-4 shrink-0"
                      />
                      <span className="capitalize">
                        {issue.type.toLowerCase()}
                      </span>
                    </button>

                    {isTypeDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-[140px] bg-card border border-border rounded-lg shadow-lg z-50 flex flex-col py-1.5 animate-in fade-in zoom-in-95 duration-100">
                        {["EPIC", "STORY", "TASK", "SUBTASK", "BUG"].map(
                          (type) => (
                            <button
                              key={type}
                              onClick={() => {
                                handleUpdate("type", type);
                                setIsTypeDropdownOpen(false);
                              }}
                              className={`flex items-center gap-2.5 px-3 py-1.5 text-[12px] hover:bg-muted text-left w-full transition-colors ${
                                issue.type === type
                                  ? "bg-muted/50 font-semibold"
                                  : ""
                              }`}
                            >
                              <TypeIcon
                                type={type as IssueType}
                                className="w-4 h-4 shrink-0"
                              />
                              <span className="capitalize">
                                {type.toLowerCase()}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-muted-foreground/40 text-[10px] mx-0.5">
                    •
                  </span>
                  <span>{issue.issueKey}</span>
                </div>
                <textarea
                  ref={textareaRef}
                  value={summary}
                  onChange={handleSummaryChange}
                  onBlur={handleSummaryBlur}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className="w-full text-xl md:text-2xl font-bold text-foreground leading-tight bg-transparent border-none outline-none resize-none overflow-hidden p-0 m-0 focus:ring-0"
                  spellCheck={false}
                />
              </div>
              {/* Main Grid */}
              <div className="flex flex-col-reverse 2xl:flex-row gap-5 2xl:gap-12 w-full">
                <IssueMainContent
                  issue={issue}
                  projectId={projectId}
                  onUpdate={handleUpdate}
                />

                <div className="w-full 2xl:w-[300px] shrink-0">
                  <IssueProperties issue={issue} onUpdate={handleUpdate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
