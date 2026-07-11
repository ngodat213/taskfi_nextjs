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
  Folder,
  CheckSquare,
  LayoutDashboard,
} from "lucide-react";
import { usePathname } from "@/i18n/routing";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import Image from "next/image";
import { Workspace } from "@/types/workspace.types";

const navItems = [
  { icon: Folder, label: "Projects", href: "/projects" },
  { icon: CheckSquare, label: "My tasks", href: "/my-tasks" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ListTree, label: "Timeline", href: "/timeline" },
  { icon: KanbanSquare, label: "Backlog", href: "/backlog" },
  { icon: KanbanSquare, label: "Active sprints", href: "/" },
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
          "w-[260px] flex-shrink-0 border-r border-slate-200/60 bg-white/70 md:bg-white/50 backdrop-blur-md flex flex-col h-full select-none group transition-transform duration-300 z-50",
          "fixed md:relative inset-y-0 left-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Project Header */}
        <Link
          href="/workspaces"
          className="p-4 pt-6 flex items-center gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer group"
        >
          {currentWorkspace?.logoUrl ? (
            <Image
              src={currentWorkspace.logoUrl.replace("hhttps", "https")}
              alt={currentWorkspace.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-xl object-cover shrink-0 shadow-sm bg-slate-100 group-hover:shadow-md transition-shadow"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow-md transition-shadow">
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
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="text-[14px] font-semibold text-slate-800 truncate tracking-tight group-hover:text-blue-600 transition-colors">
              {currentWorkspace?.name}
            </span>
            <span className="text-[12.5px] text-slate-500 truncate font-medium">
              {currentWorkspace?.description}
            </span>
          </div>

          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-slate-100/0 group-hover:bg-slate-200/50 transition-colors">
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors"
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
        </Link>

        {/* Navigation */}
        <div className="px-3 py-2 flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all",
                  isActive
                    ? "bg-blue-50/50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <item.icon
                  className={cn(
                    "w-[18px] h-[18px]",
                    isActive ? "text-blue-600" : "text-slate-400",
                  )}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {item.label}
              </Link>
            );
          })}

          <div className="my-3 border-t border-slate-200/60 mx-3" />

          <Link
            href="/workspace-settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all text-left w-full",
              pathname === "/workspace-settings"
                ? "bg-blue-50/50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
            )}
          >
            <Settings
              className={cn(
                "w-[18px] h-[18px]",
                pathname === "/workspace-settings"
                  ? "text-blue-600"
                  : "text-slate-400",
              )}
              strokeWidth={pathname === "/workspace-settings" ? 2 : 1.5}
            />
            Workspace settings
          </Link>
        </div>

        {/* Collapse Handle (Desktop Only) */}
        <div className="hidden md:block absolute right-0 top-10 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-sm transition-all">
            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </aside>
    </>
  );
}
