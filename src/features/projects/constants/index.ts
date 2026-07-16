import { List, LayoutGrid, Calendar } from "lucide-react";
import { SegmentedControlTab } from "@/components/ui/forms/segmented-control";

export const PROJECT_VIEW_TABS: SegmentedControlTab[] = [
  { id: "list", label: "List", icon: List },
  { id: "cards", label: "Cards", icon: LayoutGrid },
  { id: "calendar", label: "Calendar", icon: Calendar },
];
