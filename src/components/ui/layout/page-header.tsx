import * as React from "react";
import { cn } from "@/utils/cn";

export interface PageHeaderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:gap-5", className)} {...props}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-bold text-foreground tracking-tight flex items-center gap-1.5 leading-tight sm:leading-none">
            {title}
          </h1>
          {description && (
            <p className="text-[12.5px] sm:text-[13px] text-muted-foreground mt-1.5 sm:mt-1">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
