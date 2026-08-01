import * as React from "react";

import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { Input, InputProps } from "@/components/ui/forms/input";
import { InputLabel } from "@/components/ui/forms/input-label";
import { cn } from "@/utils/cn";

export interface FormInputProps extends Omit<InputProps, "error"> {
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    { label, required, error, containerClassName, className, ...props },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col gap-2 relative", containerClassName)}>
        {label && <InputLabel required={required}>{label}</InputLabel>}
        <Input
          ref={ref}
          className={cn(className, error && "border-red-500")}
          {...props}
        />
        <ErrorTooltip message={error} />
      </div>
    );
  },
);
FormInput.displayName = "FormInput";
