"use client";

import { BellIcon, QuestionIcon, MagnifyingGlassIcon, ListIcon, CaretLeftIcon, CaretRightIcon, SunIcon, MoonIcon } from "@phosphor-icons/react/dist/ssr";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import React, { useEffect, useState, useMemo } from "react";
import { useProject } from "@/features/projects/hooks/use-project";
import { useIssue } from "@/features/projects/hooks/use-issues";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { Issue } from "@/types/issue.types";
import { useNavigationStore } from "@/store/navigation.store";
import { NotificationsDrawer } from "@/components/layout/notifications-drawer";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split("/").filter(Boolean);

  const stack = useNavigationStore((state) => state.stack);
  const popNav = useNavigationStore((state) => state.pop);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const activeSubNav = useMemo(() => {
    return stack.find(
      (item) => item.backLink === "/docs" || item.backLink === pathname,
    );
  }, [stack, pathname]);

  const breadcrumbSegments = segments.filter(
    (seg, index) => !(index === 0 && /^[a-z]{2}(-[A-Z]{2})?$/.test(seg)),
  );

  const projectIndex = breadcrumbSegments.findIndex(
    (seg) => seg === "projects",
  );
  const projectId =
    projectIndex !== -1 && projectIndex + 1 < breadcrumbSegments.length
      ? breadcrumbSegments[projectIndex + 1]
      : undefined;

  const { data: projectResponse, isLoading: isLoadingProject } =
    useProject(projectId);
  const project = projectResponse?.data;

  const issueId = searchParams.get("issueId");
  const { data: issueResponse } = useIssue(projectId || "", issueId || "");
  const issue = issueResponse?.data;

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

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

        {/* Left section - Breadcrumbs (Desktop) */}
        <div className="hidden md:flex items-center gap-4 text-[14px] font-medium ml-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (activeSubNav) {
                  popNav();
                } else if (issueId) {
                  const params = new URLSearchParams(searchParams.toString());
                  params.delete("issueId");
                  router.replace(`${pathname}?${params.toString()}`);
                } else {
                  router.back();
                }
              }}
              className="p-1 rounded hover:bg-secondary text-foreground transition-colors cursor-pointer"
              title="Go back"
            >
              <CaretLeftIcon className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={() => router.forward()}
              className="p-1 rounded hover:bg-secondary text-foreground transition-colors cursor-pointer"
              title="Go forward"
            >
              <CaretRightIcon className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          <div className="flex items-center gap-1">
            {breadcrumbSegments.length === 0 ? (
              <div className="flex items-center gap-2 px-2 py-1.5 text-foreground">
                <span>Home</span>
              </div>
            ) : (
              <>
                {breadcrumbSegments.map((seg, index) => {
                  const isLast =
                    index === breadcrumbSegments.length - 1 &&
                    !issueId &&
                    !activeSubNav;
                  const isProjectIdSeg = index === projectIndex + 1;

                  let title =
                    seg.charAt(0).toUpperCase() +
                    seg.slice(1).replace(/-/g, " ");

                  if (isProjectIdSeg) {
                    if (isLoadingProject) {
                      title = "";
                    } else if (project?.name) {
                      title = project.name;
                    }
                  }

                  const targetPath =
                    "/" +
                    segments.slice(0, segments.indexOf(seg) + 1).join("/");

                  return (
                    <React.Fragment key={seg}>
                      <div
                        onClick={() => {
                          if (activeSubNav) {
                            popNav();
                          }
                          if (issueId && isProjectIdSeg) {
                            const params = new URLSearchParams(
                              searchParams.toString(),
                            );
                            params.delete("issueId");
                            router.push(`${targetPath}?${params.toString()}`);
                          } else {
                            router.push(targetPath);
                          }
                        }}
                        className="flex items-center gap-2 hover:bg-secondary px-2 py-1.5 rounded-md transition-colors cursor-pointer text-foreground"
                      >
                        <span
                          className={cn(
                            !isProjectIdSeg && "capitalize",
                            isLast
                              ? "text-foreground font-bold"
                              : "text-muted-foreground",
                          )}
                        >
                          {title}
                        </span>
                      </div>
                      {(!isLast || issueId || activeSubNav) && (
                        <span className="text-muted-foreground font-light px-1">
                          /
                        </span>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Append Active Sub Navigation item (e.g., Folder Name) */}
                {activeSubNav && (
                  <div className="flex items-center gap-2 hover:bg-secondary px-2 py-1.5 rounded-md transition-colors text-foreground font-bold">
                    <span>{activeSubNav.name}</span>
                  </div>
                )}

                {/* Append Issue Key if present */}
                {issueId && issue && (
                  <div className="flex items-center gap-2 hover:bg-secondary px-2 py-1.5 rounded-md transition-colors cursor-pointer text-foreground">
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <TypeIcon
                        type={
                          (issue.type || "task").toLowerCase() as Issue["type"]
                        }
                        className="w-4 h-4"
                      />
                      <span>{issue.issueKey || issue.id}</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
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
