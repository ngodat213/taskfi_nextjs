import { Badge, BadgeVariant } from "@/components/ui/data-display/badge";
import { PRIORITY_CONFIG } from "@/features/issues/constants/issue-ui.constants";
import { cn } from "@/utils/cn";

export const PRIORITY_VARIANT_MAP: Record<string, BadgeVariant> = {
  urgent: "red",
  critical: "red",
  high: "orange",
  medium: "amber",
  low: "slate",
};

interface PriorityBadgeProps {
  priority?: string;
  className?: string;
}

export function PriorityBadge({
  priority = "Medium",
  className,
}: PriorityBadgeProps) {
  const priorityKey = (priority || "").toLowerCase().trim();
  const priorityConf =
    PRIORITY_CONFIG[priority] ||
    PRIORITY_CONFIG[priorityKey] ||
    PRIORITY_CONFIG.Medium;
  const PriorityIconComp = priorityConf?.icon;
  const variant = PRIORITY_VARIANT_MAP[priorityKey] || "slate";

  return (
    <Badge
      variant={variant}
      className={cn(
        "gap-1.5 uppercase font-bold tracking-wider text-[10.5px]",
        className,
      )}
    >
      {PriorityIconComp && (
        <PriorityIconComp
          className={cn("w-3.5 h-3.5", priorityConf?.colorClass)}
        />
      )}
      <span>{priority}</span>
    </Badge>
  );
}
