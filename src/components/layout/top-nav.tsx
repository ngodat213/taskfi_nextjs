"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useTheme } from "next-themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  BellIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ListIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  QuestionIcon,
  SunIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, Variants, motion } from "framer-motion";

import { NotificationsDrawer } from "@/components/layout/notifications-drawer";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { useIssue } from "@/features/projects/hooks/use-issues";
import { useProject } from "@/features/projects/hooks/use-project";
import { Issue } from "@/types/issue.types";
import { cn } from "@/utils/cn";

interface BreadcrumbNode {
  id: string;
  name: string;
  href: string;
  iconType?: string;
}

const breadcrumbContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const breadcrumbItemVariants: Variants = {
  hidden: { opacity: 0, x: -8, scale: 0.95 },
  show: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 420,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    x: -8,
    scale: 0.95,
    transition: {
      duration: 0.15,
    },
  },
};

function findIssueInCache(
  queries: [unknown, unknown][],
  issueId: string,
): Issue | null {
  for (const [, queryData] of queries) {
    const raw = (queryData as { data?: unknown })?.data;
    if (!raw) continue;
    const list: Issue[] = Array.isArray(raw)
      ? (raw as Issue[])
      : Array.isArray((raw as { data?: Issue[] })?.data)
        ? (raw as { data: Issue[] }).data
        : [raw as Issue];
    const match = list.find((i) => i && i.id === issueId);
    if (match) return match;
  }
  return null;
}

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const cleanPathname = useMemo(() => {
    return pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, "") || "/";
  }, [pathname]);

  const projectMatch = useMemo(() => {
    return cleanPathname.match(/^\/projects\/([^/]+)/);
  }, [cleanPathname]);

  const projectId = projectMatch ? projectMatch[1] : undefined;
  const { data: projectResponse } = useProject(projectId);
  const project = projectResponse?.data;

  const issueId = searchParams.get("issueId");
  const retroId = searchParams.get("retroId");
  const { data: issueResponse } = useIssue(projectId || "", issueId || "");
  const issue = issueResponse?.data;

  // Synchronous 0ms React Query Cache Lookup for Issue Data
  const cachedIssue = useMemo(() => {
    if (!projectId || !issueId) return null;
    const queries = queryClient.getQueriesData<unknown>({
      queryKey: ["issues", projectId],
    });
    return findIssueInCache(queries, issueId);
  }, [projectId, issueId, queryClient]);

  const targetIssue = issue || cachedIssue;

  // Compute Breadcrumb Stack Automatically & Synchronously from URL & Data
  const stack = useMemo(() => {
    if (cleanPathname === "/workspaces") {
      return [
        {
          id: "workspaces",
          name: "Workspaces",
          href: "/workspaces",
        },
      ];
    }

    if (cleanPathname === "/" || cleanPathname === "") {
      return [
        {
          id: "projects-root",
          name: "Projects",
          href: "/",
        },
      ];
    }

    if (projectId) {
      const projectTitle = project?.name || "Project Detail";
      const items: BreadcrumbNode[] = [
        {
          id: "projects-root",
          name: "Projects",
          href: "/",
        },
        {
          id: `project-${projectId}`,
          name: projectTitle,
          href: `/projects/${projectId}`,
        },
      ];

      if (issueId) {
        const issueKey = targetIssue?.issueKey || "Loading...";
        items.push({
          id: `issue-${issueId}`,
          name: issueKey,
          href: `/projects/${projectId}?issueId=${issueId}`,
          iconType: (targetIssue?.type || "task").toLowerCase(),
        });
      } else if (retroId) {
        items.push({
          id: `retro-${retroId}`,
          name: "Retro Detail",
          href: `/projects/${projectId}?retroId=${retroId}`,
        });
      }

      return items;
    }

    const featureNames: Record<string, string> = {
      "/my-tasks": "My Tasks",
      "/calendar": "Calendar",
      "/docs": "Documents",
      "/timeline": "Timeline",
      "/backlog": "Backlog",
      "/active-sprints": "Active Sprints",
      "/reports": "Reports",
      "/issues": "Issues",
      "/user-settings": "User Settings",
      "/workspace-settings": "Workspace Settings",
      "/retros": "Retrospectives",
    };

    const title =
      featureNames[cleanPathname] ||
      cleanPathname.replace(/^\//, "").replace(/-/g, " ");

    return [
      {
        id: `feature-${cleanPathname}`,
        name: title,
        href: cleanPathname,
      },
    ];
  }, [
    cleanPathname,
    projectId,
    project?.name,
    issueId,
    retroId,
    targetIssue?.issueKey,
    targetIssue?.type,
  ]);

  const handleBreadcrumbClick = (item: BreadcrumbNode, isLast: boolean) => {
    if (isLast) return;
    router.push(item.href);
  };

  return (
    <>
      <header className="h-14 w-full bg-transparent flex items-center justify-between px-4 shrink-0 z-30 sticky top-0">
        {/* Mobile ListIcon Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={onMenuClick}
            className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground rounded-lg transition-colors"
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Left section - Native Browser Navigation & Auto Breadcrumbs */}
        <div className="hidden md:flex items-center gap-4 text-[14px] font-medium ml-2">
          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.back()}
              className="p-1 rounded transition-colors cursor-pointer text-foreground hover:bg-secondary"
              title="Go back"
            >
              <CaretLeftIcon className="w-5 h-5" strokeWidth={2} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => router.forward()}
              className="p-1 rounded transition-colors cursor-pointer text-foreground hover:bg-secondary"
              title="Go forward"
            >
              <CaretRightIcon className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>

          <motion.div
            variants={breadcrumbContainerVariants}
            initial="hidden"
            animate="show"
            className="flex items-center gap-1"
          >
            <AnimatePresence mode="popLayout">
              {stack.map((item, index) => {
                const isLast = index === stack.length - 1;

                return (
                  <motion.div
                    key={item.id || `${item.name}-${index}`}
                    layout
                    variants={breadcrumbItemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="flex items-center gap-1"
                  >
                    <motion.div
                      whileHover={!isLast ? { scale: 1.03, y: -1 } : undefined}
                      whileTap={!isLast ? { scale: 0.96 } : undefined}
                      onClick={() => handleBreadcrumbClick(item, isLast)}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-colors text-foreground select-none",
                        !isLast && "hover:bg-secondary cursor-pointer",
                      )}
                    >
                      {item.iconType && (
                        <TypeIcon
                          type={item.iconType as Issue["type"]}
                          className="w-4 h-4 shrink-0"
                        />
                      )}
                      <span
                        className={cn(
                          isLast
                            ? "text-foreground font-bold"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.name}
                      </span>
                    </motion.div>
                    {!isLast && (
                      <CaretRightIcon className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 select-none mx-0.5" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Section Header Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Search Input */}
          <div className="relative hidden lg:flex items-center">
            <MagnifyingGlassIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, issues..."
              className="w-48 xl:w-56 h-8.5 pl-8.5 pr-3 text-[12px] bg-secondary/60 hover:bg-secondary border border-border/50 focus:border-primary/50 focus:bg-card focus:outline-none rounded-xl transition-all placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => setIsNotificationsOpen(true)}
            className="relative w-8.5 h-8.5 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-colors cursor-pointer"
            title="Notifications"
          >
            <BellIcon className="w-4.5 h-4.5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
          </button>

          {/* Help Button */}
          <button
            className="w-8.5 h-8.5 hidden sm:flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-colors cursor-pointer"
            title="Help & Support"
          >
            <QuestionIcon className="w-4.5 h-4.5" />
          </button>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-8.5 h-8.5 flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground rounded-xl transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <SunIcon className="w-4.5 h-4.5" />
              ) : (
                <MoonIcon className="w-4.5 h-4.5" />
              )}
            </button>
          )}
        </div>
      </header>

      {/* Notifications Drawer Component */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
