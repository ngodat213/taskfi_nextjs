import { useIssue, useUpdateIssue } from "@/features/projects/hooks/use-issues";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { Issue } from "@/types/issue.types";
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

  const [summary, setSummary] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (issue?.summary) {
      setSummary(issue.summary);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [issue?.summary]);

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
      <div className="flex items-center justify-center h-full min-h-[400px] text-muted-foreground bg-[#F5F5F5]">
        Loading issue details...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-red-500 gap-4 bg-[#F5F5F5]">
        <div>Issue not found.</div>
        <Button variant={ButtonVariant.Outline} onClick={onClose}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full bg-muted/30 w-full animate-in fade-in duration-200 overflow-hidden">
      {/* AI Chatbox Sidebar (Left) */}
      <AiChatSidebar />

      {/* Main Content Area (Right) */}
      <div className="flex-1 h-full py-6 pl-6 pr-0 lg:py-8 lg:pl-6 lg:pr-0 bg-transparent overflow-hidden flex flex-col">
        <div className="flex flex-col gap-6 w-full h-full">
          {/* Main Issue Card */}
          <div className="w-full h-full bg-card rounded-l-xl border border-border flex flex-col overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-5 overflow-y-auto custom-scrollbar flex-1">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground font-medium">
                  <TypeIcon type={issue.type} />
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
