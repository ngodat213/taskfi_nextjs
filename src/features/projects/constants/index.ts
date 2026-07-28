import { ListIcon, SquaresFourIcon, CalendarBlankIcon } from "@phosphor-icons/react/dist/ssr";
;
import { SegmentedControlTab } from "@/components/ui/forms/segmented-control";

export const PROJECT_VIEW_TABS: SegmentedControlTab[] = [
  { id: "list", label: "ListIcon", icon: ListIcon },
  { id: "cards", label: "Cards", icon: SquaresFourIcon },
  { id: "calendar", label: "CalendarBlankIcon", icon: CalendarBlankIcon },
];
