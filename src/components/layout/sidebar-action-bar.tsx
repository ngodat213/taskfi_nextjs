"use client";

import { Plus, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";

export interface SidebarActionBarProps {
  isCollapsed: boolean;
  onNewClick?: () => void;
  onSearchClick?: () => void;
}

export function SidebarActionBar({
  isCollapsed,
  onNewClick,
  onSearchClick,
}: SidebarActionBarProps) {
  return (
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="px-3 pt-3 pb-1 flex items-center gap-2 shrink-0 overflow-hidden"
        >
          <button
            onClick={onNewClick}
            className="flex-1 h-8 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 text-[12.5px] font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>New</span>
          </button>

          <button
            onClick={onSearchClick}
            className="w-8 h-8 rounded-full bg-secondary/80 hover:bg-secondary border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs shrink-0"
            title="Search"
          >
            <MagnifyingGlass className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
