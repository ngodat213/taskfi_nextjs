import {
  AlertCircle,
  ChevronUp,
  Equal,
  ChevronDown,
  Bookmark,
  CheckSquare,
  CornerDownRight,
  BugIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DashboardIssue {
  id: string;
  summary: string;
  type: string;
  priority: string;
  assignee: string;
}

interface TaskCardProps {
  issue: DashboardIssue;
}

export function TaskCard({ issue }: TaskCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg border border-slate-200/80 hover:border-slate-300 hover:shadow-sm cursor-pointer group transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {issue.type === "story" && (
            <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500" />
          )}
          {issue.type === "task" && (
            <CheckSquare className="w-4 h-4 text-blue-500 fill-blue-50" />
          )}
          {issue.type === "subtask" && (
            <CornerDownRight className="w-4 h-4 text-slate-400" />
          )}
          {issue.type === "bug" && <BugIcon className="w-4 h-4 text-red-500" />}
          <span className="text-[12.5px] font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
            {issue.id}
          </span>
        </div>
        <Badge
          variant={
            issue.type === "story"
              ? "emerald"
              : issue.type === "task"
                ? "blue"
                : issue.type === "bug"
                  ? "red"
                  : "slate"
          }
          className="capitalize"
        >
          {issue.type}
        </Badge>
      </div>

      <p className="text-[13px] text-slate-800 font-semibold leading-snug mb-3.5 group-hover:text-blue-600 transition-colors">
        {issue.summary}
      </p>

      <div className="flex items-center justify-between mt-auto">
        <Badge
          variant={
            issue.priority === "Critical"
              ? "red"
              : issue.priority === "High"
                ? "orange"
                : issue.priority === "Medium"
                  ? "amber"
                  : "blue"
          }
        >
          {issue.priority === "Critical" && <AlertCircle className="w-3 h-3" />}
          {issue.priority === "High" && <ChevronUp className="w-3 h-3" />}
          {issue.priority === "Medium" && <Equal className="w-3 h-3" />}
          {issue.priority === "Low" && <ChevronDown className="w-3 h-3" />}
          {issue.priority}
        </Badge>

        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-600 overflow-hidden">
          {issue.assignee}
        </div>
      </div>
    </div>
  );
}
