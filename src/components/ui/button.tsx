import * as React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "primary";
  size?: "default" | "sm";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-1.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-900/5 disabled:pointer-events-none",
          !props.disabled && "active:scale-[0.98]",
          /* Variants */
          variant === "default" &&
            "bg-[#111111] text-white hover:bg-black hover:shadow-md disabled:bg-[#2B2B2B] disabled:text-[#888888]",
          variant === "primary" &&
            "bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm",
          variant === "outline" &&
            "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm disabled:bg-slate-50 disabled:text-slate-400",
          /* Sizes */
          size === "default" && "h-10 px-4 rounded-lg text-[13px] gap-2",
          size === "sm" && "h-8 px-3.5 rounded-full text-[12.5px] gap-1.5",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
