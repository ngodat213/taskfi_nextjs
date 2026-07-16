import { AlertCircle, ChevronUp, Equal, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/data-display/badge";
import { Issue } from "@/types/issue.types";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";

interface TaskCardProps {
  issue: Issue;
}

export function TaskCard({ issue }: TaskCardProps) {
  const displayId = issue.issueKey || issue.id || "";
  const type = (issue.type || "task").toLowerCase();
  const priority = issue.priority || "Medium";
  const assigneeDisplay = issue.assigneeId
    ? issue.assigneeId.substring(0, 2).toUpperCase()
    : "UN";

  return (
    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:shadow-sm cursor-pointer group transition-all">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <TypeIcon type={type as Issue["type"]} className="w-4 h-4" />
          <span className="text-[12.5px] font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
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

      <p className="text-[12.5px] text-slate-800 font-medium leading-snug mb-2.5 group-hover:text-blue-600 transition-colors">
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

        <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8.5px] font-bold text-slate-600 overflow-hidden">
          {assigneeDisplay}
        </div>
      </div>
    </div>
  );
}
