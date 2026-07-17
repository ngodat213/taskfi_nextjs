"use client";

import {
  Bell,
  HelpCircle,
  Settings,
  Search,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { useProject } from "@/features/projects/hooks/use-project";
import { useIssue } from "@/features/projects/hooks/use-issues";
import { TypeIcon } from "@/features/dashboard/components/issue-table-row";
import { Issue } from "@/types/issue.types";

export function TopNav({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split("/").filter(Boolean);

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
    <header className="h-[56px] w-full bg-transparent flex items-center justify-between px-4 shrink-0 z-30 sticky top-0">
      {/* Mobile Menu Button */}
      <div className="flex items-center md:hidden">
        <button
          onClick={onMenuClick}
          className="w-9 h-9 flex items-center justify-center text-muted-foreground hover:bg-secondary/80 hover:text-foreground rounded-lg transition-colors"
        >
          <Menu className="w-[20px] h-[20px]" />
        </button>
      </div>

      {/* Left section - Breadcrumbs (Desktop) */}
      <div className="hidden md:flex items-center gap-4 text-[14px] font-medium ml-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (issueId) {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("issueId");
                router.replace(`${pathname}?${params.toString()}`);
              } else {
                router.back();
              }
            }}
            className="p-1 rounded hover:bg-secondary text-foreground transition-colors"
          >
            <ChevronLeft className="w-[20px] h-[20px]" strokeWidth={2} />
          </button>
          <button
            onClick={() => router.forward()}
            className="p-1 rounded hover:bg-secondary text-foreground transition-colors"
          >
            <ChevronRight className="w-[20px] h-[20px]" strokeWidth={2} />
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
                // If we are showing an issue, the project segment shouldn't be styled as "last"
                const isLast =
                  index === breadcrumbSegments.length - 1 && !issueId;
                const isProjectIdSeg = index === projectIndex + 1;

                let title =
                  seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");

                if (isProjectIdSeg) {
                  if (isLoadingProject) {
                    title = "";
                  } else if (project?.name) {
                    title = project.name;
                  }
                }

                const targetPath =
                  "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/");

                return (
                  <React.Fragment key={seg}>
                    <div
                      onClick={() => {
                        // If we click project breadcrumb, clear issueId
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
                          isLast ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {title}
                      </span>
                    </div>
                    {(!isLast || issueId) && (
                      <span className="text-muted-foreground font-light px-1">
                        /
                      </span>
                    )}
                  </React.Fragment>
                );
              })}

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

      {/* Right section */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="relative group hidden lg:block mr-2">
          <Search className="w-4 h-4 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-[200px] h-8 pl-8 pr-3 bg-secondary/50 border border-transparent rounded-lg text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:border-border focus:ring-2 focus:ring-secondary transition-all hover:bg-secondary"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary/80 rounded-lg transition-colors relative"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Moon className="w-[18px] h-[18px]" />
              ) : (
                <Sun className="w-[18px] h-[18px]" />
              )
            ) : (
              <div className="w-[18px] h-[18px]" />
            )}
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary/80 rounded-lg transition-colors">
            <Bell className="w-[18px] h-[18px]" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary/80 rounded-lg transition-colors">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>
          <Link href="/user-settings">
            <button className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:bg-secondary/80 rounded-lg transition-colors">
              <Settings className="w-[18px] h-[18px]" />
            </button>
          </Link>
        </div>

        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-orange-400 to-red-500 flex items-center justify-center text-white text-[12px] font-bold ml-2 cursor-pointer hover:opacity-90 transition-opacity">
          TN
        </div>
      </div>
    </header>
  );
}
