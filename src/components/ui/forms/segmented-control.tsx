import { cn } from "@/utils/cn";
import { ElementType, useId } from "react";
import { motion } from "framer-motion";

export interface SegmentedControlTab {
  id: string;
  label: string;
  icon?: ElementType;
}

interface SegmentedControlProps {
  tabs: SegmentedControlTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export function SegmentedControl({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabClassName,
}: SegmentedControlProps) {
  const layoutId = useId();

  return (
    <div
      className={cn(
        "flex items-center p-1 bg-secondary/80 rounded-full w-fit overflow-x-auto max-w-full border border-border/40",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "relative flex items-center px-3.5 py-1 text-[12.5px] rounded-full transition-colors duration-200 shrink-0 select-none group cursor-pointer",
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/40 font-medium",
              tabClassName,
            )}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-card rounded-full border border-border/60 shadow-xs z-0"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 26,
                }}
              />
            )}
            <div className="relative z-10 flex items-center gap-1.5">
              {tab.icon && (
                <motion.div
                  animate={
                    isActive
                      ? { scale: [1, 1.18, 1], rotate: [0, -4, 0] }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <tab.icon
                    className={cn(
                      "w-3.5 h-3.5 transition-colors duration-200",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
              )}
              <span>{tab.label}</span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
