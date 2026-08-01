"use client";

import { useEffect, useMemo, useState } from "react";

import {
  BookOpenIcon,
  CalendarBlankIcon,
  CaretDownIcon,
  CaretUpIcon,
  ChartLineUpIcon,
  ChartPieIcon,
  CheckSquareIcon,
  FileTextIcon,
  FolderIcon,
  GearIcon,
  KanbanIcon,
  PaintBrushIcon,
  PenNibIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";

import { Link, usePathname } from "@/i18n/routing";
import { useNavigationStore } from "@/store/navigation.store";
import { useUserStore } from "@/store/user.store";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/string";

import { SidebarActionBar } from "./sidebar-action-bar";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarUserFooter } from "./sidebar-user-footer";
import { SidebarWorkspaceHeader } from "./sidebar-workspace-header";

const navItems = [
  { icon: FolderIcon, label: "Projects", href: "/" },
  { icon: CheckSquareIcon, label: "My tasks", href: "/my-tasks" },
  { icon: CalendarBlankIcon, label: "Calendar", href: "/calendar" },
  { icon: BookOpenIcon, label: "Documents", href: "/docs" },
  { icon: TreeStructureIcon, label: "Timeline", href: "/timeline" },
  { icon: KanbanIcon, label: "Backlog", href: "/backlog" },
  { icon: KanbanIcon, label: "Active sprints", href: "/active-sprints" },
  { icon: ChartLineUpIcon, label: "Reports", href: "/reports" },
  { icon: FileTextIcon, label: "Issues", href: "/issues" },
];

const recentItems = [
  {
    label: "Q1 Recap",
    icon: ChartPieIcon,
    color: "text-amber-500",
    href: "/calendar",
  },
  {
    label: "Design Team Projects",
    icon: PaintBrushIcon,
    color: "text-emerald-500",
    href: "/active-sprints",
  },
  {
    label: "UX Copy Writing",
    icon: PenNibIcon,
    color: "text-purple-500",
    href: "/issues",
  },
];

export function Sidebar({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const stack = useNavigationStore((state) => state.stack);
  const user = useUserStore((state) => state.user);

  const currentNav = useMemo(
    () => stack.find((item) => item.backLink === "/workspaces") || stack[0],
    [stack],
  );

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(true);
  const [isTeamsOpen, setIsTeamsOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Wrapper */}
      <div className="relative shrink-0 group/sidebar-wrapper my-3 ml-3">
        {/* Sidebar Content */}
        <motion.aside
          animate={{
            width: isCollapsed ? 72 : 230,
          }}
          transition={{
            type: "spring",
            stiffness: 380,
            damping: 30,
          }}
          className={cn(
            "border border-border/80 rounded-2xl bg-card shadow-2xs flex flex-col h-[calc(100dvh-24px)] select-none z-40 overflow-hidden relative",
            "fixed md:relative top-0 left-0",
            isOpen
              ? "translate-x-0"
              : "-translate-x-[calc(100%+12px)] md:translate-x-0",
          )}
        >
          {/* Top Header Row Sub-component */}
          <SidebarWorkspaceHeader
            currentNav={currentNav}
            userName={user?.name}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
            getInitials={getInitials}
          />

          {/* Action Control Row Sub-component */}
          <SidebarActionBar
            isCollapsed={isCollapsed}
            onNewClick={() => {}}
            onSearchClick={() => {}}
          />

          {/* Navigation Scrollable Body */}
          <div className="px-2 py-2 flex-1 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
            {/* Main Navigation Items */}
            {navItems.map((item) => (
              <SidebarNavItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}

            {/* Workspace Settings Item */}
            <SidebarNavItem
              icon={GearIcon}
              label="Workspace settings"
              href="/workspace-settings"
              isActive={pathname === "/workspace-settings"}
              isCollapsed={isCollapsed}
            />

            {/* Accordion Group: Recent */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex flex-col gap-0.5"
                >
                  <button
                    onClick={() => setIsRecentOpen(!isRecentOpen)}
                    className="px-3 py-1 text-[11.5px] font-semibold text-muted-foreground/80 hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                  >
                    {isRecentOpen ? (
                      <CaretUpIcon className="w-3 h-3" />
                    ) : (
                      <CaretDownIcon className="w-3 h-3" />
                    )}
                    <span>Recent</span>
                  </button>

                  {isRecentOpen &&
                    recentItems.map((rec) => {
                      const isActive = pathname === rec.href;
                      return (
                        <Link
                          key={rec.label}
                          href={rec.href}
                          className={cn(
                            "relative flex items-center gap-3 px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all select-none group/recent cursor-pointer",
                            isActive
                              ? "text-foreground font-bold bg-secondary shadow-2xs"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                          )}
                        >
                          <rec.icon
                            className={cn("w-4 h-4 shrink-0", rec.color)}
                          />
                          <span className="truncate">{rec.label}</span>
                        </Link>
                      );
                    })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Accordion Group: Teams */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-2 flex flex-col gap-0.5"
                >
                  <button
                    onClick={() => setIsTeamsOpen(!isTeamsOpen)}
                    className="px-3 py-1 text-[11.5px] font-semibold text-muted-foreground/80 hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer select-none"
                  >
                    {isTeamsOpen ? (
                      <CaretUpIcon className="w-3 h-3" />
                    ) : (
                      <CaretDownIcon className="w-3 h-3" />
                    )}
                    <span>Teams</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Card Footer Sub-component */}
          <SidebarUserFooter
            user={user}
            isCollapsed={isCollapsed}
            getInitials={getInitials}
          />
        </motion.aside>
      </div>
    </>
  );
}
