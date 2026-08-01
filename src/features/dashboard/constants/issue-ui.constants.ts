import React from "react";

import {
  ArchiveIcon,
  ArrowElbowDownRightIcon,
  BookmarkSimpleIcon,
  BugIcon,
  CaretDownIcon,
  CaretUpIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CheckSquareIcon,
  ChecksIcon,
  ClockCounterClockwiseIcon,
  EqualsIcon,
  FileTextIcon,
  GraphIcon,
  LightningIcon,
  SquaresFourIcon,
  UsersIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react/dist/ssr";

export const ISSUE_TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  epic: {
    icon: LightningIcon,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  story: {
    icon: BookmarkSimpleIcon,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  task: {
    icon: CheckSquareIcon,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  bug: {
    icon: BugIcon,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  subtask: {
    icon: ArrowElbowDownRightIcon,
    colorClass: "text-muted-foreground",
  },
  EPIC: {
    icon: LightningIcon,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  STORY: {
    icon: BookmarkSimpleIcon,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  TASK: {
    icon: CheckSquareIcon,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  BUG: {
    icon: BugIcon,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  SUBTASK: {
    icon: ArrowElbowDownRightIcon,
    colorClass: "text-muted-foreground",
  },
  Epic: {
    icon: LightningIcon,
    colorClass: "text-purple-600 dark:text-purple-400",
  },
  Story: {
    icon: BookmarkSimpleIcon,
    colorClass: "text-emerald-600 dark:text-emerald-400",
  },
  Task: {
    icon: CheckSquareIcon,
    colorClass: "text-blue-600 dark:text-blue-400",
  },
  BugIcon: {
    icon: BugIcon,
    colorClass: "text-rose-600 dark:text-rose-400",
  },
  Subtask: {
    icon: ArrowElbowDownRightIcon,
    colorClass: "text-muted-foreground",
  },
};

export const PRIORITY_CONFIG: Record<
  string,
  { icon: React.ElementType; colorClass: string }
> = {
  Critical: { icon: WarningCircleIcon, colorClass: "text-red-500" },
  High: { icon: CaretUpIcon, colorClass: "text-orange-500" },
  Medium: { icon: EqualsIcon, colorClass: "text-amber-500" },
  Low: { icon: CaretDownIcon, colorClass: "text-blue-500" },
  critical: { icon: WarningCircleIcon, colorClass: "text-red-500" },
  high: { icon: CaretUpIcon, colorClass: "text-orange-500" },
  medium: { icon: EqualsIcon, colorClass: "text-amber-500" },
  low: { icon: CaretDownIcon, colorClass: "text-blue-500" },
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
  { id: "Board", label: "Board", icon: SquaresFourIcon },
  { id: "Backlog", label: "Backlog", icon: ChecksIcon },
  { id: "Issues", label: "Issues", icon: FileTextIcon },
  { id: "Done", label: "Done", icon: CheckCircleIcon },
  { id: "Reports", label: "Reports", icon: ChartBarIcon },
  { id: "Workload", label: "Workload", icon: UsersIcon },
  { id: "Retros", label: "Retros", icon: ClockCounterClockwiseIcon },
  { id: "Deps", label: "Deps", icon: GraphIcon },
  { id: "Archived", label: "Archived", icon: ArchiveIcon },
];

export const TYPE_BORDER_CLASSES: Record<string, string> = {
  epic: "border-purple-500/40 hover:border-purple-500 dark:border-purple-500/40 dark:hover:border-purple-400",
  story:
    "border-emerald-500/40 hover:border-emerald-500 dark:border-emerald-500/40 dark:hover:border-emerald-400",
  task: "border-blue-500/40 hover:border-blue-500 dark:border-blue-500/40 dark:hover:border-blue-400",
  bug: "border-rose-500/40 hover:border-rose-500 dark:border-rose-500/40 dark:hover:border-rose-400",
  subtask:
    "border-slate-400/40 hover:border-slate-400 dark:border-slate-500/40 dark:hover:border-slate-400",
  EPIC: "border-purple-500/40 hover:border-purple-500 dark:border-purple-500/40 dark:hover:border-purple-400",
  STORY:
    "border-emerald-500/40 hover:border-emerald-500 dark:border-emerald-500/40 dark:hover:border-emerald-400",
  TASK: "border-blue-500/40 hover:border-blue-500 dark:border-blue-500/40 dark:hover:border-blue-400",
  BUG: "border-rose-500/40 hover:border-rose-500 dark:border-rose-500/40 dark:hover:border-rose-400",
  SUBTASK:
    "border-slate-400/40 hover:border-slate-400 dark:border-slate-500/40 dark:hover:border-slate-400",
};

export function getTypeOrStatusColor(
  type: string,
  status: string,
  config?: {
    statuses?: { name: string; key?: string; color?: string }[];
    issueTypes?: { name: string; key?: string; color?: string }[];
  },
): string | undefined {
  if (!config) return undefined;

  const normalizedType = (type || "").toLowerCase().trim();
  const normalizedStatus = (status || "").toLowerCase().trim();

  const foundType = config.issueTypes?.find(
    (t) =>
      (t.name || t.key || "").toLowerCase().trim() === normalizedType ||
      (t.key || "").toLowerCase().trim() === normalizedType,
  );
  if (foundType?.color) return foundType.color;

  const foundStatus = config.statuses?.find(
    (s) =>
      (s.name || s.key || "").toLowerCase().trim() === normalizedStatus ||
      (s.name || s.key || "").toLowerCase().trim() === normalizedType,
  );
  if (foundStatus?.color) return foundStatus.color;

  return undefined;
}
