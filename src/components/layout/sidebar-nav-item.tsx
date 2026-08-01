"use client";

import { Icon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";

export interface SidebarNavItemProps {
  icon: Icon;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

export function SidebarNavItem({
  icon: IconComponent,
  label,
  href,
  isActive,
  isCollapsed,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={cn(
        "relative flex items-center rounded-xl text-[13px] font-medium transition-all shrink-0 select-none group/item cursor-pointer",
        isCollapsed ? "justify-center py-2 px-0" : "px-3 py-1.5",
        isActive
          ? "text-foreground font-bold"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-pill"
          className="absolute inset-0 bg-secondary rounded-xl shadow-2xs z-0"
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 30,
          }}
        />
      )}
      <div
        className={cn(
          "relative z-10 flex items-center w-full",
          isCollapsed ? "justify-center" : "gap-3",
        )}
      >
        <IconComponent
          className={cn(
            "w-4 h-4 shrink-0 transition-colors",
            isActive
              ? "text-foreground"
              : "text-muted-foreground group-hover/item:text-foreground",
          )}
        />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className="truncate"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </Link>
  );
}
