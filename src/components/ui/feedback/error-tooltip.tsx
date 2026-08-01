import { WarningCircleIcon } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/utils/cn";

interface ErrorTooltipProps {
  message?: string;
  className?: string;
}

export function ErrorTooltip({ message, className }: ErrorTooltipProps) {
  if (!message) return null;

  return (
    <div
      className={cn(
        "absolute z-10 top-[calc(100%+8px)] left-0 px-3 py-2.5",
        "bg-[#2B2B2B] border border-[#404040]",
        "text-[#E2E2E2] text-[12.5px] rounded-lg shadow-xl",
        "flex items-start gap-2.5",
        "animate-in fade-in zoom-in-95 slide-in-from-top-1.5 duration-200 pointer-events-none",
        className,
      )}
    >
      <div className="absolute -top-1.5 left-4 w-3 h-3 bg-[#2B2B2B] border-t border-l border-[#404040] rotate-45 rounded-tl-[2px]" />

      <WarningCircleIcon
        className="w-[16px] h-[16px] text-[#FF5C5C] flex-shrink-0 mt-[1px]"
        strokeWidth={2.5}
      />
      <span className="font-medium leading-snug tracking-wide">{message}</span>
    </div>
  );
}
