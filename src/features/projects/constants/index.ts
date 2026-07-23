import { List, SquaresFour, CalendarBlank } from "@phosphor-icons/react/dist/ssr";
;
import { SegmentedControlTab } from "@/components/ui/forms/segmented-control";

export const PROJECT_VIEW_TABS: SegmentedControlTab[] = [
  { id: "list", label: "List", icon: List },
  { id: "cards", label: "Cards", icon: SquaresFour },
  { id: "calendar", label: "CalendarBlank", icon: CalendarBlank },
];
