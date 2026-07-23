import {
  Lightning,
  BookmarkSimple,
  CheckSquare,
  Bug,
  ArrowElbowDownRight,
  WarningCircle,
  CaretUp,
  Equals,
  CaretDown,
  SquaresFour,
  Checks,
  FileText,
  CheckCircle,
  ChartBar,
  Users,
  ClockCounterClockwise,
  Graph,
  Archive,
} from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { IssueType, IssuePriority, IssueStatus } from "@/types/issue.types";

export const ISSUE_TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  [IssueType.EPIC]: {
    icon: Lightning,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  [IssueType.STORY]: {
    icon: BookmarkSimple,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  [IssueType.TASK]: {
    icon: CheckSquare,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  [IssueType.BUG]: {
    icon: Bug,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  [IssueType.SUBTASK]: {
    icon: ArrowElbowDownRight,
    colorClass: "text-muted-foreground",
  },
};

export const PRIORITY_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  [IssuePriority.CRITICAL]: { icon: WarningCircle, colorClass: "text-red-500" },
  [IssuePriority.HIGH]: { icon: CaretUp, colorClass: "text-orange-500" },
  [IssuePriority.MEDIUM]: { icon: Equals, colorClass: "text-amber-500" },
  [IssuePriority.LOW]: { icon: CaretDown, colorClass: "text-blue-500" },
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
  { id: "Board", label: "Board", icon: SquaresFour },
  { id: "Backlog", label: "Backlog", icon: Checks },
  { id: "Issues", label: "Issues", icon: FileText },
  { id: "Done", label: "Done", icon: CheckCircle },
  { id: "Reports", label: "Reports", icon: ChartBar },
  { id: "Workload", label: "Workload", icon: Users },
  { id: "Retros", label: "Retros", icon: ClockCounterClockwise },
  { id: "Deps", label: "Deps", icon: Graph },
  { id: "Archived", label: "Archived", icon: Archive },
];
