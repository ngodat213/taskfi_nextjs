import { AlertCircle, ChevronUp, Equal, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/data-display/badge";
import { Issue } from "@/types/issue.types";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";

interface TaskCardProps {
  issue: Issue;
  onIssueClick?: (issueId: string) => void;
}

export function TaskCard({ issue, onIssueClick }: TaskCardProps) {
  const displayId = issue.issueKey || issue.id || "";
  const type = (issue.type || "task").toLowerCase();
  const priority = issue.priority || "Medium";
  const assigneeDisplay = issue.assigneeId
    ? issue.assigneeId.substring(0, 2).toUpperCase()
    : "UN";

  return (
    <div 
      className="bg-card p-2.5 rounded-lg border border-border/80 hover:border-border hover:shadow-sm cursor-pointer group transition-all"
      onClick={() => onIssueClick && onIssueClick(issue.id)}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <TypeIcon type={type as Issue["type"]} className="w-4 h-4" />
          <span className="text-[12.5px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
            {displayId}
          </span>
        </div>
        <Badge
          variant={
            type === "story"
              ? "emerald"
              : type === "task"
                ? "blue"
                : type === "bug"
                  ? "red"
                  : "slate"
          }
          className="capitalize"
        >
          {type}
        </Badge>
      </div>

      <p className="text-[12.5px] text-foreground font-medium leading-snug mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {issue.summary}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <Badge
          variant={
            priority === "Critical"
              ? "red"
              : priority === "High"
                ? "orange"
                : priority === "Medium"
                  ? "amber"
                  : "blue"
          }
        >
          {priority === "Critical" && <AlertCircle className="w-3 h-3" />}
          {priority === "High" && <ChevronUp className="w-3 h-3" />}
          {priority === "Medium" && <Equal className="w-3 h-3" />}
          {priority === "Low" && <ChevronDown className="w-3 h-3" />}
          {priority}
        </Badge>

        <div className="w-5 h-5 rounded-full bg-secondary border border-border flex items-center justify-center text-[8.5px] font-bold text-muted-foreground overflow-hidden">
          {assigneeDisplay}
        </div>
      </div>
    </div>
  );
}
