"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import { Gear } from "@phosphor-icons/react/dist/ssr";
import { motion, AnimatePresence } from "framer-motion";

export interface SidebarUserFooterProps {
  user?: {
    name?: string;
    email?: string;
  } | null;
  isCollapsed: boolean;
  getInitials: (name?: string | null) => string;
}

export function SidebarUserFooter({
  user,
  isCollapsed,
  getInitials,
}: SidebarUserFooterProps) {
  return (
    <div className="p-2 border-t border-border/40 shrink-0">
      <Link
        href="/user-settings"
        title={isCollapsed ? user?.name || "User settings" : undefined}
        className={cn(
          "group/user flex items-center rounded-xl p-1.5 transition-all select-none cursor-pointer hover:bg-secondary/60",
          isCollapsed ? "justify-center" : "gap-2.5",
        )}
      >
        <div className="w-7.5 h-7.5 rounded-md bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
          {getInitials(user?.name || "User")}
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between flex-1 overflow-hidden"
            >
              <div className="flex flex-col truncate">
                <span className="text-[12.5px] font-bold text-foreground truncate group-hover/user:text-primary transition-colors leading-tight">
                  {user?.name || "User Profile"}
                </span>
                <span className="text-[10.5px] text-muted-foreground truncate font-medium leading-tight mt-0.5">
                  Account & Settings
                </span>
              </div>

              <Gear className="w-3.5 h-3.5 text-muted-foreground group-hover/user:text-foreground group-hover/user:rotate-45 transition-all duration-300 shrink-0 ml-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>
    </div>
  );
}
