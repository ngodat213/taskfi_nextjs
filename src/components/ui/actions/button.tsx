import * as React from "react";
import { cn } from "@/utils/cn";

export enum ButtonVariant {
  Default = "default",
  Outline = "outline",
  Primary = "primary",
  Ghost = "ghost",
}

export enum ButtonSize {
  Default = "default",
  Sm = "sm",
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
          "inline-flex items-center justify-center whitespace-nowrap gap-1.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none",
          !props.disabled && "active:scale-[0.98]",
          /* Variants */
          variant === ButtonVariant.Default &&
            "bg-foreground text-background hover:bg-foreground/90 hover:shadow-md disabled:bg-muted disabled:text-muted-foreground",
          variant === ButtonVariant.Primary &&
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
          variant === ButtonVariant.Outline &&
            "bg-transparent border border-border text-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-sm disabled:bg-muted disabled:text-muted-foreground",
          variant === ButtonVariant.Ghost &&
            "bg-transparent hover:bg-accent hover:text-accent-foreground text-foreground",
          /* Sizes */
          size === ButtonSize.Default &&
            "h-10 px-4 rounded-lg text-[13px] gap-2",
          size === ButtonSize.Sm &&
            "h-8 px-3.5 rounded-full text-[12.5px] gap-1.5",
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
