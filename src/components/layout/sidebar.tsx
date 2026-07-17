"use client";

import { Link } from "@/i18n/routing";
import { cn } from "@/utils/cn";
import {
  ListTree,
  KanbanSquare,
  FileText,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Folder,
  CheckSquare,
} from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Workspace } from "@/types/workspace.types";

const navItems = [
  { icon: Folder, label: "Projects", href: "/" },
  { icon: CheckSquare, label: "My tasks", href: "/my-tasks" },
  { icon: ListTree, label: "Timeline", href: "/timeline" },
  { icon: KanbanSquare, label: "Backlog", href: "/backlog" },
  { icon: KanbanSquare, label: "Active sprints", href: "/active-sprints" },
  { icon: LineChart, label: "Reports", href: "/reports" },
  { icon: FileText, label: "Issues", href: "/issues" },
];

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.activeWorkspaceId,
  );
  const { data: response } = useWorkspaces();
  const workspaces = Array.isArray(response?.data)
    ? response.data
    : response?.data?.data || [];

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };

    // Check initially
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentWorkspace = workspaces.find(
    (w: Workspace) => w.id === currentWorkspaceId,
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "shrink-0 border border-border/80 rounded-2xl bg-card/70 md:bg-card/50 backdrop-blur-md flex flex-col h-[calc(100dvh-24px)] my-3 ml-3 select-none group transition-all duration-300 z-50 overflow-hidden",
          "fixed md:relative top-0 left-0",
          isCollapsed ? "w-[72px]" : "w-[220px]",
          isOpen
            ? "translate-x-0"
            : "-translate-x-[calc(100%+12px)] md:translate-x-0",
        )}
      >
        {/* Project Header */}
        <Link
          href="/workspaces"
          className={cn(
            "p-4 pt-6 flex items-center hover:bg-muted/80 transition-colors cursor-pointer group",
            isCollapsed ? "justify-center" : "gap-3",
          )}
        >
          {currentWorkspace?.logoUrl ? (
            <Image
              src={currentWorkspace.logoUrl.replace("hhttps", "https")}
              alt={currentWorkspace.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm bg-secondary group-hover:shadow-md transition-shadow"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 mt-0.5 shadow-sm group-hover:shadow-md transition-shadow">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
          )}
          {!isCollapsed && (
            <>
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="text-[14px] font-semibold text-foreground truncate tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {currentWorkspace?.name}
                </span>
                <span className="text-[12.5px] text-muted-foreground truncate font-medium">
                  {currentWorkspace?.description}
                </span>
              </div>

              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-secondary/0 group-hover:bg-slate-200/50 transition-colors">
                <svg
                  className="w-4 h-4 text-muted-foreground group-hover:text-slate-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
              </div>
            </>
          )}
        </Link>

        {/* Navigation */}
        <div className="px-3 py-2 flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-lg text-[13.5px] font-medium transition-all",
                  isCollapsed
                    ? "justify-center py-2.5 px-0"
                    : "gap-3 px-3 py-2",
                  isActive
                    ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none ring-1 ring-blue-200/50 dark:ring-blue-500/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0",
                    isActive ? "text-blue-600" : "text-muted-foreground",
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          <div className="my-3 border-t border-border/60 mx-3" />

          <Link
            href="/workspace-settings"
            title={isCollapsed ? "Workspace settings" : undefined}
            className={cn(
              "flex items-center rounded-lg text-[13.5px] font-medium transition-all text-left w-full",
              isCollapsed ? "justify-center py-2.5 px-0" : "gap-3 px-3 py-2",
              pathname === "/workspace-settings"
                ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-none ring-1 ring-blue-200/50 dark:ring-blue-500/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Settings
              className={cn(
                "w-[18px] h-[18px] shrink-0",
                pathname === "/workspace-settings"
                  ? "text-blue-600"
                  : "text-muted-foreground",
              )}
              strokeWidth={pathname === "/workspace-settings" ? 2 : 1.5}
            />
            {!isCollapsed && <span>Workspace settings</span>}
          </Link>
        </div>

        {/* Collapse Handle (Desktop Only) */}
        <div className="hidden md:block absolute right-0 top-10 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition-all"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
