import * as React from "react";
import { Textarea, TextareaProps } from "@/components/ui/forms/textarea";
import { InputLabel } from "@/components/ui/forms/input-label";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { cn } from "@/utils/cn";

export interface FormTextareaProps extends TextareaProps {
  label?: React.ReactNode;
  required?: boolean;
  error?: string;
  containerClassName?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(
  (
    { label, required, error, containerClassName, className, ...props },
    ref,
  ) => {
    return (
      <div className={cn("flex flex-col gap-1.5 relative", containerClassName)}>
        {label && <InputLabel required={required}>{label}</InputLabel>}
        <Textarea
          ref={ref}
          className={cn(className, error && "border-red-500")}
          {...props}
        />
        <ErrorTooltip message={error} />
      </div>
    );
  },
);
FormTextarea.displayName = "FormTextarea";
