"use client";

import * as React from "react";

import { type Variants, motion } from "framer-motion";

import { cn } from "@/utils/cn";

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  footer?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
    icon?: React.ReactNode;
  };
  hoverEffect?: boolean;
}

const cardHoverVariants: Variants = {
  hover: { y: -2, scale: 1.005 },
  tap: { scale: 0.985 },
};

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      label,
      value,
      subValue,
      footer,
      icon,
      badge,
      trend,
      hoverEffect = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isInteractive = Boolean(onClick || hoverEffect);

    const cardContent = (
      <div
        className={cn(
          "bg-card border border-border/80 rounded-xl p-3.5 shadow-2xs transition-all duration-200 flex flex-col justify-between gap-1.5 group h-full",
          isInteractive &&
            "hover:border-primary/50 cursor-pointer hover:shadow-xs",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          {badge && <div>{badge}</div>}
          {icon && (
            <div className="w-8.5 h-8.5 rounded-full bg-secondary flex items-center justify-center border border-border/60 shrink-0">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 my-0.5">
          <span className="text-xl font-bold text-foreground tracking-tight leading-none">
            {value}
          </span>
          {subValue && (
            <span className="text-[12px] font-medium text-muted-foreground">
              {subValue}
            </span>
          )}
        </div>

        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-[12px] font-semibold",
              trend.isPositive !== false ? "text-emerald-500" : "text-rose-500",
            )}
          >
            {trend.icon}
            <span className="truncate">{trend.text}</span>
          </div>
        )}

        {footer && !trend && (
          <div className="text-[12px] font-medium text-muted-foreground truncate">
            {footer}
          </div>
        )}
      </div>
    );

    if (isInteractive) {
      return (
        <motion.div
          ref={ref}
          variants={cardHoverVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={onClick}
          {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
        >
          {cardContent}
        </motion.div>
      );
    }

    return (
      <div ref={ref} onClick={onClick} {...props}>
        {cardContent}
      </div>
    );
  },
);

StatCard.displayName = "StatCard";
