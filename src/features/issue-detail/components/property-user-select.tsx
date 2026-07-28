import { ReactNode } from "react";
import { Select } from "@/components/ui/forms/select";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import { cn } from "@/utils/cn";

export interface PropertyUserSelectProps {
  label: string;
  value: string;
  onChange: (userId: string | null) => void;
  options: { value: string; label: string }[];
  action?: ReactNode;
  errorMessage?: string;
  unassignedLabel: string;
}

export function PropertyUserSelect({
  label,
  value,
  onChange,
  options,
  action,
  errorMessage,
  unassignedLabel,
}: PropertyUserSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 relative">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {action}
      </div>
      <Select
        value={value}
        onChange={(val) => onChange(val || null)}
        className={cn(
          "h-8 text-[13px] w-full font-medium",
          errorMessage && "border-destructive focus:ring-destructive/20",
        )}
      >
        <option value="">{unassignedLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
      <ErrorTooltip message={errorMessage} />
    </div>
  );
}
