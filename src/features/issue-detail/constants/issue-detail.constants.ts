import {
  ISSUE_LINK_TYPE_LABELS,
  IssueLinkType,
  IssueType,
} from "@/types/issue.types";

export const DEFAULT_ISSUE_TYPE_OPTIONS: IssueType[] = [
  "EPIC",
  "STORY",
  "TASK",
  "SUBTASK",
  "BUG",
];

export const DEFAULT_RELATIONSHIP_OPTIONS = Object.values(IssueLinkType).map(
  (type) => ({
    value: type,
    label: ISSUE_LINK_TYPE_LABELS[type] || type,
  }),
);

export interface StoryPointOption {
  label: string;
  value: number | null;
}

export const STORY_POINT_OPTIONS: StoryPointOption[] = [
  { label: "?", value: null },
  { label: "0", value: 0 },
  { label: "1/2", value: 0.5 },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "5", value: 5 },
  { label: "8", value: 8 },
  { label: "10", value: 10 },
  { label: "13", value: 13 },
  { label: "20", value: 20 },
  { label: "40", value: 40 },
];
