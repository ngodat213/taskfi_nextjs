import * as React from "react";
import {
  Button,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
} from "@/components/ui/actions/button";
import { cn } from "@/utils/cn";

export const TableActionBtn = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = ButtonVariant.Ghost,
      size = ButtonSize.Sm,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "h-7 w-7 p-0 text-muted-foreground hover:text-foreground transition-colors",
          className,
        )}
        {...props}
      />
    );
  },
);

TableActionBtn.displayName = "TableActionBtn";
