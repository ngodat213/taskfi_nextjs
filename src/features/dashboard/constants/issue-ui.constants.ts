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

export const ISSUE_TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  epic: {
    icon: Lightning,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  story: {
    icon: BookmarkSimple,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  task: {
    icon: CheckSquare,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  bug: {
    icon: Bug,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  subtask: {
    icon: ArrowElbowDownRight,
    colorClass: "text-muted-foreground",
  },
  EPIC: {
    icon: Lightning,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  STORY: {
    icon: BookmarkSimple,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  TASK: {
    icon: CheckSquare,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  BUG: {
    icon: Bug,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  SUBTASK: {
    icon: ArrowElbowDownRight,
    colorClass: "text-muted-foreground",
  },
  Epic: {
    icon: Lightning,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  Story: {
    icon: BookmarkSimple,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  Task: {
    icon: CheckSquare,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  Bug: {
    icon: Bug,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  Subtask: {
    icon: ArrowElbowDownRight,
    colorClass: "text-muted-foreground",
  },
};

export const PRIORITY_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  Critical: { icon: WarningCircle, colorClass: "text-red-500" },
  High: { icon: CaretUp, colorClass: "text-orange-500" },
  Medium: { icon: Equals, colorClass: "text-amber-500" },
  Low: { icon: CaretDown, colorClass: "text-blue-500" },
  critical: { icon: WarningCircle, colorClass: "text-red-500" },
  high: { icon: CaretUp, colorClass: "text-orange-500" },
  medium: { icon: Equals, colorClass: "text-amber-500" },
  low: { icon: CaretDown, colorClass: "text-blue-500" },
};

export const STATUS_VARIANT_MAP: Record<
  string,
  "slate" | "blue" | "amber" | "emerald"
> = {
  "To Do": "slate",
  "In Progress": "blue",
  "In Review": "amber",
  Done: "emerald",
  "to do": "slate",
  "in progress": "blue",
  "in review": "amber",
  done: "emerald",
  todo: "slate",
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
