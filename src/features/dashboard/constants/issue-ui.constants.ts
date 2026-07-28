import { LightningIcon, BookmarkSimpleIcon, CheckSquareIcon, BugIcon, ArrowElbowDownRightIcon, WarningCircleIcon, CaretUpIcon, EqualsIcon, CaretDownIcon, SquaresFourIcon, ChecksIcon, FileTextIcon, CheckCircleIcon, ChartBarIcon, UsersIcon, ClockCounterClockwiseIcon, GraphIcon, ArchiveIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";

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
