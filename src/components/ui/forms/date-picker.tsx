import { useState, useRef, useEffect } from "react";
import {
  CalendarBlankIcon,
  CaretLeftIcon,
  CaretRightIcon,
  XIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/utils/cn";
import { ErrorTooltip } from "@/components/ui/feedback/error-tooltip";

interface DatePickerProps {
  label?: string;
  value?: string | null;
  onChange: (dateIsoString: string | null) => void;
  placeholder?: string;
  errorMessage?: string;
  className?: string;
  clearable?: boolean;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date...",
  errorMessage,
  className,
  clearable = true,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const isValidDate = selectedDate && !isNaN(selectedDate.getTime());

  const [viewDate, setViewDate] = useState(() =>
    isValidDate ? selectedDate : new Date(),
  );

  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    if (isValidDate) {
      setViewDate(selectedDate);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day, 12, 0, 0);
    onChange(newDate.toISOString());
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handlePreset = (preset: "today" | "tomorrow" | "nextWeek") => {
    const target = new Date();
    if (preset === "tomorrow") {
      target.setDate(target.getDate() + 1);
    } else if (preset === "nextWeek") {
      target.setDate(target.getDate() + 7);
    }
    onChange(target.toISOString());
    setIsOpen(false);
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let startWeekday = firstDayOfMonth.getDay() - 1;
  if (startWeekday === -1) startWeekday = 6;

  const today = new Date();
  const isTodayMonth =
    today.getFullYear() === currentYear && today.getMonth() === currentMonth;

  const formattedDisplay = isValidDate
    ? selectedDate.toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const monthYearLabel = viewDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-1.5 relative w-full" ref={containerRef}>
      {label && (
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      )}

      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "h-8 text-[13px] w-full font-medium bg-card border border-border rounded-md px-2.5 text-foreground flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 cursor-pointer group",
            errorMessage && "border-destructive focus:ring-destructive/20",
            className,
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
            <CalendarBlankIcon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span
              className={cn(
                "truncate",
                !isValidDate && "text-muted-foreground font-normal",
              )}
            >
              {formattedDisplay || placeholder}
            </span>
          </div>

          {clearable && isValidDate && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange(null);
                }
              }}
              className="p-0.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-1"
              title="Clear date"
            >
              <XIcon className="w-3.5 h-3.5" />
            </span>
          )}
        </button>

        <ErrorTooltip message={errorMessage} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 z-50 w-72 bg-popover text-popover-foreground border border-border rounded-xl shadow-xl p-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[13px] font-semibold tracking-tight capitalize">
              {monthYearLabel}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Previous Month"
              >
                <CaretLeftIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Next Month"
              >
                <CaretRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2.5 pb-2.5 border-b border-border/60 overflow-x-auto hide-scrollbar">
            <button
              type="button"
              onClick={() => handlePreset("today")}
              className="px-2 py-1 text-[11px] font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors shrink-0"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => handlePreset("tomorrow")}
              className="px-2 py-1 text-[11px] font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors shrink-0"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => handlePreset("nextWeek")}
              className="px-2 py-1 text-[11px] font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md transition-colors shrink-0"
            >
              Next Week
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="text-[10px] font-bold text-muted-foreground uppercase"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: startWeekday }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8 w-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const isSelectedDay =
                isValidDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

              const isTodayDay = isTodayMonth && today.getDate() === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={cn(
                    "h-8 w-8 rounded-lg text-[12px] font-medium flex items-center justify-center transition-all cursor-pointer",
                    isSelectedDay
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "hover:bg-muted text-foreground",
                    isTodayDay &&
                      !isSelectedDay &&
                      "border border-blue-500 font-semibold text-blue-600 dark:text-blue-400",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
