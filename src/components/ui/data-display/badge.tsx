import { cn } from "@/utils/cn";
import { ReactNode } from "react";

export type BadgeVariant =
  | "slate"
  | "blue"
  | "emerald"
  | "amber"
  | "red"
  | "purple"
  | "orange";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  slate: "bg-muted/80 text-muted-foreground border-border/50",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  emerald:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  amber:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  red: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  purple:
    "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  orange:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

const dotColors: Record<BadgeVariant, string> = {
  slate: "bg-slate-400",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-rose-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

export function Badge({
  children,
  variant = "slate",
  className,
  dot,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10.5px] font-semibold border shrink-0 select-none",
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            dotColors[variant],
          )}
        />
      )}
      {children}
    </span>
  );
}
