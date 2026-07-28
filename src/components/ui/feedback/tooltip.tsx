"use client";

import { useState, useRef, ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export interface TooltipProps {
  content?: ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = "top",
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const triggerRef = useRef<HTMLDivElement>(null);
  const mounted = useIsMounted();

  const updateCoords = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    let top = 0;
    let left = 0;

    if (position === "top") {
      top = rect.top - 6;
      left = rect.left + rect.width / 2;
    } else if (position === "bottom") {
      top = rect.bottom + 6;
      left = rect.left + rect.width / 2;
    } else if (position === "left") {
      top = rect.top + rect.height / 2;
      left = rect.left - 6;
    } else if (position === "right") {
      top = rect.top + rect.height / 2;
      left = rect.right + 6;
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    updateCoords();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  if (!content) return <>{children}</>;

  const positionStyles = {
    top: "-translate-x-1/2 -translate-y-full",
    bottom: "-translate-x-1/2",
    left: "-translate-x-full -translate-y-1/2",
    right: "-translate-y-1/2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800 border-x-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800 border-x-transparent border-t-transparent",
    left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800 border-y-transparent border-r-transparent",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800 border-y-transparent border-l-transparent",
  };

  return (
    <div
      ref={triggerRef}
      className="inline-flex items-center justify-center shrink-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && coords && (
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: position === "top" ? 3 : position === "bottom" ? -3 : 0,
                  x: position === "left" ? 3 : position === "right" ? -3 : 0,
                }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  y: position === "top" ? 3 : position === "bottom" ? -3 : 0,
                  x: position === "left" ? 3 : position === "right" ? -3 : 0,
                }}
                transition={{ duration: 0.12, ease: "easeOut" }}
                style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
                className={cn(
                  "fixed z-9999 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-100 shadow-xl border border-slate-700/60 dark:border-slate-700",
                  positionStyles[position],
                  className,
                )}
              >
                {content}
                <div
                  className={cn(
                    "absolute border-4 w-0 h-0 pointer-events-none",
                    arrowClasses[position],
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
