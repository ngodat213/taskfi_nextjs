import * as React from "react";
import { cn } from "@/utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full h-9 px-3.5 py-2 bg-transparent border border-border rounded-full text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 transition-all shadow-sm",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
