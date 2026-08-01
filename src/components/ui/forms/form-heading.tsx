import * as React from "react";

import { cn } from "@/utils/cn";

export interface FormHeadingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const FormHeading = React.forwardRef<HTMLDivElement, FormHeadingProps>(
  ({ title, description, rightElement, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-6", className)} {...props}>
        <div className="flex items-start justify-between">
          <h2 className="text-[18px] font-semibold text-foreground tracking-tight">
            {title}
          </h2>
          {rightElement && (
            <div className="flex-shrink-0 ml-4">{rightElement}</div>
          )}
        </div>
        {description && (
          <p className="text-[13.5px] text-muted-foreground mt-1.5">
            {description}
          </p>
        )}
      </div>
    );
  },
);
FormHeading.displayName = "FormHeading";
