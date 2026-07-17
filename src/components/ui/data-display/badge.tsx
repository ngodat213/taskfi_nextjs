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
  slate: "bg-secondary text-muted-foreground border-border/80",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
};

const dotColors: Record<BadgeVariant, string> = {
  slate: "bg-slate-400",
  blue: "bg-blue-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
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
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] text-[11.5px] font-medium border",
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full flex-shrink-0",
            dotColors[variant],
          )}
        />
      )}
      {children}
    </span>
  );
}
