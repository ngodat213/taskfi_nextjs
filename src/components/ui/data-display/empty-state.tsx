import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center w-full",
        className,
      )}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 border border-border/50 shadow-sm">
          <Icon className="w-6 h-6 text-muted-foreground" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p
          className={cn(
            "text-[13px] text-muted-foreground max-w-sm leading-relaxed",
            action ? "mb-5" : "mb-0",
          )}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
