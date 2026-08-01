import * as React from "react";

import { cn } from "@/utils/cn";

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageContainer({
  children,
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full bg-transparent overflow-y-auto",
        className,
      )}
      {...props}
    >
      <div className="relative z-10 flex-1 flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  );
}
