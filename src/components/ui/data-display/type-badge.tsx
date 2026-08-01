import { Badge, BadgeVariant } from "@/components/ui/data-display/badge";
import { TypeIcon } from "@/features/issues/components/issue-table-row";
import { Issue } from "@/types/issue.types";
import { cn } from "@/utils/cn";

export const TYPE_BADGE_VARIANTS: Record<string, BadgeVariant> = {
  epic: "purple",
  story: "emerald",
  task: "blue",
  bug: "red",
  subtask: "slate",
};

interface TypeBadgeProps {
  type?: string;
  color?: string;
  className?: string;
}

export function TypeBadge({ type = "task", color, className }: TypeBadgeProps) {
  const normalizedType = (type || "task").toLowerCase().trim();
  const variant = TYPE_BADGE_VARIANTS[normalizedType] || "slate";

  const dynamicStyle = color
    ? {
        backgroundColor: color.startsWith("#") ? `${color}18` : color,
        color: color,
        borderColor: color.startsWith("#") ? `${color}35` : color,
      }
    : undefined;

  return (
    <Badge
      variant={variant}
      style={dynamicStyle}
      className={cn("capitalize", className)}
    >
      <TypeIcon
        type={normalizedType as Issue["type"]}
        className="w-3.5 h-3.5 shrink-0"
      />
      <span>{normalizedType}</span>
    </Badge>
  );
}
