"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { CaretDown, SidebarSimple } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";

export interface SidebarWorkspaceHeaderProps {
  currentNav?: {
    name: string;
    description?: string | null;
    logoUrl?: string | null;
    backLink?: string | null;
  };
  userName?: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  getInitials: (name?: string | null) => string;
}

export function SidebarWorkspaceHeader({
  currentNav,
  userName,
  isCollapsed,
  onToggleCollapse,
  getInitials,
}: SidebarWorkspaceHeaderProps) {
  return (
    <div className="p-3 pb-2 flex items-center justify-between gap-2 border-b border-border/40 shrink-0">
      <Link
        href={currentNav?.backLink || "/workspaces"}
        className="flex items-center gap-2 flex-1 min-w-0 group/header cursor-pointer"
      >
        {currentNav?.logoUrl ? (
          <Image
            src={currentNav.logoUrl.replace("hhttps", "https")}
            alt={currentNav.name}
            width={28}
            height={28}
            className="w-7 h-7 rounded-md object-cover shrink-0 bg-secondary"
          />
        ) : (
          <div className="w-7 h-7 rounded-md bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
            {getInitials(currentNav?.name || userName || "Taskfi")}
          </div>
        )}

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-1.5 min-w-0 flex-1"
            >
              <span className="text-[13.5px] font-bold text-foreground truncate tracking-tight group-hover/header:text-primary transition-colors">
                {currentNav?.name || `${userName || "User"}'s Workspace`}
              </span>
              <CaretDown className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      <button
        onClick={onToggleCollapse}
        className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <SidebarSimple className="w-4 h-4" />
      </button>
    </div>
  );
}
