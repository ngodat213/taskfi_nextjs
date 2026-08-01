import * as React from "react";

import { cn } from "@/utils/cn";

export enum ButtonVariant {
  Default = "default",
  Outline = "outline",
  Primary = "primary",
  Ghost = "ghost",
  Pill = "pill",
}

export enum ButtonSize {
  Default = "default",
  Sm = "sm",
  Icon = "icon",
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = ButtonVariant.Default,
      size = ButtonSize.Default,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap gap-1.5 font-semibold transition-all select-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          !props.disabled && "active:scale-[0.97]",
          /* Variants */
          variant === ButtonVariant.Default &&
            "rounded-full bg-secondary/90 hover:bg-secondary border border-border/50 text-foreground shadow-2xs",
          variant === ButtonVariant.Pill &&
            "rounded-full bg-secondary/90 hover:bg-secondary border border-border/50 text-foreground shadow-2xs",
          variant === ButtonVariant.Primary &&
            "rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs",
          variant === ButtonVariant.Outline &&
            "rounded-full bg-secondary/30 hover:bg-secondary/80 border border-border/80 text-foreground shadow-2xs",
          variant === ButtonVariant.Ghost &&
            "rounded-full bg-transparent hover:bg-secondary/60 text-foreground font-medium",
          /* Sizes */
          size === ButtonSize.Default && "h-8.5 px-4 text-[13px] gap-2",
          size === ButtonSize.Sm && "h-7.5 px-3.5 text-[12px] gap-1.5",
          size === ButtonSize.Icon &&
            "w-8.5 h-8.5 p-0 rounded-full shrink-0 flex items-center justify-center",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
