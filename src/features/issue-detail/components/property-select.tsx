import { ReactNode } from "react";
import {
  SearchSelect,
  SearchSelectOption,
} from "@/components/ui/forms/search-select";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { cn } from "@/utils/cn";

export interface PropertySelectProps {
  label: string;
  options: SearchSelectOption[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  action?: ReactNode;
  errorMessage?: string;
  clearable?: boolean;
}

export function PropertySelect({
  label,
  options,
  value,
  onChange,
  placeholder,
  action,
  errorMessage,
  clearable = false,
}: PropertySelectProps) {
  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {action}
      </div>
      <SearchSelect
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Select...`}
        clearable={clearable}
        className={cn(
          "h-9 text-[13px] w-full font-medium",
          errorMessage && "border-destructive focus:ring-destructive/20",
        )}
      />
      <ErrorTooltip message={errorMessage} />
    </div>
  );
}
