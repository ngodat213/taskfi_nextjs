import { cn } from "@/utils/cn";
import { ElementType, useId } from "react";
import { motion } from "framer-motion";

export interface SegmentedControlTab {
  id: string;
  label: string;
  icon: ElementType;
}

interface SegmentedControlProps {
  tabs: SegmentedControlTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function SegmentedControl({
  tabs,
  activeTab,
  onTabChange,
  className,
}: SegmentedControlProps) {
  const layoutId = useId();

  return (
    <div
      className={cn(
        "flex items-center p-1 bg-slate-100/80 rounded-md w-fit overflow-x-auto max-w-full",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "relative flex items-center px-3 py-1 text-[12.5px] font-medium rounded transition-colors duration-200 flex-shrink-0",
              isActive
                ? "text-slate-900"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-white rounded shadow-sm z-0"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-1.5">
              <tab.icon
                className={cn(
                  "w-3.5 h-3.5 transition-colors duration-200",
                  isActive ? "text-blue-500" : "text-slate-400",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}
