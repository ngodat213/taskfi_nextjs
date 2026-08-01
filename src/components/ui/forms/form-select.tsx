import * as React from "react";

import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { InputLabel } from "@/components/ui/forms/input-label";
import { Select, SelectProps } from "@/components/ui/forms/select";
import { cn } from "@/utils/cn";

export interface FormSelectProps extends SelectProps {
  label?: React.ReactNode;
  required?: boolean;
  error?: string;
  containerClassName?: string;
}

export const FormSelect = React.forwardRef<HTMLDivElement, FormSelectProps>(
  (
    {
      label,
      required,
      error,
      containerClassName,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col gap-1.5 relative", containerClassName)}>
        {label && <InputLabel required={required}>{label}</InputLabel>}
        <Select
          ref={ref}
          className={cn(className, error && "border-red-500")}
          {...props}
        >
          {children}
        </Select>
        <ErrorTooltip message={error} />
      </div>
    );
  },
);
FormSelect.displayName = "FormSelect";
