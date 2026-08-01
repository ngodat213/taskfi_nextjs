import * as React from "react";

import { Label, LabelProps } from "@/components/ui/forms/label";

export interface InputLabelProps extends LabelProps {
  required?: boolean;
}

const InputLabel = React.forwardRef<HTMLLabelElement, InputLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <Label ref={ref} className={className} {...props}>
        {children}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
    );
  },
);
InputLabel.displayName = "InputLabel";

export { InputLabel };
