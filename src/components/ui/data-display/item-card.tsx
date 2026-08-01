"use client";

import * as React from "react";

import { cn } from "@/utils/cn";

export interface ItemCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  icon?: React.ReactNode;
  itemKey?: React.ReactNode;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  subHeader?: React.ReactNode;
  title: React.ReactNode;
  titleCompleted?: boolean;
  description?: React.ReactNode;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  isCompleted?: boolean;
  hasDivider?: boolean;
}

export const ItemCard = React.forwardRef<HTMLDivElement, ItemCardProps>(
  (
    {
      className,
      icon,
      itemKey,
      badge,
      action,
      subHeader,
      title,
      titleCompleted = false,
      description,
      footerLeft,
      footerRight,
      isCompleted = false,
      hasDivider = false,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "bg-card p-3 rounded-lg border border-border/80 hover:border-primary/50 active:scale-[0.98] cursor-pointer group transition-all duration-200 ease-out select-none flex flex-col justify-between",
          isCompleted && "border-emerald-500/30 opacity-70",
          className,
        )}
        {...props}
      >
        {/* Header Row */}
        {(icon || itemKey || badge || action) && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              {icon}
              {itemKey && (
                <span className="text-[12.5px] font-semibold text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {itemKey}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {badge}
              {action}
            </div>
          </div>
        )}

        {/* SubHeader / Parent / Reason pill */}
        {subHeader && (
          <div className="flex items-center gap-1.5 mb-2 w-fit max-w-full text-[11px] font-medium text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md border border-border/50">
            {subHeader}
          </div>
        )}

        {/* Title */}
        <p
          className={cn(
            "text-[12.5px] text-foreground font-medium leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors",
            (titleCompleted || isCompleted) &&
              "line-through text-muted-foreground",
          )}
        >
          {title}
        </p>

        {/* Description */}
        {description && (
          <div className="text-[11.5px] text-muted-foreground leading-normal mb-2.5 line-clamp-2">
            {description}
          </div>
        )}

        {/* Footer Row */}
        {(footerLeft || footerRight) && (
          <div
            className={cn(
              "flex items-center justify-between mt-auto text-[11px] text-muted-foreground",
              hasDivider ? "pt-2 border-t border-border/40" : "pt-1",
            )}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {footerLeft}
            </div>
            <div className="flex items-center gap-1.5 shrink-0 ml-2">
              {footerRight}
            </div>
          </div>
        )}

        {children}
      </div>
    );
  },
);

ItemCard.displayName = "ItemCard";
