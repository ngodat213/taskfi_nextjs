import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";
import {
  STORY_POINT_OPTIONS,
  StoryPointOption,
} from "@/features/issue-detail/constants/issue-detail.constants";

interface StoryPointsSelectorProps {
  label: string;
  value?: number | null;
  onChange: (val: number | null) => void;
  errorMessage?: string;
}

export function StoryPointsSelector({
  label,
  value,
  onChange,
  errorMessage,
}: StoryPointsSelectorProps) {
  return (
    <div className="flex flex-col gap-2 relative">
      <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="grid grid-cols-4 gap-2 mt-0.5">
        {STORY_POINT_OPTIONS.map((pt: StoryPointOption) => {
          const isSelected =
            value === pt.value ||
            (pt.value === null && (value === null || value === undefined));

          return (
            <button
              key={pt.label}
              type="button"
              onClick={() => onChange(pt.value)}
              className={`flex items-center justify-center h-10 rounded-lg border text-[14px] font-bold transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:border-border hover:bg-muted"
              }`}
            >
              {pt.label}
            </button>
          );
        })}
      </div>
      <ErrorTooltip message={errorMessage} />
    </div>
  );
}
