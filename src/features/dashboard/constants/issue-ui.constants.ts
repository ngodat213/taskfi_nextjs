import {
  Zap,
  Bookmark,
  CheckSquare,
  BugIcon,
  CornerDownRight,
  AlertCircle,
  ChevronUp,
  Equal,
  ChevronDown,
  LayoutGrid,
  ListTodo,
  FileText,
  CheckCircle2,
  BarChart2,
  Users,
  History,
  Network,
  Archive,
} from "lucide-react";
import React from "react";
import { IssueType, IssuePriority, IssueStatus } from "@/types/issue.types";

export const ISSUE_TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  [IssueType.EPIC]: {
    icon: Zap,
    colorClass: "text-purple-500 fill-purple-500",
  },
  [IssueType.STORY]: {
    icon: Bookmark,
    colorClass: "text-emerald-500 fill-emerald-500",
  },
  [IssueType.TASK]: {
    icon: CheckSquare,
    colorClass: "text-blue-500 fill-blue-50",
  },
  [IssueType.BUG]: { icon: BugIcon, colorClass: "text-red-500" },
  [IssueType.SUBTASK]: { icon: CornerDownRight, colorClass: "text-slate-400" },
};

export const PRIORITY_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  [IssuePriority.CRITICAL]: { icon: AlertCircle, colorClass: "text-red-500" },
  [IssuePriority.HIGH]: { icon: ChevronUp, colorClass: "text-orange-500" },
  [IssuePriority.MEDIUM]: { icon: Equal, colorClass: "text-amber-500" },
  [IssuePriority.LOW]: { icon: ChevronDown, colorClass: "text-blue-500" },
};

export const STATUS_VARIANT_MAP: Record<
  string,
  "slate" | "blue" | "amber" | "emerald"
> = {
  [IssueStatus.TODO]: "slate",
  [IssueStatus.IN_PROGRESS]: "blue",
  [IssueStatus.IN_REVIEW]: "amber",
  [IssueStatus.DONE]: "emerald",
};

export const DASHBOARD_TABS = [
  { id: "Board", label: "Board", icon: LayoutGrid },
  { id: "Backlog", label: "Backlog", icon: ListTodo },
  { id: "Issues", label: "Issues", icon: FileText },
  { id: "Done", label: "Done", icon: CheckCircle2 },
  { id: "Reports", label: "Reports", icon: BarChart2 },
  { id: "Workload", label: "Workload", icon: Users },
  { id: "Retros", label: "Retros", icon: History },
  { id: "Deps", label: "Deps", icon: Network },
  { id: "Archived", label: "Archived", icon: Archive },
];
