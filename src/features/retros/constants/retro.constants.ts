import { RetroCategory } from "@/types/retro.types";
import { SmileyIcon, WarningCircleIcon, CheckCircleIcon } from "@phosphor-icons/react/dist/ssr";

export const HEX_OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
export const SPRINT_PREFIX_REGEX = /^sprint[-_\s]*/i;

export const DEFAULT_SPRINT_ID = "sprint-24";
export const DEFAULT_SPRINT_NAME = "Sprint 24";
export const DEFAULT_SENTIMENT_SCORE = 5.0;

export interface RetroColumnConfig {
  category: RetroCategory;
  title: string;
  color: string;
  variant: "emerald" | "amber" | "blue";
  icon: typeof SmileyIcon;
  emptyTitle: string;
}

export const RETRO_COLUMNS: RetroColumnConfig[] = [
  {
    category: "went_well",
    title: "What Went Well",
    color: "#10b981",
    variant: "emerald",
    icon: SmileyIcon,
    emptyTitle: "No items in What Went Well",
  },
  {
    category: "to_improve",
    title: "What Can Be Improved",
    color: "#f59e0b",
    variant: "amber",
    icon: WarningCircleIcon,
    emptyTitle: "No items to improve yet",
  },
  {
    category: "action_item",
    title: "Action Items",
    color: "#3b82f6",
    variant: "blue",
    icon: CheckCircleIcon,
    emptyTitle: "No action items yet",
  },
];

export const AVAILABLE_TAGS = [
  "API Docs",
  "DevOps",
  "Frontend",
  "Backend",
  "Teamwork",
  "QA / Testing",
  "High Priority",
  "Quality Gate",
  "Infrastructure",
  "UI/UX",
  "Performance",
  "Security",
];
